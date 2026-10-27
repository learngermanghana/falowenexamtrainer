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
  assert.ok(source.includes('return [grammar, { tab: "workbook", file: workbookFile,'));
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
  assert.equal(externalTargets.length, 0, "A1 PDF uses current live Course Book pages, not obsolete external PDFs");
  const day18 = plan.lessons.find((lesson) => lesson.day === 18);
  assert.deepEqual(day18.targets.map((target) => target.kind), ["grammar", "workbook"]);
  assert.ok(day18.targets.every((target) => target.url.includes("two-case-prepositions-wechselpraepositionen-day-18")));
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


test("A2 and B1 PDF navigation skips Radio while preserving lesson routes and workbook views", async () => {
  const { buildPdfLessonTargetUrl } = await import("./pdfLessonRoute.mjs");
  assert.match(source, /buildPdfLessonTargetUrl\(lesson\.route, baseUrl, level\)/);
  assert.match(source, /data-radio-first-workbook-gate/);

  const base = "https://www.falowen.app";
  const a2 = new URL(buildPdfLessonTargetUrl("/campus/course/lesson/A2/1?view=workbook", base, "A2"));
  assert.equal(a2.pathname, "/campus/course/lesson/A2/1");
  assert.equal(a2.searchParams.get("view"), "workbook");
  assert.equal(a2.searchParams.get("radio"), "done");

  const b1 = new URL(buildPdfLessonTargetUrl("/campus/course/lesson/B1/23?view=workbook&chapter=9.23", base, "B1"));
  assert.equal(b1.searchParams.get("chapter"), "9.23");
  assert.equal(b1.searchParams.get("view"), "workbook");
  assert.equal(b1.searchParams.get("radio"), "done");

  const a1 = new URL(buildPdfLessonTargetUrl("/campus/course/lesson/A1/1?view=grammar", base, "A1"));
  assert.equal(a1.searchParams.get("radio"), null);
  assert.equal(a1.searchParams.get("view"), "grammar");

  const existing = new URL(buildPdfLessonTargetUrl("/campus/course/a2-day-2?radio=done&view=lesen", base, "A2"));
  assert.equal(existing.searchParams.getAll("radio").length, 1);
  assert.equal(existing.searchParams.get("view"), "lesen");
});

test("printing a workbook section restores screen media before the next tab click", () => {
  const saveStart = source.indexOf("const saveCurrentPagePdf = async");
  const saveEnd = source.indexOf("const renderA1Lesson =", saveStart);
  assert.ok(saveStart >= 0 && saveEnd > saveStart);
  const saveMethod = source.slice(saveStart, saveEnd);
  assert.match(saveMethod, /await injectPrintMode\(page\)/);
  assert.match(saveMethod, /await page\.pdf\(/);
  assert.match(saveMethod, /finally\s*\{[\s\S]*?await page\.emulateMedia\(\{ media: "screen" \}\)/);
});
