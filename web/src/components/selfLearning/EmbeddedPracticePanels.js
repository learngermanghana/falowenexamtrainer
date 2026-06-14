import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import SpeakingPage from "../SpeakingPage";
import WritingPage from "../WritingPage";
import { useAuth } from "../../context/AuthContext";
import { loadWritingProgress, saveWritingProgress } from "../../services/writingProgressService";
import { markLetterWithAI } from "../../services/coachService";
import c1Day2QuestionWritingBuilder from "../../data/writingQuestionBuilders/c1Day2KulturUndIdentitaet";
import { getC1OpinionWritingTip } from "../../data/writingQuestionBuilders/c1OpinionWritingTips";
import {
  getAdvancedWritingPhase,
  getGenericGuidedWritingConfig,
} from "../../data/advancedWritingProgression";

const countWords = (text = "") => String(text || "").trim().split(/\s+/).filter(Boolean).length;

const getCourseLessonRouteMeta = () => {
  if (typeof window === "undefined") return { level: "", day: 0 };
  const path = window.location.pathname.toLowerCase();
  const routeMatch = path.match(/\/campus\/course\/lesson\/(a1|a2|b1|b2|c1)\/(\d+)(?:\/|$)/);
  const slugMatch = path.match(/(a1|a2|b1|b2|c1)-day-(\d+)/);
  const match = routeMatch || slugMatch;
  return match ? { level: match[1].toUpperCase(), day: Number(match[2]) } : { level: "", day: 0 };
};

const makeEmptyQuestionState = () => ({
  answers: {},
  finalEssay: "",
  view: "questions",
  updatedAt: "",
});

const primaryButton = {
  border: 0,
  borderRadius: 12,
  padding: "11px 16px",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 800,
  cursor: "pointer",
};

const secondaryButton = {
  border: "1px solid #cbd5e1",
  borderRadius: 12,
  padding: "10px 14px",
  background: "#fff",
  color: "#0f172a",
  fontWeight: 800,
  cursor: "pointer",
};

function GuidedDraftAnalysisPanel({ text, level }) {
  const { user, idToken, studentProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const wordCount = countWords(text);

  const analyseDraft = async () => {
    const draft = String(text || "").trim();
    if (!draft) {
      setError("Combine your five answers first.");
      return;
    }

    setLoading(true);
    setFeedback("");
    setError("");

    try {
      const data = await markLetterWithAI({
        text: draft,
        level,
        studentName: studentProfile?.name || user?.displayName || user?.email || "Student",
        idToken,
        program: studentProfile?.program,
        submissionContext: "course-guided-writing-analysis",
        promptType: "argument",
      });
      setFeedback(data?.feedback || data?.structuredFeedback?.summary || "Analysis completed.");
    } catch (analysisError) {
      setError(
        analysisError?.response?.data?.error ||
          analysisError?.message ||
          "Falowen could not analyse the draft right now.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #bfdbfe",
        borderRadius: 16,
        padding: 14,
        background: "linear-gradient(135deg, #eff6ff, #ffffff)",
        display: "grid",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "grid", gap: 4 }}>
          <strong>Analyse my text</strong>
          <span style={{ color: "#475569", lineHeight: 1.55 }}>
            Falowen analyses the combined draft at {level} level: task development, structure, grammar, vocabulary and connections between the five parts.
          </span>
        </div>
        <span style={{ padding: "6px 10px", borderRadius: 999, background: "#dbeafe", color: "#1d4ed8", fontWeight: 800 }}>
          {wordCount} words
        </span>
      </div>

      <div style={{ padding: 10, borderRadius: 12, border: "1px solid #fde68a", background: "#fffbeb", lineHeight: 1.6 }}>
        This is guided feedback, not full-essay marking. <strong>Mark My Letter begins from Day 20.</strong>
      </div>

      <button type="button" style={{ ...primaryButton, justifySelf: "start" }} onClick={analyseDraft} disabled={loading || !text?.trim()}>
        {loading ? "Analysing your text..." : "Analyse my combined draft"}
      </button>

      {error ? <div style={{ color: "#b91c1c", fontWeight: 700 }}>{error}</div> : null}
      {feedback ? (
        <div style={{ border: "1px solid #bbf7d0", borderRadius: 14, padding: 14, background: "#f0fdf4", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
          <strong style={{ display: "block", marginBottom: 6 }}>Your level-based analysis</strong>
          {feedback}
        </div>
      ) : null}
    </div>
  );
}

function GuidedQuestionWritingBuilder({ config, storageKey, cloudField }) {
  const { user, studentProfile } = useAuth();
  const userId = user?.uid || "";
  const studentCode = studentProfile?.studentCode || studentProfile?.studentcode || userId;
  const hasCloudOwner = Boolean(studentCode || userId);
  const [state, setState] = useState(() => {
    try {
      return {
        ...makeEmptyQuestionState(),
        ...JSON.parse(localStorage.getItem(storageKey) || "{}"),
      };
    } catch (error) {
      return makeEmptyQuestionState();
    }
  });
  const [copyMessage, setCopyMessage] = useState("");
  const [cloudLoaded, setCloudLoaded] = useState(false);
  const [cloudSaveStatus, setCloudSaveStatus] = useState("idle");

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state, storageKey]);

  useEffect(() => {
    let active = true;

    if (!hasCloudOwner) {
      setCloudLoaded(true);
      setCloudSaveStatus("device");
      return undefined;
    }

    setCloudLoaded(false);
    setCloudSaveStatus("loading");

    loadWritingProgress({ userId, studentCode, mode: "course" })
      .then((saved) => {
        if (!active) return;
        const cloudDraft = saved?.[cloudField];
        if (cloudDraft && typeof cloudDraft === "object") {
          setState((current) => {
            const cloudTime = Date.parse(cloudDraft.updatedAt || "") || 0;
            const localTime = Date.parse(current.updatedAt || "") || 0;
            if (localTime > cloudTime) return current;
            return {
              ...makeEmptyQuestionState(),
              ...cloudDraft,
              answers: cloudDraft.answers && typeof cloudDraft.answers === "object" ? cloudDraft.answers : {},
            };
          });
        }
        setCloudSaveStatus("saved");
      })
      .catch((error) => {
        console.error("Failed to load guided writing", error);
        if (active) setCloudSaveStatus("error");
      })
      .finally(() => {
        if (active) setCloudLoaded(true);
      });

    return () => {
      active = false;
    };
  }, [cloudField, hasCloudOwner, studentCode, userId]);

  useEffect(() => {
    if (!cloudLoaded || !hasCloudOwner) return undefined;

    setCloudSaveStatus("saving");
    const timeout = window.setTimeout(async () => {
      const saved = await saveWritingProgress({
        userId,
        studentCode,
        mode: "course",
        data: { [cloudField]: state },
      });
      setCloudSaveStatus(saved ? "saved" : "error");
    }, 800);

    return () => window.clearTimeout(timeout);
  }, [cloudField, cloudLoaded, hasCloudOwner, state, studentCode, userId]);

  const questionStats = useMemo(
    () => config.questions.map((item) => {
      const words = countWords(state.answers?.[item.id]);
      return { ...item, words, complete: words >= item.minimumWords };
    }),
    [config.questions, state.answers],
  );

  const completedQuestions = questionStats.filter((item) => item.complete).length;
  const totalWords = questionStats.reduce((sum, item) => sum + item.words, 0);
  const allComplete = completedQuestions === questionStats.length;
  const combinedAnswers = questionStats
    .map((item) => String(state.answers?.[item.id] || "").trim())
    .filter(Boolean)
    .join("\n\n");

  const updateState = (updater) => {
    setState((previous) => {
      const next = typeof updater === "function" ? updater(previous) : { ...previous, ...updater };
      return { ...next, updatedAt: new Date().toISOString() };
    });
  };

  const updateAnswer = (id, value) => {
    updateState((previous) => ({
      ...previous,
      answers: { ...(previous.answers || {}), [id]: value },
    }));
  };

  const combineAnswers = () => {
    if (!allComplete) return;
    updateState((previous) => ({
      ...previous,
      finalEssay: combinedAnswers,
      view: "final",
    }));
  };

  const copyDraft = async () => {
    try {
      await navigator.clipboard.writeText(state.finalEssay || "");
      setCopyMessage("Combined draft copied.");
    } catch (error) {
      setCopyMessage("Copy failed. Select the text manually.");
    }
  };

  const saveLabel = !hasCloudOwner
    ? "Saved on this device"
    : cloudSaveStatus === "loading"
      ? "Loading saved work..."
      : cloudSaveStatus === "saving"
        ? "Saving to your Falowen writing progress..."
        : cloudSaveStatus === "error"
          ? "Cloud save failed — your device copy is still safe"
          : "Saved to your Falowen writing progress";

  return (
    <section
      style={{
        border: "1px solid #c7d2fe",
        borderRadius: 18,
        background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        padding: 16,
        display: "grid",
        gap: 16,
      }}
    >
      <div style={{ display: "grid", gap: 8 }}>
        <span style={{ width: "fit-content", padding: "6px 10px", borderRadius: 999, background: "#eef2ff", color: "#3730a3", fontSize: 12, fontWeight: 800 }}>
          Guided {config.level} Writing · Days 1–19
        </span>
        <h3 style={{ margin: 0 }}>Answer five questions and build the text</h3>
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.65 }}>
          Work on one focused part at a time. You are learning how to develop a strong text; a separate conclusion and full-essay demand begin from Day 20.
        </p>
        <small style={{ color: cloudSaveStatus === "error" ? "#b91c1c" : "#166534", fontWeight: 800 }}>{saveLabel}</small>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 8 }}>
        <div style={{ padding: 12, borderRadius: 12, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
          <small style={{ color: "#475569", fontWeight: 700 }}>Questions completed</small>
          <div style={{ fontSize: 20, fontWeight: 900 }}>{completedQuestions}/{questionStats.length}</div>
        </div>
        <div style={{ padding: 12, borderRadius: 12, background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
          <small style={{ color: "#475569", fontWeight: 700 }}>Words written</small>
          <div style={{ fontSize: 20, fontWeight: 900 }}>{totalWords}/{config.targetWords}</div>
        </div>
      </div>

      {state.view !== "final" ? (
        <>
          <div style={{ display: "grid", gap: 14 }}>
            {questionStats.map((item, index) => {
              const tip = config.level === "C1"
                ? getC1OpinionWritingTip({ id: item.id, level: config.level, taskType: config.taskType })
                : "";
              return (
                <article
                  key={item.id}
                  style={{
                    border: `1px solid ${item.complete ? "#86efac" : "#e2e8f0"}`,
                    borderRadius: 16,
                    padding: 14,
                    background: item.complete ? "#f0fdf4" : "#ffffff",
                    display: "grid",
                    gap: 10,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                    <strong>Question {index + 1} of {questionStats.length} · {item.section}</strong>
                    <span style={{ padding: "5px 9px", borderRadius: 999, background: item.complete ? "#dcfce7" : "#fef3c7", color: item.complete ? "#166534" : "#92400e", fontSize: 12, fontWeight: 800 }}>
                      {item.words}/{item.minimumWords} words {item.complete ? "✓" : ""}
                    </span>
                  </div>
                  <h4 style={{ margin: 0, fontSize: "1.02rem", lineHeight: 1.5 }}>{item.question}</h4>
                  <p style={{ margin: 0, color: "#64748b", lineHeight: 1.6 }}>{item.help}</p>
                  {tip ? (
                    <div style={{ borderLeft: "4px solid #818cf8", padding: "10px 12px", background: "#f8fafc", borderRadius: 8, lineHeight: 1.65 }}>
                      <strong style={{ display: "block", marginBottom: 4 }}>Tip:</strong>
                      <p style={{ margin: 0 }}>{tip}</p>
                    </div>
                  ) : null}
                  <textarea
                    value={state.answers?.[item.id] || ""}
                    onChange={(event) => updateAnswer(item.id, event.target.value)}
                    placeholder={`Write at least ${item.minimumWords} words...`}
                    style={{ minHeight: 130, width: "100%", boxSizing: "border-box", border: "1px solid #cbd5e1", borderRadius: 12, padding: 12, resize: "vertical", font: "inherit", lineHeight: 1.6 }}
                  />
                  {!item.complete ? (
                    <small style={{ color: "#92400e", fontWeight: 700 }}>Add {Math.max(item.minimumWords - item.words, 0)} more words to complete this part.</small>
                  ) : (
                    <small style={{ color: "#166534", fontWeight: 800 }}>Part completed.</small>
                  )}
                </article>
              );
            })}
          </div>

          <button type="button" onClick={combineAnswers} disabled={!allComplete} style={{ ...primaryButton, opacity: allComplete ? 1 : 0.5, cursor: allComplete ? "pointer" : "not-allowed" }}>
            Combine my five answers
          </button>
          {!allComplete ? (
            <p style={{ margin: 0, color: "#64748b", textAlign: "center" }}>
              Complete the minimum word requirement for all five questions to unlock the combined draft.
            </p>
          ) : null}
        </>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ padding: 12, borderRadius: 12, background: "#f0fdf4", border: "1px solid #86efac", lineHeight: 1.6 }}>
            <strong>Your five-part draft is ready.</strong> It does not need a separate conclusion yet. Read the transitions, then use the analysis box below.
          </div>
          <textarea
            value={state.finalEssay || ""}
            onChange={(event) => updateState((previous) => ({ ...previous, finalEssay: event.target.value }))}
            style={{ minHeight: 320, width: "100%", boxSizing: "border-box", border: "1px solid #94a3b8", borderRadius: 12, padding: 14, resize: "vertical", font: "inherit", lineHeight: 1.7 }}
          />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ padding: "6px 10px", borderRadius: 999, background: "#eef2ff", color: "#3730a3", fontWeight: 800 }}>Words: {countWords(state.finalEssay)}</span>
            <span style={{ padding: "6px 10px", borderRadius: 999, background: "#fef3c7", color: "#92400e", fontWeight: 800 }}>Guided target: about {config.targetWords}</span>
          </div>
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12, background: "#fff" }}>
            <strong>Five-part checklist</strong>
            <ul style={{ marginBottom: 0, paddingLeft: 20, lineHeight: 1.7 }}>{config.checklist.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" style={secondaryButton} onClick={() => updateState((previous) => ({ ...previous, view: "questions" }))}>Back to questions</button>
            <button type="button" style={secondaryButton} onClick={combineAnswers}>Refresh from answers</button>
            <button type="button" style={primaryButton} onClick={copyDraft} disabled={!state.finalEssay}>Copy combined draft</button>
          </div>
          {copyMessage ? <small style={{ color: "#475569", fontWeight: 700 }}>{copyMessage}</small> : null}
          <GuidedDraftAnalysisPanel text={state.finalEssay} level={config.level} />
        </div>
      )}
    </section>
  );
}

export function EmbeddedSpeechPracticePanel() {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, overflow: "hidden", background: "#fff" }}>
      <SpeakingPage mode="course" />
    </div>
  );
}

export function EmbeddedWritingPracticePanel() {
  const hostRef = useRef(null);
  const [portalTarget, setPortalTarget] = useState(null);
  const routeMeta = getCourseLessonRouteMeta();
  const writingPhase = getAdvancedWritingPhase(routeMeta.level, routeMeta.day);
  const isGuidedPhase = writingPhase === "guided";
  const isFullEssayPhase = writingPhase === "full-essay";
  const guidedConfig = useMemo(() => {
    if (routeMeta.level === "C1" && routeMeta.day === 2) return c1Day2QuestionWritingBuilder;
    return getGenericGuidedWritingConfig(routeMeta.level, routeMeta.day);
  }, [routeMeta.day, routeMeta.level]);
  const storageKey = `falowen:${routeMeta.level.toLowerCase()}:day${routeMeta.day}:guided-writing-builder`;
  const cloudField = routeMeta.level === "C1" && routeMeta.day === 2
    ? "c1Day2GuidedWriting"
    : `${routeMeta.level.toLowerCase()}Day${routeMeta.day}GuidedWriting`;

  useEffect(() => {
    if (!hostRef.current) return undefined;

    const writingSection = hostRef.current.closest("section");
    const aiCoachBox = hostRef.current.parentElement;
    if (!writingSection || !aiCoachBox) return undefined;

    const children = Array.from(writingSection.children);
    const oldBuilder = children.find((child) =>
      Array.from(child.querySelectorAll?.("span") || []).some((span) => span.textContent?.trim() === "Writing Builder"),
    );
    const taskCard = children.find((child) =>
      Array.from(child.querySelectorAll?.("strong") || []).some((strong) => strong.textContent?.trim() === "Schreiben Aufgabe"),
    );

    const previousBuilderDisplay = oldBuilder?.style?.display || "";
    const previousTaskDisplay = taskCard?.style?.display || "";
    const previousAiDisplay = aiCoachBox.style.display || "";

    if (isGuidedPhase || isFullEssayPhase) {
      if (oldBuilder) oldBuilder.style.display = "none";
    }

    let mount = null;
    if (isGuidedPhase) {
      if (taskCard) taskCard.style.display = "none";
      aiCoachBox.style.display = "none";
      mount = document.createElement("div");
      mount.setAttribute("data-guided-writing-builder", "true");
      writingSection.insertBefore(mount, aiCoachBox);
      setPortalTarget(mount);
    }

    return () => {
      if (oldBuilder) oldBuilder.style.display = previousBuilderDisplay;
      if (taskCard) taskCard.style.display = previousTaskDisplay;
      aiCoachBox.style.display = previousAiDisplay;
      mount?.remove();
      setPortalTarget(null);
    };
  }, [isFullEssayPhase, isGuidedPhase]);

  useEffect(() => {
    if (!hostRef.current || isGuidedPhase) return undefined;
    const host = hostRef.current;

    const hideIdeasGenerator = () => {
      const buttons = Array.from(host.querySelectorAll("button"));
      const ideasButton = buttons.find((button) => button.textContent?.trim() === "Ideas helper");
      if (ideasButton) ideasButton.style.display = "none";

      if (ideasButton?.getAttribute("aria-selected") === "true") {
        buttons.find((button) => button.textContent?.trim() === "Mark my letter")?.click();
      }
    };

    hideIdeasGenerator();
    const observer = new MutationObserver(hideIdeasGenerator);
    observer.observe(host, { childList: true, subtree: true, attributes: true });
    return () => observer.disconnect();
  }, [isGuidedPhase]);

  return (
    <>
      {portalTarget ? createPortal(
        <GuidedQuestionWritingBuilder config={guidedConfig} storageKey={storageKey} cloudField={cloudField} />,
        portalTarget,
      ) : null}
      <div ref={hostRef} className="embedded-writing-compact" style={{ border: "1px solid #e5e7eb", borderRadius: 16, overflow: "hidden", background: "#fff" }}>
        {!isGuidedPhase ? (
          <>
            <style>{`
              .embedded-writing-compact > section:first-of-type > h2,
              .embedded-writing-compact > section:first-of-type > p,
              .embedded-writing-compact > section:first-of-type > div:first-of-type,
              .embedded-writing-compact > section:first-of-type > div:nth-of-type(3) {
                display: none;
              }

              .embedded-writing-compact > section:first-of-type {
                padding-bottom: 12px;
              }

              .embedded-writing-compact > section:first-of-type > div:nth-of-type(2) {
                margin-top: 0;
              }

              .embedded-writing-compact > section:nth-of-type(2) > p:first-of-type,
              .embedded-writing-compact > section:nth-of-type(2) > div:first-of-type {
                display: none;
              }
            `}</style>
            <WritingPage mode="course" initialTab="mark" />
          </>
        ) : null}
      </div>
    </>
  );
}

const EmbeddedPracticePanels = {
  EmbeddedSpeechPracticePanel,
  EmbeddedWritingPracticePanel,
};

export default EmbeddedPracticePanels;
