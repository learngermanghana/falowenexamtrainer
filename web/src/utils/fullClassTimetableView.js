import { GHANA_TIMEZONE, asLiveClassDate } from "./liveClassCardPresentation";

const toTime = value => asLiveClassDate(value)?.getTime() || 0;

// The featured lesson is the next session that has not ended, or the last
// recorded lesson when the class has finished. Never label a future date today.
export const selectFeaturedTimetableSession = (sessions = [], now = new Date()) => {
  if (!sessions.length) return null;
  const currentTime = now.getTime();
  const currentOrNext = sessions.find(session => {
    const start = toTime(session.startsAt);
    const end = toTime(session.endsAt) || (start ? start + 2 * 60 * 60 * 1000 : 0);
    return start && end >= currentTime;
  });
  return currentOrNext
    ? { session: currentOrNext, isLatest: false }
    : { session: sessions[sessions.length - 1], isLatest: true };
};

export const groupTimetableSessionsByMonth = (sessions = []) => {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: GHANA_TIMEZONE,
    year: "numeric",
    month: "long",
  });
  const groups = [];
  const positions = new Map();
  for (const session of sessions) {
    const date = asLiveClassDate(session.startsAt);
    const month = date ? formatter.format(date) : "Date to be confirmed";
    if (!positions.has(month)) {
      positions.set(month, groups.length);
      groups.push({ month, sessions: [] });
    }
    groups[positions.get(month)].sessions.push(session);
  }
  return groups;
};
