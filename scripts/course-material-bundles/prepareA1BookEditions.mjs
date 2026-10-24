#!/usr/bin/env node
// Prepare two deliberately different files from a validated A1 editorial build:
// a tiny public, sample-only PDF and a full PRIVATE retail candidate.
// This script never uploads either file and deliberately leaves the first
// editorial-build cover (NOT FOR SALE) untouched on the source.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const dir = path.join(root, "artifacts/course-material-bundles/A1");
const source = process.argv[2] || path.join(dir, "Falowen-A1-Course-Materials.pdf");
const samplePath = process.argv[3] || path.join(dir, "Falowen-A1-Free-Day1-Sample.pdf");
const privatePath = process.argv[4] || path.join(dir, "Falowen-A1-Retail-Edition-PRIVATE.pdf");
const sourcePagesExpected = 250;
const sampleFirstSourcePage = 4;
const sampleLastSourcePage = 15;
const purple = rgb(0.19, 0.13, 0.38);
const violet = rgb(0.34, 0.25, 0.52);
const white = rgb(1, 1, 1);
const gold = rgb(0.96, 0.75, 0.40);
const muted = rgb(0.88, 0.83, 0.96);

function assertSafeDestinations() {
  const all = [source, samplePath, privatePath].map(f => path.resolve(f));
  if (new Set(all).size !== 3) throw new Error("Source and output PDF filenames must differ.");
  if (all.some(f => /\/(?:web\/public|public|web\/dist)\//.test(f.replaceAll("\\", "/")))) {
    throw new Error("Do not put the full paid A1 PDF in web/public or a static website build.");
  }
}

async function drawCover(pdf, { free }) {
  const page = pdf.addPage([595.28, 841.89]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const rect = (x, y, width, height, color) => page.drawRectangle({ x, y, width, height, color });
  const line = (t, x, y, size, opts = {}) => page.drawText(t, { x, y, font: opts.bold ? bold : font, size, color: opts.color || white });
  rect(0, 0, 595.28, 841.89, purple);
  page.drawEllipse({ x: 545, y: 745, xScale: 150, yScale: 150, color: violet });
  page.drawEllipse({ x: 0, y: 10, xScale: 98, yScale: 98, color: violet });
  rect(49, 755, 10, 40, gold);
  line("FALOWEN", 74, 768, 24, { bold: true });
  line("BEGINNER GERMAN  |  LEVEL A1", 49, 690, 12, { bold: true, color: gold });
  line("Grammar Notes", 49, 566, 36, { bold: true });
  line("& Workbook", 49, 521, 36, { bold: true });
  rect(49, 493, 112, 6, gold);
  line("Deutsch lernen.", 49, 431, 17);
  line("Deutsch verstehen.", 49, 403, 17);
  line("Grammar explanations, exercises,", 49, 329, 15);
  line("writing and speaking practice", 49, 307, 15);
  if (free) {
    rect(49, 208, 305, 44, gold);
    line("FREE DAY 1 SAMPLE", 66, 222, 17, { bold: true, color: purple });
  } else {
    line("250-page digital workbook", 49, 225, 17, { bold: true, color: gold });
    line("2026 edition", 49, 193, 13);
  }
  rect(49, 106, 500, 1, muted);
  line("Learn Language Education Academy", 49, 85, 10);
  line("falowen.app/books/a1", 49, 60, 12, { bold: true, color: gold });
  return page;
}

async function main() {
  assertSafeDestinations();
  if (!fs.existsSync(source)) throw new Error("Validated A1 editorial PDF is missing: " + source);
  const inputBytes = fs.readFileSync(source);
  const original = await PDFDocument.load(inputBytes);
  const pageCount = original.getPageCount();
  if (pageCount !== sourcePagesExpected) {
    throw new Error("Expected reviewed A1 250-page version, found " + pageCount + " pages. Recheck the book before preparing release assets.");
  }
  const coverText = execFileSync("pdftotext", ["-f", "1", "-l", "1", source, "-"], { encoding: "utf8" });
  if (!/Editorial review copy - not for sale/i.test(coverText)) {
    throw new Error("Unknown source cover: the release script only accepts the validated review edition.");
  }

  const retail = await PDFDocument.create();
  await drawCover(retail, { free: false });
  (await retail.copyPages(original, [...Array(pageCount-1).keys()].map(i => i + 1))).forEach(p => retail.addPage(p));
  retail.setTitle("Falowen A1 Grammar Notes & Workbook");
  retail.setAuthor("Falowen | Learn Language Education Academy");
  retail.setSubject("250-page 2026 edition, German A1 course workbook");
  if (retail.getPageCount() !== pageCount) throw new Error("Retail edition lost pages.");
  fs.mkdirSync(path.dirname(privatePath), { recursive: true });
  fs.writeFileSync(privatePath, await retail.save({ useObjectStreams: true }));

  const sample = await PDFDocument.create();
  await drawCover(sample, { free: true });
  const indices = [...Array(sampleLastSourcePage - sampleFirstSourcePage + 1).keys()].map(i => sampleFirstSourcePage - 1 + i);
  (await sample.copyPages(original, indices)).forEach(p => sample.addPage(p));
  const font = await sample.embedFont(StandardFonts.Helvetica);
  const bold = await sample.embedFont(StandardFonts.HelveticaBold);
  for (const pg of sample.getPages().slice(1)) {
    pg.drawRectangle({ x: 399, y: 792, width: 166, height: 20, color: rgb(0.98, 0.95, 0.86) });
    pg.drawText("FREE FALOWEN SAMPLE", { x: 406, y: 798, font: bold, size: 9, color: purple });
  }
  const closing = sample.addPage([595.28, 841.89]);
  closing.drawRectangle({ x: 0, y: 0, width: 595.28, height: 841.89, color: rgb(0.98, 0.97, 0.94) });
  closing.drawRectangle({ x: 0, y: 806, width: 595.28, height: 35, color: violet });
  closing.drawText("Keep learning German with Falowen", { x: 55, y: 705, size: 26, font: bold, color: purple });
  closing.drawText("This was a free Day 1 sample from the complete", { x: 55, y: 650, size: 16, font, color: purple });
  closing.drawText("Falowen A1 Grammar Notes & Workbook.", { x: 55, y: 625, size: 16, font, color: purple });
  closing.drawText("The complete digital workbook has 250 pages.", { x: 55, y: 555, size: 17, font: bold, color: purple });
  ["Grammar notes across the A1 curriculum", "Workbook exercises and writing practice",
    "Reading and speaking activities", "Structured lessons for independent revision"].forEach((text, i) => {
    closing.drawText("- " + text, { x: 62, y: 510 - i*38, font, size: 14, color: violet });
  });
  closing.drawRectangle({ x: 55, y: 213, width: 490, height: 65, color: violet });
  closing.drawText("See the A1 book: falowen.app/books/a1", { x: 72, y: 238, font: bold, size: 16, color: white });
  closing.drawText("Audio QR activities may require Falowen Course Book access.", { x: 55, y: 110, size: 11, font, color: violet });
  sample.setTitle("Falowen A1 - Free Day 1 Grammar and Workbook Sample");
  sample.setAuthor("Falowen | Learn Language Education Academy");
  if (sample.getPageCount() !== 14) throw new Error("Unexpected sample length.");
  fs.mkdirSync(path.dirname(samplePath), { recursive: true });
  fs.writeFileSync(samplePath, await sample.save({ useObjectStreams: true }));

  console.log("Public sample: " + samplePath + " (14 pages)");
  console.log("PRIVATE, NOT YET LICENSE-CLEARED: " + privatePath + " (250 pages)");
  console.log("NEVER publish the private file as a public GitHub Actions artifact.");
}
main().catch(error => { console.error(error); process.exitCode = 1; });
