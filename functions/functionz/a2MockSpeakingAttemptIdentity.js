"use strict";

// Mock 2 is a browser-stored practice attempt, not a verified A2 Final Mock
// attempt. Never let its score be persisted into a Mock 1 attempt ID.
const isA2SpeakingAttemptBindingSafe = ({ mockId, attemptId } = {}) =>
  mockId !== "a2-mock-02" || !String(attemptId || "").trim();

module.exports = { isA2SpeakingAttemptBindingSafe };
