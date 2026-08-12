import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 14 };
const box = { border: "1px solid #e5e7eb", borderRadius: 12, padding: 14, background: "#fff", lineHeight: 1.75 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };

export default function B1Day23ErstesDateGrammarNotesPage() {
  return <div style={{ ...styles.container, display: "grid", gap: 16 }}>
    <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
    <header style={card}>
      <span style={{ ...styles.badge, width: "fit-content" }}>B1 · Day 23 · Grammar Notes</span>
      <h1 style={{ ...styles.title, margin: 0 }}>Erstes Date – Vorschläge und höfliche Reaktionen</h1>
      <p style={{ ...styles.subtitle, margin: 0 }}>Grammatikfokus: Vorschläge mit Konjunktiv II, Bedingungen mit wenn und Gründe mit weil formulieren.</p>
    </header>
    <section style={card}><h2 style={{ margin: 0 }}>1. Höfliche Vorschläge mit könnten und würden</h2><div style={box}>Wir <strong>könnten</strong> in ein Café gehen.<br/>Ich <strong>würde</strong> einen Spaziergang vorschlagen.</div><p style={{margin:0}}>Konjunktiv II macht Vorschläge höflicher und weniger direkt.</p></section>
    <section style={card}><h2 style={{ margin: 0 }}>2. Gründe mit weil und da</h2><ul style={list}><li>Ein Café ist praktisch, <strong>weil man dort gut sprechen kann</strong>.</li><li>Ich würde einen öffentlichen Ort wählen, <strong>da er sicherer ist</strong>.</li></ul></section>
    <section style={card}><h2 style={{ margin: 0 }}>3. Bedingungen mit wenn</h2><ul style={list}><li><strong>Wenn</strong> das Treffen gut läuft, würde ich ein zweites Date vorschlagen.</li><li><strong>Wenn</strong> man nervös ist, kann man über Hobbys sprechen.</li></ul><div style={box}>Steht der wenn-Satz zuerst, folgt im Hauptsatz direkt das Verb: <strong>Wenn ... , würde ich ...</strong></div></section>
    <section style={card}><h2 style={{ margin: 0 }}>4. Gegensätze und höfliche Reaktionen</h2><ul style={list}><li><strong>Obwohl</strong> ich nervös war, war das Gespräch angenehm.</li><li>Ich fand das Treffen nett, <strong>aber</strong> ich möchte mich nicht noch einmal treffen.</li><li>Vielen Dank für den schönen Abend. Ich würde mich freuen, dich wiederzusehen.</li></ul></section>
    <section style={card}><h2 style={{ margin: 0 }}>Mini-Übung</h2><ol style={list}><li>Mache zwei Vorschläge mit könnten oder würden.</li><li>Begründe einen Treffpunkt mit weil.</li><li>Formuliere einen Wenn-Satz über ein gutes oder schwieriges Date.</li></ol></section>
  </div>;
}
