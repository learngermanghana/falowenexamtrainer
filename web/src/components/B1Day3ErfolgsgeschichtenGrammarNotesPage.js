import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 14 };
const sectionTitle = { margin: 0, fontSize: "1.15rem" };
const listStyle = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const tableStyle = { width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" };
const cellStyle = { border: "1px solid #e5e7eb", padding: "10px 12px", textAlign: "left", verticalAlign: "top" };

const NoteBox = ({ children, warning = false }) => (
  <div style={{ border: `1px solid ${warning ? "#fed7aa" : "#bfdbfe"}`, background: warning ? "#fff7ed" : "#eff6ff", borderRadius: 14, padding: 14, lineHeight: 1.7 }}>
    {children}
  </div>
);

const ExampleBox = ({ children }) => (
  <div style={{ border: "1px solid #e5e7eb", background: "#fff", borderRadius: 12, padding: 12, lineHeight: 1.7 }}>
    {children}
  </div>
);

const B1Day3ErfolgsgeschichtenGrammarNotesPage = () => (
  <div style={{ ...styles.container, display: "grid", gap: 16 }}>
    <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

    <header style={card}>
      <span style={{ ...styles.badge, width: "fit-content" }}>B1 · Day 3 · Kapitel 1.3 · Grammar Notes</span>
      <h1 style={{ ...styles.title, margin: 0 }}>Adjektivdeklination mit unbestimmten Artikeln</h1>
      <p style={{ ...styles.subtitle, margin: 0 }}>
        Grammatik zum Thema <strong>Erfolgsgeschichten</strong>: Personen, Leistungen, Hindernisse und erfolgreiche Projekte genauer beschreiben.
      </p>
    </header>

    <section style={card}>
      <h2 style={sectionTitle}>Warum brauchst du diese Grammatik?</h2>
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        In Erfolgsgeschichten beschreibst du oft Menschen und ihre Leistungen: <em>ein mutiger Unternehmer</em>, <em>eine erfolgreiche Sportlerin</em>,
        <em> ein schwieriges Projekt</em> oder <em>keine leichte Aufgabe</em>. Das Adjektiv steht vor dem Nomen und bekommt eine passende Endung.
      </p>
      <NoteBox>
        <strong>Merke:</strong> Nach <strong>ein, eine, kein, keine</strong> und Possessivartikeln wie <strong>mein, dein, sein, ihr</strong>
        zeigt die Adjektivendung oft Genus und Kasus.
      </NoteBox>
    </section>

    <section style={card}>
      <h2 style={sectionTitle}>1. Nominativ: Wer oder was?</h2>
      <table style={tableStyle}>
        <thead><tr><th style={cellStyle}>Genus</th><th style={cellStyle}>Form</th><th style={cellStyle}>Beispiel</th></tr></thead>
        <tbody>
          <tr><td style={cellStyle}>Maskulin</td><td style={cellStyle}>ein + -er</td><td style={cellStyle}>Ein <strong>erfolgreicher</strong> Unternehmer gründet eine Firma.</td></tr>
          <tr><td style={cellStyle}>Feminin</td><td style={cellStyle}>eine + -e</td><td style={cellStyle}>Eine <strong>mutige</strong> Sportlerin erreicht ihr Ziel.</td></tr>
          <tr><td style={cellStyle}>Neutrum</td><td style={cellStyle}>ein + -es</td><td style={cellStyle}>Ein <strong>großes</strong> Projekt wird abgeschlossen.</td></tr>
          <tr><td style={cellStyle}>Plural</td><td style={cellStyle}>keine/meine + -en</td><td style={cellStyle}>Meine <strong>besten</strong> Ideen entstehen im Team.</td></tr>
        </tbody>
      </table>
    </section>

    <section style={card}>
      <h2 style={sectionTitle}>2. Akkusativ: Wen oder was?</h2>
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        Im Akkusativ ändert sich besonders die maskuline Form: <strong>einen erfolgreichen Mann</strong>. Feminin und Neutrum bleiben wie im Nominativ.
      </p>
      <table style={tableStyle}>
        <thead><tr><th style={cellStyle}>Genus</th><th style={cellStyle}>Form</th><th style={cellStyle}>Beispiel</th></tr></thead>
        <tbody>
          <tr><td style={cellStyle}>Maskulin</td><td style={cellStyle}>einen + -en</td><td style={cellStyle}>Sie trifft einen <strong>erfahrenen</strong> Mentor.</td></tr>
          <tr><td style={cellStyle}>Feminin</td><td style={cellStyle}>eine + -e</td><td style={cellStyle}>Er entwickelt eine <strong>klare</strong> Strategie.</td></tr>
          <tr><td style={cellStyle}>Neutrum</td><td style={cellStyle}>ein + -es</td><td style={cellStyle}>Das Team löst ein <strong>schwieriges</strong> Problem.</td></tr>
          <tr><td style={cellStyle}>Plural</td><td style={cellStyle}>keine/meine + -en</td><td style={cellStyle}>Sie erreicht ihre <strong>wichtigen</strong> Ziele.</td></tr>
        </tbody>
      </table>
    </section>

    <section style={card}>
      <h2 style={sectionTitle}>3. Dativ: Wem?</h2>
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        Im Dativ bekommt das Adjektiv nach ein/eine/mein/kein fast immer die Endung <strong>-en</strong>.
      </p>
      <ExampleBox>
        mit einem <strong>erfahrenen</strong> Kollegen<br />
        mit einer <strong>erfolgreichen</strong> Unternehmerin<br />
        bei einem <strong>internationalen</strong> Projekt<br />
        mit meinen <strong>motivierten</strong> Freunden
      </ExampleBox>
    </section>

    <section style={card}>
      <h2 style={sectionTitle}>4. Schnellübersicht der Endungen</h2>
      <table style={tableStyle}>
        <thead><tr><th style={cellStyle}>Kasus</th><th style={cellStyle}>Maskulin</th><th style={cellStyle}>Feminin</th><th style={cellStyle}>Neutrum</th><th style={cellStyle}>Plural</th></tr></thead>
        <tbody>
          <tr><td style={cellStyle}>Nominativ</td><td style={cellStyle}>-er</td><td style={cellStyle}>-e</td><td style={cellStyle}>-es</td><td style={cellStyle}>-en</td></tr>
          <tr><td style={cellStyle}>Akkusativ</td><td style={cellStyle}>-en</td><td style={cellStyle}>-e</td><td style={cellStyle}>-es</td><td style={cellStyle}>-en</td></tr>
          <tr><td style={cellStyle}>Dativ</td><td style={cellStyle}>-en</td><td style={cellStyle}>-en</td><td style={cellStyle}>-en</td><td style={cellStyle}>-en</td></tr>
        </tbody>
      </table>
      <NoteBox>
        <strong>Lernstrategie:</strong> Merke zuerst die starken Endungen im Nominativ: <strong>-er, -e, -es</strong>. Im Dativ ist es fast immer <strong>-en</strong>.
      </NoteBox>
    </section>

    <section style={card}>
      <h2 style={sectionTitle}>5. Erfolgsgeschichten erzählen</h2>
      <ExampleBox>
        Ama ist eine <strong>erfolgreiche</strong> Unternehmerin. Sie hatte am Anfang keine <strong>leichte</strong> Aufgabe. Mit einem
        <strong> klaren</strong> Plan und einem <strong>motivierten</strong> Team gründete sie eine Firma. Heute leitet sie ein
        <strong> internationales</strong> Unternehmen und unterstützt junge Menschen.
      </ExampleBox>
    </section>

    <section style={card}>
      <h2 style={sectionTitle}>Typische Fehler</h2>
      <table style={tableStyle}>
        <thead><tr><th style={cellStyle}>Nicht so</th><th style={cellStyle}>Besser</th><th style={cellStyle}>Warum?</th></tr></thead>
        <tbody>
          <tr><td style={cellStyle}>ein erfolgreiche Mann</td><td style={cellStyle}>ein erfolgreicher Mann</td><td style={cellStyle}>Maskulin Nominativ: -er</td></tr>
          <tr><td style={cellStyle}>eine erfolgreiches Projekt</td><td style={cellStyle}>ein erfolgreiches Projekt</td><td style={cellStyle}>Projekt ist Neutrum.</td></tr>
          <tr><td style={cellStyle}>mit ein guter Plan</td><td style={cellStyle}>mit einem guten Plan</td><td style={cellStyle}>mit verlangt Dativ.</td></tr>
          <tr><td style={cellStyle}>einen mutiger Unternehmer</td><td style={cellStyle}>einen mutigen Unternehmer</td><td style={cellStyle}>Maskulin Akkusativ: -en</td></tr>
        </tbody>
      </table>
    </section>

    <section style={card}>
      <h2 style={sectionTitle}>Mini-Übung</h2>
      <ol style={listStyle}>
        <li>Ein ______ Unternehmer gründet eine Firma. <em>(mutig)</em></li>
        <li>Sie plant ein ______ Projekt. <em>(international)</em></li>
        <li>Er sucht einen ______ Mentor. <em>(erfahren)</em></li>
        <li>Mit einer ______ Strategie erreicht sie ihr Ziel. <em>(klar)</em></li>
        <li>Meine ______ Freunde unterstützen mich. <em>(gut)</em></li>
      </ol>
      <details>
        <summary style={{ cursor: "pointer", fontWeight: 700 }}>Lösungen anzeigen</summary>
        <p style={{ marginBottom: 0, lineHeight: 1.7 }}>1. mutiger · 2. internationales · 3. erfahrenen · 4. klaren · 5. guten</p>
      </details>
    </section>
  </div>
);

export default B1Day3ErfolgsgeschichtenGrammarNotesPage;
