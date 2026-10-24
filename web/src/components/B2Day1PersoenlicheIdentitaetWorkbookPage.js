import React from "react";
import { getSelfLearningLessonComponent } from "./SelfLearningLessonRegistry";

const B2_DAY1_SELF_LEARNING_COMPONENT = getSelfLearningLessonComponent("B2", 1);

const B2Day1PersoenlicheIdentitaetWorkbookPage = () => {
  if (!B2_DAY1_SELF_LEARNING_COMPONENT) return null;
  const SelfLearningLesson = B2_DAY1_SELF_LEARNING_COMPONENT;
  return <SelfLearningLesson canonicalLesson={null} />;
};

export default B2Day1PersoenlicheIdentitaetWorkbookPage;

export const __TESTING__ = { level: "B2", day: 1 };
