import {
  getConfiguredInAppWorkbookResourceRoute,
  getConfiguredInAppWorkbookRoute,
} from "./inAppWorkbookRoutes";
import { resolveStrictInAppWorkbookRoute } from "./strictInAppWorkbookRoutes";

const days = (start, end) => Array.from({ length: end - start + 1 }, (_, index) => start + index);

describe("in-app workbook routes", () => {
  afterEach(() => {
    window.history.replaceState({}, "", "/");
  });

  test("A2 workbook routes do not include the completed radio flag", () => {
    days(1, 28).forEach((day) => {
      const route = getConfiguredInAppWorkbookRoute({ level: "A2", day });
      expect(route).toContain("/campus/course/");
      expect(route).not.toContain("radio=done");
    });
  });

  test("B1 workbook routes do not include the completed radio flag", () => {
    [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, ...days(12, 28)].forEach((day) => {
      const route = getConfiguredInAppWorkbookRoute({ level: "B1", day });
      expect(route).toContain("/campus/course/");
      expect(route).not.toContain("radio=done");
    });
  });

  test("B1 Day 15 Chapter 5.15 opens the in-app workbook", () => {
    expect(
      getConfiguredInAppWorkbookRoute({ level: "B1", day: 15, chapter: "5.15" })
    ).toBe("/campus/course/lesson/B1/15?view=workbook");
  });

  test("A1 lesson pages keep the configured workbook resource without redirecting", () => {
    window.history.replaceState({}, "", "/campus/course/lesson/A1/10?chapter=6");

    const expectedRoute = "/campus/course/a1-day-10-objects-colors-possessive-articles-workbook";

    expect(getConfiguredInAppWorkbookRoute({ level: "A1", day: 10, chapter: "6" })).toBe("");
    expect(getConfiguredInAppWorkbookResourceRoute({ level: "A1", day: 10, chapter: "6" })).toBe(expectedRoute);
    expect(resolveStrictInAppWorkbookRoute({
      level: "A1",
      day: 10,
      chapter: "6",
      fallback: "https://drive.google.com/file/d/legacy-workbook/view",
    })).toBe(expectedRoute);
  });
});
