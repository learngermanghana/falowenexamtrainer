import { getStandardWritingConfig as getPreviousWritingConfig } from "./standardLessonJourneyV3";
import c1Day7QuestionWritingBuilder from "./writingQuestionBuilders/c1Day7ReisenUndNachhaltigkeit";

export {
  getStandardBrainMap,
  buildStandardLessonFromCanonical,
  getStandardLessonStorageKey,
  getStandardWritingCloudField,
} from "./standardLessonJourneyV3";

export const getStandardWritingConfig = (lesson = {}) => {
  const level = String(lesson.level || "").trim().toUpperCase();
  const day = Number(lesson.day || 0);
  if (level === "C1" && day === 7) return c1Day7QuestionWritingBuilder;
  return getPreviousWritingConfig(lesson);
};
