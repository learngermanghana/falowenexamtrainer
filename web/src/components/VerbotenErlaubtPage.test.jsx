import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import VerbotenErlaubtPage from "./VerbotenErlaubtPage";

jest.mock("../context/AuthContext", () => ({ useAuth: () => ({ user: { uid: "learner" } }) }));
jest.mock("./A1CanonicalSubmissionPanel", () => () => <p>Tutor review</p>);
jest.mock("./A1WorkbookMediaPanel", () => () => null);
jest.mock("./WorkbookDayMusic", () => () => null);
jest.mock("./PublishedHoerenPractice", () => () => null);
jest.mock("./A1TimedMockExam", () => ({
  __esModule: true,
  default: ({ children }) => children,
  useA1TimedMockExam: () => ({ attemptState: "active", secondsLeft: 900, isTabLocked: () => false }),
}));
jest.mock("./A1FamilyRecording", () => ({ task }) => <div data-testid="speaking-recorder">{task.teil}</div>);

const openGrammar = () => fireEvent.click(screen.getByRole("tab", { name: "Grammar" }));

const renderPage = () => render(
  <MemoryRouter>
    <VerbotenErlaubtPage />
  </MemoryRouter>,
);

describe("A1 Day 19 Goethe speaking readiness", () => {
  test("presents the three speaking exam parts instead of a forbidden/allowed grammar lesson", () => {
    renderPage();

    expect(screen.getByRole("heading", { name: /Goethe A1 Speaking Confidence Lab/i })).toBeVisible();
    const overview = within(screen.getByRole("heading", { name: "The three speaking parts" }).closest("section"));
    expect(overview.getByText("Teil 1 · Sich vorstellen")).toBeVisible();
    expect(overview.getByText("Teil 2 · Fragen und Antworten")).toBeVisible();
    expect(overview.getByText("Teil 3 · Bitten und Reagieren")).toBeVisible();
    expect(screen.queryByRole("heading", { name: /Erlaubt oder verboten/i })).not.toBeInTheDocument();
  });

  test("Teil 1 covers the complete self-introduction plus spelling and number tasks", () => {
    renderPage();
    openGrammar();

    ["Name", "Alter", "Land", "Wohnort", "Sprachen", "Beruf / Studium", "Hobby"].forEach((label) => {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    });
    expect(screen.getByText(/Buchstabiere deinen Nachnamen/i)).toBeVisible();
    expect(screen.getByText(/Telefonnummer oder eine Zahl/i)).toBeVisible();
  });

  test("Teil 2 requires the learner to ask before revealing the model", () => {
    renderPage();
    openGrammar();

    const teil2Heading = screen.getByRole("heading", { name: "Use the theme and keyword to form a question" });
    const teil2Section = teil2Heading.closest("section");
    expect(teil2Section).not.toBeNull();
    const teil2 = within(teil2Section);

    expect(teil2.getAllByText("THEMA").length).toBeGreaterThan(0);
    expect(teil2.getAllByText("STICHWORT · KEYWORD").length).toBeGreaterThan(0);
    expect(teil2.getAllByText("Freizeit").length).toBeGreaterThanOrEqual(2);
    expect(teil2.getByText("Wochenende")).toBeVisible();
    expect(teil2.queryByText("Was machst du am Wochenende?")).not.toBeInTheDocument();

    fireEvent.click(teil2.getAllByRole("button", { name: "Show model" })[0]);

    expect(teil2.getByText("Was machst du am Wochenende?")).toBeVisible();
  });


  test("Teil 2 cards separate Goethe theme from the keyword used to form the question", () => {
    renderPage();
    openGrammar();

    const teil2Section = screen.getByRole("heading", { name: "Use the theme and keyword to form a question" }).closest("section");
    const teil2 = within(teil2Section);

    [
      ["Freizeit", "Wochenende"],
      ["Persönliche Informationen", "Familie"],
      ["Wohnen", "Wohnort"],
      ["Essen und Trinken", "Getränke"],
      ["Alltag", "Freizeit"],
      ["Sprachen", "Deutsch"],
    ].forEach(([theme, keyword]) => {
      expect(teil2.getAllByText(theme).length).toBeGreaterThan(0);
      expect(teil2.getAllByText(keyword).length).toBeGreaterThan(0);
    });

    expect(teil2.getByText(/STICHWORT \/ KEYWORD is the word you use to build your question/i)).toBeVisible();
  });

  test("Teil 3 practises requests and reactions", () => {
    renderPage();
    openGrammar();

    const teil3Heading = screen.getByRole("heading", { name: "Make a request and react" });
    const teil3Section = teil3Heading.closest("section");
    expect(teil3Section).not.toBeNull();
    const teil3 = within(teil3Section);

    expect(teil3.getByText("Stift")).toBeVisible();
    expect(teil3.queryByText("Können Sie mir bitte einen Stift geben?")).not.toBeInTheDocument();

    fireEvent.click(teil3.getAllByRole("button", { name: "Show model" })[0]);

    expect(teil3.getByText("Können Sie mir bitte einen Stift geben?")).toBeVisible();
    expect(teil3.getByText("Ja, gern.")).toBeVisible();
  });

  test("shows all three recorders in the Assignment tab and keeps a tutor submission tab", () => {
    renderPage();
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute("aria-selected", "true");
    fireEvent.click(screen.getByRole("tab", { name: "Assignment" }));
    expect(screen.getAllByTestId("speaking-recorder")).toHaveLength(3);
    screen.getAllByTestId("speaking-recorder").forEach((recorder) => expect(recorder).toBeVisible());
    fireEvent.click(screen.getByRole("tab", { name: "Review & Submit" }));
    expect(screen.getByText("Tutor review")).toBeVisible();
  });
});
