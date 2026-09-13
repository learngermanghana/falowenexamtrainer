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
    question: "Where should you normally begin your B1 study day?",
    options: ["Course Book", "Account", "Exams Room"],
    answer: 0,
    explanation: "The Course Book is your main learning path for normal B1 lessons.",
  },
  {
    question: "What does the Continue learning button do?",
    options: [
      "Takes you to the lesson Falowen expects you to work on next",
      "Opens only your profile",
      "Skips directly to the final exam",
    ],
    answer: 0,
    explanation: "Continue learning returns you to the next lesson in your Course Book.",
  },
  {
    question: "What is Teil 1 mainly for in a B1 workbook?",
    options: ["Speaking preparation and class practice", "Final submission only", "Changing your account"],
    answer: 0,
    explanation: "Teil 1 prepares you to speak actively in class and is normally not submitted.",
  },
  {
    question: "Which workbook parts are normally submitted for marking?",
    options: ["Teil 1 only", "Teil 2, Teil 3 and Teil 4", "Only Ref"],
    answer: 1,
    explanation: "Writing, reading and listening are normally submitted through the workbook Submit tab.",
  },
  {
    question: "What changes when you move from A2 to B1?",
    options: [
      "You develop ideas more fully with reasons, examples and connected sentences",
      "You only memorise short isolated answers",
      "You stop doing speaking tasks",
    ],
    answer: 0,
    explanation: "B1 requires clearer, more independent communication than A2.",
  },
  {
    question: "What is the Ref tab for?",
    options: ["Useful references and learning support", "Submitting attendance", "Changing your class"],
    answer: 0,
    explanation: "Ref contains support material for the lesson; it is not the final submission area.",
  },
  {
    question: "Where should you check marked work and tutor feedback?",
    options: ["Results", "Class Members", "Account"],
    answer: 0,
    explanation: "Results shows your scores, corrections and improvement advice.",
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
    question: "Choose the correct sentence with weil.",
    options: [
      "Ich bleibe zu Hause, weil ich krank bin.",
      "Ich bleibe zu Hause, weil bin ich krank.",
      "Ich bleibe zu Hause, weil ich bin krank.",
    ],
    answer: 0,
    explanation: "In a weil-clause, the conjugated verb goes to the end.",
  },
  {
    question: "Choose the correct sentence with dass.",
    options: [
      "Ich glaube, dass der Kurs hilfreich ist.",
      "Ich glaube, dass der Kurs ist hilfreich.",
      "Ich glaube, dass ist der Kurs hilfreich.",
    ],
    answer: 0,
    explanation: "Dass introduces a subordinate clause, so the conjugated verb goes to the end.",
  },
  {
    question: "Choose the correct sentence with obwohl.",
    options: [
      "Obwohl ich müde bin, lerne ich weiter.",
      "Obwohl ich bin müde, lerne ich weiter.",
      "Obwohl müde ich bin, lerne ich weiter.",
    ],
    answer: 0,
    explanation: "The conjugated verb goes to the end of the obwohl-clause.",
  },
  {
    question: "Choose the correct sentence with deshalb.",
    options: [
      "Ich habe morgen eine Prüfung, deshalb lerne ich heute.",
      "Ich habe morgen eine Prüfung, deshalb ich lerne heute.",
      "Ich habe morgen eine Prüfung, deshalb heute ich lerne.",
    ],
    answer: 0,
    explanation: "After deshalb, the conjugated verb comes directly after the connector.",
  },
  {
    question: "Choose the correct relative clause.",
    options: [
      "Das ist der Mann, der mir geholfen hat.",
      "Das ist der Mann, der hat mir geholfen.",
      "Das ist der Mann, die mir geholfen hat.",
    ],
    answer: 0,
    explanation: "Der refers to der Mann and the verb comes at the end of the relative clause.",
  },
  {
    question: "Which phrase gives a B1 opinion correctly?",
    options: [
      "Meiner Meinung nach ist tägliches Lernen sehr wichtig.",
      "Meiner Meinung nach tägliches Lernen ist sehr wichtig.",
      "Meiner Meinung nach sehr wichtig ist tägliches Lernen.",
    ],
    answer: 0,
    explanation: "After Meiner Meinung nach, use normal main-clause word order.",
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

const B1Day0OrientationKnowledgeTestWorkbookPage = () => {
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
      data-b1-day0-orientation="true"
      style={{ ...styles.container, display: "grid", gap: 16 }}
    >
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

        <h1 style={{ ...styles.title, marginBottom: 0 }}>B1 Day 0: How to use Falowen</h1>

        <p style={{ ...styles.subtitle, margin: 0, lineHeight: 1.65 }}>
          Start here before Day 1. This orientation explains the B1 Course Book, the workbook tabs,
          the move from A2 to more independent B1 communication and where to find attendance, results,
          learning support and exam practice.
        </p>

        <img
          src={day0HeroImage}
          alt="B1 students preparing for their Falowen course"
          style={{ width: "100%", maxHeight: 240, objectFit: "cover", borderRadius: 12 }}
        />
      </div>

      <SectionCard title="Welcome to B1">
        <NoteBox tone="green">
          <strong>B1 is a major step toward independent German.</strong> At this level, short answers are
          no longer enough. You should increasingly explain your ideas, give reasons, add examples and
          connect your sentences clearly.
        </NoteBox>

        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Day 0 is an orientation and A2 readiness check, not a normal tutor-marked B1 assignment. Use it
          to understand how the current Falowen workflow works and what will be expected from you from Day 1.
        </p>
      </SectionCard>

      <SectionCard title="1. Where your B1 learning starts">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Your main learning area is the <strong>Course Book</strong>. Start there for normal B1 study.
          The Course Book keeps your lessons in order and shows your progress, assignment status and the
          lesson Falowen expects you to continue next.
        </p>

        <a href="/campus/course" style={{ ...styles.primaryButton, textDecoration: "none", width: "fit-content" }}>
          Open B1 Course Book
        </a>
      </SectionCard>

      <SectionCard title="2. Understanding the Course Book">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Use <strong>Continue learning</strong> when you want Falowen to take you directly to the lesson
          you should work on next. The Course Book filters help you find different kinds of work quickly.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 10,
          }}
        >
          <TabGuide title="All lessons">
            Shows the complete B1 Course Book so you can review earlier work or see what is ahead.
          </TabGuide>
          <TabGuide title="Next lesson">
            Helps you focus on the lesson Falowen currently expects you to continue.
          </TabGuide>
          <TabGuide title="Assignments">
            Shows lessons containing tutor-marked or required assignment work.
          </TabGuide>
          <TabGuide title="Self-learning">
            Shows practice activities that you complete independently to strengthen your B1 skills.
          </TabGuide>
        </div>

        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Lesson cards can show statuses such as <strong>Current</strong>, <strong>Tutor-marked</strong>,
          <strong>Self-learning</strong>, <strong>Completed</strong> or <strong>Needs improvement</strong>.
          Use these labels to decide what to continue, review or improve.
        </p>
      </SectionCard>

      <SectionCard title="3. How to complete a B1 lesson">
        <NoteBox>
          <strong>Your normal lesson flow:</strong> Falowen Radio → Continue → lesson instruction and
          supporting material → workbook tabs → Submit inside the workbook
        </NoteBox>

        <ol style={listStyle}>
          <li>
            <strong>Listen to Falowen Radio first when it appears.</strong> It introduces the topic and
            prepares you for more natural German before the workbook.
          </li>
          <li>
            <strong>Read the lesson instruction.</strong> Make sure you understand what must be prepared,
            practised and submitted.
          </li>
          <li>
            <strong>Study the lesson material and grammar support.</strong> B1 requires more accurate and
            flexible language, so do not rush directly to the final answer.
          </li>
          <li>
            <strong>Work through the workbook tabs.</strong> Prepare speaking, complete writing, reading
            and listening, and use Ref when you need support.
          </li>
          <li>
            <strong>Submit your clean final answers.</strong> Use the Submit tab in the same workbook when
            the lesson contains tutor-marked work.
          </li>
        </ol>
      </SectionCard>

      <SectionCard title="4. What the B1 workbook tabs mean">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 10,
          }}
        >
          <TabGuide title="Teil 1 · Sprechen">
            Prepare your speaking task before class. At B1, do more than give a short answer: state your
            position, explain why, add an example and react to other ideas. Teil 1 is normally for class practice.
          </TabGuide>
          <TabGuide title="Teil 2 · Schreiben">
            Write a complete, organised response. Address the task points, connect your ideas and check
            grammar, vocabulary and word order before submitting.
          </TabGuide>
          <TabGuide title="Teil 3 · Lesen">
            Complete the reading task carefully and use context, structure and vocabulary clues rather
            than guessing from one word.
          </TabGuide>
          <TabGuide title="Teil 4 · Hören">
            Complete the listening task and record your final answers. Listen for the speaker's main point,
            important details and attitude when the task requires it.
          </TabGuide>
          <TabGuide title="Ref">
            Use the references, examples and language support provided for the lesson. Ref is there to help
            you improve your own response; it is not the final answer sheet.
          </TabGuide>
          <TabGuide title="Submit">
            Send the required final answers from Teil 2, Teil 3 and Teil 4. Falowen selects the correct
            assignment for the workbook, so you do not need an old external submission page.
          </TabGuide>
        </div>
      </SectionCard>

      <SectionCard title="5. What changes from A2 to B1">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          B1 is not simply A2 with harder vocabulary. The quality of your communication must change.
          You should become more independent and explain your thinking more clearly.
        </p>

        <ul style={listStyle}>
          <li><strong>Give fuller answers:</strong> avoid one-sentence responses when the task needs development.</li>
          <li><strong>Give reasons:</strong> explain why you hold an opinion or make a recommendation.</li>
          <li><strong>Add examples:</strong> support your point with a concrete situation or experience.</li>
          <li><strong>Connect ideas:</strong> use appropriate connectors instead of writing isolated sentences.</li>
          <li><strong>Organise writing:</strong> make the purpose, main points and conclusion easy to follow.</li>
          <li><strong>Speak actively:</strong> prepare before class so you can discuss rather than only read from notes.</li>
        </ul>

        <NoteBox tone="amber">
          <strong>A useful B1 pattern:</strong> idea → reason → example → conclusion or consequence.
        </NoteBox>
      </SectionCard>

      <SectionCard title="6. What the main Falowen areas do">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 10,
          }}
        >
          <TabGuide title="Course Book">Your main learning area for normal B1 lessons and workbook work.</TabGuide>
          <TabGuide title="Exam File">Keeps exam-related information and preparation records connected to your learning journey.</TabGuide>
          <TabGuide title="Attendance">Review class attendance and confirm that your session check-ins were recorded.</TabGuide>
          <TabGuide title="Class Members">See students in your class and class-related information when available.</TabGuide>
          <TabGuide title="Vocab Practice">Strengthen vocabulary outside the normal lesson and review useful B1 words.</TabGuide>
          <TabGuide title="Results">See scores, tutor corrections and the areas you need to improve.</TabGuide>
          <TabGuide title="Account">Manage account information, settings and notifications.</TabGuide>
          <TabGuide title="Exams Room">Use this for separate exam-style practice. It supports B1 preparation but does not replace the Course Book.</TabGuide>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a href="/campus/results" style={{ ...styles.secondaryButton, textDecoration: "none" }}>Open Results</a>
          <a href="/campus/attendance" style={{ ...styles.secondaryButton, textDecoration: "none" }}>Open Attendance</a>
          <a href="/campus/account" style={{ ...styles.secondaryButton, textDecoration: "none" }}>Open Account</a>
          <a href="/exams/question" style={{ ...styles.secondaryButton, textDecoration: "none" }}>Open Exams Room</a>
        </div>
      </SectionCard>

      <SectionCard title="7. Attendance and class preparation">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          B1 class time should be used for active communication, not for seeing the task for the first time.
          Open the lesson before class, prepare Teil 1 and note useful expressions or questions. When check-in
          opens, use the link or QR code for that session.
        </p>

        <NoteBox tone="amber">
          <strong>Attendance alone does not complete the course.</strong> Preparation, participation and the
          required workbook submissions are all part of making real B1 progress.
        </NoteBox>
      </SectionCard>

      <SectionCard title="8. Results, corrections and the pass mark">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          After an assignment is marked, open <strong>Results</strong> and study the correction. At B1,
          feedback is especially important because repeated problems with word order, connectors, writing
          structure or unclear ideas can limit your progress even when your vocabulary is improving.
        </p>

        <NoteBox tone="green">
          <strong>Assignment pass mark: 60%.</strong> If your score is below 60%, follow the feedback and
          any resubmission instruction shown for that assignment.
        </NoteBox>
      </SectionCard>

      <SectionCard title="9. Using Falowen AI correctly">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Use Falowen AI to ask for explanations, practise grammar, test an argument or improve a draft.
          At B1, the final answer should still reflect your own thinking and your own language development.
        </p>

        <NoteBox>
          <strong>A good learning rule:</strong> think → ask → understand → practise → improve your own answer.
        </NoteBox>
      </SectionCard>

      <SectionCard title="10. Your simple B1 study routine">
        <NoteBox tone="green">
          <strong>Open Falowen → Course Book → Continue learning → Radio when available → study the lesson →
          prepare Teil 1 → complete Teil 2–4 → submit → check Results → improve weak areas.</strong>
        </NoteBox>
      </SectionCard>

      <SectionCard title="11. When to use the Exams Room">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          The Exams Room gives you extra exam-style practice in reading, listening, speaking, writing and
          vocabulary. It is useful alongside the course and during focused exam preparation, but the normal
          B1 Course Book remains your main daily learning path.
        </p>
      </SectionCard>

      <SectionCard title="B1 Day 0 orientation + A2 readiness check">
        <p style={{ margin: 0, lineHeight: 1.65 }}>
          This check covers the current Falowen workflow and important A2 grammar that you need before B1.
          Answer every question and review every correction. A score of <strong>70% or higher</strong> shows
          good readiness for B1 Day 1.
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
              ? `You scored ${percent}%. Review any wrong answer and then begin B1.`
              : `You scored ${percent}%. Review the corrected A2 topics and the orientation guide before beginning B1.`}
          </NoteBox>
        ) : null}

        <button type="button" style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => setAnswers({})}>
          Restart Day 0 check
        </button>
      </SectionCard>

      <SectionCard title="Finish Day 0">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Day 0 is an orientation and readiness check, not a normal tutor-marked B1 assignment. Complete
          all questions, review any corrections and then continue to the B1 Course Book.
        </p>

        {testComplete ? (
          <a href="/campus/course" style={{ ...styles.primaryButton, textDecoration: "none", width: "fit-content" }}>
            Continue to B1 Course Book
          </a>
        ) : (
          <NoteBox tone="amber">Complete all {questions.length} questions before moving on.</NoteBox>
        )}
      </SectionCard>
    </div>
  );
};

export default B1Day0OrientationKnowledgeTestWorkbookPage;
