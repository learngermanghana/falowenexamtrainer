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
  return Boolean(l.completedAt && h.completedAt && w.submittedAt && ["t1_questions", "t1_answers", "t2_main", "t2_followups", "t3_plan"].every(k => s[k]?.transcript));
};
export const canReviewFullMock = (exam) => Boolean(exam?.completed &&
  ["lesen", "hoeren", "schreiben", "sprechen"].every(key => Object.prototype.hasOwnProperty.call(exam.sectionScores || {}, key)));

export const restoreFullMockReviewState = (exam) => {
  if (exam.stage !== "result" || canReviewFullMock(exam)) return exam;
  const stage = ["lesen", "hoeren", "schreiben", "sprechen"].find(
    key => !Object.prototype.hasOwnProperty.call(exam.sectionScores || {}, key),
  ) || "sprechen";
  return { ...exam, stage, completed: false };
};
