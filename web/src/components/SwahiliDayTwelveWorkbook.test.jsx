import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SwahiliA1PracticeWorkbook from "./SwahiliA1PracticeWorkbook";
import { SWAHILI_A1_PRACTICE_UNITS } from "../data/swahili/a1PracticeUnits";
jest.mock("../context/AuthContext", () => ({ useAuth: () => ({ user: null, studentProfile: null }) }));
test.each([12,13])("Day %i has versioned calendar/routine exercises and recorded listening", day => {
 const lesson=SWAHILI_A1_PRACTICE_UNITS[day];
 expect(lesson.contentVersion).toBe(3);
 expect(lesson.reading.questions).toHaveLength(5);
 expect(lesson.listening.questions).toHaveLength(5);
 expect(lesson.listening.teacherLed).toBe(false);
 expect(lesson.listening.audioUrlEndpoint).toBe(`/api/course-media/swahili/a1/day-${day}/audio-url`);
 for(const section of [lesson.reading,lesson.listening]) for(const q of section.questions) expect(q).not.toHaveProperty("answer");
 render(<MemoryRouter initialEntries={[`/campus/course/swahili/day-${day}?view=hoeren`]}><SwahiliA1PracticeWorkbook lesson={lesson} preview /></MemoryRouter>);
 expect(screen.getByRole('button', {name:/Load audio/})).toBeTruthy();
 expect(screen.queryByText(/Teacher-led listening/)).toBeNull();
 expect(screen.getAllByRole('radio')).toHaveLength(15);
});

test("Day 12 exposes the song lyrics and all seven optional questions from the workbook", async () => {
 const track = { id: "swahili-a1-day-12", title: "Angalia Kalenda", level: "A1", day: 12,
  language: "Swahili", coursebook: true, objectKey: "swahili/music/A1/day-12/Angalia Kalenda.mp3.mpeg",
  audioUrl: "https://www.falowen.app/api/music?track=swahili-a1-day-12" };
 const practiceQuestions = require("../../../server/data/swahili-a1-day-12-music-practice.json");
 const previousFetch = global.fetch;
 global.fetch = jest.fn(async url => ({ok:true, json:async () => {
  if (url.includes("swahili-catalog")) return { tracks: [track] };
  if (url.includes("music-lyrics")) return {objectKey:track.objectKey, lyrics:"Jumamosi, Jumapili,", cues:[{start:1,end:3,text:"Jumamosi, Jumapili,"}], practiceQuestions};
  return {};
 }}));
 try {
  render(<MemoryRouter initialEntries={["/campus/course/swahili/day-12"]}>
   <SwahiliA1PracticeWorkbook lesson={SWAHILI_A1_PRACTICE_UNITS[12]} preview />
  </MemoryRouter>);
  fireEvent.click(screen.getByRole("button", {name:/Angalia Kalenda · Maneno ya wimbo na maswali/}));
  const radio = screen.getByTitle("Falowen Radio · Siku, Miezi na Tarehe");
  expect(radio.src).toContain("/embed/QdpRliUlbMA");
  expect(screen.queryByText("Sikiliza na ukamilishe taarifa hizi.")).toBeNull();
  const summary = await screen.findByText("Swahili lyrics · Soma pamoja");
  expect(summary.closest("details").open).toBe(true);
  const line = screen.getByText("Jumamosi, Jumapili,").closest("[data-lyric-pair]");
  const player = screen.getByLabelText("Play Angalia Kalenda", {selector:"audio"});
  player.currentTime = 2;
  fireEvent.timeUpdate(player);
  expect(line.getAttribute("aria-current")).toBe("true");
  const answers = screen.getAllByText("Onyesha jibu");
  expect(answers).toHaveLength(7);
  expect(answers.every(answer => !answer.closest("details").open)).toBe(true);
  expect(screen.queryByRole("button", {name:/Load audio/})).toBeNull();
 } finally {
  global.fetch = previousFetch;
 }
});
