import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SwahiliA1PracticeWorkbook from "./SwahiliA1PracticeWorkbook";
import { SWAHILI_A1_PRACTICE_UNITS } from "../data/swahili/a1PracticeUnits";

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({ user: { getIdToken: async () => "test-token" } }),
}));

const lesson = SWAHILI_A1_PRACTICE_UNITS[8];

test("Day 8 has five original multiple-choice reading questions without displaying the key", () => {
  expect(lesson.reading.questions).toHaveLength(5);
  expect(lesson.reading.questions.every(q => q.choices.length === 4 && q.answer === undefined)).toBe(true);
  render(<MemoryRouter initialEntries={["/campus/course/swahili/day-8?view=lesen"]}>
    <SwahiliA1PracticeWorkbook lesson={lesson} preview />
  </MemoryRouter>);
  expect(screen.getByText(/Mimi ni Neema/)).toBeTruthy();
  const groups = screen.getAllByRole("group");
  expect(groups).toHaveLength(5);
  fireEvent.click(within(groups[0]).getByRole("radio", { name: "Miaka ishirini na miwili" }));
  expect(within(groups[0]).getByRole("radio", { name: "Miaka ishirini na miwili" }).checked).toBe(true);
  expect(screen.queryByText(/Correct answer:|Model answer:|Expected:/)).toBeNull();
});

test("Day 8 Hören uses authenticated R2 day-08 audio and five transcript-grounded questions", async () => {
  expect(lesson.listening.questions).toHaveLength(5);
  expect(lesson.listening.audioUrlEndpoint).toBe("/api/course-media/swahili/a1/day-8/audio-url");
  const oldFetch = globalThis.fetch;
  const audioFetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ url: "https://example.test/swahili/A1/day-08/day-08.mp3?X-Amz-Signature=test" }),
  });
  globalThis.fetch = audioFetch;
  try {
    render(<MemoryRouter initialEntries={["/campus/course/swahili/day-8?view=hoeren"]}>
      <SwahiliA1PracticeWorkbook lesson={lesson} preview />
    </MemoryRouter>);
    const groups = screen.getAllByRole("group");
    expect(groups).toHaveLength(5);
    fireEvent.click(within(groups[2]).getByRole("radio", { name: "Watoto wawili" }));
    fireEvent.click(screen.getByRole("button", { name: /Load audio/ }));
    const player = await screen.findByLabelText("Namba na Umri listening recording");
    expect(player.getAttribute("src")).toContain("/swahili/A1/day-08/day-08.mp3?");
    expect(audioFetch).toHaveBeenCalledWith("/api/course-media/swahili/a1/day-8/audio-url", {
      headers: { Authorization: "Bearer test-token" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Review & Submit · Review your answers" }));
    expect(screen.getByText("Watoto wawili")).toBeTruthy();
    expect(screen.queryByText(/Correct answer:|Model answer:|Expected:/)).toBeNull();
  } finally {
    globalThis.fetch = oldFetch;
  }
});

test("Day 8 includes structured speaking and Teil 2 writing support", () => {
  expect(lesson.groupPractice.stages).toHaveLength(4);
  expect(lesson.writing.guide.minimumLines).toBe(5);
  render(<MemoryRouter initialEntries={["/campus/course/swahili/day-8?view=sprechen"]}>
    <SwahiliA1PracticeWorkbook lesson={lesson} preview />
  </MemoryRouter>);
  expect(screen.getByRole("heading", { name: /Kuuliza umri na familia/ })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: /Next: Teil 2/ }));
  expect(screen.getByRole("heading", { name: /Kuandika · Umri na familia/ })).toBeTruthy();
  expect(screen.getByRole("textbox")).toBeTruthy();
});
