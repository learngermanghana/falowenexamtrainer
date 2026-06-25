"use strict";

const generated = require("./lessonCatalog");

const lessonCatalog = generated.lessonCatalog.map((entry) => {
  if (entry && entry.id === "B2-1.4") {
    return Object.assign({}, entry, {
      grammar_topic: "Finalsätze mit damit / um ... zu",
    });
  }
  return entry;
});

const CURRICULUM_ENTRIES = lessonCatalog;
const CURRICULUM_BY_LEVEL = lessonCatalog.reduce((groups, entry) => {
  const level = generated.normalizeLevel(entry.level);
  if (!groups[level]) groups[level] = [];
  groups[level].push(entry);
  return groups;
}, {});

const getCurriculumEntriesForLevel = (level) =>
  CURRICULUM_BY_LEVEL[generated.normalizeLevel(level)] || [];

module.exports = {
  CANONICAL_CURRICULUM: lessonCatalog,
  CURRICULUM_ENTRIES,
  CURRICULUM_BY_LEVEL,
  getCurriculumEntriesForLevel,
  lessonCatalog,
  normalizeLevel: generated.normalizeLevel,
};
