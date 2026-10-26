import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import A1Day20GoetheWritingGrammarPage, { checkFormAnswer } from "./A1Day20GoetheWritingGrammarPage";

describe("A1 Day 20 Goethe writing grammar page", () => {
  test("keeps the short writing overview and the reusable letter pattern", () => {
    render(<A1Day20GoetheWritingGrammarPage />);

    expect(screen.getByRole("heading", { name: "Goethe A1 Schreiben has two parts" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Teil 1: Formular ausfüllen (5 Punkte)" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Teil 2: Kurze E-Mail schreiben (10 Punkte)" })).toBeInTheDocument();
    expect(screen.getByText(/Learn one repeatable writing pattern/i)).toBeInTheDocument();
    expect(screen.getByText(/weil = because/i)).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Informal Letter Structure" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Formelle und informelle Schreibaufgaben" })).not.toBeInTheDocument();
    expect(screen.queryByText(/Kwame Mensah/i)).not.toBeInTheDocument();
  });

  test("allows checking five Maria fields locally without any assignment submission", () => {
    const { container } = render(<A1Day20GoetheWritingGrammarPage />);
    const practice = container.querySelector('[data-a1-123-grammar-practice="true"]');
    expect(practice).not.toBeNull();
    expect(within(practice).getAllByRole("textbox")).toHaveLength(5);
    expect(practice).toHaveTextContent("Maria Rossi");
    expect(practice).toHaveTextContent("Sprachschule Aktiv München");
    expect(practice).not.toHaveTextContent("Correct answer:");

    const fields = [
      ["1. Kursart", "Intensiv-Deutschkurs"],
      ["2. Kursbeginn (Monat)", "August"],
      ["3. Kursdauer", "vier Wochen"],
      ["4. Unterkunft", "Einzelzimmer"],
      ["5. Bezahlung", "mit Kreditkarte"],
    ];
    fields.forEach(([label, answer]) => fireEvent.change(within(practice).getByRole("textbox", { name: label }), { target: { value: answer } }));
    fireEvent.click(within(practice).getByRole("button", { name: "Check Answers" }));
    expect(within(practice).getByText("Your score: 5/5")).toBeInTheDocument();
    expect(within(practice).getAllByText("✓ Richtig!")).toHaveLength(5);

    fireEvent.change(within(practice).getByRole("textbox", { name: "5. Bezahlung" }), { target: { value: "bar" } });
    fireEvent.click(within(practice).getByRole("button", { name: "Check Answers" }));
    expect(within(practice).getByText("Your score: 4/5")).toBeInTheDocument();
    expect(within(practice).getByText("Kreditkarte", { selector: "strong" })).toBeInTheDocument();

    fireEvent.click(within(practice).getByRole("button", { name: "Try again" }));
    expect(within(practice).getAllByRole("textbox")).toHaveLength(5);
    expect(within(practice).queryByText(/Your score:/)).not.toBeInTheDocument();
    expect(within(practice).getAllByRole("textbox").every((field) => field.value === "")).toBe(true);
    expect(container.querySelector('[data-testid="canonical-submit"]')).toBeNull();
  });

  test("normalizes sensible answers without guessing missing information", () => {
    expect(checkFormAnswer(0, "intensiv deutschKURS")).toBe(true);
    expect(checkFormAnswer(2, "vier Wochen")).toBe(true);
    expect(checkFormAnswer(4, "PER KREDITKARTE")).toBe(true);
    expect(checkFormAnswer(3, "Doppelzimmer")).toBe(false);
    expect(checkFormAnswer(0, "")).toBe(false);
  });
});
