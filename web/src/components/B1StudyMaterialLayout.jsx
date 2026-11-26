import React from "react";
import StudyPartner from "./A1StudyPartner";
import { courseSchedules } from "../data/courseSchedule";
import { getB1LessonResourceOverride } from "../data/b1LessonResourceOverrides";

export function getB1StudyMaterialLesson(day) {
  const override = getB1LessonResourceOverride(day);
  const lesson = (courseSchedules.B1 || []).find(entry => Number(entry.day) === Number(day));
  const title = override?.title || lesson?.topic;
  const chapter = override?.chapter || lesson?.chapter;
  if (!title || !chapter || Number(day) < 1 || Number(day) > 28) return null;
  return {
    kind: "practice", day: Number(day), chapter,
    title: [title, override?.grammarTopic || lesson?.grammar_topic].filter(Boolean).join(" — "),
  };
}

export default function B1StudyMaterialLayout({ day, children }) {
  const lesson = getB1StudyMaterialLesson(day);
  if (!lesson) return children;
  return (
    <>
      <div style={{ maxWidth: 1050, margin: "12px auto", padding: "0 16px" }}>
        <StudyPartner key={day} level="B1" lesson={lesson} section="Self-learning grammar notes" />
      </div>
      {children}
    </>
  );
}
