import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { PDFArray, PDFDocument, PDFName } from "pdf-lib";
import { scanPdfPageContent } from "./pdfPageAudit.mjs";
import { findA1PrintPrivacyLeaks } from "./a1PdfPrivacy.mjs";
import { findA1PrintChromeLeaks } from "./a1PdfPrintChrome.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");
const level = String(process.argv[2] || "").trim().toUpperCase();

if (!["A1", "A2", "B1"].includes(level)) {
  throw new Error("Generated bundle validation is currently defined for A1, A2 and B1.");
}

const outputDir = path.join(repoRoot, "artifacts", "course-material-bundles", level);
const pdfPath = path.join(outputDir, `Falowen-${level}-Course-Materials.pdf`);
const manifestPath = path.join(outputDir, `Falowen-${level}-Course-Materials-manifest.json`);

if (!fs.existsSync(pdfPath)) throw new Error(`Generated PDF not found: ${pdfPath}`);

const bytes = fs.readFileSync(pdfPath);
const pdf = await PDFDocument.load(bytes);
const outlines = pdf.catalog.get(PDFName.of("Outlines"));
if (!outlines) throw new Error(`${level} PDF has no bookmark outline tree.`);

const linkedPages = pdf.getPages().filter((page) => {
  const annots = page.node.lookupMaybe(PDFName.of("Annots"), PDFArray);
  return annots && annots.size() > 0;
});
if (!linkedPages.length) throw new Error(`${level} PDF has no clickable table-of-contents links.`);

let text = "";
try {
  text = execFileSync("pdftotext", ["-layout", pdfPath, "-"], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
} catch (error) {
  throw new Error(
    `Could not extract text from ${level} PDF with pdftotext: ${error instanceof Error ? error.message : String(error)}`,
  );
}

if (level === "A1") {
  if (/Editorial review copy\s*[-–—]\s*not for sale/i.test(text) || /EDITORIAL PROOF\s*[-–—]\s*NOT FOR SALE/i.test(text)) {
    throw new Error("Retail A1 PDF still contains the editorial not-for-sale cover.");
  }
  const chromeLeaks = findA1PrintChromeLeaks(text);
  if (chromeLeaks.length) throw new Error("A1 PDF web-only UI preflight failed: " + chromeLeaks.join(", "));
  const privacyLeaks = findA1PrintPrivacyLeaks(text);
  if (privacyLeaks.length) throw new Error("A1 PDF PRIVACY preflight failed: " + privacyLeaks.join(", "));
  const audit = scanPdfPageContent(text, pdf.getPageCount());
  if (audit.faults.length) {
    throw new Error("A1 PDF preflight failed:\n" + audit.faults.join("\n"));
  }
}

const forbidden = [
  ["Falowen Radio", /Falowen\s+Radio/i],
  ["Study Buddy", /Study\s+Buddy/i],
  ["Back to Course Book", /Back\s+to\s+Course\s+Book/i],
  ["Submit workbook answers", /Submit\s+workbook\s+answers/i],
  ["Reference Answers", /Reference\s+Answers/i],
  ["Teacher Video", /Teacher\s+Video/i],
];

if (level === "A2") {
  forbidden.push(
    ["Independent assessment notices", /Independent\s+assessment/i],
    ["StudyBuddy assessment UI", /StudyBuddy/i],
    ["Supporting materials navigation", /Supporting\s+materials/i],
    ["Workbook download controls", /Download\s+this\s+workbook\s+as\s+PDF/i],
    ["Workbook tab-navigation hint", /The\s+tabs\s+stay\s+visible\s+at\s+the\s+top\s+of\s+the\s+workbook/i],
    ["Workbook teacher-resource strip", /You\s+are\s+already\s+in\s+the\s+workbook\s+Kapitel/i],
    ["Teacher lecture links", /Teacher\s+lecture\s+video/i],
    ["Grammar book resource links", /Open\s+grammar\s+book/i],
    ["Live speaking chat", /Goethe\s+Free\s+Sprechen\s+Chat/i],
    ["Live speaking toggle", /Collapse\s+speaking\s+help/i],
    ["Student completion checkboxes", /I\s+prepared\s+this\s+part/i],
    ["Online tab controls", /Select\s+Grammar,\s+Teil\s*1/i],
    ["Online answer state", /\b0\s+of\s+\d+\s+answered\b/i],
    ["Unhydrated grammar content", /Loading\s+grammar\s+notes(?:\u2026|\.{2,3})?|^\s*Loading(?:\u2026|\.{2,3})?\s*$/mi],
    ["Website masthead", /^\s*Falowen\s*(?:🔔\s*)?(?:\d+\s*)?FA\s*$/mi],
    ["Speaking timer controls", /⏱\s*\d{2}:\d{2}\s+\d+\s*min\s+Start\s+Reset/i],
    ["Speaking help notice", /Speaking help is open by default/i],
    ["Writing analysis button", /^\s*Analyse my text\s*$/mi],
    ["Workbook navigation panel", /^\s*A2 workbook navigation\s*$/mi],
    ["Online workbook instructions", /^\s*Day\s+\d+\s*[·•-]\s*A2 workbook\s*[·•-]\s*how to complete this workbook\s*$/mi],


  );
}
const leaked = forbidden.filter(([, pattern]) => pattern.test(text)).map(([label]) => label);
if (level === "A2" && !/Hören\s*[·:]\s*Audio im Falowen Course Book/i.test(text)) {
  throw new Error("A2 PDF is missing the A1-style authenticated Hören audio companion QR section.");
}
if (leaked.length) {
  throw new Error(`${level} PDF contains excluded UI/content: ${leaked.join(", ")}.`);
}

if (level === "A2") {
  // Sparse-page figures are diagnostics, not deletion rules: never silently
  // discard a printed question, diagram or chapter-divider page.
  const pdfPages = text.split("\f").filter(page => page.trim());
  const shortPages = pdfPages
    .map((page, index) => ({
      index: index + 1,
      words: page.replace(/Falowen Learning Hub\s+\d+\s*\/\s*\d+/gi, "")
        .trim().split(/\s+/).filter(Boolean).length,
    }))
    .filter(item => item.words > 0 && item.words <= 20);
  console.log("A2 print page density: " + shortPages.length + " low-text pages (manual review): " +
    shortPages.slice(0, 35).map(page => page.index).join(", "));
}
if (!/Contents/i.test(text)) throw new Error(`${level} PDF is missing its contents page.`);

const expectedByDay = new Map();
if (level === "A1") {
  const plan = JSON.parse(
    fs.readFileSync(path.join(__dirname, "a1RenderPlan.json"), "utf8"),
  );
  for (const lesson of plan.lessons) {
    const kinds = [...new Set((lesson.targets || []).map((target) => target.kind))];
    expectedByDay.set(
      Number(lesson.day),
      kinds.filter((kind) => kind === "grammar" || kind === "workbook"),
    );
  }
} else {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  for (const lesson of manifest.lessons.filter((entry) => entry.printKind !== "excluded")) {
    expectedByDay.set(Number(lesson.day), ["grammar", "workbook"]);
  }
}

if (level === "A2") {
  const diagPath = path.join(outputDir, "render-diagnostics.json");
  if (!fs.existsSync(diagPath)) throw new Error("A2 PDF: lesson render diagnostics missing.");
  const diag = JSON.parse(fs.readFileSync(diagPath, "utf8"));
  if (!diag.completedAt) throw new Error("A2 PDF: render did not complete all lessons.");
  const completedLessons = diag.lessons.filter((entry) => entry.status === "rendered");
  if (completedLessons.length !== expectedByDay.size)
    throw new Error(`A2 PDF: expected ${expectedByDay.size} rendered lessons, received ${completedLessons.length}.`);
  for (const day of expectedByDay.keys()) {
    const entries = completedLessons.filter((entry) => Number(entry.day) === day);
    if (entries.length !== 1 || entries[0].sections?.join(",") !== "grammar,workbook")
      throw new Error(`A2 PDF: Day ${day} missing complete Grammar/Workbook bundle.`);
  }
  const mockDay = completedLessons.find((entry) => Number(entry.day) === 22);
  if (mockDay && !mockDay.origins?.every((source) => source === "canonical-read-only"))
    throw new Error("A2 PDF: Day 22 must be a noninteractive source-only print companion.");
}
const missing = [];
for (const [day, sections] of expectedByDay) {
  for (const section of sections) {
    const label = section === "grammar" ? "GRAMMAR" : "WORKBOOK";
    const marker = new RegExp(
      `${level}\\s*[·•]?\\s*Day\\s+${day}\\b[\\s\\S]{0,500}\\b${label}\\b`,
      "i",
    );
    if (!marker.test(text)) missing.push(`Day ${day} ${label}`);
  }
}

if (missing.length) {
  throw new Error(`${level} PDF is missing expected section divider(s): ${missing.join(", ")}.`);
}

console.log(
  `${level} PDF validation passed: ${pdf.getPageCount()} pages, bookmarks present, clickable TOC present, no excluded UI text, expected section dividers present and page preflight checked.`,
);
