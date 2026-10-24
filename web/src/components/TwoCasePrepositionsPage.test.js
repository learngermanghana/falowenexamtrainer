import { __TESTING__ } from "./TwoCasePrepositionsPage";

describe("A1 Day 18 Kapitel 12.1 view routing", () => {
  test("opens the workbook for ?view=workbook", () => {
    expect(__TESTING__.hasWorkbookView({ search: "?view=workbook", state: null })).toBe(true);
  });

  test("keeps the workbook mounted when the shared Grammar tab updates the URL", () => {
    expect(
      __TESTING__.hasWorkbookView({
        search: "?view=grammar&workbookTab=grammar&assignmentKey=A1-12.1&level=A1",
        state: null,
      }),
    ).toBe(true);
  });

  test("keeps the standalone grammar notes when Grammar is opened outside the workbook shell", () => {
    expect(__TESTING__.hasWorkbookView({ search: "?view=grammar", state: null })).toBe(false);
    expect(__TESTING__.hasWorkbookView({ search: "", state: null })).toBe(false);
  });

  test("accepts workbook navigation state as a fallback", () => {
    expect(__TESTING__.hasWorkbookView({ search: "", state: { view: "workbook" } })).toBe(true);
  });

  test("accepts resourceView workbook navigation state", () => {
    expect(
      __TESTING__.hasWorkbookView({ search: "", state: { resourceView: "workbook" } })
    ).toBe(true);
  });
});
