/**
 * STEP 3 — PDF text extraction
 *
 * Input:  req.file.buffer (raw PDF bytes from Multer — already in memory)
 * Output: plain text string for the AI prompt
 *
 * Why a minimum text length?
 *   Scanned/image-only PDFs contain no machine-readable text — pdf-parse
 *   returns an empty or near-empty string. We reject these early with a
 *   clear message rather than sending garbage to Gemini.
 */

const { PDFParse } = require("pdf-parse");

const MIN_TEXT_LENGTH = 50; // Characters — anything less is likely a blank/image PDF

async function extractTextFromPdf(buffer) {
  // Guard: buffer must exist and be non-empty
  if (!buffer || buffer.length === 0) {
    const err = new Error("Received an empty file buffer.");
    err.status = 400;
    throw err;
  }

  let parser;
  try {
    parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    const text = (result.text || "").trim();

    if (text.length < MIN_TEXT_LENGTH) {
      const err = new Error(
        "Could not extract readable text from this PDF. " +
          "Please use a text-based PDF (not a scanned image-only file).",
      );
      err.status = 422; // Unprocessable Entity — file is valid PDF but unusable
      throw err;
    }

    return text;
  } catch (err) {
    // Re-throw errors we already created with a status
    if (err.status) throw err;

    // pdf-parse parse errors (corrupted/password-protected PDF)
    const wrapped = new Error(
      "Failed to read the PDF. Make sure it is not password-protected or corrupted.",
    );
    wrapped.status = 400;
    throw wrapped;
  } finally {
    // Always release the parser's resources, even if an error occurred
    if (parser) {
      try {
        await parser.destroy();
      } catch {
        // Ignore destroy errors — they don't affect the response
      }
    }
  }
}

module.exports = { extractTextFromPdf };
