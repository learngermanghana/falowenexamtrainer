import { buildCanonicalLiveClassSummary } from "./canonicalLiveClassService";

describe("canonical live class level protection", () => {
  test("replaces A1 curriculum with the correct A2 lesson title", () => {
    const summary = buildCanonicalLiveClassSummary({
      klass: {
        id: "a2-freiburg",
        name: "A2 Freiburg Klasse",
        levelId: "A1",
        startDate: "2026-05-13",
        endDate: "2026-07-10",
      },
      now: new Date("2026-07-01T10:00:00.000Z"),
      sessions: [
        {
          id: "wrong-a1-session",
          classId: "a2-freiburg",
          classRecordId: "a2-freiburg",
          className: "A2 Freiburg Klasse",
          status: "scheduled",
          topic: "5.9. Goethe A1 Speaking Practice",
          assignmentIds: ["A1-7.20"],
          curriculumIndex: 0,
          startsAt: new Date("2026-07-01T11:00:00.000Z"),
          endsAt: new Date("2026-07-01T13:00:00.000Z"),
        },
      ],
    });

    expect(summary.klass.levelId).toBe("A2");
    expect(summary.klass.level).toBe("A2");
    expect(summary.sessions).toHaveLength(1);
    expect(summary.sessions[0].topic).toBe("Small Talk 1.1 (Exercise)");
    expect(summary.sessions[0].assignmentIds).toEqual(["A2-1.1"]);
    expect(summary.sessions[0].curriculumLevelMismatch).toBe(true);
    expect(summary.sessions[0].curriculumRepaired).toBe(true);
    expect(summary.nextSession.topic).toBe("Small Talk 1.1 (Exercise)");
    expect(summary.curriculumMismatchCount).toBe(1);
    expect(summary.curriculumRepairCount).toBe(1);
  });

  test("uses chronological session position when curriculumIndex is missing", () => {
    const summary = buildCanonicalLiveClassSummary({
      klass: {
        id: "a2-freiburg",
        name: "A2 Freiburg Klasse",
      },
      now: new Date("2026-05-13T09:00:00.000Z"),
      sessions: [
        {
          id: "session-1",
          classId: "a2-freiburg",
          status: "scheduled",
          topic: "A1 Tutorial",
          assignmentIds: ["A1-Tutorial"],
          startsAt: new Date("2026-05-13T11:00:00.000Z"),
          endsAt: new Date("2026-05-13T13:00:00.000Z"),
        },
        {
          id: "session-2",
          classId: "a2-freiburg",
          status: "scheduled",
          topic: "A1 Greetings",
          assignmentIds: ["A1-0.1"],
          startsAt: new Date("2026-05-14T11:00:00.000Z"),
          endsAt: new Date("2026-05-14T13:00:00.000Z"),
        },
      ],
    });

    expect(summary.sessions[0].topic).toBe("Small Talk 1.1 (Exercise)");
    expect(summary.sessions[0].assignmentIds).toEqual(["A2-1.1"]);
    expect(summary.sessions[1].topic).toBe("Personen beschreiben 1.2 (Exercise)");
    expect(summary.sessions[1].assignmentIds).toEqual(["A2-1.2"]);
  });
});
