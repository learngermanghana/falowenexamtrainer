import React, { useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

const listStyle = {
  margin: 0,
  paddingLeft: 22,
  display: "grid",
  gap: 8,
  lineHeight: 1.65,
};

const SectionCard = ({ title, children }) => (
  <section style={{ ...styles.card, display: "grid", gap: 12 }}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const NoteBox = ({ children, tone = "blue" }) => {
  const tones = {
    blue: { background: "#eff6ff", border: "#bfdbfe", color: "#1e3a8a" },
    green: { background: "#f0fdf4", border: "#bbf7d0", color: "#166534" },
    amber: { background: "#fffbeb", border: "#fde68a", color: "#92400e" },
  };
  const selected = tones[tone] || tones.blue;

  return (
    <div
      style={{
        border: `1px solid ${selected.border}`,
        background: selected.background,
        color: selected.color,
        borderRadius: 12,
        padding: 14,
        lineHeight: 1.65,
      }}
    >
      {children}
    </div>
  );
};

const GuideCard = ({ title, children }) => (
  <div
    style={{
      border: "1px solid #e2e8f0",
      borderRadius: 12,
      padding: 14,
      background: "#ffffff",
      display: "grid",
      gap: 5,
    }}
  >
    <strong style={{ color: "#0f172a" }}>{title}</strong>
    <span style={{ color: "#475569", lineHeight: 1.6 }}>{children}</span>
  </div>
);

const questions = [
  {
    question: "Where should you normally begin a B2 study session?",
    options: ["Course Book", "Exams Room", "Account"],
    answer: 0,
    explanation: "The Course Book is the main path for your normal B2 learning journey.",
  },
  {
    question: "What is the normal B2 lesson flow?",
    options: [
      "Course Book → Radio → Learn → Speak → Write → Finish",
      "Results → Account → Finish",
      "Exams Room → Submit assignment → Attendance",
    ],
    answer: 0,
    explanation: "B2 is organised as a self-learning sequence from understanding to active production and completion.",
  },
  {
    question: "What should you do in Learn?",
    options: [
      "Understand the topic, language and grammar before producing your own response",
      "Skip directly to Finish",
      "Only record a confidence score",
    ],
    answer: 0,
    explanation: "Learn gives you the knowledge and language support needed for the active tasks.",
  },
  {
    question: "What is the purpose of Speak?",
    options: [
      "Produce your own spoken German and improve clarity, structure and fluency",
      "Read the model answer silently",
      "Replace the Write task",
    ],
    answer: 0,
    explanation: "B2 requires active spoken production, not only passive understanding.",
  },
  {
    question: "What should happen in Write?",
    options: [
      "Develop and revise your own written response using the task guidance and feedback",
      "Copy the reference text",
      "Write only isolated vocabulary",
    ],
    answer: 0,
    explanation: "The writing stage develops independent B2 expression and correction skills.",
  },
  {
    question: "When should you use Finish?",
    options: [
      "After doing the required Learn, Speak and Write work for the lesson",
      "Before opening the lesson",
      "Instead of the other sections",
    ],
    answer: 0,
    explanation: "Finish closes the lesson after the important learning and production work is complete.",
  },
  {
    question: "What does confidence mean in B2 self-learning?",
    options: [
      "An honest reflection of how securely you can use the skill after practice",
      "A tutor-marked exam score",
      "A way to skip difficult tasks",
    ],
    answer: 0,
    explanation: "Confidence is a self-assessment. Record it honestly after real practice.",
  },
  {
    question: "Where should you go for separate exam-style practice?",
    options: ["Exams Room", "Course Book Submit", "Account"],
    answer: 0,
    explanation: "The Exams Room is for exam practice; the Course Book remains your daily B2 learning path.",
  },
  {
    question: "What should you do after Falowen AI gives feedback?",
    options: [
      "Understand the feedback, revise your own response and try again",
      "Copy the AI response without checking it",
      "Mark the lesson complete immediately",
    ],
    answer: 0,
    explanation: "Feedback should lead to active correction and stronger independent language.",
  },
  {
    question: "Choose the correct sentence with obwohl.",
    options: [
      "Obwohl die Aufgabe schwierig war, habe ich sie beendet.",
      "Obwohl war die Aufgabe schwierig, habe ich sie beendet.",
      "Obwohl die Aufgabe schwierig war, ich habe sie beendet.",
    ],
    answer: 0,
    explanation: "The subordinate-clause verb comes last, and the following main clause begins with the verb.",
  },
  {
    question: "Choose the correct passive sentence.",
    options: [
      "Die Ergebnisse werden morgen veröffentlicht.",
      "Die Ergebnisse werden morgen veröffentlichen.",
      "Die Ergebnisse morgen veröffentlicht werden.",
    ],
    answer: 0,
    explanation: "The present passive uses werden plus the past participle.",
  },
  {
    question: "Which response best matches B2 communication?",
    options: [
      "Meiner Ansicht nach bietet die Maßnahme Vorteile, allerdings sollte auch berücksichtigt werden, dass sie zusätzliche Kosten verursacht.",
      "Die Maßnahme ist gut.",
      "Vorteile. Kosten. Ich denke gut.",
    ],
    answer: 0,
    explanation: "B2 communication develops a position, adds qualification and connects ideas clearly.",
  },
];

const QuestionCard = ({ item, index, selected, onSelect }) => (
  <li style={{ display: "grid", gap: 8 }}>
    <p style={{ margin: 0, fontWeight: 700 }}>
      {index + 1}. {item.question}
    </p>
    <div style={{ display: "grid", gap: 6 }}>
      {item.options.map((option, optionIndex) => {
        const isCorrect = selected !== undefined && optionIndex === item.answer;
        const isWrong = selected === optionIndex && optionIndex !== item.answer;
        return (
          <button
            key={`${item.question}-${option}`}
            type="button"
            onClick={() => onSelect(index, optionIndex)}
            style={{
              ...styles.secondaryButton,
              textAlign: "left",
              justifyContent: "flex-start",
              borderColor: isCorrect ? "#16a34a" : isWrong ? "#dc2626" : undefined,
              background: isCorrect ? "#dcfce7" : isWrong ? "#fee2e2" : undefined,
            }}
          >
            {String.fromCharCode(65 + optionIndex)}) {option}
          </button>
        );
      })}
    </div>
    {selected !== undefined ? (
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55 }}>
        <strong>{selected === item.answer ? "Correct." : "Not correct."}</strong>{" "}
        Correct answer: {String.fromCharCode(65 + item.answer)}. {item.explanation}
      </p>
    ) : null}
  </li>
);

export default function B2Day0SelfLearningOrientationWorkbookPage() {
  const [answers, setAnswers] = useState({});
  const answeredCount = Object.keys(answers).length;
  const testComplete = answeredCount === questions.length;
  const score = useMemo(
    () => questions.reduce((total, question, index) => total + (answers[index] === question.answer ? 1 : 0), 0),
    [answers],
  );
  const percent = testComplete ? Math.round((score / questions.length) * 100) : 0;
  const ready = testComplete && percent >= 70;

  return (
    <div data-b2-day0-orientation="true" style={{ ...styles.container, display: "grid", gap: 16 }}>
      <section style={{ ...styles.card, display: "grid", gap: 8 }}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <h1 style={{ ...styles.title, marginBottom: 0 }}>B2 Day 0: How to use Falowen</h1>
        <p style={{ ...styles.subtitle, margin: 0, lineHeight: 1.65 }}>
          Start here before Day 1. B2 is an independent self-learning course, so Day 0 explains exactly how
          to move through Learn, Speak, Write and Finish, how progress and confidence work, and how the Course
          Book differs from the Exams Room.
        </p>
      </section>

      <SectionCard title="Welcome to B2 self-learning">
        <NoteBox tone="green">
          <strong>B2 is about independent communication and analysis.</strong> You are expected to understand
          more complex ideas, explain your position, compare perspectives and improve your own language after feedback.
        </NoteBox>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Day 0 is an orientation and B1 readiness check. It is not a normal tutor-marked assignment. Your B2
          progress comes from completing the learning journey inside each lesson rather than waiting for a live class
          or using a separate submission page.
        </p>
      </SectionCard>

      <SectionCard title="1. Your B2 Course Book">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          The <strong>Course Book</strong> is your main B2 learning area. It keeps the 28-day journey in order,
          shows the B2.1 and B2.2 learning phases, weekly outcomes and the lesson Falowen expects you to continue next.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
          <GuideCard title="All lessons">Review any B2 lesson or see what is ahead.</GuideCard>
          <GuideCard title="Next lesson">Focus on the next lesson in your learning journey.</GuideCard>
          <GuideCard title="Weekly outcome">See what you should be able to do by the end of that week.</GuideCard>
          <GuideCard title="Course progress">Track completed B2 learning in the Course Book.</GuideCard>
        </div>
        <a href="/campus/course" style={{ ...styles.primaryButton, textDecoration: "none", width: "fit-content" }}>
          Open B2 Course Book
        </a>
      </SectionCard>

      <SectionCard title="2. The B2 lesson flow">
        <NoteBox>
          <strong>Course Book → Falowen Radio → Learn → Speak → Write → Finish</strong>
        </NoteBox>
        <ol style={listStyle}>
          <li><strong>Falowen Radio:</strong> listen first when it is available. It introduces the topic and useful language in context.</li>
          <li><strong>Learn:</strong> understand the topic, grammar, vocabulary, examples and reasoning before producing your own answer.</li>
          <li><strong>Speak:</strong> explain ideas aloud, respond to prompts and work on clarity, structure and fluency.</li>
          <li><strong>Write:</strong> develop your own response, use the guidance, then revise it after feedback.</li>
          <li><strong>Finish:</strong> complete the remaining lesson work and close the lesson only after the required learning has been done.</li>
        </ol>
        <NoteBox tone="amber">
          <strong>Do not rush to Finish.</strong> B2 progress should represent real learning. Learn, Speak and Write
          are the core work that develops the skill; Finish records the end of that learning cycle.
        </NoteBox>
      </SectionCard>

      <SectionCard title="3. Grammar notes, Ref and learning support">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          B2 lessons may include grammar notes, examples, reference material, model structures or other support.
          Use these resources to understand patterns and improve your own production. They support the task; they do
          not replace the Speak or Write work.
        </p>
        <NoteBox>
          <strong>A useful B2 routine:</strong> understand the rule → study an example → produce your own sentence →
          use it in a longer response → correct it after feedback.
        </NoteBox>
      </SectionCard>

      <SectionCard title="4. Confidence and lesson completion">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Confidence is an honest self-assessment, not a tutor score. Record high confidence only when you can use the
          main skill with reasonable independence after completing the practice.
        </p>
        <ul style={listStyle}>
          <li><strong>Low confidence:</strong> you still need substantial support or do not understand the skill securely.</li>
          <li><strong>Developing confidence:</strong> you can use the skill but still need examples, prompts or correction.</li>
          <li><strong>Strong confidence:</strong> you can use the skill independently and explain or correct your choices.</li>
        </ul>
        <NoteBox tone="green">
          Completing a page is not the same as mastering it. Honest confidence helps you identify what to revisit before moving further into B2.
        </NoteBox>
      </SectionCard>

      <SectionCard title="5. Results, feedback and correction">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          When Falowen gives you feedback, use it as part of the learning cycle. Read what needs improvement, compare it
          with your own answer, correct the weak part and try again. The purpose is to become less dependent on support over time.
        </p>
        <NoteBox>
          <strong>Think → produce → receive feedback → understand the correction → revise your own answer.</strong>
        </NoteBox>
        <a href="/campus/results" style={{ ...styles.secondaryButton, textDecoration: "none", width: "fit-content" }}>
          Open Results
        </a>
      </SectionCard>

      <SectionCard title="6. Course Book and Exams Room are different">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
          <GuideCard title="Course Book">
            Your normal B2 learning journey. Use it to build language, speaking, writing, grammar, comprehension and independence day by day.
          </GuideCard>
          <GuideCard title="Exams Room">
            Separate exam-style practice for speaking, writing, reading and listening. Use it to practise exam format and readiness; it does not replace the Course Book.
          </GuideCard>
          <GuideCard title="Exam File">
            Your exam-related information and preparation record. It is different from the Exams Room where you actively practise tasks.
          </GuideCard>
          <GuideCard title="Account">
            Manage your profile, notifications and account settings.
          </GuideCard>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a href="/campus/course" style={{ ...styles.primaryButton, textDecoration: "none" }}>Open Course Book</a>
          <a href="/exams/question" style={{ ...styles.secondaryButton, textDecoration: "none" }}>Open Exams Room</a>
          <a href="/campus/account" style={{ ...styles.secondaryButton, textDecoration: "none" }}>Open Account</a>
        </div>
      </SectionCard>

      <SectionCard title="7. Using Falowen AI at B2">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Use Falowen AI to clarify grammar, test an argument, practise speaking, identify weaknesses and improve a draft.
          Do not copy a finished answer and treat that as learning. B2 requires you to make language and reasoning choices yourself.
        </p>
        <NoteBox tone="amber">
          <strong>Good use:</strong> ask → understand → practise → write or speak yourself → compare → improve.
        </NoteBox>
      </SectionCard>

      <SectionCard title="8. Your simple B2 study routine">
        <NoteBox tone="green">
          <strong>Open Course Book → check the weekly outcome → Continue learning → listen to Radio when available → Learn → Speak → Write → correct feedback → Finish → record confidence honestly.</strong>
        </NoteBox>
      </SectionCard>

      <SectionCard title="B2 Day 0 orientation + B1 readiness check">
        <p style={{ margin: 0, lineHeight: 1.65 }}>
          This check confirms that you understand the B2 self-learning workflow and important B1 language patterns.
          Answer every question and review every correction. A score of <strong>70% or higher</strong> shows good readiness for B2 Day 1.
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <strong>Progress: {answeredCount}/{questions.length}</strong>
          {testComplete ? (
            <strong style={{ color: ready ? "#166534" : "#92400e" }}>
              Score: {score}/{questions.length} · {percent}%
            </strong>
          ) : null}
        </div>
        <ol style={{ ...listStyle, gap: 18 }}>
          {questions.map((question, index) => (
            <QuestionCard
              key={question.question}
              item={question}
              index={index}
              selected={answers[index]}
              onSelect={(questionIndex, optionIndex) => setAnswers((old) => ({ ...old, [questionIndex]: optionIndex }))}
            />
          ))}
        </ol>
        {testComplete ? (
          <NoteBox tone={ready ? "green" : "amber"}>
            <strong>{ready ? "Day 0 check complete." : "Revision recommended before Day 1."}</strong>{" "}
            {ready
              ? `You scored ${percent}%. Review any wrong answer, then begin B2 Day 1.`
              : `You scored ${percent}%. Review the corrected B1 topics and the B2 workflow before beginning Day 1.`}
          </NoteBox>
        ) : null}
        <button type="button" style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => setAnswers({})}>
          Restart Day 0 check
        </button>
      </SectionCard>

      <SectionCard title="Finish Day 0">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Day 0 is an orientation and readiness check, not a tutor-marked assignment. Complete all questions, review
          your corrections and continue to B2 Day 1 when you understand how the self-learning journey works.
        </p>
        {testComplete ? (
          <a href="/campus/course/lesson/B2/1" style={{ ...styles.primaryButton, textDecoration: "none", width: "fit-content" }}>
            Continue to B2 Day 1
          </a>
        ) : (
          <NoteBox tone="amber">Complete all {questions.length} questions before moving on.</NoteBox>
        )}
      </SectionCard>
    </div>
  );
}
