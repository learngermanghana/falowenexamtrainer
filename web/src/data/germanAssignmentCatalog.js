import {
  CURRICULUM_ENTRIES,
  CURRICULUM_BY_LEVEL,
  getCurriculumEntriesForLevel,
  normalizeLevel,
} from "./curriculumManifest";

const A1_DAY_5_TITLE = "Personal Information, Articles, Adjectives and W-Questions";
const a1Day5Entry = (CURRICULUM_BY_LEVEL.A1 || []).find(
  (entry) => Number(entry.assignmentDay) === 5 && ["1.2", "1.3"].includes(String(entry.chapter))
);

if (a1Day5Entry) {
  a1Day5Entry.topic = A1_DAY_5_TITLE;
  a1Day5Entry.title = A1_DAY_5_TITLE;
}

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

const collapseRepeatedTitleParts = (value) => {
  const text = String(value || "").trim();
  if (!text) return "";

  const seen = new Set();
  return text
    .split(/\s*\+\s*/)
    .map((part) => part.trim())
    .filter((part) => {
      const key = part.toLowerCase().replace(/\s+/g, " ");
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .join(" + ");
};

const buildLookupEntriesForLevel = (level) => {
  const normalizedLevel = normalizeLevel(level);
  const entries = CURRICULUM_BY_LEVEL[normalizedLevel] || [];

  return entries.flatMap((entry, entryIndex) => {
    const resources = Array.isArray(entry.resources) ? entry.resources : [];
    const nestedResources = resources.map((resource, resourceIndex) => {
      const submissionRequired = Boolean(resource.submissionRequired ?? resource.assignment ?? false);
      const resourceAssignmentId = String(resource.assignmentId || resource.assignment_id || "")
        .trim()
        .toUpperCase();
      const resourceTitle = collapseRepeatedTitleParts(
        resource.topic || resource.title || entry.topic || entry.title
      );

      return {
        ...entry,
        ...resource,
        level: normalizedLevel,
        day: Number(entry.day ?? entry.assignmentDay),
        assignmentDay: Number(entry.assignmentDay ?? entry.day),
        chapter: String(resource.chapter || entry.chapter || "").trim(),
        topic: resourceTitle,
        title: resourceTitle,
        mode: resource.mode || resource.kind || entry.mode,
        type: resource.type || resource.kind || entry.type,
        assignment: submissionRequired,
        submissionRequired,
        progressionEligible: submissionRequired ? entry.progressionEligible !== false : false,
        assignmentId: resourceAssignmentId,
        assignment_id: resourceAssignmentId,
        canonicalAssignmentId: resourceAssignmentId,
        parentAssignmentId: entry.assignment_id,
        __lookupOrder: entryIndex * 100 + resourceIndex,
        __isNestedResource: true,
      };
    });

    return [
      ...nestedResources,
      {
        ...entry,
        topic: collapseRepeatedTitleParts(entry.topic || entry.title),
        title: collapseRepeatedTitleParts(entry.title || entry.topic),
        __lookupOrder: entryIndex * 100 + 99,
        __isNestedResource: false,
      },
    ];
  });
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
  return collapseRepeatedTitleParts(
    entry.topic || (preferEnglish ? entry.en || entry.de : entry.de || entry.en) || ""
  );
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

  const matches = buildLookupEntriesForLevel(normalizedLevel).filter((entry) => {
    const entryAssignmentId = String(entry.assignment_id || entry.assignmentId || "").trim().toUpperCase();
    const entryChapter = normalizeChapter(entry.chapter);

    if (canonicalId && entryAssignmentId !== canonicalId) return false;
    if (!canonicalId && chapterToken && entryChapter !== chapterToken) return false;
    if (modeToken && entry.mode !== modeToken) return false;
    if (dayToken && Number(entry.assignmentDay) !== dayToken) return false;
    return true;
  });

  const prioritized = matches.sort((a, b) => {
    if (a.__isNestedResource !== b.__isNestedResource) return a.__isNestedResource ? -1 : 1;
    if (a.assignment !== b.assignment) return a.assignment ? -1 : 1;
    return Number(a.__lookupOrder || 0) - Number(b.__lookupOrder || 0);
  });

  const entry = prioritized[0] || null;
  return entry
    ? {
        ...entry,
        topic: collapseRepeatedTitleParts(entry.topic || entry.title),
        title: collapseRepeatedTitleParts(entry.title || entry.topic),
        assignment: entry.assignment === true,
        canonicalAssignmentId: entry.assignment_id || "",
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
