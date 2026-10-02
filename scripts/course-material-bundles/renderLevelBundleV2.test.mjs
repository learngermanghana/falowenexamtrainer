import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const source = fs.readFileSync(path.join(__dirname, "renderLevelBundleV2.mjs"), "utf8");
const navigationSource = fs.readFileSync(path.join(__dirname, "pdfNavigation.mjs"), "utf8");
const validatorSource = fs.readFileSync(path.join(__dirname, "validateGeneratedBundle.mjs"), "utf8");
const a1Source = fs.readFileSync(path.join(__dirname, "renderA1Bundle.mjs"), "utf8");

test("course bundle renderer waits for the current login form to disappear", () => {
  assert.match(source, /const waitForLoginCompletion = async \(page\) =>/);
  assert.match(source, /Email or student code/);
  assert.match(source, /loginFormVisible/);
  assert.match(source, /await waitForLoginCompletion\(page\)/);
  assert.doesNotMatch(source, /Returning Falowen student/);
});

test("course bundle renderer allows Firebase auth hydration after hard lesson navigation", () => {
  assert.match(source, /const openLessonWithAuthHydration = async/);
  assert.match(source, /const delays = \[0, 1200, 2500\]/);
  assert.match(source, /if \(await hasLessonContent\(page, lesson\)\) return true/);
  assert.match(source, /Authentication completed but Day/);
});

test("renderer version identifies the grammar-workbook bundle contract", () => {
  assert.match(source, /rendererVersion: 8/);
});

test("A2 and B1 bundle renderer exposes only Grammar and one merged Workbook resource", () => {
  assert.match(source, /const renderA2B1Lesson = async/);
  assert.match(source, /const workbookTabSpecs = \[/);
  assert.match(source, /return \[grammar, \{ tab: "workbook", file: workbookFile \}\];/);
  assert.doesNotMatch(source, /\{ key: "ref", names: \["Ref"\] \}/);
});

test("A1 render plan contains only grammar and workbook targets", () => {
  const plan = JSON.parse(
    fs.readFileSync(path.join(__dirname, "a1RenderPlan.json"), "utf8"),
  );
  const kinds = new Set(
    plan.lessons.flatMap((lesson) => lesson.targets.map((target) => target.kind)),
  );
  assert.deepEqual([...kinds].sort(), ["grammar", "workbook"]);
  const externalTargets = plan.lessons
    .flatMap((lesson) => lesson.targets)
    .filter((target) => target.sourceType === "external-pdf");
  assert.ok(externalTargets.length > 0);
  assert.ok(externalTargets.every((target) => target.kind === "workbook"));
});


test("A1-A2-B1 PDFs use section divider pages and shared clickable navigation", () => {
  assert.match(source, /createPdfNavigation/);
  assert.match(source, /addSectionDivider/);
  assert.match(source, /pdfNavigation\.finalize\(navigation\)/);
  assert.match(a1Source, /createPdfNavigation/);
  assert.match(a1Source, /for \(const kind of \["grammar", "workbook"\]\)/);
  assert.match(a1Source, /addSectionDivider/);
});

test("PDF navigation creates clickable TOC links and sidebar bookmarks", () => {
  assert.match(navigationSource, /Subtype: "Link"/);
  assert.match(navigationSource, /PDFName\.of\("Outlines"\)/);
  assert.match(navigationSource, /PDFName\.of\("UseOutlines"\)/);
  assert.match(navigationSource, /output\.insertPage\(1 \+ index/);
  assert.match(navigationSource, /pageNumberFor/);
});

test("generated A1-A2-B1 PDFs are scanned for excluded interface content", () => {
  assert.match(validatorSource, /execFileSync\("pdftotext"/);
  assert.match(validatorSource, /Falowen\\s\+Radio/);
  assert.match(validatorSource, /Study\\s\+Buddy/);
  assert.match(validatorSource, /Submit\\s\+workbook\\s\+answers/);
  assert.match(validatorSource, /Back\\s\+to\\s\+Course\\s\+Book/);
  assert.match(validatorSource, /missing expected section divider/);
});
