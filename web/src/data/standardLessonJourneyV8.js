import { getStandardWritingConfig as getPreviousWritingConfig } from "./standardLessonJourneyV7";
import c1Day11QuestionWritingBuilder from "./writingQuestionBuilders/c1Day11EngagementUndEhrenamt";

export {
  getStandardBrainMap,
  buildStandardLessonFromCanonical,
  getStandardLessonStorageKey,
  getStandardWritingCloudField,
} from "./standardLessonJourneyV7";

export const getStandardWritingConfig = (lesson = {}) => {
  const level = String(lesson.level || "").trim().toUpperCase();
  const day = Number(lesson.day || 0);
  if (level === "C1" && day === 11) return c1Day11QuestionWritingBuilder;
  return getPreviousWritingConfig(lesson);
};
