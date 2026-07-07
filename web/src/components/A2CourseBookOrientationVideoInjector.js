import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const LEVEL_ORIENTATION_CONFIG = {
  A1: {
    videoId: "qPwxBYlu3CE",
    title: "A1 orientation video",
    tutorialUrl: "/campus/course/a1-day-0-orientation-and-knowledge-test-workbook",
    description:
      "This video explains how to start A1, use the Course Book and complete Day 0 before the first real lesson.",
  },
  A2: {
    videoId: "ORX4KELTPEQ",
    title: "A2 orientation video",
    tutorialUrl: "/campus/course/a2-day-0-orientation-and-knowledge-test-workbook",
    description:
      "This video explains how to use A2 Course Book, Falowen Radio, workbooks and submissions. Watch it first, then open the Day 0 tutorial.",
  },
  B1: {
    videoId: ["QMWj", "_N6ncwI"].join(""),
    title: "B1 orientation video",
    tutorialUrl: "/campus/course/b1-day-0-orientation-and-knowledge-test-workbook",
    description:
      "This video explains how to continue with B1, use the Course Book, prepare speaking, write better answers and submit workbook tasks.",
  },
  B2: {
    videoId: "AH2dPdqjfTo",
    title: "B2 self-learning onboarding video",
    tutorialUrl: "/campus/course/b2-day-0-self-learning-orientation-workbook",
    description:
      "This video explains how to use B2 self-learning, Falowen AI, Course Book routines and independent workbook practice.",
  },
  C1: {
    videoId: "",
    title: "C1 orientation tutorial",
    tutorialUrl: "/campus/course/c1-day-0-progression-workbook",
    description:
      "Open the C1 Day 0 progression tutorial first. Add a C1 orientation video later when it is ready.",
  },
};

const CARD_ATTR = "data-course-book-orientation-video";

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

const getVideoUrl = (videoId = "") => (videoId ? `https://youtu.be/${videoId}` : "");
const getEmbedUrl = (videoId = "") => (videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : "");

const createButtonLink = ({ href, text, primary = false }) => {
  const link = document.createElement("a");
  link.href = href;
  link.textContent = text;
  if (!href.startsWith("/")) {
    link.target = "_blank";
    link.rel = "noreferrer";
  }
  setStyles(link, {
    background: primary ? "#2563eb" : "#ffffff",
    border: primary ? "1px solid #2563eb" : "1px solid #bfdbfe",
    borderRadius: "999px",
    color: primary ? "#ffffff" : "#1d4ed8",
    fontWeight: "900",
    padding: "10px 14px",
    textDecoration: "none",
  });
  return link;
};

const createOrientationCard = (level, config) => {
  const wrapper = document.createElement("section");
  wrapper.setAttribute(CARD_ATTR, "true");
  wrapper.setAttribute("data-course-book-orientation-level", level);
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
  eyebrow.textContent = `${level} orientation · start here`;
  setStyles(eyebrow, {
    color: "#1d4ed8",
    fontSize: "12px",
    fontWeight: "900",
    letterSpacing: ".04em",
    textTransform: "uppercase",
  });

  const heading = document.createElement("strong");
  heading.textContent = config.videoId
    ? "Watch this before you open the tutorial"
    : "Open the tutorial before you continue";
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
    frame.src = getEmbedUrl(config.videoId);
    frame.title = config.title;
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
    wrapper.appendChild(videoShell);
  } else {
    const notice = document.createElement("div");
    notice.textContent = `${level} orientation video will be added later. Use the Day 0 tutorial first.`;
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

  const actionRow = document.createElement("div");
  setStyles(actionRow, { display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" });
  actionRow.appendChild(createButtonLink({ href: config.tutorialUrl, text: "Open Day 0 tutorial", primary: true }));
  if (config.videoId) actionRow.appendChild(createButtonLink({ href: getVideoUrl(config.videoId), text: "Open video on YouTube" }));

  wrapper.appendChild(actionRow);
  return wrapper;
};

export const applyCourseBookOrientationVideo = (root = document) => {
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
  const config = LEVEL_ORIENTATION_CONFIG[selectedLevel];
  if (!config) {
    existing?.remove();
    return 0;
  }

  if (existing?.getAttribute("data-course-book-orientation-level") !== selectedLevel) {
    existing?.remove();
  } else if (existing) {
    if (existing.previousElementSibling !== hero) hero.insertAdjacentElement("afterend", existing);
    return 1;
  }

  hero.insertAdjacentElement("afterend", createOrientationCard(selectedLevel, config));
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
    };
  }, [location.pathname, location.search]);

  return null;
}

export const __private__ = {
  LEVEL_ORIENTATION_CONFIG,
  findCourseBookHero,
  readSelectedLevel,
  applyCourseBookOrientationVideo,
};
