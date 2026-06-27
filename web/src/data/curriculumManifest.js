// AUTO-GENERATED FILE WITH A1 DISPLAY-TITLE OVERRIDES.
// Canonical lesson IDs and resources remain unchanged.

import {
  lessonCatalog,
  CURRICULUM_ENTRIES as BASE_CURRICULUM_ENTRIES,
  CURRICULUM_BY_LEVEL as BASE_CURRICULUM_BY_LEVEL,
  getCurriculumEntriesForLevel as getBaseCurriculumEntriesForLevel,
  normalizeLevel,
} from "./lessonCatalog.js";
import { applyA1LessonTitleOverride } from "./a1LessonTitleOverrides.js";

const applyTitle = (entry = {}) => normalizeLevel(entry.level) === "A1"
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

export {
  CANONICAL_CURRICULUM,
  CURRICULUM_ENTRIES,
  CURRICULUM_BY_LEVEL,
  getCurriculumEntriesForLevel,
  normalizeLevel,
};
