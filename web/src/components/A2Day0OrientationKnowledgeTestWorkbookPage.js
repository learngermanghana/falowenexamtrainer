import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const SectionCard = ({ title, children }) => (
  <section style={{ ...styles.card, display: "grid", gap: 10 }}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const questions = [
  {
    question: "What should you do first on every study day?",
    options: [
      "Open the day card, read the goal, and follow the instruction note",
      "Skip to assignment submission immediately",
      "Wait for class before opening any resources",
    ],
    answer: "A",
  },
  {
    question: "Which workbook parts are usually scored for exam preparation?",
    options: ["Only Teil 1", "Teile 2–4", "Only Teil 4"],
    answer: "B",
  },
  {
    question: "What is Day 0 mainly for?",
    options: [
      "Orientation and baseline knowledge check",
      "Final exam submission",
      "Certificate collection",
    ],
    answer: "A",
  },
  {
    question: "If you need support with grammar or exam prompts, where should you go?",
    options: ["Chat • Grammar • Exams", "Only WhatsApp groups", "Only workbook PDFs"],
    answer: "A",
  },
  {
    question: "How should you approach the course from the start?",
    options: ["Casually, only before exam week", "With a steady daily routine", "Only do speaking tasks"],
    answer: "B",
  },
];

const A2Day0OrientationKnowledgeTestWorkbookPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>Day 0 Workbook (A2): Orientation + Knowledge Test</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Use this Day 0 workbook for A2 to understand the learning workflow and self-check your basics before Day 1.
        </p>
      </div>

      <SectionCard title="Part 1: Orientation (Read first)">
        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
          <li>This level strengthens everyday communication with clearer grammar control and longer responses.</li>
          <li>Follow this order: read instruction → watch/review lesson material → open workbook → complete assignment tasks.</li>
          <li>Teil 1 supports speaking preparation for class; Teile 2–4 build exam-ready writing, reading, and listening skills.</li>
          <li>Day 0 is orientation-only and helps you prepare your routine from the beginning.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Part 2: Knowledge Test (Self-check)">
        <p style={{ margin: 0 }}>Choose one answer for each question. Then compare with the answer key below.</p>
        <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 10 }}>
          {questions.map((item) => (
            <li key={item.question}>
              <p style={{ margin: "0 0 6px 0", fontWeight: 600 }}>{item.question}</p>
              <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 4 }}>
                <li>A) {item.options[0]}</li>
                <li>B) {item.options[1]}</li>
                <li>C) {item.options[2]}</li>
              </ul>
            </li>
          ))}
        </ol>
      </SectionCard>

      <SectionCard title="Answer key">
        <p style={{ margin: 0 }}>{questions.map((item, index) => `${index + 1}${item.answer}`).join(" · ")}</p>
      </SectionCard>
    </div>
  );
};

export default A2Day0OrientationKnowledgeTestWorkbookPage;
