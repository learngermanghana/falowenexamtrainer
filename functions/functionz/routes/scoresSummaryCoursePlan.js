"use strict";

const { getCurriculumEntriesForLevel, normalizeLevel } = require("../../data/curriculumManifest");

const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);
const normalizePracticeKey = (value = "") => String(value || "").trim().toUpperCase();
const sanitizePracticeChapter = (value = "") =>
  String(value || "")
    .trim()
    .replace(/[^a-z0-9._-]/gi, "-");

const COURSE_COMPLETION_TOTALS = Object.freeze({
  A1: 19,
  A2: 28,
  B1: 28,
});

const tutorDay = (entry = {}) => Number(entry.assignmentDay ?? entry.displayDay ?? entry.day ?? 0);
const tutorChapter = (entry = {}) => String(entry.displayChapter || entry.chapter || "").trim();
const tutorAssignmentId = (entry = {}, level = "") => {
  const normalizedLevel = normalizeLevel(level || entry.level || "") || String(level || entry.level || "").toUpperCase();
  return normalizePracticeKey(
    entry.assignment_id ||
      entry.assignmentId ||
      entry.canonicalAssignmentId ||
      entry.assignmentKey ||
      (tutorChapter(entry) ? `${normalizedLevel}-${tutorChapter(entry)}` : `${normalizedLevel}-DAY-${tutorDay(entry)}`)
  );
};

const sortTutorEntries = (left = {}, right = {}) => {
  const dayDiff = tutorDay(left) - tutorDay(right);
  if (dayDiff !== 0) return dayDiff;
  return tutorChapter(left).localeCompare(tutorChapter(right), undefined, { numeric: true });
};

const dedupeTutorRequirements = (requirements = []) => {
  const seen = new Set();
  return requirements.filter((item) => {
    const key = normalizePracticeKey(item.assignmentId);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const getCanonicalTutorRequirements = (level = "A1") => {
  const normalizedLevel = normalizeLevel(level || "A1") || "A1";
  if (!COURSE_COMPLETION_TOTALS[normalizedLevel]) return [];

  const entries = getCurriculumEntriesForLevel(normalizedLevel)
    .filter((entry) => tutorDay(entry) > 0)
    .sort(sortTutorEntries);

  const explicitAssignments = dedupeTutorRequirements(
    entries
      .filter((entry) => Boolean(entry.assignment ?? entry.submissionRequired))
      .map((entry) => ({
        day: tutorDay(entry),
        chapter: tutorChapter(entry),
        assignmentId: tutorAssignmentId(entry, normalizedLevel),
      }))
  );

  if (normalizedLevel === "A1") return explicitAssignments;

  const byDay = new Map();
  explicitAssignments.forEach((item) => {
    if (item.day && !byDay.has(item.day)) byDay.set(item.day, item);
  });

  for (let day = 1; day <= COURSE_COMPLETION_TOTALS[normalizedLevel]; day += 1) {
    if (byDay.has(day)) continue;
    const entry = entries.find((candidate) => tutorDay(candidate) === day);
    if (!entry) continue;
    byDay.set(day, {
      day,
      chapter: tutorChapter(entry),
      assignmentId: tutorAssignmentId(entry, normalizedLevel),
    });
  }

  return [...byDay.values()].sort((left, right) => {
    const dayDiff = Number(left.day || 0) - Number(right.day || 0);
    if (dayDiff !== 0) return dayDiff;
    return String(left.chapter || "").localeCompare(String(right.chapter || ""), undefined, { numeric: true });
  });
};

const getCanonicalTutorAssignmentSet = (level = "A1") =>
  new Set(getCanonicalTutorRequirements(level).map((item) => normalizePracticeKey(item.assignmentId)).filter(Boolean));

const buildCourseItemLabel = (entry = {}, level = "") => {
  const normalizedLevel = normalizeLevel(level || entry.level || "") || String(level || entry.level || "").toUpperCase();
  const displayDay = Number(entry.displayDay ?? entry.assignmentDay ?? entry.day ?? 0);
  const displayChapter = String(entry.displayChapter || entry.chapter || "").trim();
  const title = String(entry.topic || entry.title || "Lesson").trim();
  const prefix = displayDay > 0 ? `Day ${displayDay}${displayChapter ? ` ${displayChapter}` : ""}` : displayChapter;
  const lessonLabel = `${prefix ? `${prefix}: ` : ""}${title}`.trim();
  return normalizedLevel ? `${normalizedLevel} · ${lessonLabel}` : lessonLabel;
};

const getPracticeKeysForEntry = (entry = {}, level = "") => {
  const normalizedLevel = normalizeLevel(level || entry.level || "") || String(level || entry.level || "").toUpperCase();
  const assignmentId = normalizePracticeKey(entry.assignment_id || entry.assignmentId || entry.canonicalAssignmentId);
  const displayDay = Number(entry.displayDay ?? entry.assignmentDay ?? entry.day ?? 0);
  const assignmentDay = Number(entry.assignmentDay ?? entry.day ?? displayDay);
  const chapter = sanitizePracticeChapter(entry.displayChapter || entry.chapter || "");
  return Array.from(
    new Set(
      [
        assignmentId,
        normalizedLevel && displayDay && chapter ? `${normalizedLevel}-DAY-${displayDay}-PRACTICE-${chapter}` : "",
        normalizedLevel && assignmentDay && chapter ? `${normalizedLevel}-DAY-${assignmentDay}-PRACTICE-${chapter}` : "",
      ]
        .map(normalizePracticeKey)
        .filter(Boolean)
    )
  );
};

const getAssignmentSummary = (level = "A1") => {
  const normalizedLevel = normalizeLevel(level || "A1") || "A1";
  const entries = getCurriculumEntriesForLevel(normalizedLevel)
    .filter((entry) => {
      const displayDay = Number(entry.displayDay ?? entry.assignmentDay ?? entry.day ?? 0);
      const hasResource = Boolean(
        entry.workbookRoute ||
          entry.video ||
          toArray(entry.resources).some(
            (resource) =>
              resource?.workbookRoute ||
              resource?.workbook_link ||
              resource?.video ||
              resource?.youtube_link
          )
      );
      return displayDay > 0 && Boolean(entry.chapter) && Boolean(entry.title || entry.topic) && hasResource;
    })
    .sort((a, b) => {
      const orderDiff = Number(a.assignmentDay ?? a.day ?? 0) - Number(b.assignmentDay ?? b.day ?? 0);
      if (orderDiff !== 0) return orderDiff;
      return String(a.chapter || "").localeCompare(String(b.chapter || ""), undefined, { numeric: true });
    });

  const lessons = entries.map((entry, index) => {
    const submissionRequired = Boolean(entry.submissionRequired ?? entry.assignment);
    const assignmentId = normalizePracticeKey(entry.assignment_id || entry.assignmentId || entry.canonicalAssignmentId);
    const displayDay = Number(entry.displayDay ?? entry.assignmentDay ?? entry.day ?? 0);
    const displayChapter = String(entry.displayChapter || entry.chapter || "").trim();
    const title = String(entry.topic || entry.title || "Lesson").trim();
    const selfStudy = !submissionRequired;
    return {
      order: index,
      level: normalizedLevel,
      assignmentDay: Number(entry.assignmentDay ?? entry.day ?? 0),
      dayNumber: displayDay,
      displayDay,
      displayChapter,
      title,
      goal: String(entry.goal || "").trim(),
      label: buildCourseItemLabel(entry, normalizedLevel),
      assignmentId,
      identifiers: submissionRequired && assignmentId ? [assignmentId] : [],
      submissionRequired,
      selfStudy,
      practiceKeys: selfStudy ? getPracticeKeysForEntry(entry, normalizedLevel) : [],
    };
  });

  return {
    lessons,
    plannedSet: new Set(lessons.flatMap((lesson) => lesson.identifiers)),
    totalCourseItems: lessons.length,
  };
};

module.exports = {
  buildCourseItemLabel,
  getAssignmentSummary,
  getCanonicalTutorAssignmentSet,
  getCanonicalTutorRequirements,
  getPracticeKeysForEntry,
  normalizePracticeKey,
};
