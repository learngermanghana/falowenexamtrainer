import { toDate } from "./dateUtils";

const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const DEFAULT_TIMEZONE = "Africa/Accra";
const formatterCache = new Map();

const normalizeTimeZone = (timeZone) => {
  const candidate = String(timeZone || DEFAULT_TIMEZONE).trim() || DEFAULT_TIMEZONE;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: candidate }).format(new Date(0));
    return candidate;
  } catch {
    return DEFAULT_TIMEZONE;
  }
};

const getPartsFormatter = (timeZone) => {
  const normalizedTimeZone = normalizeTimeZone(timeZone);
  if (!formatterCache.has(normalizedTimeZone)) {
    formatterCache.set(
      normalizedTimeZone,
      new Intl.DateTimeFormat("en-US", {
        timeZone: normalizedTimeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
      }),
    );
  }
  return formatterCache.get(normalizedTimeZone);
};

const readZonedParts = (date, timeZone) => {
  const parts = getPartsFormatter(timeZone).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour),
    minute: Number(values.minute),
    second: Number(values.second),
  };
};

const getTimeZoneOffsetMs = (date, timeZone) => {
  const parts = readZonedParts(date, timeZone);
  const representedAsUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );
  const instantToSecond = Math.trunc(date.getTime() / 1000) * 1000;
  return representedAsUtc - instantToSecond;
};

const getScheduleDateParts = (value, timeZone) => {
  if (!value) return null;

  if (typeof value === "string") {
    const match = value.trim().match(DATE_ONLY_PATTERN);
    if (match) {
      return {
        year: Number(match[1]),
        month: Number(match[2]),
        day: Number(match[3]),
      };
    }
  }

  const parsed = toDate(value);
  if (!parsed) return null;
  const { year, month, day } = readZonedParts(parsed, timeZone);
  return { year, month, day };
};

const zonedDateTimeToInstant = (
  { year, month, day, hour, minute, second, millisecond },
  timeZone,
) => {
  const normalizedTimeZone = normalizeTimeZone(timeZone);
  const wallClockAsUtc = Date.UTC(year, month - 1, day, hour, minute, second);

  let offset = getTimeZoneOffsetMs(new Date(wallClockAsUtc), normalizedTimeZone);
  let instant = wallClockAsUtc - offset;
  const refinedOffset = getTimeZoneOffsetMs(new Date(instant), normalizedTimeZone);

  if (refinedOffset !== offset) {
    offset = refinedOffset;
    instant = wallClockAsUtc - offset;
  }

  return new Date(instant + millisecond);
};

export const startOfScheduleDay = (value, timeZone = DEFAULT_TIMEZONE) => {
  const parts = getScheduleDateParts(value, timeZone);
  if (!parts) return null;
  return zonedDateTimeToInstant(
    { ...parts, hour: 0, minute: 0, second: 0, millisecond: 0 },
    timeZone,
  );
};

export const endOfScheduleDay = (value, timeZone = DEFAULT_TIMEZONE) => {
  const parts = getScheduleDateParts(value, timeZone);
  if (!parts) return null;
  return zonedDateTimeToInstant(
    { ...parts, hour: 23, minute: 59, second: 59, millisecond: 999 },
    timeZone,
  );
};

export const scheduleDateKey = (value, timeZone = DEFAULT_TIMEZONE) => {
  const parts = getScheduleDateParts(value, timeZone);
  if (!parts) return "";
  const pad = (number) => String(number).padStart(2, "0");
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`;
};

export const formatScheduleDate = (
  value,
  { locale = "en-US", timeZone = DEFAULT_TIMEZONE } = {},
) => {
  const parts = getScheduleDateParts(value, timeZone);
  if (!parts) return "";

  return new Intl.DateTimeFormat(locale, {
    timeZone: "UTC",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(Date.UTC(parts.year, parts.month - 1, parts.day)));
};
