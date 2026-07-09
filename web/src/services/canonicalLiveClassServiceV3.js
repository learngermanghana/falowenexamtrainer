import { getLessonsByLevel } from "../data/lessonCatalog";
import * as base from "./canonicalLiveClassServiceV2";

export { normalizeCurriculumIds, findCanonicalClass } from "./canonicalLiveClassServiceV2";

const GHANA_TIMEZONE = "Africa/Accra";
const COURSE_LEVEL_PATTERN = /\b(A1|A2|B1|B2|C1|C2)\b/i;

function dateKey(value, timezone = GHANA_TIMEZONE) {
  const date = value instanceof Date ? value : new Date(value || 0);
  if (Number.isNaN(date.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function normalizeClassIdentity(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .toLowerCase()
    .replace(/\b(muenchen|munchen)\b/g, "munich")
    .replace(/\b(koeln|cologne)\b/g, "koln")
    .replace(/\b(klasse|class|course|cohort)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractCourseLevel(value) {
  return String(value || "").toUpperCase().match(COURSE_LEVEL_PATTERN)?.[1] || "";
}

function expectedClassLevel(klass = {}) {
  return (
    extractCourseLevel(klass.name) ||
    extractCourseLevel(klass.className) ||
    extractCourseLevel(klass.slug) ||
    extractCourseLevel(klass.levelId) ||
    extractCourseLevel(klass.level)
  );
}

function sessionCurriculumLevels(session = {}) {
  const curriculumIds = base.normalizeCurriculumIds(session);
  const candidates = [
    ...curriculumIds,
    session.levelId,
    session.level,
    session.courseLevel,
    session.assignment_id,
  ];

  return [...new Set(candidates.map(extractCourseLevel).filter(Boolean))];
}

function getTeachingCurriculum(level = "") {
  if (!level) return [];
  return getLessonsByLevel(level)
    .filter((lesson) => Number(lesson.day) > 0 && lesson.contentStatus !== "planned")
    .sort((left, right) => Number(left.sequence || 0) - Number(right.sequence || 0));
}

function resolveCanonicalLesson(session = {}, position = 0, curriculum = []) {
  if (!curriculum.length) return null;

  const curriculumIndex = Number(session.curriculumIndex);
  if (Number.isInteger(curriculumIndex) && curriculumIndex >= 0 && curriculum[curriculumIndex]) {
    return curriculum[curriculumIndex];
  }

  const sessionSequence = Number(session.sequence);
  if (Number.isInteger(sessionSequence) && sessionSequence > 0 && curriculum[sessionSequence - 1]) {
    return curriculum[sessionSequence - 1];
  }

  return curriculum[position] || null;
}

function hasAdminVisibleTopic(session = {}) {
  return Boolean(String(session.topic || session.title || "").trim());
}

function sanitizeCrossLevelSession(session = {}, expectedLevel = "", canonicalLesson = null) {
  if (!expectedLevel) return session;
  const sessionLevels = sessionCurriculumLevels(session);
  if (!sessionLevels.length || sessionLevels.includes(expectedLevel)) return session;

  const keepAdminTopic = hasAdminVisibleTopic(session);
  if (keepAdminTopic) {
    return {
      ...session,
      curriculumLevelMismatch: true,
      curriculumRepaired: false,
      adminTopicPreserved: true,
      hiddenCurriculumLevels: sessionLevels,
    };
  }

  const canonicalAssignmentId = String(canonicalLesson?.assignmentId || canonicalLesson?.id || "").trim();
  const canonicalTitle = String(canonicalLesson?.title || "").trim() || `${expectedLevel} live class`;
  const canonicalIds = canonicalAssignmentId ? [canonicalAssignmentId] : [];

  return {
    ...session,
    topic: canonicalTitle,
    title: canonicalTitle,
    assignmentIds: canonicalIds,
    chapterIds: canonicalIds,
    curriculumIds: canonicalIds,
    assignment_id: canonicalAssignmentId || null,
    curriculumLevelMismatch: true,
    curriculumRepaired: Boolean(canonicalLesson),
    curriculumSource: canonicalLesson ? "canonical lesson catalog" : session.curriculumSource,
    hiddenCurriculumLevels: sessionLevels,
    adminTopicPreserved: false,
  };
}

function sessionBelongsToCanonicalClass(session = {}, klass = {}) {
  const canonicalIds = new Set([klass.id, klass.classId]
    .map((value) => String(value || "").trim())
    .filter(Boolean));
  const sessionIds = [session.classId, session.classRecordId]
    .map((value) => String(value || "").trim())
    .filter(Boolean);

  if (sessionIds.length) {
    return sessionIds.some((value) => canonicalIds.has(value));
  }

  const sessionName = normalizeClassIdentity(session.className);
  if (!sessionName) return true;
  const canonicalNames = new Set([klass.name, klass.className]
    .map(normalizeClassIdentity)
    .filter(Boolean));
  return canonicalNames.has(sessionName);
}

function scopeSummaryToCanonicalClass(summary, now = new Date()) {
  if (!summary?.klass) return summary;

  const expectedLevel = expectedClassLevel(summary.klass);
  const normalizedKlass = expectedLevel
    ? { ...summary.klass, levelId: expectedLevel, level: expectedLevel }
    : summary.klass;
  const curriculum = getTeachingCurriculum(expectedLevel);
  let curriculumMismatchCount = 0;
  let curriculumRepairCount = 0;

  const scopedSessions = (summary.sessions || [])
    .filter((session) => sessionBelongsToCanonicalClass(session, summary.klass))
    .map((session, position) => {
      const canonicalLesson = resolveCanonicalLesson(session, position, curriculum);
      const sanitized = sanitizeCrossLevelSession(session, expectedLevel, canonicalLesson);
      if (sanitized.curriculumLevelMismatch) curriculumMismatchCount += 1;
      if (sanitized.curriculumRepaired) curriculumRepairCount += 1;
      return sanitized;
    });

  const rebuilt = base.buildCanonicalLiveClassSummary({
    klass: normalizedKlass,
    sessions: scopedSessions,
    zoomProfile: summary.zoom,
    now,
  });

  return {
    ...rebuilt,
    curriculumMismatchCount,
    curriculumRepairCount,
  };
}

function hideOldCompletedCard(summary, now = new Date()) {
  const completed = summary?.latestCompletedSession;
  if (!completed) return summary;
  return dateKey(completed.startsAt) === dateKey(now)
    ? summary
    : { ...summary, latestCompletedSession: null };
}

export function buildCanonicalLiveClassSummary(options = {}) {
  const now = options.now || new Date();
  const summary = base.buildCanonicalLiveClassSummary(options);
  return hideOldCompletedCard(scopeSummaryToCanonicalClass(summary, now), now);
}

export function subscribeCanonicalLiveClass(options = {}) {
  const { onChange } = options;
  return base.subscribeCanonicalLiveClass({
    ...options,
    onChange: (summary) => {
      const now = new Date();
      onChange?.(hideOldCompletedCard(scopeSummaryToCanonicalClass(summary, now), now));
    },
  });
}
