import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

const day0HeroImage =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80";

const SectionCard = ({ title, children, tone = "default" }) => {
  const tones = {
    default: { background: "#ffffff", border: "#e5e7eb" },
    blue: { background: "#eff6ff", border: "#bfdbfe" },
    green: { background: "#f0fdf4", border: "#bbf7d0" },
    amber: { background: "#fffbeb", border: "#fde68a" },
  };
  const selected = tones[tone] || tones.default;
  return (
    <section
      style={{
        ...styles.card,
        display: "grid",
        gap: 10,
        background: selected.background,
        border: `1px solid ${selected.border}`,
      }}
    >
      <h2 style={{ margin: 0 }}>{title}</h2>
      {children}
    </section>
  );
};

const workflowTabs = [
  {
    name: "Learn",
    description: "Understand the topic, objectives, grammar focus and useful expressions before practising.",
  },
  {
    name: "Speak",
    description: "Give a structured answer with a position, reasoning, examples, nuance and a clear conclusion.",
  },
  {
    name: "Write",
    description: "Build and improve your text. Use Analyse My Text before Day 20 and Mark My Letter from Day 20.",
  },
  {
    name: "Finish",
    description: "Complete reading, listening, vocabulary and the lesson-completion check.",
  },
  {
    name: "Ref",
    description: "Save advanced connectors, structures, examples and reusable C1 expressions.",
  },
];

const questions = [
  {
    question: "Where should you begin each C1 study day?",
    options: ["Course Book", "Old Submit Assignment page", "Only the Results page", "A random link"],
    answer: "A",
    explanation: "The Course Book is the main path and connects the day to the correct lesson tools.",
  },
  {
    question: "What happens when a Falowen Radio episode is available?",
    options: ["It appears before the workbook", "It replaces the whole course", "It appears only after marking", "It opens the payment page"],
    answer: "A",
    explanation: "Radio is now part of the workbook flow and comes before selected workbook activities.",
  },
  {
    question: "What is the correct C1 self-learning tab flow?",
    options: ["Learn → Speak → Write → Finish → Ref", "Submit → Pay → Logout", "Only Write", "Results → Attendance → Submit"],
    answer: "A",
    explanation: "The five tabs organise understanding, speaking, writing, completion and reusable references.",
  },
  {
    question: "Which writing tool is used before Day 20?",
    options: ["Analyse My Text", "Tutor upload", "Payment history", "Attendance"],
    answer: "A",
    explanation: "Before Day 20, Analyse My Text supports focused sections and gradual C1 development.",
  },
  {
    question: "What changes from Day 20?",
    options: ["Use Mark My Letter for complete texts", "Stop writing", "Remove Ref", "Submit every lesson to a tutor"],
    answer: "A",
    explanation: "From Day 20, students work with complete exam-style texts and Mark My Letter.",
  },
  {
    question: "Does normal C1 self-learning use a tutor Submit tab?",
    options: ["No", "Yes, after every task", "Only for Radio", "Only before Day 1"],
    answer: "A",
    explanation: "C1 uses self-learning completion, confidence tracking and AI-supported correction rather than normal tutor uploads.",
  },
  {
    question: "When should you mark a C1 lesson complete?",
    options: ["After completing and understanding the main work", "Before opening it", "Without practising", "Only because the button is visible"],
    answer: "A",
    explanation: "Completion should reflect genuine practice and understanding.",
  },
  {
    question: "What is the purpose of Ref?",
    options: ["Save reusable C1 language and structures", "Make payments", "Join a tutor class", "Delete feedback"],
    answer: "A",
    explanation: "Ref is your personal bank of advanced expressions, connectors and structure models.",
  },
];

const getResultMessage = (score, total) => {
  const percent = Math.round((score / total) * 100);
  if (percent >= 80) return `Great start. You scored ${percent}% and understand the new C1 workflow.`;
  if (percent >= 50) return `Good attempt. You scored ${percent}%. Review the workflow once more before Day 1.`;
  return `You scored ${percent}%. Read the Day 0 guide again before starting Day 1.`;
};

const QuestionCard = ({ item, index, selected, onSelect }) => (
  <li style={{ display: "grid", gap: 8 }}>
    <p style={{ margin: 0, fontWeight: 700 }}>
      {index + 1}. {item.question}
    </p>
    <div style={{ display: "grid", gap: 6 }}>
      {item.options.map((option, optionIndex) => {
        const letter = ["A", "B", "C", "D"][optionIndex];
        const isCorrect = selected && letter === item.answer;
        const isWrong = selected === letter && letter !== item.answer;
        return (
          <button
            key={letter}
            type="button"
            onClick={() => onSelect(index, letter)}
            style={{
              ...styles.secondaryButton,
              textAlign: "left",
              borderColor: isCorrect ? "#16a34a" : isWrong ? "#dc2626" : undefined,
              background: isCorrect ? "#dcfce7" : isWrong ? "#fee2e2" : undefined,
            }}
          >
            {letter}) {option}
          </button>
        );
      })}
    </div>
    {selected ? (
      <p style={{ margin: 0, fontSize: 14 }}>
        <strong>{selected === item.answer ? "Correct." : "Not correct."}</strong> Answer: {item.answer}. {item.explanation}
      </p>
    ) : null}
  </li>
);

const C1Day0ProgressionWorkbookPage = () => {
  const [answers, setAnswers] = useState({});
  const handleSelect = (questionIndex, letter) => {
    setAnswers((previous) => ({ ...previous, [questionIndex]: letter }));
  };

  const answeredCount = Object.keys(answers).length;
  const score = questions.reduce((total, item, index) => total + (answers[index] === item.answer ? 1 : 0), 0);
  const allAnswered = answeredCount === questions.length;

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <span style={styles.levelPill}>C1 Self-learning · Day 0</span>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>C1 Day 0: New Falowen Learning Structure</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Start here before Day 1. Learn how the Course Book, Falowen Radio, Learn, Speak, Write, Finish and Ref work together.
        </p>
        <img
          src={day0HeroImage}
          alt="C1 Day 0 learning workflow"
          style={{ width: "100%", maxHeight: 240, objectFit: "cover", borderRadius: 12 }}
        />
      </div>

      <SectionCard title="1. Start from the Course Book" tone="blue">
        <p style={{ margin: 0, lineHeight: 1.65 }}>
          The Course Book is your main route. Open the correct day, read its goal and instruction, then follow the linked learning tools in order.
          When Falowen Radio is available, listen before continuing to the workbook.
        </p>
        <p style={{ margin: 0, fontWeight: 800 }}>
          Course Book → Radio when available → Learn → Speak → Write → Finish → Ref
        </p>
      </SectionCard>

      <SectionCard title="2. Use the five C1 tabs" tone="green">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
          {workflowTabs.map((tab, index) => (
            <article key={tab.name} style={{ border: "1px solid #d1fae5", borderRadius: 12, padding: 12, background: "#ffffff" }}>
              <strong>{index + 1}. {tab.name}</strong>
              <p style={{ margin: "5px 0 0", color: "#475569", lineHeight: 1.5 }}>{tab.description}</p>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="3. C1 writing progression" tone="amber">
        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6, lineHeight: 1.65 }}>
          <li><strong>Before Day 20:</strong> write focused sections and use Analyse My Text for C1-level feedback.</li>
          <li><strong>From Day 20:</strong> write complete exam-style texts and use Mark My Letter.</li>
          <li>Use <strong>Ref</strong> to save advanced connectors, argument structures and model phrases.</li>
          <li>Correct your own work after feedback. Do not copy the improved version blindly.</li>
        </ul>
      </SectionCard>

      <SectionCard title="4. Completion and progress">
        <p style={{ margin: 0, lineHeight: 1.65 }}>
          Normal C1 lessons are self-learning. There is no tutor Submit tab or old Submit Assignment page for the daily workflow.
          Complete the main activities, choose your confidence level honestly and mark the lesson complete. Use Study Buddy, the Study calendar and Exams room when needed.
        </p>
      </SectionCard>

      <SectionCard title="5. Day 0 knowledge test">
        <p style={{ margin: 0 }}>Answered: {answeredCount}/{questions.length}</p>
        <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 18 }}>
          {questions.map((item, index) => (
            <QuestionCard
              key={item.question}
              item={item}
              index={index}
              selected={answers[index]}
              onSelect={handleSelect}
            />
          ))}
        </ol>
        {allAnswered ? (
          <div style={{ ...styles.successBox, marginTop: 8 }}>
            <strong>{getResultMessage(score, questions.length)}</strong>
            <p style={{ margin: "6px 0 0" }}>Score: {score}/{questions.length}</p>
          </div>
        ) : null}
      </SectionCard>
    </div>
  );
};

export default C1Day0ProgressionWorkbookPage;
