import React from "react";
import StandardFourStageLessonPage from "./StandardFourStageLessonPageV3";
import CompactC1LessonPage from "./CompactC1LessonPage";
import { C1_DAY3_RADIO_OVERRIDE } from "../data/c1Day3RadioOverride";

export const shouldMountMarkMyLetter = () => false;

export default function StandardLessonWritingCoachPage({ lesson, canonicalLesson }) {
  const level = String(lesson?.level || "").toUpperCase();
  const day = Number(lesson?.day || 0);
  const isCompactC1Lesson = level === "C1" && (day === 3 || (day >= 7 && day <= 16));
  const LessonPage = isCompactC1Lesson ? CompactC1LessonPage : StandardFourStageLessonPage;
  const resolvedCanonicalLesson = level === "C1" && day === 3
    ? {
        ...(canonicalLesson || {}),
        resources: {
          ...(canonicalLesson?.resources || {}),
          falowenRadio: C1_DAY3_RADIO_OVERRIDE,
        },
      }
    : canonicalLesson;

  return <LessonPage lesson={lesson} canonicalLesson={resolvedCanonicalLesson} />;
}
