import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const tabs = [
  { key: "sprechen", label: "Sprechen" },
  { key: "schreiben", label: "Schreiben" },
  { key: "lesen", label: "Lesen" },
  { key: "hoeren", label: "Hören" },
];

const card = { ...styles.card, display: "grid", gap: 12 };

function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...styles.secondaryButton,
        borderColor: active ? "#2563eb" : "#d1d5db",
        background: active ? "#eff6ff" : "#fff",
        color: active ? "#1d4ed8" : "#111827",
      }}
    >
      {children}
    </button>
  );
}

const C1Day1WillkommenSelbstlernstartPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sprechen");
  const activeIndex = useMemo(() => tabs.findIndex((tab) => tab.key === activeTab), [activeTab]);

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>C1 · Tag 1 · Willkommen + Selbstlernstart</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Thema: Stell dich vor und erkläre, warum du Deutsch auf C1 lernst.
        </p>
        <p style={{ margin: 0 }}>
          Aufbau wie A2-Workbook: vier Teile mit eigener Vorbereitung für <strong>Sprechen, Schreiben, Lesen, Hören</strong>.
        </p>
        <a href="https://www.falowen.app/campus/course/a2-day-2-small-talk-workbook" target="_blank" rel="noreferrer">
          Ideen-Vorlage ansehen (A2 Day 2)
        </a>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {tabs.map((tab) => (
            <TabButton key={tab.key} active={tab.key === activeTab} onClick={() => setActiveTab(tab.key)}>
              {tab.label}
            </TabButton>
          ))}
        </div>
        <p style={{ margin: 0, color: "#4b5563" }}>
          Tab {activeIndex + 1} von {tabs.length}
        </p>
      </div>

      {activeTab === "sprechen" ? (
        <div style={card}>
          <h2 style={{ margin: 0 }}>Teil 1 · Sprechen</h2>
          <p style={{ margin: 0 }}>Sprich 90–120 Sekunden frei zum Thema und nimm dich auf.</p>
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
            <li>Kurzvorstellung: Name, Herkunft, aktueller Alltag.</li>
            <li>Motivation: Warum C1? (Studium, Arbeit, Integration, Prüfung).</li>
            <li>Zielbild: Was willst du in 3 Monaten besser können?</li>
          </ul>
          <button type="button" style={styles.secondaryButton} onClick={() => navigate("/exams/speaking")}>
            Aufnahme öffnen
          </button>
        </div>
      ) : null}

      {activeTab === "schreiben" ? (
        <div style={card}>
          <h2 style={{ margin: 0 }}>Teil 2 · Schreiben</h2>
          <p style={{ margin: 0 }}>
            Schreibe 180–220 Wörter: „Mein C1-Lernweg: Ausgangspunkt, Motivation, konkreter Plan“.
          </p>
          <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
            <li>Einleitung mit persönlichem Kontext.</li>
            <li>Hauptteil mit 2–3 klaren Gründen für C1.</li>
            <li>Konkreter Wochenplan und Abschluss.</li>
          </ol>
          <button type="button" style={styles.secondaryButton} onClick={() => navigate("/campus/writing?tab=ideas")}>
            Schreiben öffnen
          </button>
        </div>
      ) : null}

      {activeTab === "lesen" ? (
        <div style={card}>
          <h2 style={{ margin: 0 }}>Teil 3 · Lesen</h2>
          <p style={{ margin: 0 }}>Lies einen kurzen C1-Text über Lernstrategien und notiere Kernaussagen.</p>
          <a href="https://www.goethe.de/prj/ger/de/index.html" target="_blank" rel="noreferrer">
            Lesequelle öffnen
          </a>
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
            <li>Welche Strategien nennt der Text?</li>
            <li>Was davon passt zu deinem Alltag?</li>
            <li>Formuliere eine eigene Empfehlung in 2 Sätzen.</li>
          </ul>
        </div>
      ) : null}

      {activeTab === "hoeren" ? (
        <div style={card}>
          <h2 style={{ margin: 0 }}>Teil 4 · Hören</h2>
          <p style={{ margin: 0 }}>Höre einen kurzen Beitrag und halte zentrale Informationen fest.</p>
          <a href="https://www.tagesschau.de/100sekunden" target="_blank" rel="noreferrer">
            Hörquelle öffnen
          </a>
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
            <li>Notiere 3 Schlüsselbegriffe.</li>
            <li>Fasse den Beitrag in 3–4 Sätzen zusammen.</li>
            <li>Erkläre: Welche neue Struktur oder welches neue Wort willst du aktiv nutzen?</li>
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default C1Day1WillkommenSelbstlernstartPage;
