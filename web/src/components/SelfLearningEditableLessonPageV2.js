import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import { EmbeddedSpeechPracticePanel, EmbeddedWritingPracticePanel } from "./selfLearning/EmbeddedPracticePanels";

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

const heroShellStyle = {
  borderRadius: 22,
  overflow: "hidden",
  border: "1px solid rgba(148, 163, 184, 0.28)",
  boxShadow: "0 20px 52px rgba(15, 23, 42, 0.18)",
  background: "#0f172a",
};

const heroContentStyle = (imageUrl) => ({
  minHeight: 340,
  backgroundImage: `linear-gradient(135deg, rgba(2, 6, 23, 0.94) 0%, rgba(15, 23, 42, 0.82) 44%, rgba(30, 64, 175, 0.32) 100%), url(${imageUrl})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  color: "#fff",
  padding: "clamp(20px, 3.5vw, 40px)",
  display: "grid",
  alignContent: "space-between",
  gap: 24,
  position: "relative",
});

const heroBadgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "7px 12px",
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
      border: "1px solid rgba(255,255,255,0.2)",
      background: "rgba(255,255,255,0.94)",
      borderRadius: 16,
      padding: "14px 16px",
      display: "grid",
      gap: 7,
      minHeight: 78,
      color: "#0f172a",
      boxShadow: "0 14px 28px rgba(2, 6, 23, 0.16)",
      backdropFilter: "blur(16px)",
    }}
  >
    <span style={{ fontSize: 11, color: "#475569", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</span>
    <strong style={{ fontSize: 16, color: "#0f172a", lineHeight: 1.35 }}>{value}</strong>
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

const buildInitialProgress = () => ({
  understood: false,
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

  const isOrientationDay = Number(lesson.day) === 0;
  const writingType = inferWritingType(lesson);
  const speakingTopic = lesson.speakingTopic || lesson.tasks?.speaking || `Sprich über: ${lesson.topic}`;
  const writingTask = lesson.writingTopic || lesson.tasks?.writing || `Schreibe einen ${lesson.level}-Text zum Thema: ${lesson.topic}. Begründe deine Meinung und nutze passende Redemittel.`;
  const heroImage = lesson.heroImage || DEFAULT_HERO_IMAGE;

  const orientationCards = isOrientationDay
    ? [
        { label: "Page type", value: "Orientation only" },
        { label: "Writing focus", value: writingType },
        { label: "Progress", value: progress.completed ? "Completed" : "Read first" },
      ]
    : [
        { label: "Speaking task", value: lesson.speakingTaskType || "Guided talk" },
        { label: "Writing support", value: "Task · Mark · Ref · Ideas" },
        { label: "Progress", value: progress.completed ? "Completed" : "In progress" },
      ];

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
            {progress.completed ? <span style={{ ...heroBadgeStyle, background: "rgba(22, 163, 74, 0.88)", borderColor: "rgba(187, 247, 208, 0.55)" }}>Complete</span> : null}
          </div>

          <div style={{ display: "grid", gap: 18 }}>
            <div style={{ display: "grid", gap: 10, maxWidth: 980 }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(1.95rem, 4.8vw, 3.9rem)",
                  lineHeight: 1.02,
                  letterSpacing: "-0.05em",
                  textWrap: "balance",
                  textShadow: "0 10px 28px rgba(0,0,0,0.32)",
                }}
              >
                {lesson.title}
              </h1>
              <p style={{ margin: 0, maxWidth: 980, fontSize: "clamp(0.98rem, 1.45vw, 1.16rem)", lineHeight: 1.6, color: "#e2e8f0", textShadow: "0 6px 18px rgba(0,0,0,0.26)" }}>
                {lesson.topic}
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 12 }}>
              {orientationCards.map((item) => <StatCard key={item.label} label={item.label} value={item.value} />)}
            </div>
          </div>
        </div>
      </header>

      {isOrientationDay ? (
        <>
          <Section title="Day 0 Orientation">
            <NoteBox>
              <strong>Start here.</strong> Day 0 is only for orientation. There are no Learn, Speak, Write or Finish tabs on this page.
            </NoteBox>
            {renderList(lesson.objectives || [])}
            {(lesson.explanation || []).map((paragraph) => <p key={paragraph} style={{ margin: 0, lineHeight: 1.7 }}>{paragraph}</p>)}
          </Section>

          <Section title="How this course works">
            {lesson.grammarFocus ? <NoteBox><strong>Focus:</strong> {lesson.grammarFocus}</NoteBox> : null}
            {lesson.topicQuestions?.length ? <PracticeBox title="Questions to understand before Day 1">{renderList(lesson.topicQuestions)}</PracticeBox> : null}
            {lesson.grammarLesson?.rules?.length ? <PracticeBox title="Orientation rules">{renderList(lesson.grammarLesson.rules)}</PracticeBox> : null}
            {lesson.grammarLesson?.examples?.length ? <PracticeBox title="Model language">{renderList(lesson.grammarLesson.examples)}</PracticeBox> : null}
          </Section>

          <Section title="Writing focus for this level">
            <PracticeBox title="Writing task">
              <span style={{ ...styles.badge, justifySelf: "start" }}>{writingType}</span>
              <p style={{ margin: 0, lineHeight: 1.7 }}>{writingTask}</p>
            </PracticeBox>
            {lesson.writingBuilder?.structure?.length ? <PracticeBox title="Structure">{renderList(lesson.writingBuilder.structure)}</PracticeBox> : null}
            {lesson.writingBuilder?.usefulLines?.length ? <PracticeBox title="Useful lines">{renderList(lesson.writingBuilder.usefulLines)}</PracticeBox> : null}
            {lesson.grammarLesson?.miniExercise ? <PracticeBox title="Mini exercise"><p style={{ margin: 0, lineHeight: 1.7 }}>{lesson.grammarLesson.miniExercise}</p></PracticeBox> : null}
          </Section>

          <Section title="Next step">
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              After reading this orientation, go back to the Course Book and start Day 1. Use the normal lesson tabs from Day 1 onward.
            </p>
            <button type="button" style={styles.primaryButton} onClick={() => updateProgress({ completed: true })}>
              Mark orientation complete
            </button>
          </Section>
        </>
      ) : (
        <>
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
                  <input type="checkbox" checked={Boolean(progress.understood)} onChange={(event) => updateProgress({ understood: event.target.checked })} />
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
              <EmbeddedSpeechPracticePanel />
            </Section>
          ) : null}

          {activeTab === "write" ? (
            <Section title="Writing support">
              <PracticeBox title="Writing task">
                <span style={{ ...styles.badge, justifySelf: "start" }}>{writingType}</span>
                <p style={{ margin: 0, lineHeight: 1.7 }}>{writingTask}</p>
              </PracticeBox>
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

              <Section title="Complete lesson">
                <p style={{ margin: 0, lineHeight: 1.7 }}>
                  When you finish the practice, mark the lesson complete and continue with the next day from the Course Book.
                </p>
                <button type="button" style={styles.primaryButton} onClick={() => updateProgress({ completed: true })}>
                  Mark lesson complete
                </button>
              </Section>
            </>
          ) : null}
        </>
      )}
    </div>
  );
}
