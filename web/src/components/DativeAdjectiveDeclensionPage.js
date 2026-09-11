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

const dativeVerbs = [
  ["helfen", "to help", "Ich helfe meinem Bruder."],
  ["danken", "to thank", "Wir danken der Lehrerin."],
  ["gratulieren", "to congratulate", "Er gratuliert seiner Freundin."],
  ["antworten", "to answer", "Bitte antworten Sie mir."],
  ["gefallen", "to please / be liked by", "Das Buch gefällt mir."],
];

const accusativeVerbs = [
  ["haben", "to have", "Ich habe einen Termin."],
  ["brauchen", "to need", "Sie braucht einen Stift."],
  ["sehen", "to see", "Wir sehen den Mann."],
  ["kaufen", "to buy", "Er kauft einen Stuhl."],
  ["fragen", "to ask", "Ich frage den Lehrer."],
  ["lieben", "to love", "Sie liebt die Stadt."],
];

const pronounRows = [
  ["ich", "mich", "mir"],
  ["du", "dich", "dir"],
  ["er", "ihn", "ihm"],
  ["sie", "sie", "ihr"],
  ["es", "es", "ihm"],
  ["wir", "uns", "uns"],
  ["ihr", "euch", "euch"],
  ["sie / Sie", "sie / Sie", "ihnen / Ihnen"],
];

const quiz = [
  {
    prompt: "Ich helfe ___. (du)",
    options: ["dich", "dir", "du"],
    answer: "dir",
    explanation: "helfen takes Dativ: du → dir.",
  },
  {
    prompt: "Wir sehen ___ Mann.",
    options: ["dem", "den", "der"],
    answer: "den",
    explanation: "sehen takes Akkusativ: der Mann → den Mann.",
  },
  {
    prompt: "Er gratuliert ___ Frau.",
    options: ["die", "der", "den"],
    answer: "der",
    explanation: "gratulieren takes Dativ: die Frau → der Frau.",
  },
  {
    prompt: "Sie braucht ___ Termin.",
    options: ["ein", "einen", "einem"],
    answer: "einen",
    explanation: "brauchen takes Akkusativ: ein Termin → einen Termin.",
  },
  {
    prompt: "Bitte antworten Sie ___. (ich)",
    options: ["mich", "mir", "ich"],
    answer: "mir",
    explanation: "antworten takes Dativ: ich → mir.",
  },
  {
    prompt: "Ich frage ___ Lehrer.",
    options: ["dem", "den", "der"],
    answer: "den",
    explanation: "fragen takes Akkusativ: der Lehrer → den Lehrer.",
  },
  {
    prompt: "Ich sende ___ die Adresse. (Sie, formal)",
    options: ["Sie", "Ihnen", "ihnen"],
    answer: "Ihnen",
    explanation: "The receiver is dative: Ich sende Ihnen die Adresse.",
  },
  {
    prompt: "Das Essen gefällt ___. (wir)",
    options: ["uns", "wir", "euch"],
    answer: "uns",
    explanation: "gefallen takes Dativ. With wir, the dative pronoun is uns.",
  },
];

const DativeAdjectiveDeclensionPage = () => {
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
          A1.2 · Day 23 · Chapter 14.2
        </span>
      </div>

      <header style={{ ...card, padding: "clamp(20px, 4vw, 34px)", background: "linear-gradient(135deg, #f8fafc, #eef2ff)" }}>
        <h1 style={{ ...styles.title, margin: 0 }}>Dative and Accusative Verbs</h1>
        <p style={{ margin: 0, lineHeight: 1.7, color: "#334155", maxWidth: 850 }}>
          Some German verbs normally take an accusative object; others normally take a dative object. Today the goal is to recognise a small group of useful verbs and choose the correct article or pronoun after them.
        </p>
      </header>

      <Section eyebrow="Build on earlier A1" title="What you already know">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          You have already used Akkusativ with everyday verbs such as <strong>haben</strong>, <strong>brauchen</strong> and <strong>kaufen</strong>, and you met Dativ in Day 18 after <strong>mit</strong>, <strong>bei</strong> and <strong>zu</strong>. Now the verb itself can decide the case.
        </p>
      </Section>

      <Section eyebrow="Today's targets" title="By the end of this lesson, you should be able to">
        <ol style={{ margin: 0, paddingLeft: 22, display: "grid", gap: 8, lineHeight: 1.65 }}>
          <li>recognise common verbs that take Dativ or Akkusativ;</li>
          <li>choose the correct article after those verbs;</li>
          <li>use common object pronouns such as <strong>mich/mir</strong>, <strong>dich/dir</strong> and <strong>Sie/Ihnen</strong>.</li>
        </ol>
      </Section>

      <Section eyebrow="Core rule" title="Do not ask Wo? or Wohin? here">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Day 18 used place questions to choose a case. Day 23 is different. With these verbs, learn the verb together with its object case: <strong>jemandem helfen</strong> (Dativ), but <strong>jemanden fragen</strong> (Akkusativ).
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 12 }}>
          <div style={{ border: "1px solid #bbf7d0", background: "#f0fdf4", borderRadius: 14, padding: 14 }}>
            <strong>Dativ: Wem?</strong>
            <p style={{ margin: "6px 0 0" }}>Ich helfe <strong>dem Mann</strong>. Wem helfe ich? Dem Mann.</p>
          </div>
          <div style={{ border: "1px solid #bfdbfe", background: "#eff6ff", borderRadius: 14, padding: 14 }}>
            <strong>Akkusativ: Wen oder was?</strong>
            <p style={{ margin: "6px 0 0" }}>Ich sehe <strong>den Mann</strong>. Wen sehe ich? Den Mann.</p>
          </div>
        </div>
      </Section>

      <Section eyebrow="Learn these first" title="Common dative verbs">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 650 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {['Verb', 'Meaning', 'Model sentence'].map((heading) => (
                  <th key={heading} style={{ border: "1px solid #e2e8f0", padding: 10, textAlign: "left" }}>{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dativeVerbs.map((row) => (
                <tr key={row[0]}>{row.map((cell, index) => <td key={`${row[0]}-${index}`} style={{ border: "1px solid #e2e8f0", padding: 10 }}>{index === 0 ? <strong>{cell}</strong> : cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section eyebrow="Compare" title="Common accusative verbs">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 650 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {['Verb', 'Meaning', 'Model sentence'].map((heading) => (
                  <th key={heading} style={{ border: "1px solid #e2e8f0", padding: 10, textAlign: "left" }}>{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {accusativeVerbs.map((row) => (
                <tr key={row[0]}>{row.map((cell, index) => <td key={`${row[0]}-${index}`} style={{ border: "1px solid #e2e8f0", padding: 10 }}>{index === 0 ? <strong>{cell}</strong> : cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section eyebrow="Pronouns" title="Akkusativ and Dativ side by side">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {['Subject', 'Akkusativ', 'Dativ'].map((heading) => (
                  <th key={heading} style={{ border: "1px solid #e2e8f0", padding: 10, textAlign: "left" }}>{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pronounRows.map((row) => (
                <tr key={row[0]}>{row.map((cell, index) => <td key={`${row[0]}-${index}`} style={{ border: "1px solid #e2e8f0", padding: 10 }}>{index ? <strong>{cell}</strong> : cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ margin: 0, lineHeight: 1.65 }}>
          Two useful pairs to memorise: <strong>Kannst du mich sehen?</strong> (Akkusativ) and <strong>Kannst du mir helfen?</strong> (Dativ).
        </p>
      </Section>

      <Section eyebrow="Real-life German" title="When a sentence has two objects">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Some verbs can have a receiver and a thing. The receiver is often Dativ and the thing is Akkusativ.
        </p>
        <div style={{ borderLeft: "4px solid #4f46e5", background: "#eef2ff", borderRadius: 10, padding: 12, display: "grid", gap: 6 }}>
          <div>Ich sende <strong>Ihnen</strong> <strong>die Adresse</strong>.</div>
          <div>Ich gebe <strong>meiner Freundin</strong> <strong>das Buch</strong>.</div>
          <div>Der Lehrer zeigt <strong>uns</strong> <strong>die Aufgabe</strong>.</div>
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
            <strong>{score}/{quiz.length} correct.</strong> {score >= 7 ? "Strong work. You can move to the final A1.2 revision." : "Review the verb lists and pronoun table, then try again."}
          </div>
        ) : null}
      </Section>

      <Section eyebrow="Optional extra" title="Adjective endings are not the main goal today">
        <details>
          <summary style={{ cursor: "pointer", fontWeight: 800 }}>Open optional adjective reminder</summary>
          <div style={{ display: "grid", gap: 8, marginTop: 12, lineHeight: 1.65 }}>
            <p style={{ margin: 0 }}>
              If you already feel comfortable with the cases, you can notice adjective endings too: <strong>ein großer Hund</strong>, <strong>einen großen Hund</strong>, <strong>mit einem großen Hund</strong>.
            </p>
            <p style={{ margin: 0 }}>
              You do not need to master the full adjective-declension system to complete the core Day 23 objective. First make the case choice correctly.
            </p>
          </div>
        </details>
      </Section>

      <Section eyebrow="Self-check" title="Can you explain these three contrasts?">
        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 8, lineHeight: 1.65 }}>
          <li>Ich sehe <strong>den Mann</strong>. / Ich helfe <strong>dem Mann</strong>.</li>
          <li>Kannst du <strong>mich</strong> sehen? / Kannst du <strong>mir</strong> helfen?</li>
          <li>Ich frage <strong>den Lehrer</strong>. / Ich antworte <strong>dem Lehrer</strong>.</li>
        </ul>
      </Section>
    </main>
  );
};

export default DativeAdjectiveDeclensionPage;
