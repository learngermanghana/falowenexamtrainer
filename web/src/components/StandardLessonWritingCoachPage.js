import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import StandardFourStageLessonPage from "./StandardFourStageLessonPageV3";
import CompactC1LessonPage from "./CompactC1LessonPage";
import C1Day1To6GuidedLessonPage from "./C1Day1To6GuidedLessonPage";
import { C1_DAY3_RADIO_OVERRIDE } from "../data/c1Day3RadioOverride";

const B2_DAY2_GRAMMAR_ROUTE = "/campus/course/lesson/B2/2?view=grammar";
const B2_DAY2_WORKBOOK_ROUTE = "/campus/course/lesson/B2/2?view=workbook";
const B2_DAY3_GRAMMAR_ROUTE = "/campus/course/lesson/B2/3?view=grammar";
const B2_DAY3_WORKBOOK_ROUTE = "/campus/course/lesson/B2/3?view=workbook";

export const shouldMountMarkMyLetter = () => false;

export const resolveCanonicalLessonForPage = (lesson, canonicalLesson) => {
  const level = String(lesson?.level || "").toUpperCase();
  const day = Number(lesson?.day || 0);

  if (level === "C1" && day === 3) {
    return {
      ...(canonicalLesson || {}),
      resources: {
        ...(canonicalLesson?.resources || {}),
        falowenRadio: C1_DAY3_RADIO_OVERRIDE,
      },
    };
  }

  if (level === "B2" && (day === 2 || day === 3)) {
    const grammarRoute = day === 2 ? B2_DAY2_GRAMMAR_ROUTE : B2_DAY3_GRAMMAR_ROUTE;
    const workbookRoute = day === 2 ? B2_DAY2_WORKBOOK_ROUTE : B2_DAY3_WORKBOOK_ROUTE;
    const chapter = day === 2 ? "1.2" : "1.3";

    return {
      ...(canonicalLesson || {}),
      resources: {
        ...(canonicalLesson?.resources || {}),
        grammarBook: { url: grammarRoute },
        workbook: { url: workbookRoute },
        resourceGroups: [
          {
            chapter,
            grammarBook: { url: grammarRoute },
            workbook: { url: workbookRoute },
          },
        ],
      },
    };
  }

  return canonicalLesson;
};

const viewButtonLabel = (view) => {
  if (view === "workbook") return "3. Write";
  if (view === "grammar") return "1. Learn";
  return "";
};

export default function StandardLessonWritingCoachPage({ lesson, canonicalLesson }) {
  const level = String(lesson?.level || "").toUpperCase();
  const day = Number(lesson?.day || 0);
  const isGuidedC1Lesson = level === "C1" && day >= 1 && day <= 6;
  const isCompactC1Lesson = level === "C1" && day >= 7 && day <= 16;
  const LessonPage = isGuidedC1Lesson
    ? C1Day1To6GuidedLessonPage
    : isCompactC1Lesson
      ? CompactC1LessonPage
      : StandardFourStageLessonPage;
  const resolvedCanonicalLesson = resolveCanonicalLessonForPage(lesson, canonicalLesson);
  const location = useLocation();
  const rootRef = useRef(null);
  const appliedViewRef = useRef("");
  const requestedView = new URLSearchParams(location.search || "").get("view") || "";

  useEffect(() => {
    const targetLabel = viewButtonLabel(requestedView);
    const applyKey = `${location.pathname}:${requestedView}`;
    appliedViewRef.current = "";
    if (!targetLabel || !rootRef.current) return undefined;

    const applyView = () => {
      if (appliedViewRef.current === applyKey) return true;
      const target = Array.from(rootRef.current.querySelectorAll("button")).find(
        (button) => String(button.textContent || "").trim() === targetLabel
      );
      if (!target) return false;
      target.click();
      appliedViewRef.current = applyKey;
      window.scrollTo({ top: 0, behavior: "smooth" });
      return true;
    };

    applyView();
    const observer = new MutationObserver(() => {
      if (applyView()) observer.disconnect();
    });
    observer.observe(rootRef.current, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [location.pathname, requestedView]);

  return (
    <div ref={rootRef}>
      <LessonPage lesson={lesson} canonicalLesson={resolvedCanonicalLesson} />
    </div>
  );
}

export const __TESTING__ = {
  B2_DAY2_GRAMMAR_ROUTE,
  B2_DAY2_WORKBOOK_ROUTE,
  B2_DAY3_GRAMMAR_ROUTE,
  B2_DAY3_WORKBOOK_ROUTE,
  viewButtonLabel,
};
