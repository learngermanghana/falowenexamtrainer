import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { cleanA2WorkbookPresentation } from "./a2GoetheListeningOnlyCleanup";
import A2Day24EinenUrlaubPlanenWorkbookPage from "./A2Day24EinenUrlaubPlanenWorkbookPage";
import A2Day25TagesablaufWorkbookPage from "./A2Day25TagesablaufWorkbookPage";
import A2Day26GefuehleInVerschiedenenSituationenWorkbookPage from "./A2Day26GefuehleInVerschiedenenSituationenWorkbookPage";
import A2Day27DigitaleKommunikationWorkbookPage from "./A2Day27DigitaleKommunikationWorkbookPage";
import A2Day28UeberDieZukunftSprechenWorkbookPage from "./A2Day28UeberDieZukunftSprechenWorkbookPage";

jest.mock("./navigation/AppBackButton", () => () => <div>Back</div>);
jest.mock("./AssignmentSubmissionPage", () => () => <div>Submission form</div>);
jest.mock("./ContextualAssignmentSubmissionPage", () => () => <div>Submission form</div>);
jest.mock("./WorkbookReferenceAnswers", () => () => <div>References</div>);
jest.mock("./CourseInlinePracticePanel", () => ({ type }) => <div>{type} practice</div>);
jest.mock("./SpeakingMindMap", () => () => <div>Speaking mind map</div>);
jest.mock("./SpeakingPracticeTimerCard", () => () => <div>Speaking timer</div>);
jest.mock("./A2B1WorkbookGuidance", () => ({
  A2B1WorkbookGuidance: () => <div>Workbook guidance</div>,
  WorkbookSubmissionReminder: () => (
    <div role="note">Reminder: Practise here, then submit only your final answers through the Submit tab.</div>
  ),
}));

const cases = [
  {
    day: 24,
    path: "/campus/course/a2-day-24-einen-urlaub-planen-workbook",
    Component: A2Day24EinenUrlaubPlanenWorkbookPage,
    role: "button",
    teil2: /Teil 2 · Schreiben/i,
    teil3: /Teil 3 · Lesen/i,
    cleanupTab: /Teil 4 · Hören/i,
  },
  {
    day: 25,
    path: "/campus/course/a2-day-25-tagesablauf-workbook",
    Component: A2Day25TagesablaufWorkbookPage,
    role: "button",
    teil2: /Teil 2 · Schreiben/i,
    teil3: /Teil 3 · Lesen/i,
    cleanupTab: /Teil 4 · Lesen/i,
  },
  {
    day: 26,
    path: "/campus/course/a2-day-26-gefuehle-in-verschiedenen-situationen-workbook",
    Component: A2Day26GefuehleInVerschiedenenSituationenWorkbookPage,
    role: "button",
    teil2: /Teil 2 · Schreiben/i,
    teil3: /Teil 3 · Lesen/i,
    cleanupTab: /Teil 4 · Hören/i,
  },
  {
    day: 27,
    path: "/campus/course/a2-day-27-digitale-kommunikation-workbook",
    Component: A2Day27DigitaleKommunikationWorkbookPage,
    role: "tab",
    teil2: "Teil 2",
    teil3: "Teil 3",
    cleanupTab: "Teil 4",
  },
  {
    day: 28,
    path: "/campus/course/a2-day-28-ueber-die-zukunft-sprechen-workbook",
    Component: A2Day28UeberDieZukunftSprechenWorkbookPage,
    role: "tab",
    teil2: "Teil 2",
    teil3: "Teil 3",
    cleanupTab: "Teil 4",
  },
];

const getControl = (role, name) => screen.getByRole(role, { name });

describe("A2 Days 24-28 React-owned cleanup safety", () => {
  test.each(cases)(
    "Day $day keeps React-owned nodes attached while cleanup and tab changes interleave",
    ({ path, Component, role, teil2, teil3, cleanupTab }) => {
      window.history.pushState({}, "", `${path}?radio=done`);

      const { container } = render(
        <MemoryRouter initialEntries={[`${path}?radio=done`]}>
          <main className="layout-main">
            <Component />
          </main>
        </MemoryRouter>,
      );

      expect(() => fireEvent.click(getControl(role, cleanupTab))).not.toThrow();
      expect(() => cleanA2WorkbookPresentation(document, path)).not.toThrow();

      const safelyHidden = Array.from(container.querySelectorAll('[data-a2-react-owned-hidden="true"]'));
      expect(safelyHidden.length).toBeGreaterThan(0);
      safelyHidden.forEach((element) => {
        expect(element.isConnected).toBe(true);
        expect(element).not.toBeVisible();
      });

      expect(() => fireEvent.click(getControl(role, teil2))).not.toThrow();
      expect(screen.getByRole("heading", { name: /Teil 2/i })).toBeVisible();
      expect(() => cleanA2WorkbookPresentation(document, path)).not.toThrow();

      expect(() => fireEvent.click(getControl(role, teil3))).not.toThrow();
      expect(screen.getByRole("heading", { name: /Teil 3/i })).toBeVisible();
      expect(() => cleanA2WorkbookPresentation(document, path)).not.toThrow();
    },
  );
});
