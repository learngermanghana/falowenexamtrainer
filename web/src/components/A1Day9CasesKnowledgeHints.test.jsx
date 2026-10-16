import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import A1Day9NominativeAccusativeGrammarPage from "./A1Day9NominativeAccusativeGrammarPage";

jest.mock("./navigation/AppBackButton", () => ({
  __esModule: true,
  default: () => null,
}));

describe("A1 Chapter 5 German cases grammar", () => {
  test("removes the repeated first nominative example set, retaining the detailed examples", () => {
    render(<A1Day9NominativeAccusativeGrammarPage />);
    expect(screen.queryByText("The man is nice.")).not.toBeInTheDocument();
    expect(screen.queryByText("The woman works.")).not.toBeInTheDocument();
    expect(screen.queryByText("The child plays.")).not.toBeInTheDocument();
    expect(screen.getByText("The teacher is friendly.")).toBeInTheDocument();
    expect(screen.getByText("A female teacher is friendly.")).toBeInTheDocument();
  });

  test("all eight knowledge questions show correct dictionary articles and noun gender/number", () => {
    render(<A1Day9NominativeAccusativeGrammarPage />);
    const heading = screen.getByRole("heading", { name: "6) Knowledge test (instant feedback)" });
    const section = heading.closest("section");
    const questions = within(section).getAllByRole("article");
    expect(questions).toHaveLength(8);
    const tips = [
      ["der Mann", "masculine singular"],
      ["die Frau", "feminine singular"],
      ["das Buch", "neuter singular"],
      ["der Schüler", "masculine singular"],
      ["das Kind", "neuter singular"],
      ["der Computer", "masculine singular"],
      ["die Bücher", "plural (singular: das Buch)"],
      ["die Bücher", "plural (singular: das Buch)"],
    ];
    tips.forEach(([article, gender], index) => {
      expect(within(questions[index]).getByText(article, { selector: "span" })).toBeInTheDocument();
      expect(questions[index]).toHaveTextContent(gender);
      expect(questions[index]).toHaveTextContent("This is the dictionary article.");
    });
  });

  test("hints do not alter question options or instant feedback", () => {
    render(<A1Day9NominativeAccusativeGrammarPage />);
    const section = screen.getByRole("heading", { name: "6) Knowledge test (instant feedback)" }).closest("section");
    const questions = within(section).getAllByRole("article");
    expect(within(questions[0]).getAllByRole("button").map((b) => b.textContent)).toEqual(["der", "den", "dem"]);
    fireEvent.click(within(questions[0]).getByRole("button", { name: "der" }));
    expect(questions[0]).toHaveTextContent("Not quite.");
    fireEvent.click(within(questions[0]).getByRole("button", { name: "den" }));
    expect(questions[0]).toHaveTextContent("Correct!");
    expect(within(questions[7]).getAllByRole("button")).toHaveLength(3);
  });
});
