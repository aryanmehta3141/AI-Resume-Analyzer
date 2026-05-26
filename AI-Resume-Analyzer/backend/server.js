/**
 * STEP 1 — Server entry point
 *
 * Request lifecycle:
 *   Client → globalLimiter → CORS → express.json()
 *          → route handler → uploadResume → analyzeLimiter → analyzeResume
 *          → errorHandler
 */

// Load .env FIRST — so process.env.* is available for everything below
require("dotenv").config();

// Validate required env vars before starting — exits with a clear message if missing
const { validateEnv } = require("./config/env");
validateEnv();

const express = require("express");
const cors = require("cors");
const { globalLimiter } = require("./middleware/rateLimit.middleware");
const healthRoutes = require("./routes/health.routes");
const analyzeRoutes = require("./routes/analyze.routes");
const errorHandler = require("./middleware/error.middleware");

const app = express();
const PORT = process.env.PORT || 5000;
const IS_PROD = process.env.NODE_ENV === "production";

// ─── CORS ────────────────────────────────────────────────────────────────────
// Build the list of allowed origins from environment variables.
// In development: localhost:5173 is always allowed.
// In production:  set FRONTEND_URL to your deployed Vercel URL.
//
// Why not use "*" (allow all)?
//   Wildcard CORS means ANY website can call your API — including malicious ones.
//   Restricting to known origins is a simple, effective security layer.

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173", // vite preview
];

if (process.env.FRONTEND_URL) {
  // Support comma-separated list: FRONTEND_URL=https://myapp.vercel.app,https://staging.vercel.app
  process.env.FRONTEND_URL.split(",")
    .map((u) => u.trim())
    .filter(Boolean)
    .forEach((u) => allowedOrigins.push(u));
}

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no origin (curl, Postman, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin '${origin}' is not allowed`));
    },
    methods: ["GET", "POST"],
  }),
);

// ─── Global rate limiter ─────────────────────────────────────────────────────
// Applied to ALL routes. Protects the server from general flooding.
app.use(globalLimiter);

// ─── Body parser ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "1mb" }));

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use("/api", healthRoutes); // GET  /api/health
app.use("/api", analyzeRoutes); // POST /api/analyze

// Root route — useful when you open the backend URL in a browser
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "ResumeAI backend — use GET /api/health to verify",
  });
});

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ─── Global error handler (must be last) ─────────────────────────────────────
app.use(errorHandler);

// ─── Start ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✓ Server running at http://localhost:${PORT}`);
  console.log(`✓ Health check:  GET  http://localhost:${PORT}/api/health`);
  console.log(`✓ Analyze API:   POST http://localhost:${PORT}/api/analyze`);
  console.log(`✓ Environment:   ${IS_PROD ? "production" : "development"}`);
  console.log(`✓ Allowed origins: ${allowedOrigins.join(", ")}`);
});
