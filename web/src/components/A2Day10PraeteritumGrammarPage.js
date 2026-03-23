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

const SectionCard = ({ title, children }) => (
  <section style={cardStyle} aria-label={title}>
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

const A2Day10PraeteritumGrammarPage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.pageWrap}>
      <div style={styles.container}>
        <button type="button" onClick={() => navigate(-1)} style={styles.backBtn} aria-label="Go back">
          ← Back
        </button>

        <header style={{ ...styles.card, display: "grid", gap: 10, marginBottom: 18 }}>
          <h1 style={{ margin: 0 }}>A2 • 4.10 Tourismus und traditionelle Feste</h1>
          <p style={{ margin: 0, opacity: 0.85 }}>
            Grammar focus: <strong>Präteritum</strong>
          </p>
          <p style={{ margin: 0, opacity: 0.85, lineHeight: 1.7 }}>
            In lesson 4.9, you learned <strong>Perfekt</strong> for spoken past events. Now you add
            <strong> Präteritum</strong>, which is very common in stories, reports, and with verbs like
            <InlineCode> sein</InlineCode> and <InlineCode>haben</InlineCode>.
          </p>
        </header>

        <div style={{ display: "grid", gap: 14 }}>
          <SectionCard title="1) Perfekt → Präteritum: quick transition">
            <ul style={listStyle}>
              <li><strong>Perfekt</strong>: most common in daily conversation.</li>
              <li><strong>Präteritum</strong>: common in written texts and storytelling.</li>
              <li>In spoken German, <InlineCode>sein</InlineCode> and <InlineCode>haben</InlineCode> are often used in Präteritum.</li>
            </ul>
            <div style={noteStyle}>
              Think: <strong>Perfekt for speaking</strong>, <strong>Präteritum for reading/writing</strong>.
              Both describe completed actions in the past.
            </div>
          </SectionCard>

          <SectionCard title="2) Präteritum of sein and haben (very important)">
            <ul style={listStyle}>
              <li><InlineCode>ich war</InlineCode> (I was)</li>
              <li><InlineCode>du warst</InlineCode> (you were)</li>
              <li><InlineCode>er/sie/es war</InlineCode> (he/she/it was)</li>
              <li><InlineCode>wir waren</InlineCode> (we were)</li>
              <li><InlineCode>ihr wart</InlineCode> (you were)</li>
              <li><InlineCode>sie/Sie waren</InlineCode> (they/you formal were)</li>
            </ul>
            <ul style={listStyle}>
              <li><InlineCode>ich hatte</InlineCode> (I had)</li>
              <li><InlineCode>du hattest</InlineCode> (you had)</li>
              <li><InlineCode>wir hatten</InlineCode> (we had)</li>
            </ul>
          </SectionCard>

          <SectionCard title="3) Regular verbs in Präteritum">
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              For many regular verbs, use the stem + <InlineCode>-te</InlineCode> endings.
            </p>
            <div style={exampleStyle}>
              <strong>machen</strong> → ich <strong>machte</strong>, du <strong>machtest</strong>, wir <strong>machten</strong>
              <br />
              <strong>lernen</strong> → ich <strong>lernte</strong>, er <strong>lernte</strong>
            </div>
          </SectionCard>

          <SectionCard title="4) Strong verbs (learn common forms)">
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Strong verbs often change the vowel and do not use <InlineCode>-te</InlineCode>.
            </p>
            <ul style={listStyle}>
              <li><InlineCode>gehen → ging</InlineCode></li>
              <li><InlineCode>kommen → kam</InlineCode></li>
              <li><InlineCode>fahren → fuhr</InlineCode></li>
              <li><InlineCode>sehen → sah</InlineCode></li>
            </ul>
          </SectionCard>

          <SectionCard title="5) Präteritum examples for this topic (Tourismus/Feste)">
            <ul style={listStyle}>
              <li>Letztes Jahr <strong>war</strong> ich in Berlin.</li>
              <li>Wir <strong>hatten</strong> viele Gäste beim Fest.</li>
              <li>Die Touristen <strong>kamen</strong> aus verschiedenen Ländern.</li>
              <li>Am Abend <strong>gab</strong> es Musik und Tanz.</li>
              <li>Ich <strong>machte</strong> viele Fotos vom Umzug.</li>
            </ul>
          </SectionCard>

          <SectionCard title="6) Mini self-check">
            <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
              <li>Heute ich bin müde. → Gestern ich ____ müde.</li>
              <li>Wir haben ein Fest. → Letztes Jahr wir ____ ein Fest.</li>
              <li>Sie gehen nach Köln. → Am Wochenende sie ____ nach Köln.</li>
            </ol>
            <div style={noteStyle}>
              Answers: <strong>war, hatten, gingen</strong>
            </div>
            <p style={{ margin: 0 }}>Continue with your workbook for 4.10, then move to chapter 4.11.</p>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default A2Day10PraeteritumGrammarPage;
