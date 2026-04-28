import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    question: "How many chapters are in the A2 course?",
    options: ["14 chapters", "28 chapters", "40 chapters"],
    answer: "B",
    explanation: "The A2 course has 28 chapters.",
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
      "Every study day, students should read the instruction, review the lesson material, and complete the workbook tasks.",
  },
  {
    question: "What is Teil 1 mainly for?",
    options: [
      "Speaking preparation and group practice",
      "Final exam writing",
      "Listening only",
    ],
    answer: "A",
    explanation:
      "Teil 1 is for Sprechen and group practice. Students are expected to prepare this before coming to class.",
  },
  {
    question: "Which parts should students submit for marking?",
    options: ["Teil 1 only", "Teil 2, Teil 3, and Teil 4", "All parts including Teil 1"],
    answer: "B",
    explanation:
      "Students should submit only Teil 2, Teil 3, and Teil 4. Teil 1 is for Sprechen preparation and class practice.",
  },
  {
    question: "What is Teil 2?",
    options: ["Writing one letter or message", "Reading seven questions", "Listening to five questions"],
    answer: "A",
    explanation: "Teil 2 is Schreiben, where students write one letter or message.",
  },
  {
    question: "What is Teil 3?",
    options: ["Speaking", "Reading with seven questions", "Writing one letter"],
    answer: "B",
    explanation: "Teil 3 is Lesen and normally contains seven questions.",
  },
  {
    question: "What is Teil 4?",
    options: ["Listening with five questions", "Grammar only", "Speaking with a partner"],
    answer: "A",
    explanation: "Teil 4 is Hören and normally contains five questions.",
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
      "They should send only a WhatsApp message",
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
    explanation: "Students can track their attendance on the Attendance page.",
  },
  {
    question: "Why should students take every day seriously?",
    options: [
      "Because the course prepares students for the Goethe exam from Day 1",
      "Because only the final week matters",
      "Because assignments are optional",
    ],
    answer: "A",
    explanation:
      "The course is designed to build Goethe exam readiness from the beginning.",
  },
  {
    question: "Choose the correct sentence with 'weil'.",
    options: [
      "Ich lerne Deutsch, weil ich in Deutschland arbeiten möchte.",
      "Ich lerne Deutsch, weil möchte ich in Deutschland arbeiten.",
      "Ich lerne Deutsch, weil ich möchte in Deutschland arbeiten.",
    ],
    answer: "A",
    explanation:
      "With 'weil', the conjugated verb goes to the end: weil ich ... arbeiten möchte.",
  },
  {
    question: "Choose the correct sentence with 'deshalb'.",
    options: [
      "Ich bin krank, deshalb ich bleibe zu Hause.",
      "Ich bin krank, deshalb bleibe ich zu Hause.",
      "Ich bin krank, deshalb zu Hause bleibe ich.",
    ],
    answer: "B",
    explanation:
      "After 'deshalb', the conjugated verb comes in position 2: deshalb bleibe ich...",
  },
  {
    question: "Which sentence has the correct German statement word order?",
    options: [
      "Heute ich gehe zur Schule.",
      "Heute gehe ich zur Schule.",
      "Heute zur Schule gehe ich.",
    ],
    answer: "B",
    explanation:
      "In German statements, the conjugated verb stays in position 2.",
  },
  {
    question: "Choose the correct W-question.",
    options: ["Wo du wohnst?", "Wo wohnst du?", "Wo du wohnst du?"],
    answer: "B",
    explanation:
      "A W-question starts with the question word, then the verb: Wo wohnst du?",
  },
  {
    question: "Choose the correct yes/no question.",
    options: ["Kommst du heute?", "Du kommst heute?", "Heute du kommst?"],
    answer: "A",
    explanation:
      "In yes/no questions, the verb comes first: Kommst du heute?",
  },
  {
    question: "Choose the correct verb conjugation.",
    options: ["Ich gehen nach Hause.", "Ich gehe nach Hause.", "Ich geht nach Hause."],
    answer: "B",
    explanation: "For 'ich', we say: ich gehe.",
  },
  {
    question: "Choose the correct sentence with time.",
    options: [
      "Ich lerne Deutsch um 18 Uhr.",
      "Ich lerne um Deutsch 18 Uhr.",
      "Um Deutsch ich lerne 18 Uhr.",
    ],
    answer: "A",
    explanation: "The time phrase is correct: um 18 Uhr.",
  },
  {
    question: "Which is the best way to start an informal German letter?",
    options: [
      "Lieber Alex,",
      "Sehr geehrte Damen und Herren,",
      "Mit freundlichen Grüßen,",
    ],
    answer: "A",
    explanation:
      "For an informal letter to a male friend, you can start with: Lieber Alex,",
  },
  {
    question: "Which sentence correctly asks 'How are you?'",
    options: ["Wie geht es dir?", "Wie du geht es?", "Wie geht dir es?"],
    answer: "A",
    explanation: "The correct phrase is: Wie geht es dir?",
  },
  {
    question: "Which sentence clearly gives a reason for writing?",
    options: [
      "Ich schreibe dir, weil ich dich einladen möchte.",
      "Ich dir schreibe, weil möchte ich dich einladen.",
      "Schreibe ich dir, weil ich dich möchte einladen.",
    ],
    answer: "A",
    explanation:
      "This sentence is correct. With 'weil', the conjugated verb goes to the end.",
  },
  {
    question: "Which sentence is best for inviting a friend?",
    options: [
      "Möchtest du am Samstag zu meiner Party kommen?",
      "Du möchtest am Samstag zu meiner Party kommen?",
      "Am Samstag zu meiner Party möchtest kommen du?",
    ],
    answer: "A",
    explanation:
      "This is a correct yes/no invitation question: Möchtest du ... kommen?",
  },
  {
    question: "Which sentence asks for a reply?",
    options: [
      "Bitte antworte mir bald.",
      "Bitte bald mir antworte.",
      "Antworte bitte ich bald.",
    ],
    answer: "A",
    explanation:
      "A simple correct sentence is: Bitte antworte mir bald.",
  },
  {
    question: "Which is a good informal closing?",
    options: ["Liebe Grüße", "Sehr geehrte Damen und Herren", "Betreff"],
    answer: "A",
    explanation: "Liebe Grüße is a common informal closing.",
  },
  {
    question: "Which order is best for a simple A2 informal letter?",
    options: [
      "Greeting → reason for writing → details/questions → closing",
      "Closing → questions → greeting → reason",
      "Name → closing → greeting → no message",
    ],
    answer: "A",
    explanation:
      "A clear A2 letter should have a greeting, reason, details or questions, and a closing.",
  },
];

const getResultMessage = (score, total) => {
  const percent = Math.round((score / total) * 100);

  if (percent >= 80) {
    return `Great start. You scored ${percent}%. You are ready to begin A2 seriously.`;
  }

  if (percent >= 50) {
    return `Good attempt. You scored ${percent}%. Review the corrections carefully before Day 1.`;
  }

  return `You scored ${percent}%. You need revision before Day 1. Focus on sentence structure, verbs, questions, weil, deshalb, time expressions, and basic letter writing.`;
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

const A2Day0OrientationKnowledgeTestWorkbookPage = () => {
  const navigate = useNavigate();
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
        <button
          style={{ ...styles.secondaryButton, width: "fit-content" }}
          onClick={() => navigate("/campus/course")}
        >
          Back to Course
        </button>

        <h1 style={{ ...styles.title, marginBottom: 0 }}>
          A2 Day 0 Workbook: Orientation + Knowledge Test
        </h1>

        <p style={{ ...styles.subtitle, margin: 0 }}>
          Start here before Day 1. Read how the A2 course is organised, understand how the workbook works,
          and complete the Day 0 knowledge test.
        </p>

        <img
          src={day0HeroImage}
          alt="A2 Day 0 workbook hero"
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
          <strong>Confidence:</strong> Read the Day 0 guide to understand how the A2 course is organised.
        </p>
      </SectionCard>

      <SectionCard title="Instruction">
        <p style={{ margin: 0 }}>
          Start here to understand how the A2 course is structured and what is expected from you.
          Read the guide carefully, then complete the Day 0 knowledge test.
        </p>
      </SectionCard>

      <SectionCard title="What you must do today">
        <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
          <li>Read how the A2 course is structured.</li>
          <li>Understand how the workbook parts work.</li>
          <li>Learn how to check in for class attendance.</li>
          <li>Learn how to submit your workbook correctly.</li>
          <li>Complete the Day 0 knowledge test.</li>
          <li>Check your answers immediately.</li>
          <li>Review the corrections before starting Day 1.</li>
        </ol>
      </SectionCard>

      <SectionCard title="Read how the A2 course is structured">
        <p style={{ margin: 0 }}>
          The A2 course has <strong>28 chapters</strong>. Each study day, students are expected to
          read the instruction note, review the lesson material, study the grammar, and complete the workbook activities.
        </p>

        <p style={{ margin: 0 }}>
          The workbook contains <strong>four parts</strong>:
        </p>

        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
          <li>
            <strong>Teil 1: Sprechen</strong> — speaking preparation for group practice.
            Students are expected to prepare this before coming to class.
          </li>
          <li>
            <strong>Teil 2: Schreiben</strong> — writing task. Students normally write one letter or message.
          </li>
          <li>
            <strong>Teil 3: Lesen</strong> — reading task with seven questions.
          </li>
          <li>
            <strong>Teil 4: Hören</strong> — listening task with five questions.
          </li>
        </ul>

        <p style={{ margin: 0 }}>
          Every day should be treated seriously because this course is designed to prepare students for the Goethe exam from Day 1.
        </p>
      </SectionCard>

      <SectionCard title="How your workbook score works">
        <p style={{ margin: 0 }}>
          Teil 1 is for speaking preparation and classroom group practice. Students should prepare it before class so they can participate well.
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
          To submit your work, go to the <strong>Submit</strong> tab, select the correct day, and upload or enter your answers.
        </p>

        <p style={{ margin: 0 }}>
          <a href="https://www.falowen.app/campus/submit" target="_blank" rel="noreferrer">
            Submit your assignment
          </a>
        </p>
      </SectionCard>

      <SectionCard title="How to use Falowen during the A2 course">
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
          This A2 course is designed to prepare you for the Goethe exam from Day 1.
          Do not wait until exam week before taking the course seriously.
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
          <li>Basic sentence formation</li>
          <li>Verb conjugation</li>
          <li>German statement word order</li>
          <li>W-questions</li>
          <li>Yes/no questions</li>
          <li>Using time expressions</li>
          <li>
            Using <strong>weil</strong>
          </li>
          <li>
            Using <strong>deshalb</strong>
          </li>
          <li>Basic informal letter structure</li>
          <li>Giving a reason for writing</li>
          <li>Writing simple invitations</li>
          <li>Asking for a reply</li>
          <li>Using informal greetings and closings</li>
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
          Remember: A2 is not only about attending class. It is about building a daily learning habit.
          Prepare before class, submit your work on time, check your corrections, check in for attendance,
          and ask questions when you need help.
        </p>

        <p style={{ margin: 0 }}>
          We wish you all the best as you begin your A2 journey. Stay consistent, stay motivated,
          and take every chapter seriously. Your progress starts from Day 1.
        </p>
      </SectionCard>
    </div>
  );
};

export default A2Day0OrientationKnowledgeTestWorkbookPage;
