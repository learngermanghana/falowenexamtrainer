import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const source = (path) => readFile(new URL(path, root), "utf8");

const loadZonedScheduleModule = async () => {
  const utilitySource = await source("src/lib/zonedScheduleDate.js");
  const runnableSource = utilitySource.replace(
    'import { toDate } from "./dateUtils";',
    `const toDate = (value) => {
      if (!value) return null;
      if (value instanceof Date) return value;
      const parsed = new Date(value);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    };`,
  );
  const encoded = Buffer.from(runnableSource).toString("base64");
  return import(`data:text/javascript;base64,${encoded}#${Date.now()}`);
};

test("Falowen keeps exact later Goethe registration campaigns as fallback", async () => {
  const schedule = await source("src/data/goetheExamSchedule.js");
  assert.match(schedule, /A1[\s\S]*2026-08-03/);
  assert.match(schedule, /A2[\s\S]*2026-08-04/);
  assert.match(schedule, /A2[\s\S]*2026-10-27/);
  assert.match(schedule, /B1[\s\S]*2026-08-05/);
  assert.match(schedule, /B1[\s\S]*2026-10-28/);
  assert.match(schedule, /timezone: "Africa\/Accra"/);
  assert.match(schedule, /reminderDays: \[14, 3, 2, 1\]/);
});

test("shared loader uses the Admin endpoint and a last-known-good cache", async () => {
  const service = await source("src/services/goetheExamConfigService.js");
  assert.match(service, /cloudfunctions\.net\/api\/exam-file\/config/);
  assert.match(service, /falowen_goethe_exam_config_v1/);
  assert.match(service, /7 \* 24 \* 60 \* 60 \* 1000/);
  assert.match(service, /defaultGoetheExamConfig/);
});

test("Exam File and Study Calendar react when the shared Admin config arrives", async () => {
  const [patch, hook] = await Promise.all([
    source("scripts/patch-goethe-exam-config-ui.mjs"),
    source("src/hooks/useGoetheExamConfig.js"),
  ]);
  assert.match(patch, /MyExamFilePage\.js/);
  assert.match(patch, /StudyCalendarPage\.js/);
  assert.match(patch, /Schedule synced from Falowen Admin/);
  assert.match(patch, /const goetheExamLevels = goetheExamConfig\.levels/);
  assert.match(patch, /\[detectedLevel, goetheExamLevels, showAllLevels\]/);
  assert.match(patch, /\[goetheExamLevels, selectedLevel\]/);
  assert.match(hook, /loadGoetheExamConfig/);
  assert.match(hook, /fallbackGoetheExamConfig/);
});

test("Exam File prioritizes visible Goethe registration guidance", async () => {
  const examFile = await source("src/components/MyExamFilePage.js");

  assert.match(examFile, /How to register for your Goethe exam/);
  assert.match(examFile, /Create or open Goethe account/);
  assert.match(examFile, /Official registration link/);
  assert.match(examFile, /Bookable to Open/);
  assert.match(examFile, /Register now/);
  assert.match(examFile, /goetheExamConfig\.timezone/);
  assert.match(examFile, /startOfScheduleDay\(exam\.registrationStart, scheduleTimeZone\)/);
  assert.match(examFile, /endOfScheduleDay\(exam\.registrationEnd, scheduleTimeZone\)/);
  assert.doesNotMatch(examFile, /\.setHours\(/);

  assert.doesNotMatch(examFile, /Submitted assignments \(locked\)/);
  assert.doesNotMatch(examFile, /Level leaderboard/);
  assert.doesNotMatch(examFile, /Teacher feedback history/);
  assert.doesNotMatch(examFile, /title="Downloadables"/);
});

test("registration boundaries use Africa/Accra even when the browser timezone is New York", async () => {
  const originalTimeZone = process.env.TZ;
  process.env.TZ = "America/New_York";

  try {
    const { startOfScheduleDay, endOfScheduleDay, formatScheduleDate } = await loadZonedScheduleModule();
    const opening = startOfScheduleDay("2026-08-03", "Africa/Accra");
    const closing = endOfScheduleDay("2026-08-03", "Africa/Accra");

    assert.equal(opening.toISOString(), "2026-08-03T00:00:00.000Z");
    assert.equal(closing.toISOString(), "2026-08-03T23:59:59.999Z");
    assert.equal(formatScheduleDate("2026-08-03", { timeZone: "Africa/Accra" }), "August 3, 2026");

    assert.ok(new Date("2026-08-02T23:59:59.999Z") < opening);
    assert.ok(new Date("2026-08-03T12:00:00.000Z") >= opening);
    assert.ok(new Date("2026-08-03T12:00:00.000Z") <= closing);
    assert.ok(new Date("2026-08-04T00:00:00.000Z") > closing);
  } finally {
    if (originalTimeZone === undefined) delete process.env.TZ;
    else process.env.TZ = originalTimeZone;
  }
});

test("timezone helper also supports configured non-UTC IANA zones", async () => {
  const { startOfScheduleDay, endOfScheduleDay } = await loadZonedScheduleModule();
  assert.equal(
    startOfScheduleDay("2026-08-03", "America/New_York").toISOString(),
    "2026-08-03T04:00:00.000Z",
  );
  assert.equal(
    endOfScheduleDay("2026-08-03", "America/New_York").toISOString(),
    "2026-08-04T03:59:59.999Z",
  );
});

test("build lifecycle always applies the idempotent shared-config patch", async () => {
  const packageJson = JSON.parse(await source("package.json"));
  assert.match(packageJson.scripts.prebuild, /sync:goethe-config-ui/);
  assert.match(packageJson.scripts.prestart, /sync:goethe-config-ui/);
  assert.equal(packageJson.scripts["sync:goethe-config-ui"], "node scripts/patch-goethe-exam-config-ui.mjs");
});
