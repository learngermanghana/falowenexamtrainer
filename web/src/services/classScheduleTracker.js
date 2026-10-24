import { classCatalog } from "../data/classCatalog";
import { courseSchedulesByName } from "../data/courseSchedules";

const formatHumanDate = (dateString) => {
  const date = new Date(`${dateString}T00:00:00Z`);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const minutesBetween = (future, now) => Math.max(0, Math.round((future - now) / 60000));

export const getScheduleDetails = (className) => courseSchedulesByName[className] || null;

export const computeNextSession = (className, now = new Date()) => {
  const schedule = getScheduleDetails(className);
  if (!schedule?.days?.length) return null;

  const timeByDay = Object.fromEntries(
    (classCatalog[className]?.schedule || []).map((slot) => [slot.day, slot.startTime])
  );

  const upcoming = schedule.days
    .map((day) => {
      const startTime = timeByDay[day.weekday] || "00:00";
      const startDate = new Date(`${day.date}T${startTime}:00Z`);
      return {
        ...day,
        startTime,
        startDate,
        minutesUntilStart: minutesBetween(startDate, now),
        humanDate: formatHumanDate(day.date),
      };
    })
    .filter((item) => item.startDate >= now)
    .sort((a, b) => a.startDate - b.startDate);

  return upcoming[0] || null;
};

export const getDaysUntilEnd = (className, now = new Date()) => {
  const details = classCatalog[className];
  if (!details?.endDate) return null;
  const end = new Date(`${details.endDate}T23:59:59Z`);
  const days = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  return days < 0 ? 0 : days;
};

export const buildSessionSummary = (sessions = []) => {
  if (!sessions.length) return "Session details to be announced.";
  return sessions
    .map((session) => {
      if (session.chapter && session.type) {
        return `${session.chapter} · ${session.type}${session.note ? ` (${session.note})` : ""}`;
      }
      return `${session.title}${session.note ? ` (${session.note})` : ""}`;
    })
    .join(" • ");
};

export const getCourseTitle = (className) => getScheduleDetails(className)?.title || null;
