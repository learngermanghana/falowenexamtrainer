import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { alignA1CurriculumEntries } from "../data/a1RouteAlignment";
import { getLessonsByLevel } from "../data/lessonCatalog";

const HEADER_ATTRIBUTE = "data-a1-workbook-video-header";
const HEADER_LESSON_ATTRIBUTE = "data-a1-workbook-video-lesson";
const RADIO_GATE_SELECTOR = '[data-a1-radio-first-workbook-route="true"]';
const NON_WORKBOOK_VIEWS = new Set(["grammar", "learn"]);

const normalizePath = (value = "") => String(value || "").replace(/\/+$/, "") || "/";
const normalizeToken = (value = "") => String(value || "").trim().toLowerCase();
const normalizeAssignment = (value = "") => String(value || "").trim().toUpperCase();

const alignedA1Lessons = alignA1CurriculumEntries(getLessonsByLevel("A1"));

const parseRoute = (value = "") => {
  try {
    return new URL(String(value || ""), "https://www.falowen.app");
  } catch (_error) {
    return null;
  }
};

export const extractYouTubeVideoId = (value = "") => {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (/^[A-Za-z0-9_-]{11}$/.test(raw)) return raw;

  try {
    const parsed = new URL(raw, "https://www.youtube.com");
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
    if (host === "youtu.be") return parsed.pathname.split("/").filter(Boolean)[0] || "";
    if (host.endsWith("youtube.com")) {
      if (parsed.searchParams.get("v")) return parsed.searchParams.get("v") || "";
      const parts = parsed.pathname.split("/").filter(Boolean);
      const markerIndex = parts.findIndex((part) => ["embed", "shorts", "live"].includes(part));
      if (markerIndex >= 0) return parts[markerIndex + 1] || "";
    }
  } catch (_error) {
    return "";
  }

  return "";
};

export const getA1LessonVideoSource = (lesson = {}) =>
  lesson.aiVideo ||
  lesson.ai_video ||
  lesson.grammarExplainerVideo ||
  lesson.teacherVideo ||
  lesson.video ||
  "";

const routeMatchesSearch = (routeUrl, currentSearchParams) => {
  if (!routeUrl) return false;
  for (const [key, value] of routeUrl.searchParams.entries()) {
    if (currentSearchParams.get(key) !== value) return false;
  }
  return true;
};

const selectLessonCandidate = (candidates = [], searchParams = new URLSearchParams()) => {
  if (!candidates.length) return null;

  const assignmentKey = normalizeAssignment(
    searchParams.get("assignmentKey") || searchParams.get("assignmentId"),
  );
  if (assignmentKey) {
    const byAssignment = candidates.find(
      (lesson) => normalizeAssignment(lesson.assignmentId || lesson.id) === assignmentKey,
    );
    if (byAssignment) return byAssignment;
  }

  const chapter = normalizeToken(searchParams.get("chapter"));
  if (chapter) {
    const byChapter = candidates.find((lesson) => normalizeToken(lesson.chapter) === chapter);
    if (byChapter) return byChapter;
  }

  return candidates.length === 1 ? candidates[0] : null;
};

export const resolveA1WorkbookVideoLesson = ({ pathname = "", search = "" } = {}) => {
  const normalizedPathname = normalizePath(pathname);
  const searchParams = new URLSearchParams(search || "");
  const requestedView = normalizeToken(searchParams.get("view"));
  if (NON_WORKBOOK_VIEWS.has(requestedView)) return null;

  const dynamicMatch = normalizedPathname.match(/^\/campus\/course\/lesson\/A1\/(\d+)$/i);
  if (dynamicMatch) {
    const day = Number(dynamicMatch[1]);
    return selectLessonCandidate(
      alignedA1Lessons.filter((lesson) => Number(lesson.day) === day),
      searchParams,
    );
  }

  const routeCandidates = alignedA1Lessons.filter((lesson) => {
    const routeUrl = parseRoute(lesson.workbookRoute);
    return (
      routeUrl &&
      normalizePath(routeUrl.pathname) === normalizedPathname &&
      routeMatchesSearch(routeUrl, searchParams)
    );
  });

  return selectLessonCandidate(routeCandidates, searchParams);
};

export const buildA1WorkbookVideoModel = ({ pathname = "", search = "" } = {}) => {
  const lesson = resolveA1WorkbookVideoLesson({ pathname, search });
  if (!lesson) return null;

  const sourceUrl = getA1LessonVideoSource(lesson);
  const youtubeId = extractYouTubeVideoId(sourceUrl);
  return {
    lesson,
    lessonId: String(lesson.id || lesson.assignmentId || `${lesson.day}-${lesson.chapter}`),
    day: Number(lesson.day),
    chapter: String(lesson.chapter || ""),
    title: String(lesson.title || "A1 lesson"),
    assessmentLabel: lesson.submissionRequired ? "Tutor-marked assignment" : "Self-practice",
    sourceUrl,
    youtubeId,
    embedUrl: youtubeId ? `https://www.youtube-nocookie.com/embed/${youtubeId}` : "",
  };
};

const setStyles = (element, styles) => Object.assign(element.style, styles);

const findTopLevelChild = (element, root) => {
  let current = element;
  while (current?.parentElement && current.parentElement !== root) current = current.parentElement;
  return current?.parentElement === root ? current : null;
};

export const findA1WorkbookVideoInsertionPoint = (root = document) => {
  const main = root?.querySelector?.("main.layout-main") || root?.querySelector?.("main");
  if (!main) return null;

  const heading = main.querySelector("h1");
  if (!heading) return null;

  const pageRoot = findTopLevelChild(heading, main) || main;
  const heroBlock = findTopLevelChild(heading, pageRoot) || heading.parentElement;
  const backControl = Array.from(pageRoot.querySelectorAll("a, button")).find((element) =>
    /^back\b/i.test(String(element.textContent || "").replace(/\s+/g, " ").trim()),
  );
  const backBlock = backControl ? findTopLevelChild(backControl, pageRoot) : null;

  if (backBlock && heroBlock && backBlock !== heroBlock) {
    return { container: pageRoot, reference: backBlock.nextElementSibling || null };
  }

  if (heroBlock && heading.parentElement === heroBlock) {
    return { container: heroBlock, reference: heading };
  }

  return { container: pageRoot, reference: heroBlock || pageRoot.firstElementChild };
};

const createVideoHeader = (model) => {
  const card = document.createElement("section");
  card.setAttribute(HEADER_ATTRIBUTE, "true");
  card.setAttribute(HEADER_LESSON_ATTRIBUTE, model.lessonId);
  setStyles(card, {
    background: "linear-gradient(135deg, #eff6ff, #ffffff)",
    border: "1px solid #93c5fd",
    borderRadius: "18px",
    boxShadow: "0 14px 30px rgba(37, 99, 235, 0.12)",
    display: "grid",
    gap: "12px",
    margin: "0",
    padding: "14px",
    width: "100%",
  });

  const topRow = document.createElement("div");
  setStyles(topRow, {
    alignItems: "flex-start",
    display: "flex",
    gap: "12px",
    justifyContent: "space-between",
  });

  const copy = document.createElement("div");
  setStyles(copy, { display: "grid", gap: "4px", minWidth: "0" });

  const eyebrow = document.createElement("span");
  eyebrow.textContent = `AI lesson video · A1 · Day ${model.day} · Kapitel ${model.chapter}`;
  setStyles(eyebrow, {
    color: "#1d4ed8",
    fontSize: "12px",
    fontWeight: "900",
    letterSpacing: ".04em",
    textTransform: "uppercase",
  });

  const heading = document.createElement("strong");
  heading.textContent = model.title;
  setStyles(heading, { color: "#0f172a", fontSize: "18px", lineHeight: "1.35" });

  const description = document.createElement("p");
  description.textContent = `${model.assessmentLabel} · Watch the explanation before you start the workbook.`;
  setStyles(description, { color: "#475569", lineHeight: "1.55", margin: "0" });

  copy.append(eyebrow, heading, description);
  topRow.appendChild(copy);

  const body = document.createElement("div");
  setStyles(body, { display: "grid", gap: "10px" });

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.textContent = "Hide video";
  toggle.setAttribute("aria-expanded", "true");
  setStyles(toggle, {
    background: "#ffffff",
    border: "1px solid #93c5fd",
    borderRadius: "999px",
    color: "#1d4ed8",
    cursor: "pointer",
    flex: "0 0 auto",
    fontWeight: "900",
    padding: "8px 12px",
  });
  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", expanded ? "false" : "true");
    toggle.textContent = expanded ? "Show video" : "Hide video";
    body.hidden = expanded;
  });
  topRow.appendChild(toggle);
  card.append(topRow, body);

  if (model.embedUrl) {
    const shell = document.createElement("div");
    setStyles(shell, {
      aspectRatio: "16 / 9",
      background: "#000000",
      border: "1px solid #bfdbfe",
      borderRadius: "14px",
      overflow: "hidden",
      position: "relative",
      width: "100%",
    });

    const frame = document.createElement("iframe");
    frame.src = model.embedUrl;
    frame.title = `${model.title} · AI lesson video`;
    frame.loading = "lazy";
    frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    frame.allowFullscreen = true;
    setStyles(frame, { border: "0", height: "100%", inset: "0", position: "absolute", width: "100%" });
    shell.appendChild(frame);
    body.appendChild(shell);

    const link = document.createElement("a");
    link.href = model.sourceUrl;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = "Open AI lesson video on YouTube";
    setStyles(link, { color: "#1d4ed8", fontWeight: "800", width: "fit-content" });
    body.appendChild(link);
  } else {
    const notice = document.createElement("div");
    notice.textContent = "AI lesson video coming soon. Continue with the workbook activities below.";
    setStyles(notice, {
      background: "#fffbeb",
      border: "1px solid #fde68a",
      borderRadius: "12px",
      color: "#92400e",
      fontWeight: "800",
      lineHeight: "1.55",
      padding: "12px",
    });
    body.appendChild(notice);
  }

  return card;
};

export const applyA1WorkbookVideoHeader = ({
  root = document,
  pathname = typeof window !== "undefined" ? window.location.pathname : "",
  search = typeof window !== "undefined" ? window.location.search : "",
} = {}) => {
  if (!root?.querySelector) return 0;

  const existing = root.querySelector(`[${HEADER_ATTRIBUTE}="true"]`);
  const model = buildA1WorkbookVideoModel({ pathname, search });
  if (!model || root.querySelector(RADIO_GATE_SELECTOR)) {
    existing?.remove();
    return 0;
  }

  const insertion = findA1WorkbookVideoInsertionPoint(root);
  if (!insertion?.container) {
    existing?.remove();
    return 0;
  }

  if (existing?.getAttribute(HEADER_LESSON_ATTRIBUTE) === model.lessonId) {
    if (existing.parentElement !== insertion.container || existing.nextElementSibling !== insertion.reference) {
      insertion.container.insertBefore(existing, insertion.reference);
    }
    return 1;
  }

  existing?.remove();
  insertion.container.insertBefore(createVideoHeader(model), insertion.reference);
  return 1;
};

export default function A1WorkbookVideoHeader() {
  const location = useLocation();

  useEffect(() => {
    let scheduled = false;
    const run = () =>
      applyA1WorkbookVideoHeader({
        root: document,
        pathname: location.pathname,
        search: location.search,
      });
    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(() => {
        scheduled = false;
        run();
      });
    };

    run();
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      document.querySelector(`[${HEADER_ATTRIBUTE}="true"]`)?.remove();
    };
  }, [location.pathname, location.search]);

  return null;
}

export const __private__ = {
  alignedA1Lessons,
  createVideoHeader,
  normalizePath,
};
