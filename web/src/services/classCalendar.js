import { ZOOM_DETAILS, classCatalog } from "../data/classCatalog";

const WEEKDAY_MAP = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

const LINE_BREAK = "\r\n";

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
        ]
          .filter(Boolean)
          .join(LINE_BREAK)
      );

      occurrence.setDate(occurrence.getDate() + 7);
    }
  });

  return events.join(LINE_BREAK);
};

const timeZoneDefinition = [
  "BEGIN:VTIMEZONE",
  "TZID:Europe/Berlin",
  "X-LIC-LOCATION:Europe/Berlin",
  "BEGIN:DAYLIGHT",
  "TZOFFSETFROM:+0100",
  "TZOFFSETTO:+0200",
  "TZNAME:CEST",
  "DTSTART:19700329T020000",
  "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU",
  "END:DAYLIGHT",
  "BEGIN:STANDARD",
  "TZOFFSETFROM:+0200",
  "TZOFFSETTO:+0100",
  "TZNAME:CET",
  "DTSTART:19701025T030000",
  "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU",
  "END:STANDARD",
  "END:VTIMEZONE",
].join(LINE_BREAK);

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
    "PRODID:-//Falowen Exam Coach//Class Calendar//EN",
    "CALSCALE:GREGORIAN",
    timeZoneDefinition,
    eventsBlock,
    "END:VCALENDAR",
    "",
  ].join(LINE_BREAK);
};

export const downloadClassCalendar = (className) => {
  const calendar = generateClassCalendar(className);
  if (!calendar) return;

  const blob = new Blob([calendar], { type: "text/calendar;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${className.replace(/\s+/g, "-")}-schedule.ics`;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const formatScheduleSummary = (schedule) =>
  schedule
    .map((item) => `${item.day}: ${item.startTime}–${item.endTime}`)
    .join(" • ");
