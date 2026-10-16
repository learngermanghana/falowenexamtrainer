import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import fs from "fs";
import path from "path";
import FormingBasicStatementsPage from "./FormingBasicStatementsPage";

jest.mock("./navigation/AppBackButton", () => ({
  __esModule: true,
  default: () => null,
}));

const read = (file) => fs.readFileSync(path.resolve(__dirname, file), "utf8");

describe("A1 Day 8 focused grammar notes", () => {
  test("teaches only sprechen, with translated examples and one man spricht extension", () => {
    render(<FormingBasicStatementsPage />);
    expect(screen.getByRole("heading", { name: "Welche Sprachen sprichst du?" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "1. sprechen — an irregular verb" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "2. One useful expression: man spricht" })).toBeInTheDocument();
    expect(screen.getByText("Do you speak German?")).toBeInTheDocument();
    expect(screen.getByText("People speak German in Germany.")).toBeInTheDocument();
    expect(screen.getByText("People speak Spanish in Spain.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "4. Speak with a partner" })).toBeInTheDocument();
    const source = read("FormingBasicStatementsPage.js");
    expect(source).not.toContain("Präteritum");
    expect(source).not.toContain("liegen = to be located");
    expect(source).not.toContain("nach vs in");
    expect(source).not.toContain("Woher kommst du?");
    expect(source).not.toContain("<img");
    expect(source).not.toContain("https://images.unsplash.com");
  });

  test("presents all six sprechen forms and highlights the two irregular forms", () => {
    render(<FormingBasicStatementsPage />);
    const rows = screen.getAllByRole("row");
    const rowContent = rows.map((row) => row.textContent);
    for (const [pronoun, verb] of [
      ["ich", "spreche"], ["du", "sprichst"], ["er / sie / es", "spricht"],
      ["wir", "sprechen"], ["ihr", "sprecht"], ["sie / Sie", "sprechen"],
    ]) {
      expect(rowContent).toContain(pronoun + verb);
    }
    expect(within(rows[2]).getByText("sprichst")).toHaveStyle({ fontWeight: "800" });
    expect(within(rows[3]).getByText("spricht")).toHaveStyle({ fontWeight: "800" });
  });

  test("four short practice questions check speaking and man; answers can be reset", () => {
    render(<FormingBasicStatementsPage />);
    const practice = screen.getByTestId("a1-day8-quick-practice");
    expect(within(practice).getByText(/0 of 4 answered/)).toBeInTheDocument();
    const q1 = within(practice).getByRole("group", { name: "Question 1" });
    fireEvent.click(within(q1).getByRole("button", { name: "spricht" }));
    expect(within(practice).getByText(/Try again\./)).toBeInTheDocument();
    fireEvent.click(within(q1).getByRole("button", { name: "spreche" }));
    expect(within(practice).getByText(/Correct!/)).toBeInTheDocument();
    const q4 = within(practice).getByRole("group", { name: "Question 4" });
    fireEvent.click(within(q4).getByRole("button", { name: "spricht" }));
    expect(within(practice).getByText(/2 of 4 answered/)).toBeInTheDocument();
    expect(within(practice).getByText(/2 correct/)).toBeInTheDocument();
    fireEvent.click(within(practice).getByRole("button", { name: "Reset practice" }));
    expect(within(practice).getByText(/0 of 4 answered/)).toBeInTheDocument();
    expect(within(practice).queryByText(/Correct!/)).not.toBeInTheDocument();
  });

  test("grammar route and both course schedules describe the same focused A1-4 lesson", () => {
    expect(read("A1WorkbookGrammarNotes.js")).toContain('"A1-4": FormingBasicStatementsPage');
    for (const file of ["../data/courseSchedule.js", "../../../functions/data/courseSchedule.js"]) {
      const schedule = read(file);
      expect(schedule).toContain('grammar_topic: "sprechen (spreche / sprichst / spricht); man spricht"');
      expect(schedule).not.toContain("Learn about schon mal, noch nie, irregular verbs, and man vs Mann");
    }
  });
});
