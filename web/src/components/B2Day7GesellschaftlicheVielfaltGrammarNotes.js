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
const cellStyle = {
  border: "1px solid #e5e7eb",
  padding: "10px 12px",
  textAlign: "left",
  verticalAlign: "top",
  lineHeight: 1.6,
};

const NoteBox = ({ children, tone = "blue" }) => {
  const tones = {
    blue: ["#bfdbfe", "#eff6ff", "#1e3a8a"],
    green: ["#bbf7d0", "#f0fdf4", "#14532d"],
    amber: ["#fde68a", "#fffbeb", "#92400e"],
  };
  const [border, background, color] = tones[tone] || tones.blue;
  return (
    <div style={{ border: `1px solid ${border}`, borderRadius: 14, padding: 14, background, color, lineHeight: 1.7 }}>
      {children}
    </div>
  );
};

const examples = [
  ["mit + Dativ", "Das sind Menschen, mit denen ich gern zusammenarbeite."],
  ["von + Dativ", "Das ist eine Initiative, von der viele Familien profitieren."],
  ["in + Dativ", "Eine Gesellschaft, in der Unterschiede respektiert werden, ist stärker."],
  ["für + Akkusativ", "Wir brauchen Angebote, für die keine hohen Gebühren verlangt werden."],
  ["über + Akkusativ", "Vorurteile sind Probleme, über die offen gesprochen werden sollte."],
  ["an + Akkusativ", "Gemeinsame Regeln, an die sich alle halten, fördern Vertrauen."],
  ["an + Dativ", "Das Projekt, an dem viele Vereine beteiligt sind, schafft Begegnungen."],
];

const checks = [
  ["Das sind Kolleginnen, ___ ich täglich zusammenarbeite.", "mit denen"],
  ["Das ist eine Organisation, ___ viele Menschen profitieren.", "von der"],
  ["Wir brauchen Regeln, ___ sich alle halten können.", "an die"],
  ["Eine Gesellschaft, ___ alle teilnehmen können, ist gerechter.", "in der"],
];

export default function B2Day7GesellschaftlicheVielfaltGrammarNotes({
  checked = false,
  onCheckedChange,
}) {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <section style={card}>
        <span style={{ ...styles.badge, width: "fit-content" }}>B2 · Day 7 · Grammar Notes</span>
        <h2 style={{ ...styles.title, margin: 0, fontSize: "clamp(1.7rem,4vw,2.5rem)" }}>
          Relativsätze mit Präpositionen
        </h2>
        <p style={{ ...styles.subtitle, margin: 0, lineHeight: 1.7 }}>
          Menschen, Gruppen, Regeln und Angebote beim Thema gesellschaftliche Vielfalt präzise beschreiben
        </p>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Wie funktioniert die Struktur?</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Ein Relativsatz beschreibt ein Nomen genauer. Verlangt das Verb oder der Ausdruck im Relativsatz eine
          Präposition, steht diese direkt vor dem Relativpronomen. Das konjugierte Verb steht am Ende.
        </p>
        <NoteBox>
          <strong>So wählst du die richtige Form:</strong>
          <ol style={{ ...listStyle, marginTop: 8 }}>
            <li>Bestimme das Bezugswort: der, die, das oder Plural.</li>
            <li>Bestimme die Präposition: mit, von, für, über, an, in und so weiter.</li>
            <li>Bestimme den Kasus, den die Präposition verlangt.</li>
            <li>Setze Präposition + Relativpronomen zusammen.</li>
            <li>Stelle das konjugierte Verb ans Ende des Relativsatzes.</li>
          </ol>
        </NoteBox>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Relativpronomen nach Präpositionen</h2>
        <div style={{ width: "100%", overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={cellStyle}>Bezugswort</th>
                <th style={cellStyle}>Dativ mit „mit“</th>
                <th style={cellStyle}>Akkusativ mit „für“</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["der Mann", "mit dem", "für den"],
                ["die Frau", "mit der", "für die"],
                ["das Kind", "mit dem", "für das"],
                ["die Menschen", "mit denen", "für die"],
              ].map(([noun, dative, accusative]) => (
                <tr key={noun}>
                  <td style={cellStyle}><strong>{noun}</strong></td>
                  <td style={cellStyle}>{dative}</td>
                  <td style={cellStyle}>{accusative}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Beispiele zum Thema gesellschaftliche Vielfalt</h2>
        <div style={{ width: "100%", overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={cellStyle}>Struktur</th>
                <th style={cellStyle}>Beispiel</th>
              </tr>
            </thead>
            <tbody>
              {examples.map(([structure, example]) => (
                <tr key={`${structure}-${example}`}>
                  <td style={cellStyle}><strong>{structure}</strong></td>
                  <td style={cellStyle}>{example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>B2-Modellabsatz</h2>
        <NoteBox tone="green">
          Eine vielfältige Gesellschaft, in der Menschen mit unterschiedlichen Erfahrungen zusammenleben, kann
          viele neue Perspektiven entwickeln. Menschen, mit denen wir regelmäßig sprechen, wirken weniger fremd.
          Gleichzeitig gibt es Vorurteile, über die offen gesprochen werden muss. Deshalb brauchen wir Projekte,
          an denen Schulen, Vereine und Nachbarschaften gemeinsam teilnehmen. Solche Angebote, von denen besonders
          junge Menschen profitieren, stärken Respekt und Zugehörigkeit.
        </NoteBox>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Selbstkontrolle</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Ergänze zuerst selbst. Öffne danach die Lösung.
        </p>
        {checks.map(([question, answer], index) => (
          <details key={question} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12, background: "#fff" }}>
            <summary style={{ cursor: "pointer", fontWeight: 800 }}>{index + 1}. {question}</summary>
            <div style={{ marginTop: 10, lineHeight: 1.7 }}><strong>Lösung:</strong> {answer}</div>
          </details>
        ))}
      </section>

      <section style={card}>
        <NoteBox tone="amber">
          <strong>Typischer Fehler:</strong> Die Präposition darf nicht am Satzende stehen. Richtig ist: „Das sind
          Menschen, <em>mit denen</em> ich arbeite.“ Nicht: „Das sind Menschen, denen ich arbeite mit.“
        </NoteBox>
        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, fontWeight: 800, lineHeight: 1.6 }}>
          <input
            type="checkbox"
            checked={Boolean(checked)}
            onChange={(event) => onCheckedChange?.(event.target.checked)}
            style={{ marginTop: 4 }}
          />
          <span>Ich habe die Grammatiknotizen gelesen und die Beispiele verstanden.</span>
        </label>
      </section>
    </div>
  );
}
