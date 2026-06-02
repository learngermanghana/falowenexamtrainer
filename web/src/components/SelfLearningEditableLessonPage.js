import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const cardStyle = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const sectionTitleStyle = {
  margin: 0,
  fontSize: "1.15rem",
};

const listStyle = {
  margin: 0,
  paddingLeft: 20,
  lineHeight: 1.7,
};

const Section = ({ title, children }) => (
  <section style={cardStyle}>
    <h2 style={sectionTitleStyle}>{title}</h2>
    {children}
  </section>
);

const NoteBox = ({ children }) => (
  <div
    style={{
      padding: 12,
      borderRadius: 12,
      border: "1px solid #bfdbfe",
      background: "#eff6ff",
      lineHeight: 1.7,
    }}
  >
    {children}
  </div>
);

const SkillCard = ({ title, task, route, onOpen }) => (
  <div
    style={{
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      padding: 12,
      background: "#fff",
      display: "grid",
      gap: 8,
    }}
  >
    <strong>{title}</strong>
    <p style={{ margin: 0, color: "#4b5563", lineHeight: 1.6 }}>{task}</p>
    {route ? (
      <button type="button" style={{ ...styles.secondaryButton, justifySelf: "start" }} onClick={() => onOpen(route)}>
        Open {title} AI
      </button>
    ) : null}
  </div>
);

const scoreFields = [
  { key: "speakingScore", label: "Sprechen" },
  { key: "writingScore", label: "Schreiben" },
  { key: "readingScore", label: "Lesen" },
  { key: "listeningScore", label: "Hören" },
];

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

export default function SelfLearningEditableLessonPage({ lesson }) {
  const navigate = useNavigate();
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
    const values = scoreFields
      .map((field) => numberOrNull(progress[field.key]))
      .filter((score) => score !== null);

    if (!values.length) return { average: null, count: 0 };
    return {
      average: Math.round(values.reduce((sum, score) => sum + score, 0) / values.length),
      count: values.length,
    };
  }, [progress]);

  const canComplete = progress.understood && progress.practisedWithAi && progress.improvedAfterFeedback && scoreSummary.count >= 2;

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <button type="button" style={{ ...styles.secondaryButton, justifySelf: "start" }} onClick={() => navigate("/campus/course")}>
        ← Course Book
      </button>

      <header style={cardStyle}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <span style={styles.levelPill}>{lesson.level}</span>
          <span style={styles.levelPill}>Day {lesson.day}</span>
          {lesson.chapter ? <span style={styles.levelPill}>Chapter {lesson.chapter}</span> : null}
          <span style={styles.badge}>AI self-learning</span>
          {progress.completed ? <span style={{ ...styles.badge, background: "#ecfdf5", color: "#166534" }}>Self-marked complete</span> : null}
        </div>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>{lesson.title}</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>{lesson.topic}</p>
        <NoteBox>
          <strong>No tutor submission for {lesson.level}.</strong> Learn the topic, practise with Falowen AI, read the feedback,
          improve your answer and mark your own progress honestly.
        </NoteBox>
      </header>

      <Section title="1) Ziele für heute">
        <ul style={listStyle}>
          {(lesson.objectives || []).map((objective) => <li key={objective}>{objective}</li>)}
        </ul>
      </Section>

      <Section title="2) Thema verstehen">
        {(lesson.explanation || []).map((paragraph) => (
          <p key={paragraph} style={{ margin: 0, lineHeight: 1.7 }}>{paragraph}</p>
        ))}
        {lesson.grammarFocus ? <NoteBox><strong>Grammatik/Strategie:</strong> {lesson.grammarFocus}</NoteBox> : null}
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" checked={progress.understood} onChange={(event) => updateProgress({ understood: event.target.checked })} />
          <span style={styles.label}>I understand the topic and prepared my ideas.</span>
        </label>
      </Section>

      <Section title="3) Useful phrases">
        <ul style={listStyle}>
          {(lesson.phrases || []).map((phrase) => <li key={phrase}>{phrase}</li>)}
        </ul>
      </Section>

      <Section title="4) Practice with Falowen AI">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
          <SkillCard title="Speech" task={lesson.tasks?.speaking} route="/campus/speech" onOpen={navigate} />
          <SkillCard title="Writing" task={lesson.tasks?.writing} route="/campus/writing" onOpen={navigate} />
          <SkillCard title="Reading" task={lesson.tasks?.reading} route="/exams/lesen" onOpen={navigate} />
          <SkillCard title="Listening" task={lesson.tasks?.listening} route="/exams/horen" onOpen={navigate} />
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" checked={progress.practisedWithAi} onChange={(event) => updateProgress({ practisedWithAi: event.target.checked })} />
          <span style={styles.label}>I practised at least two parts with Falowen AI.</span>
        </label>
      </Section>

      <Section title="5) Vocabulary builder">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {(lesson.vocabulary || []).map((word) => (
            <span key={word} style={{ ...styles.badge, background: "#eef2ff", color: "#3730a3" }}>{word}</span>
          ))}
        </div>
        <p style={{ margin: 0, color: "#4b5563" }}>
          Make one strong sentence with each word, then ask Falowen AI to improve the sentences to {lesson.level} level.
        </p>
      </Section>

      <Section title="6) Self-marking">
        <p style={{ margin: 0, color: "#4b5563" }}>
          Enter your AI scores. You can mark the day complete after you have practised with AI and improved after feedback.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 10 }}>
          {scoreFields.map((field) => (
            <label key={field.key} style={{ ...styles.field, margin: 0 }}>
              <span style={styles.label}>{field.label} score</span>
              <input
                type="number"
                min="0"
                max="100"
                value={progress[field.key]}
                onChange={(event) => updateProgress({ [field.key]: event.target.value })}
                style={styles.input}
                placeholder="0-100"
              />
            </label>
          ))}
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" checked={progress.improvedAfterFeedback} onChange={(event) => updateProgress({ improvedAfterFeedback: event.target.checked })} />
          <span style={styles.label}>I read the AI feedback and improved at least one answer.</span>
        </label>
        <NoteBox>
          <strong>Average score:</strong> {scoreSummary.average === null ? "No score yet" : `${scoreSummary.average}/100`}<br />
          {canComplete ? "Ready to mark complete." : "Complete the checklist above before marking this day complete."}
        </NoteBox>
        <button
          type="button"
          style={canComplete ? styles.primaryButton : styles.secondaryButton}
          disabled={!canComplete}
          onClick={() => updateProgress({ completed: true })}
        >
          Mark this day complete
        </button>
      </Section>
    </div>
  );
}
