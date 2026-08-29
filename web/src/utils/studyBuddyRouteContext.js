import {
  A1_CANONICAL_LESSON_CATALOG,
  getA1CanonicalLesson,
  getA1CanonicalLessonForLegacyRoute,
} from "../data/a1CanonicalLessonCatalog";
import {
  getA1CanonicalLessonChapter,
  getA1RequestedChapterFromSearch,
} from "../data/a1CanonicalLessonRoutes";

const SUPPORTED_LEVELS = ["A1", "A2", "B1", "B2", "C1"];

const normalizeLevel = (value = "") => {
  const match = String(value || "").toUpperCase().match(/(?:^|[^A-Z0-9])(A1|A2|B1|B2|C1)(?:$|[^A-Z0-9])/);
  return match ? match[1] : "";
};

const normalizePath = (value = "") => String(value || "").replace(/\/+$/, "") || "/";

const routePath = (value = "") => {
  try {
    return normalizePath(new URL(String(value || ""), "https://www.falowen.app").pathname);
  } catch (_error) {
    return normalizePath(String(value || "").split(/[?#]/)[0]);
  }
};

const humanizeSlug = (slug = "") => {
  const cleaned = String(slug || "")
    .replace(/-(?:workbook|grammar-notes|grammar|radio)$/i, "")
    .replace(/^(?:a1|a2|b1|b2|c1)-/i, "")
    .replace(/-+/g, " ")
    .trim();

  if (!cleaned || /^\d+$/.test(cleaned)) return "";

  return cleaned.replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const getSurface = (pathname = "", search = "") => {
  const params = new URLSearchParams(search || "");
  const view = String(params.get("view") || "").toLowerCase();

  if (view === "workbook" || /workbook\/?$/i.test(pathname)) return "Workbook";
  if (view === "grammar" || /grammar(?:-notes)?\/?$/i.test(pathname)) return "Grammar";
  if (view === "radio" || /radio\/?$/i.test(pathname)) return "Audio";
  if (/speaking|sprechen|speech/i.test(pathname)) return "Speaking practice";
  if (/writing|schreiben|letter/i.test(pathname)) return "Writing practice";
  if (/exam/i.test(pathname)) return "Exam practice";
  if ((pathname.replace(/\/+$/, "") || "/") === "/campus/course") return "Course Book";
  return "Lesson";
};

const toA1RouteMatch = (lesson) => {
  if (!lesson) return null;
  const isPractice = lesson.kind === "practice";
  const numericDay = Number(lesson.day);

  return {
    routeFamily: isPractice ? "a1-self-learning" : "a1-tutor-marked-assignment",
    learningMode: isPractice ? "self-learning" : "tutor-marked-assignment",
    level: "A1",
    day: Number.isFinite(numericDay) ? numericDay : null,
    chapter: lesson.chapter || "",
    assignmentKey: lesson.assignmentKey || null,
    catalogKind: lesson.kind || "",
    lessonTitle: lesson.title || "",
  };
};

const resolveA1LearningRoute = (pathname = "", search = "") => {
  const normalizedPath = normalizePath(pathname);

  // Canonical A1 chapter routes intentionally encode assignment vs self-practice
  // in the chapter identity (for example 1.1 vs 1.1-practice).
  const canonicalChapter = getA1CanonicalLessonChapter(normalizedPath);
  if (canonicalChapter) {
    return toA1RouteMatch(getA1CanonicalLesson(canonicalChapter));
  }

  // A1 also has short chapter routes such as /lesson/A1/1.1. Keep these
  // separate from the numeric-day legacy route handled below.
  const shortMatch = normalizedPath.match(/^\/campus\/course\/lesson\/A1\/([^/]+)$/i);
  if (shortMatch && !/^\d+$/.test(shortMatch[1])) {
    let identity = shortMatch[1];
    try {
      identity = decodeURIComponent(identity);
    } catch (_error) {
      // Keep the encoded token if decoding fails.
    }
    const lesson = getA1CanonicalLesson(identity);
    if (lesson) return toA1RouteMatch(lesson);
  }

  // Legacy A1 day routes need their chapter query to decide whether the learner
  // is opening a tutor-marked assignment or a self-learning practice.
  const legacyMatch = normalizedPath.match(/^\/campus\/course\/lesson\/A1\/(\d+)$/i);
  if (legacyMatch) {
    const identity = getA1RequestedChapterFromSearch(search);
    const lesson = getA1CanonicalLessonForLegacyRoute({
      day: Number(legacyMatch[1]),
      identity,
    });
    if (lesson) return toA1RouteMatch(lesson);
  }

  // Several A1 self-learning destinations do not contain "A1" in the slug
  // (for example speaking-exams-intro-4-7 and verboten-erlaubt-5-9), so use
  // the canonical A1 catalog instead of guessing from the pathname.
  const directLesson = A1_CANONICAL_LESSON_CATALOG.find(
    (lesson) => routePath(lesson.destination) === normalizedPath,
  );
  return toA1RouteMatch(directLesson);
};

const resolveCanonicalLesson = (pathname = "") => {
  const match = pathname.match(/^\/campus\/course\/lesson\/(A1|A2|B1|B2|C1)\/(\d+)\/?$/i);
  if (!match) return null;
  return {
    routeFamily: "canonical-lesson",
    level: match[1].toUpperCase(),
    day: Number(match[2]),
  };
};

const resolveSelfLearningLesson = (pathname = "") => {
  const match = pathname.match(/^\/campus\/course\/(B2|C1)-self-learning(?:\/day-(\d+))?\/?$/i);
  if (!match) return null;
  return {
    routeFamily: "self-learning",
    learningMode: "self-learning",
    level: match[1].toUpperCase(),
    day: match[2] ? Number(match[2]) : null,
  };
};

const resolveDirectLevelRoute = (pathname = "") => {
  const level = normalizeLevel(pathname);
  if (!level) return null;
  const dayMatch = pathname.match(/(?:^|[-/])day[-/ ]?(\d+)(?:[-/]|$)/i);
  return {
    routeFamily: "direct-level-page",
    level,
    day: dayMatch ? Number(dayMatch[1]) : null,
  };
};

export const resolveStudyBuddyRouteContext = ({ pathname = "", search = "", profileLevel = "" } = {}) => {
  const normalizedPath = pathname || "/";
  const a1Learning = resolveA1LearningRoute(normalizedPath, search);
  const canonical = resolveCanonicalLesson(normalizedPath);
  const selfLearning = resolveSelfLearningLesson(normalizedPath);
  const direct = resolveDirectLevelRoute(normalizedPath);
  const routeMatch = a1Learning || canonical || selfLearning || direct || {};
  const fallbackLevel = normalizeLevel(profileLevel);
  const level = routeMatch.level || fallbackLevel;
  const surface = getSurface(normalizedPath, search);
  const slug = normalizedPath.split("/").filter(Boolean).pop() || "";
  const inferredTitle = humanizeSlug(slug);
  const day = Number.isFinite(routeMatch.day) ? routeMatch.day : null;
  const lessonTitle = routeMatch.lessonTitle || inferredTitle || (day ? `Day ${day}` : surface);
  const label = [
    level,
    day ? `Day ${day}` : "",
    routeMatch.learningMode === "tutor-marked-assignment" ? "Tutor-marked" : "",
    routeMatch.learningMode === "self-learning" ? "Self-learning" : "",
    surface,
  ].filter(Boolean).join(" · ");

  return {
    level,
    day,
    surface,
    label: label || surface,
    lessonTitle,
    topic: routeMatch.lessonTitle || inferredTitle || lessonTitle,
    route: `${normalizedPath}${search || ""}`,
    routeFamily: routeMatch.routeFamily || (normalizedPath.startsWith("/campus/") ? "campus-page" : "app-page"),
    learningMode: routeMatch.learningMode || "",
    chapter: routeMatch.chapter || "",
    assignmentKey: routeMatch.assignmentKey || null,
    catalogKind: routeMatch.catalogKind || "",
  };
};

export const STUDY_BUDDY_SUPPORTED_LEVELS = SUPPORTED_LEVELS;
