import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const cardStyle = { ...styles.card, display: "grid", gap: 10 };

const SectionCard = ({ title, children }) => (
  <section style={cardStyle}>
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

const A2Day8ImperativeGrammarPage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.pageWrap}>
      <div style={styles.container}>
        <button type="button" onClick={() => navigate(-1)} style={styles.backBtn}>
          ← Back
        </button>

        <header style={{ marginBottom: 18 }}>
          <h1 style={{ margin: "0 0 8px" }}>A2 • 3.8 Rezepte und Essen</h1>
          <p style={{ margin: 0, opacity: 0.85 }}>
            Grammar focus: <strong>Imperative (commands and instructions)</strong>
          </p>
          <div
            style={{
              marginTop: 12,
              borderRadius: 14,
              overflow: "hidden",
              border: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=1800&q=80"
              alt="Cooking steps and ingredients for imperative practice"
              loading="lazy"
              style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }}
            />
          </div>
        </header>

        <div style={{ display: "grid", gap: 14 }}>
          <SectionCard title="1) When do we use the imperative?">
            <p style={{ margin: 0 }}>Use the imperative to give instructions, advice, or direct commands.</p>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>In recipes: step-by-step cooking actions.</li>
              <li>In class instructions: clear tasks for learners.</li>
              <li>In daily life: polite or direct requests.</li>
            </ul>
          </SectionCard>

          <SectionCard title="2) Main imperative forms (A2)">
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>
                <strong>du-form</strong>: verb stem only → <InlineCode>Schneid die Tomaten.</InlineCode>
              </li>
              <li>
                <strong>ihr-form</strong>: same as present tense <InlineCode>ihr</InlineCode> → <InlineCode>Schneidet die Tomaten.</InlineCode>
              </li>
              <li>
                <strong>Sie-form</strong>: infinitive + <InlineCode>Sie</InlineCode> → <InlineCode>Schneiden Sie die Tomaten.</InlineCode>
              </li>
            </ul>
          </SectionCard>

          <SectionCard title="3) Imperative in cooking context">
            <ol style={{ margin: 0, paddingLeft: 20 }}>
              <li>Wasch das Gemüse.</li>
              <li>Schneide die Zwiebel klein.</li>
              <li>Erhitzt das Öl in der Pfanne.</li>
              <li>Geben Sie Salz und Pfeffer dazu.</li>
              <li>Serviere das Essen warm.</li>
            </ol>
          </SectionCard>

          <SectionCard title="4) Important irregular verbs">
            <p style={{ margin: 0 }}>Some common verbs change in the du-imperative:</p>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>
                <InlineCode>nehmen → Nimm!</InlineCode>
              </li>
              <li>
                <InlineCode>geben → Gib!</InlineCode>
              </li>
              <li>
                <InlineCode>essen → Iss!</InlineCode>
              </li>
              <li>
                <InlineCode>lesen → Lies!</InlineCode>
              </li>
            </ul>
          </SectionCard>

          <SectionCard title="5) Negation and polite requests">
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>
                Negation with <InlineCode>nicht</InlineCode>: <strong>Iss nicht so schnell.</strong>
              </li>
              <li>
                Negation with <InlineCode>kein</InlineCode>: <strong>Nimm kein Fleisch.</strong>
              </li>
              <li>
                Polite request with <InlineCode>bitte</InlineCode>: <strong>Schneiden Sie bitte das Brot.</strong>
              </li>
            </ul>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default memo(A2Day8ImperativeGrammarPage);
