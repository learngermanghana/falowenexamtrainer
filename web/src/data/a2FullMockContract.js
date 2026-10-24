// Every publishable A2 full mock must use the server-verified A2 Mock 1 lifecycle.
// A question set alone is not a full exam. Keep unintegrated mocks as preview.
export const A2_FULL_MOCK_REQUIREMENTS = Object.freeze([
  "serverAttempt",
  "serverObjectiveScoring",
  "verifiedWriting",
  "verifiedSpeaking",
  "completedResultSync",
]);

export const A2_MOCK_CAPABILITIES = Object.freeze({
  "a2-final-01": Object.freeze({
    serverAttempt: true,
    serverObjectiveScoring: true,
    verifiedWriting: true,
    verifiedSpeaking: true,
    completedResultSync: true,
  }),
  "a2-mock-02": Object.freeze({
    serverAttempt: true,
    serverObjectiveScoring: true,
    verifiedWriting: true,
    verifiedSpeaking: true,
    completedResultSync: true,
  }),
});

export const missingA2FullMockCapabilities = (mockId) => {
  const capabilities = A2_MOCK_CAPABILITIES[mockId] || {};
  return A2_FULL_MOCK_REQUIREMENTS.filter((key) => capabilities[key] !== true);
};

export const assertA2FullMockReady = (exam) => {
  if (exam.level !== "A2" || exam.mode !== "full" || exam.status !== "ready") return exam;
  const missing = missingA2FullMockCapabilities(exam.id);
  if (missing.length) throw new Error(
    `A2 mock ${exam.id} cannot be published as a full exam without: ${missing.join(", ")}. Use preview until verified.`
  );
  return exam;
};
