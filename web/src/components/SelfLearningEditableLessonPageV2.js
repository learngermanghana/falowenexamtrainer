import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import { EmbeddedPracticeNote, EmbeddedSpeechPracticePanel, EmbeddedWritingPracticePanel } from "./selfLearning/EmbeddedPracticePanels";

const DEFAULT_HERO_IMAGE = "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80";

const cardStyle = {
  ...styles.card,
  display: "grid",
  gap: 14,
  border: "1px solid #e5e7eb",
  boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
};

const tabs = [
  { id: "learn", label: "1. Learn" },
  { id: "speak", label: "2. Speak" },
  { id: "write", label: "3. Write" },
  { id: "finish", label: "4. Finish" },
];

const scoreFields = [
  { key: "speakingScore", label: "Sprechen" },
  { key: "writingScore", label: "Schreiben" },
  { key: "readingScore", label: "Lesen" },
  { key: "listeningScore", label: "Hören" },
];

const Section = ({ title, children }) => (
  <section style={cardStyle}>
    <h2 style={{ margin: 0, fontSize: "1.15rem" }}>{title}</h2>
    {children}
  </section>
);

const PracticeBox = ({ title, children }) => (
  <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 14, background: "#fff", display: "grid", gap: 8 }}>
    <strong>{title}</strong>
    {children}
  </div>
);

const NoteBox = ({ children, tone = "blue" }) => {
  const tones = {
    blue: { border: "#bfdbfe", bg: "#eff6ff" },
    green: { border: "#bbf7d0", bg: "#f0fdf4" },
    amber: { border: "#fde68a", bg: "#fffbeb" },
  };
  const selected = tones[tone] || tones.blue;
  return <div style={{ padding: 12, borderRadius: 12, border: `1px solid ${selected.border}`, background: selected.bg, lineHeight: 1.7 }}>{children}</div>;
};

const StatCard = ({ label, value }) => (
  <div style={{ border: "1px solid rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.88)", borderRadius: 14, padding: 12, display: "grid", gap: 4, minHeight: 72 }}>
    <span style={{ fontSize: 12, color: "#4b5563", fontWeight: 700 }}>{label}</span>
    <strong style={{ fontSize: 16 }}>{value}</strong>
  </div>
);

const renderList = (items = []) => {
  if (!items.length) return null;
  return <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>{items.map((item) => <li key={item}>{item}</li>)}</ul>;
};

const ExternalResourceCard = ({ title, resource }) => {
  if (!resource) return null;
  return (
    <PracticeBox title={title}>
      <p style={{ margin: 0, fontWeight: 600 }}>{resource.title}</p>
      {resource.description ? <p style={{ margin: 0, color: "#4b5563", lineHeight: 1.6 }}>{resource.description}</p> : null}
      {resource.url ? <a href={resource.url} target="_blank" rel="noreferrer" style={{ ...styles.linkButton, justifySelf: "start" }}>Open resource</a> : null}
      {renderList(resource.tasks || [])}
    </PracticeBox>
  );
};

const inferWritingType = (lesson) => {
  if (lesson.writingTaskType) return lesson.writingTaskType;
  const text = `${lesson.title || ""} ${lesson.topic || ""} ${lesson.tasks?.writing || ""}`.toLowerCase();
  if (/beschwerde|anfrage|bewerbung|einladung|absage|termin|formell|brief|e-mail|email/.test(text)) return "Formal letter / E-Mail";
  if (/rezension|bewertung|empfehlung/.test(text)) return "Review / Recommendation";
  if (/bericht|zusammenfassung/.test(text)) return "Report / Summary";
  return "Opinion essay / Erörterung";
};

const numberOrNull = (value) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
};

const buildInitialProgress = () => ({
  understood: false,
  practisedWithAi: false,
  improvedAfterFeedback: false,
  speakingScore: "",
  writingScore: "",
  readingScore: "",
  listeningScore: "",
  completed: false,
});

export default function SelfLearningEditableLessonPageV2({ lesson }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("learn");
  const storageKey = `falowen:self-learning:lesson:${lesson.level}:${lesson.day}`;
  const [progress, setProgress] = useState(() => {
    try {
      return { ...buildInitialProgress(), ...JSON.parse(localStorage.getItem(storageKey) || "{}") };
    } catch (error) {
      return buildInitialProgress();
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(progress));
  }, [progress, storageKey]);

  const updateProgress = (updates) => setProgress((previous) => ({ ...previous, ...updates }));

  const scoreSummary = useMemo(() => {
    const values = scoreFields.map((field) => numberOrNull(progress[field.key])).filter((score) => score !== null);
    if (!values.length) return { average: null, count: 0 };
    return { average: Math.round(values.reduce((sum, score) => sum + score, 0) / values.length), count: values.length };
  }, [progress]);

  const writingType = inferWritingType(lesson);
  const speakingTopic = lesson.speakingTopic || lesson.tasks?.speaking || `Sprich über: ${lesson.topic}`;
  const writingTask = lesson.writingTopic || lesson.tasks?.writing || `Schreibe einen ${lesson.level}-Text zum Thema: ${lesson.topic}. Begründe deine Meinung und nutze passende Redemittel.`;
  const canComplete = progress.understood && progress.practisedWithAi && progress.improvedAfterFeedback && scoreSummary.count >= 2;

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <button type="button" style={{ ...styles.secondaryButton, justifySelf: "start" }} onClick={() => navigate("/campus/course")}>← Course Book</button>

      <header style={{ borderRadius: 20, overflow: "hidden", border: "1px solid #e5e7eb", boxShadow: "0 18px 40px rgba(15, 23, 42, 0.12)", background: "#fff" }}>
        <div style={{ minHeight: 250, backgroundImage: `linear-gradient(90deg, rgba(15,23,42,0.88), rgba(15,23,42,0.42)), url(${lesson.heroImage || DEFAULT_HERO_IMAGE})`, backgroundSize: "cover", backgroundPosition: "center", color: "#fff", padding: "28px clamp(18px, 4vw, 36px)", display: "grid", alignContent: "end", gap: 16 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ ...styles.levelPill, background: "rgba(255,255,255,0.92)", color: "#1d4ed8" }}>{lesson.level}</span>
            <span style={{ ...styles.levelPill, background: "rgba(255,255,255,0.92)", color: "#1d4ed8" }}>Day {lesson.day}</span>
            {lesson.chapter ? <span style={{ ...styles.levelPill, background: "rgba(255,255,255,0.92)", color: "#1d4ed8" }}>Chapter {lesson.chapter}</span> : null}
            <span style={{ ...styles.badge, background: "#dbeafe", color: "#1e40af" }}>AI self-learning</span>
            {progress.completed ? <span style={{ ...styles.badge, background: "#dcfce7", color: "#166534" }}>Self-marked complete</span> : null}
          </div>
          <div style={{ display: "grid", gap: 8, maxWidth: 860 }}>
            <h1 style={{ margin: 0, fontSize: "clamp(2rem, 5vw, 3.4rem)", lineHeight: 1.05 }}>{lesson.title}</h1>
            <p style={{ margin: 0, fontSize: "1.05rem", lineHeight: 1.6, color: "#e5e7eb" }}>{lesson.topic}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 10 }}>
            <StatCard label="Speaking task" value={lesson.speakingTaskType || "Guided talk"} />
            <StatCard label="Writing support" value="Task · Mark · Ref · Ideas" />
            <StatCard label="Progress" value={progress.completed ? "Completed" : "In progress"} />
          </div>
        </div>
      </header>

      <div style={{ position: "sticky", top: 0, zIndex: 5, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8, padding: "10px 0", background: "#f3f4f6" }}>
        {tabs.map((tab) => (
          <button key={tab.id} type="button" style={activeTab === tab.id ? styles.primaryButton : styles.secondaryButton} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>
        ))}
      </div>

      {activeTab === "learn" ? (
        <>
          <Section title="Daily mission">
            <NoteBox><strong>No tutor submission for {lesson.level}.</strong> Learn the topic, practise with Falowen AI, read feedback, improve your answer and self-mark honestly.</NoteBox>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
              <PracticeBox title="Sprechen topic"><p style={{ margin: 0, lineHeight: 1.6 }}>{speakingTopic}</p></PracticeBox>
              <PracticeBox title="Schreiben task">
                <span style={{ ...styles.badge, justifySelf: "start" }}>{writingType}</span>
                <p style={{ margin: 0, lineHeight: 1.6 }}>{writingTask}</p>
              </PracticeBox>
            </div>
          </Section>

          <Section title="Ziele und Thema">
            {renderList(lesson.objectives || [])}
            {(lesson.explanation || []).map((paragraph) => <p key={paragraph} style={{ margin: 0, lineHeight: 1.7 }}>{paragraph}</p>)}
            {lesson.topicQuestions?.length ? <PracticeBox title="Think before you answer">{renderList(lesson.topicQuestions)}</PracticeBox> : null}
          </Section>

          <Section title="Grammatik, Sprache und Redemittel">
            {lesson.grammarFocus ? <NoteBox><strong>Fokus:</strong> {lesson.grammarFocus}</NoteBox> : null}
            {lesson.grammarLesson?.rules?.length ? <PracticeBox title="Rules">{renderList(lesson.grammarLesson.rules)}</PracticeBox> : null}
            {lesson.grammarLesson?.examples?.length ? <PracticeBox title="Examples">{renderList(lesson.grammarLesson.examples)}</PracticeBox> : null}
            {lesson.grammarLesson?.miniExercise ? <PracticeBox title="Mini exercise"><p style={{ margin: 0, lineHeight: 1.7 }}>{lesson.grammarLesson.miniExercise}</p></PracticeBox> : null}
            {lesson.phrases?.length ? <PracticeBox title="Useful phrases">{renderList(lesson.phrases)}</PracticeBox> : null}
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" checked={progress.understood} onChange={(event) => updateProgress({ understood: event.target.checked })} />
              <span style={styles.label}>I understand the topic and prepared my ideas.</span>
            </label>
          </Section>
        </>
      ) : null}

      {activeTab === "speak" ? (
        <Section title="Speaking builder">
          <PracticeBox title="Sprechen topic"><p style={{ margin: 0, lineHeight: 1.6 }}>{speakingTopic}</p></PracticeBox>
          {lesson.speakingBuilder?.plan?.length ? <PracticeBox title="Speaking plan">{renderList(lesson.speakingBuilder.plan)}</PracticeBox> : null}
          {lesson.speakingBuilder?.starters?.length ? <PracticeBox title="Sentence starters">{renderList(lesson.speakingBuilder.starters)}</PracticeBox> : null}
          <EmbeddedPracticeNote>Record, submit, receive feedback and improve without leaving the course lesson.</EmbeddedPracticeNote>
          <EmbeddedSpeechPracticePanel />
        </Section>
      ) : null}

      {activeTab === "write" ? (
        <Section title="Writing support">
          <PracticeBox title="Writing task">
            <span style={{ ...styles.badge, justifySelf: "start" }}>{writingType}</span>
            <p style={{ margin: 0, lineHeight: 1.7 }}>{writingTask}</p>
          </PracticeBox>
          <NoteBox>
            <strong>Focused writing space.</strong> Plan, write, mark and improve in the panel below. The long writing workflow, structure guide,
            Redemittel preview and tool explanations are now in <strong>Day 0 Orientation</strong>, so this tab stays clear for practice.
          </NoteBox>
          <EmbeddedPracticeNote>Write your answer, mark it, collect Redemittel and improve without leaving the course lesson.</EmbeddedPracticeNote>
          <EmbeddedWritingPracticePanel />
        </Section>
      ) : null}

      {activeTab === "finish" ? (
        <>
          <Section title="Lesen, Hören und Wortschatz">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
              <ExternalResourceCard title="Recommended reading" resource={lesson.readingResource} />
              <ExternalResourceCard title="Recommended listening" resource={lesson.listeningResource} />
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              <strong>Vocabulary builder</strong>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {(lesson.vocabulary || []).map((word) => <span key={word} style={{ ...styles.badge, background: "#eef2ff", color: "#3730a3" }}>{word}</span>)}
              </div>
              <p style={{ margin: 0, color: "#4b5563" }}>Make one strong sentence with each word, then ask Falowen AI to improve the sentences to {lesson.level} level.</p>
            </div>
          </Section>

          <Section title="AI practice checklist">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
              <PracticeBox title="Speech"><p style={{ margin: 0, color: "#4b5563", lineHeight: 1.6 }}>Practise in the Speak tab inside this lesson.</p></PracticeBox>
              <PracticeBox title="Writing"><p style={{ margin: 0, color: "#4b5563", lineHeight: 1.6 }}>{writingTask}</p></PracticeBox>
              <PracticeBox title="Reading"><p style={{ margin: 0, color: "#4b5563", lineHeight: 1.6 }}>{lesson.tasks?.reading}</p></PracticeBox>
              <PracticeBox title="Listening"><p style={{ margin: 0, color: "#4b5563", lineHeight: 1.6 }}>{lesson.tasks?.listening}</p></PracticeBox>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" checked={progress.practisedWithAi} onChange={(event) => updateProgress({ practisedWithAi: event.target.checked })} />
              <span style={styles.label}>I practised at least two parts with Falowen AI.</span>
            </label>
          </Section>

          <Section title="Self-marking">
            <p style={{ margin: 0, color: "#4b5563" }}>Enter your AI scores. You can mark the day complete after practising with AI and improving after feedback.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 10 }}>
              {scoreFields.map((field) => (
                <label key={field.key} style={{ ...styles.field, margin: 0 }}>
                  <span style={styles.label}>{field.label} score</span>
                  <input type="number" min="0" max="100" value={progress[field.key]} onChange={(event) => updateProgress({ [field.key]: event.target.value })} style={styles.input} placeholder="0-100" />
                </label>
              ))}
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" checked={progress.improvedAfterFeedback} onChange={(event) => updateProgress({ improvedAfterFeedback: event.target.checked })} />
              <span style={styles.label}>I read the AI feedback and improved at least one answer.</span>
            </label>
            <NoteBox tone={canComplete ? "green" : "amber"}>
              <strong>Average score:</strong> {scoreSummary.average === null ? "No score yet" : `${scoreSummary.average}/100`}<br />
              {canComplete ? "Ready to mark complete." : "Complete the checklist above before marking this day complete."}
            </NoteBox>
            <button type="button" style={canComplete ? styles.primaryButton : styles.secondaryButton} disabled={!canComplete} onClick={() => updateProgress({ completed: true })}>Mark this day complete</button>
          </Section>
        </>
      ) : null}
    </div>
  );
}
