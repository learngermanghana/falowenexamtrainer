// Keep the B1 mock's four-module completion flow explicit. This only
// describes UI progress; the backend remains authoritative for scores.
export const B1_MOCK_STEPS = Object.freeze([
  { key: "lesen", label: "Lesen", minutes: 65, practiceRoute: "/exams/lesen/b1/sample-1" },
  { key: "hoeren", label: "Hören", minutes: 40, practiceRoute: "/exams/horen/b1/sample-1" },
  { key: "schreiben", label: "Schreiben", minutes: 75, practiceRoute: "/exams/writing" },
  { key: "sprechen", label: "Sprechen", minutes: 20, practiceRoute: "/exams/speaking" },
]);

export const getB1MockProgress = (stage = "intro", sectionScores = {}) => {
  const currentIndex = B1_MOCK_STEPS.findIndex((step) => step.key === stage);
  const completed = B1_MOCK_STEPS.filter(({ key }) =>
    Object.prototype.hasOwnProperty.call(sectionScores || {}, key) &&
    Number.isFinite(Number(sectionScores[key]))
  ).length;
  const isComplete = stage === "result" && completed === B1_MOCK_STEPS.length;
  return {
    completed,
    total: B1_MOCK_STEPS.length,
    currentIndex,
    isComplete,
    nextStep: currentIndex >= 0 ? B1_MOCK_STEPS[currentIndex + 1] || null : null,
  };
};

export const getB1MockPracticeRecommendations = (sectionScores = {}) =>
  B1_MOCK_STEPS.filter(({ key }) => Number.isFinite(Number(sectionScores?.[key])) &&
    Object.prototype.hasOwnProperty.call(sectionScores || {}, key))
    .map((step) => ({ ...step, score: Number(sectionScores[step.key]) }))
    .sort((a, b) => a.score - b.score);
