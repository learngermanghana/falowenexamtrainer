import React, { useState } from "react";
import { styles } from "../styles";
import { getB2TopicCollocations } from "../data/b2TopicCollocations";

function CollocationLesson({ day, lesson }) {
  const [answers, setAnswers] = useState({});
  const [draft, setDraft] = useState("");
  const questions = lesson.entries.filter((item) => item[3]).slice(0, 3);

  return (
    <section data-b2-topic-collocations style={{ ...styles.card, display: "grid", gap: 14, border: "1px solid #c7d2fe", borderRadius: 18 }}>
      <div>
        <span style={{ ...styles.badge, background: "#e0e7ff", color: "#3730a3" }}>B2 · Day {day}</span>
        <h2 style={{ margin: "8px 0 0", fontSize: "1.2rem" }}>Kollokationen · Verben mit Präpositionen</h2>
        <p style={{ margin: "6px 0 0", color: "#475569" }}>{lesson.title}</p>
        <p style={{ margin: "6px 0 0", lineHeight: 1.7 }}>Lerne feste Wortverbindungen als Einheit. Bei Verben mit Präpositionen gehört der Kasus dazu. Zum Beispiel: zu + dem = zum, zu + der = zur, an + dem = am und von + dem = vom.</p>
      </div>
      <div style={{ display: "grid", gap: 10 }}>
        {lesson.entries.map(([label, meaning, example]) => (
          <div key={label} style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 12, display: "grid", gap: 5 }}>
            <strong>{label}</strong><span style={{ color: "#475569" }}>{meaning}</span><span>{example}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gap: 10 }}>
        <strong>Klick-Check · Welche Präposition fehlt?</strong>
        {questions.map(([label, , , answer, grammaticalCase], index) => {
          const selected = answers[label];
          const alternatives = ["mit", "von", "für", "auf", "zu"].filter((value) => value !== answer).slice(0, 2);
          const options = [...alternatives];
          options.splice((Number(day) + index) % 3, 0, answer);
          return (
            <div key={label} role="group" aria-label={label.replace(` ${answer} +`, " ___ +")} style={{ display: "grid", gap: 7 }}>
              <span>{label.replace(` ${answer} +`, " ___ +")}</span>
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                {options.map((option) => (
                  <button key={option} type="button" aria-pressed={selected === option} onClick={() => setAnswers((old) => ({ ...old, [label]: option }))} style={{ ...styles.secondaryButton, borderColor: selected === option ? (option === answer ? "#16a34a" : "#dc2626") : "#cbd5e1" }}>{option}</button>
                ))}
              </div>
              {selected ? <small role="status" style={{ color: selected === answer ? "#166534" : "#9a3412", fontWeight: 700 }}>{selected === answer ? "Richtig." : "Noch nicht."} {label}: {answer} verlangt hier {grammaticalCase}.</small> : null}
            </div>
          );
        })}
      </div>
      <div style={{ border: "1px solid #bfdbfe", borderRadius: 14, padding: 12, background: "#eff6ff", display: "grid", gap: 8 }}>
        <strong>Jetzt produzieren</strong>
        <label htmlFor={`b2-collocations-${day}`}>Schreibe zwei eigene Sätze zu „{lesson.title}“ und benutze zwei Wortverbindungen von oben.</label>
        <textarea id={`b2-collocations-${day}`} value={draft} onChange={(event) => setDraft(event.target.value)} rows={4} placeholder={"1. ...\n2. ..."} style={{ boxSizing: "border-box", width: "100%", border: "1px solid #cbd5e1", borderRadius: 10, padding: 10, font: "inherit" }} />
      </div>
    </section>
  );
}

export default function B2TopicCollocationPractice({ day }) {
  const lesson = getB2TopicCollocations(day);
  return lesson ? <CollocationLesson key={Number(day)} day={Number(day)} lesson={lesson} /> : null;
}
