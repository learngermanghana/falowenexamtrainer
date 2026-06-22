import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
