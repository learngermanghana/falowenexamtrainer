import {
  READING_PRACTICE_HISTORY_KEY,
  getLatestReadingPracticeResult,
  getReadingPracticeHistory,
  getReadingReadinessLabel,
  getWeakestReadingSection,
  saveReadingPracticeAttempt,
} from "../services/readingPracticeHistory";

describe("reading practice history", () => {
  beforeEach(() => {
    window.localStorage.removeItem(READING_PRACTICE_HISTORY_KEY);
  });

  test("keeps attempts separate by student, level and set", () => {
    saveReadingPracticeAttempt({
      studentKey: "student-one",
      level: "A1",
      setId: "a1-reading-practice-01",
      score: 14,
      total: 17,
      elapsedSeconds: 900,
      sectionScores: [
        { label: "Teil 1", score: 6, total: 7 },
        { label: "Teil 2", score: 4, total: 5 },
        { label: "Teil 3", score: 4, total: 5 },
      ],
    });
    saveReadingPracticeAttempt({
      studentKey: "student-two",
      level: "A1",
      setId: "a1-reading-practice-01",
      score: 10,
      total: 17,
    });

    expect(getReadingPracticeHistory("A1", "student-one")).toHaveLength(1);
    expect(getReadingPracticeHistory("A1", "student-two")).toHaveLength(1);
    expect(getLatestReadingPracticeResult("A1", "student-one").score).toBe(14);
  });

  test("increments attempts only for the same student's same set", () => {
    const first = saveReadingPracticeAttempt({
      studentKey: "student-one",
      level: "A2",
      setId: "a2-reading-practice-01",
      score: 12,
      total: 20,
    });
    const second = saveReadingPracticeAttempt({
      studentKey: "student-one",
      level: "A2",
      setId: "a2-reading-practice-01",
      score: 16,
      total: 20,
    });

    expect(first.attemptNumber).toBe(1);
    expect(second.attemptNumber).toBe(2);
  });

  test("provides readiness and weakest-section feedback", () => {
    expect(getReadingReadinessLabel(80)).toBe("Strong");
    expect(getReadingReadinessLabel(65)).toBe("Developing");
    expect(getReadingReadinessLabel(45)).toBe("Practise again");

    expect(
      getWeakestReadingSection([
        { label: "Teil 1", score: 4, total: 5 },
        { label: "Teil 2", score: 2, total: 5 },
        { label: "Teil 3", score: 3, total: 5 },
      ]).label,
    ).toBe("Teil 2");
  });
});
