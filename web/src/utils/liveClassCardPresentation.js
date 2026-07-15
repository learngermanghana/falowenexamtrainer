export const GHANA_TIMEZONE = "Africa/Accra";

const CACHE_PREFIX = "falowen:live-class-summary:v1:";
const CACHE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const INACTIVE_STATUSES = new Set(["cancelled", "superseded", "deleted"]);

export const asLiveClassDate = (value) => {
  if (!value) return null;
  if (typeof value?.toDate === "function") return value.toDate();
  if (typeof value?.seconds === "number") return new Date(value.seconds * 1000);
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const liveClassCurriculumIds = (session = {}) => {
  const candidates = [session.assignmentIds, session.chapterIds, session.curriculumIds];
  const values = candidates.find((candidate) => Array.isArray(candidate) && candidate.length)
    || (session.assignment_id ? [session.assignment_id] : []);
  return [...new Set(values.map((value) => String(value || "").trim().toUpperCase()).filter(Boolean))];
};

export const liveClassAssignmentLabel = (session = {}) => liveClassCurriculumIds(session).join(", ");

export const liveClassTopic = (session = {}, fallback = "Live class") =>
  String(session.topic || session.title || liveClassAssignmentLabel(session) || fallback).replace(/\s+/g, " ").trim();

export const liveClassLessonNumber = (session = {}) => {
  const topic = liveClassTopic(session, "");
  const explicit = topic.match(/\b(?:day|lesson|session)\s*(\d+)\b/i)?.[1];
  if (explicit !== undefined) return Number(explicit);

  const assignment = liveClassCurriculumIds(session)[0] || "";
  const assignmentNumber = assignment.match(/(?:^|[.-])(\d+)(?:[A-Z])?$/i)?.[1];
  if (assignmentNumber !== undefined) return Number(assignmentNumber);

  const curriculumIndex = Number(session.curriculumIndex);
  if (Number.isInteger(curriculumIndex) && curriculumIndex >= 0) return curriculumIndex + 1;
  return null;
};

export const liveClassLessonLabel = (session = {}, level = "") => {
  const topic = liveClassTopic(session, "");
  const prefix = topic.match(/\b(day|lesson|session)\s*(\d+)\b/i);
  if (prefix) {
    const noun = prefix[1].toLowerCase() === "day" ? "Day" : "Lesson";
    return `${noun} ${prefix[2]}`;
  }

  const number = liveClassLessonNumber(session);
  if (number === null) return level || "Live class";
  return String(level || "").toUpperCase() === "A1" && number === 0 ? "Day 0" : `Lesson ${number}`;
};

export const liveClassCleanTitle = (session = {}) => {
  const topic = liveClassTopic(session);
  return topic
    .replace(/^\s*(?:day|lesson|session)\s*\d+\s*[:·—-]?\s*/i, "")
    .trim() || topic;
};

export const liveClassLevel = (summary = {}, session = {}) => {
  const source = [
    summary?.klass?.levelId,
    summary?.klass?.level,
    summary?.klass?.name,
    session.levelId,
    session.level,
    liveClassCurriculumIds(session).join(" "),
  ].join(" ").toUpperCase();
  return source.match(/\b(A1|A2|B1|B2|C1|C2)\b/)?.[1] || "";
};

export const liveClassLessonLink = (summary = {}, session = {}) => {
  const level = liveClassLevel(summary, session);
  const lessonNumber = liveClassLessonNumber(session);
  if (!level || lessonNumber === null || lessonNumber < 0) return "/campus/course";

  const params = new URLSearchParams();
  const assignment = liveClassCurriculumIds(session)[0];
  if (assignment) params.set("chapter", assignment.replace(new RegExp(`^${level}-`, "i"), ""));
  const query = params.toString();
  return `/campus/course/lesson/${level}/${lessonNumber}${query ? `?${query}` : ""}`;
};

export const liveClassSessionStatus = (session = {}, now = new Date()) => {
  const stored = String(session.status || session.sessionStatus || "scheduled").trim().toLowerCase();
  if (stored === "cancelled") return "Cancelled";
  if (stored === "completed") return "Completed";
  const start = asLiveClassDate(session.startsAt)?.getTime() || 0;
  const end = asLiveClassDate(session.endsAt)?.getTime() || 0;
  const current = now.getTime();
  if (stored === "live" || (start && current >= start && (!end || current <= end))) return "Live now";
  if (end && end < current) return "Completed";
  if (start) {
    const ghanaDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: GHANA_TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    if (ghanaDate.format(new Date(start)) === ghanaDate.format(now)) return "Today";
  }
  return "Upcoming";
};

export const canJoinLiveClass = (session = {}, now = new Date()) => {
  const start = asLiveClassDate(session.startsAt)?.getTime();
  const end = asLiveClassDate(session.endsAt)?.getTime();
  if (!start) return false;
  const current = now.getTime();
  return current >= start - 15 * 60 * 1000 && current <= (end || start + 2 * 60 * 60 * 1000) + 15 * 60 * 1000;
};

export const liveClassJoinOpensAt = (session = {}, locale = "en") => {
  const start = asLiveClassDate(session.startsAt);
  if (!start) return "Join unavailable";
  const openAt = new Date(start.getTime() - 15 * 60 * 1000);
  const time = new Intl.DateTimeFormat(locale, {
    timeZone: GHANA_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(openAt);
  return `Join opens at ${time}`;
};

export const isRescheduledLiveClass = (session = {}) => {
  const current = asLiveClassDate(session.startsAt)?.getTime();
  const previous = asLiveClassDate(session.previousStartsAt || session.originalStartsAt)?.getTime();
  return Boolean(session.rescheduleReason || session.rescheduledAt || (current && previous && current !== previous));
};

export const upcomingLiveClassSessions = (summary = {}, selectedSession = null, now = new Date(), limit = 2) => {
  const selectedStart = asLiveClassDate(selectedSession?.startsAt)?.getTime() || now.getTime() - 1;
  return [...(summary.sessions || [])]
    .filter((session) => {
      const status = String(session.status || session.sessionStatus || "scheduled").trim().toLowerCase();
      if (INACTIVE_STATUSES.has(status) || session.superseded === true) return false;
      const start = asLiveClassDate(session.startsAt)?.getTime() || 0;
      return start > selectedStart;
    })
    .sort((left, right) => (asLiveClassDate(left.startsAt)?.getTime() || 0) - (asLiveClassDate(right.startsAt)?.getTime() || 0))
    .slice(0, limit);
};

const cacheKey = ({ classId = "", className = "" } = {}) => {
  const identity = String(classId || className || "unknown").trim().toLowerCase();
  return `${CACHE_PREFIX}${encodeURIComponent(identity)}`;
};

export const loadLiveClassSummaryCache = (identity = {}) => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(cacheKey(identity));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.summary || Date.now() - Number(parsed.cachedAt || 0) > CACHE_MAX_AGE_MS) return null;
    return { ...parsed.summary, cachedAt: parsed.cachedAt, isCachedSummary: true };
  } catch {
    return null;
  }
};

export const saveLiveClassSummaryCache = (identity = {}, summary = null) => {
  if (typeof window === "undefined" || !summary) return;
  try {
    window.localStorage.setItem(cacheKey(identity), JSON.stringify({ cachedAt: Date.now(), summary }));
  } catch {
    // Storage can be unavailable in private browsing. Live data still renders normally.
  }
};
