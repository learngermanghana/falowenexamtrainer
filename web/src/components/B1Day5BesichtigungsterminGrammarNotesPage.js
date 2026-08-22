import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 14 };
const sectionTitle = { margin: 0, fontSize: "1.15rem" };
const listStyle = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const tableStyle = { width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" };
const cellStyle = {
  border: "1px solid #e5e7eb",
  padding: "10px 12px",
  textAlign: "left",
  verticalAlign: "top",
};

const NoteBox = ({ children, tone = "blue" }) => {
  const tones = {
    blue: { border: "#bfdbfe", background: "#eff6ff", color: "#1e3a8a" },
    green: { border: "#bbf7d0", background: "#f0fdf4", color: "#166534" },
    amber: { border: "#fde68a", background: "#fffbeb", color: "#92400e" },
    red: { border: "#fecaca", background: "#fef2f2", color: "#991b1b" },
  };
  const selected = tones[tone] || tones.blue;

  return (
    <div style={{ border: `1px solid ${selected.border}`, background: selected.background, color: selected.color, borderRadius: 14, padding: 14, lineHeight: 1.7 }}>
      {children}
    </div>
  );
};

const ExampleBox = ({ children }) => (
  <div style={{ border: "1px solid #e5e7eb", background: "#fff", borderRadius: 12, padding: 12, lineHeight: 1.75 }}>
    {children}
  </div>
);

export default function B1Day5BesichtigungsterminGrammarNotesPage() {
  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

      <header style={card}>
        <span style={{ ...styles.badge, width: "fit-content" }}>B1 · Day 5 · Kapitel 2.5 · Grammar Notes</span>
        <h1 style={{ ...styles.title, margin: 0 }}>Höfliche Terminvereinbarung: Konjunktiv II und indirekte Fragen</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Grammatik zum Thema <strong>Der Besichtigungstermin</strong>: höflich nach einem Termin fragen, Informationen erfragen
          und einen Vorschlag machen.
        </p>
        <img
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80"
          alt="Wohnungsbesichtigung und Terminvereinbarung"
          loading="lazy"
          style={{ width: "100%", borderRadius: 14, maxHeight: 290, objectFit: "cover" }}
        />
      </header>

      <section style={card}>
        <h2 style={sectionTitle}>Warum passt diese Grammatik zum Besichtigungstermin?</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Bei einer Wohnungsbesichtigung sprichst du meistens mit einer Person, die du nicht gut kennst. Deshalb solltest du
          Fragen, Wünsche und Terminvorschläge höflich formulieren. Auf B1-Niveau helfen dir der <strong>Konjunktiv II</strong>
          mit <em>könnte, würde</em> und <em>wäre</em> sowie <strong>indirekte Fragesätze</strong> mit <em>ob, wann, wo</em> und
          <em> wie</em>.
        </p>
        <NoteBox>
          <strong>Merke:</strong> Direkte Fragen sind korrekt, aber indirekte Fragen und Konjunktiv-II-Formen wirken in formellen
          Situationen höflicher und professioneller.
        </NoteBox>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>Schnellübersicht</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={cellStyle}>Struktur</th>
                <th style={cellStyle}>Funktion</th>
                <th style={cellStyle}>Beispiel</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={cellStyle}><strong>Könnten Sie …?</strong></td>
                <td style={cellStyle}>höfliche Bitte oder Frage</td>
                <td style={cellStyle}>Könnten Sie mir einen Besichtigungstermin anbieten?</td>
              </tr>
              <tr>
                <td style={cellStyle}><strong>Wäre … möglich?</strong></td>
                <td style={cellStyle}>höflicher Terminvorschlag</td>
                <td style={cellStyle}>Wäre Samstag um 14 Uhr möglich?</td>
              </tr>
              <tr>
                <td style={cellStyle}><strong>Ich würde gern …</strong></td>
                <td style={cellStyle}>höflicher Wunsch</td>
                <td style={cellStyle}>Ich würde die Wohnung gern besichtigen.</td>
              </tr>
              <tr>
                <td style={cellStyle}><strong>Ich möchte wissen, ob …</strong></td>
                <td style={cellStyle}>indirekte Ja-/Nein-Frage</td>
                <td style={cellStyle}>Ich möchte wissen, ob die Wohnung noch verfügbar ist.</td>
              </tr>
              <tr>
                <td style={cellStyle}><strong>Könnten Sie mir sagen, wann …</strong></td>
                <td style={cellStyle}>indirekte W-Frage</td>
                <td style={cellStyle}>Könnten Sie mir sagen, wann eine Besichtigung möglich wäre?</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>1. Höfliche Fragen mit könnten</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          <strong>Könnten</strong> ist der Konjunktiv II von <em>können</em>. In einer Frage steht das konjugierte Verb auf
          Position 1. Der Infinitiv steht am Satzende.
        </p>
        <ExampleBox>
          Könnten Sie mir bitte die genaue Adresse schicken?<br />
          Könnten Sie den Termin schriftlich bestätigen?<br />
          Könnten wir die Wohnung am Samstag besichtigen?<br />
          Könnten Sie mir sagen, wie hoch die Nebenkosten sind?
        </ExampleBox>
        <NoteBox tone="amber">
          <strong>Wortstellung:</strong> Könnten + Subjekt + Ergänzungen + Infinitiv am Ende.<br />
          <strong>Könnten Sie mir einen Termin vorschlagen?</strong>
        </NoteBox>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>2. Wünsche und Vorschläge mit würde und wäre</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Mit <strong>ich würde gern</strong> formulierst du einen höflichen Wunsch. Mit <strong>wäre</strong> fragst du höflich,
          ob ein Termin oder eine Bedingung möglich ist.
        </p>
        <ExampleBox>
          Ich würde die Wohnung gern am Wochenende besichtigen.<br />
          Ich würde mich über eine kurze Bestätigung freuen.<br />
          Wäre Freitag um 16 Uhr möglich?<br />
          Wäre auch ein Termin am frühen Abend denkbar?
        </ExampleBox>
        <NoteBox tone="green">
          <strong>Höfliche Formulierung:</strong> Ich würde mich über eine kurze Rückmeldung freuen.
        </NoteBox>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>3. Indirekte Fragen mit ob</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Wenn die direkte Frage mit <em>ja</em> oder <em>nein</em> beantwortet werden kann, benutzt du in der indirekten Frage
          <strong>ob</strong>. Das konjugierte Verb steht am Ende des Nebensatzes.
        </p>
        <ExampleBox>
          <strong>Direkt:</strong> Ist die Wohnung noch frei?<br />
          <strong>Indirekt:</strong> Ich möchte wissen, ob die Wohnung noch frei <u>ist</u>.<br /><br />
          <strong>Direkt:</strong> Kann ich die Wohnung am Samstag besichtigen?<br />
          <strong>Indirekt:</strong> Könnten Sie mir sagen, ob ich die Wohnung am Samstag besichtigen <u>kann</u>?
        </ExampleBox>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>4. Indirekte W-Fragen</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Bei einer direkten W-Frage bleibt das Fragewort in der indirekten Frage erhalten. Das Verb wandert jedoch ans Ende.
        </p>
        <ExampleBox>
          <strong>Wann ist die Besichtigung?</strong> → Könnten Sie mir sagen, wann die Besichtigung <u>ist</u>?<br />
          <strong>Wo treffen wir uns?</strong> → Ich möchte wissen, wo wir uns <u>treffen</u>.<br />
          <strong>Wie hoch sind die Nebenkosten?</strong> → Könnten Sie mir mitteilen, wie hoch die Nebenkosten <u>sind</u>?<br />
          <strong>Welche Unterlagen brauche ich?</strong> → Ich möchte wissen, welche Unterlagen ich <u>brauche</u>.
        </ExampleBox>
        <NoteBox tone="red">
          <strong>Falsch:</strong> Ich möchte wissen, wann ist der Termin.<br />
          <strong>Richtig:</strong> Ich möchte wissen, wann der Termin ist.
        </NoteBox>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>Mini-Übung</h2>
        <ol style={listStyle}>
          <li>Formuliere höflich: „Geben Sie mir einen Termin.“</li>
          <li>Bilde eine indirekte Frage: „Ist die Wohnung noch frei?“</li>
          <li>Bilde eine indirekte W-Frage: „Wann kann ich kommen?“</li>
          <li>Formuliere einen höflichen Terminvorschlag für Samstag um 15 Uhr.</li>
          <li>Schreibe einen höflichen Satz, in dem du um eine Bestätigung bittest.</li>
        </ol>
        <NoteBox tone="green">
          <strong>Mögliche Lösungen:</strong> Könnten Sie mir einen Termin anbieten? · Ich möchte wissen, ob die Wohnung noch
          frei ist. · Könnten Sie mir sagen, wann ich kommen kann? · Wäre Samstag um 15 Uhr möglich? · Ich würde mich über
          eine kurze Bestätigung freuen.
        </NoteBox>
      </section>
    </div>
  );
}
