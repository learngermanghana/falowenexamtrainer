import {
  canonicalLessonIdentity,
  dedupeCanonicalSessions,
} from "./liveClassSessionIdentity.js";

const session = (overrides = {}) => ({
  id: "session",
  classId: "a1-bonn",
  status: "completed",
  startsAt: "2026-07-17T18:00:00.000Z",
  endsAt: "2026-07-17T19:00:00.000Z",
  sequence: 1,
  ...overrides,
});

describe("live class lesson identity", () => {
  test("keeps different curriculum lessons even when they share the same start time", () => {
    const result = dedupeCanonicalSessions([
      session({ id: "day-12", curriculumIndex: 12, assignmentIds: ["A1-8"], topic: "Day 12: The 24 Hour Clock and Dates" }),
      session({ id: "day-13", curriculumIndex: 13, assignmentIds: ["A1-3.5"], topic: "Day 13: Numbers, Time and Prices Revision", sequence: 3, rescheduledAt: "2026-07-17T17:00:00.000Z" }),
    ], { canonicalClassId: "a1-bonn" });

    expect(result).toHaveLength(2);
    expect(result.map((item) => item.id)).toEqual(["day-12", "day-13"]);
  });

  test("prefers the newest rescheduled record for the same curriculum lesson", () => {
    const result = dedupeCanonicalSessions([
      session({
        id: "day-13-old",
        curriculumIndex: 13,
        assignmentIds: ["A1-3.5"],
        startsAt: "2026-07-18T08:00:00.000Z",
        sequence: 1,
        updatedAt: "2026-07-16T10:00:00.000Z",
      }),
      session({
        id: "day-13-new",
        curriculumIndex: 13,
        assignmentIds: ["A1-3.5"],
        startsAt: "2026-07-17T18:00:00.000Z",
        sequence: 4,
        rescheduledAt: "2026-07-17T12:00:00.000Z",
      }),
    ], { canonicalClassId: "a1-bonn" });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("day-13-new");
    expect(result[0].startsAt).toBe("2026-07-17T18:00:00.000Z");
  });

  test("ignores a superseded alias when an active record exists", () => {
    const result = dedupeCanonicalSessions([
      session({ id: "old", curriculumIndex: 13, superseded: true, sequence: 9 }),
      session({ id: "active", curriculumIndex: 13, status: "scheduled", sequence: 2 }),
    ], { canonicalClassId: "a1-bonn" });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("active");
  });

  test("uses curriculum identity before document or timestamp identity", () => {
    expect(canonicalLessonIdentity(session({ id: "one", curriculumIndex: 13 }), "a1-bonn"))
      .toBe("a1-bonn|curriculum:13");
  });
});
