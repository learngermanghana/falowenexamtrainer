import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import B2Day7GesellschaftlicheVielfaltGrammarNotes from "./B2Day7GesellschaftlicheVielfaltGrammarNotes";

test("teaches relative clauses with prepositions for societal diversity", () => {
  const onCheckedChange = jest.fn();

  render(
    <B2Day7GesellschaftlicheVielfaltGrammarNotes
      checked={false}
      onCheckedChange={onCheckedChange}
    />,
  );

  expect(
    screen.getByRole("heading", { name: "Relativsätze mit Präpositionen" }),
  ).toBeInTheDocument();
  expect(screen.getByText(/Menschen, mit denen wir regelmäßig sprechen/)).toBeInTheDocument();
  expect(screen.getByText(/Vorurteile sind Probleme, über die/)).toBeInTheDocument();
  expect(screen.getByText(/Eine Gesellschaft, in der/)).toBeInTheDocument();

  userEvent.click(
    screen.getByRole("checkbox", {
      name: /Ich habe die Grammatiknotizen gelesen/,
    }),
  );

  expect(onCheckedChange).toHaveBeenCalledWith(true);
});
