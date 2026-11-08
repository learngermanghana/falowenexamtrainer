import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { A1ReadingDocument, A1ReadingSourceCard } from "./A1TutorMarkedReadingLayout";

describe("A1 workbook Lesen source vocabulary", () => {
  test("adds meanings to original message and ad text, never answer controls", () => {
    render(<>
      <A1ReadingSourceCard label="Anzeige A" title="Praxis Dr. Klein">
        <p>Guten Morgen! Bitte kommen Sie am Montag.</p>
        <ul><li>Ohne Termin.</li></ul>
      </A1ReadingSourceCard>
      <button type="button">A) Arzt</button>
    </>);
    const greeting = screen.getByRole("button", { name: "Show English meaning of Guten Morgen" });
    fireEvent.click(greeting);
    expect(screen.getByText("good morning")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "A) Arzt" })).toBeInTheDocument();
    expect(screen.getByText("Anzeige A")).toBeInTheDocument();
  });

  test("preserves paragraph and nested list structure in reading documents", () => {
    const { container } = render(<A1ReadingDocument label="Nachricht">
      <p>Meine Mutter arbeitet am Montag.</p>
      <ul><li>Ich lerne Deutsch.</li></ul>
    </A1ReadingDocument>);
    expect(container.querySelectorAll("p").length).toBe(1);
    expect(container.querySelectorAll("li").length).toBe(1);
    expect(container.querySelectorAll('[data-reading-inline-translations="A1"]').length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: /Show English meaning of meine Mutter/i })).toBeInTheDocument();
  });
});
