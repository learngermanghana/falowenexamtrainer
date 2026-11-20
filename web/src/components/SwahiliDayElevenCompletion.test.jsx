import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SwahiliA1PracticeWorkbook from "./SwahiliA1PracticeWorkbook";
import { SWAHILI_A1_PRACTICE_UNITS } from "../data/swahili/a1PracticeUnits";

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({ user: null, studentProfile: null }),
}));

const renderDay = (tab) => render(<MemoryRouter initialEntries={[`/campus/course/swahili/day-11?view=${tab}`]}>
  <SwahiliA1PracticeWorkbook lesson={SWAHILI_A1_PRACTICE_UNITS[11]} preview />
</MemoryRouter>);

test("Day 11 grammar includes actionable rules, examples and a self check", () => {
  renderDay("grammar");
  expect(screen.getByText(/Stock|Bidhaa zilizopo/)).toBeTruthy();
  expect(screen.getByText(/Ngeli ya Ki-\/Vi-/)).toBeTruthy();
  expect(screen.getByText(/Bei na kiasi/)).toBeTruthy();
  expect(screen.getByText(/Kuchagua na kulipa/)).toBeTruthy();
});

test("Day 11 references offers useful practice without inventing music", () => {
  renderDay("references");
  expect(screen.getByText(/No Day 11 song has been linked yet/)).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Go to Group Practice" }));
  expect(screen.getByRole("heading", { name: /Mazungumzo dukani/ })).toBeTruthy();
  expect(screen.getByRole("heading", { name: /Chagua bidhaa/ })).toBeTruthy();
});

test("Day 11 Schreiben has a structured task, keeps student input and navigates to submission", () => {
  renderDay("schreiben");
  expect(screen.getByRole("heading", { name: /Ununuzi dukani/ })).toBeTruthy();
  expect(screen.getByText(/Ask to pay by phone or cash/)).toBeTruthy();
  const answer = screen.getByRole("textbox", { name: /Your writing/ });
  fireEvent.change(answer, { target: { value: "Mteja: Hujambo! Muuzaji: Karibu dukani." } });
  expect(answer.value).toContain("Karibu dukani");
  fireEvent.click(screen.getByRole("button", { name: "Review & Submit" }));
  expect(screen.getByRole("heading", { name: /Review & Submit/ })).toBeTruthy();
  expect(screen.queryByText(/Model answer|Suggested answer/i)).toBeNull();
});

test("Day 11 retains five reading and five listening questions and private audio route", () => {
  const day = SWAHILI_A1_PRACTICE_UNITS[11];
  expect(day.reading.questions).toHaveLength(5);
  expect(day.listening.questions).toHaveLength(5);
  expect(day.listening.audioUrlEndpoint).toBe("/api/course-media/swahili/a1/day-11/audio-url");
  expect(day.groupPractice.stages).toHaveLength(3);
  expect(day.writing.guide.steps).toHaveLength(4);
});
