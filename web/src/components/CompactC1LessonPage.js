import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppBackButton from "./navigation/AppBackButton";
import C1FinishSummary from "./C1FinishSummary";
import { AdvancedSelfLearningTabNav } from "./StandardWorkbookComponents";
import C1TopicIntroduction from "./C1TopicIntroduction";
import C1Day7ReisenGrammarNotes from "./C1Day7ReisenGrammarNotes";
import { EmbeddedSpeechPracticePanel, EmbeddedWritingPracticePanel } from "./selfLearning/EmbeddedPracticePanels";
import GuidedWritingWorkspace from "./GuidedWritingWorkspace";
import WritingCheatSheetTabs from "./WritingCheatSheetTabs";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
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


const Section = ({ title, children }) => (
  <section style={card}>
    <h2 style={{ margin: 0, fontSize: "1.2rem" }}>{title}</h2>
    {children}
  </section>
);

const WritingTaskPrompt = ({ lesson }) => (
  <NoteBox>
    <strong>Task:</strong> {lesson.writingTopic}
    {Array.isArray(lesson.writingPromptBullets) && lesson.writingPromptBullets.length ? (
      <ul style={{ ...listStyle, marginTop: 8 }}>
        {lesson.writingPromptBullets.map((item) => <li key={item}>{item}</li>)}
      </ul>
    ) : null}
  </NoteBox>
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


export default function CompactC1LessonPage({ lesson, canonicalLesson = null }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const { studentProfile, user } = useAuth();
  const [active, setActive] = useState("learn");
  const [writing, setWriting] = useState({ complete: false, completedQuestions: 0, totalQuestions: 5, wordCount: 0 });
  const storageKey = getStandardLessonStorageKey(lesson, "progress");
  const [progress, setProgress] = useState(() => {
    try {
      return { learnDone: false, speakDone: false, aiWritingDone: false, confidence: "", reflection: "", completed: false, ...JSON.parse(localStorage.getItem(storageKey) || "{}") };
    } catch {
      return { learnDone: false, speakDone: false, aiWritingDone: false, confidence: "", reflection: "", completed: false };
    }
  });

  useEffect(() => localStorage.setItem(storageKey, JSON.stringify(progress)), [progress, storageKey]);

  const grammarRules = (lesson.grammarLesson?.rules || []).slice(0, 6);
  const grammarExamples = (lesson.grammarLesson?.examples || []).slice(0, 5);
  const branches = lesson.speakingBuilder?.branches || [];
  const grammarUrl = canonicalLesson?.resources?.grammarBook?.url || lesson.resources?.grammarBook?.url || "";
  const workbookUrl = canonicalLesson?.resources?.workbook?.url || lesson.resources?.workbook?.url || "";
  const assignmentId = canonicalLesson?.submission?.assignmentId;
  const canSubmit = Boolean(canonicalLesson?.submission?.enabled && assignmentId);
  const fullEssay = getAdvancedWritingPhase(lesson.level, lesson.day) === "full-essay";
  const isC1Day7Grammar = String(lesson.level || "").toUpperCase() === "C1" && Number(lesson.day) === 7;
  const effectiveWritingComplete = fullEssay ? progress.aiWritingDone : writing.complete;
  const finishRequirements = [
    { key: "learn", label: "tick the grammar review checkbox on Learn", complete: progress.learnDone },
    { key: "speak", label: "tick the speaking practice checkbox on Speak", complete: progress.speakDone },
    { key: "write", label: fullEssay ? "tick that you used AI Analyse / Mark My Letter on Write" : "complete the guided writing questions on Write", complete: effectiveWritingComplete },
  ];
  const missingRequirements = finishRequirements.filter((item) => !item.complete);
  const finishReady = missingRequirements.length === 0;
  const finish = () => {
    if (!finishReady) return;
    const completedAt = new Date().toISOString();
    setProgress((old) => ({ ...old, completed: true, completedAt }));
    const studentCode = studentProfile?.studentCode || studentProfile?.studentcode || studentProfile?.id || user?.uid || "student";
    const assignmentKey = location.state?.assignmentKey;
    if (assignmentKey && typeof window !== "undefined") {
      const practiceStorageKey = `coursePracticeProgress:${studentCode}:${lesson.level}`;
      const saved = JSON.parse(window.localStorage.getItem(practiceStorageKey) || "{}");
      window.localStorage.setItem(practiceStorageKey, JSON.stringify({ ...saved, [assignmentKey]: { ...(saved[assignmentKey] || {}), completed: true, confidence: progress.confidence, completedAt, updatedAt: completedAt } }));
    }
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

      <AdvancedSelfLearningTabNav level="C1" day={lesson.day} activeTab={active} onChange={setActive} />

      {active === "learn" ? <>
        
        <C1TopicIntroduction day={Number(lesson.day)} title={lesson.title} />
        {isC1Day7Grammar ? (
          <C1Day7ReisenGrammarNotes
            checked={progress.learnDone}
            onCheckedChange={(checked) => setProgress((old) => ({ ...old, learnDone: checked }))}
          />
        ) : (
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
        )}
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
        <WritingCheatSheetTabs level={lesson.level} day={lesson.day}>
          <WritingTaskPrompt lesson={lesson} />
          <ResourceButton href={workbookUrl}>Open lesson workbook</ResourceButton>
          {fullEssay ? (<>
            <EmbeddedWritingPracticePanel />
            <label style={{ fontWeight: 800 }}><input type="checkbox" checked={Boolean(progress.aiWritingDone)} onChange={(event) => setProgress((old) => ({ ...old, aiWritingDone: event.target.checked }))} /> I used AI Analyse / Mark My Letter, reviewed the highlighted errors and improved my text.</label>
          </>) : <GuidedWritingWorkspace config={getStandardWritingConfig(lesson)} storageKey={getStandardLessonStorageKey(lesson, "writing")} cloudField={getStandardWritingCloudField(lesson)} onStatusChange={setWriting} />}
        </WritingCheatSheetTabs>
      </Section> : null}

      {active === "references" ? <WorkbookReferenceAnswers level={lesson.level} lesson={lesson} workbookId={`${lesson.level}-day-${lesson.day}`} /> : null}

      {active === "finish" ? <Section title={`Summary C1 Day ${lesson.day}`}>
        <C1FinishSummary day={lesson.day} />
        <p><strong>Learn:</strong> {progress.learnDone ? "Complete" : "Not complete"}</p>
        <p><strong>Speak:</strong> {progress.speakDone ? "Complete" : "Not complete"}</p>
        <p><strong>Write:</strong> {effectiveWritingComplete ? "Complete" : "Not complete"} · {fullEssay ? "AI analysis reviewed" : `${writing.wordCount} words`}</p>
        {!finishReady ? <NoteBox tone="amber"><strong>Mark complete is blocked because:</strong><ul style={{ margin: "6px 0 0", paddingLeft: 20 }}>{missingRequirements.map((item) => <li key={item.key}>{item.label}</li>)}</ul></NoteBox> : null}
        {progress.completed ? <NoteBox tone="green">Lesson completed and saved.</NoteBox> : null}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="button" style={{ ...styles.primaryButton, opacity: finishReady ? 1 : .5 }} disabled={!finishReady} onClick={finish}>Mark lesson complete</button>
          {canSubmit ? <button type="button" style={{ ...styles.primaryButton, opacity: finishReady ? 1 : .5 }} disabled={!finishReady} onClick={submit}>Submit assignment</button> : null}
        </div>
      </Section> : null}
    </div>
  );
}
