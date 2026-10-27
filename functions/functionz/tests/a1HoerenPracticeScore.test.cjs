"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { getA1MockSet } = require("../a1MockSets");
const { A1_HOEREN_PRACTICE_MOCK_IDS, ANSWER_IDS, scoreA1HoerenPractice } = require("../a1HoerenPracticeScore");

test("standalone A1 Hören practice reuses exactly Mocks 04–08 and 6/4/5 private keys", () => {
  assert.deepEqual(A1_HOEREN_PRACTICE_MOCK_IDS, [
    "a1-mock-04", "a1-mock-05", "a1-mock-06", "a1-mock-07", "a1-mock-08",
  ]);
  assert.equal(ANSWER_IDS.length, 15);
  for (const mockId of A1_HOEREN_PRACTICE_MOCK_IDS) {
    const answers = getA1MockSet(mockId).listeningAnswerKey;
    assert.deepEqual(Object.keys(answers), ANSWER_IDS);
    const result = scoreA1HoerenPractice({ mockId, answers });
    assert.equal(result.correct, 15);
    assert.equal(result.total, 15);
    assert.equal(result.percent, 100);
    assert.equal(result.passed, true);
    assert.deepEqual(result.sectionScores, { teil1: 6, teil2: 4, teil3: 5 });
    assert.deepEqual(result.correctAnswers, answers);
  }
});

test("server is authoritative and rejects incomplete, forged, or unsupported Hören answers", () => {
  const mockId = "a1-mock-08";
  const keys = getA1MockSet(mockId).listeningAnswerKey;
  assert.throws(() => scoreA1HoerenPractice({ mockId, answers: {} }), /Answer all 15/);
  assert.throws(() => scoreA1HoerenPractice({ mockId, answers: { ...keys, extra: "a" } }), /Answer all 15/);
  assert.throws(() => scoreA1HoerenPractice({ mockId, answers: { ...keys, "t2-1": "a" } }), /valid answer/);
  assert.throws(() => scoreA1HoerenPractice({ mockId:"a1-mock-03", answers:keys }), /not found/);
  const withIncorrectAnswer = { ...keys, "t1-1": keys["t1-1"] === "a" ? "b" : "a" };
  const result = scoreA1HoerenPractice({ mockId, answers: withIncorrectAnswer });
  assert.equal(result.correct, 14);
  assert.equal(result.sectionScores.teil1, 5);
  assert.equal(result.percent, 93);
});
