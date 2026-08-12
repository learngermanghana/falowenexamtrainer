import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 14 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const box = { border: "1px solid #e5e7eb", borderRadius: 12, padding: 14, background: "#fff", lineHeight: 1.75, display: "grid", gap: 8 };
const title = { margin: 0, fontSize: "1.15rem" };
const good = { ...box, background: "#f0fdf4", borderColor: "#bbf7d0" };
const warn = { ...box, background: "#fef2f2", borderColor: "#fecaca" };

export default function B1Day17WieLerntManAmBestenGrammarNotesPage() {
  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
      <header style={card}>
        <span style={{ ...styles.badge, width: "fit-content" }}>B1 · Day 17 · Kapitel 5.17 · Grammar Notes</span>
        <h1 style={{ ...styles.title, margin: 0 }}>Wie lernt man am besten?</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Grammatikfokus: Lernmethoden erklären mit <strong>wenn</strong>, <strong>weil</strong>, <strong>dass</strong>, <strong>damit</strong> und <strong>um ... zu</strong>.
        </p>
      </header>

      <section style={card}>
        <h2 style={title}>Warum passt diese Grammatik zum Thema Lernen?</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Wenn du über Lernstrategien sprichst, musst du Bedingungen, Gründe, Meinungen und Ziele ausdrücken. Du erklärst zum Beispiel,
          <strong> wann</strong> du besser lernst, <strong>warum</strong> eine Methode funktioniert, <strong>was</strong> du wichtig findest und
          <strong> wozu</strong> du eine Strategie benutzt.
        </p>
      </section>

      <section style={card}>
        <h2 style={title}>1. Bedingungen mit „wenn“</h2>
        <div style={box}>
          <strong>Struktur</strong>
          <span>wenn + ... + konjugiertes Verb am Ende</span>
          <span>Ich lerne am besten, <strong>wenn ich mein Handy ausschalte</strong>.</span>
          <span><strong>Wenn ich müde bin</strong>, mache ich eine kurze Pause.</span>
        </div>
        <div style={good}><strong>Richtig:</strong> Ich kann mich besser konzentrieren, wenn es ruhig ist.</div>
        <div style={warn}><strong>Falsch:</strong> Ich kann mich besser konzentrieren, wenn es ist ruhig.</div>
      </section>

      <section style={card}>
        <h2 style={title}>2. Gründe und Meinungen mit „weil“ und „dass“</h2>
        <ul style={list}>
          <li>Ich mache mir Notizen, <strong>weil ich Informationen dann besser behalte</strong>.</li>
          <li>Ich finde, <strong>dass regelmäßige Wiederholung sehr wichtig ist</strong>.</li>
          <li>Ich glaube, <strong>dass Gruppenarbeit bei schwierigen Themen helfen kann</strong>.</li>
          <li>Ich lerne morgens, <strong>weil ich dann konzentrierter bin</strong>.</li>
        </ul>
        <div style={box}>
          <strong>Merke:</strong> Nach <strong>weil</strong> und <strong>dass</strong> steht das konjugierte Verb am Ende des Nebensatzes.
        </div>
      </section>

      <section style={card}>
        <h2 style={title}>3. Ziele mit „um ... zu“ und „damit“</h2>
        <div style={box}>
          <strong>um ... zu</strong> bei gleichem Subjekt
          <span>Ich wiederhole die Wörter regelmäßig, <strong>um sie langfristig zu behalten</strong>.</span>
          <span>Ich schalte mein Handy aus, <strong>um mich besser zu konzentrieren</strong>.</span>
        </div>
        <div style={box}>
          <strong>damit</strong> besonders bei verschiedenen Subjekten
          <span>Der Lehrer gibt Beispiele, <strong>damit die Schüler die Regel besser verstehen</strong>.</span>
          <span>Ich erkläre meinem Lernpartner die Aufgabe, <strong>damit er sie selbst lösen kann</strong>.</span>
        </div>
      </section>

      <section style={card}>
        <h2 style={title}>4. Infinitiv mit „zu“ für Lernstrategien</h2>
        <ul style={list}>
          <li>Es ist wichtig, regelmäßig <strong>zu wiederholen</strong>.</li>
          <li>Es hilft, einen Lernplan <strong>zu erstellen</strong>.</li>
          <li>Ich versuche, jeden Tag zwanzig Minuten <strong>zu lernen</strong>.</li>
          <li>Ich finde es hilfreich, neue Wörter in eigenen Sätzen <strong>zu benutzen</strong>.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>5. Eine B1-Meinung logisch aufbauen</h2>
        <ol style={list}>
          <li><strong>Meinung:</strong> Ich finde, dass regelmäßiges Lernen wichtiger als langes Lernen kurz vor der Prüfung ist.</li>
          <li><strong>Grund:</strong> Das ist sinnvoll, weil man den Stoff besser behält.</li>
          <li><strong>Beispiel:</strong> Ich wiederhole jeden Abend zehn neue Wörter.</li>
          <li><strong>Ziel:</strong> Ich mache das, um meinen Wortschatz langfristig zu verbessern.</li>
          <li><strong>Schluss:</strong> Deshalb denke ich, dass eine feste Lernroutine sehr hilfreich ist.</li>
        </ol>
      </section>

      <section style={card}>
        <h2 style={title}>Häufige Fehler</h2>
        <ul style={list}>
          <li><strong>Falsch:</strong> Ich finde, dass Pausen sind wichtig. <strong>Richtig:</strong> Ich finde, dass Pausen wichtig sind.</li>
          <li><strong>Falsch:</strong> Ich lerne besser, wenn ich schalte mein Handy aus. <strong>Richtig:</strong> ... wenn ich mein Handy ausschalte.</li>
          <li><strong>Falsch:</strong> Ich wiederhole Wörter, um ich sie zu behalten. <strong>Richtig:</strong> ... um sie zu behalten.</li>
        </ul>
      </section>
    </div>
  );
}
