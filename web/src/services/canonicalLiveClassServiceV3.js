import { getLessonsByLevel } from "../data/lessonCatalog";
import * as base from "./canonicalLiveClassServiceV2";

export { normalizeCurriculumIds, findCanonicalClass } from "./canonicalLiveClassServiceV2";

const GHANA_TIMEZONE = "Africa/Accra";
const COURSE_LEVEL_PATTERN = /\b(A1|A2|B1|B2|C1|C2)\b/i;
const OFFICIAL_CURRICULUM_SOURCE = "coursedictionarydaygroups";
const SUPERSEDED_STATUSES = new Set(["superseded", "deleted"]);

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

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function toMillis(value) {
  if (!value) return 0;
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (typeof value?.toDate === "function") return value.toDate().getTime();
  if (typeof value?.seconds === "number") return value.seconds * 1000;
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
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

function isSupersededSession(session = {}) {
  const status = normalize(session.status || session.sessionStatus);
  return SUPERSEDED_STATUSES.has(status)
    || session.superseded === true
    || session.isSuperseded === true
    || Boolean(String(session.supersededBySessionId || "").trim());
}

function officialCurriculumIndex(session = {}) {
  const index = Number(session.curriculumIndex);
  return Number.isInteger(index) && index >= 0 ? index : null;
}

function isOfficialRepairSession(session = {}) {
  return normalize(session.curriculumSource).replace(/[^a-z0-9]+/g, "") === OFFICIAL_CURRICULUM_SOURCE
    && Number(session.curriculumVersion || 0) >= 2
    && officialCurriculumIndex(session) !== null;
}

function expectedOfficialSessionCount(klass = {}) {
  const candidates = [
    klass.generatedSessionCount,
    klass.curriculumMappedSessionCount,
    klass.officialSessionCount,
  ];
  return candidates
    .map(Number)
    .find((value) => Number.isInteger(value) && value > 0) || 0;
}

function repairIsComplete(klass = {}) {
  return normalize(klass.sessionRepairStatus) === "complete"
    || normalize(klass.lastSessionChangeType) === "official-schedule-repair";
}

function repairSessionPreference(session = {}, klass = {}) {
  const canonicalId = String(klass.id || "").trim();
  let score = 0;
  if (!isSupersededSession(session)) score += 1000;
  if (String(session.classId || "").trim() === canonicalId) score += 100;
  if (String(session.classRecordId || "").trim() === canonicalId) score += 100;
  if (normalize(session.rescheduleReason).includes("official") && normalize(session.rescheduleReason).includes("timetable repaired")) score += 80;
  if (session.manualDateOverride === true) score += 40;
  if (/^day\s+\d+\s*:/i.test(String(session.topic || session.title || "").trim())) score += 20;
  score += Math.min(10, Number(session.curriculumVersion || 0));
  return score;
}

function choosePreferredRepairSession(current, candidate, klass = {}) {
  if (!current) return candidate;
  const scoreDifference = repairSessionPreference(candidate, klass) - repairSessionPreference(current, klass);
  if (scoreDifference !== 0) return scoreDifference > 0 ? candidate : current;

  const candidateUpdated = Math.max(
    toMillis(candidate.updatedAt),
    toMillis(candidate.rescheduledAt),
    toMillis(candidate.manualDateOverrideAt),
  );
  const currentUpdated = Math.max(
    toMillis(current.updatedAt),
    toMillis(current.rescheduledAt),
    toMillis(current.manualDateOverrideAt),
  );
  if (candidateUpdated !== currentUpdated) return candidateUpdated > currentUpdated ? candidate : current;

  return String(candidate.id || "").localeCompare(String(current.id || "")) > 0 ? candidate : current;
}

function selectAuthoritativeOfficialSessions(klass = {}, sessions = []) {
  const classScoped = sessions.filter((session) => sessionBelongsToCanonicalClass(session, klass));
  const activeSessions = classScoped.filter((session) => !isSupersededSession(session));
  const officialCandidates = activeSessions.filter(isOfficialRepairSession);
  const byCurriculumIndex = new Map();

  officialCandidates.forEach((session) => {
    const index = officialCurriculumIndex(session);
    byCurriculumIndex.set(index, choosePreferredRepairSession(byCurriculumIndex.get(index), session, klass));
  });

  const expectedCount = expectedOfficialSessionCount(klass);
  const authoritative = [...byCurriculumIndex.values()]
    .filter((session) => !expectedCount || officialCurriculumIndex(session) < expectedCount)
    .sort((left, right) => officialCurriculumIndex(left) - officialCurriculumIndex(right));
  const hasFullCoverage = expectedCount > 0
    && Array.from({ length: expectedCount }, (_, index) => byCurriculumIndex.has(index)).every(Boolean);
  const shouldUseAuthoritative = authoritative.length > 0 && (repairIsComplete(klass) || hasFullCoverage);
  const selected = shouldUseAuthoritative ? authoritative : activeSessions;

  return {
    sessions: selected,
    authoritativeSchedule: shouldUseAuthoritative,
    hiddenLegacySessionCount: Math.max(0, classScoped.length - selected.length),
    expectedOfficialSessionCount: expectedCount,
  };
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
  const selection = selectAuthoritativeOfficialSessions(options.klass || {}, options.sessions || []);
  const summary = base.buildCanonicalLiveClassSummary({
    ...options,
    sessions: selection.sessions,
  });
  const scoped = scopeSummaryToCanonicalClass(summary, now);
  return hideOldCompletedCard({
    ...scoped,
    authoritativeSchedule: selection.authoritativeSchedule,
    hiddenLegacySessionCount: selection.hiddenLegacySessionCount,
    expectedOfficialSessionCount: selection.expectedOfficialSessionCount,
  }, now);
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
