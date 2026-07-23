import { useEffect } from "react";
import { getA1CanonicalLessonForLegacyRoute } from "../data/a1CanonicalLessonCatalog";

const SELF_LEARNING_COURSE_DESTINATION = /^\/campus\/course\/(?:lesson\/(?:B2|C1)\/\d+|(?:b2|c1)-)/i;
const A1_LEGACY_LESSON_DESTINATION = /^\/campus\/course\/lesson\/A1\/(\d+)\/?$/i;

const getA1PracticeCourseDestination = (url) => {
  const match = String(url?.pathname || "").match(A1_LEGACY_LESSON_DESTINATION);
  if (!match) return "";

  const chapter = url.searchParams.get("chapter") || "";
  const lesson = getA1CanonicalLessonForLegacyRoute({
    day: Number(match[1]),
    identity: chapter,
  });
  if (lesson?.kind !== "practice" || !lesson.destination) return "";

  const destination = new URL(lesson.destination, url.origin);
  url.searchParams.forEach((value, key) => {
    if (key !== "chapter" && !destination.searchParams.has(key)) {
      destination.searchParams.set(key, value);
    }
  });

  return `${destination.pathname}${destination.search}${destination.hash}`;
};

export const isSelfLearningCourseDestination = (href = "", origin = "https://www.falowen.app") => {
  try {
    const url = new URL(String(href || ""), origin);
    if (url.origin !== origin) return false;
    return SELF_LEARNING_COURSE_DESTINATION.test(url.pathname) || Boolean(getA1PracticeCourseDestination(url));
  } catch (_error) {
    return false;
  }
};

export const getSelfLearningCourseDestination = (href = "", origin = "https://www.falowen.app") => {
  try {
    const url = new URL(String(href || ""), origin);
    if (url.origin !== origin) return "";

    const a1PracticeDestination = getA1PracticeCourseDestination(url);
    if (a1PracticeDestination) return a1PracticeDestination;
    if (!SELF_LEARNING_COURSE_DESTINATION.test(url.pathname)) return "";

    return `${url.pathname}${url.search}${url.hash}`;
  } catch (_error) {
    return "";
  }
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

      // Use the same clean destination that succeeds in a fresh navigation.
      // A1 practice-only cards resolve through the canonical lesson catalog so
      // they open their owned practice page instead of getting stuck on the
      // generic lesson route with stale React Router state.
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
