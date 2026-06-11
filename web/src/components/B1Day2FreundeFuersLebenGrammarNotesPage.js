import React from "react";
import { useNavigate } from "react-router-dom";
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

const NoteBox = ({ children, warning = false }) => (
  <div
    style={{
      border: `1px solid ${warning ? "#fed7aa" : "#bfdbfe"}`,
      background: warning ? "#fff7ed" : "#eff6ff",
      borderRadius: 14,
      padding: 14,
      lineHeight: 1.7,
    }}
  >
    {children}
  </div>
);

const ExampleBox = ({ children }) => (
  <div style={{ border: "1px solid #e5e7eb", background: "#fff", borderRadius: 12, padding: 12, lineHeight: 1.7 }}>
    {children}
  </div>
);

const B1Day2FreundeFuersLebenGrammarNotesPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <button type="button" style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
        ← Back to Course
      </button>

      <header style={card}>
        <span style={{ ...styles.badge, width: "fit-content" }}>B1 · Day 2 · Kapitel 1.2 · Grammar Notes</span>
        <h1 style={{ ...styles.title, margin: 0 }}>Präteritum (Simple Past)</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Grammatik zum Thema <strong>Freunde fürs Leben</strong>: vergangene Erlebnisse klar und lebendig erzählen.
        </p>
        <img
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80"
          alt="Learn Language Education – Lernende üben gemeinsam eine Sprache"
          loading="lazy"
          style={{ width: "100%", borderRadius: 14, maxHeight: 300, objectFit: "cover" }}
        />
      </header>

      <section style={card}>
        <h2 style={sectionTitle}>Warum ist das Präteritum wichtig?</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Mit dem Präteritum erzählst du von abgeschlossenen Ereignissen in der Vergangenheit. Es kommt besonders oft in
          schriftlichen Erzählungen, Berichten, Tagebüchern und Geschichten vor. So kannst du zum Beispiel über Freunde und
          gemeinsame Erinnerungen berichten.
        </p>
        <NoteBox>
          <strong>Merke:</strong> In Gesprächen benutzt man häufig das Perfekt. In schriftlichen Geschichten und Berichten ist das
          Präteritum besonders typisch. Die Verben <strong>sein</strong>, <strong>haben</strong> und die Modalverben stehen auch beim
          Sprechen oft im Präteritum.
        </NoteBox>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>Wann benutzt man das Präteritum?</h2>
        <ul style={listStyle}>
          <li>in schriftlichen Texten wie Tagebüchern, Erzählungen und Artikeln</li>
          <li>in formellen Kontexten wie Berichten und Nachrichten</li>
          <li>beim Erzählen von abgeschlossenen Ereignissen in der Vergangenheit</li>
        </ul>
        <ExampleBox>
          <strong>Beispiel:</strong> Letztes Jahr <strong>reisten</strong> wir zusammen nach Spanien und <strong>erlebten</strong> viele Abenteuer.
        </ExampleBox>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>Bildung des Präteritums</h2>
        <h3 style={sectionTitle}>1. Regelmäßige Verben (schwache Verben)</h3>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Bildung: <strong>Verbstamm + -te + Personalendung</strong>. Bei <strong>ich</strong> und <strong>er/sie/es</strong> gibt es keine zusätzliche Endung.
        </p>
        <table style={tableStyle}>
          <thead><tr><th style={cellStyle}>Person</th><th style={cellStyle}>leben</th><th style={cellStyle}>spielen</th></tr></thead>
          <tbody>
            <tr><td style={cellStyle}>ich</td><td style={cellStyle}>lebte</td><td style={cellStyle}>spielte</td></tr>
            <tr><td style={cellStyle}>du</td><td style={cellStyle}>lebtest</td><td style={cellStyle}>spieltest</td></tr>
            <tr><td style={cellStyle}>er/sie/es</td><td style={cellStyle}>lebte</td><td style={cellStyle}>spielte</td></tr>
            <tr><td style={cellStyle}>wir/sie/Sie</td><td style={cellStyle}>lebten</td><td style={cellStyle}>spielten</td></tr>
            <tr><td style={cellStyle}>ihr</td><td style={cellStyle}>lebtet</td><td style={cellStyle}>spieltet</td></tr>
          </tbody>
        </table>

        <h3 style={sectionTitle}>2. Unregelmäßige Verben (starke Verben)</h3>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Der Verbstamm ändert sich. Es gibt keine typische <strong>-te</strong>-Endung. Diese Formen musst du lernen.
        </p>
        <table style={tableStyle}>
          <thead><tr><th style={cellStyle}>Infinitiv</th><th style={cellStyle}>ich / er / sie / es</th><th style={cellStyle}>du</th><th style={cellStyle}>wir / sie / Sie</th><th style={cellStyle}>ihr</th></tr></thead>
          <tbody>
            <tr><td style={cellStyle}>sehen</td><td style={cellStyle}>sah</td><td style={cellStyle}>sahst</td><td style={cellStyle}>sahen</td><td style={cellStyle}>saht</td></tr>
            <tr><td style={cellStyle}>gehen</td><td style={cellStyle}>ging</td><td style={cellStyle}>gingst</td><td style={cellStyle}>gingen</td><td style={cellStyle}>gingt</td></tr>
          </tbody>
        </table>

        <h3 style={sectionTitle}>3. Gemischte Verben</h3>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Gemischte Verben ändern ihren Stamm und bekommen gleichzeitig die Endungen der regelmäßigen Verben.
        </p>
        <ExampleBox><strong>denken</strong> → ich dachte · du dachtest · er/sie/es dachte · wir dachten · ihr dachtet · sie/Sie dachten</ExampleBox>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>Häufige Verben im Präteritum</h2>
        <table style={tableStyle}>
          <thead><tr><th style={cellStyle}>Infinitiv</th><th style={cellStyle}>ich</th><th style={cellStyle}>du</th><th style={cellStyle}>er/sie/es</th><th style={cellStyle}>wir/sie/Sie</th></tr></thead>
          <tbody>
            <tr><td style={cellStyle}>haben</td><td style={cellStyle}>hatte</td><td style={cellStyle}>hattest</td><td style={cellStyle}>hatte</td><td style={cellStyle}>hatten</td></tr>
            <tr><td style={cellStyle}>sein</td><td style={cellStyle}>war</td><td style={cellStyle}>warst</td><td style={cellStyle}>war</td><td style={cellStyle}>waren</td></tr>
            <tr><td style={cellStyle}>werden</td><td style={cellStyle}>wurde</td><td style={cellStyle}>wurdest</td><td style={cellStyle}>wurde</td><td style={cellStyle}>wurden</td></tr>
          </tbody>
        </table>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>Beispiele: Freunde fürs Leben</h2>
        <ol style={listStyle}>
          <li>Als ich ein Kind <strong>war</strong>, <strong>hatte</strong> ich viele Freunde in der Schule.</li>
          <li>Wir <strong>spielten</strong> oft im Park und <strong>lachten</strong> viel zusammen.</li>
          <li>Meine beste Freundin <strong>war</strong> immer für mich da, wenn ich Probleme <strong>hatte</strong>.</li>
          <li>Letztes Jahr <strong>reisten</strong> wir zusammen nach Spanien und <strong>erlebten</strong> viele Abenteuer.</li>
          <li>Früher <strong>gingen</strong> wir jeden Tag ins Kino und <strong>sahen</strong> spannende Filme.</li>
        </ol>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>Signalwörter</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Diese Wörter zeigen oft, dass eine Handlung in der Vergangenheit liegt:
        </p>
        <NoteBox><strong>früher · damals · letztes Jahr · vor einer Woche · in meiner Kindheit · als ich jung war</strong></NoteBox>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>Typische Fehler</h2>
        <table style={tableStyle}>
          <thead><tr><th style={cellStyle}>Nicht so</th><th style={cellStyle}>Besser</th><th style={cellStyle}>Warum?</th></tr></thead>
          <tbody>
            <tr><td style={cellStyle}>Ich spielte gestern Fußball gespielt.</td><td style={cellStyle}>Ich spielte gestern Fußball.</td><td style={cellStyle}>Im Präteritum gibt es kein Partizip II.</td></tr>
            <tr><td style={cellStyle}>Wir gehte ins Kino.</td><td style={cellStyle}>Wir gingen ins Kino.</td><td style={cellStyle}><em>gehen</em> ist unregelmäßig.</td></tr>
            <tr><td style={cellStyle}>Du war gestern müde.</td><td style={cellStyle}>Du warst gestern müde.</td><td style={cellStyle}>Bei <em>du</em> braucht man die Endung <strong>-st</strong>.</td></tr>
          </tbody>
        </table>
        <NoteBox warning><strong>Tipp:</strong> Lerne starke und gemischte Verben am besten immer mit ihrer Präteritumform: gehen – ging, sehen – sah, denken – dachte.</NoteBox>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>Mini-Übung</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Setze die Verben ins Präteritum. Schreibe danach eine kurze Geschichte über eine schöne Erinnerung mit deinem besten Freund oder deiner besten Freundin.
        </p>
        <ol style={listStyle}>
          <li>Als wir Kinder waren, _______ wir jeden Nachmittag zusammen. <em>(spielen)</em></li>
          <li>Meine Freundin _______ immer gute Ideen. <em>(haben)</em></li>
          <li>Letztes Jahr _______ wir gemeinsam nach Berlin. <em>(gehen)</em></li>
          <li>Dort _______ wir viele interessante Orte. <em>(sehen)</em></li>
          <li>Wir _______ noch lange an diese Reise. <em>(denken)</em></li>
        </ol>
        <details>
          <summary style={{ cursor: "pointer", fontWeight: 700 }}>Lösungen anzeigen</summary>
          <p style={{ lineHeight: 1.7, marginBottom: 0 }}>1. spielten · 2. hatte · 3. gingen · 4. sahen · 5. dachten</p>
        </details>
      </section>
    </div>
  );
};

export default B1Day2FreundeFuersLebenGrammarNotesPage;
