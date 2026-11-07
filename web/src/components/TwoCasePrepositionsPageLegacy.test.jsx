import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TwoCasePrepositionsPageLegacy from "./TwoCasePrepositionsPageLegacy";
import { getA1GrammarNotesComponent } from "./A1WorkbookGrammarNotes";

const renderLesson = () => render(
  <MemoryRouter>
    <TwoCasePrepositionsPageLegacy />
  </MemoryRouter>,
);

test("A1-12.1 workbook Grammar tab and the standalone route use the rewritten lesson", () => {
  expect(getA1GrammarNotesComponent("A1-12.1")).toBe(TwoCasePrepositionsPageLegacy);
  renderLesson();

  expect(screen.getByRole("heading", { name: /Wechselpräpositionen – Two-Way Prepositions/i })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /What you already know/i })).toBeInTheDocument();
  expect(screen.getByText(/sein, werden, haben/i)).toBeInTheDocument();
  expect(screen.getByText(/prepositions can also determine a German case/i)).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /The nine two-way prepositions/i })).toBeInTheDocument();
  expect(screen.getByRole("table", { name: "Definite articles by grammatical case" })).toBeInTheDocument();
  expect(screen.getByRole("table", { name: "Indefinite articles by grammatical case" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /Mit, bei and zu: always Dativ/i })).toBeInTheDocument();
  expect(screen.getByText(/movement alone does not always mean Akkusativ/i)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Continue to the tutor-marked workbook/i })).toHaveAttribute("href", expect.stringContaining("assignmentKey=A1-12.1"));
});

test("A1 Day 18 teaching distinguishes object cases from cases required by prepositions", () => {
  renderLesson();
  expect(screen.getByText(/A single German sentence can contain both Akkusativ and Dativ/i)).toBeInTheDocument();
  expect(screen.getByText(/sehen requires den Mann/i)).toBeInTheDocument();
  expect(screen.getByText(/Do not apply the Wo\/Wohin\? case choice/i)).toBeInTheDocument();
  expect(screen.getByText(/Subject \+ Verb \+ \(Object, if needed\) \+ Preposition \+ German case phrase/i)).toBeInTheDocument();
});

test("self-check stays ungraded, explains mistakes and can be restarted", () => {
  renderLesson();

  expect(screen.getByText(/Your answers here do not affect your tutor-marked assignment/i)).toBeInTheDocument();
  const check = screen.getByRole("button", { name: "Check my answers" });
  expect(check).toBeDisabled();

  const groups = screen.getAllByRole("group");
  const options = ["den", "dem", "dem", "die", "der", "den / dem", "im", "dem", "die", "den"];
  expect(groups).toHaveLength(options.length);
  groups.forEach((group, index) => {
    fireEvent.click(within(group).getByRole("radio", { name: options[index] }));
  });
  expect(check).not.toBeDisabled();
  fireEvent.click(check);
  expect(screen.getByText("10/10 correct.")).toBeInTheDocument();
  expect(screen.getByText(/Mit always requires Dativ/i)).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Try again" }));
  expect(check).toBeDisabled();
  expect(screen.getByText("0 of 10 answered")).toBeInTheDocument();
});
