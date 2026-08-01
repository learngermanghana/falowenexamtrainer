import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import A1Day20GoetheWritingGrammarPage, {
  FORM_PRACTICE_FIELDS,
  getFormPracticeScore,
} from "./A1Day20GoetheWritingGrammarPage";

jest.mock("./LetterWritingIntroPage", () => ({
  LetterWritingGrammarNotesPage: () => (
    <section data-detailed-letter-writing-notes="true">
      Detailed formal and informal letter structure
    </section>
  ),
}));

const fillNumberedSpaces = (values = {}) => {
  FORM_PRACTICE_FIELDS.forEach((field) => {
    fireEvent.change(screen.getByLabelText(`${field.number}. ${field.label}`), {
      target: { value: values[field.id] ?? field.answer },
    });
  });
};

describe("A1 Day 20 Goethe writing grammar page", () => {
  test("explains the two Goethe A1 writing parts", () => {
    render(<A1Day20GoetheWritingGrammarPage />);

    expect(
      screen.getByRole("heading", { name: "Goethe A1 Schreiben has two parts" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Formular ausfüllen" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Kurze Nachricht oder E-Mail" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/form with numbered gaps/i)).toBeInTheDocument();
  });

  test("shows a Goethe-style form with only three numbered empty spaces", () => {
    render(<A1Day20GoetheWritingGrammarPage />);

    const form = screen.getByRole("article", { name: "Interactive form practice" });
    expect(within(form).getAllByRole("textbox")).toHaveLength(3);
    expect(within(form).getByLabelText("1. Geburtsdatum")).toBeInTheDocument();
    expect(within(form).getByLabelText("2. E-Mail")).toBeInTheDocument();
    expect(within(form).getByLabelText("3. Kursbeginn")).toBeInTheDocument();

    expect(within(form).getByText("Mensah")).toBeInTheDocument();
    expect(within(form).getByText("Kwame")).toBeInTheDocument();
    expect(within(form).getByText("24 Market Road")).toBeInTheDocument();
    expect(within(form).getByText("Accra")).toBeInTheDocument();
    expect(within(form).getByText("020 123 4567")).toBeInTheDocument();
    expect(within(form).getByText("Deutsch A1")).toBeInTheDocument();
    expect(within(form).getByText("Abendkurs")).toBeInTheDocument();

    expect(screen.queryByRole("article", { name: "Completed form sample" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Show completed form" })).not.toBeInTheDocument();
  });

  test("scores the three missing entries and reveals the completed form after checking", () => {
    render(<A1Day20GoetheWritingGrammarPage />);

    fillNumberedSpaces();
    fireEvent.click(screen.getByRole("button", { name: "Check answers" }));

    expect(screen.getByRole("status")).toHaveTextContent("Your score: 3/3");
    expect(screen.getAllByText("Correct")).toHaveLength(3);

    fireEvent.click(screen.getByRole("button", { name: "Show completed form" }));
    const completedForm = screen.getByRole("article", { name: "Completed form sample" });
    expect(completedForm).toHaveTextContent("1. Geburtsdatum");
    expect(completedForm).toHaveTextContent("14.06.1998");
    expect(completedForm).toHaveTextContent("2. E-Mail");
    expect(completedForm).toHaveTextContent("kwame.mensah@example.com");
    expect(completedForm).toHaveTextContent("3. Kursbeginn");
    expect(completedForm).toHaveTextContent("12.08.2026");
  });

  test("shows corrections and resets only the numbered spaces", () => {
    render(<A1Day20GoetheWritingGrammarPage />);

    fillNumberedSpaces({ geburtsdatum: "14.06.1989" });
    fireEvent.click(screen.getByRole("button", { name: "Check answers" }));

    expect(screen.getByText("Correct answer: 14.06.1998")).toBeInTheDocument();
    expect(screen.getByLabelText("1. Geburtsdatum")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("status")).toHaveTextContent("Your score: 2/3");

    fireEvent.click(screen.getByRole("button", { name: "Reset form" }));
    expect(screen.getByLabelText("1. Geburtsdatum")).toHaveValue("");
    expect(screen.getByLabelText("2. E-Mail")).toHaveValue("");
    expect(screen.getByLabelText("3. Kursbeginn")).toHaveValue("");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByText("Mensah")).toBeInTheDocument();
  });

  test("supports mobile date entry and disables personal autofill", () => {
    render(<A1Day20GoetheWritingGrammarPage />);

    expect(screen.getByLabelText("1. Geburtsdatum")).toHaveAttribute("inputmode", "text");
    expect(screen.getByLabelText("1. Geburtsdatum")).toHaveAttribute("placeholder", "TT.MM.JJJJ");
    expect(screen.getByLabelText("3. Kursbeginn")).toHaveAttribute("inputmode", "text");

    FORM_PRACTICE_FIELDS.forEach((field) => {
      expect(screen.getByLabelText(`${field.number}. ${field.label}`)).toHaveAttribute(
        "autocomplete",
        "off",
      );
    });
  });

  test("calculates scores independently of letter case and extra spaces", () => {
    const answers = FORM_PRACTICE_FIELDS.reduce(
      (result, field) => ({ ...result, [field.id]: `  ${field.answer.toUpperCase()}  ` }),
      {},
    );

    expect(getFormPracticeScore(answers)).toBe(3);
  });

  test("shows one formal question and one informal question instead of duplicate sample answers", () => {
    render(<A1Day20GoetheWritingGrammarPage />);

    const formalTask = screen.getByRole("article", { name: "Formal question writing task" });
    expect(formalTask).toHaveTextContent("E-Mail an eine Sprachschule");
    expect(formalTask).toHaveTextContent("Wann beginnt der Kurs?");
    expect(formalTask).toHaveTextContent("Wie viel kostet der Kurs?");
    expect(formalTask).toHaveTextContent("Gibt es einen Abendkurs?");

    const informalTask = screen.getByRole("article", { name: "Informal question writing task" });
    expect(informalTask).toHaveTextContent("Einladung an eine Freundin");
    expect(informalTask).toHaveTextContent("Laden Sie Anna ein.");
    expect(informalTask).toHaveTextContent("Wann und wo ist die Feier?");
    expect(informalTask).toHaveTextContent("etwas zu trinken mitzubringen");

    expect(screen.queryByText("Formal sample")).not.toBeInTheDocument();
    expect(screen.queryByText("Informal sample")).not.toBeInTheDocument();
    expect(
      screen.queryByText(/ich schreibe Ihnen, weil ich mich für Ihren Deutschkurs interessiere/i),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/ich schreibe dir, weil ich am Samstag Geburtstag habe/i),
    ).not.toBeInTheDocument();
  });

  test("keeps the detailed letter-writing lesson below the two questions", () => {
    const { container } = render(<A1Day20GoetheWritingGrammarPage />);

    expect(
      container.querySelector('[data-detailed-letter-writing-notes="true"]'),
    ).not.toBeNull();
  });
});
