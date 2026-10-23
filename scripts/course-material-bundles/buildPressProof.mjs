import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const ALLOWED_LEVELS = new Set(["A1", "A2", "B1", "B2", "C1"]);
const A4 = [595.28, 841.89];

export async function createPressProof(sourcePdfBytes, level) {
  if (!ALLOWED_LEVELS.has(level)) throw new Error("Unsupported Falowen Press level: " + level);
  const pdf = await PDFDocument.load(sourcePdfBytes);
  if (!pdf.getPageCount()) throw new Error("Cannot create a press proof from an empty course PDF");

  const page = pdf.insertPage(0, A4);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const navy = rgb(0.071, 0.157, 0.259);
  const muted = rgb(0.31, 0.36, 0.42);
  const gold = rgb(0.90, 0.75, 0.36);

  page.drawRectangle({ x: 0, y: 557, width: A4[0], height: 285, color: navy });
  page.drawText("FALOWEN PRESS", { x: 52, y: 764, font: bold, size: 23, color: rgb(1, 1, 1) });
  page.drawText("DEUTSCH " + level, { x: 52, y: 675, font: bold, size: 37, color: rgb(1, 1, 1) });
  page.drawText("Course Workbook", { x: 53, y: 624, font: regular, size: 19, color: rgb(0.87, 0.92, 0.96) });
  page.drawRectangle({ x: 52, y: 591, width: 165, height: 4, color: gold });
  page.drawText("EDITORIAL PROOF — NOT FOR SALE", { x: 52, y: 504, font: bold, size: 15, color: navy });
  page.drawText("This is a layout and content review copy of Falowen's existing", {
    x: 52, y: 456, font: regular, size: 11, color: muted,
  });
  page.drawText("course materials. It is NOT yet an examination-preparation book.", {
    x: 52, y: 439, font: regular, size: 11, color: muted,
  });
  page.drawText("Before commercial publication:", { x: 52, y: 386, font: bold, size: 12, color: navy });
  const checks = [
    "Review every question, answer, transcript, and page layout.",
    "Verify ownership or permission for any externally sourced PDF or image.",
    "Prepare licensed listening audio, transcripts, and accessible links.",
    "Add original model exams, answer keys, and print-specific cover files.",
    "Remove or rewrite platform-only instructions and navigation.",
  ];
  checks.forEach((line, index) => {
    page.drawText(String(index + 1) + ". " + line, {
      x: 52, y: 358 - 29 * index, font: regular, size: 10, color: muted,
    });
  });
  page.drawText("Independent German language learning materials", {
    x: 52, y: 92, font: regular, size: 10, color: muted,
  });
  page.drawText("falowen.app   |   exams.falowen.app", {
    x: 52, y: 70, font: bold, size: 10, color: navy,
  });
  pdf.setTitle("Falowen Press " + level + " Course Workbook - Editorial Proof");
  pdf.setAuthor("Falowen Press");
  pdf.setSubject("Internal pre-publication review; not for sale");
  return pdf.save();
}

const invokedAsScript = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedAsScript) {
  const level = String(process.argv[2] || "").toUpperCase();
  if (!ALLOWED_LEVELS.has(level)) throw new Error("Choose A1, A2, B1, B2, or C1");
  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
  const outputDir = path.join(repoRoot, "artifacts/course-material-bundles", level);
  const sourcePath = path.join(outputDir, "Falowen-" + level + "-Course-Materials.pdf");
  const outputPath = path.join(outputDir, "Falowen-" + level + "-Press-Editorial-Proof.pdf");
  if (!fs.existsSync(sourcePath)) throw new Error("Course PDF must be generated and validated first: " + sourcePath);
  const bytes = await createPressProof(fs.readFileSync(sourcePath), level);
  fs.writeFileSync(outputPath, bytes);
  console.log("Created editorial-only press proof: " + outputPath);
}
