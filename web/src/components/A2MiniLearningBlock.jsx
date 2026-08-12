import React, { useState } from "react";

const card = { border:"1px solid #bfdbfe", borderRadius:16, padding:16, background:"#f8fbff", display:"grid", gap:12 };
const optionStyle = (active, correct) => ({ textAlign:"left", border:`1px solid ${active ? (correct ? "#86efac" : "#fca5a5") : "#cbd5e1"}`, borderRadius:10, padding:"10px 12px", background: active ? (correct ? "#f0fdf4" : "#fef2f2") : "#fff", cursor:"pointer" });

export default function A2MiniLearningBlock({ title, rule, examples = [], questions = [], outputPrompt, starters = [] }) {
  const [answers, setAnswers] = useState({});
  return <section style={card}>
    <div>
      <div style={{ fontSize:12, fontWeight:800, textTransform:"uppercase", color:"#1d4ed8" }}>Kurz lernen · dann anwenden</div>
      <h3 style={{ margin:"4px 0 0" }}>{title}</h3>
    </div>
    <div style={{ borderLeft:"4px solid #2563eb", paddingLeft:12, lineHeight:1.7 }}><strong>Regel:</strong> {rule}</div>
    <div style={{ display:"grid", gap:8 }}>
      {examples.map((example) => <div key={example} style={{ padding:"9px 11px", borderRadius:10, background:"#fff", border:"1px solid #e2e8f0" }}>{example}</div>)}
    </div>
    {questions.length ? <div style={{ display:"grid", gap:14 }}>
      <strong>Wähle die richtige Antwort.</strong>
      {questions.map((question, index) => <div key={question.stem} style={{ display:"grid", gap:7 }}>
        <div>{index + 1}. {question.stem}</div>
        {question.options.map((option, optionIndex) => {
          const active = answers[index] === optionIndex;
          const correct = optionIndex === question.answer;
          return <button key={option} type="button" style={optionStyle(active, correct)} onClick={() => setAnswers((old) => ({ ...old, [index]: optionIndex }))}>{option}</button>;
        })}
        {answers[index] !== undefined ? <div style={{ fontSize:14, color: answers[index] === question.answer ? "#166534" : "#991b1b" }}>{answers[index] === question.answer ? "Richtig. " : "Noch nicht. "}{question.explanation}</div> : null}
      </div>)}
    </div> : null}
    {outputPrompt ? <div style={{ display:"grid", gap:8, borderTop:"1px solid #dbeafe", paddingTop:12 }}>
      <strong>Jetzt selbst sprechen</strong>
      <div>{outputPrompt}</div>
      {starters.length ? <div style={{ display:"grid", gap:5 }}>{starters.map((starter) => <div key={starter}>• {starter}</div>)}</div> : null}
    </div> : null}
  </section>;
}
