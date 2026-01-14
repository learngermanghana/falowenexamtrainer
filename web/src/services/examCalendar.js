const pad = (value) => value.toString().padStart(2, "0");

const formatDateOnly = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
};

const formatDateTimeLocal = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(
    date.getHours()
  )}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
};

const escapeText = (value) =>
  String(value || "")
    .replace(/\\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;")
    .replace(/\\/g, "\\\\");

const buildExamEvent = ({ levelInfo, exam }) => {
  const startDate = formatDateOnly(exam.date);
  if (!startDate) return "";
  const examDate = new Date(exam.date);
  const endDate = formatDateOnly(new Date(examDate.setDate(examDate.getDate() + 1)));
  const stamp = formatDateOnly(new Date()) + "T000000Z";
  const uid = `${levelInfo.level}-${startDate}-exam@falowen`;
  const registrationLabel =
    exam.registrationStart && exam.registrationEnd
      ? `Registration: ${exam.registrationStart} to ${exam.registrationEnd}`
      : "Registration details: check Goethe-Institut";

  const descriptionLines = [
    `${levelInfo.title}`,
    `Location: ${levelInfo.location || "Goethe-Institut"}`,
    registrationLabel,
    "Reminder: practice ahead of the exam start date.",
  ];

  return [
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `SUMMARY:${escapeText(`Goethe ${levelInfo.level} Exam`)}`,
    `DESCRIPTION:${escapeText(descriptionLines.join("\\n"))}`,
    `LOCATION:${escapeText(levelInfo.location || "Goethe-Institut")}`,
    `DTSTART;VALUE=DATE:${startDate}`,
    `DTEND;VALUE=DATE:${endDate}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeText("Start practicing for your upcoming exam.")}`,
    "TRIGGER:-P7D",
    "END:VALARM",
    "END:VEVENT",
  ].join("\n");
};

export const generateExamReminderCalendar = ({ levelInfo, exam }) => {
  const eventBlock = buildExamEvent({ levelInfo, exam });
  if (!eventBlock) return null;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Falowen Learning Hub//Exam Reminder//EN",
    "CALSCALE:GREGORIAN",
    eventBlock,
    "END:VCALENDAR",
  ].join("\n");
};

export const downloadExamReminder = ({ levelInfo, exam }) => {
  const calendar = generateExamReminderCalendar({ levelInfo, exam });
  if (!calendar) return;

  const blob = new Blob([calendar], { type: "text/calendar" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const safeLevel = String(levelInfo.level || "exam").replace(/\s+/g, "-");
  link.download = `${safeLevel}-${exam.date}-reminder.ics`;
  link.click();
  window.URL.revokeObjectURL(url);
};

const normalizeDateOnly = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const buildStudyEvents = ({
  level,
  startDate,
  endDate,
  daysOfWeek,
  timeOfDay,
  durationMinutes,
  reminderMinutes,
}) => {
  const start = normalizeDateOnly(startDate);
  const end = normalizeDateOnly(endDate);
  if (!start || !end || start > end) return [];

  const [hours, minutes] = timeOfDay.split(":").map((value) => Number.parseInt(value, 10));
  const totalMinutes = Number.isNaN(durationMinutes) ? 60 : durationMinutes;
  const reminderOffset = Number.isNaN(reminderMinutes) ? null : reminderMinutes;

  const events = [];
  for (let cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate() + 1)) {
    if (!daysOfWeek.includes(cursor.getDay())) continue;
    const startTime = new Date(cursor);
    startTime.setHours(Number.isNaN(hours) ? 18 : hours);
    startTime.setMinutes(Number.isNaN(minutes) ? 0 : minutes);
    startTime.setSeconds(0, 0);
    const endTime = new Date(startTime.getTime() + totalMinutes * 60 * 1000);

    const uid = `study-${level}-${formatDateTimeLocal(startTime)}@falowen`;
    const descriptionLines = [
      `Goethe ${level} study session`,
      `Duration: ${totalMinutes} minutes`,
      "Focus: practice tasks or review notes.",
    ];

    const eventLines = [
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${formatDateTimeLocal(new Date())}`,
      `SUMMARY:${escapeText(`Goethe ${level} Study Session`)}`,
      `DESCRIPTION:${escapeText(descriptionLines.join("\\n"))}`,
      `DTSTART:${formatDateTimeLocal(startTime)}`,
      `DTEND:${formatDateTimeLocal(endTime)}`,
    ];

    if (reminderOffset && reminderOffset > 0) {
      eventLines.push(
        "BEGIN:VALARM",
        "ACTION:DISPLAY",
        `DESCRIPTION:${escapeText("Study session reminder")}`,
        `TRIGGER:-PT${reminderOffset}M`,
        "END:VALARM"
      );
    }

    eventLines.push("END:VEVENT");
    events.push(eventLines.join("\n"));
  }
  return events;
};

export const generateStudyCalendar = ({
  level,
  startDate,
  endDate,
  daysOfWeek,
  timeOfDay,
  durationMinutes,
  reminderMinutes,
}) => {
  const eventBlocks = buildStudyEvents({
    level,
    startDate,
    endDate,
    daysOfWeek,
    timeOfDay,
    durationMinutes,
    reminderMinutes,
  });
  if (eventBlocks.length === 0) return null;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Falowen Learning Hub//Study Calendar//EN",
    "CALSCALE:GREGORIAN",
    ...eventBlocks,
    "END:VCALENDAR",
  ].join("\n");
};

export const downloadStudyCalendar = ({
  level,
  startDate,
  endDate,
  daysOfWeek,
  timeOfDay,
  durationMinutes,
  reminderMinutes,
}) => {
  const calendar = generateStudyCalendar({
    level,
    startDate,
    endDate,
    daysOfWeek,
    timeOfDay,
    durationMinutes,
    reminderMinutes,
  });
  if (!calendar) return;

  const blob = new Blob([calendar], { type: "text/calendar" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const safeLevel = String(level || "study-plan").replace(/\s+/g, "-");
  link.download = `${safeLevel}-study-calendar.ics`;
  link.click();
  window.URL.revokeObjectURL(url);
};
