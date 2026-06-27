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

function hideOldCompletedCard(summary, now = new Date()) {
  const completed = summary?.latestCompletedSession;
  if (!completed) return summary;
  return dateKey(completed.startsAt) === dateKey(now)
    ? summary
    : { ...summary, latestCompletedSession: null };
}

export function buildCanonicalLiveClassSummary(options = {}) {
  return hideOldCompletedCard(base.buildCanonicalLiveClassSummary(options), options.now || new Date());
}

export function subscribeCanonicalLiveClass(options = {}) {
  const { onChange } = options;
  return base.subscribeCanonicalLiveClass({
    ...options,
    onChange: (summary) => onChange?.(hideOldCompletedCard(summary, new Date())),
  });
}
