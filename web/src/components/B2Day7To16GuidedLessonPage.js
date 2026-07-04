import React, { useEffect, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import B2Day7To13GrammarNotes from "./B2Day7To13GrammarNotes";
import B2Day14To16GrammarNotes from "./B2Day14To16GrammarNotes";
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

const NoteBox = ({ children, tone = "blue" }) => {
  const tones = {
    blue: ["#bfdbfe", "#eff6ff", "#1e3a8a"],
    green: ["#bbf7d0", "#f0fdf4", "#14532d"],
    amber: ["#fde68a", "#fffbeb", "#92400e"],
  };
  const [border, background, color] = tones[tone] || tones.blue;
  return <div style={{ border: `1px solid ${border}`, borderRadius: 14, padding: 12, background, color, lineHeight: 1.65 }}>{children}</div>;
};

const Section = ({ title, children }) => <section style={card}><h2 style={{ margin: 0, fontSize: "1.2rem" }}>{title}</h2>{children}</section>;

const summaries = {
  7: {
    title: "Umwelt und Nachhaltigkeit: Nachhaltiger Alltag in Deutschland",
    intro: "In Deutschland begegnet dir Nachhaltigkeit im Alltag sehr konkret: Mülltrennung, Pfandflaschen, Energiesparen, öffentlicher Verkehr und Diskussionen über Klimaschutz gehören für viele Menschen zum täglichen Leben.",
    points: ["Mülltrennung und Pfandsystem zeigen, dass Umweltverhalten oft durch klare Regeln organisiert wird.", "Nachhaltigkeit bedeutet auch kleine Entscheidungen beim Einkaufen, Heizen und Reisen.", "In deiner B2-Antwort solltest du erklären, welche Maßnahme sinnvoll ist, warum sie hilft und welche Schwierigkeit es gibt."],
    vocabulary: ["die Mülltrennung", "das Pfand", "der Klimaschutz", "die Verpackung", "Ressourcen sparen"],
  },
  8: {
    title: "Reisen und Mobilität: Unterwegs in Deutschland",
    intro: "Mobilität ist in Deutschland eng mit Alltag und Nachhaltigkeit verbunden. Viele Menschen vergleichen Auto, Bahn, Fahrrad und Flugzeug nach Kosten, Flexibilität, Zeit und Umweltwirkung.",
    points: ["In Städten sind Bahn, Bus und Fahrrad oft praktisch, während auf dem Land das Auto wichtiger bleibt.", "Reisen wird häufig unter dem Blickwinkel von Komfort, Preis und Klimaschutz diskutiert.", "Eine gute B2-Antwort vergleicht mindestens zwei Verkehrsmittel und nennt klare Vor- und Nachteile."],
    vocabulary: ["der öffentliche Verkehr", "die Verbindung", "die Mobilität", "klimafreundlich", "die Verspätung"],
  },
  9: {
    title: "Wohnen und Nachbarschaft: Zusammenleben in Deutschland",
    intro: "Wohnen in Deutschland bedeutet oft, Regeln und Rücksicht zu beachten: Mietvertrag, Hausordnung, Ruhezeiten und Kommunikation mit Vermietern oder Nachbarn sind wichtige Alltagsthemen.",
    points: ["Viele Konflikte entstehen durch Lärm, Reparaturen, Nebenkosten oder unterschiedliche Erwartungen.", "Höfliche und sachliche Kommunikation ist wichtig, besonders bei Beschwerden.", "In deiner Antwort solltest du Problem, Folge und Lösung klar nennen."],
    vocabulary: ["die Miete", "die Nebenkosten", "die Hausordnung", "die Ruhezeit", "der Vermieter"],
  },
  10: {
    title: "Konsum und Geld: Bewusst einkaufen in Deutschland",
    intro: "Beim Konsum geht es in Deutschland nicht nur um Preise, sondern auch um Qualität, Herkunft, Werbung, Nachhaltigkeit und persönliche Verantwortung.",
    points: ["Viele Menschen vergleichen Angebote, planen ihr Budget und achten auf Sonderaktionen.", "Gleichzeitig wird diskutiert, wie Werbung Kaufentscheidungen beeinflusst.", "Eine starke B2-Antwort wägt Preis, Bedarf, Qualität und Verantwortung gegeneinander ab."],
    vocabulary: ["das Budget", "die Werbung", "das Angebot", "die Qualität", "bewusst konsumieren"],
  },
  11: {
    title: "Gesellschaft und Integration: Teilhabe in Deutschland",
    intro: "Integration betrifft in Deutschland Sprache, Arbeit, Schule, Behörden, Vereine und Nachbarschaft. Es geht darum, wie Menschen aktiv am gesellschaftlichen Leben teilnehmen können.",
    points: ["Deutschkenntnisse helfen bei Arbeit, Ausbildung, Ämtern und sozialen Kontakten.", "Integration ist keine Einbahnstraße: Zugewanderte und Aufnahmegesellschaft tragen beide Verantwortung.", "In deiner B2-Antwort solltest du konkrete Möglichkeiten nennen, wie Teilhabe leichter werden kann."],
    vocabulary: ["die Teilhabe", "die Integration", "die Zugehörigkeit", "der Sprachkurs", "Vorurteile abbauen"],
  },
  12: {
    title: "Kultur und Freizeit: Kontakte durch Aktivitäten",
    intro: "Freizeit und Kultur helfen in Deutschland oft beim Ankommen. Vereine, Kurse, Stadtfeste, Sportgruppen und kulturelle Angebote schaffen Kontakte außerhalb von Schule oder Arbeit.",
    points: ["Vereine spielen eine große Rolle, weil Menschen dort regelmäßig zusammenkommen.", "Kulturelle Angebote zeigen regionale Unterschiede und helfen, eine Stadt besser kennenzulernen.", "Eine gute B2-Antwort erklärt, warum Freizeit nicht nur Erholung, sondern auch soziale Teilhabe ist."],
    vocabulary: ["der Verein", "die Veranstaltung", "das Stadtfest", "die Freizeit", "Kontakte knüpfen"],
  },
  13: {
    title: "Familie und Generationen: Verantwortung und Freiheit",
    intro: "Familienleben in Deutschland ist vielfältig: klassische Familien, Alleinerziehende, Patchworkfamilien und Menschen, die allein leben. Gleichzeitig werden Generationenfragen wie Pflege, Freiheit und Verantwortung diskutiert.",
    points: ["Jüngere Menschen wünschen oft Selbstständigkeit, während ältere Generationen Erfahrung und Sicherheit betonen.", "Pflege, Kinderbetreuung und finanzielle Verantwortung können Familien stark belasten.", "In deiner B2-Antwort solltest du unterschiedliche Perspektiven fair vergleichen."],
    vocabulary: ["die Generation", "die Verantwortung", "die Pflege", "die Selbstständigkeit", "das Familienmodell"],
  },
  14: {
    title: "Freundschaft und soziale Beziehungen: Vertrauen im Alltag",
    intro: "In Deutschland entstehen Freundschaften oft langsam, aber sie können sehr zuverlässig sein. Pünktlichkeit, Ehrlichkeit, klare Absprachen und persönliche Grenzen spielen in Beziehungen eine wichtige Rolle.",
    points: ["Freundschaft bedeutet nicht nur Kontakt, sondern auch Vertrauen, Unterstützung und Respekt.", "Digitale Kontakte können hilfreich sein, ersetzen aber nicht immer persönliche Nähe.", "Eine gute B2-Antwort beschreibt Eigenschaften und erklärt, warum sie wichtig sind."],
    vocabulary: ["das Vertrauen", "die Zuverlässigkeit", "die Grenze", "die Ehrlichkeit", "sich verlassen auf"],
  },
  15: {
    title: "Ernährung und Konsumverhalten: Bewusst essen",
    intro: "Ernährung ist in Deutschland ein Alltagsthema mit vielen Perspektiven: Gesundheit, Preis, Herkunft, Tierwohl, Nachhaltigkeit und Zeit spielen bei Essgewohnheiten eine Rolle.",
    points: ["Viele Menschen achten auf gesunde Ernährung, aber Alltag, Geld und Zeit beeinflussen Entscheidungen.", "Bio-Produkte, regionale Lebensmittel und vegetarische Ernährung werden häufig diskutiert.", "In deiner B2-Antwort solltest du zeigen, dass Konsum Entscheidungen und Kompromisse bedeutet."],
    vocabulary: ["die Ernährung", "das Lebensmittel", "regional", "verarbeitet", "die Gewohnheit"],
  },
  16: {
    title: "Digitalisierung im Alltag: Chancen und Risiken",
    intro: "Digitale Werkzeuge prägen in Deutschland Arbeit, Schule, Behörden, Kommunikation und Einkauf. Sie machen vieles schneller, bringen aber auch Fragen zu Datenschutz und Abhängigkeit mit sich.",
    points: ["Online-Dienste können Zeit sparen, wenn sie verständlich und sicher gestaltet sind.", "Datenschutz ist wichtig, weil viele persönliche Informationen digital gespeichert werden.", "Eine gute B2-Antwort nennt Chancen und Risiken und kommt zu einer ausgewogenen Meinung."],
    vocabulary: ["die Digitalisierung", "der Datenschutz", "die App", "die Speicherung", "abhängig sein von"],
  },
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

const GrammarNotes = ({ day, checked, onCheckedChange }) => {
  if (day >= 7 && day <= 13) return <B2Day7To13GrammarNotes day={day} checked={checked} onCheckedChange={onCheckedChange} />;
  return <B2Day14To16GrammarNotes day={day} checked={checked} onCheckedChange={onCheckedChange} />;
};

const FinishSummary = ({ day }) => {
  const item = summaries[day];
  if (!item) return null;
  return (
    <div style={{ border: "1px solid #bfdbfe", borderRadius: 16, padding: 14, background: "#eff6ff", display: "grid", gap: 10 }}>
      <h3 style={{ margin: 0 }}>{item.title}</h3>
      <p style={{ margin: 0, lineHeight: 1.7 }}>{item.intro}</p>
      <ul style={listStyle}>{item.points.map((point) => <li key={point}>{point}</li>)}</ul>
      <div><strong>Wortschatz:</strong> {item.vocabulary.join(" · ")}</div>
    </div>
  );
};

export default function B2Day7To16GuidedLessonPage({ lesson, canonicalLesson = null }) {
  const { showToast } = useToast();
  const day = Number(lesson.day);
  const radio = canonicalLesson?.resources?.falowenRadio || null;
  const [entered, setEntered] = useState(() => !radio);
  const [active, setActive] = useState("learn");
  const [progress, setProgress] = useState(() => {
    try {
      return { learnDone: false, speakDone: false, completed: false, ...JSON.parse(localStorage.getItem(getStandardLessonStorageKey(lesson, "progress")) || "{}") };
    } catch {
      return { learnDone: false, speakDone: false, completed: false };
    }
  });

  const storageKey = getStandardLessonStorageKey(lesson, "progress");
  useEffect(() => localStorage.setItem(storageKey, JSON.stringify(progress)), [progress, storageKey]);

  if (!entered && radio) {
    return (
      <div style={{ ...styles.container, display: "grid", gap: 18 }}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <header style={{ ...card, borderColor: "#bfdbfe", background: "linear-gradient(135deg,#eff6ff,#f8fafc)" }}>
          <span style={{ ...styles.badge, width: "fit-content", background: "#dbeafe", color: "#1e3a8a" }}>Start here</span>
          <h1 style={{ margin: 0 }}>B2 · Day {day} · {lesson.title}</h1>
          <p style={{ margin: 0, color: "#475569" }}>Listen to Falowen Radio first. Continue opens Learn, Speak, Write and Finish.</p>
        </header>
        <FalowenRadioTabContent level="B2" day={day} resource={radio} onContinue={() => { setEntered(true); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
      </div>
    );
  }

  const video = lesson.videoResource || canonicalLesson?.resources?.aiVideo || canonicalLesson?.resources?.teacherVideo || null;
  const videoEmbed = embedUrl(video?.url);
  const workbookUrl = canonicalLesson?.resources?.workbook?.url || lesson.resources?.workbook?.url || "";

  const finish = () => {
    const completedAt = new Date().toISOString();
    setProgress((old) => ({ ...old, completed: true, completedAt }));
    showToast(`B2 Day ${day} completed. Your progress was saved.`, "success");
  };

  return (
    <div style={{ ...styles.container, display: "grid", gap: 18 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
      <header style={{ borderRadius: 22, overflow: "hidden", color: "#fff", backgroundImage: `linear-gradient(135deg,rgba(2,6,23,.94),rgba(30,64,175,.72)),url(${lesson.heroImage || ""})`, backgroundSize: "cover", backgroundPosition: "center", padding: "clamp(22px,4vw,42px)", display: "grid", gap: 16, minHeight: 240, alignContent: "space-between" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={{ ...styles.badge, background: "rgba(255,255,255,.16)", color: "#fff" }}>B2</span>
          <span style={{ ...styles.badge, background: "rgba(255,255,255,.16)", color: "#fff" }}>Day {day}</span>
          <span style={{ ...styles.badge, background: "rgba(37,99,235,.9)", color: "#fff" }}>Chapter {lesson.chapter}</span>
        </div>
        <div><h1 style={{ margin: 0, fontSize: "clamp(2rem,5vw,3.4rem)" }}>{lesson.title}</h1><p style={{ margin: "10px 0 0", color: "#e2e8f0" }}>{lesson.topic}</p></div>
      </header>

      <div style={{ position: "sticky", top: 0, zIndex: 5, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 8, padding: 10, border: "1px solid #e2e8f0", borderRadius: 18, background: "rgba(248,250,252,.94)" }}>
        {tabs.map((tab) => <button key={tab} type="button" onClick={() => setActive(tab)} style={{ ...(active === tab ? styles.primaryButton : styles.secondaryButton), borderRadius: 999, minHeight: 44 }}>{labels[tab]}</button>)}
      </div>

      {active === "learn" ? <>
        <Section title="AI video">
          {video?.url ? <div style={{ display: "grid", gap: 10 }}>
            <strong>{video.title || "Lesson video"}</strong>
            {video.description ? <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>{video.description}</p> : null}
            {videoEmbed ? <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", borderRadius: 16, overflow: "hidden", background: "#0f172a" }}><iframe title={video.title || "B2 lesson video"} src={videoEmbed} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} /></div> : null}
          </div> : <NoteBox tone="amber">No dedicated AI video has been added yet. Continue with the grammar notes below.</NoteBox>}
        </Section>
        <GrammarNotes day={day} checked={progress.learnDone} onCheckedChange={(checked) => setProgress((old) => ({ ...old, learnDone: checked }))} />
      </> : null}

      {active === "speak" ? <Section title="Speaking builder">
        <NoteBox tone="amber"><strong>Sprechfrage:</strong> {lesson.speakingBuilder?.question || lesson.speakingTopic || lesson.topic}</NoteBox>
        <EmbeddedSpeechPracticePanel />
        <label style={{ display: "flex", gap: 9, alignItems: "center", fontWeight: 800 }}><input type="checkbox" checked={progress.speakDone} onChange={(event) => setProgress((old) => ({ ...old, speakDone: event.target.checked }))} />I completed a speaking practice.</label>
      </Section> : null}

      {active === "write" ? <Section title="Guided writing builder">
        <WritingCheatSheetTabs level="B2" day={day}>
          <WritingTaskPrompt lesson={lesson} />
          {workbookUrl ? <a href={workbookUrl} style={{ ...styles.linkButton, width: "fit-content" }}>Open lesson workbook</a> : null}
          <GuidedWritingWorkspace config={getStandardWritingConfig(lesson)} storageKey={getStandardLessonStorageKey(lesson, "writing")} cloudField={getStandardWritingCloudField(lesson)} />
        </WritingCheatSheetTabs>
      </Section> : null}

      {active === "references" ? <WorkbookReferenceAnswers level="B2" lesson={lesson} workbookId={`B2-day-${day}`} /> : null}

      {active === "finish" ? <Section title={`Summary B2 Day ${day}`}>
        <FinishSummary day={day} />
        {progress.completed ? <NoteBox tone="green"><strong>Completed.</strong> This lesson is saved as complete on this device.</NoteBox> : null}
        <button type="button" style={{ ...styles.primaryButton, width: "fit-content" }} onClick={finish}>I have completed</button>
      </Section> : null}
    </div>
  );
}
