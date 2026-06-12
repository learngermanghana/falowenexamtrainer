import React, { useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";
import SpeakingPracticeTimerCard from "./SpeakingPracticeTimerCard";

const tabs = [
  { key: "sprechen", label: "Teil 1 · Sprechen" },
  { key: "schreiben", label: "Teil 2 · Schreiben" },
  { key: "lesen", label: "Teil 3 · Lesen" },
  { key: "hoeren", label: "Teil 4 · Hören" },
];

const card = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const sectionTitle = {
  margin: 0,
  fontSize: "1.1rem",
};

const listSpacing = {
  margin: 0,
  paddingLeft: 20,
  lineHeight: 1.7,
};

const questionCardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 12,
  background: "#fff",
  display: "grid",
  gap: 6,
};

const videoPreviewStyle = {
  width: "100%",
  minHeight: 315,
  border: 0,
  borderRadius: 10,
};

const lesenQuestions = [
  {
    stem: "Welche Hauptthese vertritt der Artikel zur Bedeutung sprachlicher Präzision?",
    options: [
      "A) Präzision ist nur in akademischen Texten nötig.",
      "B) Präzision entscheidet über Glaubwürdigkeit und Wirkung.",
      "C) Präzision verlangsamt Kommunikation zu stark.",
      "D) Präzision ist im digitalen Raum kaum relevant.",
    ],
  },
  {
    stem: "Woran erkennt man laut Text einen argumentativen Fehlschluss?",
    options: [
      "A) An der Länge eines Absatzes",
      "B) An häufigen Fremdwörtern",
      "C) An unbelegten Kausalbehauptungen",
      "D) An zu vielen Zitaten",
    ],
  },
  {
    stem: "Welche Strategie empfiehlt der Beitrag für effektive C1-Lektüre?",
    options: [
      "A) Jedes unbekannte Wort sofort nachschlagen",
      "B) Erst globales Verstehen, dann Detailanalyse",
      "C) Nur Überschriften lesen",
      "D) Nur auf Zahlen und Namen achten",
    ],
  },
  {
    stem: "Welche Haltung gegenüber Gegenargumenten wird als professionell beschrieben?",
    options: [
      "A) Gegenargumente ignorieren",
      "B) Gegenargumente nur ironisch erwähnen",
      "C) Gegenargumente fair darstellen und entkräften",
      "D) Gegenargumente mit Autoritätsargumenten ersetzen",
    ],
  },
];

const hoerenQuestions = [
  {
    stem: "Welches Lernziel nennt die Sprecherin für den C1-Startmonat?",
    options: [
      "A) Nur Wortlisten auswendig lernen",
      "B) Täglich 15 Minuten komplexe Strukturen aktiv nutzen",
      "C) Ausschließlich Hörverstehen trainieren",
      "D) Nur Grammatiktests schreiben",
    ],
  },
  {
    stem: "Warum empfiehlt sie ein Lerntagebuch?",
    options: [
      "A) Damit man weniger lesen muss",
      "B) Damit Fehlerquellen und Fortschritte sichtbar werden",
      "C) Damit man neue Apps vermeiden kann",
      "D) Damit man längere Pausen rechtfertigen kann",
    ],
  },
  {
    stem: "Welche Rolle spielt Feedback im Beitrag?",
    options: [
      "A) Feedback ist nur für Anfänger relevant",
      "B) Feedback stört die eigene Sprachintuition",
      "C) Feedback hilft bei Register, Kohärenz und Präzision",
      "D) Feedback wird durch KI vollständig ersetzt",
    ],
  },
  {
    stem: "Was ist laut Audio ein realistischer Wochenfokus für C1?",
    options: [
      "A) Ein Thema vertiefen und in allen Fertigkeiten anwenden",
      "B) Möglichst viele Themen oberflächlich anreißen",
      "C) Nur Prüfungsmodelle ohne Reflexion bearbeiten",
      "D) Grammatik vollständig pausieren",
    ],
  },
];

function TabButton({ active, onClick, children }) {
  return (
    <button
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

const PreparedCheckbox = ({ checked, onChange }) => (
  <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
    <input type="checkbox" checked={checked} onChange={onChange} />
    I prepared this part.
  </label>
);

const C1Day1WillkommenSelbstlernstartWorkbookPage = () => {
  const [activeTab, setActiveTab] = useState("sprechen");
  const [prepared, setPrepared] = useState({
    sprechen: false,
    schreiben: false,
    lesen: false,
    hoeren: false,
  });

  const activeIndex = useMemo(() => tabs.findIndex((tab) => tab.key === activeTab), [activeTab]);

  const setPreparedFor = (tabKey) => (event) => setPrepared((prev) => ({ ...prev, [tabKey]: event.target.checked }));

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

        <h1 style={{ ...styles.title, marginBottom: 0 }}>C1 · Tag 1 Workbook · Willkommen + Selbstlernstart</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          4-part workbook: speaking, writing, reading and listening practice.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {tabs.map((tab) => (
            <TabButton key={tab.key} active={tab.key === activeTab} onClick={() => setActiveTab(tab.key)}>
              {tab.label}
            </TabButton>
          ))}
        </div>

        <p style={{ margin: 0, color: "#4b5563" }}>
          Tab {activeIndex + 1} of {tabs.length}
        </p>
      </div>

      {activeTab === "sprechen" && (
        <div style={card}>
          <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1600&q=80" alt="Professional learners discussing goals in a study group" loading="lazy" style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }} />
          <h2 style={sectionTitle}>Teil 1 (Sprechen) · Group Practice</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Thema: <strong>Stell dich vor und erkläre, warum du Deutsch auf C1 lernst.</strong>
          </p>
          <ul style={listSpacing}>
            <li>Gib eine präzise Selbstvorstellung mit relevantem Kontext (Beruf/Studium/Alltag).</li>
            <li>Erkläre deine C1-Motivation mit mindestens zwei klaren Gründen und Beispielen.</li>
            <li>Beschreibe ein realistisches Lernziel für die nächsten 4 Wochen.</li>
          </ul>
          <h3 style={sectionTitle}>Diskussionsfragen (C1)</h3>
          <ul style={listSpacing}>
            <li>Welche sprachlichen Situationen sind für dich aktuell am anspruchsvollsten?</li>
            <li>Wie möchtest du dein sprachliches Register in Beruf oder Studium verbessern?</li>
            <li>Welche Strategien helfen dir, auf C1 kohärent und präzise zu argumentieren?</li>
          </ul>

          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <strong>Speaking self-practice confidence check</strong>
            <p style={{ margin: 0 }}>Use this speaking self-practice tool to build confidence before class:</p>
            <a href="https://www.falowen.app/campus/speech" target="_blank" rel="noreferrer">Open speaking self-practice</a>
          </div>
          <SpeakingPracticeTimerCard />

          <p style={{ margin: 0, color: "#4b5563" }}>Teil 1 is for group practice only and has no assignment submission.</p>

          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </div>
      )}

      {activeTab === "schreiben" && (
        <div style={card}>
          <img src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80" alt="Learner drafting a formal German text in a notebook" loading="lazy" style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }} />
          <h2 style={sectionTitle}>Teil 2 (Schreiben) · Exercise</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}><strong>C1 writing task:</strong> Verfasse einen strukturierten Text (180–220 Wörter) zum Thema „Mein C1-Lernweg“.</p>
          <ol style={listSpacing}>
            <li>Stelle dich kurz vor und benenne deine Ausgangssituation.</li>
            <li>Erkläre präzise, warum du Deutsch auf C1-Niveau lernst.</li>
            <li>Formuliere einen konkreten Lernplan mit messbaren Zielen.</li>
          </ol>
          <p style={{ margin: 0, color: "#4b5563" }}>Before submission: check coherence, connectors, and register. Revise one paragraph for stronger argumentation.</p>
          <p style={{ margin: 0 }}>Practice your draft before submission on the writing page: <a href="https://www.falowen.app/campus/writing" target="_blank" rel="noreferrer">Open Writing Practice</a> (use the Ideas Generator to develop and refine points).</p>
          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </div>
      )}

      {activeTab === "lesen" && (
        <div style={card}>
          <img src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1600&q=80" alt="Reader studying a German newspaper article at a desk" loading="lazy" style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }} />
          <h2 style={sectionTitle}>Teil 3 (Lesen)</h2>
          <p style={{ margin: 0 }}><strong>Read the article first, then answer the questions below.</strong></p>
          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <strong>Recommended C1 reading</strong>
            <ul style={listSpacing}>
              <li><strong>Wie Sprache die Debattenkultur prägt</strong> · Welt · <a href="https://www.welt.de" target="_blank" rel="noreferrer">Open article</a></li>
              <li><strong>Warum Medienkompetenz im Alltag entscheidend ist</strong> · tagesschau.de · <a href="https://www.tagesschau.de" target="_blank" rel="noreferrer">Open article</a></li>
              <li><strong>Lernen auf hohem Niveau: Strategien für nachhaltigen Fortschritt</strong> · deutschlandfunk.de · <a href="https://www.deutschlandfunk.de" target="_blank" rel="noreferrer">Open article</a></li>
            </ul>
          </div>

          <h3 style={sectionTitle}>Fragen und mögliche Antworten</h3>
          {lesenQuestions.map((question, index) => (
            <div key={question.stem} style={questionCardStyle}>
              <strong>{index + 1}. {question.stem}</strong>
              {question.options.map((option) => (
                <label key={option} style={{ display: "block" }}>
                  <input type="radio" name={`lesen-${index}`} /> {option}
                </label>
              ))}
            </div>
          ))}

          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </div>
      )}

      {activeTab === "hoeren" && (
        <div style={card}>
          <img src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1600&q=80" alt="Student listening carefully with headphones during language study" loading="lazy" style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }} />
          <h2 style={sectionTitle}>Teil 4 (Hören)</h2>
          <p style={{ margin: 0 }}>Listen to the audio/video input and answer the C1-level listening questions below.</p>

          <iframe src="https://www.youtube.com/embed/8xH7lFj6xRw" title="C1 listening practice" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen style={videoPreviewStyle} />

          <h3 style={sectionTitle}>Fragen und mögliche Antworten</h3>
          {hoerenQuestions.map((question, index) => (
            <div key={question.stem} style={questionCardStyle}>
              <strong>{index + 1}. {question.stem}</strong>
              {question.options.map((option) => (
                <label key={option} style={{ display: "block" }}>
                  <input type="radio" name={`hoeren-${index}`} /> {option}
                </label>
              ))}
            </div>
          ))}

          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}
    </div>
  );
};

export default C1Day1WillkommenSelbstlernstartWorkbookPage;
