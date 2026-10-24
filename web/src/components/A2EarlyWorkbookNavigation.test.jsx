import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";

jest.mock("../context/AuthContext", () => ({ useAuth: () => ({ studentProfile: { level: "A2" }, user: null }) }));
jest.mock("./SharedTimedAssignment", () => ({
  __esModule: true,
  default: ({ children }) => children({ isTabLocked: () => false }),
  TimedAssignmentPanel: () => null,
}));
jest.mock("./navigation/AppBackButton", () => () => <div>Back</div>);
jest.mock("./AssignmentSubmissionPage", () => () => <div>Submission form</div>);
jest.mock("./ContextualAssignmentSubmissionPage", () => () => <div>Submission form</div>);
jest.mock("./WorkbookReferenceAnswers", () => () => <div>References</div>);
jest.mock("./CourseInlinePracticePanel", () => () => <div>Practice</div>);
jest.mock("./SpeakingMindMap", () => () => <div>Mind map</div>);
jest.mock("./SpeakingPracticeTimerCard", () => () => <div>Speaking timer</div>);
jest.mock("./A2B1WorkbookGrammarNotes", () => ({ A2B1GrammarNotesTab: () => <div>Grammar</div> }));
jest.mock("./A2SecondStageLearningUpgrade", () => ({ A2SecondStageSpeakingUpgrade: () => null, A2SecondStageWritingUpgrade: () => null }));
jest.mock("./A2ReadingTaskPanel", () => () => <div>Reading questions</div>);
jest.mock("./A2GoetheWritingTaskCard", () => () => <div>Writing task</div>);

const paths = [
  [10, "tourismus-und-traditionelle-feste"],
  [11, "unterwegs-verkehrsmittel-vergleichen"],
  [12, "mein-traumberuf"],
  [13, "vorstellungsgespraech"],
];
beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

test.each(paths)("A2 Day %i keeps native navigation after leaving a Lesen deep link", (day, slug) => {
  const path = `/campus/course/a2-day-${day}-${slug}-workbook`;
  const entry = `${path}?radio=done&level=A2&view=lesen`;
  window.history.pushState({}, "", entry);
  render(<MemoryRouter initialEntries={[entry]}><A2StandardTabbedWorkbookPage day={day} title="Workbook" /></MemoryRouter>);
  const nav = screen.getByRole("navigation", { name: `A2 Day ${day} workbook sections` });
  expect(screen.getByRole("tab", { name: /^Teil 3/ })).toHaveAttribute("aria-selected", "true");
  fireEvent.click(screen.getByRole("tab", { name: /^Teil 1/ }));
  // Speaking mounts the real compatibility guidance and its DOM observer.
  act(() => jest.advanceTimersByTime(600));
  expect(nav).toBeVisible();
  expect(screen.getByRole("tab", { name: /^Teil 1/ })).toBeVisible();
  expect(document.querySelector('[data-universal-a2-workbook-tabs]')).toBeNull();
  for (const part of ["Teil 3", "Teil 4", "Teil 1", "Teil 3"]) {
    fireEvent.click(screen.getByRole("tab", { name: new RegExp(`^${part}`) }));
    act(() => jest.advanceTimersByTime(600));
    expect(nav).toBeVisible();
    expect(screen.getByRole("tab", { name: new RegExp(`^${part}`) })).toHaveAttribute("aria-selected", "true");
  }
});
