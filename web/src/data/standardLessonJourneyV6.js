import { getStandardWritingConfig as getPreviousWritingConfig } from "./standardLessonJourneyV5";
import c1Day9QuestionWritingBuilder from "./writingQuestionBuilders/c1Day9KonsumUndWerbung";

export {
  getStandardBrainMap,
  buildStandardLessonFromCanonical,
  getStandardLessonStorageKey,
  getStandardWritingCloudField,
} from "./standardLessonJourneyV5";

export const getStandardWritingConfig = (lesson = {}) => {
  const level = String(lesson.level || "").trim().toUpperCase();
  const day = Number(lesson.day || 0);
  if (level === "C1" && day === 9) return c1Day9QuestionWritingBuilder;
  return getPreviousWritingConfig(lesson);
};
