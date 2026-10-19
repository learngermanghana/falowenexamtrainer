import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import A1Day17DirectionsGrammarNotes from "./A1Day17DirectionsGrammarNotes";
import { getA1GrammarNotesComponent } from "./A1WorkbookGrammarNotes";
import { getA1Assignment } from "../data/a1AssignmentRegistry";

test("the real A1 Day 17 Kapitel 11 grammar route uses the updated Wegbeschreibung notes", () => {
  const chapter = getA1Assignment("A1-11");
  expect(chapter.day).toBe(17);
  expect(chapter.chapter).toBe("11");
  expect(getA1GrammarNotesComponent("A1-11")).toBe(A1Day17DirectionsGrammarNotes);
  const { container } = render(<A1Day17DirectionsGrammarNotes />);
  expect(container.querySelector('[data-a1-day17-directions-grammar="chapter-11-v2"]')).toBeInTheDocument();
  expect(screen.getByText(/Kapitel 11 · Wegbeschreibung und Imperativ/)).toBeInTheDocument();
  expect(screen.getByText("4. Imperativ · du, ihr und Sie")).toBeInTheDocument();
  expect(screen.getByText("6. Kurz prüfen · Self-check")).toBeInTheDocument();
  expect(screen.queryByText(/Zusatzaufgabe/)).not.toBeInTheDocument();
  expect(container.querySelector("iframe")).not.toBeInTheDocument();
  expect(container.innerHTML).not.toContain("youtube.com");
  expect(screen.getByText(/In this lesson you learn how to ask for directions/)).toBeInTheDocument();
  expect(screen.getByText(/This grammar self-check is not graded/)).toBeInTheDocument();
});

test("teaches du, ihr and Sie including separable abbiegen and zum/zur", () => {
  render(<A1Day17DirectionsGrammarNotes />);
  expect(screen.getByText(/zu \+ dem =/)).toBeInTheDocument();
  expect(screen.getByText(/zu \+ der =/)).toBeInTheDocument();
  expect(screen.getByText("Bieg links ab.")).toBeInTheDocument();
  expect(screen.getByText("Biegt links ab.")).toBeInTheDocument();
  expect(screen.getByText("Biegen Sie links ab.")).toBeInTheDocument();
  expect(screen.getByText(/Nimm die erste Straße rechts/)).toBeInTheDocument();
});

test("grammar self-check gives feedback without changing assessed workbook sections", () => {
  render(<A1Day17DirectionsGrammarNotes />);
  const answer = screen.getByLabelText("Gehen Sie geradeaus.");
  fireEvent.click(answer);
  expect(screen.getByText(/Correct! \/ Richtig! Für Sie: Infinitiv \+ Sie/)).toBeInTheDocument();
  expect(screen.getByText(/Diese Grammatikübung ist nicht Teil der benoteten Hausaufgabe/)).toBeInTheDocument();
});
