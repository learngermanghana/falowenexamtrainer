import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
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

const fallbackCases = [
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

const renderFallback = async ({ day, path }) => {
  const location = `${path}?radio=done`;
  window.history.pushState({}, "", location);

  render(
    <MemoryRouter initialEntries={[location]}>
      <A2B1WorkbookGuidance level="A2" />
    </MemoryRouter>,
  );

  return screen.findByRole("tablist", {
    name: `A2 Day ${day} workbook sections`,
  });
};

describe("A2 universal fallback safety", () => {
  test.each(fallbackCases)(
    "Day $day Submit stays locked to the workbook assignment",
    async (routeCase) => {
      const tablist = await renderFallback(routeCase);

      fireEvent.click(within(tablist).getByRole("tab", { name: "Submit" }));

      const contextualSubmission = await screen.findByTestId("contextual-submission");
      expect(screen.queryByTestId("generic-submission")).not.toBeInTheDocument();
      expect(JSON.parse(contextualSubmission.textContent)).toEqual(expectedContext(routeCase));
    },
  );

  test("Day 25 keeps Grammar while relabeling Teil 4 as Lesen", async () => {
    const day25 = fallbackCases.find(({ day }) => day === 25);
    const tablist = await renderFallback(day25);

    await waitFor(() => {
      expect(within(tablist).getAllByRole("tab")).toHaveLength(7);
    });

    expect(within(tablist).getByRole("tab", { name: "Grammar" })).toBeInTheDocument();
    expect(within(tablist).getByRole("tab", { name: "Teil 4" })).toHaveTextContent(/Lesen/i);
  });

  test("only the bypassed Days 24-26 receive fallback submission locks", () => {
    fallbackCases.forEach((routeCase) => {
      expect(resolveA2FallbackSubmissionContext(routeCase.day)).toEqual(expectedContext(routeCase));
    });
    expect(resolveA2FallbackSubmissionContext(23)).toBeNull();
    expect(resolveA2FallbackSubmissionContext(27)).toBeNull();
  });
});
