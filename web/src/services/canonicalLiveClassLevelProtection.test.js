import { buildCanonicalLiveClassSummary } from "./canonicalLiveClassService";

describe("canonical live class level protection", () => {
  test("never shows A1 curriculum inside an A2 class", () => {
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
          startsAt: new Date("2026-07-01T11:00:00.000Z"),
          endsAt: new Date("2026-07-01T13:00:00.000Z"),
        },
      ],
    });

    expect(summary.klass.levelId).toBe("A2");
    expect(summary.klass.level).toBe("A2");
    expect(summary.sessions).toHaveLength(1);
    expect(summary.sessions[0].topic).toBe("A2 live class");
    expect(summary.sessions[0].assignmentIds).toEqual([]);
    expect(summary.sessions[0].curriculumLevelMismatch).toBe(true);
    expect(summary.nextSession.topic).toBe("A2 live class");
    expect(summary.curriculumMismatchCount).toBe(1);
  });
});
