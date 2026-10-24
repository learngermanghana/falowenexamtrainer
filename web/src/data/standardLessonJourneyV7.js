import { getStandardWritingConfig as getPreviousWritingConfig } from "./standardLessonJourneyV6";
import c1Day10QuestionWritingBuilder from "./writingQuestionBuilders/c1Day10IntegrationUndGesellschaft";

export {
  getStandardBrainMap,
  buildStandardLessonFromCanonical,
  getStandardLessonStorageKey,
  getStandardWritingCloudField,
} from "./standardLessonJourneyV6";

export const getStandardWritingConfig = (lesson = {}) => {
  const level = String(lesson.level || "").trim().toUpperCase();
  const day = Number(lesson.day || 0);
  if (level === "C1" && day === 10) return c1Day10QuestionWritingBuilder;
  return getPreviousWritingConfig(lesson);
};
