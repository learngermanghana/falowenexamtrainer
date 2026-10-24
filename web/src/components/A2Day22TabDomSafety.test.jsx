import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import A2Day22DieWochePlanungWorkbookPage from "./A2Day22DieWochePlanungWorkbookPage";
import A2Day6MoebelRaeumeWorkbookPage from "./A2Day6MoebelRaeumeWorkbookPage";
import { safelyCleanA2Day22Presentation } from "./A2LegacyStandardWorkbookNavigation";

jest.mock("./navigation/AppBackButton", () => () => <div>Back</div>);
jest.mock("./CourseInlinePracticePanel", () => ({ type }) => (
  <div data-testid={`practice-${type}`}>{type} practice</div>
));
jest.mock("./SpeakingMindMap", () => () => <div>Speaking mind map</div>);
jest.mock("./WorkbookReferenceAnswers", () => () => <div>Reference answers</div>);
jest.mock("./A2B1WorkbookGuidance", () => ({
  A2B1WorkbookGuidance: () => <div>Workbook guidance</div>,
  WorkbookSubmissionReminder: () => (
    <div role="note">Reminder: Practise here, then submit only your final answers through the Submit tab.</div>
  ),
}));
jest.mock("./A2StandardTabbedWorkbookPage", () => (props) => (
  <div data-testid="a2-standard-workbook" data-hoeren-url={props.hoerenAudioUrl || ""} />
));

describe("A2 workbook DOM safety and listening media", () => {
  test("Day 22 cleanup keeps React nodes attached while Teil 2, 3 and 4 are opened", () => {
    window.history.pushState(
      {},
      "",
      "/campus/course/a2-day-22-die-woche-planung-workbook?radio=done",
    );

    render(
      <MemoryRouter>
        <main className="layout-main">
          <A2Day22DieWochePlanungWorkbookPage />
        </main>
      </MemoryRouter>,
    );

    expect(() => safelyCleanA2Day22Presentation(document)).not.toThrow();
    expect(screen.getByText("Final Submission").closest("section")).not.toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: /Teil 2 · Schreiben/i }));
    expect(screen.getByRole("heading", { name: /Teil 2 · Schreiben/i })).toBeVisible();
    expect(() => safelyCleanA2Day22Presentation(document)).not.toThrow();

    fireEvent.click(screen.getByRole("button", { name: /Teil 3 · Lesen/i }));
    expect(screen.getByRole("heading", { name: /Teil 3 · Lesen/i })).toBeVisible();
    expect(() => safelyCleanA2Day22Presentation(document)).not.toThrow();
    expect(screen.getByText("Aufgabe 1 · Gülcan schreibt Sonja, dass ...")).toBeVisible();
    expect(screen.getByText("Aufgabe 2 · In der ersten Woche haben andere Studierende ...")).toBeVisible();
    expect(screen.getByText("Aufgabe 3 · In der Wohngemeinschaft ...")).toBeVisible();
    expect(screen.getByText("Aufgabe 4 · Gülcan findet es wichtig, ...")).toBeVisible();
    expect(screen.getByText("Aufgabe 5 · Während Sonjas Besuch ...")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: /Teil 4 · Hören/i }));
    expect(() => safelyCleanA2Day22Presentation(document)).not.toThrow();
    expect(
      screen.getByRole("heading", { name: "Teil 4 · Hören · Goethe Self-Check" }),
    ).toBeVisible();
    expect(screen.getByText(/Teil 4 is self-check practice and is not submitted/i)).toBeVisible();
  });

  test("Day 6 Teil 4 uses only the requested YouTube video", () => {
    render(<A2Day6MoebelRaeumeWorkbookPage />);

    expect(screen.getByTestId("a2-standard-workbook")).toHaveAttribute(
      "data-hoeren-url",
      "https://youtu.be/WuA8Xabn-Uw",
    );
  });
});
