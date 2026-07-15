import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const source = (path) => readFile(new URL(path, root), "utf8");

test("Falowen keeps exact later Goethe registration campaigns as fallback", async () => {
  const schedule = await source("src/data/goetheExamSchedule.js");
  assert.match(schedule, /A1[\s\S]*2026-08-03/);
  assert.match(schedule, /A2[\s\S]*2026-08-04/);
  assert.match(schedule, /A2[\s\S]*2026-10-27/);
  assert.match(schedule, /B1[\s\S]*2026-08-05/);
  assert.match(schedule, /B1[\s\S]*2026-10-28/);
  assert.match(schedule, /reminderDays: \[14, 3, 2, 1\]/);
});

test("shared loader uses the Admin endpoint and a last-known-good cache", async () => {
  const service = await source("src/services/goetheExamConfigService.js");
  assert.match(service, /cloudfunctions\.net\/api\/exam-file\/config/);
  assert.match(service, /falowen_goethe_exam_config_v1/);
  assert.match(service, /7 \* 24 \* 60 \* 60 \* 1000/);
  assert.match(service, /defaultGoetheExamConfig/);
});

test("Exam File and Study Calendar are patched to the same hook", async () => {
  const [patch, hook] = await Promise.all([
    source("scripts/patch-goethe-exam-config-ui.mjs"),
    source("src/hooks/useGoetheExamConfig.js"),
  ]);
  assert.match(patch, /MyExamFilePage\.js/);
  assert.match(patch, /StudyCalendarPage\.js/);
  assert.match(patch, /Schedule synced from Falowen Admin/);
  assert.match(patch, /const goetheExamLevels = goetheExamConfig\.levels/);
  assert.match(hook, /loadGoetheExamConfig/);
  assert.match(hook, /fallbackGoetheExamConfig/);
});

test("build lifecycle always applies the idempotent shared-config patch", async () => {
  const packageJson = JSON.parse(await source("package.json"));
  assert.match(packageJson.scripts.prebuild, /sync:goethe-config-ui/);
  assert.match(packageJson.scripts.prestart, /sync:goethe-config-ui/);
  assert.equal(packageJson.scripts["sync:goethe-config-ui"], "node scripts/patch-goethe-exam-config-ui.mjs");
});
