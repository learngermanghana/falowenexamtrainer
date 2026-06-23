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
});
