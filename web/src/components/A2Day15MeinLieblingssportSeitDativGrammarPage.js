import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";

const cardStyle = { ...styles.card, display: "grid", gap: 12 };
const listStyle = { margin: 0, paddingLeft: 20, display: "grid", gap: 6 };
const patternStyle = {
  borderRadius: 12,
  padding: 12,
  background: "rgba(59,130,246,0.08)",
  border: "1px solid rgba(59,130,246,0.2)",
};
const heroImageStyle = {
  width: "100%",
  maxHeight: 260,
  objectFit: "cover",
  borderRadius: 12,
  border: "1px solid rgba(148,163,184,0.35)",
};

const SectionCard = ({ title, children }) => (
  <section style={cardStyle} aria-label={title}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const A2Day15MeinLieblingssportSeitDativGrammarPage = () => {
  const [showAnswers, setShowAnswers] = useState(false);

  return (
    <div style={styles.pageWrap}>
      <div style={styles.container}>
        <AppBackButton label="Back" fallbackPath="/campus/course" />

        <header style={{ ...styles.card, display: "grid", gap: 10, marginBottom: 18 }}>
          <h1 style={{ margin: 0 }}>A2 • 6.15 Mein Lieblingssport</h1>
          <img
            src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1400&q=80"
            alt="People running on a track during a sports training session"
            style={heroImageStyle}
            loading="lazy"
          />
          <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.72 }}>Header image source: Unsplash</p>
          <p style={{ margin: 0, opacity: 0.9 }}>
            Grammar focus: <strong>seit + Dativ + Präsens</strong>
          </p>
        </header>

        <div style={{ display: "grid", gap: 14 }}>
          <SectionCard title="1) Core meaning">
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Use <strong>seit</strong> when an action started in the past and is still true now.
            </p>
            <div style={patternStyle}>
              <strong>Pattern:</strong> Seit + time expression (Dativ) + Präsens
              <br />
              Example: <strong>Ich spiele seit einem Jahr Fußball.</strong>
            </div>
          </SectionCard>

          <SectionCard title="2) Time expressions with seit (Dativ)">
            <ul style={listStyle}>
              <li>seit <strong>einem Monat</strong></li>
              <li>seit <strong>einer Woche</strong></li>
              <li>seit <strong>einem Jahr</strong></li>
              <li>seit <strong>dem Sommer</strong></li>
              <li>seit <strong>meiner Kindheit</strong></li>
            </ul>
            <p style={{ margin: 0 }}>After <strong>seit</strong>, nouns are in the dative case.</p>
          </SectionCard>

          <SectionCard title="3) A2 model sentences: Lieblingssport">
            <ul style={listStyle}>
              <li>Ich spiele seit zwei Jahren Tennis.</li>
              <li>Sie trainiert seit einem Monat im Fitnessstudio.</li>
              <li>Wir joggen seit dem Frühling jeden Samstag.</li>
              <li>Er schwimmt seit seiner Kindheit sehr gern.</li>
              <li>Ich mache seit letzter Woche Yoga.</li>
            </ul>
          </SectionCard>

          <SectionCard title="4) Quick contrast: seit vs. vor">
            <ul style={listStyle}>
              <li>
                <strong>seit</strong> + Präsens → action continues now.
              </li>
              <li>
                <strong>vor</strong> + Dativ + past tense → action happened before now, not necessarily continuing.
              </li>
            </ul>
            <p style={{ margin: 0 }}>
              Seit drei Jahren <strong>spiele</strong> ich Basketball. / Vor drei Jahren <strong>habe ich</strong> mit
              Basketball angefangen.
            </p>
          </SectionCard>

          <SectionCard title="5) Knowledge test">
            <ol style={{ margin: 0, paddingLeft: 22, display: "grid", gap: 8 }}>
              <li>Ich spiele ___ einem Jahr Volleyball. (seit / vor)</li>
              <li>Wir trainieren seit ___ Woche zusammen. (eine / einer)</li>
              <li>Er macht seit ___ Kindheit Karate. (seine / seiner)</li>
              <li>Seit zwei Monaten ___ ich jeden Tag. (trainiere / trainierte)</li>
              <li>Choose the correct sentence: A) Seit einem Jahr ich spiele Fußball. B) Ich spiele seit einem Jahr Fußball.</li>
            </ol>

            <button type="button" onClick={() => setShowAnswers((prev) => !prev)} style={styles.secondaryBtn}>
              {showAnswers ? "Hide answers" : "Show answers"}
            </button>

            {showAnswers ? (
              <div style={{ border: "1px solid rgba(148,163,184,0.35)", borderRadius: 10, padding: 12 }}>
                <strong>Answers:</strong>
                <ol style={{ margin: "8px 0 0", paddingLeft: 18, display: "grid", gap: 6 }}>
                  <li>seit</li>
                  <li>einer</li>
                  <li>seiner</li>
                  <li>trainiere</li>
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

export default A2Day15MeinLieblingssportSeitDativGrammarPage;
