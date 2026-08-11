import React, { useEffect, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import C1Day18To20GrammarNotes from "./C1Day18To20GrammarNotes";
import C1GrammarQuickCheck from "./C1GrammarQuickCheck";
import C1SpeakGrammarGuide from "./C1SpeakGrammarGuide";
import FalowenRadioTabContent from "./FalowenRadioTabContent";
import { EmbeddedSpeechPracticePanel } from "./selfLearning/EmbeddedPracticePanels";
import GuidedWritingWorkspace from "./GuidedWritingWorkspace";
import WritingCheatSheetTabs from "./WritingCheatSheetTabs";
import WritingTaskPrompt from "./WritingTaskPrompt";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import { useToast } from "../context/ToastContext";
import { getC1Day16To20SpeakingScaffold } from "../data/c1Day16To20SpeakingScaffolds";
import { getStandardLessonStorageKey, getStandardWritingCloudField, getStandardWritingConfig } from "../data/standardLessonJourney";
import { styles } from "../styles";

const tabs = ["learn", "speak", "write", "finish", "references"];
const labels = { learn: "1. Learn", speak: "2. Speak", write: "3. Write", finish: "4. Finish", references: "5. Ref" };
const card = { ...styles.card, display: "grid", gap: 14, border: "1px solid #e2e8f0", borderRadius: 18 };
const NoteBox = ({ children }) => <div style={{ border: "1px solid #bfdbfe", borderRadius: 14, padding: 12, background: "#eff6ff", lineHeight: 1.65 }}>{children}</div>;
const Section = ({ title, children }) => <section style={card}><h2 style={{ margin: 0 }}>{title}</h2>{children}</section>;
const embedUrl = (url = "") => { try { const p = new URL(url); const id = p.hostname.includes("youtu.be") ? p.pathname.slice(1) : p.searchParams.get("v") || p.pathname.split("/").filter(Boolean).pop(); return id ? `https://www.youtube.com/embed/${id}` : ""; } catch { return ""; } };

const day18Writing = {
  question: "Sollte der Staat stärker in Maßnahmen für gesellschaftlichen Zusammenhalt investieren? Verfassen Sie eine C1-Stellungnahme mit 220–280 Wörtern.",
  points: ["gesellschaftliche Relevanz erklären", "Ursachen sozialer Spaltung analysieren", "Folgen für Vertrauen und Demokratie darstellen", "einen Einwand berücksichtigen", "eine konkrete, ausgewogene Maßnahme entwickeln"],
};

export default function C1Day18To20GuidedLessonPage({ lesson, canonicalLesson = null }) {
  const { showToast } = useToast();
  const day = Number(lesson.day);
  const radio = canonicalLesson?.resources?.falowenRadio || null;
  const [entered, setEntered] = useState(() => !radio);
  const [active, setActive] = useState("learn");
  const storageKey = getStandardLessonStorageKey(lesson, "progress");
  const [progress, setProgress] = useState(() => { try { return { learnDone: false, speakDone: false, completed: false, ...JSON.parse(localStorage.getItem(storageKey) || "{}") }; } catch { return { learnDone: false, speakDone: false, completed: false }; } });
  useEffect(() => localStorage.setItem(storageKey, JSON.stringify(progress)), [progress, storageKey]);
  if (!entered && radio) return <div style={{ ...styles.container, display: "grid", gap: 18 }}><AppBackButton label="Back to Course Book" fallbackPath="/campus/course" /><FalowenRadioTabContent level="C1" day={day} resource={radio} onContinue={() => setEntered(true)} /></div>;

  const video = lesson.videoResource || canonicalLesson?.resources?.aiVideo || canonicalLesson?.resources?.teacherVideo || null;
  const videoEmbed = embedUrl(video?.url);
  const workbookUrl = canonicalLesson?.resources?.workbook?.url || lesson.resources?.workbook?.url || "";
  const branches = getC1Day16To20SpeakingScaffold(day);
  const finish = () => { setProgress((old) => ({ ...old, completed: true, completedAt: new Date().toISOString() })); showToast(`C1 Day ${day} completed.`, "success"); };

  return <div style={{ ...styles.container, display: "grid", gap: 18 }}>
    <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
    <header style={{ ...card, background: "#0f172a", color: "white" }}><span style={styles.badge}>C1 · Day {day}</span><h1 style={{ margin: 0 }}>{lesson.title}</h1><p style={{ margin: 0 }}>{lesson.topic}</p></header>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 8 }}>{tabs.map((tab) => <button key={tab} onClick={() => setActive(tab)} style={active === tab ? styles.primaryButton : styles.secondaryButton}>{labels[tab]}</button>)}</div>

    {active === "learn" ? <><Section title="AI video">{videoEmbed ? <iframe title={video?.title || "C1 video"} src={videoEmbed} style={{ width: "100%", minHeight: 360, border: 0, borderRadius: 14 }} allowFullScreen /> : <NoteBox>Continue with the grammar notes below.</NoteBox>}</Section><C1Day18To20GrammarNotes day={day} checked={progress.learnDone} onCheckedChange={(learnDone) => setProgress((old) => ({ ...old, learnDone }))} /><C1GrammarQuickCheck day={day} completed={progress.learnDone} onCompleteChange={(learnDone) => setProgress((old) => ({ ...old, learnDone }))} /></> : null}

    {active === "speak" ? <Section title="Speaking builder"><C1SpeakGrammarGuide lesson={lesson} branchesOverride={branches} /><EmbeddedSpeechPracticePanel /><label><input type="checkbox" checked={progress.speakDone} onChange={(e) => setProgress((old) => ({ ...old, speakDone: e.target.checked }))} /> I completed a speaking practice.</label></Section> : null}

    {active === "write" ? <Section title="Guided writing builder"><WritingCheatSheetTabs level="C1" day={day}>{day === 18 ? <><NoteBox><strong>Schreibaufgabe:</strong> {day18Writing.question}</NoteBox><ul>{day18Writing.points.map((point) => <li key={point}>{point}</li>)}</ul></> : <WritingTaskPrompt lesson={lesson} />}{workbookUrl ? <a href={workbookUrl} style={styles.linkButton}>Open lesson workbook</a> : null}<GuidedWritingWorkspace config={getStandardWritingConfig(lesson)} storageKey={getStandardLessonStorageKey(lesson, "writing")} cloudField={getStandardWritingCloudField(lesson)} /></WritingCheatSheetTabs></Section> : null}

    {active === "references" ? <WorkbookReferenceAnswers level="C1" lesson={lesson} workbookId={`C1-day-${day}`} /> : null}
    {active === "finish" ? <Section title={`Summary C1 Day ${day}`}><p>Complete the clickable Learn check, then practise Speak once in Prüfungsmodus without prompts.</p>{progress.learnDone ? <NoteBox><strong>Learn complete.</strong> Grammar practice completed.</NoteBox> : null}{progress.completed ? <NoteBox>Completed and saved on this device.</NoteBox> : null}<button style={styles.primaryButton} onClick={finish}>I have completed</button></Section> : null}
  </div>;
}
