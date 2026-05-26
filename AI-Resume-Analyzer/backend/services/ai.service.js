/**
 * Gemini AI integration
 *
 * Responsibilities:
 *   1. Build the prompt
 *   2. Call Gemini with a model fallback chain
 *   3. Parse and normalize the JSON response
 *   4. Validate the result before returning it
 *
 * Timeout:
 *   Gemini can occasionally hang. We wrap each call in a Promise.race()
 *   against a timeout so the request never hangs indefinitely.
 *   30 seconds is generous for a resume analysis.
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");
const { buildResumeAnalysisPrompt } = require("../utils/prompt");

const AI_TIMEOUT_MS = 30_000; // 30 seconds

// Model fallback chain — tries each model in order until one succeeds.
// gemini-2.5-flash is the primary; the others are fallbacks for quota/404 errors.
const MODELS = [
  ...new Set([
    process.env.GEMINI_MODEL || "gemini-2.5-flash",
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
  ]),
];

// ─── Mock response (demo / quota-exceeded fallback) ──────────────────────────

function getMockAnalysis() {
  return {
    atsScore: 72,
    formattingSuggestions: [
      "Use consistent section headings (Experience, Education, Skills).",
      "Keep margins uniform and avoid dense blocks of text.",
      "Use bullet points for achievements instead of long paragraphs.",
    ],
    keywordImprovements: [
      "Add role-specific keywords from the job description.",
      "Include measurable outcomes (%, $, time saved).",
      "Mirror industry terms recruiters search for in your field.",
    ],
    missingSkills: [
      "Cloud platforms (AWS/GCP)",
      "CI/CD tooling",
      "Cross-functional collaboration",
    ],
    feedback:
      "Solid foundation. Strengthen impact with metrics and tailor keywords to each job posting for better ATS performance.",
  };
}

// ─── Gemini client ────────────────────────────────────────────────────────────

function getClient() {
  // API key is validated at startup by config/env.js, but we guard here too
  // in case someone calls this function in isolation (e.g. tests).
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey?.trim()) {
    const err = new Error(
      "GEMINI_API_KEY is not set. Add it to backend/.env (see .env.example).",
    );
    err.status = 503;
    throw err;
  }
  return new GoogleGenerativeAI(apiKey);
}

// ─── JSON parsing helpers ─────────────────────────────────────────────────────

/** Strip markdown code fences if Gemini wraps the JSON in ```json ... ``` */
function parseJsonFromAI(text) {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const jsonStr = fenced ? fenced[1].trim() : trimmed;
  return JSON.parse(jsonStr);
}

/** Unwrap nested objects Gemini sometimes returns */
function pickRawPayload(parsed) {
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return {};
  }
  return (
    parsed.analysis ||
    parsed.data ||
    parsed.result ||
    parsed.resumeAnalysis ||
    parsed.resume_analysis ||
    parsed
  );
}

function toStringArray(value) {
  if (Array.isArray(value)) {
    return value.map((item) =>
      typeof item === "string" ? item : JSON.stringify(item),
    );
  }
  if (typeof value === "string" && value.trim()) {
    return [value];
  }
  return [];
}

/**
 * normalizeAnalysis — maps any Gemini response shape to our standard shape.
 * Handles camelCase, snake_case, and common aliases.
 */
function normalizeAnalysis(raw) {
  const r = pickRawPayload(raw);

  const atsScore = Math.min(
    100,
    Math.max(
      0,
      Number(
        r.atsScore ?? r.ats_score ?? r.ATSScore ?? r.score ?? r.ats ?? 0,
      ) || 0,
    ),
  );

  const formattingSuggestions = toStringArray(
    r.formattingSuggestions ??
      r.formatting_suggestions ??
      r.formatting ??
      r.formatSuggestions,
  );

  const keywordImprovements = toStringArray(
    r.keywordImprovements ??
      r.keyword_improvements ??
      r.keywords ??
      r.keywordSuggestions,
  );

  const missingSkills = toStringArray(
    r.missingSkills ?? r.missing_skills ?? r.skills ?? r.skillGaps,
  );

  const feedback = String(
    r.feedback ??
      r.summary ??
      r.overallFeedback ??
      r.overall_feedback ??
      r.assessment ??
      "",
  ).trim();

  return {
    atsScore,
    formattingSuggestions,
    keywordImprovements,
    missingSkills,
    feedback:
      feedback ||
      "Your resume was analyzed. Review the suggestions below to improve it further.",
  };
}

function isValidAnalysis(analysis) {
  const hasScore =
    typeof analysis.atsScore === "number" && analysis.atsScore > 0;
  const hasContent =
    analysis.feedback.length > 20 ||
    analysis.formattingSuggestions.length > 0 ||
    analysis.keywordImprovements.length > 0 ||
    analysis.missingSkills.length > 0;
  return hasScore || hasContent;
}

// ─── Timeout wrapper ──────────────────────────────────────────────────────────

/**
 * Wraps a promise with a timeout.
 * If the promise doesn't resolve within `ms` milliseconds, it rejects
 * with a clear timeout error.
 */
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) => {
    const timer = setTimeout(() => {
      reject(
        Object.assign(
          new Error(
            `AI request timed out after ${ms / 1000}s. Please try again.`,
          ),
          { status: 504 },
        ),
      );
    }, ms);
    // If the original promise settles first, clear the timer to avoid leaks
    promise.finally(() => clearTimeout(timer));
  });
  return Promise.race([promise, timeout]);
}

// ─── Model fallback chain ─────────────────────────────────────────────────────

async function generateWithFallback(prompt) {
  const client = getClient();
  let lastError;

  for (const modelName of MODELS) {
    try {
      const model = client.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.4,
        },
      });

      // Wrap the Gemini call in a timeout
      const text = await withTimeout(
        model.generateContent(prompt).then((r) => r.response.text()),
        AI_TIMEOUT_MS,
      );

      return text;
    } catch (err) {
      lastError = err;

      // Only retry on quota (429) or model-not-found (404) errors
      const isRetryable =
        err.message?.includes("429") ||
        err.message?.includes("404") ||
        err.message?.includes("not found");

      if (!isRetryable) break; // Hard failure — don't try other models
    }
  }

  // All models failed — check if demo/mock mode is enabled
  if (process.env.MOCK_AI === "true") {
    console.warn(
      "[AI] All models unavailable — returning MOCK_AI demo response.",
      lastError?.message?.slice(0, 120),
    );
    return null; // Signal to caller to use getMockAnalysis()
  }

  // Surface a user-friendly error based on what went wrong
  if (lastError?.message?.includes("429")) {
    const err = new Error(
      "Gemini API quota exceeded. Please wait a minute and try again, or enable MOCK_AI=true in .env for demo mode.",
    );
    err.status = 429;
    throw err;
  }

  if (lastError?.status === 504) throw lastError; // Re-throw timeout as-is

  const err = new Error("AI analysis failed. Please try again in a moment.");
  err.status = 502;
  throw err;
}

// ─── Public API ───────────────────────────────────────────────────────────────

async function analyzeResumeText(resumeText) {
  const prompt = buildResumeAnalysisPrompt(resumeText);
  const text = await generateWithFallback(prompt);

  // null means MOCK_AI fallback was used
  if (text === null) {
    return getMockAnalysis();
  }

  let parsed;
  try {
    parsed = parseJsonFromAI(text);
  } catch {
    const err = new Error(
      "AI returned an unreadable response. Please try again.",
    );
    err.status = 502;
    throw err;
  }

  const analysis = normalizeAnalysis(parsed);

  if (!isValidAnalysis(analysis)) {
    const err = new Error(
      "AI response was empty or incomplete. Please try again in a moment.",
    );
    err.status = 502;
    throw err;
  }

  return analysis;
}

module.exports = { analyzeResumeText, normalizeAnalysis };
