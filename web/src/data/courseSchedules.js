import { classCatalog } from "./classCatalog";
import {
  getAssignmentDictionaryEntry,
  getAssignmentDisplayTitle,
  getAssignmentDisplayType,
  getCurriculumEntriesByDayForLevel,
} from "./germanAssignmentCatalog";

const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const toDateString = (date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

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

const buildGeneratedDays = ({ level, classDates }) => {
  const curriculumByDay = getCurriculumEntriesByDayForLevel(level);
  return classDates
    .map((dateEntry, index) => {
      const dayNumber = index + 1;
      const sessions = (curriculumByDay[dayNumber] || []).map((entry) => {
        const dictionaryEntry =
          getAssignmentDictionaryEntry({
            level,
            assignmentId: entry.assignment_id,
            chapter: entry.chapter,
            mode: entry.mode,
            assignmentDay: dayNumber,
          }) || entry;

        return {
          chapter: dictionaryEntry.chapter || entry.chapter,
          assignmentId: dictionaryEntry.assignment_id || entry.assignment_id,
          assignment_id: dictionaryEntry.assignment_id || entry.assignment_id,
          canonicalAssignmentId: dictionaryEntry.assignment_id || entry.assignment_id,
          assignment: dictionaryEntry.assignment === true,
          assignmentDay: Number(dictionaryEntry.assignmentDay || dayNumber) || dayNumber,
          title: getAssignmentDisplayTitle(dictionaryEntry, { preferEnglish: true }),
          type: getAssignmentDisplayType(dictionaryEntry),
          mode: dictionaryEntry.mode || entry.mode,
          instruction: dictionaryEntry.instruction || entry.instruction || null,
          goal: dictionaryEntry.goal || entry.goal || null,
          grammar_topic: dictionaryEntry.grammar_topic || entry.grammar_topic || null,
          resources: dictionaryEntry.schreiben_sprechen || entry.schreiben_sprechen || null,
        };
      });

      return {
        dayNumber,
        date: dateEntry.date,
        weekday: dateEntry.weekday,
        sessions,
      };
    })
    .filter((day) => day.sessions.length > 0);
};

const buildScheduleForClass = (className, meta = {}) => {
  const level = toLevelToken(className);
  const weekdays = (meta.schedule || []).map((entry) => entry.day).filter(Boolean);
  const classDates = listClassDates({
    startDate: meta.startDate,
    endDate: meta.endDate,
    weekdays,
  });

  return {
    course: level,
    title: `Course Schedule: ${level || "Class"}`,
    className,
    startDateIso: meta.startDate || "",
    endDateIso: meta.endDate || "",
    timezone: "Africa/Accra",
    days: buildGeneratedDays({ level, classDates }),
    generatedNote: "Generated from class metadata and centralized germanAssignmentCatalog curriculum.",
  };
};

export const courseSchedulesByName = Object.fromEntries(
  Object.entries(classCatalog)
    .filter(([, meta]) => !meta?.isSelfLearning)
    .map(([className, meta]) => [className, buildScheduleForClass(className, meta)])
);
