import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const LEVEL_ORIENTATION_CONFIG = {
  A1: {
    videoId: "qPwxBYlu3CE",
    title: "A1 orientation video",
    description:
      "This video explains how to start A1, use the Course Book and complete Day 0 before the first real lesson.",
  },
  A2: {
    videoId: "kV6BHHfZfPs",
    title: "A2 orientation video",
    description:
      "This video explains how to use A2 Course Book, Falowen Radio, workbooks and submissions. Watch it before continuing to Day 1.",
  },
  B1: {
    videoId: ["QMWj", "_N6ncwI"].join(""),
    title: "B1 orientation video",
    description:
      "This video explains how to continue with B1, use the Course Book, prepare speaking, write better answers and submit workbook tasks.",
  },
  B2: {
    videoId: "AH2dPdqjfTo",
    title: "B2 self-learning onboarding video",
    description:
      "This video explains how to use B2 self-learning, Falowen AI, Course Book routines and independent workbook practice.",
  },
  C1: {
    videoId: "",
    title: "C1 orientation tutorial",
    description:
      "Complete the C1 Day 0 progression tutorial before continuing. The orientation video will be added here when it is ready.",
  },
};

const HOST_ATTR = "data-course-book-orientation-video";
const PANEL_ATTR = "data-course-book-orientation-panel";

const normalizeText = (value = "") =>
  String(value || "")
    .replace(/\s+/g, " ")
    .trim();

const normalizePath = () => {
  if (typeof window === "undefined") return "";
  return window.location.pathname.replace(/\/+$/, "") || "/";
};

const findCourseBookHero = (root = document) => {
  if (!root?.querySelectorAll) return null;
  const heading = [...root.querySelectorAll("h1, h2, h3")].find(
    (element) => normalizeText(element.textContent).toLowerCase() === "course book"
  );
  return heading?.closest("section") || null;
};

const readSelectedLevel = (hero) => {
  const selectValue = normalizeText(hero?.querySelector("select")?.value).toUpperCase();
  if (selectValue) return selectValue;
  const text = normalizeText(hero?.textContent).toUpperCase();
  return text.match(/\b(A1|A2|B1|B2|C1)\b/)?.[1] || "";
};

const isDayZeroLessonCard = (article) => {
  if (!article?.querySelectorAll) return false;
  return [...article.querySelectorAll("div, span, p, strong")].some((element) =>
    /^day\s*0(?:\s|$)/i.test(normalizeText(element.textContent))
  );
};

const findDayZeroLessonCard = (root = document) =>
  [...(root.querySelectorAll?.("article") || [])].find(isDayZeroLessonCard) || null;

const setStyles = (element, styles) => Object.assign(element.style, styles);

const getVideoUrl = (videoId = "") => (videoId ? `https://youtu.be/${videoId}` : "");

const createButtonLink = ({ href, text }) => {
  const link = document.createElement("a");
  link.href = href;
  link.textContent = text;
  link.target = "_blank";
  link.rel = "noreferrer";
  setStyles(link, {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "fit-content",
    background: "#2563eb",
    border: "1px solid #1d4ed8",
    borderRadius: "999px",
    color: "#ffffff",
    fontWeight: "900",
    padding: "10px 16px",
    textDecoration: "none",
  });
  return link;
};

const createOrientationPanel = (level, config) => {
  const wrapper = document.createElement("section");
  wrapper.setAttribute(PANEL_ATTR, "true");
  wrapper.setAttribute("data-course-book-orientation-level", level);
  setStyles(wrapper, {
    border: "1px solid #bfdbfe",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #eff6ff, #ffffff)",
    display: "grid",
    gap: "12px",
    padding: "14px",
  });

  const headingWrap = document.createElement("div");
  setStyles(headingWrap, { display: "grid", gap: "4px" });

  const eyebrow = document.createElement("span");
  eyebrow.textContent = `${level} · Day 0`;
  setStyles(eyebrow, {
    color: "#1d4ed8",
    fontSize: "12px",
    fontWeight: "900",
    letterSpacing: ".04em",
    textTransform: "uppercase",
  });

  const heading = document.createElement("strong");
  heading.textContent = config.videoId
    ? "Watch the Day 0 orientation video"
    : "Complete Day 0 before continuing";
  setStyles(heading, { color: "#0f172a", fontSize: "18px" });

  const description = document.createElement("p");
  description.textContent = config.description;
  setStyles(description, {
    margin: "0",
    color: "#334155",
    lineHeight: "1.6",
    fontSize: "14px",
  });

  headingWrap.append(eyebrow, heading, description);
  wrapper.appendChild(headingWrap);

  if (config.videoId) {
    const actionRow = document.createElement("div");
    setStyles(actionRow, { display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" });
    actionRow.appendChild(
      createButtonLink({ href: getVideoUrl(config.videoId), text: "Watch video" })
    );
    wrapper.appendChild(actionRow);
  } else {
    const notice = document.createElement("div");
    notice.textContent = `${level} orientation video will be added later. Complete the Day 0 lesson first.`;
    setStyles(notice, {
      border: "1px solid #fde68a",
      borderRadius: "14px",
      background: "#fffbeb",
      color: "#92400e",
      fontWeight: "800",
      lineHeight: "1.55",
      padding: "12px",
    });
    wrapper.appendChild(notice);
  }

  return wrapper;
};

const clearOrientationHosts = (root, keepHost = null) => {
  root.querySelectorAll?.(`[${HOST_ATTR}="true"]`).forEach((element) => {
    if (element === keepHost) return;
    if (element.tagName === "ARTICLE") element.removeAttribute(HOST_ATTR);
    else element.remove();
  });

  root.querySelectorAll?.(`[${PANEL_ATTR}="true"]`).forEach((panel) => {
    if (!keepHost || panel.closest("article") !== keepHost) panel.remove();
  });
};

export const applyCourseBookOrientationVideo = (root = document) => {
  if (!root?.querySelector || typeof document === "undefined") return 0;

  if (normalizePath() !== "/campus/course") {
    clearOrientationHosts(root);
    return 0;
  }

  const hero = findCourseBookHero(root);
  const selectedLevel = readSelectedLevel(hero);
  const config = LEVEL_ORIENTATION_CONFIG[selectedLevel];
  const dayZeroCard = findDayZeroLessonCard(root);

  if (!hero || !config || !dayZeroCard) {
    clearOrientationHosts(root);
    return 0;
  }

  clearOrientationHosts(root, dayZeroCard);
  if (dayZeroCard.getAttribute(HOST_ATTR) !== "true") {
    dayZeroCard.setAttribute(HOST_ATTR, "true");
  }

  const existingPanel = dayZeroCard.querySelector(`[${PANEL_ATTR}="true"]`);
  if (existingPanel?.getAttribute("data-course-book-orientation-level") === selectedLevel) return 1;
  existingPanel?.remove();

  const panel = createOrientationPanel(selectedLevel, config);
  const firstContentBlock = dayZeroCard.firstElementChild;
  if (firstContentBlock) firstContentBlock.insertAdjacentElement("afterend", panel);
  else dayZeroCard.appendChild(panel);
  return 1;
};

export default function A2CourseBookOrientationVideoInjector() {
  const location = useLocation();

  useEffect(() => {
    let scheduled = false;
    const run = () => applyCourseBookOrientationVideo(document);
    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(() => {
        scheduled = false;
        run();
      });
    };

    run();
    document.addEventListener("change", schedule, true);
    document.addEventListener("click", schedule, true);

    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("change", schedule, true);
      document.removeEventListener("click", schedule, true);
      observer.disconnect();
      clearOrientationHosts(document);
    };
  }, [location.pathname, location.search]);

  return null;
}

export const __private__ = {
  LEVEL_ORIENTATION_CONFIG,
  findCourseBookHero,
  readSelectedLevel,
  isDayZeroLessonCard,
  findDayZeroLessonCard,
  applyCourseBookOrientationVideo,
};