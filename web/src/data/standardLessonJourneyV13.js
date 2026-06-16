import { getStandardWritingConfig as getPreviousWritingConfig } from "./standardLessonJourneyV12";
import c1Day16QuestionWritingBuilder from "./writingQuestionBuilders/c1Day16TechnologieImAlltag";

export {
  getStandardBrainMap,
  buildStandardLessonFromCanonical,
  getStandardLessonStorageKey,
  getStandardWritingCloudField,
} from "./standardLessonJourneyV12";

export const getStandardWritingConfig = (lesson = {}) => {
  const level = String(lesson.level || "").trim().toUpperCase();
  const day = Number(lesson.day || 0);
  if (level === "C1" && day === 16) return c1Day16QuestionWritingBuilder;
  return getPreviousWritingConfig(lesson);
};
