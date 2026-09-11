import React, { useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

const card = {
  ...styles.card,
  display: "grid",
  gap: 12,
  border: "1px solid #e2e8f0",
  borderRadius: 18,
};

const Section = ({ eyebrow, title, children }) => (
  <section style={card}>
    <div style={{ display: "grid", gap: 4 }}>
      {eyebrow ? (
        <span style={{ color: "#475569", fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.6 }}>
          {eyebrow}
        </span>
      ) : null}
      <h2 style={{ margin: 0 }}>{title}</h2>
    </div>
    {children}
  </section>
);

const weatherWords = [
  ["Es ist sonnig.", "It is sunny."],
  ["Es ist warm.", "It is warm."],
  ["Es ist kalt.", "It is cold."],
  ["Es ist windig.", "It is windy."],
  ["Es regnet.", "It is raining."],
  ["Es schneit.", "It is snowing."],
  ["Die Sonne scheint.", "The sun is shining."],
  ["Es gibt einen Sturm.", "There is a storm."],
];

const quiz = [
  {
    prompt: "___ Montag habe ich einen Termin.",
    options: ["Im", "Am", "Um"],
    answer: "Am",
    explanation: "Use am with days: am Montag.",
  },
  {
    prompt: "___ August ist es oft warm.",
    options: ["Im", "Am", "Um"],
    answer: "Im",
    explanation: "Use im with months and seasons: im August, im Sommer.",
  },
  {
    prompt: "Der Kurs beginnt ___ 10 Uhr.",
    options: ["im", "am", "um"],
    answer: "um",
    explanation: "Use um with clock time: um 10 Uhr.",
  },
  {
    prompt: "Which weather sentence is correct?",
    options: ["Es ist regnet.", "Es regnet.", "Es Regen."],
    answer: "Es regnet.",
    explanation: "regnen is a verb: Es regnet. Use Es ist ... with adjectives such as kalt or warm.",
  },
  {
    prompt: "Ich kann nicht kommen, weil es stark ___.",
    options: ["regnet", "regnen", "Regen"],
    answer: "regnet",
    explanation: "After weil, the conjugated verb goes to the end: weil es stark regnet.",
  },
  {
    prompt: "Which sentence gives a clear weather reason?",
    options: [
      "Ich kann nicht kommen, weil das Wetter.",
      "Ich kann nicht kommen, weil es stark schneit.",
      "Ich kann nicht kommen, weil schneit es stark.",
    ],
    answer: "Ich kann nicht kommen, weil es stark schneit.",
    explanation: "The weil-clause is complete and the verb schneit is at the end.",
  },
];

const WeatherPerfektLetterPage = () => {
  const [answers, setAnswers] = useState({});
  const [showScore, setShowScore] = useState(false);
  const score = useMemo(
    () => quiz.reduce((total, question, index) => total + (answers[index] === question.answer ? 1 : 0), 0),
    [answers],
  );
  const allAnswered = Object.keys(answers).length === quiz.length;

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16, maxWidth: 1080 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <span style={{ borderRadius: 999, padding: "6px 10px", background: "#e0e7ff", color: "#3730a3", fontWeight: 800, fontSize: 12 }}>
          A1.2 · Day 21 · Chapter 13
        </span>
      </div>

      <header style={{ ...card, padding: "clamp(20px, 4vw, 34px)", background: "linear-gradient(135deg, #f8fafc, #eef2ff)" }}>
        <h1 style={{ ...styles.title, margin: 0 }}>Weather, Time Expressions and a Short Email</h1>
        <p style={{ margin: 0, lineHeight: 1.7, color: "#334155", maxWidth: 850 }}>
          Learn to describe the weather, use <strong>im/am/um</strong>, give a simple reason with <strong>weil</strong>, and use that language in a short A1 email. Perfekt is available below only as optional review.
        </p>
      </header>

      <Section eyebrow="Today's targets" title="By the end of this lesson, you should be able to">
        <ol style={{ margin: 0, paddingLeft: 22, display: "grid", gap: 8, lineHeight: 1.65 }}>
          <li>describe common weather conditions and seasons;</li>
          <li>use <strong>im</strong> with months/seasons, <strong>am</strong> with days and <strong>um</strong> with clock times;</li>
          <li>give a weather reason with <strong>weil</strong> and write a short informal message.</li>
        </ol>
      </Section>

      <Section eyebrow="Weather" title="Core phrases">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 10 }}>
          {weatherWords.map(([german, english]) => (
            <div key={german} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12 }}>
              <strong>{german}</strong>
              <div style={{ color: "#64748b", marginTop: 4 }}>{english}</div>
            </div>
          ))}
        </div>
        <div style={{ borderLeft: "4px solid #d97706", background: "#fffbeb", borderRadius: 10, padding: 12, lineHeight: 1.65 }}>
          <strong>Important:</strong> say <strong>Es regnet</strong> or <strong>Es schneit</strong>, but <strong>Es ist kalt/warm/windig</strong>. Do not say “Es ist regnet.”
        </div>
      </Section>

      <Section eyebrow="Speaking" title="Ask and answer about the weather">
        <div style={{ display: "grid", gap: 8, lineHeight: 1.65 }}>
          <div><strong>Wie ist das Wetter heute?</strong> – Es ist warm, aber es regnet.</div>
          <div><strong>Wie ist das Wetter in Accra?</strong> – Es ist heute sonnig und warm.</div>
          <div><strong>Regnet es?</strong> – Nein, die Sonne scheint.</div>
          <div><strong>Ist es kalt?</strong> – Ja, es ist sehr kalt.</div>
        </div>
      </Section>

      <Section eyebrow="Seasons and time" title="im, am and um">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 650 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {['Form', 'Use', 'Examples'].map((heading) => (
                  <th key={heading} style={{ border: "1px solid #e2e8f0", padding: 10, textAlign: "left" }}>{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["im", "months and seasons", "im August · im Sommer · im Winter"],
                ["am", "days and dates", "am Montag · am Wochenende · am 12. Mai"],
                ["um", "clock time", "um 8 Uhr · um 14:30 Uhr"],
              ].map((row) => (
                <tr key={row[0]}>{row.map((cell, index) => <td key={`${row[0]}-${index}`} style={{ border: "1px solid #e2e8f0", padding: 10 }}>{index === 0 ? <strong>{cell}</strong> : cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ margin: 0, lineHeight: 1.65 }}>
          Seasons: <strong>der Frühling</strong>, <strong>der Sommer</strong>, <strong>der Herbst</strong>, <strong>der Winter</strong>.
        </p>
      </Section>

      <Section eyebrow="Reason" title="Use weil to explain why">
        <div style={{ border: "1px solid #bfdbfe", background: "#eff6ff", borderRadius: 14, padding: 14, display: "grid", gap: 7 }}>
          <strong>Main sentence + , weil + subject + details + verb.</strong>
          <span>Ich bleibe zu Hause, <strong>weil es stark regnet</strong>.</span>
          <span>Ich kann nicht kommen, <strong>weil es morgen schneit</strong>.</span>
          <span>Ich nehme eine Jacke mit, <strong>weil es kalt ist</strong>.</span>
        </div>
      </Section>

      <Section eyebrow="Writing bridge" title="Use the weather in an informal email">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          For the tutor-marked task, you write to Bina and explain why you cannot attend her wedding. Keep the message simple: reason for writing → weather reason → suggestion.
        </p>
        <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 14, lineHeight: 1.75 }}>
          <strong>Liebe Bina,</strong><br /><br />
          ich schreibe dir, weil ich leider nicht zu deiner Hochzeit kommen kann. Es gibt morgen einen starken Sturm, deshalb kann ich nicht fahren. Vielleicht können wir uns nächste Woche treffen.<br /><br />
          <strong>Liebe Grüße<br />Anna</strong>
        </div>
        <div style={{ borderLeft: "4px solid #4f46e5", background: "#eef2ff", borderRadius: 10, padding: 12, lineHeight: 1.65 }}>
          The tutor-marked assignment <strong>A1-13</strong> is unchanged. This lesson only prepares you to understand and complete it more confidently.
        </div>
      </Section>

      <Section eyebrow="Guided practice" title="Check the core lesson">
        <div style={{ display: "grid", gap: 12 }}>
          {quiz.map((question, index) => {
            const selected = answers[index];
            const correct = selected === question.answer;
            return (
              <article key={question.prompt} style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 14, display: "grid", gap: 9 }}>
                <strong>{index + 1}. {question.prompt}</strong>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {question.options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setAnswers((old) => ({ ...old, [index]: option }));
                        setShowScore(false);
                      }}
                      style={selected === option ? styles.primaryButton : styles.secondaryButton}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {selected ? (
                  <div style={{ color: correct ? "#166534" : "#9f1239", lineHeight: 1.55 }}>
                    <strong>{correct ? "Correct." : `Correct answer: ${question.answer}.`}</strong> {question.explanation}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="button" disabled={!allAnswered} onClick={() => setShowScore(true)} style={{ ...styles.primaryButton, opacity: allAnswered ? 1 : 0.55 }}>
            Show my score
          </button>
          <button type="button" onClick={() => { setAnswers({}); setShowScore(false); }} style={styles.secondaryButton}>
            Restart practice
          </button>
        </div>
        {showScore ? (
          <div style={{ border: "1px solid #cbd5e1", background: "#f8fafc", borderRadius: 12, padding: 12 }}>
            <strong>{score}/{quiz.length} correct.</strong> {score >= 5 ? "You are ready for the Day 21 workbook." : "Review the weather, im/am/um and weil sections, then try again."}
          </div>
        ) : null}
      </Section>

      <Section eyebrow="Optional review" title="Perfekt: useful, but not the Day 21 core target">
        <details>
          <summary style={{ cursor: "pointer", fontWeight: 800 }}>Open the Perfekt refresher</summary>
          <div style={{ display: "grid", gap: 10, marginTop: 12, lineHeight: 1.65 }}>
            <p style={{ margin: 0 }}>
              Perfekt usually uses <strong>haben/sein + Partizip II</strong>. Most verbs use <strong>haben</strong>; common movement/change-of-place verbs such as <strong>gehen</strong>, <strong>kommen</strong> and <strong>fahren</strong> use <strong>sein</strong>.
            </p>
            <div><strong>Ich habe gelernt.</strong> · <strong>Er hat gegessen.</strong></div>
            <div><strong>Ich bin gegangen.</strong> · <strong>Wir sind gefahren.</strong></div>
            <p style={{ margin: 0, color: "#64748b" }}>
              Treat this as review. Master the weather email language above before spending time on Perfekt today.
            </p>
          </div>
        </details>
      </Section>
    </main>
  );
};

export default WeatherPerfektLetterPage;
