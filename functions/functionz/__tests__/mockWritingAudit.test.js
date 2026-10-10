"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { writingAuditRecord, parseReviewId, saveMockWritingReview, getMockWritingReview } = require("../mockWritingAudit");

test("writing audit preserves writing and exact grading without exposing it in mock listing", () => {
  const result = { score: 7, maxScore: 25, parts: { teil1: { score: 2, feedback_en: "Missing content." } } };
  const audit = writingAuditRecord({ level: "A2", attemptId: "at1", answers: { sms: "Hallo!", email: "Liebe Mia" }, result, source: "/writing/a2-mock-score" });
  assert.equal(audit.answers.sms, "Hallo!");
  assert.deepEqual(audit.marking.parts, result.parts);
  assert.equal(audit.score, 7);
  assert.equal(audit.maxScore, 25);
});
test("A1 structured form values stay intact for marking audit", () => {
  const audit = writingAuditRecord({ level: "A1", attemptId: "abc", answers: { formValues: { firstName: "Ama", date: "Montag" }, text: "Guten Tag" }, result: { score: 20 } });
  assert.deepEqual(audit.answers.formValues, { firstName: "Ama", date: "Montag" });
});
test("staff review identifier cannot access arbitrary Firestore paths", () => {
  assert.equal(parseReviewId("A1:student:attempt").collection, "a1MockExamUsers");
  for (const id of ["C1:user:attempt", "A1:../admin:attempt", "A1:student:../attempt", "A1:student", "A1:student:attempt:extra"]) assert.equal(parseReviewId(id), null);
});
test("audit save updates existing attempt; never creates a phantom attempt", async () => {
  let wrote;
  const db = { collection: () => ({ doc: () => ({ collection: () => ({ doc: () => ({ update: async data => { wrote = data; } }) }) }) }) };
  await saveMockWritingReview({ db, level: "B1", uid: "student", attemptId: "attempt", answers: { teil1: "Text" }, result: { score: 12 } });
  assert.equal(wrote.writingReview.answers.teil1, "Text");
});
test("staff review returns not-recorded status for old attempts", async () => {
  const db = { collection: () => ({ doc: () => ({ collection: () => ({ doc: () => ({ get: async () => ({ exists: true, data: () => ({ mockId: "a1-mock-01" }) }) }) }) }) }) };
  const result = await getMockWritingReview(db, "A1:student:attempt");
  assert.equal(result.status, "not_recorded");
});
