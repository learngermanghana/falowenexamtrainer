import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLatestLessonResume } from "../hooks/useLessonResumeSync";
import { useAuth } from "../context/AuthContext";
import { fetchLearnerSupportState } from "../services/learnerSupportService";
import { triggerInteractionFeedback } from "../services/interactionFeedback";
import { styles } from "../styles";
import { PillBadge, PrimaryActionBar } from "./ui";

const VIEW_LABELS = {
  learn: "Learn",
  grammar: "Grammar",
  workbook: "Workbook",
  sprechen: "Sprechen",
  schreiben: "Schreiben",
  lesen: "Lesen",
  hoeren: "Hören",
  speak: "Speak",
  write: "Write",
  review: "Review",
  finish: "Finish",
  references: "Reference",
  submit: "Submit",
};

const completedSectionCount = (sections = {}) =>
  Object.values(sections || {}).filter((value) => value === true).length;

const visibleSectionCount = (sections = {}) =>
  Object.values(sections || {}).filter((value) => typeof value === "boolean").length;

const SmartResumeCard = () => {
  const navigate = useNavigate();
  const { idToken } = useAuth();
  const { loading, resume, error } = useLatestLessonResume();
  const [supportAction, setSupportAction] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!idToken) {
      setSupportAction(null);
      return undefined;
    }

    fetchLearnerSupportState({ idToken })
      .then((state) => {
        if (!cancelled) setSupportAction(state?.nextAction || null);
      })
      .catch(() => {
        if (!cancelled) setSupportAction(null);
      });

    return () => {
      cancelled = true;
    };
  }, [idToken, resume?.lastActivityAtClient, resume?.lastRoute]);

  const rawResumeAction = useMemo(() => {
    if (!resume || resume.completed === true || !resume.lastRoute) return null;
    return {
      type: "resume-learning",
      label: "",
      url: resume.lastRoute,
    };
  }, [resume]);

  const action = supportAction || rawResumeAction;
  const learningAction = ["resume-learning", "continue-course", "review-and-retry"].includes(action?.type)
    ? action
    : rawResumeAction;

  if (loading || error || !resume || !learningAction?.url) return null;

  const isExactResume = learningAction.type === "resume-learning";
  const level = String(resume.level || "").toUpperCase();
  const day = Number(resume.day || 0);
  const view = String(resume.activeView || "learn").toLowerCase();
  const sectionLabel = VIEW_LABELS[view] || view || "Lesson";
  const completedSections = completedSectionCount(resume.sections);
  const sectionTotal = visibleSectionCount(resume.sections);
  const radioLabel =
    resume.radioDone === true
      ? "Falowen Radio complete"
      : resume.radioDone === false
        ? "Falowen Radio not complete"
        : "";

  const openResume = () => {
    triggerInteractionFeedback({ sound: "open" });
    navigate(learningAction.url);
  };

  return (
    <section
      data-smart-resume-card
      style={{
        ...styles.card,
        display: "grid",
        gap: 12,
        border: "2px solid #2563eb",
        background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 72%)",
        boxShadow: "0 16px 34px rgba(37, 99, 235, 0.14)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "start" }}>
        <div style={{ display: "grid", gap: 5 }}>
          <p style={{ ...styles.helperText, margin: 0, color: "#1d4ed8", fontWeight: 800 }}>
            {isExactResume ? "Continue where you stopped" : "Your next step"}
          </p>
          <h2 style={{ margin: 0, fontSize: 20 }}>
            {isExactResume
              ? <>{level}{day ? ` · Day ${day}` : ""} · {sectionLabel}</>
              : learningAction.label || "Continue learning"}
          </h2>
          {isExactResume && resume.title ? (
            <p style={{ ...styles.helperText, margin: 0, color: "#475569" }}>{resume.title}</p>
          ) : null}
        </div>
        <PillBadge tone="info">Synced across devices</PillBadge>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", color: "#475569", fontSize: 13 }}>
        {isExactResume && sectionTotal > 0 ? (
          <span>{completedSections}/{sectionTotal} tracked sections complete</span>
        ) : null}
        {isExactResume && radioLabel ? <span>{sectionTotal > 0 ? "· " : ""}{radioLabel}</span> : null}
      </div>

      <PrimaryActionBar align="start">
        <button type="button" style={styles.primaryButton} onClick={openResume}>
          {isExactResume ? `Continue ${sectionLabel}` : "Continue"}
        </button>
      </PrimaryActionBar>
    </section>
  );
};

export default SmartResumeCard;
