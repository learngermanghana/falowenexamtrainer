import C1FinishSummary from "./C1FinishSummary";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppBackButton from "./navigation/AppBackButton";
import C1TopicIntroduction from "./C1TopicIntroduction";
import C1AcademicExamPractice, { C1AcademicGrammarPractice } from "./C1AcademicExamPractice";
import C1KnowledgeChoicePractice from "./C1KnowledgeChoicePractice";
import C1SpeakGrammarGuide from "./C1SpeakGrammarGuide";
import { EmbeddedSpeechPracticePanel, EmbeddedWritingPracticePanel } from "./selfLearning/EmbeddedPracticePanels";
import GuidedWritingWorkspace from "./GuidedWritingWorkspace";
import WritingCheatSheetTabs from "./WritingCheatSheetTabs";
import WritingTaskPrompt from "./WritingTaskPrompt";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import { AdvancedSelfLearningTabNav } from "./StandardWorkbookComponents";
import c1Day2LearningSpeakingGuide from "../data/selfLearningLessons/c1/day2LearningSpeakingGuide";
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

const ProgressCard = ({ label, complete, detail }) => (
  <div style={{ border: `1px solid ${complete ? "#86efac" : "#cbd5e1"}`, borderRadius: 14, padding: 13, background: complete ? "#f0fdf4" : "#fff", display: "grid", gap: 5 }}>
    <strong>{complete ? "✅" : "⬜"} {label}</strong>
    <span style={{ color: "#64748b", fontSize: 13 }}>{detail}</span>
  </div>
);


const SpeakingBuilder = ({ lesson }) => {
  const day = Number(lesson.day);
  const branches = day === 2
    ? c1Day2LearningSpeakingGuide.speaking.branches
    : (lesson.speakingBuilder?.branches || []);
  return <C1SpeakGrammarGuide lesson={lesson} branchesOverride={branches} />;
};

export default function C1Day1To6GuidedLessonPage({ lesson, canonicalLesson = null }) {
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

  const workbookUrl = canonicalLesson?.resources?.workbook?.url || lesson.resources?.workbook?.url || "";
  const assignmentId = canonicalLesson?.submission?.assignmentId;
  const canSubmit = Boolean(canonicalLesson?.submission?.enabled && assignmentId);
  const fullEssay = getAdvancedWritingPhase(lesson.level, lesson.day) === "full-essay";
  const effectiveWritingComplete = fullEssay ? progress.aiWritingDone : writing.complete;
  const finishRequirements = [
    { key: "learn", label: "answer all Learn knowledge questions correctly", complete: progress.learnDone },
    { key: "speak", label: "complete a speaking practice", complete: progress.speakDone },
    { key: "write", label: fullEssay ? "use AI Analyse / Mark My Letter and review the corrections" : "complete the guided writing questions", complete: effectiveWritingComplete },
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
    showToast(`C1 Day ${lesson.day} completed. Your progress was saved.`, "success");
  };

  const submit = () => {
    if (!assignmentId) return;
    navigate(`/campus/course?submitWork=1&assignmentKey=${encodeURIComponent(assignmentId)}&assignmentId=${encodeURIComponent(assignmentId)}`, {
      state: { assignmentKey: assignmentId, assignmentId, canonicalAssignmentId: assignmentId, day: lesson.day, level: "C1", assignmentTitle: lesson.title },
    });
  };

  return (
    <div style={{ ...styles.container, display: "grid", gap: 18 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
      <header style={{ borderRadius: 22, overflow: "hidden", color: "#fff", backgroundImage: `linear-gradient(135deg,rgba(2,6,23,.94),rgba(30,64,175,.72)),url(${lesson.heroImage || ""})`, backgroundSize: "cover", backgroundPosition: "center", padding: "clamp(22px,4vw,42px)", display: "grid", gap: 16, minHeight: 280, alignContent: "space-between" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={{ ...styles.badge, background: "rgba(255,255,255,.16)", color: "#fff" }}>C1</span>
          <span style={{ ...styles.badge, background: "rgba(255,255,255,.16)", color: "#fff" }}>Day {lesson.day}</span>
          <span style={{ ...styles.badge, background: "rgba(37,99,235,.9)", color: "#fff" }}>Chapter {lesson.chapter}</span>
        </div>
        <div><h1 style={{ margin: 0, fontSize: "clamp(2rem,5vw,3.6rem)" }}>{lesson.title}</h1><p style={{ margin: "10px 0 0", color: "#e2e8f0" }}>{lesson.topic}</p></div>
      </header>

      <AdvancedSelfLearningTabNav level="C1" day={lesson.day} activeTab={active} onChange={setActive} />

      {active === "learn" ? <>
        
        <C1TopicIntroduction day={Number(lesson.day)} title={lesson.title} />
        <C1AcademicGrammarPractice day={lesson.day} />
        <C1AcademicExamPractice day={lesson.day} tab="learn" />
        <C1KnowledgeChoicePractice
          lesson={lesson}
          completed={progress.learnDone}
          onCompleteChange={(learnDone) => setProgress((old) => ({ ...old, learnDone }))}
        />
      </> : null}

      {active === "speak" ? <Section title="Speaking builder">
        <C1AcademicExamPractice day={lesson.day} tab="speak" />
        <SpeakingBuilder lesson={lesson} />
        <EmbeddedSpeechPracticePanel />
        <label style={fieldLabel}><input type="checkbox" checked={progress.speakDone} onChange={(event) => setProgress((old) => ({ ...old, speakDone: event.target.checked }))} />I completed a speaking practice.</label>
      </Section> : null}

      {active === "write" ? <Section title="Guided writing builder">
        <C1AcademicExamPractice day={lesson.day} tab="write" />
        <WritingCheatSheetTabs level="C1" day={lesson.day}>
          <WritingTaskPrompt lesson={lesson} />
          <ResourceButton href={workbookUrl}>Open lesson workbook</ResourceButton>
          {fullEssay ? (<>
            <EmbeddedWritingPracticePanel />
            <label style={fieldLabel}><input type="checkbox" checked={Boolean(progress.aiWritingDone)} onChange={(event) => setProgress((old) => ({ ...old, aiWritingDone: event.target.checked }))} />I used AI Analyse / Mark My Letter, reviewed the highlighted errors and improved my text.</label>
          </>) : <GuidedWritingWorkspace config={getStandardWritingConfig(lesson)} storageKey={getStandardLessonStorageKey(lesson, "writing")} cloudField={getStandardWritingCloudField(lesson)} onStatusChange={setWriting} />}
        </WritingCheatSheetTabs>
      </Section> : null}

      {active === "references" ? <WorkbookReferenceAnswers level="C1" lesson={lesson} workbookId={`C1-day-${lesson.day}`} /> : null}

      {active === "finish" ? <Section title={`Summary C1 Day ${lesson.day}`}><C1FinishSummary day={lesson.day} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 10 }}>
          <ProgressCard label="Learn" complete={progress.learnDone} detail="All multiple-choice knowledge questions answered correctly" />
          <ProgressCard label="Speak" complete={progress.speakDone} detail="Speaking practice completed" />
          <ProgressCard label="Write" complete={effectiveWritingComplete} detail={fullEssay ? "AI analysis reviewed and errors improved" : `${writing.completedQuestions}/${writing.totalQuestions} questions · ${writing.wordCount} final words`} />
        </div>
        {!finishReady ? <NoteBox tone="amber"><strong>Mark complete is blocked because:</strong><ul style={{ margin: "6px 0 0", paddingLeft: 20 }}>{missingRequirements.map((item) => <li key={item.key}>{item.label}</li>)}</ul></NoteBox> : null}
        {progress.completed ? <NoteBox tone="green"><strong>Completed.</strong> This lesson is saved as complete on this device.</NoteBox> : null}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="button" style={{ ...styles.primaryButton, opacity: finishReady ? 1 : .5 }} disabled={!finishReady} onClick={finish}>{progress.completed ? "Mark complete again" : "Mark lesson complete"}</button>
          {canSubmit ? <button type="button" style={{ ...styles.primaryButton, opacity: finishReady ? 1 : .5 }} disabled={!finishReady} onClick={submit}>Submit assignment</button> : null}
        </div>
      </Section> : null}
    </div>
  );
}
