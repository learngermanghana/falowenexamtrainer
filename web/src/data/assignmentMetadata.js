import { courseSchedules } from "./courseSchedule";

const LEVEL_PREFIX = /^(A1|A2|B1|B2|C1|C2)-/i;

const normalizeLevel = (level = "") => String(level || "").trim().toUpperCase();

const toCanonicalId = ({ level, value }) => {
  const token = String(value || "").trim().toUpperCase();
  if (!token) return "";
  if (LEVEL_PREFIX.test(token)) return token;
  return level ? `${level}-${token}` : token;
};

const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

const collectAssignmentBlocks = (lesson = {}) => {
  const blocks = [];

  if (lesson.assignment === true && (lesson.assignmentId || lesson.chapter)) {
    blocks.push({
      assignmentId: lesson.assignmentId,
      chapter: lesson.chapter,
    });
  }

  for (const nested of [...toArray(lesson.lesen_hören), ...toArray(lesson.schreiben_sprechen)]) {
    if (nested?.assignment === true && (nested.assignmentId || nested.chapter)) {
      blocks.push({
        assignmentId: nested.assignmentId,
        chapter: nested.chapter,
      });
    }
  }

  return blocks;
};

export const buildAssignmentMetadataByLevel = (schedules = courseSchedules) => {
  const byLevel = {};

  Object.entries(schedules || {}).forEach(([rawLevel, lessons]) => {
    const level = normalizeLevel(rawLevel);
    if (!level) return;

    const lookup = {};
    (lessons || []).forEach((lesson) => {
      const dayNumber = Number(lesson.day || lesson.dayNumber || 0) || null;
      const topic = String(lesson.topic || lesson.title || "").trim();

      collectAssignmentBlocks(lesson).forEach((block) => {
        const chapter = String(block.chapter || "").trim();
        const canonical = toCanonicalId({ level, value: block.assignmentId || chapter });
        if (!canonical) return;

        lookup[canonical] = {
          assignment: true,
          assignmentDay: dayNumber,
          chapter,
          topic,
        };
      });
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
