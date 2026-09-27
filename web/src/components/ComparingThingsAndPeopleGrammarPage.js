import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import A2MiniLearningBlock from "./A2MiniLearningBlock";
import { styles } from "../styles";

const lesson = {
  title: "Komparativ und Superlativ – Dinge und Personen vergleichen",
  english: "Use the comparative to compare two things and the superlative for the highest degree. Use als after a comparative and wie for equal comparison.",
  rule: "Komparativ: adjective + -er + als. Superlativ: am + adjective + -sten/-esten. Equal comparison: genauso ... wie.",
  examples: [
    "Der Bus ist schneller als das Fahrrad.",
    "Anna ist genauso freundlich wie Mia.",
    "Dieses Hotel ist am günstigsten.",
    "gut → besser → am besten",
  ],
  commonMistake: "Do not use wie after a comparative. Say größer als, not größer wie.",
  questions: [
    { stem: "Peter ist ___ als Tom. (groß)", options: ["groß", "größer", "am größten"], answer: 1, explanation: "Two people are compared: größer als." },
    { stem: "Anna ist genauso freundlich ___ Mia.", options: ["als", "wie", "am"], answer: 1, explanation: "Equal comparison uses genauso ... wie." },
    { stem: "Welches Auto ist ___? (schnell)", options: ["am schnellsten", "schneller als", "schnell"], answer: 0, explanation: "The highest degree uses am schnellsten." },
    { stem: "gut → ?", options: ["guter → am gutesten", "besser → am besten", "mehr gut → am mehr gut"], answer: 1, explanation: "gut is irregular: besser, am besten." },
  ],
  outputPrompt: "Vergleiche zwei Verkehrsmittel, zwei Personen oder zwei Orte in 4 Sätzen.",
  starters: ["... ist ...er als ...", "... ist genauso ... wie ...", "... ist am ...sten."],
};

const FocusedContent = () => <A2MiniLearningBlock {...lesson} />;

export default function ComparingThingsAndPeopleGrammarPage({ embedded = false }) {
  if (embedded) return <FocusedContent />;
  return <main style={styles.pageWrap}><div style={{ ...styles.container, display: "grid", gap: 16 }}><AppBackButton label="Back" fallbackPath="/campus/course" /><h1 style={{ margin: 0 }}>A2 · Day 3 · Dinge und Personen vergleichen</h1><FocusedContent /></div></main>;
}
