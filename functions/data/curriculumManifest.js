// AUTO-GENERATED CURRICULUM WITH A1 DISPLAY-TITLE OVERRIDES.

const {
  lessonCatalog,
  CURRICULUM_ENTRIES: BASE_CURRICULUM_ENTRIES,
  CURRICULUM_BY_LEVEL: BASE_CURRICULUM_BY_LEVEL,
  getCurriculumEntriesForLevel: getBaseCurriculumEntriesForLevel,
  normalizeLevel,
} = require('./lessonCatalog');
const { applyA1LessonTitleOverride } = require('./a1LessonTitleOverrides');

const applyTitle = (entry = {}) => normalizeLevel(entry.level) === 'A1'
  ? applyA1LessonTitleOverride(entry)
  : entry;

const CANONICAL_CURRICULUM = Object.freeze(lessonCatalog.map(applyTitle));
const CURRICULUM_ENTRIES = Object.freeze(BASE_CURRICULUM_ENTRIES.map(applyTitle));
const CURRICULUM_BY_LEVEL = Object.freeze(Object.fromEntries(
  Object.entries(BASE_CURRICULUM_BY_LEVEL).map(([level, entries]) => [
    level,
    Object.freeze(entries.map(applyTitle)),
  ]),
));
const getCurriculumEntriesForLevel = (level) =>
  getBaseCurriculumEntriesForLevel(level).map(applyTitle);

module.exports = {
  CANONICAL_CURRICULUM,
  CURRICULUM_ENTRIES,
  CURRICULUM_BY_LEVEL,
  getCurriculumEntriesForLevel,
  normalizeLevel,
};
