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

const FORMAL_LETTER_TEMPLATE = `FORMAL LETTER · Use this for complaints, enquiries, applications or official emails

Betreff: [präzises Anliegen]

Sehr geehrte Damen und Herren,
Sehr geehrte Frau [Name] / Sehr geehrter Herr [Name],

hiermit wende ich mich an Sie, da [Anlass] aus meiner Sicht einer Klärung bedarf.

Zunächst möchte ich darauf hinweisen, dass [Punkt 1]. Darüber hinaus ist zu berücksichtigen, dass [Punkt 2].

Ich bitte Sie daher höflich um [konkrete Bitte] und um eine zeitnahe Rückmeldung.

Für Ihre Unterstützung danke ich Ihnen im Voraus.

Mit freundlichen Grüßen
[Ihr Name]`;

const OPINION_ESSAY_TEMPLATE = `OPINION ESSAY · Use this for Meinungsbeitrag, Stellungnahme or argument writing

In der heutigen Zeit wird oft über [Thema] diskutiert.

Meiner Meinung nach [eigene Meinung].

Ein wichtiger Grund dafür ist, dass [Grund 1]. Außerdem sollte man berücksichtigen, dass [Grund 2].

Natürlich gibt es auch andere Meinungen. Einige Menschen sind der Ansicht, dass [Gegenargument]. Dennoch bin ich der Meinung, dass [eigene Position stärken].

Eine mögliche Lösung oder Alternative wäre, dass [Vorschlag / Alternative].

Zusammenfassend lässt sich sagen, dass [kurzes Fazit].`;

const PLANNING_NOTES_PLACEHOLDER = `Write short points first. English is okay.

1. What is the problem?
2. Why is it a problem?
3. What do I want?
4. What solution or compromise can I suggest?
5. What should happen next time?

Example:
1. need to rent again
2. rent increased after Corona
3. company should help me search for an apartment
4. I need my own office
5. next time they should inform me early`;

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

const getConfigSearchText = (config = {}) =>
  [
    config.taskType,
    config.title,
    config.topic,
    config.prompt,
    config.writingTopic,
    config.writingTaskType,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

const isOpinionWritingTask = (config = {}) => {
  const text = getConfigSearchText(config);
  return /opinion essay|meinungsbeitrag|stellungnahme|erörterung|eroerterung|argument writing|argumentation|diskussionsbeitrag|diskussion/.test(text);
};

const isFormalWritingTask = (config = {}) => {
  const text = getConfigSearchText(config);
  return /formal|formell|formelle|e-mail|email|letter|brief|eingabe|proposal|vorschlag|anfrage|beschwerde|bewerbung|absage|termin/.test(text)
    && !isOpinionWritingTask(config);
};

const emptyState = () => ({
  answers: {},
  planningNotes: "",
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
    planningNotes: typeof saved.planningNotes === "string" ? saved.planningNotes : "",
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

const getMainWritingPrompt = (config = {}) =>
  config.topic ||
  config.prompt ||
  config.writingTopic ||
  config.mainQuestion ||
  `Write your complete ${config.level || "German"} text for this task.`;

const getTemplateForMode = ({ formalMode, opinionMode, config }) => {
  if (config?.starterTemplate) return config.starterTemplate;
  if (formalMode) return config?.formalTemplate || FORMAL_LETTER_TEMPLATE;
  if (opinionMode) return config?.opinionTemplate || OPINION_ESSAY_TEMPLATE;
  return config?.template || "";
};

const hasUnfilledPlaceholders = (text = "") => /\[[^\]]+\]/.test(String(text || ""));

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

  const opinionMode = isOpinionWritingTask(config);
  const formalMode = isFormalWritingTask(config);
  const forcedSingleBoxMode = config.singleDraftMode === true || config.oneBoxMode === true;
  const singleBoxMode = formalMode || opinionMode || forcedSingleBoxMode;
  const modeLabel = formalMode ? "Formal letter" : opinionMode ? "Opinion essay" : "Writing";
  const templateText = getTemplateForMode({ formalMode, opinionMode, config });

  const questions = useMemo(
    () =>
      (config.questions || []).map((question) => ({
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
  const finalEssay = singleBoxMode
    ? (state.finalEssay || autoText || templateText)
    : state.combinedDraftMode === "auto" ? autoText : state.finalEssay;
  const completeCount = questions.filter((question) => question.complete).length;
  const placeholderWarning = hasUnfilledPlaceholders(finalEssay);
  const allComplete = singleBoxMode ? Boolean(finalEssay.trim()) && !placeholderWarning : completeCount === questions.length;
  const totalMissingWords = questions.reduce((sum, question) => sum + Math.max(question.minimumWords - question.words, 0), 0);
  const nextQuestion = questions.find((question) => !question.complete);
  const motivationMessage = getMotivationMessage({ completeCount, totalQuestions: questions.length, totalMissingWords });
  const lessonDay = inferDay(config, storageKey);
  const finalWordCount = countWords(finalEssay);
  const promptText = getMainWritingPrompt(config);
  const readyForAnalysis = Boolean(finalEssay.trim()) && !placeholderWarning;

  const update = (updater) =>
    setState((old) => ({
      ...(typeof updater === "function"
        ? updater(old)
        : { ...old, ...updater }),
      updatedAt: new Date().toISOString(),
    }));

  const insertTemplate = (template = templateText) => {
    if (!template) return;
    const current = String(finalEssay || "").trim();
    const templateTrimmed = String(template || "").trim();
    if (current && current !== templateTrimmed) {
      const shouldReplace = window.confirm(
        "This will replace the current text in the box with the writing template. Continue?",
      );
      if (!shouldReplace) return;
    }
    update((old) => ({
      ...old,
      finalEssay: template,
      combinedDraftMode: "manual",
      analysisFeedback: null,
      analysisUpdatedAt: "",
    }));
    setCopyMessage("Template inserted. Replace every [placeholder] before analysis.");
    window.setTimeout(() => combinedDraftRef.current?.focus(), 0);
  };

  useEffect(() => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({ ...state, finalEssay }),
    );
  }, [finalEssay, state, storageKey]);

  useEffect(() => {
    onStatusChange?.({
      complete: allComplete && Boolean(finalEssay.trim()),
      completedQuestions: singleBoxMode ? (allComplete ? 1 : 0) : completeCount,
      totalQuestions: singleBoxMode ? 1 : questions.length,
      wordCount: finalWordCount,
    });
  }, [
    allComplete,
    completeCount,
    finalEssay,
    finalWordCount,
    singleBoxMode,
    onStatusChange,
    questions.length,
  ]);

  useEffect(() => {
    if (singleBoxMode) return;
    questions.forEach((question, index) => {
      if (!question.complete || reachedMilestonesRef.current.has(question.id)) return;
      reachedMilestonesRef.current.add(question.id);
      showToast(getMilestoneMessage(question, index), "success", { playSound: true });
    });
  }, [singleBoxMode, questions, showToast]);

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
    if (!draft || analysisStatus === "loading" || placeholderWarning) return;

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
        promptType: formalMode ? "formal-letter" : "argument",
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
      data-writing-mode={singleBoxMode ? (formalMode ? "formal-single-box" : opinionMode ? "opinion-single-box" : "single-box") : "guided-five-questions"}
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
          {singleBoxMode ? `${modeLabel} · ${config.level} Writing` : `Guided ${config.level} Writing`}
        </span>
        <h3 style={{ margin: 0 }}>
          {singleBoxMode ? `Write one complete ${formalMode ? "formal text" : opinionMode ? "opinion essay" : "text"}` : "Answer five questions and build your text"}
        </h3>
        {singleBoxMode ? (
          <div style={{ border: "1px solid #bfdbfe", borderRadius: 16, padding: 12, background: "#eff6ff", display: "grid", gap: 8 }}>
            <strong>Main writing task</strong>
            <span style={{ color: "#475569", lineHeight: 1.65 }}>{promptText}</span>
            <small style={{ color: "#1e3a8a", fontWeight: 800 }}>
              First write simple points in English or German, then use the template to turn those ideas into one complete German text.
            </small>
          </div>
        ) : (
          <div style={{ border: "1px solid #bfdbfe", borderRadius: 16, padding: 12, background: "#eff6ff", display: "grid", gap: 8 }}>
            <strong>Writing mission: {completeCount}/5 cards complete</strong>
            <span style={{ color: "#475569" }}>{motivationMessage}</span>
            <div style={{ height: 10, overflow: "hidden", borderRadius: 999, background: "#dbeafe" }} aria-label="Writing mission progress" aria-valuemin={0} aria-valuemax={5} aria-valuenow={completeCount} role="progressbar">
              <div style={{ width: `${(completeCount / Math.max(questions.length, 1)) * 100}%`, height: "100%", borderRadius: 999, background: "linear-gradient(90deg,#2563eb,#7c3aed,#16a34a)", transition: "width 180ms ease" }} />
            </div>
            {nextQuestion ? <small style={{ color: "#1e3a8a", fontWeight: 800 }}>Next unlock: {nextQuestion.section} · {Math.max(nextQuestion.minimumWords - nextQuestion.words, 0)} words to go</small> : <small style={{ color: "#166534", fontWeight: 900 }}>Mission complete: all five answer cards are ready.</small>}
          </div>
        )}
        <small
          style={{
            color: saveStatus === "error" ? "#b91c1c" : "#166534",
            fontWeight: 800,
          }}
        >
          {saveLabel}
        </small>
      </header>

      {!singleBoxMode ? (
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
      ) : null}

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
        <h3 style={{ margin: 0 }}>{singleBoxMode ? `Your ${formalMode ? "formal letter" : opinionMode ? "opinion essay" : "text"}` : "Your combined text"}</h3>
        <small style={{ color: "#475569", fontWeight: 700 }}>
          {singleBoxMode
            ? "Use your points above, then edit the template into one complete exam-style answer"
            : state.combinedDraftMode === "auto"
              ? "Automatically built from your answers"
              : "You are editing the combined version"}
        </small>

        {singleBoxMode ? (
          <div style={{ border: "1px solid #c4b5fd", borderRadius: 14, padding: 12, background: "#faf5ff", display: "grid", gap: 8 }}>
            <strong>Step 1 · My points first</strong>
            <span style={{ color: "#5b21b6", lineHeight: 1.65 }}>
              Write short ideas here before the German text. English is okay. Keep this box as your guide while you improve the template below.
            </span>
            <textarea
              aria-label="My writing points"
              value={state.planningNotes || ""}
              onChange={(event) =>
                update((old) => ({
                  ...old,
                  planningNotes: event.target.value,
                }))
              }
              placeholder={PLANNING_NOTES_PLACEHOLDER}
              style={{
                minHeight: 130,
                padding: 12,
                border: "1px solid #a78bfa",
                borderRadius: 12,
                font: "inherit",
                lineHeight: 1.6,
                background: "#fff",
              }}
            />
          </div>
        ) : null}

        {singleBoxMode && templateText ? (
          <div style={{ border: "1px solid #fed7aa", borderRadius: 14, padding: 12, background: "#fffbeb", display: "grid", gap: 8 }}>
            <strong>Step 2 · Turn your points into German</strong>
            <span style={{ color: "#92400e", lineHeight: 1.65 }}>
              A template is already placed in the box when it is empty. Replace every bracket like <strong>[Anlass]</strong> with your own words.
            </span>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button type="button" onClick={() => insertTemplate(templateText)} style={styles.secondaryButton}>
                Insert {formalMode ? "formal letter" : opinionMode ? "opinion essay" : "writing"} template
              </button>
            </div>
          </div>
        ) : null}

        <textarea
          ref={combinedDraftRef}
          aria-label={singleBoxMode ? `Your ${formalMode ? "formal letter" : opinionMode ? "opinion essay" : "text"}` : "Your combined text"}
          value={finalEssay}
          onChange={(event) =>
            update((old) => ({
              ...old,
              finalEssay: event.target.value,
              combinedDraftMode: "manual",
            }))
          }
          style={{
            minHeight: singleBoxMode ? 420 : 320,
            padding: 14,
            border: "1px solid #94a3b8",
            borderRadius: 12,
            font: "inherit",
            lineHeight: 1.7,
          }}
        />
        {placeholderWarning ? (
          <div style={{ border: "1px solid #fecaca", borderRadius: 12, padding: 10, background: "#fff7f7", color: "#991b1b", fontWeight: 800 }}>
            Replace all bracket placeholders like [Anlass], [Punkt 1] or [Ihr Name] before you analyse your text.
          </div>
        ) : null}
        <PrepositionCaseCoachField
          text={finalEssay}
          level={config.level}
          textareaRef={combinedDraftRef}
          studentProfile={studentProfile}
        />
        <div>
          <strong>{finalWordCount} words</strong> · Target: about {config.targetWords}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={analyse}
            disabled={analysisStatus === "loading" || !readyForAnalysis}
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
