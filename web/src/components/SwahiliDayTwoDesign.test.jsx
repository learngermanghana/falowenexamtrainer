import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SwahiliA1PracticeWorkbook from "./SwahiliA1PracticeWorkbook";
import { SWAHILI_A1_PRACTICE_UNITS } from "../data/swahili/a1PracticeUnits";

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({ user: null, studentProfile: null }),
}));

test("Day 2 group practice has structured role-play stages and leads to Schreiben", () => {
  render(<MemoryRouter initialEntries={["/campus/course/swahili/day-2?view=sprechen"]}>
    <SwahiliA1PracticeWorkbook lesson={SWAHILI_A1_PRACTICE_UNITS[2]} preview />
  </MemoryRouter>);
  expect(screen.getByText(/GROUP PRACTICE/)).toBeTruthy();
  expect(screen.getByRole("heading", { name: /Salamu za asubuhi/ })).toBeTruthy();
  expect(screen.getByRole("heading", { name: /Shikamoo na Marahaba/ })).toBeTruthy();
  expect(screen.getByRole("heading", { name: /Jitambulishe/ })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: /Next: Teil 2/ }));
  expect(screen.getByRole("heading", { name: /Kuandika · Mazungumzo ya salamu/ })).toBeTruthy();
  expect(screen.getByRole("textbox", { name: /Your writing/ })).toBeTruthy();
  fireEvent.change(screen.getByRole("textbox", { name: /Your writing/ }), { target: { value: "Habari za asubuhi? Ninaitwa Amina." } });
  expect(screen.getByText("5 words")).toBeTruthy();
  expect(screen.queryByText(/Model answer|Suggested answer/i)).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Review & Submit" }));
  expect(screen.getByRole("heading", { name: /Review & Submit/ })).toBeTruthy();
});

test("Day 10 keeps its existing Schreiben layout and submission structure", () => {
  render(<MemoryRouter initialEntries={["/campus/course/swahili/day-10?view=schreiben&radio=done"]}>
    <SwahiliA1PracticeWorkbook lesson={SWAHILI_A1_PRACTICE_UNITS[10]} preview />
  </MemoryRouter>);
  expect(screen.getByRole("heading", { name: "Teil 2 · Kuandika (Writing)" })).toBeTruthy();
  expect(screen.getByLabelText("Your writing answer")).toBeTruthy();
  expect(screen.queryByText(/GROUP PRACTICE/)).toBeNull();
});
