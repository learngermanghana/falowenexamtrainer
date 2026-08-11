import React, { useState } from "react";
import { WorkbookTaskCard } from "./StandardWorkbookComponents";

const box = { border: "1px solid #bfdbfe", borderRadius: 14, padding: 14, background: "#f8fbff", display: "grid", gap: 8 };
const greenBox = { ...box, borderColor: "#bbf7d0", background: "#f0fdf4" };
const amberBox = { ...box, borderColor: "#fde68a", background: "#fffbeb" };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 12 };
const p = { margin: 0, lineHeight: 1.7 };

const questions = [
  {
    question: "Wo bist du?",
    options: ["Ich bin im Park.", "Ich gehe in den Park.", "Ich fahre in den Park.", "Ich komme in den Park."],
    answer: "Ich bin im Park.",
    explanation: "Wo? fragt nach einem Ort. Deshalb steht nach in der Dativ: in dem Park → im Park.",
  },
  {
    question: "Wohin gehst du?",
    options: ["Ich bin im Park.", "Ich sitze im Park.", "Ich gehe in den Park.", "Ich war im Park."],
    answer: "Ich gehe in den Park.",
    explanation: "Wohin? fragt nach einem Ziel oder einer Richtung. Deshalb steht nach in der Akkusativ: in den Park.",
  },
  {
    question: "Welche Form passt? Wir treffen uns ___ Café.",
    options: ["im", "ins", "in den", "an den"],
    answer: "im",
    explanation: "Wir treffen uns an einem Ort. Wo? → Dativ: in dem Café → im Café.",
  },
  {
    question: "Welche Form passt? Wir gehen ___ Café.",
    options: ["im", "ins", "in der", "am"],
    answer: "ins",
    explanation: "Wir bewegen uns zu einem Ziel. Wohin? → Akkusativ: in das Café → ins Café.",
  },
  {
    question: "Welche Form ist richtig?",
    options: ["Ich bin in der Stadt.", "Ich bin in die Stadt.", "Ich gehe in der Stadt.", "Ich fahre im Stadt."],
    answer: "Ich bin in der Stadt.",
    explanation: "Wo? → Dativ. Stadt ist feminin: in der Stadt.",
  },
  {
    question: "Welche Form ist richtig?",
    options: ["Ich fahre in die Stadt.", "Ich fahre in der Stadt.", "Ich bin in die Stadt.", "Ich gehe im Stadt."],
    answer: "Ich fahre in die Stadt.",
    explanation: "Wohin? → Akkusativ. Stadt ist feminin: in die Stadt.",
  },
];

const articleRows = [
  ["maskulin", "der Park", "im Park", "in den Park"],
  ["feminin", "die Stadt", "in der Stadt", "in die Stadt"],
  ["neutral", "das Café", "im Café", "ins Café"],
  ["Plural", "die Berge", "in den Bergen", "in die Berge"],
];

export default function A2Day4WoWohinPrepositionLesson() {
  const [answers, setAnswers] = useState({});

  return (
    <>
      <WorkbookTaskCard eyebrow="Grammatik" title="Wo treffen wir uns? – Wo? oder Wohin?" practiceOnly>
        <p style={p}><strong>Heute lernst du nur eine wichtige Regel:</strong> Die Wechselpräposition <strong>in</strong> kann mit Dativ oder Akkusativ stehen.</p>
        <div style={grid}>
          <section style={greenBox}>
            <h3 style={{ margin: 0 }}>WO? → DATIV</h3>
            <p style={p}>Du bist schon an einem Ort. Es gibt keine Bewegung zu einem neuen Ziel.</p>
            <p style={p}><strong>Ich bin im Park.</strong></p>
            <p style={p}><strong>Wir treffen uns im Café.</strong></p>
            <p style={p}><strong>Sie ist in der Stadt.</strong></p>
          </section>
          <section style={amberBox}>
            <h3 style={{ margin: 0 }}>WOHIN? → AKKUSATIV</h3>
            <p style={p}>Du bewegst dich zu einem Ziel.</p>
            <p style={p}><strong>Ich gehe in den Park.</strong></p>
            <p style={p}><strong>Wir gehen ins Café.</strong></p>
            <p style={p}><strong>Sie fährt in die Stadt.</strong></p>
          </section>
        </div>
        <div style={box}>
          <strong>Der Unterschied mit demselben Ort:</strong>
          <p style={p}>📍 <strong>Wo bist du?</strong> – Ich bin <strong>im Park</strong>. → Dativ</p>
          <p style={p}>➡️ <strong>Wohin gehst du?</strong> – Ich gehe <strong>in den Park</strong>. → Akkusativ</p>
        </div>
      </WorkbookTaskCard>

      <WorkbookTaskCard eyebrow="Artikelwechsel" title="So verändert sich der Artikel" practiceOnly>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 620 }}>
            <thead>
              <tr>{["Genus", "Nomen", "Wo? + Dativ", "Wohin? + Akkusativ"].map((h) => <th key={h} style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #cbd5e1" }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {articleRows.map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell} style={{ padding: 10, borderBottom: "1px solid #e2e8f0" }}>{cell}</td>)}</tr>)}
            </tbody>
          </table>
        </div>
        <p style={p}><strong>Merke:</strong> im = in dem · ins = in das.</p>
      </WorkbookTaskCard>

      <WorkbookTaskCard eyebrow="Treffen planen" title="Wo sollen wir uns treffen?" practiceOnly>
        <div style={grid}>
          <section style={box}><strong>Ort nennen – Wo?</strong><p style={p}>Wir treffen uns <strong>im Park</strong>.</p><p style={p}>Wir treffen uns <strong>im Café</strong>.</p><p style={p}>Wir treffen uns <strong>in der Stadt</strong>.</p></section>
          <section style={box}><strong>Zum Treffpunkt gehen – Wohin?</strong><p style={p}>Ich gehe <strong>in den Park</strong>.</p><p style={p}>Ich gehe <strong>ins Café</strong>.</p><p style={p}>Ich fahre <strong>in die Stadt</strong>.</p></section>
        </div>
        <p style={p}>Sprich danach 30–60 Sekunden: <strong>Wo möchtest du dich mit deinen Freunden treffen? Wie kommst du dorthin?</strong></p>
      </WorkbookTaskCard>

      <WorkbookTaskCard eyebrow="Multiple Choice" title="Wo oder Wohin?" practiceOnly>
        <div style={{ display: "grid", gap: 14 }}>
          {questions.map((item, index) => {
            const selected = answers[index];
            return (
              <div key={item.question} style={box}>
                <strong>{index + 1}. {item.question}</strong>
                <div style={{ display: "grid", gap: 7 }}>
                  {item.options.map((option) => (
                    <label key={option} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <input type="radio" name={`a2d4-${index}`} checked={selected === option} onChange={() => setAnswers((old) => ({ ...old, [index]: option }))} />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
                {selected ? <p style={{ ...p, fontWeight: 700 }}>{selected === item.answer ? "Richtig. " : `Noch nicht. Richtig ist: ${item.answer}. `}{item.explanation}</p> : null}
              </div>
            );
          })}
        </div>
      </WorkbookTaskCard>
    </>
  );
}
