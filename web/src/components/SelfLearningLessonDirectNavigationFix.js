import { useEffect } from "react";

const SELF_LEARNING_COURSE_DESTINATION = /^\/campus\/course\/(?:lesson\/(?:B2|C1)\/\d+|(?:b2|c1)-)/i;

export const isSelfLearningCourseDestination = (href = "", origin = "https://www.falowen.app") => {
  try {
    const url = new URL(String(href || ""), origin);
    return url.origin === origin && SELF_LEARNING_COURSE_DESTINATION.test(url.pathname);
  } catch (_error) {
    return false;
  }
};

export const getSelfLearningCourseDestination = (href = "", origin = "https://www.falowen.app") => {
  if (!isSelfLearningCourseDestination(href, origin)) return "";
  const url = new URL(String(href || ""), origin);
  return `${url.pathname}${url.search}${url.hash}`;
};

const isPlainLeftClick = (event) =>
  event.button === 0 &&
  !event.metaKey &&
  !event.altKey &&
  !event.ctrlKey &&
  !event.shiftKey;

export default function SelfLearningLessonDirectNavigationFix() {
  useEffect(() => {
    if (typeof document === "undefined" || typeof window === "undefined") return undefined;

    const handleClick = (event) => {
      if (event.defaultPrevented || !isPlainLeftClick(event)) return;

      const anchor = event.target?.closest?.("a[href]");
      if (!anchor || (anchor.target && anchor.target !== "_self")) return;

      const destination = getSelfLearningCourseDestination(anchor.href, window.location.origin);
      if (!destination) return;

      // Use the same clean URL that succeeds when the link is opened in a new tab.
      // This avoids stale React Router state sending an ordinary click to the homepage.
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();
      window.location.assign(destination);
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
