import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const Section = ({ title, children }) => (
  <section style={{ ...styles.card, display: "grid", gap: 10 }}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const tableCell = { borderBottom: "1px solid #e5e7eb", padding: 8, textAlign: "left" };

const practiceItems = [
  { prompt: "Ich reise mit ___ Auto.", answer: "dem", solution: "Ich reise mit dem Auto." },
  { prompt: "Ich fahre mit ___ Fahrrad.", answer: "dem", solution: "Ich fahre mit dem Fahrrad." },
  { prompt: "Ich bin bei ___ Post.", answer: "der", solution: "Ich bin bei der Post." },
  { prompt: "Ich bin bei ___ Bank.", answer: "der", solution: "Ich bin bei der Bank." },
  { prompt: "Ich gehe zu ___ Schule.", answer: "der", solution: "Ich gehe zu der Schule." },
  { prompt: "Ich gehe zu ___ Park.", answer: "dem", solution: "Ich gehe zu dem Park." },
  { prompt: "Ich reise mit ___ Kindern.", answer: "den", solution: "Ich reise mit den Kindern." },
  { prompt: "Ich bin bei ___ Krankenhaus.", answer: "dem", solution: "Ich bin bei dem Krankenhaus." },
  { prompt: "Ich gehe zu ___ Konzert.", answer: "dem", solution: "Ich gehe zu dem Konzert." },
  { prompt: "Ich gehe zu ___ Party.", answer: "der", solution: "Ich gehe zu der Party." },
];

const normalize = (value) => value.trim().toLowerCase();

const DativePrepositionsMitBeiZuPage = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [showSolutions, setShowSolutions] = useState(false);

  const score = useMemo(
    () =>
      practiceItems.reduce((total, item, index) => {
        if (normalize(answers[index] || "") === item.answer) return total + 1;
        return total;
      }, 0),
    [answers]
  );

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>Chapter 12.2: Dative Prepositions (mit, bei, zu)</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          There are several dative-only prepositions in German, but today we focus only on <strong>mit</strong>,
          <strong> bei</strong>, and <strong>zu</strong>.
        </p>
      </div>

      <Section title="1) Core rule">
        <p style={{ margin: 0 }}>
          In German, the prepositions <strong>mit</strong>, <strong>bei</strong>, and <strong>zu</strong> always require the
          <strong> dative case</strong>. This changes the article that follows.
        </p>
      </Section>

      <Section title="2) Dative articles">
        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
          <li>Masculine: der → dem</li>
          <li>Feminine: die → der</li>
          <li>Neuter: das → dem</li>
          <li>Plural: die → den (+n on noun where needed)</li>
        </ul>
      </Section>

      <Section title='3) Examples with "mit", "bei", and "zu"'>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr>
                <th style={tableCell}>Preposition</th>
                <th style={tableCell}>Masculine</th>
                <th style={tableCell}>Feminine</th>
                <th style={tableCell}>Neuter</th>
                <th style={tableCell}>Plural</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tableCell}><strong>mit</strong> (with)</td>
                <td style={tableCell}>Ich fahre mit dem Zug.</td>
                <td style={tableCell}>Ich fahre mit der U-Bahn.</td>
                <td style={tableCell}>Ich fahre mit dem Fahrrad.</td>
                <td style={tableCell}>Ich fahre mit den Kindern.</td>
              </tr>
              <tr>
                <td style={tableCell}><strong>bei</strong> (at/with)</td>
                <td style={tableCell}>Ich bin bei dem Freund.</td>
                <td style={tableCell}>Ich bin bei der Post.</td>
                <td style={tableCell}>Ich bin bei dem Krankenhaus.</td>
                <td style={tableCell}>Ich bin bei den Eltern.</td>
              </tr>
              <tr>
                <td style={tableCell}><strong>zu</strong> (to)</td>
                <td style={tableCell}>Ich gehe zu dem Bäcker.</td>
                <td style={tableCell}>Ich gehe zu der Schule.</td>
                <td style={tableCell}>Ich gehe zu dem Konzert.</td>
                <td style={tableCell}>Ich gehe zu den Freunden.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style={{ margin: 0 }}>
          Tip: <strong>zu dem = zum</strong> and <strong>zu der = zur</strong>.
        </p>
      </Section>

      <Section title="4) Practice exercises">
        <p style={{ margin: 0 }}>Fill each blank with the correct dative article (dem, der, den).</p>
        <div style={{ display: "grid", gap: 10 }}>
          {practiceItems.map((item, index) => {
            const userAnswer = answers[index] || "";
            const correct = normalize(userAnswer) === item.answer;
            return (
              <div key={item.prompt} style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 10, display: "grid", gap: 6 }}>
                <label htmlFor={`item-${index}`}>{index + 1}. {item.prompt}</label>
                <input
                  id={`item-${index}`}
                  value={userAnswer}
                  onChange={(event) => setAnswers((prev) => ({ ...prev, [index]: event.target.value }))}
                  placeholder="Type article"
                  style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #d1d5db", maxWidth: 180 }}
                />
                {checked && <span style={{ color: correct ? "#166534" : "#b91c1c" }}>{correct ? "Correct ✅" : "Try again"}</span>}
                {showSolutions && <span>{item.solution}</span>}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button style={styles.secondaryButton} onClick={() => setChecked(true)}>Check answers</button>
          <button style={styles.secondaryButton} onClick={() => setShowSolutions((prev) => !prev)}>
            {showSolutions ? "Hide solutions" : "Show solutions"}
          </button>
        </div>
        {checked && <p style={{ margin: 0 }}>Score: {score}/{practiceItems.length}</p>}
      </Section>
    </div>
  );
};

export default DativePrepositionsMitBeiZuPage;
