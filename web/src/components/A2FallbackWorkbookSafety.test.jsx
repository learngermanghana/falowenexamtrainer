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

const nativeSubmissionCases = [
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

const renderNativeSubmission = ({ path }) => {
  const location = `${path}?radio=done`;
  window.history.pushState({}, "", location);

  render(
    <MemoryRouter initialEntries={[location]}>
      <A2LateWorkbookSubmissionPanel pathname={path} />
    </MemoryRouter>,
  );
};

describe("A2 late native submission safety", () => {
  test.each(nativeSubmissionCases)(
    "Day $day stays locked to the workbook assignment in the production panel",
    (routeCase) => {
      renderNativeSubmission(routeCase);

      const panel = document.querySelector(`[data-a2-late-native-submission="${routeCase.day}"]`);
      expect(panel).toBeTruthy();
      expect(panel.textContent).toMatch(new RegExp(`Submit Workbook · Day ${routeCase.day}`, "i"));

      const contextualSubmission = screen.getByTestId("contextual-submission");
      expect(JSON.parse(contextualSubmission.textContent)).toEqual(expectedContext(routeCase));
      expect(resolveA2LateWorkbookSubmissionContext(routeCase.path)).toEqual(expectedContext(routeCase));
    },
  );

  test("Day 25 identifies Part 4 as submitted Lesen rather than Hören", () => {
    const day25 = nativeSubmissionCases.find(({ day }) => day === 25);
    renderNativeSubmission(day25);

    const panel = document.querySelector('[data-a2-late-native-submission="25"]');
    expect(panel).toBeTruthy();
    expect(panel.textContent).toMatch(/Teil 4 · Lesen is part of the submitted workbook/i);
    expect(panel.textContent).not.toMatch(/Teil 4 · Hören/i);
  });

  test.each([24, 26])("Day %i identifies Hören as self-check only", (day) => {
    const routeCase = nativeSubmissionCases.find((item) => item.day === day);
    renderNativeSubmission(routeCase);

    const panel = document.querySelector(`[data-a2-late-native-submission="${day}"]`);
    expect(panel).toBeTruthy();
    expect(panel.textContent).toMatch(/Teil 4 · Hören is self-check practice and is not submitted/i);
  });

  test("legacy fallback context stays in parity while only Days 24-26 are supported", () => {
    nativeSubmissionCases.forEach((routeCase) => {
      expect(resolveA2FallbackSubmissionContext(routeCase.day)).toEqual(expectedContext(routeCase));
      expect(resolveA2LateWorkbookSubmissionContext(routeCase.path)).toEqual(expectedContext(routeCase));
    });
    expect(resolveA2FallbackSubmissionContext(23)).toBeNull();
    expect(resolveA2FallbackSubmissionContext(27)).toBeNull();
    expect(resolveA2LateWorkbookSubmissionContext("/campus/course/a2-day-23-wie-kommst-du-zur-schule-oder-zur-arbeit-workbook")).toBeNull();
  });
});
