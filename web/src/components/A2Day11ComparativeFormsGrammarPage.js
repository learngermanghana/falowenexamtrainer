import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";

const cardStyle = { ...styles.card, display: "grid", gap: 12 };
const listStyle = { margin: 0, paddingLeft: 20, display: "grid", gap: 6 };
const noteStyle = {
  borderRadius: 12,
  padding: 12,
  background: "rgba(59,130,246,0.08)",
  border: "1px solid rgba(59,130,246,0.2)",
};
const exampleStyle = {
  borderRadius: 12,
  padding: 12,
  background: "rgba(16,185,129,0.08)",
  border: "1px solid rgba(16,185,129,0.18)",
};
const heroImageStyle = {
  width: "100%",
  maxHeight: 320,
  objectFit: "cover",
  borderRadius: 12,
  border: "1px solid rgba(15,23,42,0.08)",
};

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

const SectionCard = ({ title, children }) => (
  <section style={cardStyle} aria-label={title}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const A2Day11ComparativeFormsGrammarPage = () => {
  const [showQuizAnswers, setShowQuizAnswers] = useState(false);

  return (
    <div style={styles.pageWrap}>
      <div style={styles.container}>
        <AppBackButton label="Back" fallbackPath="/campus/course" />

        <header style={{ ...styles.card, display: "grid", gap: 10, marginBottom: 18 }}>
          <h1 style={{ margin: 0 }}>A2 • 4.11 Unterwegs: Verkehrsmittel vergleichen</h1>
          <img
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80"
            alt="Different transport options in a city and airport setting"
            style={heroImageStyle}
            loading="lazy"
          />
          <p style={{ margin: 0, opacity: 0.85 }}>
            Grammar focus: <strong>Komparativ &amp; Superlativ</strong>
          </p>
          <p style={{ margin: 0, opacity: 0.85, lineHeight: 1.7 }}>
            In this chapter, you compare transport options clearly. Use <strong>Komparativ</strong> for two things and
            <strong> Superlativ</strong> for the strongest form in a group.
          </p>
        </header>

        <div style={{ display: "grid", gap: 14 }}>
          <SectionCard title="1) Quick rule: Komparativ vs. Superlativ">
            <ul style={listStyle}>
              <li><strong>Komparativ</strong>: adjective + <InlineCode>-er</InlineCode> + <InlineCode>als</InlineCode></li>
              <li><strong>Superlativ</strong> (predicative): <InlineCode>am</InlineCode> + adjective + <InlineCode>-sten</InlineCode></li>
              <li><strong>Superlativ</strong> (attributive): <InlineCode>der/die/das ... -ste</InlineCode></li>
            </ul>
            <div style={noteStyle}>
              Typical endings: <InlineCode>schnell → schneller → am schnellsten</InlineCode>.<br />
              If the adjective ends in <InlineCode>-d</InlineCode>, <InlineCode>-t</InlineCode>, <InlineCode>-s</InlineCode>,
              <InlineCode>-ß</InlineCode>, <InlineCode>-sch</InlineCode>, or <InlineCode>-z</InlineCode>, the superlative often uses
              <InlineCode>-esten</InlineCode> (e.g., <InlineCode>teuer → am teuersten</InlineCode>).
            </div>
          </SectionCard>

          <SectionCard title="2) Useful transport comparisons">
            <div style={exampleStyle}>
              Das Fahrrad ist <strong>günstiger als</strong> das Auto.<br />
              Der Zug ist oft <strong>schneller als</strong> der Bus.<br />
              Das Flugzeug ist <strong>am schnellsten</strong>.<br />
              Die Straßenbahn ist in der Stadt oft <strong>zuverlässiger als</strong> der Bus.
            </div>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Speaking tip: compare <strong>Preis</strong>, <strong>Zeit</strong>, <strong>Komfort</strong>, and
              <strong> Umweltfreundlichkeit</strong> in one short response.
            </p>
          </SectionCard>

          <SectionCard title="3) Important irregular forms">
            <ul style={listStyle}>
              <li><InlineCode>gut → besser → am besten</InlineCode></li>
              <li><InlineCode>viel → mehr → am meisten</InlineCode></li>
              <li><InlineCode>gern → lieber → am liebsten</InlineCode></li>
              <li><InlineCode>hoch → höher → am höchsten</InlineCode></li>
            </ul>
          </SectionCard>

          <SectionCard title="4) Sentence patterns for A2 speaking/writing">
            <ul style={listStyle}>
              <li><InlineCode>X ist + Komparativ + als Y.</InlineCode></li>
              <li><InlineCode>Ich finde X + Komparativ, weil ...</InlineCode></li>
              <li><InlineCode>Von allen Verkehrsmitteln ist X am ...sten.</InlineCode></li>
              <li><InlineCode>Für die Umwelt ist X besser als Y.</InlineCode></li>
            </ul>
          </SectionCard>

          <SectionCard title="5) Practical quiz">
            <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
              <li>Der Bus ist (langsam) _______ als die U-Bahn.</li>
              <li>Von allen ist das Fahrrad (umweltfreundlich) am _______.</li>
              <li>Für lange Strecken ist der Zug (gut) _______ als das Auto.</li>
              <li>Ich fahre lieber mit dem Zug, weil er _______ (bequem) als der Bus ist.</li>
            </ol>
            <button
              type="button"
              onClick={() => setShowQuizAnswers((prev) => !prev)}
              style={{ ...styles.secondaryBtn, justifySelf: "start" }}
            >
              {showQuizAnswers ? "Hide answers" : "Show answers"}
            </button>
            {showQuizAnswers ? (
              <div style={noteStyle}>
                Answers: <strong>langsamer, umweltfreundlichsten, besser, bequemer</strong>
              </div>
            ) : null}
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default A2Day11ComparativeFormsGrammarPage;
