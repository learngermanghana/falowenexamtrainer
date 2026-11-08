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
