import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import A2MiniLearningBlock from "./A2MiniLearningBlock";
import { styles } from "../styles";

const lesson = {
  title: "Verkehrsmittel und Ziele: mit, zu und nach",
  english: "Use mit + dative for transport, zu + dative for many destinations, nach for cities/countries without an article, and the fixed phrase zu Fuß.",
  rule: "Verkehrsmittel: mit + Dativ. Person/Ort als Ziel: zu + Dativ. Stadt/Land ohne Artikel: nach. Zu Fuß is fixed.",
  examples: [
    "Ich fahre mit dem Bus zur Arbeit.",
    "Sie fährt mit der Bahn zur Schule.",
    "Ich gehe zu Fuß zur Universität.",
    "Wir fahren morgen nach Accra.",
  ],
  commonMistake: "Do not say mit Fuß. The fixed phrase is zu Fuß. Also remember: mit always takes dative.",
  questions: [
    { stem: "Ich fahre ___ dem Bus zur Arbeit.", options: ["mit", "in", "an"], answer: 0, explanation: "Transport: mit + dative." },
    { stem: "Ich fahre mit ___ Bahn.", options: ["die", "der", "den"], answer: 1, explanation: "mit takes dative: die Bahn → der Bahn." },
    { stem: "Welcher Satz ist richtig?", options: ["Ich gehe mit Fuß.", "Ich gehe zu Fuß.", "Ich gehe in Fuß."], answer: 1, explanation: "The fixed expression is zu Fuß." },
    { stem: "Wir fahren morgen ___ Berlin.", options: ["nach", "zu", "mit"], answer: 0, explanation: "Cities normally use nach." },
  ],
  outputPrompt: "Erkläre in 4–5 Sätzen deinen Weg zur Schule oder Arbeit: Verkehrsmittel, Dauer, Ziel und einen Grund.",
  starters: ["Ich fahre/gehe mit ...", "Ich fahre zur/zum ...", "Der Weg dauert ...", "Ich benutze ..., weil ..."],
};

const FocusedContent = () => <A2MiniLearningBlock essential {...lesson} />;

export default function A2Day23WieKommstDuZurSchuleOderZurArbeitGrammarPage({ embedded = false }) {
  if (embedded) return <FocusedContent />;
  return <main style={styles.pageWrap}><div style={{ ...styles.container, display: "grid", gap: 16 }}><AppBackButton label="Back" fallbackPath="/campus/course" /><h1 style={{ margin: 0 }}>A2 · Day 23 · Schul- und Arbeitsweg</h1><FocusedContent /></div></main>;
}
