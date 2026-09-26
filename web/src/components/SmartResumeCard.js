import React from "react";
import { useNavigate } from "react-router-dom";
import { useLatestLessonResume } from "../hooks/useLessonResumeSync";
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
  const { loading, resume, error } = useLatestLessonResume();

  if (loading || error || !resume || resume.completed === true || !resume.lastRoute) return null;

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
    navigate(resume.lastRoute);
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
            Continue where you stopped
          </p>
          <h2 style={{ margin: 0, fontSize: 20 }}>
            {level}{day ? ` · Day ${day}` : ""} · {sectionLabel}
          </h2>
          {resume.title ? (
            <p style={{ ...styles.helperText, margin: 0, color: "#475569" }}>{resume.title}</p>
          ) : null}
        </div>
        <PillBadge tone="info">Synced across devices</PillBadge>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", color: "#475569", fontSize: 13 }}>
        {sectionTotal > 0 ? (
          <span>{completedSections}/{sectionTotal} tracked sections complete</span>
        ) : null}
        {radioLabel ? <span>{sectionTotal > 0 ? "· " : ""}{radioLabel}</span> : null}
      </div>

      <PrimaryActionBar align="start">
        <button type="button" style={styles.primaryButton} onClick={openResume}>
          Continue {sectionLabel}
        </button>
      </PrimaryActionBar>
    </section>
  );
};

export default SmartResumeCard;
