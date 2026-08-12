import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import A2MiniLearningBlock from "./A2MiniLearningBlock";
import { styles } from "../styles";

const lesson = {
  title: "Wochenende planen: wenn, ob und falls",
  rule: "wenn und falls nennen eine Bedingung. ob benutzt du bei einer indirekten Ja/Nein-Frage. In diesen Nebensätzen steht das konjugierte Verb am Ende.",
  examples: [
    "Wenn das Wetter gut ist, gehen wir in den Park.",
    "Falls es regnet, bleiben wir zu Hause.",
    "Ich weiß nicht, ob Anna am Samstag Zeit hat.",
    "Wenn du Zeit hast, können wir uns um 15 Uhr treffen.",
  ],
  questions: [
    { stem: "___ das Wetter gut ist, machen wir ein Picknick.", options: ["Wenn", "Ob", "Denn"], answer: 0, explanation: "wenn nennt eine Bedingung." },
    { stem: "Ich weiß nicht, ___ Paul kommen kann.", options: ["wenn", "ob", "als"], answer: 1, explanation: "ob leitet eine indirekte Ja/Nein-Frage ein." },
    { stem: "Welcher Satz ist richtig?", options: ["Falls es regnet, wir bleiben zu Hause.", "Falls es regnet, bleiben wir zu Hause.", "Falls regnet es, bleiben wir zu Hause."], answer: 1, explanation: "Im falls-Satz steht das Verb am Ende; danach beginnt der Hauptsatz mit dem Verb." },
    { stem: "Was passt? Wenn du morgen Zeit ___, treffen wir uns.", options: ["hast", "haben", "hat"], answer: 0, explanation: "du hast; im Nebensatz steht hast am Ende." },
  ],
  outputPrompt: "Plane ein Wochenende in 4–5 Sätzen. Benutze wenn oder falls und eine Frage mit ob.",
  starters: ["Wenn ..., ...", "Falls ..., ...", "Ich weiß noch nicht, ob ...", "Wir können ..."],
};

export default function A2Day21EinWochenendePlanenWennObFallsGrammarPage() {
  return <main style={styles.pageWrap}><div style={{ ...styles.container, display: "grid", gap: 16 }}><AppBackButton label="Back" fallbackPath="/campus/course" /><h1 style={{ margin: 0 }}>A2 · Day 21 · Ein Wochenende planen</h1><A2MiniLearningBlock {...lesson} /></div></main>;
}
