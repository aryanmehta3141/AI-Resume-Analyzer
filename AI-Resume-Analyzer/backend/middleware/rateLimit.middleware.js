/**
 * Rate limiting middleware
 *
 * What is rate limiting?
 *   It caps how many requests a single IP address can make in a time window.
 *   Without it, one person (or a bot) could hammer your Gemini API key with
 *   thousands of requests, burning your quota in minutes.
 *
 * How express-rate-limit works internally:
 *   - It keeps an in-memory counter per IP address.
 *   - Each request increments the counter.
 *   - When the counter exceeds `max`, it returns 429 Too Many Requests.
 *   - After `windowMs` milliseconds, the counter resets to 0.
 *
 * Two limiters here:
 *   1. globalLimiter  — loose limit on ALL routes (protects the server itself)
 *   2. analyzeLimiter — tight limit on POST /api/analyze (protects Gemini quota)
 *
 * For a hackathon/demo these numbers are generous enough for real users
 * but tight enough to stop obvious abuse.
 */

const rateLimit = require("express-rate-limit");

/**
 * Global limiter — applied to every route in server.js
 * 200 requests per 15 minutes per IP is very generous for a demo.
 */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,  // Sends RateLimit-* headers so clients know their limit
  legacyHeaders: false,   // Disable the old X-RateLimit-* headers
  message: {
    success: false,
    message: "Too many requests. Please wait a few minutes and try again.",
  },
});

/**
 * Analyze limiter — applied only to POST /api/analyze
 * 10 resume analyses per 15 minutes per IP.
 * Each analysis calls Gemini, so this directly protects your API quota.
 */
const analyzeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "You've analyzed too many resumes in a short time. Please wait 15 minutes and try again.",
  },
});

module.exports = { globalLimiter, analyzeLimiter };
