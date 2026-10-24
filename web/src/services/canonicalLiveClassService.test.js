import {
  buildCanonicalLiveClassSummary,
  normalizeCurriculumIds,
} from "./canonicalLiveClassService";

describe("normalizeCurriculumIds", () => {
  test("uses chapterIds when assignmentIds exists but is empty", () => {
    expect(normalizeCurriculumIds({
      assignmentIds: [],
      chapterIds: ["a1-1.1", "A1-1.1"],
    })).toEqual(["A1-1.1"]);
  });

  test("supports curriculumIds and the legacy singular assignment_id", () => {
    expect(normalizeCurriculumIds({ curriculumIds: ["b1-2.3"] })).toEqual(["B1-2.3"]);
    expect(normalizeCurriculumIds({ assignment_id: "a2-4.1" })).toEqual(["A2-4.1"]);
  });

  test("prefers the canonical assignmentIds when populated", () => {
    expect(normalizeCurriculumIds({
      assignmentIds: ["A1-3"],
      chapterIds: ["A1-4"],
      curriculumIds: ["A1-5"],
    })).toEqual(["A1-3"]);
  });
});

describe("buildCanonicalLiveClassSummary", () => {
  const klass = { id: "class-1", name: "A1 Munich Klasse" };
  const now = new Date("2026-06-20T12:00:00.000Z");

  test("excludes cancelled sessions from progress and next-session selection", () => {
    const summary = buildCanonicalLiveClassSummary({
      klass,
      now,
      sessions: [
        {
          id: "done",
          status: "completed",
          startsAt: new Date("2026-06-19T18:00:00.000Z"),
          endsAt: new Date("2026-06-19T19:00:00.000Z"),
        },
        {
          id: "cancelled",
          status: "cancelled",
          startsAt: new Date("2026-06-20T18:00:00.000Z"),
          endsAt: new Date("2026-06-20T19:00:00.000Z"),
          cancellationReason: "Tutor unavailable",
        },
        {
          id: "next",
          status: "scheduled",
          startsAt: new Date("2026-06-21T18:00:00.000Z"),
          endsAt: new Date("2026-06-21T19:00:00.000Z"),
        },
      ],
    });

    expect(summary.nextSession.id).toBe("next");
    expect(summary.cancelledSessions).toHaveLength(1);
    expect(summary.completedCount).toBe(1);
    expect(summary.totalCount).toBe(2);
    expect(summary.progress).toBe(50);
  });

  test("marks a class as ended and hides sessions outside the official end date", () => {
    const summary = buildCanonicalLiveClassSummary({
      klass: {
        id: "a1-koln-current",
        name: "A1 Koln Klasse",
        startDate: "2026-05-13",
        endDate: "2026-07-08",
      },
      now: new Date("2026-07-09T10:00:00.000Z"),
      sessions: [
        {
          id: "last-official-session",
          classId: "a1-koln-current",
          classRecordId: "a1-koln-current",
          className: "A1 Koln Klasse",
          status: "scheduled",
          topic: "Day 24: Conjunctions and Basic Sentence Structure",
          startsAt: new Date("2026-07-08T18:00:00.000Z"),
          endsAt: new Date("2026-07-08T19:00:00.000Z"),
        },
        {
          id: "wrong-future-session",
          classId: "a1-koln-current",
          classRecordId: "a1-koln-current",
          className: "A1 Koln Klasse",
          status: "scheduled",
          topic: "Day 20: Introduction to Letter Writing",
          startsAt: new Date("2026-07-13T16:00:00.000Z"),
          endsAt: new Date("2026-07-13T19:00:00.000Z"),
        },
      ],
    });

    expect(summary.classEnded).toBe(true);
    expect(summary.classEndedAt).toBe("2026-07-08");
    expect(summary.progress).toBe(100);
    expect(summary.nextSession).toBeNull();
    expect(summary.sessions.map((session) => session.id)).toEqual(["last-official-session"]);
    expect(summary.hiddenOutOfDateRangeSessionCount).toBe(1);
  });

  test("preserves admin session topic and curriculum when a repair layer detects mismatch", () => {
    const summary = buildCanonicalLiveClassSummary({
      klass: {
        id: "a1-koln-current",
        name: "A1 Koln Klasse",
        startDate: "2026-05-13",
        endDate: "2026-07-13",
      },
      now: new Date("2026-06-30T16:00:00.000Z"),
      sessions: [
        {
          id: "admin-session",
          classId: "a1-koln-current",
          classRecordId: "a1-koln-current",
          className: "A1 Koln Klasse",
          levelId: "B1",
          status: "scheduled",
          topic: "Day 20: Introduction to Letter Writing",
          assignmentIds: ["B1-9.20"],
          chapterIds: ["B1-9.20"],
          curriculumIds: ["B1-9.20"],
          startsAt: new Date("2026-06-30T18:00:00.000Z"),
          endsAt: new Date("2026-06-30T19:00:00.000Z"),
        },
      ],
    });

    expect(summary.nextSession.topic).toBe("Day 20: Introduction to Letter Writing");
    expect(summary.nextSession.assignmentIds).toEqual(["B1-9.20"]);
    expect(summary.nextSession.adminTopicPreserved).toBe(true);
    expect(summary.nextSession.curriculumRepaired).toBe(false);
  });

  test("uses the class Zoom details when a profile is unavailable", () => {
    const summary = buildCanonicalLiveClassSummary({
      klass: { ...klass, zoomUrl: "https://zoom.example/class", meetingId: "123", passcode: "abc" },
      sessions: [],
      now,
    });

    expect(summary.zoom).toEqual({
      url: "https://zoom.example/class",
      meetingId: "123",
      passcode: "abc",
    });
  });

  test("ignores sessions from an older class record with the same class name", () => {
    const summary = buildCanonicalLiveClassSummary({
      klass: {
        id: "a1-koln-current",
        name: "A1 Koln Klasse",
        startDate: "2026-05-13",
        endDate: "2026-07-13",
      },
      now: new Date("2026-06-30T16:00:00.000Z"),
      sessions: [
        {
          id: "stale-old-class",
          classId: "a1-koln-old",
          className: "A1 Koln Klasse",
          status: "scheduled",
          topic: "Day 17: Instructions and the German Imperative",
          startsAt: new Date("2026-06-30T17:00:00.000Z"),
          endsAt: new Date("2026-06-30T18:00:00.000Z"),
        },
        {
          id: "current-class",
          classId: "a1-koln-current",
          classRecordId: "a1-koln-current",
          className: "A1 Koln Klasse",
          status: "scheduled",
          topic: "Day 20: Introduction to Letter Writing",
          startsAt: new Date("2026-06-30T18:00:00.000Z"),
          endsAt: new Date("2026-06-30T19:00:00.000Z"),
        },
      ],
    });

    expect(summary.sessions).toHaveLength(1);
    expect(summary.nextSession.id).toBe("current-class");
    expect(summary.nextSession.topic).toBe("Day 20: Introduction to Letter Writing");
    expect(summary.progress).toBe(79);
  });
});
