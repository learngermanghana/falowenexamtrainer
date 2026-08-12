import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import A2MiniLearningBlock from "./A2MiniLearningBlock";
import { styles } from "../styles";

const lesson = {
  title: "Einen Urlaub planen: Ziele und Pläne ausdrücken",
  rule: "Für Reiseziele benutzt du nach bei Städten und Ländern ohne Artikel, in + Akkusativ bei vielen Ländern mit Artikel und an + Akkusativ bei Wasser/Zielen wie das Meer. Für Pläne sind möchte und werden nützlich.",
  examples: ["Im Sommer fahre ich nach Deutschland.", "Wir fahren in die Schweiz.", "Ich möchte ans Meer fahren.", "Nächstes Jahr werde ich meine Familie besuchen."],
  questions: [
    { stem: "Im Sommer fahre ich ___ Berlin.", options: ["nach", "in die", "an"], answer: 0, explanation: "Städte: nach Berlin." },
    { stem: "Wir fahren ___ Schweiz.", options: ["nach", "in die", "zu"], answer: 1, explanation: "die Schweiz hat einen Artikel: in die Schweiz." },
    { stem: "Ich möchte ___ Meer fahren.", options: ["ans", "nach", "zum der"], answer: 0, explanation: "an das Meer wird zu ans Meer." },
    { stem: "Welcher Satz ist richtig?", options: ["Ich möchte im Hotel übernachten.", "Ich möchte übernachte im Hotel.", "Ich im Hotel möchte übernachten."], answer: 0, explanation: "Bei möchte steht der Infinitiv am Ende." },
  ],
  outputPrompt: "Plane einen Urlaub in 5 Sätzen: Reiseziel, Verkehrsmittel, Unterkunft, Aktivität und Grund.",
  starters: ["Ich möchte nach/in ... fahren.", "Ich fahre mit ...", "Ich übernachte ...", "Dort möchte ich ...", "Ich wähle dieses Ziel, weil ..."],
};

export default function A2Day24EinenUrlaubPlanenGrammarPage() {
  return <main style={styles.pageWrap}><div style={{ ...styles.container, display: "grid", gap: 16 }}><AppBackButton label="Back" fallbackPath="/campus/course" /><h1 style={{ margin: 0 }}>A2 · Day 24 · Einen Urlaub planen</h1><A2MiniLearningBlock {...lesson} /></div></main>;
}
