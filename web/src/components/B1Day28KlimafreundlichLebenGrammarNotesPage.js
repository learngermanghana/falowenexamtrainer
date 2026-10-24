import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";
import B1GrammarEnglishSupport from "./B1GrammarEnglishSupport";

const card = { ...styles.card, display: "grid", gap: 14 };
const box = { border: "1px solid #e5e7eb", borderRadius: 12, padding: 14, background: "#fff", lineHeight: 1.75 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };

export default function B1Day28KlimafreundlichLebenGrammarNotesPage() {
  return <div style={{ ...styles.container, display: "grid", gap: 16 }}>
    <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
    <header style={card}>
      <span style={{ ...styles.badge, width: "fit-content" }}>B1 · Day 28 · Grammar Notes</span>
      <h1 style={{ ...styles.title, margin: 0 }}>Klimafreundlich leben – Folgen, Kontraste und Bedingungen</h1>
      <p style={{ ...styles.subtitle, margin: 0 }}>Grammatikfokus: je … desto, obwohl/trotzdem, wenn-Sätze und Konjunktiv II für realistische Klimavorschläge.</p>
    </header>
    <B1GrammarEnglishSupport day={28} />
    <section style={card}><h2 style={{ margin: 0 }}>1. Zwei Entwicklungen verbinden – je … desto</h2><ul style={list}><li><strong>Je weniger</strong> Energie wir verbrauchen, <strong>desto geringer</strong> sind die Emissionen.</li><li><strong>Je häufiger</strong> Menschen den Bus nutzen, <strong>desto weniger</strong> Autos sind unterwegs.</li></ul><div style={box}>Nach <strong>desto + Vergleich</strong> folgt das Verb: desto geringer <strong>sind</strong> …</div></section>
    <section style={card}><h2 style={{ margin: 0 }}>2. Kontrast – obwohl und trotzdem</h2><ul style={list}><li><strong>Obwohl</strong> klimafreundliche Produkte manchmal teurer sind, kaufe ich sie.</li><li>Klimafreundliche Produkte sind manchmal teurer. <strong>Trotzdem kaufe</strong> ich sie.</li></ul><p style={{margin:0}}>Nach <strong>obwohl</strong> steht das Verb am Ende. Nach <strong>trotzdem</strong> folgt im Hauptsatz direkt das Verb.</p></section>
    <section style={card}><h2 style={{ margin: 0 }}>3. Bedingungen und Folgen mit wenn</h2><ul style={list}><li><strong>Wenn</strong> mehr Menschen erneuerbare Energie nutzen, sinken die Emissionen.</li><li><strong>Wenn</strong> öffentliche Verkehrsmittel günstiger wären, <strong>würden</strong> mehr Menschen sie benutzen.</li></ul></section>
    <section style={card}><h2 style={{ margin: 0 }}>4. Realistische Vorschläge mit Konjunktiv II</h2><ul style={list}><li>Die Stadt <strong>könnte</strong> mehr Radwege bauen.</li><li>Man <strong>könnte</strong> regionale Produkte stärker fördern.</li><li>Ich <strong>würde</strong> häufiger Bus fahren, wenn die Verbindung besser wäre.</li></ul></section>
    <section style={card}><h2 style={{ margin: 0 }}>Mini-Übung</h2><ol style={list}><li>Bilde einen je-desto-Satz zum Energieverbrauch.</li><li>Verbinde zwei Gegensätze mit obwohl.</li><li>Formuliere einen Klimavorschlag mit könnte oder würde.</li></ol></section>
  </div>;
}
