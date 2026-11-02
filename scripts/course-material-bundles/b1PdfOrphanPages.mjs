import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { PDFDocument } from "pdf-lib";
import { extractPdfPages } from "./pdfPageAudit.mjs";
import { isVisuallyEmptyPgm } from "./trimPrintedPdfTail.mjs";

// Print-only source PDFs can contain a trailing empty outline card from the
// live Falowen site. Never remove a substantive lesson page or an illustration.
// Inspect the source page BEFORE adding bookmarks, TOC links, or page numbers.
export const isB1EmptyWebsiteCardText = text =>
  !String(text || "").replace(/\s+/g, "").length;

// Check the lower content region. The known empty web card occupies only the
// upper ~110 px on a 420 px raster. A lower illustration/chart keeps the page.
const lowerPageIsBlank = (file, page) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "b1-print-orphan-"));
  try {
    const prefix = path.join(dir, "page");
    execFileSync("pdftoppm", [
      "-f", String(page), "-l", String(page), "-scale-to", "420",
      "-x", "24", "-y", "128", "-W", "240", "-H", "240",
      "-gray", "-singlefile", file, prefix,
    ], { timeout: 20000, maxBuffer: 2 * 1024 * 1024 });
    return isVisuallyEmptyPgm(fs.readFileSync(prefix + ".pgm"), 220);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
};

// Returns the 0-based page indices that contain printable work. Do not mutate
// the source PDF or ever delete navigation/retail cover pages.
export async function getB1PrintablePageIndices(file) {
  const pdf = await PDFDocument.load(fs.readFileSync(file));
  const textPages = extractPdfPages(execFileSync("pdftotext", ["-layout", file, "-"], {
    encoding: "utf8", maxBuffer: 16 * 1024 * 1024, timeout: 20000,
  }));
  if (pdf.getPageCount() !== textPages.length) {
    throw new Error("B1 PDF source page/text count mismatch: " + file);
  }
  const keep = [];
  let removed = 0;
  for (let i = 0; i < textPages.length; i++) {
    const empty = isB1EmptyWebsiteCardText(textPages[i]);
    // Only empty-text pages can be dropped; never infer from a short reading.
    if (empty && lowerPageIsBlank(file, i + 1)) {
      removed++;
      continue;
    }
    keep.push(i);
  }
  if (!keep.length) throw new Error("B1 PDF source has no substantive pages: " + file);
  if (removed) console.log("B1 PDF: removed " + removed + " empty website-card sheet(s) before navigation.");
  return keep;
}
