import React, { useState } from "react";
import SpeakingPage from "./SpeakingPage";
import WritingPage from "./WritingPage";
import VocabPage from "./VocabPage";
import { useExam } from "../context/ExamContext";
import { styles } from "../styles";

const RESOURCE_LINKS = [
  {
    label: "Lesen (Goethe Übungssätze)",
    description:
      "Öffnet die offiziellen Goethe-Leseverstehen-Übungen in einem neuen Tab.",
    url: "https://www.goethe.de/de/spr/kup/prf/prf/gzb1/ueb.html",
  },
  {
    label: "Hören (Goethe Hörverstehen)",
    description:
      "Original-Audioaufgaben mit Lösungen direkt von der Goethe-Webseite.",
    url: "https://www.goethe.de/de/spr/kup/prf/prf/gzb1/ueb.html#section-3",
  },
];

const ExamRoom = () => {
  const { setResult, setError } = useExam();
  const [activeTab, setActiveTab] = useState("sprechen");

  const handleTabChange = (tab) => {
    setResult(null);
    setError("");
    setActiveTab(tab);
  };

  const renderContent = () => {
    if (activeTab === "schreiben") {
      return <WritingPage mode="exam" />;
    }
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
              <h2 style={{ ...styles.sectionTitle, marginBottom: 6 }}>
                Ressourcen für Lesen & Hören
              </h2>
              <p style={styles.helperText}>
                Öffne die offiziellen Goethe-Beispiele, um mit Originalmaterial zu üben.
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

    if (activeTab === "vocab") {
      return (
        <VocabPage
          title="Vokabel-Booster für deine Prüfung"
          subtitle="Gleiche Daten wie im Kursbuch. Übe die Goethe-Wortlisten und starte bei Bedarf neu."
          contextLabel="Geteiltes Exams & Kursbuch Vokab"
        />
      );
    }

    return <SpeakingPage mode="exam" />;
  };

  const tabs = [
    { key: "sprechen", label: "Sprechen" },
    { key: "schreiben", label: "Schreiben" },
    { key: "vocab", label: "Vokabeln" },
    { key: "resources", label: "Ressourcen" },
  ];

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ ...styles.card, background: "#f9fafb" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <p style={{ ...styles.helperText, margin: "0 0 4px 0" }}>Prüfungsraum</p>
            <h2 style={{ ...styles.sectionTitle, margin: 0 }}>Wähle dein Prüfungsformat</h2>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
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
