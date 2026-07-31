import React from "react";
import { render, screen } from "@testing-library/react";
import A1Day20GoetheWritingGrammarPage from "./A1Day20GoetheWritingGrammarPage";

jest.mock("./LetterWritingIntroPage", () => ({
  LetterWritingGrammarNotesPage: () => (
    <section data-detailed-letter-writing-notes="true">
      Detailed formal and informal letter structure
    </section>
  ),
}));

describe("A1 Day 20 Goethe writing grammar page", () => {
  test("explains that Goethe A1 Schreiben has form filling and letter writing", () => {
    render(<A1Day20GoetheWritingGrammarPage />);

    expect(
      screen.getByRole("heading", { name: "Goethe A1 Schreiben has two parts" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Formular ausfüllen" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Kurze Nachricht oder E-Mail" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Teil 1 is a form, not a letter/i)).toBeInTheDocument();
  });

  test("shows a completed form with exact personal and course details", () => {
    render(<A1Day20GoetheWritingGrammarPage />);

    const completedForm = screen.getByRole("article", { name: "Completed form sample" });
    expect(completedForm).toHaveTextContent("Familienname");
    expect(completedForm).toHaveTextContent("Mensah");
    expect(completedForm).toHaveTextContent("Geburtsdatum");
    expect(completedForm).toHaveTextContent("14.06.1998");
    expect(completedForm).toHaveTextContent("kwame.mensah@example.com");
    expect(completedForm).toHaveTextContent("Abendkurs");
    expect(completedForm).toHaveTextContent("12.08.2026");
  });

  test("shows complete formal and informal samples and their language differences", () => {
    render(<A1Day20GoetheWritingGrammarPage />);

    expect(
      screen.getByRole("heading", {
        name: "Formal and informal letters: see the difference",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Sehr geehrte Damen und Herren,", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("Mit freundlichen Grüßen", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("Liebe Anna,", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("Liebe Grüße", { exact: false })).toBeInTheDocument();
    expect(screen.getByText(/Sie, Ihnen, Ihr\/Ihre/i)).toBeInTheDocument();
    expect(screen.getByText(/du, dir, dich, dein\/deine/i)).toBeInTheDocument();
  });

  test("keeps the existing detailed letter-writing grammar lesson below the new overview", () => {
    const { container } = render(<A1Day20GoetheWritingGrammarPage />);

    expect(
      container.querySelector('[data-detailed-letter-writing-notes="true"]'),
    ).not.toBeNull();
  });
});
