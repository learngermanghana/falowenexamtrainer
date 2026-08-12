import React, { useEffect, useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import B2Day6MigrationIntegrationGrammarNotes from "./B2Day6MigrationIntegrationGrammarNotes";
import B2Day7GesellschaftlicheVielfaltGrammarNotes from "./B2Day7GesellschaftlicheVielfaltGrammarNotes";
import B2Day7To13GrammarNotes from "./B2Day7To13GrammarNotes";
import B2KnowledgeChoicePractice from "./B2KnowledgeChoicePractice";
import B2QuizFirstLearnPreview from "./B2QuizFirstLearnPreview";
import B2SpeakingSupportGuide from "./B2SpeakingSupportGuide";
import FalowenRadioTabContent from "./FalowenRadioTabContent";
import { EmbeddedSpeechPracticePanel } from "./selfLearning/EmbeddedPracticePanels";
import GuidedWritingWorkspace from "./GuidedWritingWorkspace";
import WritingCheatSheetTabs from "./WritingCheatSheetTabs";
import WritingTaskPrompt from "./WritingTaskPrompt";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import { useToast } from "../context/ToastContext";
import {
  getStandardLessonStorageKey,
  getStandardWritingCloudField,
  getStandardWritingConfig,
} from "../data/standardLessonJourney";
import { styles } from "../styles";

const tabs = ["learn", "speak", "write", "finish", "references"];
const labels = { learn: "1. Learn", speak: "2. Speak", write: "3. Write", finish: "4. Finish", references: "5. Ref" };
const card = { ...styles.card, display: "grid", gap: 14, border: "1px solid #e2e8f0", borderRadius: 18, boxShadow: "0 10px 26px rgba(15,23,42,.06)" };

const NoteBox = ({ children, tone = "blue" }) => {
  const tones = { blue: ["#bfdbfe", "#eff6ff", "#1e3a8a"], green: ["#bbf7d0", "#f0fdf4", "#14532d"], amber: ["#fde68a", "#fffbeb", "#92400e"] };
  const [border, background, color] = tones[tone] || tones.blue;
  return <div style={{ border: `1px solid ${border}`, borderRadius: 14, padding: 12, background, color, lineHeight: 1.65 }}>{children}</div>;
};

const Section = ({ title, children }) => <section style={card}><h2 style={{ margin: 0, fontSize: "1.2rem" }}>{title}</h2>{children}</section>;

const supplemental = {
  8: {
    question: "Welches Verkehrsmittel ist für Alltag und Reisen am sinnvollsten? Vergleiche mindestens zwei Möglichkeiten und begründe deine Meinung.",
    branches: [
      { id: "klima", title: "Umwelt", prompt: "Welches Verkehrsmittel ist klimafreundlicher?", keywords: ["Bahn", "Fahrrad", "Emissionen", "öffentlicher Verkehr"], example: "Die Bahn kann im Vergleich zum Auto klimafreundlicher sein, weil viele Personen gleichzeitig fahren. Das gilt besonders auf gut ausgebauten Strecken.", starter: "Im Vergleich zu ... ist ..." },
      { id: "flex", title: "Flexibilität", prompt: "Wann ist das Auto trotzdem praktischer?", keywords: ["ländliche Gebiete", "Verbindung", "Gepäck", "Zeit"], example: "Auf dem Land bleibt das Auto oft wichtig, wenn Busse und Bahnen selten fahren. Dadurch sind Menschen unabhängiger von Fahrplänen.", starter: "Während ... , ist ..." },
      { id: "preis", title: "Kosten", prompt: "Welche Rolle spielen Preise?", keywords: ["Ticket", "Benzin", "Parken", "Budget"], example: "Je günstiger Tickets sind, desto eher nutzen Menschen öffentliche Verkehrsmittel statt des Autos.", starter: "Je ... desto ..." },
      { id: "loesung", title: "Ausgewogene Lösung", prompt: "Wie könnte Mobilität verbessert werden?", keywords: ["Taktung", "Radwege", "Park-and-Ride", "Investitionen"], example: "Eine sinnvolle Lösung wäre, Bahnverbindungen auszubauen und gleichzeitig sichere Radwege zu schaffen.", starter: "Eine sinnvolle Lösung wäre ..." },
    ],
    quiz: [
      { question: "Welche Form ist richtig?", options: ["Im Vergleich zu das Auto", "Im Vergleich zum Auto", "Im Vergleich der Auto", "Im Vergleich den Auto"], answer: "Im Vergleich zum Auto", explanation: "Im Vergleich zu verlangt den Dativ; zu dem Auto wird zu zum Auto." },
      { question: "Welche Struktur ist korrekt?", options: ["Je besser die Verbindung ist, desto attraktiver ist die Bahn.", "Je die Verbindung besser, desto die Bahn attraktiver.", "Desto besser die Verbindung, je attraktiver die Bahn.", "Je besser ist die Verbindung, desto die Bahn ist attraktiver."], answer: "Je besser die Verbindung ist, desto attraktiver ist die Bahn.", explanation: "Bei je ... desto stehen die Vergleichsformen in zwei klaren Satzteilen." },
      { question: "Welcher Satz wägt zwei Seiten ab?", options: ["Die Bahn ist gut.", "Einerseits ist das Auto flexibel, andererseits ist die Bahn klimafreundlicher.", "Ich fahre Bahn.", "Autos sind teuer."], answer: "Einerseits ist das Auto flexibel, andererseits ist die Bahn klimafreundlicher.", explanation: "Einerseits ... andererseits eignet sich für eine ausgewogene B2-Abwägung." },
      { question: "Welche Form ist richtig?", options: ["Während das Auto flexibel ist, ist die Bahn oft entspannter.", "Während ist das Auto flexibel, die Bahn entspannter ist.", "Während das Auto ist flexibel, die Bahn ist entspannter.", "Während flexibel das Auto, ist die Bahn entspannter."], answer: "Während das Auto flexibel ist, ist die Bahn oft entspannter.", explanation: "Im während-Nebensatz steht das Verb am Ende." },
    ],
  },
  9: {
    question: "Wie sollte man Konflikte beim Wohnen oder in der Nachbarschaft lösen? Beschreibe ein Problem und eine höfliche Lösung.",
    branches: [
      { id: "problem", title: "Problem klar benennen", prompt: "Welches Wohnproblem tritt häufig auf?", keywords: ["Lärm", "Heizung", "Nebenkosten", "Hausordnung"], example: "Ein häufiges Problem ist Lärm während der Ruhezeiten. Dadurch kann das Zusammenleben belastet werden.", starter: "Ein häufiges Problem besteht darin, dass ..." },
      { id: "frage", title: "Indirekte Frage", prompt: "Wie fragt man höflich nach Informationen?", keywords: ["ob", "wann", "wie", "Reparatur"], example: "Man kann den Vermieter fragen, ob ein Reparaturtermin möglich ist, statt direkt eine Forderung zu stellen.", starter: "Könnten Sie mir sagen, ob ..." },
      { id: "bitte", title: "Höfliche Bitte", prompt: "Wie formuliert man eine konkrete Bitte?", keywords: ["könnten", "würden", "bitte", "Lösung"], example: "Könnten Sie bitte prüfen, wann die Heizung repariert werden kann? Das klingt sachlich und respektvoll.", starter: "Könnten Sie bitte ..." },
      { id: "folge", title: "Lösung und Folge", prompt: "Warum ist sachliche Kommunikation hilfreich?", keywords: ["Missverständnisse", "Respekt", "schnelle Lösung", "Nachbarschaft"], example: "Sachliche Kommunikation kann Konflikte entschärfen, weil beide Seiten das Problem besser verstehen.", starter: "Dies kann dazu beitragen, dass ..." },
    ],
    quiz: [
      { question: "Welche indirekte Frage ist korrekt?", options: ["Ich möchte wissen, wann kommt der Handwerker.", "Ich möchte wissen, wann der Handwerker kommt.", "Ich möchte wissen, wann kommt Handwerker der.", "Ich möchte wissen, der Handwerker wann kommt."], answer: "Ich möchte wissen, wann der Handwerker kommt.", explanation: "In der indirekten W-Frage steht das Verb am Ende des Nebensatzes." },
      { question: "Welche Bitte klingt am höflichsten?", options: ["Reparieren Sie die Heizung!", "Sie müssen die Heizung reparieren.", "Könnten Sie bitte die Heizung reparieren?", "Heizung reparieren."], answer: "Könnten Sie bitte die Heizung reparieren?", explanation: "Könnten + bitte macht die Bitte höflich und passend für formelle Kommunikation." },
      { question: "Welches Wort leitet eine indirekte Ja/Nein-Frage ein?", options: ["ob", "denn", "trotzdem", "deshalb"], answer: "ob", explanation: "Ob wird bei indirekten Ja/Nein-Fragen verwendet." },
      { question: "Welche Reihenfolge ist für eine sachliche Beschwerde sinnvoll?", options: ["Beleidigung → Forderung", "Problem → Folge → konkrete Bitte", "Gruß → Ende", "Nur das Problem nennen"], answer: "Problem → Folge → konkrete Bitte", explanation: "Eine gute B2-Beschwerde beschreibt das Problem, die Auswirkung und eine konkrete Lösung." },
    ],
  },
  10: {
    question: "Wie kann man bewusst konsumieren und gleichzeitig auf das eigene Budget achten?",
    branches: [
      { id: "preis", title: "Preis und Qualität", prompt: "Was ist wichtiger: günstig oder langlebig?", keywords: ["Preis", "Qualität", "Lebensdauer", "Garantie"], example: "Einerseits ist ein günstiger Preis attraktiv, andererseits kann ein hochwertiges Produkt langfristig billiger sein.", starter: "Einerseits ... , andererseits ..." },
      { id: "werbung", title: "Werbung", prompt: "Wie beeinflusst Werbung Kaufentscheidungen?", keywords: ["Bedürfnis", "Influencer", "Rabatt", "Impulskauf"], example: "Werbung beeinflusst nicht nur Kinder, sondern auch Erwachsene, weil sie Wünsche erzeugen kann.", starter: "Werbung beeinflusst nicht nur ... , sondern auch ..." },
      { id: "budget", title: "Budget", prompt: "Wie vermeidet man unnötige Ausgaben?", keywords: ["Einkaufsliste", "Budget", "Schulden", "Bedarf"], example: "Ein festes Budget hilft dabei, weder impulsiv zu kaufen noch wichtige Ausgaben zu vergessen.", starter: "Ein Budget hilft dabei, weder ... noch ..." },
      { id: "verantwortung", title: "Verantwortung", prompt: "Welche Rolle spielen Herkunft und Nachhaltigkeit?", keywords: ["regional", "fair", "Umwelt", "Produktion"], example: "Beim Einkaufen können sowohl der Preis als auch die Herkunft eines Produkts berücksichtigt werden.", starter: "Beim Konsum zählen sowohl ... als auch ..." },
    ],
    quiz: [
      { question: "Welche Ergänzung ist richtig? Einerseits ist der Preis wichtig, ___ sollte die Qualität stimmen.", options: ["andererseits", "sowohl", "weder", "sondern"], answer: "andererseits", explanation: "Einerseits ... andererseits stellt zwei Perspektiven gegenüber." },
      { question: "Welche Verbindung ist korrekt?", options: ["sowohl der Preis sondern auch die Qualität", "sowohl der Preis als auch die Qualität", "weder der Preis als auch die Qualität", "nicht nur der Preis noch die Qualität"], answer: "sowohl der Preis als auch die Qualität", explanation: "Die feste Struktur lautet sowohl ... als auch." },
      { question: "Welche Struktur drückt doppelte Verneinung aus?", options: ["sowohl ... als auch", "einerseits ... andererseits", "weder ... noch", "nicht nur ... sondern auch"], answer: "weder ... noch", explanation: "Weder ... noch verneint zwei Elemente gleichzeitig." },
      { question: "Welche Form ist richtig?", options: ["nicht nur Kinder, aber auch Erwachsene", "nicht nur Kinder, sondern auch Erwachsene", "nicht Kinder nur, auch Erwachsene", "nicht nur Kinder, noch Erwachsene"], answer: "nicht nur Kinder, sondern auch Erwachsene", explanation: "Die feste Erweiterungsstruktur lautet nicht nur ... sondern auch." },
    ],
  },
};

const enhanceLesson = (lesson) => {
  const day = Number(lesson?.day || 0);
  const extra = supplemental[day];
  if (!extra) return lesson;
  const existingQuiz = lesson?.grammarLesson?.knowledgeTest || lesson?.knowledgeTest;
  return {
    ...lesson,
    grammarLesson: { ...(lesson.grammarLesson || {}), knowledgeTest: Array.isArray(existingQuiz) && existingQuiz.length ? existingQuiz : extra.quiz },
    speakingBuilder: { ...(lesson.speakingBuilder || {}), question: lesson?.speakingBuilder?.question || extra.question, branches: lesson?.speakingBuilder?.branches?.length ? lesson.speakingBuilder.branches : extra.branches },
  };
};

const GrammarNotes = ({ day, checked, onCheckedChange }) => {
  if (day === 6) return <B2Day6MigrationIntegrationGrammarNotes checked={checked} onCheckedChange={onCheckedChange} />;
  if (day === 7) return <B2Day7GesellschaftlicheVielfaltGrammarNotes checked={checked} onCheckedChange={onCheckedChange} />;
  return <B2Day7To13GrammarNotes day={day} checked={checked} onCheckedChange={onCheckedChange} />;
};

const embedUrl = (url = "") => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    const id = host === "youtu.be" ? parsed.pathname.replace(/^\//, "") : parsed.searchParams.get("v") || parsed.pathname.split("/").filter(Boolean).pop();
    return id ? `https://www.youtube.com/embed/${id}` : "";
  } catch { return ""; }
};

export default function B2Day6To10SelfTutoringPage({ lesson, canonicalLesson = null }) {
  const { showToast } = useToast();
  const guidedLesson = useMemo(() => enhanceLesson(lesson), [lesson]);
  const day = Number(guidedLesson.day);
  const radio = canonicalLesson?.resources?.falowenRadio || null;
  const [entered, setEntered] = useState(() => !radio);
  const [active, setActive] = useState("learn");
  const storageKey = getStandardLessonStorageKey(guidedLesson, "progress");
  const [progress, setProgress] = useState(() => {
    try { return { learnNotesDone: false, quizDone: false, speakDone: false, completed: false, ...JSON.parse(localStorage.getItem(storageKey) || "{}") }; }
    catch { return { learnNotesDone: false, quizDone: false, speakDone: false, completed: false }; }
  });
  useEffect(() => localStorage.setItem(storageKey, JSON.stringify(progress)), [progress, storageKey]);

  if (!entered && radio) return <div style={{ ...styles.container, display: "grid", gap: 18 }}><AppBackButton label="Back to Course Book" fallbackPath="/campus/course" /><header style={card}><h1 style={{ margin: 0 }}>B2 · Day {day} · {guidedLesson.title}</h1><p style={{ margin: 0 }}>Listen to Falowen Radio first, then continue with Learn, Speak and Write.</p></header><FalowenRadioTabContent level="B2" day={day} resource={radio} onContinue={() => setEntered(true)} /></div>;

  const video = guidedLesson.videoResource || canonicalLesson?.resources?.aiVideo || canonicalLesson?.resources?.teacherVideo || null;
  const videoEmbed = embedUrl(video?.url);
  const workbookUrl = canonicalLesson?.resources?.workbook?.url || guidedLesson.resources?.workbook?.url || "";

  return <div style={{ ...styles.container, display: "grid", gap: 18 }}>
    <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
    <header style={{ borderRadius: 22, color: "#fff", background: "linear-gradient(135deg,#020617,#1e40af)", padding: "clamp(22px,4vw,42px)", display: "grid", gap: 12 }}><div><strong>B2 · Day {day}</strong></div><h1 style={{ margin: 0 }}>{guidedLesson.title}</h1><p style={{ margin: 0, color: "#e2e8f0" }}>{guidedLesson.topic}</p></header>
    <div style={{ position: "sticky", top: 0, zIndex: 5, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 8, padding: 10, border: "1px solid #e2e8f0", borderRadius: 18, background: "rgba(248,250,252,.94)" }}>{tabs.map((tab) => <button key={tab} type="button" onClick={() => setActive(tab)} style={{ ...(active === tab ? styles.primaryButton : styles.secondaryButton), borderRadius: 999, minHeight: 44 }}>{labels[tab]}</button>)}</div>
    {active === "learn" ? <>
      <Section title="AI video">{video?.url ? <div style={{ display: "grid", gap: 10 }}><strong>{video.title || "Lesson video"}</strong>{video.description ? <p style={{ margin: 0 }}>{video.description}</p> : null}{videoEmbed ? <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", borderRadius: 16, overflow: "hidden", background: "#0f172a" }}><iframe title={video.title || "B2 lesson video"} src={videoEmbed} allowFullScreen style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} /></div> : null}</div> : <NoteBox tone="amber">Continue with the quick grammar preview and interactive check below.</NoteBox>}</Section>
      <B2QuizFirstLearnPreview lesson={guidedLesson} />
      <B2KnowledgeChoicePractice lesson={guidedLesson} onCompleteChange={(quizDone) => setProgress((old) => old.quizDone === quizDone ? old : { ...old, quizDone })} />
      <Section title="Deep grammar notes"><GrammarNotes day={day} checked={progress.learnNotesDone} onCheckedChange={(learnNotesDone) => setProgress((old) => ({ ...old, learnNotesDone }))} /></Section>
    </> : null}
    {active === "speak" ? <Section title="Speaking builder"><B2SpeakingSupportGuide lesson={guidedLesson} /><EmbeddedSpeechPracticePanel /><label style={{ display: "flex", gap: 9, alignItems: "center", fontWeight: 800 }}><input type="checkbox" checked={progress.speakDone} onChange={(event) => setProgress((old) => ({ ...old, speakDone: event.target.checked }))} />I completed a speaking practice.</label></Section> : null}
    {active === "write" ? <Section title="Guided writing builder"><WritingCheatSheetTabs level="B2" day={day}><WritingTaskPrompt lesson={guidedLesson} />{workbookUrl ? <a href={workbookUrl} style={{ ...styles.linkButton, width: "fit-content" }}>Open lesson workbook</a> : null}<GuidedWritingWorkspace config={getStandardWritingConfig(guidedLesson)} storageKey={getStandardLessonStorageKey(guidedLesson, "writing")} cloudField={getStandardWritingCloudField(guidedLesson)} /></WritingCheatSheetTabs></Section> : null}
    {active === "references" ? <WorkbookReferenceAnswers level="B2" lesson={guidedLesson} workbookId={`B2-day-${day}`} /> : null}
    {active === "finish" ? <Section title={`Summary B2 Day ${day}`}><NoteBox tone={progress.quizDone && progress.speakDone ? "green" : "amber"}><strong>{progress.quizDone && progress.speakDone ? "Core practice complete." : "Before finishing:"}</strong> Complete the grammar check and one speaking practice. Writing can then be reviewed in the Write tab.</NoteBox>{progress.completed ? <NoteBox tone="green"><strong>Completed.</strong> This lesson is saved as complete on this device.</NoteBox> : null}<button type="button" style={{ ...styles.primaryButton, width: "fit-content" }} onClick={() => { const completedAt = new Date().toISOString(); setProgress((old) => ({ ...old, completed: true, completedAt })); showToast(`B2 Day ${day} completed. Your progress was saved.`, "success"); }}>I have completed</button></Section> : null}
  </div>;
}
