import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import A2MiniLearningBlock from "./A2MiniLearningBlock";
import { styles } from "../styles";

export default function A2Day19EinkaufenOderDennGrammarPage() {
  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
      <header style={{ ...styles.card, display: "grid", gap: 8 }}>
        <h1 style={{ ...styles.title, margin: 0 }}>A2 Day 19 · Einkaufen: wo und wie?</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Grammatik: oder für Alternativen und denn für Gründe.</p>
      </header>
      <A2MiniLearningBlock
        title="oder und denn richtig benutzen"
        rule="oder verbindet Alternativen. denn verbindet zwei Hauptsätze und gibt einen Grund. Nach denn bleibt die normale Wortstellung: Subjekt + Verb."
        examples={[
          "Kaufst du online oder im Geschäft?",
          "Ich kaufe im Supermarkt oder auf dem Markt.",
          "Ich kaufe online, denn es ist bequem.",
          "Ich gehe ins Geschäft, denn ich möchte die Kleidung anprobieren."
        ]}
        questions={[
          { stem: "Was passt für eine Alternative? Kaufst du bar ___ mit Karte?", options: ["oder", "denn", "weil"], answer: 0, explanation: "oder verbindet zwei Möglichkeiten." },
          { stem: "Was passt für einen Grund? Ich kaufe dort, ___ die Preise sind günstig.", options: ["oder", "denn", "als"], answer: 1, explanation: "denn gibt einen Grund." },
          { stem: "Welcher Satz ist richtig?", options: ["Ich kaufe online, denn es bequem ist.", "Ich kaufe online, denn es ist bequem.", "Ich kaufe online, denn ist es bequem."], answer: 1, explanation: "Nach denn bleibt die normale Hauptsatz-Wortstellung." },
          { stem: "Welche Frage ist richtig?", options: ["Möchtest du Tee denn Kaffee?", "Möchtest du Tee oder Kaffee?", "Möchtest du oder Tee Kaffee?"], answer: 1, explanation: "oder verbindet Alternativen." }
        ]}
        outputPrompt="Sprich 4–5 Sätze darüber, wo du gern einkaufst. Nenne eine Alternative mit oder und einen Grund mit denn."
        starters={["Ich kaufe gern ...", "Ich kaufe ... oder ...", "Ich bevorzuge ..., denn ...", "Manchmal ..."]}
      />
    </div>
  );
}
