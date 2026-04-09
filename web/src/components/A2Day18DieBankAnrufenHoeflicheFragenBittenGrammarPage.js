import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const cardStyle = { ...styles.card, display: "grid", gap: 12 };
const heroImageStyle = {
  width: "100%",
  maxHeight: 260,
  objectFit: "cover",
  borderRadius: 12,
  border: "1px solid rgba(148,163,184,0.35)",
};
const listStyle = { margin: 0, paddingLeft: 20, display: "grid", gap: 6 };
const highlightStyle = {
  borderRadius: 12,
  padding: 12,
  background: "rgba(59,130,246,0.1)",
  border: "1px solid rgba(59,130,246,0.35)",
};

const SectionCard = ({ title, children }) => (
  <section style={cardStyle} aria-label={title}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const A2Day18DieBankAnrufenHoeflicheFragenBittenGrammarPage = () => {
  const navigate = useNavigate();
  const [showAnswers, setShowAnswers] = useState(false);

  return (
    <div style={styles.pageWrap}>
      <div style={styles.container}>
        <button type="button" onClick={() => navigate(-1)} style={styles.backBtn} aria-label="Go back">
          ← Back
        </button>

        <header style={{ ...styles.card, display: "grid", gap: 10, marginBottom: 18 }}>
          <h1 style={{ margin: 0 }}>A2 • 7.18 Die Bank anrufen</h1>
          <img
            src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=1400&q=80"
            alt="Customer talking to a bank employee at a desk"
            style={heroImageStyle}
            loading="lazy"
          />
          <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.72 }}>Header image source: Unsplash</p>
          <p style={{ margin: 0, opacity: 0.9 }}>
            Grammar focus: <strong>Höfliche Fragen und Bitten</strong>
          </p>
        </header>

        <div style={{ display: "grid", gap: 14 }}>
          <SectionCard title="1) Höflich fragen: basic patterns">
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              In phone calls with a bank, you should use polite forms with <strong>Sie</strong> and
              <strong> bitte</strong>. This sounds professional and respectful.
            </p>
            <div style={highlightStyle}>
              <strong>Useful starts:</strong>
              <ul style={listStyle}>
                <li>Entschuldigung, ich hätte eine Frage.</li>
                <li>Könnten Sie mir bitte helfen?</li>
                <li>Darf ich kurz etwas fragen?</li>
              </ul>
            </div>
          </SectionCard>

          <SectionCard title="2) Modal verbs for polite requests">
            <p style={{ margin: 0 }}>Use modal verbs to make requests softer and more polite.</p>
            <ul style={listStyle}>
              <li>
                <strong>Können Sie ... ?</strong> (neutral polite)
              </li>
              <li>
                <strong>Könnten Sie ... ?</strong> (more polite, softer)
              </li>
              <li>
                <strong>Dürfte ich ... ?</strong> (very polite permission request)
              </li>
            </ul>
            <p style={{ margin: 0 }}>
              Example: <strong>Könnten Sie bitte meinen Kontostand prüfen?</strong>
            </p>
          </SectionCard>

          <SectionCard title="3) Typical bank-call sentences">
            <ul style={listStyle}>
              <li>Ich möchte ein Konto eröffnen.</li>
              <li>Könnten Sie mir bitte einen Termin geben?</li>
              <li>Darf ich meine Karte sperren lassen?</li>
              <li>Könnten Sie das bitte wiederholen?</li>
              <li>Vielen Dank für Ihre Hilfe.</li>
            </ul>
          </SectionCard>

          <SectionCard title="4) Word order reminder">
            <p style={{ margin: 0 }}>
              In questions, the verb usually comes first:
              <strong> Können Sie mir helfen?</strong>
            </p>
            <p style={{ margin: 0 }}>
              In statements, the conjugated verb stays in position 2:
              <strong> Ich möchte einen Termin vereinbaren.</strong>
            </p>
          </SectionCard>

          <SectionCard title="5) Mini practice">
            <ol style={{ margin: 0, paddingLeft: 22, display: "grid", gap: 8 }}>
              <li>___ Sie mir bitte helfen? (Können / Haben)</li>
              <li>Könnten Sie ___ bitte wiederholen? (das / den)</li>
              <li>___ ich kurz eine Frage stellen? (Darf / Muss)</li>
              <li>Choose the better sentence: A) Gib mir einen Termin. B) Könnten Sie mir bitte einen Termin geben?</li>
            </ol>

            <button type="button" onClick={() => setShowAnswers((prev) => !prev)} style={styles.secondaryBtn}>
              {showAnswers ? "Hide answers" : "Show answers"}
            </button>

            {showAnswers ? (
              <div style={{ border: "1px solid rgba(148,163,184,0.35)", borderRadius: 10, padding: 12 }}>
                <strong>Answers:</strong>
                <ol style={{ margin: "8px 0 0", paddingLeft: 18, display: "grid", gap: 6 }}>
                  <li>Können</li>
                  <li>das</li>
                  <li>Darf</li>
                  <li>B</li>
                </ol>
              </div>
            ) : null}
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default A2Day18DieBankAnrufenHoeflicheFragenBittenGrammarPage;
