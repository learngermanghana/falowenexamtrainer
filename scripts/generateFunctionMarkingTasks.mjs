// Build the Firebase-packaged A2 writing-task snapshot directly from the
// learner-facing coursebook. Only this script reads web/; the Cloud Function
// itself must never access files outside functions/.
import { readFileSync, writeFileSync } from "node:fs";
import assert from "node:assert/strict";
import { getA2GoetheWritingTasks } from "../web/src/data/a2GoetheWritingTasks.js";

const target = new URL("../functions/data/a2GoetheWritingTasks.json", import.meta.url);
const tasks = getA2GoetheWritingTasks();
assert.equal(tasks.length, 28, "Expected all 28 learner A2 writing tasks");
assert.equal(new Set(tasks.map(task => task.assignmentKey)).size, tasks.length);
const snapshot = Object.fromEntries(tasks.map(({ day, assignmentKey, title, situation, points }) => {
  assert.match(assignmentKey, /^A2-[0-9]+[.][0-9]+$/);
  assert.equal(points.length, 3, assignmentKey);
  return [assignmentKey, { day, assignmentKey, title, situation, points: [...points] }];
}));
const expected = JSON.stringify(snapshot, null, 2) + "\n";
const actual = (() => { try { return readFileSync(target, "utf8"); } catch { return ""; } })();
if (process.argv.includes("--check")) {
  assert.equal(actual, expected, "Firebase A2 writing-task snapshot is stale; run node scripts/generateFunctionMarkingTasks.mjs");
  console.log("PASS: Firebase-packaged A2 writing tasks match the learner coursebook");
} else {
  if (actual !== expected) writeFileSync(target, expected, "utf8");
  console.log("Generated Firebase writing-task snapshot for " + tasks.length + " A2 lessons");
}
