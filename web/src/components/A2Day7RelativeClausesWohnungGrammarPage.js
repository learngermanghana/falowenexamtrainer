import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import A2MiniLearningBlock from "./A2MiniLearningBlock";
import { styles } from "../styles";

const lesson = {
  title: "Relativsätze mit der, die, das",
  english: "A relative clause adds information about a noun. The relative pronoun matches the noun's gender, and the conjugated verb goes to the end.",
  rule: "der Mann → der; die Wohnung → die; das Zimmer → das; plural → die. Put a comma before the relative clause and the verb at the end.",
  examples: [
    "Ich suche eine Wohnung, die einen Balkon hat.",
    "Das ist der Vermieter, der im Haus wohnt.",
    "Wir sehen ein Zimmer, das sehr hell ist.",
    "Die Leute, die hier wohnen, sind freundlich.",
  ],
  commonMistake: "Choose the relative pronoun from the noun, not from the person speaking. Also remember the final verb: die einen Balkon hat.",
  questions: [
    { stem: "Ich suche eine Wohnung, ___ ruhig ist.", options: ["der", "die", "das"], answer: 1, explanation: "die Wohnung → die." },
    { stem: "Das ist ein Zimmer, ___ sehr hell ist.", options: ["der", "die", "das"], answer: 2, explanation: "das Zimmer → das." },
    { stem: "Der Mann, ___ dort wohnt, ist mein Vermieter.", options: ["der", "die", "das"], answer: 0, explanation: "der Mann → der." },
    { stem: "Welche Wortstellung ist richtig?", options: ["die einen Balkon hat", "die hat einen Balkon", "die einen Balkon haben"], answer: 0, explanation: "The conjugated verb goes to the end of the relative clause." },
  ],
  outputPrompt: "Beschreibe eine Wohnung in 4 Sätzen und benutze mindestens zwei Relativsätze.",
  starters: ["Ich suche eine Wohnung, die ...", "Das ist ein Zimmer, das ...", "Der Vermieter, der ..."],
};

const FocusedContent = () => <A2MiniLearningBlock {...lesson} />;

export default function A2Day7RelativeClausesWohnungGrammarPage({ embedded = false }) {
  if (embedded) return <FocusedContent />;
  return <main style={styles.pageWrap}><div style={{ ...styles.container, display: "grid", gap: 16 }}><AppBackButton label="Back" fallbackPath="/campus/course" /><h1 style={{ margin: 0 }}>A2 · Day 7 · Eine Wohnung suchen</h1><FocusedContent /></div></main>;
}
