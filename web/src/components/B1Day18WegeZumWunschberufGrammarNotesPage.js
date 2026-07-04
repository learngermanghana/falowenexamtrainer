import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 14 };
const box = { border: "1px solid #e5e7eb", borderRadius: 12, padding: 14, background: "#fff", lineHeight: 1.75, display: "grid", gap: 8 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const title = { margin: 0, fontSize: "1.15rem" };
const good = { ...box, background: "#f0fdf4", borderColor: "#bbf7d0" };
const warn = { ...box, background: "#fef2f2", borderColor: "#fecaca" };

export default function B1Day18WegeZumWunschberufGrammarNotesPage() {
  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
      <header style={card}>
        <span style={{ ...styles.badge, width: "fit-content" }}>B1 · Day 18 · Kapitel 6.18 · Grammar Notes</span>
        <h1 style={{ ...styles.title, margin: 0 }}>Wege zum Wunschberuf</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Grammatikfokus: Berufswege beschreiben mit Infinitiv mit zu, Relativsätzen, je nachdem, Nebensätzen und Bewerbungsvokabular.
        </p>
      </header>

      <section style={card}>
        <h2 style={title}>Warum ist diese Grammatik für das Thema nützlich?</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Wenn du über deinen Wunschberuf sprichst, musst du Ziele, Qualifikationen und nächste Schritte erklären. Dafür brauchst du Strukturen wie <strong>um ... zu</strong>, <strong>Es ist wichtig, ... zu ...</strong>, Relativsätze wie <strong>ein Beruf, der ...</strong>, und Nebensätze mit <strong>weil</strong>, <strong>dass</strong>, <strong>wenn</strong> und <strong>je nachdem</strong>.
        </p>
      </section>

      <section style={card}>
        <h2 style={title}>Lernziele</h2>
        <ul style={list}>
          <li>Den eigenen Wunschberuf klar beschreiben und begründen.</li>
          <li>Ausbildung, Studium, Praktikum und Weiterbildung vergleichen.</li>
          <li>Wichtige Fähigkeiten und Qualifikationen mit Relativsätzen erklären.</li>
          <li>Über Bewerbungsprozess, Lebenslauf und Vorstellungsgespräch sprechen.</li>
          <li>Eine B1-Meinung zu verschiedenen Wegen zum Wunschberuf schreiben.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>1. Ziele ausdrücken mit „um ... zu“</h2>
        <div style={box}>
          <strong>Struktur</strong>
          <span>Ich mache ein Praktikum, <strong>um Erfahrungen zu sammeln</strong>.</span>
        </div>
        <ul style={list}>
          <li>Ich besuche einen Kurs, <strong>um meine digitalen Kompetenzen zu verbessern</strong>.</li>
          <li>Ich schreibe einen Lebenslauf, <strong>um mich zu bewerben</strong>.</li>
          <li>Ich mache eine Weiterbildung, <strong>um bessere Karrierechancen zu haben</strong>.</li>
          <li>Ich übe Vorstellungsgespräche, <strong>um sicherer zu werden</strong>.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>2. Infinitiv mit „zu“ nach wichtigen Ausdrücken</h2>
        <ul style={list}>
          <li>Es ist wichtig, die eigenen Stärken <strong>zu kennen</strong>.</li>
          <li>Es ist sinnvoll, verschiedene Berufsfelder <strong>zu erkunden</strong>.</li>
          <li>Ich habe vor, mich weiter <strong>zu qualifizieren</strong>.</li>
          <li>Ich versuche, meine Kommunikationsfähigkeit <strong>zu verbessern</strong>.</li>
        </ul>
        <div style={good}><strong>Richtig:</strong> Es ist wichtig, ein Praktikum zu machen.</div>
        <div style={warn}><strong>Falsch:</strong> Es ist wichtig, machen ein Praktikum.</div>
      </section>

      <section style={card}>
        <h2 style={title}>3. Relativsätze für Berufe und Fähigkeiten</h2>
        <div style={box}>
          <strong>Relativpronomen</strong>
          <span>der Beruf, <strong>der</strong> mich interessiert · die Fähigkeit, <strong>die</strong> wichtig ist · das Praktikum, <strong>das</strong> mir geholfen hat.</span>
        </div>
        <ul style={list}>
          <li>Ich suche einen Beruf, <strong>der</strong> zu meinen Stärken passt.</li>
          <li>Kommunikationsfähigkeit ist eine Fähigkeit, <strong>die</strong> im Beruf sehr wichtig ist.</li>
          <li>Ein Praktikum ist eine Erfahrung, <strong>die</strong> bei der Berufswahl helfen kann.</li>
          <li>Ich möchte in einem Bereich arbeiten, <strong>in dem</strong> ich mich weiterentwickeln kann.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>4. Wege vergleichen mit „je nachdem“</h2>
        <ul style={list}>
          <li><strong>Je nachdem,</strong> welcher Beruf einen interessiert, braucht man eine Ausbildung oder ein Studium.</li>
          <li><strong>Je nachdem,</strong> welche Stärken man hat, passt ein anderer Beruf besser.</li>
          <li>Man kann verschiedene Wege wählen, <strong>je nachdem,</strong> was am besten zu den eigenen Lebensumständen passt.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>5. Meinung begründen mit Nebensätzen</h2>
        <ul style={list}>
          <li>Ich stimme Lena zu, <strong>weil es viele Wege zum Wunschberuf gibt</strong>.</li>
          <li>Ich finde, <strong>dass jeder seinen eigenen Weg wählen sollte</strong>.</li>
          <li><strong>Wenn</strong> man praktische Erfahrung braucht, ist eine Ausbildung sinnvoll.</li>
          <li><strong>Obwohl</strong> ein Studium viele Chancen bietet, ist es nicht für jeden die beste Lösung.</li>
        </ul>
        <div style={good}><strong>Richtig:</strong> Ich denke, dass Praktika sehr hilfreich sind.</div>
        <div style={warn}><strong>Falsch:</strong> Ich denke, dass sind Praktika sehr hilfreich.</div>
      </section>

      <section style={card}>
        <h2 style={title}>6. Bewerbungsvokabular</h2>
        <ul style={list}>
          <li>einen Lebenslauf schreiben</li>
          <li>ein Bewerbungsschreiben formulieren</li>
          <li>sich um eine Stelle bewerben</li>
          <li>ein Vorstellungsgespräch vorbereiten</li>
          <li>Berufserfahrung sammeln</li>
          <li>eine Weiterbildung machen</li>
          <li>neue Kenntnisse erwerben</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>Redemittel für Sprechen und Schreiben</h2>
        <ul style={list}>
          <li>Mein Wunschberuf ist ..., weil ...</li>
          <li>Für diesen Beruf braucht man ...</li>
          <li>Ein möglicher Weg ist eine Ausbildung / ein Studium / ein Praktikum.</li>
          <li>Ich möchte meine Fähigkeiten verbessern, indem ich ...</li>
          <li>Ein Vorteil dieses Berufs ist, dass ...</li>
          <li>Eine Schwierigkeit ist, dass ...</li>
          <li>Zusammenfassend bin ich der Meinung, dass ...</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>Häufige B1-Fehler</h2>
        <ul style={list}>
          <li>„Ich bewerbe eine Stelle“ schreiben; richtig: <strong>Ich bewerbe mich um eine Stelle</strong>.</li>
          <li>Nach <strong>weil/dass/wenn/obwohl</strong> das Verb nicht ans Satzende stellen.</li>
          <li><strong>um ... zu</strong> vergessen: „Ich mache ein Praktikum, um Erfahrung zu sammeln.“</li>
          <li>Nur den Traumberuf nennen, aber nicht den Weg dorthin erklären.</li>
          <li>Ausbildung und Studium nicht klar unterscheiden.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>Mini-Übung: Formuliere beruflich</h2>
        <ol style={list}>
          <li>Ich mache ein Praktikum. Ich möchte Erfahrung sammeln. → Verwende <strong>um ... zu</strong>.</li>
          <li>Das ist ein Beruf. Der Beruf passt zu meinen Stärken. → Verwende einen <strong>Relativsatz</strong>.</li>
          <li>Viele Menschen studieren. Andere machen eine Ausbildung. → Verwende <strong>während</strong>.</li>
          <li>Jeder sollte seinen eigenen Weg wählen. Der Weg muss zu ihm passen. → Verwende <strong>weil</strong>.</li>
        </ol>
      </section>
    </div>
  );
}
