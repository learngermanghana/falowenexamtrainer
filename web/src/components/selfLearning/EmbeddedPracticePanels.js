import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import SpeakingPage from "../SpeakingPage";
import WritingPage from "../WritingPage";
import { useAuth } from "../../context/AuthContext";
import { loadWritingProgress, saveWritingProgress } from "../../services/writingProgressService";
import c1Day2QuestionWritingBuilder from "../../data/writingQuestionBuilders/c1Day2KulturUndIdentitaet";

const countWords = (text = "") => String(text || "").trim().split(/\s+/).filter(Boolean).length;

const isC1Day2Route = () => {
  if (typeof window === "undefined") return false;
  const path = window.location.pathname.toLowerCase();
  return /\/campus\/course\/lesson\/c1\/2(?:\/|$)/.test(path) || path.includes("c1-day-2");
};

const makeEmptyQuestionState = () => ({
  answers: {},
  finalEssay: "",
  view: "questions",
  updatedAt: "",
});

function C1Day2QuestionEssayBuilder() {
  const config = c1Day2QuestionWritingBuilder;
  const storageKey = "falowen:c1:day2:question-writing-builder";
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
  }, [state]);

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
        const cloudDraft = saved?.c1Day2GuidedWriting;
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
        console.error("Failed to load C1 Day 2 guided writing", error);
        if (active) setCloudSaveStatus("error");
      })
      .finally(() => {
        if (active) setCloudLoaded(true);
      });

    return () => {
      active = false;
    };
  }, [hasCloudOwner, studentCode, userId]);

  useEffect(() => {
    if (!cloudLoaded || !hasCloudOwner) return undefined;

    setCloudSaveStatus("saving");
    const timeout = window.setTimeout(async () => {
      const saved = await saveWritingProgress({
        userId,
        studentCode,
        mode: "course",
        data: {
          c1Day2GuidedWriting: state,
        },
      });
      setCloudSaveStatus(saved ? "saved" : "error");
    }, 800);

    return () => window.clearTimeout(timeout);
  }, [cloudLoaded, hasCloudOwner, state, studentCode, userId]);

  const questionStats = useMemo(
    () => config.questions.map((item) => {
      const words = countWords(state.answers?.[item.id]);
      return { ...item, words, complete: words >= item.minimumWords };
    }),
    [config.questions, state.answers]
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

  const copyEssay = async () => {
    try {
      await navigator.clipboard.writeText(state.finalEssay || "");
      setCopyMessage("Essay copied.");
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
          Guided C1 Writing
        </span>
        <h3 style={{ margin: 0 }}>Answer 6 questions and build your essay</h3>
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.65 }}>
          Answer one focused question at a time. Each answer has a minimum word requirement. When all six are complete, Falowen will combine them into your essay draft.
        </p>
        <small style={{ color: cloudSaveStatus === "error" ? "#b91c1c" : "#166534", fontWeight: 800 }}>
          {saveLabel}
        </small>
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
            {questionStats.map((item, index) => (
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
                <div style={{ borderLeft: "4px solid #818cf8", padding: "9px 12px", background: "#f8fafc", borderRadius: 8, lineHeight: 1.55 }}>
                  <strong>Sentence starter:</strong> {item.starter}
                </div>
                <textarea
                  value={state.answers?.[item.id] || ""}
                  onChange={(event) => updateAnswer(item.id, event.target.value)}
                  placeholder={`Write at least ${item.minimumWords} words...`}
                  style={{ minHeight: 130, width: "100%", boxSizing: "border-box", border: "1px solid #cbd5e1", borderRadius: 12, padding: 12, resize: "vertical", font: "inherit", lineHeight: 1.6 }}
                />
                {!item.complete ? (
                  <small style={{ color: "#92400e", fontWeight: 700 }}>
                    Add {Math.max(item.minimumWords - item.words, 0)} more words to complete this section.
                  </small>
                ) : (
                  <small style={{ color: "#166534", fontWeight: 800 }}>Section completed.</small>
                )}
              </article>
            ))}
          </div>

          <button
            type="button"
            onClick={combineAnswers}
            disabled={!allComplete}
            style={{ ...primaryButton, opacity: allComplete ? 1 : 0.5, cursor: allComplete ? "pointer" : "not-allowed" }}
          >
            Combine my answers into an essay
          </button>
          {!allComplete ? (
            <p style={{ margin: 0, color: "#64748b", textAlign: "center" }}>
              Complete the minimum word requirement for all six questions to unlock the essay.
            </p>
          ) : null}
        </>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ padding: 12, borderRadius: 12, background: "#f0fdf4", border: "1px solid #86efac", lineHeight: 1.6 }}>
            <strong>Your essay draft is ready.</strong> Review the transitions, grammar and paragraph flow before submitting it for marking.
          </div>
          <textarea
            value={state.finalEssay || ""}
            onChange={(event) => updateState((previous) => ({ ...previous, finalEssay: event.target.value }))}
            style={{ minHeight: 340, width: "100%", boxSizing: "border-box", border: "1px solid #94a3b8", borderRadius: 12, padding: 14, resize: "vertical", font: "inherit", lineHeight: 1.7 }}
          />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ padding: "6px 10px", borderRadius: 999, background: "#eef2ff", color: "#3730a3", fontWeight: 800 }}>
              Words: {countWords(state.finalEssay)}
            </span>
            <span style={{ padding: "6px 10px", borderRadius: 999, background: "#fef3c7", color: "#92400e", fontWeight: 800 }}>
              Target: about {config.targetWords}
            </span>
          </div>
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12, background: "#fff" }}>
            <strong>Final checklist</strong>
            <ul style={{ marginBottom: 0, paddingLeft: 20, lineHeight: 1.7 }}>
              {config.checklist.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" style={secondaryButton} onClick={() => updateState((previous) => ({ ...previous, view: "questions" }))}>
              Back to questions
            </button>
            <button type="button" style={secondaryButton} onClick={combineAnswers}>
              Refresh from answers
            </button>
            <button type="button" style={primaryButton} onClick={copyEssay} disabled={!state.finalEssay}>
              Copy final essay
            </button>
          </div>
          {copyMessage ? <small style={{ color: "#475569", fontWeight: 700 }}>{copyMessage}</small> : null}
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
  const showQuestionBuilder = isC1Day2Route();

  useEffect(() => {
    if (!showQuestionBuilder || !hostRef.current) return undefined;

    const writingSection = hostRef.current.closest("section");
    const aiCoachBox = hostRef.current.parentElement;
    if (!writingSection || !aiCoachBox) return undefined;

    const mount = document.createElement("div");
    mount.setAttribute("data-c1-day2-question-builder", "true");
    writingSection.insertBefore(mount, aiCoachBox);

    const oldBuilder = Array.from(writingSection.children).find((child) =>
      child !== mount && Array.from(child.querySelectorAll?.("span") || []).some((span) => span.textContent?.trim() === "Writing Builder")
    );
    const previousDisplay = oldBuilder?.style?.display || "";
    if (oldBuilder) oldBuilder.style.display = "none";

    setPortalTarget(mount);

    return () => {
      if (oldBuilder) oldBuilder.style.display = previousDisplay;
      mount.remove();
      setPortalTarget(null);
    };
  }, [showQuestionBuilder]);

  return (
    <>
      {portalTarget ? createPortal(<C1Day2QuestionEssayBuilder />, portalTarget) : null}
      <div ref={hostRef} className="embedded-writing-compact" style={{ border: "1px solid #e5e7eb", borderRadius: 16, overflow: "hidden", background: "#fff" }}>
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
      </div>
    </>
  );
}

const EmbeddedPracticePanels = {
  EmbeddedSpeechPracticePanel,
  EmbeddedWritingPracticePanel,
};

export default EmbeddedPracticePanels;
