import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import A2MiniLearningBlock from "./A2MiniLearningBlock";
import { styles } from "../styles";

export default function A2Day10PraeteritumGrammarPage() {
  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
      <header style={{ ...styles.card, display: "grid", gap: 8 }}>
        <h1 style={{ ...styles.title, margin: 0 }}>A2 • 4.10 Tourismus und traditionelle Feste</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Grammar focus: Präteritum</p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Ziel: einfache vergangene Ereignisse mit <strong>war</strong>, <strong>hatte</strong> und häufigen Präteritumformen verstehen und beschreiben.
        </p>
      </header>

      <A2MiniLearningBlock
        title="Präteritum: eine Geschichte in der Vergangenheit erzählen"
        rule="Für A2 sind besonders war und hatte wichtig. Regelmäßige Verben bekommen oft -te: feiern → feierte, besuchen → besuchte. Einige häufige Verben ändern den Stamm: gehen → ging, fahren → fuhr, sehen → sah."
        examples={[
          "Letztes Jahr war ich in München.",
          "Wir hatten viel Zeit für das Fest.",
          "Am Samstag besuchte ich einen Weihnachtsmarkt.",
          "Danach ging ich mit Freunden ins Restaurant."
        ]}
        questions={[
          { stem: "Was ist das Präteritum von sein? Ich ___ in Berlin.", options: ["bin", "war", "gewesen"], answer: 1, explanation: "sein → ich war." },
          { stem: "Was ist das Präteritum von haben? Wir ___ viel Zeit.", options: ["hatten", "haben", "gehabt"], answer: 0, explanation: "haben → wir hatten." },
          { stem: "Welcher Satz ist richtig?", options: ["Wir besuchten das Fest.", "Wir besuchteen das Fest."], answer: 0, explanation: "Regelmäßig: besuchen → besuchte / besuchten." },
          { stem: "Was ist das Präteritum von gehen?", options: ["ging", "gehte", "gegangen"], answer: 0, explanation: "gehen ist unregelmäßig: ging." }
        ]}
        outputPrompt="Erzähle in 4–6 Sätzen von einem Fest oder einer Reise in der Vergangenheit."
        starters={[
          "Letztes Jahr war ich ...",
          "Dort hatte ich ...",
          "Am ersten Tag besuchte ich ...",
          "Danach ging ich ...",
          "Das Fest war ..."
        ]}
      />

      <section style={{ ...styles.card, display: "grid", gap: 10 }}>
        <h2 style={{ margin: 0 }}>Perfekt oder Präteritum?</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Im Alltag benutzt man häufig das Perfekt: <strong>Ich bin nach München gefahren.</strong> In Geschichten und schriftlichen Texten sieht man häufiger das Präteritum: <strong>Ich fuhr nach München.</strong>
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Für A2 musst du nicht jedes starke Verb perfekt beherrschen. Merke dir zuerst <strong>war, hatte, ging, kam, fuhr, sah</strong> und erkenne die Formen beim Lesen.
        </p>
      </section>
    </div>
  );
}
