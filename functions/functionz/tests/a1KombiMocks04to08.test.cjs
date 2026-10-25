"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { getA1MockSet, validateA1MockId, scoreA1KombiForm } = require("../a1MockSets");
const { buildVerifiedA1MockScore, buildA1MockCompletionArtifacts, persistVerifiedA1MockSection, syncA1MockCompletion, READING_ANSWER_KEY, LISTENING_ANSWER_KEY } = require("../a1MockCompletionSync");
const { mockTaskPrompt, mockTaskVersion } = require("../assessmentTaskContext");
const tasks = require("../a1KombiMarkingSets");

const mockIds = [4, 5, 6, 7, 8].map(number => `a1-mock-0${number}`);
const receipts = (schreiben = 20, sprechen = 15) => ({
  schreiben: { verified: true, score: schreiben },
  sprechen: { verified: true, score: sprechen },
});
const attempt = (mockId, answers = getA1MockSet(mockId).readingAnswerKey) => ({
  mockId, assessmentVersion: "three-module-v1", lesenAnswers: answers,
});

for (const mockId of mockIds) {
  test(`${mockId}: complete server-owned answer keys and distinct rubric`, () => {
    assert.equal(validateA1MockId(mockId), mockId);
    const key = getA1MockSet(mockId).readingAnswerKey;
    assert.deepEqual(Object.keys(key).sort(), [
      ...Array.from({ length: 5 }, (_, i) => `t1-${i + 1}`),
      ...Array.from({ length: 5 }, (_, i) => `t2-${i + 6}`),
      ...Array.from({ length: 5 }, (_, i) => `t3-${i + 11}`),
    ].sort());
    assert.ok(Object.entries(key).every(([id, value]) =>
      id.startsWith("t2-") ? ["a", "b"].includes(value) : ["richtig", "falsch"].includes(value)
    ));
    assert.equal(tasks[mockId].form.length, 5);
    assert.equal(tasks[mockId].writing.points.length, 3);
    assert.equal(tasks[mockId].speaking.tasks.length, 3);
    assert.equal(mockTaskVersion("A1", "writing", mockId), `${mockId}-writing-v1`);
    assert.equal(mockTaskVersion("A1", "speaking", mockId), `${mockId}-speaking-v1`);
    assert.match(mockTaskPrompt("A1", "writing", undefined, mockId), /AUTHORITATIVE TASK DATA/);
    assert.ok(mockTaskPrompt("A1", "writing", undefined, mockId).includes(tasks[mockId].writing.situation));
  });

  test(`${mockId}: full form and missing form answer are marked privately`, () => {
    const values = Object.fromEntries(tasks[mockId].form.map(field => [field.number, field.answer.split(" / ")[0]]));
    assert.equal(scoreA1KombiForm(mockId, values).score, 10);
    delete values[5];
    assert.equal(scoreA1KombiForm(mockId, values).score, 8);
    assert.equal(scoreA1KombiForm(mockId, {}).score, 0);
  });

  test(`${mockId}: Lesen + verified AI sections form a /75 result without Hören`, () => {
    const serverKey = getA1MockSet(mockId).readingAnswerKey;
    const spoofed = {
      ...attempt(mockId, serverKey),
      hoerenAnswers: { "t1-1": "a" },
      sectionScores: { lesen: 0, hoeren: 25, schreiben: 25, sprechen: 25 },
      overall: { score: 1000, maxScore: 1000 },
    };
    const scored = buildVerifiedA1MockScore({ mockId, state: spoofed, verifiedSections: receipts(20, 15) });
    assert.deepEqual(scored.sectionScores, { lesen: 25, schreiben: 20, sprechen: 15 });
    assert.deepEqual(scored.objective.lesen.correct, 15);
    assert.equal(scored.objective.hoeren, undefined);
    assert.deepEqual(scored.overall, {
      score: 80, maxScore: 100, points: 60, maxPoints: 75,
      assessmentVersion: "three-module-v1",
      sections: ["lesen", "schreiben", "sprechen"], passed: true,
    });
    const noCorrect = Object.fromEntries(Object.keys(serverKey).map(key => [key, ""]));
    const failed = buildVerifiedA1MockScore({ mockId, state: attempt(mockId, noCorrect), verifiedSections: receipts(0, 0) });
    assert.equal(failed.overall.score, 0);
    assert.equal(failed.overall.passed, false);
  });

  test(`${mockId}: missing AI receipts, wrong paper and future version fail closed`, () => {
    const key = getA1MockSet(mockId).readingAnswerKey;
    assert.throws(() => buildVerifiedA1MockScore({ mockId, state: attempt(mockId, key), verifiedSections: {} }),
      /Server-verified schreiben/);
    assert.throws(() => buildVerifiedA1MockScore({ mockId, state: attempt(mockId, key), verifiedSections: { schreiben: receipts().schreiben } }),
      /Server-verified sprechen/);
    assert.throws(() => buildVerifiedA1MockScore({ mockId, state: { ...attempt(mockId), mockId: "a1-mock-01" }, verifiedSections: receipts() }),
      /different paper/);
    assert.throws(() => buildVerifiedA1MockScore({ mockId, state: { ...attempt(mockId), assessmentVersion: "four-module-v3" }, verifiedSections: receipts() }),
      /Unsupported.*version/);
  });

  test(`${mockId}: Result and Admin records identify exactly three skills`, () => {
    const score = buildVerifiedA1MockScore({ mockId, state: attempt(mockId), verifiedSections: receipts(20, 15) });
    const saved = buildA1MockCompletionArtifacts({
      mockId, authedUser: { uid: "student-001", email: "learner@example.invalid" },
      attemptId: `attempt-${mockId}`, attemptNumber: 1, firstAttempt: true,
      overall: score.overall, sectionScores: score.sectionScores,
      now: new Date("2026-10-25T12:00:00Z"),
    });
    assert.equal(saved.scoreDocument.assignmentId, `A1-MOCK-${mockId.slice(-2)}`);
    assert.equal(saved.scoreDocument.maxPoints, 75);
    assert.equal(saved.scoreDocument.assessmentVersion, "three-module-v1");
    assert.equal(saved.scoreDocument.scoreBreakdown.length, 3);
    assert.deepEqual(saved.scoreDocument.scoreBreakdown.map(x => x.key), ["lesen", "schreiben", "sprechen"]);
    assert.equal(saved.scoreDocument.sectionScores.hoeren, undefined);
    assert.equal(saved.scoreDocument.link, `/campus/course/a1-final-mock-${Number(mockId.slice(-2))}`);
    assert.equal(saved.notificationDocument.data.hoeren, undefined);
  });
}

test("Hören upgrade is not silently applied to completed three-module results", () => {
  const mockId = "a1-mock-04";
  const original = buildVerifiedA1MockScore({ mockId, state: attempt(mockId), verifiedSections: receipts() });
  assert.equal(original.overall.maxPoints, 75);
  const newListening = getA1MockSet(mockId).listeningAnswerKey;
  assert.equal(Object.keys(newListening).length, 15);
  const upgraded = buildVerifiedA1MockScore({
    mockId,
    state: { ...attempt(mockId), assessmentVersion: "four-module-v2", hoerenAnswers: newListening },
    verifiedSections: receipts(),
  });
  assert.equal(upgraded.overall.maxPoints, 100);
  assert.equal(upgraded.overall.assessmentVersion, "four-module-v2");
  assert.equal(upgraded.sectionScores.hoeren, 25);
  assert.equal(upgraded.objective.hoeren.correct, 15);
  assert.equal(original.overall.maxPoints, 75);
  const oldFull = buildVerifiedA1MockScore({
    mockId: "a1-mock-01",
    state: { lesenAnswers: READING_ANSWER_KEY, hoerenAnswers: LISTENING_ANSWER_KEY },
    verifiedSections: receipts(25, 25),
  });
  assert.equal(oldFull.overall.maxScore, 100);
  assert.deepEqual(Object.keys(oldFull.sectionScores), ["lesen", "hoeren", "schreiben", "sprechen"]);
});

test("verified Sprechen/Schreiben receipts use student-owned attempt IDs", async () => {
  const writes = [];
  const stored = { uid: "learner-1", status: "in_progress" };
  const ref = {
    get: async () => ({ exists: true, data: () => stored }),
    update: async patch => { writes.push(patch); },
  };
  const db = { collection: () => ({ doc: () => ({ collection: () => ({ doc: () => ref }) }) }) };
  const admin = { firestore: { FieldValue: { serverTimestamp: () => "SERVER_TIMESTAMP" } } };
  const saved = await persistVerifiedA1MockSection({
    db, admin, uid: "learner-1", attemptId: "attempt-1", section: "sprechen", score: 18.5,
    source: "/speaking/a1-mock-score",
  });
  assert.equal(saved.verified, true);
  assert.equal(saved.score, 18.5);
  assert.equal(writes.length, 1);
  assert.equal(writes[0]["verifiedSections.sprechen"].score, 18.5);
  stored.uid = "another-student";
  await assert.rejects(persistVerifiedA1MockSection({
    db, admin, uid: "learner-1", attemptId: "attempt-1", section: "schreiben", score: 20,
  }), { code: "A1_MOCK_ATTEMPT_FORBIDDEN" });
  assert.equal(writes.length, 1);
});

test("completed three-skill result sync writes score and student notifications", async () => {
  const rows = [];
  let committed = false;
  const collection = path => ({ doc: id => ({
    path: `${path}/${id}`,
    collection: name => collection(`${path}/${id}/${name}`),
  }) });
  const db = {
    collection,
    batch: () => ({
      set: (ref, data, opts) => rows.push({ ref: ref.path, data, opts }),
      commit: async () => { committed = true; },
    }),
  };
  const admin = { firestore: { FieldValue: { serverTimestamp: () => "SERVER_TIMESTAMP" } } };
  const mockId = "a1-mock-08";
  const result = buildVerifiedA1MockScore({ mockId, state: attempt(mockId), verifiedSections: receipts() });
  const output = await syncA1MockCompletion({
    db, admin, mockId, authedUser: { uid: "student-008" },
    attemptId: "attempt-08", attemptNumber: 2, firstAttempt: false,
    overall: result.overall, sectionScores: result.sectionScores,
    now: new Date("2026-10-25T12:00:00Z"),
  });
  assert.equal(committed, true);
  assert.equal(output.ok, true);
  assert.equal(rows.length, 3);
  assert.ok(rows.some(x => x.ref.startsWith("scores/") && x.data.assignmentId === "A1-MOCK-08-PRACTICE-2"));
  assert.ok(rows.some(x => x.ref.startsWith("studentNotifications/") && x.data.data.hoeren === undefined));
  assert.ok(rows.some(x => x.ref.startsWith("students/student-008/notifications/")));
});
