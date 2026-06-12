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
        <h1 style={{ ...styles.title, margin: 0 }}>Adjektive und weil-Sätze</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Grammatik zum Thema <strong>Freunde fürs Leben</strong>: Freundschaften, Charakter und wichtige Eigenschaften klar beschreiben und begründen.
        </p>
        <img
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80"
          alt="Learn Language Education – Lernende üben gemeinsam eine Sprache"
          loading="lazy"
          style={{ width: "100%", borderRadius: 14, maxHeight: 300, objectFit: "cover" }}
        />
      </header>

      <section style={card}>
        <h2 style={sectionTitle}>Warum passt diese Grammatik zum Thema Freundschaft?</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Wenn du über Freundschaft sprichst, brauchst du vor allem Wörter für Charakter und Beziehungen: ehrlich, zuverlässig,
          hilfsbereit, offen, lustig oder geduldig. Auf B1-Niveau reicht es nicht nur zu sagen: „Mein Freund ist nett.“ Du solltest
          genauer beschreiben und deine Meinung begründen.
        </p>
        <NoteBox>
          <strong>Merke:</strong> Für das Thema „Freunde fürs Leben“ brauchst du zwei Dinge: <strong>Adjektive</strong>, um eine Person zu beschreiben,
          und <strong>weil-Sätze</strong>, um zu erklären, warum diese Person wichtig für dich ist.
        </NoteBox>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>1. Wichtige Adjektive für Freundschaft</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Mit Adjektiven beschreibst du Eigenschaften. Diese Wörter helfen dir, über gute Freunde und Freundinnen zu sprechen:
        </p>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={cellStyle}>Adjektiv</th>
              <th style={cellStyle}>Bedeutung</th>
              <th style={cellStyle}>Beispiel</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={cellStyle}>ehrlich</td><td style={cellStyle}>sagt die Wahrheit</td><td style={cellStyle}>Ein ehrlicher Freund sagt mir die Wahrheit.</td></tr>
            <tr><td style={cellStyle}>zuverlässig</td><td style={cellStyle}>man kann sich auf ihn/sie verlassen</td><td style={cellStyle}>Eine zuverlässige Freundin hilft mir immer.</td></tr>
            <tr><td style={cellStyle}>hilfsbereit</td><td style={cellStyle}>hilft gern</td><td style={cellStyle}>Hilfsbereite Freunde sind sehr wichtig.</td></tr>
            <tr><td style={cellStyle}>offen</td><td style={cellStyle}>spricht frei und freundlich</td><td style={cellStyle}>Mein bester Freund ist ein offener Mensch.</td></tr>
            <tr><td style={cellStyle}>geduldig</td><td style={cellStyle}>bleibt ruhig</td><td style={cellStyle}>Eine geduldige Freundin hört gut zu.</td></tr>
          </tbody>
        </table>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>2. Adjektive vor Nomen: ein guter Freund, eine gute Freundin</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Wenn ein Adjektiv direkt vor einem Nomen steht, bekommt es eine Endung. Besonders wichtig sind diese Formen:
        </p>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={cellStyle}>Nomen</th>
              <th style={cellStyle}>mit ein/eine</th>
              <th style={cellStyle}>mit der/die/das</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={cellStyle}>der Freund</td><td style={cellStyle}>ein guter Freund</td><td style={cellStyle}>der gute Freund</td></tr>
            <tr><td style={cellStyle}>die Freundin</td><td style={cellStyle}>eine gute Freundin</td><td style={cellStyle}>die gute Freundin</td></tr>
            <tr><td style={cellStyle}>das Gespräch</td><td style={cellStyle}>ein ehrliches Gespräch</td><td style={cellStyle}>das ehrliche Gespräch</td></tr>
            <tr><td style={cellStyle}>die Freunde (Plural)</td><td style={cellStyle}>gute Freunde</td><td style={cellStyle}>die guten Freunde</td></tr>
          </tbody>
        </table>
        <NoteBox>
          <strong>Einfach merken:</strong> Sag zuerst einfache sichere Formen wie <strong>ein guter Freund</strong>, <strong>eine gute Freundin</strong>,
          <strong> gute Freunde</strong>. Danach kannst du längere Sätze bauen.
        </NoteBox>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>3. Eigenschaften mit weil begründen</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Mit <strong>weil</strong> erklärst du einen Grund. Im weil-Satz steht das konjugierte Verb am Ende.
        </p>
        <ExampleBox>
          <strong>Regel:</strong> Hauptsatz + weil + Subjekt + Information + Verb am Ende.<br />
          Ich mag meine Freundin, weil sie immer ehrlich <strong>ist</strong>.<br />
          Mein bester Freund ist wichtig für mich, weil er mir immer <strong>hilft</strong>.
        </ExampleBox>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={cellStyle}>Ohne Begründung</th>
              <th style={cellStyle}>Besser mit weil</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={cellStyle}>Mein Freund ist zuverlässig.</td><td style={cellStyle}>Mein Freund ist zuverlässig, weil er immer pünktlich ist.</td></tr>
            <tr><td style={cellStyle}>Meine Freundin ist hilfsbereit.</td><td style={cellStyle}>Meine Freundin ist hilfsbereit, weil sie mir bei Problemen hilft.</td></tr>
            <tr><td style={cellStyle}>Gute Freunde sind wichtig.</td><td style={cellStyle}>Gute Freunde sind wichtig, weil man mit ihnen über alles sprechen kann.</td></tr>
          </tbody>
        </table>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>4. denn und deshalb als Alternative</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Neben <strong>weil</strong> kannst du auch <strong>denn</strong> und <strong>deshalb</strong> benutzen. So klingt deine Antwort abwechslungsreicher.
        </p>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={cellStyle}>Konnektor</th>
              <th style={cellStyle}>Satzstellung</th>
              <th style={cellStyle}>Beispiel</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={cellStyle}>weil</td><td style={cellStyle}>Verb am Ende</td><td style={cellStyle}>Ich vertraue ihm, weil er ehrlich ist.</td></tr>
            <tr><td style={cellStyle}>denn</td><td style={cellStyle}>Verb auf Position 2</td><td style={cellStyle}>Ich vertraue ihm, denn er ist ehrlich.</td></tr>
            <tr><td style={cellStyle}>deshalb</td><td style={cellStyle}>Verb direkt nach deshalb</td><td style={cellStyle}>Er ist ehrlich, deshalb vertraue ich ihm.</td></tr>
          </tbody>
        </table>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>5. Beispielantwort: Freunde fürs Leben</h2>
        <ExampleBox>
          Meine beste Freundin heißt Ama. Sie ist eine sehr zuverlässige und ehrliche Person. Ich mag sie, weil sie mir immer zuhört
          und mir gute Ratschläge gibt. Außerdem ist sie hilfsbereit, denn sie unterstützt mich, wenn ich ein Problem habe. Für mich
          ist eine gute Freundschaft wichtig, weil man Vertrauen, Respekt und Zeit miteinander teilt. Deshalb glaube ich, dass echte
          Freunde ein wichtiger Teil des Lebens sind.
        </ExampleBox>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>Typische Fehler</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={cellStyle}>Nicht so</th>
              <th style={cellStyle}>Besser</th>
              <th style={cellStyle}>Warum?</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={cellStyle}>Ich mag ihn, weil er ist ehrlich.</td><td style={cellStyle}>Ich mag ihn, weil er ehrlich ist.</td><td style={cellStyle}>Bei weil steht das Verb am Ende.</td></tr>
            <tr><td style={cellStyle}>Sie ist ein gute Freundin.</td><td style={cellStyle}>Sie ist eine gute Freundin.</td><td style={cellStyle}>Freundin ist feminin: eine.</td></tr>
            <tr><td style={cellStyle}>Gute Freund ist wichtig.</td><td style={cellStyle}>Ein guter Freund ist wichtig.</td><td style={cellStyle}>Bei der Freund heißt es: ein guter Freund.</td></tr>
            <tr><td style={cellStyle}>Er ist zuverlässig, deshalb ich vertraue ihm.</td><td style={cellStyle}>Er ist zuverlässig, deshalb vertraue ich ihm.</td><td style={cellStyle}>Nach deshalb kommt das Verb direkt.</td></tr>
          </tbody>
        </table>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>Mini-Übung</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Ergänze die Sätze. Danach schreibe 5–6 Sätze über deinen besten Freund oder deine beste Freundin.
        </p>
        <ol style={listStyle}>
          <li>Ein _______ Freund sagt die Wahrheit. <em>(ehrlich)</em></li>
          <li>Meine beste Freundin ist _______. <em>(zuverlässig)</em></li>
          <li>Ich mag ihn, weil er mir immer _______. <em>(helfen)</em></li>
          <li>Sie ist hilfsbereit, denn sie _______ mich oft. <em>(unterstützen)</em></li>
          <li>Er ist geduldig, deshalb _______ ich gern mit ihm. <em>(sprechen)</em></li>
        </ol>
        <details>
          <summary style={{ cursor: "pointer", fontWeight: 700 }}>Lösungen anzeigen</summary>
          <p style={{ lineHeight: 1.7, marginBottom: 0 }}>1. ehrlicher · 2. zuverlässig · 3. hilft · 4. unterstützt · 5. spreche</p>
        </details>
      </section>
    </div>
  );
};

export default B1Day2FreundeFuersLebenGrammarNotesPage;
