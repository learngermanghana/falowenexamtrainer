export const GHANA_TIMEZONE = "Africa/Accra";

const asDate = (value) => {
  if (!value) return null;
  if (typeof value?.toDate === "function") return value.toDate();
  if (typeof value?.seconds === "number") return new Date(value.seconds * 1000);
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const usesTwelveHourClock = (locale = "") =>
  String(locale || "").toLowerCase().startsWith("en");

export const formatZonedClock = (value, timeZone = GHANA_TIMEZONE, locale = "en-GB") => {
  const date = asDate(value);
  if (!date) return "";
  try {
    return new Intl.DateTimeFormat(locale || "en-GB", {
      timeZone,
      hour: "numeric",
      minute: "2-digit",
      hour12: usesTwelveHourClock(locale),
    }).format(date);
  } catch {
    return "";
  }
};

export const getDeviceTimeZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch {
    return "";
  }
};

export const getGhanaDeviceTimeNotice = (
  value = new Date(),
  locale = "en-GB",
  deviceTimeZone = getDeviceTimeZone(),
) => {
  if (!deviceTimeZone || deviceTimeZone === GHANA_TIMEZONE) return null;

  const ghanaTime = formatZonedClock(value, GHANA_TIMEZONE, locale);
  const deviceTime = formatZonedClock(value, deviceTimeZone, locale);
  if (!ghanaTime || !deviceTime || ghanaTime === deviceTime) return null;

  return {
    ghanaTime,
    deviceTime,
    deviceTimeZone,
    message: `Ghana time now: ${ghanaTime}. Your browser time-zone setting differs from Ghana. Class countdowns use Ghana time.`,
  };
};
