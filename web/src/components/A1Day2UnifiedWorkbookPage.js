import React from "react";
import A1TutorMarkedWorkbookShell from "./A1TutorMarkedWorkbookShell";
import { styles } from "../styles";

const block = { ...styles.card, display: "grid", gap: 12 };
const question = { border: "1px solid #e2e8f0", background: "#fff", borderRadius: 10, padding: 12, display: "grid", gap: 6 };
const quiz = [
  ["1. Wie viele Grundbuchstaben hat das deutsche Alphabet?", ["A) 24", "B) 26", "C) 30", "D) 32"]],
  ["2. Welche Buchstaben sind deutsche Umlaute?", ["A) Ä, Ö, Ü", "B) E, I, U", "C) S, T, V", "D) A, B, C"]],
  ["3. Wie nennt man ß?", ["A) Umlaut", "B) Doppel-U", "C) Eszett", "D) I-Punkt"]],
  ["4. Welcher Buchstabe kommt nach J?", ["A) K", "B) L", "C) H", "D) Z"]],
  ["5. Was bedeutet „Wie schreibt man das?“", ["A) How old are you?", "B) How do you spell that?", "C) Where do you live?", "D) What's your name?"]],
];
const pronounQuiz = [
  ["1. ___ lerne Deutsch.", ["A) Ich", "B) Du", "C) Er", "D) Wir"]],
  ["2. ___ wohnst in Accra.", ["A) Wir", "B) Er", "C) Du", "D) Sie (she)"]],
  ["3. Maria ist meine Freundin. ___ heißt Maria.", ["A) Ich", "B) Sie", "C) Wir", "D) Ihr"]],
  ["4. Kojo und ich lernen Deutsch. ___ lernen Deutsch.", ["A) Wir", "B) Du", "C) Er", "D) Ihr"]],
  ["5. Wie heißen ___? (formal, one person)", ["A) du", "B) er", "C) Sie", "D) ich"]],
];
const listening = ["1. W _ _ _ _ r", "2. K _ _ _ _ _", "3. B _ _ _ _", "4. S _ _ _ _ _", "5. T _ _ _ _"];
const verbs = [
  "1. Ich ___ Deutsch. (lernen)",
  "2. Du ___ in Accra. (wohnen)",
  "3. Er ___ Kojo. (heißen)",
  "4. Wir ___ aus Ghana. (kommen)",
  "5. Sie ___ Lehrerin. (sein; sie = she)",
];

const MultipleChoice = ({ items }) => (
  <div style={{ display: "grid", gap: 10 }}>
    {items.map(([stem, options]) => (
      <div key={stem} style={question}>
        <strong>{stem}</strong>
        {options.map(option => <span key={option}>{option}</span>)}
      </div>
    ))}
  </div>
);

export default function A1Day2UnifiedWorkbookPage() {
  return (
    <A1TutorMarkedWorkbookShell
      fallbackAssignmentKey="A1-0.2_1.1"
      title="A1 · Day 2 · Alphabet, Pronouns and First Verbs"
      subtitle="One combined assignment · Five sections · 100 marks"
      assignmentIntro="Complete every section and use Review & Submit once. Each of the five parts is worth 20 marks. Earlier Kapitel 0.2 and 1.1 submissions remain separate historical records."
      submitTitle="Submit A1 · Day 2 Combined Assignment"
      submitDescription="Include all five parts in your submission: Teil 1 (1–5), Teil 2 Hören (1–5), Teil 3 (1–5), Teil 4 (1–5), then your Teil 5 short text. This is a new assignment; previous chapter scores are not transferred."
    >
      <section style={block}>
        <h2 style={{ margin: 0 }}>Teil 1 · Alphabet und Buchstabieren — 20 Punkte</h2>
        <p style={{ margin: 0 }}>Choose A, B, C or D for each question. Use the German letter names from the grammar notes.</p>
        <MultipleChoice items={quiz} />
      </section>
      <section style={block}>
        <h2 style={{ margin: 0 }}>Teil 2 · Hören und Buchstabieren — 20 Punkte</h2>
        <p style={{ margin: 0 }}>Listen to the approved Day 2 alphabet exercise video, then complete the five missing words. Write the full word for each numbered item.</p>
        <a href="https://youtu.be/DeE6LKXyLWs" target="_blank" rel="noreferrer" style={{ ...styles.button, width: "fit-content", textDecoration: "none" }}>Open the Hören video</a>
        <iframe title="Day 2 German alphabet Hören exercise" src="https://www.youtube-nocookie.com/embed/DeE6LKXyLWs?rel=0&playsinline=1" style={{ width: "100%", minHeight: 280, border: 0, borderRadius: 10 }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
        {listening.map(item => <div key={item} style={question}><strong>{item}</strong></div>)}
      </section>
      <section style={block}>
        <h2 style={{ margin: 0 }}>Teil 3 · Personalpronomen — 20 Punkte</h2>
        <p style={{ margin: 0 }}>Choose the correct personal pronoun for each sentence.</p>
        <MultipleChoice items={pronounQuiz} />
      </section>
      <section style={block}>
        <h2 style={{ margin: 0 }}>Teil 4 · Verbkonjugation — 20 Punkte</h2>
        <p style={{ margin: 0 }}>Write the correct present-tense form of the verb in brackets. Do not write the full sentence.</p>
        {verbs.map(item => <div key={item} style={question}><strong>{item}</strong></div>)}
      </section>
      <section style={block}>
        <h2 style={{ margin: 0 }}>Teil 5 · Erste Sätze — 20 Punkte</h2>
        <p style={{ margin: 0 }}>Write four short, correct German sentences: (1) greet the reader, (2) say your name, (3) say where you live, (4) say that you are learning German. Include one spelled-out name (for example A – M – A). Use the correct personal pronoun and verb in each sentence.</p>
        <div style={{ ...question, background: "#eff6ff" }}>Example structure only: Hallo! Ich heiße … / Ich wohne … / Ich lerne … Do not copy this example as your full response.</div>
      </section>
    </A1TutorMarkedWorkbookShell>
  );
}
