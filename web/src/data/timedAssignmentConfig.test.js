import {
  getTimedAssignmentConfig,
  getTimedAssignmentDurationSeconds,
  getTimedAssignmentKeysForLevel,
  getTimedAssignmentPhase,
} from "./timedAssignmentConfig";

describe("shared timed assignment configuration", () => {
  test("starts A1 timed discipline in Week 4 and keeps final writing mocks", () => {
    expect(getTimedAssignmentPhase("A1")).toMatchObject({ startDay: 16, week: 4 });
    expect(getTimedAssignmentDurationSeconds("A1-9")).toBe(20 * 60);
    expect(getTimedAssignmentDurationSeconds("A1-10")).toBe(20 * 60);
    expect(getTimedAssignmentDurationSeconds("A1-11")).toBe(25 * 60);
    expect(getTimedAssignmentDurationSeconds("A1-12.1")).toBe(25 * 60);
    expect(getTimedAssignmentDurationSeconds("A1-12.2")).toBe(25 * 60);
    expect(getTimedAssignmentDurationSeconds("A1-12.3")).toBe(30 * 60);
    expect(getTimedAssignmentConfig("A1-12.3")?.mode).toBe("mock");
    expect(getTimedAssignmentDurationSeconds("A1-13")).toBe(35 * 60);
    expect(getTimedAssignmentDurationSeconds("A1-14.1")).toBe(35 * 60);
    expect(getTimedAssignmentConfig("A1-8")).toBeNull();
  });

  test("times every A2 tutor-marked workbook from Week 5 while excluding self-check Hören", () => {
    expect(getTimedAssignmentPhase("A2")).toMatchObject({ startDay: 21, week: 5 });
    expect(getTimedAssignmentKeysForLevel("A2")).toEqual([
      "A2-8.21",
      "A2-8.22",
      "A2-9.23",
      "A2-9.24",
      "A2-9.25",
      "A2-10.26",
      "A2-10.27",
      "A2-10.28",
    ]);
    expect(getTimedAssignmentConfig("A2-9.24")?.timedTabs).toEqual(["schreiben", "lesen"]);
    expect(getTimedAssignmentConfig("A2-10.26")?.timedTabs).toEqual(["schreiben", "lesen"]);
    expect(getTimedAssignmentConfig("A2-10.27")?.timedTabs).toEqual(["schreiben", "lesen", "hoeren"]);
    expect(getTimedAssignmentConfig("A2-10.28")?.mode).toBe("mock");
  });

  test("keeps B1 early checkpoints and times every tutor-marked workbook from Week 5", () => {
    expect(getTimedAssignmentPhase("B1")).toMatchObject({ startDay: 21, week: 5 });
    expect(getTimedAssignmentDurationSeconds("B1-6.18")).toBe(55 * 60);
    expect(getTimedAssignmentDurationSeconds("B1-6.19")).toBe(55 * 60);
    expect(getTimedAssignmentDurationSeconds("B1-7.21")).toBe(55 * 60);
    expect(getTimedAssignmentDurationSeconds("B1-7.22")).toBe(55 * 60);
    expect(getTimedAssignmentDurationSeconds("B1-7.23")).toBe(55 * 60);
    expect(getTimedAssignmentConfig("B1-8.24")?.timedTabs).toEqual(["schreiben", "lesen"]);
    expect(getTimedAssignmentConfig("B1-8.25")?.timedTabs).toEqual(["schreiben", "lesen"]);
    expect(getTimedAssignmentConfig("B1-9.26")?.timedTabs).toEqual(["schreiben", "lesen"]);
    expect(getTimedAssignmentConfig("B1-10.27")?.mode).toBe("mock");
    expect(getTimedAssignmentDurationSeconds("B1-10.28")).toBe(60 * 60);
  });

  test("all timed attempts keep automatic submission and ready-before-start guidance", () => {
    Object.values(
      Object.fromEntries(
        ["A1", "A2", "B1"].flatMap((level) =>
          getTimedAssignmentKeysForLevel(level).map((key) => [key, getTimedAssignmentConfig(key)]),
        ),
      ),
    ).forEach((config) => {
      expect(config?.autoSubmit).toBe(true);
      expect(config?.preparationLabel).toMatch(/Start the timer only when/i);
    });
  });
});
