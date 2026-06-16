import React from "react";
import { courseSchedules } from "../data/courseSchedule";
import CourseLessonPageLegacy from "./CourseLessonPageLegacy";

const A1_DAY_3_TITLE = "German Subject Pronouns, Verb Conjugation and Introducing Yourself";

const applyA1Day3Metadata = () => {
  const lesson = (courseSchedules.A1 || []).find((entry) => Number(entry.day) === 3);
  if (!lesson) return;

  lesson.topic = A1_DAY_3_TITLE;
  lesson.grammar_topic = A1_DAY_3_TITLE;
  lesson.goal =
    "Learn all German subject pronouns, conjugate useful everyday verbs, distinguish informal and formal forms of you, and introduce yourself in German.";
};

applyA1Day3Metadata();

export default function CourseLessonPage() {
  return <CourseLessonPageLegacy />;
}
