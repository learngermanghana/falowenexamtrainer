import React from "react";
import { styles } from "../styles";

const QuickNavItem = ({ title, description, actionLabel, onAction, tone = "primary" }) => {
  const buttonStyle = tone === "secondary" ? styles.secondaryButton : styles.primaryButton;

  return (
    <div
      style={{
        ...styles.uploadCard,
        display: "grid",
        gap: 6,
        background: "#ffffff",
        borderColor: "#e5e7eb",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
        <div style={{ display: "grid", gap: 4 }}>
          <h3 style={{ ...styles.sectionTitle, margin: 0, fontSize: 16 }}>{title}</h3>
          <p style={{ ...styles.helperText, margin: 0 }}>{description}</p>
        </div>
        <span style={{ ...styles.badge, background: "#eef2ff", color: "#312e81" }}>Shortcut</span>
      </div>
      <div>
        <button style={buttonStyle} onClick={onAction}>
          {actionLabel}
        </button>
      </div>
    </div>
  );
};

const NavigationGuide = ({ onOpenCourse, onSubmitAssignment, onAskAI, onOpenExams }) => {
  return (
    <section style={{ ...styles.card, display: "grid", gap: 12 }}>
      <div>
        <p style={{ ...styles.badge, background: "#e0f2fe", color: "#075985", marginBottom: 6 }}>
          Navigation help
        </p>
        <h2 style={{ ...styles.sectionTitle, margin: "4px 0" }}>Find your way in two clicks</h2>
        <p style={{ ...styles.helperText, margin: 0 }}>
          Use these quick shortcuts any time you feel lost. They jump straight to the most common areas students ask about: the
          course book, assignment uploads, AI help, and exam practice.
        </p>
      </div>

      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        <QuickNavItem
          title="Go to your course book"
          description="Campus → Course. Read lessons and download materials for your level."
          actionLabel="Open course book"
          onAction={onOpenCourse}
        />
        <QuickNavItem
          title="Submit assignments"
          description="Campus → Submit Assignment. Upload homework and view what you sent."
          actionLabel="Upload homework"
          onAction={onSubmitAssignment}
          tone="secondary"
        />
        <QuickNavItem
          title="Ask Falowen A.I for help"
          description="Campus → Ask Grammar Question. Get instant answers before class."
          actionLabel="Start a question"
          onAction={onAskAI}
        />
        <QuickNavItem
          title="Practice in Exams Room"
          description="Exams Room → Speaking. Swap to Schreiben trainer or resources from there."
          actionLabel="Enter Exams Room"
          onAction={onOpenExams}
          tone="secondary"
        />
      </div>
    </section>
  );
};

export default NavigationGuide;
