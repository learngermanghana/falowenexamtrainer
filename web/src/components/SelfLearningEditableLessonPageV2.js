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

const KnowledgeTest = ({ items = [], answers = {}, onAnswer }) => {
  if (!items.length) return null;
  const answered = items.filter((_, index) => answers[index]).length;
  const correct = items.filter((item, index) => answers[index] && answers[index] === item.answer).length;

  return (
    <div style={{ border: "1px solid #c7d2fe", borderRadius: 16, padding: 14, background: "#f8fafc", display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <strong>Knowledge test</strong>
        <span style={{ ...styles.badge, background: "#eef2ff", color: "#3730a3" }}>{correct}/{items.length} correct</span>
      </div>
      <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
        Click the best answer. You will see immediately whether it is correct.
      </p>
      {items.map((item, index) => {
        const selected = answers[index] || "";
        const isAnswered = Boolean(selected);
        const isCorrect = selected === item.answer;
        return (
          <div key={item.question} style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 12, background: "#ffffff", display: "grid", gap: 10 }}>
            <strong>{index + 1}. {item.question}</strong>
            <div style={{ display: "grid", gap: 8 }}>
              {(item.options || []).map((option) => {
                const isSelected = selected === option;
                const isRightOption = item.answer === option;
                const background = isSelected ? (isCorrect ? "#dcfce7" : "#fee2e2") : isAnswered && isRightOption ? "#f0fdf4" : "#ffffff";
                const borderColor = isSelected ? (isCorrect ? "#22c55e" : "#ef4444") : isAnswered && isRightOption ? "#86efac" : "#e5e7eb";
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => onAnswer(index, option)}
                    style={{
                      textAlign: "left",
                      padding: "10px 12px",
                      borderRadius: 12,
                      border: `1px solid ${borderColor}`,
                      background,
                      cursor: "pointer",
                      fontWeight: isSelected ? 800 : 600,
                    }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            {isAnswered ? (
              <div style={{ border: `1px solid ${isCorrect ? "#86efac" : "#fecaca"}`, borderRadius: 12, padding: 10, background: isCorrect ? "#f0fdf4" : "#fef2f2", lineHeight: 1.6 }}>
                <strong>{isCorrect ? "Correct." : "Not correct yet."}</strong> {item.explanation}
              </div>
            ) : null}
          </div>
        );
      })}
      {answered === items.length ? (
        <div style={{ border: "1px solid #bbf7d0", borderRadius: 12, padding: 10, background: "#f0fdf4" }}>
          Finished: {correct}/{items.length}. Review any red answers before you continue.
        </div>
      ) : null}
    </div>
  );
};

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

const renderParagraphs = (items = []) => {
  if (!items.length) return null;
  return items.map((item) => <p key={item} style={{ margin: 0, lineHeight: 1.7 }}>{item}</p>);
};

const splitIntoSentences = (text = "") => {
  const matches = String(text || "").match(/[^.!?]+[.!?]?/g) || [];
  return matches.map((sentence) => sentence.trim()).filter(Boolean);
};

const parseWritingTask = (taskText = "", builderStructure = []) => {
  const cleaned = String(taskText || "").replace(/^Schreiben:\s*/i, "").trim();
  const marker = cleaned.match(/bearbeiten Sie alle Punkte:\s*/i);

  if (marker) {
    const before = cleaned.slice(0, marker.index).trim();
    const after = cleaned.slice(marker.index + marker[0].length).trim();
    const beforeSentences = splitIntoSentences(before);
    const points = splitIntoSentences(after);
    return {
      context: beforeSentences.slice(0, -1).join(" ") || "Schreibaufgabe",
      prompt: beforeSentences.slice(-1)[0] || before || "Schreibaufgabe",
      points,
    };
  }

  const sentences = splitIntoSentences(cleaned);
  const directiveIndex = sentences.findIndex((sentence, index) => index > 0 && /^(Äußern|Nennen|Beschreiben|Machen|Zeigen|Bitten|Erklären|Argumentieren|Erläutern|Fragen|Schildern) Sie\b/i.test(sentence));

  if (directiveIndex > 0) {
    const beforeSentences = sentences.slice(0, directiveIndex);
    return {
      context: beforeSentences.slice(0, -1).join(" ") || "Schreibaufgabe",
      prompt: beforeSentences.slice(-1)[0] || beforeSentences.join(" "),
      points: sentences.slice(directiveIndex),
    };
  }

  const structurePoints = (builderStructure || [])
    .filter((item) => /^(Erklären|Argumentieren|Nennen|Erläutern|Äußern|Beschreiben|Machen|Zeigen|Bitten) Sie/i.test(item))
    .map((item) => item.replace(/^[^:]+:\s*/, ""));

  return {
    context: "Schreibaufgabe",
    prompt: cleaned,
    points: structurePoints,
  };
};

const WritingTaskCard = ({ writingType, writingTask, structure }) => {
  const formattedTask = parseWritingTask(writingTask, structure);

  return (
    <div style={{ border: "1px solid #d1d5db", borderRadius: 16, background: "#fff", overflow: "hidden", display: "grid" }}>
      <div style={{ padding: "14px 16px", borderBottom: "1px solid #e5e7eb", background: "#f8fafc", display: "flex", gap: 10, justifyContent: "space-between", flexWrap: "wrap", alignItems: "center" }}>
        <strong>Schreiben Aufgabe</strong>
        <span style={{ ...styles.badge, background: "#eef2ff", color: "#3730a3" }}>{writingType}</span>
      </div>

      <div style={{ padding: "18px 18px 12px", display: "grid", gap: 14 }}>
        {formattedTask.context ? <p style={{ margin: 0, color: "#475569", lineHeight: 1.7 }}>{formattedTask.context}</p> : null}
        <div style={{ border: "1px solid #111827", padding: "18px 20px", borderRadius: 4, background: "#ffffff", fontSize: "1.05rem", lineHeight: 1.65 }}>
          {formattedTask.prompt}
        </div>
        {formattedTask.points?.length ? (
          <div style={{ display: "grid", gap: 10 }}>
            <strong>Bearbeiten Sie diese Punkte:</strong>
            <ul style={{ margin: 0, paddingLeft: 24, lineHeight: 1.8 }}>
              {formattedTask.points.map((point) => <li key={point}>{point}</li>)}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
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
  grammarQuizAnswers: {},
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
  const updateGrammarQuizAnswer = (questionIndex, option) => {
    updateProgress({
      grammarQuizAnswers: {
        ...(progress.grammarQuizAnswers || {}),
        [questionIndex]: option,
      },
    });
  };

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
            <WritingTaskCard writingType={writingType} writingTask={writingTask} structure={lesson.writingBuilder?.structure} />
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
              <Section title="Lesson overview">
                <NoteBox>
                  <strong>Learn first.</strong> This tab is only for the topic overview, lesson goals and thinking questions. Use the Speak tab for Sprechen practice and the Write tab for the writing task.
                </NoteBox>
                {renderList(lesson.objectives || [])}
                {(lesson.explanation || []).map((paragraph) => <p key={paragraph} style={{ margin: 0, lineHeight: 1.7 }}>{paragraph}</p>)}
                {lesson.topicQuestions?.length ? <PracticeBox title="Think before you practise">{renderList(lesson.topicQuestions)}</PracticeBox> : null}
              </Section>

              <Section title="Grammar and useful language">
                {lesson.grammarFocus ? <NoteBox><strong>Focus:</strong> {lesson.grammarFocus}</NoteBox> : null}
                {lesson.grammarLesson?.title ? <PracticeBox title="Grammar topic"><strong>{lesson.grammarLesson.title}</strong></PracticeBox> : null}
                {lesson.grammarLesson?.explanation?.length ? <PracticeBox title="How to use it">{renderParagraphs(lesson.grammarLesson.explanation)}</PracticeBox> : null}
                {lesson.grammarLesson?.rules?.length ? <PracticeBox title="Rules">{renderList(lesson.grammarLesson.rules)}</PracticeBox> : null}
                {lesson.grammarLesson?.examples?.length ? <PracticeBox title="Examples">{renderList(lesson.grammarLesson.examples)}</PracticeBox> : null}
                {lesson.grammarLesson?.miniExercise ? <PracticeBox title="Mini exercise"><p style={{ margin: 0, lineHeight: 1.7 }}>{lesson.grammarLesson.miniExercise}</p></PracticeBox> : null}
                <KnowledgeTest
                  items={lesson.grammarLesson?.knowledgeTest || []}
                  answers={progress.grammarQuizAnswers || {}}
                  onAnswer={updateGrammarQuizAnswer}
                />
                {lesson.phrases?.length ? <PracticeBox title="Useful phrases">{renderList(lesson.phrases)}</PracticeBox> : null}
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input type="checkbox" checked={Boolean(progress.understood)} onChange={(event) => updateProgress({ understood: event.target.checked })} />
                  <span style={styles.label}>I understand the overview and grammar focus.</span>
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
              <WritingTaskCard writingType={writingType} writingTask={writingTask} structure={lesson.writingBuilder?.structure} />
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
