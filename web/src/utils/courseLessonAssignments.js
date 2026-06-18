import { getCurriculumEntriesForLevel } from "../data/germanAssignmentCatalog";
import { resolveAssignmentCanonicalKey } from "./assignmentIdentity";

const INLINE_SUBMISSION_LEVELS = new Set(["A1", "A2", "B1"]);

export const normalizeCourseAssignmentKey = (value) =>
  String(value || "")
    .trim()
    .toUpperCase()
    .replace(/_/g, "-")
    .replace(/\s+/g, "");

export const buildInlineCourseAssignments = ({
  level,
  day,
  entries = [],
  resolveCanonicalKey = resolveAssignmentCanonicalKey,
} = {}) => {
  const normalizedLevel = String(level || "").trim().toUpperCase();
  const numericDay = Number(day);
  if (!INLINE_SUBMISSION_LEVELS.has(normalizedLevel) || !Number.isFinite(numericDay) || numericDay <= 0) {
    return [];
  }

  const seenKeys = new Set();
  return (Array.isArray(entries) ? entries : []).reduce((assignments, entry, index) => {
    if (!entry?.assignment || entry?.progressionEligible === false || Number(entry?.assignmentDay) !== numericDay) {
      return assignments;
    }

    const title = String(entry?.topic || entry?.title || `Day ${numericDay} assignment`).trim();
    const assignmentId = entry?.assignment_id || entry?.assignmentId || entry?.assignmentKey || "";
    const assignmentKey = resolveCanonicalKey({
      level: normalizedLevel,
      assignmentId,
      assignmentTitle: title,
    });
    const normalizedKey = normalizeCourseAssignmentKey(assignmentKey);

    if (!normalizedKey || seenKeys.has(normalizedKey)) return assignments;
    seenKeys.add(normalizedKey);

    const chapter = String(entry?.chapter || "").trim();
    assignments.push({
      assignmentKey,
      chapter,
      day: numericDay,
      level: normalizedLevel,
      title,
      label: chapter ? `Chapter ${chapter}: ${title}` : title || `Assignment ${index + 1}`,
    });
    return assignments;
  }, []);
};

export const getInlineCourseAssignments = (level, day) =>
  buildInlineCourseAssignments({
    level,
    day,
    entries: getCurriculumEntriesForLevel(level) || [],
  });
