import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  loadWritingAttempts,
  loadWritingProgress,
  saveWritingAttempt,
  saveWritingProgress,
} from "../services/writingProgressService";
import { markLetterWithAI } from "../services/coachService";
import { styles } from "../styles";
import WritingHistorySection, {
  buildWritingHistoryRecord,
} from "./WritingHistorySection";
import WritingFeedbackCard from "./WritingFeedbackCard";
import PrepositionCaseCoachField from "./PrepositionCaseCoachField";
import { normalizeWritingFeedback } from "../lib/writingFeedbackNormalizer";

const countWords = (text = "") =>
  String(text || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

const WORD_MILESTONE_LABELS = [
  { threshold: 0, label: "Start writing", color: "#64748b" },
  { threshold: 0.35, label: "Good", color: "#2563eb" },
  { threshold: 0.65, label: "Keep going", color: "#7c3aed" },
  { threshold: 0.9, label: "Almost done", color: "#d97706" },
  { threshold: 1, label: "Milestone reached", color: "#15803d" },
];

const getWordMilestone = (words = 0, minimumWords = 1) => {
  const progress = Math.max(0, Math.min(words / Math.max(minimumWords, 1), 1));
  return WORD_MILESTONE_LABELS.reduce((current, milestone) =>
    progress >= milestone.threshold ? milestone : current,
  WORD_MILESTONE_LABELS[0]);
};

const getMilestoneMessage = (question, index) =>
  `Question ${index + 1} word goal reached: ${question.minimumWords}+ words. You can keep typing if you prefer.`;

const getMotivationMessage = ({ completeCount, totalQuestions, totalMissingWords }) => {
  if (completeCount === totalQuestions) return "All five answers are unlocked — polish the combined text and send it for AI feedback.";
  if (completeCount >= 3) return "Great momentum. Finish the last cards to unlock your complete exam-style answer.";
  if (completeCount >= 1) return "You have started. Keep typing to build a full answer step by step.";
  return `Start with one card. Your full mission has ${totalMissingWords} target words remaining.`;
};

const emptyState = () => ({
  answers: {},
  finalEssay: "",
  combinedDraftMode: "auto",
  analysisFeedback: null,
  analysisUpdatedAt: "",
  updatedAt: "",
});

const normalizeSavedFeedback = (feedback) => {
  if (!feedback) return null;
  const normalized = normalizeWritingFeedback(feedback);
  return normalized.parseError ? null : normalized;
};

export const migrateGuidedWritingState = (saved = {}) => {
  const { writingHistory: _legacyHistory, ...rest } = saved || {};
  return {
    ...emptyState(),
    ...rest,
    answers:
      saved.answers && typeof saved.answers === "object" ? saved.answers : {},
    combinedDraftMode:
      saved.combinedDraftMode ||
      (saved.finalEssay && saved.view === "final" ? "manual" : "auto"),
    analysisFeedback: normalizeSavedFeedback(saved.analysisFeedback),
  };
};

const readLocalSnapshot = (storageKey) => {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || "{}");
  } catch {
    return {};
  }
};

const dedupeAttempts = (entries = []) => {
  const seen = new Set();
  return entries.filter((entry) => {
    const key =
      entry?.id ||
      [entry?.submissionDate, entry?.writingTaskId, entry?.originalText].join("|");
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const inferDay = (config, storageKey) => {
  if (config?.day === 0 || config?.day) return Number(config.day);
  const match = String(storageKey || "").match(/(?:day|lesson)[-_:]?(\d+)/i);
  return match ? Number(match[1]) : null;
};

export default function GuidedWritingWorkspace({
  config,
  storageKey,
  cloudField,
  onStatusChange,
}) {
  const { user, idToken, studentProfile } = useAuth();
  const { showToast } = useToast();
  const reachedMilestonesRef = useRef(new Set());
  const questionTextareaRefs = useRef({});
  const combinedDraftRef = useRef(null);
  const userId = user?.uid || "";
  const studentCode =
    studentProfile?.studentCode || studentProfile?.studentcode || userId;
  const hasCloudOwner = Boolean(userId);
  const initialSnapshot = useMemo(
    () => readLocalSnapshot(storageKey),
    [storageKey],
  );
  const [state, setState] = useState(() =>
    migrateGuidedWritingState(initialSnapshot),
  );
  const [writingHistory, setWritingHistory] = useState(() =>
    Array.isArray(initialSnapshot.writingHistory)
      ? initialSnapshot.writingHistory
      : [],
  );
  const [cloudLoaded, setCloudLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [analysisStatus, setAnalysisStatus] = useState("idle");
  const [analysisError, setAnalysisError] = useState("");
  const [copyMessage, setCopyMessage] = useState("");

  const questions = useMemo(
    () =>
      config.questions.map((question) => ({
        ...question,
        words: countWords(state.answers[question.id]),
        complete:
          countWords(state.answers[question.id]) >= question.minimumWords,
        milestone: getWordMilestone(
          countWords(state.answers[question.id]),
          question.minimumWords,
        ),
      })),
    [config.questions, state.answers],
  );
  const autoText = questions
    .map((question) => String(state.answers[question.id] || "").trim())
    .filter(Boolean)
    .join("\n\n");
  const finalEssay =
    state.combinedDraftMode === "auto" ? autoText : state.finalEssay;
  const completeCount = questions.filter((question) => question.complete).length;
  const allComplete = completeCount === questions.length;
  const totalMissingWords = questions.reduce((sum, question) => sum + Math.max(question.minimumWords - question.words, 0), 0);
  const nextQuestion = questions.find((question) => !question.complete);
  const motivationMessage = getMotivationMessage({ completeCount, totalQuestions: questions.length, totalMissingWords });
  const lessonDay = inferDay(config, storageKey);

  const update = (updater) =>
    setState((old) => ({
      ...(typeof updater === "function"
        ? updater(old)
        : { ...old, ...updater }),
      updatedAt: new Date().toISOString(),
    }));

  useEffect(() => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({ ...state, finalEssay }),
    );
  }, [finalEssay, state, storageKey]);

  useEffect(() => {
    onStatusChange?.({
      complete: allComplete && Boolean(finalEssay.trim()),
      completedQuestions: completeCount,
      totalQuestions: questions.length,
      wordCount: countWords(finalEssay),
    });
  }, [
    allComplete,
    completeCount,
    finalEssay,
    onStatusChange,
    questions.length,
  ]);

  useEffect(() => {
    questions.forEach((question, index) => {
      if (!question.complete || reachedMilestonesRef.current.has(question.id)) return;
      reachedMilestonesRef.current.add(question.id);
      showToast(getMilestoneMessage(question, index), "success", { playSound: true });
    });
  }, [questions, showToast]);

  useEffect(() => {
    let active = true;
    if (!hasCloudOwner) {
      setCloudLoaded(true);
      setSaveStatus("device");
      return undefined;
    }

    setSaveStatus("loading");
    Promise.all([
      loadWritingProgress({ userId, studentCode, mode: "course" }),
      loadWritingAttempts({
        userId,
        studentCode,
        mode: "course",
        level: config.level,
        workbookId: storageKey,
        pageSize: 25,
      }),
    ])
      .then(([saved, attempts]) => {
        if (!active) return;
        const draft = saved?.[cloudField];
        const legacyHistory = Array.isArray(draft?.writingHistory)
          ? draft.writingHistory
          : [];

        if (draft) {
          setState((local) =>
            Date.parse(local.updatedAt || "") >
            Date.parse(draft.updatedAt || "")
              ? local
              : migrateGuidedWritingState(draft),
          );
        }

        setWritingHistory((local) =>
          dedupeAttempts([...(attempts || []), ...legacyHistory, ...local]),
        );
        setSaveStatus("saved");
      })
      .catch(() => active && setSaveStatus("error"))
      .finally(() => active && setCloudLoaded(true));

    return () => {
      active = false;
    };
  }, [
    cloudField,
    config.level,
    hasCloudOwner,
    storageKey,
    studentCode,
    userId,
  ]);

  useEffect(() => {
    if (!cloudLoaded || !hasCloudOwner) return undefined;
    setSaveStatus("saving");
    const timer = window.setTimeout(async () => {
      const saved = await saveWritingProgress({
        userId,
        studentCode,
        mode: "course",
        data: {
          [cloudField]: {
            ...state,
            finalEssay,
          },
        },
      });
      setSaveStatus(saved ? "saved" : "error");
    }, 800);

    return () => window.clearTimeout(timer);
  }, [
    cloudField,
    cloudLoaded,
    finalEssay,
    hasCloudOwner,
    state,
    studentCode,
    userId,
  ]);

  const analyse = async () => {
    const draft = finalEssay.trim();
    if (!draft || analysisStatus === "loading") return;

    setAnalysisStatus("loading");
    setAnalysisError("");
    try {
      const data = await markLetterWithAI({
        text: draft,
        level: config.level,
        studentName:
          studentProfile?.name || user?.displayName || user?.email || "Student",
        idToken,
        program: studentProfile?.program,
        submissionContext: "course-guided-writing-analysis",
        promptType: "argument",
      });
      const normalized = normalizeWritingFeedback(
        data?.structuredFeedback ?? data,
      );
      if (normalized.parseError) throw new Error(normalized.summary);

      const historyRecord = buildWritingHistoryRecord({
        userId,
        studentCode,
        level: config.level,
        day: lessonDay,
        lessonId: config.lessonId || storageKey,
        workbookId: config.workbookId || storageKey,
        taskId: config.writingTaskId || cloudField,
        taskTitle: config.title || config.topic || "Guided writing task",
        text: draft,
        data: {
          ...data,
          feedback: normalized.summary,
          structuredFeedback: normalized,
          score: normalized.score,
          maxScore: normalized.maxScore,
          rubric: normalized.rubric,
          corrections: normalized.corrections,
        },
        context: "course-guided-writing-analysis",
      });

      update((old) => ({
        ...old,
        analysisFeedback: normalized,
        analysisUpdatedAt: new Date().toISOString(),
      }));
      setWritingHistory((old) => dedupeAttempts([historyRecord, ...old]));
      await saveWritingAttempt({
        userId,
        studentCode,
        mode: "course",
        attempt: historyRecord,
      });
      setAnalysisStatus("success");
    } catch (error) {
      setAnalysisError(
        error?.message ||
          "We could not read that feedback safely. Please retry analysis.",
      );
      setAnalysisStatus("error");
    }
  };

  const saveLabel = !hasCloudOwner
    ? "Saved on this device"
    : saveStatus === "loading"
      ? "Loading saved work..."
      : saveStatus === "saving"
        ? "Saving to Falowen..."
        : saveStatus === "error"
          ? "Cloud save failed — device copy is safe"
          : "Saved to Falowen";
  const buttonLabel =
    analysisStatus === "loading"
      ? "Analysing your text..."
      : analysisStatus === "error"
        ? "Retry analysis"
        : state.analysisFeedback
          ? "Analyse again"
          : "Analyse my text";

  return (
    <div
      data-guided-writing-workspace
      style={{
        border: "1px solid #c7d2fe",
        borderRadius: 18,
        padding: 16,
        display: "grid",
        gap: 16,
        background: "linear-gradient(180deg,#fff,#f8fafc)",
      }}
    >
      <header style={{ display: "grid", gap: 6 }}>
        <span
          style={{
            ...styles.badge,
            width: "fit-content",
            background: "#eef2ff",
            color: "#3730a3",
          }}
        >
          Guided {config.level} Writing
        </span>
        <h3 style={{ margin: 0 }}>Answer five questions and build your text</h3>
        <div style={{ border: "1px solid #bfdbfe", borderRadius: 16, padding: 12, background: "#eff6ff", display: "grid", gap: 8 }}>
          <strong>Writing mission: {completeCount}/5 cards complete</strong>
          <span style={{ color: "#475569" }}>{motivationMessage}</span>
          <div style={{ height: 10, overflow: "hidden", borderRadius: 999, background: "#dbeafe" }} aria-label="Writing mission progress" aria-valuemin={0} aria-valuemax={5} aria-valuenow={completeCount} role="progressbar">
            <div style={{ width: `${(completeCount / Math.max(questions.length, 1)) * 100}%`, height: "100%", borderRadius: 999, background: "linear-gradient(90deg,#2563eb,#7c3aed,#16a34a)", transition: "width 180ms ease" }} />
          </div>
          {nextQuestion ? <small style={{ color: "#1e3a8a", fontWeight: 800 }}>Next unlock: {nextQuestion.section} · {Math.max(nextQuestion.minimumWords - nextQuestion.words, 0)} words to go</small> : <small style={{ color: "#166534", fontWeight: 900 }}>Mission complete: all five answer cards are ready.</small>}
        </div>
        <small
          style={{
            color: saveStatus === "error" ? "#b91c1c" : "#166534",
            fontWeight: 800,
          }}
        >
          {saveLabel}
        </small>
      </header>

      <div style={{ display: "grid", gap: 14 }}>
        {questions.map((question, index) => (
          <article
            key={question.id}
            style={{
              border: `1px solid ${question.complete ? "#86efac" : "#e2e8f0"}`,
              borderRadius: 16,
              padding: 14,
              background: question.complete ? "#f0fdf4" : "#fff",
              display: "grid",
              gap: 9,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <strong>
                {question.complete ? "🏅" : "✍️"} Question {index + 1} of 5 · {question.section}
              </strong>
              <span
                style={{
                  color: question.milestone.color,
                  fontWeight: 900,
                }}
              >
                {question.milestone.label}
                {question.complete ? " ✓" : ""}
              </span>
            </div>
            <h4 style={{ margin: 0 }}>{question.question}</h4>
            <p style={{ margin: 0, color: "#64748b" }}>{question.help}</p>
            <div
              style={{
                borderLeft: "4px solid #818cf8",
                padding: 9,
                background: "#f8fafc",
              }}
            >
              <strong>Starter:</strong>{" "}
              {question.starter ||
                "Beginne mit einer klaren Aussage und begründe sie."}
            </div>
            <textarea
              ref={(node) => {
                if (node) questionTextareaRefs.current[question.id] = node;
                else delete questionTextareaRefs.current[question.id];
              }}
              aria-label={`Question ${index + 1}`}
              value={state.answers[question.id] || ""}
              onChange={(event) =>
                update((old) => ({
                  ...old,
                  answers: {
                    ...old.answers,
                    [question.id]: event.target.value,
                  },
                }))
              }
              style={{
                minHeight: 125,
                padding: 12,
                border: "1px solid #cbd5e1",
                borderRadius: 12,
                font: "inherit",
              }}
            />
            <PrepositionCaseCoachField
              text={state.answers[question.id] || ""}
              level={config.level}
              getTextarea={() => questionTextareaRefs.current[question.id] || null}
              studentProfile={studentProfile}
            />
            <div style={{ display: "grid", gap: 6 }}>
              <div
                aria-label={`Question ${index + 1} word progress`}
                aria-valuemin={0}
                aria-valuemax={question.minimumWords}
                aria-valuenow={Math.min(question.words, question.minimumWords)}
                role="progressbar"
                style={{
                  height: 10,
                  overflow: "hidden",
                  borderRadius: 999,
                  background: "#e2e8f0",
                }}
              >
                <div
                  style={{
                    width: `${Math.min((question.words / Math.max(question.minimumWords, 1)) * 100, 100)}%`,
                    height: "100%",
                    borderRadius: 999,
                    background: question.complete
                      ? "linear-gradient(90deg,#22c55e,#16a34a)"
                      : "linear-gradient(90deg,#818cf8,#f59e0b)",
                    transition: "width 180ms ease",
                  }}
                />
              </div>
              <small>
                {question.words}/{question.minimumWords} words · {question.complete
                  ? "Badge earned — this answer card is ready for your combined text."
                  : `Add ${Math.max(question.minimumWords - question.words, 0)} more words to earn this card badge.`}
              </small>
            </div>
          </article>
        ))}
      </div>

      <section
        data-combined-text-card
        style={{
          border: "1px solid #93c5fd",
          borderRadius: 16,
          padding: 16,
          background: "#fff",
          display: "grid",
          gap: 12,
        }}
      >
        <h3 style={{ margin: 0 }}>Your combined text</h3>
        <small style={{ color: "#475569", fontWeight: 700 }}>
          {state.combinedDraftMode === "auto"
            ? "Automatically built from your answers"
            : "You are editing the combined version"}
        </small>
        <textarea
          ref={combinedDraftRef}
          aria-label="Your combined text"
          value={finalEssay}
          onChange={(event) =>
            update((old) => ({
              ...old,
              finalEssay: event.target.value,
              combinedDraftMode: "manual",
            }))
          }
          style={{
            minHeight: 320,
            padding: 14,
            border: "1px solid #94a3b8",
            borderRadius: 12,
            font: "inherit",
            lineHeight: 1.7,
          }}
        />
        <PrepositionCaseCoachField
          text={finalEssay}
          level={config.level}
          textareaRef={combinedDraftRef}
          studentProfile={studentProfile}
        />
        <div>
          <strong>{countWords(finalEssay)} words</strong> · Target: about{" "}
          {config.targetWords}
        </div>
        <div>
          <strong>Checklist</strong>
          <ul>
            {config.checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={analyse}
            disabled={analysisStatus === "loading" || !finalEssay.trim()}
            style={styles.primaryButton}
          >
            {buttonLabel}
          </button>
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(finalEssay);
                setCopyMessage("Text copied.");
              } catch {
                setCopyMessage("Copy failed. Select the text manually.");
              }
            }}
            disabled={!finalEssay}
            style={styles.secondaryButton}
          >
            Copy text
          </button>
        </div>
        {copyMessage ? <small>{copyMessage}</small> : null}
        {analysisError ? (
          <div style={{ color: "#b91c1c", fontWeight: 700 }}>
            {analysisError}
          </div>
        ) : null}
        <WritingHistorySection
          title="Saved Texts"
          entries={writingHistory}
          level={config.level}
          onOpen={(entry) =>
            update((old) => ({
              ...old,
              finalEssay: entry.originalLetter || entry.originalText || "",
              combinedDraftMode: "manual",
              analysisFeedback: normalizeSavedFeedback(
                entry.structuredFeedback || entry.feedback || entry.summary,
              ),
              analysisUpdatedAt:
                entry.submissionDate || entry.updatedAt || "",
            }))
          }
        />
        {state.analysisFeedback ? (
          <div data-analysis-feedback style={{ marginTop: 8 }}>
            <WritingFeedbackCard
              level={config.level}
              draft={finalEssay}
              structuredFeedback={state.analysisFeedback}
            />
          </div>
        ) : null}
      </section>
    </div>
  );
}
