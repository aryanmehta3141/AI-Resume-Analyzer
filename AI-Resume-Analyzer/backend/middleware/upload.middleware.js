/**
 * STEP 2 — File upload middleware (Multer)
 *
 * When the frontend sends FormData with a PDF:
 *   Content-Type: multipart/form-data
 *   body field name: "resume"  ← must match .single("resume")
 *
 * Multer parses that stream and puts the file on req.file:
 *   - buffer       → raw PDF bytes in RAM (memoryStorage — no disk files to clean up)
 *   - originalname → original filename from the client
 *   - mimetype     → MIME type reported by the browser
 *   - size         → file size in bytes
 *
 * Security: why check BOTH mimetype AND magic bytes?
 *   A browser sends the MIME type based on the file extension — easily spoofed.
 *   Someone could rename "malware.exe" to "resume.pdf" and the browser would
 *   send mimetype "application/pdf". Magic bytes (the first 4 bytes of the file)
 *   are the actual file signature and cannot be faked without corrupting the file.
 *   PDF files always start with the bytes: 25 50 44 46 (%PDF in ASCII).
 */

const multer = require("multer");

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

// PDF magic bytes: the first 4 bytes of every valid PDF are %PDF (0x25 0x50 0x44 0x46)
const PDF_MAGIC = Buffer.from([0x25, 0x50, 0x44, 0x46]);

// Store in memory — no temp files on disk, nothing to clean up
const storage = multer.memoryStorage();

/**
 * fileFilter — first line of defense.
 * Checks the MIME type reported by the browser.
 * Magic byte check happens after the file is fully in memory (see uploadResume).
 */
function fileFilter(_req, file, cb) {
  const allowedMimeTypes = ["application/pdf"];
  const allowedExtensions = [".pdf"];

  const mimeOk = allowedMimeTypes.includes(file.mimetype);
  const extOk = allowedExtensions.some((ext) =>
    file.originalname.toLowerCase().endsWith(ext),
  );

  if (mimeOk && extOk) {
    cb(null, true);
  } else {
    cb(
      Object.assign(new Error("Only PDF files are accepted."), { status: 400 }),
      false,
    );
  }
}

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

/**
 * Verify the file's magic bytes to confirm it is actually a PDF.
 * This runs AFTER Multer has the full buffer in memory.
 */
function verifyPdfMagicBytes(buffer) {
  if (!buffer || buffer.length < 4) return false;
  return buffer.slice(0, 4).equals(PDF_MAGIC);
}

/**
 * uploadResume — middleware for POST /api/analyze
 *
 * Chain:
 *   1. Multer parses multipart, enforces size + MIME filter
 *   2. Magic byte check on the buffer
 *   3. next() → controller
 */
function uploadResume(req, res, next) {
  upload.single("resume")(req, res, (err) => {
    // Multer-specific errors (file too large, unexpected field, etc.)
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: `File too large. Maximum allowed size is ${MAX_FILE_SIZE_MB}MB.`,
        });
      }
      return res.status(400).json({
        success: false,
        message: `Upload error: ${err.message}`,
      });
    }

    // Custom errors from fileFilter (wrong MIME type / extension)
    if (err) {
      return res.status(err.status || 400).json({
        success: false,
        message: err.message,
      });
    }

    // No file attached at all
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Attach a PDF using form field name "resume".',
      });
    }

    // Magic byte verification — catches renamed non-PDF files
    if (!verifyPdfMagicBytes(req.file.buffer)) {
      return res.status(400).json({
        success: false,
        message:
          "The uploaded file does not appear to be a valid PDF. Please upload a real PDF file.",
      });
    }

    next(); // All checks passed → continue to controller
  });
}

module.exports = { uploadResume };
