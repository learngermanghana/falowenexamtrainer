import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import VerbotenErlaubtPage from "./VerbotenErlaubtPage";

jest.mock("./A1ExamSpeakingPracticePanel", () => () => <div data-testid="a1-speaking-practice" />);

const renderPage = () => render(
  <MemoryRouter>
    <VerbotenErlaubtPage />
  </MemoryRouter>,
);

describe("VerbotenErlaubtPage A1 exam practice", () => {
  test("uses short darf and darf nicht rules with exam signs", () => {
    renderPage();

    expect(screen.getByText("Im Kursraum darfst du nicht essen.")).toBeVisible();
    expect(screen.getByText("Im Unterricht darfst du nicht telefonieren.")).toBeVisible();
    expect(screen.getByText("Im Computerraum darfst du Deutsch üben.")).toBeVisible();
    expect(screen.getAllByLabelText("Erlaubt")).toHaveLength(4);
    expect(screen.getAllByLabelText("Verboten")).toHaveLength(4);
    expect(screen.getAllByRole("button", { name: "Erlaubt" })).toHaveLength(8);
    expect(screen.getAllByRole("button", { name: "Verboten" })).toHaveLength(8);
    expect(screen.getAllByText("✓").length).toBeGreaterThanOrEqual(12);
    expect(screen.getAllByText("✕").length).toBeGreaterThanOrEqual(12);
  });

  test("shows reusable Teil 2 question-and-answer cards", () => {
    renderPage();

    expect(screen.getByRole("heading", { name: "Ask one question and give one complete answer" })).toBeVisible();
    expect(screen.getByText("Was trinken Sie im Unterricht?")).toBeVisible();
    expect(screen.getByText("Ich trinke im Unterricht Wasser.")).toBeVisible();
    expect(screen.getByText("Wann benutzen Sie Ihr Handy?")).toBeVisible();
    expect(screen.getByText("Haben Sie ein Fahrrad?")).toBeVisible();
  });

  test("shows Teil 3 request and reaction cards", () => {
    renderPage();

    expect(screen.getByRole("heading", { name: "Make a request and react politely" })).toBeVisible();
    expect(screen.getByText("Können Sie mir bitte Wasser geben?")).toBeVisible();
    expect(screen.getByText("Können Sie bitte Ihr Handy ausmachen?")).toBeVisible();
    expect(screen.getByText("Bitte rauchen Sie hier nicht.")).toBeVisible();
    expect(screen.getByText("Entschuldigung.")).toBeVisible();
  });

  test("gives a complete-sentence explanation after an exam choice", () => {
    renderPage();

    fireEvent.click(screen.getAllByRole("button", { name: "Erlaubt" })[0]);

    expect(screen.getByText(/Richtig\./)).toBeVisible();
    expect(screen.getByText(/Ama darf im Unterricht Wasser trinken/)).toBeVisible();
  });
});
