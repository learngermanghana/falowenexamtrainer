import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import A2MiniLearningBlock from "./A2MiniLearningBlock";
import { styles } from "../styles";

const lesson = {
  title: "Adjektivendungen nach ein/eine – Nominativ und Akkusativ",
  english: "The adjective ending depends on gender and case. At this stage, focus only on ein/eine/einen + adjective in nominative and accusative.",
  rule: "Nominativ: ein großer Mann, eine nette Frau, ein kleines Kind. Akkusativ changes mainly masculine: einen großen Mann. Feminine and neuter keep the same pattern as nominative.",
  examples: [
    "Das ist ein großer Mann.",
    "Das ist eine nette Kollegin.",
    "Ich sehe einen großen Mann.",
    "Ich kaufe ein neues Handy.",
  ],
  commonMistake: "Do not use -en everywhere. Masculine accusative is einen großen Mann, but feminine is eine nette Frau and neuter is ein kleines Kind.",
  questions: [
    { stem: "Das ist ___ nett___ Kollege.", options: ["ein netter", "einen netten", "eine nette"], answer: 0, explanation: "Kollege is masculine and the subject is nominative: ein netter Kollege." },
    { stem: "Ich sehe ___ groß___ Hund.", options: ["ein großer", "einen großen", "eine große"], answer: 1, explanation: "Hund is masculine and the object is accusative: einen großen Hund." },
    { stem: "Sie hat ___ neu___ Tasche.", options: ["eine neue", "einen neuen", "ein neues"], answer: 0, explanation: "Tasche is feminine: eine neue Tasche." },
    { stem: "Wir kaufen ___ klein___ Auto.", options: ["ein kleines", "einen kleinen", "eine kleine"], answer: 0, explanation: "Auto is neuter: ein kleines Auto." },
  ],
  outputPrompt: "Beschreibe eine Person oder Sache in 4 Sätzen. Benutze mindestens zwei Formen mit ein/eine/einen + Adjektiv.",
  starters: ["Das ist ein/eine ...", "Er/Sie hat ein/eine ...", "Ich sehe einen/eine/ein ..."],
};

const FocusedContent = () => <A2MiniLearningBlock {...lesson} />;

export default function A2Day2Kapitel12GrammarNotesPage({ embedded = false }) {
  if (embedded) return <FocusedContent />;
  return <main style={styles.pageWrap}><div style={{ ...styles.container, display: "grid", gap: 16 }}><AppBackButton label="Back" fallbackPath="/campus/course" /><h1 style={{ margin: 0 }}>A2 · Day 2 · Personen beschreiben</h1><FocusedContent /></div></main>;
}
