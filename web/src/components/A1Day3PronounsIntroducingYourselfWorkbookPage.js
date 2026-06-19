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
  maxHeight: 280,
  objectFit: "cover",
};

const questionBoxStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 12,
  display: "grid",
  gap: 8,
  background: "#fff",
};

const multipleChoiceQuestions = [
  {
    stem: "1. Wie heißt die Sprecherin?",
    options: ["A) Anna", "B) Maria", "C) Julia", "D) Lisa"],
  },
  {
    stem: "2. Woher kommt Anna?",
    options: ["A) Aus Deutschland", "B) Aus Spanien", "C) Aus Italien", "D) Aus Österreich"],
  },
  {
    stem: "3. Wo wohnt Anna jetzt?",
    options: ["A) In München", "B) In Hamburg", "C) In Wien", "D) In Berlin"],
  },
  {
    stem: "4. Wie heißt Annas Freund?",
    options: ["A) Peter", "B) Tom", "C) Daniel", "D) Lukas"],
  },
  {
    stem: "5. Wo wohnt Tom?",
    options: ["A) In Berlin", "B) In Frankfurt", "C) In Köln", "D) In Leipzig"],
  },
];

const A1Day3PronounsIntroducingYourselfWorkbookPage = () => {

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={cardStyle}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <h1 style={{ ...styles.title, marginBottom: 0 }}>
          A1 · Day 3 Workbook · Pronouns and Identity Expressions in German
        </h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Chapter 1.1</p>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Complete this workbook and submit your final answers in the submission area, not on this page.
        </p>
      </div>

      <section style={sectionStyle}>
        <img
          src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1600&q=80"
          alt="Student writing personal introduction notes in a German workbook"
          loading="lazy"
          style={imageStyle}
        />
        <h2 style={{ margin: 0 }}>Teil 1 · Lesen</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Reading Passage: Introducing Yourself (Exercise) (16.6 Marks)</strong>
          <br />
          Hallo! Ich heiße Anna. Ich komme aus Spanien und ich wohne in Madrid. Wie heißt du? Woher kommst du? Wo
          wohnst du? Mein Freund Peter kommt aus Deutschland und wohnt in Berlin. Er heißt Peter.
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Exercise: Complete the Sentences</strong> (Use the verbs <em>heiBen</em>, <em>wohnen</em> and <em>kommen</em>.
          Please conjugate the verb to match the pronoun.)
        </p>
        <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
          <li>Ich ___ Anna.</li>
          <li>Du ___ Max.</li>
          <li>Er ___ Peter.</li>
          <li>Wir ___ aus Italien.</li>
          <li>Ihr ___ aus Brasilien.</li>
          <li>Sie ___ aus Russland.</li>
          <li>Ich ___ in Berlin.</li>
          <li>Du ___ in Madrid.</li>
          <li>Sie ___ in Wien. (formal Sie)</li>
        </ol>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Teil 2 · Schreiben (Exercise)</h2>
        <div style={questionBoxStyle}>
          <strong>Writing Task: Introduce Yourself (16.6)</strong>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Using the information about yourself, write a short paragraph. Include the following details:
          </p>
          <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
            <li>Your name</li>
            <li>Where you come from</li>
            <li>Where you live</li>
            <li>A greeting</li>
          </ol>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <em>Example:</em> Hallo! Ich heiße Anna. Ich komme aus Spanien und ich wohne in Madrid.
          </p>
        </div>

      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Teil 3 · Hören</h2>
        <CoursebookAudioPlayer
          url="https://drive.google.com/file/d/13LAdG1vlR6Bcid2NycKO0BEROpuHv7-f/view?usp=sharing"
          linkLabel="Open Hören Material (Google Drive)"
          linkStyle={{ ...styles.button, width: "fit-content", textDecoration: "none" }}
        />
        <p style={{ margin: 0, color: "#4b5563" }}>
          Complete Hören from Google Drive, then return to submit answers.
        </p>

        <h3 style={{ margin: 0 }}>Fragen und Multiple-Choice-Antworten</h3>
        {multipleChoiceQuestions.map((question) => (
          <div key={question.stem} style={questionBoxStyle}>
            <strong>{question.stem}</strong>
            {question.options.map((option) => (
              <span key={option}>{option}</span>
            ))}
          </div>
        ))}

        <div style={{ ...questionBoxStyle, background: "#f9fafb" }}>
          <strong>Vocabulary for the Chapter</strong>
          <p style={{ margin: 0 }}>
            <strong>Greetings:</strong> Hallo! · Guten Tag! · Guten Morgen! · Guten Abend!
          </p>
          <p style={{ margin: 0 }}>
            <strong>Personal Information:</strong> der Name (name), das Land (country), die Stadt (city), die Straße
            (street), die Adresse (address)
          </p>
        </div>
      </section>

      <div style={{ ...cardStyle, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
        <p style={{ margin: 0, fontWeight: 600 }}>
          Finished the workbook? Please submit all answers in the submission area.
        </p>
        <a
          href="/campus/course?submitWork=1"
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

export default A1Day3PronounsIntroducingYourselfWorkbookPage;
