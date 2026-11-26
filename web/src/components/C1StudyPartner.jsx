import React from "react";
import StudyPartner from "./A1StudyPartner";
import { courseSchedules } from "../data/courseSchedule";
import { getC1AcademicDay } from "../data/c1AcademicCurriculum";
import { getC1Phase2Lesson } from "../data/c1Phase2Lessons";

export function getC1StudyPartnerLesson(day) {
  const number = Number(day);
  if (!Number.isInteger(number) || number < 1 || number > 28) return null;
  const entry = courseSchedules.C1.find(item => Number(item.day) === number);
  const academic = getC1AcademicDay(number);
  const practice = getC1Phase2Lesson(number);
  if (!entry?.chapter || !academic || !practice) return null;
  return {
    kind: "practice", day: number, chapter: entry.chapter,
    title: academic.topic,
    grammarFocus: practice.grammar,
    guidingQuestion: academic.task,
  };
}
export default function C1StudyPartner({ day, section = "" }) {
  const lesson = getC1StudyPartnerLesson(day);
  return lesson ? <StudyPartner key={lesson.day} level="C1" lesson={lesson} section={section} /> : null;
}
export function C1StudyMaterialLayout({day, children}) {
  return <div style={{display:"grid",gap:12}}><C1StudyPartner day={day} section="Grammar notes" />{children}</div>;
}
