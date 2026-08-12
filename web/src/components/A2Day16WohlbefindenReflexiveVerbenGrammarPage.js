import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import A2MiniLearningBlock from "./A2MiniLearningBlock";
import { styles } from "../styles";

export default function A2Day16WohlbefindenReflexiveVerbenGrammarPage() {
  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
      <header style={{ ...styles.card, display: "grid", gap: 8 }}>
        <h1 style={{ ...styles.title, margin: 0 }}>A2 Day 16 · Wohlbefinden und Entspannung</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Grammatik: reflexive Verben mit mich, dich, sich, uns und euch.</p>
      </header>
      <A2MiniLearningBlock
        title="Reflexive Verben im Alltag"
        rule="Bei reflexiven Verben bezieht sich die Handlung auf dieselbe Person: ich → mich, du → dich, er/sie/es → sich, wir → uns, ihr → euch, sie/Sie → sich."
        examples={[
          "Ich entspanne mich am Abend.",
          "Du fühlst dich heute besser.",
          "Sie erholt sich am Wochenende.",
          "Wir treffen uns nach der Arbeit."
        ]}
        questions={[
          { stem: "Was passt? Ich entspanne ___ nach der Arbeit.", options: ["mich", "mir", "sich"], answer: 0, explanation: "ich → mich." },
          { stem: "Was passt? Du fühlst ___ müde.", options: ["mich", "dich", "euch"], answer: 1, explanation: "du → dich." },
          { stem: "Was passt? Wir treffen ___ um 18 Uhr.", options: ["uns", "euch", "sich"], answer: 0, explanation: "wir → uns." },
          { stem: "Welcher Satz ist richtig?", options: ["Er erholt mich am Wochenende.", "Er erholt sich am Wochenende.", "Er sich erholt am Wochenende."], answer: 1, explanation: "er → sich; das Verb bleibt an Position 2." }
        ]}
        outputPrompt="Sprich 4–5 Sätze darüber, was du für dein Wohlbefinden machst. Benutze mindestens zwei reflexive Verben."
        starters={["Ich entspanne mich ...", "Ich fühle mich ...", "Am Wochenende erhole ich mich ...", "Ich treffe mich mit ..."]}
      />
    </div>
  );
}
