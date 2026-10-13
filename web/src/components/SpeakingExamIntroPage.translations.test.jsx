import React from "react";
import { render, screen, within } from "@testing-library/react";
import SpeakingExamIntroPage from "./SpeakingExamIntroPage";

jest.mock("./navigation/AppBackButton", () => function BackButton() {
  return <button type="button">Back to Course Book</button>;
});

describe("A1 Day 15 · Speaking Exam Intro English support", () => {
  beforeEach(() => render(<SpeakingExamIntroPage />));

  test.each([
    ["warten", "to wait", "Warten Sie bitte.", "Please wait.", "Können Sie bitte warten?", "Could you please wait?"],
    ["helfen", "to help", "Helfen Sie mir bitte.", "Please help me.", "Können Sie mir bitte helfen?", "Could you please help me?"],
    ["wiederholen", "to repeat", "Wiederholen Sie das bitte.", "Please repeat that.", "Können Sie das bitte wiederholen?", "Could you please repeat that?"],
    ["sprechen", "to speak", "Sprechen Sie bitte langsamer.", "Please speak more slowly.", "Können Sie bitte langsamer sprechen?", "Could you please speak more slowly?"],
  ])("keeps %s and shows the English directly beneath each German form", (infinitive, infinitiveEn, imperative, imperativeEn, question, questionEn) => {
    const imperativeTable = screen.getAllByRole("table")[1];
    for (const [german, english] of [
      [infinitive, infinitiveEn],
      [imperative, imperativeEn],
      [question, questionEn],
    ]) {
      const cell = within(imperativeTable).getByText(german).closest("td");
      expect(cell).toBeInTheDocument();
      const translation = within(cell).getByText(english);
      expect(translation).toHaveAttribute("lang", "en");
    }
  });

  test.each([
    ["Ja, natürlich.", "Yes, of course."],
    ["Ja, gern.", "Yes, I'd be happy to."],
    ["Natürlich, hier bitte.", "Of course, here you go."],
    ["Tut mir leid, das geht leider nicht.", "I'm sorry, that's not possible."],
    ["Leider kann ich nicht.", "Unfortunately, I can't."],
    ["Entschuldigung, das ist leider nicht möglich.", "I'm sorry, unfortunately that's not possible."],
  ])("shows the reaction %s with its English translation", (german, english) => {
    const pair = screen.getByText(german).parentElement;
    const translation = within(pair).getByText(english);
    expect(translation).toHaveAttribute("lang", "en");
  });

  test("retains the original German grammar prompts, three-column format and lesson sequence", () => {
    expect(screen.getByRole("heading", { name: "Sie-Imperativ" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Accept or refuse politely" })).toBeInTheDocument();
    for (const heading of ["Infinitive", "Sie-Imperativ", "Question with können"]) {
      expect(screen.getByRole("columnheader", { name: heading })).toBeInTheDocument();
    }
    expect(screen.getByRole("heading", { name: "Build a request from the situation" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Do this without looking at the models" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open official Goethe A1 speaking practice" }))
      .toHaveAttribute("href", "https://bfu.goethe.de/a1_sd1/sprechen.php");
  });
});
