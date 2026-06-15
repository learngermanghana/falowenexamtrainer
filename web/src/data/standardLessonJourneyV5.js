import { getStandardWritingConfig as getPreviousWritingConfig } from "./standardLessonJourneyV4";
import c1Day8QuestionWritingBuilder from "./writingQuestionBuilders/c1Day8WohnenUndStadtentwicklung";

export {
  getStandardBrainMap,
  buildStandardLessonFromCanonical,
  getStandardLessonStorageKey,
  getStandardWritingCloudField,
} from "./standardLessonJourneyV4";

export const getStandardWritingConfig = (lesson = {}) => {
  const level = String(lesson.level || "").trim().toUpperCase();
  const day = Number(lesson.day || 0);
  if (level === "C1" && day === 8) return c1Day8QuestionWritingBuilder;
  return getPreviousWritingConfig(lesson);
};
