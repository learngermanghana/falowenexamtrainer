"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { isA2SpeakingAttemptBindingSafe } = require("../a2MockSpeakingAttemptIdentity");

test("Mock 2 must never carry an attempt ID from the verified Mock 1 flow", () => {
  assert.equal(isA2SpeakingAttemptBindingSafe({ mockId: "a2-mock-02", attemptId: "valid-mock-1-attempt" }), false);
  assert.equal(isA2SpeakingAttemptBindingSafe({ mockId: "a2-mock-02", attemptId: "  a2-final-attempt " }), false);
});

test("Mock 2 may request unverified practice feedback without an attempt ID", () => {
  assert.equal(isA2SpeakingAttemptBindingSafe({ mockId: "a2-mock-02", attemptId: "" }), true);
  assert.equal(isA2SpeakingAttemptBindingSafe({ mockId: "a2-mock-02" }), true);
});

test("Mock 1 verified scoring may still provide its own attempt ID", () => {
  assert.equal(isA2SpeakingAttemptBindingSafe({ mockId: "a2-mock-01", attemptId: "a2-final-attempt" }), true);
});
