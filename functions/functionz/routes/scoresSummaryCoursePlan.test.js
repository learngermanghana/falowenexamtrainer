"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { getAssignmentSummary, getCanonicalTutorRequirements } = require("./scoresSummaryCoursePlan");

test("A1 Day 2 is one combined assignment and Day 23 is the nineteenth requirement", () => {
  const { lessons, plannedSet } = getAssignmentSummary("A1");
  const day2 = lessons.filter((item) => item.dayNumber === 2 && item.submissionRequired);
  assert.equal(day2.length, 1);
  assert.equal(day2[0].assignmentId, "A1-0.2_1.1");
  assert.equal(plannedSet.has("A1-0.2"), false);
  assert.equal(plannedSet.has("A1-1.1"), false);

  const health = lessons.find((item) => item.assignmentId === "A1-14.1");
  assert.equal(health.dayNumber, 22);
  const mock = lessons.find((item) => item.assignmentId === "A1-FINAL-MOCK");
  assert.equal(mock.dayNumber, 23);
  assert.equal(mock.displayChapter, "5.10");
  assert.equal(mock.assessmentType, "final-mock");
  assert.equal(mock.submissionRequired, true);
  assert.equal(plannedSet.has("A1-FINAL-MOCK"), true);
  assert.equal(plannedSet.size, 19);
});

test("A2 recommendations are explicitly labelled as A2", () => {
  const { lessons } = getAssignmentSummary("A2");
  const firstLesson = lessons.find((item) => item.assignmentId === "A2-1.1");

  assert.ok(firstLesson);
  assert.match(firstLesson.label, /^A2 · Day 1 1\.1:/);
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


test("canonical tutor completion requirements match the Course Book totals", () => {
  const a1 = getCanonicalTutorRequirements("A1");
  const a2 = getCanonicalTutorRequirements("A2");
  const b1 = getCanonicalTutorRequirements("B1");

  assert.equal(a1.length, 19);
  assert.equal(a1[a1.length - 1].assignmentId, "A1-FINAL-MOCK");
  assert.equal(a1[a1.length - 1].day, 23);
  assert.equal(a1.some(x => x.assignmentId === "A1-14.1" && x.day === 22), true);
  assert.equal(a1.some(x => x.assignmentId === "A1-13.2"), false);
  assert.equal(a2.length, 28);
  assert.equal(b1.length, 28);
  assert.deepEqual(b1.map((item) => item.day), Array.from({ length: 28 }, (_, index) => index + 1));
  assert.equal(b1.some((item) => item.assignmentId === "B1-10.28"), true);
});
