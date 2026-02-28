import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const EXAM_TABS_OVERVIEW = [
  {
    key: "lesen",
    title: "Lesen",
    description: "Reading practice with exam-style texts and comprehension checks.",
  },
  {
    key: "speaking",
    title: "Speaking",
    description: "Oral warm-ups and speaking tasks to build confidence for exam day.",
  },
  {
    key: "writing",
    title: "Writing",
    description: "Draft letters, get AI corrections, and submit work for tutor review.",
  },
  {
    key: "vocab",
    title: "Vocab",
    description: "Quick word practice to strengthen common exam vocabulary.",
  },
  {
    key: "horen",
    title: "Hören",
    description: "Listening drills to improve understanding of spoken German.",
  },
  {
    key: "resources",
    title: "Resources",
    description: "Useful exam materials, notes, and support links in one place.",
  },
  {
    key: "study",
    title: "Study",
    description: "Track your study plan and prepare consistently through the week.",
  },
  {
    key: "file",
    title: "My file",
    description: "Review your saved exam items and personal learning records.",
  },
];

const ExamsOverviewPage = () => {
  const navigate = useNavigate();


  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section style={styles.card}>
        <h3 style={styles.sectionTitle}>What each tab is for</h3>
        <p style={{ ...styles.helperText, marginTop: -4 }}>
          Use this map to choose the right tab quickly when you open the Exams room.
        </p>
        <div style={styles.gridTwo}>
          {EXAM_TABS_OVERVIEW.map((tab) => (
            <article
              key={tab.key}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: 12,
                background: "#f9fafb",
                display: "grid",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                <strong>{tab.title}</strong>
                <button
                  type="button"
                  style={styles.secondaryButton}
                  onClick={() => navigate(`/exams/${tab.key}`)}
                >
                  Open
                </button>
              </div>
              <p style={{ ...styles.helperText, margin: 0 }}>{tab.description}</p>
            </article>
          ))}
        </div>
      </section>

    </div>
  );
};

export default ExamsOverviewPage;
