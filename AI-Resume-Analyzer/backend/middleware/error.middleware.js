/**
 * STEP 5 — Global error handler
 *
 * Any route/controller can call next(error) and this middleware
 * sends a consistent, frontend-safe JSON error response.
 *
 * Why 4 parameters?
 *   Express identifies error-handling middleware by its arity (argument count).
 *   It MUST have exactly (err, req, res, next) — even if you don't use `next`.
 *
 * Production vs development:
 *   In production we never expose raw error messages for 500s — they can leak
 *   internal paths, library names, or logic details to attackers.
 *   In development we show the real message so you can debug quickly.
 */

const IS_PROD = process.env.NODE_ENV === "production";

function errorHandler(err, req, res, _next) {
  const status = err.status || err.statusCode || 500;

  // Always log the real error server-side for debugging
  // Use console.error only — never send stack traces to the client
  if (status >= 500) {
    console.error(`[ERROR] ${req.method} ${req.path} → ${status}`);
    console.error(err.message);
    // Only log stack in development — stacks are noisy in production logs
    if (!IS_PROD && err.stack) {
      console.error(err.stack);
    }
  }

  // What the client receives:
  //   4xx → the real message (it's the user's fault, they need to know why)
  //   5xx → generic message in production (hide internals), real message in dev
  const clientMessage =
    status >= 500 && IS_PROD
      ? "Something went wrong on our end. Please try again in a moment."
      : err.message || "An unexpected error occurred.";

  res.status(status).json({
    success: false,
    message: clientMessage,
  });
}

module.exports = errorHandler;
