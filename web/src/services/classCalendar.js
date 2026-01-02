import { ZOOM_DETAILS, classCatalog } from "../data/classCatalog";
import { courseSchedulesByName } from "../data/courseSchedules";

const WEEKDAY_MAP = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

const pad = (value) => value.toString().padStart(2, "0");

const formatDateTime = (date) => {
  return (
    date.getFullYear().toString() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
};

const toBerlinDate = (dateString) => new Date(`${dateString}T00:00:00+02:00`);

const withTime = (date, timeString) => {
  const [hours, minutes] = timeString.split(":").map((value) => parseInt(value, 10));
  const withHours = new Date(date);
  withHours.setHours(hours, minutes, 0, 0);
  return withHours;
};

const findFirstSessionDate = (startDate, targetDay) => {
  const date = new Date(startDate);
  while (date.getDay() !== targetDay) {
    date.setDate(date.getDate() + 1);
  }
  return date;
};

const escapeText = (value) =>
  value
    .replace(/\\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;")
    .replace(/\\/g, "\\\\");

const buildEvents = ({ className, startDate, endDate, schedule, description }) => {
  const events = [];
  const start = toBerlinDate(startDate);
  const end = toBerlinDate(endDate);

  schedule.forEach((session) => {
    const firstDate = findFirstSessionDate(start, WEEKDAY_MAP[session.day]);
    const occurrence = new Date(firstDate);

    while (occurrence <= end) {
      const sessionStart = withTime(occurrence, session.startTime);
      const sessionEnd = withTime(occurrence, session.endTime);

      const uid = `${className}-${session.day}-${formatDateTime(sessionStart)}@falowen-exam`;
      const stamp = formatDateTime(new Date());

      events.push(
        [
          "BEGIN:VEVENT",
          `UID:${uid}`,
          `DTSTAMP;TZID=Europe/Berlin:${stamp}`,
          `SUMMARY:${escapeText(`${className} – Live Class`)}`,
          `DESCRIPTION:${escapeText(description)}`,
          `LOCATION:${escapeText(ZOOM_DETAILS.url)}`,
          `DTSTART;TZID=Europe/Berlin:${formatDateTime(sessionStart)}`,
          `DTEND;TZID=Europe/Berlin:${formatDateTime(sessionEnd)}`,
          "END:VEVENT",
        ].join("\n")
      );

      occurrence.setDate(occurrence.getDate() + 7);
    }
  });

  return events.join("\n");
};

export const generateClassCalendar = (className) => {
  const details = classCatalog[className];
  if (!details) return null;

  const description = [
    `${className} live class`,
    `Zoom link: ${ZOOM_DETAILS.url}`,
    `Meeting ID: ${ZOOM_DETAILS.meetingId}`,
    `Passcode: ${ZOOM_DETAILS.passcode}`,
    details.docUrl ? `Docs: ${details.docUrl}` : null,
  ]
    .filter(Boolean)
    .join("\\n");

  const eventsBlock = buildEvents({
    className,
    startDate: details.startDate,
    endDate: details.endDate,
    schedule: details.schedule,
    description,
  });

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Falowen Learning Hub//Class Calendar//EN",
    "CALSCALE:GREGORIAN",
    eventsBlock,
    "END:VCALENDAR",
  ].join("\n");
};

export const downloadClassCalendar = (className) => {
  const calendar = generateClassCalendar(className);
  if (!calendar) return;

  const blob = new Blob([calendar], { type: "text/calendar" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${className.replace(/\\s+/g, "-")}-schedule.ics`;
  link.click();
  window.URL.revokeObjectURL(url);
};

export const formatScheduleSummary = (schedule) =>
  schedule
    .map((item) => `${item.day}: ${item.startTime}–${item.endTime}`)
    .join(" • ");

const findTimeSlot = (className, weekday) => {
  const schedule = classCatalog[className]?.schedule || [];
  return schedule.find((entry) => entry.day === weekday);
};

const toLocalDateString = (date) => {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  return `${year}-${month}-${day}`;
};

const buildSessionTitles = (sessions = []) =>
  sessions.map((session) => {
    const base = [session.chapter, session.type].filter(Boolean).join(" – ");
    return session.note ? `${base} (${session.note})` : base;
  });

export const findTodayClassSession = (className, referenceDate = new Date()) => {
  const courseSchedule = courseSchedulesByName[className];
  const sessionDays = courseSchedule?.days;
  if (!sessionDays || sessionDays.length === 0) return null;

  const today = toLocalDateString(referenceDate);
  const day = sessionDays.find((entry) => entry.date === today);
  if (!day) return null;

  const timeSlot = findTimeSlot(className, day.weekday);
  const startTime = timeSlot?.startTime || "00:00";
  const endTime = timeSlot?.endTime || "00:00";

  return {
    ...day,
    startTime,
    endTime,
    titles: buildSessionTitles(day.sessions || []),
  };
};

export const findNextClassSession = (className, referenceDate = new Date()) => {
  const courseSchedule = courseSchedulesByName[className];
  const sessionDays = courseSchedule?.days;
  if (!sessionDays || sessionDays.length === 0) return null;

  const sortedDays = [...sessionDays].sort((a, b) => new Date(a.date) - new Date(b.date));

  for (const day of sortedDays) {
    const timeSlot = findTimeSlot(className, day.weekday);
    const startTime = timeSlot?.startTime || "00:00";
    const endTime = timeSlot?.endTime || "00:00";

    const startDateTime = new Date(`${day.date}T${startTime}:00`);
    const endDateTime = endTime ? new Date(`${day.date}T${endTime}:00`) : null;

    if (startDateTime >= referenceDate) {
      return {
        ...day,
        startTime,
        endTime,
        startDateTime,
        endDateTime,
        titles: buildSessionTitles(day.sessions || []),
      };
    }
  }

  return null;
};
