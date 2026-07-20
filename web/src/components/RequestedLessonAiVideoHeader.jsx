import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const VIDEO_HEADER_ATTRIBUTE = "data-requested-lesson-ai-video";
const VIDEO_KEY_ATTRIBUTE = "data-requested-lesson-ai-video-key";
const HIDDEN_NATIVE_ATTRIBUTE = "data-requested-ai-native-hidden";
const HIDDEN_NATIVE_DISPLAY_ATTRIBUTE = "data-requested-ai-native-display";

export const REQUESTED_LESSON_AI_VIDEOS = Object.freeze([
  Object.freeze({
    key: "b2-day7-chapter-2.2-ai-video",
    level: "B2",
    day: 7,
    pathname: "/campus/course/lesson/B2/7",
    requiredParams: Object.freeze({ chapter: "2.2" }),
    title: "Gesellschaftliche Vielfalt",
    videoId: "iCvmhacEpSM",
    description:
      "Watch this AI explanation before continuing with the B2 lesson activities.",
  }),
  Object.freeze({
    key: "b1-day15-lesson-hub-ai-video",
    level: "B1",
    day: 15,
    pathname: "/campus/course/lesson/B1/15",
    requiredParams: Object.freeze({ chapter: "5.15", hub: "1" }),
    title: "Medien und Arbeiten im Homeoffice",
    videoId: "bWiBTVo0EU4",
    description:
      "Watch this AI explanation from the lesson hub before opening the B1 workbook assignment.",
  }),
]);

const normalizePath = (value = "") => String(value || "").replace(/\/+$/, "") || "/";
const normalizeText = (value = "") => String(value || "").replace(/\s+/g, " ").trim();

export const resolveRequestedLessonAiVideo = ({ pathname = "", search = "" } = {}) => {
  const normalizedPathname = normalizePath(pathname);
  const searchParams = new URLSearchParams(search || "");

  return REQUESTED_LESSON_AI_VIDEOS.find((entry) => {
    if (normalizePath(entry.pathname) !== normalizedPathname) return false;
    return Object.entries(entry.requiredParams || {}).every(
      ([key, value]) => searchParams.get(key) === value,
    );
  }) || null;
};

const setStyles = (element, styles) => Object.assign(element.style, styles);

export const createRequestedLessonAiVideoCard = (model) => {
  const card = document.createElement("section");
  card.setAttribute(VIDEO_HEADER_ATTRIBUTE, "true");
  card.setAttribute(VIDEO_KEY_ATTRIBUTE, model.key);
  setStyles(card, {
    background: "linear-gradient(135deg, #eff6ff, #ffffff)",
    border: "1px solid #93c5fd",
    borderRadius: "18px",
    boxShadow: "0 14px 30px rgba(37, 99, 235, 0.12)",
    boxSizing: "border-box",
    display: "grid",
    gap: "12px",
    padding: "14px",
    width: "100%",
  });

  const heading = document.createElement("h2");
  heading.textContent = "AI lesson video";
  setStyles(heading, { color: "#0f172a", fontSize: "1.2rem", margin: "0" });

  const title = document.createElement("strong");
  title.textContent = `${model.level} · Day ${model.day} · ${model.title}`;
  setStyles(title, { color: "#1d4ed8", lineHeight: "1.45" });

  const description = document.createElement("p");
  description.textContent = model.description;
  setStyles(description, { color: "#475569", lineHeight: "1.55", margin: "0" });

  const shell = document.createElement("div");
  setStyles(shell, {
    aspectRatio: "16 / 9",
    background: "#000000",
    borderRadius: "14px",
    overflow: "hidden",
    position: "relative",
    width: "100%",
  });

  const frame = document.createElement("iframe");
  frame.src = `https://www.youtube-nocookie.com/embed/${model.videoId}`;
  frame.title = `${model.title} · AI lesson video`;
  frame.loading = "lazy";
  frame.allow =
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  frame.allowFullscreen = true;
  setStyles(frame, {
    border: "0",
    height: "100%",
    inset: "0",
    position: "absolute",
    width: "100%",
  });
  shell.appendChild(frame);

  const link = document.createElement("a");
  link.href = `https://youtu.be/${model.videoId}`;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = "Open AI lesson video on YouTube";
  setStyles(link, { color: "#1d4ed8", fontWeight: "800", width: "fit-content" });

  card.append(heading, title, description, shell, link);
  return card;
};

const findLessonHeading = (main, model) => {
  const headings = Array.from(main?.querySelectorAll?.("h1") || []);
  return headings.find((heading) => normalizeText(heading.textContent).includes(model.title))
    || headings[0]
    || null;
};

export const findRequestedLessonAiVideoAnchor = (root, model) => {
  const main = root?.querySelector?.("main.layout-main") || root?.querySelector?.("main");
  if (!main) return null;

  const heading = findLessonHeading(main, model);
  if (!heading) return null;

  if (model.level === "B2") return heading.closest("header") || heading.parentElement;
  return heading.parentElement;
};

export const hideNativeRequestedAiVideoSection = (root = document) => {
  const nativeHeading = Array.from(root?.querySelectorAll?.("h2") || []).find(
    (heading) => normalizeText(heading.textContent).toLowerCase() === "ai video",
  );
  const section = nativeHeading?.closest?.("section");
  if (!section || section.hasAttribute(VIDEO_HEADER_ATTRIBUTE)) return null;

  if (!section.hasAttribute(HIDDEN_NATIVE_ATTRIBUTE)) {
    section.setAttribute(HIDDEN_NATIVE_ATTRIBUTE, "true");
    section.setAttribute(HIDDEN_NATIVE_DISPLAY_ATTRIBUTE, section.style.display || "");
  }
  section.style.display = "none";
  return section;
};

export const restoreNativeRequestedAiVideoSection = (root = document) => {
  Array.from(root?.querySelectorAll?.(`[${HIDDEN_NATIVE_ATTRIBUTE}]`) || []).forEach((section) => {
    section.style.display = section.getAttribute(HIDDEN_NATIVE_DISPLAY_ATTRIBUTE) || "";
    section.removeAttribute(HIDDEN_NATIVE_ATTRIBUTE);
    section.removeAttribute(HIDDEN_NATIVE_DISPLAY_ATTRIBUTE);
  });
};

export const applyRequestedLessonAiVideoHeader = ({
  root = document,
  pathname = typeof window !== "undefined" ? window.location.pathname : "",
  search = typeof window !== "undefined" ? window.location.search : "",
} = {}) => {
  if (!root?.querySelector) return 0;

  const existing = root.querySelector(`[${VIDEO_HEADER_ATTRIBUTE}="true"]`);
  const model = resolveRequestedLessonAiVideo({ pathname, search });
  if (!model) {
    existing?.remove();
    restoreNativeRequestedAiVideoSection(root);
    return 0;
  }

  if (model.level === "B2") hideNativeRequestedAiVideoSection(root);
  const anchor = findRequestedLessonAiVideoAnchor(root, model);
  if (!anchor?.parentElement) {
    existing?.remove();
    return 0;
  }

  if (existing?.getAttribute(VIDEO_KEY_ATTRIBUTE) === model.key) {
    if (anchor.nextElementSibling !== existing) anchor.insertAdjacentElement("afterend", existing);
    return 1;
  }

  existing?.remove();
  anchor.insertAdjacentElement("afterend", createRequestedLessonAiVideoCard(model));
  return 1;
};

export default function RequestedLessonAiVideoHeader() {
  const location = useLocation();

  useEffect(() => {
    let scheduled = false;
    const run = () =>
      applyRequestedLessonAiVideoHeader({
        root: document,
        pathname: location.pathname,
        search: location.search,
      });
    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      const requestFrame = window.requestAnimationFrame
        || ((callback) => window.setTimeout(callback, 0));
      requestFrame(() => {
        scheduled = false;
        run();
      });
    };

    run();
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      document.querySelector(`[${VIDEO_HEADER_ATTRIBUTE}="true"]`)?.remove();
      restoreNativeRequestedAiVideoSection(document);
    };
  }, [location.pathname, location.search]);

  return null;
}
