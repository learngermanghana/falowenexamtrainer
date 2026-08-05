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
  return chapterFromId ? `${normalizedLevel}-${chapterFromId}` : "";
};

const buildAssignmentDictionary = () => {
  const dictionary = {};

  CURRICULUM_ENTRIES.forEach((entry) => {
    const level = normalizeLevel(entry.level);
    const canonicalId = toCanonicalAssignmentId({
      level,
      assignmentId: entry.assignmentId || entry.id,
      chapter: entry.chapter,
    });
    if (!canonicalId) return;

    dictionary[canonicalId] = {
      ...entry,
      assignmentId: canonicalId,
      level,
      chapter: normalizeChapter(entry.chapter),
    };
  });

  return Object.freeze(dictionary);
};

export const GERMAN_ASSIGNMENT_DICTIONARY = buildAssignmentDictionary();

export const getAssignmentDictionaryEntry = ({ level, assignmentId, chapter } = {}) => {
  const canonicalId = toCanonicalAssignmentId({ level, assignmentId, chapter });
  return canonicalId ? GERMAN_ASSIGNMENT_DICTIONARY[canonicalId] || null : null;
};

export const getGermanAssignmentsForLevel = (level) =>
  getCurriculumEntriesForLevel(level).map((entry) => {
    const canonicalId = toCanonicalAssignmentId({
      level: entry.level,
      assignmentId: entry.assignmentId || entry.id,
      chapter: entry.chapter,
    });
    return canonicalId ? GERMAN_ASSIGNMENT_DICTIONARY[canonicalId] || entry : entry;
  });

export default GERMAN_ASSIGNMENT_DICTIONARY;
