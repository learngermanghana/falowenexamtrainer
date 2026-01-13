const pad = (value) => value.toString().padStart(2, "0");

const formatDateOnly = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
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
