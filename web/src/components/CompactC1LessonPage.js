import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppBackButton from "./navigation/AppBackButton";
import FalowenRadioTabContent from "./FalowenRadioTabContent";
import { EmbeddedSpeechPracticePanel, EmbeddedWritingPracticePanel } from "./selfLearning/EmbeddedPracticePanels";
import GuidedWritingWorkspace from "./GuidedWritingWorkspace";
import { useToast } from "../context/ToastContext";
import {
  getStandardLessonStorageKey,
  getStandardWritingCloudField,
  getStandardWritingConfig,
} from "../data/standardLessonJourney";
import { getAdvancedWritingPhase } from "../data/advancedWritingProgression";
import { styles } from "../styles";

const card = {
  ...styles.card,
  display: "grid",
  gap: 14,
  border: "1px solid #e2e8f0",
  borderRadius: 18,
  boxShadow: "0 10px 26px rgba(15,23,42,.06)",
};
const listStyle = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const tabs = ["learn", "speak", "write", "finish"];
const labels = { learn: "1. Learn", speak: "2. Speak", write: "3. Write", finish: "4. Finish" };

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

export default function CompactC1LessonPage({ lesson, canonicalLesson = null }) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const radio = canonicalLesson?.resources?.falowenRadio || null;
  const [entered, setEntered] = useState(() => !radio);
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
        <FalowenRadioTabContent level={lesson.level} day={lesson.day} resource={radio} onContinue={() => setEntered(true)} />
      </div>
    );
  }

  const video = lesson.videoResource || canonicalLesson?.resources?.aiVideo || canonicalLesson?.resources?.teacherVideo || null;
  const videoEmbed = embedUrl(video?.url);
  const grammarRules = (lesson.grammarLesson?.rules || []).slice(0, 6);
  const grammarExamples = (lesson.grammarLesson?.examples || []).slice(0, 5);
  const branches = lesson.speakingBuilder?.branches || [];
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
    navigate(`/campus/submit?assignmentKey=${encodeURIComponent(assignmentId)}&assignmentId=${encodeURIComponent(assignmentId)}`, {
      state: { assignmentKey: assignmentId, assignmentId, day: lesson.day, level: lesson.level, assignmentTitle: lesson.title },
    });
  };

  return (
    <div style={{ ...styles.container, display: "grid", gap: 18 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
      <header style={{ borderRadius: 22, color: "#fff", backgroundImage: `linear-gradient(135deg,rgba(2,6,23,.94),rgba(30,64,175,.72)),url(${lesson.heroImage || ""})`, backgroundSize: "cover", backgroundPosition: "center", padding: "clamp(22px,4vw,42px)", display: "grid", gap: 16, minHeight: 280, alignContent: "space-between" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={{ ...styles.badge, background: "rgba(255,255,255,.16)", color: "#fff" }}>{lesson.level}</span>
          <span style={{ ...styles.badge, background: "rgba(255,255,255,.16)", color: "#fff" }}>Day {lesson.day}</span>
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
            {videoEmbed ? <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", borderRadius: 16, overflow: "hidden", background: "#0f172a" }}><iframe title={video.title || "Lesson video"} src={videoEmbed} allowFullScreen style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} /></div> : null}
          </div> : <NoteBox tone="amber">No dedicated AI video has been added yet. Continue with the grammar notes.</NoteBox>}
        </Section>
        <Section title={`Grammar: ${lesson.grammarLesson?.title || lesson.grammarFocus}`}>
          <NoteBox tone="amber"><strong>Focus:</strong> {lesson.grammarFocus}</NoteBox>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 12 }}>
            <div><h3>Core rules</h3><ul style={listStyle}>{grammarRules.map((item) => <li key={item}>{item}</li>)}</ul></div>
            <div><h3>Model sentences</h3><ul style={listStyle}>{grammarExamples.map((item) => <li key={item}>{item}</li>)}</ul></div>
          </div>
          {lesson.grammarLesson?.miniExercise ? <NoteBox><strong>Mini practice:</strong> {lesson.grammarLesson.miniExercise}</NoteBox> : null}
          <label style={{ fontWeight: 800 }}><input type="checkbox" checked={progress.learnDone} onChange={(event) => setProgress((old) => ({ ...old, learnDone: event.target.checked }))} /> I reviewed the grammar.</label>
        </Section>
      </> : null}

      {active === "speak" ? <Section title="Speaking builder">
        <NoteBox tone="amber"><strong>Sprechfrage:</strong> {String(lesson.speakingTopic || "").replace(/^Sprechen:\s*/, "")}</NoteBox>
        <div style={{ border: "1px solid #c7d2fe", borderRadius: 14, padding: 14, background: "#eef2ff" }}>
          <h3 style={{ margin: "0 0 8px" }}>Punkte für deine Antwort</h3>
          <p style={{ margin: "0 0 8px", color: "#475569" }}>Wähle passende Punkte aus und gib Gründe und Beispiele.</p>
          <ul style={listStyle}>{branches.map((branch) => <li key={branch.id || branch.title}><strong>{branch.title}:</strong> {(branch.keywords || []).join(", ")}</li>)}</ul>
        </div>
        <EmbeddedSpeechPracticePanel />
        <label style={{ fontWeight: 800 }}><input type="checkbox" checked={progress.speakDone} onChange={(event) => setProgress((old) => ({ ...old, speakDone: event.target.checked }))} /> I completed a speaking practice.</label>
      </Section> : null}

      {active === "write" ? <Section title="Guided writing builder">
        <NoteBox><strong>Task:</strong> {lesson.writingTopic}</NoteBox>
        {fullEssay ? <EmbeddedWritingPracticePanel /> : <GuidedWritingWorkspace config={getStandardWritingConfig(lesson)} storageKey={getStandardLessonStorageKey(lesson, "writing")} cloudField={getStandardWritingCloudField(lesson)} onStatusChange={setWriting} />}
      </Section> : null}

      {active === "finish" ? <Section title={`Finish ${lesson.level} Day ${lesson.day}`}>
        <p><strong>Learn:</strong> {progress.learnDone ? "Complete" : "Not complete"}</p>
        <p><strong>Speak:</strong> {progress.speakDone ? "Complete" : "Not complete"}</p>
        <p><strong>Write:</strong> {writing.complete ? "Complete" : "Not complete"} · {writing.wordCount} words</p>
        <textarea value={progress.reflection} onChange={(event) => setProgress((old) => ({ ...old, reflection: event.target.value }))} placeholder="Short reflection" style={{ minHeight: 110, border: "1px solid #cbd5e1", borderRadius: 12, padding: 12, font: "inherit" }} />
        {!finishReady ? <NoteBox tone="amber">Complete Learn, Speak and Write before finishing.</NoteBox> : null}
        {progress.completed ? <NoteBox tone="green">Lesson completed and saved.</NoteBox> : null}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="button" style={{ ...styles.primaryButton, opacity: finishReady ? 1 : .5 }} disabled={!finishReady} onClick={finish}>Mark lesson complete</button>
          {canSubmit ? <button type="button" style={{ ...styles.primaryButton, opacity: finishReady ? 1 : .5 }} disabled={!finishReady} onClick={submit}>Submit assignment</button> : null}
        </div>
      </Section> : null}
    </div>
  );
}
