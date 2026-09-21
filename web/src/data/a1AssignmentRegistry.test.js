import {
  A1_ASSIGNMENT_ORDER,
  A1_ASSIGNMENT_REGISTRY,
  buildA1TutorMarkedWorkbookHref,
  getA1AssignmentByChapter,
  getA1AssignmentByDayAndChapter,
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

  test("keeps A1-5 German Cases on the native workbook shell", () => {
    const assignment = A1_ASSIGNMENT_REGISTRY["A1-5"];
    expect(assignment.workbookRoute).toBe("/campus/course/a1-chapter-5-german-cases-workbook");
    expect(assignment.layoutMode).toBe("native");
    expect(assignment.sections.map(({ key }) => key)).toEqual(["teil-1", "teil-2", "teil-3"]);
  });

  test("all tutor-marked A1 assignments now use the native shared workbook navigation", () => {
    expect(A1_ASSIGNMENT_ORDER).toHaveLength(19);
    expect(A1_ASSIGNMENT_ORDER.filter(
      (key) => A1_ASSIGNMENT_REGISTRY[key].layoutMode !== "native",
    )).toEqual([]);
  });

  test("resolves tutor assignments by both day and chapter so self-practice chapters stay separate", () => {
    expect(getA1AssignmentByDayAndChapter(16, "9")?.assignmentKey).toBe("A1-9");
    expect(getA1AssignmentByDayAndChapter(16, "10")?.assignmentKey).toBe("A1-10");
    expect(getA1AssignmentByDayAndChapter(3, "1.1")).toBeNull();
    expect(getA1AssignmentByDayAndChapter(2, "1.1")?.assignmentKey).toBe("A1-1.1");
  });

  test("builds the same canonical tutor context used by the Day 1 workbook", () => {
    const href = buildA1TutorMarkedWorkbookHref("A1-9", "chapter=9&hub=1&radio=done");
    const url = new URL(href, "https://www.falowen.app");
    expect(url.pathname).toBe("/campus/course/a1-day-16-food-and-negation-food-and-daily-life-workbook");
    expect(url.searchParams.get("assignmentKey")).toBe("A1-9");
    expect(url.searchParams.get("assignmentId")).toBe("A1-9");
    expect(url.searchParams.get("level")).toBe("A1");
    expect(url.searchParams.get("radio")).toBe("done");
    expect(url.searchParams.has("chapter")).toBe(false);
    expect(url.searchParams.has("hub")).toBe(false);
  });

  test("keeps A1-0.2 sections consecutive after the Hören rename", () => {
    expect(A1_ASSIGNMENT_REGISTRY["A1-0.2"].sections).toEqual([
      { key: "teil-1", number: 1, label: "Teil 1 · Reading and Questions" },
      { key: "teil-2", number: 2, label: "Teil 2 · Hören" },
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
