import React from "react";
import A1TutorMarkedWorkbookShell from "./A1TutorMarkedWorkbookShell";

import { styles } from "../styles";

const HOEREN_YOUTUBE_ID = "3p-Vl1HsOok";

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

const videoFrameStyle = {
  position: "relative",
  width: "100%",
  paddingTop: "56.25%",
  borderRadius: 12,
  overflow: "hidden",
  background: "#000",
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
    <A1TutorMarkedWorkbookShell
      day={3}
      chapter="1.2"
      fallbackAssignmentKey="A1-1.2"
      title="A1 · Day 3 Workbook · Pronouns and Identity Expressions in German"
      subtitle="Chapter 1.2 · Tutor-marked assignment"
      submitTitle="Submit A1 · Day 3 · Chapter 1.2"
    >
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
          Hallo! Ich heiße Anna. Ich komme aus Spanien und ich wohne in Madrid. Wie heißt du? Woher kommst du? Wo wohnst du?
          Mein Freund Peter kommt aus Deutschland und wohnt in Berlin. Er heißt Peter.
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
        <div style={videoFrameStyle} data-a1-day3-hoeren-youtube={HOEREN_YOUTUBE_ID}>
          <iframe
            title="A1 Day 3 Kapitel 1.2 Hören"
            src={`https://www.youtube-nocookie.com/embed/${HOEREN_YOUTUBE_ID}`}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <p style={{ margin: 0, color: "#4b5563" }}>
          Listen to the embedded Hören video, then answer the questions below.
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
            <strong>Personal Information:</strong> der Name (name), das Land (country), die Stadt (city), die Straße (street), die
            Adresse (address)
          </p>
        </div>
      </section>
    </A1TutorMarkedWorkbookShell>
  );
};

export default A1Day3PronounsIntroducingYourselfWorkbookPage;
