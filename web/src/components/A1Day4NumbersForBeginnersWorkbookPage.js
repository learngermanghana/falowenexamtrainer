import React from "react";
import A1TutorMarkedWorkbookShell from "./A1TutorMarkedWorkbookShell";
import A1Day4PhoneNumberSpeakingPractice from "./A1Day4PhoneNumberSpeakingPractice";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 14 };
const labelStyle = { display: "grid", gap: 5, lineHeight: 1.5 };
const formRow = { display: "grid", gridTemplateColumns: "minmax(110px, 1fr) minmax(110px, 2fr)", gap: 10, alignItems: "center", padding: "10px 12px", borderBottom: "1px solid #e2e8f0" };

export const A1_DAY4_FORM_FIELDS = Object.freeze([
  { number: 1, label: "Alter", unit: "" },
  { number: 2, label: "Straße und Hausnummer", unit: "" },
  { number: 3, label: "Telefonnummer", unit: "" },
  { number: 4, label: "Kursdauer", unit: "Monate" },
  { number: 5, label: "Kursgebühr", unit: "Euro" },
]);
export const A1_DAY4_NUMBER_WORD_ITEMS = Object.freeze([12, 16, 221, 3435, 70]);

export default function A1Day4NumbersForBeginnersWorkbookPage() {
  return (
    <A1TutorMarkedWorkbookShell
      fallbackAssignmentKey="A1-2"
      title="A1 · Day 4 Workbook · Zahlen, Telefonnummern und Adressen"
      subtitle="Kapitel 2 · Lesen, Schreiben und Sprechen · Tutor-marked numbers practice"
      assignmentIntro="Complete Teil 1 and Teil 2 in the answer fields below each task. Teil 3 is optional speaking practice: you can record and replay your phone number without uploading it. Then open Review & Submit."
      submitTitle="Review & Submit A1 · Day 4 · Kapitel 2"
      submitDescription="Check all five form answers and five number words, then submit once. The optional spoken phone-number recording stays on your device."
    >
      <section style={card} data-a1-day4-teil1-form="true">
        <h2 style={{ margin: 0 }}>Teil 1 · Lesen und Schreiben: Formular ausfüllen</h2>
        <p style={{ margin: 0 }}>Lesen Sie die Informationen. Füllen Sie die fünf fehlenden Angaben (1–5) aus.</p>
        <p style={{ margin: 0, color: "#475569" }}>Read the information and copy the five missing details into the numbered answer fields below.</p>
        <div style={{ padding: 14, borderRadius: 12, background: "#eff6ff", lineHeight: 1.8 }}>
          <strong>Informationen über Elena</strong>
          <p style={{ margin: "6px 0 0" }}>
            Elena Popov ist <strong>26 Jahre</strong> alt. Sie wohnt in der <strong>Müllerstraße 87</strong> in Berlin.
            Ihre Telefonnummer ist <strong>0171 33 55 90</strong>.
            Sie möchte einen Deutschkurs für <strong>3 Monate</strong> machen.
            Der Kurs kostet <strong>240 Euro</strong>.
          </p>
        </div>
        <div style={{ border: "1px solid #cbd5e1", borderRadius: 12, overflow: "hidden" }}>
          <h3 style={{ margin: 0, padding: 12, background: "#f1f5f9" }}>Anmeldeformular · Sprachschule Berlin</h3>
          <div style={formRow}><strong>Name</strong><span>Popov</span></div>
          <div style={formRow}><strong>Vorname</strong><span>Elena</span></div>
          {A1_DAY4_FORM_FIELDS.map(({ number, label, unit }) => (
            <div key={number} style={formRow}>
              <strong>{label}</strong>
              <span>{number}. __________________ {unit}</span>
            </div>
          ))}
        </div>
        <p style={{ margin: 0, color: "#334155" }}>Tragen Sie Ihre Antworten 1–5 in die Antwortfelder direkt unter diesem Teil ein.</p>
      </section>

      <section style={card} data-a1-day4-teil2-numbers="true">
        <h2 style={{ margin: 0 }}>Teil 2 · Schreiben: Zahlen als Wörter</h2>
        <p style={{ margin: 0 }}>Schreiben Sie die Zahlen auf Deutsch.</p>
        <p style={{ margin: 0, color: "#475569" }}>Write each number as a German word in the five numbered answer fields below.</p>
        <div style={{ padding: 12, background: "#eff6ff", borderRadius: 10 }}>
          <strong>Beispiel:</strong> 25 → fünfundzwanzig
        </div>
        <ol style={{ margin: 0, paddingLeft: 28, lineHeight: 2 }}>
          {A1_DAY4_NUMBER_WORD_ITEMS.map(number => <li key={number}><strong>{number}</strong> → ____________________</li>)}
        </ol>
        <p style={{ margin: 0, color: "#475569" }}>Tipp: Lernen Sie zuerst die kleinen Zahlen. Bei großen Zahlen helfen Ihnen die Teile hundert und tausend.</p>
      </section>

      <section style={card} data-a1-day4-teil3-speaking="true">
        <h2 style={{ margin: 0 }}>Teil 3 · Sprechen: Meine Telefonnummer</h2>
        <A1Day4PhoneNumberSpeakingPractice />
      </section>
    </A1TutorMarkedWorkbookShell>
  );
}
