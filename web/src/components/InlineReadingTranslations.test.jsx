import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import InlineReadingTranslations from "./InlineReadingTranslations";
import { getReadingPhraseTranslations, segmentReadingPhrases } from "../data/readingPhraseTranslations";

describe("A2/B1 reading phrase support", () => {
  test("has saved lesson-specific meanings for every A2 and B1 day", () => {
    for (const level of ["A2", "B1"]) {
      for (let day = 1; day <= 28; day += 1) {
        expect(getReadingPhraseTranslations(level, day).length).toBeGreaterThanOrEqual(5);
      }
    }
    for (const level of ["B2", "C1", "C2"]) {
      expect(getReadingPhraseTranslations(level, 1).length).toBeGreaterThan(100);
    }
  });

  test("A1 workbook text displays contextual English on tap with no API", () => {
    expect(getReadingPhraseTranslations("A1", 1).length).toBeGreaterThan(200);
    render(<InlineReadingTranslations level="A1" day={1} text="Guten Morgen! Wie geht es dir? Mir geht es gut." />);
    const greeting = screen.getByRole("button", { name: "Show English meaning of Guten Morgen" });
    fireEvent.click(greeting);
    expect(screen.getByText("good morning")).toBeInTheDocument();
    fireEvent.click(greeting);
    expect(screen.queryByText("good morning")).not.toBeInTheDocument();
  });

  test("matches only complete phrases and preserves punctuation", () => {
    const entries = [{ de: "auf Plastik verzichten", en: "avoid plastic" }, { de: "Plastik", en: "plastic" }];
    const segments = segmentReadingPhrases("Wir wollen auf Plastik verzichten. Plastikmüll bleibt.", entries);
    expect(segments.filter((part) => part.en).map((part) => part.text)).toEqual(["auf Plastik verzichten"]);
    expect(segments.map((part) => part.text).join("")).toBe("Wir wollen auf Plastik verzichten. Plastikmüll bleibt.");
  });

  test("translates an underlined A2 reading word on tap and closes on another tap", () => {
    render(<InlineReadingTranslations level="A2" day={1} text="In der Mittagspause essen wir in der Kantine." />);
    const phrase = screen.getByRole("button", { name: "Show English meaning of Mittagspause" });
    expect(phrase).toHaveClass("reading-glossary-trigger");
    // Native button remains keyboard-focusable after resetting its visual appearance.
    phrase.focus();
    expect(phrase).toHaveFocus();
    expect(phrase).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("lunch break")).not.toBeInTheDocument();
    fireEvent.click(phrase);
    expect(phrase).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("lunch break")).toBeInTheDocument();
    fireEvent.click(phrase);
    expect(screen.queryByText("lunch break")).not.toBeInTheDocument();
  });

  test("provides context-sensitive B1 phrase meanings in matching situations", () => {
    render(<InlineReadingTranslations level="B1" day={26} text="Lukas möchte eine geführte, mehrtägige Wandertour machen." />);
    fireEvent.click(screen.getByRole("button", { name: "Show English meaning of mehrtägige" }));
    expect(screen.getByText("lasting several days")).toBeInTheDocument();
  });

  test("never shows previous lesson's selected meaning when the reading changes", () => {
    const { rerender } = render(
      <InlineReadingTranslations level="A2" day={1} text="In der Mittagspause." />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Show English meaning of Mittagspause" }));
    expect(screen.getByText("lunch break")).toBeInTheDocument();
    rerender(<InlineReadingTranslations level="A2" day={2} text="Sie ist zuverlässig." />);
    expect(screen.queryByText("lunch break")).not.toBeInTheDocument();
  });

  test("offers offline advanced reading phrases without exposing question answers", () => {
    for (const level of ["B2", "C1", "C2"]) {
      const { unmount } = render(<InlineReadingTranslations level={level} day={5} text="In der Praxis muss man die Rahmenbedingungen berücksichtigen." />);
      const phrase = screen.getByRole("button", { name: /Show English meaning of Rahmenbedingungen/i });
      fireEvent.click(phrase);
      expect(screen.getByText("framework conditions")).toBeInTheDocument();
      unmount();
    }
  });

  test("does not decorate words without a matching saved meaning", () => {
    const { rerender, container } = render(<InlineReadingTranslations level="A2" day={1} text="Ein ganz unbekanntes Wort." />);
    expect(container.querySelector("[data-reading-glossary-phrase]")).toBeNull();
    rerender(<InlineReadingTranslations level="B2" day={1} text="Mittagspause" />);
    expect(container.querySelector("[data-reading-glossary-phrase]")).toBeNull();
  });
});

test("C2 Day 5 prioritises the argument and reveals additional phrases on demand", () => {
  const { C2_READING_PRACTICE } = require("../data/c2ReadingPractice");
  const [opening, , rhetoric] = C2_READING_PRACTICE[5].text;
  const { rerender } = render(<InlineReadingTranslations level="C2" day={5} text={opening} />);
  const highlights = () => screen.getAllByRole("button", { name: /^Show English meaning/ });
  expect(highlights()).toHaveLength(3);
  fireEvent.click(screen.getByRole("button", { name: /meaning of unkritischer Gefolgschaft/ }));
  expect(screen.getByRole("status")).toHaveTextContent("unquestioning allegiance");
  fireEvent.click(screen.getByRole("button", { name: "More vocabulary" }));
  expect(highlights().length).toBeGreaterThan(3);
  fireEvent.click(screen.getByRole("button", { name: "Less vocabulary" }));
  expect(highlights()).toHaveLength(3);
  rerender(<InlineReadingTranslations level="C2" day={5} text={rhetoric} />);
  fireEvent.click(screen.getByRole("button", { name: /meaning of rhetorischen Schaufechten/ }));
  expect(screen.getByRole("status")).toHaveTextContent("staged verbal sparring");
});

test("new A2 and advanced entries match the authored reading passages", () => {
  const { contextualReadingVocabulary } = require("../data/contextualReadingVocabulary");
  const sources = {
    A2: require("../data/a2ReadingTasks").A2_READING_TASKS,
    B2: require("../data/b2ReadingPractice").B2_READING_PRACTICE,
    C1: require("../data/c1ReadingPractice").C1_READING_PRACTICE,
    C2: require("../data/c2ReadingPractice").C2_READING_PRACTICE,
  };
  for (const [level, days] of Object.entries(sources)) {
    for (const [day, passage] of Object.entries(days)) {
      const paragraphs = passage.text || passage.paragraphs;
      const text = Array.isArray(paragraphs) ? paragraphs.join("\n") : paragraphs;
      for (const [de, en] of contextualReadingVocabulary[level][day]) {
        expect(segmentReadingPhrases(text, [{ de, en }]).map(part => part.de)).toContain(de);
      }
    }
  }
});

test("B1 distinguishes relying on a friend from leaving a friend", () => {
  const entries = getReadingPhraseTranslations("B1", 2);
  const text = "Ein Freund, auf den man sich verlassen kann. Den Freund verlassen.";
  expect(segmentReadingPhrases(text, entries).filter(part => part.en).map(part => part.en))
    .toEqual(["whom you can rely on"]);
});
