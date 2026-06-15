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

const tabs = [
  { id: "learn", label: "1. Learn" },
  { id: "speak", label: "2. Speak" },
  { id: "write", label: "3. Write" },
  { id: "finish", label: "4. Finish" },
];

const getYouTubeEmbedUrl = (url = "") => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    const videoId = host === "youtu.be"
      ? parsed.pathname.replace(/^\//, "")
      : parsed.searchParams.get("v") || parsed.pathname.split("/").filter(Boolean).pop();
    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  } catch (error) {
    return "";
  }
};

const cardStyle = {
  ...styles.card,
  display: "grid",
  gap: 14,
  border: "1px solid #e2e8f0",
  borderRadius: 18,
  boxShadow: "0 10px 26px rgba(15, 23, 42, 0.06)",
};

const Section = ({ title, children }) => (
  <section style={cardStyle}>
    <h2 style={{ margin: 0, fontSize: "1.2rem" }}>{title}</h2>
    {children}
  </section>
);

const NoteBox = ({ children, tone = "blue" }) => {
  const tones = {
    blue: { border: "#bfdbfe", background: "#eff6ff", color: "#1e3a8a" },
    green: { border: "#bbf7d0", background: "#f0fdf4", color: "#14532d" },
    amber: { border: "#fde68a", background: "#fffbeb", color: "#92400e" },
  };
  const selected = tones[tone] || tones.blue;
  return (
    <div style={{ border: `1px solid ${selected.border}`, borderRadius: 14, padding: 12, background: selected.background, color: selected.color, lineHeight: 1.65 }}>
      {children}
    </div>
  );
};

const ProgressCard = ({ label, complete, detail }) => (
  <div style={{ border: `1px solid ${complete ? "#86efac" : "#cbd5e1"}`, borderRadius: 14, padding: 13, background: complete ? "#f0fdf4" : "#fff", display: "grid", gap: 5 }}>
    <strong>{complete ? "✅" : "⬜"} {label}</strong>
    <span style={{ color: "#64748b", fontSize: 13 }}>{detail}</span>
  </div>
);

const ResourceButton = ({ href, children }) => {
  if (!href) return null;
  const external = !String(href).startsWith("/");
  return (
    <a href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})} style={{ ...styles.linkButton, width: "fit-content" }}>
      {children}
    </a>
  );
};

const isB2Day1 = (lesson = {}) => String(lesson.level || "").toUpperCase() === "B2" && Number(lesson.day) === 1;

const isC1Day2 = (lesson = {}) => String(lesson.level || "").toUpperCase() === "C1" && Number(lesson.day) === 2;

const SpeakingPointsList = ({ branches = [] }) => (
  <div style={{ border: "1px solid #c7d2fe", borderRadius: 14, padding: 14, background: "#eef2ff" }}>
    <h3 style={{ margin: "0 0 8px" }}>Punkte für deine Antwort</h3>
    <p style={{ margin: "0 0 8px", color: "#475569" }}>Wähle passende Punkte aus und gib Gründe und Beispiele.</p>
    <ul style={{ margin: 0, paddingLeft: 22, lineHeight: 1.75 }}>
      {branches.map((branch) => (
        <li key={branch.id}><strong>{branch.title}:</strong> {branch.keywords.join(", ")}</li>
      ))}
    </ul>
  </div>
);

const SpeakingBrainMap = ({ lesson }) => {
  const richBranches = lesson.speakingBuilder?.branches;
  const branches = getStandardBrainMap(lesson);
  if (isB2Day1(lesson)) return <SpeakingPoints />;
  if (isC1Day2(lesson)) {
    return <SpeakingPointsList branches={c1Day2LearningSpeakingGuide.speaking.branches} />;
  }
  if (Array.isArray(richBranches) && richBranches.length) {
    return <SpeakingPointsList branches={richBranches} />;
  }
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={{ justifySelf: "center", width: "min(270px, 92%)", minHeight: 120, borderRadius: 999, display: "grid", placeItems: "center", textAlign: "center", padding: 20, color: "#fff", background: "linear-gradient(135deg, #1d4ed8, #7c3aed)", boxShadow: "0 16px 34px rgba(37, 99, 235, 0.28)" }}>
        <div>
          <small style={{ opacity: 0.82, fontWeight: 800 }}>SPRECHEN-BRAIN-MAP</small>
          <h3 style={{ margin: "5px 0 0", fontSize: "1.2rem" }}>{lesson.title}</h3>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 12 }}>
        {branches.map((branch, index) => (
          <article key={`${branch.title}-${index}`} style={{ border: "1px solid #c7d2fe", borderRadius: 16, padding: 14, background: index % 2 === 0 ? "#eef2ff" : "#f8fafc", display: "grid", gap: 8 }}>
            <span style={{ width: 32, height: 32, borderRadius: 999, display: "grid", placeItems: "center", background: "#1d4ed8", color: "#fff", fontWeight: 900 }}>{index + 1}</span>
            <strong>{branch.title}</strong>
            <p style={{ margin: 0, color: "#475569", lineHeight: 1.55 }}>{branch.prompt}</p>
            <div style={{ borderLeft: "4px solid #818cf8", paddingLeft: 10, color: "#3730a3", lineHeight: 1.55 }}>{branch.starter}</div>
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
  const falowenRadio = canonicalLesson?.resources?.falowenRadio || null;
  const [hasEnteredLesson, setHasEnteredLesson] = useState(() => !shouldShowStandardRadioGate(falowenRadio));
  const [activeTab, setActiveTab] = useState("learn");
  const [writingStatus, setWritingStatus] = useState({ complete: false, completedQuestions: 0, totalQuestions: 5, wordCount: 0 });
  const storageKey = getStandardLessonStorageKey(lesson, "progress");
  const [progress, setProgress] = useState(() => {
    try {
      return { learnDone: false, speakDone: false, reflection: "", completed: false, ...JSON.parse(localStorage.getItem(storageKey) || "{}") };
    } catch (error) {
      return { learnDone: false, speakDone: false, reflection: "", completed: false };
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(progress));
  }, [progress, storageKey]);

  if (!hasEnteredLesson && falowenRadio) {
    return (
      <div style={{ ...styles.container, display: "grid", gap: 18 }}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <header style={{ ...cardStyle, borderColor: "#bfdbfe", background: "linear-gradient(135deg, #eff6ff, #f8fafc)" }}>
          <span style={{ ...styles.badge, width: "fit-content", background: "#dbeafe", color: "#1e3a8a" }}>Start here</span>
          <h1 style={{ margin: 0 }}>{lesson.level} · Day {lesson.day} · {lesson.title}</h1>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.65 }}>Listen to Falowen Radio first. Continue opens the four lesson tabs: Learn, Speak, Write and Finish.</p>
        </header>
        <FalowenRadioTabContent
          level={lesson.level}
          day={lesson.day}
          resource={falowenRadio}
          onContinue={() => {
            setHasEnteredLesson(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </div>
    );
  }

  const videoResource = lesson.videoResource || canonicalLesson?.resources?.aiVideo || canonicalLesson?.resources?.teacherVideo || null;
  const videoEmbed = getYouTubeEmbedUrl(videoResource?.url);
  const grammarRules = (lesson.grammarLesson?.rules || []).slice(0, 6);
  const grammarExamples = (lesson.grammarLesson?.examples || []).slice(0, 5);
  const grammarBookUrl = canonicalLesson?.resources?.grammarBook?.url || lesson.resources?.grammarBook?.url || "";
  const workbookUrl = canonicalLesson?.resources?.workbook?.url || lesson.resources?.workbook?.url || "";
  const finishReady = progress.learnDone && progress.speakDone && writingStatus.complete;
  const canSubmit = Boolean(canonicalLesson?.submission?.enabled && canonicalLesson?.submission?.assignmentId);
  const isFullEssayWriting = getAdvancedWritingPhase(lesson.level, lesson.day) === "full-essay";

  const markComplete = () => {
    if (!finishReady) return;
    setProgress((previous) => ({ ...previous, completed: true, completedAt: new Date().toISOString() }));
    showToast(`${lesson.level} Day ${lesson.day} completed. Your progress was saved.`, "success");
  };

  const submitAssignment = () => {
    const assignmentId = canonicalLesson?.submission?.assignmentId;
    if (!assignmentId) return;
    navigate(`/campus/submit?assignmentKey=${encodeURIComponent(assignmentId)}&assignmentId=${encodeURIComponent(assignmentId)}`, {
      state: {
        assignmentKey: assignmentId,
        assignmentId,
        canonicalAssignmentId: assignmentId,
        day: lesson.day,
        level: lesson.level,
        assignmentTitle: lesson.title,
      },
    });
  };

  return (
    <div style={{ ...styles.container, display: "grid", gap: 18 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

      <header style={{ borderRadius: 22, overflow: "hidden", color: "#fff", backgroundImage: `linear-gradient(135deg, rgba(2,6,23,.94), rgba(30,64,175,.72)), url(${lesson.heroImage || ""})`, backgroundSize: "cover", backgroundPosition: "center", padding: "clamp(22px, 4vw, 42px)", display: "grid", gap: 16, minHeight: 280, alignContent: "space-between", boxShadow: "0 20px 52px rgba(15,23,42,.18)" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={{ ...styles.badge, background: "rgba(255,255,255,.16)", color: "#fff" }}>{lesson.level}</span>
          <span style={{ ...styles.badge, background: "rgba(255,255,255,.16)", color: "#fff" }}>Day {lesson.day}</span>
          {lesson.chapter ? <span style={{ ...styles.badge, background: "rgba(37,99,235,.9)", color: "#fff" }}>Chapter {lesson.chapter}</span> : null}
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: "clamp(2rem, 5vw, 3.6rem)", lineHeight: 1.04 }}>{lesson.title}</h1>
          <p style={{ margin: "10px 0 0", color: "#e2e8f0", fontSize: "1.05rem", lineHeight: 1.6 }}>{lesson.topic}</p>
        </div>
      </header>

      <div style={{ position: "sticky", top: 0, zIndex: 5, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8, padding: 10, border: "1px solid #e2e8f0", borderRadius: 18, background: "rgba(248, 250, 252, 0.94)", backdropFilter: "blur(12px)" }}>
        {tabs.map((tab) => (
          <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} style={{ ...(activeTab === tab.id ? styles.primaryButton : styles.secondaryButton), borderRadius: 999, minHeight: 44 }}>{tab.label}</button>
        ))}
      </div>

      {activeTab === "learn" ? (
        <>
          <Section title="AI video">
            {videoResource?.url ? (
              <div style={{ display: "grid", gap: 10 }}>
                <strong>{videoResource.title || "Lesson video"}</strong>
                {videoResource.description ? <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>{videoResource.description}</p> : null}
                {videoEmbed ? (
                  <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", borderRadius: 16, overflow: "hidden", background: "#0f172a" }}>
                    <iframe title={videoResource.title || "Lesson video"} src={videoEmbed} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} />
                  </div>
                ) : null}
              </div>
            ) : <NoteBox tone="amber">No dedicated AI video has been added yet. Continue with the grammar notes and lesson resources.</NoteBox>}
          </Section>

          <Section title={`Grammar: ${lesson.grammarLesson?.title || lesson.grammarFocus || lesson.title}`}>
            <NoteBox tone="amber"><strong>Focus:</strong> {lesson.grammarFocus || lesson.grammarLesson?.title || lesson.title}</NoteBox>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
              <div><h3>Core rules</h3><ul style={{ paddingLeft: 20, lineHeight: 1.75 }}>{grammarRules.map((rule) => <li key={rule}>{rule}</li>)}</ul></div>
              <div><h3>Model sentences</h3><ul style={{ paddingLeft: 20, lineHeight: 1.75 }}>{grammarExamples.map((example) => <li key={example}>{example}</li>)}</ul></div>
            </div>
            {lesson.grammarLesson?.miniExercise ? <NoteBox><strong>Mini practice:</strong> {lesson.grammarLesson.miniExercise}</NoteBox> : null}
            <ResourceButton href={grammarBookUrl}>Open full grammar notes</ResourceButton>
            <label style={{ display: "flex", gap: 9, alignItems: "center", fontWeight: 800 }}>
              <input type="checkbox" checked={progress.learnDone} onChange={(event) => setProgress((previous) => ({ ...previous, learnDone: event.target.checked }))} />
              I reviewed the video and grammar.
            </label>
          </Section>
        </>
      ) : null}

      {activeTab === "speak" ? (
        <Section title="Speaking builder">
          <NoteBox tone="amber"><strong>Diskussionsfrage:</strong> {lesson.speakingTopic || `Welche Rolle spielt „${lesson.title}“ in deinem Leben und in der Gesellschaft?`}</NoteBox>
          <SpeakingBrainMap lesson={lesson} />
          <EmbeddedSpeechPracticePanel />
          <label style={{ display: "flex", gap: 9, alignItems: "center", fontWeight: 800 }}>
            <input type="checkbox" checked={progress.speakDone} onChange={(event) => setProgress((previous) => ({ ...previous, speakDone: event.target.checked }))} />
            {isC1Day2(lesson) ? "I completed a speaking practice." : "I used the brain map and completed a speaking practice."}
          </label>
        </Section>
      ) : null}

      {activeTab === "write" ? (
        <Section title="Guided writing builder">
          <NoteBox><strong>Task:</strong> {lesson.writingTopic || `Schreibe einen Text zum Thema „${lesson.title}“.`}</NoteBox>
          <ResourceButton href={workbookUrl}>Open lesson workbook</ResourceButton>
          {isFullEssayWriting ? <EmbeddedWritingPracticePanel /> : <GuidedWritingWorkspace config={getStandardWritingConfig(lesson)} storageKey={getStandardLessonStorageKey(lesson, "writing")} cloudField={getStandardWritingCloudField(lesson)} onStatusChange={setWritingStatus} />}
        </Section>
      ) : null}

      {activeTab === "finish" ? (
        <Section title={`Finish ${lesson.level} Day ${lesson.day}`}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 10 }}>
            <ProgressCard label="Learn" complete={progress.learnDone} detail="Video and grammar reviewed" />
            <ProgressCard label="Speak" complete={progress.speakDone} detail="Brain-map speaking practice completed" />
            <ProgressCard label="Write" complete={writingStatus.complete} detail={`${writingStatus.completedQuestions}/${writingStatus.totalQuestions} questions · ${writingStatus.wordCount} final words`} />
          </div>
          <label style={{ display: "grid", gap: 7 }}>
            <strong>Short reflection</strong>
            <span style={{ color: "#64748b", fontSize: 13 }}>What did you learn, and what should you improve next?</span>
            <textarea value={progress.reflection} onChange={(event) => setProgress((previous) => ({ ...previous, reflection: event.target.value }))} style={{ minHeight: 120, border: "1px solid #cbd5e1", borderRadius: 12, padding: 12, font: "inherit", resize: "vertical" }} />
          </label>
          {!finishReady ? <NoteBox tone="amber">Complete Learn, Speak and the guided writing task before finishing this lesson.</NoteBox> : null}
          {progress.completed ? <NoteBox tone="green"><strong>Completed.</strong> This lesson is saved as complete on this device.</NoteBox> : null}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button type="button" style={{ ...styles.primaryButton, opacity: finishReady ? 1 : 0.5 }} disabled={!finishReady} onClick={markComplete}>{progress.completed ? "Mark complete again" : "Mark lesson complete"}</button>
            {canSubmit ? <button type="button" style={{ ...styles.primaryButton, opacity: finishReady ? 1 : 0.5 }} disabled={!finishReady} onClick={submitAssignment}>Submit assignment</button> : null}
          </div>
        </Section>
      ) : null}
    </div>
  );
}
