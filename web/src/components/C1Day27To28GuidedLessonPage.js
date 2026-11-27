import React, { useEffect, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import C1TopicIntroduction from "./C1TopicIntroduction";
import C1AcademicExamPractice from "./C1AcademicExamPractice";
import { C1PreparationLink } from "./C1ExamPreparationPage";
import C1Day27To28GrammarNotes from "./C1Day27To28GrammarNotes";
import C1TopicCollocationPractice from "./C1TopicCollocationPractice";
import { EmbeddedSpeechPracticePanel } from "./selfLearning/EmbeddedPracticePanels";
import GuidedWritingWorkspace from "./GuidedWritingWorkspace";
import WritingCheatSheetTabs from "./WritingCheatSheetTabs";
import WritingTaskPrompt from "./WritingTaskPrompt";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import { AdvancedSelfLearningTabNav } from "./StandardWorkbookComponents";
import { useToast } from "../context/ToastContext";
import { getStandardLessonStorageKey, getStandardWritingCloudField, getStandardWritingConfig } from "../data/standardLessonJourney";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 14, border: "1px solid #e2e8f0", borderRadius: 18, boxShadow: "0 10px 26px rgba(15,23,42,.06)" };
const listStyle = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const NoteBox = ({ children, tone = "blue" }) => {
  const tones = { blue: ["#bfdbfe", "#eff6ff", "#1e3a8a"], green: ["#bbf7d0", "#f0fdf4", "#14532d"], amber: ["#fde68a", "#fffbeb", "#92400e"] };
  const [border, background, color] = tones[tone] || tones.blue;
  return <div style={{ border: `1px solid ${border}`, borderRadius: 14, padding: 12, background, color, lineHeight: 1.65 }}>{children}</div>;
};
const Section = ({ title, children }) => <section style={card}><h2 style={{ margin: 0, fontSize: "1.2rem" }}>{title}</h2>{children}</section>;

const summaries = {
  27: { title: "Digitalisierung und Verwaltung: Zugang fair gestalten", intro: "Dieses C1-Kapitel behandelt Online-Services, Bürokratie, Datenschutz und digitalen Zugang. Ziel ist eine sachliche Bewertung moderner Verwaltung.", points: ["Beschreibe Verwaltungsprozesse mit Passiv und Nominalstil.", "Bewerte digitale Effizienz zusammen mit Datenschutz und Barrierefreiheit.", "Eine starke C1-Antwort zeigt, dass Digitalisierung niemanden ausschließen darf."], vocabulary: ["digitale Verwaltung", "barrierefrei", "der Antrag", "Datenschutz", "die Vereinfachung"] },
  28: { title: "Demografischer Wandel und Generationengerechtigkeit", intro: "Dieses C1-Kapitel untersucht die Folgen einer alternden Gesellschaft für Renten, Pflege, Arbeitsmarkt und öffentliche Finanzen. Ziel ist eine differenzierte Abwägung zwischen wirtschaftlicher Tragfähigkeit und fairer Verteilung zwischen den Generationen.", points: ["Erkläre Ursachen und Folgen des demografischen Wandels mit präzisen Ursache-Folge-Strukturen.", "Bewerte Maßnahmen wie Fachkräftezuwanderung, Familienförderung und ein höheres Renteneintrittsalter differenziert.", "Eine starke C1-Antwort berücksichtigt sowohl die Belastung jüngerer Generationen als auch die Lebens- und Arbeitsrealität älterer Menschen."], vocabulary: ["der demografische Wandel", "die Generationengerechtigkeit", "der Fachkräftemangel", "das Rentensystem", "der Pflegebedarf", "die Lebenserwartung"] },
};
const FinishSummary = ({ day }) => { const item = summaries[day]; if (!item) return null; return <div style={{ border: "1px solid #bfdbfe", borderRadius: 16, padding: 14, background: "#eff6ff", display: "grid", gap: 10 }}><h3 style={{ margin: 0 }}>{item.title}</h3><p style={{ margin: 0, lineHeight: 1.7 }}>{item.intro}</p><ul style={listStyle}>{item.points.map((point) => <li key={point}>{point}</li>)}</ul><div><strong>Wortschatz:</strong> {item.vocabulary.join(" · ")}</div></div>; };

export default function C1Day27To28GuidedLessonPage({ lesson, canonicalLesson = null }) {
  const { showToast } = useToast();
  const day = Number(lesson.day);
  const [active, setActive] = useState("learn");
  const storageKey = getStandardLessonStorageKey(lesson, "progress");
  const [progress, setProgress] = useState(() => { try { return { learnDone: false, speakDone: false, completed: false, ...JSON.parse(localStorage.getItem(storageKey) || "{}") }; } catch { return { learnDone: false, speakDone: false, completed: false }; } });
  useEffect(() => localStorage.setItem(storageKey, JSON.stringify(progress)), [progress, storageKey]);

  const workbookUrl = canonicalLesson?.resources?.workbook?.url || lesson.resources?.workbook?.url || "";
  const finish = () => { const completedAt = new Date().toISOString(); setProgress((old) => ({ ...old, completed: true, completedAt })); showToast(`C1 Day ${day} completed. Your progress was saved.`, "success"); };

  return <div style={{ ...styles.container, display: "grid", gap: 18 }}>
    <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
    <header style={{ borderRadius: 22, overflow: "hidden", color: "#fff", backgroundImage: `linear-gradient(135deg,rgba(2,6,23,.94),rgba(30,64,175,.72)),url(${lesson.heroImage || ""})`, backgroundSize: "cover", backgroundPosition: "center", padding: "clamp(22px,4vw,42px)", display: "grid", gap: 16, minHeight: 240, alignContent: "space-between" }}><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><span style={{ ...styles.badge, background: "rgba(255,255,255,.16)", color: "#fff" }}>C1</span><span style={{ ...styles.badge, background: "rgba(255,255,255,.16)", color: "#fff" }}>Day {day}</span><span style={{ ...styles.badge, background: "rgba(37,99,235,.9)", color: "#fff" }}>Chapter {lesson.chapter}</span></div><div><h1 style={{ margin: 0, fontSize: "clamp(2rem,5vw,3.4rem)" }}>{lesson.title}</h1><p style={{ margin: "10px 0 0", color: "#e2e8f0" }}>{lesson.topic}</p></div></header>
    <AdvancedSelfLearningTabNav level="C1" day={day} activeTab={active} onChange={setActive} />
    {active === "learn" ? <><C1TopicIntroduction day={day} title={lesson.title} /><C1AcademicExamPractice day={day} tab="learn" /><C1TopicCollocationPractice day={day} /><C1Day27To28GrammarNotes day={day} checked={progress.learnDone} onCheckedChange={(checked) => setProgress((old) => ({ ...old, learnDone: checked }))} /></> : null}
    {active === "speak" ? <Section title="Speaking builder"><C1AcademicExamPractice day={day} tab="speak" /><NoteBox tone="amber"><strong>Sprechfrage:</strong> {lesson.speakingBuilder?.question || lesson.speakingTopic || lesson.topic}</NoteBox><EmbeddedSpeechPracticePanel /><label style={{ display: "flex", gap: 9, alignItems: "center", fontWeight: 800 }}><input type="checkbox" checked={progress.speakDone} onChange={(event) => setProgress((old) => ({ ...old, speakDone: event.target.checked }))} />I completed a speaking practice.</label></Section> : null}
    {active === "write" ? <Section title="Guided writing builder"><C1AcademicExamPractice day={day} tab="write" /><WritingCheatSheetTabs level="C1" day={day}><WritingTaskPrompt lesson={lesson} />{workbookUrl ? <a href={workbookUrl} style={{ ...styles.linkButton, width: "fit-content" }}>Open lesson workbook</a> : null}<GuidedWritingWorkspace config={getStandardWritingConfig(lesson)} storageKey={getStandardLessonStorageKey(lesson, "writing")} cloudField={getStandardWritingCloudField(lesson)} /></WritingCheatSheetTabs></Section> : null}
    {active === "references" ? <WorkbookReferenceAnswers level="C1" lesson={lesson} workbookId={`C1-day-${day}`} /> : null}
    {active === "finish" ? <Section title={`Summary C1 Day ${day}`}><FinishSummary day={day} />{day === 28 && <C1PreparationLink />}{progress.completed ? <NoteBox tone="green"><strong>Completed.</strong> This lesson is saved as complete on this device.</NoteBox> : null}<button type="button" style={{ ...styles.primaryButton, width: "fit-content" }} onClick={finish}>I have completed</button></Section> : null}
  </div>;
}
