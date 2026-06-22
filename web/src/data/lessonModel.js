import { getLessonRadioResource } from "./lessonRadioDictionary";
import { LESSON_VIDEO_DICTIONARY, getLessonVideoResources } from "./lessonVideoDictionary";
import { getAdditionalLessonVideoResources } from "./additionalLessonVideoResources";
import { applyA1LessonVideoResourceOverrides } from "./a1LessonVideoResourceOverrides";
import { getA1GrammarRoute } from "./a1GrammarRoutes";
import { getA2GrammarRoute } from "./a2GrammarRoutes";
import { resolveStrictInAppWorkbookRoute } from "./strictInAppWorkbookRoutes";

applyA1LessonVideoResourceOverrides(LESSON_VIDEO_DICTIONARY);

export const LEVEL_CAPABILITIES = Object.freeze({
  A1: { radio: false, fourPartWorkbook: false, tutorSubmission: true, selfAssessment: false },
  A2: { radio: true, fourPartWorkbook: true, tutorSubmission: true, selfAssessment: false },
  B1: { radio: true, fourPartWorkbook: true, tutorSubmission: true, selfAssessment: false },
  B2: { radio: true, fourPartWorkbook: false, tutorSubmission: false, selfAssessment: true },
  C1: { radio: true, fourPartWorkbook: false, tutorSubmission: false, selfAssessment: true },
});

const levelKey = (value = "") => String(value).trim().toUpperCase();
const chapterKey = (value = "") => String(value || "").trim();
const first = (...values) => values.find((value) => typeof value === "string" && value.trim())?.trim() || null;
const list = (value) => (Array.isArray(value) ? value : value ? [value] : []);
const link = (url, extra = {}) => (url ? { url, ...extra } : null);
const firstLesson = (raw = {}) => [raw.schreiben_sprechen, raw.lesen_hören].flat().filter(Boolean)[0] || raw;
const mergeVideos = (...groups) => {
  const seen = new Set();
  return groups.flat().filter((item) => item?.url && !seen.has(item.url) && seen.add(item.url));
};
const INTERNAL = {
  B1: { 1: { grammarBook: "/campus/course/lesson/B1/1?view=grammar", workbook: "/campus/course/lesson/B1/1?view=workbook" } },
};

const getCanonicalGrammarBook = ({ level, day, chapter }) => {
  if (level === "A1") return getA1GrammarRoute({ day, chapter });
  if (level === "A2") return getA2GrammarRoute({ day, chapter });
  return "";
};

const resourceGroups = (raw, level, day) => {
  const nested = [...list(raw.schreiben_sprechen), ...list(raw.lesen_hören)].filter(Boolean);
  const entries = nested.length ? nested : [raw];
  const internal = INTERNAL[level]?.[day] || {};
  return entries.map((entry) => {
    const chapter = entry.chapter || raw.chapter || null;
    const workbook = resolveStrictInAppWorkbookRoute({
      level,
      day,
      chapter,
      fallback: internal.workbook || first(entry.workbook_link, raw.workbook_link, entry.workbookRoute, raw.workbookRoute),
    });
    const canonicalGrammarBook = getCanonicalGrammarBook({ level, day, chapter });
    return {
      chapter,
      grammarBook: link(
        canonicalGrammarBook ||
          internal.grammarBook ||
          first(entry.grammarbook_link, entry.grammar_link, raw.grammarbook_link, raw.grammar_link)
      ),
      workbook: link(workbook),
    };
  });
};

export const scopeLessonVideosToSelectedChapters = (videos = [], groups = []) => {
  const selectedChapters = new Set(groups.map((group) => chapterKey(group?.chapter)).filter(Boolean));

  // A full-day lesson may intentionally contain more than one chapter. Only narrow
  // the video list when the user opened a chapter-specific Course Book entry.
  if (selectedChapters.size !== 1) return videos;

  return videos.filter((video) => {
    const videoChapter = chapterKey(video?.chapter);
    return !videoChapter || selectedChapters.has(videoChapter);
  });
};

export const normalizeLesson = (rawLesson = {}, requestedLevel = rawLesson.level) => {
  const level = levelKey(requestedLevel);
  const day = Number(rawLesson.day ?? rawLesson.assignmentDay ?? 0);
  const primary = firstLesson(rawLesson);
  const capabilities = LEVEL_CAPABILITIES[level] || LEVEL_CAPABILITIES.A1;
  const groups = resourceGroups(rawLesson, level, day);
  const allVideos = mergeVideos(
    getLessonVideoResources(level, day, rawLesson),
    getAdditionalLessonVideoResources(level, day),
  );
  const videos = scopeLessonVideosToSelectedChapters(allVideos, groups);
  const isTeacher = (item) => `${item.key} ${item.title}`.toLowerCase().includes("teacher");
  const assignmentId = rawLesson.assignmentId || rawLesson.assignment_id || null;
  return {
    level,
    day,
    topic: rawLesson.topic || rawLesson.title || `Day ${day}`,
    chapter: rawLesson.chapter || primary.chapter || null,
    lessonType: capabilities.fourPartWorkbook ? "fourPartWorkbook" : capabilities.selfAssessment ? "selfLearning" : "guided",
    capabilities,
    resources: {
      falowenRadio: capabilities.radio ? getLessonRadioResource(level, day) : null,
      teacherVideo: videos.find(isTeacher) || null,
      aiVideo: videos.find((item) => !isTeacher(item)) || null,
      grammarBook: groups[0]?.grammarBook || null,
      workbook: groups[0]?.workbook || null,
      videos,
      resourceGroups: groups,
    },
    submission: { enabled: capabilities.tutorSubmission && Boolean(rawLesson.assignment || assignmentId), assignmentId },
    raw: rawLesson,
  };
};

export const normalizeA1Lesson = (raw = {}) => normalizeLesson(raw, "A1");
export const normalizeA2B1Lesson = (raw = {}, level = raw.level || "A2") => normalizeLesson(raw, level);
export const normalizeB2C1Lesson = (raw = {}, level = raw.level || "B2") => normalizeLesson(raw, level || "B2");
