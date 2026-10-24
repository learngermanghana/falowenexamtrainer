import { getStandardWritingConfig as getPreviousWritingConfig } from "./standardLessonJourneyV10";
import c1Day14QuestionWritingBuilder from "./writingQuestionBuilders/c1Day14InnovationUndZukunft";

export {
  getStandardBrainMap,
  buildStandardLessonFromCanonical,
  getStandardLessonStorageKey,
  getStandardWritingCloudField,
} from "./standardLessonJourneyV10";

export const getStandardWritingConfig = (lesson = {}) => {
  const level = String(lesson.level || "").trim().toUpperCase();
  const day = Number(lesson.day || 0);
  if (level === "C1" && day === 14) return c1Day14QuestionWritingBuilder;
  return getPreviousWritingConfig(lesson);
};
