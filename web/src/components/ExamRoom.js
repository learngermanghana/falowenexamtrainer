import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import SpeakingPage from "./SpeakingPage";
import SpeakingTeilOneGuide from "./SpeakingTeilOneGuide";
import WritingPage from "./WritingPage";
import { useExam } from "../context/ExamContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { triggerInteractionFeedback } from "../services/interactionFeedback";
import { styles } from "../styles";

const STORAGE_KEY = "falowen_examroom_active_tab";

const normalizeLevel = (level) => String(level || "").toUpperCase().trim();

const GOETHE_PRACTICE_BASE = {
  A1: "https://www.goethe.de/de/spr/kup/prf/prf/gza1/ueb.html",
  A2: "https://www.goethe.de/de/spr/kup/prf/prf/gza2/ueb.html",
  B1: "https://www.goethe.de/de/spr/kup/prf/prf/gzb1/ueb.html",
  B2: "https://www.goethe.de/de/spr/kup/prf/prf/gzb2/ueb.html",
};

const buildResourceLinks = (level, t) => {
  const base = GOETHE_PRACTICE_BASE[level] || GOETHE_PRACTICE_BASE.B1;

  return [
    {
      label: t("examRoom.resources.links.reading.label"),
      description: t("examRoom.resources.links.reading.description"),
      url: base,
    },
    {
      label: t("examRoom.resources.links.listening.label"),
      description: t("examRoom.resources.links.listening.description"),
      url: `${base}#section-3`,
    },
  ];
};

const ExamRoom = () => {
  const { t } = useTranslation();
  const { setResult, setError } = useExam();
  const { studentProfile } = useAuth();
  const { showToast } = useToast();

  const studentLevel = useMemo(() => normalizeLevel(studentProfile?.level) || "B1", [studentProfile?.level]);

  const [activeTab, setActiveTab] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || "sprechen";
    } catch {
      return "sprechen";
    }
  });

  const RESOURCE_LINKS = useMemo(() => buildResourceLinks(studentLevel, t), [studentLevel, t]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, activeTab);
    } catch {
      // ignore
    }
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setResult(null);
    setError("");
    setActiveTab(tab);

    const feedbackByTab = {
      schreiben: {
        sound: "open",
        toastMessage: "Writing exam room opened.",
        notificationTitle: "Exam room: Writing",
        notificationBody: "You are now in the writing practice tab.",
      },
      sprechen: {
        sound: "open",
        toastMessage: "Speaking exam room opened.",
        notificationTitle: "Exam room: Speaking",
        notificationBody: "You are now in the speaking practice tab.",
      },
      resources: {
        sound: "info",
        toastMessage: "Exam resources tab opened.",
        notificationTitle: "Exam resources ready",
        notificationBody: "Practice links are ready to open.",
      },
    };

    const selectedFeedback = feedbackByTab[tab] || { sound: "open" };

    triggerInteractionFeedback({
      ...selectedFeedback,
      toastVariant: "info",
      showToast,
      notificationTag: `exam-room-tab-${tab}`,
      vibratePattern: [35],
    });
  };

  const renderContent = () => {
    if (activeTab === "schreiben") return <WritingPage mode="exam" />;

    if (activeTab === "resources") {
      return (
        <div style={{ ...styles.card, display: "grid", gap: 12 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2 style={{ ...styles.sectionTitle, marginBottom: 6 }}>{t("examRoom.resources.title")}</h2>
              <p style={styles.helperText}>{t("examRoom.resources.subtitle", { level: studentLevel })}</p>
            </div>
            <span style={styles.badge}>{t("examRoom.resources.badge")}</span>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            {RESOURCE_LINKS.map((resource) => (
              <div key={resource.label} style={{ ...styles.card, marginBottom: 0 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 8,
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <h3 style={{ margin: "0 0 4px 0" }}>{resource.label}</h3>
                    <p style={{ ...styles.helperText, margin: 0 }}>{resource.description}</p>
                  </div>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    style={{ ...styles.primaryButton, textDecoration: "none" }}
                    onClick={() => {
                      triggerInteractionFeedback({
                        sound: "open",
                        toastMessage: `${resource.label} opened.`,
                        toastVariant: "success",
                        showToast,
                        notificationTitle: "Exam practice link opened",
                        notificationBody: resource.label,
                        notificationTag: "exam-resource-open",
                        vibratePattern: [40],
                      });
                    }}
                  >
                    {t("common.open")}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div style={{ display: "grid", gap: 12 }}>
        <SpeakingTeilOneGuide level={studentLevel} />
        <SpeakingPage mode="exam" />
      </div>
    );
  };

  const tabs = [
    { key: "sprechen", label: t("examRoom.tabs.speaking") },
    { key: "schreiben", label: t("examRoom.tabs.writing") },
    { key: "resources", label: t("examRoom.tabs.resources") },
  ];

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ ...styles.card, background: "#f9fafb" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <p style={{ ...styles.helperText, margin: "0 0 4px 0" }}>{t("examRoom.headingLabel")}</p>
            <h2 style={{ ...styles.sectionTitle, margin: 0 }}>{t("examRoom.title")}</h2>
            <div style={{ marginTop: 6 }}>
              <span style={styles.badge}>{t("examRoom.levelBadge", { level: studentLevel })}</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                style={activeTab === tab.key ? styles.navButtonActive : styles.navButton}
                onClick={() => handleTabChange(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

export default ExamRoom;
