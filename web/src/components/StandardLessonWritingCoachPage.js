import React from "react";
import StandardFourStageLessonPage from "./StandardFourStageLessonPageV3";
import CompactC1LessonPage from "./CompactC1LessonPage";

export const shouldMountMarkMyLetter = () => false;

export default function StandardLessonWritingCoachPage({ lesson, canonicalLesson }) {
  const isCompactC1Day7 = String(lesson?.level || "").toUpperCase() === "C1" && Number(lesson?.day) === 7;
  const LessonPage = isCompactC1Day7 ? CompactC1LessonPage : StandardFourStageLessonPage;
  return <LessonPage lesson={lesson} canonicalLesson={canonicalLesson} />;
}
