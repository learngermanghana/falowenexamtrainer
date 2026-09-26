import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";
import B1GrammarEnglishSupport from "./B1GrammarEnglishSupport";

const card = { ...styles.card, display: "grid", gap: 14 };
const box = { border: "1px solid #e5e7eb", borderRadius: 12, padding: 14, background: "#fff", lineHeight: 1.75 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };

export default function B1Day27UmweltfreundlichAlltagGrammarNotesPage() {
  return <div style={{ ...styles.container, display: "grid", gap: 16 }}>
    <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
    <header style={card}>
      <span style={{ ...styles.badge, width: "fit-content" }}>B1 · Day 27 · Grammar Notes</span>
      <h1 style={{ ...styles.title, margin: 0 }}>Umweltfreundlich im Alltag – Alternativen und Methoden</h1>
      <p style={{ ...styles.subtitle, margin: 0 }}>Grammatikfokus: indem, statt … zu, ohne … zu und um … zu für konkrete Umweltmaßnahmen.</p>
    </header>
    <B1GrammarEnglishSupport day={27} />
    <section style={card}><h2 style={{ margin: 0 }}>1. Eine Methode erklären – indem</h2><div style={box}>Man spart Energie, <strong>indem man Geräte ganz ausschaltet</strong>.<br/>Wir vermeiden Plastik, <strong>indem wir Stofftaschen benutzen</strong>.</div><p style={{margin:0}}>Nach <strong>indem</strong> steht das konjugierte Verb am Ende.</p></section>
    <section style={card}><h2 style={{ margin: 0 }}>2. Eine bessere Alternative – statt … zu</h2><ul style={list}><li><strong>Statt mit dem Auto zu fahren</strong>, nehme ich den Bus.</li><li><strong>Statt Einwegflaschen zu kaufen</strong>, benutze ich eine Trinkflasche.</li></ul><p style={{margin:0}}>Diese Konstruktion funktioniert besonders gut, wenn beide Handlungen dasselbe Subjekt haben.</p></section>
    <section style={card}><h2 style={{ margin: 0 }}>3. Etwas vermeiden – ohne … zu</h2><ul style={list}><li>Man kann einkaufen, <strong>ohne Plastiktüten zu benutzen</strong>.</li><li>Viele Geräte verbrauchen Strom, <strong>ohne dass wir es merken</strong>.</li></ul><div style={box}>Gleiches Subjekt: <strong>ohne … zu</strong>. Unterschiedliche Subjekte oder vollständiger Satz: <strong>ohne dass</strong>.</div></section>
    <section style={card}><h2 style={{ margin: 0 }}>4. Ein Ziel nennen – um … zu</h2><ul style={list}><li>Ich kaufe regional, <strong>um Transportwege zu verkürzen</strong>.</li><li>Wir trennen Müll, <strong>um Rohstoffe wiederzuverwenden</strong>.</li></ul></section>
    <section style={card}><h2 style={{ margin: 0 }}>Mini-Übung</h2><ol style={list}><li>Erkläre eine Umweltmaßnahme mit indem.</li><li>Vergleiche Auto und Fahrrad mit statt … zu.</li><li>Formuliere ein Ziel mit um … zu.</li></ol></section>
  </div>;
}
