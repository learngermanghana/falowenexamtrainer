import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";
import B1GrammarEnglishSupport from "./B1GrammarEnglishSupport";

const card = { ...styles.card, display: "grid", gap: 14 };
const box = { border: "1px solid #e5e7eb", borderRadius: 12, padding: 14, background: "#fff", lineHeight: 1.75 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };

export default function B1Day26ReiseproblemeGrammarNotesPage() {
  return <div style={{ ...styles.container, display: "grid", gap: 16 }}>
    <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
    <header style={card}>
      <span style={{ ...styles.badge, width: "fit-content" }}>B1 · Day 26 · Grammar Notes</span>
      <h1 style={{ ...styles.title, margin: 0 }}>Reiseprobleme und Lösungen – Reihenfolge und höfliche Hilfe</h1>
      <p style={{ ...styles.subtitle, margin: 0 }}>Grammatikfokus: nachdem/bevor, falls, Konjunktiv II und Plusquamperfekt als B1-Erweiterung.</p>
    </header>
    <B1GrammarEnglishSupport day={26} />
    <section style={card}><h2 style={{ margin: 0 }}>1. Ereignisse ordnen – bevor und nachdem</h2><ul style={list}><li><strong>Bevor</strong> ich abreise, kontrolliere ich meinen Pass.</li><li><strong>Nachdem</strong> ich am Flughafen angekommen war, bemerkte ich, dass mein Gepäck fehlte.</li></ul><p style={{margin:0}}>Mit <strong>bevor</strong> passiert die Handlung im Hauptsatz zuerst und die Handlung im Nebensatz danach. Mit <strong>nachdem</strong> passiert die Handlung im Nebensatz zuerst und die Handlung im Hauptsatz danach.</p></section>
    <section style={card}><h2 style={{ margin: 0 }}>2. Frühere Vergangenheit – Plusquamperfekt</h2><div style={box}>Ich <strong>hatte</strong> online eingecheckt, bevor ich zum Flughafen fuhr.<br/>Der Zug <strong>war</strong> schon <strong>abgefahren</strong>, als wir ankamen.</div><p style={{margin:0}}>Form: <strong>hatte/war + Partizip II</strong>. Nutze es, wenn du zwei vergangene Ereignisse zeitlich klar ordnen möchtest.</p></section>
    <section style={card}><h2 style={{ margin: 0 }}>3. Notfallbedingungen mit falls</h2><ul style={list}><li><strong>Falls</strong> der Flug ausfällt, würde ich zuerst die Airline kontaktieren.</li><li><strong>Falls</strong> mein Pass verloren geht, gehe ich zur Botschaft.</li></ul></section>
    <section style={card}><h2 style={{ margin: 0 }}>4. Höflich um Hilfe bitten</h2><ul style={list}><li><strong>Könnten Sie</strong> mir bitte weiterhelfen?</li><li><strong>Würden Sie</strong> bitte prüfen, ob eine Umbuchung möglich ist?</li><li>Ich <strong>würde gern</strong> wissen, wann der nächste Zug fährt.</li></ul></section>
    <section style={card}><h2 style={{ margin: 0 }}>Mini-Übung</h2><ol style={list}><li>Verbinde zwei Reiseereignisse mit nachdem.</li><li>Formuliere einen Satz im Plusquamperfekt.</li><li>Bitte höflich um eine Umbuchung.</li></ol></section>
  </div>;
}
