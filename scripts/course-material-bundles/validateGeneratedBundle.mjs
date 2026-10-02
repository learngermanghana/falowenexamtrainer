import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { PDFArray, PDFDocument, PDFName } from "pdf-lib";

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

const forbidden = [
  ["Falowen Radio", /Falowen\s+Radio/i],
  ["Study Buddy", /Study\s+Buddy/i],
  ["Back to Course Book", /Back\s+to\s+Course\s+Book/i],
  ["Submit workbook answers", /Submit\s+workbook\s+answers/i],
  ["Reference Answers", /Reference\s+Answers/i],
  ["Teacher Video", /Teacher\s+Video/i],
];

const leaked = forbidden.filter(([, pattern]) => pattern.test(text)).map(([label]) => label);
if (leaked.length) {
  throw new Error(`${level} PDF contains excluded UI/content: ${leaked.join(", ")}.`);
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
  `${level} PDF validation passed: ${pdf.getPageCount()} pages, bookmarks present, clickable TOC present, no excluded UI text, expected section dividers present.`,
);
