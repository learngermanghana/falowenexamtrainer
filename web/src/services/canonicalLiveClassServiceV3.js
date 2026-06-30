import * as base from "./canonicalLiveClassServiceV2";

export { normalizeCurriculumIds, findCanonicalClass } from "./canonicalLiveClassServiceV2";

const GHANA_TIMEZONE = "Africa/Accra";

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
  const scopedSessions = (summary.sessions || []).filter((session) =>
    sessionBelongsToCanonicalClass(session, summary.klass));
  return base.buildCanonicalLiveClassSummary({
    klass: summary.klass,
    sessions: scopedSessions,
    zoomProfile: summary.zoom,
    now,
  });
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
