import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import A2MiniLearningBlock from "./A2MiniLearningBlock";
import { styles } from "../styles";

const lesson = {
  title: "Imperativ – Anweisungen geben",
  english: "Use the imperative for instructions, recipes and requests. German has different imperative forms for du, ihr and polite Sie.",
  rule: "du: usually verb stem (Schneid!). ihr: normal ihr-form without ihr (Schneidet!). Sie: infinitive + Sie (Schneiden Sie!). Add bitte to make an instruction friendlier.",
  examples: [
    "Schneid die Zwiebel!",
    "Nehmt zwei Tomaten!",
    "Geben Sie bitte etwas Salz dazu.",
    "Warte bitte einen Moment!",
  ],
  commonMistake: "Do not keep the subject pronoun in the du/ihr imperative. Say Schneid die Zwiebel!, not Du schneid die Zwiebel!",
  questions: [
    { stem: "du · schneiden", options: ["Schneid!", "Schneidet!", "Schneiden Sie!"], answer: 0, explanation: "du imperative: usually the verb stem." },
    { stem: "ihr · nehmen", options: ["Nimm!", "Nehmt!", "Nehmen Sie!"], answer: 1, explanation: "ihr imperative uses the normal ihr verb form without ihr." },
    { stem: "Sie · geben", options: ["Gib!", "Gebt!", "Geben Sie!"], answer: 2, explanation: "Formal imperative: infinitive + Sie." },
    { stem: "Welche Bitte klingt höflich?", options: ["Geben Sie bitte die Karte.", "Du geben die Karte.", "Gibt die Karte Sie."], answer: 0, explanation: "Formal request uses Geben Sie and bitte." },
  ],
  outputPrompt: "Gib 4 kurze Anweisungen für ein Rezept oder eine Alltagssituation: eine du-, eine ihr- und zwei Sie-Formen.",
  starters: ["Schneid ...!", "Nehmt ...!", "Geben Sie bitte ...!", "Warten Sie bitte ...!"],
};

const FocusedContent = () => <A2MiniLearningBlock {...lesson} />;

export default function A2Day8ImperativeGrammarPage({ embedded = false }) {
  if (embedded) return <FocusedContent />;
  return <main style={styles.pageWrap}><div style={{ ...styles.container, display: "grid", gap: 16 }}><AppBackButton label="Back" fallbackPath="/campus/course" /><h1 style={{ margin: 0 }}>A2 · Day 8 · Rezepte und Essen</h1><FocusedContent /></div></main>;
}
