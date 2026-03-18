import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 12 };

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
};

const btn = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #111827",
  background: "#111827",
  color: "#fff",
  cursor: "pointer",
};

const lightBtn = {
  padding: "8px 12px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  background: "#fff",
  cursor: "pointer",
};

const answerBox = {
  border: "1px solid #d1d5db",
  borderRadius: 10,
  padding: 10,
  background: "#ecfdf5",
};

const section = {
  ...styles.card,
  display: "grid",
  gap: 14,
};

const numberItems = [
  ["56", "sechsundfünfzig"],
  ["248", "zweihundertachtundvierzig"],
  ["1,234", "eintausendzweihundertvierunddreißig"],
  ["3,452", "dreitausendvierhundertzweiundfünfzig"],
  ["4,560", "viertausendfünfhundertsechzig"],
  ["5,678", "fünftausendsechshundertachtundsiebzig"],
  ["6,789", "sechstausendsiebenhundertneunundachtzig"],
  ["7,890", "siebentausendachthundertneunzig"],
  ["9,999", "neuntausendneunhundertneunundneunzig"],
];

const timeItems = [
  ["2:15", "Viertel nach zwei"],
  ["5:45", "Viertel vor sechs"],
  ["7:30", "halb acht"],
  ["10:10", "zehn nach zehn"],
  ["8:20", "zwanzig nach acht"],
];

const yearPractice = [
  ["1999", "neunzehnhundertneunundneunzig"],
  ["2003", "zweitausenddrei"],
  ["1876", "achtzehnhundertsechsundsiebzig"],
  ["2020", "zweitausendzwanzig"],
];

const birthQuestions = [
  {
    q: "12. Mai 1995",
    correct: 1,
    options: [
      "Ich bin am zwölf Mai neunzehnhundertfünfundneunzig geboren.",
      "Ich bin am zwölften Mai neunzehnhundertfünfundneunzig geboren.",
      "Ich bin am zwölfte Mai 1995 geboren.",
    ],
  },
  {
    q: "3. Juli 1980",
    correct: 1,
    options: [
      "Ich bin am drei Juli neunzehnhundertachtzig geboren.",
      "Ich bin am dritten Juli neunzehnhundertachtzig geboren.",
      "Ich bin am dritter Juli 1980 geboren.",
    ],
  },
  {
    q: "1. Januar 2001",
    correct: 1,
    options: [
      "Ich bin am ein Januar zweitausendeins geboren.",
      "Ich bin am ersten Januar zweitausendeins geboren.",
      "Ich bin am erste Januar 2001 geboren.",
    ],
  },
];

function PracticeBlock({ title, items }) {
  const [show, setShow] = useState({});
  const [input, setInput] = useState({});

  return (
    <section style={section}>
      <h2 style={{ margin: 0 }}>{title}</h2>

      {items.map(([q, a], i) => (
        <div key={i} style={card}>
          <strong>{q}</strong>

          <input
            style={inputStyle}
            placeholder="Type your answer..."
            value={input[i] || ""}
            onChange={(e) =>
              setInput((prev) => ({ ...prev, [i]: e.target.value }))
            }
          />

          <button
            style={lightBtn}
            onClick={() =>
              setShow((prev) => ({ ...prev, [i]: !prev[i] }))
            }
          >
            {show[i] ? "Hide answer" : "Show answer"}
          </button>

          {show[i] && <div style={answerBox}>{a}</div>}
        </div>
      ))}
    </section>
  );
}

function MCQSection() {
  const [selected, setSelected] = useState({});
  const [checked, setChecked] = useState({});

  return (
    <section style={section}>
      <h2 style={{ margin: 0 }}>Birth Sentences</h2>

      {birthQuestions.map((q, qi) => (
        <div key={qi} style={card}>
          <strong>{q.q}</strong>

          {q.options.map((opt, oi) => {
            const isCorrect = checked[qi] && oi === q.correct;
            const isWrong = checked[qi] && selected[qi] === oi && oi !== q.correct;

            return (
              <button
                key={oi}
                style={{
                  ...lightBtn,
                  background: isCorrect
                    ? "#dcfce7"
                    : isWrong
                    ? "#fee2e2"
                    : "#fff",
                }}
                onClick={() =>
                  setSelected((prev) => ({ ...prev, [qi]: oi }))
                }
              >
                {opt}
              </button>
            );
          })}

          <button
            style={btn}
            onClick={() =>
              setChecked((prev) => ({ ...prev, [qi]: true }))
            }
          >
            Check answer
          </button>
        </div>
      ))}
    </section>
  );
}

export default function A1RevisionPage() {
  const navigate = useNavigate();

  return (
    <div style={styles.pageWrap}>
      <div style={styles.page}>
        <section style={card}>
          <h1>A1 Revision — Numbers, Time, Years</h1>
          <button style={lightBtn} onClick={() => navigate(-1)}>
            ← Back
          </button>
        </section>

        <section style={section}>
          <h2>Years (Important)</h2>

          <div style={answerBox}>
            1453 → vierzehnhundertdreiundfünfzig (14 hundred 53) <br />
            1944 → neunzehnhundertvierundvierzig (19 hundred 44) <br />
            2000 → zweitausend <br />
            2025 → zweitausendfünfundzwanzig
          </div>
        </section>

        <PracticeBlock
          title="Numbers"
          items={numberItems}
        />

        <PracticeBlock
          title="Time"
          items={timeItems}
        />

        <PracticeBlock
          title="Year Practice"
          items={yearPractice}
        />

        <MCQSection />
      </div>
    </div>
  );
}
