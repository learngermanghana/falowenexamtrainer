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
    fireEvent.click(screen.getByRole("button", { name: "Receive & Submit · Review your answers" }));
    fireEvent.click(screen.getByText("Teil 4 · Listening answers"));
    expect(screen.getByText("Your answer: Wali na kuku")).toBeTruthy();
    expect(screen.getByText("Suggested answer: Shilingi elfu tano")).toBeTruthy();
  } finally {
    globalThis.fetch = previousFetch;
  }
});
