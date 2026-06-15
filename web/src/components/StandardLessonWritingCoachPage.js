import React from "react";
import StandardFourStageLessonPage from "./StandardFourStageLessonPageV3";
import CompactC1LessonPage from "./CompactC1LessonPage";

export const shouldMountMarkMyLetter = () => false;

export default function StandardLessonWritingCoachPage({ lesson, canonicalLesson }) {
  const level = String(lesson?.level || "").toUpperCase();
  const day = Number(lesson?.day || 0);
  const isCompactC1Lesson = level === "C1" && [7, 8, 9].includes(day);
  const LessonPage = isCompactC1Lesson ? CompactC1LessonPage : StandardFourStageLessonPage;
  return <LessonPage lesson={lesson} canonicalLesson={canonicalLesson} />;
}
