import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import A2MiniLearningBlock from "./A2MiniLearningBlock";
import { styles } from "../styles";

export default function A2Day20TypischeReklamationssituationenHoeflicheBittenUndBegruendungenGrammarPage() {
  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
      <header style={{ ...styles.card, display: "grid", gap: 8 }}>
        <h1 style={{ ...styles.title, margin: 0 }}>A2 Day 20 · Typische Reklamationssituationen</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Grammatik: höflich reklamieren, begründen und eine Lösung verlangen.</p>
      </header>
      <A2MiniLearningBlock
        title="Problem + Grund + höfliche Lösung"
        rule="Eine gute Reklamation hat drei Schritte: Problem nennen, mit weil oder denn begründen, dann höflich um eine Lösung bitten."
        examples={[
          "Die Jacke ist kaputt.",
          "Ich möchte sie umtauschen, weil der Reißverschluss nicht funktioniert.",
          "Könnten Sie mir bitte eine neue Jacke geben?",
          "Ich hätte gern mein Geld zurück."
        ]}
        questions={[
          { stem: "Was ist eine höfliche Bitte?", options: ["Geben Sie Geld!", "Könnten Sie mir bitte mein Geld zurückgeben?", "Du gibst mir Geld."], answer: 1, explanation: "Könnten Sie bitte ...? ist höflich." },
          { stem: "Was passt? Ich möchte die Schuhe umtauschen, ___ sie zu klein sind.", options: ["weil", "oder", "als"], answer: 0, explanation: "weil nennt den Grund; das Verb steht am Ende." },
          { stem: "Welcher Satz mit denn ist richtig?", options: ["Ich reklamiere, denn die Ware ist kaputt.", "Ich reklamiere, denn die Ware kaputt ist.", "Ich reklamiere, denn ist die Ware kaputt."], answer: 0, explanation: "Nach denn bleibt normale Hauptsatz-Wortstellung." },
          { stem: "Was passt als Lösung?", options: ["Ich hätte gern einen Umtausch.", "Ich bin Umtausch.", "Ich umtausche gern."], answer: 0, explanation: "Ich hätte gern ... ist eine höfliche Wunschform." }
        ]}
        outputPrompt="Formuliere eine Reklamation in 5 Sätzen: Produkt nennen, Problem erklären, Grund geben, höfliche Lösung verlangen und danken."
        starters={["Ich habe ... gekauft.", "Leider ...", "Ich möchte ..., weil ...", "Könnten Sie bitte ...?", "Vielen Dank."]}
      />
    </div>
  );
}
