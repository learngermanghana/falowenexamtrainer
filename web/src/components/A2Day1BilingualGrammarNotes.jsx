import React, { useState } from "react";

const card = { border: "1px solid #dbeafe", borderRadius: 16, padding: 16, background: "#fff", display: "grid", gap: 12 };
const note = { border: "1px solid #dbeafe", borderRadius: 12, padding: 12, background: "#f8fbff", lineHeight: 1.7 };
const optionStyle = (selected, correct) => ({ textAlign: "left", border: `1px solid ${selected ? (correct ? "#86efac" : "#fca5a5") : "#cbd5e1"}`, borderRadius: 10, padding: "10px 12px", background: selected ? (correct ? "#f0fdf4" : "#fef2f2") : "#fff", cursor: "pointer" });

const questions = [
  { stem: "Which sentence with weil is correct?", options: ["Ich lerne Deutsch, weil ich in Deutschland arbeiten möchte.", "Ich lerne Deutsch, weil ich möchte in Deutschland arbeiten."], answer: 0, explanation: "weil sends the conjugated verb to the end: ... arbeiten möchte." },
  { stem: "Which sentence with deshalb is correct?", options: ["Ich bin müde. Deshalb ich gehe früh schlafen.", "Ich bin müde. Deshalb gehe ich früh schlafen."], answer: 1, explanation: "deshalb takes position 1, so the verb follows immediately: Deshalb gehe ich ..." },
  { stem: "Which sentence with denn is correct?", options: ["Ich trinke Tee, denn Kaffee ist mir zu stark.", "Ich trinke Tee, denn Kaffee mir zu stark ist."], answer: 0, explanation: "denn keeps normal main-clause order: subject + verb." },
  { stem: "The reason is already stated: Es regnet. Which word introduces the result?", options: ["weil", "deshalb", "denn"], answer: 1, explanation: "deshalb means therefore / that is why and introduces the consequence." },
];

export default function A2Day1BilingualGrammarNotes() {
  const [answers, setAnswers] = useState({});
  return <section data-a2-day1-bilingual-grammar="true" style={{ display: "grid", gap: 14 }}>
    <div style={card}>
      <div style={{ color: "#1d4ed8", fontSize: 12, fontWeight: 900, textTransform: "uppercase" }}>Understand first · then practise</div>
      <h2 style={{ margin: 0 }}>weil, denn and deshalb — how to think</h2>
      <p style={{ margin: 0, lineHeight: 1.7 }}>At A2, start with <strong>two simple ideas</strong>. Decide whether the second idea is a <strong>reason</strong> or a <strong>result</strong>. Only then choose the connector.</p>
      <div style={note}><strong>Idea 1:</strong> Ich lerne Deutsch. <span style={{ color: "#64748b" }}>(I learn German.)</span><br /><strong>Idea 2:</strong> Ich möchte in Deutschland arbeiten. <span style={{ color: "#64748b" }}>(I want to work in Germany.)</span><br /><strong>Connected:</strong> Ich lerne Deutsch, <strong>weil</strong> ich in Deutschland arbeiten <strong>möchte</strong>.</div>
    </div>

    <div style={card}>
      <h3 style={{ margin: 0 }}>1. weil = because</h3>
      <p style={{ margin: 0, lineHeight: 1.7 }}><strong>Use it to give a reason.</strong> With <em>weil</em>, the conjugated verb moves to the end of that clause.</p>
      <div style={note}><strong>Pattern:</strong> Main sentence + weil + subject + ... + <strong>VERB</strong><br />Ich bin entspannt, weil ich heute frei <strong>habe</strong>.</div>
    </div>

    <div style={card}>
      <h3 style={{ margin: 0 }}>2. denn = because</h3>
      <p style={{ margin: 0, lineHeight: 1.7 }}><strong>Use it to give a reason without changing normal word order.</strong></p>
      <div style={note}><strong>Pattern:</strong> Main sentence + denn + subject + <strong>verb</strong> + ...<br />Ich trinke Tee, denn Kaffee <strong>ist</strong> mir zu stark.</div>
    </div>

    <div style={card}>
      <h3 style={{ margin: 0 }}>3. deshalb = therefore / that is why</h3>
      <p style={{ margin: 0, lineHeight: 1.7 }}><strong>Use it when the reason is already known and you want to give the result.</strong> The verb comes directly after <em>deshalb</em>.</p>
      <div style={note}><strong>Reason:</strong> Ich bin müde.<br /><strong>Result:</strong> Deshalb <strong>gehe</strong> ich früh schlafen.<br /><span style={{ color: "#991b1b" }}>Not: Deshalb ich gehe ...</span></div>
    </div>

    <div style={card}>
      <h3 style={{ margin: 0 }}>Quick decision</h3>
      <div style={note}><strong>I want to say WHY:</strong> weil / denn<br />Ich gehe nach Hause, weil ich müde bin.<br />Ich gehe nach Hause, denn ich bin müde.</div>
      <div style={note}><strong>I already said WHY; now I want the RESULT:</strong> deshalb<br />Ich bin müde. Deshalb gehe ich nach Hause.</div>
    </div>

    <div style={card}>
      <h3 style={{ margin: 0 }}>Check your understanding</h3>
      {questions.map((item, index) => <div key={item.stem} style={{ ...note, display: "grid", gap: 8 }}>
        <strong>{index + 1}. {item.stem}</strong>
        {item.options.map((option, optionIndex) => {
          const selected = answers[index] === optionIndex;
          return <button key={option} type="button" style={optionStyle(selected, optionIndex === item.answer)} onClick={() => setAnswers((old) => ({ ...old, [index]: optionIndex }))}>{option}</button>;
        })}
        {answers[index] !== undefined ? <div style={{ color: answers[index] === item.answer ? "#166534" : "#991b1b" }}><strong>{answers[index] === item.answer ? "Correct. " : "Try again. "}</strong>{item.explanation}</div> : null}
      </div>)}
    </div>

    <div style={card}>
      <h3 style={{ margin: 0 }}>Now produce language</h3>
      <p style={{ margin: 0, lineHeight: 1.7 }}>Make three short sentences about your day: one with <strong>weil</strong>, one with <strong>denn</strong>, and one with <strong>deshalb</strong>. Think first: am I giving a reason or a result?</p>
      <div style={note}>Ich bin heute ..., weil ...<br />Ich ..., denn ...<br />Ich habe ... . Deshalb ...</div>
    </div>
  </section>;
}
