import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
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
import { normalizeWritingFeedback } from "../lib/writingFeedbackNormalizer";

const countWords = (text = "") =>
  String(text || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

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
                Question {index + 1} of 5 · {question.section}
              </strong>
              <span>
                {question.words}/{question.minimumWords} words{" "}
                {question.complete ? "✓" : ""}
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
            <small>
              {question.complete
                ? "Section completed."
                : `Add ${Math.max(question.minimumWords - question.words, 0)} more words.`}
            </small>
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
