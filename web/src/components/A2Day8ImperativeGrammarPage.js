import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import A2MiniLearningBlock from "./A2MiniLearningBlock";
import { styles } from "../styles";

const lesson = {
  title: "Im Restaurant – höflich bestellen und nachfragen",
  english: "Use polite chunks to order food, ask questions and react in a restaurant. At A2, accuracy and natural phrases are more useful than long explanations.",
  rule: "Bestellen: Ich hätte gern ... / Ich möchte ... / Ich nehme ... . Nachfragen: Könnte ich bitte ...? / Haben Sie ...? / Was empfehlen Sie? Problem: Entschuldigung, ich habe ... bestellt. Bezahlen: Wir möchten bitte zahlen.",
  examples: [
    "Ich hätte gern die Gemüsesuppe und ein Mineralwasser.",
    "Könnte ich bitte die Speisekarte bekommen?",
    "Was empfehlen Sie heute?",
    "Entschuldigung, ich habe den Salat ohne Käse bestellt.",
    "Wir möchten bitte zahlen.",
  ],
  commonMistake: "Nicht zu direkt formulieren. Im Restaurant klingt „Gib mir Wasser!“ unhöflich. Besser: „Könnte ich bitte ein Wasser bekommen?“ oder „Ich hätte gern ein Wasser.“",
  questions: [
    { stem: "Du möchtest eine Suppe bestellen.", options: ["Ich hätte gern die Tomatensuppe.", "Gib Tomatensuppe!", "Ich bin Tomatensuppe."], answer: 0, explanation: "Ich hätte gern ... is a natural polite ordering phrase." },
    { stem: "Du möchtest die Speisekarte.", options: ["Könnte ich bitte die Speisekarte bekommen?", "Die Speisekarte bekommt.", "Ich Speisekarte."], answer: 0, explanation: "Könnte ich bitte ...? is a polite request." },
    { stem: "Du willst nach einer Empfehlung fragen.", options: ["Was empfehlen Sie heute?", "Was Sie empfehlen heute?", "Was empfehle ich Sie?"], answer: 0, explanation: "In a direct question the conjugated verb comes before the subject: empfehlen Sie." },
    { stem: "Du hast das falsche Getränk bekommen.", options: ["Entschuldigung, ich habe ein Wasser bestellt.", "Du falsch!", "Ich trinken nicht."], answer: 0, explanation: "Name the problem politely and clearly." },
  ],
  outputPrompt: "Restaurant-Simulation: Bestelle ein Gericht und ein Getränk, stelle eine Frage, reagiere auf ein kleines Problem und bitte am Ende um die Rechnung.",
  starters: ["Ich hätte gern ...", "Könnte ich bitte ...?", "Was empfehlen Sie ...?", "Entschuldigung, ich habe ... bestellt.", "Wir möchten bitte zahlen."],
};

const FocusedContent = () => <A2MiniLearningBlock {...lesson} />;

export default function A2Day8ImperativeGrammarPage({ embedded = false }) {
  if (embedded) return <FocusedContent />;
  return <main style={styles.pageWrap}><div style={{ ...styles.container, display: "grid", gap: 16 }}><AppBackButton label="Back" fallbackPath="/campus/course" /><h1 style={{ margin: 0 }}>A2 · Day 8 · Im Restaurant</h1><FocusedContent /></div></main>;
}
