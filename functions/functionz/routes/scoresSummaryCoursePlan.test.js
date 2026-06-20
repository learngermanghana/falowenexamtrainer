"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { getAssignmentSummary } = require("./scoresSummaryCoursePlan");

test("A1 split tasks use visible Course Book days and chapters", () => {
  const { lessons, plannedSet } = getAssignmentSummary("A1");
  const alphabet = lessons.find((item) => item.assignmentId === "A1-0.2");
  const pronouns = lessons.find((item) => item.assignmentId === "A1-1.1" && item.submissionRequired);

  assert.equal(alphabet.displayDay, 2);
  assert.equal(pronouns.displayDay, 2);
  assert.match(alphabet.label, /^Day 2 0\.2:/);
  assert.match(pronouns.label, /^Day 2 1\.1:/);
  assert.equal(plannedSet.has("A1-0.2"), true);
  assert.equal(plannedSet.has("A1-1.1"), true);
});

test("A1 self-study items expose completion keys for Course Book progress", () => {
  const { lessons } = getAssignmentSummary("A1");
  const practice = lessons.find((item) => item.assignmentId === "A1-1.1-PRACTICE");

  assert.ok(practice);
  assert.equal(practice.selfStudy, true);
  assert.equal(practice.submissionRequired, false);
  assert.equal(practice.displayDay, 3);
  assert.ok(practice.practiceKeys.includes("A1-1.1-PRACTICE"));
  assert.ok(practice.practiceKeys.includes("A1-DAY-3-PRACTICE-1.1"));
});
