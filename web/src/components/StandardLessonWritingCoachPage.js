import React from "react";
import StandardFourStageLessonPage from "./StandardFourStageLessonPageV3";

export const shouldMountMarkMyLetter = () => false;

export default function StandardLessonWritingCoachPage({ lesson, canonicalLesson }) {
  return <StandardFourStageLessonPage lesson={lesson} canonicalLesson={canonicalLesson} />;
}
