import React, { useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

const day0HeroImage =
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80";

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

const TabGuide = ({ title, children }) => (
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
    question: "Where should you normally begin your A1 study day?",
    options: ["Course Book", "Account", "Exams Room"],
    answer: 0,
    explanation: "The Course Book is your main learning path for normal A1 lessons.",
  },
  {
    question: "What does the Continue learning button do?",
    options: [
      "Takes you to the lesson Falowen expects you to work on next",
      "Opens only your Account page",
      "Skips directly to the final exam",
    ],
    answer: 0,
    explanation: "Continue learning helps you return to the next lesson in your Course Book.",
  },
  {
    question: "What should you do when Falowen Radio appears at the start of a lesson?",
    options: [
      "Listen first, then select Continue",
      "Skip straight to submission",
      "Leave the Course Book",
    ],
    answer: 0,
    explanation: "Falowen Radio introduces the topic before the rest of the lesson opens.",
  },
  {
    question: "What should you read before starting the workbook task?",
    options: ["The lesson instruction", "Only the score page", "Only the class list"],
    answer: 0,
    explanation: "The lesson instruction tells you what to watch, study, practise and submit.",
  },
  {
    question: "When should you submit A1 work?",
    options: [
      "When the workbook shows a Submit section or the lesson tells you to submit",
      "Every time you open any lesson",
      "Only through WhatsApp",
    ],
    answer: 0,
    explanation: "Some A1 activities are practice-only. Submit only when the lesson requires it.",
  },
  {
    question: "Which Course Book filter helps you find work that is marked or submitted?",
    options: ["Assignments", "All lessons only", "Account"],
    answer: 0,
    explanation: "The Assignments filter helps you focus on lessons that contain required assignment work.",
  },
  {
    question: "Where should you check scores, corrections and improvement advice?",
    options: ["Results", "Class Members", "Attendance"],
    answer: 0,
    explanation: "Results shows your marked work, scores and tutor feedback.",
  },
  {
    question: "What is the Attendance area for?",
    options: [
      "Checking class attendance and recorded check-ins",
      "Replacing the Course Book",
      "Submitting every workbook",
    ],
    answer: 0,
    explanation: "Attendance lets you review your class attendance and check-in record.",
  },
  {
    question: "What is the Exams Room for?",
    options: [
      "Extra exam-style practice and preparation",
      "Replacing your normal Course Book lessons",
      "Changing your account details",
    ],
    answer: 0,
    explanation: "The Exams Room supports exam preparation. Your Course Book remains your main daily learning area.",
  },
  {
    question: "What is the assignment pass mark on Falowen?",
    options: ["40%", "50%", "60%"],
    answer: 2,
    explanation: "A score of 60% or higher is a pass for an assignment.",
  },
  {
    question: "How should you use Falowen AI?",
    options: [
      "Use it to understand, practise and improve your own work",
      "Copy every answer without reading",
      "Use it instead of the Course Book",
    ],
    answer: 0,
    explanation: "Falowen AI should support your learning, not replace your own thinking and practice.",
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

const A1Day0OrientationKnowledgeTestWorkbookPage = () => {
  const [answers, setAnswers] = useState({});
  const answeredCount = Object.keys(answers).length;
  const testComplete = answeredCount === questions.length;
  const score = useMemo(
    () =>
      questions.reduce(
        (total, question, index) => total + (answers[index] === question.answer ? 1 : 0),
        0
      ),
    [answers]
  );
  const percent = testComplete ? Math.round((score / questions.length) * 100) : 0;
  const ready = testComplete && percent >= 75;

  const answerQuestion = (index, optionIndex) => {
    setAnswers((old) => ({ ...old, [index]: optionIndex }));
  };

  return (
    <div
      data-a1-day0-orientation="true"
      style={{ ...styles.container, display: "grid", gap: 16 }}
    >
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

        <h1 style={{ ...styles.title, marginBottom: 0 }}>A1 Day 0: How to use Falowen</h1>

        <p style={{ ...styles.subtitle, margin: 0, lineHeight: 1.65 }}>
          Start here before Day 1. This orientation explains how your A1 Course Book works, what
          each main area of Falowen is for, how to move through a lesson and where to find help,
          attendance, results and exam practice.
        </p>

        <img
          src={day0HeroImage}
          alt="A1 students beginning their Falowen orientation"
          style={{ width: "100%", maxHeight: 240, objectFit: "cover", borderRadius: 12 }}
        />
      </div>

      <SectionCard title="Welcome to A1">
        <NoteBox tone="green">
          <strong>You are not expected to know German before you begin A1.</strong> Day 0 is here to
          help you understand the platform first, so that from Day 1 you can concentrate on learning.
        </NoteBox>

        <p style={{ margin: 0, lineHeight: 1.7 }}>
          A1 is the foundation of your German journey. You will gradually build basic vocabulary,
          sentence structure, listening, reading, writing and speaking skills. The most important
          habit from the beginning is to follow each lesson in order and complete the work that the
          lesson asks you to do.
        </p>
      </SectionCard>

      <SectionCard title="1. Where your learning starts">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Your main learning area is the <strong>Course Book</strong>. You do not need to search
          around Falowen every day. Open the Course Book and continue from your current lesson.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: 10,
          }}
        >
          <TabGuide title="Orientation — Day 0">
            Learn how Falowen and the A1 course work before beginning normal lessons.
          </TabGuide>
          <TabGuide title="A1.1 – Foundations — Days 1–12">
            Build your first German foundation: basic language, vocabulary, grammar and communication.
          </TabGuide>
          <TabGuide title="A1.2 – Application and Readiness — Days 13–24">
            Combine what you have learned, communicate more independently and prepare for exam practice.
          </TabGuide>
        </div>

        <a href="/campus/course" style={{ ...styles.primaryButton, textDecoration: "none", width: "fit-content" }}>
          Open A1 Course Book
        </a>
      </SectionCard>

      <SectionCard title="2. Understanding the Course Book">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          At the top of the Course Book you will see your lesson progress and a <strong>Continue learning</strong>
          button. Use that button when you want Falowen to take you to the lesson you should work on next.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 10,
          }}
        >
          <TabGuide title="All lessons">
            Shows the complete A1 Course Book so you can review earlier lessons or see what is ahead.
          </TabGuide>
          <TabGuide title="Next lesson">
            Helps you focus on the lesson Falowen currently expects you to continue.
          </TabGuide>
          <TabGuide title="Assignments">
            Shows lessons that contain tutor-marked or required assignment work.
          </TabGuide>
          <TabGuide title="Self-learning">
            Shows practice activities that you complete yourself as part of building your skills.
          </TabGuide>
        </div>

        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Lesson cards can also show statuses such as <strong>Current</strong>, <strong>Tutor-marked</strong>,
          <strong>Self-learning</strong>, <strong>Completed</strong> or <strong>Needs improvement</strong>.
          Use these labels to understand what you have already finished and what still needs attention.
        </p>
      </SectionCard>

      <SectionCard title="3. How to complete an A1 lesson">
        <NoteBox>
          <strong>Your normal lesson flow:</strong> Falowen Radio → Continue → lesson instruction →
          teaching video when available → grammar notes → workbook practice → Submit when required
        </NoteBox>

        <ol style={listStyle}>
          <li>
            <strong>Start with Falowen Radio when it appears.</strong> Listen before selecting Continue.
            The episode introduces the topic and prepares you for the lesson.
          </li>
          <li>
            <strong>Read the lesson instruction.</strong> It tells you what you should watch, read,
            practise and submit for that particular day.
          </li>
          <li>
            <strong>Watch the teaching video when one is provided.</strong> Do not skip directly to
            the workbook if the lesson has an explanation first.
          </li>
          <li>
            <strong>Read the grammar notes carefully.</strong> Say examples aloud and make sure you
            understand the pattern before moving on.
          </li>
          <li>
            <strong>Complete the workbook practice.</strong> Use the examples and notes to produce
            your own answers.
          </li>
          <li>
            <strong>Submit only when required.</strong> If the workbook contains a Submit section or
            the lesson tells you to submit, send your clean final answers there. If no submission is
            required, complete the activity as practice.
          </li>
        </ol>

        <NoteBox tone="amber">
          <strong>Do not use an old separate submission page.</strong> Required submissions are handled
          from the appropriate workbook lesson in the Course Book.
        </NoteBox>
      </SectionCard>

      <SectionCard title="4. What the main Falowen areas do">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          You will see different areas around Campus. Each one has a specific purpose. You do not need
          to use every area every day.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 10,
          }}
        >
          <TabGuide title="Course Book">
            Your main learning area. Start here for normal A1 study and open the lesson you are working on.
          </TabGuide>
          <TabGuide title="Exam File">
            Keeps exam-related information and preparation records connected to your learning journey.
          </TabGuide>
          <TabGuide title="Attendance">
            Review your class attendance and confirm that your check-ins have been recorded.
          </TabGuide>
          <TabGuide title="Class Members">
            See the students in your class and class-related information when this feature is available to your group.
          </TabGuide>
          <TabGuide title="Vocab Practice">
            Practise important vocabulary outside the normal lesson and strengthen words you need to remember.
          </TabGuide>
          <TabGuide title="Results">
            See marked work, scores, corrections and the areas you should improve before the next assignment.
          </TabGuide>
          <TabGuide title="Account">
            Manage your account information, settings and notifications.
          </TabGuide>
          <TabGuide title="Exams Room">
            Use this for separate exam-style practice. It supports your preparation but does not replace the Course Book.
          </TabGuide>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a href="/campus/results" style={{ ...styles.secondaryButton, textDecoration: "none" }}>
            Open Results
          </a>
          <a href="/campus/attendance" style={{ ...styles.secondaryButton, textDecoration: "none" }}>
            Open Attendance
          </a>
          <a href="/campus/account" style={{ ...styles.secondaryButton, textDecoration: "none" }}>
            Open Account
          </a>
          <a href="/exams/question" style={{ ...styles.secondaryButton, textDecoration: "none" }}>
            Open Exams Room
          </a>
        </div>
      </SectionCard>

      <SectionCard title="5. Understanding lesson status">
        <ul style={listStyle}>
          <li>
            <strong>Current:</strong> this is the lesson Falowen currently expects you to continue.
          </li>
          <li>
            <strong>Tutor-marked:</strong> the lesson contains work that can be submitted, checked or scored.
          </li>
          <li>
            <strong>Self-learning / Practice only:</strong> complete the activity seriously even when
            it does not require a tutor submission.
          </li>
          <li>
            <strong>Completed:</strong> the required learning activity has been finished.
          </li>
          <li>
            <strong>Needs improvement:</strong> read the corrections, fix the weak areas and complete
            the required improvement or resubmission.
          </li>
        </ul>
      </SectionCard>

      <SectionCard title="6. Attendance and class preparation">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Open your lesson before class and prepare early. When check-in opens for a live class, use
          the check-in link or QR code provided for that session. Your attendance record can be reviewed
          from the Attendance area.
        </p>

        <NoteBox tone="amber">
          <strong>Attendance does not replace coursework.</strong> To progress well, you must attend class,
          complete the required learning and submit assignment work when the lesson asks for it.
        </NoteBox>
      </SectionCard>

      <SectionCard title="7. Results, corrections and the pass mark">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          After work has been marked, open <strong>Results</strong>. Do not look only at the percentage.
          Read the corrections and improvement advice so you understand what went wrong and can avoid
          repeating the same mistake.
        </p>

        <NoteBox tone="green">
          <strong>Assignment pass mark: 60%.</strong> A score below 60% means the work needs improvement.
          Follow the feedback and any resubmission instruction shown for that assignment.
        </NoteBox>
      </SectionCard>

      <SectionCard title="8. Using Falowen AI correctly">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Falowen AI is there to explain difficult points, help you practise and show you how to improve.
          It should not do your entire assignment for you.
        </p>

        <NoteBox>
          <strong>A good learning rule:</strong> Ask → understand → practise → write the final answer yourself.
        </NoteBox>
      </SectionCard>

      <SectionCard title="9. Your simple daily routine">
        <NoteBox tone="green">
          <strong>Open Falowen → Course Book → Continue learning → complete the lesson in order →
          submit if required → check Results → prepare for your next class.</strong>
        </NoteBox>

        <p style={{ margin: 0, lineHeight: 1.7 }}>
          If you remember this routine, you will always know where to begin. Do not worry about learning
          every feature on Day 0. Your main job is to know your Course Book and follow the lesson instructions.
        </p>
      </SectionCard>

      <SectionCard title="10. When to use the Exams Room">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          The Exams Room gives you additional exam-style practice in areas such as reading, listening,
          speaking, writing and vocabulary. Use it alongside your course when appropriate and especially
          during exam preparation. It does not replace the normal A1 Course Book.
        </p>
      </SectionCard>

      <SectionCard title="A1 Day 0 platform check">
        <p style={{ margin: 0, lineHeight: 1.65 }}>
          Answer every question. You will see the correction immediately after each answer. A score of
          <strong> 75% or higher</strong> shows that you understand the main A1 navigation and study process.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <strong>
            Progress: {answeredCount}/{questions.length}
          </strong>
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
              onSelect={answerQuestion}
            />
          ))}
        </ol>

        {testComplete ? (
          <NoteBox tone={ready ? "green" : "amber"}>
            <strong>{ready ? "Day 0 check complete." : "Review the guide once more."}</strong>{" "}
            {ready
              ? `You scored ${percent}%. Review any wrong answer and then begin Day 1.`
              : `You scored ${percent}%. Read the corrected sections again before beginning Day 1.`}
          </NoteBox>
        ) : null}

        <button
          type="button"
          style={{ ...styles.secondaryButton, width: "fit-content" }}
          onClick={() => setAnswers({})}
        >
          Restart platform check
        </button>
      </SectionCard>

      <SectionCard title="Finish Day 0">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Day 0 is an orientation, not a normal tutor-marked assignment. Complete the platform check,
          review any corrections and then continue to your first A1 lesson.
        </p>

        {testComplete ? (
          <a href="/campus/course" style={{ ...styles.primaryButton, textDecoration: "none", width: "fit-content" }}>
            Continue to A1 Course Book
          </a>
        ) : (
          <NoteBox tone="amber">Complete all {questions.length} questions before moving on.</NoteBox>
        )}
      </SectionCard>
    </div>
  );
};

export default A1Day0OrientationKnowledgeTestWorkbookPage;
