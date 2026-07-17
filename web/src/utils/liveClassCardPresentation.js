export const GHANA_TIMEZONE = "Africa/Accra";

const CACHE_PREFIX = "falowen:live-class-summary:v3:";
const CACHE_MAX_AGE_MS = 30 * 60 * 1000;
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

const curriculumLevel = (session = {}) =>
  liveClassCurriculumIds(session).join(" ").match(/\b(A1|A2|B1|B2|C1|C2)\b/i)?.[1]?.toUpperCase() || "";

const a1CurriculumDay = (session = {}) => {
  if (curriculumLevel(session) !== "A1") return null;
  const day = Number(session.curriculumDay);
  return Number.isInteger(day) && day >= 0 ? day : null;
};

export const liveClassLessonNumber = (session = {}) => {
  const directA1Day = a1CurriculumDay(session);
  if (directA1Day !== null) return directA1Day;

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
  const resolvedLevel = String(level || curriculumLevel(session)).trim().toUpperCase();
  const number = liveClassLessonNumber(session);
  if (resolvedLevel === "A1" && number !== null) return `Day ${number}`;

  const topic = liveClassTopic(session, "");
  const prefix = topic.match(/\b(day|lesson|session)\s*(\d+)\b/i);
  if (prefix) {
    const noun = prefix[1].toLowerCase() === "day" ? "Day" : "Lesson";
    return `${noun} ${prefix[2]}`;
  }

  if (number === null) return resolvedLevel || "Live class";
  return `Lesson ${number}`;
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
  const start = asLiveClassDate(session.startsAt)?.getTime() || 0;
  const end = asLiveClassDate(session.endsAt)?.getTime() || 0;
  const current = now.getTime();
  if (stored === "completed" && end && end < current) return "Completed";
  if (stored === "completed" && !start && !end) return "Completed";
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

const normalizeCacheIdentity = (value = "") => String(value || "").trim().toLowerCase();

const cacheKey = ({ classId = "", className = "" } = {}) => {
  const identity = normalizeCacheIdentity(classId || className || "unknown");
  return `${CACHE_PREFIX}${encodeURIComponent(identity)}`;
};

const cachedSummaryMatchesIdentity = ({ classId = "", className = "" } = {}, summary = {}) => {
  const requestedClassId = normalizeCacheIdentity(classId);
  if (requestedClassId) {
    const cachedIds = [summary?.klass?.id, summary?.klass?.classId]
      .map(normalizeCacheIdentity)
      .filter(Boolean);
    return cachedIds.includes(requestedClassId);
  }

  const requestedClassName = normalizeCacheIdentity(className);
  if (!requestedClassName) return true;
  const cachedNames = [summary?.klass?.name, summary?.klass?.className]
    .map(normalizeCacheIdentity)
    .filter(Boolean);
  return cachedNames.includes(requestedClassName);
};

export const loadLiveClassSummaryCache = (identity = {}) => {
  if (typeof window === "undefined") return null;
  const key = cacheKey(identity);
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const expired = Date.now() - Number(parsed.cachedAt || 0) > CACHE_MAX_AGE_MS;
    const wrongClass = !cachedSummaryMatchesIdentity(identity, parsed?.summary);
    if (!parsed?.summary || expired || wrongClass) {
      window.localStorage.removeItem(key);
      return null;
    }
    return { ...parsed.summary, cachedAt: parsed.cachedAt, isCachedSummary: true };
  } catch {
    window.localStorage.removeItem(key);
    return null;
  }
};

export const saveLiveClassSummaryCache = (identity = {}, summary = null) => {
  if (typeof window === "undefined" || !summary || !cachedSummaryMatchesIdentity(identity, summary)) return;
  try {
    window.localStorage.setItem(cacheKey(identity), JSON.stringify({ cachedAt: Date.now(), summary }));
  } catch {
    // Storage can be unavailable in private browsing. Live data still renders normally.
  }
};
