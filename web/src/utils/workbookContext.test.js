import {
  buildWorkbookContextSearch,
  chooseWorkbookAssignment,
  workbookContextMatches,
} from "./workbookContext";

describe("workbook assignment context", () => {
  test("chooses the assignment that matches the workbook chapter", () => {
    const assignments = [
      { assignmentKey: "A1-0.1", chapter: "0.1" },
      { assignmentKey: "A1-0.2", chapter: "0.2" },
    ];

    expect(chooseWorkbookAssignment({ assignments, chapter: "0.2" })).toEqual(assignments[1]);
  });

  test("builds a shareable query with the exact canonical assignment", () => {
    expect(
      buildWorkbookContextSearch({
        search: "?view=workbook",
        level: "A1",
        assignmentKey: "A1-0.2",
      })
    ).toBe("?view=workbook&assignmentKey=A1-0.2&assignmentId=A1-0.2&level=A1");
  });

  test("requires both route and state to match the same assignment", () => {
    const context = {
      search: "?assignmentKey=A1-0.2&assignmentId=A1-0.2&level=A1",
      state: {
        assignmentKey: "A1-0.2",
        canonicalAssignmentKey: "A1-0.2",
        level: "A1",
        day: 2,
      },
      level: "A1",
      day: 2,
      assignmentKey: "A1-0.2",
    };

    expect(workbookContextMatches(context)).toBe(true);
    expect(
      workbookContextMatches({
        ...context,
        state: { ...context.state, assignmentKey: "A1-0.1", canonicalAssignmentKey: "A1-0.1" },
      })
    ).toBe(false);
  });
});
