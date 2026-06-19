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
    question: "What level are you starting in this course?",
    options: ["A1", "B1", "C1"],
    answer: "A",
    explanation:
      "This is the A1 course. It builds your beginner foundation in German.",
  },
  {
    question: "What should students do every study day?",
    options: [
      "Read the instruction, watch Video ansehen, study the grammar, and complete the workbook",
      "Skip the lesson and submit only answers",
      "Wait for class before opening anything",
    ],
    answer: "A",
    explanation:
      "Each day has Video ansehen, grammar, and workbook. Students should go through everything.",
  },
  {
    question: "What does each day’s instruction tell students?",
    options: [
      "The exact thing they should do for that day",
      "Only the final exam date",
      "Only the tutor’s phone number",
    ],
    answer: "A",
    explanation:
      "Each day has an instruction note that tells students exactly what to do.",
  },
  {
    question: "Should students skip any part of the daily lesson?",
    options: [
      "No, students should go through everything",
      "Yes, students should skip grammar",
      "Yes, students should skip Video ansehen",
    ],
    answer: "A",
    explanation:
      "Students should not skip anything. Video ansehen, grammar, and workbook all support the learning process.",
  },
  {
    question: "How is the A1 course designed?",
    options: [
      "Lesen, Hören, Schreiben, and Sprechen",
      "Only grammar",
      "Only speaking",
    ],
    answer: "A",
    explanation:
      "The A1 course is designed around the four main skills: Lesen, Hören, Schreiben, and Sprechen.",
  },
  {
    question: "Which A1 tasks are assignments to be submitted?",
    options: [
      "Lesen and Hören",
      "Only Sprechen",
      "Only grammar notes",
    ],
    answer: "A",
    explanation:
      "In A1, Lesen and Hören tasks are assignments to be submitted.",
  },
  {
    question: "Which A1 tasks are mainly practical?",
    options: [
      "Schreiben and Sprechen",
      "Only Lesen",
      "Only Hören",
    ],
    answer: "A",
    explanation:
      "In A1, Schreiben and Sprechen are practical tasks for practice and classroom development.",
  },
  {
    question: "Where should students submit their Lesen and Hören assignments?",
    options: ["Submit tab", "Account page", "Discussion page"],
    answer: "A",
    explanation:
      "Students should go to the Submit tab, select the correct day, and submit the required assignment.",
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
    question: "Why should students take A1 seriously from Day 1?",
    options: [
      "Because A1 builds the foundation for all future German levels",
      "Because only the final week matters",
      "Because assignments are optional",
    ],
    answer: "A",
    explanation:
      "A1 is the foundation. If students ignore the basics, later levels become more difficult.",
  },
];

const getResultMessage = (score, total) => {
  const percent = Math.round((score / total) * 100);

  if (percent >= 80) {
    return `Great start. You scored ${percent}%. You are ready to begin A1 seriously.`;
  }

  if (percent >= 50) {
    return `Good attempt. You scored ${percent}%. Review the corrections carefully before Day 1.`;
  }

  return `You scored ${percent}%. You need revision before Day 1. Focus on the course orientation points, daily routine, attendance, and submission process.`;
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

const A1Day0OrientationKnowledgeTestWorkbookPage = () => {
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
          A1 Day 0 Workbook: Orientation + Knowledge Test
        </h1>

        <p style={{ ...styles.subtitle, margin: 0 }}>
          Start here before Day 1. Read how the A1 course is organised, understand how the course works,
          and complete the Day 0 knowledge test.
        </p>

        <img
          src={day0HeroImage}
          alt="A1 Day 0 workbook hero"
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
          <strong>Confidence:</strong> Read the Day 0 guide to understand how the A1 course is organised.
        </p>
      </SectionCard>

      <SectionCard title="Instruction">
        <p style={{ margin: 0 }}>
          Start here to understand how the A1 course is structured and what is expected from you.
          Read the guide carefully, then complete the Day 0 knowledge test.
        </p>
      </SectionCard>

      <SectionCard title="What you must do today">
        <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
          <li>Read how the A1 course is structured.</li>
          <li>Understand how Video ansehen, grammar, and workbook work together.</li>
          <li>Understand which tasks are assignments and which tasks are practical.</li>
          <li>Learn how to check in for class attendance.</li>
          <li>Learn how to submit your assignments correctly.</li>
          <li>Complete the Day 0 knowledge test.</li>
          <li>Check your answers immediately.</li>
          <li>Review the corrections before starting Day 1.</li>
        </ol>
      </SectionCard>

      <SectionCard title="Read how the A1 course is structured">
        <p style={{ margin: 0 }}>
          The A1 course builds your beginner foundation in German. It helps you learn greetings, simple sentences,
          basic questions, everyday vocabulary, listening, reading, writing, and speaking.
        </p>

        <p style={{ margin: 0 }}>
          Each study day has <strong>Video ansehen</strong>, <strong>grammar</strong>, and <strong>workbook</strong>.
          Students should not skip any part. Go through everything carefully because each section supports the next one.
        </p>

        <p style={{ margin: 0 }}>
          Each day also has an <strong>instruction note</strong>. The instruction tells you the exact thing you should do for that day.
          Always read the instruction before starting the task.
        </p>

        <p style={{ margin: 0 }}>
          The A1 course is designed into <strong>Lesen</strong>, <strong>Hören</strong>, <strong>Schreiben</strong>, and{" "}
          <strong>Sprechen</strong>.
        </p>

        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
          <li>
            <strong>Lesen</strong> — reading practice and assignment. This should be submitted when required.
          </li>
          <li>
            <strong>Hören</strong> — listening practice and assignment. This should be submitted when required.
          </li>
          <li>
            <strong>Schreiben</strong> — writing practice. This is practical and helps you build sentence confidence.
          </li>
          <li>
            <strong>Sprechen</strong> — speaking practice. This is practical and helps you prepare for classroom communication.
          </li>
        </ul>

        <p style={{ margin: 0 }}>
          A1 may look simple, but it is very important. It is the foundation for A2, B1, and your future Goethe exam preparation.
        </p>
      </SectionCard>

      <SectionCard title="How your A1 assignments work">
        <p style={{ margin: 0 }}>
          In A1, <strong>Lesen</strong> and <strong>Hören</strong> are the main assignment tasks to be submitted.
        </p>

        <p style={{ margin: 0 }}>
          <strong>Schreiben</strong> and <strong>Sprechen</strong> are practical tasks. You should still complete them seriously
          because they help you build confidence for class and future exams.
        </p>

        <p style={{ margin: 0 }}>
          Do not jump or skip any section. Even when a section is practical, it still helps you understand the language better.
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

      <SectionCard title="How to submit your assignment">
        <p style={{ margin: 0 }}>
          When submitting your A1 work, submit the required <strong>Lesen</strong> and <strong>Hören</strong> assignments.
          Schreiben and Sprechen are practical tasks, but you should still complete them for practice.
        </p>

        <p style={{ margin: 0 }}>
          To submit your work, go to the <strong>Submit</strong> tab, select the correct day, type your answers, and submit.
          You can also save a draft if you are not ready to submit yet.
        </p>

        <p style={{ margin: 0 }}>
          <a href="/campus/course?submitWork=1" target="_blank" rel="noreferrer">
            Submit your assignment
          </a>
        </p>

        <p style={{ margin: 0 }}>
          <strong>Pass mark rule:</strong> Every assignment requires at least <strong>60%</strong> to pass.
          If a submitted assignment scores below 60%, it is a fail and must be resubmitted.
        </p>

        <p style={{ margin: 0 }}>
          If you submit the same assignment more than 3 times and still do not pass,
          a flat mark of <strong>60%</strong> will be awarded for that assignment.
        </p>

        <p style={{ margin: 0 }}>
          Students receive their course certificate only after all required assignments are completed
          with a pass mark of at least 60%.
        </p>
      </SectionCard>

      <SectionCard title="How to use Falowen during the A1 course">
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
          A1 is the foundation of your German journey. Do not think it is too easy and skip important parts.
          If your foundation is weak, A2 and B1 will become difficult.
        </p>

        <p style={{ margin: 0 }}>
          Students who skip Video ansehen, ignore grammar, avoid the workbook, fail to submit assignments, fail to check in for attendance,
          or come to class unprepared may struggle later.
        </p>
      </SectionCard>

      <SectionCard title="Skills checked in this Day 0 test">
        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
          <li>Course structure and daily instructions</li>
          <li>Video ansehen, grammar, and workbook routine</li>
          <li>Lesen, Hören, Schreiben, and Sprechen structure</li>
          <li>Assignment submission rules</li>
          <li>Class attendance check-in</li>
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
          Well done for completing Day 0. Now go to <strong>Day 1</strong>, read the instruction carefully,
          and start with the first required task for the day.
        </p>

        <p style={{ margin: 0 }}>
          Remember: A1 is not only about attending class. It is about building a strong foundation.
          Watch Video ansehen, study the grammar, complete the workbook, submit your required Lesen and Hören tasks,
          check your corrections, check in for attendance, and ask questions when you need help.
        </p>

        <p style={{ margin: 0 }}>
          Important: Completing the A1 course alone is not enough to write the Goethe A1 exam confidently.
          After you finish the course, go to the{" "}
          <a href="https://www.falowen.app/exams" target="_blank" rel="noreferrer">
            Exam Room
          </a>{" "}
          and solve past questions for about <strong>2 weeks</strong> before you write the exam.
        </p>

        <p style={{ margin: 0 }}>
          We wish you all the best as you begin your A1 journey. Stay consistent, stay motivated,
          and do not skip any part of the course. Your German foundation starts from Day 1.
        </p>
      </SectionCard>
    </div>
  );
};

export default A1Day0OrientationKnowledgeTestWorkbookPage;
