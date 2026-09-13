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
    question: "Where should you normally begin your A2 study day?",
    options: ["Course Book", "Account", "Exams Room"],
    answer: 0,
    explanation: "The Course Book is your main learning path for normal A2 lessons.",
  },
  {
    question: "What does the Continue learning button do?",
    options: [
      "Takes you to the lesson Falowen expects you to work on next",
      "Opens only the Attendance page",
      "Skips directly to the final exam",
    ],
    answer: 0,
    explanation: "Continue learning returns you to the next lesson in your Course Book.",
  },
  {
    question: "What should you do when Falowen Radio appears at the start of an A2 lesson?",
    options: ["Listen first, then select Continue", "Skip directly to Submit", "Leave the Course Book"],
    answer: 0,
    explanation: "Falowen Radio introduces the topic before the rest of the lesson opens.",
  },
  {
    question: "What is Teil 1 mainly for in an A2 workbook?",
    options: ["Speaking preparation and class practice", "Final submission only", "Account settings"],
    answer: 0,
    explanation: "Teil 1 prepares you to speak actively in class and is normally not part of the submitted assignment.",
  },
  {
    question: "Which workbook parts are normally submitted for marking?",
    options: ["Teil 1 only", "Teil 2, Teil 3 and Teil 4", "Only Ref"],
    answer: 1,
    explanation: "Writing, reading and listening are normally submitted through the workbook Submit tab.",
  },
  {
    question: "What is the Ref tab for?",
    options: ["Useful references and learning support", "Submitting attendance", "Changing your class"],
    answer: 0,
    explanation: "Ref gives you supporting material for the lesson; it is not the final submission area.",
  },
  {
    question: "Where should you submit required A2 workbook answers?",
    options: ["The Submit tab inside the workbook", "An old external submission page", "Only WhatsApp"],
    answer: 0,
    explanation: "Use the Submit tab in the same workbook. Falowen selects the correct assignment for that lesson.",
  },
  {
    question: "Where should you check scores, corrections and improvement advice?",
    options: ["Results", "Class Members", "Account"],
    answer: 0,
    explanation: "Results shows your marked work, scores and tutor feedback.",
  },
  {
    question: "How do you record attendance for a live class?",
    options: ["Use the check-in link or QR code for the session", "Attendance is always automatic", "Use the Submit tab"],
    answer: 0,
    explanation: "The class check-in records attendance, and the Attendance area lets you review it.",
  },
  {
    question: "What is the assignment pass mark on Falowen?",
    options: ["40%", "50%", "60%"],
    answer: 2,
    explanation: "A score of 60% or higher is a pass for an assignment.",
  },
  {
    question: "Choose the correct statement.",
    options: ["Ich lerne jeden Tag Deutsch.", "Ich jeden Tag lerne Deutsch.", "Ich Deutsch jeden Tag lerne."],
    answer: 0,
    explanation: "In a normal main clause, the conjugated verb is in position 2.",
  },
  {
    question: "Choose the correct modal sentence.",
    options: ["Ich muss morgen arbeiten.", "Ich muss arbeite morgen.", "Ich morgen arbeiten muss."],
    answer: 0,
    explanation: "With a modal verb, the second verb stays in the infinitive at the end.",
  },
  {
    question: "Choose the correct accusative article.",
    options: ["Ich kaufe der Apfel.", "Ich kaufe den Apfel.", "Ich kaufe dem Apfel."],
    answer: 1,
    explanation: "The masculine accusative article is den.",
  },
  {
    question: "Choose the correct sentence with weil.",
    options: [
      "Ich lerne Deutsch, weil ich in Deutschland arbeiten möchte.",
      "Ich lerne Deutsch, weil möchte ich in Deutschland arbeiten.",
      "Ich lerne Deutsch, weil ich möchte in Deutschland arbeiten.",
    ],
    answer: 0,
    explanation: "In a weil-clause, the conjugated verb goes to the end.",
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

const A2Day0OrientationKnowledgeTestWorkbookPage = () => {
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
  const ready = testComplete && percent >= 70;

  const answerQuestion = (index, optionIndex) => {
    setAnswers((old) => ({ ...old, [index]: optionIndex }));
  };

  return (
    <div
      data-a2-day0-orientation="true"
      style={{ ...styles.container, display: "grid", gap: 16 }}
    >
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

        <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 Day 0: How to use Falowen</h1>

        <p style={{ ...styles.subtitle, margin: 0, lineHeight: 1.65 }}>
          Start here before Day 1. This orientation explains how your A2 Course Book works, what the
          workbook tabs mean, how to move through a lesson and where to find attendance, results,
          learning support and exam practice.
        </p>

        <img
          src={day0HeroImage}
          alt="A2 students preparing for their Falowen course"
          style={{ width: "100%", maxHeight: 240, objectFit: "cover", borderRadius: 12 }}
        />
      </div>

      <SectionCard title="Welcome to A2">
        <NoteBox tone="green">
          <strong>A2 builds on the foundation you developed at A1.</strong> You will use more vocabulary,
          connect sentences more confidently and communicate in a wider range of everyday situations.
        </NoteBox>

        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Day 0 is not a normal tutor-marked assignment. It is your orientation and readiness check.
          The goal is to make sure you understand how Falowen works now and that you remember the most
          important A1 foundations before you begin A2.
        </p>
      </SectionCard>

      <SectionCard title="1. Where your A2 learning starts">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Your main learning area is the <strong>Course Book</strong>. Start there for normal daily study.
          The Course Book keeps your lessons in order and helps you see what is current, what has been
          completed and what still needs attention.
        </p>

        <a href="/campus/course" style={{ ...styles.primaryButton, textDecoration: "none", width: "fit-content" }}>
          Open A2 Course Book
        </a>
      </SectionCard>

      <SectionCard title="2. Understanding the Course Book">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          At the top of the Course Book you will see your progress and a <strong>Continue learning</strong>
          button. Use it when you want Falowen to take you to the lesson you should work on next.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 10,
          }}
        >
          <TabGuide title="All lessons">
            Shows the complete A2 Course Book so you can review earlier lessons or see what is ahead.
          </TabGuide>
          <TabGuide title="Next lesson">
            Helps you focus on the lesson Falowen currently expects you to continue.
          </TabGuide>
          <TabGuide title="Assignments">
            Shows lessons that contain tutor-marked or required assignment work.
          </TabGuide>
          <TabGuide title="Self-learning">
            Shows practice activities that you complete yourself as part of building your A2 skills.
          </TabGuide>
        </div>

        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Lesson cards can show statuses such as <strong>Current</strong>, <strong>Tutor-marked</strong>,
          <strong>Self-learning</strong>, <strong>Completed</strong> or <strong>Needs improvement</strong>.
          These labels help you understand your progress without searching through old pages.
        </p>
      </SectionCard>

      <SectionCard title="3. How to complete an A2 lesson">
        <NoteBox>
          <strong>Your normal lesson flow:</strong> Falowen Radio → Continue → lesson instruction and
          supporting material → workbook tabs → Submit inside the workbook
        </NoteBox>

        <ol style={listStyle}>
          <li>
            <strong>Listen to Falowen Radio first when it appears.</strong> It introduces the topic and
            prepares you for the language you will meet in the lesson.
          </li>
          <li>
            <strong>Read the lesson instruction.</strong> It tells you exactly what to prepare, practise
            and submit for that day.
          </li>
          <li>
            <strong>Use the lesson material and grammar support.</strong> Understand the topic before
            trying to complete final answers.
          </li>
          <li>
            <strong>Work through the workbook tabs in order.</strong> Do not jump directly to Submit.
          </li>
          <li>
            <strong>Submit clean final answers.</strong> Use the Submit tab in that same workbook when
            the lesson contains tutor-marked work.
          </li>
        </ol>
      </SectionCard>

      <SectionCard title="4. What the A2 workbook tabs mean">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 10,
          }}
        >
          <TabGuide title="Teil 1 · Sprechen">
            Prepare the speaking task before class. Think about what you want to say and practise aloud.
            This part is normally for speaking preparation and group practice rather than final submission.
          </TabGuide>
          <TabGuide title="Teil 2 · Schreiben">
            Complete the writing task carefully. Plan your message or letter, write a clear final version
            and include it in the submitted assignment when required.
          </TabGuide>
          <TabGuide title="Teil 3 · Lesen">
            Complete the reading task and answer the questions carefully. This is normally part of the
            tutor-marked assignment.
          </TabGuide>
          <TabGuide title="Teil 4 · Hören">
            Complete the listening task and record your final answers. This is normally part of the
            tutor-marked assignment.
          </TabGuide>
          <TabGuide title="Ref">
            Use the reference material, examples and support provided for the lesson. Ref helps you learn;
            it is not the place for your final submitted answers.
          </TabGuide>
          <TabGuide title="Submit">
            Send the required final answers from Teil 2, Teil 3 and Teil 4. Falowen selects the correct
            assignment for the workbook, so you should not search for an old external submission page.
          </TabGuide>
        </div>

        <NoteBox tone="amber">
          <strong>Prepare Teil 1 even when it is not submitted.</strong> Speaking preparation is part of
          the learning process and helps you participate properly in class.
        </NoteBox>
      </SectionCard>

      <SectionCard title="5. What the main Falowen areas do">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 10,
          }}
        >
          <TabGuide title="Course Book">
            Your main learning area. Start here for normal A2 study and workbook lessons.
          </TabGuide>
          <TabGuide title="Exam File">
            Keeps exam-related information and preparation records connected to your learning journey.
          </TabGuide>
          <TabGuide title="Attendance">
            Review your class attendance and confirm that your session check-ins have been recorded.
          </TabGuide>
          <TabGuide title="Class Members">
            See the students in your class and class-related information when available to your group.
          </TabGuide>
          <TabGuide title="Vocab Practice">
            Strengthen important vocabulary outside the normal lesson.
          </TabGuide>
          <TabGuide title="Results">
            See marked work, scores, tutor corrections and the areas you need to improve.
          </TabGuide>
          <TabGuide title="Account">
            Manage account information, settings and notifications.
          </TabGuide>
          <TabGuide title="Exams Room">
            Use this for separate exam-style practice. It supports A2 preparation but does not replace the Course Book.
          </TabGuide>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a href="/campus/results" style={{ ...styles.secondaryButton, textDecoration: "none" }}>Open Results</a>
          <a href="/campus/attendance" style={{ ...styles.secondaryButton, textDecoration: "none" }}>Open Attendance</a>
          <a href="/campus/account" style={{ ...styles.secondaryButton, textDecoration: "none" }}>Open Account</a>
          <a href="/exams/question" style={{ ...styles.secondaryButton, textDecoration: "none" }}>Open Exams Room</a>
        </div>
      </SectionCard>

      <SectionCard title="6. Attendance and class preparation">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Open your lesson before class and prepare Teil 1 early. When check-in opens for a live class,
          use the check-in link or QR code provided for that session. Review your attendance record from
          the Attendance area if you need to confirm that the check-in was saved.
        </p>

        <NoteBox tone="amber">
          <strong>Attendance alone does not complete the course.</strong> You must also prepare the lesson,
          complete the workbook and submit the required assignment parts.
        </NoteBox>
      </SectionCard>

      <SectionCard title="7. Results, corrections and the pass mark">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          After your work has been marked, open <strong>Results</strong>. Read the corrections as carefully
          as you read the score. The purpose of feedback is to help you improve the next assignment, not
          only to tell you whether you passed.
        </p>

        <NoteBox tone="green">
          <strong>Assignment pass mark: 60%.</strong> A score below 60% means the work needs improvement.
          Follow the correction and any resubmission instruction shown for that assignment.
        </NoteBox>
      </SectionCard>

      <SectionCard title="8. Using Falowen AI correctly">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Use Falowen AI to understand grammar, practise difficult points and improve your own writing or
          speaking ideas. Do not copy an AI answer and submit it without understanding it.
        </p>

        <NoteBox>
          <strong>A good learning rule:</strong> Ask → understand → practise → improve → write the final answer yourself.
        </NoteBox>
      </SectionCard>

      <SectionCard title="9. Your simple A2 study routine">
        <NoteBox tone="green">
          <strong>Open Falowen → Course Book → Continue learning → Radio when available → complete the
          workbook tabs → submit required parts → check Results → prepare Teil 1 for class.</strong>
        </NoteBox>
      </SectionCard>

      <SectionCard title="10. When to use the Exams Room">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          The Exams Room gives you extra exam-style practice in reading, listening, speaking, writing and
          vocabulary. Use it alongside the course when appropriate and during focused exam preparation.
          Your Course Book remains the main path for normal A2 lessons.
        </p>
      </SectionCard>

      <SectionCard title="A2 Day 0 orientation + A1 readiness check">
        <p style={{ margin: 0, lineHeight: 1.65 }}>
          This check covers both the Falowen workflow and important A1 foundations. Answer every question
          and review each correction. A score of <strong>70% or higher</strong> shows good readiness for A2 Day 1.
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
              onSelect={answerQuestion}
            />
          ))}
        </ol>

        {testComplete ? (
          <NoteBox tone={ready ? "green" : "amber"}>
            <strong>{ready ? "Day 0 check complete." : "Revision recommended before Day 1."}</strong>{" "}
            {ready
              ? `You scored ${percent}%. Review any wrong answer and then begin A2.`
              : `You scored ${percent}%. Review the corrected A1 topics and the orientation guide before beginning A2.`}
          </NoteBox>
        ) : null}

        <button type="button" style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => setAnswers({})}>
          Restart Day 0 check
        </button>
      </SectionCard>

      <SectionCard title="Finish Day 0">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Day 0 is an orientation and readiness check, not a normal tutor-marked A2 assignment. Complete
          all questions, review any corrections and then continue to your A2 Course Book.
        </p>

        {testComplete ? (
          <a href="/campus/course" style={{ ...styles.primaryButton, textDecoration: "none", width: "fit-content" }}>
            Continue to A2 Course Book
          </a>
        ) : (
          <NoteBox tone="amber">Complete all {questions.length} questions before moving on.</NoteBox>
        )}
      </SectionCard>
    </div>
  );
};

export default A2Day0OrientationKnowledgeTestWorkbookPage;
