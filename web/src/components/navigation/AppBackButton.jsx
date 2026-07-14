import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { A1_GRAMMAR_ROUTE_ENTRIES } from "../../data/a1GrammarRoutes";
import { A2_GRAMMAR_ROUTE_ENTRIES } from "../../data/a2GrammarRoutes";
import { courseSchedules } from "../../data/courseSchedule";
import "./AppBackButton.css";

const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

const normalizeInAppPath = (value = "") => {
  const raw = String(value || "").trim();
  if (!raw) return "";
  try {
    const url = new URL(raw, "https://www.falowen.app");
    if (!["falowen.app", "www.falowen.app"].includes(url.hostname)) return "";
    return url.pathname.replace(/\/+$/, "") || "/";
  } catch (_error) {
    return "";
  }
};

const isCourseLessonHub = (pathname = "", search = "") => {
  const normalizedPath = normalizeInAppPath(pathname);
  if (!/^\/campus\/course\/lesson\/[^/]+\/[^/]+$/i.test(normalizedPath)) return false;

  // B1 grammar/workbook pages reuse the lesson route with ?view=... and must
  // still return to their lesson hub first. A normal lesson hub, including a
  // ?chapter=... URL, should go directly to the main Course Book.
  return !new URLSearchParams(search || "").has("view");
};

const addCanonicalGrammarReturns = (index, level, entries) => {
  entries.forEach(({ day, chapter, route }) => {
    const pathname = normalizeInAppPath(route);
    if (!pathname) return;
    index.set(
      pathname,
      `/campus/course/lesson/${level}/${Number(day)}?chapter=${encodeURIComponent(chapter)}`
    );
  });
};

const buildLessonReturnIndex = () => {
  const index = new Map();

  Object.entries(courseSchedules || {}).forEach(([level, lessons]) => {
    toArray(lessons).forEach((lesson) => {
      const day = Number(lesson?.day);
      if (!Number.isFinite(day)) return;

      const resources = [
        lesson,
        ...toArray(lesson?.lesen_hören),
        ...toArray(lesson?.schreiben_sprechen),
      ];

      resources.forEach((resource) => {
        const chapter = String(resource?.chapter || lesson?.chapter || "").trim();
        const lessonPath = `/campus/course/lesson/${encodeURIComponent(level)}/${day}${
          chapter ? `?chapter=${encodeURIComponent(chapter)}` : ""
        }`;

        [
          resource?.grammarbook_link,
          resource?.grammar_link,
          resource?.grammarPage,
          resource?.workbook_link,
          resource?.workbookRoute,
        ].forEach((link) => {
          const pathname = normalizeInAppPath(link);
          if (pathname && !index.has(pathname)) index.set(pathname, lessonPath);
        });
      });
    });
  });

  // The generated curriculum still contains legacy Drive URLs for a few A1
  // and several A2 grammar books. Index the canonical in-app routes directly.
  addCanonicalGrammarReturns(index, "A1", A1_GRAMMAR_ROUTE_ENTRIES);
  addCanonicalGrammarReturns(index, "A2", A2_GRAMMAR_ROUTE_ENTRIES);

  // Day 20 Chapter 12.3 uses special direct routes that are not reliably
  // represented by every generated schedule source. Keep their Course Book
  // return deterministic instead of falling back to browser history.
  const a1Day20Chapter123Lesson = "/campus/course/lesson/A1/20?chapter=12.3";
  index.set("/campus/course/letter-writing-intro-12-3", a1Day20Chapter123Lesson);
  index.set(
    "/campus/course/letter-writing-intro-german-a1-day-12-3",
    a1Day20Chapter123Lesson
  );

  return index;
};

const lessonReturnIndex = buildLessonReturnIndex();

const hasUsableHistory = () => {
  if (typeof window === "undefined") return false;

  const routerIndex = window.history.state?.idx;
  return Number.isFinite(routerIndex) && routerIndex > 0;
};

const getExplicitLessonReturn = (search = "") => {
  const returnTo = new URLSearchParams(search || "").get("returnTo");
  if (!returnTo) return "";
  try {
    const parsed = new URL(returnTo, "https://www.falowen.app");
    if (!["falowen.app", "www.falowen.app"].includes(parsed.hostname)) return "";
    if (!parsed.pathname.startsWith("/campus/course/lesson/")) return "";
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch (_error) {
    return "";
  }
};

const getReferrerLessonReturn = () => {
  if (typeof document === "undefined" || !document.referrer) return "";
  try {
    const parsed = new URL(document.referrer);
    if (!["falowen.app", "www.falowen.app"].includes(parsed.hostname)) return "";
    if (!parsed.pathname.startsWith("/campus/course/lesson/")) return "";
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch (_error) {
    return "";
  }
};

const AppBackButton = ({
  label = "Back",
  fallbackPath = "/campus/course",
  onBack,
  className = "",
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    // Workbook/grammar page -> exact lesson hub. Lesson hub -> main Course Book.
    // This avoids navigating back to an identical lesson-history entry, which
    // made the button appear unresponsive after returning from a workbook.
    if (isCourseLessonHub(location.pathname, location.search)) {
      navigate(fallbackPath, { replace: true });
      return;
    }

    const explicitReturn = getExplicitLessonReturn(location.search);
    const indexedReturn = lessonReturnIndex.get(normalizeInAppPath(location.pathname)) || "";
    const referrerReturn = getReferrerLessonReturn();
    const lessonReturn = explicitReturn || indexedReturn || referrerReturn;

    if (lessonReturn) {
      navigate(lessonReturn, { replace: true });
      return;
    }

    if (hasUsableHistory()) {
      navigate(-1);
      return;
    }

    navigate(fallbackPath, { replace: true });
  };

  return (
    <button
      type="button"
      className={`app-back-button ${className}`.trim()}
      onClick={handleBack}
      aria-label={label}
    >
      <span className="app-back-button__icon" aria-hidden="true">←</span>
      <span>{label}</span>
    </button>
  );
};

export default AppBackButton;
