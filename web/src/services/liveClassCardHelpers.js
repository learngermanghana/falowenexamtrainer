import { buildGhanaDateTime, GHANA_TIMEZONE } from "./classCalendar";

export const mergeClassDetails = (fallback, live) => {
  if (!live) return fallback;
  return {
    ...fallback,
    ...live,
    docUrl: live.docUrl || fallback?.docUrl || "",
    schedule: live.schedule?.length ? live.schedule : fallback?.schedule || [],
  };
};

export const buildTimeline = ({
  details, now, liveProgress, formatTimeUnit, translate,
}) => {
  if (!details?.startDate || !details?.endDate) return null;
  const start = new Date(`${details.startDate}T00:00:00`);
  const end = new Date(`${details.endDate}T23:59:59`);
  const dayMs = 86400000;
  const total = Math.max(end - start, dayMs);
  const elapsed = Math.min(Math.max(now - start, 0), total);
  const daysUntilStart = Math.max(0, Math.ceil((start - now) / dayMs));
  const daysUntilEnd = Math.max(0, Math.ceil((end - now) / dayMs));
  const percentComplete = liveProgress ?? Math.round((elapsed / total) * 100);
  const status = now < start
    ? translate("classCalendar.status.startsIn", { time: formatTimeUnit("day", daysUntilStart) })
    : now > end
      ? translate("classCalendar.status.courseFinished")
      : translate("classCalendar.status.timeLeft", { time: formatTimeUnit("day", daysUntilEnd) });
  return { percentComplete, daysUntilStart, daysUntilEnd, status };
};

export const formatSessionTimes = (session, locale) => {
  if (!session?.date || !session?.startTime) return null;
  const start = buildGhanaDateTime(session.date, session.startTime);
  const end = session.endTime ? buildGhanaDateTime(session.date, session.endTime) : null;
  if (!start) return null;
  const ghana = new Intl.DateTimeFormat("en-GB", {
    timeZone: GHANA_TIMEZONE, hour: "2-digit", minute: "2-digit",
  });
  const local = new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" });
  return {
    ghanaRange: `${ghana.format(start)}${end ? `–${ghana.format(end)}` : ""}`,
    localRange: `${local.format(start)}${end ? `–${local.format(end)}` : ""}`,
  };
};

export const buildTimeUntil = (minutes, formatTimeUnit, translate) => {
  if (minutes == null) return null;
  if (minutes === 0) return {
    badge: translate("classCalendar.badge.startingNow"),
    detail: translate("classCalendar.detail.startingNow"),
  };
  const count = minutes >= 1440 ? Math.ceil(minutes / 1440) : minutes;
  const unit = minutes >= 1440 ? "day" : "minute";
  const time = formatTimeUnit(unit, count);
  return {
    badge: translate("classCalendar.badge.timeLeft", { time }),
    detail: translate("classCalendar.detail.startsIn", { time }),
  };
};
