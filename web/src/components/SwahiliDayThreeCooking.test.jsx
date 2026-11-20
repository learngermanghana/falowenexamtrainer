import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SwahiliA1PracticeWorkbook from "./SwahiliA1PracticeWorkbook";
import { SWAHILI_A1_PRACTICE_UNITS } from "../data/swahili/a1PracticeUnits";

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({ user: null, studentProfile: null }),
}));
const lesson = SWAHILI_A1_PRACTICE_UNITS[3];
function open(tab) {
  return render(<MemoryRouter initialEntries={[`/campus/course/swahili/day-3?view=${tab}`]}>
    <SwahiliA1PracticeWorkbook lesson={lesson} preview />
  </MemoryRouter>);
}
test("Day 3 reading and listening have five choices each and do not disclose answer keys", () => {
  expect(lesson.reading.title).toBe("Mapishi Jikoni kwa Asha");
  expect(lesson.reading.questions).toHaveLength(5);
  expect(lesson.listening.questions).toHaveLength(5);
  expect(lesson.listening.audioUrlEndpoint).toBe("/api/course-media/swahili/a1/day-3/audio-url");
  for (const section of [lesson.reading, lesson.listening]) for (const question of section.questions) {
    expect(question.id).toBeTruthy();
    expect(question.choices).toHaveLength(4);
    expect(question).not.toHaveProperty("answer");
    expect(question).not.toHaveProperty("correctAnswer");
  }
});
test("Day 3 cooking grammar contains four topic sections and vocabulary", () => {
  expect(lesson.grammarSections).toHaveLength(4);
  expect(lesson.vocabulary.length).toBeGreaterThan(8);
  open("grammar");
  expect(screen.getByText(/Mpangilio wa mapishi/)).toBeTruthy();
});
test("Day 3 group practice and writing navigate to the established submission flow", () => {
  open("sprechen");
  expect(screen.getByRole("heading", { name: /Mapishi ya familia/ })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: /Next: Teil 2/ }));
  expect(screen.getByRole("heading", { name: /Mapishi yangu/ })).toBeTruthy();
  const input = screen.getByRole("textbox", { name: /Your writing/ });
  fireEvent.change(input, { target: { value: "Kwanza, chemsha maji." } });
  expect(input.value).toBe("Kwanza, chemsha maji.");
  fireEvent.click(screen.getByRole("button", { name: "Review & Submit" }));
  expect(screen.getByRole("heading", { name: /Review & Submit/ })).toBeTruthy();
});
