import React, { useEffect } from "react";
import A1TutorMarkedWorkbookShell from "./A1TutorMarkedWorkbookShell";
import { updatePageMeta } from "../lib/pageMeta";
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

const DAY_2_ALPHABET_HOREN_YOUTUBE_URL = "https://youtu.be/DeE6LKXyLWs";
const DAY_2_ALPHABET_HOREN_EMBED_URL = "https://www.youtube.com/embed/DeE6LKXyLWs";

const listeningItems = [
  { number: 1, prompt: "W _ _ s _ _ r" },
  { number: 2, prompt: "K _ _ f _" },
  { number: 3, prompt: "B _ _ _ _" },
  { number: 4, prompt: "S _ _ _ _ _" },
  { number: 5, prompt: "T _ _ _ _" },
];

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

const listeningBoxStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 12,
  display: "grid",
  gap: 8,
  background: "#fff",
};

const videoPreviewStyle = {
  width: "100%",
  minHeight: 315,
  border: 0,
  borderRadius: 10,
};

const A1Day3GermanAlphabetReviewingWorkbookPage = () => {
  useEffect(() => {
    updatePageMeta({
      title: "A1 · Day 2 Workbook · German Alphabet + Reviewing",
      canonicalPath: "/campus/course/a1-day-2-german-alphabet-reviewing-workbook",
    });
  }, []);

  return (
    <A1TutorMarkedWorkbookShell
      day={2}
      chapter="0.2"
      fallbackAssignmentKey="A1-0.2"
      title="A1 · Day 2 Workbook · German Alphabet + Reviewing"
      subtitle="Chapter 0.2 · Assignment for tutor marking"
      assignmentIntro="Complete Teil 1 + Teil 2 and Teil 3, then open Submit to send your final answers for A1-0.2."
      submitTitle="Submit A1 · Day 2 · German Alphabet"
      submitDescription="This submission is locked to A1-0.2."
    >
      <section style={sectionStyle}>
        <img
          src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1600&q=80"
          alt="Open notebook with alphabet study notes on a classroom desk"
          loading="lazy"
          style={imageStyle}
        />
        <h2 style={{ margin: 0 }}>Teil 1 + Teil 2 · Reading and Questions</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Instruction:</strong> Read the text carefully and answer the questions directly below it. Each question has one correct answer.
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Text:</strong> The German alphabet has 26 letters. There are also some additional letters like Ä, Ö, Ü, and ß,
          which is called "Eszett" or "sharp S." Each letter has a name and a sound. The letters of the alphabet are: A, B, C, D,
          E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z. The additional letters are: Ä, Ö, Ü, and ß. The
          alphabet is often used to spell words, write names, and learn in school. For example: A as in Apfel (apple), B as in Ball
          (ball), C as in Computer (computer), D as in Deutschland (Germany). It is important to know the alphabet well in order to
          read and write correctly.
        </p>
        <h3 style={{ margin: "8px 0 0" }}>Questions</h3>
        {questions.map((question) => (
          <div key={question.stem} style={questionBoxStyle}>
            <strong>{question.stem}</strong>
            <span style={{ color: "#4b5563" }}>Translation: {question.translation}</span>
            {question.options.map((option) => <span key={option}>{option}</span>)}
          </div>
        ))}
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Teil 3 · Hören</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Instruction:</strong> Watch and listen to the embedded YouTube Hören video. Write the missing letters to complete
          each word, then return and submit your answers.
        </p>
        <p style={{ margin: 0, color: "#4b5563" }}>
          Complete Hören with the YouTube video below, then return to submit answers.
        </p>
        <iframe
          title="A1 Day 2 German Alphabet Hören video"
          src={DAY_2_ALPHABET_HOREN_EMBED_URL}
          style={videoPreviewStyle}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
        <a
          href={DAY_2_ALPHABET_HOREN_YOUTUBE_URL}
          target="_blank"
          rel="noreferrer"
          style={{ ...styles.button, width: "fit-content", textDecoration: "none" }}
        >
          Open Hören video on YouTube
        </a>
        <div style={{ display: "grid", gap: 12 }}>
          {listeningItems.map((item) => (
            <div key={item.number} style={listeningBoxStyle}>
              <strong style={{ fontSize: 16 }}>{item.number}. {item.prompt}</strong>
            </div>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Vocabulary Notes · Alphabet in German</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Additional Letters (Zusätzliche Buchstaben):</strong> Ä (A-Umlaut), Ö (O-Umlaut), Ü (U-Umlaut), ß (Eszett /
          scharfes S).
          <br />
          <strong>Example Words (Beispielwörter):</strong> Apfel, Ball, Computer, Deutschland.
          <br />
          <strong>Useful Phrases:</strong> Wie buchstabiert man...?, Wie viele Buchstaben...?, Welche Buchstaben...?, Das Alphabet,
          der Buchstabe, das Wort, das Lesen, das Schreiben, lernen, buchstabieren, richtig, falsch.
        </p>
      </section>

      <div style={{ ...cardStyle, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
        <p style={{ margin: 0, fontWeight: 600 }}>
          Finished the workbook? Open the Submit tab and paste your final answers there.
        </p>
      </div>
    </A1TutorMarkedWorkbookShell>
  );
};

export default A1Day3GermanAlphabetReviewingWorkbookPage;
