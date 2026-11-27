import React from "react";
import { getC1AcademicDay } from "../data/c1AcademicCurriculum";
import { getC1TopicFoundation } from "./C1TopicIntroduction";

// Draw the recap from the same curriculum used by the Learn tab.
export default function C1FinishSummary({ day }) {
  const academic = getC1AcademicDay(Number(day));
  const topic = getC1TopicFoundation(Number(day));
  if (!academic || !topic) return null;
  return <div data-c1-finish-summary={day} style={{ display: "grid", gap: 10, padding: 16, border: "1px solid #bfdbfe", borderRadius: 16, background: "#eff6ff", lineHeight: 1.7 }}>
    <h3 style={{ margin: 0 }}>Das hast du gelernt · {academic.topic}</h3>
    <p style={{ margin: 0 }}>{topic.intro}</p>
    <div><strong>Beispiel:</strong> {topic.example}</div>
    <div><strong>Perspektiven:</strong> {topic.tension}</div>
    <div><strong>Sprachlicher Fokus:</strong> {academic.grammar} · {academic.structure}</div>
    <div><strong>Beispielsatz:</strong> {academic.example}</div>
    <div><strong>Prüfungstraining:</strong> {academic.skill} · Teil {academic.part} — {academic.task}</div>
    <div><strong>Wortschatz:</strong> {academic.vocabulary.join(" · ")}</div>
  </div>;
}
