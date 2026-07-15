import { buildGhanaDateTime } from "../services/classCalendar";
import { GHANA_TIMEZONE } from "./liveClassCardPresentation";

const CANCELLED_STATUS = "cancelled";
const COMPLETED_STATUS = "completed";

const normalizeText = (value = "") => String(value || "").replace(/\s+/g, " ").trim().toLowerCase();

const asDate = (value) => {
  if (!value) return null;
  if (typeof value?.toDate === "function") return value.toDate();
  if (typeof value?.seconds === "number") return new Date(value.seconds * 1000);
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const resolveLevel = (studentProfile = {}) => {
  const profile = studentProfile || {};
  const source = `${profile.level || ""} ${profile.classLevel || ""} ${profile.className || ""}`.toUpperCase();
  return source.match(/\b(A1|A2|B1|B2|C1|C2)\b/)?.[1] || "";
};

export const findCourseBookStatGrid = (root = document) => {
  if (!root?.querySelectorAll) return null;
  const heading = Array.from(root.querySelectorAll("h2")).find(
    (element) => normalizeText(element.textContent) === "course book"
  );
  const hero = heading?.closest("section");
  if (!hero) return null;

  const lessonsLabel = Array.from(hero.querySelectorAll("p")).find(
    (element) => normalizeText(element.textContent) === "lessons"
  );
  return lessonsLabel?.parentElement?.parentElement || null;
};

const sessionStatus = (session = {}) => normalizeText(session.status || "scheduled");

const resolveSessionDateKey = (session = {}) => {
  const explicitDate = String(session.date || session.sessionDate || session.classDate || "").trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(explicitDate)) return explicitDate;

  const start = asDate(session.startsAt || session.startDateTime);
  if (!start) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: GHANA_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(start);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
};

const resolveSessionTime = (session = {}, field, fallbackField) => {
  const value = String(session[field] || "").trim();
  if (/^\d{1,2}:\d{2}$/.test(value)) return value.padStart(5, "0");

  const fallback = asDate(session[fallbackField]);
  if (!fallback) return "";
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: GHANA_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(fallback);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.hour}:${values.minute}`;
};

const sessionDateTimeFromGhanaFields = (session = {}, timeField, fallbackField) => {
  const dateKey = resolveSessionDateKey(session);
  const time = resolveSessionTime(session, timeField, fallbackField);
  if (!dateKey || !time) return null;
  return buildGhanaDateTime(dateKey, time);
};

const sessionStart = (session = {}) =>
  sessionDateTimeFromGhanaFields(session, "startTime", "startsAt") || asDate(session.startsAt || session.startDateTime);
const sessionEnd = (session = {}) =>
  sessionDateTimeFromGhanaFields(session, "endTime", "endsAt") || asDate(session.endsAt || session.endDateTime);

export const findCurrentOrNextSession = (sessions = [], now = new Date()) => {
  const nowMs = now.getTime();
  return [...sessions]
    .filter((session) => {
      const status = sessionStatus(session);
      if (status === CANCELLED_STATUS || status === COMPLETED_STATUS) return false;
      const start = sessionStart(session)?.getTime() || 0;
      const end = sessionEnd(session)?.getTime() || 0;
      if (end && end < nowMs) return false;
      if (status === "live") return true;
      return Boolean(start && (start >= nowMs || end >= nowMs));
    })
    .sort((left, right) => (sessionStart(left)?.getTime() || 0) - (sessionStart(right)?.getTime() || 0))[0] || null;
};

export const formatClassCountdown = (session, now = new Date()) => {
  const start = sessionStart(session);
  if (!start) return "Schedule unavailable";
  const end = sessionEnd(session);
  const nowMs = now.getTime();
  const startMs = start.getTime();
  const endMs = end?.getTime() || startMs + 2 * 60 * 60 * 1000;

  if (nowMs > endMs) return "Class has ended";
  if (sessionStatus(session) === "live" || (nowMs >= startMs && nowMs <= endMs)) return "Class is live now";

  const totalMinutes = Math.max(0, Math.ceil((startMs - nowMs) / 60000));
  if (totalMinutes === 0) return "Starting now";
  if (totalMinutes < 60) return `Starts in ${totalMinutes} minute${totalMinutes === 1 ? "" : "s"}`;

  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;
  if (totalHours < 24) {
    const hoursLabel = `${totalHours} hour${totalHours === 1 ? "" : "s"}`;
    const minutesLabel = remainingMinutes ? ` ${remainingMinutes} minute${remainingMinutes === 1 ? "" : "s"}` : "";
    return `Starts in ${hoursLabel}${minutesLabel}`;
  }

  const days = Math.floor(totalHours / 24);
  const remainingHours = totalHours % 24;
  const daysLabel = `${days} day${days === 1 ? "" : "s"}`;
  const hoursLabel = remainingHours ? ` ${remainingHours} hour${remainingHours === 1 ? "" : "s"}` : "";
  return `Starts in ${daysLabel}${hoursLabel}`;
};
