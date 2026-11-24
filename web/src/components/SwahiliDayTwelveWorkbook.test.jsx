import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SwahiliA1PracticeWorkbook from "./SwahiliA1PracticeWorkbook";
import { SWAHILI_A1_PRACTICE_UNITS } from "../data/swahili/a1PracticeUnits";
jest.mock("../context/AuthContext", () => ({ useAuth: () => ({ user: null, studentProfile: null }) }));
test.each([12,13])("Day %i has versioned calendar/routine exercises and teacher-led listening", day => {
 const lesson=SWAHILI_A1_PRACTICE_UNITS[day];
 expect(lesson.contentVersion).toBe(3);
 expect(lesson.reading.questions).toHaveLength(5);
 expect(lesson.listening.questions).toHaveLength(5);
 expect(lesson.listening.teacherLed).toBe(true);
 expect(lesson.listening.audioUrlEndpoint).toBeUndefined();
 for(const section of [lesson.reading,lesson.listening]) for(const q of section.questions) expect(q).not.toHaveProperty("answer");
 render(<MemoryRouter initialEntries={[`/campus/course/swahili/day-${day}?view=hoeren`]}><SwahiliA1PracticeWorkbook lesson={lesson} preview /></MemoryRouter>);
 expect(screen.getByText(/Teacher-led listening/)).toBeTruthy();
});
