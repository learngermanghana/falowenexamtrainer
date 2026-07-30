import { toDate } from "./dateUtils";

const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const DEFAULT_TIMEZONE = "Africa/Accra";
const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
const formatterCache = new Map();
const dayBoundaryCache = new Map();

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

const compareCivilDates = (left, right) => {
  if (left.year !== right.year) return left.year - right.year;
  if (left.month !== right.month) return left.month - right.month;
  return left.day - right.day;
};

const pad = (number) => String(number).padStart(2, "0");
const dateKeyFromParts = ({ year, month, day }) => `${year}-${pad(month)}-${pad(day)}`;

const addCivilDays = ({ year, month, day }, amount) => {
  const shifted = new Date(Date.UTC(year, month - 1, day + amount));
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
  };
};

const findFirstInstantAtOrAfterCivilDate = (targetParts, timeZone) => {
  const normalizedTimeZone = normalizeTimeZone(timeZone);
  const cacheKey = `${normalizedTimeZone}|${dateKeyFromParts(targetParts)}`;
  const cached = dayBoundaryCache.get(cacheKey);
  if (cached !== undefined) return new Date(cached);

  const utcMidnight = Date.UTC(targetParts.year, targetParts.month - 1, targetParts.day);
  let lower = utcMidnight - 36 * HOUR_MS;
  let upper = utcMidnight + 36 * HOUR_MS;

  while (compareCivilDates(readZonedParts(new Date(lower), normalizedTimeZone), targetParts) >= 0) {
    lower -= DAY_MS;
  }
  while (compareCivilDates(readZonedParts(new Date(upper), normalizedTimeZone), targetParts) < 0) {
    upper += DAY_MS;
  }

  while (upper - lower > 1) {
    const middle = lower + Math.floor((upper - lower) / 2);
    const comparison = compareCivilDates(
      readZonedParts(new Date(middle), normalizedTimeZone),
      targetParts,
    );
    if (comparison >= 0) upper = middle;
    else lower = middle;
  }

  dayBoundaryCache.set(cacheKey, upper);
  return new Date(upper);
};

export const startOfScheduleDay = (value, timeZone = DEFAULT_TIMEZONE) => {
  const parts = getScheduleDateParts(value, timeZone);
  if (!parts) return null;

  const firstInstant = findFirstInstantAtOrAfterCivilDate(parts, timeZone);
  const firstInstantParts = readZonedParts(firstInstant, timeZone);
  return compareCivilDates(firstInstantParts, parts) === 0 ? firstInstant : null;
};

export const endOfScheduleDay = (value, timeZone = DEFAULT_TIMEZONE) => {
  const parts = getScheduleDateParts(value, timeZone);
  if (!parts || !startOfScheduleDay(value, timeZone)) return null;

  const nextCivilDate = addCivilDays(parts, 1);
  const nextBoundary = findFirstInstantAtOrAfterCivilDate(nextCivilDate, timeZone);
  const finalInstant = new Date(nextBoundary.getTime() - 1);
  return compareCivilDates(readZonedParts(finalInstant, timeZone), parts) === 0
    ? finalInstant
    : null;
};

export const scheduleDateKey = (value, timeZone = DEFAULT_TIMEZONE) => {
  const parts = getScheduleDateParts(value, timeZone);
  return parts ? dateKeyFromParts(parts) : "";
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
