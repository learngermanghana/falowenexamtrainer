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

const card = { ...styles.card, display: "grid", gap: 12 };
const sectionTitle = { margin: 0, fontSize: "1.1rem" };
const listSpacing = { margin: 0, paddingLeft: 20, lineHeight: 1.7 };
const questionCardStyle = { border: "1px solid #e5e7eb", borderRadius: 10, padding: 12, background: "#fff", display: "grid", gap: 6 };
const HERO_IMAGE = "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1600&q=80";

function TabButton({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{ ...styles.secondaryButton, borderColor: active ? "#2563eb" : "#d1d5db", background: active ? "#eff6ff" : "#fff", color: active ? "#1d4ed8" : "#111827" }}>
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

const C1Day10IntegrationUndGesellschaftWorkbookPage = () => {
  const [activeTab, setActiveTab] = useState("sprechen");
  const [prepared, setPrepared] = useState({ sprechen: false, schreiben: false, lesen: false, hoeren: false });

  const activeIndex = useMemo(() => tabs.findIndex((tab) => tab.key === activeTab), [activeTab]);
  const setPreparedFor = (tabKey) => (event) => setPrepared((prev) => ({ ...prev, [tabKey]: event.target.checked }));

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <img src={HERO_IMAGE} alt="People from different backgrounds meeting in an urban public space" loading="lazy" style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }} />
        <h1 style={{ ...styles.title, marginBottom: 0 }}>C1 · Day 10 Workbook · Integration und Gesellschaft</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Chapter: 2.5</p>
        <p style={{ ...styles.subtitle, margin: 0 }}>4-part workbook: speaking, writing, reading and listening practice for self-learning.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{tabs.map((tab) => <TabButton key={tab.key} active={tab.key === activeTab} onClick={() => setActiveTab(tab.key)}>{tab.label}</TabButton>)}</div>
        <p style={{ margin: 0, color: "#4b5563" }}>Tab {activeIndex + 1} of {tabs.length}</p>
      </div>

      {activeTab === "sprechen" && <div style={card}>
        <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80" alt="Community discussion about integration in a city" loading="lazy" style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }} />
        <h2 style={sectionTitle}>Teil 1 (Sprechen) · Self-Practice</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>In this chapter, you reflect independently on the topic Integration und Gesellschaft. First, think through the question below on your own. Then use the speaking self-practice tool to organize your ideas, expand your vocabulary, and speak more fluently.</p>
        <p style={{ margin: 0 }}><strong>Zentrales Thema:</strong> Integration und Gesellschaft</p>
        <h3 style={sectionTitle}>Leitfrage (C1)</h3>
        <p style={{ margin: 0, lineHeight: 1.7 }}><strong>Was braucht eine Gesellschaft, damit Integration wirklich gelingt?</strong></p>
        <h3 style={sectionTitle}>Denkimpulse / Brainstorming</h3>
        <ul style={listSpacing}><li>Rolle der Sprache</li><li>Zugang zu Bildung und Arbeit</li><li>gesellschaftliche Teilhabe</li><li>Akzeptanz und Offenheit</li><li>Diskriminierung und Vorurteile</li><li>soziale Gerechtigkeit</li><li>Rechte und Pflichten</li><li>Identität und Zugehörigkeit</li><li>Verantwortung des Staates</li><li>Verantwortung der Gesellschaft</li></ul>
        <h3 style={sectionTitle}>Hinweise für deine Selbstpraxis</h3>
        <ul style={listSpacing}><li>Strukturiere deine Antwort klar.</li><li>Begründe deine Meinung differenziert.</li><li>Nenne mindestens ein konkretes Beispiel.</li><li>Berücksichtige auch die Gegenposition.</li><li>Achte auf passende Verknüpfungen und einen klaren Schluss.</li></ul>
        <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
          <strong>Speaking self-practice confidence check</strong>
          <p style={{ margin: 0 }}>Use this speaking self-practice tool to build confidence:</p>
          <a href="https://www.falowen.app/campus/speech" target="_blank" rel="noreferrer">Open speaking self-practice</a>
        </div>
        <SpeakingPracticeTimerCard />
        <p style={{ margin: 0, color: "#4b5563" }}>Teil 1 is for self-practice only. The speech trainer / brain map will help you generate ideas and organize your response.</p>
        <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
      </div>}

      {activeTab === "schreiben" && <div style={card}>
        <img src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80" alt="Learner writing a discussion text about social integration" loading="lazy" style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }} />
        <h2 style={sectionTitle}>Teil 2 (Schreiben) · Self-Practice</h2>
        <p style={{ margin: 0 }}><strong>Anleitung:</strong><br/>Schreibe einen Diskussionsbeitrag zum Thema:</p>
        <p style={{ margin: 0, lineHeight: 1.7 }}><strong>„Integration und Gesellschaft: Wie kann gesellschaftlicher Zusammenhalt langfristig gestärkt werden?“</strong></p>
        <p style={{ margin: 0 }}>In deinem Text sollst du:</p>
        <ul style={listSpacing}><li>erklären, warum Integration für moderne Gesellschaften wichtig ist</li><li>darstellen, welche Hindernisse das Zusammenleben erschweren können</li><li>beschreiben, welche Rolle Sprache, Bildung, Arbeit und Akzeptanz spielen</li><li>konkrete Maßnahmen vorschlagen, die Integration und gesellschaftlichen Zusammenhalt fördern könnten</li></ul>
        <h3 style={sectionTitle}>Hinweise zum Schreiben (C1)</h3>
        <ul style={listSpacing}><li>Schreibe mit klarer Einleitung, Hauptteil und Schluss.</li><li>Verwende differenzierte Argumente.</li><li>Zeige Zusammenhänge und nicht nur Einzelmeinungen.</li><li>Nutze passende Verknüpfungen und einen sachlichen Stil.</li><li>Überprüfe am Ende, ob deine Position klar und gut begründet ist.</li></ul>
        <p style={{ margin: 0 }}>Practice your draft before submission on the writing page: <a href="https://www.falowen.app/campus/writing" target="_blank" rel="noreferrer">Open Writing Practice</a></p>
        <p style={{ margin: 0 }}>You can use the Ideas Generator there for support.</p>
        <p style={{ margin: 0, color: "#4b5563" }}>Submit your final writing in the assignment submission area (same workflow as usual), not directly on this page.</p>
        <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
      </div>}

      {activeTab === "lesen" && <div style={card}>
        <img src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1600&q=80" alt="Person reading a policy article on migration and integration" loading="lazy" style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }} />
        <h2 style={sectionTitle}>Teil 3 (Lesen) · Self-Study</h2>
        <p style={{ margin: 0 }}>Anleitung: Lies den empfohlenen Artikel aufmerksam. Achte besonders auf die Hauptaussage, den Ton, wichtige Beispiele und die Perspektive des Autors.</p>
        <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
          <strong>Empfohlene Lektüre</strong>
          <p style={{ margin: 0 }}>Integration und Integrationspolitik in Deutschland<br/>Quelle: bpb<br/><a href="https://www.bpb.de/themen/migration-integration/regionalprofile/deutschland/344036/integration-und-integrationspolitik-in-deutschland/" target="_blank" rel="noreferrer">Open reading link</a></p>
        </div>
        <h3 style={sectionTitle}>Selbstevaluation</h3>
        <ul style={listSpacing}><li>Kann ich den Hauptgedanken kurz zusammenfassen?</li><li>Kann ich die Position des Autors erklären?</li><li>Kann ich mindestens zwei wichtige Aspekte nennen?</li><li>Kann ich meine eigene Meinung auf Deutsch dazu formulieren?</li></ul>
        <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
      </div>}

      {activeTab === "hoeren" && <div style={card}>
        <img src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1600&q=80" alt="Student listening to a podcast about integration policy" loading="lazy" style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }} />
        <h2 style={sectionTitle}>Teil 4 (Hören) · Self-Study</h2>
        <p style={{ margin: 0 }}>Anleitung: Höre den empfohlenen Beitrag aufmerksam. Konzentriere dich auf die Hauptaussage, die Argumentationsstruktur, den Ton und die wichtigsten Beispiele.</p>
        <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
          <strong>Empfohlenes Hören</strong>
          <p style={{ margin: 0 }}>Wie gelingt Integration? (1/4) – Ankommen und Bleiben<br/>Quelle: Deutschlandfunk<br/><a href="https://www.deutschlandfunk.de/wir-schaffen-das-nur-wie-folge-1-ankommen-und-bleiben-dlf-6d400df2-100.html" target="_blank" rel="noreferrer">Open listening link</a></p>
        </div>
        <h3 style={sectionTitle}>Selbstevaluation</h3>
        <ul style={listSpacing}><li>Kann ich die Kernaussage erklären?</li><li>Kann ich mindestens zwei wichtige Punkte wiedergeben?</li><li>Kann ich die Haltung oder Perspektive des Sprechers beschreiben?</li><li>Kann ich mündlich oder schriftlich auf den Beitrag reagieren?</li></ul>
        <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
      </div>}
    </div>
  );
};

export default C1Day10IntegrationUndGesellschaftWorkbookPage;
