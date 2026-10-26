import React from "react";
import { render, screen, within } from "@testing-library/react";
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

  test("shows a German exam-style form exercise with three numbered blanks", () => {
    render(<A1Day20GoetheWritingGrammarPage />);

    expect(
      screen.getByRole("heading", {
        name: "Formular ausfüllen: lesen, finden und übertragen",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Lesen Sie die Informationen\. Ergänzen Sie die Felder/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Kwame Mensah wurde am 14\. Juni 1998 geboren/i)).toBeInTheDocument();

    const formExercise = screen.getByRole("article", { name: "Formularübung" });
    expect(formExercise).toHaveTextContent("Familienname");
    expect(formExercise).toHaveTextContent("1. ____________________");
    expect(formExercise).toHaveTextContent("Geburtsdatum");
    expect(formExercise).toHaveTextContent("2. ____________________");
    expect(formExercise).toHaveTextContent("kwame.mensah@example.com");
    expect(formExercise).toHaveTextContent("Abendkurs");
    expect(formExercise).toHaveTextContent("Kursbeginn");
    expect(formExercise).toHaveTextContent("3. ____________________");
  });

  test("shows formal and informal writing questions instead of completed samples", () => {
    render(<A1Day20GoetheWritingGrammarPage />);

    expect(
      screen.getByRole("heading", { name: "Formelle und informelle Schreibaufgaben" }),
    ).toBeInTheDocument();

    const formalTask = screen.getByRole("article", { name: "Formelle Schreibaufgabe" });
    expect(within(formalTask).getByRole("heading", { name: "E-Mail an eine Sprachschule" })).toBeInTheDocument();
    expect(formalTask).toHaveTextContent("Wann beginnt der nächste Kurs?");
    expect(formalTask).toHaveTextContent("Wie viel kostet der Kurs?");
    expect(formalTask).toHaveTextContent("Gibt es einen Abendkurs?");
    expect(formalTask).toHaveTextContent("Schreiben Sie circa 30 Wörter");
    expect(formalTask).not.toHaveTextContent("ich schreibe Ihnen");

    const informalTask = screen.getByRole("article", { name: "Informelle Schreibaufgabe" });
    expect(within(informalTask).getByRole("heading", { name: "E-Mail an eine Freundin" })).toBeInTheDocument();
    expect(informalTask).toHaveTextContent("Warum schreiben Sie?");
    expect(informalTask).toHaveTextContent("Wann und wo ist die Feier?");
    expect(informalTask).toHaveTextContent("Was soll Anna mitbringen?");
    expect(informalTask).toHaveTextContent("Schreiben Sie circa 30 Wörter");
    expect(informalTask).not.toHaveTextContent("wie geht es dir");

    expect(screen.getAllByText(/Sie, Ihnen, Ihr\/Ihre/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/du, dir, dich, dein\/deine/i).length).toBeGreaterThan(0);
  });

  test("keeps the existing detailed letter-writing grammar lesson below the new overview", () => {
    const { container } = render(<A1Day20GoetheWritingGrammarPage />);

    expect(
      container.querySelector('[data-detailed-letter-writing-notes="true"]'),
    ).not.toBeNull();
  });
});
