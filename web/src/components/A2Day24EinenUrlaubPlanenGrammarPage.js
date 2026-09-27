import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import A2MiniLearningBlock from "./A2MiniLearningBlock";
import { styles } from "../styles";

const lesson = {
  title: "Reiseziele ausdrücken: nach, in und an",
  english: "Destination prepositions depend on the type of place: nach for cities and countries without an article, in + accusative for countries with an article, and an + accusative for destinations such as the sea.",
  rule: "Stadt/Land ohne Artikel: nach. Land mit Artikel: in + Akkusativ. Wasser/Ziel wie das Meer: an + Akkusativ. With möchte, the infinitive goes to the end.",
  examples: [
    "Im Sommer fahre ich nach Deutschland.",
    "Wir fahren in die Schweiz.",
    "Ich möchte ans Meer fahren.",
    "Nächstes Jahr möchte ich meine Familie besuchen.",
  ],
  commonMistake: "Do not use nach with countries that have an article. Say in die Schweiz, not nach Schweiz.",
  questions: [
    { stem: "Im Sommer fahre ich ___ Berlin.", options: ["nach", "in die", "an"], answer: 0, explanation: "Cities use nach." },
    { stem: "Wir fahren ___ Schweiz.", options: ["nach", "in die", "zu"], answer: 1, explanation: "die Schweiz has an article: in die Schweiz." },
    { stem: "Ich möchte ___ Meer fahren.", options: ["ans", "nach", "zum der"], answer: 0, explanation: "an das Meer contracts to ans Meer." },
    { stem: "Welcher Satz ist richtig?", options: ["Ich möchte im Hotel übernachten.", "Ich möchte übernachte im Hotel.", "Ich im Hotel möchte übernachten."], answer: 0, explanation: "After möchte, the infinitive is at the end." },
  ],
  outputPrompt: "Plane einen Urlaub in 5 Sätzen: Reiseziel, Verkehrsmittel, Unterkunft, Aktivität und Grund.",
  starters: ["Ich möchte nach/in ... fahren.", "Ich fahre mit ...", "Ich übernachte ...", "Dort möchte ich ...", "Ich wähle dieses Ziel, weil ..."],
};

const FocusedContent = () => <A2MiniLearningBlock {...lesson} />;

export default function A2Day24EinenUrlaubPlanenGrammarPage({ embedded = false }) {
  if (embedded) return <FocusedContent />;
  return <main style={styles.pageWrap}><div style={{ ...styles.container, display: "grid", gap: 16 }}><AppBackButton label="Back" fallbackPath="/campus/course" /><h1 style={{ margin: 0 }}>A2 · Day 24 · Einen Urlaub planen</h1><FocusedContent /></div></main>;
}
