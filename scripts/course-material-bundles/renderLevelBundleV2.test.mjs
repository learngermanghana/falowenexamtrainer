import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const source = fs.readFileSync(path.join(__dirname, "renderLevelBundleV2.mjs"), "utf8");

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
