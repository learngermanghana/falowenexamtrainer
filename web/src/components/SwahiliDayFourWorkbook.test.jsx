import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SwahiliA1PracticeWorkbook from "./SwahiliA1PracticeWorkbook";
import { SWAHILI_A1_PRACTICE_UNITS } from "../data/swahili/a1PracticeUnits";

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({ user: { getIdToken: async () => "test-token" } }),
}));

test("Day 4 Lesen contains the Amina-John dialogue and five four-choice questions", () => {
  const lesson = SWAHILI_A1_PRACTICE_UNITS[4];
  expect(lesson.title).toBe("Nchi na Lugha");
  expect(lesson.reading.questions.map(q => q.id)).toEqual(["read-1", "read-2", "read-3", "read-4", "read-5"]);
  expect(lesson.reading.questions.every(q => q.choices.length === 4 && q.answer === undefined)).toBe(true);
  render(<MemoryRouter initialEntries={["/campus/course/swahili/day-4?view=lesen"]}>
    <SwahiliA1PracticeWorkbook lesson={lesson} preview />
  </MemoryRouter>);
  expect(screen.getByText("Mazungumzo · Nchi na Lugha")).toBeTruthy();
  expect(screen.getByText(/Amina: Hujambo! Jina lako ni nani/)).toBeTruthy();
  expect(screen.getByText(/Ninasema Kiingereza na Kifaransa kidogo/)).toBeTruthy();
  const questions = screen.getAllByRole("group");
  expect(questions).toHaveLength(5);
  lesson.reading.questions.forEach(({ choices }, index) => {
    const radio = within(questions[index]).getByRole("radio", { name: choices[0] });
    fireEvent.click(radio);
    expect(radio.checked).toBe(true);
  });
  expect(screen.queryByText(/Correct answer:|Jibu:|Expected:/)).toBeNull();
});

test("Day 4 Hören requests the authenticated private Day 04 MP3 and shows five questions", async () => {
  const lesson = SWAHILI_A1_PRACTICE_UNITS[4];
  expect(lesson.listening.questions.map(q => q.id)).toEqual([
    "listen-origin-b", "listen-origin-a", "listen-languages-b", "listen-learning", "listen-likes-a",
  ]);
  const previousFetch = globalThis.fetch;
  const getAudio = jest.fn().mockResolvedValue({
    ok: true, json: async () => ({ url: "https://example.test/swahili/A1/day-04/day-04.mp3?signature=test" }),
  });
  globalThis.fetch = getAudio;
  try {
    render(<MemoryRouter initialEntries={["/campus/course/swahili/day-4?view=hoeren"]}>
      <SwahiliA1PracticeWorkbook lesson={lesson} />
    </MemoryRouter>);
    expect(screen.getAllByRole("group")).toHaveLength(5);
    fireEvent.click(screen.getByRole("button", { name: /Load audio/ }));
    const audio = await screen.findByLabelText("Nchi na Lugha listening recording");
    expect(audio.getAttribute("src")).toContain("/swahili/A1/day-04/day-04.mp3?");
    expect(getAudio).toHaveBeenCalledWith("/api/course-media/swahili/a1/day-4/audio-url", {
      headers: { Authorization: "Bearer test-token" },
    });
    const first = screen.getAllByRole("group")[0];
    fireEvent.click(within(first).getByRole("radio", { name: "A) Tanzania" }));
    fireEvent.click(screen.getByRole("button", { name: "Review & Submit · Review your answers" }));
    expect(screen.getByText("A) Tanzania")).toBeTruthy();
    expect(screen.queryByText(/Correct answer:|Model answer:|Expected:/)).toBeNull();
  } finally {
    globalThis.fetch = previousFetch;
  }
});
