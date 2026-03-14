import { findTodayClassSession } from "./classCalendar";

describe("findTodayClassSession", () => {
  test("uses the lesson title for display so day numbers are not mistaken for assignment ids", () => {
    const todaySession = findTodayClassSession("A1 Stuttgart Klasse", new Date("2026-02-26T10:00:00Z"));

    expect(todaySession).toBeTruthy();
    expect(todaySession.titles).toEqual(expect.arrayContaining([expect.stringContaining("Day 20")]));
    expect(todaySession.titles).toEqual(expect.arrayContaining([expect.stringContaining("12.3")]));
    expect(todaySession.titles).not.toEqual(expect.arrayContaining([expect.stringContaining("A1 20 –")]));
  });
});
