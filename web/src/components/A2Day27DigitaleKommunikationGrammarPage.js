import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 12 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.8 };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 12 };
const note = { border: "1px solid #bfdbfe", borderRadius: 12, padding: 14, background: "#f8fbff", display: "grid", gap: 8 };

export default function A2Day27DigitaleKommunikationGrammarPage() {
  const [showAnswers, setShowAnswers] = useState(false);

  return (
    <main style={styles.pageWrap}>
      <div style={{ ...styles.container, display: "grid", gap: 16 }}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

        <header style={card}>
          <span style={{ ...styles.badge, width: "fit-content" }}>A2 · Day 27 · Kapitel 10.27</span>
          <h1 style={{ ...styles.title, marginBottom: 0 }}>Grammar Notes · Digitale Kommunikation: dass-Sätze</h1>
          <p style={{ ...styles.subtitle, margin: 0 }}>
            Learn how to express an opinion, belief or important point with <strong>dass</strong>. In a dass-clause, the conjugated verb goes to the end.
          </p>
        </header>

        <section style={card}>
          <h2 style={{ margin: 0 }}>1. When do we use dass?</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Use <strong>dass</strong> after expressions such as <em>Ich finde</em>, <em>Ich glaube</em>, <em>Ich denke</em> and <em>Mir ist wichtig</em> when you want to explain your idea more precisely.
          </p>
          <div style={grid}>
            <div style={note}><strong>Ich finde, dass ...</strong><span>Ich finde, dass WhatsApp praktisch ist.</span></div>
            <div style={note}><strong>Ich glaube, dass ...</strong><span>Ich glaube, dass E-Mails im Beruf wichtig sind.</span></div>
            <div style={note}><strong>Ich denke, dass ...</strong><span>Ich denke, dass soziale Medien nützlich sein können.</span></div>
            <div style={note}><strong>Mir ist wichtig, dass ...</strong><span>Mir ist wichtig, dass meine Daten sicher sind.</span></div>
          </div>
        </section>

        <section style={card}>
          <h2 style={{ margin: 0 }}>2. Word order: the verb goes to the end</h2>
          <div style={note}>
            <strong>Main clause + dass + subject + other information + conjugated verb</strong>
            <span>Ich finde, dass WhatsApp sehr praktisch <strong>ist</strong>.</span>
            <span>Ich glaube, dass viele Menschen soziale Medien täglich <strong>benutzen</strong>.</span>
            <span>Mir ist wichtig, dass meine persönlichen Daten geschützt <strong>sind</strong>.</span>
          </div>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            With a modal verb, the modal verb is at the end: <em>Ich denke, dass soziale Medien hilfreich sein <strong>können</strong>.</em>
          </p>
        </section>

        <section style={card}>
          <h2 style={{ margin: 0 }}>3. Build a useful A2 answer</h2>
          <ol style={list}>
            <li>Choose one clear opinion about digital communication.</li>
            <li>Start with <strong>Ich finde / Ich glaube / Ich denke / Mir ist wichtig</strong>.</li>
            <li>Add <strong>dass</strong> and move the conjugated verb to the end.</li>
            <li>Add a reason or example with <strong>weil</strong>, <strong>zum Beispiel</strong> or <strong>außerdem</strong>.</li>
          </ol>
          <div style={note}>
            <strong>Idea → opinion → dass-Satz → reason/example</strong>
            <span>E-Mail ist wichtig für die Arbeit → Ich finde, dass E-Mails im Beruf wichtig sind, weil man Informationen klar schicken kann.</span>
          </div>
        </section>

        <section style={card}>
          <h2 style={{ margin: 0 }}>4. Useful vocabulary for Digitale Kommunikation</h2>
          <div style={grid}>
            <div style={note}><strong>Kommunikationsmittel</strong><span>die E-Mail, der Chat, das Telefon, das Online-Meeting</span></div>
            <div style={note}><strong>Soziale Medien</strong><span>posten, teilen, kommentieren, Nachrichten schicken</span></div>
            <div style={note}><strong>Vorteile</strong><span>schnell, praktisch, einfach, flexibel</span></div>
            <div style={note}><strong>Sicherheit</strong><span>Datenschutz, Passwort, persönliche Daten, Zwei-Faktor-Authentifizierung</span></div>
          </div>
        </section>

        <section style={card}>
          <h2 style={{ margin: 0 }}>5. Self-check</h2>
          <ol style={list}>
            <li>Complete: Ich finde, ___ E-Mails praktisch sind.</li>
            <li>Correct the word order: Ich glaube, dass sind soziale Medien nützlich.</li>
            <li>Complete: Mir ist wichtig, dass meine Daten sicher ___.</li>
            <li>Write one sentence with <strong>Ich denke, dass ...</strong> about WhatsApp or E-Mail.</li>
            <li>Add a reason with <strong>weil</strong>.</li>
          </ol>
          <button type="button" onClick={() => setShowAnswers((value) => !value)} style={styles.secondaryBtn}>
            {showAnswers ? "Hide sample answers" : "Show sample answers"}
          </button>
          {showAnswers ? (
            <div style={note}>
              <strong>Sample answers</strong>
              <ol style={list}>
                <li>dass</li>
                <li>Ich glaube, dass soziale Medien nützlich sind.</li>
                <li>sind</li>
                <li>Ich denke, dass WhatsApp für schnelle Nachrichten praktisch ist.</li>
                <li>Ich denke, dass E-Mails wichtig sind, weil man Informationen gut organisieren kann.</li>
              </ol>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
