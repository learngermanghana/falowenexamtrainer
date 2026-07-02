import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 14 };
const sectionTitle = { margin: 0, fontSize: "1.15rem" };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const box = { border: "1px solid #e5e7eb", borderRadius: 12, padding: 14, lineHeight: 1.75, background: "#fff", display: "grid", gap: 8 };
const tableWrap = { overflowX: "auto", border: "1px solid #e5e7eb", borderRadius: 12 };
const table = { width: "100%", borderCollapse: "collapse", minWidth: 650 };
const th = { textAlign: "left", padding: 11, background: "#eff6ff", borderBottom: "1px solid #bfdbfe" };
const td = { padding: 11, borderBottom: "1px solid #e5e7eb", verticalAlign: "top" };

const NoteBox = ({ children, tone = "blue" }) => {
  const tones = {
    blue: { border: "#bfdbfe", background: "#eff6ff", color: "#1e3a8a" },
    green: { border: "#bbf7d0", background: "#f0fdf4", color: "#166534" },
    amber: { border: "#fde68a", background: "#fffbeb", color: "#92400e" },
    red: { border: "#fecaca", background: "#fef2f2", color: "#991b1b" },
  };
  const selected = tones[tone] || tones.blue;
  return <div style={{ border: `1px solid ${selected.border}`, background: selected.background, color: selected.color, borderRadius: 14, padding: 14, lineHeight: 1.7 }}>{children}</div>;
};

const Formula = ({ children }) => <div style={{ ...box, background: "#f8fafc", fontWeight: 700, textAlign: "center" }}>{children}</div>;

export default function B1Day19VorstellungsgespraechGrammarNotesPage() {
  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
      <header style={card}>
        <span style={{ ...styles.badge, width: "fit-content" }}>B1 · Day 19 · Kapitel 6.19 · Grammar Notes</span>
        <h1 style={{ ...styles.title, margin: 0 }}>Das Vorstellungsgespräch</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Grammatikfokus: höflich und professionell sprechen mit <strong>Konjunktiv II</strong>, <strong>Sie-Form</strong> und begründenden Nebensätzen.</p>
      </header>

      <section style={card}>
        <h2 style={sectionTitle}>Warum brauchst du diese Grammatik?</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>Im Vorstellungsgespräch musst du höflich, selbstbewusst und klar antworten. Der Konjunktiv II hilft dir, Wünsche und Pläne professionell zu formulieren: <strong>Ich würde gern in Ihrem Unternehmen arbeiten</strong>. Mit <strong>weil/da</strong> begründest du deine Motivation und deine Stärken.</p>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>Lernziele</h2>
        <ul style={list}>
          <li>höfliche Antworten mit <strong>würde</strong>, <strong>könnte</strong> und <strong>wäre</strong> bilden,</li>
          <li>die formelle <strong>Sie-Form</strong> sicher verwenden,</li>
          <li>Motivation, Stärken und Berufserfahrung mit <strong>weil</strong>, <strong>da</strong> und <strong>deshalb</strong> begründen,</li>
          <li>typische B1-Fehler im Vorstellungsgespräch vermeiden,</li>
          <li>eine kurze Selbstvorstellung strukturiert sprechen und schreiben.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>1. Die formelle Sie-Form</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>In einem Vorstellungsgespräch benutzt man normalerweise <strong>Sie</strong>, <strong>Ihnen</strong> und <strong>Ihr</strong>. Das zeigt Respekt und Professionalität.</p>
        <div style={tableWrap}><table style={table}><thead><tr><th style={th}>Situation</th><th style={th}>Richtig</th><th style={th}>Nicht passend</th></tr></thead><tbody>
          <tr><td style={td}>Motivation</td><td style={td}>Ich möchte gern in <strong>Ihrem</strong> Unternehmen arbeiten.</td><td style={td}>Ich möchte bei <strong>dir</strong> arbeiten.</td></tr>
          <tr><td style={td}>Frage</td><td style={td}>Könnten <strong>Sie</strong> mir mehr über die Aufgaben sagen?</td><td style={td}>Kannst <strong>du</strong> mir mehr sagen?</td></tr>
          <tr><td style={td}>Dank</td><td style={td}>Vielen Dank für <strong>Ihre</strong> Zeit.</td><td style={td}>Danke für deine Zeit.</td></tr>
        </tbody></table></div>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>2. Höfliche Wünsche mit würde + Infinitiv</h2>
        <Formula>Subjekt + würde + gern + Ergänzung + Infinitiv am Ende</Formula>
        <ul style={list}>
          <li>Ich <strong>würde</strong> gern in Ihrem Team <strong>arbeiten</strong>.</li>
          <li>Ich <strong>würde</strong> meine Deutschkenntnisse im Beruf weiter <strong>verbessern</strong>.</li>
          <li>Ich <strong>würde</strong> mich über eine positive Rückmeldung sehr <strong>freuen</strong>.</li>
        </ul>
        <NoteBox tone="amber"><strong>Wortstellung:</strong> Im Hauptsatz steht <strong>würde</strong> auf Position 2. Der Infinitiv steht am Satzende.</NoteBox>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>3. Höfliche Möglichkeiten mit könnte und wäre</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
          <div style={box}><strong>könnte + Infinitiv</strong><span>Ich könnte sofort anfangen.</span><span>Ich könnte Kunden auf Deutsch und Englisch beraten.</span><span>Könnten Sie mir die Arbeitszeiten erklären?</span></div>
          <div style={box}><strong>wäre + Adjektiv/Nomen</strong><span>Ich wäre sehr flexibel.</span><span>Diese Stelle wäre eine gute Chance für mich.</span><span>Eine Probezeit wäre für mich kein Problem.</span></div>
        </div>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>4. Begründungen mit weil, da und deshalb</h2>
        <Formula>Hauptsatz + weil/da + Subjekt + Ergänzung + Verb am Ende</Formula>
        <ul style={list}>
          <li>Ich bewerbe mich bei Ihnen, <strong>weil ich gern mit Menschen arbeite</strong>.</li>
          <li><strong>Da ich schon Erfahrung im Büro habe</strong>, kann ich schnell selbstständig arbeiten.</li>
          <li>Ich bin gut organisiert. <strong>Deshalb</strong> kann ich Aufgaben pünktlich erledigen.</li>
        </ul>
        <NoteBox tone="blue"><strong>Merke:</strong> Nach <strong>weil</strong> und <strong>da</strong> steht das konjugierte Verb am Ende. Nach <strong>deshalb</strong> steht das Verb direkt danach.</NoteBox>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>5. Gute und falsche Beispiele</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
          <NoteBox tone="green"><strong>Richtig:</strong><br />Ich würde gern bei Ihnen arbeiten, weil ich mich für Kundenservice interessiere.<br />Meine Stärke ist Organisation, deshalb arbeite ich sehr zuverlässig.</NoteBox>
          <NoteBox tone="red"><strong>Falsch:</strong><br />Ich würde gern bei Ihnen arbeiten, weil ich interessiere mich für Kundenservice.<br />Meine Stärke ist Organisation, weil ich arbeite sehr zuverlässig.</NoteBox>
        </div>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>6. Häufige B1-Fehler</h2>
        <ul style={list}>
          <li><strong>Du statt Sie:</strong> In formellen Gesprächen immer Sie/Ihnen/Ihr verwenden.</li>
          <li><strong>Verbposition nach weil:</strong> Nicht „weil ich habe“, sondern „weil ich ... habe“.</li>
          <li><strong>Zu direkte Sprache:</strong> Besser „Ich würde gern ...“ statt nur „Ich will ...“.</li>
          <li><strong>Keine Beispiele:</strong> Nenne zu jeder Stärke eine kurze Situation: „Ich bin teamfähig, weil ich in meinem letzten Job oft mit Kollegen zusammengearbeitet habe.“</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>Redemittel für Sprechen und Schreiben</h2>
        <div style={box}>
          <strong>Selbstvorstellung</strong>
          <span>Mein Name ist ... und ich wohne in ...</span>
          <span>Ich habe eine Ausbildung als ... gemacht.</span>
          <span>Seit zwei Jahren arbeite ich als ...</span>
          <strong>Motivation</strong>
          <span>Ich bewerbe mich bei Ihnen, weil ...</span>
          <span>Diese Stelle passt zu mir, da ...</span>
          <strong>Stärken</strong>
          <span>Meine Stärke ist ..., zum Beispiel ...</span>
          <span>Ich kann gut mit Stress umgehen, indem ich ...</span>
        </div>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>Mini-practice: Selbstcheck</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>Korrigiere die Sätze oder ergänze eine passende Form.</p>
        <ol style={list}>
          <li>Ich möchte bei ___ Unternehmen arbeiten. (Sie)</li>
          <li>Ich bewerbe mich, weil ich ___ gern mit Menschen ___. (arbeiten)</li>
          <li>Ich ___ gern meine Erfahrung im Kundenservice nutzen. (würde)</li>
          <li>Korrigiere: „Ich bin flexibel, weil ich kann am Wochenende arbeiten.“</li>
        </ol>
        <NoteBox tone="green"><strong>Selbstkontrolle:</strong> Kannst du eine 60-Sekunden-Antwort mit Sie-Form, einem Satz mit würde und einem Satz mit weil bilden?</NoteBox>
      </section>
    </div>
  );
}
