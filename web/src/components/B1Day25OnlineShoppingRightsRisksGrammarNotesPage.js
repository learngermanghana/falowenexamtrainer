import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";
import B1GrammarEnglishSupport from "./B1GrammarEnglishSupport";

const card = { ...styles.card, display: "grid", gap: 14 };
const box = { border: "1px solid #e5e7eb", borderRadius: 12, padding: 14, background: "#fff", lineHeight: 1.75 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };

export default function B1Day25OnlineShoppingRightsRisksGrammarNotesPage() {
  return <div style={{ ...styles.container, display: "grid", gap: 16 }}>
    <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
    <header style={card}>
      <span style={{ ...styles.badge, width: "fit-content" }}>B1 · Day 25 · Grammar Notes</span>
      <h1 style={{ ...styles.title, margin: 0 }}>Online einkaufen – Bedingungen, Rechte und Reklamationen</h1>
      <p style={{ ...styles.subtitle, margin: 0 }}>Grammatikfokus: falls/wenn, Relativsätze, Passiv mit Modalverben und höfliche Reklamationen.</p>
    </header>
    <B1GrammarEnglishSupport day={25} />
    <section style={card}><h2 style={{ margin: 0 }}>1. Bedingungen mit wenn und falls</h2><div style={box}><strong>Wenn</strong> die Ware beschädigt ist, kann man sie zurückschicken.<br/><strong>Falls</strong> Sie keine Bestätigung erhalten, kontaktieren Sie den Kundenservice.</div><p style={{margin:0}}><strong>Falls</strong> klingt oft etwas formeller oder vorsichtiger als <strong>wenn</strong>. In beiden Nebensätzen steht das Verb am Ende.</p></section>
    <section style={card}><h2 style={{ margin: 0 }}>2. Relativsätze für Produkte und Shops</h2><ul style={list}><li>Ein Shop, <strong>der sichere Bezahlmethoden anbietet</strong>, ist vertrauenswürdiger.</li><li>Eine Ware, <strong>die beschädigt angekommen ist</strong>, kann reklamiert werden.</li><li>Das Produkt, <strong>das ich bestellt habe</strong>, war falsch.</li></ul></section>
    <section style={card}><h2 style={{ margin: 0 }}>3. Rechte und Regeln im Passiv</h2><ul style={list}><li>Die Ware <strong>muss zurückgeschickt werden</strong>.</li><li>Der Kaufpreis <strong>kann erstattet werden</strong>.</li><li>Persönliche Daten <strong>müssen geschützt werden</strong>.</li></ul><div style={box}>Mit Modalverb steht am Ende: <strong>Partizip II + werden</strong> → geschützt werden.</div></section>
    <section style={card}><h2 style={{ margin: 0 }}>4. Höflich reklamieren</h2><ul style={list}><li><strong>Ich möchte Sie bitten,</strong> mir den Kaufpreis zu erstatten.</li><li><strong>Könnten Sie mir bitte mitteilen,</strong> wie die Rücksendung funktioniert?</li><li><strong>Ich wäre Ihnen dankbar, wenn</strong> Sie mir Ersatz schicken könnten.</li></ul></section>
    <section style={card}><h2 style={{ margin: 0 }}>Mini-Übung</h2><ol style={list}><li>Schreibe einen Satz mit falls über eine verspätete Lieferung.</li><li>Beschreibe einen sicheren Online-Shop mit einem Relativsatz.</li><li>Formuliere ein Verbraucherrecht im Passiv mit Modalverb.</li></ol></section>
  </div>;
}
