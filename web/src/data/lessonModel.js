import { getLessonRadioResource } from "./lessonRadioDictionary";
import { getLessonVideoResources } from "./lessonVideoDictionary";

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

export const normalizeLesson = (rawLesson = {}, requestedLevel = rawLesson.level) => {
  const level = normalizeLevel(requestedLevel);
  const day = Number(rawLesson.day ?? rawLesson.assignmentDay ?? 0);
  const primary = firstEntry(rawLesson);
  const capabilities = LEVEL_CAPABILITIES[level] || LEVEL_CAPABILITIES.A1;
  const videos = getLessonVideoResources(level, day, rawLesson);
  const teacherVideo = videos.find((item) => `${item.key} ${item.title}`.toLowerCase().includes("teacher")) || null;
  const aiVideo = videos.find((item) => !`${item.key} ${item.title}`.toLowerCase().includes("teacher")) || null;
  const radio = capabilities.radio ? getLessonRadioResource(level, day) : null;
  const assignmentId = rawLesson.assignmentId || rawLesson.assignment_id || null;

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
      grammarBook: resource(firstString(primary.grammarbook_link, primary.grammar_link, rawLesson.grammarbook_link, rawLesson.grammar_link)),
      workbook: resource(firstString(primary.workbook_link, rawLesson.workbook_link)),
      videos,
    },
    submission: { enabled: capabilities.tutorSubmission && Boolean(rawLesson.assignment || assignmentId), assignmentId },
    raw: rawLesson,
  };
};

export const normalizeA1Lesson = (rawLesson = {}) => normalizeLesson(rawLesson, "A1");
export const normalizeA2B1Lesson = (rawLesson = {}, level = rawLesson.level || "A2") => normalizeLesson(rawLesson, level);
export const normalizeB2C1Lesson = (rawLesson = {}, level = rawLesson.level || "B2") => normalizeLesson(rawLesson, level);
