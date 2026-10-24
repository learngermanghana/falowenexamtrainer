import { getStandardWritingConfig as getPreviousWritingConfig } from "./standardLessonJourneyV9";
import c1Day13QuestionWritingBuilder from "./writingQuestionBuilders/c1Day13Mehrsprachigkeit";

export {
  getStandardBrainMap,
  buildStandardLessonFromCanonical,
  getStandardLessonStorageKey,
  getStandardWritingCloudField,
} from "./standardLessonJourneyV9";

export const getStandardWritingConfig = (lesson = {}) => {
  const level = String(lesson.level || "").trim().toUpperCase();
  const day = Number(lesson.day || 0);
  if (level === "C1" && day === 13) return c1Day13QuestionWritingBuilder;
  return getPreviousWritingConfig(lesson);
};
