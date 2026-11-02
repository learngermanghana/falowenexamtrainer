import React from "react";
import A1TutorMarkedWorkbookShell from "./A1TutorMarkedWorkbookShell";
import { styles } from "../styles";

const block = { ...styles.card, display: "grid", gap: 12 };
const question = { border: "1px solid #e2e8f0", background: "#fff", borderRadius: 10, padding: 12, display: "grid", gap: 6 };
// Keep these items in the same order as the registered Day 2 marking key.
const quiz = [
  ["1. Which German word is spelled ha – uh – en – day?", ["A) Hase", "B) Hund", "C) Heiß", "D) Hagel"]],
  ["2. Which German word is spelled es – ah – el – tset?", ["A) Sauer", "B) Sitz", "C) Scharf", "D) Salz"]],
  ["3. Which German word is spelled kah – ah – tay – tset – ay?", ["A) Katze", "B) Käse", "C) Kaffee", "D) Kamin"]],
  ["4. Which character represents a double 's' sound and is called scharfes S?", ["A) Ä", "B) Ö", "C) Ü", "D) ß"]],
];
const formalityQuiz = [
  ["1. You are speaking formally to a teacher or business partner. Which pronoun do you use?", ["A) du", "B) ihr", "C) Sie"]],
  ["2. You are talking to your best friend at university. Which pronoun do you use?", ["A) du", "B) ihr", "C) Sie"]],
  ["3. You are addressing a group of three close friends. Which pronoun do you use?", ["A) du", "B) ihr", "C) Sie"]],
  ["4. Guten Tag, Frau Müller! Wie heißen _____?", ["A) du", "B) Sie", "C) sie"]],
  ["5. You are asking two customers politely: Woher kommen _____?", ["A) ihr", "B) du", "C) Sie"]],
];
const pronounQuiz = [
  ["1. ___ lerne Deutsch.", ["A) Ich", "B) Du", "C) Er", "D) Wir"]],
  ["2. ___ wohnst in Accra.", ["A) Wir", "B) Er", "C) Du", "D) Sie (she)"]],
  ["3. Maria ist meine Freundin. ___ heißt Maria.", ["A) Ich", "B) Sie", "C) Wir", "D) Ihr"]],
  ["4. Kojo und ich lernen Deutsch. ___ lernen Deutsch.", ["A) Wir", "B) Du", "C) Er", "D) Ihr"]],
  ["5. Wie heißen ___? (formal, one person)", ["A) du", "B) er", "C) Sie", "D) ich"]],
];
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
      submitDescription="Include all five parts in your submission: Teil 1 (1–5), Teil 2 formality (1–5), Teil 3 (1–5), Teil 4 (1–5), then your Teil 5 short text. This is a new assignment; previous chapter scores are not transferred."
    >
      <section style={block}>
        <h2 style={{ margin: 0 }}>Teil 1 · Alphabet und Buchstabieren — 20 Punkte</h2>
        <p style={{ margin: 0 }}>Übung 1 · Phonetisches Wörter-Rätsel. Read the German letter names in the sequence and identify the spelled word.</p>
        <MultipleChoice items={quiz} />
        <div style={question}><strong>5. Which letter is A with two dots above it (as in Apfel → Äpfel)?</strong><span>Write the German letter or its name (A-Umlaut) in your answer box below.</span></div>
      </section>
      <section style={block}>
        <h2 style={{ margin: 0 }}>Teil 2 · du, ihr oder Sie? — 20 Punkte</h2>
        <p style={{ margin: 0 }}>Übung 4 · Formality & Context Choice. Choose du, ihr, or Sie for each situation. Use formal Sie when speaking politely, including to more than one customer.</p>
        <MultipleChoice items={formalityQuiz} />
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
