import React from "react";
import A1TutorMarkedWorkbookShell from "./A1TutorMarkedWorkbookShell";
import { styles } from "../styles";

const HOEREN_VIDEO_URL = "https://youtu.be/nih5h7B48NY";
const HOEREN_EMBED_URL = "https://www.youtube-nocookie.com/embed/nih5h7B48NY?rel=0&playsinline=1";

const card = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const questionBox = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 12,
  display: "grid",
  gap: 7,
  background: "#ffffff",
};

const videoStyle = {
  width: "100%",
  minHeight: 315,
  border: 0,
  borderRadius: 12,
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

const A1Day2Kapitel11WorkbookPage = () => (
  <A1TutorMarkedWorkbookShell
    fallbackAssignmentKey="A1-1.1"
    title="A1 · Day 2 Workbook · Kapitel 1.1"
    subtitle="Personal Pronouns and Verb Conjugation · Tutor-marked assignment"
    assignmentIntro="Complete Teil 1 and Teil 2 only. Then open Submit and send all final answers for tutor marking."
    submitTitle="Submit A1 · Day 2 · Kapitel 1.1"
    submitDescription="This submission is locked to A1-1.1. Submit the four listening answers and your Teil 2 writing text."
  >
    <div style={{ display: "grid", gap: 16 }} data-a1-day2-chapter11-workbook="true">
      <section style={card}>
        <h2 style={{ margin: 0 }}>Teil 1 · Hören</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Watch and listen to the video about introducing yourself, the alphabet and introducing a friend. Then choose the correct answer for questions 1–4.
        </p>
        <a
          href={HOEREN_VIDEO_URL}
          target="_blank"
          rel="noreferrer"
          style={{ ...styles.button, width: "fit-content", textDecoration: "none" }}
        >
          Open Hören video on YouTube
        </a>
        <iframe
          title="A1 Day 2 Kapitel 1.1 Hören video"
          src={HOEREN_EMBED_URL}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={videoStyle}
        />
        {questions.map((question) => (
          <div key={question.stem} style={questionBox}>
            <strong>{question.stem}</strong>
            <span style={{ color: "#4b5563" }}>Translation: {question.translation}</span>
            {question.options.map((option) => (
              <span key={option}>{option}</span>
            ))}
          </div>
        ))}
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>Teil 2 · Schreiben</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Introducing Yourself in German</strong>
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Write a short text introducing yourself. Use the simple sentences and vocabulary from the lesson. Include your name, where you come from and where you live. Use at least one greeting and one farewell.
        </p>
        <div style={{ ...questionBox, background: "#f8fafc" }}>
          <strong>Write your text with these five points:</strong>
          <span>1. Begin with a greeting, for example: Hallo! or Guten Morgen!</span>
          <span>2. Introduce yourself: Ich heiße …</span>
          <span>3. Say where you come from: Ich komme aus …</span>
          <span>4. Say where you live: Ich wohne in …</span>
          <span>5. End with a farewell, for example: Tschüss! or Gute Nacht!</span>
        </div>
      </section>
    </div>
  </A1TutorMarkedWorkbookShell>
);

export default A1Day2Kapitel11WorkbookPage;
