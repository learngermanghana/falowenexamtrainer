import React from "react";
import { styles } from "../styles";

export default function B2QuizFirstLearnPreview({ lesson }) {
  const grammar = lesson?.grammarLesson || {};
  const explanation = Array.isArray(grammar.explanation) ? grammar.explanation.slice(0, 2) : [];
  const rules = Array.isArray(grammar.rules) ? grammar.rules.slice(0, 3) : [];
  const examples = Array.isArray(grammar.examples) ? grammar.examples.slice(0, 2) : [];

  if (!grammar.title && !explanation.length && !rules.length && !examples.length) return null;

  return (
    <section style={{ ...styles.card, display: "grid", gap: 12, border: "1px solid #bfdbfe", borderRadius: 18, background: "#eff6ff" }}>
      <div>
        <div style={{ fontWeight: 900, color: "#1e3a8a" }}>Quick grammar preview</div>
        <h2 style={{ margin: "4px 0 0", fontSize: "1.15rem" }}>{grammar.title || lesson?.grammarFocus || "Grammar focus"}</h2>
      </div>
      {explanation.map((item) => <p key={item} style={{ margin: 0, lineHeight: 1.65 }}>{item}</p>)}
      {rules.length ? <div><strong>Remember:</strong><ul style={{ margin: "6px 0 0", paddingLeft: 22, lineHeight: 1.7 }}>{rules.map((item) => <li key={item}>{item}</li>)}</ul></div> : null}
      {examples.length ? <div><strong>Examples:</strong><ul style={{ margin: "6px 0 0", paddingLeft: 22, lineHeight: 1.7 }}>{examples.map((item) => <li key={item}>{item}</li>)}</ul></div> : null}
      <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>Now answer the clickable questions below. After the check, continue to the deep grammar notes for the full explanation.</p>
    </section>
  );
}
