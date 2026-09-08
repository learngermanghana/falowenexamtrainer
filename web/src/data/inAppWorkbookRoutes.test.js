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
    [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, ...days(12, 14), ...days(16, 28)].forEach((day) => {
      const route = getConfiguredInAppWorkbookRoute({ level: "B1", day });
      expect(route).toContain("/campus/course/");
      expect(route).not.toContain("radio=done");
    });
  });

  test("A1 lesson pages keep the Radio-first entry point before Radio is complete", () => {
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

  test("A1 lesson pages continue directly to the Course Book after Radio is complete", () => {
    window.history.replaceState(
      {},
      "",
      "/campus/course/lesson/A1/10?chapter=6&hub=1&radio=done",
    );

    expect(getConfiguredInAppWorkbookRoute({ level: "A1", day: 10, chapter: "6" })).toBe(
      "/campus/course/a1-day-10-objects-colors-possessive-articles-workbook?radio=done",
    );
  });

  test("A1 Course Book redirect preserves existing workbook query parameters", () => {
    window.history.replaceState(
      {},
      "",
      "/campus/course/lesson/A1/18?chapter=12.2&hub=1&radio=done",
    );

    expect(getConfiguredInAppWorkbookRoute({ level: "A1", day: 18, chapter: "12.2" })).toBe(
      "/campus/course/a1-12-2-dative-articles-mit-bei-zu?view=workbook&radio=done",
    );
  });
});
