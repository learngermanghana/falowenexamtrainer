import {
  A1_ASSIGNMENT_ORDER,
  A1_ASSIGNMENT_REGISTRY,
  getA1AssignmentByRoute,
  getA1AssignmentNeighbors,
} from "./a1AssignmentRegistry";
import { getAllowedWorkbookTabs } from "../components/A1SharedAssignmentWorkbookLayout";

describe("canonical A1 assignment registry", () => {
  test("contains the 19 requested assignments exactly once and in canonical order", () => {
    expect(Object.keys(A1_ASSIGNMENT_REGISTRY)).toEqual(A1_ASSIGNMENT_ORDER);
    expect(new Set(A1_ASSIGNMENT_ORDER).size).toBe(19);
  });

  test.each(A1_ASSIGNMENT_ORDER)("%s has deterministic identity, route and sections", (key) => {
    const assignment = A1_ASSIGNMENT_REGISTRY[key];
    expect(assignment.assignmentKey).toBe(key);
    expect(assignment.chapter).toBe(key.slice(3));
    expect(getA1AssignmentByRoute(assignment.workbookRoute)).toBe(assignment);
    expect(new Set(assignment.sections.map(({ key: sectionKey }) => sectionKey)).size)
      .toBe(assignment.sections.length);
    expect(assignment.sections.every(({ key: sectionKey, label }) => label.startsWith(`Teil ${sectionKey.slice(5)}`))).toBe(true);
    expect(assignment.submissionEnabled).toBe(true);
  });

  test.each(A1_ASSIGNMENT_ORDER)("%s has canonical previous/next navigation", (key) => {
    const index = A1_ASSIGNMENT_ORDER.indexOf(key);
    const neighbors = getA1AssignmentNeighbors(key);
    expect(neighbors.previous?.assignmentKey || null).toBe(A1_ASSIGNMENT_ORDER[index - 1] || null);
    expect(neighbors.next?.assignmentKey || null).toBe(A1_ASSIGNMENT_ORDER[index + 1] || null);
  });

  test("tab models are derived only from declared sections", () => {
    expect(getAllowedWorkbookTabs([])).toEqual(["assignment", "submit"]);
    expect(getAllowedWorkbookTabs([{ key: "teil-1" }])).toEqual(["overview", "teil-1", "submit"]);
    expect(getAllowedWorkbookTabs([{ key: "teil-1" }, { key: "teil-2" }])).toEqual(["overview", "teil-1", "teil-2", "submit"]);
    expect(getAllowedWorkbookTabs([{ key: "teil-1" }, { key: "teil-2" }, { key: "teil-3" }])).toEqual(["overview", "teil-1", "teil-2", "teil-3", "submit"]);
  });
});
