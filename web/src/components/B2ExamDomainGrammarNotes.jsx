import React from "react";

const listStyle = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const box = { border: "1px solid #cbd5e1", borderRadius: 14, padding: 14, background: "#fff", display: "grid", gap: 10 };

export default function B2ExamDomainGrammarNotes({ lesson, checked = false, onCheckedChange = () => {} }) {
  const grammar = lesson?.grammarLesson || {};
  const explanations = Array.isArray(grammar.explanation) ? grammar.explanation.filter(Boolean) : [];
  const rules = Array.isArray(grammar.rules) ? grammar.rules.filter(Boolean) : [];
  const examples = Array.isArray(grammar.examples) ? grammar.examples.filter(Boolean) : [];
  const sections = Array.isArray(grammar.sections) ? grammar.sections : [];

  return (
    <div style={{ display: "grid", gap: 14 }} data-b2-exam-domain-grammar>
      <div style={{ ...box, background: "#eff6ff", borderColor: "#bfdbfe" }}>
        <strong style={{ fontSize: 18 }}>{grammar.title || lesson?.grammarFocus || "B2-Grammatik"}</strong>
        {explanations.map((item) => <p key={item} style={{ margin: 0, lineHeight: 1.7 }}>{item}</p>)}
      </div>

      {sections.map((section, index) => (
        <section key={section.concept} style={box}>
          <h3 style={{ margin: 0, fontSize: 17 }}>{index + 1}. {section.title}</h3>
          <p style={{ margin: 0, lineHeight: 1.75 }}>{section.explanation}</p>
          <div style={{ lineHeight: 1.75 }}><strong>Satzbau: </strong>{section.formation}</div>
          <div style={{ background: "#f0f9ff", borderRadius: 10, padding: 12, lineHeight: 1.75 }}>
            <strong>Beispiel aus der Lektion</strong>
            <p style={{ margin: "6px 0" }}>{section.sentence}</p>
            <p style={{ margin: 0 }}>{section.analysis}</p>
          </div>
          <div style={{ lineHeight: 1.75 }}><strong>Häufiger Fehler: </strong>{section.mistake}</div>
        </section>
      ))}

      {!sections.length && rules.length ? (
        <div style={box}>
          <strong>Regeln und Funktion</strong>
          <ul style={listStyle}>{rules.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      ) : null}

      {!sections.length && examples.length ? (
        <div style={box}>
          <strong>Modellsätze zum heutigen Thema</strong>
          <ol style={listStyle}>{examples.map((item) => <li key={item}>{item}</li>)}</ol>
        </div>
      ) : null}

      {grammar.miniExercise ? (
        <div style={{ ...box, background: "#fffbeb", borderColor: "#fde68a" }}>
          <strong>Aktive Anwendung</strong>
          <p style={{ margin: 0, lineHeight: 1.7 }}>{grammar.miniExercise}</p>
          {grammar.sampleAnswer ? (
            <details>
              <summary style={{ cursor: "pointer", fontWeight: 700 }}>Mögliche Lösung anzeigen</summary>
              <p style={{ margin: "10px 0 0", lineHeight: 1.75 }}>{grammar.sampleAnswer}</p>
            </details>
          ) : null}
        </div>
      ) : null}

      <label style={{ display: "flex", gap: 9, alignItems: "flex-start", fontWeight: 800 }}>
        <input type="checkbox" checked={checked} onChange={(event) => onCheckedChange(event.target.checked)} />
        <span>Ich habe die Regeln gelesen und eigene Beispielsätze formuliert.</span>
      </label>
    </div>
  );
}
