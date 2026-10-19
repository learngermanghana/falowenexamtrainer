import React from "react";
import A1TutorMarkedWorkbookShell from "./A1TutorMarkedWorkbookShell";
import A1TutorSpeakingCheckpoint from "./A1TutorSpeakingCheckpoint";
import { styles } from "../styles";

// Day 4 / Kapitel 2 teaches numbers. The first task is deliberately a
// supported copying task, not a Goethe-level free-form application exercise.
const card = { ...styles.card, display: "grid", gap: 14 };
const softCard = {
  border: "1px solid #bfdbfe",
  borderRadius: 12,
  background: "#eff6ff",
  padding: 14,
  display: "grid",
  gap: 8,
  lineHeight: 1.75,
};
const tableCell = { borderBottom: "1px solid #e2e8f0", padding: "12px 10px", textAlign: "left", verticalAlign: "top" };
const formFields = [
  ["Alter", "1"],
  ["Straße & Hausnummer", "2"],
  ["Telefonnummer", "3"],
  ["Kursdauer", "4", "Monate"],
  ["Kursgebühr (Preis)", "5", "Euro"],
];
const numberWords = [12, 16, 221, 3435, 70];

export default function A1Day4NumbersForBeginnersWorkbookPage() {
  return (
    <A1TutorMarkedWorkbookShell
      fallbackAssignmentKey="A1-2"
      title="A1 · Day 4 Workbook · Zahlen und Telefonnummern"
      subtitle="Kapitel 2 · Numbers · Tutor-marked assignment"
      assignmentIntro="Complete all three Teile: copy five numbers into the form, write five German number words and record one short phone-number answer. Your answers remain a draft until you open Review & Submit."
      submitTitle="Review & Submit · A1 Day 4 · Kapitel 2"
      submitDescription="Check your five form entries, five written German numbers and saved speaking result before submitting."
    >
      <section style={card} data-a1-day4-teil1="simple-form">
        <h2 style={{ margin: 0 }}>Teil 1 · Schreiben: Ein einfaches Formular</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          <strong>Aufgabe:</strong> Lesen Sie die Informationen über Elena.
          Ergänzen Sie die <strong>fünf Zahlenangaben (1–5)</strong> im Formular.
          Sie dürfen die Zahlen direkt aus dem Text übernehmen.
        </p>
        <p style={{ margin: 0, color: "#475569" }}>
          <strong>English:</strong> Read the short text. Copy the five missing number details into the registration form.
        </p>
        <div style={softCard}>
          <strong>Informationen zu Elena</strong>
          <p style={{ margin: 0 }}>
            Elena Popov ist <strong>26 Jahre</strong> alt.
            Sie wohnt in der <strong>Müllerstraße 87</strong> in Berlin.
            Ihre Telefonnummer ist <strong>0171 33 55 90</strong>.
            Der Deutschkurs dauert <strong>3 Monate</strong>.
            Er kostet <strong>240 Euro</strong>.
          </p>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 320 }}>
            <caption style={{ textAlign: "left", fontWeight: 800, paddingBottom: 9 }}>
              Anmeldung · Sprachschule Berlin
            </caption>
            <thead>
              <tr>
                <th scope="col" style={tableCell}>Feld</th>
                <th scope="col" style={tableCell}>Eintrag</th>
              </tr>
            </thead>
            <tbody>
              <tr><th scope="row" style={tableCell}>Name</th><td style={tableCell}>Popov</td></tr>
              <tr><th scope="row" style={tableCell}>Vorname</th><td style={tableCell}>Elena</td></tr>
              {formFields.map(([label, number, unit]) => (
                <tr key={number}>
                  <th scope="row" style={tableCell}>{label}</th>
                  <td style={tableCell}><strong>({number})</strong> __________ {unit || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ margin: 0, fontSize: 14, color: "#334155" }}>
          Schreiben Sie Ihre Antworten <strong>1–5</strong> in die Felder für Teil 1 direkt unter der Aufgabe.
        </p>
      </section>

      <section style={card} data-a1-day4-teil2="number-writing">
        <h2 style={{ margin: 0 }}>Teil 2 · Zahlen lesen und schreiben</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          <strong>Aufgabe:</strong> Schreiben Sie die Zahlen <strong>als deutsche Wörter</strong>.
          Schreiben Sie alle Teile der Zahl zusammen.
        </p>
        <div style={softCard}>
          <strong>Beispiele und Hilfe</strong>
          <span>25 → fünfundzwanzig</span>
          <span>100 → hundert · 1.000 → tausend</span>
          <span>Die letzte große Zahl ist eine Zusatzherausforderung innerhalb der fünf Aufgaben.</span>
        </div>
        <ol style={{ margin: 0, paddingLeft: 26, display: "grid", gap: 12, lineHeight: 1.7 }}>
          {numberWords.map(number => (
            <li key={number}>
              <strong>{number.toLocaleString("de-DE")}</strong>
              <span style={{ color: "#64748b" }}> → ______________________________</span>
            </li>
          ))}
        </ol>
        <p style={{ margin: 0, fontSize: 14, color: "#334155" }}>
          Tragen Sie die fünf Antworten <strong>1–5</strong> in die Felder für Teil 2 ein.
        </p>
      </section>

      <section style={card} data-a1-day4-teil3="phone-number-speaking">
        <h2 style={{ margin: 0 }}>Teil 3 · Sprechen: Meine Telefonnummer</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Sprechen Sie Ihre Telefonnummer langsam und deutlich.
          Sie können stattdessen eine <strong>erfundene Nummer</strong> verwenden.
          Die Aufnahme wird nicht dauerhaft gespeichert.
        </p>
        <A1TutorSpeakingCheckpoint assignmentKey="A1-2" sectionKey="teil-3" />
      </section>
    </A1TutorMarkedWorkbookShell>
  );
}
