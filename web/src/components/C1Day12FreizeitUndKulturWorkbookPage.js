import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import SpeakingPracticeTimerCard from "./SpeakingPracticeTimerCard";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=80";

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
  return <button onClick={onClick} style={{ ...styles.secondaryButton, borderColor: active ? "#2563eb" : "#d1d5db", background: active ? "#eff6ff" : "#fff", color: active ? "#1d4ed8" : "#111827" }}>{children}</button>;
}

const PreparedCheckbox = ({ checked, onChange }) => (<label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}><input type="checkbox" checked={checked} onChange={onChange} />I prepared this part.</label>);

const C1Day12FreizeitUndKulturWorkbookPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sprechen");
  const [prepared, setPrepared] = useState({ sprechen: false, schreiben: false, lesen: false, hoeren: false });
  const activeIndex = useMemo(() => tabs.findIndex((tab) => tab.key === activeTab), [activeTab]);
  const setPreparedFor = (tabKey) => (event) => setPrepared((prev) => ({ ...prev, [tabKey]: event.target.checked }));

  return <div style={{ ...styles.container, display: "grid", gap: 16 }}>
    <div style={card}>
      <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>Back to Course</button>
      <img src={HERO_IMAGE} alt="Audience at an outdoor cultural leisure event" loading="lazy" style={tabImageStyle} />
      <h1 style={{ ...styles.title, marginBottom: 0 }}>C1 · Day 12 Workbook · Freizeit und Kultur</h1>
      <p style={{ ...styles.subtitle, margin: 0 }}>Chapter: 3.2</p>
      <p style={{ ...styles.subtitle, margin: 0 }}>4-part workbook: speaking, writing, reading and listening practice for self-learning.</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{tabs.map((tab) => <TabButton key={tab.key} active={tab.key === activeTab} onClick={() => setActiveTab(tab.key)}>{tab.label}</TabButton>)}</div>
      <p style={{ margin: 0, color: "#4b5563" }}>Tab {activeIndex + 1} of {tabs.length}</p>
    </div>

    {activeTab === "sprechen" && <div style={card}><h2 style={sectionTitle}>Teil 1 (Sprechen) · Self-Practice</h2><p style={{ margin: 0, lineHeight: 1.7 }}><strong>Prompt:</strong> Welche Rolle spielen Freizeit- und Kulturangebote für Lebensqualität und gesellschaftlichen Zusammenhalt in einer Stadt?</p><h3 style={sectionTitle}>Brainstorming</h3><ul style={listSpacing}><li>Zugang und Teilhabe</li><li>Kosten und soziale Gerechtigkeit</li><li>Lokale Identität</li><li>Tourismus vs. Alltag der Bewohner</li><li>Digitale Kulturangebote</li></ul><div style={{ ...questionCardStyle, background: "#f8fafc" }}><strong>Speaking self-practice confidence check</strong><p style={{ margin: 0 }}>Use this speaking self-practice tool to build confidence:</p><a href="https://www.falowen.app/campus/speech" target="_blank" rel="noreferrer">Open speaking self-practice</a></div><SpeakingPracticeTimerCard /><PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} /></div>}

    {activeTab === "schreiben" && <div style={card}><h2 style={sectionTitle}>Teil 2 (Schreiben) · Self-Practice</h2><p style={{ margin: 0 }}><strong>Writing task:</strong> Verfassen Sie einen argumentativen Text zum Thema „Freizeit und Kultur als Standortfaktor moderner Städte".</p><h3 style={sectionTitle}>Guidance</h3><ul style={listSpacing}><li>Klare Einleitung mit Fragestellung</li><li>Mindestens zwei Chancen und zwei Herausforderungen</li><li>Konkrete Beispiele aus dem urbanen Alltag</li><li>Begründete Schlussposition mit Vorschlag</li></ul><p style={{ margin: 0 }}>Practice your draft before submission on the writing page: <a href="https://www.falowen.app/campus/writing" target="_blank" rel="noreferrer">Open Writing Practice</a></p><PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} /></div>}

    {activeTab === "lesen" && <div style={card}><h2 style={sectionTitle}>Teil 3 (Lesen) · Self-Study</h2><div style={{ ...questionCardStyle, background: "#f8fafc" }}><strong>External reading link</strong><a href="https://www.goethe.de/ins/de/de/kul.html" target="_blank" rel="noreferrer">Open reading link</a></div><h3 style={sectionTitle}>Selbstevaluation</h3><ul style={listSpacing}><li>Kann ich die Hauptaussage in 2–3 Sätzen zusammenfassen?</li><li>Welche Zielgruppe spricht der Text an?</li><li>Welche Argumente sind am überzeugendsten?</li><li>Welche offene Frage bleibt nach der Lektüre?</li></ul><PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} /></div>}

    {activeTab === "hoeren" && <div style={card}><h2 style={sectionTitle}>Teil 4 (Hören) · Self-Study</h2><div style={{ ...questionCardStyle, background: "#f8fafc" }}><strong>External listening link</strong><a href="https://www.dw.com/de/themen/kultur/s-1533" target="_blank" rel="noreferrer">Open listening link</a></div><h3 style={sectionTitle}>Selbstevaluation</h3><ul style={listSpacing}><li>Welche Kernaussagen habe ich verstanden?</li><li>Welche Begriffe musste ich nachschlagen?</li><li>Wie war Sprechtempo und Verständlichkeit?</li><li>Kann ich den Inhalt mündlich kurz wiedergeben?</li></ul><PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} /></div>}
  </div>;
};

export default C1Day12FreizeitUndKulturWorkbookPage;
