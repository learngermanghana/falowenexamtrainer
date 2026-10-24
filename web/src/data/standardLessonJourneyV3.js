import {
  getStandardWritingConfig as getPreviousWritingConfig,
} from "./standardLessonJourneyV2";
import c1Day6QuestionWritingBuilder from "./writingQuestionBuilders/c1Day6GesundheitUndLebensstil";

export {
  getStandardBrainMap,
  buildStandardLessonFromCanonical,
  getStandardLessonStorageKey,
  getStandardWritingCloudField,
} from "./standardLessonJourneyV2";

export const getStandardWritingConfig = (lesson = {}) => {
  const level = String(lesson.level || "").trim().toUpperCase();
  const day = Number(lesson.day || 0);
  if (level === "C1" && day === 6) return c1Day6QuestionWritingBuilder;
  return getPreviousWritingConfig(lesson);
};
