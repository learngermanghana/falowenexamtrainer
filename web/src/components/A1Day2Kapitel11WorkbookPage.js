import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const cardStyle = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const sectionStyle = {
  ...styles.card,
  display: "grid",
  gap: 10,
};

const imageStyle = {
  width: "100%",
  borderRadius: 10,
  maxHeight: 260,
  objectFit: "cover",
};

const questionBoxStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 12,
  display: "grid",
  gap: 6,
  background: "#fff",
};

const questions = [
  {
    stem: "1. Wie heißt sie?",
    translation: "What is her name?",
    options: ["A) Maria", "B) Lisa", "C) Anna", "D) Julia"],
  },
  {
    stem: "2. Woher kommt sie?",
    translation: "Where does she come from?",
    options: ["A) Berlin", "B) Hamburg", "C) München", "D) Frankfurt"],
  },
  {
    stem: "3. Welche Buchstaben sagt sie?",
    translation: "Which letters does Anna say?",
    options: [
      "A) A, B, C, D, E, F, G",
      "B) H, I, J, K, L, M, N",
      "C) O, P, Q, R, S, T, U",
      "D) V, W, X, Y, Z, Ä, Ö, Ü",
    ],
  },
  {
    stem: "4. Woher kommt Annas Freund Max?",
    translation: "Where does Anna's friend Max come from?",
    options: ["A) Berlin", "B) Hamburg", "C) München", "D) Frankfurt"],
  },
];

const A1Day2Kapitel11WorkbookPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={cardStyle}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>A1 · Day 2 Workbook · Kapitel 1.1</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Chapter 1.1</p>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Complete all sections on this page, then submit your final answers in the submission area, not directly on this
          page.
        </p>
      </div>

      <section style={sectionStyle}>
        <img
          src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1600&q=80"
          alt="Student writing a German self-introduction in a workbook"
          loading="lazy"
          style={imageStyle}
        />
        <h2 style={{ margin: 0 }}>Teil 1 · Reading and Writing</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Schreiben Assignment: Introducing Yourself in German</strong>
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Instructions:</strong> Write a short text introducing yourself. Use the sentences and vocabulary you have
          learned. Include your name, where you come from, and where you live. Also, use at least one greeting and one
          farewell phrase.
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Assignment:</strong>
          <br />1. Begin your introduction with a greeting (e.g., "Hallo!" or "Guten Morgen!").
          <br />2. Introduce yourself using "Ich heiße [Name]."
          <br />3. Say where you come from using "Ich komme aus [Stadt/Land]."
          <br />4. Say where you live using "Ich wohne in [Stadt]."
          <br />5. End your introduction with a farewell (e.g., "Tschüss!" or "Gute Nacht!").
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Teil 2 · Questions</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Hörverstehen (Listening Comprehension) Exercise:</strong> Introducing Yourself, Alphabet, and Introducing a
          Friend.
          <br />Listen to the audio and answer the questions below.
        </p>
        {questions.map((question) => (
          <div key={question.stem} style={questionBoxStyle}>
            <strong>{question.stem}</strong>
            <span style={{ color: "#4b5563" }}>Translation: {question.translation}</span>
            {question.options.map((option) => (
              <span key={option}>{option}</span>
            ))}
          </div>
        ))}
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Teil 3 · Hören</h2>
        <a
          href="https://drive.google.com/file/d/1GfxXLlzz_MWKtY1MgbYaVw3F3mZvW7xx/view?usp=sharing"
          target="_blank"
          rel="noreferrer"
          style={{ ...styles.button, width: "fit-content", textDecoration: "none" }}
        >
          Open Hören Material (Google Drive)
        </a>
        <p style={{ margin: 0, color: "#4b5563" }}>
          Complete Hören from Google Drive, then return to submit answers.
        </p>
      </section>

      <div style={{ ...cardStyle, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
        <p style={{ margin: 0, fontWeight: 600 }}>
          Finished the workbook? Submit all final answers in the submission area.
        </p>
        <a
          href="https://www.falowen.app/campus/submit"
          target="_blank"
          rel="noreferrer"
          style={{ ...styles.button, width: "fit-content", textDecoration: "none" }}
        >
          Submit Workbook Answers
        </a>
      </div>
    </div>
  );
};

export default A1Day2Kapitel11WorkbookPage;
