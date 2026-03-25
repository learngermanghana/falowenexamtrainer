import React from "react";
import { useNavigate } from "react-router-dom";
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
const tableWrapStyle = {
  overflowX: "auto",
};
const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: 760,
};
const thStyle = {
  textAlign: "left",
  padding: "10px 12px",
  borderBottom: "1px solid rgba(15,23,42,0.14)",
  fontWeight: 700,
  background: "rgba(15,23,42,0.04)",
  whiteSpace: "nowrap",
};
const tdStyle = {
  padding: "10px 12px",
  borderBottom: "1px solid rgba(15,23,42,0.1)",
  verticalAlign: "top",
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
  const navigate = useNavigate();

  return (
    <div style={styles.pageWrap}>
      <div style={styles.container}>
        <button type="button" onClick={() => navigate(-1)} style={styles.backBtn} aria-label="Go back">
          ← Back
        </button>

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
              Typical endings: <InlineCode>schnell → schneller → am schnellsten</InlineCode>
            </div>
          </SectionCard>

          <SectionCard title="2) Useful transport comparisons">
            <div style={exampleStyle}>
              Das Fahrrad ist <strong>günstiger als</strong> das Auto.<br />
              Der Zug ist oft <strong>schneller als</strong> der Bus.<br />
              Das Flugzeug ist <strong>am schnellsten</strong>.
            </div>
          </SectionCard>

          <SectionCard title="3) Important irregular forms">
            <ul style={listStyle}>
              <li><InlineCode>gut → besser → am besten</InlineCode></li>
              <li><InlineCode>viel → mehr → am meisten</InlineCode></li>
              <li><InlineCode>gern → lieber → am liebsten</InlineCode></li>
              <li><InlineCode>hoch → höher → am höchsten</InlineCode></li>
            </ul>
          </SectionCard>

          <SectionCard title="4) Irregular verbs in Präteritum (full pronouns)">
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Besides regular verbs, here are important <strong>irregular verbs</strong> in Präteritum so you can
              practice all pronouns from <InlineCode>ich</InlineCode> to <InlineCode>sie/Sie</InlineCode>.
            </p>
            <div style={tableWrapStyle}>
              <table style={tableStyle} aria-label="Irregular verbs in Präteritum with full pronouns">
                <thead>
                  <tr>
                    <th style={thStyle}>Pronomen</th>
                    <th style={thStyle}>fahren</th>
                    <th style={thStyle}>gehen</th>
                    <th style={thStyle}>sehen</th>
                    <th style={thStyle}>nehmen</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={tdStyle}><strong>ich</strong></td>
                    <td style={tdStyle}>fuhr</td>
                    <td style={tdStyle}>ging</td>
                    <td style={tdStyle}>sah</td>
                    <td style={tdStyle}>nahm</td>
                  </tr>
                  <tr>
                    <td style={tdStyle}><strong>du</strong></td>
                    <td style={tdStyle}>fuhrst</td>
                    <td style={tdStyle}>gingst</td>
                    <td style={tdStyle}>sahst</td>
                    <td style={tdStyle}>nahmst</td>
                  </tr>
                  <tr>
                    <td style={tdStyle}><strong>er/sie/es</strong></td>
                    <td style={tdStyle}>fuhr</td>
                    <td style={tdStyle}>ging</td>
                    <td style={tdStyle}>sah</td>
                    <td style={tdStyle}>nahm</td>
                  </tr>
                  <tr>
                    <td style={tdStyle}><strong>wir</strong></td>
                    <td style={tdStyle}>fuhren</td>
                    <td style={tdStyle}>gingen</td>
                    <td style={tdStyle}>sahen</td>
                    <td style={tdStyle}>nahmen</td>
                  </tr>
                  <tr>
                    <td style={tdStyle}><strong>ihr</strong></td>
                    <td style={tdStyle}>fuhrt</td>
                    <td style={tdStyle}>gingt</td>
                    <td style={tdStyle}>saht</td>
                    <td style={tdStyle}>nahmt</td>
                  </tr>
                  <tr>
                    <td style={tdStyle}><strong>sie/Sie</strong></td>
                    <td style={tdStyle}>fuhren</td>
                    <td style={tdStyle}>gingen</td>
                    <td style={tdStyle}>sahen</td>
                    <td style={tdStyle}>nahmen</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={noteStyle}>
              Tip: Irregular Präteritum stems change (<InlineCode>fahr- → fuhr-</InlineCode>,
              <InlineCode> seh- → sah-</InlineCode>). Memorize them as a block.
            </div>
          </SectionCard>

          <SectionCard title="5) Sentence patterns for A2 speaking/writing">
            <ul style={listStyle}>
              <li><InlineCode>X ist + Komparativ + als Y.</InlineCode></li>
              <li><InlineCode>Ich finde X + Komparativ, weil ...</InlineCode></li>
              <li><InlineCode>Von allen Verkehrsmitteln ist X am ...sten.</InlineCode></li>
              <li><InlineCode>Für die Umwelt ist X besser als Y.</InlineCode></li>
            </ul>
          </SectionCard>

          <SectionCard title="6) Mini self-check">
            <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
              <li>Der Bus ist (langsam) _______ als die U-Bahn.</li>
              <li>Von allen ist das Fahrrad (umweltfreundlich) am _______.</li>
              <li>Für lange Strecken ist der Zug (gut) _______ als das Auto.</li>
            </ol>
            <div style={noteStyle}>
              Answers: <strong>langsamer, umweltfreundlichsten, besser</strong>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default A2Day11ComparativeFormsGrammarPage;
