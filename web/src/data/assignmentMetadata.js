import { CURRICULUM_BY_LEVEL } from "./curriculumManifest";

const LEVEL_PREFIX = /^(A1|A2|B1|B2|C1|C2)-/i;

const normalizeLevel = (level = "") => String(level || "").trim().toUpperCase();

const toCanonicalId = ({ level, value }) => {
  const token = String(value || "").trim().toUpperCase();
  if (!token) return "";
  if (LEVEL_PREFIX.test(token)) return token;
  return level ? `${level}-${token}` : token;
};

export const buildAssignmentMetadataByLevel = (manifestByLevel = CURRICULUM_BY_LEVEL) => {
  const byLevel = {};

  Object.entries(manifestByLevel || {}).forEach(([rawLevel, entries]) => {
    const level = normalizeLevel(rawLevel);
    if (!level) return;

    const lookup = {};
    (entries || []).forEach((entry) => {
      const canonical = toCanonicalId({ level, value: entry.assignment_id || entry.canonicalAssignmentId || entry.chapter });
      if (!canonical) return;

      lookup[canonical] = {
        assignment: Boolean(entry.assignment),
        progressionEligible: Boolean(entry.progressionEligible),
        assignmentDay: Number(entry.assignmentDay || 0) || null,
        chapter: String(entry.chapter || "").trim(),
        topic: String(entry.topic || entry.title || "").trim(),
        goal: String(entry.goal || "").trim(),
        mode: String(entry.mode || entry.type || "").trim(),
      };
    });

    byLevel[level] = lookup;
  });

  return byLevel;
};

export const ASSIGNMENT_METADATA_BY_LEVEL = buildAssignmentMetadataByLevel();

export const getCourseScheduleAssignmentMetadata = ({ level, assignmentId, chapter }) => {
  const normalizedLevel = normalizeLevel(level);
  const levelLookup = ASSIGNMENT_METADATA_BY_LEVEL[normalizedLevel];
  if (!levelLookup) return null;

  const canonicalId = toCanonicalId({ level: normalizedLevel, value: assignmentId });
  if (canonicalId && levelLookup[canonicalId]) return levelLookup[canonicalId];

  const chapterKey = toCanonicalId({ level: normalizedLevel, value: chapter });
  if (chapterKey && levelLookup[chapterKey]) return levelLookup[chapterKey];

  return null;
};
