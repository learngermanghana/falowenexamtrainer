import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";
import B1GrammarEnglishSupport from "./B1GrammarEnglishSupport";

const card = { ...styles.card, display: "grid", gap: 14 };
const box = { border: "1px solid #e5e7eb", borderRadius: 12, padding: 14, background: "#fff", lineHeight: 1.75 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };

export default function B1Day24KonsumNachhaltigkeitGrammarNotesPage() {
  return <div style={{ ...styles.container, display: "grid", gap: 16 }}>
    <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
    <header style={card}>
      <span style={{ ...styles.badge, width: "fit-content" }}>B1 · Day 24 · Grammar Notes</span>
      <h1 style={{ ...styles.title, margin: 0 }}>Konsum und Nachhaltigkeit – Mittel, Folgen und Vergleiche</h1>
      <p style={{ ...styles.subtitle, margin: 0 }}>Grammatikfokus: indem, dadurch dass, je … desto und Passiv für nachhaltige Maßnahmen.</p>
    </header>
    <B1GrammarEnglishSupport day={24} />
    <section style={card}><h2 style={{ margin: 0 }}>1. Wie? – indem und dadurch dass</h2><p style={{margin:0}}>Mit <strong>indem</strong> erklärt man, auf welche Weise etwas passiert. <strong>Dadurch, dass</strong> betont stärker die Ursache oder das Mittel.</p><div style={box}>Man reduziert Müll, <strong>indem man Mehrwegprodukte benutzt</strong>.<br/>Der CO₂-Ausstoß sinkt <strong>dadurch, dass mehr Menschen öffentliche Verkehrsmittel nutzen</strong>.</div><p style={{margin:0}}>In beiden Nebensätzen steht das konjugierte Verb am Ende.</p></section>
    <section style={card}><h2 style={{ margin: 0 }}>2. Entwicklungen vergleichen – je … desto</h2><ul style={list}><li><strong>Je bewusster</strong> wir einkaufen, <strong>desto weniger</strong> Abfall entsteht.</li><li><strong>Je länger</strong> Produkte genutzt werden, <strong>desto nachhaltiger</strong> ist der Konsum.</li></ul><div style={box}>Im desto-Satz steht das Verb direkt nach dem Vergleich: <strong>desto weniger Abfall entsteht</strong>.</div></section>
    <section style={card}><h2 style={{ margin: 0 }}>3. Prozesse im Passiv</h2><ul style={list}><li>Plastik <strong>wird recycelt</strong>.</li><li>Regionale Produkte <strong>werden verkauft</strong>.</li><li>Verpackungen <strong>können wiederverwendet werden</strong>.</li></ul><p style={{margin:0}}>Das Passiv ist nützlich, wenn die Handlung wichtiger ist als die Person, die sie ausführt.</p></section>
    <section style={card}><h2 style={{ margin: 0 }}>4. Argumente genauer machen</h2><ul style={list}><li><strong>Einerseits</strong> sind nachhaltige Produkte oft teurer, <strong>andererseits</strong> halten sie häufig länger.</li><li><strong>Obwohl</strong> Secondhand günstig sein kann, kaufen viele Menschen lieber neue Produkte.</li><li>Nachhaltige Produkte sind manchmal teurer. <strong>Trotzdem</strong> entscheide ich mich oft dafür.</li></ul></section>
    <section style={card}><h2 style={{ margin: 0 }}>Mini-Übung</h2><ol style={list}><li>Formuliere einen Satz mit indem über Müllvermeidung.</li><li>Bilde einen je-desto-Satz über Konsum und Umwelt.</li><li>Beschreibe einen Recyclingprozess im Passiv.</li></ol></section>
  </div>;
}
