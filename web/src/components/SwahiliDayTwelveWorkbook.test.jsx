import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SwahiliA1PracticeWorkbook from "./SwahiliA1PracticeWorkbook";
import { SWAHILI_A1_PRACTICE_UNITS } from "../data/swahili/a1PracticeUnits";
jest.mock("../context/AuthContext", () => ({ useAuth: () => ({ user: null, studentProfile: null }) }));
const day = SWAHILI_A1_PRACTICE_UNITS[12];
const open = (tab) => render(<MemoryRouter initialEntries={[`/campus/course/swahili/day-12?view=${tab}`]}><SwahiliA1PracticeWorkbook lesson={day} preview /></MemoryRouter>);
test("Day 12 reading and listening contain five app-submittable MCQs with no answer keys", () => {
 expect(day.reading.questions).toHaveLength(5);
 expect(day.listening.questions).toHaveLength(5);
 expect(day.listening.audioUrlEndpoint).toBe("/api/course-media/swahili/a1/day-12/audio-url");
 expect(day.reading.text).toContain("wali wa nazi");
 for(const section of [day.reading,day.listening]) for(const q of section.questions) {
  expect(q.choices).toHaveLength(4); expect(q.id).toBeTruthy(); expect(q).not.toHaveProperty("answer");
 }
});
test("Day 12 has four cooking grammar sections", () => {
 expect(day.grammarSections).toHaveLength(4);
 open("grammar");
 expect(screen.getByText(/Mpangilio wa hatua/)).toBeTruthy();
});
test("Day 12 group practice and Schreiben lead to existing Review and Submit", () => {
 open("sprechen");
 expect(screen.getByRole("heading",{name:/Mapishi jikoni/})).toBeTruthy();
 expect(screen.getByRole("heading",{name:/Viungo vya ugali/})).toBeTruthy();
 fireEvent.click(screen.getByRole("button",{name:/Next: Teil 2/}));
 expect(screen.getByRole("heading",{name:/Jinsi ya kupika ugali/})).toBeTruthy();
 fireEvent.change(screen.getByRole("textbox",{name:/Your writing/}),{target:{value:"Kwanza, chemsha maji."}});
 fireEvent.click(screen.getByRole("button",{name:"Review & Submit"}));
 expect(screen.getByRole("heading",{name:/Review & Submit/})).toBeTruthy();
 expect(screen.queryByText(/Suggested answer|Model answer/)).toBeNull();
});
