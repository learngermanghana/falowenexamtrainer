import { getConfiguredInAppWorkbookRoute } from "./inAppWorkbookRoutes";

const days = (start, end) => Array.from({ length: end - start + 1 }, (_, index) => start + index);

describe("in-app workbook routes", () => {
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
});
