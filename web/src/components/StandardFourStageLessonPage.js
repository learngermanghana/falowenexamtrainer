import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppBackButton from "./navigation/AppBackButton";
import FalowenRadioTabContent from "./FalowenRadioTabContent";
import { EmbeddedSpeechPracticePanel, EmbeddedWritingPracticePanel } from "./selfLearning/EmbeddedPracticePanels";
import { useToast } from "../context/ToastContext";
import {
  getStandardBrainMap,
  getStandardLessonStorageKey,
  getStandardWritingCloudField,
  getStandardWritingConfig,
} from "../data/standardLessonJourney";
import { styles } from "../styles";
import GuidedWritingWorkspace from "./GuidedWritingWorkspace";
import c1Day2LearningSpeakingGuide from "../data/selfLearningLessons/c1/day2LearningSpeakingGuide";
import { SpeakingPoints } from "./B2Day1IdentityPilotLessonPage";
import { getAdvancedWritingPhase } from "../data/advancedWritingProgression";

const tabs = ["learn", "speak", "write", "finish"];
const labels = { learn: "1. Learn", speak: "2. Speak", write: "3. Write", finish: "4. Finish" };
const card = {
  ...styles.card,
  display: "grid",
  gap: 14,
  border: "1px solid #e2e8f0",
  borderRadius: 18,
  boxShadow: "0 10px 26px rgba(15,23,42,.06)",
};
const listStyle = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const fieldLabel = { display: "flex", gap: 9, alignItems: "center", fontWeight: 800 };

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

const ResourceButton = ({ href, children }) => {
  if (!href) return null;
  const external = !String(href).startsWith("/");
  return <a href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})} style={{ ...styles.linkButton, width: "fit-content" }}>{children}</a>;
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

const ProgressCard = ({ label, complete, detail }) => (
  <div style={{ border: `1px solid ${complete ? "#86efac" : "#cbd5e1"}`, borderRadius: 14, padding: 13, background: complete ? "#f0fdf4" : "#fff", display: "grid", gap: 5 }}>
    <strong>{complete ? "✅" : "⬜"} {label}</strong>
    <span style={{ color: "#64748b", fontSize: 13 }}>{detail}</span>
  </div>
);

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

const matches = (lesson, level, day) => String(lesson?.level || "").toUpperCase() === level && Number(lesson?.day) === day;
const isB2Day1 = (lesson) => matches(lesson, "B2", 1);
const isC1Day1 = (lesson) => matches(lesson, "C1", 1);
const isC1Day2 = (lesson) => matches(lesson, "C1", 2);
const isC1Day4 = (lesson) => matches(lesson, "C1", 4);
const isCompactC1 = (lesson) => isC1Day1(lesson) || isC1Day2(lesson) || isC1Day4(lesson);

const c1Questions = {
  1: "Wie kann man einen realistischen und zugleich flexiblen Lernweg planen, um ein anspruchsvolles Sprachziel zu erreichen?",
  2: "Wie stark prägt Kultur die persönliche Identität, und warum sollte Identität nicht starr definiert werden?",
  4: "Welche Bedingungen braucht ein Team, damit Zusammenarbeit auch bei Konflikten langfristig gelingt?",
};

const CompactSpeakingPoints = ({ question, branches = [] }) => (
  <div style={{ display: "grid", gap: 12 }}>
    <NoteBox tone="amber"><strong>Sprechfrage:</strong> {question}</NoteBox>
    <div style={{ border: "1px solid #c7d2fe", borderRadius: 14, padding: 14, background: "#eef2ff" }}>
      <h3 style={{ margin: "0 0 8px" }}>Punkte für deine Antwort</h3>
      <p style={{ margin: "0 0 8px", color: "#475569" }}>Wähle passende Punkte aus und gib Gründe und Beispiele.</p>
      <ul style={listStyle}>
        {branches.map((branch) => (
          <li key={branch.id || branch.title}>
            <strong>{branch.title}:</strong> {(branch.keywords || []).join(", ")}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const SpeakingBuilder = ({ lesson }) => {
  const rich = lesson.speakingBuilder?.branches;
  if (isB2Day1(lesson)) return <SpeakingPoints />;
  if (isCompactC1(lesson)) {
    const branches = isC1Day2(lesson) ? c1Day2LearningSpeakingGuide.speaking.branches : rich;
    return <CompactSpeakingPoints question={c1Questions[Number(lesson.day)]} branches={branches} />;
  }
  if (Array.isArray(rich) && rich.length) {
    return (
      <div style={{ display: "grid", gap: 12 }}>
        <div>
          <h3 style={{ margin: "0 0 6px" }}>Ideen für deine Antwort</h3>
          <p style={{ margin: 0, color: "#475569" }}>Wähle passende Themenbereiche aus, verknüpfe sie differenziert und entwickle daraus deine eigene Antwort.</p>
        </div>
        {rich.map((branch, index) => (
          <article key={branch.id || branch.title} style={{ border: "1px solid #c7d2fe", borderRadius: 16, padding: 14, background: "#eef2ff", display: "grid", gap: 8 }}>
            <strong>{index + 1}. {branch.title}</strong>
            <div style={{ color: "#475569", fontWeight: 700 }}>{branch.keywords.join(" • ")}</div>
            <div><strong>Leitfrage:</strong> {branch.prompt}</div>
            <div style={{ color: "#3730a3" }}>• {branch.example}</div>
            {branch.starter ? <div style={{ borderLeft: "4px solid #818cf8", paddingLeft: 10 }}><strong>Fortgeschrittener Satzanfang:</strong> {branch.starter}</div> : null}
          </article>
        ))}
      </div>
    );
  }

  const branches = getStandardBrainMap(lesson);
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={{ justifySelf: "center", width: "min(270px,92%)", minHeight: 120, borderRadius: 999, display: "grid", placeItems: "center", textAlign: "center", padding: 20, color: "#fff", background: "linear-gradient(135deg,#1d4ed8,#7c3aed)" }}>
        <div><small style={{ opacity: .82, fontWeight: 800 }}>SPRECHEN-BRAIN-MAP</small><h3 style={{ margin: "5px 0 0" }}>{lesson.title}</h3></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 12 }}>
        {branches.map((branch, index) => (
          <article key={`${branch.title}-${index}`} style={{ border: "1px solid #c7d2fe", borderRadius: 16, padding: 14, background: index % 2 ? "#f8fafc" : "#eef2ff", display: "grid", gap: 8 }}>
            <span style={{ width: 32, height: 32, borderRadius: 999, display: "grid", placeItems: "center", background: "#1d4ed8", color: "#fff", fontWeight: 900 }}>{index + 1}</span>
            <strong>{branch.title}</strong>
            <p style={{ margin: 0, color: "#475569", lineHeight: 1.55 }}>{branch.prompt}</p>
            <div style={{ borderLeft: "4px solid #818cf8", paddingLeft: 10, color: "#3730a3" }}>{branch.starter}</div>
          </article>
        ))}
      </div>
      <NoteBox tone="amber"><strong>Speaking order:</strong> Follow the branches from 1 to {branches.length}. Give reasons and at least one concrete example.</NoteBox>
    </div>
  );
};

export const shouldShowStandardRadioGate = (falowenRadio) => Boolean(falowenRadio);

export default function StandardFourStageLessonPage({ lesson, canonicalLesson = null }) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const radio = canonicalLesson?.resources?.falowenRadio || null;
  const [entered, setEntered] = useState(() => !shouldShowStandardRadioGate(radio));
  const [active, setActive] = useState("learn");
  const [writing, setWriting] = useState({ complete: false, completedQuestions: 0, totalQuestions: 5, wordCount: 0 });
  const storageKey = getStandardLessonStorageKey(lesson, "progress");
  const [progress, setProgress] = useState(() => {
    try {
      return { learnDone: false, speakDone: false, reflection: "", completed: false, ...JSON.parse(localStorage.getItem(storageKey) || "{}") };
    } catch {
      return { learnDone: false, speakDone: false, reflection: "", completed: false };
    }
  });

  useEffect(() => localStorage.setItem(storageKey, JSON.stringify(progress)), [progress, storageKey]);

  if (!entered && radio) {
    return (
      <div style={{ ...styles.container, display: "grid", gap: 18 }}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <header style={{ ...card, borderColor: "#bfdbfe", background: "linear-gradient(135deg,#eff6ff,#f8fafc)" }}>
          <span style={{ ...styles.badge, width: "fit-content", background: "#dbeafe", color: "#1e3a8a" }}>Start here</span>
          <h1 style={{ margin: 0 }}>{lesson.level} · Day {lesson.day} · {lesson.title}</h1>
          <p style={{ margin: 0, color: "#475569" }}>Listen to Falowen Radio first. Continue opens Learn, Speak, Write and Finish.</p>
        </header>
        <FalowenRadioTabContent level={lesson.level} day={lesson.day} resource={radio} onContinue={() => { setEntered(true); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
      </div>
    );
  }

  const video = lesson.videoResource || canonicalLesson?.resources?.aiVideo || canonicalLesson?.resources?.teacherVideo || null;
  const videoEmbed = embedUrl(video?.url);
  const grammarRules = (lesson.grammarLesson?.rules || []).slice(0, 6);
  const grammarExamples = (lesson.grammarLesson?.examples || []).slice(0, 5);
  const grammarUrl = canonicalLesson?.resources?.grammarBook?.url || lesson.resources?.grammarBook?.url || "";
  const workbookUrl = canonicalLesson?.resources?.workbook?.url || lesson.resources?.workbook?.url || "";
  const finishReady = progress.learnDone && progress.speakDone && writing.complete;
  const assignmentId = canonicalLesson?.submission?.assignmentId;
  const canSubmit = Boolean(canonicalLesson?.submission?.enabled && assignmentId);
  const fullEssay = getAdvancedWritingPhase(lesson.level, lesson.day) === "full-essay";

  const finish = () => {
    if (!finishReady) return;
    setProgress((old) => ({ ...old, completed: true, completedAt: new Date().toISOString() }));
    showToast(`${lesson.level} Day ${lesson.day} completed. Your progress was saved.`, "success");
  };

  const submit = () => {
    if (!assignmentId) return;
    navigate(`/campus/course?submitWork=1&assignmentKey=${encodeURIComponent(assignmentId)}&assignmentId=${encodeURIComponent(assignmentId)}`, {
      state: { assignmentKey: assignmentId, assignmentId, canonicalAssignmentId: assignmentId, day: lesson.day, level: lesson.level, assignmentTitle: lesson.title },
    });
  };

  return (
    <div style={{ ...styles.container, display: "grid", gap: 18 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
      <header style={{ borderRadius: 22, overflow: "hidden", color: "#fff", backgroundImage: `linear-gradient(135deg,rgba(2,6,23,.94),rgba(30,64,175,.72)),url(${lesson.heroImage || ""})`, backgroundSize: "cover", backgroundPosition: "center", padding: "clamp(22px,4vw,42px)", display: "grid", gap: 16, minHeight: 280, alignContent: "space-between" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={{ ...styles.badge, background: "rgba(255,255,255,.16)", color: "#fff" }}>{lesson.level}</span>
          <span style={{ ...styles.badge, background: "rgba(255,255,255,.16)", color: "#fff" }}>Day {lesson.day}</span>
          {lesson.chapter ? <span style={{ ...styles.badge, background: "rgba(37,99,235,.9)", color: "#fff" }}>Chapter {lesson.chapter}</span> : null}
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
            {video.description ? <p style={{ margin: 0, color: "#475569" }}>{video.description}</p> : null}
            {videoEmbed ? <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", borderRadius: 16, overflow: "hidden", background: "#0f172a" }}><iframe title={video.title || "Lesson video"} src={videoEmbed} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} /></div> : null}
          </div> : <NoteBox tone="amber">No dedicated AI video has been added yet. Continue with the grammar notes and lesson resources.</NoteBox>}
        </Section>
        <Section title={`Grammar: ${lesson.grammarLesson?.title || lesson.grammarFocus || lesson.title}`}>
          <NoteBox tone="amber"><strong>Focus:</strong> {lesson.grammarFocus || lesson.grammarLesson?.title || lesson.title}</NoteBox>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 12 }}>
            <div><h3>Core rules</h3><ul style={listStyle}>{grammarRules.map((item) => <li key={item}>{item}</li>)}</ul></div>
            <div><h3>Model sentences</h3><ul style={listStyle}>{grammarExamples.map((item) => <li key={item}>{item}</li>)}</ul></div>
          </div>
          {lesson.grammarLesson?.miniExercise ? <NoteBox><strong>Mini practice:</strong> {lesson.grammarLesson.miniExercise}</NoteBox> : null}
          <ResourceButton href={grammarUrl}>Open full grammar notes</ResourceButton>
          <label style={fieldLabel}><input type="checkbox" checked={progress.learnDone} onChange={(e) => setProgress((old) => ({ ...old, learnDone: e.target.checked }))} />I reviewed the video and grammar.</label>
        </Section>
      </> : null}

      {active === "speak" ? <Section title="Speaking builder">
        <SpeakingBuilder lesson={lesson} />
        <EmbeddedSpeechPracticePanel />
        <label style={fieldLabel}><input type="checkbox" checked={progress.speakDone} onChange={(e) => setProgress((old) => ({ ...old, speakDone: e.target.checked }))} />{isCompactC1(lesson) ? "I completed a speaking practice." : "I used the brain map and completed a speaking practice."}</label>
      </Section> : null}

      {active === "write" ? <Section title="Guided writing builder">
        <NoteBox><strong>Task:</strong> {lesson.writingTopic || `Schreibe einen Text zum Thema „${lesson.title}“.`}</NoteBox>
        <ResourceButton href={workbookUrl}>Open lesson workbook</ResourceButton>
        {fullEssay ? <EmbeddedWritingPracticePanel /> : <GuidedWritingWorkspace config={getStandardWritingConfig(lesson)} storageKey={getStandardLessonStorageKey(lesson, "writing")} cloudField={getStandardWritingCloudField(lesson)} onStatusChange={setWriting} />}
      </Section> : null}

      {active === "finish" ? <Section title={`Finish ${lesson.level} Day ${lesson.day}`}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 10 }}>
          <ProgressCard label="Learn" complete={progress.learnDone} detail="Video and grammar reviewed" />
          <ProgressCard label="Speak" complete={progress.speakDone} detail={isCompactC1(lesson) ? "Speaking practice completed" : "Brain-map speaking practice completed"} />
          <ProgressCard label="Write" complete={writing.complete} detail={`${writing.completedQuestions}/${writing.totalQuestions} questions · ${writing.wordCount} final words`} />
        </div>
        <GermanyLifeMiniLesson lesson={lesson} />
        <label style={{ display: "grid", gap: 7 }}><strong>Your learning note</strong><span style={{ color: "#64748b", fontSize: 13 }}>Write one useful connection between this topic and life in Germany, plus one thing you want to improve next.</span><textarea value={progress.reflection} onChange={(e) => setProgress((old) => ({ ...old, reflection: e.target.value }))} style={{ minHeight: 120, border: "1px solid #cbd5e1", borderRadius: 12, padding: 12, font: "inherit", resize: "vertical" }} /></label>
        {!finishReady ? <NoteBox tone="amber">Complete Learn, Speak and the guided writing task before finishing this lesson.</NoteBox> : null}
        {progress.completed ? <NoteBox tone="green"><strong>Completed.</strong> This lesson is saved as complete on this device.</NoteBox> : null}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="button" style={{ ...styles.primaryButton, opacity: finishReady ? 1 : .5 }} disabled={!finishReady} onClick={finish}>{progress.completed ? "Mark complete again" : "Mark lesson complete"}</button>
          {canSubmit ? <button type="button" style={{ ...styles.primaryButton, opacity: finishReady ? 1 : .5 }} disabled={!finishReady} onClick={submit}>Submit assignment</button> : null}
        </div>
      </Section> : null}
    </div>
  );
}
