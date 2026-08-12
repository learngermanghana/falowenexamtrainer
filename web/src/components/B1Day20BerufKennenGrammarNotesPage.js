import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 14 };
const box = { border: "1px solid #e5e7eb", borderRadius: 12, padding: 14, background: "#fff", lineHeight: 1.75 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };

export default function B1Day20BerufKennenGrammarNotesPage() {
  return <div style={{ ...styles.container, display: "grid", gap: 16 }}>
    <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
    <header style={card}>
      <span style={{ ...styles.badge, width: "fit-content" }}>B1 · Day 20 · Grammar Notes</span>
      <h1 style={{ ...styles.title, margin: 0 }}>Berufe kennenlernen und beschreiben</h1>
      <p style={{ ...styles.subtitle, margin: 0 }}>Grammatikfokus: Berufsaufgaben, Anforderungen und persönliche Eignung mit Relativsätzen, Modalverben und Nebensätzen erklären.</p>
    </header>
    <section style={card}><h2 style={{ margin: 0 }}>1. Berufe mit Relativsätzen beschreiben</h2><div style={box}>Ein Arzt ist eine Person, <strong>die Patienten untersucht</strong>.<br/>Ein Beruf, <strong>der mich interessiert</strong>, ist Informatiker.</div><p style={{margin:0}}>Im Relativsatz steht das konjugierte Verb am Ende.</p></section>
    <section style={card}><h2 style={{ margin: 0 }}>2. Anforderungen mit Modalverben</h2><ul style={list}><li>Man <strong>muss</strong> gut kommunizieren <strong>können</strong>.</li><li>Man <strong>sollte</strong> zuverlässig und geduldig <strong>sein</strong>.</li><li>In diesem Beruf <strong>muss</strong> man oft im Team <strong>arbeiten</strong>.</li></ul></section>
    <section style={card}><h2 style={{ margin: 0 }}>3. Eignung und Meinung begründen</h2><ul style={list}><li>Dieser Beruf passt zu mir, <strong>weil ich gern mit Menschen arbeite</strong>.</li><li>Ich denke, <strong>dass praktische Erfahrung sehr wichtig ist</strong>.</li><li><strong>Wenn</strong> man kreativ ist, kann dieser Beruf gut passen.</li></ul></section>
    <section style={card}><h2 style={{ margin: 0 }}>4. Nützliche Berufssprache</h2><ul style={list}><li>Verantwortung übernehmen</li><li>Berufserfahrung sammeln</li><li>eine Ausbildung absolvieren</li><li>Kenntnisse erwerben</li><li>sich weiterbilden</li><li>mit Kunden / Patienten / Kollegen umgehen</li></ul></section>
    <section style={card}><h2 style={{ margin: 0 }}>Mini-Übung</h2><ol style={list}><li>Beschreibe einen Beruf mit einem Relativsatz.</li><li>Nenne zwei Anforderungen mit Modalverben.</li><li>Erkläre mit weil, warum der Beruf zu dir passt oder nicht.</li></ol></section>
  </div>;
}
