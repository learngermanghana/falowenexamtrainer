import { buildCompletedRadioHref } from "./RadioFirstWorkbookGate";
import {
  hasCompletedA1RadioFirstStep,
  resolveA1RadioFirstWorkbookRoute,
} from "./A1RadioFirstWorkbookRoutes";
import { sanitizeA1WorkbookSearch } from "./A1SharedAssignmentWorkbookLayout";

const DAY16_CHAPTER9_PATH =
  "/campus/course/a1-day-16-food-and-negation-food-and-daily-life-workbook";

describe("A1 Day 16 Radio completion persistence", () => {
  test("Radio Continue adds the durable completion flag to the exact A1-9 workbook URL", () => {
    const href = buildCompletedRadioHref({
      pathname: DAY16_CHAPTER9_PATH,
      search: "?assignmentKey=A1-9&assignmentId=A1-9&level=A1",
    });
    const parsed = new URL(href, "https://www.falowen.app");

    expect(parsed.pathname).toBe(DAY16_CHAPTER9_PATH);
    expect(parsed.searchParams.get("assignmentKey")).toBe("A1-9");
    expect(parsed.searchParams.get("assignmentId")).toBe("A1-9");
    expect(parsed.searchParams.get("level")).toBe("A1");
    expect(parsed.searchParams.get("radio")).toBe("done");
  });

  test("shared A1 workbook tab normalization keeps radio=done instead of reopening Radio", () => {
    const search = sanitizeA1WorkbookSearch(
      "?assignmentKey=A1-9&assignmentId=A1-9&level=A1&radio=done",
    );

    expect(search.get("radio")).toBe("done");
    expect(search.get("assignmentKey")).toBe("A1-9");
    expect(
      hasCompletedA1RadioFirstStep(`?${search.toString()}`),
    ).toBe(true);
    expect(
      resolveA1RadioFirstWorkbookRoute(DAY16_CHAPTER9_PATH, `?${search.toString()}`),
    ).toEqual({ day: 16, chapter: "9" });
  });

  test("changing workbook tabs can retain the Radio completion marker", () => {
    const search = sanitizeA1WorkbookSearch(
      "?assignmentKey=A1-9&assignmentId=A1-9&level=A1&radio=done",
    );
    search.set("workbookTab", "teil-1");

    expect(search.get("radio")).toBe("done");
    expect(search.get("workbookTab")).toBe("teil-1");
  });
});
