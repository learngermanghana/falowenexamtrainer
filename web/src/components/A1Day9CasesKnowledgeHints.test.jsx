import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import A1Day9NominativeAccusativeGrammarPage from "./A1Day9NominativeAccusativeGrammarPage";

jest.mock("./navigation/AppBackButton", () => ({
  __esModule: true,
  default: () => null,
}));

describe("A1 Chapter 5 German cases grammar", () => {
  test("keeps three beginner-focused nominative examples with sein and werden", () => {
    render(<A1Day9NominativeAccusativeGrammarPage />);
    const section = screen.getByRole("heading", { name: "3) Nominative case (Der Nominativ)" }).closest("section");
    expect(within(section).getAllByRole("listitem")).toHaveLength(3);
    expect(within(section).getByText("The teacher is happy.")).toBeInTheDocument();
    expect(within(section).getByText("That is a car.")).toBeInTheDocument();
    expect(within(section).getByText("He becomes a doctor.")).toBeInTheDocument();
    expect(within(section).getByText(/not a direct object/)).toBeInTheDocument();
    expect(within(section).queryByText("A female teacher is friendly.")).not.toBeInTheDocument();
  });

  test("removes the redundant accusative set but keeps all four requested Student pairs", () => {
    render(<A1Day9NominativeAccusativeGrammarPage />);
    const section = screen.getByRole("heading", { name: "4) Accusative case (Der Akkusativ)" }).closest("section");
    expect(within(section).getAllByRole("listitem")).toHaveLength(4);
    expect(within(section).getByText("The student sees the teacher. / The student sees a teacher.")).toBeInTheDocument();
    expect(within(section).getByText("The student sees the female teacher. / The student sees a female teacher.")).toBeInTheDocument();
    expect(within(section).getByText("The student sees the child. / The student sees a child.")).toBeInTheDocument();
    expect(within(section).getByText("The student sees the children. / The student sees no children.")).toBeInTheDocument();
    expect(within(section).queryByText("I have the dog.")).not.toBeInTheDocument();
    expect(within(section).queryByText("She buys the flower.")).not.toBeInTheDocument();
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
