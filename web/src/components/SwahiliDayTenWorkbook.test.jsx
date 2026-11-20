import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SwahiliA1PracticeWorkbook from "./SwahiliA1PracticeWorkbook";
import { SWAHILI_A1_PRACTICE_UNITS } from "../data/swahili/a1PracticeUnits";

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({ user: { getIdToken: async () => "test-token" } }),
}));

test("Day 10 shows five questions and five matching answers for each exercise", async () => {
  const originalFetch = globalThis.fetch;
  const fetchAudio = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ url: "https://example.test/day-10.mp3" }),
  });
  globalThis.fetch = fetchAudio;
  try {
    render(
      <MemoryRouter initialEntries={["/campus/course/swahili/day-10?view=lesen"]}>
        <SwahiliA1PracticeWorkbook lesson={SWAHILI_A1_PRACTICE_UNITS[10]} />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { name: "Safari ya Juma Sokoni na Kahawani" })).toBeTruthy();
    expect(screen.getAllByRole("textbox")).toHaveLength(5);
    fireEvent.click(screen.getByRole("tab", { name: /^Teil 4 ·/ }));
    expect(screen.getAllByRole("group")).toHaveLength(5);
    fireEvent.click(screen.getByRole("button", { name: /Load audio/ }));
    expect((await screen.findByLabelText("Sokoni listening recording")).getAttribute("src"))
      .toBe("https://example.test/day-10.mp3");
    expect(fetchAudio).toHaveBeenCalledWith("/api/course-media/swahili/a1/day-10/audio-url", {
      headers: { Authorization: "Bearer test-token" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Review & Submit · Review your answers" }));
    expect(screen.getAllByRole("listitem")).toHaveLength(11);
    expect(screen.queryByText(/Suggested answer|Model answer/)).toBeNull();
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("A1 Day 10 workbook displays both approved YouTube lessons without replacing the separate Hören audio", () => {
  const lesson = SWAHILI_A1_PRACTICE_UNITS[10];
  expect(lesson.aiLecture.youtubeId).toBe("xLN5QX669JA");
  expect(lesson.radio.resourceRole).toBe("falowenRadio");
  expect(lesson.radio.youtubeId).toBe("4_ygEiW5QjI");

  render(
    <MemoryRouter initialEntries={["/campus/course/swahili/day-10?view=grammar"]}>
      <SwahiliA1PracticeWorkbook lesson={lesson} />
    </MemoryRouter>
  );

  expect(screen.getByTitle("Video ya AI · Sokoni").getAttribute("src"))
    .toContain("/embed/xLN5QX669JA");
  expect(screen.getByTitle("Falowen Radio · Sokoni").getAttribute("src"))
    .toContain("/embed/4_ygEiW5QjI");
  expect(screen.getByRole("link", { name: "Play Falowen Radio on YouTube" }).getAttribute("href"))
    .toBe("https://youtu.be/4_ygEiW5QjI");
  expect(screen.getByText(/Teil 4 has a separate listening recording/)).toBeTruthy();

  fireEvent.click(screen.getByRole("button", { name: "Go to Teil 4 · Listening" }));
  expect(screen.getByRole("heading", { name: "Teil 4 · Kusikiliza (Listening)" })).toBeTruthy();
  expect(screen.getByRole("button", { name: /Load audio/ })).toBeTruthy();
});
