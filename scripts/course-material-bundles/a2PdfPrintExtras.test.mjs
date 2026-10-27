import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { getA2PdfLessonCompanionUrl } from "./a2PdfPrintExtras.mjs";

const dir = path.dirname(fileURLToPath(import.meta.url));
const helpers = fs.readFileSync(path.join(dir, "a2PdfPrintExtras.mjs"), "utf8");
const renderer = fs.readFileSync(path.join(dir, "renderLevelBundleV2.mjs"), "utf8");

test("A2 listening QR points to an authenticated Falowen lesson, following A1 retail policy", () => {
  assert.equal(getA2PdfLessonCompanionUrl(
    "/campus/course/lesson/A2/18?radio=done&view=hoeren&token=sensitive",
    "https://www.falowen.app",
  ), "https://www.falowen.app/campus/course/lesson/A2/18");
  assert.equal(getA2PdfLessonCompanionUrl(
    "/campus/course/a2-day-21-workbook?radio=done",
    "https://www.falowen.app",
  ), "https://www.falowen.app/campus/course/a2-day-21-workbook");
  for (const bad of ["https://r2.cloudflarestorage.com/secret", "https://evil.example/campus/course/A2/18", "/public-blob/123"])
    assert.throws(() => getA2PdfLessonCompanionUrl(bad), /authenticated Falowen course lesson/);
});

test("A2 export hides teacher resources and live chat structurally without deleting question choices", () => {
  assert.match(helpers, /You are already in the workbook Kapitel/);
  assert.match(helpers, /Teacher lecture video/);
  assert.match(helpers, /Grammar book/);
  assert.match(helpers, /data-course-inline-practice="speaking"/);
  assert.match(helpers, /workbook-website-heading/);
  assert.match(helpers, /querySelector\("input\[type=radio\], textarea, fieldset"\)/);
  assert.match(helpers, /restoreA2PrintDocument/);
  assert.match(helpers, /removeAttribute\("data-a2-pdf-hide"\)/);
  assert.match(renderer, /\[data-a2-pdf-hide\]/);
  assert.doesNotMatch(renderer, /video, audio, button, input\[type="checkbox"\]/);
});

test("Every A2 Teil 4 page generates an embedded authenticated Hören QR, not a signed audio link", () => {
  assert.match(renderer, /suffix === "workbook-teil-4"/);
  assert.match(renderer, /getA2PdfLessonCompanionUrl\(lesson\.route, baseUrl\)/);
  assert.match(renderer, /QRCode\.toDataURL\(lessonUrl/);
  assert.match(renderer, /page\.evaluate\(prepareA2PrintDocument/);
  assert.match(renderer, /page\.evaluate\(restoreA2PrintDocument/);
  assert.match(renderer, /await trimPrintedPdfTail/);
});

test("A2 website-only controls have durable print-only markers that do not change student UI", () => {
  const startGuide = fs.readFileSync(path.join(dir, "../../web/src/components/WorkbookStartGuide.js"), "utf8");
  const workbook = fs.readFileSync(path.join(dir, "../../web/src/components/A2StandardTabbedWorkbookPage.js"), "utf8");
  assert.match(startGuide, /data-pdf-exclude="workbook-start-resources"/);
  assert.match(workbook, /data-pdf-exclude="a2-prepared-checkbox"/);
  assert.ok(helpers.includes(String.raw`/^\d+\s+of\s+\d+\s+answered$/i`));
  assert.match(renderer, /\[data-pdf-exclude\]/);
});

test("print audit removes complete resource cards even before their new markers deploy", () => {
  assert.match(helpers, /title\.closest\("section"\)/);
  assert.match(helpers, /Supporting materials/);
  assert.match(helpers, /workbook-start-guide-resources/);
  assert.match(helpers, /workbook-resource-links/);
  assert.match(helpers, /online-completion-checkbox/);
  assert.match(helpers, /online-answer-progress/);
  assert.match(helpers, /querySelector\("input,textarea,fieldset,select,h1,h2,h3"\)/);
  const marker = renderer.indexOf("page.evaluate(prepareA2PrintDocument");
  const scrub = renderer.indexOf("await suppressPdfChromeText(page);", marker);
  assert.ok(marker > 0 && scrub > marker,
    "detect resource cards before the heading-text scrub runs");
  assert.match(renderer, /page\.evaluate\(restoreA2PrintDocument\)/);
});

test("print-only online answer counts are scrubbed even with nested badges or extra text", () => {
  assert.match(helpers, /const answerCounter =/);
  assert.match(helpers, /online-answer-progress/);
  assert.match(helpers, /const smallerMatch/);
  assert.match(helpers, /querySelector\("input\[type=radio\],textarea,fieldset,select,h1,h2,h3"\)/);
  assert.ok(renderer.includes(String.raw`/\b\d+\s+of\s+\d+\s+answered\b/gi`));
});
