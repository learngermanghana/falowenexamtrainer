import React, { useState } from "react";

const questions = [
  { prompt: "Was passt? Ich lerne Deutsch, ___ in Deutschland zu arbeiten.", options: ["um", "weil", "als"], answer: 0 },
  { prompt: "Welcher Satz ist richtig?", options: ["Ich mache einen Kurs, um bessere Chancen haben.", "Ich mache einen Kurs, um bessere Chancen zu haben.", "Ich mache einen Kurs, zu um bessere Chancen haben."], answer: 1 },
  { prompt: "Was drückt um ... zu aus?", options: ["ein Ziel", "eine Vergangenheit", "einen Vergleich"], answer: 0 },
  { prompt: "Was passt? Ich arbeite viel, um Erfahrung ___.", options: ["sammeln", "zu sammeln", "gesammelt"], answer: 1 },
];

export default function A2Day14QuickLearnSpeaking() {
  const [answers, setAnswers] = useState({});
  return (
    <section data-a2-day14-speaking-quick-learn="true" style={{ display: "grid", gap: 16, padding: 16, borderRadius: 16, border: "1px solid #bfdbfe", background: "#eff6ff" }}>
      <header>
        <p style={{ margin: 0, fontWeight: 800, color: "#1d4ed8" }}>A2 Day 14 · Schnell lernen, dann anwenden</p>
        <h3 style={{ marginBottom: 0 }}>Kurz lernen · dann anwenden</h3>
      </header>
      <div style={{ display: "grid", gap: 8 }}>
        <h4 style={{ margin: 0 }}>Berufsziele mit um ... zu ausdrücken</h4>
        <p style={{ margin: 0 }}><strong>Regel:</strong> um ... zu zeigt ein Ziel. Das Subjekt bleibt in beiden Satzteilen gleich. Das Verb nach zu steht am Ende.</p>
        {["Ich mache eine Weiterbildung, um meine Chancen zu verbessern.", "Ich lerne Deutsch, um in Deutschland zu arbeiten.", "Ich spare Geld, um einen Kurs zu machen.", "Ich sammle Erfahrung, um später Teamleiter zu werden."].map((example) => <p key={example} style={{ margin: 0 }}>{example}</p>)}
      </div>
      <div style={{ display: "grid", gap: 12 }}>
        <h4 style={{ margin: 0 }}>Kurz prüfen</h4>
        {questions.map((question, index) => (
          <fieldset key={question.prompt} style={{ display: "grid", gap: 8, border: "1px solid #cbd5e1", borderRadius: 12, padding: 12, background: "white" }}>
            <legend style={{ fontWeight: 700 }}>{index + 1}. {question.prompt}</legend>
            {question.options.map((option, optionIndex) => (
              <label key={option} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="radio" name={`a2-day14-quick-${index}`} checked={answers[index] === optionIndex} onChange={() => setAnswers((previous) => ({ ...previous, [index]: optionIndex }))} />
                {option}
              </label>
            ))}
            {answers[index] !== undefined ? <p role="status" style={{ margin: 0, fontWeight: 700, color: answers[index] === question.answer ? "#166534" : "#b91c1c" }}>{answers[index] === question.answer ? "Richtig!" : "Versuche es noch einmal."}</p> : null}
          </fieldset>
        ))}
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        <h4 style={{ margin: 0 }}>Jetzt selbst anwenden</h4>
        <p style={{ margin: 0 }}>Nenne drei berufliche Ziele und erkläre jeweils mit um ... zu, warum du etwas tust.</p>
        <ul style={{ margin: 0, paddingLeft: 20 }}><li>Ich möchte ...</li><li>Ich mache ..., um ... zu ...</li><li>Ich lerne ..., um ... zu ...</li></ul>
      </div>
    </section>
  );
}
