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

describe('A1 direct Radio destinations', () => {
  test.each([
    [2, '1.1', '/campus/course/a1-day-2-kapitel-1-1-workbook'],
    [3, '1.1', '/campus/course/a1-day-3-schreiben-sprechen-kapitel-1-1-workbook'],
    [3, '1.2', '/campus/course/a1-day-3-pronouns-introducing-yourself-workbook'],
    [18, '12.2', '/campus/course/a1-12-2-dative-articles-mit-bei-zu?view=workbook'],
  ])('opens Day %s chapter %s workbook without another hub visit', (day, chapter, expected) => {
    const href = buildCompletedRadioHref({pathname: `/campus/course/lesson/A1/${day}`, search: `?chapter=${chapter}&hub=1`});
    expect(href).toBe(`${expected}${expected.includes('?') ? '&' : '?'}radio=done`);
  });
});
