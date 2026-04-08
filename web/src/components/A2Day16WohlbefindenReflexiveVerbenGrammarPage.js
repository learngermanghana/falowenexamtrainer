import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const cardStyle = { ...styles.card, display: "grid", gap: 12 };
const listStyle = { margin: 0, paddingLeft: 20, display: "grid", gap: 6 };
const patternStyle = {
  borderRadius: 12,
  padding: 12,
  background: "rgba(16,185,129,0.1)",
  border: "1px solid rgba(16,185,129,0.35)",
};
const heroImageStyle = {
  width: "100%",
  maxHeight: 260,
  objectFit: "cover",
  borderRadius: 12,
  border: "1px solid rgba(148,163,184,0.35)",
};
const compareTableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};
const compareCellStyle = {
  textAlign: "left",
  padding: "8px 10px",
  borderBottom: "1px solid rgba(148,163,184,0.35)",
  verticalAlign: "top",
};

const SectionCard = ({ title, children }) => (
  <section style={cardStyle} aria-label={title}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const A2Day16WohlbefindenReflexiveVerbenGrammarPage = () => {
  const navigate = useNavigate();
  const [showAnswers, setShowAnswers] = useState(false);

  return (
    <div style={styles.pageWrap}>
      <div style={styles.container}>
        <button type="button" onClick={() => navigate(-1)} style={styles.backBtn} aria-label="Go back">
          ← Back
        </button>

        <header style={{ ...styles.card, display: "grid", gap: 10, marginBottom: 18 }}>
          <h1 style={{ margin: 0 }}>A2 • 6.16 Wohlbefinden und Entspannung</h1>
          <img
            src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1400&q=80"
            alt="Person meditating in a calm place to support wellbeing and relaxation"
            style={heroImageStyle}
            loading="lazy"
          />
          <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.72 }}>Header image source: Unsplash</p>
          <p style={{ margin: 0, opacity: 0.9 }}>
            Grammar focus: <strong>Reflexive Verben im Präsens</strong>
          </p>
        </header>

        <div style={{ display: "grid", gap: 14 }}>
          <SectionCard title="1) What are reflexive verbs?">
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Reflexive verbs use a reflexive pronoun. The action goes back to the subject:
              <strong> ich entspanne mich</strong>.
            </p>
            <div style={patternStyle}>
              <strong>Pattern:</strong> Subject + conjugated verb + reflexive pronoun
              <br />
              Example: <strong>Ich erhole mich am Wochenende.</strong>
            </div>
          </SectionCard>

          <SectionCard title="2) Reflexive pronouns: accusative and dative (A2)">
            <p style={{ margin: 0 }}>
              In A2, you mostly see reflexive pronouns in the <strong>accusative</strong>. But with some verbs or
              sentence structures, you also need the <strong>dative</strong> form.
            </p>
            <div style={{ overflowX: "auto" }}>
              <table style={compareTableStyle}>
                <thead>
                  <tr>
                    <th style={compareCellStyle}>Person</th>
                    <th style={compareCellStyle}>Akkusativ</th>
                    <th style={compareCellStyle}>Dativ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={compareCellStyle}>ich</td>
                    <td style={compareCellStyle}>
                      <strong>mich</strong>
                    </td>
                    <td style={compareCellStyle}>
                      <strong>mir</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style={compareCellStyle}>du</td>
                    <td style={compareCellStyle}>
                      <strong>dich</strong>
                    </td>
                    <td style={compareCellStyle}>
                      <strong>dir</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style={compareCellStyle}>er/sie/es</td>
                    <td style={compareCellStyle}>
                      <strong>sich</strong>
                    </td>
                    <td style={compareCellStyle}>
                      <strong>sich</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style={compareCellStyle}>wir</td>
                    <td style={compareCellStyle}>
                      <strong>uns</strong>
                    </td>
                    <td style={compareCellStyle}>
                      <strong>uns</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style={compareCellStyle}>ihr</td>
                    <td style={compareCellStyle}>
                      <strong>euch</strong>
                    </td>
                    <td style={compareCellStyle}>
                      <strong>euch</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style={compareCellStyle}>sie/Sie</td>
                    <td style={compareCellStyle}>
                      <strong>sich</strong>
                    </td>
                    <td style={compareCellStyle}>
                      <strong>sich</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <ul style={listStyle}>
              <li>
                <strong>Ich entspanne mich.</strong> (Akkusativ: no extra object)
              </li>
              <li>
                <strong>Ich wasche mir die Hände.</strong> (Dativ reflexive pronoun + extra object in Akkusativ)
              </li>
              <li>
                <strong>Du merkst dir den Termin.</strong> (Dativ reflexive pronoun + Akkusativ object)
              </li>
              <li>
                <strong>Wir machen uns einen Tee.</strong> (Dativ reflexive pronoun + Akkusativ object)
              </li>
            </ul>
            <p style={{ margin: 0 }}>
              Quick comparison: <strong>mich</strong> is accusative, <strong>mir</strong> is dative.
            </p>
          </SectionCard>

          <SectionCard title="3) Common reflexive verbs for wellbeing">
            <ul style={listStyle}>
              <li>
                <strong>sich entspannen</strong> → Ich entspanne <strong>mich</strong> nach der Arbeit.
              </li>
              <li>→ Nach dem Kurs entspannen wir <strong>uns</strong> im Park.</li>
              <li>
                <strong>sich erholen</strong> → Wir erholen <strong>uns</strong> am See.
              </li>
              <li>→ Er erholt <strong>sich</strong> am Wochenende zu Hause.</li>
              <li>
                <strong>sich ausruhen</strong> → Du ruhst <strong>dich</strong> heute aus.
              </li>
              <li>→ Ich ruhe <strong>mich</strong> nach dem Sport aus.</li>
              <li>
                <strong>sich wohlfühlen</strong> → Sie fühlt <strong>sich</strong> zu Hause wohl.
              </li>
              <li>→ Fühlt ihr <strong>euch</strong> in der neuen Wohnung wohl?</li>
              <li>
                <strong>sich konzentrieren (auf + Akk.)</strong> → Ich konzentriere <strong>mich</strong> auf meine Atmung.
              </li>
              <li>→ Bitte konzentriert <strong>euch</strong> auf die Übung.</li>
            </ul>
          </SectionCard>

          <SectionCard title="4) Word order tip">
            <p style={{ margin: 0 }}>
              In a main clause, the verb is in position 2. The reflexive pronoun usually comes directly after the
              verb.
            </p>
            <ul style={listStyle}>
              <li>Heute <strong>entspanne</strong> ich <strong>mich</strong> im Park.</li>
              <li>Am Abend <strong>ruhen</strong> wir <strong>uns</strong> aus.</li>
            </ul>
          </SectionCard>

          <SectionCard title="5) Knowledge test">
            <ol style={{ margin: 0, paddingLeft: 22, display: "grid", gap: 8 }}>
              <li>Ich entspanne ___ nach dem Yoga. (mich / sich)</li>
              <li>Ihr ruht ___ am Wochenende aus. (euch / uns)</li>
              <li>Wir erholen ___ in den Bergen. (sich / uns)</li>
              <li>Er konzentriert ___ auf die Musik. (dich / sich)</li>
              <li>Choose the correct sentence: A) Ich fühle mich heute sehr wohl. B) Ich fühle heute mich sehr wohl.</li>
            </ol>

            <button type="button" onClick={() => setShowAnswers((prev) => !prev)} style={styles.secondaryBtn}>
              {showAnswers ? "Hide answers" : "Show answers"}
            </button>

            {showAnswers ? (
              <div style={{ border: "1px solid rgba(148,163,184,0.35)", borderRadius: 10, padding: 12 }}>
                <strong>Answers:</strong>
                <ol style={{ margin: "8px 0 0", paddingLeft: 18, display: "grid", gap: 6 }}>
                  <li>mich</li>
                  <li>euch</li>
                  <li>uns</li>
                  <li>sich</li>
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

export default A2Day16WohlbefindenReflexiveVerbenGrammarPage;
