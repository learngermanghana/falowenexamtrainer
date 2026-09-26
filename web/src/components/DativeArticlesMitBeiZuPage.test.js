import { __TESTING__ } from "./DativeArticlesMitBeiZuPage";

describe("A1 Day 18 Kapitel 12.2 view routing", () => {
  test("opens the workbook for ?view=workbook", () => {
    expect(__TESTING__.hasWorkbookView({ search: "?view=workbook", state: null })).toBe(true);
  });

  test("keeps the workbook mounted when the shared Grammar tab updates the URL", () => {
    expect(
      __TESTING__.hasWorkbookView({
        search: "?view=grammar&workbookTab=grammar&assignmentKey=A1-12.2&level=A1",
        state: null,
      }),
    ).toBe(true);
  });

  test("keeps the standalone grammar notes outside workbook-tab navigation", () => {
    expect(__TESTING__.hasWorkbookView({ search: "?view=grammar", state: null })).toBe(false);
    expect(__TESTING__.hasWorkbookView({ search: "", state: null })).toBe(false);
  });

  test("accepts workbook navigation state as a fallback", () => {
    expect(__TESTING__.hasWorkbookView({ search: "", state: { view: "workbook" } })).toBe(true);
  });
});
