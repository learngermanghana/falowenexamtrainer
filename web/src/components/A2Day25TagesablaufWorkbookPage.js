import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import SpeakingPracticeTimerCard from "./SpeakingPracticeTimerCard";

const tabs = [
  { key: "sprechen", label: "Teil 1 · Sprechen (Group Practice No assignment)" },
  { key: "schreiben", label: "Teil 2 · Schreiben" },
  { key: "lesen", label: "Teil 3 · Lesen" },
  { key: "hoeren", label: "Teil 4 · Hören" },
];

const card = { ...styles.card, display: "grid", gap: 12 };
const sectionTitle = { margin: 0, fontSize: "1.1rem" };
const listSpacing = { margin: 0, paddingLeft: 20, lineHeight: 1.7 };
const questionCardStyle = { border: "1px solid #e5e7eb", borderRadius: 10, padding: 12, background: "#fff", display: "grid", gap: 6 };
const calloutStyle = { ...questionCardStyle, background: "#f8fafc" };
const videoPreviewStyle = { width: "100%", minHeight: 315, border: 0, borderRadius: 10 };

const lesenQuestions = [
  { stem: "Wann steht Karim normalerweise auf?", options: ["A) Um 5:30 Uhr", "B) Um 6:30 Uhr", "C) Um 7:30 Uhr", "D) Um 8:30 Uhr"] },
  { stem: "Was macht er vor der Arbeit?", options: ["A) Er geht joggen", "B) Er trinkt Kaffee", "C) Er liest Zeitung", "D) Er fährt Fahrrad"] },
  { stem: "Wie fährt Karim zur Arbeit?", options: ["A) Mit dem Zug", "B) Mit dem Fahrrad", "C) Mit dem Auto", "D) Zu Fuß"] },
  { stem: "Was macht er in der Mittagspause?", options: ["A) Er kocht", "B) Er telefoniert", "C) Er isst mit Kolleginnen und Kollegen", "D) Er schläft"] },
];

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

export default function A2Day25TagesablaufWorkbookPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sprechen");
  const [teacherMode, setTeacherMode] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [prepared, setPrepared] = useState({ sprechen: false, schreiben: false, lesen: false, hoeren: false });

  const activeIndex = useMemo(() => tabs.findIndex((tab) => tab.key === activeTab), [activeTab]);
  const setPreparedFor = (tabKey) => (event) => setPrepared((prev) => ({ ...prev, [tabKey]: event.target.checked }));

  return <div style={{ ...styles.container, display: "grid", gap: 16 }}>
    <div style={card}>
      <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>Back to Course</button>
      <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 · Day 25 Workbook · Tagesablauf 9.25</h1>
      <p style={{ ...styles.subtitle, margin: 0 }}>4-part workbook: speaking, writing, reading, and listening practice about daily routines.</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{tabs.map((tab) => <TabButton key={tab.key} active={tab.key === activeTab} onClick={() => setActiveTab(tab.key)}>{tab.label}</TabButton>)}</div>
      <p style={{ margin: 0, color: "#4b5563" }}>Tab {activeIndex + 1} of {tabs.length}</p>
    </div>

    {activeTab === "sprechen" && <div style={card}><img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80" alt="Students discussing their day in class" loading="lazy" style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }} />
      <h2 style={sectionTitle}>Teil 1 (Sprechen) · Group Practice</h2>
      <p style={{ margin: 0, lineHeight: 1.7 }}>In this chapter, we&apos;ll engage in group exercises discussing these topics.</p>
      <h3 style={{ ...sectionTitle, fontSize: "1rem" }}>Instructions</h3>
      <ol style={listSpacing}>
        <li><strong>Central Topic:</strong> Write <strong>„Tagesablauf“</strong> in the center of your brain map.</li>
        <li><strong>Main Branches:</strong> Create six main branches:
          <ul style={listSpacing}>
            <li>Morgenroutine (Morning Routine)</li>
            <li>Arbeit/Schule (Work/School)</li>
            <li>Mittagspause (Lunch Break)</li>
            <li>Nachmittag (Afternoon)</li>
            <li>Abendroutine (Evening Routine)</li>
            <li>Freizeit und Hobbys (Free Time and Hobbies)</li>
          </ul>
        </li>
        <li><strong>Sub-Branches:</strong> Expand each branch with examples and phrases.</li>
      </ol>
      <h3 style={{ ...sectionTitle, fontSize: "1rem" }}>Example Brain Map</h3>
      <ol style={listSpacing}>
        <li><strong>Morgenroutine (Morning Routine)</strong>
          <ul style={listSpacing}><li>Aufstehen (getting up)</li><li>Zähne putzen (brushing teeth)</li><li>Duschen (showering)</li><li>Frühstücken (having breakfast)</li><li>Anziehen (getting dressed)</li><li>Zur Arbeit oder zur Schule gehen (going to work or school)</li></ul>
        </li>
        <li><strong>Arbeit/Schule (Work/School)</strong>
          <ul style={listSpacing}><li>Arbeiten (working)</li><li>E-Mails schreiben (writing emails)</li><li>An Meetings teilnehmen (attending meetings)</li><li>Unterricht haben (having lessons)</li><li>Hausaufgaben machen (doing homework)</li><li>Pause machen (taking a break)</li></ul>
        </li>
        <li><strong>Mittagspause (Lunch Break)</strong>
          <ul style={listSpacing}><li>Mittagessen essen (eating lunch)</li><li>Mit Kollegen oder Freunden sprechen (talking with colleagues or friends)</li><li>Einkaufen gehen (going shopping)</li><li>Spazieren gehen (taking a walk)</li></ul>
        </li>
        <li><strong>Nachmittag (Afternoon)</strong>
          <ul style={listSpacing}><li>Weiterarbeiten (continuing work)</li><li>Sport treiben (doing sports)</li><li>Termine haben (having appointments)</li><li>Kaffee trinken (having coffee)</li></ul>
        </li>
        <li><strong>Abendroutine (Evening Routine)</strong>
          <ul style={listSpacing}><li>Abendessen kochen (cooking dinner)</li><li>Nachrichten schauen (watching the news)</li><li>Entspannen (relaxing)</li><li>Duschen oder baden (taking a shower or bath)</li><li>Ins Bett gehen (going to bed)</li></ul>
        </li>
        <li><strong>Freizeit und Hobbys (Free Time and Hobbies)</strong>
          <ul style={listSpacing}><li>Bücher lesen (reading books)</li><li>Musik hören (listening to music)</li><li>Filme oder Serien schauen (watching movies or series)</li><li>Spazieren gehen (going for a walk)</li><li>Freunde treffen (meeting friends)</li><li>Ein Instrument spielen (playing an instrument)</li></ul>
        </li>
      </ol>
      <h3 style={{ ...sectionTitle, fontSize: "1rem" }}>Topic for Discussion</h3>
      <p style={{ margin: 0 }}>Wie sieht dein Tagesablauf aus?</p>
      <p style={{ margin: 0 }}><strong>Keywords:</strong> aufstehen, arbeiten/lernen, essen, Freizeit</p>
      <div style={calloutStyle}><strong>Speaking self-practice confidence check</strong><p style={{ margin: 0 }}>Use this speaking self-practice tool to build confidence before class:</p><a href="https://www.falowen.app/campus/speech" target="_blank" rel="noreferrer">Open speaking self-practice</a></div>
      <SpeakingPracticeTimerCard />
      <p style={{ margin: 0, color: "#4b5563" }}>Teil 1 is for group practice only and has no assignment submission.</p>
      <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
    </div>}

    {activeTab === "schreiben" && <div style={card}><img src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80" alt="Learner writing about a daily schedule" loading="lazy" style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }} />
      <h2 style={sectionTitle}>Teil 2 · Schreiben</h2>
      <p style={{ margin: 0 }}>Schreibe eine E-Mail an deine Freundin oder deinen Freund über deinen Tagesablauf.</p>
      <ol style={listSpacing}><li>Beschreibe deinen Morgen und deinen Arbeits- oder Schultag.</li><li>Erzähle, was du am Abend machst.</li><li>Frage nach dem Tagesablauf deiner Freundin oder deines Freundes.</li></ol>
      <div style={calloutStyle}><strong>Writing practice guidance</strong><p style={{ margin: 0 }}>Write a first draft, improve structure and connectors, and submit your final answer in the assignment submission area — not directly on this page.</p><p style={{ margin: 0 }}>Practice before submitting on the writing page: <a href="https://www.falowen.app/campus/writing" target="_blank" rel="noreferrer">Open Writing Practice</a> (learners can use the Ideas Generator there for support).</p></div>
      <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
    </div>}

    {activeTab === "lesen" && <div style={card}><img src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80" alt="Reading comprehension exercise on a desk" loading="lazy" style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }} />
      <h2 style={sectionTitle}>Teil 3 · Lesen</h2><p style={{ margin: 0 }}>Lies den Text und beantworte die Fragen im Submission-Bereich.</p>
      <p style={{ margin: 0, lineHeight: 1.7 }}>Karim steht normalerweise um 6:30 Uhr auf. Zuerst trinkt er einen Kaffee und frühstückt. Um 7:30 Uhr fährt er mit dem Zug zur Arbeit. In der Mittagspause isst er mit seinen Kolleginnen und Kollegen. Nach der Arbeit geht er oft einkaufen und kocht am Abend zu Hause. Gegen 22:30 Uhr geht er schlafen.</p>
      {lesenQuestions.map((q, i) => <div key={q.stem} style={questionCardStyle}><strong>{i + 1}. {q.stem}</strong>{q.options.map((opt) => <span key={opt}>{opt}</span>)}</div>)}
      <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
    </div>}

    {activeTab === "hoeren" && <div style={card}><img src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1600&q=80" alt="Student listening to a lesson with headphones" loading="lazy" style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }} />
      <h2 style={sectionTitle}>Teil 4 · Hören</h2>
      <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><input type="checkbox" checked={teacherMode} onChange={(e) => setTeacherMode(e.target.checked)} />Teacher mode</label>
      <iframe title="Tagesablauf listening video" src="https://www.youtube.com/embed/NxoQH-BY9Js" style={videoPreviewStyle} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
      <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => setShowTranscript((prev) => !prev)}>{showTranscript ? "Hide transcript" : "Reveal transcript"}</button>
      {(teacherMode || showTranscript) && <div style={calloutStyle}><strong>Transcript</strong><p style={{ margin: 0 }}>Hallo! Ich heiße Nina. Ich stehe um sieben Uhr auf ... (teacher can guide learners to summarize key routine steps and time expressions).</p></div>}
      <p style={{ margin: 0, color: "#4b5563" }}>Listen first, take notes, and submit final answers in the submission area.</p>
      <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
    </div>}
  </div>;
}
