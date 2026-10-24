import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const renderer = fs.readFileSync(path.join(root, "scripts/course-material-bundles/prepareA1BookEditions.mjs"), "utf8");
const workflow = fs.readFileSync(path.join(root, ".github/workflows/course-material-bundle.yml"), "utf8");

test("reviewed A1 workbook is never published as a full public Actions artifact", () => {
  assert.match(workflow, /Upload consolidated PDF for other levels/);
  assert.match(workflow, /inputs\.build_pdf && inputs\.level != 'A1'/);
  assert.match(workflow, /Falowen-A1-free-Day1-sample/);
  const fullUpload = workflow.match(/- name: Upload consolidated PDF for other levels[\s\S]*?(?=\n      - name:|\s*$)/)?.[0];
  assert.ok(fullUpload, "non-A1 upload step must be present");
  assert.match(fullUpload, /inputs\.level != 'A1'/);
  assert.doesNotMatch(workflow, /Upload consolidated level PDF\n\s*if:\s*\$\{\{ inputs\.build_pdf \}\}/);
});

test("failed A1 builds can publish JSON diagnostics but no complete workbook", () => {
  const a1Diagnostics = workflow.match(/- name: Upload A1 render diagnostics on failure[\s\S]*?(?=\n      - name:|\s*$)/)?.[0];
  assert.ok(a1Diagnostics);
  assert.match(a1Diagnostics, /render-diagnostics\.json/);
  assert.doesNotMatch(a1Diagnostics, /rendered-lessons|Falowen-A1-Course-Materials\.pdf/);
  const proofUpload = workflow.match(/- name: Upload Falowen Press editorial proof[\s\S]*?(?=\n      - name:|\s*$)/)?.[0];
  assert.ok(proofUpload);
  assert.match(proofUpload, /inputs\.level != 'A1'/);
});

test("A1 sample is based on the actual Day 1 notes and workbook, not the complete file", () => {
  assert.match(renderer, /sampleFirstSourcePage = 4/);
  assert.match(renderer, /sampleLastSourcePage = 15/);
  assert.match(renderer, /sample\.getPageCount\(\) !== 14/);
  assert.match(renderer, /PRIVATE, NOT YET LICENSE-CLEARED/);
  assert.match(renderer, /Editorial review copy - not for sale/);
  assert.match(renderer, /\/web\/public\|public\|web\/dist/);
});

test("all other course levels keep their established PDF uploads", () => {
  const s = workflow.match(/- name: Upload consolidated PDF for other levels[\s\S]*?(?=\n      - name:|\s*$)/)?.[0];
  assert.ok(s);
  assert.match(s, /Falowen-\$\{\{ inputs\.level \}\}-course-materials-pdf/);
  assert.match(s, /retention-days: 30/);
});
