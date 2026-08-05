import {
  CURRICULUM_ENTRIES,
  CURRICULUM_BY_LEVEL,
  getCurriculumEntriesForLevel,
  normalizeLevel,
} from "./curriculumManifest.js";
import { applyAssignmentCatalogCurriculumCorrections } from "./courseBookCurriculumCorrections.js";

applyAssignmentCatalogCurriculumCorrections(CURRICULUM_BY_LEVEL.A1 || []);

const normalizeChapter = (value) => {
  const token = String(value || "").trim();
  if (!token) return "";
  if (/^\d+(?:\.\d+)?$/.test(token)) return token;

  const levelPrefixed = token.match(/\b(?:A1|A2|B1|B2|C1|C2)\s*[- ]\s*(\d+(?:\.\d+)?)\b/i);
  if (levelPrefixed?.[1]) return levelPrefixed[1];

  const chapterLabeled = token.match(/\b(?:chapter|kapitel|lektion|lesson|aufgabe)\s*(\d+(?:\.\d+)?)\b/i);
  if (chapterLabeled?.[1]) return chapterLabeled[1];

  const decimalToken = token.match(/\b(\d+\.\d+)\b/);
  if (decimalToken?.[1]) return decimalToken[1];

  return "";
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

const A1_MULTI_CHAPTER_CHILD_IDS = new Set(["A1-9", "A1-10", "A1-12.1", "A1-12.2"]);

const isLevelPrefixedChildLookupWithoutDay = ({ level, assignmentId, chapter, assignmentDay }) => {
  const normalizedLevel = normalizeLevel(level);
  if (normalizedLevel !== "A1") return false;
  if (assignmentDay) return false;

  const explicitAssignmentId = String(assignmentId || "").trim().toUpperCase();
  const chapterToken = normalizeChapter(chapter);
  if (!A1_MULTI_CHAPTER_CHILD_IDS.has(explicitAssignmentId)) return false;

  return explicitAssignmentId === `A1-${chapterToken}`;
};

export const getAssignmentDictionaryEntry = ({ level, assignmentId, chapter, mode, assignmentDay } = {}) => {
  const normalizedLevel = normalizeLevel(level);
  if (!normalizedLevel) return null;

  if (isLevelPrefixedChildLookupWithoutDay({ level: normalizedLevel, assignmentId, chapter, assignmentDay })) {
    return null;
  }

  const entries = CURRICULUM_BY_LEVEL[normalizedLevel] || [];
  const explicitAssignmentId = String(assignmentId || "").trim().toUpperCase();
  const exactAssignmentMatches = explicitAssignmentId
    ? entries.filter(
        (entry) =>
          String(entry.assignment_id || entry.assignmentId || "").trim().toUpperCase() ===
          explicitAssignmentId
      )
    : [];
  const canonicalId = toCanonicalAssignmentId({ level: normalizedLevel, assignmentId, chapter });
  const chapterToken = normalizeChapter(chapter);
  const modeToken = String(mode || "").trim();
  const dayToken = Number(assignmentDay || 0);

  const sourceEntries = exactAssignmentMatches.length ? exactAssignmentMatches : entries;
  const matches = sourceEntries.filter((entry) => {
    if (!exactAssignmentMatches.length && canonicalId && entry.assignment_id !== canonicalId) return false;
    if (!exactAssignmentMatches.length && !canonicalId && chapterToken && entry.chapter !== chapterToken) return false;
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
