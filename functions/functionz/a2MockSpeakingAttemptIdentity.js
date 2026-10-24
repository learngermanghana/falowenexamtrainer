"use strict";

// Mock 2 can be graded only when a server-read attempt confirms the same mock.
// A browser-supplied attemptId alone is not authoritative.
const isA2SpeakingAttemptBindingSafe = ({ mockId, attemptId, verifiedMockId } = {}) =>
  mockId !== "a2-mock-02" || !String(attemptId || "").trim() || verifiedMockId === mockId;

module.exports = { isA2SpeakingAttemptBindingSafe };
