// Curriculum manifest with small runtime corrections for published lessons.
import { lessonCatalog as generatedLessonCatalog, normalizeLevel } from "./lessonCatalog.js";

const applyCurriculumCorrections = (entry) => {
  if (entry?.id === "B2-1.4") {
    return {
      ...entry,
      grammar_topic: "Finalsätze mit damit / um ... zu",
    };
  }

  return entry;
};

const lessonCatalog = Object.freeze(generatedLessonCatalog.map(applyCurriculumCorrections));
const CURRICULUM_ENTRIES = lessonCatalog;

const CURRICULUM_BY_LEVEL = Object.freeze(
  lessonCatalog.reduce((groups, entry) => {
    const level = normalizeLevel(entry.level);
    if (!groups[level]) groups[level] = [];
    groups[level].push(entry);
    return groups;
  }, {})
);

const getCurriculumEntriesForLevel = (level) =>
  CURRICULUM_BY_LEVEL[normalizeLevel(level)] || [];

const CANONICAL_CURRICULUM = lessonCatalog;

export {
  CANONICAL_CURRICULUM,
  CURRICULUM_ENTRIES,
  CURRICULUM_BY_LEVEL,
  getCurriculumEntriesForLevel,
  lessonCatalog,
  normalizeLevel,
};
