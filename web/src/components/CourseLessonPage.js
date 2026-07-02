import React, { useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import B1Day1TraumweltWorkbookPage from "./B1Day1TraumweltWorkbookPage";
import B1Day1TraumweltGrammarNotesPage from "./B1Day1TraumweltGrammarNotesPage";
import B1Day2FreundeFuersLebenWorkbookPage from "./B1Day2FreundeFuersLebenWorkbookPage";
import B1Day2FreundeFuersLebenGrammarNotesPage from "./B1Day2FreundeFuersLebenGrammarNotesPage";
import B1Day3ErfolgsgeschichtenWorkbookPage from "./B1Day3ErfolgsgeschichtenWorkbookPage";
import B1Day3ErfolgsgeschichtenGrammarNotesPage from "./B1Day3ErfolgsgeschichtenGrammarNotesPage";
import B1Day4WohnungSuchenWorkbookPage from "./B1Day4WohnungSuchenWorkbookPage";
import B1Day4WohnungSuchenGrammarNotesPage from "./B1Day4WohnungSuchenGrammarNotesPage";
import B1Day5BesichtigungsterminWorkbookPage from "./B1Day5BesichtigungsterminWorkbookPage";
import B1Day5BesichtigungsterminGrammarNotesPage from "./B1Day5BesichtigungsterminGrammarNotesPage";
import B1Day6StadtOderLandWorkbookPage from "./B1Day6StadtOderLandWorkbookPage";
import B1Day6StadtOderLandGrammarNotesPage from "./B1Day6StadtOderLandGrammarNotesPage";
import B1Day7FastFoodHausmannskostWorkbookPage from "./B1Day7FastFoodHausmannskostWorkbookPage";
import B1Day7FastFoodHausmannskostGrammarNotesPage from "./B1Day7FastFoodHausmannskostGrammarNotesPage";
import B1Day8AllesFuerDieGesundheitWorkbookPage from "./B1Day8AllesFuerDieGesundheitWorkbookPage";
import B1Day8AllesFuerDieGesundheitGrammarNotesPage from "./B1Day8AllesFuerDieGesundheitGrammarNotesPage";
import B1Day19VorstellungsgespraechWorkbookPage from "./B1Day19VorstellungsgespraechWorkbookPage";
import B1Day20WieWirdManWorkbookPage from "./B1Day20WieWirdManWorkbookPage";
import B1Day21LebensformenHeuteWorkbookPage from "./B1Day21LebensformenHeuteWorkbookPage";
import B1Day21LebensformenHeuteGrammarNotesPage from "./B1Day21LebensformenHeuteGrammarNotesPage";
import B1Day19VorstellungsgespraechGrammarNotesPage from "./B1Day19VorstellungsgespraechGrammarNotesPage";
import RadioFirstWorkbookGate from "./RadioFirstWorkbookGate";
import { applyA1GrammarRouteToLesson } from "../data/a1GrammarRoutes";
import { applyA2GrammarRouteToLesson } from "../data/a2GrammarRoutes";
import { applyB1LessonResourceOverride } from "../data/b1LessonResourceOverrides";
import { courseSchedules } from "../data/courseSchedule";
import CourseLessonPageLegacy, { LessonResourcesHub } from "./CourseLessonPageLegacy";
import {
  getPublicFunnelContext,
  trackPublicFunnelEvent,
} from "../lib/publicFunnelTracking";
export { LessonResourcesHub };

const A1_DAY_3_TITLE = "German Subject Pronouns, Verb Conjugation and Introducing Yourself";
const A1_DAY_3_ASSIGNMENT_ID = "A1-1.2";
const A1_DAY_5_TITLE = "Personal Information, Articles, Adjectives and W-Questions";
const A1_DAY_17_ASSIGNMENT_ID = "A1-11";
const A1_DAY_17_WORKBOOK_ROUTE = "/campus/course/a1-day-17-instructions-and-directions-kapitel-11-workbook";
const A1_DAY_17_GRAMMAR_ROUTE = "/campus/course/directions-imperative-11";
const FIRST_LESSON_TRACKED_KEY = "falowen:public-funnel-first-lesson";
const B1_DAY5_DRIVE_FILE_ID = "1BhpLaVrqLIgLkD9OVwsHhedjBwLTPet9";
const B1_DAY5_YOUTUBE_ID = "x7tUQjxt5uI";
const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

const B1_WORKBOOK_PAGES = {
  1: B1Day1TraumweltWorkbookPage,
  2: B1Day2FreundeFuersLebenWorkbookPage,
  3: B1Day3ErfolgsgeschichtenWorkbookPage,
  4: B1Day4WohnungSuchenWorkbookPage,
  5: B1Day5BesichtigungsterminWorkbookPage,
  6: B1Day6StadtOderLandWorkbookPage,
  7: B1Day7FastFoodHausmannskostWorkbookPage,
  8: B1Day8AllesFuerDieGesundheitWorkbookPage,
  19: B1Day19VorstellungsgespraechWorkbookPage,
  20: B1Day20WieWirdManWorkbookPage,
  21: B1Day21LebensformenHeuteWorkbookPage,
};

const B1_GRAMMAR_PAGES = {
  1: B1Day1TraumweltGrammarNotesPage,
  2: B1Day2FreundeFuersLebenGrammarNotesPage,
  3: B1Day3ErfolgsgeschichtenGrammarNotesPage,
  4: B1Day4WohnungSuchenGrammarNotesPage,
  5: B1Day5BesichtigungsterminGrammarNotesPage,
  6: B1Day6StadtOderLandGrammarNotesPage,
  7: B1Day7FastFoodHausmannskostGrammarNotesPage,
  8: B1Day8AllesFuerDieGesundheitGrammarNotesPage,
  19: B1Day19VorstellungsgespraechGrammarNotesPage,
  21: B1Day21LebensformenHeuteGrammarNotesPage,
};

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
  lesson.grammar_topic = null;
  lesson.goal =
    "Use articles, adjectives, personal information and W-questions through guided self-practice.";
  lesson.instruction =
    "Complete the self-practice workbook and use the answer guides for self-check. This lesson has no separate grammar-notes resource and no assignment submission.";
  lesson.assignment = false;
  lesson.grammarbook_link = null;
  lesson.grammar_link = null;
  lesson.grammarPage = null;

  [...toArray(lesson.schreiben_sprechen), ...toArray(lesson.lesen_hören)].forEach((resource) => {
    if (!resource || typeof resource !== "object") return;
    resource.assignment = false;
    resource.resourceRole = "selfPractice";
    resource.grammarbook_link = null;
    resource.grammar_link = null;
    resource.grammarPage = null;
  });
};

const decorateA1Day17Lesson = (lesson) => {
  if (!lesson || Number(lesson.day) !== 17) return;

  lesson.assignment = true;
  lesson.assignmentId = A1_DAY_17_ASSIGNMENT_ID;
  lesson.assignment_id = A1_DAY_17_ASSIGNMENT_ID;
  lesson.canonicalAssignmentId = A1_DAY_17_ASSIGNMENT_ID;
  lesson.instruction =
    "Open the in-app Kapitel 11 workbook, complete all Lesen, Hören and Schreiben tasks, then use the Submit tab to send your final answers for tutor marking.";

  let assignment = Array.isArray(lesson.lesen_hören)
    ? lesson.lesen_hören.find((resource) => String(resource?.chapter || "11") === "11")
    : lesson.lesen_hören;

  if (!assignment) {
    assignment = {};
    lesson.lesen_hören = assignment;
  }

  assignment.chapter = "11";
  assignment.assignment = true;
  assignment.assignmentId = A1_DAY_17_ASSIGNMENT_ID;
  assignment.assignment_id = A1_DAY_17_ASSIGNMENT_ID;
  assignment.canonicalAssignmentId = A1_DAY_17_ASSIGNMENT_ID;
  assignment.resourceRole = "assignment";
  assignment.grammarbook_link = A1_DAY_17_GRAMMAR_ROUTE;
  assignment.workbook_link = A1_DAY_17_WORKBOOK_ROUTE;
};

const syncA2LessonFromSchedule = (lesson, day) => {
  if (!lesson) return;
  const canonicalLesson = (courseSchedules.A2 || []).find(
    (entry) => Number(entry?.day) === Number(day)
  );
  if (!canonicalLesson) {
    applyA2GrammarRouteToLesson(lesson, day);
    return;
  }

  Object.assign(lesson, canonicalLesson);
  applyA2GrammarRouteToLesson(lesson, day);
};

const scheduleDay3 = (courseSchedules.A1 || []).find((entry) => Number(entry.day) === 3);
const scheduleDay5 = (courseSchedules.A1 || []).find((entry) => Number(entry.day) === 5);
const scheduleDay17 = (courseSchedules.A1 || []).find((entry) => Number(entry.day) === 17);
(courseSchedules.A1 || []).forEach((entry) => applyA1GrammarRouteToLesson(entry, entry?.day));
(courseSchedules.A2 || []).forEach((entry) => applyA2GrammarRouteToLesson(entry, entry?.day));
(courseSchedules.B1 || []).forEach((entry) => applyB1LessonResourceOverride(entry, entry?.day));
decorateA1Day3Lesson(scheduleDay3);
decorateA1Day5Lesson(scheduleDay5);
decorateA1Day17Lesson(scheduleDay17);

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

  Array.from(root.querySelectorAll("article")).forEach((cardElement) => {
    const title = cardElement.querySelector("strong");
    const description = cardElement.querySelector("p");
    const action = cardElement.querySelector("a");
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

const replaceB1Day5ListeningResource = () => {
  if (typeof document === "undefined") return;

  document.querySelectorAll(`iframe[src*="${B1_DAY5_DRIVE_FILE_ID}"]`).forEach((iframe) => {
    iframe.src = `https://www.youtube-nocookie.com/embed/${B1_DAY5_YOUTUBE_ID}?rel=0&playsinline=1`;
    iframe.title = "B1 Day 5 Besichtigungstermin Hören";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.setAttribute("allowfullscreen", "");
  });

  document.querySelectorAll(`a[href*="${B1_DAY5_DRIVE_FILE_ID}"]`).forEach((link) => link.remove());
};

export default function CourseLessonPage() {
  const rootRef = useRef(null);
  const location = useLocation();
  const params = useParams();
  const level = String(location.state?.level || params.level || "").toUpperCase();
  const day = Number(location.state?.day ?? params.day ?? 0);
  const isA1Day3 = level === "A1" && day === 3;
  const isA1Day5 = level === "A1" && day === 5;
  const isA1Day17 = level === "A1" && day === 17;
  const isB1Day5 = level === "B1" && day === 5;
  if (level === "A1") applyA1GrammarRouteToLesson(location.state?.entry, day);
  if (level === "B1") applyB1LessonResourceOverride(location.state?.entry, day);
  if (isA1Day3) decorateA1Day3Lesson(location.state?.entry);
  if (isA1Day5) decorateA1Day5Lesson(location.state?.entry);
  if (isA1Day17) decorateA1Day17Lesson(location.state?.entry);
  if (level === "A2") syncA2LessonFromSchedule(location.state?.entry, day);

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

  useEffect(() => {
    if (!isB1Day5 || typeof document === "undefined") return undefined;

    replaceB1Day5ListeningResource();
    const observer = new MutationObserver(replaceB1Day5ListeningResource);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [isB1Day5]);

  if (level === "B1") {
    const query = new URLSearchParams(location.search);
    const dayNumber = Number(day);
    const requestedView = query.get("view");

    if (requestedView === "grammar" && B1_GRAMMAR_PAGES[dayNumber]) {
      const GrammarPage = B1_GRAMMAR_PAGES[dayNumber];
      return <GrammarPage />;
    }

    if (requestedView === "workbook" && B1_WORKBOOK_PAGES[dayNumber]) {
      const WorkbookPage = B1_WORKBOOK_PAGES[dayNumber];
      return (
        <RadioFirstWorkbookGate level={level} day={dayNumber}>
          <WorkbookPage />
        </RadioFirstWorkbookGate>
      );
    }
  }

  return (
    <div ref={rootRef}>
      <CourseLessonPageLegacy />
    </div>
  );
}
