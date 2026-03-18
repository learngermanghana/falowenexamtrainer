import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { styles } from "../styles";

const cardStyle = { ...styles.card, display: "grid", gap: 12 };
const listStyle = { margin: 0, paddingLeft: 20, display: "grid", gap: 6 };
const chipRowStyle = { display: "flex", flexWrap: "wrap", gap: 8 };
const chipStyle = {
  padding: "6px 10px",
  borderRadius: 999,
  background: "rgba(59,130,246,0.12)",
  color: "#1d4ed8",
  fontWeight: 700,
  fontSize: 13,
};
const noteStyle = {
  borderRadius: 12,
  padding: 12,
  background: "rgba(99,102,241,0.08)",
  border: "1px solid rgba(99,102,241,0.18)",
};
const tableWrapStyle = {
  overflowX: "auto",
  borderRadius: 12,
  border: "1px solid rgba(0,0,0,0.08)",
};
const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: 640,
};
const thStyle = {
  textAlign: "left",
  padding: "12px 14px",
  background: "rgba(15,23,42,0.06)",
  borderBottom: "1px solid rgba(0,0,0,0.08)",
};
const tdStyle = {
  padding: "12px 14px",
  borderBottom: "1px solid rgba(0,0,0,0.08)",
  verticalAlign: "top",
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

const A2Day9PerfektGrammarPage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.pageWrap}>
      <div style={styles.container}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={styles.backBtn}
          aria-label="Go back"
        >
          ← Back
        </button>

        <header style={{ ...styles.card, display: "grid", gap: 10, marginBottom: 18 }}>
          <h1 style={{ margin: 0 }}>A2 • 4.9 Urlaub</h1>
          <p style={{ margin: 0, opacity: 0.85 }}>
            Grammar focus: <strong>Perfekt</strong>
          </p>
          <p style={{ margin: 0, opacity: 0.8, lineHeight: 1.7 }}>
            In German, we use different tenses to talk about now, the past, and actions that happened before
            another past action. This chapter focuses on <strong>Perfekt</strong>, because it is the most common
            spoken past tense in everyday German. In the <strong>next chapter</strong>, you will focus on
            <strong> Präteritum</strong>.
          </p>
        </header>

        <div style={{ display: "grid", gap: 14 }}>
          <SectionCard title="1) German tenses at a glance">
            <div style={chipRowStyle}>
              <span style={chipStyle}>Präsens = Present</span>
              <span style={chipStyle}>Perfekt = Present Perfect</span>
              <span style={chipStyle}>Präteritum = Simple Past</span>
              <span style={chipStyle}>Plusquamperfekt = Past Perfect</span>
            </div>

            <div style={tableWrapStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>German tense</th>
                    <th style={thStyle}>English explanation</th>
                    <th style={thStyle}>Easy idea</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={tdStyle}><strong>Präsens</strong></td>
                    <td style={tdStyle}>Present tense</td>
                    <td style={tdStyle}>Used for what is happening now or for general facts.</td>
                  </tr>
                  <tr>
                    <td style={tdStyle}><strong>Perfekt</strong></td>
                    <td style={tdStyle}>Present perfect</td>
                    <td style={tdStyle}>Used very often in spoken German to talk about completed past actions.</td>
                  </tr>
                  <tr>
                    <td style={tdStyle}><strong>Präteritum</strong></td>
                    <td style={tdStyle}>Simple past</td>
                    <td style={tdStyle}>Used more in writing, stories, and with common verbs like <InlineCode>sein</InlineCode> and <InlineCode>haben</InlineCode>.</td>
                  </tr>
                  <tr>
                    <td style={tdStyle}><strong>Plusquamperfekt</strong></td>
                    <td style={tdStyle}>Past perfect</td>
                    <td style={tdStyle}>Used for an action that happened before another action in the past.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={noteStyle}>
              <strong>This chapter:</strong> Perfekt.
              <br />
              <strong>Next chapter:</strong> Präteritum.
            </div>
          </SectionCard>

          <SectionCard title="2) What is Perfekt?">
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              <strong>Perfekt</strong> is the tense German speakers often use in conversation when they talk about
              the past.
            </p>
            <ul style={listStyle}>
              <li><strong>Ich habe Urlaub gemacht.</strong> = I went on vacation / I had a vacation.</li>
              <li><strong>Wir sind nach Berlin gefahren.</strong> = We traveled to Berlin.</li>
            </ul>
            <div style={noteStyle}>
              The basic structure is: <strong>subject + auxiliary verb + ... + past participle</strong>.
              <br />
              Example: <InlineCode>Ich habe am Wochenende gearbeitet.</InlineCode>
            </div>
          </SectionCard>

          <SectionCard title="3) Perfekt with haben">
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Most German verbs form Perfekt with <strong>haben</strong>.
            </p>
            <ul style={listStyle}>
              <li><InlineCode>ich habe gemacht</InlineCode> → I did / I have done</li>
              <li><InlineCode>du hast gelernt</InlineCode> → you learned / you have learned</li>
              <li><InlineCode>wir haben besucht</InlineCode> → we visited / we have visited</li>
            </ul>
            <div style={exampleStyle}>
              <strong>Examples:</strong>
              <br />
              Ich <strong>habe</strong> im Sommer viel <strong>fotografiert</strong>. = I took a lot of photos in summer.
              <br />
              Sie <strong>hat</strong> ein Hotel <strong>gebucht</strong>. = She booked a hotel.
            </div>
          </SectionCard>

          <SectionCard title="4) Perfekt with sein">
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Some verbs form Perfekt with <strong>sein</strong>. This often happens with verbs of movement or a
              change of state.
            </p>
            <ul style={listStyle}>
              <li><InlineCode>ich bin gefahren</InlineCode> → I went / traveled</li>
              <li><InlineCode>wir sind angekommen</InlineCode> → we arrived</li>
              <li><InlineCode>er ist eingeschlafen</InlineCode> → he fell asleep</li>
            </ul>
            <div style={noteStyle}>
              Common verbs with <strong>sein</strong>: <InlineCode>gehen</InlineCode>, <InlineCode>fahren</InlineCode>, <InlineCode>kommen</InlineCode>, <InlineCode>fliegen</InlineCode>, <InlineCode>ankommen</InlineCode>, <InlineCode>aufstehen</InlineCode>.
            </div>
            <div style={exampleStyle}>
              Wir <strong>sind</strong> spät <strong>angekommen</strong>. = We arrived late.
              <br />
              Ich <strong>bin</strong> nach Österreich <strong>gefahren</strong>. = I traveled to Austria.
            </div>
          </SectionCard>

          <SectionCard title="5) How to make the past participle (Partizip II)">
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Many regular verbs use the pattern <InlineCode>ge + verb stem + t</InlineCode>.
            </p>
            <ul style={listStyle}>
              <li><InlineCode>machen → gemacht</InlineCode></li>
              <li><InlineCode>lernen → gelernt</InlineCode></li>
              <li><InlineCode>spielen → gespielt</InlineCode></li>
            </ul>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Some strong or irregular verbs change and often end in <InlineCode>-en</InlineCode>.
            </p>
            <ul style={listStyle}>
              <li><InlineCode>fahren → gefahren</InlineCode></li>
              <li><InlineCode>sehen → gesehen</InlineCode></li>
              <li><InlineCode>schreiben → geschrieben</InlineCode></li>
            </ul>
          </SectionCard>

          <SectionCard title="6) Separable verbs in Perfekt">
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              With separable verbs, the prefix stays at the front of the participle, and <InlineCode>ge</InlineCode>
              goes between the prefix and the verb stem.
            </p>
            <ul style={listStyle}>
              <li><InlineCode>ankommen → angekommen</InlineCode></li>
              <li><InlineCode>aufstehen → aufgestanden</InlineCode></li>
              <li><InlineCode>einladen → eingeladen</InlineCode></li>
            </ul>
            <div style={exampleStyle}>
              Wir <strong>sind</strong> um 18 Uhr <strong>angekommen</strong>. = We arrived at 6 p.m.
              <br />
              Ich <strong>habe</strong> meine Freunde <strong>eingeladen</strong>. = I invited my friends.
            </div>
          </SectionCard>

          <SectionCard title="7) Word order in Perfekt sentences">
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              In a normal main clause, the auxiliary verb is in position 2, and the past participle goes to the end.
            </p>
            <ul style={listStyle}>
              <li><InlineCode>Ich habe letztes Jahr in München gearbeitet.</InlineCode></li>
              <li><InlineCode>Wir sind am Wochenende nach Hamburg gefahren.</InlineCode></li>
            </ul>
          </SectionCard>

          <SectionCard title="8) Quick summary for students">
            <ul style={listStyle}>
              <li><strong>Perfekt</strong> is very important for spoken German.</li>
              <li>Use <strong>haben</strong> with most verbs.</li>
              <li>Use <strong>sein</strong> with many movement verbs and change-of-state verbs.</li>
              <li>The past participle usually goes at the <strong>end</strong> of the sentence.</li>
              <li>With separable verbs, <InlineCode>ge</InlineCode> goes between the prefix and the verb stem.</li>
            </ul>
            <p style={{ margin: 0, opacity: 0.8 }}>
              After this chapter, continue to the next lesson to compare Perfekt with Präteritum in more detail.
            </p>
            <p style={{ margin: 0 }}>
              <Link to="/campus/course">Back to the course overview</Link>
            </p>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default A2Day9PerfektGrammarPage;
