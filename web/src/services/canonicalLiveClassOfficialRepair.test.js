import "./canonicalLiveClassTestSetup";
import { buildCanonicalLiveClassSummary } from "./canonicalLiveClassServiceV3";

const A1_MUNICH_DATES = [
  "2026-06-19T18:00:00.000Z",
  "2026-06-20T08:00:00.000Z",
  "2026-06-25T18:00:00.000Z",
  "2026-06-26T18:00:00.000Z",
  "2026-06-27T08:00:00.000Z",
  "2026-07-02T18:00:00.000Z",
  "2026-07-03T18:00:00.000Z",
  "2026-07-04T08:00:00.000Z",
  "2026-07-09T18:00:00.000Z",
  "2026-07-10T18:00:00.000Z",
  "2026-07-11T08:00:00.000Z",
  "2026-07-16T18:00:00.000Z",
  "2026-07-17T18:00:00.000Z",
  "2026-07-18T08:00:00.000Z",
  "2026-07-23T18:00:00.000Z",
  "2026-07-24T18:00:00.000Z",
  "2026-07-25T08:00:00.000Z",
  "2026-07-30T18:00:00.000Z",
  "2026-07-31T18:00:00.000Z",
  "2026-08-01T08:00:00.000Z",
  "2026-08-06T18:00:00.000Z",
  "2026-08-07T18:00:00.000Z",
  "2026-08-08T08:00:00.000Z",
  "2026-08-13T18:00:00.000Z",
  "2026-08-14T18:00:00.000Z",
];

function officialSession(index) {
  const startsAt = new Date(A1_MUNICH_DATES[index]);
  return {
    id: `official-${index}`,
    classId: "a1-munich-current",
    classRecordId: "a1-munich-current",
    className: "A1 Munich Klasse",
    status: "scheduled",
    topic: `Day ${index}: Official lesson ${index}`,
    assignmentIds: [index === 0 ? "A1-TUTORIAL" : `A1-${index}`],
    curriculumIndex: index,
    curriculumDay: index,
    curriculumSource: "courseDictionary-day-groups",
    curriculumVersion: 2,
    manualDateOverride: true,
    rescheduleReason: "A1 official 25-attendance sessions timetable repaired atomically without duplicate times.",
    updatedAt: new Date("2026-07-14T12:00:00.000Z"),
    startsAt,
    endsAt: new Date(startsAt.getTime() + 60 * 60 * 1000),
  };
}

describe("official repaired live-class timetable selection", () => {
  test("A1 Munich exposes only the authoritative 25 sessions and ignores stale completed aliases", () => {
    const official = Array.from({ length: 25 }, (_, index) => officialSession(index));
    const sessions = [
      ...official,
      {
        id: "stale-orientation-at-day-4-time",
        classId: "a1-munich-current",
        classRecordId: "a1-munich-current",
        className: "A1 Munich Klasse",
        status: "completed",
        topic: "0. Orientation and Tutorial",
        assignmentIds: ["A1-TUTORIAL"],
        startsAt: new Date("2026-06-27T08:00:00.000Z"),
        endsAt: new Date("2026-06-27T09:00:00.000Z"),
      },
      {
        id: "stale-evening-session",
        classId: "a1-munich-current",
        classRecordId: "a1-munich-current",
        className: "A1 Munich Klasse",
        status: "completed",
        topic: "Day 3: Old duplicate",
        assignmentIds: ["A1-1.1-PRACTICE", "A1-1.2"],
        startsAt: new Date("2026-06-27T18:00:00.000Z"),
        endsAt: new Date("2026-06-27T20:00:00.000Z"),
      },
      {
        id: "stale-july-9-morning",
        classId: "a1-munich-current",
        classRecordId: "a1-munich-current",
        className: "A1 Munich Klasse",
        status: "completed",
        topic: "Old morning duplicate",
        assignmentIds: ["A1-4"],
        startsAt: new Date("2026-07-09T06:00:00.000Z"),
        endsAt: new Date("2026-07-09T08:00:00.000Z"),
      },
      {
        id: "older-repair-alias-for-day-4",
        classId: "a1-munich-current",
        classRecordId: "a1-munich-current",
        className: "A1 Munich Klasse",
        status: "completed",
        topic: "0. Orientation and Tutorial",
        assignmentIds: ["A1-TUTORIAL"],
        curriculumIndex: 4,
        curriculumSource: "courseDictionary-day-groups",
        curriculumVersion: 2,
        updatedAt: new Date("2026-06-01T00:00:00.000Z"),
        startsAt: new Date("2026-06-27T08:00:00.000Z"),
        endsAt: new Date("2026-06-27T09:00:00.000Z"),
      },
      {
        id: "explicitly-superseded",
        classId: "a1-munich-current",
        classRecordId: "a1-munich-current",
        status: "superseded",
        superseded: true,
        curriculumIndex: 8,
        curriculumSource: "courseDictionary-day-groups",
        curriculumVersion: 2,
        startsAt: new Date("2026-07-09T18:00:00.000Z"),
        endsAt: new Date("2026-07-09T19:00:00.000Z"),
      },
    ];

    const summary = buildCanonicalLiveClassSummary({
      klass: {
        id: "a1-munich-current",
        classId: "A1 Munich Klasse",
        name: "A1 Munich Klasse",
        levelId: "A1",
        startDate: "2026-06-19",
        endDate: "2026-08-14",
        generatedSessionCount: 25,
        curriculumMappedSessionCount: 25,
        sessionRepairStatus: "complete",
        lastSessionChangeType: "official-schedule-repair",
      },
      sessions,
      now: new Date("2026-07-14T16:00:00.000Z"),
    });

    expect(summary.authoritativeSchedule).toBe(true);
    expect(summary.sessions).toHaveLength(25);
    expect(summary.totalCount).toBe(25);
    expect(summary.sessions.map((session) => session.id)).toEqual(
      Array.from({ length: 25 }, (_, index) => `official-${index}`),
    );
    expect(summary.sessions[4].topic).toBe("Day 4: Official lesson 4");
    expect(summary.nextSession.id).toBe("official-11");
    expect(summary.nextSession.topic).toBe("Day 11: Official lesson 11");
    expect(summary.hiddenLegacySessionCount).toBe(5);
  });

  test("superseded records are hidden even before a class has official repair metadata", () => {
    const summary = buildCanonicalLiveClassSummary({
      klass: { id: "class-legacy", name: "A2 Berlin Klasse" },
      sessions: [
        {
          id: "active",
          classId: "class-legacy",
          status: "scheduled",
          startsAt: new Date("2026-08-01T18:00:00.000Z"),
          endsAt: new Date("2026-08-01T19:00:00.000Z"),
        },
        {
          id: "old",
          classId: "class-legacy",
          status: "superseded",
          superseded: true,
          startsAt: new Date("2026-07-30T18:00:00.000Z"),
          endsAt: new Date("2026-07-30T19:00:00.000Z"),
        },
      ],
      now: new Date("2026-07-20T12:00:00.000Z"),
    });

    expect(summary.sessions.map((session) => session.id)).toEqual(["active"]);
    expect(summary.hiddenLegacySessionCount).toBe(1);
  });
});
