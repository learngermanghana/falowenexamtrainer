import {
  getTimedAssignmentConfig,
  getTimedAssignmentDurationSeconds,
  getTimedAssignmentKeysForLevel,
} from "./timedAssignmentConfig";

describe("shared timed assignment configuration", () => {
  test("keeps A1 late writing assignments on their existing limits", () => {
    expect(getTimedAssignmentDurationSeconds("A1-12.3")).toBe(30 * 60);
    expect(getTimedAssignmentDurationSeconds("A1-13")).toBe(35 * 60);
    expect(getTimedAssignmentDurationSeconds("A1-14.1")).toBe(35 * 60);
  });

  test("enables graded late A2 assignment work without timing self-check-only days", () => {
    expect(getTimedAssignmentDurationSeconds("A2-10.27")).toBe(45 * 60);
    expect(getTimedAssignmentDurationSeconds("A2-10.28")).toBe(45 * 60);
    expect(getTimedAssignmentConfig("A2-9.24")).toBeNull();
    expect(getTimedAssignmentConfig("A2-10.26")).toBeNull();
  });

  test("enables B1 days where Teil 4 is submitted, not late self-check listening days", () => {
    expect(getTimedAssignmentDurationSeconds("B1-6.18")).toBe(55 * 60);
    expect(getTimedAssignmentDurationSeconds("B1-6.19")).toBe(55 * 60);
    expect(getTimedAssignmentDurationSeconds("B1-7.22")).toBe(55 * 60);
    expect(getTimedAssignmentConfig("B1-8.24")).toBeNull();
  });

  test("returns reusable keys by level", () => {
    expect(getTimedAssignmentKeysForLevel("A2")).toEqual(["A2-10.27", "A2-10.28"]);
  });
});
