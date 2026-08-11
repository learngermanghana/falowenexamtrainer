import React, { useEffect, useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import B2Day7To13GrammarNotes from "./B2Day7To13GrammarNotes";
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
import { getStandardLessonStorageKey, getStandardWritingCloudField, getStandardWritingConfig } from "../data/standardLessonJourney";
import { styles } from "../styles";

const tabs = ["learn", "speak", "write", "finish", "references"];
const labels = { learn: "1. Learn", speak: "2. Speak", write: "3. Write", finish: "4. Finish", references: "5. Ref" };
const card = { ...styles.card, display: "grid", gap: 14, border: "1px solid #e2e8f0", borderRadius: 18, boxShadow: "0 10px 26px rgba(15,23,42,.06)" };
const Section = ({ title, children }) => <section style={card}><h2 style={{ margin: 0, fontSize: "1.2rem" }}>{title}</h2>{children}</section>;
const NoteBox = ({ children, tone = "blue" }) => { const tones = { blue:["#bfdbfe","#eff6ff","#1e3a8a"], green:["#bbf7d0","#f0fdf4","#14532d"], amber:["#fde68a","#fffbeb","#92400e"] }; const [border,background,color] = tones[tone] || tones.blue; return <div style={{ border:`1px solid ${border}`, borderRadius:14, padding:12, background, color, lineHeight:1.65 }}>{children}</div>; };

const supplemental = {
  11: {
    question: "Was hilft Menschen dabei, sich in einer Gesellschaft zu integrieren und aktiv teilzunehmen?",
    branches: [
      { id:"sprache", title:"Sprache", prompt:"Welche Rolle spielen Sprachkenntnisse?", keywords:["Sprachkurs","Behörden","Arbeit","Kontakte"], example:"Gute Sprachkenntnisse erleichtern den Zugang zu Arbeit und Behörden. Außerdem können Zugewanderte leichter Kontakte knüpfen.", starter:"Ein wichtiger Faktor für Integration ist ..." },
      { id:"arbeit", title:"Arbeit und Bildung", prompt:"Wie fördern Arbeit und Bildung Teilhabe?", keywords:["Ausbildung","Weiterbildung","Arbeitsmarkt","Qualifikation"], example:"Arbeit schafft nicht nur Einkommen, sondern auch soziale Kontakte und Orientierung im Alltag.", starter:"Eine weitere Möglichkeit wäre ..." },
      { id:"verein", title:"Vereine und Alltag", prompt:"Wie entstehen soziale Kontakte?", keywords:["Verein","Nachbarschaft","Ehrenamt","Begegnung"], example:"Vereine könnten neue Mitglieder gezielt einladen, damit Menschen schneller Teil einer Gemeinschaft werden.", starter:"Vereine könnten ..." },
      { id:"loesung", title:"Ausgewogene Lösung", prompt:"Was könnten Institutionen verbessern?", keywords:["einfache Sprache","Beratung","Zugang","Respekt"], example:"Es wäre hilfreich, wenn Behörden Informationen verständlicher und teilweise mehrsprachig anbieten würden.", starter:"Es wäre hilfreich, wenn ..." },
    ],
    quiz: [
      { question:"Welche Form klingt als höflicher gesellschaftlicher Vorschlag?", options:["Man muss das machen.","Man könnte Sprachkurse leichter zugänglich machen.","Mach Sprachkurse!","Sprachkurse machen."], answer:"Man könnte Sprachkurse leichter zugänglich machen.", explanation:"Könnte im Konjunktiv II formuliert einen diplomatischen Vorschlag." },
      { question:"Welche Form ist richtig?", options:["Es wäre hilfreich, wenn Informationen klarer wären.","Es ist hilfreich, wenn Informationen klarer würden sind.","Es wäre hilfreich, wenn wären Informationen klarer.","Es hilfreich wäre, Informationen klar."], answer:"Es wäre hilfreich, wenn Informationen klarer wären.", explanation:"Im wenn-Satz steht das Verb am Ende; wäre/wären markieren den Konjunktiv II." },
      { question:"Welche hypothetische Folge ist korrekt?", options:["Wenn mehr Menschen teilnehmen würden, könnten Vorurteile abgebaut werden.","Wenn würden mehr Menschen teilnehmen, Vorurteile könnten.","Mehr Menschen teilnehmen wenn, könnten Vorurteile.","Wenn mehr Menschen teilnahmen, können Vorurteile immer."], answer:"Wenn mehr Menschen teilnehmen würden, könnten Vorurteile abgebaut werden.", explanation:"Wenn + Konjunktiv II und eine mögliche Folge passen zusammen." },
      { question:"Welches Modalverb eignet sich für einen vorsichtigen Rat?", options:["sollte","muss","wird","hat"], answer:"sollte", explanation:"Sollte klingt als Empfehlung weniger absolut als muss." },
    ],
  },
  12: {
    question: "Welche Rolle spielen Kultur und Freizeit für Lebensqualität und soziale Kontakte?",
    branches: [
      { id:"hobby", title:"Hobbys", prompt:"Warum sind Hobbys wichtig?", keywords:["Erholung","Interesse","Routine","Gesundheit"], example:"Wenn Menschen regelmäßig einem Hobby nachgehen, können sie Stress reduzieren und neue Fähigkeiten entwickeln.", starter:"Wenn ich Freizeit habe, ..." },
      { id:"verein", title:"Vereine", prompt:"Wie fördern Vereine Kontakte?", keywords:["Sport","Musik","Treffen","Gemeinschaft"], example:"Nachdem man einige Wochen regelmäßig an einem Verein teilgenommen hat, entstehen oft neue Kontakte.", starter:"Nachdem ... , ..." },
      { id:"kultur", title:"Kulturangebote", prompt:"Was bringen Veranstaltungen?", keywords:["Konzert","Museum","Stadtfest","Kultur"], example:"Als ich zum ersten Mal ein Stadtfest besucht habe, konnte ich die lokale Kultur besser kennenlernen.", starter:"Als ich ... , ..." },
      { id:"planung", title:"Zeit und Planung", prompt:"Wie plant man Freizeit sinnvoll?", keywords:["bevor","während","Termin","Balance"], example:"Bevor man eine Veranstaltung besucht, sollte man sich über Zeit, Kosten und Anfahrt informieren.", starter:"Bevor ... , ..." },
    ],
    quiz: [
      { question:"Welche Form passt für ein einmaliges Ereignis in der Vergangenheit?", options:["als","wenn","damit","obwohl"], answer:"als", explanation:"Als verwendet man typischerweise für einmalige Ereignisse in der Vergangenheit." },
      { question:"Welche Form passt für wiederholte Situationen?", options:["wenn","als","bevor nur Vergangenheit","trotzdem"], answer:"wenn", explanation:"Wenn passt gut zu wiederholten oder gegenwärtigen Bedingungen." },
      { question:"Welche Wortstellung ist richtig?", options:["Nachdem der Kurs endet, treffen wir uns.","Nachdem endet der Kurs, treffen wir uns.","Nachdem der Kurs, endet treffen wir.","Nachdem wir treffen, der Kurs endet."], answer:"Nachdem der Kurs endet, treffen wir uns.", explanation:"Im Nebensatz steht das konjugierte Verb am Ende." },
      { question:"Welche Struktur beschreibt eine Handlung vor einer anderen?", options:["bevor","nachdem","während","deshalb"], answer:"bevor", explanation:"Bevor markiert, dass eine Handlung vor einer anderen stattfindet." },
    ],
  },
  13: {
    question: "Wie können Familien mit unterschiedlichen Erwartungen zwischen Generationen umgehen?",
    branches: [
      { id:"freiheit", title:"Freiheit", prompt:"Was wünschen jüngere Menschen?", keywords:["Selbstständigkeit","Entscheidung","Ausbildung","Wohnort"], example:"Viele junge Erwachsene wünschen mehr Selbstständigkeit, weil sie eigene Entscheidungen treffen möchten.", starter:"Ein häufiger Grund dafür ist, dass ..." },
      { id:"sicherheit", title:"Sicherheit", prompt:"Was ist älteren Generationen wichtig?", keywords:["Erfahrung","Stabilität","Familie","Verantwortung"], example:"Während jüngere Menschen Freiheit betonen, legen ältere Familienmitglieder häufig mehr Wert auf Sicherheit.", starter:"Während ... , ..." },
      { id:"konflikt", title:"Konflikte", prompt:"Warum entstehen Spannungen?", keywords:["Erwartungen","Pflege","Geld","Kommunikation"], example:"Obwohl beide Seiten das Beste für die Familie wollen, können unterschiedliche Erwartungen zu Konflikten führen.", starter:"Obwohl ... , ..." },
      { id:"loesung", title:"Lösung", prompt:"Wie kann man Konflikte reduzieren?", keywords:["Gespräch","Kompromiss","Grenzen","Unterstützung"], example:"Offene Gespräche schaffen Verständnis. Deshalb sollten Entscheidungen möglichst gemeinsam besprochen werden.", starter:"Deshalb wäre es sinnvoll, ..." },
    ],
    quiz: [
      { question:"Welcher Konnektor drückt einen Grund aus?", options:["weil","obwohl","während","trotzdem"], answer:"weil", explanation:"Weil leitet einen kausalen Nebensatz ein." },
      { question:"Welcher Satz drückt einen Gegensatz aus?", options:["Während Eltern Sicherheit wichtig finden, wünschen Jugendliche mehr Freiheit.","Eltern finden Sicherheit wichtig, weil Jugendliche Freiheit wünschen.","Deshalb Eltern Sicherheit.","Familien und Freiheit."], answer:"Während Eltern Sicherheit wichtig finden, wünschen Jugendliche mehr Freiheit.", explanation:"Während kann zwei unterschiedliche Perspektiven kontrastieren." },
      { question:"Welche Folge ist korrekt verbunden?", options:["Pflege kostet viel Zeit. Deshalb brauchen Familien Unterstützung.","Pflege kostet viel Zeit, obwohl brauchen Familien Unterstützung.","Pflege kostet viel Zeit, weil deshalb Familien.","Pflege deshalb Zeit."], answer:"Pflege kostet viel Zeit. Deshalb brauchen Familien Unterstützung.", explanation:"Deshalb leitet eine Folge ein und steht im Hauptsatz." },
      { question:"Welche Wortstellung ist korrekt?", options:["Obwohl ältere Menschen Erfahrung haben, fühlen sie sich manchmal ausgeschlossen.","Obwohl haben ältere Menschen Erfahrung, sie fühlen sich.","Obwohl ältere Menschen haben Erfahrung, fühlen sie.","Ältere obwohl Menschen Erfahrung."], answer:"Obwohl ältere Menschen Erfahrung haben, fühlen sie sich manchmal ausgeschlossen.", explanation:"Im obwohl-Nebensatz steht das Verb am Ende." },
    ],
  },
  14: {
    question: "Was macht eine gute Freundschaft aus, und welche Rolle spielen Vertrauen und persönliche Grenzen?",
    branches: [
      { id:"vertrauen", title:"Vertrauen", prompt:"Warum ist Vertrauen zentral?", keywords:["ehrlich","zuverlässig","Unterstützung","Geheimnis"], example:"Eine gute Freundin ist eine Person, der man auch in schwierigen Situationen vertrauen kann.", starter:"Eine Person, der ich vertraue, ..." },
      { id:"grenzen", title:"Grenzen", prompt:"Warum braucht Freundschaft Grenzen?", keywords:["Privatsphäre","Respekt","Zeit","Nein sagen"], example:"Freundschaften, in denen persönliche Grenzen respektiert werden, sind langfristig oft stabiler.", starter:"Eine Freundschaft, in der ..." },
      { id:"digital", title:"Digitale Kontakte", prompt:"Können Online-Freundschaften gleichwertig sein?", keywords:["soziale Medien","Distanz","Kontakt","Nähe"], example:"Menschen, mit denen man regelmäßig online spricht, können wichtig sein, auch wenn persönliche Treffen fehlen.", starter:"Menschen, mit denen ..." },
      { id:"konflikt", title:"Konflikte", prompt:"Wie löst man Streit?", keywords:["Gespräch","Entschuldigung","Verständnis","Kompromiss"], example:"Ein Konflikt, über den offen gesprochen wird, kann manchmal sogar das Vertrauen stärken.", starter:"Ein Konflikt, über den ..." },
    ],
    quiz: [
      { question:"Welche Form ist richtig? Das ist die Freundin, ___ ich vertraue.", options:["der","die","den","deren"], answer:"der", explanation:"Vertrauen verlangt Dativ; Freundin ist feminin, daher der." },
      { question:"Welche Form ist richtig? Das ist der Freund, mit ___ ich oft spreche.", options:["dem","den","der","dessen"], answer:"dem", explanation:"Mit verlangt Dativ; Freund ist maskulin, daher dem." },
      { question:"Welche Form ist richtig? Das ist die Person, ___ ich gestern getroffen habe.", options:["die","der","dem","deren"], answer:"die", explanation:"Treffen verlangt Akkusativ; Person ist feminin, daher die." },
      { question:"Welche Struktur ist korrekt?", options:["Eine Freundschaft, in der Grenzen respektiert werden, ist stabil.","Eine Freundschaft, in die Grenzen respektiert werden, ist stabil.","Eine Freundschaft, der in Grenzen respektiert, ist stabil.","Eine Freundschaft in der, Grenzen werden."], answer:"Eine Freundschaft, in der Grenzen respektiert werden, ist stabil.", explanation:"Bei Ort/Zustand mit in steht hier Dativ; Freundschaft ist feminin: in der." },
    ],
  },
  15: {
    question: "Wie kann man sich gesund ernähren, ohne dass Essen zu teuer oder kompliziert wird?",
    branches: [
      { id:"gesund", title:"Gesundheit", prompt:"Was gehört zu ausgewogener Ernährung?", keywords:["Gemüse","Wasser","Zucker","Bewegung"], example:"Obwohl gesunde Ernährung Planung braucht, kann sie langfristig das Wohlbefinden verbessern.", starter:"Obwohl ... , ..." },
      { id:"preis", title:"Preis", prompt:"Muss gesundes Essen teuer sein?", keywords:["regional","saisonal","Budget","Kochen"], example:"Man kann gesund essen, ohne ständig teure Spezialprodukte zu kaufen.", starter:"Man kann ... , ohne ... zu ..." },
      { id:"alltag", title:"Alltag", prompt:"Wie spart man Zeit?", keywords:["Meal Prep","Einkaufsliste","vorbereiten","Routine"], example:"Anstatt jeden Tag spontan Fast Food zu kaufen, kann man Mahlzeiten im Voraus planen.", starter:"Anstatt ... zu ... , ..." },
      { id:"konsum", title:"Bewusster Konsum", prompt:"Welche Rolle spielen Herkunft und Verpackung?", keywords:["regional","Bio","Verpackung","Lebensmittelverschwendung"], example:"Auch wenn Bio-Produkte nicht immer möglich sind, kann man auf regionale und saisonale Lebensmittel achten.", starter:"Auch wenn ... , ..." },
    ],
    quiz: [
      { question:"Welche Struktur drückt einen Gegensatz trotz eines Hindernisses aus?", options:["obwohl","deshalb","damit","nachdem"], answer:"obwohl", explanation:"Obwohl leitet einen konzessiven Nebensatz ein." },
      { question:"Welche Form ist richtig?", options:["Man kann gesund essen, ohne viel Geld auszugeben.","Man kann gesund essen, ohne viel Geld ausgeben.","Man kann gesund essen, ohne auszugeben viel Geld.","Man kann gesund essen, ohne zu viel Geld ausgeben."], answer:"Man kann gesund essen, ohne viel Geld auszugeben.", explanation:"Ohne ... zu steht mit Infinitiv mit zu; ausgeben wird zu auszugeben." },
      { question:"Welche Form ist korrekt?", options:["Anstatt Fast Food zu kaufen, koche ich selbst.","Anstatt zu Fast Food kaufen, koche ich.","Anstatt Fast Food kaufen zu, koche ich.","Anstatt kaufe Fast Food, ich koche."], answer:"Anstatt Fast Food zu kaufen, koche ich selbst.", explanation:"Anstatt ... zu + Infinitiv beschreibt eine Alternative bei gleichem Subjekt." },
      { question:"Welche Form ist korrekt?", options:["Obwohl Bio-Produkte teurer sind, kaufen manche Menschen sie regelmäßig.","Obwohl sind Bio-Produkte teurer, manche Menschen kaufen.","Obwohl Bio-Produkte sind teurer, kaufen manche.","Bio-Produkte obwohl teurer."], answer:"Obwohl Bio-Produkte teurer sind, kaufen manche Menschen sie regelmäßig.", explanation:"Im obwohl-Nebensatz steht das Verb am Ende." },
    ],
  },
};

const enhanceLesson = (lesson) => { const extra = supplemental[Number(lesson?.day || 0)]; if (!extra) return lesson; return { ...lesson, grammarLesson:{ ...(lesson.grammarLesson || {}), knowledgeTest:extra.quiz }, speakingBuilder:{ ...(lesson.speakingBuilder || {}), question:extra.question, branches:extra.branches } }; };
const GrammarNotes = ({ day, checked, onCheckedChange }) => day <= 13 ? <B2Day7To13GrammarNotes day={day} checked={checked} onCheckedChange={onCheckedChange} /> : <B2Day14To16GrammarNotes day={day} checked={checked} onCheckedChange={onCheckedChange} />;
const embedUrl = (url="") => { try { const parsed = new URL(url); const host = parsed.hostname.replace(/^www\./,""); const id = host === "youtu.be" ? parsed.pathname.replace(/^\//,"") : parsed.searchParams.get("v") || parsed.pathname.split("/").filter(Boolean).pop(); return id ? `https://www.youtube.com/embed/${id}` : ""; } catch { return ""; } };

export default function B2Day11To15SelfTutoringPage({ lesson, canonicalLesson = null }) {
  const { showToast } = useToast();
  const guidedLesson = useMemo(() => enhanceLesson(lesson), [lesson]);
  const day = Number(guidedLesson.day);
  const radio = canonicalLesson?.resources?.falowenRadio || null;
  const [entered, setEntered] = useState(() => !radio);
  const [active, setActive] = useState("learn");
  const storageKey = getStandardLessonStorageKey(guidedLesson, "progress");
  const [progress, setProgress] = useState(() => { try { return { learnNotesDone:false, quizDone:false, speakDone:false, completed:false, ...JSON.parse(localStorage.getItem(storageKey) || "{}") }; } catch { return { learnNotesDone:false, quizDone:false, speakDone:false, completed:false }; } });
  useEffect(() => localStorage.setItem(storageKey, JSON.stringify(progress)), [progress, storageKey]);
  if (!entered && radio) return <div style={{ ...styles.container, display:"grid", gap:18 }}><AppBackButton label="Back to Course Book" fallbackPath="/campus/course" /><FalowenRadioTabContent level="B2" day={day} resource={radio} onContinue={() => setEntered(true)} /></div>;
  const video = guidedLesson.videoResource || canonicalLesson?.resources?.aiVideo || canonicalLesson?.resources?.teacherVideo || null;
  const videoEmbed = embedUrl(video?.url);
  const workbookUrl = canonicalLesson?.resources?.workbook?.url || guidedLesson.resources?.workbook?.url || "";
  const finish = () => { const completedAt = new Date().toISOString(); setProgress((old) => ({ ...old, completed:true, completedAt })); showToast(`B2 Day ${day} completed. Your progress was saved.`, "success"); };
  return <div style={{ ...styles.container, display:"grid", gap:18 }}>
    <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
    <header style={{ ...card, background:"linear-gradient(135deg,#0f172a,#1d4ed8)", color:"#fff" }}><span style={{ ...styles.badge, width:"fit-content" }}>B2 · Day {day}</span><h1 style={{ margin:0 }}>{guidedLesson.title}</h1><p style={{ margin:0 }}>{guidedLesson.topic}</p></header>
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))", gap:8 }}>{tabs.map((tab) => <button key={tab} type="button" onClick={() => setActive(tab)} style={active === tab ? styles.primaryButton : styles.secondaryButton}>{labels[tab]}</button>)}</div>
    {active === "learn" ? <><Section title="AI video">{videoEmbed ? <iframe title={video?.title || "B2 lesson video"} src={videoEmbed} allowFullScreen style={{ width:"100%", minHeight:360, border:0, borderRadius:14 }} /> : <NoteBox tone="amber">Continue with the grammar notes and clickable check.</NoteBox>}</Section><GrammarNotes day={day} checked={progress.learnNotesDone} onCheckedChange={(learnNotesDone) => setProgress((old) => ({ ...old, learnNotesDone }))} /><B2KnowledgeChoicePractice lesson={guidedLesson} onCompleteChange={(quizDone) => setProgress((old) => ({ ...old, quizDone }))} /></> : null}
    {active === "speak" ? <Section title="Speaking builder"><B2SpeakingSupportGuide lesson={guidedLesson} /><EmbeddedSpeechPracticePanel /><label><input type="checkbox" checked={progress.speakDone} onChange={(event) => setProgress((old) => ({ ...old, speakDone:event.target.checked }))} /> I completed a speaking practice.</label></Section> : null}
    {active === "write" ? <Section title="Guided writing builder"><WritingCheatSheetTabs level="B2" day={day}><WritingTaskPrompt lesson={guidedLesson} />{workbookUrl ? <a href={workbookUrl} style={{ ...styles.linkButton, width:"fit-content" }}>Open lesson workbook</a> : null}<GuidedWritingWorkspace config={getStandardWritingConfig(guidedLesson)} storageKey={getStandardLessonStorageKey(guidedLesson,"writing")} cloudField={getStandardWritingCloudField(guidedLesson)} /></WritingCheatSheetTabs></Section> : null}
    {active === "references" ? <WorkbookReferenceAnswers level="B2" lesson={guidedLesson} workbookId={`B2-day-${day}`} /> : null}
    {active === "finish" ? <Section title={`Summary B2 Day ${day}`}><NoteBox tone={progress.learnNotesDone && progress.quizDone && progress.speakDone ? "green" : "amber"}>Learn notes: {progress.learnNotesDone ? "done" : "open"} · grammar check: {progress.quizDone ? "done" : "open"} · speaking: {progress.speakDone ? "done" : "open"}</NoteBox><button type="button" style={{ ...styles.primaryButton, width:"fit-content" }} onClick={finish}>I have completed</button></Section> : null}
  </div>;
}
