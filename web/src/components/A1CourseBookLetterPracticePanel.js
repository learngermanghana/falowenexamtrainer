import React, { useEffect, useMemo, useRef, useState } from "react";
import { styles } from "../styles";
import { useAuth } from "../context/AuthContext";
import { markLetterWithAI } from "../services/coachService";
import {
  loadWritingProgress,
  saveWritingAttempt,
  saveWritingProgress,
} from "../services/writingProgressService";
import WritingFeedbackCard from "./WritingFeedbackCard";

const GERMAN_SPECIAL_CHARACTERS = ["ä", "ö", "ü", "ß", "Ä", "Ö", "Ü"];

const countWords = (value = "") => {
  const trimmed = String(value || "").trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
};

const resolveStudentName = ({ studentProfile, user }) =>
  String(
    studentProfile?.name ||
      studentProfile?.fullName ||
      user?.displayName ||
      user?.email ||
      "Student",
  ).trim();

const buildPracticeSubmissionContext = ({ taskContext, letterType, promptType }) => {
  const parts = [taskContext, letterType, promptType]
    .map((value) => String(value || "").trim().toLowerCase())
    .filter(Boolean);
  return `course-task:${parts.join(" ") || "a1 letter"}`;
};

export default function A1CourseBookLetterPracticePanel({
  title,
  description,
  taskId,
  taskTitle,
  taskContext,
  letterType,
  promptType = "letter",
  placeholder,
  minimumWords = 35,
  maximumWords = 50,
}) {
  const { user, idToken, studentProfile } = useAuth();
  const textareaRef = useRef(null);
  const [draft, setDraft] = useState("");
  const [feedbackData, setFeedbackData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [saveState, setSaveState] = useState("idle");
  const [error, setError] = useState("");

  const studentCode =
    studentProfile?.studentCode ||
    studentProfile?.studentcode ||
    user?.uid ||
    "";
  const userId = user?.uid || "";
  const wordCount = countWords(draft);
  const wordsRemaining = Math.max(0, Number(minimumWords || 0) - wordCount);
  const withinTarget =
    wordCount >= Number(minimumWords || 0) &&
    wordCount <= Number(maximumWords || Number.POSITIVE_INFINITY);
  const submissionContext = useMemo(
    () => buildPracticeSubmissionContext({ taskContext, letterType, promptType }),
    [letterType, promptType, taskContext],
  );

  useEffect(() => {
    let active = true;

    const loadDraft = async () => {
      if (!userId) {
        setLoaded(true);
        return;
      }

      const saved = await loadWritingProgress({
        userId,
        studentCode,
        mode: "course",
        workspaceKey: taskId,
      });
      if (!active) return;

      if (typeof saved?.draft === "string") setDraft(saved.draft);
      if (saved?.feedbackData && typeof saved.feedbackData === "object") {
        setFeedbackData(saved.feedbackData);
      }
      setLoaded(true);
    };

    loadDraft();
    return () => {
      active = false;
    };
  }, [studentCode, taskId, userId]);

  useEffect(() => {
    if (!loaded || !userId) return undefined;
    setSaveState("saving");

    const timer = window.setTimeout(() => {
      saveWritingProgress({
        userId,
        studentCode,
        mode: "course",
        workspaceKey: taskId,
        data: {
          draft,
          feedbackData,
          level: "A1",
          assignmentKey: "A1-12.3",
          workbookId: "A1-12.3-letter-writing-workbook",
          taskId,
          taskTitle,
          letterType,
          promptType,
          submissionContext,
        },
      })
        .then(() => setSaveState("saved"))
        .catch(() => setSaveState("error"));
    }, 650);

    return () => window.clearTimeout(timer);
  }, [
    draft,
    feedbackData,
    letterType,
    loaded,
    promptType,
    studentCode,
    submissionContext,
    taskId,
    taskTitle,
    userId,
  ]);

  const insertCharacter = (character) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setDraft((current) => `${current}${character}`);
      return;
    }

    const start = textarea.selectionStart ?? draft.length;
    const end = textarea.selectionEnd ?? draft.length;
    const next = `${draft.slice(0, start)}${character}${draft.slice(end)}`;
    setDraft(next);
    window.requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + character.length, start + character.length);
    });
  };

  const markDraft = async () => {
    const text = draft.trim();
    if (!text) {
      setError("Write or paste your letter before marking it.");
      textareaRef.current?.focus();
      return;
    }

    setLoading(true);
    setError("");
    try {
      const result = await markLetterWithAI({
        text,
        level: "A1",
        studentName: resolveStudentName({ studentProfile, user }),
        program: studentProfile?.program,
        submissionContext,
        promptType,
        idToken,
      });
      setFeedbackData(result);

      if (userId) {
        await saveWritingAttempt({
          userId,
          studentCode,
          mode: "course",
          workspaceKey: taskId,
          attempt: {
            id: `${taskId}-${Date.now()}`,
            level: "A1",
            courseLevel: "A1",
            day: 20,
            chapter: "12.3",
            assignmentKey: "A1-12.3",
            workbookId: "A1-12.3-letter-writing-workbook",
            lessonId: "A1-day-20-chapter-12.3",
            taskId,
            taskTitle,
            letterType,
            promptType,
            originalText: text,
            feedback: result?.feedback || "",
            score: result?.score ?? result?.rubric?.overall ?? null,
            maxScore: result?.maxScore ?? 25,
            rubricScores: result?.rubric || null,
            corrections: result?.corrections || [],
            structuredFeedback: result?.structuredFeedback || null,
            createdAt: new Date().toISOString(),
          },
        });
      }
    } catch (markError) {
      setError(
        markError?.response?.data?.error ||
          markError?.message ||
          "Falowen could not mark this letter right now. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const clearDraft = () => {
    if (!window.confirm("Clear this practice letter and its feedback?")) return;
    setDraft("");
    setFeedbackData(null);
    setError("");
    textareaRef.current?.focus();
  };

  return (
    <section
      data-a1-course-book-letter-practice="true"
      data-writing-task-id={taskId}
      data-letter-type={letterType}
      style={{
        border: "2px solid #a7f3d0",
        borderRadius: 18,
        padding: 18,
        display: "grid",
        gap: 14,
        background: "linear-gradient(135deg, #ecfdf5, #ffffff 75%)",
      }}
    >
      <div style={{ display: "grid", gap: 6 }}>
        <span
          style={{
            width: "fit-content",
            padding: "5px 10px",
            borderRadius: 999,
            background: "#d1fae5",
            color: "#065f46",
            fontSize: 12,
            fontWeight: 900,
          }}
        >
          Practice only · not final submission
        </span>
        <h3 style={{ margin: 0 }}>{title}</h3>
        <p style={{ ...styles.helperText, margin: 0 }}>{description}</p>
      </div>

      <label style={{ ...styles.label, margin: 0 }} htmlFor={`${taskId}-draft`}>
        Your letter
      </label>
      <textarea
        id={`${taskId}-draft`}
        ref={textareaRef}
        value={draft}
        onChange={(event) => {
          setDraft(event.target.value);
          setError("");
        }}
        placeholder={placeholder}
        rows={10}
        style={styles.textArea}
        aria-describedby={`${taskId}-word-count`}
      />

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {GERMAN_SPECIAL_CHARACTERS.map((character) => (
          <button
            key={character}
            type="button"
            style={{ ...styles.chipButton, minWidth: 42 }}
            onClick={() => insertCharacter(character)}
          >
            {character}
          </button>
        ))}
      </div>

      <div
        id={`${taskId}-word-count`}
        aria-live="polite"
        style={{
          border: `1px solid ${withinTarget ? "#86efac" : "#fbbf24"}`,
          borderRadius: 12,
          padding: "10px 12px",
          background: withinTarget ? "#f0fdf4" : "#fffbeb",
          color: withinTarget ? "#166534" : "#92400e",
          fontWeight: 800,
        }}
      >
        {wordCount} words · Target: {minimumWords}–{maximumWords} words
        {wordsRemaining > 0
          ? ` · Add ${wordsRemaining} more word${wordsRemaining === 1 ? "" : "s"}.`
          : wordCount > maximumWords
            ? ` · Remove ${wordCount - maximumWords} word${wordCount - maximumWords === 1 ? "" : "s"}.`
            : " · Ready for practice marking."}
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <button
          type="button"
          style={styles.primaryButton}
          onClick={markDraft}
          disabled={loading}
        >
          {loading ? "Marking your letter…" : title}
        </button>
        <button type="button" style={styles.secondaryButton} onClick={clearDraft}>
          Clear practice draft
        </button>
        <span style={styles.helperText} aria-live="polite">
          {!userId
            ? "Sign in to save this draft in the cloud."
            : saveState === "saving"
              ? "Saving draft…"
              : saveState === "saved"
                ? "Draft saved."
                : saveState === "error"
                  ? "Draft could not be saved."
                  : "Draft will save automatically."}
        </span>
      </div>

      {error ? (
        <div role="alert" style={styles.errorBox}>
          {error}
        </div>
      ) : null}

      {feedbackData ? (
        <WritingFeedbackCard
          feedback={feedbackData.feedback || "Analysis completed."}
          level="A1"
          draft={draft}
          rubric={feedbackData.rubric || null}
          corrections={feedbackData.corrections || []}
          simplifiedFeedback={feedbackData.simplifiedFeedback || null}
          structuredFeedback={feedbackData.structuredFeedback || feedbackData}
          trend={feedbackData.trend || null}
        />
      ) : null}
    </section>
  );
}

export const __TESTING__ = {
  buildPracticeSubmissionContext,
  countWords,
  resolveStudentName,
};
