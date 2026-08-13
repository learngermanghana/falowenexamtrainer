import React, { useEffect, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import C1Day24To26GrammarNotes from "./C1Day24To26GrammarNotes";
import C1TopicCollocationPractice from "./C1TopicCollocationPractice";
import FalowenRadioTabContent from "./FalowenRadioTabContent";
import { EmbeddedSpeechPracticePanel } from "./selfLearning/EmbeddedPracticePanels";
import GuidedWritingWorkspace from "./GuidedWritingWorkspace";
import WritingCheatSheetTabs from "./WritingCheatSheetTabs";
import WritingTaskPrompt from "./WritingTaskPrompt";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import { useToast } from "../context/ToastContext";
import { getStandardLessonStorageKey, getStandardWritingCloudField, getStandardWritingConfig } from "../data/standardLessonJourney";
import { styles } from "../styles";

const tabs = ["learn", "speak", "write", "finish", "references"];
const labels = { learn: "1. Learn", speak: "2. Speak", write: "3. Write", finish: "4. Finish", references: "5. Ref" };
const card = { ...styles.card, display: "grid", gap: 14, border: "1px solid #e2e8f0", borderRadius: 18, boxShadow: "0 10px 26px rgba(15,23,42,.06)" };
const listStyle = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const NoteBox = ({ children, tone = "blue" }) => { const tones = { blue: ["#bfdbfe", "#eff6ff", "#1e3a8a"], green: ["#bbf7d0", "#f0fdf4", "#14532d"], amber: ["#fde68a", "#fffbeb", "#92400e"] }; const [border, background, color] = tones[tone] || tones.blue; return <div style={{ border: `1px solid ${border}`, borderRadius: 14, padding: 12, background, color, lineHeight: 1.65 }}>{children}</div>; };
const Section = ({ title, children }) => <section style={card}><h2 style={{ margin: 0, fontSize: "1.2rem" }}>{title}</h2>{children}</section>;

const summaries = {
  24: { title: "Mobilität und Infrastruktur: Stadt fair und nachhaltig planen", intro: "Dieses C1-Kapitel behandelt Verkehr, öffentlichen Raum und Infrastruktur. Es geht darum, Mobilität nicht nur technisch, sondern auch sozial und ökologisch zu bewerten.", points: ["Vergleiche Verkehrsmittel nach Platz, Kosten, Zugang und Emissionen.", "Nutze Passiv und Nominalstil, um Infrastrukturmaßnahmen sachlich zu beschreiben.", "Eine starke C1-Antwort verbindet Mobilität mit Teilhabe und Lebensqualität."], vocabulary: ["die Infrastruktur", "öffentlicher Verkehr", "der Ausbau", "städtischer Raum", "soziale Teilhabe"] },
  25: { title: "Wissenschaft und Forschung: Fortschritt kritisch einordnen", intro: "Dieses C1-Kapitel betrachtet Forschung als Motor von Fortschritt, aber auch als Bereich, der Transparenz, Ethik und gesellschaftlichen Zugang braucht.", points: ["Gib Forschungsergebnisse sachlich und mit Distanz wieder.", "Nutze indirekte Rede und Konjunktiv I für Quellenbezug.", "Eine starke C1-Antwort bewertet Nutzen, Grenzen und ethische Verantwortung."], vocabulary: ["Forschungsfreiheit", "ethische Grenzen", "die Studie", "Transparenz", "gesellschaftliche Verantwortung"] },
  26: { title: "Nachhaltiger Konsum: Verantwortung realistisch verteilen", intro: "Dieses C1-Kapitel analysiert Kaufverhalten, Ressourcen und faire Produktion. Wichtig ist eine differenzierte Bewertung individueller, politischer und wirtschaftlicher Verantwortung.", points: ["Beschreibe Produkte und Kaufentscheidungen sprachlich genau.", "Nutze Adjektivdeklination und Partizipialattribute für präzise Formulierungen.", "Eine starke C1-Antwort zeigt, dass nachhaltiger Konsum bezahlbar und zugänglich sein muss."], vocabulary: ["nachhaltiger Konsum", "fair produzierte Waren", "recycelte Materialien", "Kaufkraft", "Rahmenbedingungen"] },
};

const day25Speaking = {
  question: "Darf die Wissenschaft alles erforschen, was technisch möglich ist?",
  intro: "Nutze die Punkte als Denkstütze. Wähle eine klare Position, begründe sie und entwickle mindestens ein konkretes Beispiel.",
  branches: [
    { title: "Forschungsfreiheit", points: ["neue Erkenntnisse", "medizinischer Fortschritt", "Innovation", "unabhängige Wissenschaft"], prompt: "Warum ist Forschungsfreiheit für Fortschritt wichtig?" },
    { title: "Konkretes Beispiel", points: ["Gentechnik", "künstliche Intelligenz", "medizinische Forschung", "Datennutzung"], prompt: "Wo würdest du eine Grenze ziehen – und warum?" },
    { title: "Ethische Risiken", points: ["Menschenwürde", "Datenschutz", "Missbrauch", "unklare Langzeitfolgen"], prompt: "Welche Folgen können entstehen, wenn Forschung keine Grenzen hat?" },
    { title: "Zu strenge Regeln", points: ["Innovation wird gebremst", "Forschende wandern ab", "wichtige Therapien verzögern sich", "internationaler Wettbewerb"], prompt: "Was spricht gegen zu starke Einschränkungen?" },
    { title: "Ausgewogener Lösungsweg", points: ["Ethikkommissionen", "Transparenz", "unabhängige Kontrolle", "klare gesetzliche Rahmenbedingungen"], prompt: "Wie lassen sich Freiheit und Verantwortung verbinden?" },
    { title: "Eigene Schlussposition", points: ["Forschung ja, aber nicht grenzenlos", "Nutzen und Risiken abwägen", "Betroffene schützen", "Regeln regelmäßig überprüfen"], prompt: "Welche Position würdest du am Ende vertreten?" },
  ],
};

const day25Writing = {
  writingTaskType: "C1 opinion essay / Stellungnahme",
  writingTopic: "Schreibaufgabe: Verfassen Sie eine C1-Stellungnahme zum Thema „Grenzen der Forschung“ mit 220–280 Wörtern. Darf die Wissenschaft alles erforschen, was technisch möglich ist?",
  writingPromptBullets: [
    "Erläutern Sie, welche Bedeutung Forschungsfreiheit für wissenschaftlichen Fortschritt hat.",
    "Nehmen Sie anhand eines konkreten Beispiels Stellung dazu, ob Forschung ethische Grenzen haben sollte.",
    "Gehen Sie auf mögliche Folgen zu strenger Einschränkungen der Forschung ein.",
    "Schlagen Sie einen ausgewogenen Umgang mit Forschungsfreiheit und gesellschaftlicher Verantwortung vor.",
  ],
  writingBuilder: {
    structure: [
      "Einleitung: Stellen Sie den Konflikt zwischen Forschungsfreiheit und gesellschaftlicher Verantwortung vor.",
      "Argument: Erklären Sie, warum Forschungsfreiheit für Fortschritt wichtig ist.",
      "Beispiel: Entwickeln Sie ein konkretes Beispiel, etwa aus Medizin, Gentechnik oder künstlicher Intelligenz.",
      "Gegenposition: Zeigen Sie, welche Folgen zu strenge Einschränkungen haben könnten.",
      "Lösung: Formulieren Sie einen ausgewogenen Ansatz mit Kontrolle, Transparenz und klaren Grenzen.",
      "Schluss: Begründen Sie Ihre eigene Position.",
    ],
    usefulLines: [
      "Forschungsfreiheit ist eine wesentliche Voraussetzung für wissenschaftlichen Fortschritt; sie darf jedoch nicht losgelöst von gesellschaftlicher Verantwortung betrachtet werden.",
      "Ein konkretes Beispiel hierfür ist ...",
      "Kritisch zu berücksichtigen ist, dass ...",
      "Zu strenge Einschränkungen könnten hingegen dazu führen, dass ...",
      "Ein ausgewogener Lösungsweg bestünde darin, ...",
      "Zusammenfassend lässt sich festhalten, dass ...",
    ],
  },
};

const embedUrl = (url = "") => { try { const parsed = new URL(url); const host = parsed.hostname.replace(/^www\./, ""); const id = host === "youtu.be" ? parsed.pathname.replace(/^\//, "") : parsed.searchParams.get("v") || parsed.pathname.split("/").filter(Boolean).pop(); return id ? `https://www.youtube.com/embed/${id}` : ""; } catch { return ""; } };
const FinishSummary = ({ day }) => { const item = summaries[day]; if (!item) return null; return <div style={{ border: "1px solid #bfdbfe", borderRadius: 16, padding: 14, background: "#eff6ff", display: "grid", gap: 10 }}><h3 style={{ margin: 0 }}>{item.title}</h3><p style={{ margin: 0, lineHeight: 1.7 }}>{item.intro}</p><ul style={listStyle}>{item.points.map((point) => <li key={point}>{point}</li>)}</ul><div><strong>Wortschatz:</strong> {item.vocabulary.join(" · ")}</div></div>; };

export default function C1Day24To26GuidedLessonPage({ lesson, canonicalLesson = null }) {
  const { showToast } = useToast();
  const day = Number(lesson.day);
  const effectiveLesson = day === 25 ? { ...lesson, ...day25Writing, speakingTopic: day25Speaking.question, speakingBuilder: day25Speaking } : lesson;
  const radio = canonicalLesson?.resources?.falowenRadio || null;
  const [entered, setEntered] = useState(() => !radio);
  const [active, setActive] = useState("learn");
  const storageKey = getStandardLessonStorageKey(effectiveLesson, "progress");
  const [progress, setProgress] = useState(() => { try { return { learnDone: false, speakDone: false, completed: false, ...JSON.parse(localStorage.getItem(storageKey) || "{}") }; } catch { return { learnDone: false, speakDone: false, completed: false }; } });
  useEffect(() => localStorage.setItem(storageKey, JSON.stringify(progress)), [progress, storageKey]);

  if (!entered && radio) return <div style={{ ...styles.container, display: "grid", gap: 18 }}><AppBackButton label="Back to Course Book" fallbackPath="/campus/course" /><header style={{ ...card, borderColor: "#bfdbfe", background: "linear-gradient(135deg,#eff6ff,#f8fafc)" }}><span style={{ ...styles.badge, width: "fit-content", background: "#dbeafe", color: "#1e3a8a" }}>Start here</span><h1 style={{ margin: 0 }}>C1 · Day {day} · {effectiveLesson.title}</h1><p style={{ margin: 0, color: "#475569" }}>Listen to Falowen Radio first. Continue opens Learn, Speak, Write and Finish.</p></header><FalowenRadioTabContent level="C1" day={day} resource={radio} onContinue={() => { setEntered(true); window.scrollTo({ top: 0, behavior: "smooth" }); }} /></div>;

  const video = effectiveLesson.videoResource || canonicalLesson?.resources?.aiVideo || canonicalLesson?.resources?.teacherVideo || null;
  const videoEmbed = embedUrl(video?.url);
  const workbookUrl = canonicalLesson?.resources?.workbook?.url || effectiveLesson.resources?.workbook?.url || "";
  const speaking = effectiveLesson.speakingBuilder || {};
  const branches = Array.isArray(speaking.branches) ? speaking.branches : [];
  const finish = () => { const completedAt = new Date().toISOString(); setProgress((old) => ({ ...old, completed: true, completedAt })); showToast(`C1 Day ${day} completed. Your progress was saved.`, "success"); };

  return <div style={{ ...styles.container, display: "grid", gap: 18 }}>
    <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
    <header style={{ borderRadius: 22, overflow: "hidden", color: "#fff", backgroundImage: `linear-gradient(135deg,rgba(2,6,23,.94),rgba(30,64,175,.72)),url(${effectiveLesson.heroImage || ""})`, backgroundSize: "cover", backgroundPosition: "center", padding: "clamp(22px,4vw,42px)", display: "grid", gap: 16, minHeight: 240, alignContent: "space-between" }}><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><span style={{ ...styles.badge, background: "rgba(255,255,255,.16)", color: "#fff" }}>C1</span><span style={{ ...styles.badge, background: "rgba(255,255,255,.16)", color: "#fff" }}>Day {day}</span><span style={{ ...styles.badge, background: "rgba(37,99,235,.9)", color: "#fff" }}>Chapter {effectiveLesson.chapter}</span></div><div><h1 style={{ margin: 0, fontSize: "clamp(2rem,5vw,3.4rem)" }}>{effectiveLesson.title}</h1><p style={{ margin: "10px 0 0", color: "#e2e8f0" }}>{effectiveLesson.topic}</p></div></header>
    <div style={{ position: "sticky", top: 0, zIndex: 5, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 8, padding: 10, border: "1px solid #e2e8f0", borderRadius: 18, background: "rgba(248,250,252,.94)" }}>{tabs.map((tab) => <button key={tab} type="button" onClick={() => setActive(tab)} style={{ ...(active === tab ? styles.primaryButton : styles.secondaryButton), borderRadius: 999, minHeight: 44 }}>{labels[tab]}</button>)}</div>
    {active === "learn" ? <><Section title="AI video">{video?.url ? <div style={{ display: "grid", gap: 10 }}><strong>{video.title || "Lesson video"}</strong>{video.description ? <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>{video.description}</p> : null}{videoEmbed ? <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", borderRadius: 16, overflow: "hidden", background: "#0f172a" }}><iframe title={video.title || "C1 lesson video"} src={videoEmbed} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} /></div> : null}</div> : <NoteBox tone="amber">No dedicated AI video has been added yet. Continue with the grammar notes below.</NoteBox>}</Section><C1TopicCollocationPractice day={day} /><C1Day24To26GrammarNotes day={day} checked={progress.learnDone} onCheckedChange={(checked) => setProgress((old) => ({ ...old, learnDone: checked }))} /></> : null}
    {active === "speak" ? <Section title="Speaking builder"><NoteBox tone="amber"><strong>Sprechfrage:</strong> {speaking.question || effectiveLesson.speakingTopic || effectiveLesson.topic}</NoteBox>{speaking.intro ? <p style={{ margin: 0, color: "#475569", lineHeight: 1.7 }}>{speaking.intro}</p> : null}{branches.length ? <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 12 }}>{branches.map((branch) => <div key={branch.title} style={{ border: "1px solid #c7d2fe", borderRadius: 14, padding: 14, background: "#eef2ff", display: "grid", gap: 8 }}><strong>{branch.title}</strong>{branch.prompt ? <span style={{ lineHeight: 1.55 }}>{branch.prompt}</span> : null}<ul style={listStyle}>{(branch.points || branch.keywords || []).map((point) => <li key={point}>{point}</li>)}</ul></div>)}</div> : null}<EmbeddedSpeechPracticePanel /><label style={{ display: "flex", gap: 9, alignItems: "center", fontWeight: 800 }}><input type="checkbox" checked={progress.speakDone} onChange={(event) => setProgress((old) => ({ ...old, speakDone: event.target.checked }))} />I completed a speaking practice.</label></Section> : null}
    {active === "write" ? <Section title="Guided writing builder"><WritingCheatSheetTabs level="C1" day={day}><WritingTaskPrompt lesson={effectiveLesson} />{workbookUrl ? <a href={workbookUrl} style={{ ...styles.linkButton, width: "fit-content" }}>Open lesson workbook</a> : null}<GuidedWritingWorkspace config={getStandardWritingConfig(effectiveLesson)} storageKey={getStandardLessonStorageKey(effectiveLesson, "writing")} cloudField={getStandardWritingCloudField(effectiveLesson)} /></WritingCheatSheetTabs></Section> : null}
    {active === "references" ? <WorkbookReferenceAnswers level="C1" lesson={effectiveLesson} workbookId={`C1-day-${day}`} /> : null}
    {active === "finish" ? <Section title={`Summary C1 Day ${day}`}><FinishSummary day={day} />{progress.completed ? <NoteBox tone="green"><strong>Completed.</strong> This lesson is saved as complete on this device.</NoteBox> : null}<button type="button" style={{ ...styles.primaryButton, width: "fit-content" }} onClick={finish}>I have completed</button></Section> : null}
  </div>;
}
