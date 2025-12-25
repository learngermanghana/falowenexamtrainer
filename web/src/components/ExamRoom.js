import React, { useEffect, useMemo, useState } from "react";
import SpeakingPage from "./SpeakingPage";
import WritingPage from "./WritingPage";
import { useExam } from "../context/ExamContext";
import { useAuth } from "../context/AuthContext";
import { styles } from "../styles";

const STORAGE_KEY = "falowen_examroom_active_tab";

const normalizeLevel = (level) => String(level || "").toUpperCase().trim();

const GOETHE_PRACTICE_BASE = {
  A1: "https://www.goethe.de/de/spr/kup/prf/prf/gza1/ueb.html",
  A2: "https://www.goethe.de/de/spr/kup/prf/prf/gza2/ueb.html",
  B1: "https://www.goethe.de/de/spr/kup/prf/prf/gzb1/ueb.html",
  B2: "https://www.goethe.de/de/spr/kup/prf/prf/gzb2/ueb.html",
};

const buildResourceLinks = (level) => {
  const base = GOETHE_PRACTICE_BASE[level] || GOETHE_PRACTICE_BASE.B1;

  return [
    {
      label: "Lesen (Goethe Übungssätze)",
      description: "Öffnet die offiziellen Goethe-Leseverstehen-Übungen in einem neuen Tab.",
      url: base,
    },
    {
      label: "Hören (Goethe Hörverstehen)",
      description: "Original-Audioaufgaben mit Lösungen direkt von der Goethe-Webseite.",
      url: `${base}#section-3`,
    },
  ];
};

const ExamRoom = () => {
  const { setResult, setError } = useExam();
  const { studentProfile } = useAuth();

  const studentLevel = useMemo(() => normalizeLevel(studentProfile?.level) || "B1", [studentProfile?.level]);

  const [activeTab, setActiveTab] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || "sprechen";
    } catch {
      return "sprechen";
    }
  });

  const RESOURCE_LINKS = useMemo(() => buildResourceLinks(studentLevel), [studentLevel]);

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
              <h2 style={{ ...styles.sectionTitle, marginBottom: 6 }}>Ressourcen für Lesen & Hören</h2>
              <p style={styles.helperText}>
                Offizielle Goethe-Beispiele ({studentLevel}) – übe mit Originalmaterial.
              </p>
            </div>
            <span style={styles.badge}>Externe Links</span>
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
                  >
                    Öffnen
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return <SpeakingPage mode="exam" />;
  };

  const tabs = [
    { key: "sprechen", label: "Sprechen" },
    { key: "schreiben", label: "Schreiben" },
    { key: "resources", label: "Ressourcen" },
  ];

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ ...styles.card, background: "#f9fafb" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <p style={{ ...styles.helperText, margin: "0 0 4px 0" }}>Prüfungsraum</p>
            <h2 style={{ ...styles.sectionTitle, margin: 0 }}>Wähle dein Prüfungsformat</h2>
            <div style={{ marginTop: 6 }}>
              <span style={styles.badge}>Level: {studentLevel}</span>
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
