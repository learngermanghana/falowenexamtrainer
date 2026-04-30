import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
const videoPreviewStyle = { width: "100%", minHeight: 315, border: 0, borderRadius: 10 };

const lesenQuestions = [
  { stem: "Welche zentrale These vertritt der Autor zur Integrationspolitik?", options: ["A) Integration gelingt ausschließlich durch Sprachkurse", "B) Integration ist ein wechselseitiger gesellschaftlicher Prozess", "C) Integration ist primär eine Sicherheitsfrage", "D) Integration ist vor allem eine wirtschaftliche Belastung"] },
  { stem: "Welcher Ton prägt den Beitrag insgesamt?", options: ["A) Polemisch und abwertend", "B) Nüchtern-analytisch mit normativer Bewertung", "C) Satirisch-ironisch", "D) Rein emotional und persönlich"] },
  { stem: "Welche implizite Annahme liegt der Argumentation zugrunde?", options: ["A) Kulturelle Identität ist statisch", "B) Soziale Teilhabe setzt institutionelle Zugänge voraus", "C) Migration ist ein temporäres Phänomen", "D) Medienberichte sind grundsätzlich neutral"] },
  { stem: "Welche Funktion hat das angeführte Beispiel aus der Kommunalpolitik?", options: ["A) Es widerlegt die Hauptthese", "B) Es konkretisiert strukturelle Herausforderungen", "C) Es dient nur der Unterhaltung", "D) Es ersetzt empirische Belege vollständig"] },
  { stem: "Was ist die wahrscheinlichste Intention des Autors?", options: ["A) Leser zu einer differenzierten Debatte motivieren", "B) Eine Parteiempfehlung aussprechen", "C) Statistische Methoden erklären", "D) Eine historische Chronik liefern"] },
];

const hoerenQuestions = [
  { stem: "Welche Hauptaussage macht die Expertin im Interview?", options: ["A) Integration sollte vollständig privatisiert werden", "B) Nachhaltige Integration erfordert institutionelle Kooperation", "C) Migration lässt sich politisch nicht gestalten", "D) Sprachförderung ist überbewertet"] },
  { stem: "Woran erkennt man laut Beitrag eine gelungene Integrationsstrategie?", options: ["A) An sinkenden Mieten", "B) An stabilen Partizipations- und Bildungsdaten", "C) An höheren Exportzahlen", "D) An weniger Medienberichten"] },
  { stem: "Welche Perspektive wird im Kommentar kritisch hinterfragt?", options: ["A) Integration als Einbahnstraße", "B) Kommunale Bildungsprogramme", "C) Mehrsprachigkeit im Alltag", "D) Ehrenamtliches Engagement"] },
  { stem: "Welche Rolle spielen Arbeitgeber laut Audio?", options: ["A) Keine, weil Integration rein staatlich ist", "B) Eine ergänzende Rolle beim beruflichen Einstieg", "C) Nur eine finanzielle Rolle", "D) Ausschließlich eine juristische Rolle"] },
  { stem: "Welche Schlussfolgerung legt der Beitrag nahe?", options: ["A) Integration ist kurzfristig abschließbar", "B) Differenzierte Maßnahmen sind wirksamer als pauschale Forderungen", "C) Kulturelle Vielfalt verhindert sozialen Zusammenhalt", "D) Medien sollten das Thema vermeiden"] },
];

function TabButton({ active, onClick, children }) { return <button onClick={onClick} style={{ ...styles.secondaryButton, borderColor: active ? "#2563eb" : "#d1d5db", background: active ? "#eff6ff" : "#fff", color: active ? "#1d4ed8" : "#111827" }}>{children}</button>; }
const PreparedCheckbox = ({ checked, onChange }) => <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}><input type="checkbox" checked={checked} onChange={onChange} />I prepared this part.</label>;

const C1Day10MigrationUndIntegrationWorkbookPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sprechen");
  const [teacherMode, setTeacherMode] = useState(false);
  const [prepared, setPrepared] = useState({ sprechen: false, schreiben: false, lesen: false, hoeren: false });
  const activeIndex = useMemo(() => tabs.findIndex((tab) => tab.key === activeTab), [activeTab]);
  const setPreparedFor = (tabKey) => (event) => setPrepared((prev) => ({ ...prev, [tabKey]: event.target.checked }));

  return <div style={{ ...styles.container, display: "grid", gap: 16 }}>
    <div style={card}>
      <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>Back to Course</button>
      <h1 style={{ ...styles.title, marginBottom: 0 }}>C1 · Day 10 Workbook · Migration und Integration</h1>
      <p style={{ ...styles.subtitle, margin: 0 }}>4-part workbook: advanced speaking, writing, reading and listening practice at C1 level.</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{tabs.map((tab) => <TabButton key={tab.key} active={tab.key === activeTab} onClick={() => setActiveTab(tab.key)}>{tab.label}</TabButton>)}</div>
      <p style={{ margin: 0, color: "#4b5563" }}>Tab {activeIndex + 1} of {tabs.length}</p>
    </div>

    {activeTab === "sprechen" && <div style={card}>
      <img src="https://images.unsplash.com/photo-1529078155058-5d716f45d604?auto=format&fit=crop&w=1600&q=80" alt="Diskussion über Migration und Integration in einem Seminarraum" loading="lazy" style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }} />
      <h2 style={sectionTitle}>Teil 1 (Sprechen) · Group Practice No assignment</h2>
      <p style={{ margin: 0, lineHeight: 1.7 }}>Bereiten Sie eine differenzierte Diskussion zum Thema <strong>Migration und Integration</strong> vor. Arbeiten Sie mit evidenzbasierten Argumenten, Gegenpositionen und reflektierten Schlussfolgerungen.</p>
      <h3 style={sectionTitle}>Diskussionsimpulse (C1)</h3>
      <ul style={listSpacing}><li>Welche politischen Maßnahmen fördern langfristige Teilhabe messbar?</li><li>Wie lassen sich gesellschaftlicher Zusammenhalt und kulturelle Pluralität gleichzeitig stärken?</li><li>Welche Rolle spielen Sprache, Arbeitsmarkt, Bildung und Wohnraum als Integrationsfaktoren?</li><li>Wo liegen Grenzen zwischen Integrationsanforderung und individueller Selbstbestimmung?</li></ul>
      <h3 style={sectionTitle}>Mini-Präsentation (C1)</h3>
      <ul style={listSpacing}><li><strong>Einleitung:</strong> Präzisieren Sie Ihre Leitfrage und definieren Sie zentrale Begriffe.</li><li><strong>Hauptteil:</strong> Entwickeln Sie zwei bis drei Argumentlinien mit Belegen und Gegenargumenten.</li><li><strong>Schluss:</strong> Formulieren Sie ein begründetes Fazit mit konkreter Handlungsperspektive.</li></ul>
      <div style={{ ...questionCardStyle, background: "#f8fafc" }}><strong>Speaking self-practice confidence check</strong><p style={{ margin: 0 }}>Use this speaking self-practice tool to build confidence before class:</p><a href="https://www.falowen.app/campus/speech" target="_blank" rel="noreferrer">Open speaking self-practice</a></div>
      <SpeakingPracticeTimerCard />
      <p style={{ margin: 0, color: "#4b5563" }}>Teil 1 is for preparation and speaking practice only; there is no assignment submission on this page.</p>
      <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
    </div>}

    {activeTab === "schreiben" && <div style={card}>
      <img src="https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1600&q=80" alt="Schreibarbeit zu gesellschaftspolitischen Themen am Schreibtisch" loading="lazy" style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }} />
      <h2 style={sectionTitle}>Teil 2 (Schreiben) · Exercise</h2>
      <p style={{ margin: 0, lineHeight: 1.7 }}><strong>Anleitung:</strong> Verfassen Sie eine semi-formelle Stellungnahme für ein kommunales Diskussionsforum zum Thema „Integration zwischen Anspruch und Realität“.</p>
      <ol style={listSpacing}><li>Formulieren Sie eine klare These und erläutern Sie den gesellschaftlichen Kontext.</li><li>Argumentieren Sie strukturiert mit mindestens zwei differenzierten Hauptargumenten und einem Gegenargument.</li><li>Schließen Sie mit einer umsetzbaren Empfehlung für Kommune, Bildungsträger oder Arbeitgeber.</li></ol>
      <p style={{ margin: 0, color: "#4b5563" }}>Submit your final writing in the assignment submission area (same workflow as usual), not directly on this page.</p>
      <p style={{ margin: 0 }}>Practice your draft before submission on the writing page: <a href="https://www.falowen.app/campus/writing" target="_blank" rel="noreferrer">Open Writing Practice</a> (you can use the Ideas Generator there for support).</p>
      <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
    </div>}

    {activeTab === "lesen" && <div style={card}>
      <img src="https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1600&q=80" alt="Zeitungslektüre zu gesellschaftlichen Debatten" loading="lazy" style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }} />
      <h2 style={sectionTitle}>Teil 3 (Lesen)</h2>
      <p style={{ margin: 0 }}>Read the article first, then answer the questions below. <strong>Do not answer directly on this page.</strong> Use the submit section at the bottom of the lesson to send your answers.</p>
      <h3 style={sectionTitle}>Leseempfehlungen (extern)</h3>
      <ul style={listSpacing}>
        <li><strong>Migration in Deutschland: Was Integration heute leisten muss</strong> · Deutsche Welle · <a href="https://www.dw.com/de/migration-in-deutschland-was-integration-heute-leisten-muss/a-70658610" target="_blank" rel="noreferrer">Artikel öffnen</a></li>
        <li><strong>Integration: Warum Sprache allein nicht reicht</strong> · tagesschau.de · <a href="https://www.tagesschau.de/inland/gesellschaft/integration-sprache-100.html" target="_blank" rel="noreferrer">Artikel öffnen</a></li>
        <li><strong>Zuwanderung und Zusammenhalt: Kommunen unter Druck</strong> · DIE WELT · <a href="https://www.welt.de/politik/deutschland/article252579170/Zuwanderung-und-Zusammenhalt-Kommunen-unter-Druck.html" target="_blank" rel="noreferrer">Artikel öffnen</a></li>
      </ul>
      <h3 style={sectionTitle}>Fragen und mögliche Antworten</h3>
      {lesenQuestions.map((question, index) => <div key={question.stem} style={questionCardStyle}><strong>{index + 1}. {question.stem}</strong>{question.options.map((option) => <span key={option}>{option}</span>)}</div>)}
      <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
    </div>}

    {activeTab === "hoeren" && <div style={card}>
      <img src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1600&q=80" alt="Podcast-Hören zu Politik und Gesellschaft" loading="lazy" style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }} />
      <h2 style={sectionTitle}>Teil 4 (Hören)</h2>
      <p style={{ margin: 0 }}>Listen to the audio/video, then submit your answers in the assignment area (do not answer directly on this page).</p>
      <p style={{ margin: 0 }}>Audio link: <a href="https://youtu.be/3WQ8kQH7x2M" target="_blank" rel="noreferrer">Open Teil 4 source</a></p>
      <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}><input type="checkbox" checked={teacherMode} onChange={(event) => setTeacherMode(event.target.checked)} />Teacher mode (show transcript)</label>
      {teacherMode && <div style={{ ...questionCardStyle, background: "#fefce8" }}><strong>Transcript (teacher support)</strong><p style={{ margin: 0, lineHeight: 1.6 }}>Im Beitrag wird betont, dass Integration als langfristiger Prozess verstanden werden muss. Die Expertin argumentiert, dass Sprachförderung nur dann nachhaltig wirkt, wenn sie mit Bildungszugängen, beruflicher Qualifizierung und lokaler Netzwerkarbeit kombiniert wird. Zudem wird die Verantwortung von Kommunen, Betrieben und Zivilgesellschaft als gemeinsamer Handlungsrahmen dargestellt.</p></div>}
      <h3 style={sectionTitle}>Fragen und mögliche Antworten</h3>
      {hoerenQuestions.map((question, index) => <div key={question.stem} style={questionCardStyle}><strong>{index + 1}. {question.stem}</strong>{question.options.map((option) => <span key={option}>{option}</span>)}</div>)}
      <p style={{ margin: 0 }}>Recommended listening video: <a href="https://youtu.be/3WQ8kQH7x2M" target="_blank" rel="noreferrer">Migration und Integration in Deutschland | Hintergrundgespräch</a></p>
      <iframe style={videoPreviewStyle} src="https://www.youtube.com/embed/3WQ8kQH7x2M" title="Migration und Integration in Deutschland | Hintergrundgespräch" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
      <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
    </div>}
  </div>;
};

export default C1Day10MigrationUndIntegrationWorkbookPage;
