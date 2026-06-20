import {
  getAssignmentDictionaryEntry,
  getAssignmentDisplayTitle,
} from "../data/germanAssignmentCatalog";

export const GHANA_TIMEZONE = "Africa/Accra";

const DAYS = {
  sun: "Sunday", mon: "Monday", tue: "Tuesday", wed: "Wednesday",
  thu: "Thursday", fri: "Friday", sat: "Saturday",
};

export const toLiveDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value?.toDate === "function") return value.toDate();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const parts = (value, timeZone = GHANA_TIMEZONE) => {
  const date = toLiveDate(value);
  if (!date) return null;
  const result = new Intl.DateTimeFormat("en-GB", {
    timeZone, year: "numeric", month: "2-digit", day: "2-digit",
    weekday: "long", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(date);
  const item = Object.fromEntries(result.map((part) => [part.type, part.value]));
  return {
    date: `${item.year}-${item.month}-${item.day}`,
    weekday: item.weekday,
    time: `${item.hour}:${item.minute}`,
  };
};

const endTime = (startTime, duration) => {
  const [hour, minute] = String(startTime || "00:00").split(":").map(Number);
  const total = (hour * 60 + minute + Number(duration || 60)) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
};

const schedule = (rules = []) =>
  (Array.isArray(rules) ? rules : rules?.weekly || []).map((rule) => {
    const day = DAYS[String(rule.day || rule.weekday || "").slice(0, 3).toLowerCase()];
    const startTime = String(rule.startTime || rule.time || "");
    if (!day || !/^\d{2}:\d{2}$/.test(startTime)) return null;
    return {
      day,
      startTime,
      endTime: rule.endTime || endTime(startTime, rule.durationMinutes),
    };
  }).filter(Boolean);

const assignmentIds = (session, level) => {
  const ids = session.assignmentIds?.length ? session.assignmentIds : session.chapterIds || [];
  return ids.map((value) => String(value || "").trim()).filter(Boolean).map((value) =>
    /^(A1|A2|B1|B2|C1|C2)-/i.test(value) ? value.toUpperCase() : `${level}-${value}`
  );
};

const titles = (session, level) => {
  const resolved = assignmentIds(session, level).map((assignmentId) => {
    const entry = getAssignmentDictionaryEntry({ level, assignmentId });
    return entry ? getAssignmentDisplayTitle(entry, { preferEnglish: true }) : assignmentId;
  }).filter(Boolean);
  return resolved.length ? resolved : session.topic ? [String(session.topic)] : [];
};

const sessionView = (session, klass, now) => {
  const startDateTime = toLiveDate(session.startsAt);
  const endDateTime = toLiveDate(session.endsAt) || startDateTime;
  if (!startDateTime) return null;
  const start = parts(startDateTime, klass.timezone);
  const end = parts(endDateTime, klass.timezone);
  const declared = String(session.status || "scheduled").toLowerCase();
  const status = declared === "cancelled"
    ? "cancelled"
    : declared === "completed" || endDateTime < now
      ? "completed"
      : declared === "rescheduled" ? "scheduled" : declared;
  return {
    ...session,
    status,
    date: start.date,
    weekday: start.weekday,
    startTime: start.time,
    endTime: end.time,
    startDateTime,
    endDateTime,
    titles: titles(session, String(klass.levelId || "").toUpperCase()),
  };
};

const zoomView = (zoom = {}, klass = {}) => ({
  url: zoom.joinUrl || zoom.url || klass.zoomUrl || "",
  meetingId: zoom.meetingId || klass.zoomMeetingId || "",
  passcode: zoom.passcode || klass.zoomPasscode || "",
});

export const buildLiveClassView = ({ klass, sessions = [], zoom = null }, referenceDate = new Date()) => {
  if (!klass?.id) return null;
  const now = toLiveDate(referenceDate) || new Date();
  const all = sessions.map((item) => sessionView(item, klass, now)).filter(Boolean)
    .sort((a, b) => a.startDateTime - b.startDateTime);
  const today = parts(now, klass.timezone)?.date;
  const valid = all.filter((item) => item.status !== "cancelled");
  const completed = valid.filter((item) => item.status === "completed");
  const nextClass = valid.find((item) =>
    item.status !== "completed" && item.startDateTime >= now
  ) || null;
  const todayClass = valid.find((item) =>
    item.date === today && item.status !== "completed" && item.endDateTime >= now
  ) || null;
  const completedToday = [...completed].reverse().find((item) => item.date === today) || null;
  const cancelledToday = [...all].reverse().find((item) =>
    item.date === today && item.status === "cancelled"
  ) || null;
  const apiBase = String(
    process.env.REACT_APP_LIVE_CLASS_API_BASE_URL || "https://admin.falowen.app/api"
  ).replace(/\/+$/, "");

  return {
    klass,
    sessions: all,
    nextClass,
    todayClass,
    completedToday,
    cancelledToday,
    progress: valid.length ? Math.round((completed.length / valid.length) * 100) : 0,
    zoom: zoomView(zoom || {}, klass),
    classDetails: {
      startDate: klass.startDate || "",
      endDate: klass.endDate || "",
      schedule: schedule(klass.scheduleRules),
      docUrl: klass.materialsUrl || klass.courseScheduleUrl || "",
    },
    calendarUrl: `${apiBase}/calendar/class/${encodeURIComponent(klass.id)}.ics`,
  };
};
