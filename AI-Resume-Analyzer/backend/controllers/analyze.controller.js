/**
 * STEP 4 — Analyze controller
 *
 * By the time this runs, Multer has already:
 *   - Parsed the multipart body
 *   - Validated MIME type + magic bytes
 *   - Put the file buffer on req.file.buffer
 *
 * This controller's job:
 *   1. Extract text from the PDF buffer
 *   2. Send text to Gemini for analysis
 *   3. Return a flat, predictable JSON response to the frontend
 *
 * Error handling:
 *   We call next(error) for all errors so the centralized error handler
 *   in error.middleware.js formats the response consistently.
 *   We attach an HTTP status to errors so the handler knows what code to send.
 */

const { extractTextFromPdf } = require("../services/pdf.service");
const { analyzeResumeText } = require("../services/ai.service");

async function analyzeResume(req, res, next) {
  try {
    // Step 1: Extract text from the PDF buffer
    const resumeText = await extractTextFromPdf(req.file.buffer);

    // Step 2: Analyze with Gemini
    const analysis = await analyzeResumeText(resumeText);

    // Step 3: Return a flat, predictable shape
    // The frontend's mapAnalysis() utility expects exactly these field names.
    res.status(200).json({
      success: true,
      message: "Resume analyzed successfully",
      data: {
        fileName: req.file.originalname,
        atsScore: analysis.atsScore,
        formattingSuggestions: analysis.formattingSuggestions,
        keywordImprovements: analysis.keywordImprovements,
        missingSkills: analysis.missingSkills,
        feedback: analysis.feedback,
      },
    });
  } catch (error) {
    // If the error doesn't already have a status, assign one based on context
    if (!error.status) {
      if (
        error.message?.includes("GEMINI_API_KEY") ||
        error.message?.includes("API key")
      ) {
        error.status = 503; // Service Unavailable — config problem
      } else if (
        error.message?.includes("extract") ||
        error.message?.includes("PDF") ||
        error.message?.includes("text")
      ) {
        error.status = 400; // Bad Request — user's file is the problem
      } else {
        error.status = 500;
      }
    }
    next(error); // Hand off to error.middleware.js
  }
}

module.exports = { analyzeResume };
