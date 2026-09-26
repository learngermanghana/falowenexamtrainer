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
  fontWeight: 700,
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
    prompt: "Ich besuche eine Weiterbildung, um ...",
    options: [
      "mehr Verantwortung übernehmen zu können.",
      "zu mehr Verantwortung können übernehmen.",
      "mehr Verantwortung zu können übernehmen.",
    ],
    correctIndex: 0,
  },
  {
    prompt: "Ich verbessere mein Deutsch, um ...",
    options: [
      "bessere Berufschancen zu haben.",
      "zu bessere Berufschancen haben.",
      "bessere Berufschancen haben zu.",
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
        Wähle die richtige Ergänzung. Das Ziel bleibt immer gleich:
        <strong> um + ... + zu + Infinitiv</strong>.
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
                  ? `Richtig: ${question.prompt} ${question.options[question.correctIndex]}`
                  : "Noch nicht. Setze zu direkt vor den Infinitiv bzw. vor den Infinitivblock."}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

const FocusedGrammarContent = () => (
  <div data-a2-day14-focused-grammar="true" style={{ display: "grid", gap: 14 }}>
    <header style={{ ...styles.card, display: "grid", gap: 10 }}>
      <span style={{ ...styles.badge, width: "fit-content" }}>A2 · 5.14 · Grammatik</span>
      <h1 style={{ margin: 0 }}>um ... zu + Infinitiv</h1>
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        <strong>Meaning:</strong> <em>in order to</em>. Du benutzt <strong>um ... zu</strong>,
        wenn du das Ziel einer Handlung erklärst.
      </p>
      <div style={formulaStyle}>Hauptsatz + , um + ... + zu + Infinitiv</div>
    </header>

    <SectionCard title="1. Wann benutze ich um ... zu?">
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        Die Person im Hauptsatz und im um-zu-Teil ist dieselbe.
      </p>
      <ul style={listStyle}>
        <li>Ich lerne Deutsch, <strong>um in Deutschland zu arbeiten</strong>.</li>
        <li>Sie macht ein Praktikum, <strong>um Erfahrung zu sammeln</strong>.</li>
        <li>Wir besuchen einen Kurs, <strong>um bessere Bewerbungen zu schreiben</strong>.</li>
      </ul>
    </SectionCard>

    <SectionCard title="2. Wortstellung">
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        <strong>um</strong> beginnt den Zielteil. <strong>zu + Infinitiv</strong> steht am Ende.
      </p>
      <div style={formulaStyle}>Ich mache einen Kurs, um meine Chancen zu verbessern.</div>
      <ul style={listStyle}>
        <li>✅ ..., um <strong>eine Stelle zu finden</strong>.</li>
        <li>✅ ..., um <strong>mehr Verantwortung übernehmen zu können</strong>.</li>
        <li>❌ ..., um <strong>zu eine Stelle finden</strong>.</li>
      </ul>
    </SectionCard>

    <SectionCard title="3. Wann benutze ich damit?">
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        Wenn die Personen verschieden sind, benutzt du normalerweise <strong>damit</strong>.
      </p>
      <ul style={listStyle}>
        <li>Ich spreche langsam, <strong>damit der Kunde mich versteht</strong>.</li>
        <li>Die Firma bietet Kurse an, <strong>damit die Mitarbeitenden neue Fähigkeiten lernen</strong>.</li>
      </ul>
      <p style={{ margin: 0, color: "#475569" }}>
        Merksatz: gleiche Person → <strong>um ... zu</strong>; verschiedene Personen → oft <strong>damit</strong>.
      </p>
    </SectionCard>

    <SectionCard title="4. Beruf und Karriere · anwenden">
      <ul style={listStyle}>
        <li>Ich lerne jeden Tag, um mein Deutsch zu verbessern.</li>
        <li>Ich mache eine Weiterbildung, um beruflich weiterzukommen.</li>
        <li>Ich sammle Berufserfahrung, um später eine bessere Stelle zu finden.</li>
        <li>Ich übe Präsentationen, um selbstbewusster sprechen zu können.</li>
      </ul>
    </SectionCard>

    <SectionCard title="5. Kurz prüfen">
      <MiniPractice />
    </SectionCard>
  </div>
);

const A2Day14BerufUndKarriereUmZuGrammarPage = ({ embedded = false }) => {
  if (embedded) return <FocusedGrammarContent />;

  return (
    <div style={styles.pageWrap}>
      <div style={styles.container}>
        <AppBackButton label="Back" fallbackPath="/campus/course" />
        <FocusedGrammarContent />
      </div>
    </div>
  );
};

export default A2Day14BerufUndKarriereUmZuGrammarPage;
