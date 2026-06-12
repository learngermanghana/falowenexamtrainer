import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";

const day0HeroImage =
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80";

const SectionCard = ({ title, children }) => (
  <section style={{ ...styles.card, display: "grid", gap: 10 }}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const questions = [
  {
    question: "What level are you preparing for in this course?",
    options: ["A1", "B1", "C1"],
    answer: "B",
    explanation:
      "This course prepares students for B1-level communication and B1 exam readiness.",
  },
  {
    question: "What should students do every study day?",
    options: [
      "Read the day instruction, review the lesson material, and complete the workbook",
      "Skip straight to assignment submission",
      "Wait for class before opening any resources",
    ],
    answer: "A",
    explanation:
      "Every study day, students should read the instruction, review the lesson material, study the grammar, and complete the workbook tasks.",
  },
  {
    question: "What is Teil 1 mainly for?",
    options: [
      "Speaking preparation and group practice",
      "Final certificate collection",
      "Listening only",
    ],
    answer: "A",
    explanation:
      "Teil 1 is for Sprechen preparation and classroom group practice. Students should prepare this before class.",
  },
  {
    question: "Which parts should students submit for marking?",
    options: ["Teil 1 only", "Teil 2, Teil 3, and Teil 4", "All parts including Teil 1"],
    answer: "B",
    explanation:
      "Students should submit only Teil 2, Teil 3, and Teil 4. Teil 1 is for Sprechen preparation and class practice.",
  },
  {
    question: "What is expected from a B1 student compared to A2?",
    options: [
      "More independent communication and clearer explanations",
      "Only memorising short sentences",
      "Avoiding speaking tasks",
    ],
    answer: "A",
    explanation:
      "B1 students must communicate more independently, explain ideas clearly, and give reasons for their opinions.",
  },
  {
    question: "What is Teil 2?",
    options: [
      "Writing a longer message, email, or letter",
      "Reading seven questions only",
      "Listening only",
    ],
    answer: "A",
    explanation:
      "Teil 2 is Schreiben. At B1, students should write with better structure, connectors, and clearer ideas.",
  },
  {
    question: "What is Teil 3?",
    options: ["Speaking", "Reading comprehension", "Account information"],
    answer: "B",
    explanation:
      "Teil 3 is Lesen. Students practise reading for main ideas, details, and exam-style understanding.",
  },
  {
    question: "What is Teil 4?",
    options: ["Listening comprehension", "Grammar only", "Class attendance only"],
    answer: "A",
    explanation:
      "Teil 4 is Hören. Students practise listening for important information and meaning.",
  },
  {
    question: "Where should students submit their workbook assignment?",
    options: ["Submit tab", "Account page", "Discussion page"],
    answer: "A",
    explanation:
      "Students should go to the Submit tab, select the correct day, and submit Teil 2, Teil 3, and Teil 4.",
  },
  {
    question: "How will students check in before each class session?",
    options: [
      "A check-in link or QR code will be provided before each session",
      "They should only send a WhatsApp message",
      "They do not need to check in",
    ],
    answer: "A",
    explanation:
      "Before each session, students will receive a check-in link or QR code to record their attendance.",
  },
  {
    question: "Where can students track their attendance?",
    options: ["Attendance page", "Grammar page", "Exam Room only"],
    answer: "A",
    explanation:
      "Students can track their attendance on the Attendance page.",
  },
  {
    question: "Why should students take B1 seriously from Day 1?",
    options: [
      "Because B1 needs stronger vocabulary, grammar control, and independent thinking",
      "Because only the final week matters",
      "Because assignments are optional",
    ],
    answer: "A",
    explanation:
      "B1 is more demanding than A2, so students must build consistency from the beginning.",
  },
  {
    question: "Choose the correct sentence with 'weil'.",
    options: [
      "Ich lerne jeden Tag, weil ich die B1-Prüfung bestehen möchte.",
      "Ich lerne jeden Tag, weil möchte ich die B1-Prüfung bestehen.",
      "Ich lerne jeden Tag, weil ich möchte die B1-Prüfung bestehen.",
    ],
    answer: "A",
    explanation:
      "With 'weil', the conjugated verb goes to the end: weil ich ... bestehen möchte.",
  },
  {
    question: "Choose the correct sentence with 'deshalb'.",
    options: [
      "Ich habe morgen einen Test, deshalb ich lerne heute Abend.",
      "Ich habe morgen einen Test, deshalb lerne ich heute Abend.",
      "Ich habe morgen einen Test, deshalb heute Abend ich lerne.",
    ],
    answer: "B",
    explanation:
      "After 'deshalb', the conjugated verb comes in position 2: deshalb lerne ich...",
  },
  {
    question: "Choose the correct sentence with 'dass'.",
    options: [
      "Ich denke, dass Deutsch wichtig ist.",
      "Ich denke, dass Deutsch ist wichtig.",
      "Ich denke, dass ist Deutsch wichtig.",
    ],
    answer: "A",
    explanation:
      "With 'dass', the conjugated verb goes to the end: dass Deutsch wichtig ist.",
  },
  {
    question: "Choose the correct sentence with 'obwohl'.",
    options: [
      "Obwohl ich müde bin, lerne ich weiter.",
      "Obwohl ich bin müde, lerne ich weiter.",
      "Obwohl müde ich bin, lerne ich weiter.",
    ],
    answer: "A",
    explanation:
      "With 'obwohl', the conjugated verb goes to the end of the subordinate clause.",
  },
  {
    question: "Choose the correct sentence with 'trotzdem'.",
    options: [
      "Ich bin müde, trotzdem lerne ich weiter.",
      "Ich bin müde, trotzdem ich lerne weiter.",
      "Ich bin müde, trotzdem weiter ich lerne.",
    ],
    answer: "A",
    explanation:
      "After 'trotzdem', the conjugated verb comes in position 2: trotzdem lerne ich weiter.",
  },
  {
    question: "Choose the correct Perfekt sentence.",
    options: [
      "Ich habe gestern viel gelernt.",
      "Ich bin gestern viel gelernt.",
      "Ich habe gestern viel lernen.",
    ],
    answer: "A",
    explanation:
      "The correct Perfekt form is: ich habe gelernt.",
  },
  {
    question: "Choose the correct Präteritum sentence.",
    options: [
      "Ich war gestern zu Hause.",
      "Ich bin gestern zu Hause war.",
      "Ich waren gestern zu Hause.",
    ],
    answer: "A",
    explanation:
      "The correct Präteritum form is: ich war.",
  },
  {
    question: "Choose the correct sentence with a modal verb.",
    options: [
      "Ich muss meine Hausaufgaben machen.",
      "Ich muss mache meine Hausaufgaben.",
      "Ich meine Hausaufgaben muss machen.",
    ],
    answer: "A",
    explanation:
      "With modal verbs, the second verb goes to the end in infinitive form: machen.",
  },
  {
    question: "Which sentence gives an opinion correctly?",
    options: [
      "Meiner Meinung nach ist tägliches Lernen sehr wichtig.",
      "Meiner Meinung nach tägliches Lernen ist sehr wichtig.",
      "Meiner Meinung nach sehr wichtig ist tägliches Lernen.",
    ],
    answer: "A",
    explanation:
      "This is a good B1 opinion phrase: Meiner Meinung nach ist...",
  },
  {
    question: "Which sentence gives a reason correctly?",
    options: [
      "Ich finde das wichtig, weil man dadurch schneller Fortschritte macht.",
      "Ich finde das wichtig, weil macht man dadurch schneller Fortschritte.",
      "Ich finde das wichtig, weil man macht dadurch schneller Fortschritte.",
    ],
    answer: "A",
    explanation:
      "With 'weil', the conjugated verb goes to the end: weil man ... macht.",
  },
  {
    question: "Which is the best way to start an informal B1 email?",
    options: [
      "Liebe Anna, wie geht es dir?",
      "Sehr geehrte Damen und Herren,",
      "Mit freundlichen Grüßen,",
    ],
    answer: "A",
    explanation:
      "For an informal email to a friend, you can begin with: Liebe Anna, wie geht es dir?",
  },
  {
    question: "Which is the best way to start a formal B1 email?",
    options: [
      "Sehr geehrte Damen und Herren,",
      "Liebe Grüße",
      "Hallo mein Freund,",
    ],
    answer: "A",
    explanation:
      "For a formal email, you can begin with: Sehr geehrte Damen und Herren,",
  },
  {
    question: "Which order is best for a B1 writing task?",
    options: [
      "Greeting → reason for writing → main points with details → questions/request → closing",
      "Closing → no explanation → greeting",
      "Only one sentence without structure",
    ],
    answer: "A",
    explanation:
      "A good B1 text should be structured and clear, with enough details and a proper closing.",
  },
  {
    question: "Which phrase is useful for ending an informal email?",
    options: ["Liebe Grüße", "Betreff", "Sehr geehrte Damen und Herren"],
    answer: "A",
    explanation:
      "Liebe Grüße is a common informal closing.",
  },
];

const getResultMessage = (score, total) => {
  const percent = Math.round((score / total) * 100);

  if (percent >= 80) {
    return `Great start. You scored ${percent}%. You are ready to begin B1 seriously.`;
  }

  if (percent >= 50) {
    return `Good attempt. You scored ${percent}%. Review the corrections carefully before Day 1.`;
  }

  return `You scored ${percent}%. You need revision before Day 1. Focus on sentence structure, connectors, subordinate clauses, Perfekt, Präteritum, modal verbs, opinions, and B1 writing structure.`;
};

const QuestionCard = ({ item, index, selected, onSelect }) => {
  return (
    <li style={{ display: "grid", gap: 8 }}>
      <p style={{ margin: 0, fontWeight: 600 }}>
        {index + 1}. {item.question}
      </p>

      <div style={{ display: "grid", gap: 6 }}>
        {item.options.map((option, optionIndex) => {
          const letter = ["A", "B", "C"][optionIndex];
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

      {selected && (
        <p style={{ margin: 0, fontSize: 14 }}>
          <strong>{selected === item.answer ? "Correct." : "Not correct."}</strong>{" "}
          Answer: {item.answer}. {item.explanation}
        </p>
      )}
    </li>
  );
};

const B1Day0OrientationKnowledgeTestWorkbookPage = () => {
  const [answers, setAnswers] = useState({});

  const handleSelect = (questionIndex, letter) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: letter,
    }));
  };

  const answeredCount = Object.keys(answers).length;

  const score = questions.reduce((total, item, index) => {
    return answers[index] === item.answer ? total + 1 : total;
  }, 0);

  const allAnswered = answeredCount === questions.length;

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

        <h1 style={{ ...styles.title, marginBottom: 0 }}>
          B1 Day 0 Workbook: Orientation + Knowledge Test
        </h1>

        <p style={{ ...styles.subtitle, margin: 0 }}>
          Start here before Day 1. This guide helps A2 students understand what changes at B1 and how to prepare for stronger independent communication.
        </p>

        <img
          src={day0HeroImage}
          alt="B1 Day 0 workbook hero"
          style={{ width: "100%", maxHeight: 240, objectFit: "cover", borderRadius: 12 }}
        />
      </div>

      <SectionCard title="Day 0 Orientation">
        <p style={{ margin: 0 }}>
          <strong>Chapter:</strong> Orientation
        </p>
        <p style={{ margin: 0 }}>
          <strong>Activity type:</strong> Practice only
        </p>
        <p style={{ margin: 0 }}>
          <strong>Marking:</strong> Self-mark completion
        </p>
        <p style={{ margin: 0 }}>
          <strong>Status:</strong> Completed after reading and answering the questions
        </p>
        <p style={{ margin: 0 }}>
          <strong>Confidence:</strong> Read the Day 0 guide to understand how the B1 course is organised.
        </p>
      </SectionCard>

      <SectionCard title="Instruction">
        <p style={{ margin: 0 }}>
          Start here to understand how the B1 course is structured and what is expected from you.
          Read the guide carefully, then complete the Day 0 knowledge test.
        </p>
      </SectionCard>

      <SectionCard title="What you must do today">
        <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
          <li>Read how the B1 course is structured.</li>
          <li>Understand what changes when moving from A2 to B1.</li>
          <li>Understand how the workbook parts work.</li>
          <li>Learn how to check in for class attendance.</li>
          <li>Learn how to submit your workbook correctly.</li>
          <li>Complete the Day 0 knowledge test.</li>
          <li>Check your answers immediately.</li>
          <li>Review the corrections before starting Day 1.</li>
        </ol>
      </SectionCard>

      <SectionCard title="Read how the B1 course is structured">
        <p style={{ margin: 0 }}>
          The B1 course is designed for students who have completed A2 and are ready to communicate with more confidence,
          independence, and structure. At B1, you are expected to explain your ideas, give reasons, express opinions, and write longer texts.
        </p>

        <p style={{ margin: 0 }}>
          Each study day, students are expected to read the instruction note, review the lesson material, study the grammar,
          and complete the workbook activities.
        </p>

        <p style={{ margin: 0 }}>
          The workbook contains <strong>four parts</strong>:
        </p>

        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
          <li>
            <strong>Teil 1: Sprechen</strong> — speaking preparation for class. At B1, students should prepare opinions, reasons, examples, and useful phrases before class.
          </li>
          <li>
            <strong>Teil 2: Schreiben</strong> — writing task. Students practise longer emails, letters, opinions, and structured responses.
          </li>
          <li>
            <strong>Teil 3: Lesen</strong> — reading task. Students practise understanding main ideas, details, and exam-style reading questions.
          </li>
          <li>
            <strong>Teil 4: Hören</strong> — listening task. Students practise listening for important information, meaning, and exam-style answers.
          </li>
        </ul>

        <p style={{ margin: 0 }}>
          Every day should be treated seriously because B1 requires stronger grammar control, better vocabulary,
          clearer writing, and more confident speaking than A2.
        </p>
      </SectionCard>

      <SectionCard title="How your workbook score works">
        <p style={{ margin: 0 }}>
          Teil 1 is for speaking preparation and classroom group practice. Students should prepare it before class so they can participate confidently.
        </p>

        <p style={{ margin: 0 }}>
          Your assignment score normally comes from:
        </p>

        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
          <li>
            <strong>Teil 2: Schreiben</strong> — writing task
          </li>
          <li>
            <strong>Teil 3: Lesen</strong> — reading task
          </li>
          <li>
            <strong>Teil 4: Hören</strong> — listening task
          </li>
        </ul>

        <p style={{ margin: 0 }}>
          These three parts are combined to give a total score of <strong>100%</strong>.
        </p>
      </SectionCard>

      <SectionCard title="Class attendance check-in">
        <p style={{ margin: 0 }}>
          Before each class session, a check-in link or QR code will be provided. Use it to check in and record your attendance for that session.
        </p>

        <p style={{ margin: 0 }}>
          You can track your attendance here:
        </p>

        <p style={{ margin: 0 }}>
          <a href="https://www.falowen.app/campus/attendance" target="_blank" rel="noreferrer">
            Track your attendance
          </a>
        </p>
      </SectionCard>

      <SectionCard title="How to submit your workbook">
        <p style={{ margin: 0 }}>
          When submitting your workbook, submit only <strong>Teil 2, Teil 3, and Teil 4</strong>.
          Do not submit Teil 1 because Teil 1 is for Sprechen preparation and classroom group practice.
        </p>

        <p style={{ margin: 0 }}>
          To submit your work, go to the <strong>Submit</strong> tab, select the correct day, type your answers, and submit.
          You can also save a draft if you are not ready to submit yet.
        </p>

        <p style={{ margin: 0 }}>
          <a href="https://www.falowen.app/campus/submit" target="_blank" rel="noreferrer">
            Submit your assignment
          </a>
        </p>
      </SectionCard>

      <SectionCard title="How to use Falowen during the B1 course">
        <p style={{ margin: 0 }}>
          If your tutor is not available and you have grammar questions, you can use <strong>Falowen AI Grammar</strong>.
        </p>

        <p style={{ margin: 0 }}>
          <a href="https://www.falowen.app/campus/grammar" target="_blank" rel="noreferrer">
            Ask grammar questions
          </a>
        </p>

        <p style={{ margin: 0 }}>
          You can also use the <strong>Study Buddy</strong> at the bottom-right corner of your screen for quick learning support.
        </p>

        <p style={{ margin: 0 }}>
          To check your marked work and scores, go to:
        </p>

        <p style={{ margin: 0 }}>
          <a href="https://www.falowen.app/campus/results" target="_blank" rel="noreferrer">
            View your results
          </a>
        </p>

        <p style={{ margin: 0 }}>
          For some class days, your tutor may ask you to use group discussion during class. You can find it here:
        </p>

        <p style={{ margin: 0 }}>
          <a href="https://www.falowen.app/campus/discussion" target="_blank" rel="noreferrer">
            Join group discussion
          </a>
        </p>

        <p style={{ margin: 0 }}>
          To check or update your account information, go to:
        </p>

        <p style={{ margin: 0 }}>
          <a href="https://www.falowen.app/campus/account" target="_blank" rel="noreferrer">
            Account information
          </a>
        </p>

        <p style={{ margin: 0 }}>
          On the homepage, you can find your <strong>next recommended assignment</strong> and any{" "}
          <strong>missed or failed tasks</strong>. The <strong>Campus</strong> area is where you access your course.
        </p>

        <p style={{ margin: 0 }}>
          The <strong>Exam Room</strong> on the homepage is where you prepare for the exam after completing the course.
          The <strong>More For You</strong> section on the homepage is where you can check your class schedule.
        </p>
      </SectionCard>

      <SectionCard title="Important warning">
        <p style={{ margin: 0 }}>
          B1 is a big step after A2. Do not treat B1 like simple memorisation. You must learn to speak,
          write, listen, and read with more independence.
        </p>

        <p style={{ margin: 0 }}>
          Students who skip lesson materials, ignore the workbook, fail to submit assignments, fail to check in for attendance,
          or come to class unprepared may struggle with later chapters.
        </p>
      </SectionCard>

      <SectionCard title="Skills checked in this Day 0 test">
        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
          <li>Course structure and workbook instructions</li>
          <li>Assignment submission rules</li>
          <li>Class attendance check-in</li>
          <li>Moving from A2 to B1 expectations</li>
          <li>Sentence formation</li>
          <li>Verb position</li>
          <li>Using <strong>weil</strong>, <strong>deshalb</strong>, <strong>dass</strong>, <strong>obwohl</strong>, and <strong>trotzdem</strong></li>
          <li>Perfekt and Präteritum basics</li>
          <li>Modal verbs</li>
          <li>Giving opinions and reasons</li>
          <li>Informal and formal email structure</li>
          <li>Writing with clear order and details</li>
        </ul>
      </SectionCard>

      <SectionCard title="Day 0 Knowledge Test">
        <p style={{ margin: 0 }}>
          Choose one answer for each question. You will see the correction immediately after selecting an answer.
        </p>

        <p style={{ margin: 0 }}>
          Progress: <strong>{answeredCount}</strong> / {questions.length} answered
        </p>

        <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 14 }}>
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
      </SectionCard>

      <SectionCard title="Completion result">
        {allAnswered ? (
          <>
            <p style={{ margin: 0 }}>
              Your score: <strong>{score}</strong> / {questions.length}
            </p>
            <p style={{ margin: 0 }}>{getResultMessage(score, questions.length)}</p>
          </>
        ) : (
          <p style={{ margin: 0 }}>
            Complete all questions to see your final Day 0 result.
          </p>
        )}
      </SectionCard>

      <SectionCard title="Next step">
        <p style={{ margin: 0 }}>
          Well done for completing Day 0. Now go to <strong>Day 1, Teil 1</strong> and prepare for your{" "}
          <strong>Sprechen</strong> practice before coming to class.
        </p>

        <p style={{ margin: 0 }}>
          Remember: B1 is not only about attending class. It is about becoming more independent with the German language.
          Prepare before class, submit your work on time, check your corrections, check in for attendance,
          and ask questions when you need help.
        </p>

        <p style={{ margin: 0 }}>
          We wish you all the best as you begin your B1 journey. Stay consistent, stay motivated,
          and take every chapter seriously. Your progress starts from Day 1.
        </p>
      </SectionCard>
    </div>
  );
};

export default B1Day0OrientationKnowledgeTestWorkbookPage;
