import React, { useEffect, useState } from "react";
import AppBackButton from "../navigation/AppBackButton";

import { styles } from "../../styles";
import { EmbeddedPracticeNote, EmbeddedSpeechPracticePanel, EmbeddedWritingPracticePanel } from "./EmbeddedPracticePanels";

const DEFAULT_HERO = "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80";
const tabs = [["learn", "1. Learn"], ["speak", "2. Speak"], ["write", "3. Write"], ["finish", "4. Finish"]];
const card = { ...styles.card, display: "grid", gap: 14, border: "1px solid #e5e7eb", boxShadow: "0 10px 24px rgba(15,23,42,.06)" };
const listStyle = { margin: 0, paddingLeft: 20, lineHeight: 1.7 };

const Box = ({ title, children }) => <section style={card}><h2 style={{ margin: 0, fontSize: "1.15rem" }}>{title}</h2>{children}</section>;
const PracticeBox = ({ title, children }) => <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 14, background: "#fff", display: "grid", gap: 8 }}><strong>{title}</strong>{children}</div>;
const Note = ({ children, good }) => <div style={{ padding: 12, borderRadius: 12, border: `1px solid ${good ? "#bbf7d0" : "#bfdbfe"}`, background: good ? "#f0fdf4" : "#eff6ff", lineHeight: 1.7 }}>{children}</div>;
const renderList = (items = []) => items.length ? <ul style={listStyle}>{items.map((item) => <li key={item}>{item}</li>)}</ul> : null;

function writingTypeOf(lesson) {
  if (lesson.writingTaskType) return lesson.writingTaskType;
  const text = `${lesson.title || ""} ${lesson.topic || ""} ${lesson.tasks?.writing || ""}`.toLowerCase();
  if (/beschwerde|anfrage|bewerbung|einladung|termin|formell|brief|e-mail|email/.test(text)) return "Formal letter / E-Mail";
  if (/rezension|bewertung|empfehlung/.test(text)) return "Review / Recommendation";
  return "Opinion essay / Erörterung";
}

function ExternalCard({ title, resource }) {
  if (!resource) return null;
  return <PracticeBox title={title}>
    <p style={{ margin: 0, fontWeight: 600 }}>{resource.title}</p>
    {resource.description ? <p style={{ margin: 0, color: "#4b5563", lineHeight: 1.6 }}>{resource.description}</p> : null}
    {resource.url ? <a href={resource.url} target="_blank" rel="noreferrer" style={{ ...styles.linkButton, justifySelf: "start" }}>Open resource</a> : null}
    {renderList(resource.tasks || [])}
  </PracticeBox>;
}

export default function SelfLearningTabbedLessonPage({ lesson }) {
  const [tab, setTab] = useState("learn");
  const storageKey = `falowen:self-learning:lesson:${lesson.level}:${lesson.day}`;
  const [progress, setProgress] = useState(() => {
    try { return { understood: false, completed: false, ...JSON.parse(localStorage.getItem(storageKey) || "{}") }; }
    catch { return { understood: false, completed: false }; }
  });
  useEffect(() => localStorage.setItem(storageKey, JSON.stringify(progress)), [progress, storageKey]);
  const setP = (updates) => setProgress((old) => ({ ...old, ...updates }));
  const writingType = writingTypeOf(lesson);
  const speakingTopic = lesson.speakingTopic || lesson.tasks?.speaking || `Sprich über: ${lesson.topic}`;
  const writingTopic = lesson.writingTopic || lesson.tasks?.writing || `Schreibe über: ${lesson.title}`;

  return <div style={{ ...styles.container, display: "grid", gap: 16 }}>
    <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
    <header style={{ borderRadius: 20, overflow: "hidden", border: "1px solid #e5e7eb", boxShadow: "0 18px 40px rgba(15,23,42,.12)", background: "#fff" }}>
      <div style={{ minHeight: 250, backgroundImage: `linear-gradient(90deg, rgba(15,23,42,.88), rgba(15,23,42,.42)), url(${lesson.heroImage || DEFAULT_HERO})`, backgroundSize: "cover", backgroundPosition: "center", color: "#fff", padding: "28px clamp(18px,4vw,36px)", display: "grid", alignContent: "end", gap: 16 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={{ ...styles.levelPill, background: "rgba(255,255,255,.92)", color: "#1d4ed8" }}>{lesson.level}</span><span style={{ ...styles.levelPill, background: "rgba(255,255,255,.92)", color: "#1d4ed8" }}>Day {lesson.day}</span>{lesson.chapter ? <span style={{ ...styles.levelPill, background: "rgba(255,255,255,.92)", color: "#1d4ed8" }}>Chapter {lesson.chapter}</span> : null}<span style={{ ...styles.badge, background: "#dbeafe", color: "#1e40af" }}>AI self-learning</span>{progress.completed ? <span style={{ ...styles.badge, background: "#dcfce7", color: "#166534" }}>Complete</span> : null}
        </div>
        <h1 style={{ margin: 0, fontSize: "clamp(2rem,5vw,3.4rem)", lineHeight: 1.05 }}>{lesson.title}</h1>
        <p style={{ margin: 0, fontSize: "1.05rem", lineHeight: 1.6, color: "#e5e7eb" }}>{lesson.topic}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 10 }}>
          {[ ["Speaking", lesson.speakingTaskType || "Guided talk"], ["Writing", writingType], ["Progress", progress.completed ? "Completed" : "In progress"] ].map(([label, value]) => <div key={label} style={{ border: "1px solid rgba(255,255,255,.35)", background: "rgba(255,255,255,.88)", color: "#111827", borderRadius: 14, padding: 12, display: "grid", gap: 4 }}><span style={{ fontSize: 12, color: "#4b5563", fontWeight: 700 }}>{label}</span><strong>{value}</strong></div>)}
        </div>
      </div>
    </header>
    <div style={{ position: "sticky", top: 0, zIndex: 5, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 8, padding: "10px 0", background: "#f3f4f6" }}>{tabs.map(([id, label]) => <button key={id} type="button" style={tab === id ? styles.primaryButton : styles.secondaryButton} onClick={() => setTab(id)}>{label}</button>)}</div>

    {tab === "learn" ? <>
      <Box title="Daily mission"><Note><strong>No tutor submission for {lesson.level}.</strong> Learn, practise with AI, improve, and mark the day complete when you finish.</Note><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 10 }}><PracticeBox title="Sprechen topic"><p style={{ margin: 0 }}>{speakingTopic}</p></PracticeBox><PracticeBox title="Writing topic"><span style={{ ...styles.badge, justifySelf: "start" }}>{writingType}</span><p style={{ margin: 0 }}>{writingTopic}</p></PracticeBox></div></Box>
      <Box title="Ziele und Thema">{renderList(lesson.objectives || [])}{(lesson.explanation || []).map((p) => <p key={p} style={{ margin: 0, lineHeight: 1.7 }}>{p}</p>)}{lesson.topicQuestions?.length ? <PracticeBox title="Think before you answer">{renderList(lesson.topicQuestions)}</PracticeBox> : null}</Box>
      <Box title="Grammatik, Sprache und Redemittel">{lesson.grammarFocus ? <Note><strong>Fokus:</strong> {lesson.grammarFocus}</Note> : null}{lesson.grammarLesson?.rules?.length ? <PracticeBox title="Rules">{renderList(lesson.grammarLesson.rules)}</PracticeBox> : null}{lesson.grammarLesson?.examples?.length ? <PracticeBox title="Examples">{renderList(lesson.grammarLesson.examples)}</PracticeBox> : null}{lesson.grammarLesson?.miniExercise ? <PracticeBox title="Mini exercise"><p style={{ margin: 0 }}>{lesson.grammarLesson.miniExercise}</p></PracticeBox> : null}{lesson.phrases?.length ? <PracticeBox title="Useful phrases">{renderList(lesson.phrases)}</PracticeBox> : null}<label style={{ display: "flex", gap: 8 }}><input type="checkbox" checked={Boolean(progress.understood)} onChange={(e) => setP({ understood: e.target.checked })} /><span style={styles.label}>I understand the topic and prepared my ideas.</span></label></Box>
    </> : null}

    {tab === "speak" ? <Box title="Speaking builder"><PracticeBox title="Sprechen topic"><p style={{ margin: 0 }}>{speakingTopic}</p></PracticeBox>{lesson.speakingBuilder?.plan?.length ? <PracticeBox title="Speaking plan">{renderList(lesson.speakingBuilder.plan)}</PracticeBox> : null}{lesson.speakingBuilder?.starters?.length ? <PracticeBox title="Sentence starters">{renderList(lesson.speakingBuilder.starters)}</PracticeBox> : null}<EmbeddedPracticeNote>Use the embedded speaking coach below so you do not leave the lesson.</EmbeddedPracticeNote><EmbeddedSpeechPracticePanel /></Box> : null}

    {tab === "write" ? <Box title="Writing builder"><PracticeBox title="Writing topic"><span style={{ ...styles.badge, justifySelf: "start" }}>{writingType}</span><p style={{ margin: 0 }}>{writingTopic}</p></PracticeBox>{lesson.writingBuilder?.structure?.length ? <PracticeBox title="Writing structure">{renderList(lesson.writingBuilder.structure)}</PracticeBox> : null}{lesson.writingBuilder?.usefulLines?.length ? <PracticeBox title="Useful lines">{renderList(lesson.writingBuilder.usefulLines)}</PracticeBox> : null}<EmbeddedPracticeNote>Use the embedded writing marker below and paste this lesson topic into the writing box.</EmbeddedPracticeNote><EmbeddedWritingPracticePanel /></Box> : null}

    {tab === "finish" ? <>
      <Box title="Lesen, Hören und Wortschatz"><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 10 }}><ExternalCard title="Recommended reading" resource={lesson.readingResource} /><ExternalCard title="Recommended listening" resource={lesson.listeningResource} /></div><strong>Vocabulary builder</strong><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{(lesson.vocabulary || []).map((w) => <span key={w} style={{ ...styles.badge, background: "#eef2ff", color: "#3730a3" }}>{w}</span>)}</div></Box>
      <Box title="Complete this day"><Note good={progress.completed}>{progress.completed ? "This day is marked as complete." : "When you finish learning, speaking, writing, reading and listening practice, mark this day as complete."}</Note><button type="button" style={styles.primaryButton} onClick={() => setP({ completed: true })}>{progress.completed ? "Completed" : "Mark as complete"}</button></Box>
    </> : null}
  </div>;
}
