"use strict";

const { courseSchedules } = require("./courseSchedule");

const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const classCatalog = {
  "A1 Stuttgart Klasse": {
    startDate: "2026-01-14",
    endDate: "2026-03-26",
    schedule: [
      { day: "Wednesday", startTime: "14:00", endTime: "15:00" },
      { day: "Thursday", startTime: "11:00", endTime: "12:00" },
      { day: "Friday", startTime: "11:00", endTime: "12:00" },
    ],
  },
  "A1 Berlin Klasse": {
    startDate: "2026-02-18",
    endDate: "2026-04-14",
    schedule: [
      { day: "Monday", startTime: "11:00", endTime: "12:00" },
      { day: "Tuesday", startTime: "11:00", endTime: "12:00" },
      { day: "Wednesday", startTime: "14:00", endTime: "15:00" },
    ],
  },
  "A1 Hamburg Klasse": {
    startDate: "2026-01-30",
    endDate: "2026-03-27",
    schedule: [
      { day: "Thursday", startTime: "18:00", endTime: "19:00" },
      { day: "Friday", startTime: "18:00", endTime: "19:00" },
      { day: "Saturday", startTime: "08:00", endTime: "09:00" },
    ],
  },
  "A1 Dortmund Klasse": {
    startDate: "2026-03-09",
    endDate: "2026-04-29",
    schedule: [
      { day: "Monday", startTime: "18:00", endTime: "19:00" },
      { day: "Tuesday", startTime: "18:00", endTime: "19:00" },
      { day: "Wednesday", startTime: "18:00", endTime: "19:00" },
    ],
  },
  "A1 Koln Klasse": {
    startDate: "2026-04-15",
    endDate: "2026-06-10",
    schedule: [
      { day: "Monday", startTime: "11:00", endTime: "12:00" },
      { day: "Tuesday", startTime: "11:00", endTime: "12:00" },
      { day: "Wednesday", startTime: "14:00", endTime: "15:00" },
    ],
  },
  "A2 Stuttgart Klasse": {
    startDate: "2026-03-02",
    endDate: "2026-05-04",
    schedule: [
      { day: "Monday", startTime: "17:30", endTime: "19:00" },
      { day: "Tuesday", startTime: "17:30", endTime: "19:00" },
      { day: "Wednesday", startTime: "17:30", endTime: "19:00" },
    ],
  },
  "B1 Stuttgart Klasse": {
    startDate: "2026-03-12",
    endDate: "2026-06-12",
    schedule: [
      { day: "Thursday", startTime: "19:30", endTime: "21:00" },
      { day: "Friday", startTime: "19:30", endTime: "21:00" },
    ],
  },
};

const toDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

const splitChapterTokens = (value = "") =>
  String(value || "")
    .split(/[_,/]/)
    .map((token) => token.trim())
    .filter(Boolean);

const extractLevel = (className = "") => {
  const match = String(className).toUpperCase().match(/\b(A1|A2|B1|B2|C1|C2)\b/);
  return match ? match[1] : "";
};

const extractAssignmentSequenceForLevel = (level = "") => {
  const lessons = courseSchedules[level] || [];
  const sequence = [];

  lessons.forEach((lesson) => {
    const baseTitle = String(lesson.topic || lesson.title || "").trim();

    const pushSession = (item, fallbackType) => {
      if (!item || item.assignment !== true) return;
      const chapters = splitChapterTokens(item.chapter || item.assignmentId);
      if (!chapters.length) return;
      chapters.forEach((chapter) => {
        sequence.push({
          chapter,
          assignmentId: `${level}-${chapter}`,
          title: String(item.title || item.assignmentTitle || baseTitle || chapter).trim(),
          type: String(item.type || fallbackType || "Lesson").trim(),
        });
      });
    };

    pushSession(lesson, "Lesen & Hören");
    toArray(lesson.lesen_hören).forEach((item) => pushSession(item, "Lesen & Hören"));
    toArray(lesson.schreiben_sprechen).forEach((item) => pushSession(item, "Schreiben & Sprechen"));
  });

  return sequence;
};

const listClassDates = ({ startDate, endDate, weekdays = [] }) => {
  const allowed = new Set(weekdays);
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  const dates = [];

  for (const current = new Date(start); current <= end; current.setDate(current.getDate() + 1)) {
    const weekday = WEEKDAY_NAMES[current.getDay()];
    if (!allowed.has(weekday)) continue;
    dates.push({ date: toDateString(current), weekday });
  }

  return dates;
};

const distributeSessionsAcrossDates = (dates = [], sessions = []) => {
  if (!dates.length || !sessions.length) return [];

  const mapped = [];
  let sessionIndex = 0;

  dates.forEach((dateEntry, idx) => {
    const remainingSessions = sessions.length - sessionIndex;
    const remainingDays = dates.length - idx;
    const takeCount = remainingSessions > 0 ? Math.ceil(remainingSessions / Math.max(remainingDays, 1)) : 0;
    const daySessions = sessions.slice(sessionIndex, sessionIndex + takeCount);
    sessionIndex += takeCount;
    if (!daySessions.length) return;

    mapped.push({
      dayNumber: mapped.length + 1,
      date: dateEntry.date,
      weekday: dateEntry.weekday,
      sessions: daySessions,
    });
  });

  return mapped;
};

const buildScheduleForClass = (className, meta) => {
  const level = extractLevel(className);
  const sequence = extractAssignmentSequenceForLevel(level);
  const dates = listClassDates({
    startDate: meta.startDate,
    endDate: meta.endDate,
    weekdays: (meta.schedule || []).map((slot) => slot.day),
  });

  const days = distributeSessionsAcrossDates(dates, sequence);

  return {
    course: level,
    title: `Course Schedule: ${level || "Class"}`,
    className,
    startDateIso: meta.startDate,
    endDateIso: meta.endDate,
    timezone: "Africa/Accra",
    days,
    generatedNote: "Auto-generated from class date range, weekdays, and assignment dictionary.",
  };
};

const courseSchedulesByName = Object.fromEntries(
  Object.entries(classCatalog).map(([className, meta]) => [className, buildScheduleForClass(className, meta)])
);

module.exports = { courseSchedulesByName };
