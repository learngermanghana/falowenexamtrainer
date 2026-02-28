import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import { useExam } from "../context/ExamContext";

const LAST_SECTION_STORAGE_KEY = "falowen_exam_last_section";
const EXAMS_OVERVIEW_HERO_IMAGE =
  "https://images.pexels.com/photos/4145153/pexels-photo-4145153.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=2000";
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
  const { level } = useExam();
  const [lastSection, setLastSection] = useState("speaking");

  useEffect(() => {
    try {
      const storedSection = localStorage.getItem(LAST_SECTION_STORAGE_KEY);
      if (storedSection) {
        setLastSection(storedSection);
      }
    } catch (error) {
      console.warn("Failed to load exam overview storage", error);
    }
  }, []);

  const resumeSection = lastSection || "speaking";

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section
        style={{
          ...styles.card,
          backgroundImage: `linear-gradient(130deg, rgba(17, 24, 39, 0.74), rgba(30, 64, 175, 0.58)), url(${EXAMS_OVERVIEW_HERO_IMAGE})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#f8fafc",
          border: "none",
        }}
      >
        <p style={{ ...styles.helperText, margin: 0 }}>Exams Room overview</p>
        <h2 style={{ ...styles.sectionTitle, margin: "6px 0" }}>Start here for level {level}</h2>
        <p style={{ ...styles.helperText, margin: 0, color: "#e2e8f0" }}>
          Get a quick snapshot of your activity, then jump into the tab you need most today.
        </p>
        <p style={{ ...styles.helperText, margin: 0, color: "#cbd5e1", fontSize: 12 }}>
          Photo by{" "}
          <a
            href="https://www.pexels.com/photo/woman-in-white-long-sleeve-shirt-writing-on-brown-wooden-table-4145153/"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#bfdbfe" }}
          >
            Julia M Cameron / Pexels
          </a>
        </p>
        <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            type="button"
            style={styles.primaryButton}
            onClick={() => navigate(`/exams/${resumeSection}`)}
          >
            Resume last session
          </button>
          <button
            type="button"
            style={styles.secondaryButton}
            onClick={() => navigate("/exams/speaking")}
          >
            Start speaking warm-up
          </button>
        </div>
      </section>

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
