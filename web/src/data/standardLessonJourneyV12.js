import { getStandardWritingConfig as getPreviousWritingConfig } from "./standardLessonJourneyV11";
import c1Day15QuestionWritingBuilder from "./writingQuestionBuilders/c1Day15BildungUndLebenslangesLernen";

export {
  getStandardBrainMap,
  buildStandardLessonFromCanonical,
  getStandardLessonStorageKey,
  getStandardWritingCloudField,
} from "./standardLessonJourneyV11";

export const getStandardWritingConfig = (lesson = {}) => {
  const level = String(lesson.level || "").trim().toUpperCase();
  const day = Number(lesson.day || 0);
  if (level === "C1" && day === 15) return c1Day15QuestionWritingBuilder;
  return getPreviousWritingConfig(lesson);
};
