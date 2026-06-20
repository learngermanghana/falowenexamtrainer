import { buildCanonicalLiveClassSummary } from "./canonicalLiveClassService";

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
