import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SwahiliA1PracticeWorkbook from "./SwahiliA1PracticeWorkbook";
import { SWAHILI_A1_PRACTICE_UNITS } from "../data/swahili/a1PracticeUnits";

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({ user: { getIdToken: async () => "test-token" } }),
}));

test("Day 7 uses the private recording and shows five matching answers on review", async () => {
  const lesson = SWAHILI_A1_PRACTICE_UNITS[7];
  const previousFetch = globalThis.fetch;
  const getAudio = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ url: "https://example.test/day-07.mp3" }) });
  globalThis.fetch = getAudio;
  try {
    render(<MemoryRouter initialEntries={["/campus/course/swahili/day-7?view=hoeren"]}>
      <SwahiliA1PracticeWorkbook lesson={lesson} />
    </MemoryRouter>);
    const lecture = screen.getByRole("region", { name: "Chakula na Vinywaji · AI lecture" });
    expect(within(lecture).getByTitle("Chakula na Vinywaji · AI lecture").getAttribute("src"))
      .toBe("https://www.youtube-nocookie.com/embed/F35LGftA93I");
    expect(within(lecture).getByRole("link", { name: "Tazama kwenye YouTube" }).getAttribute("href"))
      .toBe("https://youtu.be/F35LGftA93I");
    const quiz = screen.getAllByRole("group");
    expect(quiz).toHaveLength(5);
    fireEvent.click(within(quiz[0]).getByRole("radio", { name: "Wali na kuku" }));
    fireEvent.click(screen.getByRole("button", { name: /Load audio/ }));
    const player = await screen.findByLabelText("Chakula na Vinywaji listening recording");
    expect(player.getAttribute("src")).toBe("https://example.test/day-07.mp3");
    expect(getAudio).toHaveBeenCalledWith("/api/course-media/swahili/a1/day-7/audio-url", {
      headers: { Authorization: "Bearer test-token" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Review & Submit · Review your answers" }));
    expect(screen.getByText("Wali na kuku")).toBeTruthy();
    expect(screen.queryByText(/Suggested answer|Model answer/)).toBeNull();
  } finally {
    globalThis.fetch = previousFetch;
  }
});

test("Day 7 Lesen displays the shopping dialogue and all five A1 questions without exposing marking answers", () => {
  const lesson = SWAHILI_A1_PRACTICE_UNITS[7];
  expect(lesson.reading.questions.map(({ id }) => id)).toEqual(["read-1", "read-2", "read-3", "read-4", "read-5"]);
  expect(lesson.reading.questions.map(({ choices }) => choices.length)).toEqual([4, 4, 4, 4, 4]);
  expect(lesson.reading.questions.every(({ answer, correctAnswer }) => answer === undefined && correctAnswer === undefined)).toBe(true);
  render(<MemoryRouter initialEntries={["/campus/course/swahili/day-7?view=lesen"]}>
    <SwahiliA1PracticeWorkbook lesson={lesson} preview />
  </MemoryRouter>);
  expect(screen.getByText("Hati ya Mazungumzo · Maziwa na Sukari")).toBeTruthy();
  expect(screen.getByText(/Mteja: Hujambo! Mna maziwa na sukari leo/)).toBeTruthy();
  expect(screen.getByText(/Jumla ni shilingi elfu nne na mia tano/)).toBeTruthy();
  const quiz = screen.getAllByRole("group");
  expect(quiz).toHaveLength(5);
  const answers = ["B) Mna maziwa na sukari leo?", "B) Lita moja ya maziwa na nusu kilo ya sukari.",
    "C) Shilingi elfu nne na mia tano (4,500 TSh).", "C) Naweza kulipa kwa pesa taslimu?",
    "C) Risiti, tafadhali."];
  answers.forEach((choice, index) => {
    const radio = within(quiz[index]).getByRole("radio", { name: choice });
    fireEvent.click(radio);
    expect(radio.checked).toBe(true);
  });
  expect(screen.queryByText(/Jibu:|Expected answer:|Model answer:/)).toBeNull();
});
