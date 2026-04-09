import React, { memo, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  ["du", "you (informal, one person)"],
  ["er", "he"],
  ["sie", "she"],
  ["es", "it"],
  ["wir", "we"],
  ["ihr", "you (informal plural)"],
  ["sie", "they"],
  ["Sie", "you (formal)"],
];

const conjugationRows = [
  ["ich", "heiße", "wohne", "arbeite", "komme"],
  ["du", "heißt", "wohnst", "arbeitest", "kommst"],
  ["er/sie/es", "heißt", "wohnt", "arbeitet", "kommt"],
  ["wir", "heißen", "wohnen", "arbeiten", "kommen"],
  ["ihr", "heißt", "wohnt", "arbeitet", "kommt"],
  ["sie/Sie", "heißen", "wohnen", "arbeiten", "kommen"],
];

const knowledgeCheckQuestions = [
  {
    id: "k1",
    question: '1. Which sentence is correct for "you live in Berlin" (informal, one person)?',
    options: ["A) Du wohnt in Berlin.", "B) Du wohnen in Berlin.", "C) Du wohnst in Berlin."],
    answer: "C) Du wohnst in Berlin.",
  },
  {
    id: "k2",
    question: '2. Complete: Ich ___ aus Ghana.',
    options: ["A) komme", "B) kommst", "C) kommt"],
    answer: "A) komme",
  },
  {
    id: "k3",
    question: '3. Why do we write "du heißt" and not "du heißst"?',
    options: [
      "A) Because du never takes an ending.",
      "B) Because the stem already ends in ß, so we do not add another s before -t.",
      "C) Because heißen is irregular in all forms.",
    ],
    answer: "B) Because the stem already ends in ß, so we do not add another s before -t.",
  },
  {
    id: "k4",
    question: '4. Choose the correct sentence for "they work in Hamburg."',
    options: ["A) Sie arbeitet in Hamburg.", "B) Sie arbeiten in Hamburg.", "C) Sie arbeitest in Hamburg."],
    answer: "B) Sie arbeiten in Hamburg.",
  },
  {
    id: "k5",
    question: '5. Complete: Wir ___ in Köln.',
    options: ["A) wohne", "B) wohnt", "C) wohnen"],
    answer: "C) wohnen",
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
        Answer the questions to check your understanding of personal pronouns and verb conjugation.
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
                    <p style={{ margin: 0 }}>✅ Correct. Well done.</p>
                  ) : (
                    <>
                      <p style={{ margin: 0 }}>❌ Not quite.</p>
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
        <strong>Your progress</strong>
        <p style={{ margin: 0 }}>
          Score: <strong>{score}</strong> / {questions.length}
        </p>
        <p style={{ margin: 0 }}>
          {allAnswered
            ? "Great work. You can change any answer to practice again."
            : "Pick one answer for each question to get your full score."}
        </p>
      </div>
    </section>
  );
};

const SingularPronounsConjugationPage = () => {
  const navigate = useNavigate();

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>

        <h1 style={{ ...styles.title, marginBottom: 0 }}>A1 · Day 2 · Kapitel 1.1 Grammar Notes</h1>

        <p style={{ ...styles.subtitle, margin: 0 }}>Personal Pronouns + Verb Conjugation (Präsens)</p>

        <img
          src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1400&q=80"
          alt="A German learner studying grammar notes in a notebook"
          style={imageStyle}
        />

        <p style={captionStyle}>Focus verbs for today: heißen, wohnen, arbeiten, kommen.</p>
      </header>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>1) Personal Pronouns (Nominativ)</h2>
        <p style={{ margin: 0 }}>These pronouns are the subject of the sentence (who does the action).</p>
        <ul style={listStyle}>
          {pronouns.map(([word, meaning]) => (
            <li key={`${word}-${meaning}`}>
              <strong>{word}</strong> = {meaning}
            </li>
          ))}
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>2) Verb Conjugation in the Present Tense</h2>
        <p style={{ margin: 0 }}>The verb ending changes based on the pronoun.</p>

        <div style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 700 }}>
            <thead>
              <tr>
                <th style={tableCellStyle}>Pronoun</th>
                <th style={tableCellStyle}>heißen</th>
                <th style={tableCellStyle}>wohnen</th>
                <th style={tableCellStyle}>arbeiten</th>
                <th style={tableCellStyle}>kommen</th>
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
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>3) Why is it “du heißt” (not “du heißst”)?</h2>
        <div style={tipBoxStyle}>
          <p style={{ margin: 0 }}>
            The verb <strong>heißen</strong> has the stem <strong>heiß-</strong>.
          </p>
          <p style={{ margin: 0 }}>
            In the <strong>du</strong> form, many verbs take <strong>-st</strong>. If we added full <strong>-st</strong> here,
            we would get a difficult cluster (<strong>heißst</strong>). In standard spelling, German writes this as
            <strong> heißt</strong>.
          </p>
          <p style={{ margin: 0 }}>
            So: <strong>du heißt</strong> is correct.
          </p>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>4) Model Sentences</h2>
        <ul style={listStyle}>
          <li>
            <strong>Ich heiße</strong> Amina.
          </li>
          <li>
            <strong>Du wohnst</strong> in Berlin.
          </li>
          <li>
            <strong>Er arbeitet</strong> heute.
          </li>
          <li>
            <strong>Wir kommen</strong> aus Ghana.
          </li>
          <li>
            <strong>Sie (formal) arbeiten</strong> in Köln.
          </li>
        </ul>
      </section>

      <KnowledgeCheck questions={knowledgeCheckQuestions} />
    </main>
  );
};

export default memo(SingularPronounsConjugationPage);
