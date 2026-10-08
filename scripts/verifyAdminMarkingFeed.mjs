import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { getA2GoetheWritingTasks } from "../web/src/data/a2GoetheWritingTasks.js";

const tasks = getA2GoetheWritingTasks();
assert.equal(tasks.length, 28, "The learner-side A2 contract must publish all 28 tasks");
assert.equal(new Set(tasks.map(task => task.assignmentKey)).size, 28);
for (const task of tasks) {
  assert.match(task.assignmentKey, /^A2-\d+\.\d+$/);
  assert.equal(task.points.length, 3, task.assignmentKey);
  assert.ok(task.situation.length >= 45, task.assignmentKey);
}
const manifest = JSON.parse(readFileSync(new URL("../functions/data/answerKeyManifest.json", import.meta.url), "utf8"));
const day10 = Object.entries(manifest).filter(([, row]) => row.assignment_id === "A2-4.10");
assert.equal(day10.length, 1, "Day 10 must have only one canonical answer-key record");
assert.match(day10[0][0], /Stadt entdecken/i);
assert.equal(day10[0][1].answers.teil3.Answer1, "A) In der Touristeninformation");
assert.equal(day10[0][1].answers.teil4.Answer2, "B) 20 Euro");
const lesson = tasks.find(row => row.assignmentKey === "A2-4.10");
assert.match(lesson.situation, /Stadt oder in einem neuen Viertel/);
assert.match(lesson.points[2], /Treffpunkt/);
assert.doesNotMatch(lesson.situation, /zu einem Fest einladen/);

const server = readFileSync(new URL("../functions/functionz/paymentAwareApp.js", import.meta.url), "utf8");
assert.match(server, /app\.get\("\/internal\/marking-manifest"/);
assert.match(server, /getAuthedUser\(req\)/);
assert.match(server, /Staff access required/);
assert.match(server, /private, no-store/);
assert.match(server, /require\\("\\.\\.\\/data\\/a2GoetheWritingTasks\\.json"\\)/);
assert.doesNotMatch(server, /await import\\("\\.\\.\\/\\.\\.\\/web\\//, "Runtime must not depend on sibling web/ files");
const packaged = JSON.parse(readFileSync(new URL("../functions/data/a2GoetheWritingTasks.json", import.meta.url), "utf8"));
assert.equal(Object.keys(packaged).length, 28);
for (const task of tasks) {
  const item = packaged[task.assignmentKey];
  assert.ok(item, "Packaged task missing: " + task.assignmentKey);
  assert.deepEqual(item, {
    day: task.day,
    assignmentKey: task.assignmentKey,
    title: task.title,
    situation: task.situation,
    points: [...task.points],
  }, "Packaged function task must exactly match learner coursebook: " + task.assignmentKey);
}

console.log("PASS: 28 A2 writing contracts, Day 10 key alignment, and staff-only live API route");
