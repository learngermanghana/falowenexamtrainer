import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AppBackButton from "./navigation/AppBackButton";
import B2Day1IdentityGrammarNotes from "./B2Day1IdentityGrammarNotes";
import B2Day2To4GrammarNotes from "./B2Day2To4GrammarNotes";
import B2Day5HealthGrammarNotes from "./B2Day5HealthGrammarNotes";
import B2Day6MigrationIntegrationGrammarNotes from "./B2Day6MigrationIntegrationGrammarNotes";
import B2Day14To16GrammarNotes from "./B2Day14To16GrammarNotes";
import B2KnowledgeChoicePractice from "./B2KnowledgeChoicePractice";
import B2SpeakingSupportGuide from "./B2SpeakingSupportGuide";
import FalowenRadioTabContent from "./FalowenRadioTabContent";
import { EmbeddedSpeechPracticePanel } from "./selfLearning/EmbeddedPracticePanels";
import GuidedWritingWorkspace from "./GuidedWritingWorkspace";
import WritingCheatSheetTabs from "./WritingCheatSheetTabs";
import WritingTaskPrompt from "./WritingTaskPrompt";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import {
  getStandardLessonStorageKey,
  getStandardWritingCloudField,
  getStandardWritingConfig,
} from "../data/standardLessonJourney";
import { styles } from "../styles";

const tabs = ["learn", "speak", "write", "finish", "references"];
const labels = { learn: "1. Learn", speak: "2. Speak", write: "3. Write", finish: "4. Finish", references: "5. Ref" };
const card = { ...styles.card, display: "grid", gap: 14, border: "1px solid #e2e8f0", borderRadius: 18, boxShadow: "0 10px 26px rgba(15,23,42,.06)" };
const fieldLabel = { display: "flex", gap: 9, alignItems: "center", fontWeight: 800 };
const listStyle = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };

const Section = ({ title, children }) => <section style={card}><h2 style={{ margin: 0, fontSize: "1.2rem" }}>{title}</h2>{children}</section>;

const NoteBox = ({ children, tone = "blue" }) => {
  const tones = { blue: ["#bfdbfe", "#eff6ff", "#1e3a8a"], green: ["#bbf7d0", "#f0fdf4", "#14532d"], amber: ["#fde68a", "#fffbeb", "#92400e"] };
  const [border, background, color] = tones[tone] || tones.blue;
  return <div style={{ border: `1px solid ${border}`, borderRadius: 14, padding: 12, background, color, lineHeight: 1.65 }}>{children}</div>;
};

const embedUrl = (url = "") => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    const id = host === "youtu.be" ? parsed.pathname.replace(/^\//, "") : parsed.searchParams.get("v") || parsed.pathname.split("/").filter(Boolean).pop();
    return id ? `https://www.youtube.com/embed/${id}` : "";
  } catch {
    return "";
  }
};

const GrammarNotes = ({ lesson, checked, onCheckedChange }) => {
  const day = Number(lesson.day);
  if (day === 1) return <B2Day1IdentityGrammarNotes checked={checked} onCheckedChange={onCheckedChange} />;
  if (day === 5) return <B2Day5HealthGrammarNotes checked={checked} onCheckedChange={onCheckedChange} />;
  if (day === 6) return <B2Day6MigrationIntegrationGrammarNotes checked={checked} onCheckedChange={onCheckedChange} />;
  if (day >= 14 && day <= 16) return <B2Day14To16GrammarNotes day={day} checked={checked} onCheckedChange={onCheckedChange} />;
  return <B2Day2To4GrammarNotes day={day} checked={checked} onCheckedChange={onCheckedChange} />;
};

const GermanyLifeMiniLesson = ({ lesson }) => {
  const lower = `${lesson?.title || ""} ${lesson?.topic || ""}`.toLowerCase();
  let intro = "Verbinde das Thema mit einer konkreten Alltagssituation in Deutschland und vergleiche sie mit eigenen Erfahrungen.";
  let points = ["Nenne eine konkrete Situation.", "Erkläre einen Vorteil oder ein Problem.", "Bewerte, welche Lösung sinnvoll ist."];
  let vocabulary = ["der Alltag", "die Erfahrung", "die Möglichkeit", "der Vorteil", "die Lösung"];
  if (/beruf|arbeit|karriere/.test(lower)) {
    intro = "In Deutschland sind Ausbildung, Berufserfahrung und Weiterbildung wichtige Wege in qualifizierte Beschäftigung.";
    points = ["Die duale Ausbildung verbindet Betrieb und Berufsschule.", "Weiterbildung kann neue berufliche Chancen eröffnen.", "Digitale Kompetenzen werden in vielen Berufen wichtiger."];
    vocabulary = ["die Ausbildung", "die Weiterbildung", "die Fachkraft", "die Berufserfahrung", "die Qualifikation"];
  } else if (/gesund|wohlbefinden|stress|sport/.test(lower)) {
    intro = "Gesundheit wird im deutschen Alltag mit Prävention, Arbeitsbedingungen, Bewegung und Erholung verbunden.";
    points = ["Stress kann Leistung und Gesundheit beeinträchtigen.", "Sport und Erholung können einen Ausgleich schaffen.", "Arbeitgeber können gesundheitsfördernde Maßnahmen anbieten."];
    vocabulary = ["die Erholung", "die Belastung", "die Gesundheit", "die Bewegung", "die Prävention"];
  } else if (/beziehung|kommunikation/.test(lower)) {
    intro = "Klare und respektvolle Kommunikation spielt in Familie, Freundschaft, Nachbarschaft und Arbeitsleben eine wichtige Rolle.";
    points = ["Missverständnisse entstehen oft durch unklare Erwartungen.", "Höfliche Bitten können Konflikte entschärfen.", "Persönliche Gespräche sind bei schwierigen Themen oft hilfreicher als kurze Nachrichten."];
    vocabulary = ["das Missverständnis", "die Beziehung", "die Bitte", "der Konflikt", "das Verständnis"];
  }
  return <div style={{ border: "1px solid #bfdbfe", borderRadius: 16, padding: 14, background: "#eff6ff", display: "grid", gap: 10 }}><h3 style={{ margin: 0 }}>Deutschland-Bezug</h3><p style={{ margin: 0, lineHeight: 1.7 }}>{intro}</p><ul style={listStyle}>{points.map((item) => <li key={item}>{item}</li>)}</ul><div><strong>Wortschatz:</strong> {vocabulary.join(" · ")}</div></div>;
};

const ResourceButton = ({ href, children }) => {
  if (!href) return null;
  const external = !String(href).startsWith("/");
  return <a href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})} style={{ ...styles.linkButton, width: "fit-content" }}>{children}</a>;
};

export default function B2Day1To4GuidedLessonPage({ lesson, canonicalLesson = null }) {
  const location = useLocation();
  const { showToast } = useToast();
  const { studentProfile, user } = useAuth();
  const day = Number(lesson.day);
  const radio = canonicalLesson?.resources?.falowenRadio || null;
  const [entered, setEntered] = useState(() => !radio);
  const [active, setActive] = useState("learn");
  const [, setWriting] = useState({ complete: false, completedQuestions: 0, totalQuestions: 5, wordCount: 0 });
  const storageKey = getStandardLessonStorageKey(lesson, "progress");
  const [progress, setProgress] = useState(() => {
    try {
      return { learnDone: false, quizDone: false, speakDone: false, confidence: "", reflection: "", completed: false, ...JSON.parse(localStorage.getItem(storageKey) || "{}") };
    } catch {
      return { learnDone: false, quizDone: false, speakDone: false, confidence: "", reflection: "", completed: false };
    }
  });

  useEffect(() => localStorage.setItem(storageKey, JSON.stringify(progress)), [progress, storageKey]);

  if (!entered && radio) {
    return <div style={{ ...styles.container, display: "grid", gap: 18 }}><AppBackButton label="Back to Course Book" fallbackPath="/campus/course" /><header style={{ ...card, borderColor: "#bfdbfe", background: "linear-gradient(135deg,#eff6ff,#f8fafc)" }}><span style={{ ...styles.badge, width: "fit-content", background: "#dbeafe", color: "#1e3a8a" }}>Start here</span><h1 style={{ margin: 0 }}>B2 · Day {day} · {lesson.title}</h1><p style={{ margin: 0, color: "#475569" }}>Listen to Falowen Radio first. Continue opens Learn, Speak, Write and Finish.</p></header><FalowenRadioTabContent level="B2" day={day} resource={radio} onContinue={() => { setEntered(true); window.scrollTo({ top: 0, behavior: "smooth" }); }} /></div>;
  }

  const video = lesson.videoResource || canonicalLesson?.resources?.aiVideo || canonicalLesson?.resources?.teacherVideo || null;
  const videoEmbed = embedUrl(video?.url);
  const workbookUrl = canonicalLesson?.resources?.workbook?.url || lesson.resources?.workbook?.url || "";

  const finish = () => {
    const completedAt = new Date().toISOString();
    setProgress((old) => ({ ...old, completed: true, completedAt }));
    const studentCode = studentProfile?.studentCode || studentProfile?.studentcode || studentProfile?.id || user?.uid || "student";
    const assignmentKey = location.state?.assignmentKey;
    if (assignmentKey && typeof window !== "undefined") {
      const practiceStorageKey = `coursePracticeProgress:${studentCode}:B2`;
      const saved = JSON.parse(window.localStorage.getItem(practiceStorageKey) || "{}");
      window.localStorage.setItem(practiceStorageKey, JSON.stringify({ ...saved, [assignmentKey]: { ...(saved[assignmentKey] || {}), completed: true, completedAt, updatedAt: completedAt } }));
    }
    showToast(`B2 Day ${day} completed. Your progress was saved.`, "success");
  };

  return <div style={{ ...styles.container, display: "grid", gap: 18 }}>
    <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
    <header style={{ borderRadius: 22, overflow: "hidden", color: "#fff", backgroundImage: `linear-gradient(135deg,rgba(2,6,23,.94),rgba(30,64,175,.72)),url(${lesson.heroImage || ""})`, backgroundSize: "cover", backgroundPosition: "center", padding: "clamp(22px,4vw,42px)", display: "grid", gap: 16, minHeight: 280, alignContent: "space-between" }}><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><span style={{ ...styles.badge, background: "rgba(255,255,255,.16)", color: "#fff" }}>B2</span><span style={{ ...styles.badge, background: "rgba(255,255,255,.16)", color: "#fff" }}>Day {day}</span><span style={{ ...styles.badge, background: "rgba(37,99,235,.9)", color: "#fff" }}>Chapter {lesson.chapter}</span></div><div><h1 style={{ margin: 0, fontSize: "clamp(2rem,5vw,3.6rem)" }}>{lesson.title}</h1><p style={{ margin: "10px 0 0", color: "#e2e8f0" }}>{lesson.topic}</p></div></header>
    <div style={{ position: "sticky", top: 0, zIndex: 5, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 8, padding: 10, border: "1px solid #e2e8f0", borderRadius: 18, background: "rgba(248,250,252,.94)" }}>{tabs.map((tab) => <button key={tab} type="button" onClick={() => setActive(tab)} style={{ ...(active === tab ? styles.primaryButton : styles.secondaryButton), borderRadius: 999, minHeight: 44 }}>{labels[tab]}</button>)}</div>

    {active === "learn" ? <><Section title="AI video">{video?.url ? <div style={{ display: "grid", gap: 10 }}><strong>{video.title || "Lesson video"}</strong>{video.description ? <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>{video.description}</p> : null}{videoEmbed ? <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", borderRadius: 16, overflow: "hidden", background: "#0f172a" }}><iframe title={video.title || "B2 lesson video"} src={videoEmbed} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} /></div> : null}</div> : <NoteBox tone="amber">No dedicated AI video has been added yet. Continue with the guided grammar notes.</NoteBox>}</Section><GrammarNotes lesson={lesson} checked={progress.learnDone} onCheckedChange={(checked) => setProgress((old) => ({ ...old, learnDone: checked }))} /><B2KnowledgeChoicePractice lesson={lesson} onCompleteChange={(quizDone) => setProgress((old) => old.quizDone === quizDone ? old : ({ ...old, quizDone }))} /></> : null}

    {active === "speak" ? <Section title="Speaking builder"><B2SpeakingSupportGuide lesson={lesson} /><EmbeddedSpeechPracticePanel /><label style={fieldLabel}><input type="checkbox" checked={progress.speakDone} onChange={(event) => setProgress((old) => ({ ...old, speakDone: event.target.checked }))} />I completed a speaking practice.</label></Section> : null}

    {active === "write" ? <Section title="Guided writing builder"><WritingCheatSheetTabs level="B2" day={day}><WritingTaskPrompt lesson={lesson} /><ResourceButton href={workbookUrl}>Open lesson workbook</ResourceButton><GuidedWritingWorkspace config={getStandardWritingConfig(lesson)} storageKey={getStandardLessonStorageKey(lesson, "writing")} cloudField={getStandardWritingCloudField(lesson)} onStatusChange={setWriting} /></WritingCheatSheetTabs></Section> : null}

    {active === "references" ? <WorkbookReferenceAnswers level="B2" lesson={lesson} workbookId={`B2-day-${day}`} /> : null}

    {active === "finish" ? <Section title={`Summary B2 Day ${day}`}><GermanyLifeMiniLesson lesson={lesson} /><NoteBox tone={progress.quizDone ? "green" : "amber"}><strong>Learn check:</strong> {progress.quizDone ? "Grammar questions completed correctly." : "Complete the clickable grammar check in Learn before you finish."}</NoteBox>{progress.completed ? <NoteBox tone="green"><strong>Completed.</strong> This lesson is saved as complete on this device.</NoteBox> : null}<button type="button" style={{ ...styles.primaryButton, width: "fit-content" }} onClick={finish}>I have completed</button></Section> : null}
  </div>;
}
