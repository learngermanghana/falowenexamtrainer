import {
  formatCourseAttendanceProgress,
  getExpectedCourseSessionCount,
} from "./courseAttendanceProgress";
import { courseSchedules } from "../data/courseSchedule";
import { GERMAN_ASSIGNMENT_COURSE_DICTIONARY } from "../data/germanAssignmentCatalog";

const { courseSchedules: backendCourseSchedules } = require("../../../functions/data/courseSchedule");

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

  test("excludes A1 Day 0 and the Day 24 Course Completed marker from attendance sessions", () => {
    expect(getExpectedCourseSessionCount("A1")).toBe(23);
    expect(formatCourseAttendanceProgress({ attended: 5, level: "A1" }).label).toBe("5/23");
  });

  test("keeps the backend A1 course dictionary in sync with the 23-day student course", () => {
    const webA1 = courseSchedules.A1;
    const backendA1 = backendCourseSchedules.A1;
    const assignmentDictionary = Object.values(GERMAN_ASSIGNMENT_COURSE_DICTIONARY.A1 || {});

    // Day 0 is the tutorial, Day 23 the final mock, and Day 24 is a completion marker.
    expect(backendA1.map((entry) => Number(entry.day))).toEqual(
      webA1.map((entry) => Number(entry.day)),
    );
    expect(backendA1.filter((entry) => Number(entry.day) > 0 && !entry.completion)).toHaveLength(23);
    expect(backendA1.find((entry) => Number(entry.day) === 23)).toMatchObject({
      chapter: "5.10",
      topic: "A1 Final Mock Exam",
      assignment: false,
    });
    expect(backendA1.find((entry) => Number(entry.day) === 24)?.completion).toMatchObject({
      level: "A1",
      nextLevel: "A2",
    });

    // The retired standalone Dative / Conjunctions and Day 23 writing-workshop
    // lessons must not reappear when the server or dictionary is regenerated.
    expect(backendA1.map((entry) => entry.topic).join(" ")).not.toMatch(
      /Dative and Accusative Verbs|Conjunctions|Schreiben: E-Mails und Briefe für Alltag und Prüfung/i,
    );
    expect(assignmentDictionary.some((entry) =>
      String(entry.chapter || "") === "14.2" ||
      /Dative and Accusative Verbs|Conjunctions/i.test(String(entry.topic || entry.title || "")),
    )).toBe(false);

    // Chapter 12.2 is still an active Day 18 Dative Prepositions assignment.
    expect(assignmentDictionary.some((entry) =>
      String(entry.chapter || "") === "12.2" && Number(entry.day) === 18,
    )).toBe(true);
  });

  test("never invents an attended-over-attended denominator when a level is unknown", () => {
    expect(formatCourseAttendanceProgress({ attended: 5, level: "UNKNOWN" })).toEqual({
      attendedSessions: 5,
      expectedSessions: 0,
      label: "5",
    });
  });
});
