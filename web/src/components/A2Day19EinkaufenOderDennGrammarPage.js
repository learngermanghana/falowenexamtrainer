import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

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
  const [showAnswers, setShowAnswers] = useState(false);

  return (
    <div style={styles.pageWrap}>
      <div style={styles.container}>
        <AppBackButton label="Back" fallbackPath="/campus/course" />

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
            Grammar focus: <strong>Konjunktion: oder / und</strong>
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

          <SectionCard title="2) Konjunktion ‘und’ (addition)">
            <p style={{ margin: 0 }}>
              Use <strong>und</strong> to add information. It connects words, phrases, or clauses with equal
              importance.
            </p>
            <div style={noteStyle}>
              <strong>Pattern:</strong> A <strong>und</strong> B
              <ul style={listStyle}>
                <li>Ich kaufe Brot <strong>und</strong> Reis.</li>
                <li>Wir gehen zum Markt <strong>und</strong> kaufen Gemüse.</li>
                <li>Ich nehme die Tasche mit <strong>und</strong> kaufe viel ein.</li>
              </ul>
            </div>
            <p style={{ margin: 0 }}>Word order stays normal on both sides of the conjunction.</p>
          </SectionCard>

          <SectionCard title="3) Schnellvergleich: oder vs. und">
            <ul style={listStyle}>
              <li>
                <strong>oder</strong> = choice/alternative (A oder B)
              </li>
              <li>
                <strong>und</strong> = addition/combination (A und B)
              </li>
            </ul>
            <p style={{ margin: 0 }}>
              Example pair: Gehen wir zum Markt <strong>oder</strong> in den Supermarkt? / Ich gehe zum Markt,
              <strong> und</strong> ich kaufe Obst.
            </p>
          </SectionCard>

          <SectionCard title="4) Mini dialogue for shopping">
            <p style={{ margin: 0 }}>
              A: Kaufen wir heute im Einkaufszentrum <strong>oder</strong> online?
            </p>
            <p style={{ margin: 0 }}>
              B: Im Einkaufszentrum <strong>und</strong> später auch online.
            </p>
            <p style={{ margin: 0 }}>
              A: Super, nehmen wir den Bus <strong>oder</strong> das Taxi?
            </p>
            <p style={{ margin: 0 }}>
              B: Den Bus <strong>und</strong> dann gehen wir zu Fuß.
            </p>
          </SectionCard>

          <SectionCard title="5) Knowledge test">
            <ol style={{ margin: 0, paddingLeft: 22, display: "grid", gap: 8 }}>
              <li>Gehen wir in die Mall ___ auf den Markt? (oder / und)</li>
              <li>Ich kaufe Brot ___ Käse. (oder / und)</li>
              <li>Wähl die richtige Form: Ich bleibe hier und ich ___ noch Brot. (brauche / braucht)</li>
              <li>Wir fahren mit dem Bus und er ___ billig. (ist / sind)</li>
              <li>Choose the better sentence for addition: A) Ich kaufe Milch und Eier. B) Ich kaufe Milch oder Eier.</li>
            </ol>

            <button type="button" onClick={() => setShowAnswers((prev) => !prev)} style={styles.secondaryBtn}>
              {showAnswers ? "Hide answers" : "Show answers"}
            </button>

            {showAnswers ? (
              <div style={{ border: "1px solid rgba(148,163,184,0.35)", borderRadius: 10, padding: 12 }}>
                <strong>Answers:</strong>
                <ol style={{ margin: "8px 0 0", paddingLeft: 18, display: "grid", gap: 6 }}>
                  <li>oder</li>
                  <li>und</li>
                  <li>brauche</li>
                  <li>ist</li>
                  <li>A</li>
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
