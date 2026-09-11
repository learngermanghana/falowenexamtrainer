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

const keinRows = [
  ["Masculine", "der Kaffee", "Ich trinke keinen Kaffee."],
  ["Feminine", "die Suppe", "Ich esse keine Suppe."],
  ["Neuter", "das Brot", "Ich esse kein Brot."],
  ["Plural", "die Eier", "Wir haben keine Eier."],
];

const foodWords = [
  ["das Brot", "bread"],
  ["der Reis", "rice"],
  ["die Suppe", "soup"],
  ["der Salat", "salad"],
  ["das Gemüse", "vegetables"],
  ["das Fleisch", "meat"],
  ["der Kaffee", "coffee"],
  ["der Tee", "tea"],
  ["das Wasser", "water"],
  ["das Restaurant", "restaurant"],
];

const quiz = [
  {
    prompt: "Kommst du heute? – ___, ich bin krank.",
    options: ["Kein", "Nicht", "Nein"],
    answer: "Nein",
    explanation: "Use nein as the direct answer to a yes/no question.",
  },
  {
    prompt: "Ich habe ___ Brot.",
    options: ["nicht", "kein", "nein"],
    answer: "kein",
    explanation: "Brot is a noun. Use kein with nouns that would otherwise take ein/eine or no article.",
  },
  {
    prompt: "Die Suppe ist ___ warm.",
    options: ["nicht", "keine", "nein"],
    answer: "nicht",
    explanation: "warm is an adjective, so use nicht.",
  },
  {
    prompt: "Wir essen ___ im Restaurant.",
    options: ["kein", "nicht", "nein"],
    answer: "nicht",
    explanation: "The restaurant phrase is being negated: nicht im Restaurant.",
  },
  {
    prompt: "Ich trinke ___ Kaffee.",
    options: ["keinen", "kein", "keine"],
    answer: "keinen",
    explanation: "der Kaffee is masculine and is the object here: keinen Kaffee.",
  },
  {
    prompt: "Sie kauft ___ Pizza.",
    options: ["keine", "keinen", "kein"],
    answer: "keine",
    explanation: "die Pizza is feminine: keine Pizza.",
  },
];

const A1Day16FoodAndNegationGrammarPage = () => {
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
          A1.2 · Day 16 · Chapters 9–10
        </span>
      </div>

      <header style={{ ...card, padding: "clamp(20px, 4vw, 34px)", background: "linear-gradient(135deg, #f8fafc, #eef2ff)" }}>
        <h1 style={{ ...styles.title, margin: 0 }}>Food and Negation: nein, nicht and kein</h1>
        <p style={{ margin: 0, lineHeight: 1.7, color: "#334155", maxWidth: 850 }}>
          Learn how to talk about food and say what you do not want, do not eat, do not have or do not like. Keep today’s grammar focused on three words: <strong>nein</strong>, <strong>nicht</strong> and <strong>kein</strong>.
        </p>
      </header>

      <Section eyebrow="Today's targets" title="By the end of this lesson, you should be able to">
        <ol style={{ margin: 0, paddingLeft: 22, display: "grid", gap: 8, lineHeight: 1.65 }}>
          <li>use <strong>nein</strong> as an answer to a yes/no question;</li>
          <li>use <strong>nicht</strong> to negate verbs, adjectives and parts of a sentence;</li>
          <li>use the correct form of <strong>kein</strong> with common food nouns.</li>
        </ol>
      </Section>

      <Section eyebrow="Core rule" title="Choose the negation word">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 14 }}>
            <strong style={{ fontSize: 20 }}>nein</strong>
            <p style={{ margin: "6px 0 0", lineHeight: 1.6 }}>A direct answer: <strong>Kommst du? – Nein.</strong></p>
          </div>
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 14 }}>
            <strong style={{ fontSize: 20 }}>nicht</strong>
            <p style={{ margin: "6px 0 0", lineHeight: 1.6 }}>“not”: <strong>Die Suppe ist nicht warm.</strong></p>
          </div>
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 14 }}>
            <strong style={{ fontSize: 20 }}>kein</strong>
            <p style={{ margin: "6px 0 0", lineHeight: 1.6 }}>“no / not any” with a noun: <strong>Ich habe kein Brot.</strong></p>
          </div>
        </div>
      </Section>

      <Section eyebrow="Food vocabulary" title="Learn the noun with its article">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 10 }}>
          {foodWords.map(([german, english]) => (
            <div key={german} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12 }}>
              <strong>{german}</strong>
              <div style={{ color: "#64748b", marginTop: 4 }}>{english}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="kein forms" title="The forms you need most today">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 650 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {['Type', 'Noun', 'Negative example'].map((heading) => (
                  <th key={heading} style={{ border: "1px solid #e2e8f0", padding: 10, textAlign: "left" }}>{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {keinRows.map((row) => (
                <tr key={row[0]}>{row.map((cell, index) => <td key={`${row[0]}-${index}`} style={{ border: "1px solid #e2e8f0", padding: 10 }}>{index === 2 ? <strong>{cell}</strong> : cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ margin: 0, lineHeight: 1.65 }}>
          The important masculine object form is <strong>keinen</strong>: Ich möchte <strong>keinen Kaffee</strong>. Feminine and plural normally use <strong>keine</strong>; neuter uses <strong>kein</strong>.
        </p>
      </Section>

      <Section eyebrow="nicht placement" title="Put nicht close to what you are negating">
        <div style={{ display: "grid", gap: 8, lineHeight: 1.65 }}>
          <div><strong>Verb / whole action:</strong> Ich koche heute <strong>nicht</strong>.</div>
          <div><strong>Adjective:</strong> Die Suppe ist <strong>nicht warm</strong>.</div>
          <div><strong>Adverb:</strong> Ich esse <strong>nicht oft</strong> im Restaurant.</div>
          <div><strong>Place phrase:</strong> Wir essen <strong>nicht im Restaurant</strong>, sondern zu Hause.</div>
          <div><strong>Possessive noun phrase:</strong> Das ist <strong>nicht mein Teller</strong>.</div>
        </div>
      </Section>

      <Section eyebrow="Common mistakes" title="Avoid these four patterns">
        <div style={{ display: "grid", gap: 9 }}>
          {[
            ["Ich habe nicht Brot.", "Ich habe kein Brot."],
            ["Die Suppe ist keine warm.", "Die Suppe ist nicht warm."],
            ["Ich trinke kein Kaffee.", "Ich trinke keinen Kaffee."],
            ["Kein, ich komme nicht.", "Nein, ich komme nicht."],
          ].map(([wrong, correct]) => (
            <div key={wrong} style={{ border: "1px solid #fecdd3", background: "#fff1f2", borderRadius: 12, padding: 12 }}>
              <span style={{ color: "#9f1239" }}>{wrong}</span> → <strong style={{ color: "#166534" }}>{correct}</strong>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Guided practice" title="Choose the correct form">
        <div style={{ display: "grid", gap: 12 }}>
          {quiz.map((question, index) => {
            const selected = answers[index];
            const correct = selected === question.answer;
            return (
              <article key={question.prompt} style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 14, display: "grid", gap: 9 }}>
                <strong>{index + 1}. {question.prompt}</strong>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
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
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <button type="button" disabled={!allAnswered} onClick={() => setShowScore(true)} style={{ ...styles.primaryButton, opacity: allAnswered ? 1 : 0.55 }}>
            Show my score
          </button>
          <button type="button" onClick={() => { setAnswers({}); setShowScore(false); }} style={styles.secondaryButton}>
            Restart practice
          </button>
        </div>
        {showScore ? (
          <div style={{ border: "1px solid #cbd5e1", background: "#f8fafc", borderRadius: 12, padding: 12 }}>
            <strong>{score}/{quiz.length} correct.</strong> {score >= 5 ? "You are ready to apply the grammar in the workbook." : "Review nein, nicht and kein, then try again."}
          </div>
        ) : null}
      </Section>

      <Section eyebrow="Workbook language preview" title="Some reading forms are recognition-only today">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          The existing Day 16 tutor-marked workbooks also recycle language from other A1 lessons and may contain forms such as <strong>weil</strong>, a past-time phrase like <strong>letzten Samstag</strong>, or a comparison such as <strong>frischer als</strong>. You do not need to make adjective comparison a new grammar target here; use the context to understand the text and focus your own production on food and negation.
        </p>
        <div style={{ borderLeft: "4px solid #4f46e5", background: "#eef2ff", borderRadius: 10, padding: 12, lineHeight: 1.65 }}>
          <strong>Tutor-marked assignments A1-9 and A1-10 are unchanged.</strong> Their questions, answer mapping and submission behaviour remain exactly as before.
        </div>
      </Section>

      <Section eyebrow="Self-practice" title="Write five short food sentences">
        <p style={{ margin: 0, lineHeight: 1.65 }}>Write one sentence for each pattern:</p>
        <ol style={{ margin: 0, paddingLeft: 22, display: "grid", gap: 7, lineHeight: 1.6 }}>
          <li>Nein, ich ...</li>
          <li>Ich habe kein ...</li>
          <li>Ich möchte keinen ...</li>
          <li>Ich esse heute nicht ...</li>
          <li>... ist nicht ...</li>
        </ol>
      </Section>
    </main>
  );
};

export default A1Day16FoodAndNegationGrammarPage;
