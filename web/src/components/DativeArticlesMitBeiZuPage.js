import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import AppBackButton from "./navigation/AppBackButton";
import A1Day18Kapitel122WorkbookPage from "./A1Day18Kapitel122WorkbookPage";
import { styles } from "../styles";

const card = {
  ...styles.card,
  display: "grid",
  gap: 12,
  border: "1px solid #e2e8f0",
  borderRadius: 18,
};

const Section = ({ title, eyebrow, children }) => (
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

const articleRows = [
  ["Masculine", "der / ein", "dem / einem", "mit dem Bus"],
  ["Feminine", "die / eine", "der / einer", "bei der Bank"],
  ["Neuter", "das / ein", "dem / einem", "mit dem Auto"],
  ["Plural", "die", "den (+n)", "zu den Freunden"],
];

const prepositions = [
  {
    word: "mit",
    meaning: "with / by",
    rule: "Use mit for transport, tools, or people who accompany you.",
    examples: ["Ich fahre mit dem Zug.", "Ich komme mit dem Auto.", "Ich lerne mit meiner Freundin."],
  },
  {
    word: "bei",
    meaning: "at / with / near",
    rule: "Use bei for a person, workplace, institution, or location where you are.",
    examples: ["Ich bin beim Arzt.", "Sie arbeitet bei der Bank.", "Wir sind bei unseren Freunden."],
  },
  {
    word: "zu",
    meaning: "to",
    rule: "Use zu for movement to a person, institution, appointment, or many everyday destinations.",
    examples: ["Ich gehe zum Arzt.", "Sie fährt zur Arbeit.", "Wir gehen zu den Freunden."],
  },
];

const workbookContext = [
  ["doctor / appointment", "Ich bin beim Arzt. / Ich gehe zum Arzt."],
  ["train / travel", "Ich fahre mit dem Zug."],
  ["office / work", "Ich bin bei der Arbeit. / Ich fahre zur Arbeit."],
  ["people", "Ich bin bei meinen Freunden. / Ich gehe zu meinen Freunden."],
];

const quiz = [
  {
    prompt: "Ich fahre mit ___ Bus.",
    options: ["der", "dem", "den"],
    answer: "dem",
    explanation: "mit always takes Dativ. der Bus → dem Bus.",
  },
  {
    prompt: "Sara ist bei ___ Bank.",
    options: ["die", "der", "dem"],
    answer: "der",
    explanation: "bei always takes Dativ. die Bank → der Bank.",
  },
  {
    prompt: "Wir gehen zu ___ Freunden.",
    options: ["die", "den", "dem"],
    answer: "den",
    explanation: "zu always takes Dativ. Plural uses den, and Freunde already ends in -n.",
  },
  {
    prompt: "Ich komme mit ___ Auto.",
    options: ["das", "dem", "der"],
    answer: "dem",
    explanation: "das Auto → dem Auto in Dativ.",
  },
  {
    prompt: "Which short form is correct?",
    options: ["bei dem → beim", "bei der → beim", "zu dem → zur"],
    answer: "bei dem → beim",
    explanation: "bei dem becomes beim. zu dem becomes zum; zu der becomes zur.",
  },
  {
    prompt: "Which sentence is correct?",
    options: ["Ich gehe zu die Schule.", "Ich gehe zur Schule.", "Ich gehe zum Schule."],
    answer: "Ich gehe zur Schule.",
    explanation: "die Schule → zu der Schule → zur Schule.",
  },
];

export const DativeArticlesMitBeiZuGrammarNotes = () => {
  const location = useLocation();
  const [answers, setAnswers] = useState({});
  const [showScore, setShowScore] = useState(false);
  const workbookHref = `${location.pathname}?view=workbook`;

  const score = useMemo(
    () => quiz.reduce((total, question, index) => total + (answers[index] === question.answer ? 1 : 0), 0),
    [answers],
  );
  const allAnswered = Object.keys(answers).length === quiz.length;

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16, maxWidth: 1080 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <a href={workbookHref} style={{ ...styles.primaryButton, width: "fit-content", textDecoration: "none" }}>
          Open Chapter 12.2 workbook
        </a>
      </div>

      <header style={{ ...card, padding: "clamp(20px, 4vw, 34px)", background: "linear-gradient(135deg, #f8fafc, #eef2ff)" }}>
        <span style={{ width: "fit-content", borderRadius: 999, padding: "6px 10px", background: "#e0e7ff", color: "#3730a3", fontSize: 12, fontWeight: 800 }}>
          A1.2 · Day 18 · Chapter 12.2
        </span>
        <h1 style={{ ...styles.title, margin: 0 }}>Dative with mit, bei and zu</h1>
        <p style={{ margin: 0, lineHeight: 1.7, color: "#334155", maxWidth: 820 }}>
          Unlike the two-case prepositions from Chapter 12.1, <strong>mit</strong>, <strong>bei</strong> and <strong>zu</strong> are simpler: they always take Dativ. Your job is to choose the right preposition and change the article correctly.
        </p>
      </header>

      <Section eyebrow="Connect to Chapter 12.1" title="The important difference">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 12 }}>
          <div style={{ border: "1px solid #cbd5e1", borderRadius: 14, padding: 14 }}>
            <strong>Chapter 12.1</strong>
            <p style={{ margin: "6px 0 0", lineHeight: 1.6 }}>Wechselpräpositionen can use Akkusativ or Dativ depending on meaning.</p>
          </div>
          <div style={{ border: "1px solid #c7d2fe", background: "#eef2ff", borderRadius: 14, padding: 14 }}>
            <strong>Chapter 12.2</strong>
            <p style={{ margin: "6px 0 0", lineHeight: 1.6 }}><strong>mit + Dativ</strong>, <strong>bei + Dativ</strong>, <strong>zu + Dativ</strong>. No case decision is needed.</p>
          </div>
        </div>
      </Section>

      <Section eyebrow="Today's targets" title="By the end of this lesson, you should be able to">
        <ol style={{ margin: 0, paddingLeft: 22, display: "grid", gap: 8, lineHeight: 1.65 }}>
          <li>change der/die/das/plural articles into the correct dative form;</li>
          <li>use <strong>mit</strong>, <strong>bei</strong> and <strong>zu</strong> in everyday situations;</li>
          <li>use the common short forms <strong>beim</strong>, <strong>zum</strong> and <strong>zur</strong>.</li>
        </ol>
      </Section>

      <Section eyebrow="Core grammar" title="Dative article changes">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 650 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Gender", "Nominative", "Dative", "Example"].map((heading) => (
                  <th key={heading} style={{ border: "1px solid #e2e8f0", padding: 10, textAlign: "left" }}>{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {articleRows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, index) => (
                    <td key={`${row[0]}-${cell}`} style={{ border: "1px solid #e2e8f0", padding: 10 }}>
                      {index === 2 ? <strong>{cell}</strong> : cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ borderLeft: "4px solid #d97706", background: "#fffbeb", borderRadius: 10, padding: 12, lineHeight: 1.65 }}>
          <strong>Dative plural:</strong> use <strong>den</strong> and usually add <strong>-n</strong> to the noun: die Kinder → mit den Kindern. If the plural already ends in -n or -s, do not add another -n.
        </div>
      </Section>

      <Section eyebrow="Meaning and use" title="Choose the right preposition">
        <div style={{ display: "grid", gap: 12 }}>
          {prepositions.map((item) => (
            <article key={item.word} style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 14, display: "grid", gap: 8 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "baseline", flexWrap: "wrap" }}>
                <strong style={{ fontSize: 22 }}>{item.word}</strong>
                <span style={{ color: "#475569" }}>{item.meaning}</span>
              </div>
              <p style={{ margin: 0, lineHeight: 1.6 }}>{item.rule}</p>
              <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 5 }}>
                {item.examples.map((example) => <li key={example}>{example}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      <Section eyebrow="Sound natural" title="Common short forms">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
          {[
            ["bei dem", "beim", "Ich bin beim Arzt."],
            ["zu dem", "zum", "Ich gehe zum Bahnhof."],
            ["zu der", "zur", "Ich fahre zur Arbeit."],
          ].map(([full, short, example]) => (
            <div key={short} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12 }}>
              <div><span style={{ color: "#64748b" }}>{full}</span> → <strong>{short}</strong></div>
              <p style={{ margin: "6px 0 0" }}>{example}</p>
            </div>
          ))}
        </div>
        <p style={{ margin: 0, color: "#475569" }}><strong>mit</strong> has no similar contraction: mit dem Bus, mit der Bahn, mit den Freunden.</p>
      </Section>

      <Section eyebrow="Workbook bridge" title="Practise the grammar in the same situations you will read about">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          The fixed tutor-marked workbook includes doctor, train, office and everyday-life situations. Before you open it, connect those situations to today’s grammar:
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 620 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={{ border: "1px solid #e2e8f0", padding: 10, textAlign: "left" }}>Situation</th>
                <th style={{ border: "1px solid #e2e8f0", padding: 10, textAlign: "left" }}>Useful model sentence</th>
              </tr>
            </thead>
            <tbody>
              {workbookContext.map(([situation, example]) => (
                <tr key={situation}>
                  <td style={{ border: "1px solid #e2e8f0", padding: 10 }}>{situation}</td>
                  <td style={{ border: "1px solid #e2e8f0", padding: 10 }}><strong>{example}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section eyebrow="Avoid these" title="Common A1 mistakes">
        <div style={{ display: "grid", gap: 10 }}>
          {[
            ["mit der Bus", "mit dem Bus", "der Bus → dem Bus"],
            ["bei die Bank", "bei der Bank", "die Bank → der Bank"],
            ["zu die Schule", "zur Schule", "zu der Schule → zur Schule"],
            ["mit den Kind", "mit den Kindern", "Dative plural normally adds -n"],
          ].map(([wrong, correct, reason]) => (
            <div key={wrong} style={{ border: "1px solid #fecdd3", background: "#fff1f2", borderRadius: 12, padding: 12, display: "grid", gap: 4 }}>
              <div><span style={{ color: "#9f1239", fontWeight: 700 }}>{wrong}</span> → <strong style={{ color: "#166534" }}>{correct}</strong></div>
              <span style={{ color: "#64748b", fontSize: 14 }}>{reason}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Guided practice" title="Check your understanding">
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
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <button type="button" disabled={!allAnswered} onClick={() => setShowScore(true)} style={{ ...styles.primaryButton, opacity: allAnswered ? 1 : 0.55 }}>
            Show my score
          </button>
          <button type="button" onClick={() => { setAnswers({}); setShowScore(false); }} style={styles.secondaryButton}>
            Restart practice
          </button>
        </div>
        {showScore ? (
          <div style={{ border: "1px solid #cbd5e1", background: "#f8fafc", borderRadius: 12, padding: 12 }}>
            <strong>{score}/{quiz.length} correct.</strong> {score >= 5 ? "You are ready for the workbook." : "Review the article table and short forms, then try again."}
          </div>
        ) : null}
      </Section>

      <Section eyebrow="Prepare for the tutor-marked work" title="What the workbook will test">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          The workbook is already connected to Falowen Admin and also checks reading, listening and earlier A1 knowledge. The grammar notes above prepare you for the new Chapter 12.2 language, while the workbook deliberately revises older skills too.
        </p>
        <div style={{ borderLeft: "4px solid #4f46e5", background: "#eef2ff", padding: 12, borderRadius: 10, lineHeight: 1.65 }}>
          <strong>Important:</strong> the tutor-marked assignment and its saved answer mapping have not been changed.
        </div>
      </Section>

      <section style={{ ...card, background: "#172554", color: "#fff" }}>
        <h2 style={{ margin: 0 }}>Ready for Chapter 12.2?</h2>
        <p style={{ margin: 0, color: "#dbeafe", lineHeight: 1.65 }}>
          Before continuing, say these three patterns aloud: <strong>mit + Dativ</strong>, <strong>bei + Dativ</strong>, <strong>zu + Dativ</strong>. Then form one sentence with each.
        </p>
        <a href={workbookHref} style={{ ...styles.primaryButton, width: "fit-content", textDecoration: "none", background: "#fff", color: "#172554", borderColor: "#fff" }}>
          Continue to the tutor-marked workbook
        </a>
      </section>
    </main>
  );
};

const DativeArticlesMitBeiZuPage = () => {
  const location = useLocation();
  const query = useMemo(() => new URLSearchParams(location.search || ""), [location.search]);
  const isWorkbook = query.get("view") === "workbook";

  if (isWorkbook) {
    return <A1Day18Kapitel122WorkbookPage />;
  }

  return <DativeArticlesMitBeiZuGrammarNotes />;
};

export default DativeArticlesMitBeiZuPage;
