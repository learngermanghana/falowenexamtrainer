import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import A2MiniLearningBlock from "./A2MiniLearningBlock";
import { styles } from "../styles";

export default function A2Day18DieBankAnrufenHoeflicheFragenBittenGrammarPage() {
  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
      <header style={{ ...styles.card, display: "grid", gap: 8 }}>
        <h1 style={{ ...styles.title, margin: 0 }}>A2 Day 18 · Die Bank anrufen</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Grammatik: höfliche Fragen und Bitten mit könnten, würde und bitte.</p>
      </header>
      <A2MiniLearningBlock
        title="Höflich am Telefon sprechen"
        rule="Für höfliche Bitten sind Könnten Sie bitte ...? und Ich würde gern ... besonders nützlich. Bei Könnten Sie ... steht der Infinitiv am Satzende."
        examples={[
          "Könnten Sie bitte meine Karte sperren?",
          "Könnten Sie mir den Kontostand nennen?",
          "Ich würde gern ein Konto eröffnen.",
          "Könnten Sie das bitte wiederholen?"
        ]}
        questions={[
          { stem: "Welche Bitte ist höflich?", options: ["Sperren Sie Karte!", "Könnten Sie bitte meine Karte sperren?", "Du sperrst meine Karte."], answer: 1, explanation: "Könnten Sie bitte ...? ist höflich und passend am Telefon." },
          { stem: "Was passt? Ich ___ gern ein Konto eröffnen.", options: ["würde", "war", "muss"], answer: 0, explanation: "Ich würde gern ... drückt einen höflichen Wunsch aus." },
          { stem: "Welcher Satz ist richtig?", options: ["Könnten Sie nennen mir den Kontostand?", "Könnten Sie mir den Kontostand nennen?", "Sie könnten mir nennen den Kontostand?"], answer: 1, explanation: "Bei könnten steht der Infinitiv am Ende." },
          { stem: "Was sagst du, wenn du etwas nicht verstanden hast?", options: ["Könnten Sie das bitte wiederholen?", "Sie wiederholen jetzt.", "Was du gesagt?"], answer: 0, explanation: "Diese Form ist höflich und natürlich." }
        ]}
        outputPrompt="Führe ein kurzes Banktelefonat in 5 Sätzen: begrüßen, Grund nennen, Bitte stellen, Rückfrage stellen, höflich beenden."
        starters={["Guten Tag, mein Name ist ...", "Ich rufe an, weil ...", "Könnten Sie bitte ...?", "Ich würde gern ...", "Vielen Dank für Ihre Hilfe."]}
      />
    </div>
  );
}
