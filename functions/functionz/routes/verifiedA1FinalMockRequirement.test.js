"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { isVerifiedA1FinalMockScore, loadVerifiedA1FinalMockScore } = require("./verifiedA1FinalMockRequirement");

const verified = {
  assignmentId: "A1-FINAL-MOCK",
  level: "A1",
  studentCode: "A1-123",
  uid: "uid-123",
  source: "a1_final_mock",
  mockId: "a1-mock-01",
  firstAttempt: true,
  attempt: 1,
  scoredModules: ["lesen", "hoeren", "schreiben", "sprechen"],
  score: 65,
  date: "2026-11-02T00:00:00.000Z",
};

test("only the server-verified first attempt can fulfill the A1 final-mock requirement", () => {
  assert.equal(isVerifiedA1FinalMockScore(verified, { studentCode: "A1-123", uid: "uid-123" }), true);
  for (const changed of [
    { assignmentId: "A1-FINAL-MOCK-PRACTICE-2" },
    { assignmentId: "A1-5.10" },
    { source: "manual_sheet" },
    { mockId: "a1-mock-02" },
    { firstAttempt: false, attempt: 2 },
    { scoredModules: ["lesen", "schreiben"] },
    { uid: "other-student" },
    { studentCode: "other-student" },
    { score: "not-marked" },
  ]) {
    assert.equal(isVerifiedA1FinalMockScore({ ...verified, ...changed }, {
      studentCode: "A1-123", uid: "uid-123",
    }), false);
  }
});

test("score-sheet lag cannot hide the first verified Firestore result", async () => {
  const db = { collection(name) {
    assert.equal(name, "scores");
    return { where(field, operator, code) {
      assert.deepEqual([field, operator, code], ["studentCode", "==", "A1-123"]);
      return { async get() { return { docs: [
        { data: () => ({ ...verified, score: 60 }) },
        { data: () => ({ ...verified, assignmentId: "A1-FINAL-MOCK-PRACTICE-2", score: 100 }) },
      ] }; } };
    } };
  } };
  const result = await loadVerifiedA1FinalMockScore({ db, studentCode: "A1-123", uid: "uid-123" });
  assert.equal(result.identifier, "A1-FINAL-MOCK");
  assert.equal(result.score, 60);
  assert.equal(result.link, "/campus/course/a1-final-mock-exam");
});
