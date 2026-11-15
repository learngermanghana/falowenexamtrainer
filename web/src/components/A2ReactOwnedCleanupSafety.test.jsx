import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { getA2B1WorkbookSectionProfile } from "./a2B1WorkbookSectionProfile";
import { cleanA2WorkbookPresentation } from "./a2GoetheListeningOnlyCleanup";
import A2Day24EinenUrlaubPlanenWorkbookPage from "./A2Day24EinenUrlaubPlanenWorkbookPage";
import A2Day25TagesablaufWorkbookPage from "./A2Day25TagesablaufWorkbookPage";
import A2Day26GefuehleInVerschiedenenSituationenWorkbookPage from "./A2Day26GefuehleInVerschiedenenSituationenWorkbookPage";
import A2Day27DigitaleKommunikationWorkbookPage from "./A2Day27DigitaleKommunikationWorkbookPage";
import A2Day28UeberDieZukunftSprechenWorkbookPage from "./A2Day28UeberDieZukunftSprechenWorkbookPage";

// Exercise the React-owned tabs and cleanup, not Firebase authentication or
// the timed-assignment session lifecycle.
jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({ user: null, studentProfile: null, idToken: null }),
}));
jest.mock("./SharedTimedAssignment", () => ({
  __esModule: true,
  default: ({ children }) => typeof children === "function"
    ? children({ isTabLocked: () => false }) : children,
  TimedAssignmentPanel: () => null,
  useTimedAssignment: () => ({ enabled: false, isTabLocked: () => false }),
}));
jest.mock("./navigation/AppBackButton", () => () => <div>Back</div>);
jest.mock("./AssignmentSubmissionPage", () => () => <div>Submission form</div>);
jest.mock("./ContextualAssignmentSubmissionPage", () => () => <div>Submission form</div>);
jest.mock("./WorkbookReferenceAnswers", () => () => <div>References</div>);
// Music fetches are unrelated to verifying native workbook tab ownership.
jest.mock("./WorkbookDayMusic", () => () => <div>Music preview</div>);
jest.mock("./CourseInlinePracticePanel", () => ({ type }) => <div>{type} practice</div>);
jest.mock("./SpeakingMindMap", () => () => <div>Speaking mind map</div>);
jest.mock("./SpeakingPracticeTimerCard", () => () => <div>Speaking timer</div>);
jest.mock("./A2Days26To28LearningUpgrade", () => () => <div>Late A2 learning upgrade</div>);
jest.mock("./A2B1WorkbookGuidance", () => ({
  A2B1WorkbookGuidance: () => <div>Workbook guidance</div>,
  WorkbookSubmissionReminder: () => <div role="note">Workbook reminder</div>,
}));
jest.mock("./A2B1WorkbookGrammarNotes", () => ({
  A2B1GrammarNotesTab: () => <div>Grammar notes</div>,
}));

const cases = [
  [24, "/campus/course/a2-day-24-einen-urlaub-planen-workbook", A2Day24EinenUrlaubPlanenWorkbookPage],
  [25, "/campus/course/a2-day-25-tagesablauf-workbook", A2Day25TagesablaufWorkbookPage],
  [26, "/campus/course/a2-day-26-gefuehle-in-verschiedenen-situationen-workbook", A2Day26GefuehleInVerschiedenenSituationenWorkbookPage],
  [27, "/campus/course/a2-day-27-digitale-kommunikation-workbook", A2Day27DigitaleKommunikationWorkbookPage],
  [28, "/campus/course/a2-day-28-ueber-die-zukunft-sprechen-workbook", A2Day28UeberDieZukunftSprechenWorkbookPage],
];

describe("A2 Days 24-28 React-owned cleanup safety", () => {
  test.each(cases)(
    "Day %i keeps its native standard tabs connected while legacy cleanup is called",
    (day, path, Component) => {
      window.history.pushState({}, "", `${path}?radio=done`);

      render(
        <MemoryRouter initialEntries={[`${path}?radio=done`]}>
          <main className="layout-main">
            <Component />
          </main>
        </MemoryRouter>,
      );

      const navigation = screen.getByRole("navigation", { name: `A2 Day ${day} workbook sections` });
      expect(navigation).toBeVisible();
      expect(() => cleanA2WorkbookPresentation(document, path)).not.toThrow();
      expect(navigation.isConnected).toBe(true);

      const profile = getA2B1WorkbookSectionProfile("A2", day);
      const schreibenTab = screen.queryByRole("tab", { name: /^Teil 2 · Schreiben/i });
      expect(Boolean(schreibenTab)).toBe(profile.writing);
      if (schreibenTab) {
        fireEvent.click(schreibenTab);
        expect(screen.getByRole("heading", { name: /Teil 2 · Schreiben/i })).toBeVisible();
      }
      expect(() => cleanA2WorkbookPresentation(document, path)).not.toThrow();
      expect(navigation.isConnected).toBe(true);

      fireEvent.click(screen.getByRole("tab", { name: /^Teil 3 · Lesen/i }));
      expect(screen.getByRole("heading", { name: /Teil 3 · Lesen/i })).toBeVisible();
      expect(() => cleanA2WorkbookPresentation(document, path)).not.toThrow();

      const hoerenTab = screen.queryByRole("tab", { name: /^Teil 4 · Hören/i });
      expect(Boolean(hoerenTab)).toBe(profile.listening);
      if (hoerenTab) {
        fireEvent.click(hoerenTab);
        expect(screen.getByRole("heading", { name: /Teil 4 · Hören/i })).toBeVisible();
      }
      expect(navigation.isConnected).toBe(true);
    },
  );
});
