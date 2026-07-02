import { __TESTING__ } from "./B1WorkbookWritingCheatSheetInjector";
import { getWritingCheatSheet } from "../data/writingCheatSheets";

describe("B1 workbook writing cheat sheet injector", () => {
  test("activates on B1 lesson workbook views only", () => {
    expect(
      __TESTING__.isB1WorkbookRoute(
        "/campus/course/lesson/B1/1",
        "?view=workbook"
      )
    ).toBe(true);
    expect(
      __TESTING__.isB1WorkbookRoute(
        "/campus/course/lesson/B1/1",
        "?view=grammar"
      )
    ).toBe(false);
    expect(
      __TESTING__.isB1WorkbookRoute(
        "/campus/course/lesson/B1/1",
        ""
      )
    ).toBe(false);
    expect(
      __TESTING__.isB1WorkbookRoute(
        "/campus/course/lesson/B1/21",
        "?view=workbook"
      )
    ).toBe(false);
  });

  test("does not activate on removed standalone B1 Day 21 workbook routes", () => {
    expect(
      __TESTING__.isB1WorkbookRoute(
        "/campus/course/b1-day-21-lebensformen-heute-workbook",
        ""
      )
    ).toBe(false);
  });

  test("B1 cheat sheet content exists for workbook days", () => {
    expect(getWritingCheatSheet("B1", 1).length).toBeGreaterThan(0);
    expect(getWritingCheatSheet("B1", 1)[0].items.length).toBeGreaterThan(0);
  });
});
