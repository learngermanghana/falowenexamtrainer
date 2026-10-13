import React from "react";
import { styles } from "../styles";
import examples from "../data/otherLevelSeoPracticeContent.json";

const card = { ...styles.card, borderRadius: 16, padding: "clamp(16px,3vw,24px)", display: "grid", gap: 10 };
const linked = { ...styles.secondaryButton, display: "inline-flex", width: "fit-content", textDecoration: "none" };

export default function OtherLevelSeoSamples({ level, onPracticePage = false }) {
  const sample = examples[level];
  if (!sample) return null;
  const { reading, writing, speaking } = sample;
  const slug = level.toLowerCase();
  return (
    <section aria-label={`Goethe ${level} public practice samples`} style={{ display: "grid", gap: 14 }}>
      <section style={card}>
        <h2 style={{ margin: 0 }}>Goethe {level} practice materials with answers</h2>
        <p style={{ margin: 0, lineHeight: 1.7, color: "#334155" }}>{sample.intro}</p>
        <p style={{ margin: 0, color: "#475569" }}>{sample.status}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {level === "A2" ? <a href="/exam-practice/a2" style={linked}>Try free interactive A2 Lesen</a> :
           <a href={onPracticePage ? `/goethe-${slug}-preparation` : `/exam-practice/${slug}`} style={linked}>
              {onPracticePage ? "Go to preparation guide" : "See public practice examples"}
           </a>}
          <a href="/exam-practice" style={linked}>Browse all levels</a>
          <a href="/login/" style={linked}>Sign in for student mock exams</a>
        </div>
      </section>
      <section style={card}>
        <h2 style={{ margin: 0 }}>Lesen · {level} reading exercise</h2>
        <p lang="de" style={{ margin: 0, lineHeight: 1.8 }}>{reading.text}</p>
        <p lang="de" style={{ margin: 0, fontWeight: 750 }}>{reading.question}</p>
        <ol type="A" style={{ margin: 0, paddingLeft: 25, lineHeight: 1.7 }}>
          {reading.options.map(option => <li key={option} lang="de">{option}</li>)}
        </ol>
        <details><summary style={{ cursor: "pointer", fontWeight: 750 }}>Show reading answer and explanation</summary>
          <p style={{ lineHeight: 1.7 }}><strong>{reading.answer}.</strong> {reading.explanation}</p>
        </details>
      </section>
      <section style={card}>
        <h2 style={{ margin: 0 }}>Schreiben · {level} task and model</h2>
        <p lang="de" style={{ margin: 0, lineHeight: 1.8 }}>{writing.task}</p>
        <details><summary style={{ cursor: "pointer", fontWeight: 750 }}>Show writing model answer</summary>
          <p lang="de" style={{ whiteSpace: "pre-line", lineHeight: 1.7 }}>{writing.answer}</p>
          <p style={{ color: "#475569" }}>{writing.tip}</p>
        </details>
      </section>
      <section style={card}>
        <h2 style={{ margin: 0 }}>Sprechen · {level} task and model</h2>
        <p lang="de" style={{ margin: 0, lineHeight: 1.8 }}>{speaking.task}</p>
        <details><summary style={{ cursor: "pointer", fontWeight: 750 }}>Show speaking model answer</summary>
          <p lang="de" style={{ lineHeight: 1.7 }}>{speaking.answer}</p>
          <p style={{ color: "#475569" }}>{speaking.tip}</p>
        </details>
      </section>
      <p style={{ margin: 0, color: "#64748b", fontSize: 12 }}>
        These are original Falowen Goethe-style examples, not official Goethe-Institut exam questions. Falowen is independent and not endorsed by Goethe-Institut.
      </p>
    </section>
  );
}
