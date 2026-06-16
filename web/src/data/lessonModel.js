import { getLessonRadioResource } from "./lessonRadioDictionary";
import { getLessonVideoResources } from "./lessonVideoDictionary";
import { getAdditionalLessonVideoResources } from "./additionalLessonVideoResources";

export const LEVEL_CAPABILITIES = Object.freeze({
  A1: { radio: false, fourPartWorkbook: false, tutorSubmission: true, selfAssessment: false },
  A2: { radio: true, fourPartWorkbook: true, tutorSubmission: true, selfAssessment: false },
  B1: { radio: true, fourPartWorkbook: true, tutorSubmission: true, selfAssessment: false },
  B2: { radio: true, fourPartWorkbook: false, tutorSubmission: false, selfAssessment: true },
  C1: { radio: true, fourPartWorkbook: false, tutorSubmission: false, selfAssessment: true },
});

const normalizeLevel = (level = "") => String(level).trim().toUpperCase();
const firstString = (...values) => values.find((value) => typeof value === "string" && value.trim())?.trim() || null;
const firstEntry = (raw = {}) => {
  const nested = [raw.schreiben_sprechen, raw.lesen_hören].flat().filter(Boolean);
  return nested[0] || raw;
};
const resource = (url, extra = {}) => url ? { url, ...extra } : null;
const toArray = (value) => Array.isArray(value) ? value : value ? [value] : [];
const mergeVideoResources = (...groups) => {
  const seen = new Set();
  return groups.flat().filter((item) => {
    const url = item?.url;
    if (!url || seen.has(url)) return false;
    seen.add(url);
    return true;
  });
};
const INTERNAL_RESOURCE_ROUTES = {
  A2: {
    17: {
      grammarBook: "/campus/course/a2-day-17-in-die-apotheke-grammar-notes.html",
    },
  },
  B1: {
    1: {
      grammarBook: "/campus/course/lesson/B1/1?view=grammar",
      workbook: "/campus/course/lesson/B1/1?view=workbook",
    },
  },
};

const normalizeResourceGroups = (rawLesson, level, day) => {
  const nested = [
    ...toArray(rawLesson.schreiben_sprechen),
    ...toArray(rawLesson.lesen_hören),
  ].filter(Boolean);
  const entries = nested.length ? nested : [rawLesson];
  const internal = INTERNAL_RESOURCE_ROUTES[level]?.[day] || {};

  return entries.map((entry) => ({
    chapter: entry.chapter || rawLesson.chapter || null,
    grammarBook: resource(internal.grammarBook || firstString(
      entry.grammarbook_link,
      entry.grammar_link,
      rawLesson.grammarbook_link,
      rawLesson.grammar_link,
    )),
    workbook: resource(internal.workbook || firstString(
      entry.workbook_link,
      rawLesson.workbook_link,
    )),
  }));
};

export const normalizeLesson = (rawLesson = {}, requestedLevel = rawLesson.level) => {
  const level = normalizeLevel(requestedLevel);
  const day = Number(rawLesson.day ?? rawLesson.assignmentDay ?? 0);
  const primary = firstEntry(rawLesson);
  const capabilities = LEVEL_CAPABILITIES[level] || LEVEL_CAPABILITIES.A1;
  const videos = mergeVideoResources(
    getLessonVideoResources(level, day, rawLesson),
    getAdditionalLessonVideoResources(level, day),
  );
  const teacherVideo = videos.find((item) => `${item.key} ${item.title}`.toLowerCase().includes("teacher")) || null;
  const aiVideo = videos.find((item) => !`${item.key} ${item.title}`.toLowerCase().includes("teacher")) || null;
  const radio = capabilities.radio ? getLessonRadioResource(level, day) : null;
  const assignmentId = rawLesson.assignmentId || rawLesson.assignment_id || null;
  const resourceGroups = normalizeResourceGroups(rawLesson, level, day);
  const firstResourceGroup = resourceGroups[0] || {};

  return {
    level, day,
    topic: rawLesson.topic || rawLesson.title || `Day ${day}`,
    chapter: rawLesson.chapter || primary.chapter || null,
    lessonType: capabilities.fourPartWorkbook ? "fourPartWorkbook" : capabilities.selfAssessment ? "selfLearning" : "guided",
    capabilities,
    resources: {
      falowenRadio: radio,
      teacherVideo,
      aiVideo,
      grammarBook: firstResourceGroup.grammarBook || null,
      workbook: firstResourceGroup.workbook || null,
      videos,
      resourceGroups,
    },
    submission: { enabled: capabilities.tutorSubmission && Boolean(rawLesson.assignment || assignmentId), assignmentId },
    raw: rawLesson,
  };
};

export const normalizeA1Lesson = (rawLesson = {}) => normalizeLesson(rawLesson, "A1");
export const normalizeA2B1Lesson = (rawLesson = {}, level = rawLesson.level || "A2") => normalizeLesson(rawLesson, level);
export const normalizeB2C1Lesson = (rawLesson = {}, level = rawLesson.level || "B2") => normalizeLesson(rawLesson, level);
