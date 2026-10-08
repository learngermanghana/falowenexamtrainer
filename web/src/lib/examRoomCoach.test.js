import { EXAM_SKILLS, buildExamRoomCoach } from "./examRoomCoach";

describe("Exam Room coach recommendations", () => {
  it("starts with a real section and no invented readiness score", () => {
    const coach = buildExamRoomCoach({ level: "A1" });
    expect(coach.coveredSkills).toBe(0);
    expect(coach.coveragePercent).toBe(0);
    expect(coach.latest).toBeNull();
    expect(coach.focus.route).toBe("/exams/lesen");
    expect(EXAM_SKILLS).toHaveLength(4);
  });

  it("accepts 0% as a scored attempt and recommends the weakest section", () => {
    const coach = buildExamRoomCoach({
      level: "A2",
      cloudResults: [
        { id: "one", level: "A2", section: "lesen", percent: 80, completedAt: "2026-10-06" },
        { id: "two", level: "A2", section: "hoeren", percent: 0, completedAt: "2026-10-07" },
      ],
    });
    expect(coach.coveredSkills).toBe(2);
    expect(coach.latest.percent).toBe(0);
    expect(coach.focus.key).toBe("hoeren");
    expect(coach.focus.reason).toContain("0%");
  });

  it("recommends the weakest reading Teil based on valid local denominators", () => {
    const coach = buildExamRoomCoach({
      level: "A1",
      localReading: [{
        id: "reading-123", level: "A1", setId: "sample1",
        score: 7, total: 15, completedAt: "2026-10-07",
        sectionScores: [
          { label: "Teil 1", score: 4, total: 5 },
          { label: "Teil 2", score: 1, total: 5 },
          { label: "Teil 3", score: 2, total: 5 },
        ],
      }],
    });
    expect(coach.focus.key).toBe("lesen");
    expect(coach.focus.weakPart).toBe("Teil 2");
  });

  it("does not double-count the same cloud and local reading attempt", () => {
    const coach = buildExamRoomCoach({
      level: "A1",
      cloudResults: [{
        id: "server-id", attemptId: "attempt-1", level: "A1",
        section: "lesen", percent: 60, completedAt: "2026-10-07",
      }],
      localReading: [{
        id: "attempt-1", level: "A1", score: 9, total: 15,
        completedAt: "2026-10-07",
      }],
    });
    expect(coach.attempts).toHaveLength(1);
  });

  it("filters levels, rejects missing scores and recommends an untried skill", () => {
    const coach = buildExamRoomCoach({
      level: "B1",
      cloudResults: [
        { id: "a", level: "A2", section: "hoeren", percent: 15 },
        { id: "b", level: "B1", section: "hoeren", percent: 90 },
        { id: "c", level: "B1", section: "sprechen" },
      ],
    });
    expect(coach.attempts).toHaveLength(1);
    expect(coach.focus.key).toBe("lesen");
    expect(coach.coveragePercent).toBe(25);
  });

  it("uses latest attempt for each skill rather than an old poor result", () => {
    const coach = buildExamRoomCoach({
      level: "A2",
      cloudResults: [
        { id: "first", level: "A2", section: "lesen", percent: 20, completedAt: "2026-10-05" },
        { id: "second", level: "A2", section: "lesen", percent: 90, completedAt: "2026-10-08" },
      ],
    });
    expect(coach.latestBySection.lesen.percent).toBe(90);
    expect(coach.focus.key).toBe("hoeren");
  });
});
