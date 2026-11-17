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
    fireEvent.click(screen.getByRole("button", { name: "Open answer sheet" }));
    for (const label of ["Teil 3 · Reading answers", "Teil 4 · Listening answers"]) {
      const section = screen.getByText(label).parentElement;
      fireEvent.click(screen.getByText(label));
      expect(within(section).getAllByRole("listitem")).toHaveLength(5);
    }
    expect(screen.getByText("Model answer: Kikombe cha kahawa na maji.")).toBeTruthy();
    expect(screen.getByText("Model answer: Shilingi mia nane")).toBeTruthy();
  } finally {
    globalThis.fetch = originalFetch;
  }
});
