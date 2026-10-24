import { getStandardWritingConfig as getPreviousWritingConfig } from "./standardLessonJourneyV8";
import c1Day12QuestionWritingBuilder from "./writingQuestionBuilders/c1Day12FreizeitUndKultur";

export {
  getStandardBrainMap,
  buildStandardLessonFromCanonical,
  getStandardLessonStorageKey,
  getStandardWritingCloudField,
} from "./standardLessonJourneyV8";

export const getStandardWritingConfig = (lesson = {}) => {
  const level = String(lesson.level || "").trim().toUpperCase();
  const day = Number(lesson.day || 0);
  if (level === "C1" && day === 12) return c1Day12QuestionWritingBuilder;
  return getPreviousWritingConfig(lesson);
};
