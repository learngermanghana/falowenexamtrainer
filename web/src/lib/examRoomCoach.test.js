import { EXAM_SKILLS, buildExamRoomCoach, normalizeReadingPartScores } from "./examRoomCoach";

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


describe("final mocks and synced Lesen details", () => {
  const finalMock = {
    id: "cloud-mock-row", attemptId: "mock-a1-3", level: "A1",
    section: "mixed", resultType: "final_mock",
    percent: 62, completedAt: "2026-10-08T17:00:00Z",
    title: "A1 Final Mock Exam",
    route: "/campus/course/a1-final-mock-exam",
    sectionScores: { lesen: 22, hoeren: 10, schreiben: 15, sprechen: 15 },
    scoreBreakdown: [
      { key: "lesen", score: 22, maxScore: 25 },
      { key: "hoeren", score: 10, maxScore: 25 },
      { key: "schreiben", score: 15, maxScore: 25 },
      { key: "sprechen", score: 15, maxScore: 25 },
    ],
  };

  it("shows the full mock once in recent attempts and uses its four verified skill scores", () => {
    const coach = buildExamRoomCoach({ level: "A1", cloudResults: [finalMock] });
    expect(coach.attempts).toHaveLength(1);
    expect(coach.latest.section).toBe("mixed");
    expect(coach.latest.percent).toBe(62);
    expect(coach.coveredSkills).toBe(4);
    expect(coach.latestBySection.lesen.percent).toBe(88);
    expect(coach.latestBySection.hoeren.percent).toBe(40);
    expect(coach.focus.key).toBe("hoeren");
    expect(coach.focus.route).toBe("/exams/horen");
  });

  it("only counts published section scores and does not invent missing mock skills", () => {
    const coach = buildExamRoomCoach({
      level: "A2",
      cloudResults: [{
        ...finalMock, level: "A2", scoreBreakdown: [],
        sectionScores: { lesen: 15, schreiben: 20 },
      }],
    });
    expect(coach.coveredSkills).toBe(2);
    expect(coach.latest.section).toBe("mixed");
  });

  it("preserves local Lesen denominators when the same attempt is synced to cloud", () => {
    const coach = buildExamRoomCoach({
      level: "A1",
      cloudResults: [{
        id: "cloud-row", level: "A1", section: "lesen",
        attemptId: "reading-attempt", percent: 53, total: 15,
        sectionScores: { teil1: 4, teil2: 1, teil3: 3 },
        completedAt: "2026-10-08T12:00:00Z",
      }],
      localReading: [{
        id: "reading-attempt", level: "A1", score: 8, total: 15,
        completedAt: "2026-10-08T12:00:00Z",
        sectionScores: [
          { label: "Teil 1", score: 4, total: 5 },
          { label: "Teil 2", score: 1, total: 5 },
          { label: "Teil 3", score: 3, total: 5 },
        ],
      }],
    });
    expect(coach.attempts).toHaveLength(1);
    expect(coach.focus.weakPart).toBe("Teil 2");
    expect(coach.latestBySection.lesen.sectionScores).toHaveLength(3);
  });

  it("can use the known A1 and A2 evenly sized sample parts on another device", () => {
    expect(normalizeReadingPartScores({
      level: "A1", total: 15,
      sectionScores: { teil1: 5, teil2: 0, teil3: 3 },
    })).toEqual([
      { label: "Teil 1", score: 5, total: 5 },
      { label: "Teil 2", score: 0, total: 5 },
      { label: "Teil 3", score: 3, total: 5 },
    ]);
    expect(normalizeReadingPartScores({
      level: "A2", total: 20,
      sectionScores: { teil1: 1, teil2: 5, teil3: 4, teil4: 3 },
    })).toHaveLength(4);
    expect(normalizeReadingPartScores({
      level: "B1", total: 20, sectionScores: { teil1: 1, teil2: 0 },
    })).toEqual([]);
  });
});
