import {
  A1_ASSIGNMENT_ORDER,
  A1_ASSIGNMENT_REGISTRY,
  getA1AssignmentByChapter,
  getA1AssignmentByRoute,
  getA1AssignmentNeighbors,
} from "./a1AssignmentRegistry";
import { buildA1CanonicalChapterLessonRoute } from "./a1CanonicalLessonRoutes";
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
    expect(assignment.lessonRoute).toBe(buildA1CanonicalChapterLessonRoute(assignment.chapter));
    expect(assignment.lessonRoute).not.toContain("?chapter=");
    expect(assignment.legacyLessonRoute).toBe(
      `/campus/course/lesson/A1/${assignment.day}?chapter=${assignment.chapter}`,
    );
    expect(getA1AssignmentByChapter(assignment.chapter)).toBe(assignment);
    expect(getA1AssignmentByRoute(assignment.workbookPath, assignment.workbookSearch)).toBe(assignment);
    expect(["native", "bridge"]).toContain(assignment.layoutMode);
    expect(new Set(assignment.sections.map(({ key: sectionKey }) => sectionKey)).size)
      .toBe(assignment.sections.length);
    expect(assignment.sections.every(({ key: sectionKey, label }) => label.startsWith(`Teil ${sectionKey.slice(5)}`))).toBe(true);
    expect(assignment.submissionEnabled).toBe(true);
  });

  test("preserves non-consecutive section numbers after workbook parts are merged", () => {
    expect(A1_ASSIGNMENT_REGISTRY["A1-0.2"].sections).toEqual([
      { key: "teil-1", number: 1, label: "Teil 1 · Reading and Questions" },
      { key: "teil-3", number: 3, label: "Teil 3 · Hören" },
    ]);
  });

  test("gives dotted chapters the requested short, permanent aliases", () => {
    expect(A1_ASSIGNMENT_REGISTRY["A1-0.2"].shortLessonRoute).toBe(
      "/campus/course/lesson/A1/0.2",
    );
    expect(A1_ASSIGNMENT_REGISTRY["A1-1.1"].shortLessonRoute).toBe(
      "/campus/course/lesson/A1/1.1",
    );
    expect(A1_ASSIGNMENT_REGISTRY["A1-2"].shortLessonRoute).toBe("");
  });

  test.each(A1_ASSIGNMENT_ORDER)("%s has canonical previous/next navigation", (key) => {
    const index = A1_ASSIGNMENT_ORDER.indexOf(key);
    const neighbors = getA1AssignmentNeighbors(key);
    expect(neighbors.previous?.assignmentKey || null).toBe(A1_ASSIGNMENT_ORDER[index - 1] || null);
    expect(neighbors.next?.assignmentKey || null).toBe(A1_ASSIGNMENT_ORDER[index + 1] || null);
  });

  test("keeps Day 18 neighbors on workbook views", () => {
    expect(A1_ASSIGNMENT_REGISTRY["A1-12.1"].workbookRoute).toContain("view=workbook");
    expect(A1_ASSIGNMENT_REGISTRY["A1-12.2"].workbookRoute).toContain("view=workbook");
    expect(getA1AssignmentByRoute(
      A1_ASSIGNMENT_REGISTRY["A1-12.1"].workbookPath,
      "",
    )).toBeNull();
  });

  test("tab models are derived only from declared sections", () => {
    expect(getAllowedWorkbookTabs([])).toEqual(["assignment", "submit"]);
    expect(getAllowedWorkbookTabs([{ key: "teil-1" }])).toEqual(["overview", "teil-1", "submit"]);
    expect(getAllowedWorkbookTabs([{ key: "teil-1" }, { key: "teil-2" }])).toEqual(["overview", "teil-1", "teil-2", "submit"]);
    expect(getAllowedWorkbookTabs([{ key: "teil-1" }, { key: "teil-2" }, { key: "teil-3" }])).toEqual(["overview", "teil-1", "teil-2", "teil-3", "submit"]);
  });
});
