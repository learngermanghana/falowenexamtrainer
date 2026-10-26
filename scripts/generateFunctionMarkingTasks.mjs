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

// Publish the exact B1 situations and source texts used by all 28 workbooks.
const { getB1WritingTasks } = await import('../web/src/data/b1WritingTasks.js');
const b1Tasks = getB1WritingTasks();
assert.equal(b1Tasks.length, 28);
const b1Snapshot = Object.fromEntries(b1Tasks.map(task => [task.assignmentKey, {
  assignmentKey: task.assignmentKey, title: task.title,
  situation: [task.instructions, task.sourceText].filter(Boolean).join('\n\n'),
  points: [...(task.taskPoints || [])],
  submissionNote: task.submissionNote || '',
}]));
const b1Target = new URL('../functions/data/b1WritingTasks.json', import.meta.url);
const b1Expected = JSON.stringify(b1Snapshot, null, 2) + '\n';
if (process.argv.includes('--check')) assert.equal(readFileSync(b1Target, 'utf8'), b1Expected, 'B1 writing snapshot is stale');
else writeFileSync(b1Target, b1Expected);
console.log('Verified canonical writing contracts for all 28 B1 days');

// Day 20's two teacher-authored task contexts are also used by Mark My Letter.
const a1Source = readFileSync(new URL('../web/src/components/A1Day20LetterWritingWorkbookPage.js', import.meta.url), 'utf8');
const contexts = [...a1Source.matchAll(/taskContext="([^"]+)"/g)].map(match => match[1]);
assert.equal(contexts.length, 2);
const a1Snapshot = { 'A1-12.3': {
  assignmentKey: 'A1-12.3', title: 'Einladung an Julia und Anfrage an Sprachakademie München',
  situation: contexts.map((text, index) => `Teil ${index + 1}: ${text}`).join('\n\n'),
  points: contexts.flatMap((text, index) => [...text.matchAll(/\(\d\)\s*(.*?)(?=,\s*\(\d\)|\.\s*Check|$)/g)].map(match => `Teil ${index + 1}: ${match[1].trim()}`)),
  taskVersion: 'A1-12.3-INVITATION-COURSE-V2',
}};
assert.equal(a1Snapshot['A1-12.3'].points.length, 6);
const a1Target = new URL('../functions/data/a1WritingTasks.json', import.meta.url);
const a1Expected = JSON.stringify(a1Snapshot, null, 2) + '\n';
if (process.argv.includes('--check')) assert.equal(readFileSync(a1Target, 'utf8'), a1Expected, 'A1 writing snapshot is stale');
else writeFileSync(a1Target, a1Expected);
