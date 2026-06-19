import {
  CURRICULUM_ENTRIES as RAW_ENTRIES,
  normalizeLevel,
} from "./curriculumManifest";
import { resolveInAppWorkbookRoute } from "./inAppWorkbookRoutes";

const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);
const chapterToken = (value = "") => {
  const text = String(value || "").trim();
  if (/^\d+(?:\.\d+)?$/.test(text)) return text;
  return text.match(/\b(\d+(?:\.\d+)?)\b/)?.[1] || "";
};
const canonicalId = (level, assignmentId, chapter) => {
  const normalizedLevel = normalizeLevel(level);
  const explicit = String(assignmentId || "").trim().toUpperCase();
  if (/^(A1|A2|B1|B2|C1|C2)-\d+(?:\.\d+)?$/.test(explicit)) return explicit;
  const chapterValue = chapterToken(chapter || assignmentId);
  return normalizedLevel && chapterValue ? `${normalizedLevel}-${chapterValue}` : "";
};
const normalizeMode = (value = "") => {
  const mode = String(value || "").trim();
  if (["lesen_hören", "lesen_hoeren"].includes(mode)) return "Lesen & Hören";
  if (mode === "schreiben_sprechen") return "Schreiben & Sprechen";
  return mode;
};
const sanitizeTitle = (value = "") => {
  const seen = new Set();
  return String(value || "")
    .split(/\s*\+\s*/)
    .map((part) => part.trim())
    .filter((part) => {
      const key = part.toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .join(" + ");
};

const sanitizeResource = (resource = {}, parent = {}) => {
  const level = normalizeLevel(parent.level);
  const day = Number(parent.assignmentDay ?? parent.day ?? 0);
  const chapter = resource.chapter || parent.chapter;
  const route = resolveInAppWorkbookRoute({
    level,
    day,
    chapter,
    fallback: resource.workbookRoute || resource.workbook_link,
  });
  return {
    ...resource,
    chapter,
    title: sanitizeTitle(resource.title || parent.title),
    ...(route ? { workbookRoute: route, workbook_link: route } : {}),
  };
};

const sanitizeEntry = (entry = {}) => {
  const level = normalizeLevel(entry.level);
  const day = Number(entry.assignmentDay ?? entry.day ?? 0);
  const route = resolveInAppWorkbookRoute({
    level,
    day,
    chapter: entry.chapter,
    fallback: entry.workbookRoute || entry.workbook_link,
  });
  const resources = toArray(entry.resources).map((resource) => sanitizeResource(resource, entry));
  return {
    ...entry,
    level,
    day,
    assignmentDay: day,
    title: sanitizeTitle(entry.title || entry.topic),
    topic: sanitizeTitle(entry.topic || entry.title),
    ...(route ? { workbookRoute: route, workbook_link: route } : {}),
    ...(resources.length ? { resources } : {}),
  };
};

export const CURRICULUM_ENTRIES = RAW_ENTRIES.map(sanitizeEntry);

const PARENTS_BY_LEVEL = CURRICULUM_ENTRIES.reduce((result, entry) => {
  if (!result[entry.level]) result[entry.level] = [];
  result[entry.level].push(entry);
  return result;
}, {});

const flattenEntry = (entry) => {
  const resources = toArray(entry.resources);
  const children = resources.map((resource, index) => {
    const assignment = Boolean(resource.submissionRequired ?? resource.assignment);
    const lookupId = canonicalId(entry.level, resource.assignmentId || resource.assignment_id, resource.chapter);
    return {
      ...entry,
      ...sanitizeResource(resource, entry),
      mode: normalizeMode(resource.mode || resource.kind || entry.mode),
      type: normalizeMode(resource.type || resource.kind || entry.type),
      assignment,
      submissionRequired: assignment,
      progressionEligible: assignment && entry.progressionEligible !== false,
      assignmentId: lookupId,
      assignment_id: lookupId,
      canonicalAssignmentId: assignment ? lookupId : "",
      __child: true,
      __order: index,
    };
  });
  return [...children, { ...entry, __child: false, __order: 999 }];
};

const flattenedForLevel = (level) =>
  (PARENTS_BY_LEVEL[normalizeLevel(level)] || []).flatMap(flattenEntry);

const a1Day5 = (PARENTS_BY_LEVEL.A1 || []).find((entry) => Number(entry.day) === 5);
if (a1Day5) {
  a1Day5.title = "Personal Information, Articles, Adjectives and W-Questions";
  a1Day5.topic = a1Day5.title;
}

export const GERMAN_ASSIGNMENT_COURSE_DICTIONARY = Object.fromEntries(
  Object.keys(PARENTS_BY_LEVEL).map((level) => [
    level,
    Object.fromEntries(
      flattenedForLevel(level).map((entry, index) => [
        `${entry.assignment_id || entry.chapter}::${entry.mode || "default"}::${entry.day}::${index}`,
        entry,
      ])
    ),
  ])
);

export const getCurriculumEntriesForLevel = (level) => [
  ...(PARENTS_BY_LEVEL[normalizeLevel(level)] || []),
];

export const getCurriculumEntriesByDayForLevel = (level) =>
  getCurriculumEntriesForLevel(level).reduce((result, entry) => {
    if (!result[entry.day]) result[entry.day] = [];
    result[entry.day].push(entry);
    return result;
  }, {});

export const getAssignmentDisplayTitle = (entry = {}, { preferEnglish = true } = {}) =>
  sanitizeTitle(entry.topic || (preferEnglish ? entry.en || entry.de : entry.de || entry.en));

export const getAssignmentDisplayType = (entry = {}, { preferEnglish = false } = {}) =>
  normalizeMode(entry.mode || (preferEnglish ? entry.en || entry.de : entry.de || entry.en) || entry.topic);

export const getAssignmentDictionaryEntry = ({ level, assignmentId, chapter, mode, assignmentDay } = {}) => {
  const normalizedLevel = normalizeLevel(level);
  const wantedId = canonicalId(normalizedLevel, assignmentId, chapter);
  const wantedChapter = chapterToken(chapter);
  const wantedMode = normalizeMode(mode).toLowerCase();
  const wantedDay = Number(assignmentDay || 0);
  const matches = flattenedForLevel(normalizedLevel).filter((entry) => {
    if (wantedId && entry.assignment_id !== wantedId) return false;
    if (!wantedId && wantedChapter && chapterToken(entry.chapter) !== wantedChapter) return false;
    if (wantedMode && normalizeMode(entry.mode).toLowerCase() !== wantedMode) return false;
    if (wantedDay && Number(entry.day) !== wantedDay) return false;
    return true;
  });
  matches.sort((left, right) => {
    if (left.__child !== right.__child) return left.__child ? -1 : 1;
    if (left.assignment !== right.assignment) return left.assignment ? -1 : 1;
    return left.__order - right.__order;
  });
  return matches[0] || null;
};

export const getAssignmentSequenceForLevel = (level, { includePractical = true } = {}) => {
  const entries = includePractical
    ? getCurriculumEntriesForLevel(level)
    : flattenedForLevel(level).filter((entry) => entry.assignment && entry.progressionEligible);
  const seen = new Set();
  return entries
    .sort((left, right) => Number(left.day) - Number(right.day))
    .filter((entry) => {
      if (includePractical) return true;
      if (!entry.assignment_id || seen.has(entry.assignment_id)) return false;
      seen.add(entry.assignment_id);
      return true;
    });
};

export const getValidProgressionIdentifiersForLevel = (level) =>
  new Set(getAssignmentSequenceForLevel(level, { includePractical: false }).map((entry) => entry.assignment_id));
