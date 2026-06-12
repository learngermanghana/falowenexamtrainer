import React from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";

const card = {
  ...styles.card,
  display: "grid",
  gap: 14,
};

const sectionTitle = {
  margin: 0,
  fontSize: "1.15rem",
};

const listStyle = {
  margin: 0,
  paddingLeft: 22,
  lineHeight: 1.75,
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "0.95rem",
};

const cellStyle = {
  border: "1px solid #e5e7eb",
  padding: "10px 12px",
  textAlign: "left",
  verticalAlign: "top",
};

const NoteBox = ({ children }) => (
  <div style={{ border: "1px solid #bfdbfe", background: "#eff6ff", borderRadius: 14, padding: 14, lineHeight: 1.7 }}>
    {children}
  </div>
);

const ExampleBox = ({ children }) => (
  <div style={{ border: "1px solid #e5e7eb", background: "#fff", borderRadius: 12, padding: 12, lineHeight: 1.7 }}>
    {children}
  </div>
);

const B1Day1TraumweltGrammarNotesPage = () => {

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

      <header style={card}>
        <span style={{ ...styles.badge, width: "fit-content" }}>B1 · Day 1 · Grammar Notes</span>
        <h1 style={{ ...styles.title, margin: 0 }}>Präsens & Perfekt</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Grammatik zum Thema <strong>Traumwelt</strong>: Träume, Wünsche, Zukunftspläne und vergangene Erfahrungen ausdrücken.
        </p>
        <img
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80"
          alt="Dream landscape for grammar notes about Präsens and Perfekt"
          loading="lazy"
          style={{ width: "100%", borderRadius: 14, maxHeight: 280, objectFit: "cover" }}
        />
      </header>

      <section style={card}>
        <h2 style={sectionTitle}>Warum lernen wir Präsens und Perfekt?</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Wenn du über deine <strong>Traumwelt</strong> sprichst, brauchst du zwei wichtige Zeiten: das Präsens und das Perfekt.
          Mit dem Präsens beschreibst du, was du jetzt denkst, möchtest, machst oder regelmäßig tust. Mit dem Perfekt erzählst du,
          was früher passiert ist oder welche Erfahrungen du schon gemacht hast.
        </p>
        <NoteBox>
          <strong>Merke:</strong> Präsens = jetzt, allgemein, regelmäßig oder Zukunft mit Zeitangabe. Perfekt = abgeschlossene Handlung in der Vergangenheit.
        </NoteBox>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>1. Präsens (Gegenwart)</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Das Präsens wird verwendet, um über aktuelle Handlungen, allgemeine Wahrheiten, Gewohnheiten und zukünftige Pläne mit Zeitangabe zu sprechen.
          Im Thema „Traumwelt“ benutzt du das Präsens, wenn du sagst, wovon du träumst, was dein Traumberuf ist oder wie du dir deine Zukunft vorstellst.
        </p>

        <h3 style={sectionTitle}>Bildung bei regelmäßigen Verben</h3>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Bei regelmäßigen Verben nimmst du den Infinitivstamm und setzt die passende Personalendung dazu.
        </p>
        <ExampleBox>
          <strong>machen</strong> → Stamm: <strong>mach-</strong><br />
          ich mache · du machst · er/sie/es macht · wir machen · ihr macht · sie/Sie machen
        </ExampleBox>

        <h3 style={sectionTitle}>Beispiel mit dem Thema Traumwelt: träumen</h3>
        <table style={tableStyle}>
          <tbody>
            <tr><th style={cellStyle}>Person</th><th style={cellStyle}>Form</th></tr>
            <tr><td style={cellStyle}>ich</td><td style={cellStyle}>ich träume</td></tr>
            <tr><td style={cellStyle}>du</td><td style={cellStyle}>du träumst</td></tr>
            <tr><td style={cellStyle}>er/sie/es</td><td style={cellStyle}>er/sie/es träumt</td></tr>
            <tr><td style={cellStyle}>wir</td><td style={cellStyle}>wir träumen</td></tr>
            <tr><td style={cellStyle}>ihr</td><td style={cellStyle}>ihr träumt</td></tr>
            <tr><td style={cellStyle}>sie/Sie</td><td style={cellStyle}>sie/Sie träumen</td></tr>
          </tbody>
        </table>

        <h3 style={sectionTitle}>Unregelmäßige Verben im Präsens</h3>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Manche Verben ändern den Vokal in der 2. und 3. Person Singular. Das bedeutet: Bei <strong>du</strong> und <strong>er/sie/es</strong> sieht die Form anders aus.
        </p>
        <ExampleBox>
          <strong>sehen</strong> → ich sehe, du siehst, er sieht, wir sehen, ihr seht, sie sehen<br />
          Beispiel: <strong>Ich sehe meine Zukunft positiv.</strong> / <strong>Er sieht seine Traumwelt sehr klar.</strong>
        </ExampleBox>

        <h3 style={sectionTitle}>Verwendung im Thema Traumwelt</h3>
        <ul style={listStyle}>
          <li>Ich träume oft von einer besseren Zukunft.</li>
          <li>Mein Traumberuf ist Arzt, weil ich Menschen helfen möchte.</li>
          <li>Wir leben in einer Welt voller Möglichkeiten.</li>
          <li>Nächstes Jahr reise ich nach Deutschland. <em>(Zukunft mit Zeitangabe)</em></li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>2. Perfekt (Vergangenheit)</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Das Perfekt wird benutzt, um über abgeschlossene Handlungen in der Vergangenheit zu sprechen. Besonders in der gesprochenen Sprache ist das Perfekt sehr wichtig.
          Wenn du über Träume, Reisen, Erfahrungen oder frühere Wünsche sprichst, brauchst du das Perfekt.
        </p>

        <h3 style={sectionTitle}>Bildung</h3>
        <NoteBox>
          Das Perfekt besteht aus zwei Teilen: <strong>haben oder sein</strong> als Hilfsverb + <strong>Partizip II</strong> am Satzende.
        </NoteBox>
        <ul style={listStyle}>
          <li><strong>haben</strong> benutzt man meistens mit transitiven Verben und vielen normalen Handlungen: Ich habe geträumt.</li>
          <li><strong>sein</strong> benutzt man oft mit Bewegungsverben oder Zustandsveränderungen: Ich bin gereist. Ich bin gewesen.</li>
        </ul>

        <h3 style={sectionTitle}>Partizip II bilden</h3>
        <ul style={listStyle}>
          <li><strong>Regelmäßige Verben:</strong> ge + Verbstamm + t → träumen → geträumt, machen → gemacht</li>
          <li><strong>Unregelmäßige Verben:</strong> ge + veränderter Stamm + en → sehen → gesehen, gehen → gegangen</li>
        </ul>

        <h3 style={sectionTitle}>Beispiele</h3>
        <ul style={listStyle}>
          <li>Gestern habe ich von einem perfekten Leben geträumt.</li>
          <li>Ich habe einen interessanten Film über Träume gesehen.</li>
          <li>Letztes Jahr bin ich nach Deutschland gereist, um meine Traumwelt zu entdecken.</li>
          <li>Ich bin in einer Traumwelt gewesen.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>3. Unterschied zwischen Präsens und Perfekt</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Das Präsens benutzt du, wenn du über jetzt, immer oder regelmäßig sprichst. Das Perfekt benutzt du, wenn du über etwas Abgeschlossenes in der Vergangenheit sprichst.
        </p>
        <table style={tableStyle}>
          <thead>
            <tr><th style={cellStyle}>Präsens</th><th style={cellStyle}>Perfekt</th></tr>
          </thead>
          <tbody>
            <tr><td style={cellStyle}>Ich träume von einer besseren Welt.</td><td style={cellStyle}>Ich habe von einer besseren Welt geträumt.</td></tr>
            <tr><td style={cellStyle}>Du lebst in einer Fantasie.</td><td style={cellStyle}>Du hast in einer Fantasie gelebt.</td></tr>
            <tr><td style={cellStyle}>Wir reisen oft in unserer Vorstellung.</td><td style={cellStyle}>Wir sind oft in unserer Vorstellung gereist.</td></tr>
          </tbody>
        </table>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>Typische Fehler</h2>
        <ul style={listStyle}>
          <li><strong>Falsch:</strong> Ich habe geträumt von einer besseren Zukunft. <br /><strong>Besser:</strong> Ich habe von einer besseren Zukunft geträumt.</li>
          <li><strong>Falsch:</strong> Ich bin geträumt. <br /><strong>Richtig:</strong> Ich habe geträumt.</li>
          <li><strong>Falsch:</strong> Ich habe nach Deutschland gereist. <br /><strong>Richtig:</strong> Ich bin nach Deutschland gereist.</li>
          <li><strong>Falsch:</strong> Er sehen seine Zukunft. <br /><strong>Richtig:</strong> Er sieht seine Zukunft.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>Mini-Übung</h2>
        <ol style={listStyle}>
          <li>Konjugiere das Verb <strong>träumen</strong> im Präsens: ich, du, er, wir, ihr, sie.</li>
          <li>Schreibe drei Präsens-Sätze über deine Traumwelt.</li>
          <li>Forme diese Sätze ins Perfekt um: Ich träume von einem Traumberuf. / Wir reisen nach Japan. / Ich sehe mein Traumhaus.</li>
          <li>Schreibe zwei Sätze über einen Traum oder Wunsch, den du früher hattest.</li>
        </ol>
      </section>
    </div>
  );
};

export default B1Day1TraumweltGrammarNotesPage;
