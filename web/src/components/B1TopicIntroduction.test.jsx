import React from "react";
import fs from "fs";
import path from "path";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import B1TopicIntroduction, { B1_TOPIC_INTROS, getB1TopicIntro } from "./B1TopicIntroduction";
import { A2B1GrammarNotesTab } from "./A2B1WorkbookGrammarNotesContent";

const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe("B1 short topic introductions in Grammar", () => {
  test.each(Array.from({ length: 28 }, (_, index) => index + 1))("Day %i has a concise topic introduction", (day) => {
    const topic = getB1TopicIntro(day);

    expect(topic).toEqual(expect.objectContaining({
      title: expect.any(String),
      intro: expect.any(String),
      example: expect.any(String),
      question: expect.any(String),
    }));
    expect(topic.title.length).toBeGreaterThan(4);
    expect(topic.intro.length).toBeGreaterThan(70);
    expect(topic.intro.length).toBeLessThan(520);
    expect(topic.example.length).toBeGreaterThan(30);
    expect(topic.question.endsWith("?")).toBe(true);
  });

  test("renders only a short topic frame, example and thinking question", () => {
    render(<B1TopicIntroduction day={14} />);

    expect(screen.getByText("B1 · Thema kurz verstehen")).toBeVisible();
    expect(screen.getByRole("heading", { name: "Traditionelles und digitales Lernen" })).toBeVisible();
    expect(screen.getByText("Beispiel")).toBeVisible();
    expect(screen.getByText("Denkfrage")).toBeVisible();
    expect(screen.getByText(/Flexibilität oder persönlicher Kontakt/)).toBeVisible();
    expect(screen.queryByText("Vorteile, Nachteile und Meinung ausdrücken")).not.toBeInTheDocument();
  });

  test("replaces the repeated Vorteile/Nachteile trainer before B1 grammar notes", () => {
    renderWithRouter(<A2B1GrammarNotesTab level="B1" day={14} />);

    expect(screen.getByText("B1 · Thema kurz verstehen")).toBeVisible();
    expect(screen.queryByText("Vorteile, Nachteile und Meinung ausdrücken")).not.toBeInTheDocument();
    expect(screen.getByText(/1\. Vergleiche mit/)).toBeVisible();
  });

  test("keeps Vorteile and Nachteile in the separate B1 speaking structure", () => {
    const speakingRuntime = fs.readFileSync(path.resolve(__dirname, "../b1SpeakingStructureRuntime.js"), "utf8");
    const grammarTab = fs.readFileSync(path.resolve(__dirname, "A2B1WorkbookGrammarNotesContent.js"), "utf8");

    expect(speakingRuntime).toContain('["Vorteile"');
    expect(speakingRuntime).toContain('["Nachteile"');
    expect(grammarTab).toContain('import B1TopicIntroduction from "./B1TopicIntroduction"');
    expect(grammarTab).not.toContain('import B1ArgumentSpeakingTraining');
    expect(grammarTab).not.toContain("<B1ArgumentSpeakingTraining");
  });

  test("covers all 28 B1 topics for future grammar-note expansion", () => {
    expect(Object.keys(B1_TOPIC_INTROS).map(Number)).toEqual(Array.from({ length: 28 }, (_, index) => index + 1));
  });
});
