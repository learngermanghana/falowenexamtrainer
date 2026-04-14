import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const cardStyle = { ...styles.card, display: "grid", gap: 12 };
const listStyle = { margin: 0, paddingLeft: 20, display: "grid", gap: 6 };
const patternStyle = {
  borderRadius: 12,
  padding: 12,
  background: "rgba(37,99,235,0.08)",
  border: "1px solid rgba(37,99,235,0.35)",
};
const heroImageStyle = {
  width: "100%",
  maxHeight: 260,
  objectFit: "cover",
  borderRadius: 12,
  border: "1px solid rgba(148,163,184,0.35)",
};
const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};
const tableCellStyle = {
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

const A2Day16WohlbefindenModalverbenGrammarPage = () => {
  const navigate = useNavigate();
  const [showAnswers, setShowAnswers] = useState(false);

  return (
    <div style={styles.pageWrap}>
      <div style={styles.container}>
        <button type="button" onClick={() => navigate(-1)} style={styles.backBtn} aria-label="Go back">
          ← Back
        </button>

        <header style={{ ...styles.card, display: "grid", gap: 10, marginBottom: 18 }}>
          <h1 style={{ margin: 0 }}>A2 • Day 16 · Wohlbefinden und Entspannung 6.16</h1>
          <img
            src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1400&q=80"
            alt="Person meditating in a calm place to support wellbeing and relaxation"
            style={heroImageStyle}
            loading="lazy"
          />
          <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.72 }}>Header image source: Unsplash</p>
          <p style={{ margin: 0, opacity: 0.9 }}>
            Grammar focus: <strong>Modalverben im Präsens</strong> (können, müssen, sollen, dürfen)
          </p>
        </header>

        <div style={{ display: "grid", gap: 14 }}>
          <SectionCard title="1) What are modal verbs?">
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Modal verbs change the meaning of another verb. They express ability, necessity, advice, or permission.
            </p>
            <div style={patternStyle}>
              <strong>Pattern:</strong> Subject + modal verb (position 2) + ... + main verb in infinitive (at the end)
              <br />
              Example: <strong>Ich muss heute früh schlafen.</strong>
            </div>
          </SectionCard>

          <SectionCard title="2) Core A2 modal verbs for wellbeing topics">
            <div style={{ overflowX: "auto" }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={tableCellStyle}>Modalverb</th>
                    <th style={tableCellStyle}>Meaning</th>
                    <th style={tableCellStyle}>Well-being example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={tableCellStyle}>
                      <strong>können</strong>
                    </td>
                    <td style={tableCellStyle}>can / be able to</td>
                    <td style={tableCellStyle}>Ich kann jeden Abend 20 Minuten spazieren gehen.</td>
                  </tr>
                  <tr>
                    <td style={tableCellStyle}>
                      <strong>müssen</strong>
                    </td>
                    <td style={tableCellStyle}>must / have to</td>
                    <td style={tableCellStyle}>Wir müssen genug Wasser trinken.</td>
                  </tr>
                  <tr>
                    <td style={tableCellStyle}>
                      <strong>sollen</strong>
                    </td>
                    <td style={tableCellStyle}>should</td>
                    <td style={tableCellStyle}>Du sollst weniger Stress haben und Pausen machen.</td>
                  </tr>
                  <tr>
                    <td style={tableCellStyle}>
                      <strong>dürfen</strong>
                    </td>
                    <td style={tableCellStyle}>may / be allowed to</td>
                    <td style={tableCellStyle}>Ich darf nach der Therapie wieder Sport machen.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </SectionCard>

          <SectionCard title="3) Conjugation quick view (Präsens)">
            <ul style={listStyle}>
              <li>
                <strong>können:</strong> ich kann, du kannst, er/sie/es kann, wir können, ihr könnt, sie/Sie können
              </li>
              <li>
                <strong>müssen:</strong> ich muss, du musst, er/sie/es muss, wir müssen, ihr müsst, sie/Sie müssen
              </li>
              <li>
                <strong>sollen:</strong> ich soll, du sollst, er/sie/es soll, wir sollen, ihr sollt, sie/Sie sollen
              </li>
              <li>
                <strong>dürfen:</strong> ich darf, du darfst, er/sie/es darf, wir dürfen, ihr dürft, sie/Sie dürfen
              </li>
            </ul>
          </SectionCard>

          <SectionCard title="4) Common sentence models for Day 16">
            <ul style={listStyle}>
              <li>
                <strong>Gesundheit:</strong> Ich muss mehr schlafen, weil ich oft müde bin.
              </li>
              <li>
                <strong>Entspannung:</strong> Am Wochenende kann ich Yoga machen.
              </li>
              <li>
                <strong>Arztbesuch:</strong> Du sollst zum Arzt gehen, wenn du starke Kopfschmerzen hast.
              </li>
              <li>
                <strong>Regeln/Erlaubnis:</strong> Nach der Untersuchung darf ich wieder arbeiten.
              </li>
            </ul>
          </SectionCard>

          <SectionCard title="5) Knowledge test (A2)">
            <ol style={{ margin: 0, paddingLeft: 22, display: "grid", gap: 8 }}>
              <li>Ich ___ heute früher ins Bett gehen. (muss / kann)</li>
              <li>Wir ___ im Park joggen, wenn das Wetter gut ist. (können / sollen)</li>
              <li>Du ___ mehr Wasser trinken, sagt der Arzt. (sollst / darfst)</li>
              <li>Nach der Therapie ___ sie wieder schwimmen. (darf / muss)</li>
              <li>Choose the correct word order: A) Ich muss heute mehr entspannen. B) Ich muss entspannen heute mehr.</li>
            </ol>

            <button type="button" onClick={() => setShowAnswers((prev) => !prev)} style={styles.secondaryBtn}>
              {showAnswers ? "Hide answers" : "Show answers"}
            </button>

            {showAnswers ? (
              <div style={{ border: "1px solid rgba(148,163,184,0.35)", borderRadius: 10, padding: 12 }}>
                <strong>Answers:</strong>
                <ol style={{ margin: "8px 0 0", paddingLeft: 18, display: "grid", gap: 6 }}>
                  <li>muss</li>
                  <li>können</li>
                  <li>sollst</li>
                  <li>darf</li>
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

export default A2Day16WohlbefindenModalverbenGrammarPage;
