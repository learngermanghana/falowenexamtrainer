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
