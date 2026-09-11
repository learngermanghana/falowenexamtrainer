import { courseSchedules } from "../data/courseSchedule";

const isExpectedAttendanceSession = (entry) => {
  if (!entry || entry.completion) return false;
  const topic = String(entry.topic || "").trim();
  if (/course completed|kurs abgeschlossen/i.test(topic)) return false;
  const day = Number(entry.day);
  return Number.isInteger(day) && day > 0;
};

export const getExpectedCourseSessionCount = (level = "") => {
  const normalizedLevel = String(level || "").trim().toUpperCase();
  const schedule = courseSchedules?.[normalizedLevel] || [];
  const expectedDays = new Set(
    schedule
      .filter(isExpectedAttendanceSession)
      .map((entry) => Number(entry.day)),
  );

  return expectedDays.size;
};

export const formatCourseAttendanceProgress = ({ attended = 0, level = "" } = {}) => {
  const attendedSessions = Math.max(0, Number(attended) || 0);
  const expectedSessions = getExpectedCourseSessionCount(level);

  return {
    attendedSessions,
    expectedSessions,
    label: expectedSessions > 0
      ? `${attendedSessions}/${expectedSessions}`
      : String(attendedSessions),
  };
};
