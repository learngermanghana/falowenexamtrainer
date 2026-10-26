import React, { useState } from "react";
import ConsistentWritingPatternGuide from "./ConsistentWritingPatternGuide";

const sectionStyle = {
  display: "grid",
  gap: 13,
  padding: 18,
  border: "1px solid #dbeafe",
  borderRadius: 16,
  background: "#ffffff",
  lineHeight: 1.7,
  minWidth: 0,
};
const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  minHeight: 42,
  padding: "9px 11px",
  border: "1px solid #94a3b8",
  borderRadius: 9,
  fontSize: 16,
};
const fields = [
  { label: "Kursart", answer: "Intensiv-Deutschkurs", accepted: ["Intensiv-Deutschkurs", "Intensivkurs", "Intensiv Deutschkurs"] },
  { label: "Kursbeginn (Monat)", answer: "August", accepted: ["August"] },
  { label: "Kursdauer", answer: "4 Wochen", accepted: ["4 Wochen", "vier Wochen", "4", "vier"] },
  { label: "Unterkunft", answer: "Einzelzimmer im Wohnheim", accepted: ["Einzelzimmer im Wohnheim", "Einzelzimmer", "ein Einzelzimmer"] },
  { label: "Bezahlung", answer: "Kreditkarte", accepted: ["Kreditkarte", "per Kreditkarte", "mit Kreditkarte"] },
];

const normalize = (value) => String(value || "")
  .normalize("NFKC")
  .toLocaleLowerCase("de")
  .trim()
  .replace(/[.,;:!?]+$/g, "")
  .replace(/[\s\-]+/g, " ");

export const checkFormAnswer = (index, value) =>
  Boolean(String(value || "").trim()) &&
  Boolean(fields[index]?.accepted.some((answer) => normalize(answer) === normalize(value)));

function MariaFormPractice() {
  const [answers, setAnswers] = useState(["", "", "", "", ""]);
  const [checked, setChecked] = useState(false);
  const score = answers.filter((answer, i) => checkFormAnswer(i, answer)).length;
  const change = (index, value) => {
    setAnswers((previous) => previous.map((answer, i) => i === index ? value : answer));
    setChecked(false);
  };

  return (
    <section style={sectionStyle} data-a1-123-grammar-practice="true">
      <h2 style={{ margin: 0 }}>Teil 1: Formular ausfüllen (5 Punkte)</h2>
      <p style={{ margin: 0 }}>Read the text and fill in the five fields. <strong>Practice only:</strong> this does not affect your assignment score or submit anything to your tutor.</p>
      <p style={{ margin: 0 }}>
        Ihre Freundin Maria Rossi (32 Jahre alt) <strong>wohnt in Rom</strong>. Sie möchte
        <strong> im August</strong> einen <strong>Intensiv-Deutschkurs</strong> an der Sprachschule
        „Aktiv“ in München besuchen. Sie kommt am 02. August an und bleibt <strong>4 Wochen</strong>.
        Sie möchte <strong>in einem Einzelzimmer im Wohnheim</strong> wohnen und zahlt die
        Kursgebühr <strong>per Kreditkarte</strong>.
      </p>
      <h3 style={{ margin: 0 }}>Formular: Sprachschule Aktiv München</h3>
      <div style={{ display: "grid", gap: 2 }}>
        {[["Familienname", "Rossi"], ["Vorname", "Maria"], ["Wohnort", "Rom"]].map(([label, answer]) => (
          <div key={label} style={{ display: "grid", gridTemplateColumns: "minmax(115px, 1fr) minmax(0, 1.5fr)", gap: 12, padding: "9px 0", borderBottom: "1px solid #e2e8f0" }}>
            <strong>{label}</strong><span>{answer}</span>
          </div>
        ))}
        {fields.map((field, index) => {
          const correct = checkFormAnswer(index, answers[index]);
          return (
            <div key={field.label} style={{ display: "grid", gridTemplateColumns: "minmax(115px, 1fr) minmax(0, 1.5fr)", gap: 12, padding: "9px 0", borderBottom: "1px solid #e2e8f0", alignItems: "start" }}>
              <label htmlFor={`a1-123-form-${index}`} style={{ fontWeight: 800, paddingTop: 7 }}>{index + 1}. {field.label}</label>
              <div style={{ display: "grid", gap: 3, minWidth: 0 }}>
                <input id={`a1-123-form-${index}`} aria-label={`${index + 1}. ${field.label}`}
                  autoComplete="off" value={answers[index]} onChange={(event) => change(index, event.target.value)}
                  style={{ ...inputStyle, borderColor: checked ? (correct ? "#16a34a" : "#dc2626") : "#94a3b8" }}
                />
                {checked && (
                  <div role="status" style={{ fontSize: 13, color: correct ? "#166534" : "#991b1b" }}>
                    {correct ? <strong>✓ Richtig!</strong> : <>✗ Correct answer: <strong>{field.answer}</strong></>}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <button type="button" onClick={() => setChecked(true)}
          style={{ background: "#1d4ed8", color: "#fff", border: 0, borderRadius: 10, padding: "11px 17px", fontWeight: 800, cursor: "pointer" }}>
          Check Answers
        </button>
        <button type="button" onClick={() => { setAnswers(["", "", "", "", ""]); setChecked(false); }}
          style={{ background: "#fff", border: "1px solid #94a3b8", borderRadius: 10, padding: "10px 15px", cursor: "pointer" }}>
          Try again
        </button>
        {checked && <strong role="status" aria-live="polite">Your score: {score}/5</strong>}
      </div>
      <small>Exam tip: Find the keywords in the text. Write only the information requested, not complete sentences.</small>
    </section>
  );
}

export default function A1Day20GoetheWritingGrammarPage() {
  return (
    <div style={{ display: "grid", gap: 16 }} data-a1-day20-goethe-writing-grammar="true">
      <section style={{ ...sectionStyle, background: "linear-gradient(135deg, #eff6ff, #ffffff)" }}>
        <h1 style={{ margin: 0 }}>Goethe A1 Schreiben has two parts</h1>
        <p style={{ margin: 0 }}>In the Goethe A1 exam, <strong>Teil 1</strong> is a form (5 raw points) and <strong>Teil 2</strong> is a short message (10 raw points). The writing section lasts 20 minutes.</p>
        <p style={{ margin: 0 }}>Practise the form below, then learn one writing pattern for formal and informal emails. In the Falowen workbook, you will write two different emails.</p>
      </section>
      <MariaFormPractice />
      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Teil 2: Kurze E-Mail schreiben (10 Punkte)</h2>
        <p style={{ margin: 0 }}>Choose <strong>du / dir</strong> for a friend and <strong>Sie / Ihnen</strong> for a school or office. Cover all three task points, include a greeting and closing, and keep your message about 30 words.</p>
        <ConsistentWritingPatternGuide level="A1" taskTitle="Informal letter" defaultOpen compactA1 />
      </section>
    </div>
  );
}
