import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import A2MiniLearningBlock from "./A2MiniLearningBlock";
import { styles } from "../styles";

export default function A2Day17InDieApothekeModalverbenFragenGrammarPage() {
  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
      <header style={{ ...styles.card, display: "grid", gap: 8 }}>
        <h1 style={{ ...styles.title, margin: 0 }}>A2 Day 17 · In die Apotheke gehen</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Grammatik: Modalverben für Fragen, Beschwerden und Empfehlungen.</p>
      </header>
      <A2MiniLearningBlock
        title="können, müssen und sollen in der Apotheke"
        rule="Das Modalverb steht an Position 2, der zweite Infinitiv am Satzende. können = Möglichkeit/Bitte, müssen = Notwendigkeit, sollen = Empfehlung."
        examples={[
          "Können Sie mir etwas gegen Kopfschmerzen empfehlen?",
          "Ich muss dieses Medikament zweimal täglich nehmen.",
          "Soll ich die Tabletten nach dem Essen nehmen?",
          "Sie sollen viel Wasser trinken."
        ]}
        questions={[
          { stem: "Was passt für eine höfliche Frage? ___ Sie mir etwas empfehlen?", options: ["Können", "Müssen", "Sind"], answer: 0, explanation: "Können Sie ...? ist eine höfliche Bitte oder Frage." },
          { stem: "Was passt? Ich ___ das Medikament zweimal täglich nehmen.", options: ["muss", "bin", "habe"], answer: 0, explanation: "müssen beschreibt eine Notwendigkeit." },
          { stem: "Welcher Satz ist richtig?", options: ["Soll ich nehmen die Tabletten?", "Soll ich die Tabletten nehmen?", "Ich soll nehmen die Tabletten?"], answer: 1, explanation: "Beim Modalverb steht der Infinitiv am Ende." },
          { stem: "Was drückt sollen oft aus?", options: ["eine Empfehlung", "einen Vergleich", "eine Vergangenheit"], answer: 0, explanation: "sollen wird häufig für Empfehlungen benutzt." }
        ]}
        outputPrompt="Spiele eine kurze Apotheken-Situation in 4–6 Sätzen: Problem nennen, eine Frage stellen und eine Empfehlung wiederholen."
        starters={["Ich habe ...", "Können Sie mir ... empfehlen?", "Soll ich ...?", "Ich muss ... nehmen."]}
      />
    </div>
  );
}
