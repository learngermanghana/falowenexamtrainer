import React from "react";
import { styles } from "../styles";

const Highlight = ({ title, description }) => (
  <div
    style={{
      ...styles.card,
      border: "1px solid #e0e7ff",
      background: "linear-gradient(180deg, #ffffff, #f8fafc)",
      height: "100%",
    }}
  >
    <h3 style={{ ...styles.sectionTitle, marginBottom: 8 }}>{title}</h3>
    <p style={{ ...styles.helperText, marginBottom: 0 }}>{description}</p>
  </div>
);

const LandingPage = ({ onSignUp, onLogin }) => {
  const highlights = [
    {
      title: "About us",
      description:
        "We are a small team of language coaches and technologists helping you prepare smarter for every exam.",
    },
    {
      title: "Our mission",
      description:
        "Personalized learning paths, exam-style practice, and continuous feedback to keep you confident and ready.",
    },
    {
      title: "What to expect",
      description:
        "Guided speaking and writing sessions, vocabulary drills, and a progress cockpit with clear next steps.",
    },
  ];

  const pillars = [
    {
      title: "Focus on outcomes",
      copy: "Clear goals, adaptive tasks, and realistic mock tests accelerate your progress.",
    },
    {
      title: "Coach in the loop",
      copy: "Real-time feedback, personalized tips, and reminders keep you in the flow.",
    },
    {
      title: "Tech + teaching",
      copy: "We combine modern language tools with proven methods for sustainable results.",
    },
  ];

  const steps = [
    "Run the Level Check to unlock your profile.",
    "Follow the Daily Plan and complete speaking/writing sessions.",
    "Get a weekly review with clear next steps and streak support.",
  ];

  return (
    <div
      style={{
        ...styles.container,
        background: "radial-gradient(circle at 10% 20%, #eef2ff 0, #f3f4f6 35%, #f3f4f6 100%)",
      }}
    >
      <div
        style={{
          display: "grid",
          gap: 16,
          margin: "0 auto",
          maxWidth: 1080,
        }}
      >
        <section
          style={{
            ...styles.card,
            background: "linear-gradient(135deg, #1d4ed8, #1e3a8a)",
            color: "#ffffff",
            border: "1px solid #1d4ed8",
            boxShadow: "0 18px 36px rgba(37, 99, 235, 0.28)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ ...styles.badge, alignSelf: "flex-start", background: "#c7d2fe", color: "#1e3a8a" }}>
              Falowen Exam Coach
            </p>
            <h1 style={{ ...styles.title, fontSize: 32, color: "#ffffff", margin: 0 }}>
              Your guided path to confident exam results.
            </h1>
            <p style={{ ...styles.helperText, color: "#e0e7ff", marginBottom: 4 }}>
              Everyday-friendly training, realistic simulations, and a coach that guides you step by step.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button style={styles.primaryButton} onClick={onSignUp}>
                Sign up for free
              </button>
              <button style={styles.secondaryButton} onClick={onLogin}>
                I already have an account
              </button>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 6 }}>
              <span style={styles.badge}>A1–B2 Speaking & Writing</span>
              <span style={styles.badge}>Adaptive Daily Plan</span>
              <span style={styles.badge}>Push reminders</span>
            </div>
          </div>
        </section>

        <section style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          {highlights.map((item) => (
            <Highlight key={item.title} title={item.title} description={item.description} />
          ))}
        </section>

        <section style={{ ...styles.card, background: "#111827", color: "#e5e7eb" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div style={{ flex: 2, minWidth: 260 }}>
              <h2 style={{ ...styles.sectionTitle, color: "#fff" }}>Mission & approach</h2>
              <p style={{ ...styles.helperText, color: "#d1d5db" }}>
                Prep should be measurable, motivating, and manageable. That is why we pair short daily sessions, clear weekly
                goals, and personal feedback on every exercise.
              </p>
            </div>
            <div style={{ display: "grid", gap: 10, flex: 1, minWidth: 240 }}>
              {pillars.map((pillar) => (
                <div key={pillar.title} style={{ ...styles.uploadCard, background: "#0f172a", borderColor: "#1f2937" }}>
                  <h3 style={{ ...styles.sectionTitle, color: "#fff", marginBottom: 6 }}>{pillar.title}</h3>
                  <p style={{ ...styles.helperText, color: "#d1d5db", margin: 0 }}>{pillar.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ ...styles.card }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <h2 style={styles.sectionTitle}>How it works</h2>
              <p style={styles.helperText}>Get ready in three simple steps:</p>
              <ul style={{ ...styles.checklist, margin: 0 }}>
                {steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </div>
            <div style={{ flex: 1, minWidth: 260, display: "grid", gap: 10 }}>
              <div style={{ ...styles.resultCard, marginTop: 0 }}>
                <h3 style={styles.sectionTitle}>Why start now?</h3>
                <p style={styles.helperText}>
                  Get an early lead, receive a clear plan, and track your progress with every login.
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button style={{ ...styles.primaryButton, padding: "10px 14px" }} onClick={onSignUp}>
                    Create account
                  </button>
                  <button style={{ ...styles.secondaryButton, padding: "10px 14px" }} onClick={onLogin}>
                    Go to login
                  </button>
                </div>
              </div>
              <div style={{ ...styles.uploadCard }}>
                <h4 style={{ ...styles.sectionTitle, marginBottom: 8 }}>Community facts</h4>
                <ul style={{ ...styles.checklist, margin: 0 }}>
                  <li>98% keep their streaks in the first 14 days.</li>
                  <li>Weekly review with individual writing and speaking tips.</li>
                  <li>Push reminders and email summaries included.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
