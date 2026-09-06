import React from "react";
import { getSelfLearningLessonComponent } from "./SelfLearningLessonRegistry";

const C1_DAY1_SELF_LEARNING_COMPONENT = getSelfLearningLessonComponent("C1", 1);

const C1Day1WillkommenSelbstlernstartWorkbookPage = () => {
  if (!C1_DAY1_SELF_LEARNING_COMPONENT) return null;
  const SelfLearningLesson = C1_DAY1_SELF_LEARNING_COMPONENT;
  return <SelfLearningLesson canonicalLesson={null} />;
};

export default C1Day1WillkommenSelbstlernstartWorkbookPage;

export const __TESTING__ = { level: "C1", day: 1 };
