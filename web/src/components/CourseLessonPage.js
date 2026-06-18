import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { courseSchedules } from "../data/courseSchedule";
import { getCurriculumEntriesForLevel } from "../data/germanAssignmentCatalog";
import { resolveAssignmentCanonicalKey } from "../utils/assignmentIdentity";
import CourseLessonPageLegacy from "./CourseLessonPageLegacy";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";
import {
  getPublicFunnelContext,
  trackPublicFunnelEvent,
} from "../lib/publicFunnelTracking";

const A1_DAY_3_TITLE = "German Subject Pronouns, Verb Conjugation and Introducing Yourself";
const A1_DAY_3_ASSIGNMENT_ID = "A1-1.2";
const A1_DAY_5_TITLE = "Personal Information, Articles, Adjectives and W-Questions";
const FIRST_LESSON_TRACKED_KEY = "falowen:public-funnel-first-lesson";
const INLINE_SUBMISSION_LEVELS = new Set(["A1", "A2", "B1"]);

const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);
const normalizeAssignmentKey = (value) =>
  String(value || "")
    .trim()
    .toUpperCase()
    .replace(/_/g, "-")
    .replace(/\s+/g, "");

export const getInlineCourseAssignments = (level, day) => {
  const normalizedLevel = String(level || "").trim().toUpperCase();
  const numericDay = Number(day);
  if (!INLINE_SUBMISSION_LEVELS.has(normalizedLevel) || !Number.isFinite(numericDay) || numericDay <= 0) {
    return [];
  }

  const seenKeys = new Set();
  return (getCurriculumEntriesForLevel(normalizedLevel) || []).reduce((assignments, entry, index) => {
    if (!entry?.assignment || entry?.progressionEligible === false || Number(entry?.assignmentDay) !== numericDay) {
      return assignments;
    }

    const title = String(entry?.topic || entry?.title || `Day ${numericDay} assignment`).trim();
    const assignmentId = entry?.assignment_id || entry?.assignmentId || entry?.assignmentKey || "";
    const assignmentKey = resolveAssignmentCanonicalKey({
      level: normalizedLevel,
      assignmentId,
      assignmentTitle: title,
    });
    const normalizedKey = normalizeAssignmentKey(assignmentKey);

    if (!normalizedKey || seenKeys.has(normalizedKey)) return assignments;
    seenKeys.add(normalizedKey);

    const chapter = String(entry?.chapter || "").trim();
    assignments.push({
      assignmentKey,
      chapter,
      day: numericDay,
      level: normalizedLevel,
      title,
      label: chapter ? `Chapter ${chapter}: ${title}` : title || `Assignment ${index + 1}`,
    });
    return assignments;
  }, []);
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

const submissionShellStyles = {
  border: "1px solid #bfdbfe",
  borderRadius: 20,
  background: "linear-gradient(180deg, #eff6ff 0%, #ffffff 180px)",
  boxSizing: "border-box",
  display: "grid",
  gap: 14,
  margin: "24px auto 80px",
  maxWidth: 1120,
  padding: 16,
  width: "100%",
};

export default function CourseLessonPage() {
  const rootRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const level = String(location.state?.level || params.level || "").toUpperCase();
  const day = Number(location.state?.day ?? params.day ?? 0);
  const isA1Day3 = level === "A1" && day === 3;
  const isA1Day5 = level === "A1" && day === 5;
  const inlineAssignments = useMemo(() => getInlineCourseAssignments(level, day), [day, level]);
  const requestedAssignmentKey = String(
    location.state?.assignmentKey || location.state?.canonicalAssignmentKey || ""
  );
  const [selectedAssignmentKey, setSelectedAssignmentKey] = useState("");
  const [submissionOpen, setSubmissionOpen] = useState(true);

  if (isA1Day3) decorateA1Day3Lesson(location.state?.entry);
  if (isA1Day5) decorateA1Day5Lesson(location.state?.entry);

  useEffect(() => {
    const requestedKey = normalizeAssignmentKey(requestedAssignmentKey);
    const requestedAssignment = inlineAssignments.find(
      (assignment) => normalizeAssignmentKey(assignment.assignmentKey) === requestedKey
    );
    const nextAssignmentKey = requestedAssignment?.assignmentKey || inlineAssignments[0]?.assignmentKey || "";

    setSelectedAssignmentKey((current) =>
      normalizeAssignmentKey(current) === normalizeAssignmentKey(nextAssignmentKey) ? current : nextAssignmentKey
    );
    setSubmissionOpen(Boolean(nextAssignmentKey));
  }, [day, inlineAssignments, level, requestedAssignmentKey]);

  useEffect(() => {
    if (!selectedAssignmentKey) return;

    const currentKey = normalizeAssignmentKey(
      location.state?.assignmentKey || location.state?.canonicalAssignmentKey || ""
    );
    if (currentKey === normalizeAssignmentKey(selectedAssignmentKey) && String(location.state?.level || "").toUpperCase() === level) {
      return;
    }

    navigate(
      {
        pathname: location.pathname,
        search: location.search,
        hash: location.hash,
      },
      {
        replace: true,
        state: {
          ...(location.state || {}),
          level,
          day,
          assignmentKey: selectedAssignmentKey,
          canonicalAssignmentKey: selectedAssignmentKey,
          inlineCourseSubmission: true,
        },
      }
    );
  }, [day, level, location.hash, location.pathname, location.search, location.state, navigate, selectedAssignmentKey]);

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

  const selectedAssignment = inlineAssignments.find(
    (assignment) => normalizeAssignmentKey(assignment.assignmentKey) === normalizeAssignmentKey(selectedAssignmentKey)
  );

  return (
    <div ref={rootRef}>
      <CourseLessonPageLegacy />

      {inlineAssignments.length && selectedAssignmentKey ? (
        <section style={submissionShellStyles} aria-label="Course book assignment submission">
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "flex-start" }}>
            <div style={{ minWidth: 0 }}>
              <p style={{ color: "#1d4ed8", fontSize: 13, fontWeight: 900, letterSpacing: ".04em", margin: 0, textTransform: "uppercase" }}>
                Tutor-marked course book assignment
              </p>
              <h2 style={{ color: "#0f172a", fontSize: 22, margin: "5px 0" }}>
                Submit your Day {day} work here
              </h2>
              <p style={{ color: "#475569", margin: 0 }}>
                {selectedAssignment?.label || selectedAssignmentKey} · {selectedAssignmentKey}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSubmissionOpen((open) => !open)}
              aria-expanded={submissionOpen}
              style={{
                background: submissionOpen ? "#ffffff" : "#2563eb",
                border: "1px solid #93c5fd",
                borderRadius: 12,
                color: submissionOpen ? "#1d4ed8" : "#ffffff",
                cursor: "pointer",
                fontWeight: 800,
                padding: "10px 14px",
              }}
            >
              {submissionOpen ? "Collapse submission" : "Open submission"}
            </button>
          </div>

          {inlineAssignments.length > 1 ? (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }} aria-label="Assignments for this lesson">
              {inlineAssignments.map((assignment) => {
                const selected = normalizeAssignmentKey(assignment.assignmentKey) === normalizeAssignmentKey(selectedAssignmentKey);
                return (
                  <button
                    key={assignment.assignmentKey}
                    type="button"
                    onClick={() => {
                      setSelectedAssignmentKey(assignment.assignmentKey);
                      setSubmissionOpen(true);
                    }}
                    aria-pressed={selected}
                    style={{
                      background: selected ? "#dbeafe" : "#ffffff",
                      border: `1px solid ${selected ? "#60a5fa" : "#cbd5e1"}`,
                      borderRadius: 999,
                      color: selected ? "#1d4ed8" : "#334155",
                      cursor: "pointer",
                      fontWeight: 800,
                      padding: "8px 12px",
                    }}
                  >
                    {assignment.chapter ? `Chapter ${assignment.chapter}` : assignment.title}
                  </button>
                );
              })}
            </div>
          ) : null}

          {submissionOpen ? (
            <div className="course-book-inline-submission-page">
              <style>{`.course-book-inline-submission-page > div > section:first-child { display: none !important; }
          .course-book-inline-submission-page select { display: none !important; }`}</style>
              <AssignmentSubmissionPage key={`${level}-${selectedAssignmentKey}`} />
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
