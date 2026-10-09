import { getAccessibleLevels, normalizeCourseLevel } from "./levelAccess";

// Exam practice can revisit a student's enrolled level or any earlier CEFR level.
// This never changes the enrolled course, class or account profile.
export const getExamPracticeLevels = (studentLevel) =>
  getAccessibleLevels(normalizeCourseLevel(studentLevel) || "A1");

export const resolveExamPracticeLevel = (studentLevel, preferredLevel) => {
  const enrolled = normalizeCourseLevel(studentLevel) || "A1";
  const preferred = normalizeCourseLevel(preferredLevel);
  return getExamPracticeLevels(enrolled).includes(preferred) ? preferred : enrolled;
};
