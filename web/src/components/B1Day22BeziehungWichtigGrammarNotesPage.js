import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 14 };
const box = { border: "1px solid #e5e7eb", borderRadius: 12, padding: 14, background: "#fff", lineHeight: 1.75 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };

export default function B1Day22BeziehungWichtigGrammarNotesPage() {
  return <div style={{ ...styles.container, display: "grid", gap: 16 }}>
    <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
    <header style={card}>
      <span style={{ ...styles.badge, width: "fit-content" }}>B1 · Day 22 · Grammar Notes</span>
      <h1 style={{ ...styles.title, margin: 0 }}>Was ist in einer Beziehung wichtig?</h1>
      <p style={{ ...styles.subtitle, margin: 0 }}>Grammatikfokus: Erwartungen, Eigenschaften und gegenseitiges Verhalten mit dass-Sätzen, Relativsätzen und reziproken Ausdrücken beschreiben.</p>
    </header>
    <section style={card}><h2 style={{ margin: 0 }}>1. Erwartungen mit dass</h2><div style={box}>Mir ist wichtig, <strong>dass man offen miteinander spricht</strong>.<br/>Ich finde, <strong>dass Vertrauen eine wichtige Rolle spielt</strong>.</div><p style={{margin:0}}>Im dass-Satz steht das konjugierte Verb am Ende.</p></section>
    <section style={card}><h2 style={{ margin: 0 }}>2. Personen mit Relativsätzen beschreiben</h2><ul style={list}><li>Ich wünsche mir einen Partner, <strong>der zuverlässig ist</strong>.</li><li>Ich schätze Menschen, <strong>die ehrlich kommunizieren</strong>.</li><li>Eine gute Freundin ist jemand, <strong>auf den man sich verlassen kann</strong>.</li></ul></section>
    <section style={card}><h2 style={{ margin: 0 }}>3. Gegenseitiges Verhalten</h2><ul style={list}><li>Wir sprechen offen <strong>miteinander</strong>.</li><li>Partner sollten <strong>füreinander</strong> da sein.</li><li>Man kann viel <strong>voneinander</strong> lernen.</li><li>In einer Beziehung muss man sich <strong>aufeinander</strong> verlassen können.</li></ul></section>
    <section style={card}><h2 style={{ margin: 0 }}>4. Gründe und Bedingungen</h2><ul style={list}><li>Vertrauen ist wichtig, <strong>weil man sich sicher fühlen möchte</strong>.</li><li><strong>Wenn</strong> beide respektvoll kommunizieren, lassen sich Konflikte leichter lösen.</li><li><strong>Obwohl</strong> Menschen unterschiedliche Interessen haben, kann eine Beziehung gut funktionieren.</li></ul></section>
    <section style={card}><h2 style={{ margin: 0 }}>Mini-Übung</h2><ol style={list}><li>Formuliere drei Sätze mit Mir ist wichtig, dass ...</li><li>Beschreibe eine ideale Person mit zwei Relativsätzen.</li><li>Nutze miteinander, füreinander und voneinander in eigenen Sätzen.</li></ol></section>
  </div>;
}
