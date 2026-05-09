import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const day0HeroImage =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80";

const SectionCard = ({ title, children }) => (
  <section style={{ ...styles.card, display: "grid", gap: 10 }}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const questions = [
  {
    question: "What is the purpose of C1 Day 0?",
    options: [
      "To understand the self-learning system and the move from B2 to C1",
      "To submit final exam answers",
      "To attend a tutor-only orientation class",
    ],
    answer: "A",
    explanation:
      "C1 Day 0 helps students understand how the self-learning course works and what changes from B2 to C1.",
  },
  {
    question: "What is expected at C1 compared to B2?",
    options: [
      "More precise expression, deeper analysis, and more independent argumentation",
      "Only short everyday answers",
      "Only memorising grammar tables",
    ],
    answer: "A",
    explanation:
      "At C1, students are expected to express themselves with more precision, depth, structure, and flexibility than at B2.",
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
    question: "What is different about C1 writing?",
    options: [
      "Students should analyse ideas critically, structure arguments clearly, and express themselves more precisely",
      "Students should only write simple short notes",
      "Students do not need examples or justification",
    ],
    answer: "A",
    explanation:
      "C1 writing requires stronger structure, clearer reasoning, better vocabulary choice, and more critical depth.",
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
      "Self-mark complete only",
      "Poor, Nice, Excellent",
    ],
    answer: "A",
    explanation:
      "Students complete the day by selecting Low confidence, Medium confidence, or High confidence.",
  },
  {
    question: "Does this self-learning C1 workbook use submit assignment or group discussion?",
    options: ["No", "Yes, both are required", "Only submit assignment"],
    answer: "A",
    explanation:
      "This version removes submit assignment and group discussion from the workbook flow.",
  },
  {
    question: "What does moving from B2 to C1 usually require in speaking?",
    options: [
      "More nuanced opinions, stronger reasoning, and more flexible language use",
      "Only one-line answers",
      "Only memorised examples",
    ],
    answer: "A",
    explanation:
      "At C1, students should explain, analyse, compare, and defend ideas with more confidence and flexibility.",
  },
  {
    question: "Why should students mark their confidence honestly?",
    options: [
      "To track their real progress and know what to review",
      "Because it replaces all study",
      "Because it gives a certificate automatically",
    ],
    answer: "A",
    explanation:
      "Confidence marking helps students reflect honestly on their progress and identify weak areas.",
  },
];

const getResultMessage = (score, total) => {
  const percent = Math.round((score / total) * 100);

  if (percent >= 80) {
    return `Great start. You scored ${percent}%. You understand the B2 to C1 progression and how to use the C1 self-learning course.`;
  }

  if (percent >= 50) {
    return `Good attempt. You scored ${percent}%. Review the guide again so you clearly understand the B2 to C1 progression and the self-learning steps.`;
  }

  return `You scored ${percent}%. Please review this Day 0 page again before starting Day 1 so you understand the B2 to C1 progression and how to use the course correctly.`;
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

const C1Day0ProgressionWorkbookPage = () => {
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
          C1 Day 0 Workbook: B2 to C1 Progression
        </h1>

        <p style={{ ...styles.subtitle, margin: 0 }}>
          Start here before Day 1. Learn what changes as you move from B2 to C1,
          understand how the self-learning workbook works, and complete the Day 0 knowledge test.
        </p>

        <img
          src={day0HeroImage}
          alt="C1 Day 0 workbook hero"
          style={{ width: "100%", maxHeight: 240, objectFit: "cover", borderRadius: 12 }}
        />
      </div>

      <SectionCard title="Day 0 Orientation">
        <p style={{ margin: 0 }}>
          <strong>Chapter:</strong> Orientation
        </p>
        <p style={{ margin: 0 }}>
          <strong>Focus:</strong> B2 to C1 progression
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
          This C1 course is designed for self-learning. Day 0 helps you understand what C1 expects from you
          after B2 and how to use the workbook correctly every day.
        </p>
      </SectionCard>

      <SectionCard title="What B2 to C1 progression means">
        <p style={{ margin: 0 }}>
          At B2, students usually learn to discuss a wide range of topics clearly, explain opinions,
          and write with good structure. At <strong>C1</strong>, students are expected to go further.
        </p>

        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
          <li>express ideas more precisely and naturally</li>
          <li>analyse topics in greater depth</li>
          <li>build stronger and more independent arguments</li>
          <li>connect ideas more logically and flexibly</li>
          <li>use more suitable style depending on context</li>
          <li>understand and respond to more complex texts and discussions</li>
        </ul>

        <p style={{ margin: 0 }}>
          So C1 is not only about knowing more vocabulary. It is also about expressing complex ideas
          with precision, clarity, nuance, and confidence.
        </p>
      </SectionCard>

      <SectionCard title="What you must do today">
        <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
          <li>Read how the C1 self-learning workbook works.</li>
          <li>Understand what changes from B2 to C1.</li>
          <li>Learn what to do in Teil 1, Teil 2, Teil 3, and Teil 4.</li>
          <li>Learn how to practise speaking and writing independently.</li>
          <li>Complete the Day 0 knowledge test.</li>
          <li>Review the corrections immediately.</li>
          <li>Start Day 1 with the correct study process.</li>
        </ol>
      </SectionCard>

      <SectionCard title="How the C1 workbook works">
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
          This helps you practise expressing, developing, and defending your ideas aloud, which is very important at C1.
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
          Then check your score and use the feedback to improve your structure, grammar, vocabulary choice, and precision.
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
          These parts help you build the comprehension skills needed for C1.
        </p>

        <p style={{ margin: 0 }}>
          Do not skip them. At C1, understanding complex arguments, opinions, and language choices is an important part of your progress.
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
          This C1 self-learning workbook does <strong>not</strong> use submit assignment.
        </p>
        <p style={{ margin: 0 }}>
          This C1 self-learning workbook does <strong>not</strong> use group discussion.
        </p>
        <p style={{ margin: 0 }}>
          Your goal is to practise independently, reflect honestly, and build stronger C1 ability step by step.
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
          Well done for completing Day 0. Now go to <strong>Day 1</strong> and begin your C1 journey.
        </p>

        <p style={{ margin: 0 }}>
          Remember: C1 means deeper thinking, more precise expression, stronger analysis, and better control than B2.
          Stay consistent and practise every part seriously.
        </p>
      </SectionCard>
    </div>
  );
};

export default C1Day0ProgressionWorkbookPage;
