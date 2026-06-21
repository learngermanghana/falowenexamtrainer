import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppBackButton from "./navigation/AppBackButton";
import FalowenRadioTabContent from "./FalowenRadioTabContent";
import { EmbeddedSpeechPracticePanel, EmbeddedWritingPracticePanel } from "./selfLearning/EmbeddedPracticePanels";
import GuidedWritingWorkspace from "./GuidedWritingWorkspace";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
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
const tabs = ["learn", "speak", "write", "finish", "references"];
const labels = { learn: "1. Learn", speak: "2. Speak", write: "3. Write", finish: "4. Finish", references: "5. Ref" };

export const C1_DAY3_WRITING_CHEAT_SHEET = [
  {
    id: "recommended-linking-expressions",
    title: "Recommended linking expressions",
    items: [
      { phrase: "nicht nur …, sondern auch", meaning: "not only … but also" },
      { phrase: "aus diesem Grund", meaning: "for this reason" },
      { phrase: "darüber hinaus", meaning: "furthermore / beyond that" },
      { phrase: "insbesondere", meaning: "in particular / especially" },
      { phrase: "einerseits …, andererseits", meaning: "on the one hand … on the other hand" },
      { phrase: "zwar …, aber", meaning: "admittedly … but / although … but" },
      { phrase: "dennoch", meaning: "nevertheless / nonetheless" },
      { phrase: "folglich", meaning: "consequently / therefore" },
      { phrase: "insofern …, als", meaning: "insofar as" },
      { phrase: "sofern", meaning: "provided that / as long as" },
      { phrase: "während", meaning: "whereas / while" },
      { phrase: "indem", meaning: "by / by means of" },
      { phrase: "je …, desto / umso", meaning: "the … the" },
    ],
  },
  {
    id: "useful-verbs-and-phrases",
    title: "Useful verbs and phrases",
    items: [
      { phrase: "etwas verbessern", meaning: "to improve something" },
      { phrase: "etwas fördern", meaning: "to promote / support something" },
      { phrase: "etwas stärken", meaning: "to strengthen something" },
      { phrase: "etwas beeinträchtigen", meaning: "to impair / negatively affect something" },
      { phrase: "etwas schädigen", meaning: "to damage / harm something" },
      { phrase: "zu etwas führen", meaning: "to lead to something" },
      { phrase: "etwas verursachen", meaning: "to cause something" },
      { phrase: "etwas bewirken", meaning: "to bring about / produce an effect" },
      { phrase: "etwas ermöglichen", meaning: "to enable something" },
      { phrase: "etwas verhindern", meaning: "to prevent something" },
      { phrase: "etwas verringern / reduzieren", meaning: "to reduce something" },
      { phrase: "einer Entwicklung entgegenwirken", meaning: "to counteract a development" },
      { phrase: "Maßnahmen ergreifen", meaning: "to take measures / take action" },
      { phrase: "etwas durchführen", meaning: "to carry out / conduct something" },
      { phrase: "etwas umsetzen", meaning: "to implement / put something into practice" },
      { phrase: "einen Beitrag leisten", meaning: "to make a contribution" },
      { phrase: "sich positiv auf etwas auswirken", meaning: "to have a positive effect on something" },
      { phrase: "sich negativ auf etwas auswirken", meaning: "to have a negative effect on something" },
    ],
  },
];

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
  const [writeView, setWriteView] = useState("task");
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
  useEffect(() => setWriteView("task"), [lesson.day, lesson.level]);

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
  const grammarUrl = canonicalLesson?.resources?.grammarBook?.url || lesson.resources?.grammarBook?.url || "";
  const workbookUrl = canonicalLesson?.resources?.workbook?.url || lesson.resources?.workbook?.url || "";
  const finishReady = progress.learnDone && progress.speakDone && writing.complete;
  const assignmentId = canonicalLesson?.submission?.assignmentId;
  const canSubmit = Boolean(canonicalLesson?.submission?.enabled && assignmentId);
  const fullEssay = getAdvancedWritingPhase(lesson.level, lesson.day) === "full-essay";
  const writingCheatSheet =
    String(lesson.level || "").toUpperCase() === "C1" && Number(lesson.day) === 3
      ? C1_DAY3_WRITING_CHEAT_SHEET
      : [];

  const finish = () => {
    if (!finishReady) return;
    setProgress((old) => ({ ...old, completed: true, completedAt: new Date().toISOString() }));
    showToast(`${lesson.level} Day ${lesson.day} completed. Your progress was saved.`, "success");
  };

  const submit = () => {
    if (!assignmentId) return;
    navigate(`/campus/course?submitWork=1&assignmentKey=${encodeURIComponent(assignmentId)}&assignmentId=${encodeURIComponent(assignmentId)}`, {
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
          <ResourceButton href={grammarUrl}>Open full grammar notes</ResourceButton>
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
        {writingCheatSheet.length ? (
          <div role="tablist" aria-label="C1 writing support" style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: 6, border: "1px solid #dbeafe", borderRadius: 14, background: "#eff6ff" }}>
            <button type="button" role="tab" aria-selected={writeView === "task"} onClick={() => setWriteView("task")} style={{ ...(writeView === "task" ? styles.primaryButton : styles.secondaryButton), borderRadius: 999 }}>Schreiben Task</button>
            <button type="button" role="tab" aria-selected={writeView === "cheatSheet"} onClick={() => setWriteView("cheatSheet")} style={{ ...(writeView === "cheatSheet" ? styles.primaryButton : styles.secondaryButton), borderRadius: 999 }}>Cheat Sheet</button>
          </div>
        ) : null}

        {!writingCheatSheet.length || writeView === "task" ? <>
          <NoteBox><strong>Task:</strong> {lesson.writingTopic}</NoteBox>
          <ResourceButton href={workbookUrl}>Open lesson workbook</ResourceButton>
          {fullEssay ? <EmbeddedWritingPracticePanel /> : <GuidedWritingWorkspace config={getStandardWritingConfig(lesson)} storageKey={getStandardLessonStorageKey(lesson, "writing")} cloudField={getStandardWritingCloudField(lesson)} onStatusChange={setWriting} />}
        </> : null}

        {writingCheatSheet.length && writeView === "cheatSheet" ? (
          <div style={{ display: "grid", gap: 16 }}>
            {writingCheatSheet.map((section) => (
              <section key={section.id} style={{ display: "grid", gap: 10 }}>
                <h3 style={{ margin: 0, fontSize: "1rem", color: "#1e3a8a" }}>{section.title}</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,280px),1fr))", gap: 8 }}>
                  {section.items.map((item) => (
                    <div key={`${section.id}-${item.phrase}`} style={{ display: "grid", gridTemplateColumns: "minmax(0, .8fr) minmax(0, 1.2fr)", gap: 12, alignItems: "center", border: "1px solid #e2e8f0", borderRadius: 12, padding: 12, background: "#f8fafc" }}>
                      <strong style={{ color: "#0f172a" }}>{item.phrase}</strong>
                      <span style={{ color: "#475569" }}>{item.meaning}</span>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : null}
      </Section> : null}

      {active === "references" ? <WorkbookReferenceAnswers level={lesson.level} lesson={lesson} workbookId={`${lesson.level}-day-${lesson.day}`} /> : null}

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
