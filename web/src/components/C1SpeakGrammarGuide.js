import React from "react";
import { styles } from "../styles";

const listStyle = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };

const panelStyle = {
  border: "1px solid #c7d2fe",
  borderRadius: 14,
  padding: 14,
  background: "#eef2ff",
  display: "grid",
  gap: 10,
};

const NoteBox = ({ children, tone = "blue" }) => {
  const tones = {
    blue: ["#bfdbfe", "#eff6ff", "#1e3a8a"],
    green: ["#bbf7d0", "#f0fdf4", "#14532d"],
    amber: ["#fde68a", "#fffbeb", "#92400e"],
  };
  const [border, background, color] = tones[tone] || tones.blue;
  return (
    <div style={{ border: `1px solid ${border}`, borderRadius: 14, padding: 12, background, color, lineHeight: 1.65 }}>
      {children}
    </div>
  );
};

export const getC1SpeakGrammarData = (lesson, branchesOverride = null) => {
  const grammar = lesson?.grammarLesson || {};
  const speakingBuilder = lesson?.speakingBuilder || {};
  return {
    grammarTitle: grammar.title || lesson?.grammarFocus || "C1-Grammatik",
    grammarFocus: lesson?.grammarFocus || grammar.title || "",
    explanations: Array.isArray(grammar.explanation) ? grammar.explanation : [],
    rules: Array.isArray(grammar.rules) ? grammar.rules : [],
    examples: Array.isArray(grammar.examples) ? grammar.examples : [],
    miniExercise: grammar.miniExercise || "",
    question: String(speakingBuilder.question || lesson?.speakingTopic || lesson?.topic || "").replace(/^Sprechen:\s*/i, ""),
    branches: Array.isArray(branchesOverride) ? branchesOverride : (Array.isArray(speakingBuilder.branches) ? speakingBuilder.branches : []),
    plan: Array.isArray(speakingBuilder.plan) ? speakingBuilder.plan : [],
    starters: Array.isArray(speakingBuilder.starters) ? speakingBuilder.starters : [],
  };
};

export default function C1SpeakGrammarGuide({
  lesson,
  branchesOverride = null,
  showGrammar = false,
  showSpeaking = true,
}) {
  const guide = getC1SpeakGrammarData(lesson, branchesOverride);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {showGrammar ? (
        <section style={{ ...styles.card, display: "grid", gap: 12, border: "1px solid #bfdbfe", borderRadius: 16 }}>
          <div style={{ display: "grid", gap: 5 }}>
            <span style={{ ...styles.badge, width: "fit-content", background: "#dbeafe", color: "#1e3a8a" }}>Grammar lesson</span>
            <h3 style={{ margin: 0 }}>{guide.grammarTitle}</h3>
            {guide.grammarFocus ? <p style={{ margin: 0, color: "#475569", lineHeight: 1.65 }}><strong>Fokus:</strong> {guide.grammarFocus}</p> : null}
          </div>

          {guide.explanations.map((text) => (
            <p key={text} style={{ margin: 0, lineHeight: 1.7 }}>{text}</p>
          ))}

          {guide.rules.length ? (
            <div>
              <strong>Kernregeln</strong>
              <ul style={{ ...listStyle, marginTop: 8 }}>{guide.rules.map((rule) => <li key={rule}>{rule}</li>)}</ul>
            </div>
          ) : null}

          {guide.examples.length ? (
            <div>
              <strong>Beispiele</strong>
              <ul style={{ ...listStyle, marginTop: 8 }}>{guide.examples.map((example) => <li key={example}>{example}</li>)}</ul>
            </div>
          ) : null}

          {guide.miniExercise ? <NoteBox tone="green"><strong>Kurz üben:</strong> {guide.miniExercise}</NoteBox> : null}
        </section>
      ) : null}

      {showSpeaking ? (
        <>
          <NoteBox tone="amber"><strong>Sprechfrage:</strong> {guide.question}</NoteBox>

          {guide.branches.length ? (
            <div style={panelStyle}>
              <h3 style={{ margin: 0 }}>Fragen und Punkte für deine Antwort</h3>
              <p style={{ margin: 0, color: "#475569", lineHeight: 1.65 }}>
                Wähle passende Punkte und beantworte die Leitfragen. Nutze dabei die Grammatik aus dem Learn-Teil.
              </p>
              <ul style={listStyle}>
                {guide.branches.map((branch) => (
                  <li key={branch.id || branch.title}>
                    <strong>{branch.title}:</strong> {(branch.keywords || []).join(", ")}
                    {branch.prompt ? <div style={{ marginTop: 3, color: "#334155" }}>{branch.prompt}</div> : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {guide.plan.length ? (
            <div style={{ ...panelStyle, background: "#f8fafc" }}>
              <h3 style={{ margin: 0 }}>Aufbau deiner Antwort</h3>
              <ol style={listStyle}>{guide.plan.map((item) => <li key={item}>{item}</li>)}</ol>
            </div>
          ) : null}

          {guide.starters.length ? (
            <NoteBox>
              <strong>Nützliche Satzanfänge</strong>
              <ul style={{ ...listStyle, marginTop: 8 }}>{guide.starters.map((item) => <li key={item}>{item}</li>)}</ul>
            </NoteBox>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
