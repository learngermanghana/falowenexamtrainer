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

const Table = ({ children }) => (
  <div style={{ width: "100%", overflowX: "auto" }}><table style={tableStyle}>{children}</table></div>
);

const ExampleBox = ({ children }) => (
  <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, background: "#fff", lineHeight: 1.75 }}>{children}</div>
);

const Mistake = ({ wrong, correct }) => (
  <div style={{ display: "grid", gap: 5, border: "1px solid #fecaca", background: "#fff7f7", borderRadius: 12, padding: 12, lineHeight: 1.65 }}>
    <span><strong>✗ Nicht ideal:</strong> {wrong}</span>
    <span><strong>✓ Besser:</strong> {correct}</span>
  </div>
);

const CheckAnswer = ({ question, children }) => (
  <details style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12, background: "#fff" }}>
    <summary style={{ cursor: "pointer", fontWeight: 800 }}>{question}</summary>
    <div style={{ marginTop: 10, lineHeight: 1.7 }}>{children}</div>
  </details>
);

export default function B2Day5HealthGrammarNotes({ checked = false, onCheckedChange }) {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <section style={card}>
        <span style={{ ...styles.badge, width: "fit-content" }}>B2 · Day 5 · Chapter 1.5 · Grammar Notes</span>
        <h2 style={{ ...styles.title, margin: 0, fontSize: "clamp(1.7rem,4vw,2.5rem)" }}>Nominalisierung von Verben</h2>
        <p style={{ ...styles.subtitle, margin: 0, lineHeight: 1.7 }}>
          Grammatik zum Thema <strong>Bildung und Lernen</strong>: aus Verb-Sätzen sachliche und formelle B2-Sätze machen.
        </p>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Warum brauchst du Nominalisierung auf B2?</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Auf B2 solltest du nicht nur einfach sagen: <em>Viele Menschen lernen online.</em> Du solltest Themen wie Bildung, Weiterbildung, Prüfungsvorbereitung und Lernstrategien sachlich erklären können. Nominalisierung hilft dir, formeller und präziser zu schreiben.
        </p>
        <NoteBox>
          <strong>Nach dieser Lektion kannst du:</strong>
          <ul style={{ ...listStyle, marginTop: 8 }}>
            <li>Verben in Nomen umwandeln,</li>
            <li>Infinitive als Nomen benutzen: <em>lernen → das Lernen</em>,</li>
            <li>feste Nomenformen erkennen: <em>verbessern → die Verbesserung</em>,</li>
            <li>einen einfachen Verb-Satz in einen formelleren Nominalstil-Satz umformen und</li>
            <li>Nominalisierungen passend in B2-Meinungsbeiträgen verwenden.</li>
          </ul>
        </NoteBox>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>1. Was bedeutet Nominalisierung?</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>Nominalisierung bedeutet: Aus einem Verb wird ein Nomen. Das Nomen wird großgeschrieben und bekommt oft einen Artikel.</p>
        <Table>
          <thead><tr><th style={cellStyle}>Verb-Satz</th><th style={cellStyle}>Nominalisierung</th><th style={cellStyle}>Wirkung</th></tr></thead>
          <tbody>
            <tr><td style={cellStyle}>Viele Menschen <strong>lernen</strong> online.</td><td style={cellStyle}><strong>Das Online-Lernen</strong> wird immer beliebter.</td><td style={cellStyle}>sachlicher</td></tr>
            <tr><td style={cellStyle}>Man sollte die Strategie <strong>verbessern</strong>.</td><td style={cellStyle}><strong>Die Verbesserung</strong> der Strategie ist wichtig.</td><td style={cellStyle}>formeller</td></tr>
            <tr><td style={cellStyle}>Die Lernenden <strong>nehmen teil</strong>.</td><td style={cellStyle}><strong>Die Teilnahme</strong> am Kurs ist hilfreich.</td><td style={cellStyle}>präziser</td></tr>
          </tbody>
        </Table>
        <NoteBox tone="amber"><strong>Merke:</strong> Nominalisierung ist nützlich, aber zu viele Nomen machen einen Text schwer. Nutze sie gezielt.</NoteBox>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>2. Infinitiv als Nomen</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>Viele Verben können direkt als neutrales Nomen benutzt werden. Der Artikel ist meistens <strong>das</strong>.</p>
        <Table>
          <thead><tr><th style={cellStyle}>Verb</th><th style={cellStyle}>Nomen</th><th style={cellStyle}>Beispiel</th></tr></thead>
          <tbody>
            <tr><td style={cellStyle}>lernen</td><td style={cellStyle}>das Lernen</td><td style={cellStyle}>Das Lernen mit Apps ist flexibel.</td></tr>
            <tr><td style={cellStyle}>lesen</td><td style={cellStyle}>das Lesen</td><td style={cellStyle}>Das Lesen deutscher Texte erweitert den Wortschatz.</td></tr>
            <tr><td style={cellStyle}>wiederholen</td><td style={cellStyle}>das Wiederholen</td><td style={cellStyle}>Regelmäßiges Wiederholen hilft bei der Prüfungsvorbereitung.</td></tr>
            <tr><td style={cellStyle}>sprechen</td><td style={cellStyle}>das Sprechen</td><td style={cellStyle}>Das Sprechen im Unterricht stärkt die Sicherheit.</td></tr>
          </tbody>
        </Table>
        <Mistake wrong="online lernen ist praktisch." correct="Das Online-Lernen ist praktisch. / Online zu lernen ist praktisch." />
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>3. Feste Nomenformen</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>Viele Verben haben feste Nomenformen. Diese musst du mit Artikel lernen.</p>
        <Table>
          <thead><tr><th style={cellStyle}>Verb</th><th style={cellStyle}>Nomen</th><th style={cellStyle}>Beispiel zum Thema Bildung</th></tr></thead>
          <tbody>
            <tr><td style={cellStyle}>verbessern</td><td style={cellStyle}>die Verbesserung</td><td style={cellStyle}>Die Verbesserung der Lernstrategie braucht Zeit.</td></tr>
            <tr><td style={cellStyle}>prüfen</td><td style={cellStyle}>die Prüfung</td><td style={cellStyle}>Die Prüfung der Fortschritte ist wichtig.</td></tr>
            <tr><td style={cellStyle}>anmelden</td><td style={cellStyle}>die Anmeldung</td><td style={cellStyle}>Die Anmeldung zum Kurs erfolgt online.</td></tr>
            <tr><td style={cellStyle}>teilnehmen</td><td style={cellStyle}>die Teilnahme</td><td style={cellStyle}>Die Teilnahme an einer Lerngruppe motiviert viele Lernende.</td></tr>
            <tr><td style={cellStyle}>organisieren</td><td style={cellStyle}>die Organisation</td><td style={cellStyle}>Die Organisation des Lernplans ist entscheidend.</td></tr>
          </tbody>
        </Table>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>4. Verb-Stil oder Nominalstil?</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>Der Verb-Stil ist oft direkter. Der Nominalstil klingt formeller. In B2-Texten kannst du beide Formen mischen.</p>
        <Table>
          <thead><tr><th style={cellStyle}>Verb-Stil</th><th style={cellStyle}>Nominalstil</th></tr></thead>
          <tbody>
            <tr><td style={cellStyle}>Viele Erwachsene bilden sich weiter.</td><td style={cellStyle}>Die Weiterbildung vieler Erwachsener ist für den Arbeitsmarkt wichtig.</td></tr>
            <tr><td style={cellStyle}>Lernende planen ihre Zeit besser.</td><td style={cellStyle}>Eine bessere Zeitplanung hilft Lernenden beim selbstständigen Lernen.</td></tr>
            <tr><td style={cellStyle}>Lehrkräfte erklären die Aufgaben klar.</td><td style={cellStyle}>Eine klare Erklärung der Aufgaben erleichtert das Lernen.</td></tr>
          </tbody>
        </Table>
        <Mistake wrong="Die Verbesserung der Organisation der Vorbereitung der Prüfung ist wichtig." correct="Eine gute Organisation hilft bei der Prüfungsvorbereitung. Außerdem verbessert sie die Lernroutine." />
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>5. Eine vollständige B2-Argumentation aufbauen</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>Nutze Nominalisierungen, um zentrale Gedanken kurz und sachlich zu nennen.</p>
        <ExampleBox>
          <div><strong>1. Thema:</strong> Die Weiterbildung spielt im Berufsleben eine immer größere Rolle.</div>
          <div><strong>2. Grund:</strong> Durch die Digitalisierung verändern sich viele Aufgaben schnell.</div>
          <div><strong>3. Beispiel:</strong> Das Online-Lernen ermöglicht eine flexible Teilnahme an Kursen.</div>
          <div><strong>4. Einschränkung:</strong> Trotzdem bleibt der persönliche Austausch mit Lehrkräften wichtig.</div>
          <div><strong>5. Fazit:</strong> Eine gute Kombination aus Selbstlernen und Unterricht unterstützt nachhaltige Fortschritte.</div>
        </ExampleBox>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>B2-Modellabsatz</h2>
        <NoteBox tone="green">
          Meiner Meinung nach ist die Weiterbildung heute wichtiger als früher, weil sich der Arbeitsmarkt schnell verändert. Das Online-Lernen bietet vielen Menschen mehr Flexibilität, besonders wenn sie neben dem Beruf lernen möchten. Gleichzeitig ist die Teilnahme an Präsenzkursen hilfreich, da Lernende direkte Fragen stellen und Feedback bekommen können. Eine gute Prüfungsvorbereitung besteht deshalb nicht nur aus dem Lesen von Texten, sondern auch aus regelmäßigem Sprechen, Wiederholen und Schreiben. Zusammenfassend lässt sich sagen, dass erfolgreiches Lernen klare Ziele, gute Organisation und passende Unterstützung braucht.
        </NoteBox>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Typische Fehler</h2>
        <ul style={listStyle}>
          <li>nominalisierte Verben kleinschreiben: <em>das lernen</em> statt <em>das Lernen</em>,</li>
          <li>den falschen Artikel benutzen: <em>der Verbesserung</em> statt <em>die Verbesserung</em>,</li>
          <li>zu viele Nomen hintereinander benutzen,</li>
          <li>eine feste Nomenform falsch bilden: <em>die Verbesser</em> statt <em>die Verbesserung</em>,</li>
          <li>Nominalisierung verwenden, obwohl ein einfacher Verb-Satz klarer wäre.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Mini-Check</h2>
        <CheckAnswer question="1. Nominalisiere: Viele Lernende wiederholen regelmäßig.">
          <strong>Regelmäßiges Wiederholen</strong> hilft vielen Lernenden. / <strong>Das regelmäßige Wiederholen</strong> ist für viele Lernende hilfreich.
        </CheckAnswer>
        <CheckAnswer question="2. Nominalisiere: Man verbessert seine Aussprache durch Sprechen.">
          <strong>Die Verbesserung der Aussprache</strong> gelingt durch regelmäßiges Sprechen.
        </CheckAnswer>
        <CheckAnswer question="3. Schreibe formeller: Viele Menschen lernen online, weil es flexibel ist.">
          <strong>Das Online-Lernen</strong> ist für viele Menschen attraktiv, weil es flexibel organisiert werden kann.
        </CheckAnswer>
      </section>

      <section style={card}>
        <label style={{ display: "flex", gap: 10, alignItems: "center", fontWeight: 800 }}>
          <input type="checkbox" checked={checked} onChange={(event) => onCheckedChange?.(event.target.checked)} />
          I understand how to use nominalization for Bildung und Lernen.
        </label>
      </section>
    </div>
  );
}
