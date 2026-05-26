/**
 * Environment variable validation
 *
 * Called once at startup (in server.js) BEFORE anything else runs.
 * If a required variable is missing, the process exits immediately with
 * a clear message — much better than a cryptic crash later at request time.
 *
 * Why validate at startup?
 *   A missing GEMINI_API_KEY would only surface when the first user uploads
 *   a resume. Catching it at boot means you know instantly when you deploy.
 */

const REQUIRED_VARS = ["GEMINI_API_KEY"];

function validateEnv() {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]?.trim());

  if (missing.length > 0) {
    console.error("─────────────────────────────────────────────");
    console.error("  STARTUP ERROR: Missing environment variables");
    console.error("─────────────────────────────────────────────");
    missing.forEach((key) => {
      console.error(`  ✗ ${key} is not set`);
    });
    console.error("");
    console.error("  Fix: copy backend/.env.example → backend/.env");
    console.error("  then fill in the missing values.");
    console.error("─────────────────────────────────────────────");
    process.exit(1); // Non-zero exit = deployment platforms mark it as failed
  }
}

module.exports = { validateEnv };
