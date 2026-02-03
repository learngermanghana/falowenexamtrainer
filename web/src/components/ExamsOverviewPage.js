import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { styles } from "../styles";
import { useExam } from "../context/ExamContext";
import { useAuth } from "../context/AuthContext";
import { loadWritingProgress } from "../services/writingProgressService";

const LAST_VISIT_STORAGE_KEY = "falowen_exam_last_visit";
const LAST_SECTION_STORAGE_KEY = "falowen_exam_last_section";
const STUDY_CALENDAR_DOWNLOAD_COUNT_KEY = "falowen_study_calendar_download_count";

const formatDate = (value, formatter) => {
  if (!value) return "Not yet";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not yet";
  return formatter.format(date);
};

const ExamsOverviewPage = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { level, resultHistory } = useExam();
  const { user, studentProfile } = useAuth();
  const [lastVisits, setLastVisits] = useState({});
  const [lastSection, setLastSection] = useState("speaking");
  const [writingUpdatedAt, setWritingUpdatedAt] = useState("");
  const [downloadCount, setDownloadCount] = useState(0);

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(i18n.language, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    [i18n.language]
  );

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LAST_VISIT_STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : {};
      setLastVisits(parsed);
      const storedSection = localStorage.getItem(LAST_SECTION_STORAGE_KEY);
      if (storedSection) {
        setLastSection(storedSection);
      }
      const count = Number(localStorage.getItem(STUDY_CALENDAR_DOWNLOAD_COUNT_KEY) || 0);
      setDownloadCount(Number.isNaN(count) ? 0 : count);
    } catch (error) {
      console.warn("Failed to load exam overview storage", error);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchWritingProgress = async () => {
      const userId = user?.uid;
      const studentCode =
        studentProfile?.studentCode || studentProfile?.studentcode || userId || "";
      const progress = await loadWritingProgress({ userId, studentCode, mode: "exam" });
      if (!isMounted) return;
      setWritingUpdatedAt(progress?.updatedAt || "");
    };

    fetchWritingProgress();

    return () => {
      isMounted = false;
    };
  }, [studentProfile?.studentCode, studentProfile?.studentcode, user?.uid]);

  const latestResult = resultHistory[0];
  const resumeSection = lastSection || "speaking";

  const quickStartSteps = [
    {
      title: "Confirm your exam level",
      body: "Use the selector above so every tab (speaking, writing, resources) matches your target level.",
    },
    {
      title: "Choose your focus",
      body: "Start with speaking warm-ups, then move into writing practice or the study calendar.",
    },
    {
      title: "Save & review",
      body: "Download your study calendar and keep track of the last session for each tab.",
    },
  ];

  const shortcuts = [
    { key: "speaking", label: "Speaking warm-up", helper: "Prompts + sample PDFs", to: "/exams/speaking" },
    { key: "writing", label: "Writing practice", helper: "Timed letters + feedback", to: "/exams/writing" },
    { key: "lesen", label: "Lesen", helper: "Reading practice", to: "/exams/lesen" },
    { key: "horen", label: "Hören", helper: "Listening practice", to: "/exams/horen" },
    { key: "vocab", label: "Vocab", helper: "Exam vocabulary", to: "/exams/vocab" },
    { key: "resources", label: "Resources", helper: "Level links + tips", to: "/exams/resources" },
    { key: "study", label: "Study calendar", helper: "Download your plan", to: "/exams/study" },
    { key: "file", label: "Exam file", helper: "Save documents", to: "/exams/file" },
  ];

  const snapshotCards = [
    {
      label: "Speaking",
      value: formatDate(lastVisits.speaking, dateFormatter),
    },
    {
      label: "Writing",
      value: formatDate(lastVisits.writing, dateFormatter),
    },
    {
      label: "Study calendar",
      value: downloadCount ? `${downloadCount} downloads` : "Not downloaded",
    },
    {
      label: "Latest writing feedback",
      value: latestResult?.createdAt
        ? formatDate(latestResult.createdAt, dateFormatter)
        : writingUpdatedAt
          ? formatDate(writingUpdatedAt, dateFormatter)
          : "Not yet",
    },
  ];

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section style={styles.card}>
        <p style={{ ...styles.helperText, margin: 0 }}>Exams Room overview</p>
        <h2 style={{ ...styles.sectionTitle, margin: "6px 0" }}>Start here for level {level}</h2>
        <p style={{ ...styles.helperText, margin: 0 }}>
          Get a quick snapshot of your activity, then jump into the tab you need most today.
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
        <h3 style={{ ...styles.sectionTitle, marginBottom: 10 }}>Progress snapshot</h3>
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          {snapshotCards.map((card) => (
            <div
              key={card.label}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: 12,
                background: "#f9fafb",
              }}
            >
              <div style={{ fontSize: 13, color: "#6b7280" }}>{card.label}</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginTop: 6 }}>{card.value}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.card}>
        <h3 style={{ ...styles.sectionTitle, marginBottom: 10 }}>Start here</h3>
        <ol style={{ display: "grid", gap: 10, margin: 0, paddingLeft: 18 }}>
          {quickStartSteps.map((step) => (
            <li key={step.title}>
              <strong>{step.title}.</strong> <span style={{ color: "#4b5563" }}>{step.body}</span>
            </li>
          ))}
        </ol>
      </section>

      <section style={styles.card}>
        <h3 style={{ ...styles.sectionTitle, marginBottom: 10 }}>Shortcuts</h3>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {shortcuts.map((shortcut) => (
            <button
              key={shortcut.key}
              type="button"
              onClick={() => navigate(shortcut.to)}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: 12,
                textAlign: "left",
                background: "#ffffff",
                cursor: "pointer",
              }}
            >
              <div style={{ fontWeight: 700 }}>{shortcut.label}</div>
              <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{shortcut.helper}</div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ExamsOverviewPage;
