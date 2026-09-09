import {
  formatCourseAttendanceProgress,
  getExpectedCourseSessionCount,
} from "./courseAttendanceProgress";

describe("course attendance progress", () => {
  test("uses all 28 expected A2 course days and excludes Day 0", () => {
    expect(getExpectedCourseSessionCount("A2")).toBe(28);
    expect(formatCourseAttendanceProgress({ attended: 5, level: "A2" })).toEqual({
      attendedSessions: 5,
      expectedSessions: 28,
      label: "5/28",
    });
  });

  test("uses all 28 expected B1 course days", () => {
    expect(getExpectedCourseSessionCount("B1")).toBe(28);
    expect(formatCourseAttendanceProgress({ attended: 5, level: "B1" }).label).toBe("5/28");
  });

  test("never invents an attended-over-attended denominator when a level is unknown", () => {
    expect(formatCourseAttendanceProgress({ attended: 5, level: "UNKNOWN" })).toEqual({
      attendedSessions: 5,
      expectedSessions: 0,
      label: "5",
    });
  });
});
