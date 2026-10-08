import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";
import B1GrammarEnglishSupport from "./B1GrammarEnglishSupport";

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
          Ein Grammatikfokus: Ziele und Absichten mit <strong>um ... zu</strong> ausdrücken.
        </p>
      </header>

      <B1GrammarEnglishSupport day={18} />

      <section style={card}>
        <h2 style={title}>Lernziel: Warum machst du das?</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Erkläre einen Schritt auf dem Weg zu deinem Wunschberuf und sage, welches Ziel du damit erreichen möchtest.
          Heute übst du dafür nur eine Struktur: <strong>um ... zu</strong>.
        </p>
        <div style={good}>
          <strong>Beispiel</strong>
          <span>Ich mache ein Praktikum, <strong>um Berufserfahrung zu sammeln</strong>.</span>
          <span>Ziel: Berufserfahrung sammeln.</span>
        </div>
      </section>

      <section style={card}>
        <h2 style={title}>Die Regel: Hauptsatz + um ... zu + Infinitiv</h2>
        <div style={box}>
          <strong>So baust du den Satz</strong>
          <span>Ich besuche einen Kurs, <strong>um</strong> meine Chancen <strong>zu verbessern</strong>.</span>
          <span>Handlung: Ich besuche einen Kurs. Ziel: meine Chancen verbessern.</span>
        </div>
        <ul style={list}>
          <li>Setze ein Komma vor <strong>um</strong>.</li>
          <li>Setze <strong>zu + Infinitiv</strong> ans Ende des Zielsatzes.</li>
          <li>Die handelnde Person bleibt dieselbe: <strong>Ich</strong> besuche den Kurs; <strong>ich</strong> möchte meine Chancen verbessern.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>Vier Beispiele aus der Berufswelt</h2>
        <ul style={list}>
          <li>Ich schreibe einen Lebenslauf, <strong>um mich zu bewerben</strong>.</li>
          <li>Ich lerne Deutsch, <strong>um in Deutschland zu arbeiten</strong>.</li>
          <li>Ich mache eine Weiterbildung, <strong>um neue Kenntnisse zu erwerben</strong>.</li>
          <li>Ich übe Vorstellungsgespräche, <strong>um sicherer zu werden</strong>.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>Häufige Fehler vermeiden</h2>
        <div style={warn}>
          <strong>Falsch</strong>
          <span>Ich mache ein Praktikum, um ich Erfahrungen sammle.</span>
          <span>Ich mache ein Praktikum, um Erfahrungen sammeln.</span>
        </div>
        <div style={good}>
          <strong>Richtig</strong>
          <span>Ich mache ein Praktikum, <strong>um Erfahrungen zu sammeln</strong>.</span>
        </div>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Merke: Nach <strong>um</strong> wiederholst du das Subjekt nicht. Vor dem Infinitiv steht <strong>zu</strong>.
        </p>
      </section>

      <section style={card}>
        <h2 style={title}>Mini-Übung: Formuliere den Zweck</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>Verbinde die zwei Aussagen jeweils mit <strong>um ... zu</strong>.</p>
        <ol style={list}>
          <li>Ich mache ein Praktikum. Ich möchte Erfahrungen sammeln.</li>
          <li>Ich lerne Deutsch. Ich möchte in Deutschland arbeiten.</li>
          <li>Ich besuche einen Kurs. Ich möchte meine Fähigkeiten verbessern.</li>
        </ol>
        <details style={box}>
          <summary style={{ cursor: "pointer", fontWeight: 700 }}>Lösungen anzeigen</summary>
          <ol style={list}>
            <li>Ich mache ein Praktikum, um Erfahrungen zu sammeln.</li>
            <li>Ich lerne Deutsch, um in Deutschland zu arbeiten.</li>
            <li>Ich besuche einen Kurs, um meine Fähigkeiten zu verbessern.</li>
          </ol>
        </details>
      </section>

      <section style={card}>
        <h2 style={title}>Deine Aufgabe</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Nenne deinen Wunschberuf und schreibe drei konkrete Schritte dorthin. Erkläre bei jedem Schritt das Ziel mit <strong>um ... zu</strong>.
        </p>
        <div style={box}>
          <strong>Satzanfang</strong>
          <span>Ich möchte ..., um ... zu ...</span>
        </div>
      </section>
    </div>
  );
}
