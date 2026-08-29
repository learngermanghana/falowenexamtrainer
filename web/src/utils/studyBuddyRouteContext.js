const SUPPORTED_LEVELS = ["A1", "A2", "B1", "B2", "C1"];

const normalizeLevel = (value = "") => {
  const match = String(value || "").toUpperCase().match(/(?:^|[^A-Z0-9])(A1|A2|B1|B2|C1)(?:$|[^A-Z0-9])/);
  return match ? match[1] : "";
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
  const canonical = resolveCanonicalLesson(normalizedPath);
  const selfLearning = resolveSelfLearningLesson(normalizedPath);
  const direct = resolveDirectLevelRoute(normalizedPath);
  const routeMatch = canonical || selfLearning || direct || {};
  const fallbackLevel = normalizeLevel(profileLevel);
  const level = routeMatch.level || fallbackLevel;
  const surface = getSurface(normalizedPath, search);
  const slug = normalizedPath.split("/").filter(Boolean).pop() || "";
  const inferredTitle = humanizeSlug(slug);
  const day = Number.isFinite(routeMatch.day) ? routeMatch.day : null;
  const lessonTitle = inferredTitle || (day ? `Day ${day}` : surface);
  const label = [level, day ? `Day ${day}` : "", surface].filter(Boolean).join(" · ");

  return {
    level,
    day,
    surface,
    label: label || surface,
    lessonTitle,
    topic: inferredTitle || lessonTitle,
    route: `${normalizedPath}${search || ""}`,
    routeFamily: routeMatch.routeFamily || (normalizedPath.startsWith("/campus/") ? "campus-page" : "app-page"),
  };
};

export const STUDY_BUDDY_SUPPORTED_LEVELS = SUPPORTED_LEVELS;
