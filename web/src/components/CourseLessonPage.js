import React, { useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import { courseSchedules } from "../data/courseSchedule";
import CourseLessonPageLegacy from "./CourseLessonPageLegacy";
import {
  getPublicFunnelContext,
  trackPublicFunnelEvent,
} from "../lib/publicFunnelTracking";

const A1_DAY_3_TITLE = "German Subject Pronouns, Verb Conjugation and Introducing Yourself";
const A1_DAY_3_ASSIGNMENT_ID = "A1-1.2";
const A1_DAY_5_TITLE = "Personal Information, Articles, Adjectives and W-Questions";
const FIRST_LESSON_TRACKED_KEY = "falowen:public-funnel-first-lesson";

const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

const decorateA1Day3Lesson = (lesson) => {
  if (!lesson || Number(lesson.day) !== 3) return;

  lesson.topic = A1_DAY_3_TITLE;
  lesson.grammar_topic = A1_DAY_3_TITLE;
  lesson.goal =
    "Learn all German subject pronouns, conjugate useful everyday verbs, distinguish informal and formal forms of you, and introduce yourself in German.";
  lesson.instruction =
    "Start with Kapitel 1.1 Self-practice. Use the workbook and videos to practise, then check your own work. Do not submit Kapitel 1.1. After that, complete Kapitel 1.2 Assignment under Lesen & Hören and submit only Kapitel 1.2 for tutor marking.";
  lesson.assignment = true;
  lesson.assignmentId = A1_DAY_3_ASSIGNMENT_ID;
  lesson.assignment_id = A1_DAY_3_ASSIGNMENT_ID;
  lesson.canonicalAssignmentId = A1_DAY_3_ASSIGNMENT_ID;

  const practice = toArray(lesson.schreiben_sprechen).find(
    (resource) => String(resource.chapter) === "1.1"
  );
  if (practice) {
    practice.assignment = false;
    practice.resourceRole = "selfPractice";
  }

  const assignment = toArray(lesson.lesen_hören).find(
    (resource) => String(resource.chapter) === "1.2"
  );
  if (assignment) {
    assignment.assignment = true;
    assignment.assignmentId = A1_DAY_3_ASSIGNMENT_ID;
    assignment.assignment_id = A1_DAY_3_ASSIGNMENT_ID;
    assignment.canonicalAssignmentId = A1_DAY_3_ASSIGNMENT_ID;
    assignment.resourceRole = "assignment";
  }
};

const decorateA1Day5Lesson = (lesson) => {
  if (!lesson || Number(lesson.day) !== 5) return;

  lesson.topic = A1_DAY_5_TITLE;
  lesson.grammar_topic = "Definite articles, basic adjectives, personal information, W-questions and sentence structure";
  lesson.goal =
    "Use der, die and das, describe people and things with basic adjectives, give personal information, form W-questions and build correct A1 sentences.";
  lesson.instruction =
    "Complete the six self-practice sections: articles, adjectives, personal information, mini dialogues, W-words and scrambled sentences. Finish by writing a short personal introduction and use the answer guides for self-check.";
};

const scheduleDay3 = (courseSchedules.A1 || []).find((entry) => Number(entry.day) === 3);
const scheduleDay5 = (courseSchedules.A1 || []).find((entry) => Number(entry.day) === 5);
decorateA1Day3Lesson(scheduleDay3);
decorateA1Day5Lesson(scheduleDay5);

const replaceText = (element, text) => {
  if (element && element.textContent !== text) element.textContent = text;
};

const labelA1Day3Resources = (root) => {
  if (!root) return;

  Array.from(root.querySelectorAll("strong")).forEach((element) => {
    const text = element.textContent?.trim();
    if (text === "Kapitel 1.1") replaceText(element, "Kapitel 1.1 · Self-practice");
    if (text === "Kapitel 1.2") replaceText(element, "Kapitel 1.2 · Assignment");
  });

  Array.from(root.querySelectorAll("article")).forEach((card) => {
    const title = card.querySelector("strong");
    const description = card.querySelector("p");
    const action = card.querySelector("a");
    const titleText = title?.textContent || "";

    if (titleText.includes("Kapitel 1.1 workbook")) {
      replaceText(title, "📝 Kapitel 1.1 self-practice workbook");
      replaceText(
        description,
        "Practice only. Complete the tasks and check your own work. Do not submit this workbook."
      );
      replaceText(action, "Open self-practice workbook ›");
    }

    if (titleText.includes("Kapitel 1.2 workbook")) {
      replaceText(title, "📝 Kapitel 1.2 assignment workbook");
      replaceText(
        description,
        "Graded assignment. Complete this workbook and submit your final answers for tutor marking."
      );
      replaceText(action, "Open assignment workbook ›");
    }
  });

  Array.from(root.querySelectorAll("button")).forEach((button) => {
    if (button.textContent?.includes("Submit Kapitel")) {
      replaceText(button, "Submit Kapitel 1.2 assignment ›");
    }
  });
};

export default function CourseLessonPage() {
  const rootRef = useRef(null);
  const location = useLocation();
  const params = useParams();
  const level = String(location.state?.level || params.level || "").toUpperCase();
  const day = Number(location.state?.day ?? params.day ?? 0);
  const isA1Day3 = level === "A1" && day === 3;
  const isA1Day5 = level === "A1" && day === 5;

  if (isA1Day3) decorateA1Day3Lesson(location.state?.entry);
  if (isA1Day5) decorateA1Day5Lesson(location.state?.entry);

  useEffect(() => {
    const context = getPublicFunnelContext();
    if (!context.sessionId && !context.source && !context.video) return;

    trackPublicFunnelEvent("lesson_view", { level, day });
    try {
      if (!window.localStorage.getItem(FIRST_LESSON_TRACKED_KEY)) {
        window.localStorage.setItem(
          FIRST_LESSON_TRACKED_KEY,
          JSON.stringify({ level, day, at: new Date().toISOString() })
        );
        trackPublicFunnelEvent("first_lesson_started", { level, day });
      }
    } catch (_error) {}
  }, [day, level]);

  useEffect(() => {
    if (!isA1Day3 || !rootRef.current) return undefined;

    const root = rootRef.current;
    labelA1Day3Resources(root);
    const observer = new MutationObserver(() => labelA1Day3Resources(root));
    observer.observe(root, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [isA1Day3]);

  return (
    <div ref={rootRef}>
      <CourseLessonPageLegacy />
    </div>
  );
}
