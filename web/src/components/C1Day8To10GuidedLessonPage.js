import React, { useEffect, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import C1KnowledgeChoicePractice from "./C1KnowledgeChoicePractice";
import C1SpeakGrammarGuide from "./C1SpeakGrammarGuide";
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

export const C1_DAY9_FALOWEN_RADIO = {
  key: "c1-day9-konsum-werbung-falowen-radio",
  title: "Konsum und Werbung 2.4",
  youtubeId: "VpL14EhvvEM",
  duration: "",
  instruction:
    "Höre aufmerksam zu und stimme dich auf Konsum, Werbung, digitale Beeinflussung und Verantwortung ein. Danach gehst du weiter zum Lernteil.",
};

export const resolveC1Day8To10Radio = (day, canonicalLesson = null) =>
  canonicalLesson?.resources?.falowenRadio || (Number(day) === 9 ? C1_DAY9_FALOWEN_RADIO : null);

const NoteBox = ({ children, tone = "blue" }) => {
  const tones = { blue: ["#bfdbfe", "#eff6ff", "#1e3a8a"], green: ["#bbf7d0", "#f0fdf4", "#14532d"], amber: ["#fde68a", "#fffbeb", "#92400e"] };
  const [border, background, color] = tones[tone] || tones.blue;
  return <div style={{ border: `1px solid ${border}`, borderRadius: 14, padding: 12, background, color, lineHeight: 1.65 }}>{children}</div>;
};
const Section = ({ title, children }) => <section style={card}><h2 style={{ margin: 0, fontSize: "1.2rem" }}>{title}</h2>{children}</section>;

const summaries = {
  1: { title: "Ziele und Lernweg: C1 bewusst planen", intro: "C1 Day 1 hilft Lernenden, ihren Lernweg bewusst zu strukturieren. Es geht darum, Ziele realistisch zu begründen und Fortschritt messbar zu machen.", points: ["Formuliere konkrete Ziele statt allgemeiner Wünsche.", "Nutze Relativsätze mit Präpositionen, um Ziele, Methoden und Kriterien präzise zu verbinden.", "Eine starke C1-Antwort erklärt Ziel, Grund, Methode und Wirkung."], vocabulary: ["die Zielsetzung", "der Lernweg", "die Reflexion", "messbarer Fortschritt", "Eigenverantwortung"] },
  2: { title: "Kultur und Identität: Zugehörigkeit differenziert beschreiben", intro: "C1 Day 2 betrachtet Identität als Zusammenspiel von Herkunft, Sprache, Erfahrungen und gesellschaftlichen Erwartungen.", points: ["Beschreibe Identität als dynamischen Prozess.", "Nutze Partizip I und Partizip II als Adjektive, um kulturelle Prägung und Entwicklung präzise auszudrücken.", "Eine starke C1-Antwort vermeidet Klischees und erkennt Mehrfachzugehörigkeit an."], vocabulary: ["die Zugehörigkeit", "die Herkunft", "kulturelle Prägung", "das Selbstbild", "Mehrfachzugehörigkeit"] },
  3: { title: "Medien und Informationskompetenz: Quellen kritisch prüfen", intro: "C1 Day 3 fokussiert Fake News, digitale Quellen und den bewussten Umgang mit Informationen.", points: ["Prüfe Quelle, Datum, Autorenschaft und Absicht.", "Nutze Konjunktiv I und Distanzmarker, um Aussagen sachlich wiederzugeben.", "Eine starke C1-Antwort bewertet Informationen, ohne vorschnell zu urteilen."], vocabulary: ["die Quelle", "die Glaubwürdigkeit", "die Autorenschaft", "angeblich", "kritisch einordnen"] },
  4: { title: "Beziehungen und Teamarbeit: Konflikte konstruktiv analysieren", intro: "C1 Day 4 zeigt, dass Beziehungen und Teamarbeit nicht nur Harmonie bedeuten. Konflikte, Rollen, Kommunikation und Verantwortung müssen differenziert betrachtet werden.", points: ["Analysiere, warum Konflikte entstehen und wie sie gelöst werden können.", "Nutze Partizip I und II als Attribute, um Personen, Verhalten und Ergebnisse kompakt zu beschreiben.", "Eine starke C1-Antwort erklärt individuelle und strukturelle Faktoren."], vocabulary: ["die Zusammenarbeit", "die Kommunikationskultur", "Rollen klären", "Konflikte lösen", "Verantwortung teilen"] },
  5: { title: "Berufliche Entwicklung: Kompetenzen langfristig ausbauen", intro: "C1 Day 5 behandelt Arbeit, Karriere und Weiterbildung als dynamischen Prozess.", points: ["Beschreibe Karriere als Entwicklung von Kompetenzen.", "Nutze konditionale und finale Strukturen, um Bedingungen und berufliche Ziele präzise auszudrücken.", "Eine starke C1-Antwort verbindet Eigeninitiative mit strukturellen Chancen."], vocabulary: ["die Weiterbildung", "berufliche Mobilität", "Kompetenzen erweitern", "Arbeitsmarkt", "Eigeninitiative"] },
  6: { title: "Gesundheit und Lebensstil: Ursachen und Folgen verbinden", intro: "C1 Day 6 analysiert Gesundheit als Zusammenspiel von Lebensstil, Arbeit, Prävention und sozialem Umfeld.", points: ["Erkläre Gesundheitsverhalten individuell und gesellschaftlich.", "Nutze kausale, konsekutive und konzessive Strukturen für klare Argumentation.", "Eine starke C1-Antwort nennt Ursachen, Folgen und präventive Lösungen."], vocabulary: ["die Prävention", "die Belastung", "aufgrund", "folglich", "Gesundheitsförderung"] },
  7: { title: "Reisen und Nachhaltigkeit: Mobilität verantwortungsvoll bewerten", intro: "C1 Day 7 verbindet Reisen mit ökologischer und sozialer Verantwortung.", points: ["Vergleiche Reiseformen nach Kosten, Zeit, Komfort und Emissionen.", "Nutze erweiterte Vergleichsformen und abwägende Strukturen.", "Eine starke C1-Antwort fordert nicht nur Verzicht, sondern bewusstere Mobilität."], vocabulary: ["die Mobilität", "nachhaltiges Reisen", "Emissionen", "der Massentourismus", "bewusster Umgang"] },
  8: { title: "Wohnen und Stadtentwicklung: Raum, soziale Fragen und Planung", intro: "C1 Day 8 verbindet Wohnen mit Stadtentwicklung. Der Fokus liegt auf Wohnraummangel, steigenden Mieten, Verdichtung, Grünflächen und sozial-ökologischer Planung.", points: ["Analysiere nicht nur das Wohnproblem, sondern auch seine sozialen Folgen.", "Nutze Nominalisierung und Präpositionalstil, um Ursachen, Ziele und Maßnahmen formell auszudrücken.", "Eine starke C1-Antwort wägt bezahlbaren Wohnraum, Nachhaltigkeit und Lebensqualität gegeneinander ab."], vocabulary: ["die Stadtentwicklung", "die Verdichtung", "bezahlbarer Wohnraum", "soziale Durchmischung", "die Verdrängung"] },
  9: { title: "Konsum und Werbung: Einfluss kritisch reflektieren", intro: "C1 Day 9 behandelt Konsum nicht nur als Kaufhandlung, sondern als gesellschaftliches und psychologisches Phänomen.", points: ["Unterscheide zwischen Information, Manipulation und emotionaler Steuerung.", "Nutze argumentative Redemittel und Konjunktiv II, um Position, Einwand, Kritik und Lösung abgestuft zu formulieren.", "Eine starke C1-Antwort zeigt, wie Werbung individuelles Verhalten und gesellschaftliche Normen prägt."], vocabulary: ["die Werbewirkung", "das Kaufverhalten", "künstliche Bedürfnisse", "Konsumkompetenz", "kritisch reflektieren"] },
  10: { title: "Integration und Gesellschaft: Teilhabe differenziert bewerten", intro: "C1 Day 10 betrachtet Integration als Zusammenspiel von Sprache, Bildung, Arbeit, Anerkennung und gesellschaftlichen Strukturen.", points: ["Beschreibe Integration als Prozess, nicht als einmaliges Ziel.", "Nutze Konjunktiv I und klare Quellenmarker, um fremde Positionen neutral wiederzugeben und anschließend einzuordnen.", "Eine starke C1-Antwort verbindet individuelle Verantwortung mit institutioneller Unterstützung."], vocabulary: ["die Teilhabe", "institutionelle Unterstützung", "Sprachbarrieren abbauen", "soziale Anerkennung", "Zusammenhalt"] },
  11: { title: "Engagement und Ehrenamt: Verantwortung in der Gesellschaft", intro: "C1 Day 11 behandelt freiwilliges Engagement als wichtigen Teil gesellschaftlicher Teilhabe. Es geht darum, warum Menschen sich engagieren, wie Vereine und Initiativen funktionieren und wo die Grenzen freiwilliger Hilfe liegen.", points: ["Erkläre Motivation, Zweck und gesellschaftlichen Nutzen von Ehrenamt.", "Nutze passende Konnektoren, um Ergänzung, Gegensatz, Grund, Folge, Bedingung und Ziel klar zu verknüpfen.", "Eine starke C1-Antwort zeigt, dass Ehrenamt professionelle Strukturen ergänzen, aber nicht ersetzen sollte."], vocabulary: ["das Ehrenamt", "sich engagieren", "der Zusammenhalt", "niedrigschwellige Angebote", "Verantwortung übernehmen"] },
};

const embedUrl = (url = "") => { try { const parsed = new URL(url); const host = parsed.hostname.replace(/^www\./, ""); const id = host === "youtu.be" ? parsed.pathname.replace(/^\//, "") : parsed.searchParams.get("v") || parsed.pathname.split("/").filter(Boolean).pop(); return id ? `https://www.youtube.com/embed/${id}` : ""; } catch { return ""; } };
const FinishSummary = ({ day, lesson }) => { const item = summaries[day]; if (!item) return null; return <div style={{ border: "1px solid #bfdbfe", borderRadius: 16, padding: 14, background: "#eff6ff", display: "grid", gap: 10 }}><h3 style={{ margin: 0 }}>{item.title}</h3><p style={{ margin: 0, lineHeight: 1.7 }}>{item.intro}</p><ul style={listStyle}>{item.points.map((point) => <li key={point}>{point}</li>)}</ul>{lesson?.grammarFocus ? <div><strong>Grammar focus:</strong> {lesson.grammarFocus}</div> : null}<div><strong>Wortschatz:</strong> {item.vocabulary.join(" · ")}</div></div>; };

const SpeakingBuilder = ({ lesson }) => <C1SpeakGrammarGuide lesson={lesson} />;

export default function C1Day8To10GuidedLessonPage({ lesson, canonicalLesson = null }) {
  const { showToast } = useToast();
  const day = Number(lesson.day);
  const radio = resolveC1Day8To10Radio(day, canonicalLesson);
  const [entered, setEntered] = useState(() => !radio);
  const [active, setActive] = useState("learn");
  const storageKey = getStandardLessonStorageKey(lesson, "progress");
  const [progress, setProgress] = useState(() => { try { return { learnDone: false, speakDone: false, completed: false, ...JSON.parse(localStorage.getItem(storageKey) || "{}") }; } catch { return { learnDone: false, speakDone: false, completed: false }; } });
  useEffect(() => localStorage.setItem(storageKey, JSON.stringify(progress)), [progress, storageKey]);

  if (!entered && radio) {
    return <div style={{ ...styles.container, display: "grid", gap: 18 }}><AppBackButton label="Back to Course Book" fallbackPath="/campus/course" /><header style={{ ...card, borderColor: "#bfdbfe", background: "linear-gradient(135deg,#eff6ff,#f8fafc)" }}><span style={{ ...styles.badge, width: "fit-content", background: "#dbeafe", color: "#1e3a8a" }}>Start here</span><h1 style={{ margin: 0 }}>C1 · Day {day} · {lesson.title}</h1><p style={{ margin: 0, color: "#475569" }}>Listen to Falowen Radio first. Continue opens Learn, Speak, Write and Finish.</p></header><FalowenRadioTabContent level="C1" day={day} resource={radio} onContinue={() => { setEntered(true); window.scrollTo({ top: 0, behavior: "smooth" }); }} /></div>;
  }

  const video = lesson.videoResource || canonicalLesson?.resources?.aiVideo || canonicalLesson?.resources?.teacherVideo || null;
  const videoEmbed = embedUrl(video?.url);
  const workbookUrl = canonicalLesson?.resources?.workbook?.url || lesson.resources?.workbook?.url || "";
  const finish = () => { const completedAt = new Date().toISOString(); setProgress((old) => ({ ...old, completed: true, completedAt })); showToast(`C1 Day ${day} completed. Your progress was saved.`, "success"); };

  return <div style={{ ...styles.container, display: "grid", gap: 18 }}>
    <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
    <header style={{ borderRadius: 22, overflow: "hidden", color: "#fff", backgroundImage: `linear-gradient(135deg,rgba(2,6,23,.94),rgba(30,64,175,.72)),url(${lesson.heroImage || ""})`, backgroundSize: "cover", backgroundPosition: "center", padding: "clamp(22px,4vw,42px)", display: "grid", gap: 16, minHeight: 240, alignContent: "space-between" }}><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><span style={{ ...styles.badge, background: "rgba(255,255,255,.16)", color: "#fff" }}>C1</span><span style={{ ...styles.badge, background: "rgba(255,255,255,.16)", color: "#fff" }}>Day {day}</span><span style={{ ...styles.badge, background: "rgba(37,99,235,.9)", color: "#fff" }}>Chapter {lesson.chapter}</span></div><div><h1 style={{ margin: 0, fontSize: "clamp(2rem,5vw,3.4rem)" }}>{lesson.title}</h1><p style={{ margin: "10px 0 0", color: "#e2e8f0" }}>{lesson.topic}</p></div></header>
    <div style={{ position: "sticky", top: 0, zIndex: 5, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 8, padding: 10, border: "1px solid #e2e8f0", borderRadius: 18, background: "rgba(248,250,252,.94)" }}>{tabs.map((tab) => <button key={tab} type="button" onClick={() => setActive(tab)} style={{ ...(active === tab ? styles.primaryButton : styles.secondaryButton), borderRadius: 999, minHeight: 44 }}>{labels[tab]}</button>)}</div>
    {active === "learn" ? <><Section title="AI video">{video?.url ? <div style={{ display: "grid", gap: 10 }}><strong>{video.title || "Lesson video"}</strong>{video.description ? <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>{video.description}</p> : null}{videoEmbed ? <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", borderRadius: 16, overflow: "hidden", background: "#0f172a" }}><iframe title={video.title || "C1 lesson video"} src={videoEmbed} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} /></div> : null}</div> : <NoteBox tone="amber">No dedicated AI video has been added yet. Continue with the knowledge questions below.</NoteBox>}</Section><C1KnowledgeChoicePractice lesson={lesson} completed={progress.learnDone} onCompleteChange={(learnDone) => setProgress((old) => ({ ...old, learnDone }))} /></> : null}
    {active === "speak" ? <Section title="Speaking builder"><SpeakingBuilder lesson={lesson} /><EmbeddedSpeechPracticePanel /><label style={{ display: "flex", gap: 9, alignItems: "center", fontWeight: 800 }}><input type="checkbox" checked={progress.speakDone} onChange={(event) => setProgress((old) => ({ ...old, speakDone: event.target.checked }))} />I completed a speaking practice.</label></Section> : null}
    {active === "write" ? <Section title="Guided writing builder"><WritingCheatSheetTabs level="C1" day={day}><WritingTaskPrompt lesson={lesson} />{workbookUrl ? <a href={workbookUrl} style={{ ...styles.linkButton, width: "fit-content" }}>Open lesson workbook</a> : null}<GuidedWritingWorkspace config={getStandardWritingConfig(lesson)} storageKey={getStandardLessonStorageKey(lesson, "writing")} cloudField={getStandardWritingCloudField(lesson)} /></WritingCheatSheetTabs></Section> : null}
    {active === "references" ? <WorkbookReferenceAnswers level="C1" lesson={lesson} workbookId={`C1-day-${day}`} /> : null}
    {active === "finish" ? <Section title={`Summary C1 Day ${day}`}><FinishSummary day={day} lesson={lesson} />{progress.learnDone ? <NoteBox tone="green"><strong>Learn complete.</strong> All multiple-choice knowledge questions were answered correctly.</NoteBox> : <NoteBox tone="amber">Complete the Learn knowledge questions before considering this lesson fully reviewed.</NoteBox>}{progress.completed ? <NoteBox tone="green"><strong>Completed.</strong> This lesson is saved as complete on this device.</NoteBox> : null}<button type="button" style={{ ...styles.primaryButton, width: "fit-content" }} onClick={finish}>I have completed</button></Section> : null}
  </div>;
}
