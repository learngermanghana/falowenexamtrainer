import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { findCourseBookStatGrid } from "../utils/courseBookNextClassLogic";

const COURSE_BOOK_PATH = "/campus/course";
const PRIORITY_COMPACTED_ATTRIBUTE = "data-falowen-priority-compacted";
const NEXT_ACTION_ATTRIBUTE = "data-falowen-course-next-action";
const YOUTUBE_MOVED_ATTRIBUTE = "data-falowen-youtube-moved";

const normalizeText = (value = "") => String(value || "").replace(/\s+/g, " ").trim().toLowerCase();

const findNextCourseCard = (root = document) => {
  if (!root?.querySelectorAll) return null;
  return Array.from(root.querySelectorAll("section")).find((section) =>
    Array.from(section.querySelectorAll("p")).some((paragraph) => {
      const label = normalizeText(paragraph.textContent);
      return label === "next self-study lesson" || label === "next assignment";
    })
  ) || null;
};

const findYouTubeWrapper = (root = document) => {
  if (!root?.querySelectorAll) return null;
  const subscribeLink = Array.from(root.querySelectorAll("a")).find(
    (anchor) => normalizeText(anchor.textContent) === "subscribe on youtube"
  );
  return subscribeLink?.parentElement || null;
};

const compactNextCourseCard = (card) => {
  if (!card) return false;

  card.setAttribute(PRIORITY_COMPACTED_ATTRIBUTE, "true");
  Object.assign(card.style, {
    alignItems: "center",
    borderRadius: "14px",
    gap: "8px",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    padding: "11px 12px",
  });

  const heading = card.querySelector("h3");
  if (heading) Object.assign(heading.style, { fontSize: "17px", lineHeight: "1.25" });

  Array.from(card.querySelectorAll("p")).forEach((paragraph) => {
    const text = normalizeText(paragraph.textContent);
    if (text.startsWith("complete this lesson") || text.startsWith("open this assignment")) {
      paragraph.style.display = "none";
      paragraph.setAttribute("aria-hidden", "true");
    }
  });

  const completionLabel = card.querySelector("label");
  if (completionLabel) completionLabel.style.fontSize = "12px";

  const action = card.querySelector(`[${NEXT_ACTION_ATTRIBUTE}="true"]`) || Array.from(card.querySelectorAll("a")).find(
    (anchor) => normalizeText(anchor.textContent).startsWith("open:")
  );
  if (action) {
    if (!action.hasAttribute(NEXT_ACTION_ATTRIBUTE)) {
      action.setAttribute(NEXT_ACTION_ATTRIBUTE, "true");
      action.setAttribute("data-original-label", String(action.textContent || "").trim());
      action.title = String(action.textContent || "").trim();
    }
    if (normalizeText(action.textContent) !== "continue") action.textContent = "Continue";
    Object.assign(action.style, {
      justifySelf: "end",
      padding: "8px 12px",
      whiteSpace: "nowrap",
    });
  }

  return true;
};

export const compactCourseBookPriorityLayout = (root = document) => {
  if (!root?.querySelectorAll) return { nextLesson: false, youtubeMoved: false };

  const statGrid = findCourseBookStatGrid(root);
  const hero = statGrid?.closest?.("section") || null;
  const courseRoot = hero?.parentElement || null;
  if (!hero || !courseRoot) return { nextLesson: false, youtubeMoved: false };

  const nextCard = findNextCourseCard(courseRoot);
  const nextLesson = compactNextCourseCard(nextCard);

  if (nextCard && hero.nextElementSibling !== nextCard) {
    hero.insertAdjacentElement("afterend", nextCard);
  }

  const youtubeWrapper = findYouTubeWrapper(courseRoot);
  const handoffHost = courseRoot.querySelector('[data-course-completion-handoff-host="true"]');
  let youtubeMoved = false;
  if (youtubeWrapper) {
    youtubeWrapper.setAttribute(YOUTUBE_MOVED_ATTRIBUTE, "true");
    Object.assign(youtubeWrapper.style, { justifyContent: "flex-end", marginTop: "6px" });
    const isAtBottom = handoffHost
      ? youtubeWrapper.nextElementSibling === handoffHost
      : youtubeWrapper === courseRoot.lastElementChild;
    if (!isAtBottom) {
      courseRoot.insertBefore(youtubeWrapper, handoffHost || null);
      youtubeMoved = true;
    }
  }

  return { nextLesson, youtubeMoved };
};

export default function CourseBookPriorityLayoutService() {
  const location = useLocation();
  const isCourseBook = (location.pathname.replace(/\/+$/, "") || "/") === COURSE_BOOK_PATH;

  useEffect(() => {
    if (!isCourseBook) return undefined;

    let scheduled = false;
    const applyLayout = () => compactCourseBookPriorityLayout(document);
    const scheduleLayout = () => {
      if (scheduled) return;
      scheduled = true;
      const run = window.requestAnimationFrame || ((callback) => window.setTimeout(callback, 0));
      run(() => {
        scheduled = false;
        applyLayout();
      });
    };

    applyLayout();
    const timers = [60, 220, 700].map((delay) => window.setTimeout(scheduleLayout, delay));
    const observer = new MutationObserver(scheduleLayout);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      observer.disconnect();
    };
  }, [isCourseBook]);

  return null;
}
