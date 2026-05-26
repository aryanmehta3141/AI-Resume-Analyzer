/**
 * Analyze routes
 *
 * POST /api/analyze
 *   Middleware chain for this route:
 *     1. analyzeLimiter → rate-limit: max 10 analyses per IP per 15 min
 *     2. uploadResume   → parse multipart, validate PDF (MIME + magic bytes)
 *     3. analyzeResume  → extract text → call Gemini → return structured JSON
 */

const express = require("express");
const router = express.Router();
const { analyzeLimiter } = require("../middleware/rateLimit.middleware");
const { uploadResume } = require("../middleware/upload.middleware");
const { analyzeResume } = require("../controllers/analyze.controller");

// analyzeLimiter is placed BEFORE uploadResume so rate-limited requests
// are rejected before Multer even starts parsing the file body.
router.post("/analyze", analyzeLimiter, uploadResume, analyzeResume);

module.exports = router;
