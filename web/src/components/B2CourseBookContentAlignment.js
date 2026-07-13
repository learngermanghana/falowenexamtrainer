import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getB2LessonContentAlignment } from "../data/b2LessonContentAlignment";

const COURSE_BOOK_PATH = "/campus/course";
const ALIGNED_ATTRIBUTE = "data-b2-content-aligned";
const LESSON_ACTION_ALIGNED_ATTRIBUTE = "data-course-book-lesson-action-aligned";
const LESSON_CARD_ALIGNED_ATTRIBUTE = "data-course-book-lesson-card-aligned";

const normalizePath = (value = "") => String(value || "").replace(/\/+$/, "") || "/";
const normalizeText = (value = "") => String(value || "").replace(/\s+/g, " ").trim().toLowerCase();

const findLevelSelect = (root = document) =>
  Array.from(root.querySelectorAll("select")).find((select) =>
    Array.from(select.options || []).some((option) =>
      String(option.value || option.textContent || "").trim().toUpperCase() === "B2"
    )
  ) || null;

const getB2DayFromHref = (href = "") => {
  try {
    const parsed = new URL(String(href || ""), "https://www.falowen.app");
    const match = parsed.pathname.match(/^\/campus\/course\/lesson\/B2\/(\d+)\/?$/i);
    return match ? Number(match[1]) : null;
  } catch {
    return null;
  }
};

const isMetaLabel = (value = "") => {
  const text = normalizeText(value);
  return (
    !text ||
    text === "current" ||
    text === "self-learning" ||
    text === "tutor-marked" ||
    text === "assignment" ||
    text === "practice" ||
    text.startsWith("chapter ") ||
    text.startsWith("kapitel ") ||
    text.startsWith("best score:") ||
    text === "awaiting score" ||
    text === "not started" ||
    text === "in progress" ||
    text === "submitted" ||
    text === "resubmitted" ||
    text === "passed" ||
    text === "needs improvement" ||
    text === "practice only" ||
    text === "self-marked complete"
  );
};

const setStyleIfChanged = (element, property, value) => {
  if (!element || element.style[property] === value) return false;
  element.style[property] = value;
  return true;
};

const clearStyleIfPresent = (element, property) => {
  if (!element || !element.style[property]) return false;
  element.style[property] = "";
  return true;
};

export const alignCourseBookLessonActions = (
  root = document,
  pathname = window.location?.pathname,
) => {
  if (!root?.querySelectorAll || normalizePath(pathname) !== COURSE_BOOK_PATH) return 0;

  let changed = 0;
  Array.from(root.querySelectorAll('article a[href*="/campus/course/lesson/"]')).forEach((anchor) => {
    const article = anchor.closest("article");
    if (!article) return;

    let cardChanged = false;

    // The native CourseTab layout already uses the clean A2 flex-row design.
    // Remove only the old global absolute-position override so every level
    // returns to that same in-flow card layout.
    cardChanged = clearStyleIfPresent(article, "position") || cardChanged;
    cardChanged = clearStyleIfPresent(article, "paddingBottom") || cardChanged;
    cardChanged = clearStyleIfPresent(anchor, "position") || cardChanged;
    cardChanged = clearStyleIfPresent(anchor, "right") || cardChanged;
    cardChanged = clearStyleIfPresent(anchor, "bottom") || cardChanged;
    cardChanged = clearStyleIfPresent(anchor, "minWidth") || cardChanged;

    if (article.hasAttribute(LESSON_CARD_ALIGNED_ATTRIBUTE)) {
      article.removeAttribute(LESSON_CARD_ALIGNED_ATTRIBUTE);
      cardChanged = true;
    }
    if (anchor.hasAttribute(LESSON_ACTION_ALIGNED_ATTRIBUTE)) {
      anchor.removeAttribute(LESSON_ACTION_ALIGNED_ATTRIBUTE);
      cardChanged = true;
    }

    if (cardChanged) changed += 1;
  });

  return changed;
};

const alignLessonArticle = (article, alignment) => {
  if (!article || !alignment) return false;
  let changed = false;
  const title = article.querySelector("h3");
  if (title && title.textContent !== alignment.title) {
    title.textContent = alignment.title;
    changed = true;
  }

  const metaRow = title?.nextElementSibling;
  if (metaRow) {
    const chips = Array.from(metaRow.querySelectorAll(":scope > span"));
    let grammarChip = chips.find((chip) => !isMetaLabel(chip.textContent));
    if (!grammarChip) {
      const chapterChip = chips.find((chip) => /^\s*(?:chapter|kapitel)\b/i.test(chip.textContent || ""));
      if (chapterChip) {
        grammarChip = chapterChip.cloneNode(false);
        metaRow.appendChild(grammarChip);
      }
    }
    if (grammarChip && grammarChip.textContent !== alignment.grammar_topic) {
      grammarChip.textContent = alignment.grammar_topic;
      changed = true;
    }
  }

  const goal = Array.from(article.children).find(
    (element) => element.tagName === "P" && !normalizeText(element.textContent).startsWith("instruction:")
  );
  if (goal && goal.textContent !== alignment.goal) {
    goal.textContent = alignment.goal;
    changed = true;
  }

  article.setAttribute(ALIGNED_ATTRIBUTE, String(alignment.day));
  return changed;
};

const alignNextLessonCard = (anchor, alignment) => {
  const section = anchor?.closest("section");
  if (!section || section.querySelector("article")) return false;
  let changed = false;
  const heading = section.querySelector("h3");
  if (heading) {
    const nextHeading = `Day ${alignment.day}: ${alignment.title}`;
    if (heading.textContent !== nextHeading) {
      heading.textContent = nextHeading;
      changed = true;
    }
  }
  const nextLinkLabel = `Open: ${alignment.title}`;
  if (anchor.textContent !== nextLinkLabel) {
    anchor.textContent = nextLinkLabel;
    changed = true;
  }
  anchor.setAttribute("aria-label", `Open ${alignment.title}`);

  Array.from(section.querySelectorAll("label")).forEach((label) => {
    const text = String(label.textContent || "");
    if (!text.includes("Mark") || !text.includes("complete")) return;
    label.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && String(node.textContent || "").trim()) {
        node.textContent = ` Mark “${alignment.title}” as complete`;
      }
    });
  });
  return changed;
};

export const applyB2CourseBookContentAlignment = (root = document, pathname = window.location?.pathname) => {
  if (!root?.querySelectorAll || normalizePath(pathname) !== COURSE_BOOK_PATH) return 0;
  const levelSelect = findLevelSelect(root);
  if (!levelSelect || String(levelSelect.value || "").trim().toUpperCase() !== "B2") return 0;

  let changed = 0;
  Array.from(root.querySelectorAll('a[href*="/campus/course/lesson/B2/"]')).forEach((anchor) => {
    const day = getB2DayFromHref(anchor.getAttribute("href"));
    const alignment = getB2LessonContentAlignment(day);
    if (!alignment) return;
    const article = anchor.closest("article");
    if (article) {
      if (alignLessonArticle(article, alignment)) changed += 1;
    } else if (alignNextLessonCard(anchor, alignment)) {
      changed += 1;
    }
  });
  return changed;
};

export default function B2CourseBookContentAlignment() {
  const location = useLocation();

  useEffect(() => {
    if (normalizePath(location.pathname) !== COURSE_BOOK_PATH) return undefined;
    let scheduled = false;
    const apply = () => {
      scheduled = false;
      alignCourseBookLessonActions(document, location.pathname);
      applyB2CourseBookContentAlignment(document, location.pathname);
    };
    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      const run = window.requestAnimationFrame || ((callback) => window.setTimeout(callback, 0));
      run(apply);
    };

    schedule();
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener("change", schedule, true);
    return () => {
      observer.disconnect();
      document.removeEventListener("change", schedule, true);
    };
  }, [location.pathname]);

  return null;
}

export const __TESTING__ = {
  normalizePath,
  normalizeText,
  findLevelSelect,
  getB2DayFromHref,
  isMetaLabel,
  alignLessonArticle,
  alignNextLessonCard,
  setStyleIfChanged,
  clearStyleIfPresent,
};
