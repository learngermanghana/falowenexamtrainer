import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import StandardFourStageLessonPage from "./StandardFourStageLessonPageV3";
import CompactC1LessonPage from "./CompactC1LessonPage";
import { C1_DAY3_RADIO_OVERRIDE } from "../data/c1Day3RadioOverride";

const B2_DAY2_GRAMMAR_ROUTE = "/campus/course/lesson/B2/2?view=grammar";
const B2_DAY2_WORKBOOK_ROUTE = "/campus/course/lesson/B2/2?view=workbook";

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

  if (level === "B2" && day === 2) {
    return {
      ...(canonicalLesson || {}),
      resources: {
        ...(canonicalLesson?.resources || {}),
        grammarBook: { url: B2_DAY2_GRAMMAR_ROUTE },
        workbook: { url: B2_DAY2_WORKBOOK_ROUTE },
        resourceGroups: [
          {
            chapter: "1.2",
            grammarBook: { url: B2_DAY2_GRAMMAR_ROUTE },
            workbook: { url: B2_DAY2_WORKBOOK_ROUTE },
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
  const isCompactC1Lesson = level === "C1" && (day === 3 || (day >= 7 && day <= 16));
  const LessonPage = isCompactC1Lesson ? CompactC1LessonPage : StandardFourStageLessonPage;
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
  viewButtonLabel,
};
