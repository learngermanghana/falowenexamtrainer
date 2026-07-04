import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 14 };
const box = { border: "1px solid #e5e7eb", borderRadius: 12, padding: 14, background: "#fff", lineHeight: 1.75, display: "grid", gap: 8 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const title = { margin: 0, fontSize: "1.15rem" };
const good = { ...box, background: "#f0fdf4", borderColor: "#bbf7d0" };
const warn = { ...box, background: "#fef2f2", borderColor: "#fecaca" };

export default function B1Day14TraditionellesDigitalesLernenGrammarNotesPage() {
  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
      <header style={card}>
        <span style={{ ...styles.badge, width: "fit-content" }}>B1 · Day 14 · Kapitel 5.14 · Grammar Notes</span>
        <h1 style={{ ...styles.title, margin: 0 }}>Traditionelles vs. digitales Lernen</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Grammatikfokus: Lernmethoden vergleichen, Vor- und Nachteile abwägen und eine formelle Absage höflich schreiben.
        </p>
      </header>

      <section style={card}>
        <h2 style={title}>Warum ist diese Grammatik für das Thema nützlich?</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Bei diesem Thema vergleichst du zwei Lernformen. Du erklärst Vorteile und Nachteile, begründest deine Meinung und schreibst eine formelle E-Mail an den Chef. Dafür brauchst du Vergleichssätze mit <strong>während</strong>, <strong>hingegen</strong> und <strong>im Gegensatz zu</strong>, Nebensätze mit <strong>weil</strong> und <strong>dass</strong> sowie höfliche Formulierungen wie <strong>Leider kann ich nicht teilnehmen</strong>.
        </p>
      </section>

      <section style={card}>
        <h2 style={title}>Lernziele</h2>
        <ul style={list}>
          <li>Traditionelles und digitales Lernen klar vergleichen.</li>
          <li>Vorteile und Nachteile mit passenden Konnektoren nennen.</li>
          <li>Eine B1-Meinung mit Begründung formulieren.</li>
          <li>Eine kurze formelle E-Mail mit Anrede, Grund und Gruß schreiben.</li>
          <li>Über lebenslanges Lernen, Weiterbildung und Zeitmanagement sprechen.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>1. Vergleiche mit „während“, „hingegen“ und „im Gegensatz zu“</h2>
        <div style={box}>
          <strong>während + Verb am Ende</strong>
          <span><strong>Während</strong> traditionelles Lernen persönlichen Kontakt bietet, ist digitales Lernen flexibler.</span>
        </div>
        <div style={box}>
          <strong>hingegen / dagegen im Hauptsatz</strong>
          <span>Digitales Lernen ist flexibel. Traditionelles Lernen <strong>hingegen</strong> bietet mehr direkten Kontakt.</span>
        </div>
        <div style={box}>
          <strong>im Gegensatz zu + Dativ</strong>
          <span><strong>Im Gegensatz zu</strong> digitalen Kursen hat Unterricht im Klassenzimmer feste Zeiten.</span>
        </div>
      </section>

      <section style={card}>
        <h2 style={title}>2. Vor- und Nachteile abwägen</h2>
        <ul style={list}>
          <li><strong>Einerseits</strong> ist digitales Lernen flexibel, <strong>andererseits</strong> gibt es oft technische Probleme.</li>
          <li>Traditionelles Lernen ist <strong>zwar</strong> weniger flexibel, <strong>aber</strong> man hat direkten Kontakt mit Lehrern.</li>
          <li>Digitale Methoden bieten <strong>nicht nur</strong> Online-Ressourcen, <strong>sondern auch</strong> interaktive Übungen.</li>
          <li>Manche Schüler lernen <strong>sowohl</strong> online <strong>als auch</strong> im Klassenzimmer gut.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>3. Meinung begründen mit Nebensätzen</h2>
        <ul style={list}>
          <li>Ich bevorzuge digitales Lernen, <strong>weil ich flexibel lernen kann</strong>.</li>
          <li>Ich denke, <strong>dass eine Kombination aus beiden Methoden am besten ist</strong>.</li>
          <li><strong>Obwohl</strong> Online-Lernen praktisch ist, fehlt manchmal die persönliche Kommunikation.</li>
          <li>Viele Schulen nutzen digitale Methoden, <strong>damit Schüler Zugang zu mehr Ressourcen haben</strong>.</li>
        </ul>
        <div style={good}><strong>Richtig:</strong> Ich finde digitales Lernen praktisch, weil ich in meinem eigenen Tempo lernen kann.</div>
        <div style={warn}><strong>Falsch:</strong> Ich finde digitales Lernen praktisch, weil ich kann in meinem eigenen Tempo lernen.</div>
      </section>

      <section style={card}>
        <h2 style={title}>4. Formelle Absage an den Chef</h2>
        <div style={box}>
          <strong>Struktur</strong>
          <span>Anrede → Dank → klare Absage → Begründung → höflicher Schluss → Gruß.</span>
        </div>
        <ul style={list}>
          <li><strong>Sehr geehrter Herr Müller,</strong></li>
          <li>vielen Dank für die Möglichkeit, an dem Weiterbildungsprogramm teilzunehmen.</li>
          <li>Leider kann ich an dem Programm nicht teilnehmen.</li>
          <li>Der Grund ist, dass es nach meiner regulären Arbeitszeit stattfindet und sechs Monate dauert.</li>
          <li>Ich bitte um Ihr Verständnis.</li>
          <li><strong>Mit freundlichen Grüßen</strong></li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>5. Nomen-Verb-Verbindungen zum Thema Lernen</h2>
        <ul style={list}>
          <li>an einem Kurs <strong>teilnehmen</strong></li>
          <li>eine Weiterbildung <strong>machen</strong></li>
          <li>neues Wissen <strong>erwerben</strong></li>
          <li>Fähigkeiten <strong>aktualisieren</strong></li>
          <li>Zeit zum Lernen <strong>finden</strong></li>
          <li>die Motivation <strong>aufrechterhalten</strong></li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>Redemittel für Sprechen und Schreiben</h2>
        <ul style={list}>
          <li>Ich möchte heute über verschiedene Lernmethoden sprechen.</li>
          <li>Traditionelles Lernen bedeutet, dass ...</li>
          <li>Digitales Lernen bietet die Möglichkeit, ...</li>
          <li>Ein großer Vorteil ist, dass ...</li>
          <li>Ein Nachteil besteht darin, dass ...</li>
          <li>In meinem Heimatland wird eher ... bevorzugt.</li>
          <li>Zusammenfassend bin ich der Meinung, dass ...</li>
          <li>Leider kann ich an dem Programm nicht teilnehmen.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>Häufige B1-Fehler</h2>
        <ul style={list}>
          <li>Nach <strong>weil/dass/obwohl/während/damit</strong> das Verb nicht ans Satzende stellen.</li>
          <li>In formellen E-Mails „Hallo Chef“ schreiben; besser: <strong>Sehr geehrter Herr ...</strong></li>
          <li>Nur Vorteile einer Methode nennen, aber keinen Vergleich machen.</li>
          <li>„Ich bin teilnehmen“ schreiben; richtig: <strong>Ich kann nicht teilnehmen</strong>.</li>
          <li>Den Gruß am Ende vergessen.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>Mini-Übung: Vergleiche und begründe</h2>
        <ol style={list}>
          <li>Digitales Lernen ist flexibel. Traditionelles Lernen bietet mehr persönlichen Kontakt. → Verwende <strong>während</strong>.</li>
          <li>Online-Kurse sind praktisch. Es gibt technische Probleme. → Verwende <strong>zwar ... aber</strong>.</li>
          <li>Ich bevorzuge eine Kombination. Beide Methoden haben Vorteile. → Verwende <strong>weil</strong>.</li>
          <li>Ich kann nicht am Kurs teilnehmen. Der Kurs findet nach der Arbeitszeit statt. → Schreibe einen formellen Satz.</li>
        </ol>
      </section>
    </div>
  );
}
