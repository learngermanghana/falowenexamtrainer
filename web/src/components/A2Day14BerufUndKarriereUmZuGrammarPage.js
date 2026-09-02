import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";

const cardStyle = { ...styles.card, display: "grid", gap: 12 };
const listStyle = { margin: 0, paddingLeft: 20, display: "grid", gap: 6 };
const formulaStyle = {
  borderRadius: 12,
  padding: 12,
  background: "rgba(16,185,129,0.1)",
  border: "1px solid rgba(16,185,129,0.35)",
  fontWeight: 600,
};

const practiceQuestions = [
  {
    prompt: "Ich mache einen Computerkurs, um ...",
    options: [
      "meine Computerkenntnisse zu verbessern.",
      "zu meine Computerkenntnisse verbessern.",
      "meine Computerkenntnisse verbessern zu.",
    ],
    correctIndex: 0,
  },
  {
    prompt: "Wir schreiben viele Bewerbungen, um ...",
    options: [
      "eine gute Stelle zu finden.",
      "zu eine gute Stelle finden.",
      "eine gute Stelle finden zu.",
    ],
    correctIndex: 0,
  },
  {
    prompt: "Ich arbeite im Team, um ...",
    options: [
      "gemeinsam Lösungen zu finden.",
      "zu gemeinsam Lösungen finden.",
      "gemeinsam Lösungen finden zu.",
    ],
    correctIndex: 0,
  },
  {
    prompt: "Ich lese Fachartikel, um ...",
    options: [
      "mehr über meinen Beruf zu lernen.",
      "zu mehr über meinen Beruf lernen.",
      "mehr über meinen Beruf lernen zu.",
    ],
    correctIndex: 0,
  },
];

const SectionCard = ({ title, children }) => (
  <section style={cardStyle} aria-label={title}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const MiniPractice = () => {
  const [answers, setAnswers] = useState({});

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        Click the correct ending. Remember: <strong>um + ... + zu + Infinitiv</strong>.
      </p>

      {practiceQuestions.map((question, questionIndex) => {
        const selectedIndex = answers[questionIndex];
        const hasAnswered = Number.isInteger(selectedIndex);
        const isCorrect = hasAnswered && selectedIndex === question.correctIndex;

        return (
          <div
            key={question.prompt}
            style={{
              border: "1px solid rgba(148,163,184,0.4)",
              borderRadius: 12,
              padding: 12,
              display: "grid",
              gap: 10,
              background: "#fff",
            }}
          >
            <strong>{questionIndex + 1}. {question.prompt}</strong>
            <div style={{ display: "grid", gap: 8 }} role="group" aria-label={`Question ${questionIndex + 1}`}>
              {question.options.map((option, optionIndex) => {
                const selected = selectedIndex === optionIndex;
                const optionIsCorrect = optionIndex === question.correctIndex;
                const showCorrect = hasAnswered && optionIsCorrect;
                const showWrong = selected && !optionIsCorrect;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setAnswers((current) => ({ ...current, [questionIndex]: optionIndex }))}
                    aria-pressed={selected}
                    style={{
                      ...styles.secondaryButton,
                      width: "100%",
                      textAlign: "left",
                      justifyContent: "flex-start",
                      padding: "11px 13px",
                      borderRadius: 10,
                      border: showCorrect
                        ? "2px solid #16a34a"
                        : showWrong
                          ? "2px solid #dc2626"
                          : "1px solid #cbd5e1",
                      background: showCorrect
                        ? "#f0fdf4"
                        : showWrong
                          ? "#fef2f2"
                          : "#f8fafc",
                      color: "#0f172a",
                      fontWeight: selected || showCorrect ? 700 : 600,
                    }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {hasAnswered ? (
              <p
                role="status"
                style={{
                  margin: 0,
                  fontWeight: 700,
                  color: isCorrect ? "#166534" : "#b91c1c",
                }}
              >
                {isCorrect
                  ? `Correct: ${question.prompt} ${question.options[question.correctIndex]}`
                  : "Not quite. Choose the ending with zu directly before the infinitive."}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

const A2Day14BerufUndKarriereUmZuGrammarPage = () => {
  return (
    <div style={styles.pageWrap}>
      <div style={styles.container}>
        <AppBackButton label="Back" fallbackPath="/campus/course" />

        <header style={{ ...styles.card, display: "grid", gap: 10, marginBottom: 18 }}>
          <h1 style={{ margin: 0 }}>A2 • 5.14 Beruf und Karriere</h1>
          <p style={{ margin: 0, opacity: 0.85 }}>
            Grammar focus: <strong>um ... zu + Infinitiv</strong> (purpose / intention).
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Use <strong>um ... zu</strong> when you want to explain <em>why</em> you do something in a career
            context: goals, plans, and intentions.
          </p>
        </header>

        <div style={{ display: "grid", gap: 14 }}>
          <SectionCard title="1) Meaning and structure">
            <p style={{ margin: 0 }}>
              <strong>um ... zu</strong> = <em>in order to</em>. It introduces a purpose clause.
            </p>
            <div style={formulaStyle}>Hauptsatz + um + ... + zu + Infinitiv</div>
            <ul style={listStyle}>
              <li>Ich lerne Deutsch, um in Deutschland zu arbeiten.</li>
              <li>Sie macht ein Praktikum, um Erfahrung zu sammeln.</li>
              <li>Wir besuchen einen Kurs, um bessere Bewerbungen zu schreiben.</li>
            </ul>
          </SectionCard>

          <SectionCard title="2) Important rule: same subject">
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Use <strong>um ... zu</strong> when the subject in both parts is the same.
            </p>
            <ul style={listStyle}>
              <li>
                ✅ Ich arbeite viel, um <strong>eine Beförderung zu bekommen</strong>.
              </li>
              <li>
                ❌ Ich arbeite viel, um <strong>mein Chef ist zufrieden</strong>.
              </li>
            </ul>
            <p style={{ margin: 0 }}>
              If subjects are different, use a clause with <strong>damit</strong> instead.
            </p>
          </SectionCard>

          <SectionCard title="3) Separable and modal verbs">
            <ul style={listStyle}>
              <li>Ich spare Geld, um eine Weiterbildung zu machen.</li>
              <li>Ich übe Präsentationen, um selbstbewusster auftreten zu können.</li>
              <li>Er steht früh auf, um pünktlich anzufangen.</li>
            </ul>
            <p style={{ margin: 0 }}>
              In spoken/work contexts, this pattern sounds natural and goal-oriented.
            </p>
          </SectionCard>

          <SectionCard title="4) Job interview sentence starters">
            <ul style={listStyle}>
              <li>Ich lerne jeden Tag, um ...</li>
              <li>Ich nehme an diesem Kurs teil, um ...</li>
              <li>Ich möchte ein Praktikum machen, um ...</li>
              <li>Ich verbessere mein Deutsch, um ...</li>
            </ul>
          </SectionCard>

          <SectionCard title="5) Mini practice · Choose the correct answer">
            <MiniPractice />
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default A2Day14BerufUndKarriereUmZuGrammarPage;
