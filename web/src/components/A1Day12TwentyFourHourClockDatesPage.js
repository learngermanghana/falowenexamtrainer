import React, { useMemo, useState } from "react";
import { styles } from "../styles";

const heroImage =
  "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1400&q=80";

const pageWrap = {
  ...styles.container,
  display: "grid",
  gap: 18,
};

const card = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const paragraph = {
  margin: 0,
  lineHeight: 1.75,
};

const listStyle = {
  margin: 0,
  paddingLeft: 20,
  lineHeight: 1.75,
};

const tableCell = {
  textAlign: "left",
  padding: 10,
  borderBottom: "1px solid #e5e7eb",
};

const mutedBox = {
  padding: 12,
  borderRadius: 12,
  background: "rgba(0,0,0,0.04)",
};

const heroWrap = {
  ...styles.card,
  overflow: "hidden",
  padding: 0,
};

const heroImageStyle = {
  width: "100%",
  height: 260,
  objectFit: "cover",
};

const heroContent = {
  padding: 18,
  display: "grid",
  gap: 10,
};

const badge = {
  display: "inline-block",
  padding: "6px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 700,
  background: "rgba(0,0,0,0.06)",
};

const actionBtn = {
  border: "none",
  borderRadius: 10,
  padding: "10px 14px",
  fontWeight: 700,
  cursor: "pointer",
  background: "#111827",
  color: "#fff",
};

function KnowledgeCheck({ question, options, correctIndex, explanation }) {
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);

  const isCorrect = selected === correctIndex;

  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 14, display: "grid", gap: 10 }}>
      <p style={{ ...paragraph, fontWeight: 700 }}>{question}</p>

      {options.map((option, i) => (
        <button
          key={option}
          onClick={() => setSelected(i)}
          style={{
            textAlign: "left",
            padding: 10,
            borderRadius: 10,
            border: selected === i ? "2px solid #111827" : "1px solid #d1d5db",
            background: selected === i ? "rgba(17,24,39,0.06)" : "#fff",
            cursor: "pointer",
          }}
        >
          {option}
        </button>
      ))}

      <button onClick={() => setChecked(true)} style={actionBtn} disabled={selected === null}>
        Check answer
      </button>

      {checked && (
        <div style={{ padding: 10, borderRadius: 10, background: isCorrect ? "#dcfce7" : "#fee2e2" }}>
          <strong>{isCorrect ? "Correct." : "Not correct."}</strong> {explanation}
        </div>
      )}
    </div>
  );
}

export default function A1Day12TwentyFourHourClockDatesPage() {
  const [showAnswers, setShowAnswers] = useState(false);

  const examples = useMemo(
    () => [
      { time: "08:00", german: "acht Uhr" },
      { time: "15:30", german: "fünfzehn Uhr dreißig" },
      { time: "19:45", german: "neunzehn Uhr fünfundvierzig" },
    ],
    []
  );

  return (
    <main style={pageWrap}>
      {/* HERO */}
      <section style={heroWrap}>
        <img src={heroImage} alt="Clock and calendar" style={heroImageStyle} />
        <div style={heroContent}>
          <span style={badge}>A1 Grammar</span>
          <h1 style={{ ...styles.title, margin: 0 }}>
            24-Hour Clock & Dates
          </h1>
          <p style={paragraph}>
            Learn how to tell time and say dates in German clearly and correctly.
          </p>
        </div>
      </section>

      {/* CLOCK */}
      <section style={card}>
        <h2>24-Hour Clock</h2>
        <p style={paragraph}>
          German uses the 24-hour system. After 12:00, numbers continue.
        </p>

        <div style={mutedBox}>
          13:00 = 1 PM <br />
          18:00 = 6 PM <br />
          20:00 = 8 PM
        </div>

        <table style={{ width: "100%" }}>
          <tbody>
            {examples.map((row) => (
              <tr key={row.time}>
                <td style={tableCell}>{row.time}</td>
                <td style={tableCell}>{row.german}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* HALF / QUARTER */}
      <section style={card}>
        <h2>halb / vor / nach</h2>

        <ul style={listStyle}>
          <li>07:30 — halb acht</li>
          <li>09:15 — viertel nach neun</li>
          <li>09:45 — viertel vor zehn</li>
        </ul>

        <div style={mutedBox}>
          halb acht = 7:30 (NOT 8:30)
        </div>
      </section>

      {/* DATES */}
      <section style={card}>
        <h2>Dates</h2>

        <p style={paragraph}>
          Format: <strong>day.month.year</strong>
        </p>

        <ul style={listStyle}>
          <li>05.03.2026</li>
          <li>21.10.2026</li>
        </ul>

        <p style={paragraph}>
          Heute ist der dritte April.
        </p>
      </section>

      {/* KNOWLEDGE TEST */}
      <section style={card}>
        <h2>Quick Test</h2>

        <KnowledgeCheck
          question="15:30 is?"
          options={["fünfzehn Uhr dreißig", "fünf Uhr dreißig"]}
          correctIndex={0}
          explanation="15:30 = fünfzehn Uhr dreißig"
        />

        <KnowledgeCheck
          question="halb acht means?"
          options={["7:30", "8:30"]}
          correctIndex={0}
          explanation="halb acht = 7:30"
        />
      </section>

      {/* WRITING */}
      <section style={card}>
        <h2>Mini Writing Task</h2>

        <ol style={listStyle}>
          <li>Wie spät ist es?</li>
          <li>Wann beginnt dein Unterricht?</li>
          <li>Welches Datum haben wir heute?</li>
        </ol>

        <button onClick={() => setShowAnswers(!showAnswers)} style={actionBtn}>
          {showAnswers ? "Hide Answers" : "Show Answers"}
        </button>

        {showAnswers && (
          <div style={mutedBox}>
            Es ist zehn Uhr. <br />
            Mein Unterricht beginnt um acht Uhr. <br />
            Heute ist der zwölfte März.
          </div>
        )}
      </section>

      {/* MISTAKES */}
      <section style={card}>
        <h2>Common Mistakes</h2>

        <ul style={listStyle}>
          <li>halb zwei ≠ 2:30 (it is 1:30)</li>
          <li>Use "der" in dates → der dritte April</li>
        </ul>
      </section>
    </main>
  );
}
