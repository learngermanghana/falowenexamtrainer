import { courseSchedules } from "../data/courseSchedule";

export const getExpectedCourseSessionCount = (level = "") => {
  const normalizedLevel = String(level || "").trim().toUpperCase();
  const schedule = courseSchedules?.[normalizedLevel] || [];
  const expectedDays = new Set(
    schedule
      .map((entry) => Number(entry?.day))
      .filter((day) => Number.isInteger(day) && day > 0),
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
