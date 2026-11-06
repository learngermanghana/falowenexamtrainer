import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { normalizeA2B1Lesson } from "../data/lessonModel";
import { A2B1GrammarNotesTab } from "./A2B1WorkbookGrammarNotes";

const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe("A2/B1 grammar notes without duplicate AI video cards", () => {
  test.each([
    ["A2", 1, /A2 Day 1 · Small Talk 1[.]1/i],
    ["B1", 13, /5[.] Struktur für einen Meinungsaufsatz/i],
    ["B1", 24, /Konsum und Nachhaltigkeit – Mittel, Folgen und Vergleiche/i],
  ])("%s Day %i keeps its grammar content without another AI video", async (level, day, heading) => {
    const { container } = renderWithRouter(<A2B1GrammarNotesTab level={level} day={day} />);

    expect(await screen.findByText(heading, {}, { timeout: 5000 })).toBeVisible();
    expect(container.querySelector('[data-a2-b1-grammar-video="true"]')).toBeNull();
    expect(container.querySelector('iframe[src*="youtube-nocookie.com/embed"]')).toBeNull();
  });

  test.each([
    ["A2", 1, "1.1", "https://youtu.be/HMEs3mEKdrk?si=VYK4VjV9Da2_AzU0"],
    ["B1", 2, "1.2", "https://youtu.be/Skl0FjF5JBg"],
    ["B1", 13, "4.13", "https://youtu.be/NwieoHEBZVs"],
  ])("%s Day %i still offers the teacher lecture and AI video in lesson resources", (level, day, chapter, aiUrl) => {
    const lesson = normalizeA2B1Lesson({ day, chapter }, level);
    const urls = lesson.resources.videos.map((video) => video.url);

    expect(lesson.resources.teacherVideo?.url).toMatch(/^https:/);
    expect(urls).toContain(lesson.resources.teacherVideo.url);
    expect(urls).toContain(aiUrl);
  });

  test("B1 Day 13 keeps its reviewed grammar teaching content", async () => {
    renderWithRouter(<A2B1GrammarNotesTab level="B1" day={13} />);
    expect(await screen.findByText(/5[.] Struktur für einen Meinungsaufsatz/i)).toBeVisible();
    expect(screen.queryByText(/Empfehlung mit Konjunktiv II/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Ich würde den Film weiterempfehlen/i)).not.toBeInTheDocument();
  });
});
