import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import SpeakingPracticeTimerCard from "./SpeakingPracticeTimerCard";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80";

const tabs = [
  { key: "sprechen", label: "Teil 1 · Sprechen" },
  { key: "schreiben", label: "Teil 2 · Schreiben" },
  { key: "lesen", label: "Teil 3 · Lesen" },
  { key: "hoeren", label: "Teil 4 · Hören" },
];

const card = { ...styles.card, display: "grid", gap: 12 };
const sectionTitle = { margin: 0, fontSize: "1.1rem" };
const listSpacing = { margin: 0, paddingLeft: 20, lineHeight: 1.7 };
const questionCardStyle = { border: "1px solid #e5e7eb", borderRadius: 10, padding: 12, background: "#fff", display: "grid", gap: 6 };
const tabImageStyle = { width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" };

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

const C1Day12FreizeitUndKulturWorkbookPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sprechen");
  const [prepared, setPrepared] = useState({ sprechen: false, schreiben: false, lesen: false, hoeren: false });

  const activeIndex = useMemo(() => tabs.findIndex((tab) => tab.key === activeTab), [activeTab]);
  const setPreparedFor = (tabKey) => (event) =>
    setPrepared((prev) => ({ ...prev, [tabKey]: event.target.checked }));

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <button
          style={{ ...styles.secondaryButton, width: "fit-content" }}
          onClick={() => navigate("/campus/course")}
        >
          Back to Course
        </button>
        <img
          src={HERO_IMAGE}
          alt="Audience enjoying a city culture event"
          loading="lazy"
          style={tabImageStyle}
        />
        <h1 style={{ ...styles.title, marginBottom: 0 }}>C1 · Day 12 Workbook · Freizeit und Kultur</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Chapter: 3.2</p>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          4-part workbook: speaking, writing, reading and listening practice for self-learning.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {tabs.map((tab) => (
            <TabButton key={tab.key} active={tab.key === activeTab} onClick={() => setActiveTab(tab.key)}>
              {tab.label}
            </TabButton>
          ))}
        </div>
        <p style={{ margin: 0, color: "#4b5563" }}>Tab {activeIndex + 1} of {tabs.length}</p>
      </div>

      {activeTab === "sprechen" && (
        <div style={card}>
          <h2 style={sectionTitle}>Teil 1 (Sprechen) · Self-Practice</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Bereite eine strukturierte C1-Antwort auf folgende Leitfrage vor:
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>
              Welche Bedeutung haben Freizeit- und Kulturangebote für soziale Teilhabe,
              Lebensqualität und Identität in modernen Städten?
            </strong>
          </p>
          <h3 style={sectionTitle}>Denkimpulse / Brainstorming</h3>
          <ul style={listSpacing}>
            <li>Zugang zu Kultur: Wer kann teilnehmen, wer bleibt außen vor?</li>
            <li>Preisgestaltung: günstige Angebote vs. exklusive Formate</li>
            <li>Kultur als Wirtschaftsfaktor: Tourismus, Arbeitsplätze, Stadtimage</li>
            <li>Spannung zwischen Eventkultur und langfristiger Kulturförderung</li>
            <li>Digitale Kulturformate und ihre Chancen/Grenzen</li>
          </ul>
          <h3 style={sectionTitle}>Sprechstruktur (C1)</h3>
          <ul style={listSpacing}>
            <li>Einleitung mit klarer Position</li>
            <li>Zwei differenzierte Hauptargumente mit Beispielen</li>
            <li>Gegenperspektive kurz einbeziehen</li>
            <li>Abschluss mit begründetem Fazit</li>
          </ul>

          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <strong>Speaking self-practice confidence check</strong>
            <p style={{ margin: 0 }}>Use this speaking self-practice tool to build confidence:</p>
            <a href="https://www.falowen.app/campus/speech" target="_blank" rel="noreferrer">
              Open speaking self-practice
            </a>
          </div>

          <SpeakingPracticeTimerCard />
          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </div>
      )}

      {activeTab === "schreiben" && (
        <div style={card}>
          <h2 style={sectionTitle}>Teil 2 (Schreiben) · Self-Practice</h2>
          <p style={{ margin: 0 }}>
            <strong>Aufgabe:</strong> Verfasse einen argumentativen Text (ca. 220–280 Wörter).
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>
              „Freizeit und Kultur als Standortfaktor: Sollten Städte stärker in öffentliche
              Kulturangebote investieren?“
            </strong>
          </p>
          <p style={{ margin: 0 }}>Dein Text sollte:</p>
          <ul style={listSpacing}>
            <li>die gesellschaftliche Relevanz von Kultur- und Freizeitangeboten darstellen</li>
            <li>mindestens zwei Vorteile und zwei Herausforderungen analysieren</li>
            <li>ein konkretes Beispiel aus urbanem Alltag oder eigener Erfahrung enthalten</li>
            <li>mit einer klaren, begründeten Schlussposition enden</li>
          </ul>
          <h3 style={sectionTitle}>Sprachlicher Fokus (Day 12)</h3>
          <ul style={listSpacing}>
            <li>Nutze erweiterte Vergleichsformen gezielt (deutlich, weitaus, im Vergleich zu).</li>
            <li>Verwende mindestens einen Je-desto-Satz.</li>
            <li>Achte auf formellen, präzisen Stil ohne Umgangssprache.</li>
          </ul>
          <p style={{ margin: 0 }}>
            Practice your draft before submission on the writing page:{" "}
            <a href="https://www.falowen.app/campus/writing" target="_blank" rel="noreferrer">
              Open Writing Practice
            </a>
          </p>
          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </div>
      )}

      {activeTab === "lesen" && (
        <div style={card}>
          <h2 style={sectionTitle}>Teil 3 (Lesen) · Self-Study</h2>
          <p style={{ margin: 0 }}>
            Lies den folgenden Artikel und analysiere Aufbau, Argumente und Perspektive.
          </p>
          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <strong>Empfohlene Lektüre</strong>
            <p style={{ margin: 0 }}>
              Kultur in Deutschland (Überblick) · Quelle: Goethe-Institut
              <br />
              <a href="https://www.goethe.de/ins/de/de/kul.html" target="_blank" rel="noreferrer">
                Open reading link
              </a>
            </p>
          </div>
          <h3 style={sectionTitle}>Selbstevaluation</h3>
          <ul style={listSpacing}>
            <li>Kann ich die Hauptaussage in 2–3 Sätzen zusammenfassen?</li>
            <li>Welche Zielgruppe spricht der Text an?</li>
            <li>Welche Argumente sind am überzeugendsten und warum?</li>
            <li>Welche Aspekte fehlen aus meiner Sicht?</li>
          </ul>
          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </div>
      )}

      {activeTab === "hoeren" && (
        <div style={card}>
          <h2 style={sectionTitle}>Teil 4 (Hören) · Self-Study</h2>
          <p style={{ margin: 0 }}>
            Höre einen aktuellen Kulturbeitrag und notiere Kernaussagen, Beispiele und Positionen.
          </p>
          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <strong>Empfohlenes Hören</strong>
            <p style={{ margin: 0 }}>
              Kultur-Themenseite · Quelle: Deutsche Welle
              <br />
              <a href="https://www.dw.com/de/themen/kultur/s-1533" target="_blank" rel="noreferrer">
                Open listening link
              </a>
            </p>
          </div>
          <h3 style={sectionTitle}>Selbstevaluation</h3>
          <ul style={listSpacing}>
            <li>Welche zentrale Botschaft wurde vermittelt?</li>
            <li>Welche Begriffe oder Wendungen waren neu?</li>
            <li>Wie ist die Haltung der Sprecherin/des Sprechers erkennbar?</li>
            <li>Kann ich den Beitrag mündlich strukturiert nacherzählen?</li>
          </ul>
          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}
    </div>
  );
};

export default C1Day12FreizeitUndKulturWorkbookPage;
