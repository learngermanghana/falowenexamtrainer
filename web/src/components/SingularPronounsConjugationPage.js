import React, { memo, useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";

const sectionStyle = { ...styles.card, display: "grid", gap: 12 };

const listStyle = {
  margin: 0,
  paddingLeft: 20,
  display: "grid",
  gap: 6,
};

const imageStyle = {
  width: "100%",
  maxHeight: 360,
  objectFit: "cover",
  borderRadius: 16,
  border: "1px solid #e5e7eb",
  marginTop: 8,
};

const captionStyle = {
  margin: 0,
  fontSize: 14,
  color: "#6b7280",
};

const tableCellStyle = {
  border: "1px solid #d1d5db",
  padding: 8,
  verticalAlign: "top",
  textAlign: "left",
};

const tipBoxStyle = {
  background: "#eff6ff",
  border: "1px solid #bfdbfe",
  borderRadius: 12,
  padding: 12,
  display: "grid",
  gap: 8,
};

const successBoxStyle = {
  background: "#ecfdf5",
  border: "1px solid #a7f3d0",
  borderRadius: 12,
  padding: 12,
  display: "grid",
  gap: 8,
};

const warningBoxStyle = {
  background: "#fff7ed",
  border: "1px solid #fdba74",
  borderRadius: 12,
  padding: 12,
  display: "grid",
  gap: 8,
};

const questionCardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 12,
  display: "grid",
  gap: 10,
  background: "#ffffff",
};

const optionButtonBaseStyle = {
  width: "100%",
  textAlign: "left",
  borderRadius: 10,
  padding: "10px 12px",
  border: "1px solid #d1d5db",
  background: "#ffffff",
  cursor: "pointer",
  fontSize: 15,
};

const pronouns = [
  ["ich", "I"],
  ["du", "you"],
  ["er", "he"],
  ["sie", "she"],
  ["es", "it"],
];

const conjugationRows = [
  ["ich", "heiße", "wohne", "komme", "arbeite"],
  ["du", "heißt", "wohnst", "kommst", "arbeitest"],
  ["er", "heißt", "wohnt", "kommt", "arbeitet"],
  ["sie", "heißt", "wohnt", "kommt", "arbeitet"],
  ["es", "heißt", "wohnt", "kommt", "arbeitet"],
];

const knowledgeCheckQuestions = [
  {
    id: "k1",
    question: "1. Which sentence is correct?",
    options: ["A) Ich heißt Kojo.", "B) Ich heiße Kojo.", "C) Ich heißen Kojo."],
    answer: "B) Ich heiße Kojo.",
  },
  {
    id: "k2",
    question: "2. Complete: Du ___ in Accra.",
    options: ["A) wohnst", "B) wohnt", "C) wohnen"],
    answer: "A) wohnst",
  },
  {
    id: "k3",
    question: "3. Complete: Er ___ aus Deutschland.",
    options: ["A) kommen", "B) kommst", "C) kommt"],
    answer: "C) kommt",
  },
];

function getOptionStyle({ isSelected, isCorrect, isWrong }) {
  if (isCorrect) {
    return {
      ...optionButtonBaseStyle,
      background: "#ecfdf5",
      border: "1px solid #10b981",
    };
  }

  if (isWrong) {
    return {
      ...optionButtonBaseStyle,
      background: "#fef2f2",
      border: "1px solid #ef4444",
    };
  }

  if (isSelected) {
    return {
      ...optionButtonBaseStyle,
      background: "#eff6ff",
      border: "1px solid #3b82f6",
    };
  }

  return optionButtonBaseStyle;
}

const KnowledgeCheck = ({ questions }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const score = useMemo(() => {
    let total = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.answer) total += 1;
    });
    return total;
  }, [questions, selectedAnswers]);

  const allAnswered = questions.every((q) => selectedAnswers[q.id]);

  return (
    <section style={sectionStyle}>
      <h2 style={{ margin: 0 }}>Knowledge Check</h2>
      <p style={{ margin: 0 }}>
        Answer these short questions to check your understanding.
      </p>

      <div style={{ display: "grid", gap: 12 }}>
        {questions.map((item) => {
          const selected = selectedAnswers[item.id];

          return (
            <div key={item.id} style={questionCardStyle}>
              <p style={{ margin: 0, fontWeight: 700 }}>{item.question}</p>

              <div style={{ display: "grid", gap: 8 }}>
                {item.options.map((option) => {
                  const isSelected = selected === option;
                  const isCorrect = selected && option === item.answer;
                  const isWrong = isSelected && selected !== item.answer;

                  return (
                    <button
                      key={option}
                      type="button"
                      style={getOptionStyle({ isSelected, isCorrect, isWrong })}
                      onClick={() =>
                        setSelectedAnswers((prev) => ({
                          ...prev,
                          [item.id]: option,
                        }))
                      }
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {selected ? (
                <div style={selected === item.answer ? successBoxStyle : warningBoxStyle}>
                  {selected === item.answer ? (
                    <p style={{ margin: 0 }}>✅ Correct.</p>
                  ) : (
                    <>
                      <p style={{ margin: 0 }}>❌ Not correct.</p>
                      <p style={{ margin: 0 }}>
                        Correct answer: <strong>{item.answer}</strong>
                      </p>
                    </>
                  )}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div style={tipBoxStyle}>
        <strong>Your score</strong>
        <p style={{ margin: 0 }}>
          {score} / {questions.length}
        </p>
        <p style={{ margin: 0 }}>
          {allAnswered
            ? "Good job. You can change your answers and try again."
            : "Answer all questions to see your full score."}
        </p>
      </div>
    </section>
  );
};

const SingularPronounsConjugationPage = () => {

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={{ ...styles.card, display: "grid", gap: 8 }}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

        <h1 style={{ ...styles.title, marginBottom: 0 }}>
          A1 · Day 2 · Kapitel 1.1 Grammar Notes
        </h1>

        <p style={{ ...styles.subtitle, margin: 0 }}>
          Personal Pronouns + Verb Conjugation (Präsens)
        </p>

        <img
          src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1400&q=80"
          alt="A learner studying German grammar notes"
          style={imageStyle}
        />

        <p style={captionStyle}>
          Focus verbs for today: heißen, wohnen, kommen, arbeiten.
        </p>
      </header>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>1) Personal Pronouns</h2>
        <p style={{ margin: 0 }}>
          Personal pronouns show who does the action in the sentence.
        </p>

        <ul style={listStyle}>
          {pronouns.map(([word, meaning]) => (
            <li key={`${word}-${meaning}`}>
              <strong>{word}</strong> = {meaning}
            </li>
          ))}
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>2) Verb Conjugation</h2>
        <p style={{ margin: 0 }}>
          The verb changes to match the pronoun.
        </p>
        <p style={{ margin: 0 }}>
          This is very important because one word like <strong>sie</strong> can mean
          <strong> she</strong>, <strong>they</strong>, or formal <strong>you</strong>.
          If you only see <strong>sie</strong>, you cannot know the meaning by pronoun
          alone. The verb ending helps you understand who it is.
        </p>
        <p style={{ margin: 0 }}>
          In this lesson, we focus on singular personal pronouns, especially{" "}
          <strong>ich</strong>, <strong>du</strong>, and <strong>er / sie / es</strong>.
        </p>

        <div style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 700 }}>
            <thead>
              <tr>
                <th style={tableCellStyle}>Pronoun</th>
                <th style={tableCellStyle}>heißen</th>
                <th style={tableCellStyle}>wohnen</th>
                <th style={tableCellStyle}>kommen</th>
                <th style={tableCellStyle}>arbeiten</th>
              </tr>
            </thead>
            <tbody>
              {conjugationRows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell) => (
                    <td key={`${row[0]}-${cell}`} style={tableCellStyle}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={tipBoxStyle}>
          <strong>Quick pattern</strong>
          <p style={{ margin: 0 }}>
            <strong>ich</strong> → <strong>-e</strong>
          </p>
          <p style={{ margin: 0 }}>So we use forms like <strong>ich komme</strong> (not <strong>ich kommen</strong>).</p>
          <p style={{ margin: 0 }}>
            <strong>du</strong> → <strong>-st</strong>
          </p>
          <p style={{ margin: 0 }}>
            <strong>er / sie / es</strong> → <strong>-t</strong>
          </p>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>3) Important Note</h2>
        <div style={tipBoxStyle}>
          <p style={{ margin: 0 }}>
            <strong>heißen</strong> becomes <strong>du heißt</strong>.
          </p>
          <p style={{ margin: 0 }}>
            We do <strong>not</strong> write <strong>du heißst</strong>.
          </p>
          <p style={{ margin: 0 }}>
            Correct form: <strong>du heißt</strong>
          </p>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>4) Model Sentences</h2>
        <ul style={listStyle}>
          <li>
            <strong>Ich heiße</strong> Kojo.
          </li>
          <li>
            <strong>Du wohnst</strong> in Accra.
          </li>
          <li>
            <strong>Er kommt</strong> aus Deutschland.
          </li>
          <li>
            <strong>Sie arbeitet</strong> in einer Bank.
          </li>
          <li>
            <strong>Es heißt</strong> Falowen.
          </li>
        </ul>
      </section>

      <KnowledgeCheck questions={knowledgeCheckQuestions} />
    </main>
  );
};

export default memo(SingularPronounsConjugationPage);
