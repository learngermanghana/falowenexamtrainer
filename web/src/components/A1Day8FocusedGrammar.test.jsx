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

describe("A1 Day 8 Countries and Languages grammar notes", () => {
  test("teaches sprechen and man, three place questions, and short nach/in examples", () => {
    render(<FormingBasicStatementsPage />);
    expect(screen.getByRole("heading", { name: "Welche Sprachen sprichst du?" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "3. sprechen — an irregular verb" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "4. One useful expression: man spricht" })).toBeInTheDocument();
    expect(screen.getByText("Do you speak German?")).toBeInTheDocument();
    expect(screen.getByText("People speak German in Germany.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "1. Woher? Wo? Wohin? — understand the difference" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "2. nach or in? — going to a place" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "6. Speak with a partner" })).toBeInTheDocument();
    const headings = screen.getAllByRole("heading", { level: 2 }).map(node => node.textContent);
    expect(headings.slice(0, 4)).toEqual([
      "1. Woher? Wo? Wohin? — understand the difference",
      "2. nach or in? — going to a place",
      "3. sprechen — an irregular verb",
      "4. One useful expression: man spricht",
    ]);
    expect(screen.queryByText("Eine Reise nach Deutschland")).not.toBeInTheDocument();

    const table = within(screen.getByTestId("a1-day8-where-questions")).getByRole("table");
    expect(within(table).getAllByRole("row")).toHaveLength(4);
    expect(within(table).getByText("Woher kommst du? — Ich komme aus Ghana.")).toBeInTheDocument();
    expect(within(table).getByText("Wo wohnst du? — Ich wohne in Accra.")).toBeInTheDocument();
    expect(within(table).getByText("Wohin fährst du? — Ich fahre nach Deutschland.")).toBeInTheDocument();

    const destination = screen.getByTestId("a1-day8-nach-in");
    expect(within(destination).getByText("Ich fahre nach Berlin.")).toBeInTheDocument();
    expect(within(destination).getByText("Wir fliegen nach Ghana.")).toBeInTheDocument();
    expect(within(destination).getByText("Sie fährt in die Schweiz.")).toBeInTheDocument();
    expect(destination).toHaveTextContent("Ich bin in der Schweiz.");
    expect(destination).toHaveTextContent("Ich fahre in die Schweiz.");
    const source = read("FormingBasicStatementsPage.js");
    expect(source).not.toContain("Präteritum");
    expect(source).not.toContain("liegen = to be located");
    expect(source).not.toContain("<img");
    expect(source).not.toContain("https://images.unsplash.com");
  });

  test("presents six sprechen conjugations with du and er/sie/es highlighted", () => {
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

  test("six short practice questions cover verbs, origin/location and both destination patterns", () => {
    render(<FormingBasicStatementsPage />);
    const practice = screen.getByTestId("a1-day8-quick-practice");
    expect(within(practice).getByText(/0 of 6 answered/)).toBeInTheDocument();
    const pick = (number, answer) => {
      const group = within(practice).getByRole("group", { name: "Question " + number });
      fireEvent.click(within(group).getByRole("button", { name: answer }));
    };
    pick(1, "spreche");
    expect(within(practice).getByText(/Try again\./)).toBeInTheDocument();
    pick(1, "sprichst");
    pick(2, "spricht");
    pick(3, "Woher");
    pick(4, "Wo");
    pick(5, "nach");
    pick(6, "in die");
    expect(within(practice).getByText(/6 of 6 answered/)).toBeInTheDocument();
    expect(within(practice).getByText(/6 correct/)).toBeInTheDocument();
    fireEvent.click(within(practice).getByRole("button", { name: "Reset practice" }));
    expect(within(practice).getByText(/0 of 6 answered/)).toBeInTheDocument();
    expect(within(practice).queryByText(/Correct!/)).not.toBeInTheDocument();
  });

  test("A1-4 route and both schedules describe all three teaching points", () => {
    expect(read("A1WorkbookGrammarNotes.js")).toContain('"A1-4": FormingBasicStatementsPage');
    for (const file of ["../data/courseSchedule.js", "../../../functions/data/courseSchedule.js"]) {
      const schedule = read(file);
      expect(schedule).toContain('grammar_topic: "sprechen; man spricht; woher / wo / wohin; aus / in / nach"');
      expect(schedule).not.toContain("Learn about schon mal, noch nie, irregular verbs, and man vs Mann");
    }
  });
});
