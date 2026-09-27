import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import A2MiniLearningBlock from "./A2MiniLearningBlock";
import { styles } from "../styles";

const lesson = {
  title: "Perfekt – über Urlaub und Vergangenes sprechen",
  english: "Perfekt is the main spoken past tense. Build it with haben or sein plus a past participle. The auxiliary is in position 2 and the participle goes to the end.",
  rule: "Most verbs use haben. Many movement/change verbs use sein. Regular participles often use ge- + stem + -t; common irregular participles must be learned.",
  examples: [
    "Ich habe ein Hotel gebucht.",
    "Wir sind nach Berlin gefahren.",
    "Sie hat viele Fotos gemacht.",
    "Am Sonntag sind wir spät angekommen.",
  ],
  commonMistake: "Do not put the participle next to the auxiliary in a normal main clause. Say Ich habe gestern ein Hotel gebucht, not Ich habe gebucht gestern ein Hotel.",
  questions: [
    { stem: "Ich ___ nach Hamburg gefahren.", options: ["habe", "bin", "werde"], answer: 1, explanation: "fahren as movement normally uses sein." },
    { stem: "Sie ___ ein Hotel gebucht.", options: ["hat", "ist", "wird"], answer: 0, explanation: "buchen uses haben." },
    { stem: "lernen → ?", options: ["gelernen", "gelernt", "lerntge"], answer: 1, explanation: "Regular participle: gelernt." },
    { stem: "Welche Wortstellung ist richtig?", options: ["Wir haben am Wochenende gearbeitet.", "Wir gearbeitet haben am Wochenende.", "Wir haben gearbeitet am Wochenende immer."], answer: 0, explanation: "Auxiliary in position 2, participle at the end." },
  ],
  outputPrompt: "Erzähle in 4–5 Sätzen von einem Urlaub oder Wochenende. Benutze mindestens einmal haben und einmal sein im Perfekt.",
  starters: ["Ich habe ... gemacht.", "Wir sind ... gefahren.", "Am Samstag habe ich ...", "Danach sind wir ..."],
};

const FocusedContent = () => <A2MiniLearningBlock {...lesson} />;

export default function A2Day9PerfektGrammarPage({ embedded = false }) {
  if (embedded) return <FocusedContent />;
  return <main style={styles.pageWrap}><div style={{ ...styles.container, display: "grid", gap: 16 }}><AppBackButton label="Back" fallbackPath="/campus/course" /><h1 style={{ margin: 0 }}>A2 · Day 9 · Urlaub</h1><FocusedContent /></div></main>;
}
