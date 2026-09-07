import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { getInlineCourseAssignments } from "../utils/courseLessonAssignments";
import {
  A2B1WorkbookGuidance,
  resolveA2FallbackSubmissionContext,
} from "./A2B1WorkbookGuidance";

jest.mock("./AssignmentSubmissionPage", () => () => (
  <div data-testid="generic-submission">Generic submission</div>
));

jest.mock("./ContextualAssignmentSubmissionPage", () => ({ submissionContext }) => (
  <pre data-testid="contextual-submission">{JSON.stringify(submissionContext)}</pre>
));

jest.mock("./A2B1WorkbookGrammarNotes", () => ({
  A2B1GrammarNotesTab: ({ level, day }) => <div>{level} Day {day} grammar notes</div>,
}));

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
      <A2B1WorkbookGuidance level="A2" />
    </MemoryRouter>,
  );
};

describe("A2 late native submission safety", () => {
  test.each(nativeSubmissionCases)(
    "Day $day stays locked to the workbook assignment without universal fallback tabs",
    (routeCase) => {
      renderNativeSubmission(routeCase);

      expect(
        screen.queryByRole("tablist", { name: `A2 Day ${routeCase.day} workbook sections` }),
      ).not.toBeInTheDocument();
      expect(document.querySelector("[data-universal-a2-workbook-tabs]")).toBeNull();

      const panel = document.querySelector(`[data-a2-late-native-submission="${routeCase.day}"]`);
      expect(panel).toBeTruthy();
      expect(panel.textContent).toMatch(new RegExp(`Submit workbook · Day ${routeCase.day}`, "i"));

      const contextualSubmission = screen.getByTestId("contextual-submission");
      expect(screen.queryByTestId("generic-submission")).not.toBeInTheDocument();
      expect(JSON.parse(contextualSubmission.textContent)).toEqual(expectedContext(routeCase));
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

  test("Days 24 and 26 identify Hören as self-check only", () => {
    [24, 26].forEach((day) => {
      document.body.innerHTML = "";
      const routeCase = nativeSubmissionCases.find((item) => item.day === day);
      renderNativeSubmission(routeCase);
      const panel = document.querySelector(`[data-a2-late-native-submission="${day}"]`);
      expect(panel.textContent).toMatch(/Teil 4 · Hören is self-check practice and is not submitted/i);
    });
  });

  test("only Days 24-26 receive route-locked shared submission contexts", () => {
    nativeSubmissionCases.forEach((routeCase) => {
      expect(resolveA2FallbackSubmissionContext(routeCase.day)).toEqual(expectedContext(routeCase));
    });
    expect(resolveA2FallbackSubmissionContext(23)).toBeNull();
    expect(resolveA2FallbackSubmissionContext(27)).toBeNull();
  });
});
