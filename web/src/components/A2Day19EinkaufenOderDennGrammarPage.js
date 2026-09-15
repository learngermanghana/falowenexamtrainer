import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import A2MiniLearningBlock from "./A2MiniLearningBlock";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 10 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };

export default function A2Day19EinkaufenOderDennGrammarPage() {
  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
      <header style={card}>
        <h1 style={{ ...styles.title, margin: 0 }}>A2 Day 19 · Einkaufen: wo und wie?</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Grammatik: <strong>oder</strong> für Alternativen und <strong>denn</strong> für Gründe.</p>
      </header>

      <section style={card}>
        <h2 style={{ margin: 0 }}>1. Was bedeutet „oder“?</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          <strong>oder</strong> verbindet zwei oder mehrere Möglichkeiten. Beim Einkaufen benutzt du es ständig, wenn du zwischen Produkten, Farben, Größen, Orten oder Zahlungsarten wählst. Es bedeutet: Es gibt eine Alternative.
        </p>
        <ul style={list}>
          <li>Möchtest du <strong>Tee oder Kaffee</strong>? – zwei Produkte</li>
          <li>Nimmst du die Jacke <strong>in Schwarz oder in Blau</strong>? – zwei Farben</li>
          <li>Kaufst du <strong>online oder im Geschäft</strong>? – zwei Einkaufsorte</li>
          <li>Zahlst du <strong>bar oder mit Karte</strong>? – zwei Zahlungsarten</li>
        </ul>
        <p style={{ margin: 0, lineHeight: 1.75 }}><strong>Merke:</strong> „und“ bedeutet zusammen: Ich kaufe Brot <strong>und</strong> Milch. „oder“ bedeutet Alternative: Ich kaufe Brot <strong>oder</strong> Milch.</p>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>2. „oder“ verändert die Wortstellung nicht</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          <strong>oder</strong> ist eine nebenordnende Konjunktion. Wenn du zwei Hauptsätze verbindest, bleibt die normale Hauptsatz-Wortstellung erhalten. Das konjugierte Verb steht weiterhin an Position 2.
        </p>
        <ul style={list}>
          <li>Ich kaufe die Hose, <strong>oder ich nehme</strong> die Jacke.</li>
          <li>Wir bestellen online, <strong>oder wir fahren</strong> ins Einkaufszentrum.</li>
          <li>Kaufst du heute ein, <strong>oder wartest du</strong> bis morgen?</li>
        </ul>
        <p style={{ margin: 0, lineHeight: 1.75 }}><strong>Falsch:</strong> Ich kaufe die Hose, oder ich die Jacke nehme. <strong>Richtig:</strong> Ich kaufe die Hose, oder ich nehme die Jacke.</p>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>3. Wiederholungen können wegfallen</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Wenn beide Möglichkeiten denselben Satzanfang haben, musst du ihn nicht zweimal sagen. Dadurch klingt dein Deutsch natürlicher.
        </p>
        <ul style={list}>
          <li>Möchtest du die <strong>kleine oder die große</strong> Packung?</li>
          <li>Ich kann <strong>heute oder morgen</strong> einkaufen.</li>
          <li>Wir können <strong>bestellen oder abholen</strong>.</li>
          <li>Haben Sie das in <strong>Größe M oder L</strong>?</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>4. „entweder … oder“</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Mit <strong>entweder … oder</strong> betonst du, dass du zwischen zwei Möglichkeiten wählen musst. Das ist besonders nützlich, wenn du eine Entscheidung erklärst.
        </p>
        <ul style={list}>
          <li>Ich kaufe <strong>entweder</strong> die Schuhe <strong>oder</strong> die Jacke.</li>
          <li>Wir gehen <strong>entweder</strong> auf den Markt <strong>oder</strong> in den Supermarkt.</li>
          <li>Sie können <strong>entweder</strong> bar <strong>oder</strong> mit Karte bezahlen.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>5. „oder?“ als kurze Bestätigung</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          In Gesprächen kann <strong>oder?</strong> am Satzende bedeuten: „Stimmt das?“ oder „Richtig?“. Beispiel: <em>Die Jacke kostet 40 Euro, oder?</em> – Du glaubst, dass sie 40 Euro kostet, und möchtest eine Bestätigung.
        </p>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>6. „oder“ und „denn“ nicht verwechseln</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          <strong>oder</strong> gibt eine Alternative. <strong>denn</strong> gibt einen Grund. Auch nach <strong>denn</strong> bleibt die normale Hauptsatz-Wortstellung.
        </p>
        <ul style={list}>
          <li>Kaufst du online <strong>oder</strong> im Geschäft? – Alternative</li>
          <li>Ich kaufe im Geschäft, <strong>denn ich möchte</strong> die Kleidung anprobieren. – Grund</li>
          <li>Ich nehme Größe M, <strong>denn Größe S ist</strong> zu klein. – Grund</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>7. Einkaufsdialog</h2>
        <p style={{ margin: 0, lineHeight: 1.8 }}>
          <strong>Verkäuferin:</strong> Guten Tag. Suchen Sie eine Hose oder eine Jacke?<br />
          <strong>Kunde:</strong> Eine Jacke, bitte. Haben Sie sie in Schwarz oder Blau?<br />
          <strong>Verkäuferin:</strong> Wir haben beide Farben. Möchten Sie Größe M oder L anprobieren?<br />
          <strong>Kunde:</strong> Größe M, bitte. Ich nehme die schwarze Jacke, denn sie passt sehr gut.<br />
          <strong>Verkäuferin:</strong> Möchten Sie bar oder mit Karte bezahlen?<br />
          <strong>Kunde:</strong> Mit Karte, bitte.
        </p>
      </section>

      <A2MiniLearningBlock
        title="Knowledge Test · oder und denn"
        rule="Entscheide zuerst: Geht es um eine Alternative oder um einen Grund? Prüfe danach die Wortstellung."
        examples={["Alternative → oder", "stärkere Wahl → entweder ... oder", "Grund → denn + normale Hauptsatz-Wortstellung"]}
        questions={[
          { stem: "Was drückt „oder“ aus?", options: ["eine Alternative", "einen Grund", "eine Vergangenheit"], answer: 0, explanation: "oder verbindet Möglichkeiten oder Alternativen." },
          { stem: "Möchten Sie bar ___ mit Karte bezahlen?", options: ["denn", "oder", "weil"], answer: 1, explanation: "Hier werden zwei Zahlungsarten angeboten." },
          { stem: "Welcher Satz hat die richtige Wortstellung?", options: ["Ich kaufe die Hose oder ich nehme die Jacke.", "Ich kaufe die Hose oder ich die Jacke nehme.", "Ich kaufe die Hose oder nehme ich die Jacke."], answer: 0, explanation: "Nach oder bleibt im Aussagesatz die normale Hauptsatz-Wortstellung." },
          { stem: "Welche Aussage bedeutet, dass du beides kaufst?", options: ["Ich kaufe Brot oder Milch.", "Ich kaufe Brot und Milch.", "Ich kaufe entweder Brot oder Milch."], answer: 1, explanation: "und verbindet Dinge, die zusammen gelten." },
          { stem: "Welche Form betont zwei Alternativen besonders?", options: ["entweder ... oder", "denn ... weil", "und ... aber"], answer: 0, explanation: "entweder ... oder betont die Wahl zwischen zwei Möglichkeiten." },
          { stem: "Was bedeutet „Die Jacke kostet 40 Euro, oder?“", options: ["Ich möchte eine Bestätigung.", "Ich nenne einen Grund.", "Ich lehne die Jacke ab."], answer: 0, explanation: "oder? am Satzende bittet häufig um Bestätigung." },
          { stem: "Ich kaufe im Geschäft, ___ ich möchte die Schuhe anprobieren.", options: ["oder", "denn", "entweder"], answer: 1, explanation: "denn nennt hier den Grund und behält die Hauptsatz-Wortstellung." },
          { stem: "Welcher Satz klingt natürlich und kurz?", options: ["Möchtest du die kleine oder die große Packung?", "Möchtest du die kleine Packung oder möchtest du die große Packung?", "Beide sind grammatisch möglich, aber A ist kürzer und natürlicher."], answer: 2, explanation: "Bei gleicher Struktur kann die Wiederholung weggelassen werden." }
        ]}
        outputPrompt="Sprich 5–6 Sätze über dein Einkaufsverhalten. Verwende mindestens zweimal oder, einmal entweder ... oder und einmal denn."
        starters={["Ich kaufe meistens ...", "Ich kaufe ... oder ...", "Entweder ... oder ...", "Ich bevorzuge ..., denn ..."]}
      />
    </div>
  );
}
