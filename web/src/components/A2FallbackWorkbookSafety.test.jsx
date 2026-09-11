import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { getInlineCourseAssignments } from "../utils/courseLessonAssignments";
import { resolveA2FallbackSubmissionContext } from "./A2B1WorkbookGuidance";
import A2LateWorkbookSubmissionPanel, {
  resolveA2LateWorkbookSubmissionContext,
} from "./A2LateWorkbookSubmissionPanel";

jest.mock("./ContextualAssignmentSubmissionPage", () => ({ submissionContext }) => (
  <pre data-testid="contextual-submission">{JSON.stringify(submissionContext)}</pre>
));

const compatibilityCases = [
  {
    day: 24,
    path: "/campus/course/a2-day-24-einen-urlaub-planen-workbook",
    fallbackChapter: "9.24",
    workbookId: "A2Day24EinenUrlaubPlanen",
  },
  {
    day: 25,
    path: "/campus/course/a2-day-25-tagesablauf-workbook",
    fallbackChapter: "9.25",
    workbookId: "A2Day25Tagesablauf",
  },
  {
    day: 26,
    path: "/campus/course/a2-day-26-gefuehle-in-verschiedenen-situationen-workbook",
    fallbackChapter: "10.26",
    workbookId: "A2Day26GefuehleInVerschiedenenSituationen",
  },
];

const expectedContext = ({ day, fallbackChapter, workbookId }) => {
  const assignment = getInlineCourseAssignments("A2", day)[0] || null;
  const chapter = assignment?.chapter || fallbackChapter;
  const assignmentKey = assignment?.assignmentKey || `A2-${chapter}`;
  return {
    level: "A2",
    day,
    chapter,
    assignmentKey,
    canonicalAssignmentKey: assignmentKey,
    workbookId,
  };
};

const renderCompatibilityPanel = ({ path }) => {
  const location = `${path}?radio=done`;
  window.history.pushState({}, "", location);

  render(
    <MemoryRouter initialEntries={[location]}>
      <A2LateWorkbookSubmissionPanel pathname={path} />
    </MemoryRouter>,
  );
};

describe("A2 late submission compatibility safety", () => {
  test.each(compatibilityCases)(
    "compatibility resolver keeps Day $day locked to its canonical assignment",
    (routeCase) => {
      renderCompatibilityPanel(routeCase);
      const contextualSubmission = screen.getByTestId("contextual-submission");
      expect(JSON.parse(contextualSubmission.textContent)).toEqual(expectedContext(routeCase));
      expect(resolveA2LateWorkbookSubmissionContext(routeCase.path)).toEqual(expectedContext(routeCase));
    },
  );

  test("Day 25 compatibility copy now identifies Hören as submitted", () => {
    const day25 = compatibilityCases.find(({ day }) => day === 25);
    renderCompatibilityPanel(day25);

    const panel = document.querySelector('[data-a2-late-native-submission="25"]');
    expect(panel).toBeTruthy();
    expect(panel.textContent).toMatch(/Teil 4 · Hören is part of the submitted workbook/i);
    expect(panel.textContent).not.toMatch(/Teil 4 · Lesen/i);
  });

  test.each([24, 26])("Day %i compatibility copy keeps Hören self-check only", (day) => {
    const routeCase = compatibilityCases.find((item) => item.day === day);
    renderCompatibilityPanel(routeCase);

    const panel = document.querySelector(`[data-a2-late-native-submission="${day}"]`);
    expect(panel).toBeTruthy();
    expect(panel.textContent).toMatch(/Teil 4 · Hören is self-check practice and is not submitted/i);
  });

  test("legacy fallback resolver stays in parity for its compatibility routes", () => {
    compatibilityCases.forEach((routeCase) => {
      expect(resolveA2FallbackSubmissionContext(routeCase.day)).toEqual(expectedContext(routeCase));
      expect(resolveA2LateWorkbookSubmissionContext(routeCase.path)).toEqual(expectedContext(routeCase));
    });
  });
});
