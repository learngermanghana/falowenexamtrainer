import React from "react";
import { styles } from "../styles";
import SpeakingPage from "./SpeakingPage";

const FALOWEN_SPEAKING_URL = "https://www.falowen.app/exams/speaking";
const AI_VIDEO_ID = "gprnEZtMUPM";

const sectionStyle = {
  ...styles.card,
  display: "grid",
  gap: 18,
  border: "1px solid #c7d2fe",
  background: "linear-gradient(180deg, #f8fbff 0%, #ffffff 100%)",
};

const softPanel = {
  border: "1px solid #dbeafe",
  borderRadius: 14,
  padding: 14,
  background: "#eff6ff",
  color: "#1e3a8a",
  lineHeight: 1.7,
};

const practiceSteps = [
  {
    number: "1",
    title: "Watch the AI lesson",
    text: "See how Teil 1, Teil 2 and Teil 3 work before you start.",
  },
  {
    number: "2",
    title: "Choose an exam Teil",
    text: "Use Teil 1 for introductions, Teil 2 for questions and Teil 3 for requests.",
  },
  {
    number: "3",
    title: "Answer by voice or text",
    text: "Record your answer or type it, then read the Falowen feedback.",
  },
  {
    number: "4",
    title: "Repeat with a new prompt",
    text: "Practise several prompts until the sentence patterns feel natural.",
  },
];

const A1ExamSpeakingPracticePanel = ({ showVideo = true }) => (
  <section
    id="embedded-a1-speaking-practice"
    data-a1-speaking-practice="embedded"
    style={sectionStyle}
  >
    <div style={{ display: "grid", gap: 8 }}>
      <p
        style={{
          ...styles.helperText,
          margin: 0,
          color: "#4f46e5",
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        A1 Day 19 · Chapter 5.9 · Goethe Sprechen
      </p>
      <h2 style={{ margin: 0, fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
        Learn the exam, then practise it directly on this page
      </h2>
      <p style={{ margin: 0, lineHeight: 1.75, color: "#334155" }}>
        You do not need to leave the course book to practise. Watch the AI lesson,
        choose a real Goethe A1 speaking prompt below, and send your answer for
        feedback. The full Falowen Exams Room is still available whenever you want
        more exam practice.
      </p>
    </div>

    {showVideo ? (
      <div style={{ display: "grid", gap: 10 }} data-a1-speaking-ai-video="embedded">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <div>
            <p style={{ margin: 0, color: "#4f46e5", fontWeight: 800 }}>AI VIDEO LESSON</p>
            <h3 style={{ margin: "4px 0 0" }}>Goethe A1 Speaking Practice</h3>
          </div>
          <a
            href={`https://youtu.be/${AI_VIDEO_ID}`}
            target="_blank"
            rel="noreferrer"
            style={{ ...styles.secondaryButton, textDecoration: "none", width: "fit-content" }}
          >
            Open video on YouTube
          </a>
        </div>

        <div
          style={{
            position: "relative",
            width: "100%",
            paddingTop: "56.25%",
            borderRadius: 16,
            overflow: "hidden",
            background: "#0f172a",
            boxShadow: "0 12px 28px rgba(15, 23, 42, 0.16)",
          }}
        >
          <iframe
            src={`https://www.youtube.com/embed/${AI_VIDEO_ID}`}
            title="Goethe A1 Speaking Practice AI video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
          />
        </div>
      </div>
    ) : null}

    <div style={softPanel}>
      <strong>Use this simple practice order</strong>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: 10,
          marginTop: 12,
        }}
      >
        {practiceSteps.map((step) => (
          <div
            key={step.number}
            style={{
              border: "1px solid #bfdbfe",
              borderRadius: 12,
              padding: 12,
              background: "#ffffff",
              display: "grid",
              gridTemplateColumns: "34px 1fr",
              gap: 10,
              alignItems: "start",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                background: "#4f46e5",
                color: "#ffffff",
                fontWeight: 800,
              }}
            >
              {step.number}
            </span>
            <div style={{ display: "grid", gap: 4 }}>
              <strong>{step.title}</strong>
              <span style={{ color: "#475569", fontSize: 14 }}>{step.text}</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div style={{ display: "grid", gap: 8 }}>
      <p style={{ margin: 0, color: "#4f46e5", fontWeight: 800 }}>PRACTISE HERE</p>
      <h3 style={{ margin: 0 }}>Falowen Goethe A1 Speaking Exam Coach</h3>
      <p style={{ margin: 0, lineHeight: 1.7, color: "#475569" }}>
        Keep the level on <strong>A1</strong>. Choose a Teil and a question, then use
        voice recording or text. You can repeat the task with a new prompt after you
        read the feedback.
      </p>
    </div>

    <div
      className="a1-exam-speaking-only"
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        overflow: "hidden",
        background: "#ffffff",
      }}
    >
      <style>{`
        .a1-exam-speaking-only > div {
          padding-left: 0 !important;
          padding-right: 0 !important;
        }
        .a1-exam-speaking-only [role="tablist"] [role="tab"]:not(:first-child),
        .a1-exam-speaking-only > div > div > div:nth-of-type(2) > button:nth-of-type(2) {
          display: none !important;
        }
      `}</style>
      <SpeakingPage mode="exam" />
    </div>

    <div
      style={{
        border: "1px solid #c4b5fd",
        borderRadius: 14,
        padding: 16,
        background: "#f5f3ff",
        display: "grid",
        gap: 10,
      }}
    >
      <strong style={{ color: "#5b21b6" }}>More practice is always available</strong>
      <p style={{ margin: 0, lineHeight: 1.7, color: "#4c1d95" }}>
        This lesson includes the exam coach so you can practise without leaving the
        page. You can still open the full Exams Room at any time to continue with more
        speaking prompts and other exam activities.
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <a
          href="/exams/speaking"
          style={{ ...styles.primaryButton, textDecoration: "none", width: "fit-content" }}
        >
          Open full Speaking Exams Room
        </a>
        <a
          href={FALOWEN_SPEAKING_URL}
          target="_blank"
          rel="noreferrer"
          style={{ ...styles.secondaryButton, textDecoration: "none", width: "fit-content" }}
        >
          Open Exams Room in new tab
        </a>
      </div>
    </div>
  </section>
);

export default A1ExamSpeakingPracticePanel;
