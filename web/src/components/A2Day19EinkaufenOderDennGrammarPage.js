import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const cardStyle = { ...styles.card, display: "grid", gap: 12 };
const heroImageStyle = {
  width: "100%",
  maxHeight: 280,
  objectFit: "cover",
  borderRadius: 12,
  border: "1px solid rgba(148,163,184,0.35)",
};
const listStyle = { margin: 0, paddingLeft: 20, display: "grid", gap: 6 };
const noteStyle = {
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

const A2Day19EinkaufenOderDennGrammarPage = () => {
  const navigate = useNavigate();
  const [showAnswers, setShowAnswers] = useState(false);

  return (
    <div style={styles.pageWrap}>
      <div style={styles.container}>
        <button type="button" onClick={() => navigate(-1)} style={styles.backBtn} aria-label="Go back">
          ← Back
        </button>

        <header style={{ ...styles.card, display: "grid", gap: 10, marginBottom: 18 }}>
          <h1 style={{ margin: 0 }}>A2 • Day 19 (7.19) Einkaufen? Wo und wie?</h1>
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=80"
            alt="People shopping in a bright supermarket aisle"
            style={heroImageStyle}
            loading="lazy"
          />
          <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.72 }}>Header image source: Unsplash</p>
          <p style={{ margin: 0, opacity: 0.9 }}>
            Grammar focus: <strong>Konjunktion: oder / denn</strong>
          </p>
        </header>

        <div style={{ display: "grid", gap: 14 }}>
          <SectionCard title="1) Konjunktion ‘oder’ (choice)">
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Use <strong>oder</strong> to give alternatives. It connects two words, phrases, or clauses.
            </p>
            <div style={noteStyle}>
              <strong>Pattern:</strong> A <strong>oder</strong> B
              <ul style={listStyle}>
                <li>Kaufen wir im Supermarkt <strong>oder</strong> auf dem Markt ein?</li>
                <li>Möchtest du Brot <strong>oder</strong> Reis?</li>
                <li>Fahren wir mit dem Bus <strong>oder</strong> gehen wir zu Fuß?</li>
              </ul>
            </div>
            <p style={{ margin: 0 }}>Word order stays normal in both parts.</p>
          </SectionCard>

          <SectionCard title="2) Konjunktion ‘denn’ (reason)">
            <p style={{ margin: 0 }}>
              Use <strong>denn</strong> to give a reason. It connects two main clauses, and the second clause keeps
              normal main-clause word order.
            </p>
            <div style={noteStyle}>
              <strong>Pattern:</strong> Main clause, <strong>denn</strong> + subject + verb + ...
              <ul style={listStyle}>
                <li>Ich kaufe im Supermarkt ein, <strong>denn</strong> er ist günstig.</li>
                <li>Wir gehen zum Markt, <strong>denn</strong> das Gemüse ist frisch.</li>
                <li>Ich nehme die Tasche mit, <strong>denn</strong> ich kaufe viel ein.</li>
              </ul>
            </div>
          </SectionCard>

          <SectionCard title="3) Schnellvergleich: oder vs. denn">
            <ul style={listStyle}>
              <li>
                <strong>oder</strong> = choice/alternative (A oder B)
              </li>
              <li>
                <strong>denn</strong> = reason/explanation (because)
              </li>
            </ul>
            <p style={{ margin: 0 }}>
              Example pair: Gehen wir zum Markt <strong>oder</strong> in den Supermarkt? / Ich gehe zum Markt,
              <strong> denn</strong> dort ist es billiger.
            </p>
          </SectionCard>

          <SectionCard title="4) Mini dialogue for shopping">
            <p style={{ margin: 0 }}>
              A: Kaufen wir heute im Einkaufszentrum <strong>oder</strong> online?
            </p>
            <p style={{ margin: 0 }}>
              B: Im Einkaufszentrum, <strong>denn</strong> ich möchte die Schuhe anprobieren.
            </p>
            <p style={{ margin: 0 }}>
              A: Super, nehmen wir den Bus <strong>oder</strong> das Taxi?
            </p>
            <p style={{ margin: 0 }}>
              B: Den Bus, <strong>denn</strong> er ist günstiger.
            </p>
          </SectionCard>

          <SectionCard title="5) Knowledge test">
            <ol style={{ margin: 0, paddingLeft: 22, display: "grid", gap: 8 }}>
              <li>Gehen wir in die Mall ___ auf den Markt? (oder / denn)</li>
              <li>Ich kaufe dort ein, ___ die Preise sind gut. (oder / denn)</li>
              <li>Wähl die richtige Form: Ich bleibe hier, denn ich ___ noch Brot. (brauche / braucht)</li>
              <li>Wir fahren mit dem Bus, denn er ___ billig. (ist / sind)</li>
              <li>Choose the better sentence for a reason: A) Ich kaufe Milch oder sie ist günstig. B) Ich kaufe Milch, denn sie ist günstig.</li>
            </ol>

            <button type="button" onClick={() => setShowAnswers((prev) => !prev)} style={styles.secondaryBtn}>
              {showAnswers ? "Hide answers" : "Show answers"}
            </button>

            {showAnswers ? (
              <div style={{ border: "1px solid rgba(148,163,184,0.35)", borderRadius: 10, padding: 12 }}>
                <strong>Answers:</strong>
                <ol style={{ margin: "8px 0 0", paddingLeft: 18, display: "grid", gap: 6 }}>
                  <li>oder</li>
                  <li>denn</li>
                  <li>brauche</li>
                  <li>ist</li>
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

export default A2Day19EinkaufenOderDennGrammarPage;
