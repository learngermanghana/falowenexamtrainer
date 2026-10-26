import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { isLocalA2EditorialPrintMode } from "../../web/src/utils/a2EditorialPrintMode.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const get = path => fs.readFileSync(root + "/" + path, "utf8");
const workbook = get("web/src/components/A2StandardTabbedWorkbookPage.js");
const renderer = get("scripts/course-material-bundles/renderLevelBundleV2.mjs");

const local = { protocol: "http:", hostname: "127.0.0.1", port: "4173" };
test("editorial mode requires DEV, loopback, exact browser flag and HTTP", () => {
  assert.equal(isLocalA2EditorialPrintMode({ envDev: true, marker: true, location: local }), true);
  for (const cfg of [
    { envDev: false, marker: true, location: local },
    { envDev: true, marker: false, location: local },
    { envDev: true, marker: true, location: { ...local, hostname: "www.falowen.app" } },
    { envDev: true, marker: true, location: { ...local, hostname: "192.168.1.5" } },
    { envDev: true, marker: true, location: { ...local, protocol: "https:" } },
    { envDev: true, marker: true, location: null },
  ]) assert.equal(isLocalA2EditorialPrintMode(cfg), false);
});

test("A2 editorial render skips the timed provider but normal students always use it", () => {
  assert.match(workbook, /const editorialPdfMode = isLocalA2EditorialPrintMode\(\)/);
  assert.match(workbook, /if \(editorialPdfMode\) \{\s*return renderWorkbookContent\(\{ isTabLocked: \(\) => false \}\)/);
  assert.match(workbook, /<SharedTimedAssignment[\s\S]*?configOverride=\{lessonProfile\?\.timer \|\| null\}/);
  assert.match(workbook, /\{renderWorkbookContent\}[\s\S]*?<\/SharedTimedAssignment>/);
  assert.match(workbook, /!editorialPdfMode \? <CourseInlinePracticePanel type="writing"/);
  assert.match(workbook, /!editorialPdfMode \? <><SpeakingPracticeTimerCard \/>/);
  assert.match(workbook, /!editorialPdfMode \|\| !\["references", "submit"\]\.includes\(requestedView\)/);
  assert.match(workbook, /!editorialPdfMode && displayedActiveTab === "submit"/);
  assert.match(workbook, /readOnly=\{editorialPdfMode\}/);
  const published = get("web/src/components/PublishedHoerenPractice.jsx");
  assert.match(published, /if \(readOnly \|\| !complete \|\| busy \|\| !lesson\) return/);
  assert.match(published, /readOnly \? null : <button/);
  assert.match(workbook, /data-a2-editorial-print=\{editorialPdfMode \? "read-only"/);
});

test("editorial Playwright mode fails closed on public/non-loopback Falowen URLs", () => {
  assert.match(renderer, /FALOWEN_A2_EDITORIAL_PRINT === "true"/);
  assert.match(renderer, /target\.port !== "4173"/);
  assert.match(renderer, /localhost"\]\.includes\(target\.hostname\)/);
  assert.match(renderer, /await page\.addInitScript\(\(\) => \{/);
  assert.match(renderer, /Object\.defineProperty\(window, "__FALOWEN_A2_PDF_EDITORIAL__"/);
  assert.match(renderer, /a2EditorialLocal\) \{/);
  assert.doesNotMatch(renderer, /FALOWEN_A2_EDITORIAL_PRINT.*setDoc/);
});
