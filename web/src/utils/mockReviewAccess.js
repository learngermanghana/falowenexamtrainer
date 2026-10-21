export const getStudentMockStorageKey = (baseKey, userId) => `${baseKey}:${userId || "guest"}`;

export const A2_MOCK_2_STORAGE = Object.freeze({
  flow: "falowen:a2:mock-02:full-flow:v2",
  lesen: "falowen:a2:mock-02:lesen:v1",
  hoeren: "falowen:a2:mock-02:hoeren:v1",
  schreiben: "falowen:a2:mock-02:schreiben:v1",
  sprechen: "falowen:a2:mock-02:sprechen:v1",
});
export const getA2Mock2StorageKeys = (userId) => Object.fromEntries(
  Object.entries(A2_MOCK_2_STORAGE).map(([name, key]) => [name, getStudentMockStorageKey(key, userId)]),
);
export const readMockState = (key) => {
  try { return JSON.parse(window.localStorage.getItem(key) || "null") || {}; }
  catch { return {}; }
};
export const isA2Mock2ReviewReady = (keys) => {
  const l = readMockState(keys.lesen), h = readMockState(keys.hoeren);
  const w = readMockState(keys.schreiben), s = readMockState(keys.sprechen);
  const conversationalComplete = ["1", "2", "3"].every(part =>
    Boolean(s._examinerParts?.[part]?.sessionId && s._examinerParts?.[part]?.assessment));
  const originalComplete = ["t1_questions", "t1_answers", "t2_main", "t2_followups", "t3_plan"]
    .every(k => Boolean(s[k]?.transcript));
  return Boolean(l.completedAt && h.completedAt && w.submittedAt && (conversationalComplete || originalComplete));
};
export const canReviewFullMock = (exam) => Boolean(exam?.completed &&
  ["lesen", "hoeren", "schreiben", "sprechen"].every(key => Object.prototype.hasOwnProperty.call(exam.sectionScores || {}, key)));

export const restoreFullMockReviewState = (exam) => {
  // A submitted writing response may still await AI grading after Sprechen.
  // Preserve the final pending-review screen instead of rolling a learner back
  // into Schreiben and making them repeat work.
  if (exam.stage !== "result" || exam.writingPending === true || canReviewFullMock(exam)) return exam;
  const stage = ["lesen", "hoeren", "schreiben", "sprechen"].find(
    key => !Object.prototype.hasOwnProperty.call(exam.sectionScores || {}, key),
  ) || "sprechen";
  return { ...exam, stage, completed: false };
};
