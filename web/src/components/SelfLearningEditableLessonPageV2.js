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

const heroShellStyle = {
  borderRadius: 28,
  overflow: "hidden",
  border: "1px solid rgba(148, 163, 184, 0.28)",
  boxShadow: "0 28px 70px rgba(15, 23, 42, 0.22)",
  background: "#0f172a",
};

const heroContentStyle = (imageUrl) => ({
  minHeight: 420,
  backgroundImage: `linear-gradient(135deg, rgba(2, 6, 23, 0.94) 0%, rgba(15, 23, 42, 0.82) 42%, rgba(30, 64, 175, 0.34) 100%), url(${imageUrl})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  color: "#fff",
  padding: "clamp(22px, 4vw, 48px)",
  display: "grid",
  alignContent: "space-between",
  gap: 28,
  position: "relative",
});

const heroBadgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "8px 13px",
  borderRadius: 999,
  border: "1px solid rgba(255, 255, 255, 0.28)",
  background: "rgba(255, 255, 255, 0.14)",
  color: "#ffffff",
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "0.01em",
  backdropFilter: "blur(12px)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18)",
};

const tabBarStyle = {
  position: "sticky",
  top: 0,
  zIndex: 5,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
  gap: 8,
  padding: "10px",
  border: "1px solid rgba(226, 232, 240, 0.9)",
  borderRadius: 18,
  background: "rgba(248, 250, 252, 0.92)",
  backdropFilter: "blur(12px)",
  boxShadow: "0 10px 26px rgba(15, 23, 42, 0.06)",
};

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
  <div
    style={{
      border: "1px solid rgba(255,255,255,0.18)",
      background: "rgba(255,255,255,0.94)",
      borderRadius: 18,
      padding: "16px 18px",
      display: "grid",
      gap: 8,
      minHeight: 92,
      color: "#0f172a",
      boxShadow: "0 18px 34px rgba(2, 6, 23, 0.18)",
      backdropFilter: "blur(16px)",
    }}
  >
    <span style={{ fontSize: 12, color: "#475569", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</span>
    <strong style={{ fontSize: 17, color: "#0f172a", lineHeight: 1.35 }}>{value}</strong>
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
  const heroImage = lesson.heroImage || DEFAULT_HERO_IMAGE;

  return (
    <div style={{ ...styles.container, display: "grid", gap: 18 }}>
      <button
        type="button"
        style={{ ...styles.secondaryButton, justifySelf: "start", borderRadius: 999, padding: "10px 18px", boxShadow: "0 6px 18px rgba(15, 23, 42, 0.06)" }}
        onClick={() => navigate("/campus/course")}
      >
        ← Course Book
      </button>

      <header style={heroShellStyle}>
        <div style={heroContentStyle(heroImage)}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <span style={heroBadgeStyle}>{lesson.level}</span>
            <span style={heroBadgeStyle}>Day {lesson.day}</span>
            {lesson.chapter ? <span style={heroBadgeStyle}>Chapter {lesson.chapter}</span> : null}
            <span style={{ ...heroBadgeStyle, background: "rgba(37, 99, 235, 0.88)", borderColor: "rgba(147, 197, 253, 0.5)" }}>AI self-learning</span>
            {progress.completed ? <span style={{ ...heroBadgeStyle, background: "rgba(22, 163, 74, 0.88)", borderColor: "rgba(187, 247, 208, 0.55)" }}>Self-marked complete</span> : null}
          </div>

          <div style={{ display: "grid", gap: 20 }}>
            <div style={{ display: "grid", gap: 12, maxWidth: 940 }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(2.15rem, 5.8vw, 4.7rem)",
                  lineHeight: 0.98,
                  letterSpacing: "-0.055em",
                  textWrap: "balance",
                  textShadow: "0 10px 28px rgba(0,0,0,0.32)",
                }}
              >
                {lesson.title}
              </h1>
              <p style={{ margin: 0, maxWidth: 980, fontSize: "clamp(1rem, 1.6vw, 1.22rem)", lineHeight: 1.65, color: "#e2e8f0", textShadow: "0 6px 18px rgba(0,0,0,0.26)" }}>
                {lesson.topic}
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
              <StatCard label="Speaking task" value={lesson.speakingTaskType || "Guided talk"} />
              <StatCard label="Writing support" value="Task · Mark · Ref · Ideas" />
              <StatCard label="Progress" value={progress.completed ? "Completed" : "In progress"} />
            </div>
          </div>
        </div>
      </header>

      <div style={tabBarStyle}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            style={{
              ...(activeTab === tab.id ? styles.primaryButton : styles.secondaryButton),
              borderRadius: 999,
              minHeight: 44,
              boxShadow: activeTab === tab.id ? "0 10px 24px rgba(37, 99, 235, 0.22)" : "none",
            }}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
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
