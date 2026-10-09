import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { A2B1GrammarNotesTab } from "./A2B1WorkbookGrammarNotes";
import Day2Grammar from "./A2Day2Kapitel12GrammarNotesPage";
import Day3Grammar from "./ComparingThingsAndPeopleGrammarPage";

describe("restored A2 Day 2 and Day 3 grammar", () => {
  test("Day 2 workbook grammar includes both declension tables and full examples", async () => {
    const { container } = render(
      <MemoryRouter><A2B1GrammarNotesTab level="A2" day={2} /></MemoryRouter>,
    );
    expect(await screen.findByRole("heading", { name: "Nominative table" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Accusative table" })).toBeVisible();
    expect(screen.getAllByRole("table")).toHaveLength(2);
    expect(screen.getByText("Ich sehe einen kleinen Hund.")).toBeVisible();
    expect(screen.getByRole("heading", { name: "Mini adjective ending test (A1)" })).toBeVisible();
    expect(container.querySelector("main")).toBeNull();
    expect(screen.queryByRole("button", { name: "Back to Course Book" })).not.toBeInTheDocument();
  });

  test("Day 3 workbook restores explanations, the comparison table, and scored quiz", async () => {
    const { container } = render(
      <MemoryRouter><A2B1GrammarNotesTab level="A2" day={3} /></MemoryRouter>,
    );
    expect(await screen.findByRole("heading", { name: "3. Comparative Form (Komparativ)" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "4. Superlative Form (Superlativ)" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "6. Comparison Table" })).toBeVisible();
    expect(screen.getByRole("img", { name: "Simple illustration showing groß, größer, and am größten" })).toBeVisible();
    const question = screen.getByText(/Peter ist ________ als Tom/).closest("div");
    fireEvent.click(within(question).getByRole("button", { name: "größer", exact: true }));
    expect(screen.getByText("Score:").parentElement).toHaveTextContent("Score: 1 / 5");
    fireEvent.click(screen.getByRole("button", { name: "Reset Quiz" }));
    expect(screen.getByText("Score:").parentElement).toHaveTextContent("Score: 0 / 5");
    expect(screen.queryByText('We compare two people, so we use the comparative: "größer als".')).not.toBeInTheDocument();
    expect(container.querySelector("main")).toBeNull();
  });

  test.each([Day2Grammar, Day3Grammar])("standalone grammar retains course navigation", (Grammar) => {
    const { container } = render(<MemoryRouter><Grammar /></MemoryRouter>);
    expect(container.querySelector("main")).not.toBeNull();
    expect(screen.getByRole("button", { name: /Back to Course Book/ })).toBeVisible();
  });
});
