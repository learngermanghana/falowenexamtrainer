import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 14 };
const box = { border: "1px solid #e5e7eb", borderRadius: 12, padding: 14, background: "#fff", lineHeight: 1.75, display: "grid", gap: 8 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const title = { margin: 0, fontSize: "1.15rem" };
const good = { ...box, background: "#f0fdf4", borderColor: "#bbf7d0" };
const warn = { ...box, background: "#fef2f2", borderColor: "#fecaca" };

export default function B1Day21LebensformenHeuteGrammarNotesPage() {
  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
      <header style={card}>
        <span style={{ ...styles.badge, width: "fit-content" }}>B1 · Day 21 · Kapitel 7.21 · Grammar Notes</span>
        <h1 style={{ ...styles.title, margin: 0 }}>Lebensformen heute</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Grammatikfokus: Vor- und Nachteile abwägen mit zweiteiligen Konnektoren und Nebensätzen.</p>
      </header>

      <section style={card}>
        <h2 style={title}>Warum ist diese Grammatik für das Thema nützlich?</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>Bei Lebensformen musst du vergleichen, Gründe nennen und Gegensätze bewerten: Familie gibt Sicherheit, aber sie bringt Verantwortung. Eine WG ist günstiger, obwohl man Kompromisse machen muss. Dafür brauchst du klare Verbindungen zwischen Sätzen.</p>
      </section>

      <section style={card}>
        <h2 style={title}>Lernziele</h2>
        <ul style={list}>
          <li>Vor- und Nachteile von Familie, WG, Singleleben und neuen Lebensformen strukturiert nennen.</li>
          <li>Sätze mit <strong>weil</strong>, <strong>obwohl</strong>, <strong>während</strong> und <strong>dass</strong> korrekt bilden.</li>
          <li>Zweiteilige Konnektoren wie <strong>einerseits … andererseits</strong> und <strong>zwar … aber</strong> verwenden.</li>
          <li>Eine persönliche B1-Meinung mit Begründung formulieren.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>1. Nebensätze: Verb am Ende</h2>
        <div style={box}><strong>Struktur</strong><span>Hauptsatz + Komma + weil/obwohl/dass + Subjekt + Ergänzungen + Verb am Ende.</span></div>
        <ul style={list}>
          <li>Ich finde eine WG praktisch, <strong>weil man die Kosten teilen kann</strong>.</li>
          <li>Singleleben passt zu mir, <strong>obwohl es manchmal einsam sein kann</strong>.</li>
          <li>Ich denke, <strong>dass jede Person selbst entscheiden sollte</strong>.</li>
        </ul>
        <div style={good}><strong>Richtig:</strong> Ich mag das Familienleben, weil man viel Unterstützung <strong>bekommt</strong>.</div>
        <div style={warn}><strong>Falsch:</strong> Ich mag das Familienleben, weil man <strong>bekommt</strong> viel Unterstützung.</div>
      </section>

      <section style={card}>
        <h2 style={title}>2. Gegensätze mit „während“ und „obwohl“</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}><strong>während</strong> vergleicht zwei Situationen. <strong>obwohl</strong> zeigt einen Gegengrund.</p>
        <ul style={list}>
          <li><strong>Während</strong> eine Familie Geborgenheit bietet, gibt das Singleleben mehr Freiheit.</li>
          <li>Ich würde in einer WG wohnen, <strong>obwohl</strong> es manchmal Konflikte gibt.</li>
          <li>Neue Lebensformen sind flexibel, <strong>während</strong> traditionelle Familien oft stabiler wirken.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>3. Zweiteilige Konnektoren zum Abwägen</h2>
        <div style={box}><strong>einerseits … andererseits</strong><span>Einerseits hat man in einer WG soziale Kontakte, andererseits muss man viele Kompromisse machen.</span></div>
        <div style={box}><strong>zwar … aber</strong><span>Das Singleleben ist zwar sehr frei, aber es kann auch einsam sein.</span></div>
        <div style={box}><strong>nicht nur … sondern auch</strong><span>Eine Familie bietet nicht nur Nähe, sondern auch praktische Unterstützung im Alltag.</span></div>
      </section>

      <section style={card}>
        <h2 style={title}>Häufige B1-Fehler</h2>
        <ul style={list}>
          <li>Nach <strong>weil/obwohl/dass</strong> das Verb nicht ans Satzende stellen.</li>
          <li>„mehr besser“ schreiben; richtig ist nur <strong>besser</strong>.</li>
          <li>„Ich bin agree“ sagen; besser: <strong>Ich bin einverstanden</strong> oder <strong>Ich stimme zu</strong>.</li>
          <li>Nur Vorteile nennen, aber keine Bewertung geben.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>Redemittel für Sprechen und Schreiben</h2>
        <ul style={list}>
          <li>Meiner Meinung nach hängt die beste Lebensform von der persönlichen Situation ab.</li>
          <li>Ein wichtiger Vorteil ist, dass …</li>
          <li>Ein Nachteil besteht darin, dass …</li>
          <li>Für mich passt … am besten, weil …</li>
          <li>Zusammenfassend würde ich sagen, dass …</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>Mini-Übung: Verbinde die Ideen</h2>
        <ol style={list}>
          <li>Eine WG ist günstig. Man muss Kompromisse machen. → Verwende <strong>zwar … aber</strong>.</li>
          <li>Singleleben bietet Freiheit. Es kann einsam sein. → Verwende <strong>obwohl</strong>.</li>
          <li>Familie bietet Nähe. Familie bedeutet Verantwortung. → Verwende <strong>einerseits … andererseits</strong>.</li>
        </ol>
      </section>
    </div>
  );
}
