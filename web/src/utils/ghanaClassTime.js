export const GHANA_TIMEZONE = "Africa/Accra";

const asDate = (value) => {
  if (!value) return null;
  if (typeof value?.toDate === "function") return value.toDate();
  if (typeof value?.seconds === "number") return new Date(value.seconds * 1000);
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const formatZonedClock = (value, timeZone = GHANA_TIMEZONE, locale = "en-GB") => {
  const date = asDate(value);
  if (!date) return "";
  try {
    return new Intl.DateTimeFormat(locale || "en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
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
    message: `Ghana time now: ${ghanaTime}. Your device shows ${deviceTime} (${deviceTimeZone}). Class countdowns follow Ghana time.`,
  };
};
