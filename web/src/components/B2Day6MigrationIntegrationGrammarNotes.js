import React from "react";
import { styles } from "../styles";

const card = {
  ...styles.card,
  display: "grid",
  gap: 14,
  border: "1px solid #e2e8f0",
  borderRadius: 18,
  boxShadow: "0 10px 26px rgba(15,23,42,.06)",
};
const listStyle = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const tableStyle = { width: "100%", borderCollapse: "collapse", fontSize: ".95rem" };
const cellStyle = { border: "1px solid #e5e7eb", padding: "10px 12px", textAlign: "left", verticalAlign: "top", lineHeight: 1.6 };

const NoteBox = ({ children, tone = "blue" }) => {
  const tones = {
    blue: ["#bfdbfe", "#eff6ff", "#1e3a8a"],
    green: ["#bbf7d0", "#f0fdf4", "#14532d"],
    amber: ["#fde68a", "#fffbeb", "#92400e"],
  };
  const [border, background, color] = tones[tone] || tones.blue;
  return <div style={{ border: `1px solid ${border}`, borderRadius: 14, padding: 14, background, color, lineHeight: 1.7 }}>{children}</div>;
};

const Table = ({ children }) => <div style={{ width: "100%", overflowX: "auto" }}><table style={tableStyle}>{children}</table></div>;
const ExampleBox = ({ children }) => <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, background: "#fff", lineHeight: 1.75 }}>{children}</div>;
const Mistake = ({ wrong, correct }) => (
  <div style={{ display: "grid", gap: 5, border: "1px solid #fecaca", background: "#fff7f7", borderRadius: 12, padding: 12, lineHeight: 1.65 }}>
    <span><strong>✗ Nicht korrekt:</strong> {wrong}</span>
    <span><strong>✓ Korrekt:</strong> {correct}</span>
  </div>
);
const CheckAnswer = ({ question, children }) => (
  <details style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12, background: "#fff" }}>
    <summary style={{ cursor: "pointer", fontWeight: 800 }}>{question}</summary>
    <div style={{ marginTop: 10, lineHeight: 1.7 }}>{children}</div>
  </details>
);

export default function B2Day6MigrationIntegrationGrammarNotes({ checked = false, onCheckedChange }) {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <section style={card}>
        <span style={{ ...styles.badge, width: "fit-content" }}>B2 · Day 6 · Grammar Notes</span>
        <h2 style={{ ...styles.title, margin: 0, fontSize: "clamp(1.7rem,4vw,2.5rem)" }}>Migration und Integration differenziert diskutieren</h2>
        <p style={{ ...styles.subtitle, margin: 0, lineHeight: 1.7 }}>
          Grammatik zum Thema <strong>Migration und Integration</strong>: Gegenargumente mit <strong>obwohl</strong>, <strong>auch wenn</strong> und <strong>trotzdem</strong> einbauen, Probleme sachlich erklären und Lösungen mit Vorteilen formulieren.
        </p>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Warum brauchst du diese Grammatik auf B2?</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Beim Thema Migration und Integration gibt es selten nur eine einfache Meinung. Du musst Chancen, Schwierigkeiten, Gegenargumente und realistische Lösungen verbinden. Dafür brauchst du konzessive Satzverbindungen.
        </p>
        <NoteBox>
          <strong>Nach dieser Lektion kannst du:</strong>
          <ul style={{ ...listStyle, marginTop: 8 }}>
            <li>Migration und Integration sachlich erklären,</li>
            <li>Gegenargumente mit <em>obwohl</em> und <em>auch wenn</em> formulieren,</li>
            <li>mit <em>trotzdem</em> eine überraschende Folge oder Gegenposition ausdrücken,</li>
            <li>Lösungen mit Vorteilssätzen verbinden und</li>
            <li>eine ausgewogene B2-Meinung schreiben.</li>
          </ul>
        </NoteBox>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>1. Thema klar definieren</h2>
        <Table>
          <thead><tr><th style={cellStyle}>Begriff</th><th style={cellStyle}>B2-Erklärung</th><th style={cellStyle}>Beispiel</th></tr></thead>
          <tbody>
            <tr><td style={cellStyle}><strong>Migration</strong></td><td style={cellStyle}>Menschen verlassen ihr Land oder ihren Wohnort und beginnen an einem neuen Ort ein Leben.</td><td style={cellStyle}>Migration kann durch Arbeit, Studium, Familie oder Sicherheit entstehen.</td></tr>
            <tr><td style={cellStyle}><strong>Integration</strong></td><td style={cellStyle}>Menschen nehmen am gesellschaftlichen Leben teil, lernen Sprache und Regeln kennen und bauen Kontakte auf.</td><td style={cellStyle}>Integration gelingt besser, wenn es Sprachkurse und Begegnungen gibt.</td></tr>
            <tr><td style={cellStyle}><strong>Teilhabe</strong></td><td style={cellStyle}>Menschen können aktiv in Schule, Arbeit, Politik, Vereinen oder Nachbarschaft mitmachen.</td><td style={cellStyle}>Sprachkenntnisse erleichtern die Teilhabe am Arbeitsmarkt.</td></tr>
          </tbody>
        </Table>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>2. Gegenargumente mit obwohl und auch wenn</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>Obwohl und auch wenn leiten Nebensätze ein. Das konjugierte Verb steht am Ende.</p>
        <Table>
          <thead><tr><th style={cellStyle}>Konnektor</th><th style={cellStyle}>Bedeutung</th><th style={cellStyle}>Beispiel</th></tr></thead>
          <tbody>
            <tr><td style={cellStyle}><strong>obwohl</strong></td><td style={cellStyle}>starkes Gegenargument</td><td style={cellStyle}>Obwohl die Sprache am Anfang schwierig ist, können tägliche Kontakte helfen.</td></tr>
            <tr><td style={cellStyle}><strong>auch wenn</strong></td><td style={cellStyle}>auch unter dieser Bedingung</td><td style={cellStyle}>Auch wenn Integration Zeit braucht, lohnt sich konkrete Unterstützung.</td></tr>
            <tr><td style={cellStyle}><strong>Nebensatz zuerst</strong></td><td style={cellStyle}>danach Verb vor Subjekt</td><td style={cellStyle}>Obwohl viele Menschen motiviert sind, fehlt ihnen manchmal Orientierung.</td></tr>
            <tr><td style={cellStyle}><strong>Hauptsatz zuerst</strong></td><td style={cellStyle}>Gegenargument danach</td><td style={cellStyle}>Viele Migranten bringen Kompetenzen mit, obwohl ihre Abschlüsse nicht sofort anerkannt werden.</td></tr>
          </tbody>
        </Table>
        <Mistake wrong="Obwohl die Sprache ist schwierig, kann man Fortschritte machen." correct="Obwohl die Sprache schwierig ist, kann man Fortschritte machen." />
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>3. Trotzdem als Hauptsatz-Konnektor</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>Trotzdem steht häufig am Anfang eines Hauptsatzes. Danach steht das konjugierte Verb auf Position zwei.</p>
        <Table>
          <thead><tr><th style={cellStyle}>Struktur</th><th style={cellStyle}>Beispiel</th></tr></thead>
          <tbody>
            <tr><td style={cellStyle}>Problem. Trotzdem + Verb + Subjekt</td><td style={cellStyle}>Die Anerkennung von Abschlüssen dauert oft lange. Trotzdem geben viele Migranten nicht auf.</td></tr>
            <tr><td style={cellStyle}>Gegenargument. Trotzdem + Verb + Subjekt</td><td style={cellStyle}>Integration ist am Anfang anstrengend. Trotzdem kann sie neue Chancen eröffnen.</td></tr>
            <tr><td style={cellStyle}>Trotzdem in Position 3</td><td style={cellStyle}>Viele Menschen lernen trotzdem schnell Deutsch, wenn sie täglich üben.</td></tr>
          </tbody>
        </Table>
        <Mistake wrong="Die Sprache ist schwierig. Trotzdem viele Menschen lernen Deutsch." correct="Die Sprache ist schwierig. Trotzdem lernen viele Menschen Deutsch." />
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>4. Problem, Lösung und Vorteil verbinden</h2>
        <ExampleBox>
          <div><strong>Problem:</strong> Viele Menschen fühlen sich am Anfang isoliert, weil sie die Sprache noch nicht gut sprechen.</div>
          <div><strong>Gegenargument:</strong> Obwohl diese Situation schwierig ist, kann sie durch Kontakte im Alltag verbessert werden.</div>
          <div><strong>Lösung:</strong> Eine andere Möglichkeit wäre, Sprachpatenschaften und Vereine stärker zu fördern.</div>
          <div><strong>Vorteil:</strong> Der Vorteil besteht darin, dass neue Mitbürger schneller Orientierung finden und sich weniger allein fühlen.</div>
        </ExampleBox>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>5. B2-Modellabsatz</h2>
        <NoteBox tone="green">
          Meiner Meinung nach ist Integration eine gemeinsame Aufgabe von Migranten und Aufnahmegesellschaft. Obwohl viele Menschen sehr motiviert sind, erleben sie am Anfang oft Sprachbarrieren, Bürokratie und Unsicherheit. Trotzdem können sie sich schneller einleben, wenn es praktische Unterstützung gibt. Eine andere Möglichkeit wäre, Sprachkurse stärker mit Beratung, Vereinen und Begegnungsprojekten zu verbinden. Der Vorteil dieser Maßnahmen besteht darin, dass Menschen schneller Kontakte knüpfen, Arbeit finden und aktiv am gesellschaftlichen Leben teilnehmen können. Zusammenfassend lässt sich sagen, dass Integration Zeit, Offenheit und konkrete Chancen braucht.
        </NoteBox>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Typische Fehler</h2>
        <ul style={listStyle}>
          <li>nach <em>obwohl</em> oder <em>auch wenn</em> das Verb nicht ans Ende stellen,</li>
          <li>nach <em>trotzdem</em> die Hauptsatzstellung vergessen,</li>
          <li>Migration und Integration als identisch behandeln,</li>
          <li>nur Probleme nennen, aber keine Lösung oder keinen Vorteil formulieren,</li>
          <li>zu pauschal schreiben: <em>alle Migranten</em>, <em>immer</em>, <em>nie</em>.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Mini-Check</h2>
        <div style={{ display: "grid", gap: 10 }}>
          <CheckAnswer question="1. Ergänze: Obwohl die Sprache am Anfang schwierig ___, kann man Fortschritte machen."><strong>ist</strong> — Im obwohl-Nebensatz steht das Verb am Ende.</CheckAnswer>
          <CheckAnswer question="2. Korrigiere: Trotzdem viele Menschen finden schnell Arbeit."><strong>Trotzdem finden viele Menschen schnell Arbeit.</strong> — Nach trotzdem steht das Verb auf Position zwei.</CheckAnswer>
          <CheckAnswer question="3. Formuliere eine Lösung mit Vorteil.">Eine andere Möglichkeit wäre, kostenlose Sprachpatenschaften anzubieten. Der Vorteil besteht darin, dass neue Mitbürger schneller Kontakte aufbauen.</CheckAnswer>
        </div>
      </section>

      <section style={{ ...card, borderColor: checked ? "#86efac" : "#cbd5e1", background: checked ? "#f0fdf4" : "#fff" }}>
        <label style={{ display: "flex", gap: 10, alignItems: "flex-start", lineHeight: 1.6 }}>
          <input type="checkbox" checked={checked} onChange={(event) => onCheckedChange?.(event.target.checked)} style={{ marginTop: 4 }} />
          <span><strong>I have read the complete B2 Day 6 grammar notes.</strong><br />I can now use obwohl, auch wenn and trotzdem to discuss Migration und Integration on B2 level.</span>
        </label>
      </section>
    </div>
  );
}
