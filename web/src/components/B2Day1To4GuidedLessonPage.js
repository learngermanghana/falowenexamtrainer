import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AppBackButton from "./navigation/AppBackButton";
import B2Day1IdentityGrammarNotes from "./B2Day1IdentityGrammarNotes";
import B2Day2To4GrammarNotes from "./B2Day2To4GrammarNotes";
import B2Day5HealthGrammarNotes from "./B2Day5HealthGrammarNotes";
import B2Day6MigrationIntegrationGrammarNotes from "./B2Day6MigrationIntegrationGrammarNotes";
import B2Day14To16GrammarNotes from "./B2Day14To16GrammarNotes";
import FalowenRadioTabContent from "./FalowenRadioTabContent";
import { EmbeddedSpeechPracticePanel } from "./selfLearning/EmbeddedPracticePanels";
import GuidedWritingWorkspace from "./GuidedWritingWorkspace";
import WritingCheatSheetTabs from "./WritingCheatSheetTabs";
import WritingTaskPrompt from "./WritingTaskPrompt";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import { SpeakingPoints } from "./B2Day1IdentityPilotLessonPage";
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
const card = {
  ...styles.card,
  display: "grid",
  gap: 14,
  border: "1px solid #e2e8f0",
  borderRadius: 18,
  boxShadow: "0 10px 26px rgba(15,23,42,.06)",
};
const fieldLabel = { display: "flex", gap: 9, alignItems: "center", fontWeight: 800 };
const listStyle = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };

const Section = ({ title, children }) => (
  <section style={card}>
    <h2 style={{ margin: 0, fontSize: "1.2rem" }}>{title}</h2>
    {children}
  </section>
);

const NoteBox = ({ children, tone = "blue" }) => {
  const tones = {
    blue: ["#bfdbfe", "#eff6ff", "#1e3a8a"],
    green: ["#bbf7d0", "#f0fdf4", "#14532d"],
    amber: ["#fde68a", "#fffbeb", "#92400e"],
  };
  const [border, background, color] = tones[tone] || tones.blue;
  return <div style={{ border: `1px solid ${border}`, borderRadius: 14, padding: 12, background, color, lineHeight: 1.65 }}>{children}</div>;
};

const getGermanyLifeMiniLesson = (lesson) => {
  const topic = lesson?.title || lesson?.topic || "dieses Thema";
  const level = String(lesson?.level || "B2").toUpperCase();
  const lower = `${topic} ${lesson?.topic || ""}`.toLowerCase();
  const b2 = level === "B2";
  if (/ausbildung|beruf|karriere|arbeit|weiterbildung|bildung|lernen/.test(lower)) {
    return {
      title: `${topic}: Leben und Arbeiten in Deutschland`,
      intro: b2
        ? "In Deutschland ist der Weg in den Beruf oft klar organisiert. Viele Menschen lernen einen Beruf in einer Ausbildung: Sie arbeiten in einem Betrieb und besuchen gleichzeitig die Berufsschule."
        : "Das deutsche Bildungs- und Berufssystem ist stark durch institutionalisierte Übergänge geprägt: Ausbildung, Studium, duales Studium und berufliche Weiterbildung bilden verschiedene Wege in qualifizierte Beschäftigung.",
      points: b2
        ? ["Die duale Ausbildung verbindet Praxis im Betrieb mit Theorie in der Berufsschule.", "Typische Bereiche sind Pflege, Handwerk, Büro, IT, Gastronomie und Technik.", "Weiterbildung hilft, wenn man den Beruf wechseln oder mehr Verantwortung übernehmen möchte."]
        : ["Die duale Ausbildung gilt als ein zentraler Pfeiler der Fachkräftesicherung.", "Lebenslanges Lernen ist wegen Digitalisierung, Migration und demografischem Wandel politisch und wirtschaftlich relevant.", "Berufliche Qualifikation beeinflusst gesellschaftliche Teilhabe, Einkommen und Aufstiegschancen."],
      vocabulary: b2 ? ["die Ausbildung", "der Betrieb", "die Berufsschule", "die Weiterbildung", "die Fachkraft"] : ["die Durchlässigkeit", "die Fachkräftesicherung", "der Bildungsweg", "die Umschulung", "die Chancengerechtigkeit"],
    };
  }
  if (/migration|integration|gesellschaft|vielfalt|identität|identitaet|kultur|mehrsprach/.test(lower)) {
    return {
      title: `${topic}: Zusammenleben in Deutschland`,
      intro: b2
        ? "Deutschland ist ein Einwanderungsland. Menschen mit verschiedenen Sprachen, Religionen und Lebensgeschichten leben zusammen. Darum sind Respekt, klare Regeln und Kommunikation im Alltag wichtig."
        : "In Deutschland werden Fragen von Identität, Integration und Mehrsprachigkeit oft als gesamtgesellschaftliche Aufgaben verstanden, weil sie Schule, Arbeitsmarkt, Verwaltung und Nachbarschaft direkt betreffen.",
      points: b2
        ? ["Deutschkenntnisse helfen bei Arbeit, Schule, Behörden und Freundschaften.", "Integration bedeutet nicht, die eigene Kultur zu verlieren, sondern aktiv am Alltag teilzunehmen.", "Vereine, Nachbarschaft und Ehrenamt können Kontakte leichter machen." ]
        : ["Integration umfasst Sprache, rechtliche Teilhabe, Bildungschancen und soziale Anerkennung.", "Mehrsprachigkeit kann eine Ressource sein, wenn Institutionen sie nicht nur als Problem betrachten.", "Öffentliche Debatten zeigen, dass Zugehörigkeit verhandelbar und vielschichtig ist."],
      vocabulary: b2 ? ["die Integration", "die Vielfalt", "die Herkunft", "die Zugehörigkeit", "der Verein"] : ["die Teilhabe", "die Anerkennung", "die Zugehörigkeit", "die Mehrheitsgesellschaft", "die Ausgrenzung"],
    };
  }
  if (/gesund|wohlbefinden|stress|freizeit|sport|ernährung|ernaehrung/.test(lower)) {
    return {
      title: `${topic}: Alltag und Gesundheit in Deutschland`,
      intro: b2
        ? "Im deutschen Alltag spielen Gesundheit, Freizeit und eine gute Work-Life-Balance eine wichtige Rolle. Viele Menschen planen feste Zeiten für Arbeit, Familie, Sport und Erholung."
        : "Gesundheit und Wohlbefinden werden in Deutschland zunehmend als Zusammenspiel von individueller Verantwortung, Arbeitsbedingungen, Prävention und sozialer Infrastruktur diskutiert.",
      points: b2
        ? ["Hausärzte, Apotheken und Krankenkassen sind wichtige Ansprechpartner.", "Viele Menschen nutzen Vereine, Parks und Kurse, um aktiv zu bleiben.", "Stress wird ernst genommen, besonders wenn Arbeit und Privatleben nicht im Gleichgewicht sind." ]
        : ["Prävention gewinnt an Bedeutung, weil chronischer Stress hohe persönliche und gesellschaftliche Kosten verursacht.", "Betriebliche Gesundheitsförderung soll Arbeitsfähigkeit und Lebensqualität langfristig sichern.", "Freizeitangebote und Vereinskultur stärken soziale Kontakte und mentale Gesundheit."],
      vocabulary: b2 ? ["die Krankenkasse", "die Apotheke", "die Erholung", "der Verein", "die Belastung"] : ["die Prävention", "die Belastbarkeit", "die Gesundheitsförderung", "die Vereinbarkeit", "die Lebensqualität"],
    };
  }
  return {
    title: `${topic}: Verbindung zum Leben in Deutschland`,
    intro: b2
      ? "Dieses Thema hilft dir, den Alltag in Deutschland besser zu verstehen. Es zeigt, wie Menschen Entscheidungen treffen, miteinander sprechen und ihr Leben organisieren."
      : "Dieses Thema eröffnet einen differenzierten Blick auf Deutschland, weil private Entscheidungen, gesellschaftliche Strukturen und öffentliche Debatten eng miteinander verbunden sind.",
    points: b2
      ? ["Achte darauf, welche Regeln und Erwartungen im Alltag wichtig sind.", "Vergleiche die Situation in Deutschland mit deinem Land und nenne konkrete Beispiele.", "Nutze passende Wörter, damit deine Meinung klar und natürlich klingt." ]
      : ["Analysiere, welche Institutionen, Werte und Konflikte hinter dem Thema stehen.", "Verbinde persönliche Beispiele mit gesellschaftlichen Entwicklungen.", "Formuliere abgewogen: nicht nur Vorteile und Nachteile, sondern auch Bedingungen und Folgen."],
    vocabulary: b2 ? ["der Alltag", "die Regel", "die Erfahrung", "der Vergleich", "die Meinung"] : ["die Rahmenbedingung", "die Wechselwirkung", "der gesellschaftliche Wandel", "die Perspektive", "die Ambivalenz"],
  };
};

const GermanyLifeMiniLesson = ({ lesson }) => {
  const mini = getGermanyLifeMiniLesson(lesson);
  return (
    <div style={{ border: "1px solid #bfdbfe", borderRadius: 16, padding: 14, background: "#eff6ff", display: "grid", gap: 10 }}>
      <h3 style={{ margin: 0 }}>{mini.title}</h3>
      <p style={{ margin: 0, lineHeight: 1.7 }}>{mini.intro}</p>
      <ul style={listStyle}>{mini.points.map((item) => <li key={item}>{item}</li>)}</ul>
      <div><strong>Wortschatz:</strong> {mini.vocabulary.join(" · ")}</div>
    </div>
  );
};

const ResourceButton = ({ href, children }) => {
  if (!href) return null;
  const external = !String(href).startsWith("/");
  return <a href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})} style={{ ...styles.linkButton, width: "fit-content" }}>{children}</a>;
};

const embedUrl = (url = "") => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    const id = host === "youtu.be"
      ? parsed.pathname.replace(/^\//, "")
      : parsed.searchParams.get("v") || parsed.pathname.split("/").filter(Boolean).pop();
    return id ? `https://www.youtube.com/embed/${id}` : "";
  } catch {
    return "";
  }
};

const day5SpeakingTopics = [
  { id: "ursachen", title: "Stressursachen", keywords: ["Zeitdruck", "zu viele Aufgaben", "ständige Erreichbarkeit", "finanzielle Sorgen", "Konflikte", "fehlende Pausen"] },
  { id: "koerper", title: "Körperliche Folgen", keywords: ["Schlafprobleme", "Kopfschmerzen", "Erschöpfung", "Verspannung", "weniger Energie", "Immunsystem"] },
  { id: "psychisch", title: "Psychische Folgen", keywords: ["Unruhe", "Überforderung", "schlechte Stimmung", "weniger Motivation", "Konzentration", "Reizbarkeit"] },
  { id: "routinen", title: "Gesunde Routinen", keywords: ["Bewegung", "ausreichend Schlaf", "feste Pausen", "Ernährung", "handyfreie Zeit", "soziale Kontakte"] },
  { id: "empfehlungen", title: "Realistische Empfehlungen", keywords: ["kleine Schritte", "Grenzen setzen", "Prioritäten", "Unterstützung", "Zeitplan", "Regelmäßigkeit"] },
  { id: "ziel", title: "Persönliches Ziel", keywords: ["Gewohnheit verbessern", "konkreter Plan", "Hindernis", "Vorteil", "Motivation", "nächster Schritt"] },
];

const CompactSpeakingPoints = ({ lesson }) => {
  const builder = lesson.speakingBuilder || {};
  const branches = Number(lesson.day) === 5 ? day5SpeakingTopics : (builder.branches || []);
  const plan = builder.plan || [];
  const starters = builder.starters || [];
  const question = builder.question || String(lesson.speakingTopic || "").replace(/^Sprechen:\s*/i, "");

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <NoteBox tone="amber"><strong>Sprechfrage:</strong> {question}</NoteBox>
      {branches.length ? (
        <div style={{ border: "1px solid #c7d2fe", borderRadius: 14, padding: 14, background: "#eef2ff" }}>
          <h3 style={{ margin: "0 0 8px" }}>Punkte für deine Antwort</h3>
          <p style={{ margin: "0 0 8px", color: "#475569" }}>Wähle passende Punkte aus und gib Gründe sowie Beispiele.</p>
          <ul style={listStyle}>{branches.map((branch) => <li key={branch.id || branch.title}><strong>{branch.title}:</strong> {(branch.keywords || []).join(", ")}</li>)}</ul>
        </div>
      ) : null}
      {plan.length ? (
        <div style={{ border: "1px solid #c7d2fe", borderRadius: 14, padding: 14, background: "#f8fafc" }}>
          <h3 style={{ margin: "0 0 8px" }}>Aufbau deiner Antwort</h3>
          <ol style={listStyle}>{plan.map((item) => <li key={item}>{item}</li>)}</ol>
        </div>
      ) : null}
      {starters.length ? <NoteBox><strong>Nützliche Satzanfänge:</strong><ul style={{ ...listStyle, marginTop: 8 }}>{starters.map((item) => <li key={item}>{item}</li>)}</ul></NoteBox> : null}
      {Number(lesson.day) === 5 ? <NoteBox tone="green"><strong>B2-Ziel:</strong> Nutze mindestens vier Verbindungen aus <em>weil, da, deshalb, daher</em> und <em>aus diesem Grund</em>. Nenne mindestens ein konkretes Beispiel.</NoteBox> : null}
      {Number(lesson.day) === 6 ? <NoteBox tone="green"><strong>B2-Ziel:</strong> Nutze mindestens zwei Verbindungen aus <em>obwohl, auch wenn</em> und <em>trotzdem</em>. Nenne eine konkrete Lösung mit Vorteil.</NoteBox> : null}
    </div>
  );
};

const SpeakingBuilder = ({ lesson }) => Number(lesson.day) === 1
  ? <SpeakingPoints />
  : <CompactSpeakingPoints lesson={lesson} />;

const GrammarNotes = ({ lesson, checked, onCheckedChange }) => {
  const day = Number(lesson.day);
  if (day === 1) return <B2Day1IdentityGrammarNotes checked={checked} onCheckedChange={onCheckedChange} />;
  if (day === 5) return <B2Day5HealthGrammarNotes checked={checked} onCheckedChange={onCheckedChange} />;
  if (day === 6) return <B2Day6MigrationIntegrationGrammarNotes checked={checked} onCheckedChange={onCheckedChange} />;
  if (day >= 14 && day <= 16) return <B2Day14To16GrammarNotes day={day} checked={checked} onCheckedChange={onCheckedChange} />;
  return <B2Day2To4GrammarNotes day={day} checked={checked} onCheckedChange={onCheckedChange} />;
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
      return { learnDone: false, speakDone: false, confidence: "", reflection: "", completed: false, ...JSON.parse(localStorage.getItem(storageKey) || "{}") };
    } catch {
      return { learnDone: false, speakDone: false, confidence: "", reflection: "", completed: false };
    }
  });

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
    const studentCode = studentProfile?.studentCode || studentProfile?.studentcode || studentProfile?.id || user?.uid || "student";
    const assignmentKey = location.state?.assignmentKey;
    if (assignmentKey && typeof window !== "undefined") {
      const practiceStorageKey = `coursePracticeProgress:${studentCode}:B2`;
      const saved = JSON.parse(window.localStorage.getItem(practiceStorageKey) || "{}");
      window.localStorage.setItem(practiceStorageKey, JSON.stringify({ ...saved, [assignmentKey]: { ...(saved[assignmentKey] || {}), completed: true, completedAt, updatedAt: completedAt } }));
    }
    showToast(`B2 Day ${day} completed. Your progress was saved.`, "success");
  };

  return (
    <div style={{ ...styles.container, display: "grid", gap: 18 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
      <header style={{ borderRadius: 22, overflow: "hidden", color: "#fff", backgroundImage: `linear-gradient(135deg,rgba(2,6,23,.94),rgba(30,64,175,.72)),url(${lesson.heroImage || ""})`, backgroundSize: "cover", backgroundPosition: "center", padding: "clamp(22px,4vw,42px)", display: "grid", gap: 16, minHeight: 280, alignContent: "space-between" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={{ ...styles.badge, background: "rgba(255,255,255,.16)", color: "#fff" }}>B2</span>
          <span style={{ ...styles.badge, background: "rgba(255,255,255,.16)", color: "#fff" }}>Day {day}</span>
          <span style={{ ...styles.badge, background: "rgba(37,99,235,.9)", color: "#fff" }}>Chapter {lesson.chapter}</span>
        </div>
        <div><h1 style={{ margin: 0, fontSize: "clamp(2rem,5vw,3.6rem)" }}>{lesson.title}</h1><p style={{ margin: "10px 0 0", color: "#e2e8f0" }}>{lesson.topic}</p></div>
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
          </div> : <NoteBox tone="amber">No dedicated AI video has been added yet. Continue with the guided grammar notes.</NoteBox>}
        </Section>
        <GrammarNotes lesson={lesson} checked={progress.learnDone} onCheckedChange={(checked) => setProgress((old) => ({ ...old, learnDone: checked }))} />
      </> : null}

      {active === "speak" ? <Section title="Speaking builder">
        <SpeakingBuilder lesson={lesson} />
        <EmbeddedSpeechPracticePanel />
        <label style={fieldLabel}><input type="checkbox" checked={progress.speakDone} onChange={(event) => setProgress((old) => ({ ...old, speakDone: event.target.checked }))} />I completed a speaking practice.</label>
      </Section> : null}

      {active === "write" ? <Section title="Guided writing builder">
        <WritingCheatSheetTabs level="B2" day={day}>
          <WritingTaskPrompt lesson={lesson} />
          <ResourceButton href={workbookUrl}>Open lesson workbook</ResourceButton>
          <GuidedWritingWorkspace config={getStandardWritingConfig(lesson)} storageKey={getStandardLessonStorageKey(lesson, "writing")} cloudField={getStandardWritingCloudField(lesson)} onStatusChange={setWriting} />
        </WritingCheatSheetTabs>
      </Section> : null}

      {active === "references" ? <WorkbookReferenceAnswers level="B2" lesson={lesson} workbookId={`B2-day-${day}`} /> : null}

      {active === "finish" ? <Section title={`Summary B2 Day ${day}`}>
        <GermanyLifeMiniLesson lesson={lesson} />
        {progress.completed ? <NoteBox tone="green"><strong>Completed.</strong> This lesson is saved as complete on this device.</NoteBox> : null}
        <button type="button" style={{ ...styles.primaryButton, width: "fit-content" }} onClick={finish}>I have completed</button>
      </Section> : null}
    </div>
  );
}
