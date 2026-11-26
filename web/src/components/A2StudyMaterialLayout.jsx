import React from "react";
import StudyPartner from "./A1StudyPartner";
import { courseSchedules } from "../data/courseSchedule";
import { A2_GRAMMAR_ROUTE_ENTRIES } from "../data/a2GrammarRoutes";

// Only standalone grammar routes use this wrapper. Embedded grammar tabs
// already receive the study partner from the shared A2 workbook layout.
export function getA2StudyMaterialLesson(day) {
  const route = A2_GRAMMAR_ROUTE_ENTRIES.find(entry => entry.day === Number(day));
  const lesson = (courseSchedules.A2 || []).find(entry => Number(entry.day) === Number(day));
  if (!route || !lesson?.topic) return null;
  return {
    kind: "practice",
    day: route.day,
    chapter: route.chapter,
    title: [lesson.topic, lesson.grammar_topic].filter(Boolean).join(" — "),
  };
}

export default function A2StudyMaterialLayout({ day, children }) {
  const lesson = getA2StudyMaterialLesson(day);
  if (!lesson) return children;
  return (
    <>
      <div style={{ maxWidth: 1050, margin: "12px auto", padding: "0 16px" }}>
        <StudyPartner key={day} level="A2" lesson={lesson} section="Self-learning grammar notes" />
      </div>
      {children}
    </>
  );
}
