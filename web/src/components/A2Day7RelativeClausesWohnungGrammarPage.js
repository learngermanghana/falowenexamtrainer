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

const A2Day7RelativeClausesWohnungGrammarPage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.pageWrap}>
      <div style={styles.container}>
        <button type="button" onClick={() => navigate(-1)} style={styles.backBtn}>
          ← Back
        </button>

        <header style={{ marginBottom: 18 }}>
          <h1 style={{ margin: "0 0 8px" }}>A2 • 3.7 Eine Wohnung suchen</h1>
          <p style={{ margin: 0, opacity: 0.85 }}>
            Grammar focus: <strong>Relativsätze mit die / der / das</strong>
          </p>
        </header>

        <div style={{ display: "grid", gap: 14 }}>
          <SectionCard title="1) Was ist ein Relativsatz?">
            <p style={{ margin: 0 }}>
              A relative clause gives extra information about a noun. It starts with a relative pronoun like
              <InlineCode> der / die / das </InlineCode>
              and the conjugated verb goes to the end.
            </p>
            <p style={{ margin: 0 }}>
              Beispiel: <strong>Das ist die Wohnung, die sehr hell ist.</strong>
            </p>
          </SectionCard>

          <SectionCard title="2) Relative pronouns in Nominativ">
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>
                <InlineCode>der</InlineCode> → for masculine nouns
              </li>
              <li>
                <InlineCode>die</InlineCode> → for feminine nouns and plural nouns
              </li>
              <li>
                <InlineCode>das</InlineCode> → for neuter nouns
              </li>
            </ul>
            <p style={{ margin: 0 }}>
              The relative pronoun matches the noun in gender and number.
            </p>
          </SectionCard>

          <SectionCard title="3) Wohnung suchen examples (A2)">
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>Ich suche eine Wohnung, <strong>die</strong> nicht zu teuer ist.</li>
              <li>Der Makler, <strong>der</strong> heute anruft, ist sehr freundlich.</li>
              <li>Das Zimmer, <strong>das</strong> wir gesehen haben, ist sehr klein.</li>
              <li>Ich kenne Leute, <strong>die</strong> in Berlin eine WG suchen.</li>
            </ul>
          </SectionCard>

          <SectionCard title="4) Word order reminder">
            <p style={{ margin: 0 }}>
              Main clause + comma + relative clause. In the relative clause, the verb is at the end.
            </p>
            <p style={{ margin: 0 }}>
              Beispiel: <strong>Das ist ein Haus, das einen großen Balkon hat.</strong>
            </p>
          </SectionCard>

          <SectionCard title="5) Quick practice">
            <p style={{ margin: 0 }}>Combine these ideas with a relative clause:</p>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>Ich suche eine Wohnung. Die Wohnung hat drei Zimmer.</li>
              <li>Da ist ein Vermieter. Der Vermieter ist nett.</li>
              <li>Wir sehen ein Haus. Das Haus hat einen Garten.</li>
            </ul>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default memo(A2Day7RelativeClausesWohnungGrammarPage);
