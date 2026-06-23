import { getLessonRadioResource } from "./lessonRadioDictionary";
import { LESSON_VIDEO_DICTIONARY, getLessonVideoResources } from "./lessonVideoDictionary";
import { getAdditionalLessonVideoResources } from "./additionalLessonVideoResources";
import { applyA1LessonVideoResourceOverrides } from "./a1LessonVideoResourceOverrides";
import { getA1GrammarRoute } from "./a1GrammarRoutes";
import { getA1TeacherVideoResources } from "./a1TeacherVideoResources";
import { getA2GrammarRoute } from "./a2GrammarRoutes";
import {
  applyB1LessonVideoOverrides,
  getB1LessonResourceOverride,
} from "./b1LessonResourceOverrides";
import { resolveStrictInAppWorkbookRoute } from "./strictInAppWorkbookRoutes";

applyA1LessonVideoResourceOverrides(LESSON_VIDEO_DICTIONARY);
applyB1LessonVideoOverrides(LESSON_VIDEO_DICTIONARY);

export const LEVEL_CAPABILITIES = Object.freeze({
  A1: { radio: false, fourPartWorkbook: false, tutorSubmission: true, selfAssessment: false },
  A2: { radio: true, fourPartWorkbook: true, tutorSubmission: true, selfAssessment: false },
  B1: { radio: true, fourPartWorkbook: true, tutorSubmission: true, selfAssessment: false },
  B2: { radio: true, fourPartWorkbook: false, tutorSubmission: false, selfAssessment: true },
  C1: { radio: true, fourPartWorkbook: false, tutorSubmission: false, selfAssessment: true },
});

const levelKey = (value = "") => String(value).trim().toUpperCase();
const chapterKey = (value = "") => String(value || "").trim();
const chapterAliases = (value = "") => {
  const normalized = chapterKey(value);
  if (!normalized) return [];
  const aliases = normalized
    .split(/[_/,;&]+/)
    .map((part) => part.trim())
    .filter(Boolean);
  return aliases.length ? aliases : [normalized];
};
const first = (...values) => values.find((value) => typeof value === "string" && value.trim())?.trim() || null;
const list = (value) => (Array.isArray(value) ? value : value ? [value] : []);
const link = (url, extra = {}) => (url ? { url, ...extra } : null);
const firstLesson = (raw = {}) => [raw.schreiben_sprechen, raw.lesen_hören].flat().filter(Boolean)[0] || raw;
const mergeVideos = (...groups) => {
  const seen = new Set();
  return groups.flat().filter((item) => item?.url && !seen.has(item.url) && seen.add(item.url));
};
const isTeacherVideo = (item = {}) =>
  `${item.key || ""} ${item.title || ""}`.toLowerCase().includes("teacher");

const shouldHideGrammarBook = ({ level, day }) => level === "A1" && Number(day) === 5;

const getCanonicalGrammarBook = ({ level, day, chapter }) => {
  if (level === "A1") return getA1GrammarRoute({ day, chapter });
  if (level === "A2") return getA2GrammarRoute({ day, chapter });
  if (level === "B1") return getB1LessonResourceOverride(day)?.grammarBook || "";
  return "";
};

const resourceGroupUrl = (resource) => String(resource?.url || "").trim();

const groupsAreCompatible = (left = {}, right = {}) => {
  const leftChapter = chapterKey(left.chapter);
  const rightChapter = chapterKey(right.chapter);
  if (leftChapter !== rightChapter) return false;

  const leftGrammar = resourceGroupUrl(left.grammarBook);
  const rightGrammar = resourceGroupUrl(right.grammarBook);
  const leftWorkbook = resourceGroupUrl(left.workbook);
  const rightWorkbook = resourceGroupUrl(right.workbook);

  const grammarCompatible = !leftGrammar || !rightGrammar || leftGrammar === rightGrammar;
  const workbookCompatible = !leftWorkbook || !rightWorkbook || leftWorkbook === rightWorkbook;
  return grammarCompatible && workbookCompatible;
};

export const dedupeResourceGroups = (groups = []) =>
  groups.reduce((deduped, group) => {
    if (!group) return deduped;

    const matchIndex = deduped.findIndex((candidate) => groupsAreCompatible(candidate, group));
    if (matchIndex === -1) {
      deduped.push(group);
      return deduped;
    }

    const current = deduped[matchIndex];
    deduped[matchIndex] = {
      ...current,
      chapter: current.chapter || group.chapter || null,
      grammarBook: current.grammarBook || group.grammarBook || null,
      workbook: current.workbook || group.workbook || null,
    };
    return deduped;
  }, []);

const resourceGroups = (raw, level, day) => {
  const nested = [...list(raw.schreiben_sprechen), ...list(raw.lesen_hören)].filter(Boolean);
  const entries = nested.length ? nested : [raw];
  const b1Override = level === "B1" ? getB1LessonResourceOverride(day) : null;
  const hideGrammarBook = shouldHideGrammarBook({ level, day });

  const groups = entries.map((entry) => {
    const chapter = entry.chapter || raw.chapter || b1Override?.chapter || null;
    const workbook = resolveStrictInAppWorkbookRoute({
      level,
      day,
      chapter,
      fallback:
        b1Override?.workbook ||
        first(entry.workbook_link, raw.workbook_link, entry.workbookRoute, raw.workbookRoute),
    });
    const canonicalGrammarBook = hideGrammarBook
      ? ""
      : getCanonicalGrammarBook({ level, day, chapter });
    const grammarBook = hideGrammarBook
      ? ""
      : canonicalGrammarBook ||
        first(entry.grammarbook_link, entry.grammar_link, raw.grammarbook_link, raw.grammar_link);

    return {
      chapter,
      grammarBook: link(grammarBook),
      workbook: link(workbook),
    };
  });

  return dedupeResourceGroups(groups);
};

const addMissingA1TeacherVideos = ({ level, day, videos = [], groups = [] }) => {
  if (level !== "A1") return videos;

  const singleGroupChapter = groups.length === 1 ? chapterKey(groups[0]?.chapter) : "";
  const chaptersWithTeacher = new Set();
  videos.filter(isTeacherVideo).forEach((video) => {
    const aliases = chapterAliases(video.chapter || singleGroupChapter);
    aliases.forEach((chapter) => chaptersWithTeacher.add(chapter));
  });

  const existingUrls = new Set(videos.map((video) => video?.url).filter(Boolean));
  const missingTeacherVideos = getA1TeacherVideoResources(day).filter((video) => {
    const chapter = chapterKey(video.chapter);
    return !existingUrls.has(video.url) && !chaptersWithTeacher.has(chapter);
  });

  return mergeVideos(missingTeacherVideos, videos);
};

export const scopeLessonVideosToSelectedChapters = (videos = [], groups = []) => {
  const selectedChapters = new Set(groups.map((group) => chapterKey(group?.chapter)).filter(Boolean));

  if (selectedChapters.size !== 1) return videos;

  return videos.filter((video) => {
    const videoChapters = chapterAliases(video?.chapter);
    return !videoChapters.length || videoChapters.some((chapter) => selectedChapters.has(chapter));
  });
};

export const normalizeLesson = (rawLesson = {}, requestedLevel = rawLesson.level) => {
  const level = levelKey(requestedLevel);
  const day = Number(rawLesson.day ?? rawLesson.assignmentDay ?? 0);
  const primary = firstLesson(rawLesson);
  const capabilities = LEVEL_CAPABILITIES[level] || LEVEL_CAPABILITIES.A1;
  const groups = resourceGroups(rawLesson, level, day);
  const configuredVideos = mergeVideos(
    getLessonVideoResources(level, day, rawLesson),
    getAdditionalLessonVideoResources(level, day),
  );
  const allVideos = addMissingA1TeacherVideos({
    level,
    day,
    videos: configuredVideos,
    groups,
  });
  const videos = scopeLessonVideosToSelectedChapters(allVideos, groups);
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
      teacherVideo: videos.find(isTeacherVideo) || null,
      aiVideo: videos.find((item) => !isTeacherVideo(item)) || null,
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
