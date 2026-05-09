import { courseSchedules } from "../data/courseSchedule";

export const normalizeLevel = (level) => String(level || "").toUpperCase().trim();

export const detectLevelKey = (studentProfile = {}) => {
  const candidates = [
    studentProfile?.level,
    studentProfile?.course,
    studentProfile?.classLevel,
    studentProfile?.className,
  ]
    .map((value) => String(value || "").toUpperCase())
    .filter(Boolean);

  for (const candidate of candidates) {
    const match = candidate.match(/\b(A1|A2|B1|B2|C1|C2)\b/);
    if (match?.[1]) return match[1];
  }

  return "";
};

export const getDay0WorkbookLinkForLevel = (level) => {
  const normalizedLevel = normalizeLevel(level);
  if (!normalizedLevel) return null;

  const levelSchedule = courseSchedules?.[normalizedLevel];
  if (!Array.isArray(levelSchedule)) return null;

  const day0Lesson = levelSchedule.find((lesson) => Number(lesson?.day) === 0);
  if (!day0Lesson || typeof day0Lesson !== "object") return null;

  const lesenHoeren = day0Lesson.lesen_hören;
  if (Array.isArray(lesenHoeren)) {
    const lessonWithWorkbook = lesenHoeren.find((entry) => entry?.workbook_link);
    if (lessonWithWorkbook?.workbook_link) return lessonWithWorkbook.workbook_link;
  } else if (lesenHoeren?.workbook_link) {
    return lesenHoeren.workbook_link;
  }

  return day0Lesson.workbook_link || null;
};
