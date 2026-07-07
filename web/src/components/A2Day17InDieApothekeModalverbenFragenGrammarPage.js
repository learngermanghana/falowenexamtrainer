import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

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

const A2Day17InDieApothekeModalverbenFragenGrammarPage = () => {
  const [showAnswers, setShowAnswers] = useState(false);

  return (
    <div style={styles.pageWrap}>
      <div style={styles.container}>
        <AppBackButton label="Back" fallbackPath="/campus/course" />

        <header style={{ ...styles.card, display: "grid", gap: 10, marginBottom: 18 }}>
          <h1 style={{ margin: 0 }}>A2 • 6.17 In die Apotheke gehen</h1>
          <img
            src="https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=1400&q=80"
            alt="Shelves with medicine in a pharmacy"
            style={heroImageStyle}
            loading="lazy"
          />
          <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.72 }}>Header image source: Unsplash</p>
          <p style={{ margin: 0, opacity: 0.9 }}>
            Grammar focus: <strong>Modalverben + W-Fragen / Ja-Nein-Fragen in der Apotheke</strong>
          </p>
        </header>

        <div style={{ display: "grid", gap: 14 }}>
          <SectionCard title="1) Modal verbs in the pharmacy">
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              In der Apotheke benutzt man Modalverben, um Bedürfnisse, Ratschläge und höfliche Fragen auszudrücken.
            </p>
            <div style={highlightStyle}>
              <strong>Useful modal verbs:</strong>
              <ul style={listStyle}>
                <li><strong>möchten</strong>: Ich möchte etwas gegen Kopfschmerzen.</li>
                <li><strong>können</strong>: Können Sie mir bitte helfen?</li>
                <li><strong>sollen</strong>: Wie oft soll ich die Tabletten nehmen?</li>
                <li><strong>dürfen</strong>: Darf ich das Medikament mit Essen nehmen?</li>
                <li><strong>müssen</strong>: Muss ich zum Arzt gehen?</li>
              </ul>
            </div>
          </SectionCard>

          <SectionCard title="2) Word order with modal verbs">
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Das Modalverb steht auf Position 2. Das zweite Verb steht am Ende im Infinitiv.
            </p>
            <ul style={listStyle}>
              <li>Ich <strong>möchte</strong> Hustensaft <strong>kaufen</strong>.</li>
              <li>Sie <strong>sollen</strong> die Tabletten zweimal täglich <strong>nehmen</strong>.</li>
              <li>Ich <strong>muss</strong> viel Wasser <strong>trinken</strong>.</li>
            </ul>
          </SectionCard>

          <SectionCard title="3) W-Fragen in der Apotheke">
            <p style={{ margin: 0 }}>W-Fragen ask for specific information.</p>
            <ul style={listStyle}>
              <li><strong>Was</strong> hilft gegen Halsschmerzen?</li>
              <li><strong>Wie oft</strong> soll ich die Tabletten nehmen?</li>
              <li><strong>Wann</strong> soll ich das Medikament nehmen?</li>
              <li><strong>Wie viel</strong> kostet der Hustensaft?</li>
              <li><strong>Welche</strong> Nebenwirkungen gibt es?</li>
            </ul>
          </SectionCard>

          <SectionCard title="4) Ja-Nein-Fragen">
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Bei Ja-Nein-Fragen steht das konjugierte Verb am Anfang. Die Antwort ist meistens ja oder nein.
            </p>
            <ul style={listStyle}>
              <li><strong>Haben</strong> Sie etwas gegen Fieber?</li>
              <li><strong>Kann</strong> ich das Medikament mit Wasser nehmen?</li>
              <li><strong>Muss</strong> ich ein Rezept haben?</li>
              <li><strong>Darf</strong> ich danach Auto fahren?</li>
            </ul>
          </SectionCard>

          <SectionCard title="5) Typical pharmacy dialogue">
            <div style={highlightStyle}>
              <p style={{ margin: 0 }}><strong>Kunde:</strong> Guten Tag, ich habe Kopfschmerzen. Haben Sie etwas dagegen?</p>
              <p style={{ margin: 0 }}><strong>Apothekerin:</strong> Ja. Sie können diese Tabletten nehmen.</p>
              <p style={{ margin: 0 }}><strong>Kunde:</strong> Wie oft soll ich sie nehmen?</p>
              <p style={{ margin: 0 }}><strong>Apothekerin:</strong> Zweimal täglich nach dem Essen.</p>
            </div>
          </SectionCard>

          <SectionCard title="6) Mini practice">
            <ol style={{ margin: 0, paddingLeft: 22, display: "grid", gap: 8 }}>
              <li>Ich ___ etwas gegen Husten kaufen. (möchte / bin)</li>
              <li>Wie oft ___ ich die Tabletten nehmen? (soll / habe)</li>
              <li>___ Sie etwas gegen Fieber? (Haben / Sind)</li>
              <li>Put the second verb at the end: Ich möchte / kaufen / Hustensaft.</li>
            </ol>

            <button type="button" onClick={() => setShowAnswers((prev) => !prev)} style={styles.secondaryBtn}>
              {showAnswers ? "Hide answers" : "Show answers"}
            </button>

            {showAnswers ? (
              <div style={{ border: "1px solid rgba(148,163,184,0.35)", borderRadius: 10, padding: 12 }}>
                <strong>Answers:</strong>
                <ol style={{ margin: "8px 0 0", paddingLeft: 18, display: "grid", gap: 6 }}>
                  <li>möchte</li>
                  <li>soll</li>
                  <li>Haben</li>
                  <li>Ich möchte Hustensaft kaufen.</li>
                </ol>
              </div>
            ) : null}
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default A2Day17InDieApothekeModalverbenFragenGrammarPage;
