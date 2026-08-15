import React from "react";
import A1TutorMarkedWorkbookShell from "./A1TutorMarkedWorkbookShell";
import CoursebookAudioPlayer from "./CoursebookAudioPlayer";
import { styles } from "../styles";

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

const QuestionList = ({ questions }) => (
  <div style={{ display: "grid", gap: 10 }}>
    {questions.map((question) => (
      <div key={question.stem} style={questionBoxStyle}>
        <strong>{question.stem}</strong>
        {question.options.map((option) => (
          <span key={option}>{option}</span>
        ))}
      </div>
    ))}
  </div>
);

const A1Day16FoodAndDailyLifeWorkbookPage = () => (
  <A1TutorMarkedWorkbookShell
    day={16}
    chapter="9"
    fallbackAssignmentKey="A1-9"
    title="A1 · Day 16 Workbook · Negation and Food"
    subtitle="Chapter 9 · Tutor-marked assignment"
    assignmentIntro="Complete all three parts below. Then open Submit and send your numbered answers and writing task to your tutor."
    submitTitle="Submit A1 · Day 16 · Chapter 9"
    submitDescription="This submission is locked to A1-9, so your Chapter 9 work is saved under the correct tutor-marked assignment."
  >
    <div data-a1-day16-chapter9-workbook-content="true" style={{ display: "grid", gap: 16 }}>
      <section style={{ ...sectionStyle, border: "1px solid #93c5fd", background: "#eff6ff" }}>
        <strong style={{ color: "#1d4ed8" }}>Tutor-marked assignment · A1-9</strong>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Use the Assignment tab to complete the workbook. When you finish, open the Submit tab and send your final answers.
        </p>
        <a
          href="/campus/course/food-and-negation-day-16-9-10"
          style={{ ...styles.secondaryButton, width: "fit-content", textDecoration: "none" }}
        >
          Review grammar notes
        </a>
      </section>

      <section style={sectionStyle}>
        <img
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80"
          alt="Fresh fruits and vegetables arranged in a supermarket"
          loading="lazy"
          style={imageStyle}
        />
        <h2 style={{ margin: 0 }}>Teil 1 · Lesen</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Instructions:</strong> Read the text and choose the correct answer for questions 1–10. Only one answer is correct.
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Text:</strong> Ich gehe oft in den Supermarkt, um Lebensmittel zu kaufen. Ich mag frisches Obst und Gemüse.
          Besonders gerne mag ich Äpfel und Karotten. Mein Bruder mag keine Karotten, er mag lieber Bananen. Wir kaufen
          auch oft Brot und Milch. Mein Vater mag keinen Käse, aber meine Mutter mag Käse sehr. Im Supermarkt gibt es viele
          Sorten Käse. Ich kaufe nie Fleisch, weil ich Vegetarier bin. Meine Schwester isst auch kein Fleisch. Sie mag Tofu
          und Bohnen. Am Wochenende backen wir oft einen Kuchen. Wir alle mögen Schokolade im Kuchen. Mein Hund mag keinen
          Kuchen, aber er mag Kekse.
        </p>
        <QuestionList questions={readingQuestions} />
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Teil 2 · Hörverstehen</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Thema:</strong> Lebensmittel, mögen and negation. Listen to the material, then answer questions 1–5.
        </p>
        <CoursebookAudioPlayer
          url="https://drive.google.com/file/d/11v0Goh3UCihxHj3HQIjwaZtgrBjF3zME/view?usp=sharing"
          linkLabel="Open listening material"
          linkStyle={{ ...styles.secondaryButton, textDecoration: "none", width: "fit-content" }}
        />
        <QuestionList questions={hoerenQuestions} />
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Teil 3 · Schreiben</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Schreiben Sie einen kurzen Text über Ihre Essgewohnheiten. Answer all three questions in complete sentences.
        </p>
        <ol style={{ margin: "0 0 0 20px", padding: 0, lineHeight: 1.7 }}>
          <li>Was mögen Sie gerne essen?</li>
          <li>Was mögen Sie nicht essen?</li>
          <li>Was essen Sie zum Frühstück, Mittagessen und Abendessen?</li>
        </ol>
      </section>
    </div>
  </A1TutorMarkedWorkbookShell>
);

export default A1Day16FoodAndDailyLifeWorkbookPage;
