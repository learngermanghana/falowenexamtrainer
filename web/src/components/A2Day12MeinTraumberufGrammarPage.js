import React from "react";

const pageStyle = {
  maxWidth: 960,
  margin: "0 auto",
  padding: "32px 20px 56px",
  color: "#111827",
  lineHeight: 1.65,
};

const cardStyle = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 20,
  marginBottom: 16,
  boxShadow: "0 8px 28px rgba(15, 23, 42, 0.06)",
};

const headingStyle = {
  marginTop: 0,
  marginBottom: 8,
  fontSize: "1.7rem",
  lineHeight: 1.2,
};

const chipStyle = {
  display: "inline-block",
  padding: "6px 10px",
  borderRadius: 999,
  background: "#eef2ff",
  color: "#3730a3",
  fontWeight: 700,
  fontSize: 13,
  marginRight: 8,
  marginBottom: 8,
};

const codeStyle = {
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  background: "#f3f4f6",
  borderRadius: 8,
  padding: "2px 6px",
};

const heroImageStyle = {
  width: "100%",
  maxHeight: 340,
  objectFit: "cover",
  borderRadius: 14,
  border: "1px solid #e5e7eb",
  margin: "8px 0 14px",
};

const A2Day12MeinTraumberufGrammarPage = () => {
  return (
    <div style={pageStyle}>
      <h1 style={headingStyle}>A2 Grammar Notes: Mein Traumberuf (5.12)</h1>
      <img
        src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80"
        alt="Students and professionals discussing future career goals"
        style={heroImageStyle}
        loading="lazy"
      />
      <p>
        In this lesson, focus on talking about your dream job with <strong>Modalverben</strong> and
        clear reasons/opinions with <strong>weil</strong> and <strong>dass</strong> clauses.
      </p>

      <section style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>1) Modalverben: möchten / wollen / können</h2>
        <div>
          <span style={chipStyle}>möchten = would like to (polite)</span>
          <span style={chipStyle}>wollen = want to (strong intention)</span>
          <span style={chipStyle}>können = can / to be able to</span>
        </div>
        <ul>
          <li>
            Word order in main clauses: <span style={codeStyle}>Subject + modal verb + ... + infinitive</span>
          </li>
          <li>
            Example: <em>Ich möchte später als Designerin arbeiten.</em>
          </li>
          <li>
            Example: <em>Ich will Menschen helfen.</em>
          </li>
          <li>
            Example: <em>Ich kann gut mit Kindern arbeiten.</em>
          </li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>2) Nebensätze mit weil (reason)</h2>
        <p>
          <strong>weil</strong> introduces a subordinate clause. In this clause, the conjugated verb goes
          to the end.
        </p>
        <p style={{ marginBottom: 8 }}>
          Pattern: <span style={codeStyle}>Hauptsatz, weil + Subjekt + ... + Verb.</span>
        </p>
        <ul>
          <li>
            <em>Ich möchte Ärztin werden, weil ich Menschen helfen will.</em>
          </li>
          <li>
            <em>Ich will im Team arbeiten, weil ich gern mit anderen lerne.</em>
          </li>
          <li>
            <em>Ich kann diesen Beruf gut machen, weil ich sehr organisiert bin.</em>
          </li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>3) Nebensätze mit dass (opinion/statement)</h2>
        <p>
          Use <strong>dass</strong> after phrases like <em>Ich denke</em>, <em>Ich glaube</em>, <em>Ich finde</em>.
          In the <strong>dass</strong>-clause, the conjugated verb also goes to the end.
        </p>
        <p style={{ marginBottom: 8 }}>
          Pattern: <span style={codeStyle}>Ich denke/glaube/finde, dass + Subjekt + ... + Verb.</span>
        </p>
        <ul>
          <li>
            <em>Ich denke, dass mein Traumberuf kreativ ist.</em>
          </li>
          <li>
            <em>Ich glaube, dass ich in diesem Beruf viel lernen kann.</em>
          </li>
          <li>
            <em>Ich finde, dass gute Kommunikation sehr wichtig ist.</em>
          </li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>4) Useful A2 sentence starters for Mein Traumberuf</h2>
        <ul>
          <li>
            <em>Mein Traumberuf ist ...</em>
          </li>
          <li>
            <em>Ich möchte ... werden, weil ...</em>
          </li>
          <li>
            <em>Ich will ... , weil ...</em>
          </li>
          <li>
            <em>Ich kann ... gut, deshalb passt dieser Beruf zu mir.</em>
          </li>
          <li>
            <em>Ich denke, dass ...</em>
          </li>
          <li>
            <em>Ich glaube, dass ...</em>
          </li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>5) Knowledge test</h2>
        <ol style={{ margin: 0, paddingLeft: 22, display: "grid", gap: 8 }}>
          <li>
            Complete: <em>Ich ____ Ärztin werden, weil ich Menschen helfen will.</em>
          </li>
          <li>
            Complete: <em>Ich denke, dass mein Traumberuf sehr kreativ ____.</em>
          </li>
          <li>
            Build one sentence with <strong>weil</strong> about your dream job.
          </li>
          <li>
            Build one sentence with <strong>dass</strong> using <em>Ich glaube...</em>
          </li>
        </ol>
        <p style={{ marginTop: 12, marginBottom: 0 }}>
          Suggested answers: <strong>möchte, ist</strong> + your own correct <strong>weil</strong>/<strong>dass</strong>{" "}
          sentences with the conjugated verb at the end of the subordinate clause.
        </p>
      </section>
    </div>
  );
};

export default A2Day12MeinTraumberufGrammarPage;
