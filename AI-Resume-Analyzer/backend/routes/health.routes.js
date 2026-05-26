/**
 * Health routes — prove the server is alive.
 *
 * Router vs app:
 *   - express() creates the main app
 *   - express.Router() creates a mini-app you mount with app.use('/api', router)
 *
 * This file only defines URLs; it doesn't start the server.
 */

const express = require("express");
const router = express.Router();

/**
 * GET /api/health
 *
 * req  = everything the client sent (headers, query, body…)
 * res  = what you send back (status code + JSON/text)
 */
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running",
    version: "full-pipeline-v1",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
