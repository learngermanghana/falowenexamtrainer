import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { PDFDocument } from "pdf-lib";
import { extractPdfPages } from "./pdfPageAudit.mjs";

// A trailing, textless browser-print page is safe to discard ONLY when
// a low-resolution render is visually empty as well. Never remove an
// illustration-only page or an interior page based on text extraction alone.
export const isVisuallyEmptyPgm = (pgm, threshold = 220) => {
  const input = Buffer.isBuffer(pgm) ? pgm : Buffer.from(pgm);
  let cursor = 0;
  const nextToken = () => {
    while (cursor < input.length) {
      const code = input[cursor];
      if (code === 35) {
        while (cursor < input.length && input[cursor] !== 10) cursor++;
      } else if (code <= 32) {
        cursor++;
      } else break;
    }
    const start = cursor;
    while (cursor < input.length && input[cursor] > 32) cursor++;
    if (start === cursor) throw new Error("Invalid PGM header");
    return input.toString("ascii", start, cursor);
  };

  if (nextToken() !== "P5") throw new Error("Expected an 8-bit grayscale PGM");
  const width = Number(nextToken()), height = Number(nextToken()), max = Number(nextToken());
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || max !== 255) {
    throw new Error("Invalid grayscale raster dimensions");
  }
  // The one header delimiter immediately after max-value precedes binary pixels.
  if (input[cursor] === 13 && input[cursor + 1] === 10) cursor += 2;
  else if (input[cursor] <= 32) cursor++;
  else throw new Error("Missing PGM pixel delimiter");
  const pixels = input.subarray(cursor);
  if (pixels.length !== width * height) throw new Error("Incomplete PGM pixel data");
  for (const value of pixels) if (value < threshold) return false;
  return true;
};

const renderPageToGrayscale = (file, pageNumber, cropInterior = false) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "falowen-pdf-blank-check-"));
  try {
    const prefix = path.join(dir, "page");
    execFileSync("pdftoppm", [
      "-f", String(pageNumber), "-l", String(pageNumber),
      "-scale-to", "420", "-gray", "-singlefile",
      ...(cropInterior ? ["-x", "70", "-y", "90", "-W", "275", "-H", "275"] : []),
      file, prefix,
    ], { maxBuffer: 1024 * 1024, timeout: 20000 });
    return fs.readFileSync(prefix + ".pgm");
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
};

export const trimPrintedPdfTail = async (file, { description = "" } = {}) => {
  const pdf = await PDFDocument.load(fs.readFileSync(file));
  const pageCount = pdf.getPageCount();
  const textPages = extractPdfPages(execFileSync("pdftotext", ["-layout", file, "-"], {
    encoding: "utf8", maxBuffer: 64 * 1024 * 1024, timeout: 20000,
  }));
  if (textPages.length !== pageCount) {
    throw new Error("PDF page extraction mismatch in " + description + ": " +
      textPages.length + " text pages vs " + pageCount + " PDF pages");
  }
  let removed = 0;
  for (let index = pageCount - 1; index > 0; index--) {
    if (textPages[index].trim()) break;
    if (!isVisuallyEmptyPgm(renderPageToGrayscale(file, index + 1))) {
      // Preserve a legitimate graphical page, even if pdftotext sees nothing.
      break;
    }
    if (removed >= 3) throw new Error("Too many trailing empty print pages in " + description);
    pdf.removePage(index);
    removed++;
  }
  // The Day 14 video/lesson shell previously generated a page containing
  // only the Falowen masthead and a white empty card (printed page 191).
  // Remove ONLY that known shell, and ONLY if its central raster is blank.
  // Never suppress pages containing a lesson image, text or exercise content.
  let removedChrome = 0;
  if (description === "Day 14 workbook") {
    for (let index = pageCount - removed - 1; index >= 0; index--) {
      const loneHeader = textPages[index].replace(/\s+/g, " ").trim();
      if (!/^Falowen\s*(?:🔔\s*)?(?:FA)?$/i.test(loneHeader)) continue;
      if (pdf.getPageCount() <= 1) break;
      if (!isVisuallyEmptyPgm(renderPageToGrayscale(file, index + 1, true))) continue;
      pdf.removePage(index);
      removedChrome++;
    }
  }
  removed += removedChrome;
  if (removed) {
    fs.writeFileSync(file, await pdf.save());
    console.log("A1 PDF: removed " + removed + " empty overflow / chrome-only page(s) from " + description);
  }
  return { before: pageCount, after: pageCount - removed, removed };
};
