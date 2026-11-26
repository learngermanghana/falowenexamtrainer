import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import A1Day17DirectionsGrammarNotes from "./A1Day17DirectionsGrammarNotes";
import { getA1GrammarNotesComponent } from "./A1WorkbookGrammarNotes";
import { getA1Assignment } from "../data/a1AssignmentRegistry";

test("A1-11 grammar route uses the concise exam revision guide", () => {
  const chapter = getA1Assignment("A1-11");
  expect(chapter.day).toBe(17);
  expect(chapter.chapter).toBe("11");
  expect(getA1GrammarNotesComponent("A1-11")).toBe(A1Day17DirectionsGrammarNotes);
  const {container} = render(<A1Day17DirectionsGrammarNotes />);
  expect(container.querySelector('[data-a1-day17-directions-grammar="chapter-11-v2"]')).toBeInTheDocument();
  expect(screen.getByRole("heading",{name:/Kapitel 11 · Anweisungen/})).toBeInTheDocument();
  expect(screen.getByRole("heading",{name:"1. Imperativ mit Sie"})).toBeInTheDocument();
  expect(screen.getByRole("heading",{name:"3. Verboten, erlaubt und dürfen"})).toBeInTheDocument();
  expect(screen.getByRole("heading",{name:"4. Goethe A1 · Sprechen Teil 3"})).toBeInTheDocument();
  expect(screen.getByRole("heading",{name:"5. Kurz prüfen · Quick practice"})).toBeInTheDocument();
  expect(screen.queryByText(/Imperativ · du, ihr/)).not.toBeInTheDocument();
  expect(screen.queryByText("Bieg links ab.")).not.toBeInTheDocument();
  expect(screen.queryByText("Biegt links ab.")).not.toBeInTheDocument();
  expect(container.querySelector("iframe")).not.toBeInTheDocument();
  expect(container.innerHTML).not.toContain("youtube.com");
});
test("formal commands, signs and permission are covered", () => {
  const {container}=render(<A1Day17DirectionsGrammarNotes />);
  for(const phrase of ["zum = zu dem", "zur = zu der", "Biegen Sie links ab!", "Man darf hier nicht rauchen.", "Man darf hier parken.", "Darf ich hier parken?", "Bitte rauchen Sie hier nicht!", "Können Sie mir bitte einen Stift geben?"]) {
    expect(container.textContent).toContain(phrase);
  }
});
test("five ungraded self-checks give feedback and can be reset", () => {
  render(<A1Day17DirectionsGrammarNotes />);
  expect(screen.getAllByRole("group")).toHaveLength(5);
  fireEvent.click(screen.getByLabelText("Gehen Sie geradeaus!"));
  expect(screen.getByRole("status")).toHaveTextContent("Richtig! Verb + Sie + Rest.");
  fireEvent.click(screen.getByLabelText("Man darf hier rauchen."));
  expect(screen.getAllByRole("status")[1]).toHaveTextContent("Versuchen Sie es noch einmal.");
  fireEvent.click(screen.getByRole("button",{name:"Neu starten"}));
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
  expect(screen.getByText(/This self-check is not graded/)).toBeInTheDocument();
});
