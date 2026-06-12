import React, { useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";

const cardStyle = { ...styles.card, display: "grid", gap: 12 };
const listStyle = { margin: 0, paddingLeft: 20, display: "grid", gap: 6 };
const chipRowStyle = { display: "flex", flexWrap: "wrap", gap: 8 };
const chipStyle = {
  padding: "6px 10px",
  borderRadius: 999,
  background: "rgba(59,130,246,0.12)",
  color: "#1d4ed8",
  fontWeight: 700,
  fontSize: 13,
};
const noteStyle = {
  borderRadius: 12,
  padding: 12,
  background: "rgba(99,102,241,0.08)",
  border: "1px solid rgba(99,102,241,0.18)",
};
const tableWrapStyle = {
  overflowX: "auto",
  borderRadius: 12,
  border: "1px solid rgba(0,0,0,0.08)",
};
const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: 640,
};
const thStyle = {
  textAlign: "left",
  padding: "12px 14px",
  background: "rgba(15,23,42,0.06)",
  borderBottom: "1px solid rgba(0,0,0,0.08)",
};
const tdStyle = {
  padding: "12px 14px",
  borderBottom: "1px solid rgba(0,0,0,0.08)",
  verticalAlign: "top",
};
const exampleStyle = {
  borderRadius: 12,
  padding: 12,
  background: "rgba(16,185,129,0.08)",
  border: "1px solid rgba(16,185,129,0.18)",
};
const heroImageStyle = {
  width: "100%",
  borderRadius: 16,
  border: "1px solid rgba(0,0,0,0.08)",
  objectFit: "cover",
  maxHeight: 260,
};
const quizQuestionStyle = {
  border: "1px solid rgba(0,0,0,0.08)",
  borderRadius: 12,
  padding: 12,
  background: "#fff",
  display: "grid",
  gap: 10,
};
const optionBtnStyle = (selected, correct, showResults) => ({
  width: "100%",
  textAlign: "left",
  padding: "10px 12px",
  borderRadius: 10,
  border: showResults
    ? selected === correct
      ? "1px solid #16a34a"
      : selected
      ? "1px solid #dc2626"
      : "1px solid rgba(0,0,0,0.1)"
    : selected
    ? "1px solid #4f46e5"
    : "1px solid rgba(0,0,0,0.1)",
  background: showResults
    ? selected === correct
      ? "#f0fdf4"
      : selected
      ? "#fef2f2"
      : "#fff"
    : selected
    ? "#eef2ff"
    : "#fff",
  cursor: "pointer",
  lineHeight: 1.5,
});

const quizData = [
  {
    id: 1,
    question: "Which auxiliary is usually used with movement verbs like fahren?",
    options: ["haben", "sein", "werden"],
    correct: "sein",
    explanation: "Many movement verbs (like fahren/gehen/kommen) use sein in Perfekt.",
  },
  {
    id: 2,
    question: "Choose the correct Perfekt sentence:",
    options: ["Ich habe nach Berlin gefahren.", "Ich bin nach Berlin gefahren.", "Ich bin nach Berlin gefahrt."],
    correct: "Ich bin nach Berlin gefahren.",
    explanation: "Fahren uses sein, and the participle is gefahren.",
  },
  {
    id: 3,
    question: "Which sentence has correct word order in Perfekt?",
    options: [
      "Wir haben am Wochenende gearbeitet.",
      "Wir gearbeitet haben am Wochenende.",
      "Wir am Wochenende gearbeitet haben.",
    ],
    correct: "Wir haben am Wochenende gearbeitet.",
    explanation: "In main clauses, the auxiliary comes second and participle goes to the end.",
  },
  {
    id: 4,
    question: "What is the correct Partizip II of lernen?",
    options: ["gelern", "gelernt", "gelernen"],
    correct: "gelernt",
    explanation: "Regular verbs often follow ge + stem + t.",
  },
  {
    id: 5,
    question: "For separable verbs, where does ge usually go?",
    options: ["Before the prefix", "Between prefix and stem", "After the participle"],
    correct: "Between prefix and stem",
    explanation: "Example: einladen → eingeladen.",
  },
  {
    id: 6,
    question: "Choose the sentence that correctly uses haben:",
    options: [
      "Sie hat ein Hotel gebucht.",
      "Sie ist ein Hotel gebucht.",
      "Sie hat ein Hotel gebuchen.",
    ],
    correct: "Sie hat ein Hotel gebucht.",
    explanation: "Buchen forms Perfekt with haben and the participle is gebucht.",
  },
];

const SectionCard = ({ title, children }) => (
  <section style={cardStyle} aria-label={title}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const InlineCode = ({ children }) => (
  <span
    style={{
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
      fontSize: "0.95em",
      padding: "2px 6px",
      borderRadius: 6,
      background: "rgba(0,0,0,0.06)",
    }}
  >
    {children}
  </span>
);

const A2Day9PerfektGrammarPage = () => {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const score = useMemo(() => {
    const correct = quizData.reduce((count, q) => count + (answers[q.id] === q.correct ? 1 : 0), 0);
    return { correct, total: quizData.length };
  }, [answers]);

  const resetQuiz = () => {
    setAnswers({});
    setShowResults(false);
  };

  return (
    <div style={styles.pageWrap}>
      <div style={styles.container}>
        <AppBackButton label="Back" fallbackPath="/campus/course" />

        <header style={{ ...styles.card, display: "grid", gap: 10, marginBottom: 18 }}>
          <h1 style={{ margin: 0 }}>A2 • 4.9 Urlaub</h1>
          <img
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1800&q=80"
            alt="Scenic travel landscape for the Urlaub grammar lesson"
            style={heroImageStyle}
            loading="lazy"
          />
          <p style={{ margin: 0, opacity: 0.85 }}>
            Grammar focus: <strong>Perfekt</strong>
          </p>
          <p style={{ margin: 0, opacity: 0.8, lineHeight: 1.7 }}>
            In German, we use different tenses to talk about now, the past, and actions that happened before
            another past action. This chapter focuses on <strong>Perfekt</strong>, because it is the most common
            spoken past tense in everyday German. In the <strong>next chapter</strong>, you will focus on
            <strong> Präteritum</strong>.
          </p>
        </header>

        <div style={{ display: "grid", gap: 14 }}>
          <SectionCard title="1) German tenses at a glance">
            <div style={chipRowStyle}>
              <span style={chipStyle}>Präsens = Present</span>
              <span style={chipStyle}>Perfekt = Present Perfect</span>
              <span style={chipStyle}>Präteritum = Simple Past</span>
              <span style={chipStyle}>Plusquamperfekt = Past Perfect</span>
            </div>

            <div style={tableWrapStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>German tense</th>
                    <th style={thStyle}>English explanation</th>
                    <th style={thStyle}>Easy idea</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={tdStyle}><strong>Präsens</strong></td>
                    <td style={tdStyle}>Present tense</td>
                    <td style={tdStyle}>Used for what is happening now or for general facts.</td>
                  </tr>
                  <tr>
                    <td style={tdStyle}><strong>Perfekt</strong></td>
                    <td style={tdStyle}>Present perfect</td>
                    <td style={tdStyle}>Used very often in spoken German to talk about completed past actions.</td>
                  </tr>
                  <tr>
                    <td style={tdStyle}><strong>Präteritum</strong></td>
                    <td style={tdStyle}>Simple past</td>
                    <td style={tdStyle}>Used more in writing, stories, and with common verbs like <InlineCode>sein</InlineCode> and <InlineCode>haben</InlineCode>.</td>
                  </tr>
                  <tr>
                    <td style={tdStyle}><strong>Plusquamperfekt</strong></td>
                    <td style={tdStyle}>Past perfect</td>
                    <td style={tdStyle}>Used for an action that happened before another action in the past.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={noteStyle}>
              <strong>This chapter:</strong> Perfekt.
              <br />
              <strong>Next chapter:</strong> Präteritum.
            </div>
          </SectionCard>

          <SectionCard title="2) What is Perfekt?">
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              <strong>Perfekt</strong> is the tense German speakers often use in conversation when they talk about
              the past.
            </p>
            <ul style={listStyle}>
              <li><strong>Ich habe Urlaub gemacht.</strong> = I went on vacation / I had a vacation.</li>
              <li><strong>Wir sind nach Berlin gefahren.</strong> = We traveled to Berlin.</li>
            </ul>
            <div style={noteStyle}>
              The basic structure is: <strong>subject + auxiliary verb + ... + past participle</strong>.
              <br />
              Example: <InlineCode>Ich habe am Wochenende gearbeitet.</InlineCode>
            </div>
          </SectionCard>

          <SectionCard title="3) Perfekt with haben">
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Most German verbs form Perfekt with <strong>haben</strong>.
            </p>
            <ul style={listStyle}>
              <li><InlineCode>ich habe gemacht</InlineCode> → I did / I have done</li>
              <li><InlineCode>du hast gelernt</InlineCode> → you learned / you have learned</li>
              <li><InlineCode>wir haben besucht</InlineCode> → we visited / we have visited</li>
            </ul>
            <div style={exampleStyle}>
              <strong>Examples:</strong>
              <br />
              Ich <strong>habe</strong> im Sommer viel <strong>fotografiert</strong>. = I took a lot of photos in summer.
              <br />
              Sie <strong>hat</strong> ein Hotel <strong>gebucht</strong>. = She booked a hotel.
            </div>
          </SectionCard>

          <SectionCard title="4) Perfekt with sein">
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Some verbs form Perfekt with <strong>sein</strong>. This often happens with verbs of movement or a
              change of state.
            </p>
            <ul style={listStyle}>
              <li><InlineCode>ich bin gefahren</InlineCode> → I went / traveled</li>
              <li><InlineCode>wir sind angekommen</InlineCode> → we arrived</li>
              <li><InlineCode>er ist eingeschlafen</InlineCode> → he fell asleep</li>
            </ul>
            <div style={noteStyle}>
              Common verbs with <strong>sein</strong>: <InlineCode>gehen</InlineCode>, <InlineCode>fahren</InlineCode>, <InlineCode>kommen</InlineCode>, <InlineCode>fliegen</InlineCode>, <InlineCode>ankommen</InlineCode>, <InlineCode>aufstehen</InlineCode>.
            </div>
            <div style={exampleStyle}>
              Wir <strong>sind</strong> spät <strong>angekommen</strong>. = We arrived late.
              <br />
              Ich <strong>bin</strong> nach Österreich <strong>gefahren</strong>. = I traveled to Austria.
            </div>
          </SectionCard>

          <SectionCard title="5) How to make the past participle (Partizip II)">
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Many regular verbs use the pattern <InlineCode>ge + verb stem + t</InlineCode>.
            </p>
            <ul style={listStyle}>
              <li><InlineCode>machen → gemacht</InlineCode></li>
              <li><InlineCode>lernen → gelernt</InlineCode></li>
              <li><InlineCode>spielen → gespielt</InlineCode></li>
            </ul>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Some strong or irregular verbs change and often end in <InlineCode>-en</InlineCode>.
            </p>
            <ul style={listStyle}>
              <li><InlineCode>fahren → gefahren</InlineCode></li>
              <li><InlineCode>sehen → gesehen</InlineCode></li>
              <li><InlineCode>schreiben → geschrieben</InlineCode></li>
            </ul>
          </SectionCard>

          <SectionCard title="6) Separable verbs in Perfekt">
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              With separable verbs, the prefix stays at the front of the participle, and <InlineCode>ge</InlineCode>
              goes between the prefix and the verb stem.
            </p>
            <ul style={listStyle}>
              <li><InlineCode>ankommen → angekommen</InlineCode></li>
              <li><InlineCode>aufstehen → aufgestanden</InlineCode></li>
              <li><InlineCode>einladen → eingeladen</InlineCode></li>
            </ul>
            <div style={exampleStyle}>
              Wir <strong>sind</strong> um 18 Uhr <strong>angekommen</strong>. = We arrived at 6 p.m.
              <br />
              Ich <strong>habe</strong> meine Freunde <strong>eingeladen</strong>. = I invited my friends.
            </div>
          </SectionCard>

          <SectionCard title="7) Word order in Perfekt sentences">
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              In a normal main clause, the auxiliary verb is in position 2, and the past participle goes to the end.
            </p>
            <ul style={listStyle}>
              <li><InlineCode>Ich habe letztes Jahr in München gearbeitet.</InlineCode></li>
              <li><InlineCode>Wir sind am Wochenende nach Hamburg gefahren.</InlineCode></li>
            </ul>
          </SectionCard>

          <SectionCard title="8) Quick summary for students">
            <ul style={listStyle}>
              <li><strong>Perfekt</strong> is very important for spoken German.</li>
              <li>Use <strong>haben</strong> with most verbs.</li>
              <li>Use <strong>sein</strong> with many movement verbs and change-of-state verbs.</li>
              <li>The past participle usually goes at the <strong>end</strong> of the sentence.</li>
              <li>With separable verbs, <InlineCode>ge</InlineCode> goes between the prefix and the verb stem.</li>
            </ul>
            <p style={{ margin: 0, opacity: 0.8 }}>
              After this chapter, continue to the next lesson to compare Perfekt with Präteritum in more detail.
            </p>
            <p style={{ margin: 0 }}>
              <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
            </p>
          </SectionCard>

          <SectionCard title="9) Knowledge test (Quick check)">
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Test your understanding before moving on. Aim for at least 4/6 to continue confidently.
            </p>

            {showResults && (
              <div style={noteStyle}>
                <strong>Your score:</strong> {score.correct}/{score.total}{" "}
                {score.correct >= 4 ? "✅ Great work." : "⚠️ Review sections 3–7 and try again."}
              </div>
            )}

            <div style={{ display: "grid", gap: 12 }}>
              {quizData.map((q, index) => (
                <div key={q.id} style={quizQuestionStyle}>
                  <div style={{ fontWeight: 700, lineHeight: 1.55 }}>
                    {index + 1}. {q.question}
                  </div>
                  <div style={{ display: "grid", gap: 8 }}>
                    {q.options.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() =>
                          setAnswers((prev) => ({
                            ...prev,
                            [q.id]: option,
                          }))
                        }
                        style={optionBtnStyle(answers[q.id] === option, q.correct, showResults)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>

                  {showResults && (
                    <div
                      style={{
                        borderRadius: 10,
                        padding: 10,
                        fontSize: 14,
                        lineHeight: 1.65,
                        background: answers[q.id] === q.correct ? "#f0fdf4" : "#fef2f2",
                        border: answers[q.id] === q.correct ? "1px solid #bbf7d0" : "1px solid #fecaca",
                        color: answers[q.id] === q.correct ? "#166534" : "#991b1b",
                      }}
                    >
                      <strong>{answers[q.id] === q.correct ? "Correct." : "Not correct."}</strong>{" "}
                      {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button type="button" style={styles.primaryButton} onClick={() => setShowResults(true)}>
                Check answers
              </button>
              <button type="button" style={styles.secondaryButton} onClick={resetQuiz}>
                Reset
              </button>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default A2Day9PerfektGrammarPage;
