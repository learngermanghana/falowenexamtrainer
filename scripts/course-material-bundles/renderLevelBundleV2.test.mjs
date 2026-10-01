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

test("renderer version identifies the auth-persistence fix", () => {
  assert.match(source, /rendererVersion: 7/);
});
