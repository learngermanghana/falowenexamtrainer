import React, { useState } from "react";
import { enrichC1SpeakingBranches } from "../data/c1Day11To15SpeakingScaffolds";
import { styles } from "../styles";

const listStyle = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const panelStyle = { border: "1px solid #c7d2fe", borderRadius: 14, padding: 14, background: "#eef2ff", display: "grid", gap: 10 };

const NoteBox = ({ children, tone = "blue" }) => {
  const tones = { blue: ["#bfdbfe", "#eff6ff", "#1e3a8a"], green: ["#bbf7d0", "#f0fdf4", "#14532d"], amber: ["#fde68a", "#fffbeb", "#92400e"] };
  const [border, background, color] = tones[tone] || tones.blue;
  return <div style={{ border: `1px solid ${border}`, borderRadius: 14, padding: 12, background, color, lineHeight: 1.65 }}>{children}</div>;
};

export const getC1SpeakGrammarData = (lesson, branchesOverride = null) => {
  const grammar = lesson?.grammarLesson || {};
  const speakingBuilder = lesson?.speakingBuilder || {};
  const rawBranches = Array.isArray(branchesOverride)
    ? branchesOverride
    : (Array.isArray(speakingBuilder.branches) ? speakingBuilder.branches : []);
  return {
    grammarTitle: grammar.title || lesson?.grammarFocus || "C1-Grammatik",
    grammarFocus: lesson?.grammarFocus || grammar.title || "",
    explanations: Array.isArray(grammar.explanation) ? grammar.explanation : [],
    rules: Array.isArray(grammar.rules) ? grammar.rules : [],
    examples: Array.isArray(grammar.examples) ? grammar.examples : [],
    miniExercise: grammar.miniExercise || "",
    question: String(speakingBuilder.question || lesson?.speakingTopic || lesson?.topic || "").replace(/^Sprechen:\s*/i, ""),
    branches: enrichC1SpeakingBranches(lesson, rawBranches),
    plan: Array.isArray(speakingBuilder.plan) ? speakingBuilder.plan : [],
    starters: Array.isArray(speakingBuilder.starters) ? speakingBuilder.starters : [],
  };
};

export default function C1SpeakGrammarGuide({ lesson, branchesOverride = null, showGrammar = false, showSpeaking = true }) {
  const guide = getC1SpeakGrammarData(lesson, branchesOverride);
  const [support, setSupport] = useState("full");

  return <div style={{ display: "grid", gap: 12 }}>
    {showGrammar ? <section style={{ ...styles.card, display: "grid", gap: 12, border: "1px solid #bfdbfe", borderRadius: 16 }}>
      <div style={{ display: "grid", gap: 5 }}><span style={{ ...styles.badge, width: "fit-content", background: "#dbeafe", color: "#1e3a8a" }}>Grammar lesson</span><h3 style={{ margin: 0 }}>{guide.grammarTitle}</h3>{guide.grammarFocus ? <p style={{ margin: 0, color: "#475569", lineHeight: 1.65 }}><strong>Fokus:</strong> {guide.grammarFocus}</p> : null}</div>
      {guide.explanations.map((text) => <p key={text} style={{ margin: 0, lineHeight: 1.7 }}>{text}</p>)}
      {guide.rules.length ? <div><strong>Kernregeln</strong><ul style={{ ...listStyle, marginTop: 8 }}>{guide.rules.map((rule) => <li key={rule}>{rule}</li>)}</ul></div> : null}
      {guide.examples.length ? <div><strong>Beispiele</strong><ul style={{ ...listStyle, marginTop: 8 }}>{guide.examples.map((example) => <li key={example}>{example}</li>)}</ul></div> : null}
      {guide.miniExercise ? <NoteBox tone="green"><strong>Kurz üben:</strong> {guide.miniExercise}</NoteBox> : null}
    </section> : null}

    {showSpeaking ? <>
      <NoteBox tone="amber"><strong>Sprechfrage:</strong> {guide.question}</NoteBox>
      <div style={{ ...panelStyle, background: "#fff" }}>
        <div><strong>Trainiere bis du ohne Hilfe sprechen kannst</strong><p style={{ margin: "5px 0 0", color: "#475569", lineHeight: 1.6 }}>1. Mit Hilfe: Ideen, Leitfragen, Beispiele und Satzanfänge. 2. Weniger Hilfe: nur Ideen und Leitfragen. 3. Prüfung: nur die Aufgabe.</p></div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[["full","1. Mit Hilfe"],["keywords","2. Weniger Hilfe"],["exam","3. Prüfungsmodus"]].map(([value,label]) => <button key={value} type="button" onClick={() => setSupport(value)} style={support === value ? styles.primaryButton : styles.secondaryButton}>{label}</button>)}
        </div>
      </div>

      {support !== "exam" && guide.branches.length ? <div style={panelStyle}>
        <h3 style={{ margin: 0 }}>Fragen und echte Punkte für deine Antwort</h3>
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.65 }}>Wähle 2–4 Bereiche. Entwickle jeden Punkt als Aussage → Grund → Beispiel → Folge. Du musst nicht alle Punkte verwenden.</p>
        <div style={{ display: "grid", gap: 10 }}>{guide.branches.map((branch) => <div key={branch.id || branch.title} style={{ border: "1px solid #c7d2fe", borderRadius: 12, padding: 12, background: "#fff", display: "grid", gap: 5 }}>
          <strong>{branch.title}</strong>
          {(branch.keywords || []).length ? <div><strong>Ideen:</strong> {(branch.keywords || []).join(" · ")}</div> : null}
          {branch.prompt ? <div><strong>Leitfrage:</strong> {branch.prompt}</div> : null}
          {support === "full" && branch.example ? <div style={{ color: "#334155" }}><strong>So kannst du den Punkt entwickeln:</strong> {branch.example}</div> : null}
          {support === "full" && branch.starter ? <div style={{ color: "#1e3a8a" }}><strong>Satzanfang:</strong> {branch.starter}</div> : null}
        </div>)}</div>
      </div> : null}

      {support === "full" && guide.plan.length ? <div style={{ ...panelStyle, background: "#f8fafc" }}><h3 style={{ margin: 0 }}>Aufbau deiner Antwort</h3><ol style={listStyle}>{guide.plan.map((item) => <li key={item}>{item}</li>)}</ol></div> : null}
      {support === "full" && guide.starters.length ? <NoteBox><strong>Nützliche Satzanfänge</strong><ul style={{ ...listStyle, marginTop: 8 }}>{guide.starters.map((item) => <li key={item}>{item}</li>)}</ul></NoteBox> : null}
      {support === "exam" ? <NoteBox tone="green"><strong>Prüfungsmodus:</strong> Bereite deine Antwort ohne Ideenbank vor. Sprich strukturiert, begründe deine Position, entwickle mindestens ein konkretes Beispiel und berücksichtige eine Gegenposition oder Einschränkung.</NoteBox> : null}
    </> : null}
  </div>;
}
