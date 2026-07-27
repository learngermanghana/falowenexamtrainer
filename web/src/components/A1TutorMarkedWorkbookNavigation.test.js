import React from "react";
import { renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import {
  getAllowedWorkbookTabs,
  useA1WorkbookTabState,
} from "./A1SharedAssignmentWorkbookLayout";
import { A1_TUTOR_MARKED_OVERVIEW_GUIDANCE } from "./A1TutorMarkedOverviewGuidance";

const sections = [
  { key: "teil-1", label: "Teil 1" },
  { key: "teil-2", label: "Teil 2" },
  { key: "teil-3", label: "Teil 3" },
];

const assignment = {
  assignmentKey: "A1-test",
  day: 1,
  chapter: "0.1",
  sections,
};

describe("A1 tutor-marked workbook navigation", () => {
  test("orders Overview before Grammar and the Teil sections", () => {
    expect(getAllowedWorkbookTabs(sections, true)).toEqual([
      "overview",
      "grammar",
      "teil-1",
      "teil-2",
      "teil-3",
      "submit",
    ]);
  });

  test("opens Overview by default even when Grammar is available", () => {
    const wrapper = ({ children }) => (
      <MemoryRouter initialEntries={["/campus/course/a1-test-workbook"]}>{children}</MemoryRouter>
    );

    const { result } = renderHook(
      () => useA1WorkbookTabState({ assignment, sections, hasGrammar: true }),
      { wrapper },
    );

    expect(result.current.fallbackTab).toBe("overview");
    expect(result.current.activeTab).toBe("overview");
  });

  test("keeps an explicitly requested Grammar tab available", () => {
    const wrapper = ({ children }) => (
      <MemoryRouter initialEntries={["/campus/course/a1-test-workbook?workbookTab=grammar"]}>
        {children}
      </MemoryRouter>
    );

    const { result } = renderHook(
      () => useA1WorkbookTabState({ assignment, sections, hasGrammar: true }),
      { wrapper },
    );

    expect(result.current.activeTab).toBe("grammar");
  });

  test("Overview tells students to read Grammar and apply it to the assignment", () => {
    expect(A1_TUTOR_MARKED_OVERVIEW_GUIDANCE).toContain("open the Grammar tab");
    expect(A1_TUTOR_MARKED_OVERVIEW_GUIDANCE).toContain("read the grammar notes carefully");
    expect(A1_TUTOR_MARKED_OVERVIEW_GUIDANCE).toContain("Use the rules and examples from Grammar");
    expect(A1_TUTOR_MARKED_OVERVIEW_GUIDANCE).toContain("complete the assignment");
  });
});
