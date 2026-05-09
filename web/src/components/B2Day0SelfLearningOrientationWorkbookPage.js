import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const day0HeroImage =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80";

const SectionCard = ({ title, children }) => (
  <section style={{ ...styles.card, display: "grid", gap: 10 }}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const questions = [
  {
    question: "What is the purpose of B2 Day 0?",
    options: [
      "To understand the self-learning system and the move from B1 to B2",
      "To submit final exam answers",
      "To join a tutor-only class",
    ],
    answer: "A",
    explanation:
      "B2 Day 0 helps students understand how the self-learning course works and what changes from B1 to B2.",
  },
  {
    question: "What is expected at B2 compared to B1?",
    options: [
      "More developed ideas, clearer structure, and stronger argumentation",
      "Only short basic answers",
      "Only grammar rules without communication",
    ],
    answer: "A",
    explanation:
      "At B2, students are expected to express ideas more clearly, in more detail, and with better structure than at B1.",
  },
  {
    question: "What should students do in Teil 1?",
    options: [
      "Copy the speaking question and paste it into the Speech page for practice",
      "Submit it to a tutor",
      "Skip it completely",
    ],
    answer: "A",
    explanation:
      "Teil 1 is for independent speaking practice using the Speech page.",
  },
  {
    question: "What should students do in Teil 2?",
    options: [
      "Paste the writing task into the Writing page and check their score",
      "Wait for classroom correction",
      "Send it to a group discussion page",
    ],
    answer: "A",
    explanation:
      "Teil 2 is for self-practice in writing using the Writing page.",
  },
  {
    question: "What is different about B2 writing?",
    options: [
      "Students should give more detailed explanations and better connect their ideas",
      "Students should only write very short sentences",
      "Students do not need structure",
    ],
    answer: "A",
    explanation:
      "B2 writing requires clearer development, stronger linking, and more precise expression.",
  },
  {
    question: "How should students do Teil 3?",
    options: [
      "Use the reading links provided in the lesson",
      "Ignore the reading part",
      "Replace it with speaking",
    ],
    answer: "A",
    explanation:
      "Teil 3 is completed through the reading links provided in the lesson.",
  },
  {
    question: "How should students do Teil 4?",
    options: [
      "Use the listening links provided in the lesson",
      "Wait for a live class before listening",
      "Do writing instead",
    ],
    answer: "A",
    explanation:
      "Teil 4 is completed through the listening links provided in the lesson.",
  },
  {
    question: "After completing the workbook, what should students do?",
    options: [
      "Go to the course page and choose a confidence level",
      "Open the submit tab",
      "Join group discussion",
    ],
    answer: "A",
    explanation:
      "Students should self-complete the day from the course page using a confidence level.",
  },
  {
    question: "Which confidence levels are available on the course page?",
    options: [
      "Low confidence, Medium confidence, High confidence",
      "Beginner, Intermediate, Advanced",
      "Poor, Nice, Excellent",
    ],
    answer: "A",
    explanation:
      "Students complete the day by selecting Low confidence, Medium confidence, or High confidence.",
  },
  {
    question: "Does this self-learning B2 workbook use submit assignment or group discussion?",
    options: ["No", "Yes, both are required", "Only submit assignment"],
    answer: "A",
    explanation:
      "This version removes submit assignment and group discussion from the workbook flow.",
  },
  {
    question: "What does moving from B1 to B2 usually require in speaking?",
    options: [
      "More confident expression, explanation, and support for ideas",
      "Only single-word answers",
      "Only memorised grammar examples",
    ],
    answer: "A",
    explanation:
      "At B2, students should explain and support their ideas more naturally and clearly.",
  },
  {
    question: "Why should students mark their confidence honestly?",
    options: [
      "To track their real progress and know what to review",
      "Because it replaces all study",
      "Because it gives an exam certificate automatically",
    ],
    answer: "A",
    explanation:
      "Confidence marking helps students reflect honestly on their progress and identify weak areas.",
  },
];

const getResultMessage = (score, total) => {
  const percent = Math.round((score / total) * 100);

  if (percent >= 80) {
    return `Great start. You scored ${percent}%. You understand the B1 to B2 progression and how to use the B2 self-learning course.`;
  }

  if (percent >= 50) {
    return `Good attempt. You scored ${percent}%. Review the guide again so you clearly understand the B1 to B2 progression and the self-learning steps.`;
  }

  return `You scored ${percent}%. Please review this Day 0 page again before starting Day 1 so you understand the B1 to B2 progression and how to use the course correctly.`;
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

const B2Day0ProgressionWorkbookPage = () => {
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
          B2 Day 0 Workbook: B1 to B2 Progression
        </h1>

        <p style={{ ...styles.subtitle, margin: 0 }}>
          Start here before Day 1. Learn what changes as you move from B1 to B2,
          understand how the self-learning workbook works, and complete the Day 0 knowledge test.
        </p>

        <img
          src={day0HeroImage}
          alt="B2 Day 0 workbook hero"
          style={{ width: "100%", maxHeight: 240, objectFit: "cover", borderRadius: 12 }}
        />
      </div>

      <SectionCard title="Day 0 Orientation">
        <p style={{ margin: 0 }}>
          <strong>Chapter:</strong> Orientation
        </p>
        <p style={{ margin: 0 }}>
          <strong>Focus:</strong> B1 to B2 progression
        </p>
        <p style={{ margin: 0 }}>
          <strong>Activity type:</strong> Self-learning practice
        </p>
        <p style={{ margin: 0 }}>
          <strong>Marking:</strong> Self-check and self-completion
        </p>
        <p style={{ margin: 0 }}>
          <strong>Status:</strong> Completed after reading the guide and answering the Day 0 questions
        </p>
        <p style={{ margin: 0 }}>
          <strong>Completion method:</strong> Return to the course page and choose your confidence level
        </p>
      </SectionCard>

      <SectionCard title="Instruction">
        <p style={{ margin: 0 }}>
          This B2 course is designed for self-learning. Day 0 helps you understand what B2 expects from you
          after B1 and how to use the workbook correctly every day.
        </p>
      </SectionCard>

      <SectionCard title="What B1 to B2 progression means">
        <p style={{ margin: 0 }}>
          At B1, students usually learn to communicate clearly in familiar situations and express opinions in a simple way.
          At <strong>B2</strong>, students are expected to go further.
        </p>

        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
          <li>give more developed answers</li>
          <li>explain reasons more clearly</li>
          <li>connect ideas better</li>
          <li>write in a more organised way</li>
          <li>speak with more confidence and flexibility</li>
          <li>understand and discuss broader topics in more depth</li>
        </ul>

        <p style={{ margin: 0 }}>
          So B2 is not only about knowing more vocabulary. It is also about expressing yourself with more control,
          structure, and clarity.
        </p>
      </SectionCard>

      <SectionCard title="What you must do today">
        <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
          <li>Read how the B2 self-learning workbook works.</li>
          <li>Understand what changes from B1 to B2.</li>
          <li>Learn what to do in Teil 1, Teil 2, Teil 3, and Teil 4.</li>
          <li>Learn how to practise speaking and writing independently.</li>
          <li>Complete the Day 0 knowledge test.</li>
          <li>Review the corrections immediately.</li>
          <li>Start Day 1 with the correct study process.</li>
        </ol>
      </SectionCard>

      <SectionCard title="How the B2 workbook works">
        <p style={{ margin: 0 }}>
          Each study day, read the instruction, review the lesson material,
          use the workbook, and complete your practice by yourself.
        </p>

        <p style={{ margin: 0 }}>
          The workbook contains <strong>four parts</strong>:
        </p>

        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
          <li>
            <strong>Teil 1: Sprechen</strong> — copy the question and paste it into the Speech page for practice.
          </li>
          <li>
            <strong>Teil 2: Schreiben</strong> — paste the writing task into the Writing page and check your score yourself.
          </li>
          <li>
            <strong>Teil 3: Lesen</strong> — use the reading links provided in the lesson.
          </li>
          <li>
            <strong>Teil 4: Hören</strong> — use the listening links provided in the lesson.
          </li>
        </ul>
      </SectionCard>

      <SectionCard title="How to use Teil 1">
        <p style={{ margin: 0 }}>
          For <strong>Teil 1</strong>, copy the speaking question from the workbook and paste it into the Speech page.
          This helps you practise expressing your ideas aloud, which is very important at B2.
        </p>

        <p style={{ margin: 0 }}>
          <a href="https://www.falowen.app/campus/speech" target="_blank" rel="noreferrer">
            Open Speech Practice
          </a>
        </p>
      </SectionCard>

      <SectionCard title="How to use Teil 2">
        <p style={{ margin: 0 }}>
          For <strong>Teil 2</strong>, paste the writing question into the Writing page and write your answer there.
          Then check your score and use the feedback to improve your structure, grammar, and clarity.
        </p>

        <p style={{ margin: 0 }}>
          <a href="https://www.falowen.app/campus/writing" target="_blank" rel="noreferrer">
            Open Writing Practice
          </a>
        </p>
      </SectionCard>

      <SectionCard title="How to use Teil 3 and Teil 4">
        <p style={{ margin: 0 }}>
          For <strong>Teil 3</strong> and <strong>Teil 4</strong>, use the reading and listening links provided in the lesson.
          These parts help you build the comprehension skills needed for B2.
        </p>

        <p style={{ margin: 0 }}>
          Do not skip them. At B2, understanding more complex content is part of your progress.
        </p>
      </SectionCard>

      <SectionCard title="How to complete a day">
        <p style={{ margin: 0 }}>
          When you finish the workbook for the day, go back to the course page and self-complete the lesson by choosing:
        </p>

        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
          <li><strong>Low confidence</strong></li>
          <li><strong>Medium confidence</strong></li>
          <li><strong>High confidence</strong></li>
        </ul>

        <p style={{ margin: 0 }}>
          Choose honestly so you can track your real progress and know what to review again.
        </p>
      </SectionCard>

      <SectionCard title="Important note">
        <p style={{ margin: 0 }}>
          This B2 self-learning workbook does <strong>not</strong> use submit assignment.
        </p>
        <p style={{ margin: 0 }}>
          This B2 self-learning workbook does <strong>not</strong> use group discussion.
        </p>
        <p style={{ margin: 0 }}>
          Your goal is to practise independently, reflect honestly, and build stronger B2 ability step by step.
        </p>
      </SectionCard>

      <SectionCard title="Helpful Falowen links">
        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
          <li>
            <a href="https://www.falowen.app/campus/speech" target="_blank" rel="noreferrer">
              Speech Practice
            </a>
          </li>
          <li>
            <a href="https://www.falowen.app/campus/writing" target="_blank" rel="noreferrer">
              Writing Practice
            </a>
          </li>
          <li>
            <a href="https://www.falowen.app/campus/grammar" target="_blank" rel="noreferrer">
              Grammar Support
            </a>
          </li>
          <li>
            <a href="https://www.falowen.app/campus/results" target="_blank" rel="noreferrer">
              View Practice Results
            </a>
          </li>
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
          Well done for completing Day 0. Now go to <strong>Day 1</strong> and begin your B2 journey.
        </p>

        <p style={{ margin: 0 }}>
          Remember: B2 means stronger thinking, clearer expression, and better organisation than B1.
          Stay consistent and practise every part seriously.
        </p>
      </SectionCard>
    </div>
  );
};

export default B2Day0ProgressionWorkbookPage;
