import {
  formatCourseAttendanceProgress,
  getExpectedCourseSessionCount,
} from "./courseAttendanceProgress";

describe("course attendance progress", () => {
  test("uses all 28 expected A2 course days and excludes Day 0 and completion", () => {
    expect(getExpectedCourseSessionCount("A2")).toBe(28);
    expect(formatCourseAttendanceProgress({ attended: 5, level: "A2" })).toEqual({
      attendedSessions: 5,
      expectedSessions: 28,
      label: "5/28",
    });
  });

  test("uses all 28 expected B1 course days and excludes completion", () => {
    expect(getExpectedCourseSessionCount("B1")).toBe(28);
    expect(formatCourseAttendanceProgress({ attended: 5, level: "B1" }).label).toBe("5/28");
  });

  test("excludes the A1 Course Completed marker from the expected session total", () => {
    expect(getExpectedCourseSessionCount("A1")).toBe(24);
  });

  test("never invents an attended-over-attended denominator when a level is unknown", () => {
    expect(formatCourseAttendanceProgress({ attended: 5, level: "UNKNOWN" })).toEqual({
      attendedSessions: 5,
      expectedSessions: 0,
      label: "5",
    });
  });
});
