import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import AppBackButton from "./navigation/AppBackButton";
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
        <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", color: "#475569" }}>
          {eyebrow}
        </span>
      ) : null}
      <h2 style={{ margin: 0 }}>{title}</h2>
    </div>
    {children}
  </section>
);

const pairRows = [
  {
    preposition: "in",
    wohin: "Ich gehe in die Schule.",
    wo: "Ich bin in der Schule.",
    note: "die Schule → Akkusativ: die / Dativ: der",
  },
  {
    preposition: "auf",
    wohin: "Ich lege das Buch auf den Tisch.",
    wo: "Das Buch liegt auf dem Tisch.",
    note: "der Tisch → Akkusativ: den / Dativ: dem",
  },
  {
    preposition: "an",
    wohin: "Ich hänge das Bild an die Wand.",
    wo: "Das Bild hängt an der Wand.",
    note: "die Wand → Akkusativ: die / Dativ: der",
  },
  {
    preposition: "unter",
    wohin: "Der Hund läuft unter den Tisch.",
    wo: "Der Hund liegt unter dem Tisch.",
    note: "der Tisch → Akkusativ: den / Dativ: dem",
  },
  {
    preposition: "zwischen",
    wohin: "Ich stelle den Stuhl zwischen die Tische.",
    wo: "Der Stuhl steht zwischen den Tischen.",
    note: "Plural: Akkusativ die / Dativ den (+n when needed)",
  },
];

const quiz = [
  {
    prompt: "Ich gehe in ___ Park.",
    options: ["den", "dem", "der"],
    answer: "den",
    explanation: "Wohin? There is movement to a destination, so use Akkusativ: der Park → den Park.",
  },
  {
    prompt: "Ich bin in ___ Park.",
    options: ["den", "dem", "der"],
    answer: "dem",
    explanation: "Wo? This is a location, so use Dativ: der Park → dem Park.",
  },
  {
    prompt: "Sie hängt das Bild an ___ Wand.",
    options: ["die", "der", "dem"],
    answer: "die",
    explanation: "Wohin? The picture is being moved onto the wall: die Wand stays die in Akkusativ.",
  },
  {
    prompt: "Das Bild hängt an ___ Wand.",
    options: ["die", "der", "dem"],
    answer: "der",
    explanation: "Wo? The picture is already there: die Wand → der Wand in Dativ.",
  },
  {
    prompt: "Wir setzen uns neben ___ Lehrer.",
    options: ["den", "dem", "der"],
    answer: "den",
    explanation: "Wohin? setzen shows a change of position: der Lehrer → den Lehrer.",
  },
  {
    prompt: "Wir sitzen neben ___ Lehrer.",
    options: ["den", "dem", "der"],
    answer: "dem",
    explanation: "Wo? sitzen describes position: der Lehrer → dem Lehrer.",
  },
];

const articles = [
  ["Akkusativ", "den", "die", "das", "die"],
  ["Dativ", "dem", "der", "dem", "den (+n)"],
];

const TwoCasePrepositionsPageLegacy = () => {
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
          Open Chapter 12.1 workbook
        </a>
      </div>

      <header style={{ ...card, padding: "clamp(20px, 4vw, 34px)", background: "linear-gradient(135deg, #f8fafc, #eef2ff)" }}>
        <span style={{ width: "fit-content", borderRadius: 999, padding: "6px 10px", background: "#e0e7ff", color: "#3730a3", fontWeight: 800, fontSize: 12 }}>
          A1.2 · Day 18 · Chapter 12.1
        </span>
        <h1 style={{ ...styles.title, margin: 0 }}>Wechselpräpositionen: Wo? or Wohin?</h1>
        <p style={{ margin: 0, lineHeight: 1.7, color: "#334155", maxWidth: 820 }}>
          The same preposition can use either Akkusativ or Dativ. The key is not memorising two random forms: first decide whether the sentence describes a destination or a position.
        </p>
      </header>

      <Section eyebrow="Connect to what you know" title="Before you start">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          You already know places, articles and direction language from earlier A1 lessons. Today you combine those skills. Ask one question first:
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
          <div style={{ border: "1px solid #bfdbfe", background: "#eff6ff", borderRadius: 14, padding: 14 }}>
            <strong>Wohin? → Akkusativ</strong>
            <p style={{ margin: "6px 0 0", lineHeight: 1.6 }}>A person or object moves to a destination or changes position.</p>
          </div>
          <div style={{ border: "1px solid #bbf7d0", background: "#f0fdf4", borderRadius: 14, padding: 14 }}>
            <strong>Wo? → Dativ</strong>
            <p style={{ margin: "6px 0 0", lineHeight: 1.6 }}>A person or object is already in a place. There is no change of position.</p>
          </div>
        </div>
      </Section>

      <Section eyebrow="Today's targets" title="By the end of this lesson, you should be able to">
        <ol style={{ margin: 0, paddingLeft: 22, display: "grid", gap: 8, lineHeight: 1.65 }}>
          <li>recognise the nine common two-case prepositions;</li>
          <li>choose Akkusativ after <strong>Wohin?</strong> and Dativ after <strong>Wo?</strong>;</li>
          <li>use common movement/position verb pairs such as <strong>legen/liegen</strong>, <strong>stellen/stehen</strong> and <strong>setzen/sitzen</strong>.</li>
        </ol>
      </Section>

      <Section eyebrow="Core vocabulary" title="The nine Wechselpräpositionen">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 10 }}>
          {[
            ["an", "at / on a side or edge"],
            ["auf", "on top of"],
            ["hinter", "behind"],
            ["in", "in / into"],
            ["neben", "next to"],
            ["über", "above / over"],
            ["unter", "under"],
            ["vor", "in front of"],
            ["zwischen", "between"],
          ].map(([word, meaning]) => (
            <div key={word} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12, background: "#fff" }}>
              <strong style={{ fontSize: 19 }}>{word}</strong>
              <div style={{ marginTop: 4, color: "#64748b" }}>{meaning}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Main rule" title="Movement is not enough — think destination vs position">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          A sentence can contain a verb of movement and still answer <strong>Wo?</strong>. What matters is whether the prepositional phrase gives a destination. For A1, the clearest shortcut is to compare these common verb pairs:
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 620 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {[
                  "Wohin? + Akkusativ",
                  "Meaning",
                  "Wo? + Dativ",
                  "Meaning",
                ].map((heading) => (
                  <th key={heading} style={{ border: "1px solid #e2e8f0", textAlign: "left", padding: 10 }}>{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["legen", "put something down", "liegen", "be lying"],
                ["stellen", "put/place upright", "stehen", "be standing"],
                ["setzen", "put/seat", "sitzen", "be sitting"],
                ["hängen", "hang something up", "hängen", "be hanging"],
              ].map((row) => (
                <tr key={row.join("-")}>
                  {row.map((cell) => <td key={cell} style={{ border: "1px solid #e2e8f0", padding: 10 }}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section eyebrow="Article check" title="The article forms you need today">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Case", "der", "die", "das", "Plural"].map((heading) => (
                  <th key={heading} style={{ border: "1px solid #e2e8f0", padding: 10, textAlign: "left" }}>{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {articles.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell) => <td key={cell} style={{ border: "1px solid #e2e8f0", padding: 10 }}><strong>{cell}</strong></td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.65 }}>
          Useful short forms: <strong>im = in dem</strong>, <strong>ins = in das</strong>, <strong>am = an dem</strong>, <strong>ans = an das</strong>.
        </p>
      </Section>

      <Section eyebrow="Model sentences" title="See the same preposition in both cases">
        <div style={{ display: "grid", gap: 12 }}>
          {pairRows.map((pair) => (
            <article key={pair.preposition} style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 14, display: "grid", gap: 6 }}>
              <strong style={{ fontSize: 18 }}>{pair.preposition}</strong>
              <div><strong>Wohin?</strong> {pair.wohin}</div>
              <div><strong>Wo?</strong> {pair.wo}</div>
              <span style={{ color: "#64748b", fontSize: 14 }}>{pair.note}</span>
            </article>
          ))}
        </div>
      </Section>

      <Section eyebrow="Common confusion" title="an or auf?">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          English often uses “on” for both. In German, <strong>an</strong> is common for contact with a side, wall, door, window or edge, while <strong>auf</strong> is common for something resting on top of a surface.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12 }}>
            <strong>an</strong>
            <p style={{ margin: "5px 0 0" }}>Das Bild hängt <strong>an der Wand</strong>.</p>
          </div>
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12 }}>
            <strong>auf</strong>
            <p style={{ margin: "5px 0 0" }}>Das Buch liegt <strong>auf dem Tisch</strong>.</p>
          </div>
        </div>
      </Section>

      <Section eyebrow="Guided practice" title="Choose the correct article">
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
            <strong>{score}/{quiz.length} correct.</strong> {score >= 5 ? "You are ready for the workbook." : "Review Wo/Wohin and repeat the practice before continuing."}
          </div>
        ) : null}
      </Section>

      <Section eyebrow="Prepare for the tutor-marked work" title="What the workbook will test">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Chapter 12.1 is the grammar focus, but the existing tutor-marked workbook also checks reading and listening and recycles language from earlier A1 lessons. That is intentional revision. Use this page to learn the new grammar, then complete the workbook without expecting every question to be only about Wechselpräpositionen.
        </p>
        <div style={{ borderLeft: "4px solid #4f46e5", background: "#eef2ff", padding: 12, borderRadius: 10, lineHeight: 1.65 }}>
          <strong>Important:</strong> the tutor-marked assignment itself has not been changed, so your saved answers and grading setup remain compatible.
        </div>
      </Section>

      <section style={{ ...card, background: "#172554", color: "#fff" }}>
        <h2 style={{ margin: 0 }}>Ready for Chapter 12.1?</h2>
        <p style={{ margin: 0, color: "#dbeafe", lineHeight: 1.65 }}>
          Before opening the workbook, make sure you can explain the difference between <strong>Wo?</strong> and <strong>Wohin?</strong> in one sentence and form at least two example pairs yourself.
        </p>
        <a href={workbookHref} style={{ ...styles.primaryButton, width: "fit-content", textDecoration: "none", background: "#fff", color: "#172554", borderColor: "#fff" }}>
          Continue to the tutor-marked workbook
        </a>
      </section>
    </main>
  );
};

export default TwoCasePrepositionsPageLegacy;
