import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import A2MiniLearningBlock from "./A2MiniLearningBlock";
import { styles } from "../styles";

const lesson = {
  title: "Wie kommst du zur Schule oder zur Arbeit?",
  rule: "Für Verkehrsmittel benutzt du meistens mit + Dativ. Für Ziele sind zu + Dativ und nach bei Städten/Ländern ohne Artikel besonders wichtig.",
  examples: ["Ich fahre mit dem Bus zur Arbeit.", "Sie fährt mit der Bahn zur Schule.", "Ich gehe zu Fuß zur Universität.", "Wir fahren morgen nach Accra."],
  questions: [
    { stem: "Ich fahre ___ dem Bus zur Arbeit.", options: ["mit", "in", "an"], answer: 0, explanation: "Verkehrsmittel: mit + Dativ." },
    { stem: "Was passt? Ich fahre mit ___ Bahn.", options: ["die", "der", "den"], answer: 1, explanation: "mit verlangt Dativ: die Bahn → der Bahn." },
    { stem: "Welcher Satz ist richtig?", options: ["Ich gehe mit Fuß zur Arbeit.", "Ich gehe zu Fuß zur Arbeit.", "Ich gehe in Fuß zur Arbeit."], answer: 1, explanation: "Die feste Wendung lautet zu Fuß." },
    { stem: "Wir fahren morgen ___ Berlin.", options: ["nach", "zu", "mit"], answer: 0, explanation: "Bei Städten benutzt man für das Ziel nach." },
  ],
  outputPrompt: "Erkläre in 4–5 Sätzen deinen Weg zur Schule oder Arbeit: Verkehrsmittel, Dauer, Ziel und einen Grund.",
  starters: ["Ich fahre/gehe mit ...", "Ich fahre zur/zum ...", "Der Weg dauert ...", "Ich benutze ..., weil ..."],
};

export default function A2Day23WieKommstDuZurSchuleOderZurArbeitGrammarPage() {
  return <main style={styles.pageWrap}><div style={{ ...styles.container, display: "grid", gap: 16 }}><AppBackButton label="Back" fallbackPath="/campus/course" /><h1 style={{ margin: 0 }}>A2 · Day 23 · Schul- und Arbeitsweg</h1><A2MiniLearningBlock {...lesson} /></div></main>;
}
