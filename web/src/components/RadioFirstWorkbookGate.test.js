import {
  buildCompletedRadioHref,
  buildCompletedRadioSearch,
  openCompletedWorkbook,
} from "./RadioFirstWorkbookGate";

describe("RadioFirstWorkbookGate navigation", () => {
  it("preserves the workbook view and adds the completed radio flag", () => {
    expect(buildCompletedRadioSearch("?view=workbook")).toBe("?view=workbook&radio=done");
  });

  it("builds the correct B1 Day 21 workbook URL", () => {
    expect(
      buildCompletedRadioHref({
        pathname: "/campus/course/lesson/B1/21",
        search: "?view=workbook",
        hash: "",
      })
    ).toBe("/campus/course/lesson/B1/21?view=workbook&radio=done");
  });

  it("uses direct browser navigation so Continue always opens the workbook", () => {
    const assign = jest.fn();
    const opened = openCompletedWorkbook(
      {
        pathname: "/campus/course/lesson/B1/21",
        search: "?view=workbook",
        hash: "",
      },
      { location: { assign } }
    );

    expect(opened).toBe(true);
    expect(assign).toHaveBeenCalledWith(
      "/campus/course/lesson/B1/21?view=workbook&radio=done"
    );
  });
});

describe("A1 direct Radio destinations", () => {
  test.each([
    [2, "1.1", "A1-1.1", "/campus/course/a1-day-2-kapitel-1-1-workbook"],
    [3, "1.2", "A1-1.2", "/campus/course/a1-day-3-pronouns-introducing-yourself-workbook"],
    [9, "5", "A1-5", "/campus/course/a1-chapter-5-german-cases-workbook"],
    [16, "9", "A1-9", "/campus/course/a1-day-16-food-and-negation-food-and-daily-life-workbook"],
    [16, "10", "A1-10", "/campus/course/a1-day-16-food-and-negation-kapitel-10-workbook"],
    [18, "12.2", "A1-12.2", "/campus/course/a1-12-2-dative-articles-mit-bei-zu"],
    [20, "12.3", "A1-12.3", "/campus/course/letter-writing-intro-german-a1-day-12-3"],
  ])("opens Day %s chapter %s with canonical tutor assignment identity", (day, chapter, assignmentKey, path) => {
    const href = buildCompletedRadioHref({
      pathname: `/campus/course/lesson/A1/${day}`,
      search: `?chapter=${chapter}&hub=1`,
    });
    const url = new URL(href, "https://www.falowen.app");
    expect(url.pathname).toBe(path);
    expect(url.searchParams.get("assignmentKey")).toBe(assignmentKey);
    expect(url.searchParams.get("assignmentId")).toBe(assignmentKey);
    expect(url.searchParams.get("level")).toBe("A1");
    expect(url.searchParams.get("radio")).toBe("done");
    if (assignmentKey === "A1-12.2" || assignmentKey === "A1-12.3") {
      expect(url.searchParams.get("view")).toBe("workbook");
    }
  });

  test("keeps Day 3 chapter 1.1 self-practice separate from the Day 2 tutor assignment", () => {
    const href = buildCompletedRadioHref({
      pathname: "/campus/course/lesson/A1/3",
      search: "?chapter=1.1&hub=1",
    });
    expect(href).toBe(
      "/campus/course/a1-day-3-schreiben-sprechen-kapitel-1-1-workbook?radio=done"
    );
    expect(href).not.toContain("assignmentKey=A1-1.1");
  });
});
