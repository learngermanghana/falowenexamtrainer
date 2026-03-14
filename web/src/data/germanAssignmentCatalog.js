const {
  CURRICULUM_ENTRIES,
  CURRICULUM_BY_LEVEL,
  getCurriculumEntriesForLevel,
  normalizeLevel,
} = require("./curriculumManifest");

const normalizeChapter = (value) => {
  const token = String(value || "").trim();
  return /^\d+(?:\.\d+)?$/.test(token) ? token : "";
};

const toCanonicalAssignmentId = ({ level, assignmentId, chapter }) => {
  const normalizedLevel = normalizeLevel(level);
  if (!normalizedLevel) return "";

  const explicitToken = String(assignmentId || "").trim();
  if (/^(A1|A2|B1|B2|C1|C2)-\d+(?:\.\d+)?$/i.test(explicitToken)) {
    return explicitToken.toUpperCase();
  }

  const chapterToken = normalizeChapter(chapter);
  if (chapterToken) return `${normalizedLevel}-${chapterToken}`;

  const chapterFromId = explicitToken.match(/(\d+(?:\.\d+)?)/)?.[1] || "";
  return normalizeChapter(chapterFromId) ? `${normalizedLevel}-${chapterFromId}` : "";
};

export { CURRICULUM_ENTRIES };

export const GERMAN_ASSIGNMENT_COURSE_DICTIONARY = Object.fromEntries(
  Object.entries(CURRICULUM_BY_LEVEL).map(([level, entries]) => [
    level,
    Object.fromEntries(
      entries.map((entry, index) => [
        `${entry.assignment_id}::${entry.mode || "default"}::${entry.assignmentDay}::${index}`,
        entry,
      ])
    ),
  ])
);

export { getCurriculumEntriesForLevel };

export const getCurriculumEntriesByDayForLevel = (level) => {
  const entries = getCurriculumEntriesForLevel(level);
  return entries.reduce((acc, entry) => {
    const day = Number(entry.assignmentDay || 0);
    if (!day) return acc;
    if (!acc[day]) acc[day] = [];
    acc[day].push(entry);
    return acc;
  }, {});
};

const resolveAssignmentDisplayTitle = (entryParam = {}, { preferEnglish = true } = {}) => {
  const entry = entryParam || {};
  return String(entry.topic || (preferEnglish ? entry.en || entry.de : entry.de || entry.en) || "").trim();
};

const resolveAssignmentDisplayType = (entryParam = {}, { preferEnglish = false } = {}) => {
  const entry = entryParam || {};
  return String(entry.mode || (preferEnglish ? entry.en || entry.de : entry.de || entry.en) || entry.topic || "").trim();
};

export const getAssignmentDisplayTitle = (entry, options) => resolveAssignmentDisplayTitle(entry, options);
export const getAssignmentDisplayType = (entry, options) => resolveAssignmentDisplayType(entry, options);

export const getAssignmentDictionaryEntry = ({ level, assignmentId, chapter, mode, assignmentDay } = {}) => {
  const normalizedLevel = normalizeLevel(level);
  if (!normalizedLevel) return null;

  const canonicalId = toCanonicalAssignmentId({ level: normalizedLevel, assignmentId, chapter });
  const chapterToken = normalizeChapter(chapter);
  const modeToken = String(mode || "").trim();
  const dayToken = Number(assignmentDay || 0);

  const matches = (CURRICULUM_BY_LEVEL[normalizedLevel] || []).filter((entry) => {
    if (canonicalId && entry.assignment_id !== canonicalId) return false;
    if (!canonicalId && chapterToken && entry.chapter !== chapterToken) return false;
    if (modeToken && entry.mode !== modeToken) return false;
    if (dayToken && Number(entry.assignmentDay) !== dayToken) return false;
    return true;
  });

  const prioritized = matches.sort((a, b) => {
    if (a.assignment !== b.assignment) return a.assignment ? -1 : 1;
    return Number(a.assignmentDay || 0) - Number(b.assignmentDay || 0);
  });

  const entry = prioritized[0] || null;
  return entry
    ? {
        ...entry,
        assignment: entry.assignment === true,
        canonicalAssignmentId: entry.assignment_id,
      }
    : null;
};

export const getAssignmentSequenceForLevel = (level, { includePractical = true } = {}) => {
  const entries = getCurriculumEntriesForLevel(level)
    .filter((entry) => includePractical || entry.progressionEligible === true)
    .sort((a, b) => {
      const dayDiff = Number(a.assignmentDay || 0) - Number(b.assignmentDay || 0);
      if (dayDiff !== 0) return dayDiff;
      if (a.assignment !== b.assignment) return a.assignment ? -1 : 1;
      return String(a.chapter || "").localeCompare(String(b.chapter || ""), undefined, { numeric: true });
    });

  if (includePractical) return entries;

  const seen = new Set();
  return entries.filter((entry) => {
    if (seen.has(entry.assignment_id)) return false;
    seen.add(entry.assignment_id);
    return true;
  });
};

export const getValidProgressionIdentifiersForLevel = (level) =>
  new Set(getAssignmentSequenceForLevel(level, { includePractical: false }).map((entry) => entry.assignment_id));
