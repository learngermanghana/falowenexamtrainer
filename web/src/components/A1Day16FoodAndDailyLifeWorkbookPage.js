import React from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";
import CoursebookAudioPlayer from "./CoursebookAudioPlayer";

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
  maxHeight: 320,
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

const readingQuestions = [
  {
    stem: "1. Was mag der Autor besonders gerne?",
    options: ["A) Bananen", "B) Äpfel und Karotten", "C) Fleisch", "D) Kekse"],
  },
  {
    stem: "2. Was mag der Bruder des Autors nicht?",
    options: ["A) Käse", "B) Tofu", "C) Karotten", "D) Brot"],
  },
  {
    stem: "3. Warum kauft der Autor kein Fleisch?",
    options: [
      "A) Weil er Vegetarier ist",
      "B) Weil er keinen Supermarkt mag",
      "C) Weil er Brot mag",
      "D) Weil er keinen Hund hat",
    ],
  },
  {
    stem: "4. Was mag der Vater des Autors nicht?",
    options: ["A) Brot", "B) Milch", "C) Käse", "D) Schokolade"],
  },
  {
    stem: "5. Was essen der Autor und seine Schwester nicht?",
    options: ["A) Käse", "B) Fleisch", "C) Schokolade", "D) Kekse"],
  },
  {
    stem: "6. Was mag der Hund des Autors?",
    options: ["A) Kuchen", "B) Kekse", "C) Äpfel", "D) Bohnen"],
  },
  {
    stem: "7. Was mag die Mutter des Autors sehr?",
    options: ["A) Käse", "B) Tofu", "C) Brot", "D) Bananen"],
  },
  {
    stem: "8. Was backen sie oft am Wochenende?",
    options: ["A) Brot", "B) Kekse", "C) Kuchen", "D) Tofu"],
  },
  {
    stem: "9. Welche Zutat mögen alle im Kuchen?",
    options: ["A) Fleisch", "B) Käse", "C) Schokolade", "D) Milch"],
  },
  {
    stem: "10. Wer mag keine Karotten?",
    options: ["A) Der Autor", "B) Der Bruder des Autors", "C) Die Schwester des Autors", "D) Der Hund des Autors"],
  },
];

const hoerenQuestions = [
  {
    stem: "1. Was isst Anna besonders gerne?",
    options: [
      "A) Äpfel, Bananen und Karotten",
      "B) Toast mit Marmelade",
      "C) Nudeln mit Tomatensauce",
      "D) Kekse",
    ],
  },
  {
    stem: "2. Was isst Annas Bruder zum Frühstück?",
    options: ["A) Müsli mit Joghurt", "B) Toast mit Marmelade", "C) Salat", "D) Käse"],
  },
  {
    stem: "3. Was mag Annas Bruder nicht?",
    options: ["A) Bananen", "B) Kekse", "C) Tomaten", "D) Karotten"],
  },
  {
    stem: "4. Was mag Annas Vater nicht?",
    options: ["A) Käse", "B) Honig", "C) Kuchen", "D) Nudeln"],
  },
  {
    stem: "5. Was backen sie manchmal am Wochenende?",
    options: ["A) Kekse", "B) Toast", "C) Schokoladenkuchen", "D) Brot"],
  },
];

const A1Day16FoodAndDailyLifeWorkbookPage = () => {

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={cardStyle}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <h1 style={{ ...styles.title, marginBottom: 0 }}>A1 · Day 16 Workbook · Food and Negation + Food and Daily Life</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Chapter 9_10</p>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Complete all parts and submit your final answers in the submission area only (not directly on this page).
        </p>
      </div>

      <section style={sectionStyle}>
        <img
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80"
          alt="Fresh fruits and vegetables arranged in a supermarket"
          loading="lazy"
          style={imageStyle}
        />
        <h2 style={{ margin: 0 }}>Teil 1 · Lesen</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Instructions:</strong> Read the text below and choose the correct answer. One answer is correct.
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Text:</strong> Ich gehe oft in den Supermarkt, um Lebensmittel zu kaufen. Ich mag frisches Obst und Gemüse.
          Besonders gerne mag ich Äpfel und Karotten. Mein Bruder mag keine Karotten, er mag lieber Bananen. Wir kaufen
          auch oft Brot und Milch. Mein Vater mag keinen Käse, aber meine Mutter mag Käse sehr. Im Supermarkt gibt es viele
          Sorten Käse. Ich kaufe nie Fleisch, weil ich Vegetarier bin. Meine Schwester isst auch kein Fleisch. Sie mag Tofu
          und Bohnen. Am Wochenende backen wir oft einen Kuchen. Wir alle mögen Schokolade im Kuchen. Mein Hund mag keinen
          Kuchen, aber er mag Kekse.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Teil 2 · Fragen zum Lesen</h2>
        {readingQuestions.map((question) => (
          <div key={question.stem} style={questionBoxStyle}>
            <strong>{question.stem}</strong>
            {question.options.map((option) => (
              <span key={option}>{option}</span>
            ))}
          </div>
        ))}
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Teil 3 · Hören (Listening Comprehension)</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Thema:</strong> Lebensmittel, Mögen und Negation.
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Complete Hören from Google Drive, then return to submit answers.
        </p>
        <CoursebookAudioPlayer
          url="https://drive.google.com/file/d/11v0Goh3UCihxHj3HQIjwaZtgrBjF3zME/view?usp=sharing"
          linkLabel="Open Hören Material (Google Drive)"
          linkStyle={{ ...styles.secondaryButton, textDecoration: "none", width: "fit-content" }}
        />
        {hoerenQuestions.map((question) => (
          <div key={question.stem} style={questionBoxStyle}>
            <strong>{question.stem}</strong>
            {question.options.map((option) => (
              <span key={option}>{option}</span>
            ))}
          </div>
        ))}
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Teil 4 · Schreiben Exercise</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Aufgabe:</strong> Schreiben Sie einen kurzen Text über Ihre Essgewohnheiten. Beantworten Sie dabei folgende
          Fragen.
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Write a short text about your eating habits. Answer the following questions. Use the structure: Subject + Verb +
          Adverb + Food.
        </p>
        <ol style={{ margin: "0 0 0 20px", padding: 0, lineHeight: 1.7 }}>
          <li>Was mögen Sie gerne essen?</li>
          <li>Was mögen Sie nicht essen?</li>
          <li>Was essen Sie zum Frühstück, Mittagessen und Abendessen?</li>
        </ol>
      </section>

      <div style={{ ...cardStyle, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
        <p style={{ margin: 0, fontWeight: 600 }}>
          Submit your workbook answers in the submission area after finishing Teil 1–Teil 4.
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

export default A1Day16FoodAndDailyLifeWorkbookPage;
