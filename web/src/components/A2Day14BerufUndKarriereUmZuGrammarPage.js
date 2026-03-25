import React from "react";
import { useNavigate } from "react-router-dom";
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

const SectionCard = ({ title, children }) => (
  <section style={cardStyle} aria-label={title}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const A2Day14BerufUndKarriereUmZuGrammarPage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.pageWrap}>
      <div style={styles.container}>
        <button type="button" onClick={() => navigate(-1)} style={styles.backBtn} aria-label="Go back">
          ← Back
        </button>

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

          <SectionCard title="5) Mini practice">
            <ol style={{ margin: 0, paddingLeft: 22, display: "grid", gap: 8 }}>
              <li>Ich mache einen Computerkurs, um ...</li>
              <li>Wir schreiben viele Bewerbungen, um ...</li>
              <li>Ich arbeite im Team, um ...</li>
              <li>Ich lese Fachartikel, um ...</li>
            </ol>
            <p style={{ margin: 0 }}>
              Write one full sentence for each prompt with <strong>um ... zu</strong>.
            </p>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default A2Day14BerufUndKarriereUmZuGrammarPage;
