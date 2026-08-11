import React, { useEffect, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import C1Day21To23GrammarNotes from "./C1Day21To23GrammarNotes";
import C1Day24To26GrammarNotes from "./C1Day24To26GrammarNotes";
import C1GrammarQuickCheck from "./C1GrammarQuickCheck";
import C1SpeakGrammarGuide from "./C1SpeakGrammarGuide";
import FalowenRadioTabContent from "./FalowenRadioTabContent";
import { EmbeddedSpeechPracticePanel } from "./selfLearning/EmbeddedPracticePanels";
import GuidedWritingWorkspace from "./GuidedWritingWorkspace";
import WritingCheatSheetTabs from "./WritingCheatSheetTabs";
import WritingTaskPrompt from "./WritingTaskPrompt";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import { useToast } from "../context/ToastContext";
import { getC1Day21To25SpeakingScaffold } from "../data/c1Day21To25SpeakingScaffolds";
import { getStandardLessonStorageKey, getStandardWritingCloudField, getStandardWritingConfig } from "../data/standardLessonJourney";
import { styles } from "../styles";

const tabs = ["learn", "speak", "write", "finish", "references"];
const labels = { learn: "1. Learn", speak: "2. Speak", write: "3. Write", finish: "4. Finish", references: "5. Ref" };
const card = { ...styles.card, display: "grid", gap: 14, border: "1px solid #e2e8f0", borderRadius: 18, boxShadow: "0 10px 26px rgba(15,23,42,.06)" };
const Section = ({ title, children }) => <section style={card}><h2 style={{ margin: 0, fontSize: "1.2rem" }}>{title}</h2>{children}</section>;
const NoteBox = ({ children, tone = "blue" }) => { const tones = { blue: ["#bfdbfe", "#eff6ff", "#1e3a8a"], green: ["#86efac", "#f0fdf4", "#14532d"], amber: ["#fde68a", "#fffbeb", "#92400e"] }; const [border, background, color] = tones[tone] || tones.blue; return <div style={{ border: `1px solid ${border}`, borderRadius: 14, padding: 12, background, color, lineHeight: 1.65 }}>{children}</div>; };
const embedUrl = (url = "") => { try { const parsed = new URL(url); const host = parsed.hostname.replace(/^www\./, ""); const id = host === "youtu.be" ? parsed.pathname.replace(/^\//, "") : parsed.searchParams.get("v") || parsed.pathname.split("/").filter(Boolean).pop(); return id ? `https://www.youtube.com/embed/${id}` : ""; } catch { return ""; } };

const day25Overrides = {
  speakingTopic: "Darf die Wissenschaft alles erforschen, was technisch möglich ist?",
  speakingBuilder: { question: "Darf die Wissenschaft alles erforschen, was technisch möglich ist?" },
  writingTaskType: "C1 opinion essay / Stellungnahme",
  writingTopic: "Schreibaufgabe: Verfassen Sie eine C1-Stellungnahme zum Thema „Grenzen der Forschung“ mit 220–280 Wörtern. Darf die Wissenschaft alles erforschen, was technisch möglich ist?",
  writingPromptBullets: [
    "Erläutern Sie, welche Bedeutung Forschungsfreiheit für wissenschaftlichen Fortschritt hat.",
    "Nehmen Sie anhand eines konkreten Beispiels Stellung dazu, ob Forschung ethische Grenzen haben sollte.",
    "Gehen Sie auf mögliche Folgen zu strenger Einschränkungen der Forschung ein.",
    "Schlagen Sie einen ausgewogenen Umgang mit Forschungsfreiheit und gesellschaftlicher Verantwortung vor.",
  ],
  writingBuilder: {
    structure: ["Einleitung: Konflikt zwischen Forschungsfreiheit und Verantwortung", "Bedeutung der Forschungsfreiheit", "konkretes Beispiel und ethische Grenze", "Folgen zu strenger Einschränkungen", "ausgewogener Lösungsweg", "begründete Schlussposition"],
    usefulLines: ["Forschungsfreiheit ist eine wesentliche Voraussetzung für wissenschaftlichen Fortschritt; sie darf jedoch nicht losgelöst von gesellschaftlicher Verantwortung betrachtet werden.", "Ein konkretes Beispiel hierfür ist ...", "Kritisch zu berücksichtigen ist, dass ...", "Zu strenge Einschränkungen könnten hingegen dazu führen, dass ...", "Ein ausgewogener Lösungsweg bestünde darin, ..."],
  },
};

export default function C1Day21To25SelfTutoringPage({ lesson, canonicalLesson = null }) {
  const day = Number(lesson?.day || 0);
  const effectiveLesson = day === 25 ? { ...lesson, ...day25Overrides } : lesson;
  const { showToast } = useToast();
  const radio = canonicalLesson?.resources?.falowenRadio || null;
  const [entered, setEntered] = useState(() => !radio);
  const [active, setActive] = useState("learn");
  const storageKey = getStandardLessonStorageKey(effectiveLesson, "progress");
  const [progress, setProgress] = useState(() => { try { return { learnDone: false, quizDone: false, speakDone: false, completed: false, ...JSON.parse(localStorage.getItem(storageKey) || "{}") }; } catch { return { learnDone: false, quizDone: false, speakDone: false, completed: false }; } });
  useEffect(() => localStorage.setItem(storageKey, JSON.stringify(progress)), [progress, storageKey]);

  if (!entered && radio) return <div style={{ ...styles.container, display: "grid", gap: 18 }}><AppBackButton label="Back to Course Book" fallbackPath="/campus/course" /><FalowenRadioTabContent level="C1" day={day} resource={radio} onContinue={() => setEntered(true)} /></div>;

  const video = effectiveLesson.videoResource || canonicalLesson?.resources?.aiVideo || canonicalLesson?.resources?.teacherVideo || null;
  const videoEmbed = embedUrl(video?.url);
  const workbookUrl = canonicalLesson?.resources?.workbook?.url || effectiveLesson.resources?.workbook?.url || "";
  const branches = getC1Day21To25SpeakingScaffold(day);
  const GrammarNotes = day <= 23 ? C1Day21To23GrammarNotes : C1Day24To26GrammarNotes;
  const finish = () => { setProgress((old) => ({ ...old, completed: true, completedAt: new Date().toISOString() })); showToast(`C1 Day ${day} completed.`, "success"); };

  return <div style={{ ...styles.container, display: "grid", gap: 18 }}>
    <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
    <header style={{ ...card, background: "linear-gradient(135deg,#0f172a,#1e3a8a)", color: "#fff" }}><span style={{ ...styles.badge, width: "fit-content" }}>C1 · Day {day}</span><h1 style={{ margin: 0 }}>{effectiveLesson.title}</h1><p style={{ margin: 0, color: "#e2e8f0" }}>{effectiveLesson.topic}</p></header>
    <div style={{ position: "sticky", top: 0, zIndex: 5, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 8, padding: 10, border: "1px solid #e2e8f0", borderRadius: 18, background: "rgba(248,250,252,.94)" }}>{tabs.map((tab) => <button key={tab} type="button" onClick={() => setActive(tab)} style={{ ...(active === tab ? styles.primaryButton : styles.secondaryButton), borderRadius: 999, minHeight: 44 }}>{labels[tab]}</button>)}</div>

    {active === "learn" ? <><Section title="AI video">{videoEmbed ? <iframe title={video?.title || "C1 lesson video"} src={videoEmbed} allowFullScreen style={{ width: "100%", minHeight: 360, border: 0, borderRadius: 14 }} /> : <NoteBox tone="amber">Continue with the grammar lesson below.</NoteBox>}</Section><GrammarNotes day={day} checked={progress.learnDone} onCheckedChange={(learnDone) => setProgress((old) => ({ ...old, learnDone }))} /><C1GrammarQuickCheck day={day} completed={progress.quizDone} onCompleteChange={(quizDone) => setProgress((old) => ({ ...old, quizDone }))} /></> : null}

    {active === "speak" ? <Section title="Speaking builder"><C1SpeakGrammarGuide lesson={effectiveLesson} branchesOverride={branches} /><EmbeddedSpeechPracticePanel /><label style={{ display: "flex", gap: 9, alignItems: "center", fontWeight: 800 }}><input type="checkbox" checked={progress.speakDone} onChange={(event) => setProgress((old) => ({ ...old, speakDone: event.target.checked }))} />I completed a speaking practice.</label></Section> : null}

    {active === "write" ? <Section title="Guided writing builder"><WritingCheatSheetTabs level="C1" day={day}><WritingTaskPrompt lesson={effectiveLesson} />{workbookUrl ? <a href={workbookUrl} style={{ ...styles.linkButton, width: "fit-content" }}>Open lesson workbook</a> : null}<GuidedWritingWorkspace config={getStandardWritingConfig(effectiveLesson)} storageKey={getStandardLessonStorageKey(effectiveLesson, "writing")} cloudField={getStandardWritingCloudField(effectiveLesson)} /></WritingCheatSheetTabs></Section> : null}
    {active === "references" ? <WorkbookReferenceAnswers level="C1" lesson={effectiveLesson} workbookId={`C1-day-${day}`} /> : null}
    {active === "finish" ? <Section title={`Summary C1 Day ${day}`}>{progress.quizDone ? <NoteBox tone="green"><strong>Learn complete.</strong> The clickable grammar check was completed correctly.</NoteBox> : <NoteBox tone="amber">Complete the clickable grammar check before considering Learn finished.</NoteBox>}<p style={{ margin: 0, lineHeight: 1.7 }}>For exam readiness, repeat Speak once in Prüfungsmodus without the idea bank and complete the 220–280-word writing task independently.</p>{progress.completed ? <NoteBox tone="green">Completed and saved on this device.</NoteBox> : null}<button type="button" style={{ ...styles.primaryButton, width: "fit-content" }} onClick={finish}>I have completed</button></Section> : null}
  </div>;
}
