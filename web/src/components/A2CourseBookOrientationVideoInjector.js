import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const A2_ORIENTATION_VIDEO_ID = "3TL_2L8RgUw";
const A2_ORIENTATION_VIDEO_URL = `https://youtu.be/${A2_ORIENTATION_VIDEO_ID}`;
const A2_ORIENTATION_VIDEO_EMBED_URL = `https://www.youtube-nocookie.com/embed/${A2_ORIENTATION_VIDEO_ID}`;
const A2_DAY0_TUTORIAL_URL = "/campus/course/a2-day-0-orientation-and-knowledge-test-workbook";
const CARD_ATTR = "data-a2-course-book-orientation-video";

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

const setStyles = (element, styles) => Object.assign(element.style, styles);

const createA2OrientationCard = () => {
  const wrapper = document.createElement("section");
  wrapper.setAttribute(CARD_ATTR, "true");
  setStyles(wrapper, {
    border: "1px solid #bfdbfe",
    borderRadius: "18px",
    background: "linear-gradient(135deg, #eff6ff, #ffffff)",
    boxShadow: "0 16px 34px rgba(37, 99, 235, 0.12)",
    display: "grid",
    gap: "12px",
    padding: "14px",
  });

  const headingWrap = document.createElement("div");
  setStyles(headingWrap, { display: "grid", gap: "4px" });

  const eyebrow = document.createElement("span");
  eyebrow.textContent = "A2 orientation · start here";
  setStyles(eyebrow, {
    color: "#1d4ed8",
    fontSize: "12px",
    fontWeight: "900",
    letterSpacing: ".04em",
    textTransform: "uppercase",
  });

  const heading = document.createElement("strong");
  heading.textContent = "Watch this before you open the tutorial";
  setStyles(heading, { color: "#0f172a", fontSize: "18px" });

  const description = document.createElement("p");
  description.textContent =
    "This video explains how to use A2 Course Book, Falowen Radio, workbooks and submissions. Watch it first, then open the Day 0 tutorial.";
  setStyles(description, {
    margin: "0",
    color: "#334155",
    lineHeight: "1.6",
    fontSize: "14px",
  });

  headingWrap.append(eyebrow, heading, description);

  const videoShell = document.createElement("div");
  setStyles(videoShell, {
    position: "relative",
    width: "100%",
    paddingTop: "56.25%",
    borderRadius: "16px",
    overflow: "hidden",
    background: "#000000",
    border: "1px solid #93c5fd",
  });

  const frame = document.createElement("iframe");
  frame.src = A2_ORIENTATION_VIDEO_EMBED_URL;
  frame.title = "A2 orientation video";
  frame.loading = "lazy";
  frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  frame.allowFullscreen = true;
  setStyles(frame, {
    position: "absolute",
    inset: "0",
    width: "100%",
    height: "100%",
    border: "0",
  });
  videoShell.appendChild(frame);

  const actionRow = document.createElement("div");
  setStyles(actionRow, { display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" });

  const tutorialLink = document.createElement("a");
  tutorialLink.href = A2_DAY0_TUTORIAL_URL;
  tutorialLink.textContent = "Open Day 0 tutorial";
  setStyles(tutorialLink, {
    background: "#2563eb",
    borderRadius: "999px",
    color: "#ffffff",
    fontWeight: "900",
    padding: "10px 14px",
    textDecoration: "none",
  });

  const youtubeLink = document.createElement("a");
  youtubeLink.href = A2_ORIENTATION_VIDEO_URL;
  youtubeLink.target = "_blank";
  youtubeLink.rel = "noreferrer";
  youtubeLink.textContent = "Open on YouTube";
  setStyles(youtubeLink, {
    background: "#ffffff",
    border: "1px solid #bfdbfe",
    borderRadius: "999px",
    color: "#1d4ed8",
    fontWeight: "900",
    padding: "10px 14px",
    textDecoration: "none",
  });

  actionRow.append(tutorialLink, youtubeLink);
  wrapper.append(headingWrap, videoShell, actionRow);
  return wrapper;
};

export const applyA2CourseBookOrientationVideo = (root = document) => {
  if (!root?.querySelector || typeof document === "undefined") return 0;

  const existing = root.querySelector(`[${CARD_ATTR}="true"]`);
  if (normalizePath() !== "/campus/course") {
    existing?.remove();
    return 0;
  }

  const hero = findCourseBookHero(root);
  if (!hero) {
    existing?.remove();
    return 0;
  }

  const selectedLevel = readSelectedLevel(hero);
  if (selectedLevel !== "A2") {
    existing?.remove();
    return 0;
  }

  if (existing) {
    if (existing.previousElementSibling !== hero) hero.insertAdjacentElement("afterend", existing);
    return 1;
  }

  hero.insertAdjacentElement("afterend", createA2OrientationCard());
  return 1;
};

export default function A2CourseBookOrientationVideoInjector() {
  const location = useLocation();

  useEffect(() => {
    let scheduled = false;
    const run = () => applyA2CourseBookOrientationVideo(document);
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
    };
  }, [location.pathname, location.search]);

  return null;
}

export const __private__ = {
  A2_ORIENTATION_VIDEO_ID,
  A2_ORIENTATION_VIDEO_URL,
  A2_DAY0_TUTORIAL_URL,
  findCourseBookHero,
  readSelectedLevel,
};
