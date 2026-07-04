import React, { useEffect, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import B2Day21To24GrammarNotes from "./B2Day21To24GrammarNotes";
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
  21: {
    title: "Migration und neue Lebenswege: Ankommen und Chancen nutzen",
    intro: "Migration bedeutet oft, das eigene Leben neu zu organisieren. In Deutschland geht es dabei um Sprache, Arbeit, Wohnung, Behörden, soziale Kontakte und die Frage, wie man Schritt für Schritt ankommt.",
    points: ["Ein neuer Lebensweg braucht Vorbereitung, Geduld und klare Informationen.", "Sprachkurse, Beratung und Kontakte helfen, Unsicherheit zu reduzieren.", "Eine gute B2-Antwort erklärt Herausforderungen und Chancen ausgewogen."],
    vocabulary: ["der Umzug", "ankommen", "die Beratung", "die Chance", "sich orientieren"],
  },
  22: {
    title: "Demokratie und Mitbestimmung: Verantwortung im Alltag",
    intro: "Demokratie zeigt sich in Deutschland nicht nur bei Wahlen. Menschen können sich auch in Schulen, Vereinen, Gemeinden, Initiativen und Diskussionen beteiligen.",
    points: ["Mitbestimmung bedeutet, Rechte zu kennen und Verantwortung zu übernehmen.", "Beteiligung stärkt Vertrauen, wenn Menschen das Gefühl haben, gehört zu werden.", "Eine starke B2-Antwort nennt konkrete Formen der Beteiligung und bewertet ihren Nutzen."],
    vocabulary: ["die Mitbestimmung", "die Wahl", "sich beteiligen", "die Verantwortung", "die Meinung vertreten"],
  },
  23: {
    title: "Work-Life-Balance: Arbeit und Erholung vereinbaren",
    intro: "Work-Life-Balance ist in Deutschland ein wichtiges Thema, weil Arbeit, Familie, Gesundheit und Freizeit miteinander vereinbart werden müssen. Es geht um Grenzen, Pausen, flexible Arbeitszeiten und mentale Gesundheit.",
    points: ["Erholung ist wichtig, damit Menschen langfristig gesund und produktiv bleiben.", "Flexible Arbeitszeiten können helfen, aber nicht jeder Beruf erlaubt dieselbe Freiheit.", "Eine gute B2-Antwort nennt Ursachen von Stress und realistische Lösungen."],
    vocabulary: ["die Erholung", "die Grenze", "flexible Arbeitszeiten", "Stress abbauen", "die Vereinbarkeit"],
  },
  24: {
    title: "Wissenschaft und Forschung im Alltag: Fortschritt verstehen",
    intro: "Forschung beeinflusst in Deutschland viele Lebensbereiche: Medizin, Technik, Umwelt, Verkehr und digitale Dienste. Wissenschaftliche Ergebnisse helfen, Probleme besser zu verstehen und Lösungen zu entwickeln.",
    points: ["Forschung bringt Fortschritt, braucht aber Vertrauen, Transparenz und klare Regeln.", "Medizinische und technische Entwicklungen können den Alltag verbessern.", "Eine gute B2-Antwort erklärt Nutzen und mögliche Risiken sachlich."],
    vocabulary: ["die Forschung", "die Studie", "die Entwicklung", "Daten auswerten", "der Fortschritt"],
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

export default function B2Day21To24GuidedLessonPage({ lesson, canonicalLesson = null }) {
  const { showToast } = useToast();
  const day = Number(lesson.day);
  const radio = canonicalLesson?.resources?.falowenRadio || null;
  const [entered, setEntered] = useState(() => !radio);
  const [active, setActive] = useState("learn");
  const storageKey = getStandardLessonStorageKey(lesson, "progress");
  const [progress, setProgress] = useState(() => {
    try {
      return { learnDone: false, speakDone: false, completed: false, ...JSON.parse(localStorage.getItem(storageKey) || "{}") };
    } catch {
      return { learnDone: false, speakDone: false, completed: false };
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
        <B2Day21To24GrammarNotes day={day} checked={progress.learnDone} onCheckedChange={(checked) => setProgress((old) => ({ ...old, learnDone: checked }))} />
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
