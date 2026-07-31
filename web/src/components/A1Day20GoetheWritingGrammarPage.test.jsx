import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
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

const fillForm = (values = {}) => {
  FORM_PRACTICE_FIELDS.forEach((field) => {
    fireEvent.change(screen.getByLabelText(field.label), {
      target: { value: values[field.id] ?? field.answer },
    });
  });
};

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

  test("keeps the completed form hidden until the student checks the activity", () => {
    render(<A1Day20GoetheWritingGrammarPage />);

    expect(screen.getByRole("article", { name: "Interactive form practice" })).toBeInTheDocument();
    expect(screen.getAllByRole("textbox")).toHaveLength(FORM_PRACTICE_FIELDS.length);
    expect(screen.queryByRole("article", { name: "Completed form sample" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Show completed form" })).not.toBeInTheDocument();
  });

  test("prevents personal-data autofill and keeps dotted dates typeable on mobile", () => {
    render(<A1Day20GoetheWritingGrammarPage />);

    const practice = screen.getByRole("article", { name: "Interactive form practice" });
    expect(practice.querySelector("form")).toHaveAttribute("autocomplete", "off");

    FORM_PRACTICE_FIELDS.forEach((field) => {
      expect(screen.getByLabelText(field.label)).toHaveAttribute("autocomplete", "off");
    });

    expect(screen.getByLabelText("Geburtsdatum")).toHaveAttribute("inputmode", "text");
    expect(screen.getByLabelText("Geburtsdatum")).toHaveAttribute("placeholder", "TT.MM.JJJJ");
    expect(screen.getByLabelText("Kursbeginn")).toHaveAttribute("inputmode", "text");
    expect(screen.getByLabelText("Kursbeginn")).toHaveAttribute("placeholder", "TT.MM.JJJJ");
  });

  test("scores a completed form and reveals the model only after checking", () => {
    render(<A1Day20GoetheWritingGrammarPage />);

    fillForm();
    fireEvent.click(screen.getByRole("button", { name: "Check answers" }));

    expect(screen.getByRole("status")).toHaveTextContent(
      `Your score: ${FORM_PRACTICE_FIELDS.length}/${FORM_PRACTICE_FIELDS.length}`,
    );
    expect(screen.getAllByText("Correct")).toHaveLength(FORM_PRACTICE_FIELDS.length);

    fireEvent.click(screen.getByRole("button", { name: "Show completed form" }));
    const completedForm = screen.getByRole("article", { name: "Completed form sample" });
    expect(completedForm).toHaveTextContent("Familienname");
    expect(completedForm).toHaveTextContent("Mensah");
    expect(completedForm).toHaveTextContent("14.06.1998");
    expect(completedForm).toHaveTextContent("kwame.mensah@example.com");
    expect(completedForm).toHaveTextContent("Abendkurs");
    expect(completedForm).toHaveTextContent("12.08.2026");
  });

  test("shows field-level corrections and lets the student reset", () => {
    render(<A1Day20GoetheWritingGrammarPage />);

    fillForm({ familienname: "Mensa" });
    fireEvent.click(screen.getByRole("button", { name: "Check answers" }));

    expect(screen.getByText("Correct answer: Mensah")).toBeInTheDocument();
    expect(screen.getByLabelText("Familienname")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("status")).toHaveTextContent(
      `Your score: ${FORM_PRACTICE_FIELDS.length - 1}/${FORM_PRACTICE_FIELDS.length}`,
    );

    fireEvent.click(screen.getByRole("button", { name: "Reset form" }));
    expect(screen.getByLabelText("Familienname")).toHaveValue("");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  test("calculates scores independently of letter case and extra spaces", () => {
    const answers = FORM_PRACTICE_FIELDS.reduce(
      (result, field) => ({ ...result, [field.id]: `  ${field.answer.toUpperCase()}  ` }),
      {},
    );

    expect(getFormPracticeScore(answers)).toBe(FORM_PRACTICE_FIELDS.length);
  });

  test("shows complete formal and informal samples and their language differences", () => {
    render(<A1Day20GoetheWritingGrammarPage />);

    expect(
      screen.getByRole("heading", {
        name: "Formal and informal letters: see the difference",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText("Sehr geehrte Damen und Herren,", { exact: false }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText("Mit freundlichen Grüßen", { exact: false }).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText("Liebe Anna,", { exact: false }).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Liebe Grüße", { exact: false }).length).toBeGreaterThan(0);
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
