import { classCatalog } from "./classCatalog";
import {
  getAssignmentDictionaryEntry,
  getAssignmentDisplayTitle,
  getAssignmentDisplayType,
  getAssignmentSequenceForLevel,
} from "./germanAssignmentCatalog";

const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const toDateString = (date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const buildWeeklyClassDays = ({ startDate, endDate, weekdays, sessionTemplate }) => {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  const days = [];
  let dayNumber = 1;

  for (const current = new Date(start); current <= end; current.setDate(current.getDate() + 1)) {
    const weekday = WEEKDAY_NAMES[current.getDay()];
    if (!weekdays.includes(weekday)) continue;

    days.push({
      dayNumber,
      date: toDateString(current),
      weekday,
      sessions: sessionTemplate ? [{ ...sessionTemplate }] : [],
    });
    dayNumber += 1;
  }

  return days;
};

const rawCourseSchedulesByName = {
  "A1 Stuttgart Klasse": {
    course: "A1",
    title: "Course Schedule: A1",
    className: "A1 Stuttgart Klasse",
    startDateIso: "2026-01-14",
    startDateHuman: "Wednesday, 14 January 2026",
    timezone: "Africa/Accra",
    days: [
      {
        dayNumber: 1,
        date: "2026-01-14",
        weekday: "Wednesday",
        sessions: [{ chapter: "0.1", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 2,
        date: "2026-01-15",
        weekday: "Thursday",
        sessions: [
          { chapter: "0.2", type: "Lesen & Hören" },
          { chapter: "1.1", type: "Lesen & Hören" },
        ],
      },
      {
        dayNumber: 3,
        date: "2026-01-16",
        weekday: "Friday",
        sessions: [
          { chapter: "1.1", type: "Schreiben & Sprechen" },
          { chapter: "1.2", type: "Lesen & Hören" },
        ],
      },
      {
        dayNumber: 4,
        date: "2026-01-21",
        weekday: "Wednesday",
        sessions: [{ chapter: "2", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 5,
        date: "2026-01-22",
        weekday: "Thursday",
        sessions: [
          { chapter: "1.2", type: "Schreiben & Sprechen", note: "Recap" },
        ],
      },
      {
        dayNumber: 6,
        date: "2026-01-23",
        weekday: "Friday",
        sessions: [{ chapter: "2.3", type: "Schreiben & Sprechen" }],
      },
      {
        dayNumber: 7,
        date: "2026-01-28",
        weekday: "Wednesday",
        sessions: [{ chapter: "3", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 8,
        date: "2026-01-29",
        weekday: "Thursday",
        sessions: [{ chapter: "4", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 9,
        date: "2026-01-30",
        weekday: "Friday",
        sessions: [{ chapter: "5", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 10,
        date: "2026-02-04",
        weekday: "Wednesday",
        sessions: [
          { chapter: "6", type: "Lesen & Hören" },
          { chapter: "2.4", type: "Schreiben & Sprechen" },
        ],
      },
      {
        dayNumber: 11,
        date: "2026-02-05",
        weekday: "Thursday",
        sessions: [{ chapter: "7", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 12,
        date: "2026-02-06",
        weekday: "Friday",
        sessions: [{ chapter: "8", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 13,
        date: "2026-02-11",
        weekday: "Wednesday",
        sessions: [{ chapter: "3.5", type: "Schreiben & Sprechen" }],
      },
      {
        dayNumber: 14,
        date: "2026-02-12",
        weekday: "Thursday",
        sessions: [{ chapter: "3.6", type: "Schreiben & Sprechen" }],
      },
      {
        dayNumber: 15,
        date: "2026-02-13",
        weekday: "Friday",
        sessions: [{ chapter: "4.7", type: "Schreiben & Sprechen" }],
      },
      {
        dayNumber: 16,
        date: "2026-02-18",
        weekday: "Wednesday",
        sessions: [
          { chapter: "9", type: "Lesen & Hören" },
          { chapter: "10", type: "Lesen & Hören" },
        ],
      },
      {
        dayNumber: 17,
        date: "2026-02-19",
        weekday: "Thursday",
        sessions: [{ chapter: "11", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 18,
        date: "2026-02-20",
        weekday: "Friday",
        sessions: [
          { chapter: "12.1", type: "Lesen & Hören" },
          { chapter: "12.1", type: "Schreiben & Sprechen", note: "including 5.8" },
        ],
      },
      {
        dayNumber: 19,
        date: "2026-02-25",
        weekday: "Wednesday",
        sessions: [{ chapter: "5.9", type: "Schreiben & Sprechen" }],
      },
      {
        dayNumber: 20,
        date: "2026-02-26",
        weekday: "Thursday",
        sessions: [
          { chapter: "6.10", type: "Schreiben & Sprechen", note: "Intro to letter writing" },
        ],
      },
      {
        dayNumber: 21,
        date: "2026-02-27",
        weekday: "Friday",
        sessions: [
          { chapter: "13", type: "Lesen & Hören" },
          { chapter: "6.11", type: "Schreiben & Sprechen" },
        ],
      },
      {
        dayNumber: 22,
        date: "2026-03-04",
        weekday: "Wednesday",
        sessions: [
          { chapter: "14.1", type: "Lesen & Hören" },
          { chapter: "7.12", type: "Schreiben & Sprechen" },
        ],
      },
      {
        dayNumber: 23,
        date: "2026-03-05",
        weekday: "Thursday",
        sessions: [
          { chapter: "14.2", type: "Lesen & Hören" },
          { chapter: "7.12", type: "Schreiben & Sprechen" },
        ],
      },
      {
        dayNumber: 24,
        date: "2026-03-06",
        weekday: "Friday",
        sessions: [{ chapter: "8.13", type: "Schreiben & Sprechen" }],
      },
      {
        dayNumber: 25,
        date: "2026-03-11",
        weekday: "Wednesday",
        sessions: [
          { chapter: "Exam tips", type: "Schreiben & Sprechen", note: "Recap" },
        ],
      },
    ],
    generatedNote: "Schedule generated by Learn Language Education Academy.",
  },
  "A1 Berlin Klasse": {
    course: "A1",
    title: "Course Schedule: A1",
    className: "A1 Berlin Klasse",
    startDateIso: "2026-02-18",
    startDateHuman: "Wednesday, 18 February 2026",
    timezone: "Africa/Accra",
    days: [
      {
        dayNumber: 1,
        date: "2026-02-18",
        weekday: "Wednesday",
        sessions: [{ chapter: "0.1", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 2,
        date: "2026-02-23",
        weekday: "Monday",
        sessions: [
          { chapter: "0.2", type: "Lesen & Hören" },
          { chapter: "1.1", type: "Lesen & Hören" },
        ],
      },
      {
        dayNumber: 3,
        date: "2026-02-24",
        weekday: "Tuesday",
        sessions: [
          { chapter: "1.1", type: "Schreiben & Sprechen" },
          { chapter: "1.2", type: "Lesen & Hören" },
        ],
      },
      {
        dayNumber: 4,
        date: "2026-02-25",
        weekday: "Wednesday",
        sessions: [{ chapter: "2", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 5,
        date: "2026-03-02",
        weekday: "Monday",
        sessions: [
          { chapter: "1.2", type: "Schreiben & Sprechen", note: "Recap" },
        ],
      },
      {
        dayNumber: 6,
        date: "2026-03-03",
        weekday: "Tuesday",
        sessions: [{ chapter: "2.3", type: "Schreiben & Sprechen" }],
      },
      {
        dayNumber: 7,
        date: "2026-03-04",
        weekday: "Wednesday",
        sessions: [{ chapter: "3", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 8,
        date: "2026-03-09",
        weekday: "Monday",
        sessions: [{ chapter: "4", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 9,
        date: "2026-03-10",
        weekday: "Tuesday",
        sessions: [{ chapter: "5", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 10,
        date: "2026-03-11",
        weekday: "Wednesday",
        sessions: [
          { chapter: "6", type: "Lesen & Hören" },
          { chapter: "2.4", type: "Schreiben & Sprechen" },
        ],
      },
      {
        dayNumber: 11,
        date: "2026-03-16",
        weekday: "Monday",
        sessions: [{ chapter: "7", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 12,
        date: "2026-03-17",
        weekday: "Tuesday",
        sessions: [{ chapter: "8", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 13,
        date: "2026-03-18",
        weekday: "Wednesday",
        sessions: [{ chapter: "3.5", type: "Schreiben & Sprechen" }],
      },
      {
        dayNumber: 14,
        date: "2026-03-23",
        weekday: "Monday",
        sessions: [{ chapter: "3.6", type: "Schreiben & Sprechen" }],
      },
      {
        dayNumber: 15,
        date: "2026-03-24",
        weekday: "Tuesday",
        sessions: [{ chapter: "4.7", type: "Schreiben & Sprechen" }],
      },
      {
        dayNumber: 16,
        date: "2026-03-25",
        weekday: "Wednesday",
        sessions: [
          { chapter: "9", type: "Lesen & Hören" },
          { chapter: "10", type: "Lesen & Hören" },
        ],
      },
      {
        dayNumber: 17,
        date: "2026-03-30",
        weekday: "Monday",
        sessions: [{ chapter: "11", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 18,
        date: "2026-03-31",
        weekday: "Tuesday",
        sessions: [
          { chapter: "12.1", type: "Lesen & Hören" },
          { chapter: "5.8", type: "Schreiben & Sprechen", note: "including 5.8" },
        ],
      },
      {
        dayNumber: 19,
        date: "2026-04-01",
        weekday: "Wednesday",
        sessions: [{ chapter: "5.9", type: "Schreiben & Sprechen" }],
      },
      {
        dayNumber: 20,
        date: "2026-04-06",
        weekday: "Monday",
        sessions: [
          { chapter: "6.10", type: "Schreiben & Sprechen", note: "Intro to letter writing" },
        ],
      },
      {
        dayNumber: 21,
        date: "2026-04-07",
        weekday: "Tuesday",
        sessions: [
          { chapter: "13", type: "Lesen & Hören" },
          { chapter: "6.11", type: "Schreiben & Sprechen" },
        ],
      },
      {
        dayNumber: 22,
        date: "2026-04-08",
        weekday: "Wednesday",
        sessions: [
          { chapter: "14.1", type: "Lesen & Hören" },
          { chapter: "7.12", type: "Schreiben & Sprechen" },
        ],
      },
      {
        dayNumber: 23,
        date: "2026-04-13",
        weekday: "Monday",
        sessions: [
          { chapter: "14.2", type: "Lesen & Hören" },
          { chapter: "7.12", type: "Schreiben & Sprechen" },
        ],
      },
      {
        dayNumber: 24,
        date: "2026-04-14",
        weekday: "Tuesday",
        sessions: [{ chapter: "8.13", type: "Schreiben & Sprechen" }],
      },
    ],
    generatedNote: "Schedule generated by Learn Language Education Academy.",
  },
  "A1 Dortmund Klasse": {
    course: "A1",
    title: "Course Schedule: A1",
    className: "A1 Dortmund Klasse",
    startDateIso: "2026-03-09",
    startDateHuman: "Monday, 9 March 2026",
    timezone: "Africa/Accra",
    days: [
      {
        dayNumber: 1,
        date: "2026-03-09",
        weekday: "Monday",
        sessions: [{ chapter: "0.1", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 2,
        date: "2026-03-10",
        weekday: "Tuesday",
        sessions: [
          { chapter: "0.2", type: "Lesen & Hören" },
          { chapter: "1.1", type: "Lesen & Hören" },
        ],
      },
      {
        dayNumber: 3,
        date: "2026-03-11",
        weekday: "Wednesday",
        sessions: [
          { chapter: "1.1", type: "Schreiben & Sprechen" },
          { chapter: "1.2", type: "Lesen & Hören" },
        ],
      },
      {
        dayNumber: 4,
        date: "2026-03-16",
        weekday: "Monday",
        sessions: [{ chapter: "2", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 5,
        date: "2026-03-17",
        weekday: "Tuesday",
        sessions: [
          { chapter: "1.2", type: "Schreiben & Sprechen", note: "Recap" },
        ],
      },
      {
        dayNumber: 6,
        date: "2026-03-18",
        weekday: "Wednesday",
        sessions: [{ chapter: "2.3", type: "Schreiben & Sprechen" }],
      },
      {
        dayNumber: 7,
        date: "2026-03-23",
        weekday: "Monday",
        sessions: [{ chapter: "3", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 8,
        date: "2026-03-24",
        weekday: "Tuesday",
        sessions: [{ chapter: "4", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 9,
        date: "2026-03-25",
        weekday: "Wednesday",
        sessions: [{ chapter: "5", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 10,
        date: "2026-03-30",
        weekday: "Monday",
        sessions: [
          { chapter: "6", type: "Lesen & Hören" },
          { chapter: "2.4", type: "Schreiben & Sprechen" },
        ],
      },
      {
        dayNumber: 11,
        date: "2026-03-31",
        weekday: "Tuesday",
        sessions: [{ chapter: "7", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 12,
        date: "2026-04-01",
        weekday: "Wednesday",
        sessions: [{ chapter: "8", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 13,
        date: "2026-04-06",
        weekday: "Monday",
        sessions: [{ chapter: "3.5", type: "Schreiben & Sprechen" }],
      },
      {
        dayNumber: 14,
        date: "2026-04-07",
        weekday: "Tuesday",
        sessions: [{ chapter: "3.6", type: "Schreiben & Sprechen" }],
      },
      {
        dayNumber: 15,
        date: "2026-04-08",
        weekday: "Wednesday",
        sessions: [{ chapter: "4.7", type: "Schreiben & Sprechen" }],
      },
      {
        dayNumber: 16,
        date: "2026-04-13",
        weekday: "Monday",
        sessions: [
          { chapter: "9", type: "Lesen & Hören" },
          { chapter: "10", type: "Lesen & Hören" },
        ],
      },
      {
        dayNumber: 17,
        date: "2026-04-14",
        weekday: "Tuesday",
        sessions: [{ chapter: "11", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 18,
        date: "2026-04-15",
        weekday: "Wednesday",
        sessions: [
          { chapter: "12.1", type: "Lesen & Hören" },
          { chapter: "5.8", type: "Schreiben & Sprechen", note: "including 5.8" },
        ],
      },
      {
        dayNumber: 19,
        date: "2026-04-20",
        weekday: "Monday",
        sessions: [{ chapter: "5.9", type: "Schreiben & Sprechen" }],
      },
      {
        dayNumber: 20,
        date: "2026-04-21",
        weekday: "Tuesday",
        sessions: [
          { chapter: "6.10", type: "Schreiben & Sprechen", note: "Intro to letter writing" },
        ],
      },
      {
        dayNumber: 21,
        date: "2026-04-22",
        weekday: "Wednesday",
        sessions: [
          { chapter: "13", type: "Lesen & Hören" },
          { chapter: "6.11", type: "Schreiben & Sprechen" },
        ],
      },
      {
        dayNumber: 22,
        date: "2026-04-27",
        weekday: "Monday",
        sessions: [
          { chapter: "14.1", type: "Lesen & Hören" },
          { chapter: "7.12", type: "Schreiben & Sprechen" },
        ],
      },
      {
        dayNumber: 23,
        date: "2026-04-28",
        weekday: "Tuesday",
        sessions: [
          { chapter: "14.2", type: "Lesen & Hören" },
          { chapter: "7.12", type: "Schreiben & Sprechen" },
        ],
      },
      {
        dayNumber: 24,
        date: "2026-04-29",
        weekday: "Wednesday",
        sessions: [{ chapter: "8.13", type: "Schreiben & Sprechen" }],
      },
    ],
  },
  "A1 Koln Klasse": {
    course: "A1",
    title: "Course Schedule: A1",
    className: "A1 Koln Klasse",
    startDateIso: "2026-04-20",
    startDateHuman: "Monday, 20 April 2026",
    timezone: "Africa/Accra",
    orientationDateIso: "2026-04-15",
    orientationDateHuman: "Wednesday, 15 April 2026",
    days: [
      {
        dayNumber: 1,
        date: "2026-04-20",
        weekday: "Monday",
        sessions: [{ chapter: "0.1", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 2,
        date: "2026-04-21",
        weekday: "Tuesday",
        sessions: [
          { chapter: "0.2", type: "Lesen & Hören" },
          { chapter: "1.1", type: "Lesen & Hören" },
        ],
      },
      {
        dayNumber: 3,
        date: "2026-04-22",
        weekday: "Wednesday",
        sessions: [
          { chapter: "1.1", type: "Schreiben & Sprechen" },
          { chapter: "1.2", type: "Lesen & Hören" },
        ],
      },
      {
        dayNumber: 4,
        date: "2026-04-27",
        weekday: "Monday",
        sessions: [{ chapter: "2", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 5,
        date: "2026-04-28",
        weekday: "Tuesday",
        sessions: [
          { chapter: "1.2", type: "Schreiben & Sprechen", note: "Recap" },
        ],
      },
      {
        dayNumber: 6,
        date: "2026-04-29",
        weekday: "Wednesday",
        sessions: [{ chapter: "2.3", type: "Schreiben & Sprechen" }],
      },
      {
        dayNumber: 7,
        date: "2026-05-04",
        weekday: "Monday",
        sessions: [{ chapter: "3", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 8,
        date: "2026-05-05",
        weekday: "Tuesday",
        sessions: [{ chapter: "4", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 9,
        date: "2026-05-06",
        weekday: "Wednesday",
        sessions: [{ chapter: "5", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 10,
        date: "2026-05-11",
        weekday: "Monday",
        sessions: [
          { chapter: "6", type: "Lesen & Hören" },
          { chapter: "2.4", type: "Schreiben & Sprechen" },
        ],
      },
      {
        dayNumber: 11,
        date: "2026-05-12",
        weekday: "Tuesday",
        sessions: [{ chapter: "7", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 12,
        date: "2026-05-13",
        weekday: "Wednesday",
        sessions: [{ chapter: "8", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 13,
        date: "2026-05-18",
        weekday: "Monday",
        sessions: [{ chapter: "3.5", type: "Schreiben & Sprechen" }],
      },
      {
        dayNumber: 14,
        date: "2026-05-19",
        weekday: "Tuesday",
        sessions: [{ chapter: "3.6", type: "Schreiben & Sprechen" }],
      },
      {
        dayNumber: 15,
        date: "2026-05-20",
        weekday: "Wednesday",
        sessions: [{ chapter: "4.7", type: "Schreiben & Sprechen" }],
      },
      {
        dayNumber: 16,
        date: "2026-05-25",
        weekday: "Monday",
        sessions: [
          { chapter: "9", type: "Lesen & Hören" },
          { chapter: "10", type: "Lesen & Hören" },
        ],
      },
      {
        dayNumber: 17,
        date: "2026-05-26",
        weekday: "Tuesday",
        sessions: [{ chapter: "11", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 18,
        date: "2026-05-27",
        weekday: "Wednesday",
        sessions: [
          { chapter: "12.1", type: "Lesen & Hören" },
          { chapter: "12.1", type: "Schreiben & Sprechen", note: "including 5.8" },
        ],
      },
      {
        dayNumber: 19,
        date: "2026-06-01",
        weekday: "Monday",
        sessions: [{ chapter: "5.9", type: "Schreiben & Sprechen" }],
      },
      {
        dayNumber: 20,
        date: "2026-06-02",
        weekday: "Tuesday",
        sessions: [
          { chapter: "6.10", type: "Schreiben & Sprechen", note: "Intro to letter writing" },
        ],
      },
      {
        dayNumber: 21,
        date: "2026-06-03",
        weekday: "Wednesday",
        sessions: [
          { chapter: "13", type: "Lesen & Hören" },
          { chapter: "6.11", type: "Schreiben & Sprechen" },
        ],
      },
      {
        dayNumber: 22,
        date: "2026-06-08",
        weekday: "Monday",
        sessions: [
          { chapter: "14.1", type: "Lesen & Hören" },
          { chapter: "7.12", type: "Schreiben & Sprechen" },
        ],
      },
      {
        dayNumber: 23,
        date: "2026-06-09",
        weekday: "Tuesday",
        sessions: [
          { chapter: "14.2", type: "Lesen & Hören" },
          { chapter: "7.12", type: "Schreiben & Sprechen" },
        ],
      },
      {
        dayNumber: 24,
        date: "2026-06-10",
        weekday: "Wednesday",
        sessions: [{ chapter: "8.13", type: "Schreiben & Sprechen" }],
      },
    ],
    generatedNote: "Schedule generated by Learn Language Education Academy.",
  },
  "A2 Stuttgart Klasse": {
    course: "A2",
    title: "Course Schedule: A2",
    className: "A2 Stuttgart Klasse",
    startDateIso: "2026-03-02",
    startDateHuman: "Monday, 02 March 2026",
    timezone: "Africa/Accra",
    days: [
      {
        dayNumber: 1,
        date: "2026-03-02",
        weekday: "Monday",
        sessions: [{ chapter: "1.1", type: "Small Talk", note: "Exercise" }],
      },
      {
        dayNumber: 2,
        date: "2026-03-03",
        weekday: "Tuesday",
        sessions: [{ chapter: "1.2", type: "Personen Beschreiben", note: "Exercise" }],
      },
      {
        dayNumber: 3,
        date: "2026-03-04",
        weekday: "Wednesday",
        sessions: [{ chapter: "1.3", type: "Dinge und Personen vergleichen" }],
      },
      {
        dayNumber: 4,
        date: "2026-03-09",
        weekday: "Monday",
        sessions: [{ chapter: "2.4", type: "Wo möchten wir uns treffen?" }],
      },
      {
        dayNumber: 5,
        date: "2026-03-10",
        weekday: "Tuesday",
        sessions: [{ chapter: "2.5", type: "Was machst du in deiner Freizeit?" }],
      },
      {
        dayNumber: 6,
        date: "2026-03-11",
        weekday: "Wednesday",
        sessions: [{ chapter: "3.6", type: "Möbel und Räume kennenlernen" }],
      },
      {
        dayNumber: 7,
        date: "2026-03-16",
        weekday: "Monday",
        sessions: [{ chapter: "3.7", type: "Eine Wohnung suchen", note: "Übung" }],
      },
      {
        dayNumber: 8,
        date: "2026-03-17",
        weekday: "Tuesday",
        sessions: [{ chapter: "3.8", type: "Rezepte und Essen", note: "Exercise" }],
      },
      {
        dayNumber: 9,
        date: "2026-03-18",
        weekday: "Wednesday",
        sessions: [{ chapter: "4.9", type: "Urlaub" }],
      },
      {
        dayNumber: 10,
        date: "2026-03-23",
        weekday: "Monday",
        sessions: [{ chapter: "4.10", type: "Tourismus und Traditionelle Feste" }],
      },
      {
        dayNumber: 11,
        date: "2026-03-24",
        weekday: "Tuesday",
        sessions: [{ chapter: "4.11", type: "Unterwegs: Verkehrsmittel vergleichen" }],
      },
      {
        dayNumber: 12,
        date: "2026-03-25",
        weekday: "Wednesday",
        sessions: [{ chapter: "5.12", type: "Ein Tag im Leben", note: "Übung" }],
      },
      {
        dayNumber: 13,
        date: "2026-03-30",
        weekday: "Monday",
        sessions: [{ chapter: "5.13", type: "Ein Vorstellungsgesprach", note: "Exercise" }],
      },
      {
        dayNumber: 14,
        date: "2026-03-31",
        weekday: "Tuesday",
        sessions: [{ chapter: "5.14", type: "Beruf und Karriere", note: "Exercise" }],
      },
      {
        dayNumber: 15,
        date: "2026-04-01",
        weekday: "Wednesday",
        sessions: [{ chapter: "6.15", type: "Mein Lieblingssport" }],
      },
      {
        dayNumber: 16,
        date: "2026-04-06",
        weekday: "Monday",
        sessions: [{ chapter: "6.16", type: "Wohlbefinden und Entspannung" }],
      },
      {
        dayNumber: 17,
        date: "2026-04-07",
        weekday: "Tuesday",
        sessions: [{ chapter: "6.17", type: "In die Apotheke gehen" }],
      },
      {
        dayNumber: 18,
        date: "2026-04-08",
        weekday: "Wednesday",
        sessions: [{ chapter: "7.18", type: "Die Bank Anrufen" }],
      },
      {
        dayNumber: 19,
        date: "2026-04-13",
        weekday: "Monday",
        sessions: [{ chapter: "7.19", type: "Einkaufen – Wo und wie?", note: "Exercise" }],
      },
      {
        dayNumber: 20,
        date: "2026-04-14",
        weekday: "Tuesday",
        sessions: [{ chapter: "7.20", type: "Typische Reklamationssituationen üben" }],
      },
      {
        dayNumber: 21,
        date: "2026-04-15",
        weekday: "Wednesday",
        sessions: [{ chapter: "8.21", type: "Ein Wochenende planen" }],
      },
      {
        dayNumber: 22,
        date: "2026-04-20",
        weekday: "Monday",
        sessions: [{ chapter: "8.22", type: "Die Woche Plannung" }],
      },
      {
        dayNumber: 23,
        date: "2026-04-21",
        weekday: "Tuesday",
        sessions: [{ chapter: "9.23", type: "Wie kommst du zur Schule / zur Arbeit?" }],
      },
      {
        dayNumber: 24,
        date: "2026-04-22",
        weekday: "Wednesday",
        sessions: [{ chapter: "9.24", type: "Einen Urlaub planen" }],
      },
      {
        dayNumber: 25,
        date: "2026-04-27",
        weekday: "Monday",
        sessions: [{ chapter: "9.25", type: "Tagesablauf", note: "Exercise" }],
      },
      {
        dayNumber: 26,
        date: "2026-04-28",
        weekday: "Tuesday",
        sessions: [{ chapter: "10.26", type: "Gefühle in verschiedenen Situationen beschr" }],
      },
      {
        dayNumber: 27,
        date: "2026-04-29",
        weekday: "Wednesday",
        sessions: [{ chapter: "10.27", type: "Digitale Kommunikation" }],
      },
      {
        dayNumber: 28,
        date: "2026-05-04",
        weekday: "Monday",
        sessions: [{ chapter: "10.28", type: "Über die Zukunft sprechen" }],
      },
    ],
    generatedNote: "Schedule generated by Learn Language Education Academy.",
  },
  "A1 Munich Klasse": {
    course: "A1",
    title: "Course Schedule: A1",
    className: "A1 Munich Klasse",
    startDateIso: "2025-12-03",
    startDateHuman: "Wednesday, 3 December 2025",
    timezone: "Africa/Accra",
    days: [
      {
        dayNumber: 1,
        date: "2025-12-03",
        weekday: "Wednesday",
        sessions: [{ chapter: "0.1", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 2,
        date: "2025-12-08",
        weekday: "Monday",
        sessions: [
          { chapter: "0.2", type: "Lesen & Hören" },
          { chapter: "1.1", type: "Lesen & Hören" },
        ],
      },
      {
        dayNumber: 3,
        date: "2025-12-09",
        weekday: "Tuesday",
        sessions: [
          { chapter: "1.1", type: "Schreiben & Sprechen" },
          { chapter: "1.2", type: "Lesen & Hören" },
        ],
      },
      {
        dayNumber: 4,
        date: "2025-12-10",
        weekday: "Wednesday",
        sessions: [{ chapter: "2", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 5,
        date: "2025-12-15",
        weekday: "Monday",
        sessions: [
          { chapter: "1.2", type: "Schreiben & Sprechen", note: "Recap" },
        ],
      },
      {
        dayNumber: 6,
        date: "2025-12-16",
        weekday: "Tuesday",
        sessions: [{ chapter: "2.3", type: "Schreiben & Sprechen" }],
      },
      {
        dayNumber: 7,
        date: "2025-12-17",
        weekday: "Wednesday",
        sessions: [{ chapter: "3", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 8,
        date: "2025-12-22",
        weekday: "Monday",
        sessions: [{ chapter: "4", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 9,
        date: "2025-12-23",
        weekday: "Tuesday",
        sessions: [{ chapter: "5", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 10,
        date: "2025-12-24",
        weekday: "Wednesday",
        sessions: [
          { chapter: "6", type: "Lesen & Hören" },
          { chapter: "2.4", type: "Schreiben & Sprechen" },
        ],
      },
      {
        dayNumber: 11,
        date: "2025-12-29",
        weekday: "Monday",
        sessions: [{ chapter: "7", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 12,
        date: "2025-12-30",
        weekday: "Tuesday",
        sessions: [{ chapter: "8", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 13,
        date: "2025-12-31",
        weekday: "Wednesday",
        sessions: [{ chapter: "3.5", type: "Schreiben & Sprechen" }],
      },
      {
        dayNumber: 14,
        date: "2026-01-05",
        weekday: "Monday",
        sessions: [{ chapter: "3.6", type: "Schreiben & Sprechen" }],
      },
      {
        dayNumber: 15,
        date: "2026-01-06",
        weekday: "Tuesday",
        sessions: [{ chapter: "4.7", type: "Schreiben & Sprechen" }],
      },
      {
        dayNumber: 16,
        date: "2026-01-07",
        weekday: "Wednesday",
        sessions: [
          { chapter: "9", type: "Lesen & Hören" },
          { chapter: "10", type: "Lesen & Hören" },
        ],
      },
      {
        dayNumber: 17,
        date: "2026-01-12",
        weekday: "Monday",
        sessions: [{ chapter: "11", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 18,
        date: "2026-01-13",
        weekday: "Tuesday",
        sessions: [
          { chapter: "12.1", type: "Lesen & Hören" },
          { chapter: "12.1", type: "Schreiben & Sprechen", note: "including 5.8" },
        ],
      },
      {
        dayNumber: 19,
        date: "2026-01-14",
        weekday: "Wednesday",
        sessions: [{ chapter: "5.9", type: "Schreiben & Sprechen" }],
      },
      {
        dayNumber: 20,
        date: "2026-01-19",
        weekday: "Monday",
        sessions: [
          { chapter: "6.10", type: "Schreiben & Sprechen", note: "Intro to letter writing" },
        ],
      },
      {
        dayNumber: 21,
        date: "2026-01-20",
        weekday: "Tuesday",
        sessions: [
          { chapter: "13", type: "Lesen & Hören" },
          { chapter: "6.11", type: "Schreiben & Sprechen" },
        ],
      },
      {
        dayNumber: 22,
        date: "2026-01-21",
        weekday: "Wednesday",
        sessions: [
          { chapter: "14.1", type: "Lesen & Hören" },
          { chapter: "7.12", type: "Schreiben & Sprechen" },
        ],
      },
      {
        dayNumber: 23,
        date: "2026-01-26",
        weekday: "Monday",
        sessions: [
          { chapter: "14.2", type: "Lesen & Hören" },
          { chapter: "7.12", type: "Schreiben & Sprechen" },
        ],
      },
      {
        dayNumber: 24,
        date: "2026-01-27",
        weekday: "Tuesday",
        sessions: [{ chapter: "8.13", type: "Schreiben & Sprechen" }],
      },
      {
        dayNumber: 25,
        date: "2026-01-28",
        weekday: "Wednesday",
        sessions: [
          { chapter: "Exam tips", type: "Schreiben & Sprechen", note: "Recap" },
        ],
      },
    ],
  },
  "A2 Bonn Klasse": {
    course: "A2",
    title: "Course Schedule: A2",
    className: "A2 Bonn Klasse",
    startDateIso: "2025-11-25",
    startDateHuman: "Tuesday, 25 November 2025",
    timezone: "Africa/Accra",
    days: [
      { dayNumber: 1, date: "2025-11-25", weekday: "Tuesday", sessions: [{ title: "1.1. Small Talk (Exercise)" }] },
      { dayNumber: 2, date: "2025-11-26", weekday: "Wednesday", sessions: [{ title: "1.2. Personen Beschreiben (Exercise)" }] },
      { dayNumber: 3, date: "2025-12-01", weekday: "Monday", sessions: [{ title: "1.3. Dinge und Personen vergleichen" }] },
      { dayNumber: 4, date: "2025-12-02", weekday: "Tuesday", sessions: [{ title: "2.4. Wo möchten wir uns treffen?" }] },
      { dayNumber: 5, date: "2025-12-03", weekday: "Wednesday", sessions: [{ title: "2.5. Was machst du in deiner Freizeit?" }] },
      { dayNumber: 6, date: "2025-12-08", weekday: "Monday", sessions: [{ title: "3.6. Möbel und Räume kennenlernen" }] },
      { dayNumber: 7, date: "2025-12-09", weekday: "Tuesday", sessions: [{ title: "3.7. Eine Wohnung suchen (Übung)" }] },
      { dayNumber: 8, date: "2025-12-10", weekday: "Wednesday", sessions: [{ title: "3.8. Rezepte und Essen (Exercise)" }] },
      { dayNumber: 9, date: "2025-12-15", weekday: "Monday", sessions: [{ title: "4.9. Urlaub" }] },
      { dayNumber: 10, date: "2025-12-16", weekday: "Tuesday", sessions: [{ title: "4.10. Tourismus und Traditionelle Feste" }] },
      { dayNumber: 11, date: "2026-01-05", weekday: "Monday", sessions: [{ title: "4.11. Unterwegs: Verkehrsmittel vergleichen" }] },
      { dayNumber: 12, date: "2026-01-06", weekday: "Tuesday", sessions: [{ title: "5.12. Ein Tag im Leben (Übung)" }] },
      { dayNumber: 13, date: "2026-01-07", weekday: "Wednesday", sessions: [{ title: "5.13. Ein Vorstellungsgesprach (Exercise)" }] },
      { dayNumber: 14, date: "2026-01-12", weekday: "Monday", sessions: [{ title: "5.14. Beruf und Karriere (Exercise)" }] },
      { dayNumber: 15, date: "2026-01-13", weekday: "Tuesday", sessions: [{ title: "6.15. Mein Lieblingssport" }] },
      { dayNumber: 16, date: "2026-01-14", weekday: "Wednesday", sessions: [{ title: "6.16. Wohlbefinden und Entspannung" }] },
      { dayNumber: 17, date: "2026-01-19", weekday: "Monday", sessions: [{ title: "6.17. In die Apotheke gehen" }] },
      { dayNumber: 18, date: "2026-01-20", weekday: "Tuesday", sessions: [{ title: "7.18. Die Bank Anrufen" }] },
      { dayNumber: 19, date: "2026-01-21", weekday: "Wednesday", sessions: [{ title: "7.19. Einkaufen – Wo und wie? (Exercise)" }] },
      { dayNumber: 20, date: "2026-01-26", weekday: "Monday", sessions: [{ title: "7.20. Typische Reklamationssituationen üben" }] },
      { dayNumber: 21, date: "2026-01-27", weekday: "Tuesday", sessions: [{ title: "8.21. Ein Wochenende planen" }] },
      { dayNumber: 22, date: "2026-01-28", weekday: "Wednesday", sessions: [{ title: "8.22. Die Woche Plannung" }] },
      { dayNumber: 23, date: "2026-02-02", weekday: "Monday", sessions: [{ title: "9.23. Wie kommst du zur Schule / zur Arbeit?" }] },
      { dayNumber: 24, date: "2026-02-03", weekday: "Tuesday", sessions: [{ title: "9.24. Einen Urlaub planen" }] },
      { dayNumber: 25, date: "2026-02-04", weekday: "Wednesday", sessions: [{ title: "9.25. Tagesablauf (Exercise)" }] },
      { dayNumber: 26, date: "2026-02-09", weekday: "Monday", sessions: [{ title: "10.26. Gefühle in verschiedenen Situationen beschr" }] },
      { dayNumber: 27, date: "2026-02-10", weekday: "Tuesday", sessions: [{ title: "10.27. Digitale Kommunikation" }] },
      { dayNumber: 28, date: "2026-02-11", weekday: "Wednesday", sessions: [{ title: "10.28. Über die Zukunft sprechen" }] },
    ],
    generatedNote: "Schedule generated by Learn Language Education Academy.",
  },
  "A2 Koln Klasse": {
    course: "A2",
    title: "Course Schedule: A2",
    className: "A2 Koln Klasse",
    startDateIso: "2025-11-25",
    startDateHuman: "Tuesday, 25 November 2025",
    timezone: "Africa/Accra",
    days: [
      { dayNumber: 1, date: "2025-11-25", weekday: "Tuesday", sessions: [{ title: "1.1. Small Talk (Exercise)" }] },
      { dayNumber: 2, date: "2025-11-26", weekday: "Wednesday", sessions: [{ title: "1.2. Personen Beschreiben (Exercise)" }] },
      { dayNumber: 3, date: "2025-12-01", weekday: "Monday", sessions: [{ title: "1.3. Dinge und Personen vergleichen" }] },
      { dayNumber: 4, date: "2025-12-02", weekday: "Tuesday", sessions: [{ title: "2.4. Wo möchten wir uns treffen?" }] },
      { dayNumber: 5, date: "2025-12-03", weekday: "Wednesday", sessions: [{ title: "2.5. Was machst du in deiner Freizeit?" }] },
      { dayNumber: 6, date: "2025-12-08", weekday: "Monday", sessions: [{ title: "3.6. Möbel und Räume kennenlernen" }] },
      { dayNumber: 7, date: "2025-12-09", weekday: "Tuesday", sessions: [{ title: "3.7. Eine Wohnung suchen (Übung)" }] },
      { dayNumber: 8, date: "2025-12-10", weekday: "Wednesday", sessions: [{ title: "3.8. Rezepte und Essen (Exercise)" }] },
      { dayNumber: 9, date: "2025-12-15", weekday: "Monday", sessions: [{ title: "4.9. Urlaub" }] },
      { dayNumber: 10, date: "2025-12-16", weekday: "Tuesday", sessions: [{ title: "4.10. Tourismus und Traditionelle Feste" }] },
      { dayNumber: 11, date: "2025-12-17", weekday: "Wednesday", sessions: [{ title: "4.11. Unterwegs: Verkehrsmittel vergleichen" }] },
      { dayNumber: 12, date: "2025-12-23", weekday: "Tuesday", sessions: [{ title: "5.12. Ein Tag im Leben (Übung)" }] },
      { dayNumber: 13, date: "2026-01-05", weekday: "Monday", sessions: [{ title: "5.13. Ein Vorstellungsgesprach (Exercise)" }] },
      { dayNumber: 14, date: "2026-01-06", weekday: "Tuesday", sessions: [{ title: "5.14. Beruf und Karriere (Exercise)" }] },
      { dayNumber: 15, date: "2026-01-07", weekday: "Wednesday", sessions: [{ title: "6.15. Mein Lieblingssport" }] },
      { dayNumber: 16, date: "2026-01-12", weekday: "Monday", sessions: [{ title: "6.16. Wohlbefinden und Entspannung" }] },
      { dayNumber: 17, date: "2026-01-13", weekday: "Tuesday", sessions: [{ title: "6.17. In die Apotheke gehen" }] },
      { dayNumber: 18, date: "2026-01-14", weekday: "Wednesday", sessions: [{ title: "7.18. Die Bank Anrufen" }] },
      { dayNumber: 19, date: "2026-01-19", weekday: "Monday", sessions: [{ title: "7.19. Einkaufen – Wo und wie? (Exercise)" }] },
      { dayNumber: 20, date: "2026-01-20", weekday: "Tuesday", sessions: [{ title: "7.20. Typische Reklamationssituationen üben" }] },
      { dayNumber: 21, date: "2026-01-21", weekday: "Wednesday", sessions: [{ title: "8.21. Ein Wochenende planen" }] },
      { dayNumber: 22, date: "2026-01-26", weekday: "Monday", sessions: [{ title: "8.22. Die Woche Plannung" }] },
      { dayNumber: 23, date: "2026-01-27", weekday: "Tuesday", sessions: [{ title: "9.23. Wie kommst du zur Schule / zur Arbeit?" }] },
      { dayNumber: 24, date: "2026-01-28", weekday: "Wednesday", sessions: [{ title: "9.24. Einen Urlaub planen" }] },
      { dayNumber: 25, date: "2026-02-02", weekday: "Monday", sessions: [{ title: "9.25. Tagesablauf (Exercise)" }] },
      { dayNumber: 26, date: "2026-02-03", weekday: "Tuesday", sessions: [{ title: "10.26. Gefühle in verschiedenen Situationen beschr" }] },
      { dayNumber: 27, date: "2026-02-04", weekday: "Wednesday", sessions: [{ title: "10.27. Digitale Kommunikation" }] },
      { dayNumber: 28, date: "2026-02-09", weekday: "Monday", sessions: [{ title: "10.28. Über die Zukunft sprechen" }] },
    ],
    generatedNote: "Schedule generated by Learn Language Education Academy.",
  },
  "B1 Koln Klasse": {
    course: "B1",
    title: "Course Schedule: B1",
    className: "B1 Koln Klasse",
    startDateIso: "2025-11-20",
    startDateHuman: "Thursday, 20 November 2025",
    timezone: "Africa/Accra",
    days: [
      { dayNumber: 1, date: "2025-11-20", weekday: "Thursday", sessions: [{ title: "1.1. Traumwelten (Übung)" }] },
      { dayNumber: 2, date: "2025-11-21", weekday: "Friday", sessions: [{ title: "1.2. Freundes für Leben (Übung)" }] },
      { dayNumber: 3, date: "2025-11-27", weekday: "Thursday", sessions: [{ title: "1.3. Erfolgsgeschichten (Übung)" }] },
      { dayNumber: 4, date: "2025-11-28", weekday: "Friday", sessions: [{ title: "2.4. Wohnung suchen (Übung)" }] },
      { dayNumber: 5, date: "2025-12-04", weekday: "Thursday", sessions: [{ title: "2.5. Der Besichtigungsg termin (Übung)" }] },
      { dayNumber: 6, date: "2025-12-05", weekday: "Friday", sessions: [{ title: "2.6. Leben in der Stadt oder auf dem Land?" }] },
      { dayNumber: 7, date: "2025-12-11", weekday: "Thursday", sessions: [{ title: "3.7. Fast Food vs. Hausmannskost" }] },
      { dayNumber: 8, date: "2025-12-12", weekday: "Friday", sessions: [{ title: "3.8. Alles für die Gesundheit" }] },
      { dayNumber: 9, date: "2025-12-18", weekday: "Thursday", sessions: [{ title: "3.9. Work-Life-Balance im modernen Arbeitsumfeld" }] },
      { dayNumber: 10, date: "2025-12-19", weekday: "Friday", sessions: [{ title: "4.10. Digitale Auszeit und Selbstfürsorge" }] },
      { dayNumber: 11, date: "2026-01-15", weekday: "Thursday", sessions: [{ title: "4.11. Teamspiele und Kooperative Aktivitäten" }] },
      { dayNumber: 12, date: "2026-01-16", weekday: "Friday", sessions: [{ title: "4.12. Abenteuer in der Natur" }] },
      { dayNumber: 13, date: "2026-01-22", weekday: "Thursday", sessions: [{ title: "4.13. Eigene Filmkritik schreiben" }] },
      { dayNumber: 14, date: "2026-01-23", weekday: "Friday", sessions: [{ title: "5.14. Traditionelles vs. digitales Lernen" }] },
      { dayNumber: 15, date: "2026-01-29", weekday: "Thursday", sessions: [{ title: "5.15. Medien und Arbeiten im Homeoffice" }] },
      { dayNumber: 16, date: "2026-01-30", weekday: "Friday", sessions: [{ title: "5.16. Prüfungsangst und Stressbewältigung" }] },
      { dayNumber: 17, date: "2026-02-05", weekday: "Thursday", sessions: [{ title: "5.17. Wie lernt man am besten?" }] },
      { dayNumber: 18, date: "2026-02-06", weekday: "Friday", sessions: [{ title: "6.18. Wege zum Wunschberuf" }] },
      { dayNumber: 19, date: "2026-02-12", weekday: "Thursday", sessions: [{ title: "6.19. Das Vorstellungsgespräch" }] },
      { dayNumber: 20, date: "2026-02-13", weekday: "Friday", sessions: [{ title: "6.20. Wie wird man …? (Ausbildung und Qu)" }] },
      { dayNumber: 21, date: "2026-02-19", weekday: "Thursday", sessions: [{ title: "7.21. Lebensformen heute – Familie, Wohnge" }] },
      { dayNumber: 22, date: "2026-02-20", weekday: "Friday", sessions: [{ title: "7.22. Was ist dir in einer Beziehung wichtig?" }] },
      { dayNumber: 23, date: "2026-02-26", weekday: "Thursday", sessions: [{ title: "7.23. Erstes Date – Typische Situationen" }] },
      { dayNumber: 24, date: "2026-02-27", weekday: "Friday", sessions: [{ title: "8.24. Konsum und Nachhaltigkeit" }] },
      { dayNumber: 25, date: "2026-03-05", weekday: "Thursday", sessions: [{ title: "8.25. Online einkaufen – Rechte und Risiken" }] },
      { dayNumber: 26, date: "2026-03-06", weekday: "Friday", sessions: [{ title: "9.26. Reiseprobleme und Lösungen" }] },
      { dayNumber: 27, date: "2026-03-12", weekday: "Thursday", sessions: [{ title: "10.27. Umweltfreundlich im Alltag" }] },
      { dayNumber: 28, date: "2026-03-13", weekday: "Friday", sessions: [{ title: "10.28. Klimafreundlich leben" }] },
    ],
    generatedNote: "Schedule generated by Learn Language Education Academy.",
  },
  "B1 Stuttgart Klasse": {
    course: "B1",
    title: "Course Schedule: B1",
    className: "B1 Stuttgart Klasse",
    startDateIso: "2026-03-12",
    startDateHuman: "Thursday, 12 March 2026",
    timezone: "Africa/Accra",
    days: [
      { dayNumber: 1, date: "2026-03-12", weekday: "Thursday", sessions: [{ title: "1.1. Traumwelten (Übung)" }] },
      { dayNumber: 2, date: "2026-03-13", weekday: "Friday", sessions: [{ title: "1.2. Freundes für Leben (Übung)" }] },
      { dayNumber: 3, date: "2026-03-19", weekday: "Thursday", sessions: [{ title: "1.3. Erfolgsgeschichten (Übung)" }] },
      { dayNumber: 4, date: "2026-03-20", weekday: "Friday", sessions: [{ title: "2.4. Wohnung suchen (Übung)" }] },
      { dayNumber: 5, date: "2026-03-26", weekday: "Thursday", sessions: [{ title: "2.5. Der Besichtigungsg termin (Übung)" }] },
      { dayNumber: 6, date: "2026-03-27", weekday: "Friday", sessions: [{ title: "2.6. Leben in der Stadt oder auf dem Land?" }] },
      { dayNumber: 7, date: "2026-04-02", weekday: "Thursday", sessions: [{ title: "3.7. Fast Food vs. Hausmannskost" }] },
      { dayNumber: 8, date: "2026-04-03", weekday: "Friday", sessions: [{ title: "3.8. Alles für die Gesundheit" }] },
      { dayNumber: 9, date: "2026-04-09", weekday: "Thursday", sessions: [{ title: "3.9. Work-Life-Balance im modernen Arbeitsumfeld" }] },
      { dayNumber: 10, date: "2026-04-10", weekday: "Friday", sessions: [{ title: "4.10. Digitale Auszeit und Selbstfürsorge" }] },
      { dayNumber: 11, date: "2026-04-16", weekday: "Thursday", sessions: [{ title: "4.11. Teamspiele und Kooperative Aktivitäten" }] },
      { dayNumber: 12, date: "2026-04-17", weekday: "Friday", sessions: [{ title: "4.12. Abenteuer in der Natur" }] },
      { dayNumber: 13, date: "2026-04-23", weekday: "Thursday", sessions: [{ title: "4.13. Eigene Filmkritik schreiben" }] },
      { dayNumber: 14, date: "2026-04-24", weekday: "Friday", sessions: [{ title: "5.14. Traditionelles vs. digitales Lernen" }] },
      { dayNumber: 15, date: "2026-04-30", weekday: "Thursday", sessions: [{ title: "5.15. Medien und Arbeiten im Homeoffice" }] },
      { dayNumber: 16, date: "2026-05-01", weekday: "Friday", sessions: [{ title: "5.16. Prüfungsangst und Stressbewältigung" }] },
      { dayNumber: 17, date: "2026-05-07", weekday: "Thursday", sessions: [{ title: "5.17. Wie lernt man am besten?" }] },
      { dayNumber: 18, date: "2026-05-08", weekday: "Friday", sessions: [{ title: "6.18. Wege zum Wunschberuf" }] },
      { dayNumber: 19, date: "2026-05-14", weekday: "Thursday", sessions: [{ title: "6.19. Das Vorstellungsgespräch" }] },
      { dayNumber: 20, date: "2026-05-15", weekday: "Friday", sessions: [{ title: "6.20. Wie wird man …? (Ausbildung und Qu)" }] },
      { dayNumber: 21, date: "2026-05-21", weekday: "Thursday", sessions: [{ title: "7.21. Lebensformen heute – Familie, Wohnge" }] },
      { dayNumber: 22, date: "2026-05-22", weekday: "Friday", sessions: [{ title: "7.22. Was ist dir in einer Beziehung wichtig?" }] },
      { dayNumber: 23, date: "2026-05-28", weekday: "Thursday", sessions: [{ title: "7.23. Erstes Date – Typische Situationen" }] },
      { dayNumber: 24, date: "2026-05-29", weekday: "Friday", sessions: [{ title: "8.24. Konsum und Nachhaltigkeit" }] },
      { dayNumber: 25, date: "2026-06-04", weekday: "Thursday", sessions: [{ title: "8.25. Online einkaufen – Rechte und Risiken" }] },
      { dayNumber: 26, date: "2026-06-05", weekday: "Friday", sessions: [{ title: "9.26. Reiseprobleme und Lösungen" }] },
      { dayNumber: 27, date: "2026-06-11", weekday: "Thursday", sessions: [{ title: "10.27. Umweltfreundlich im Alltag" }] },
      { dayNumber: 28, date: "2026-06-12", weekday: "Friday", sessions: [{ title: "10.28. Klimafreundlich leben" }] },
    ],
    generatedNote: "Schedule generated by Learn Language Education Academy.",
  },
  "A1 Hamburg Klasse": {
    course: "A1",
    title: "Course Schedule: A1",
    className: "A1 Hamburg Klasse",
    startDateIso: "2026-01-30",
    startDateHuman: "Friday, 30 January 2026",
    timezone: "Africa/Accra",
    days: [
      {
        dayNumber: 1,
        date: "2026-01-30",
        weekday: "Friday",
        sessions: [{ chapter: "0.1", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 2,
        date: "2026-01-31",
        weekday: "Saturday",
        sessions: [
          { chapter: "0.2", type: "Lesen & Hören" },
          { chapter: "1.1", type: "Lesen & Hören" },
        ],
      },
      {
        dayNumber: 3,
        date: "2026-02-06",
        weekday: "Friday",
        sessions: [
          { chapter: "1.1", type: "Schreiben & Sprechen" },
          { chapter: "1.2", type: "Lesen & Hören" },
          { chapter: "2", type: "Lesen & Hören" },
        ],
      },
      {
        dayNumber: 4,
        date: "2026-02-07",
        weekday: "Saturday",
        sessions: [
          { chapter: "1.2", type: "Schreiben & Sprechen", note: "Recap" },
        ],
      },
      {
        dayNumber: 5,
        date: "2026-02-12",
        weekday: "Thursday",
        sessions: [{ chapter: "2.3", type: "Schreiben & Sprechen" }],
      },
      {
        dayNumber: 6,
        date: "2026-02-13",
        weekday: "Friday",
        sessions: [{ chapter: "3", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 7,
        date: "2026-02-14",
        weekday: "Saturday",
        sessions: [{ chapter: "4", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 8,
        date: "2026-02-19",
        weekday: "Thursday",
        sessions: [{ chapter: "5", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 9,
        date: "2026-02-20",
        weekday: "Friday",
        sessions: [
          { chapter: "6", type: "Lesen & Hören" },
          { chapter: "2.4", type: "Schreiben & Sprechen" },
        ],
      },
      {
        dayNumber: 10,
        date: "2026-02-21",
        weekday: "Saturday",
        sessions: [{ chapter: "7", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 11,
        date: "2026-02-26",
        weekday: "Thursday",
        sessions: [{ chapter: "8", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 12,
        date: "2026-02-27",
        weekday: "Friday",
        sessions: [{ chapter: "3.5", type: "Schreiben & Sprechen" }],
      },
      {
        dayNumber: 13,
        date: "2026-02-28",
        weekday: "Saturday",
        sessions: [{ chapter: "3.6", type: "Schreiben & Sprechen" }],
      },
      {
        dayNumber: 14,
        date: "2026-03-05",
        weekday: "Thursday",
        sessions: [{ chapter: "4.7", type: "Schreiben & Sprechen" }],
      },
      {
        dayNumber: 15,
        date: "2026-03-06",
        weekday: "Friday",
        sessions: [
          { chapter: "9", type: "Lesen & Hören" },
          { chapter: "10", type: "Lesen & Hören" },
        ],
      },
      {
        dayNumber: 16,
        date: "2026-03-07",
        weekday: "Saturday",
        sessions: [{ chapter: "11", type: "Lesen & Hören" }],
      },
      {
        dayNumber: 17,
        date: "2026-03-12",
        weekday: "Thursday",
        sessions: [
          { chapter: "12.1", type: "Lesen & Hören" },
          { chapter: "12.1", type: "Schreiben & Sprechen", note: "including 5.8" },
        ],
      },
      {
        dayNumber: 18,
        date: "2026-03-13",
        weekday: "Friday",
        sessions: [{ chapter: "5.9", type: "Schreiben & Sprechen" }],
      },
      {
        dayNumber: 19,
        date: "2026-03-14",
        weekday: "Saturday",
        sessions: [
          { chapter: "6.10", type: "Schreiben & Sprechen", note: "Intro to letter writing" },
        ],
      },
      {
        dayNumber: 20,
        date: "2026-03-19",
        weekday: "Thursday",
        sessions: [
          { chapter: "13", type: "Lesen & Hören" },
          { chapter: "6.11", type: "Schreiben & Sprechen" },
        ],
      },
      {
        dayNumber: 21,
        date: "2026-03-20",
        weekday: "Friday",
        sessions: [
          { chapter: "14.1", type: "Lesen & Hören" },
          { chapter: "7.12", type: "Schreiben & Sprechen" },
        ],
      },
      {
        dayNumber: 22,
        date: "2026-03-21",
        weekday: "Saturday",
        sessions: [
          { chapter: "14.2", type: "Lesen & Hören" },
          { chapter: "7.12", type: "Schreiben & Sprechen" },
        ],
      },
      {
        dayNumber: 23,
        date: "2026-03-26",
        weekday: "Thursday",
        sessions: [{ chapter: "8.13", type: "Schreiben & Sprechen" }],
      },
      {
        dayNumber: 24,
        date: "2026-03-27",
        weekday: "Friday",
        sessions: [
          { chapter: "Exam tips", type: "Schreiben & Sprechen", note: "Recap" },
        ],
      },
    ],
    generatedNote: "Schedule generated by Learn Language Education Academy.",
  },
  "A1 Paris Class": {
    course: "A1",
    title: "Course Schedule: French A1",
    className: "A1 Paris Class",
    startDateIso: "2026-03-01",
    startDateHuman: "Sunday, 1 March 2026",
    timezone: "Africa/Accra",
    days: buildWeeklyClassDays({
      startDate: "2026-03-01",
      endDate: "2026-06-06",
      weekdays: ["Monday", "Wednesday", "Friday"],
      sessionTemplate: { chapter: "French A1", type: "Live class" },
    }),
    generatedNote: "Schedule generated for the French A1 Paris class.",
  },
};


const parseAssignmentId = (value) => {
  const match = String(value || "").match(/(\d+(?:\.\d+)?)/);
  return match ? match[1] : null;
};

const withAssignmentIds = (schedule) => ({
  ...schedule,
  days: (schedule.days || []).map((day) => ({
    ...day,
    sessions: (day.sessions || []).map((session) => ({
      ...session,
      assignmentId: session.assignmentId || parseAssignmentId(session.chapter || session.title),
    })),
  })),
});

const toLevelToken = (value) => {
  const match = String(value || "").toUpperCase().match(/\b(A1|A2|B1|B2|C1|C2)\b/);
  return match ? match[1] : "";
};

const listClassDates = ({ startDate, endDate, weekdays = [] }) => {
  if (!startDate || !endDate || !weekdays.length) return [];
  const allowedDays = new Set(weekdays);
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  const days = [];

  for (const current = new Date(start); current <= end; current.setDate(current.getDate() + 1)) {
    const weekday = WEEKDAY_NAMES[current.getDay()];
    if (!allowedDays.has(weekday)) continue;
    days.push({ date: toDateString(current), weekday });
  }

  return days;
};

const buildSessionsFromSequence = (level, currentSessions = [], fallbackSessions = []) => {
  const sequence = getAssignmentSequenceForLevel(level);
  if (!sequence.length) return currentSessions.length ? currentSessions : fallbackSessions;

  return sequence.map((entry) => ({
    chapter: entry.chapter,
    assignmentId: entry.assignment_id,
    title: getAssignmentDisplayTitle(entry, { preferEnglish: true }),
    type: getAssignmentDisplayType(entry),
  }));
};

const distributeSessionsAcrossDates = (dates = [], sessions = []) => {
  if (!dates.length || !sessions.length) return [];

  const mappedDays = [];
  let sessionIndex = 0;

  dates.forEach((dateEntry, idx) => {
    const remainingSessions = sessions.length - sessionIndex;
    const remainingDays = dates.length - idx;
    const takeCount = remainingSessions > 0 ? Math.ceil(remainingSessions / Math.max(remainingDays, 1)) : 0;
    const daySessions = sessions.slice(sessionIndex, sessionIndex + takeCount);
    sessionIndex += takeCount;

    if (!daySessions.length) return;

    mappedDays.push({
      dayNumber: mappedDays.length + 1,
      date: dateEntry.date,
      weekday: dateEntry.weekday,
      sessions: daySessions,
    });
  });

  return mappedDays;
};

const enrichSessionFromDictionary = (level, session = {}) => {
  const inferredAssignmentId = session.assignmentId || parseAssignmentId(session.chapter || session.title || session.type);
  const canonicalAssignmentId = inferredAssignmentId
    ? `${level}-${String(inferredAssignmentId).replace(new RegExp(`^${level}-`, "i"), "")}`.toUpperCase()
    : null;
  const dictionaryEntry = getAssignmentDictionaryEntry({
    level,
    assignmentId: canonicalAssignmentId,
    chapter: session.chapter,
  });

  if (!dictionaryEntry) {
    return {
      ...session,
      assignmentId: canonicalAssignmentId || inferredAssignmentId || session.assignmentId || null,
    };
  }

  return {
    ...session,
    chapter: dictionaryEntry.chapter,
    assignmentId: dictionaryEntry.assignment_id,
    title: getAssignmentDisplayTitle(dictionaryEntry, { preferEnglish: true }) || session.title || session.chapter || "",
    type: getAssignmentDisplayType(dictionaryEntry) || session.type || "",
  };
};

const autoBuildScheduleFromClassDates = (className, schedule) => {
  const classMeta = classCatalog[className];
  if (!classMeta?.startDate || !classMeta?.endDate || !Array.isArray(classMeta?.schedule)) {
    return schedule;
  }

  const level = toLevelToken(schedule.course || className);
  const classDates = listClassDates({
    startDate: classMeta.startDate,
    endDate: classMeta.endDate,
    weekdays: classMeta.schedule.map((entry) => entry.day),
  });

  if (!classDates.length) return schedule;

  const fallbackSessions = (schedule.days || []).flatMap((day) =>
    (day.sessions || []).map((session) => enrichSessionFromDictionary(level, session))
  );
  const sequenceSessions = buildSessionsFromSequence(level, fallbackSessions, fallbackSessions).map((session) =>
    enrichSessionFromDictionary(level, session)
  );
  const days = distributeSessionsAcrossDates(classDates, sequenceSessions.length ? sequenceSessions : fallbackSessions);

  return {
    ...schedule,
    startDateIso: classMeta.startDate,
    endDateIso: classMeta.endDate,
    days: days.length ? days : schedule.days,
  };
};

export const courseSchedulesByName = Object.fromEntries(
  Object.entries(rawCourseSchedulesByName).map(([className, schedule]) => [
    className,
    withAssignmentIds(autoBuildScheduleFromClassDates(className, schedule)),
  ])
);
