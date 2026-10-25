import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { PDFDocument } from "pdf-lib";
import { extractPdfPages } from "./pdfPageAudit.mjs";

// Poppler emits P5 grayscale PGM with --gray. Inspect the middle of the page
// so page-number footers, edge rules and print chrome cannot pass as content.
// This is local-only PDF analysis; it never uploads a page or extracts user data.
export const countA2BodyInk = pgm => {
  const buffer = Buffer.isBuffer(pgm) ? pgm : Buffer.from(pgm || []);
  let pos = 0;
  const token = () => {
    while (pos < buffer.length) {
      const c = buffer[pos];
      if (c === 35) { while (pos < buffer.length && buffer[pos] !== 10) pos++; continue; }
      if (c === 9 || c === 10 || c === 13 || c === 32) { pos++; continue; }
      break;
    }
    const start = pos;
    while (pos < buffer.length && ![9, 10, 13, 32].includes(buffer[pos])) pos++;
    return buffer.toString("ascii", start, pos);
  };
  if (token() !== "P5") throw new Error("A2 PDF raster audit requires P5 grayscale PGM.");
  const width = Number(token()), height = Number(token()), max = Number(token());
  if (!Number.isInteger(width) || !Number.isInteger(height) ||
      width < 10 || height < 10 || max !== 255 ||
      pos >= buffer.length || ![9, 10, 13, 32].includes(buffer[pos])) {
    throw new Error("Invalid PGM dimensions/depth for A2 PDF raster audit.");
  }
  pos++; // Exactly one header terminator; raster bytes may begin with whitespace.
  if (buffer.length - pos !== width * height) throw new Error("Truncated A2 grayscale page raster.");
  let ink = 0;
  const left = Math.floor(width * 0.05), right = Math.ceil(width * 0.95);
  const top = Math.floor(height * 0.09), bottom = Math.ceil(height * 0.90);
  for (let y = top; y < bottom; y++) {
    const offset = pos + y * width;
    for (let x = left; x < right; x++) {
      if (buffer[offset + x] < 225) ink++;
    }
  }
  return ink;
};

export const measureA2PdfPageInk = (pdfPath, pageNumber) => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "falowen-a2-page-"));
  try {
    const root = path.join(directory, "page");
    execFileSync("pdftoppm", [
      "-f", String(pageNumber), "-l", String(pageNumber),
      "-gray", "-scale-to", "400", "-singlefile", pdfPath, root,
    ], { timeout: 25000, stdio: ["ignore", "pipe", "pipe"] });
    return countA2BodyInk(fs.readFileSync(root + ".pgm"));
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
};

// Called on each browser-generated, PRIVATE A2 section before any navigation,
// contents pages, numbering, or PDF merge. Legitimate graphics-only and answer-
// line pages are retained, never silently discarded.
export const pruneA2TrulyBlankSectionPages = async (pdfPath, { log = console.log } = {}) => {
  const pdf = await PDFDocument.load(fs.readFileSync(pdfPath));
  const text = execFileSync("pdftotext", ["-layout", pdfPath, "-"], {
    encoding: "utf8", timeout: 30000, maxBuffer: 16 * 1024 * 1024,
  });
  const pages = extractPdfPages(text);
  if (pages.length !== pdf.getPageCount()) {
    throw new Error("A2 print-page audit count mismatch; refusing to remove any pages.");
  }
  const remove = [], graphicsOnly = [];
  for (let i = 0; i < pages.length; i++) {
    const normalized = pages[i].replace(/\s+/g, " ").trim();
    if (normalized.length >= 12) continue;
    const ink = measureA2PdfPageInk(pdfPath, i + 1);
    if (ink < 20) remove.push(i);
    else graphicsOnly.push({ page: i + 1, ink });
  }
  if (remove.length >= pdf.getPageCount()) {
    throw new Error("A2 PDF section appears entirely blank; refusing to drop it.");
  }
  for (const i of remove.reverse()) pdf.removePage(i);
  if (remove.length) {
    fs.writeFileSync(pdfPath, await pdf.save());
    log("Removed " + remove.length + " verified empty A2 print overflow page(s).");
  }
  if (graphicsOnly.length) {
    log("Retained " + graphicsOnly.length + " A2 graphics-only/answer-line page(s); not treated as blank.");
  }
  return { removed: remove.length, retainedGraphicsOnly: graphicsOnly.length, pages: pdf.getPageCount() };
};
