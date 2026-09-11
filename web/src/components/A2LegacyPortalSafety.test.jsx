import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import A2LegacyStandardWorkbookNavigation from "./A2LegacyStandardWorkbookNavigation";
import { insertA2LegacyPortalMountBefore } from "./A2LegacyStandardWorkbookNavigationImpl";
import A2Day23WieKommstDuZurSchuleOderZurArbeitWorkbookPage from "./A2Day23WieKommstDuZurSchuleOderZurArbeitWorkbookPage";
import A2Day24EinenUrlaubPlanenWorkbookPage from "./A2Day24EinenUrlaubPlanenWorkbookPage";
import A2Day25TagesablaufWorkbookPage from "./A2Day25TagesablaufWorkbookPage";
import A2Day26GefuehleInVerschiedenenSituationenWorkbookPage from "./A2Day26GefuehleInVerschiedenenSituationenWorkbookPage";
import A2Day27DigitaleKommunikationWorkbookPage from "./A2Day27DigitaleKommunikationWorkbookPage";
import A2Day28UeberDieZukunftSprechenWorkbookPage from "./A2Day28UeberDieZukunftSprechenWorkbookPage";

jest.mock("./AssignmentSubmissionPage", () => () => <div>Submission</div>);
jest.mock("./ContextualAssignmentSubmissionPage", () => () => <div>Submission</div>);
jest.mock("./WorkbookReferenceAnswers", () => () => <div>References</div>);
jest.mock("./A2B1WorkbookGrammarNotes", () => ({
  A2B1GrammarNotesTab: () => <div>Grammar notes</div>,
}));
jest.mock("./navigation/AppBackButton", () => () => <div>Back</div>);
jest.mock("./CourseInlinePracticePanel", () => ({ type }) => <div>{type} practice</div>);
jest.mock("./SpeakingMindMap", () => () => <div>Speaking mind map</div>);
jest.mock("./SpeakingPracticeTimerCard", () => () => <div>Speaking timer</div>);
jest.mock("./A2Days26To28LearningUpgrade", () => () => <div>Late A2 learning upgrade</div>);
jest.mock("./A2B1WorkbookGuidance", () => ({
  A2B1WorkbookGuidance: () => <div>Workbook guidance</div>,
  WorkbookSubmissionReminder: () => <div role="note">Workbook reminder</div>,
}));

const cleanedCases = [
  [23, "/campus/course/a2-day-23-wie-kommst-du-zur-schule-oder-zur-arbeit-workbook", A2Day23WieKommstDuZurSchuleOderZurArbeitWorkbookPage],
  [24, "/campus/course/a2-day-24-einen-urlaub-planen-workbook", A2Day24EinenUrlaubPlanenWorkbookPage],
  [25, "/campus/course/a2-day-25-tagesablauf-workbook", A2Day25TagesablaufWorkbookPage],
  [26, "/campus/course/a2-day-26-gefuehle-in-verschiedenen-situationen-workbook", A2Day26GefuehleInVerschiedenenSituationenWorkbookPage],
  [27, "/campus/course/a2-day-27-digitale-kommunikation-workbook", A2Day27DigitaleKommunikationWorkbookPage],
  [28, "/campus/course/a2-day-28-ueber-die-zukunft-sprechen-workbook", A2Day28UeberDieZukunftSprechenWorkbookPage],
];

describe("A2 legacy portal safety", () => {
  test("does not call insertBefore when the reference row is already stale", () => {
    const parent = document.createElement("div");
    const row = document.createElement("div");
    const mount = document.createElement("div");
    parent.appendChild(row);
    row.remove();

    expect(() => insertA2LegacyPortalMountBefore(parent, mount, row)).not.toThrow();
    expect(insertA2LegacyPortalMountBefore(parent, mount, row)).toBe(false);
    expect(mount.isConnected).toBe(false);
  });

  test("absorbs a NotFoundError if the row disappears during insertion", () => {
    const parent = document.createElement("div");
    const row = document.createElement("div");
    const mount = document.createElement("div");
    parent.appendChild(row);
    const nativeInsertBefore = parent.insertBefore.bind(parent);
    parent.insertBefore = (node, referenceNode) => {
      referenceNode.remove();
      return nativeInsertBefore(node, referenceNode);
    };

    expect(() => insertA2LegacyPortalMountBefore(parent, mount, row)).not.toThrow();
    expect(mount.parentNode).toBeNull();
  });

  test.each(cleanedCases)(
    "Day %i uses the native shared workbook without a legacy portal",
    (day, path, Component) => {
      window.history.pushState({}, "", `${path}?radio=done`);

      render(
        <MemoryRouter initialEntries={[`${path}?radio=done`]}>
          <A2LegacyStandardWorkbookNavigation />
          <main className="layout-main">
            <Component />
          </main>
        </MemoryRouter>,
      );

      expect(screen.getByRole("navigation", { name: `A2 Day ${day} workbook sections` })).toBeVisible();
      expect(document.querySelector("[data-a2-standard-legacy-nav-root]")).toBeNull();
      expect(document.querySelector("[data-universal-a2-workbook-tabs]")).toBeNull();

      expect(() => fireEvent.click(screen.getByRole("tab", { name: "Teil 2" }))).not.toThrow();
      expect(screen.getByRole("heading", { name: /Teil 2 · Schreiben/i })).toBeVisible();

      expect(() => fireEvent.click(screen.getByRole("tab", { name: "Teil 3" }))).not.toThrow();
      expect(screen.getByRole("heading", { name: /Teil 3 · Lesen/i })).toBeVisible();

      expect(() => fireEvent.click(screen.getByRole("tab", { name: "Submit" }))).not.toThrow();
      expect(screen.getByText("Submission")).toBeVisible();
    },
  );
});
