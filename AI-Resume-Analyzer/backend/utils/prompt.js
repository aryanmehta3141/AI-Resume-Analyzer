/**
 * STEP 4 — AI prompt template
 *
 * We tell Gemini exactly what JSON shape to return so we can
 * parse it and send clean data to the frontend.
 */

function buildResumeAnalysisPrompt(resumeText) {
  return `You are an expert resume coach and ATS (Applicant Tracking System) specialist.

Analyze the following resume text and respond with ONLY valid JSON (no markdown, no code fences).

Required JSON shape:
{
  "atsScore": <number 0-100>,
  "formattingSuggestions": [<string>, ...],
  "keywordImprovements": [<string>, ...],
  "missingSkills": [<string>, ...],
  "feedback": "<string: 2-4 sentences of overall summary>"
}

Rules:
- atsScore: realistic score based on ATS compatibility, clarity, and structure
- formattingSuggestions: 3-5 actionable bullet-style tips about layout/sections/fonts
- keywordImprovements: 3-5 suggestions to add role-relevant keywords
- missingSkills: 3-6 skills commonly expected but not evident in the resume
- feedback: encouraging but honest overall assessment

Resume text:
---
${resumeText.slice(0, 12000)}
---`;
}

module.exports = { buildResumeAnalysisPrompt };
