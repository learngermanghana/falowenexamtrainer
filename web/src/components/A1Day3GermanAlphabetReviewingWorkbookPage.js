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
    stem: "1. Wie viele Buchstaben hat das deutsche Alphabet?",
    translation: "How many letters does the German alphabet have?",
    options: ["A) 24", "B) 25", "C) 26", "D) 27"],
  },
  {
    stem: "2. Welche zusätzlichen Buchstaben gibt es im deutschen Alphabet?",
    translation: "Which additional letters are there in the German alphabet?",
    options: ["A) Ä, Ö, Ü, ß", "B) Å, È, Ì, Ñ", "C) Á, É, Í, Ó", "D) Â, Ê, Î, Ô"],
  },
  {
    stem: "3. Wie heißt der Buchstabe ß?",
    translation: "What is the letter ß called?",
    options: ["A) Eszett", "B) Scharfes B", "C) Doppel-S", "D) Großes S"],
  },
  {
    stem: "4. Welcher Buchstabe kommt nach J im Alphabet?",
    translation: "Which letter comes after J in the alphabet?",
    options: ["A) K", "B) L", "C) I", "D) M"],
  },
  {
    stem: "5. Wie nennt man den Buchstaben Ä?",
    translation: "What is the letter Ä called?",
    options: ["A) A-Umlaut", "B) E-Umlaut", "C) O-Umlaut", "D) U-Umlaut"],
  },
  {
    stem: "6. Welche Buchstaben gehören nicht zum Standardalphabet, aber werden im Deutschen benutzt?",
    translation: "Which letters are not part of the standard alphabet but are used in German?",
    options: ["A) Ä, Ö, Ü, ß", "B) À, È, Ì, Ò", "C) Á, É, Í, Ó", "D) Å, Ê, Î, Ô"],
  },
  {
    stem: "7. Wie viele zusätzliche Buchstaben gibt es im deutschen Alphabet?",
    translation: "How many additional letters are there in the German alphabet?",
    options: ["A) 3", "B) 4", "C) 5", "D) 6"],
  },
];

const A1Day3GermanAlphabetReviewingWorkbookPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={cardStyle}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>A1 · Day 3 Workbook · German Alphabet + Reviewing</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Chapter 0.2</p>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Complete all sections on this page, then submit your final answers in the submission area, not directly on this page.
        </p>
      </div>

      <section style={sectionStyle}>
        <img
          src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1600&q=80"
          alt="Open notebook with alphabet study notes on a classroom desk"
          loading="lazy"
          style={imageStyle}
        />
        <h2 style={{ margin: 0 }}>Teil 1 · Reading and Writing</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Instruction:</strong> Read the text carefully and answer the questions below. Each question has one correct
          answer.
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Text:</strong> The German alphabet has 26 letters. There are also some additional letters like Ä, Ö, Ü, and
          ß, which is called "Eszett" or "sharp S." Each letter has a name and a sound. The letters of the alphabet are: A,
          B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z. The additional letters are: Ä, Ö, Ü,
          and ß. The alphabet is often used to spell words, write names, and learn in school. For example: A as in Apfel
          (apple), B as in Ball (ball), C as in Computer (computer), D as in Deutschland (Germany). It is important to know
          the alphabet well in order to read and write correctly.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Teil 2 · Questions</h2>
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
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Instruction:</strong> Listen to the audio of a native speaker spelling out words. Write down the letters you
          hear.
        </p>
        <a
          href="https://drive.google.com/file/d/1fPjvzp0V05rNSohX7juS0qqvvcMHGmLb/view?usp=sharing"
          target="_blank"
          rel="noreferrer"
          style={{ ...styles.button, width: "fit-content", textDecoration: "none" }}
        >
          Open Hören Material (Google Drive)
        </a>
        <p style={{ margin: 0, color: "#4b5563" }}>
          Complete Hören from Google Drive, then return to submit answers.
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          1. W _ _ s _ _ r<br />
          2. K _ _ f _<br />
          3. B _ _ _ _ _<br />
          4. S _ _ _ _ _<br />
          5. T _ _ _ _
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Vocabulary Notes · Alphabet in German</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Additional Letters (Zusätzliche Buchstaben):</strong> Ä (A-Umlaut), Ö (O-Umlaut), Ü (U-Umlaut), ß (Eszett /
          scharfes S).<br />
          <strong>Example Words (Beispielwörter):</strong> Apfel, Ball, Computer, Deutschland.<br />
          <strong>Useful Phrases:</strong> Wie buchstabiert man...?, Wie viele Buchstaben...?, Welche Buchstaben...?, Das
          Alphabet, der Buchstabe, das Wort, das Lesen, das Schreiben, lernen, buchstabieren, richtig, falsch.
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

export default A1Day3GermanAlphabetReviewingWorkbookPage;
