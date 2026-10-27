import { getGradedTabDurationMinutes, MINUTES_PER_GRADED_TAB } from "./gradedTabTiming";

describe("CEFR graded-tab timer policy", () => {
  test("regular A2, B1 and B2 assessments use 10 minutes per distinct graded tab", () => {
    expect(MINUTES_PER_GRADED_TAB).toBe(10);
    for (const level of ["A2", "B1", "B2"]) {
      expect(getGradedTabDurationMinutes({ level, timedTabs: ["lesen"] })).toBe(10);
      expect(getGradedTabDurationMinutes({ level, timedTabs: ["schreiben", "lesen"] })).toBe(20);
      expect(getGradedTabDurationMinutes({ level, timedTabs: ["schreiben", "lesen", "hoeren"] })).toBe(30);
    }
  });

  test("count only graded work, not notes, speaking practice or duplicate sections", () => {
    expect(getGradedTabDurationMinutes({
      level: "A2",
      timedTabs: ["grammar", "sprechen", "lesen", "lesen", "references", "submit"],
    })).toBe(10);
    expect(getGradedTabDurationMinutes({
      level: "B2", timedTabs: ["grammar", "speak", "review", "references"],
    })).toBeNull();
  });

  test("removes B1 workbook exceptions but preserves actual full mock exam timing", () => {
    expect(getGradedTabDurationMinutes({
      level: "B1", assignmentKey: "B1-7.22",
      timedTabs: ["lesen", "hoeren"], configuredDurationMinutes: 55,
    })).toBe(20);
    for (const key of ["B1-10.27", "B1-10.28"]) {
      expect(getGradedTabDurationMinutes({
        level: "B1", assignmentKey: key,
        timedTabs: ["schreiben", "lesen", "hoeren"], mode: "practice",
        configuredDurationMinutes: 60,
      })).toBe(30);
    }
    expect(getGradedTabDurationMinutes({
      level: "A2", assignmentKey: "A2-10.27",
      timedTabs: ["lesen", "hoeren"], mode: "mock", configuredDurationMinutes: 45,
    })).toBe(45);
  });

  test("leaves A1 outside the new automatic timing policy", () => {
    expect(getGradedTabDurationMinutes({
      level: "A1", timedTabs: ["lesen"], configuredDurationMinutes: 25,
    })).toBe(25);
  });
});
