"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { getA1MockSet } = require("../a1MockSets");
const { validateA1MockAudioKey } = require("../r2CourseAudio");
const { isReleasedMockHoerenAudio } = require("../publishedMockHoerenAccess");
const { buildVerifiedA1MockScore, buildA1MockCompletionArtifacts } = require("../a1MockCompletionSync");
const keys = require("../a1Mock8ListeningKeys")["a1-mock-08"];
const mockId = "a1-mock-08";
const set = getA1MockSet(mockId);
const verified = { schreiben: { verified: true, score: 20 }, sprechen: { verified: true, score: 15 } };
const state = { mockId, lesenAnswers: set.readingAnswerKey };

test("Mock 08 validates three exact Cloudflare R2 MP3 keys and refuses unrelated paths", async () => {
  for (const i of [1, 2, 3]) {
    const key = `a1/mock-hoeren/mock-08/teil-${i}.mp3`;
    assert.equal(validateA1MockAudioKey({ mockId: "mock-08", part: `teil-${i}`, key })?.key, key);
    assert.equal(await isReleasedMockHoerenAudio({ db: null, level: "A1", mockId: "mock-08", part: `teil-${i}`, key }), true);
    assert.equal(validateA1MockAudioKey({ mockId: "mock-07", part: `teil-${i}`, key }), null);
  }
  assert.equal(await isReleasedMockHoerenAudio({ db: null, level: "A1", mockId: "mock-09", part: "teil-1", key: "a1/mock-hoeren/mock-09/teil-1.mp3" }), false);
});

test("Mock 08 exact 6/4/5 answer IDs remain server-only", () => {
  const expected = [...Array.from({ length: 6 }, (_, i) => `t1-${i + 1}`),
    ...Array.from({ length: 4 }, (_, i) => `t2-${i + 1}`),
    ...Array.from({ length: 5 }, (_, i) => `t3-${i + 1}`)];
  assert.deepEqual(Object.keys(keys), expected);
  assert.deepEqual(set.listeningAnswerKey, keys);
  assert.ok(Object.entries(keys).every(([key, value]) => key.startsWith("t2-")
    ? ["richtig", "falsch"].includes(value) : ["a", "b", "c"].includes(value)));
});

test("Mock 08 historic /75 attempts stay immutable, excluding Hören", () => {
  const scored = buildVerifiedA1MockScore({ mockId, state: { ...state, assessmentVersion: "three-module-v1", hoerenAnswers: keys }, verifiedSections: verified });
  assert.equal(scored.overall.maxPoints, 75);
  assert.deepEqual(Object.keys(scored.sectionScores), ["lesen", "schreiben", "sprechen"]);
  const output = buildA1MockCompletionArtifacts({ mockId, authedUser: { uid: "student" }, attemptId: "old-attempt", overall: scored.overall, sectionScores: scored.sectionScores });
  assert.equal(output.scoreDocument.maxPoints, 75);
  assert.equal(output.notificationDocument.data.hoeren, undefined);
});

test("Mock 08 new /100 attempts verify all four module grades on server", () => {
  const scored = buildVerifiedA1MockScore({ mockId, state: { ...state, assessmentVersion: "four-module-v2", hoerenAnswers: keys, overall: { score: 999 }, sectionScores: { hoeren: 0 } }, verifiedSections: verified });
  assert.equal(scored.objective.hoeren.correct, 15);
  assert.equal(scored.sectionScores.hoeren, 25);
  assert.equal(scored.overall.points, 85);
  assert.equal(scored.overall.maxPoints, 100);
  assert.equal(scored.overall.score, 85);
  const output = buildA1MockCompletionArtifacts({ mockId, authedUser: { uid: "student" }, attemptId: "new-attempt", overall: scored.overall, sectionScores: scored.sectionScores });
  assert.equal(output.scoreDocument.assessmentVersion, "four-module-v2");
  assert.equal(output.scoreDocument.scoreBreakdown.length, 4);
  assert.equal(output.notificationDocument.data.hoeren, "25");
});

test("Mock 08 cannot submit forged objective totals or unverified AI grades", () => {
  assert.throws(() => buildVerifiedA1MockScore({ mockId, state: { ...state, assessmentVersion: "four-module-v2", hoerenAnswers: keys, overall: { score: 100 } }, verifiedSections: {} }), /Server-verified schreiben/);
  const scored = buildVerifiedA1MockScore({ mockId, state: { ...state, assessmentVersion: "four-module-v2", hoerenAnswers: {}, sectionScores: { hoeren: 25 } }, verifiedSections: verified });
  assert.equal(scored.objective.hoeren.score, 0);
  assert.equal(scored.overall.maxPoints, 100);
});
