import React from "react";
import { render, screen, within } from "@testing-library/react";
import SpeakingExamIntroPage from "./SpeakingExamIntroPage";

jest.mock("./navigation/AppBackButton", () => function BackButton() {
  return <button type="button">Back to Course Book</button>;
});

describe("A1 Day 15 · Speaking Exam Intro English support", () => {
  beforeEach(() => render(<SpeakingExamIntroPage />));

  test.each([
    ["Flasche", "bottle", "öffnen", "open"],
    ["Tür", "door", "schließen", "close"],
    ["Bleistift", "pencil", "geben", "give"],
    ["Glas Wasser", "glass of water", "bringen", "bring"],
    ["Radio", "radio", "ausmachen", "turn off"],
  ])("keeps %s and the English meaning next to its picture and verb", (object, meaning, verb, translation) => {
    const card = screen.getAllByRole("img", { name: `${object} picture` })[0].closest("[data-a1-teil3-object-card]");
    expect(card).not.toBeNull();
    expect(within(card).getByText(new RegExp(meaning))).toBeInTheDocument();
    expect(within(card).getByText(verb)).toBeInTheDocument();
    expect(within(card).getByText(new RegExp(translation))).toBeInTheDocument();
  });

  test.each([
    ["Ja, natürlich.", "Yes, of course."],
    ["Ja, gern.", "Yes, I'd be happy to."],
    ["Natürlich, hier bitte.", "Of course, here you go."],
    ["Tut mir leid, das geht leider nicht.", "I'm sorry, that's not possible."],
    ["Leider kann ich nicht.", "Unfortunately, I can't."],
    ["Entschuldigung, das ist leider nicht möglich.", "I'm sorry, unfortunately that's not possible."],
  ])("shows %s with its English translation", (german, english) => {
    const phrase = screen.getAllByText(german).find(node => node.nextElementSibling?.textContent === english);
    expect(phrase).toBeDefined();
    expect(phrase.nextElementSibling).toHaveAttribute("lang", "en");
  });

  test("keeps the Goethe A1 grammar models, video and official practice link", () => {
    expect(screen.getByRole("heading", { name: "Sie-Imperativ with the same exam verbs" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Accept or refuse politely" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Question with können" })).toBeInTheDocument();
    expect(screen.getByTitle("Teacher lecture: Introduction to the Goethe A1 Speaking Exam")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open official Goethe A1 speaking practice" }))
      .toHaveAttribute("href", "https://bfu.goethe.de/a1_sd1/sprechen.php");
  });
});
