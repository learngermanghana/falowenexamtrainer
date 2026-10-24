import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import A2MiniLearningBlock from "./A2MiniLearningBlock";
import { styles } from "../styles";

const lesson = {
  title: "Über Zukunftspläne sprechen",
  english: "German often uses the present tense with a future time phrase. You can also use möchte for intentions and werden + infinitive for a clear future statement.",
  rule: "Future time + Präsens: Nächstes Jahr mache ich .... Intention: ich möchte + infinitive. Futur I: werden (position 2) + infinitive at the end.",
  examples: [
    "Nächstes Jahr mache ich eine Weiterbildung.",
    "Ich möchte später im Ausland arbeiten.",
    "In fünf Jahren werde ich mehr Berufserfahrung haben.",
    "Wir werden nächstes Jahr umziehen.",
  ],
  commonMistake: "With werden, keep the main infinitive at the end: Ich werde nächstes Jahr studieren, not Ich werde studieren nächstes Jahr.",
  questions: [
    { stem: "Nächstes Jahr ___ ich einen Deutschkurs.", options: ["mache", "gemacht", "machen werde ich"], answer: 0, explanation: "Present tense plus a future time phrase is very common." },
    { stem: "Ich möchte später im Ausland ___.", options: ["arbeite", "arbeiten", "gearbeitet"], answer: 1, explanation: "After möchte, use the infinitive." },
    { stem: "In fünf Jahren ___ ich mehr Erfahrung haben.", options: ["werde", "bin", "habe"], answer: 0, explanation: "Futur I uses werden + infinitive." },
    { stem: "Welche Wortstellung ist richtig?", options: ["Ich werde in Berlin arbeiten.", "Ich arbeiten werde in Berlin.", "Ich werde arbeiten in Berlin morgen."], answer: 0, explanation: "werden is in position 2 and the infinitive goes to the end." },
  ],
  outputPrompt: "Sprich in 5 Sätzen über deine Zukunft: nächstes Jahr, Beruf/Bildung, persönlicher Wunsch und ein Plan in fünf Jahren.",
  starters: ["Nächstes Jahr ...", "Ich möchte ...", "Später werde ich ...", "In fünf Jahren werde ich ..."],
};

const FocusedContent = () => <A2MiniLearningBlock essential {...lesson} />;

export default function A2Day28UeberDieZukunftSprechenGrammarPage({ embedded = false }) {
  if (embedded) return <FocusedContent />;
  return <main style={styles.pageWrap}><div style={{ ...styles.container, display: "grid", gap: 16 }}><AppBackButton label="Back" fallbackPath="/campus/course" /><h1 style={{ margin: 0 }}>A2 · Day 28 · Über die Zukunft sprechen</h1><FocusedContent /></div></main>;
}
