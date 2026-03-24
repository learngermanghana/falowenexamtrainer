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
  maxHeight: 260,
  objectFit: "cover",
  borderRadius: 12,
  border: "1px solid rgba(148,163,184,0.35)",
};
const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  border: "1px solid rgba(148,163,184,0.45)",
  borderRadius: 10,
  overflow: "hidden",
};
const tableHeaderCellStyle = {
  textAlign: "left",
  padding: "10px 12px",
  background: "rgba(59,130,246,0.1)",
  borderBottom: "1px solid rgba(148,163,184,0.45)",
  fontWeight: 700,
};
const tableCellStyle = {
  padding: "10px 12px",
  borderBottom: "1px solid rgba(148,163,184,0.25)",
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
          <img
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=80"
            alt="People celebrating at a traditional festival in a city square"
            style={heroImageStyle}
            loading="lazy"
          />
          <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.72 }}>
            Header image source: Unsplash
          </p>
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
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Quick conjugation overview (ich bis Sie) with 4 high-frequency verbs:
            </p>
            <div style={{ overflowX: "auto" }}>
              <table style={tableStyle} aria-label="Präteritum conjugation table for key verbs">
                <thead>
                  <tr>
                    <th style={tableHeaderCellStyle}>Pronomen</th>
                    <th style={tableHeaderCellStyle}>sein</th>
                    <th style={tableHeaderCellStyle}>haben</th>
                    <th style={tableHeaderCellStyle}>reisen</th>
                    <th style={tableHeaderCellStyle}>feiern</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={tableCellStyle}>ich</td>
                    <td style={tableCellStyle}>war</td>
                    <td style={tableCellStyle}>hatte</td>
                    <td style={tableCellStyle}>reiste</td>
                    <td style={tableCellStyle}>feierte</td>
                  </tr>
                  <tr>
                    <td style={tableCellStyle}>du</td>
                    <td style={tableCellStyle}>warst</td>
                    <td style={tableCellStyle}>hattest</td>
                    <td style={tableCellStyle}>reistest</td>
                    <td style={tableCellStyle}>feiertest</td>
                  </tr>
                  <tr>
                    <td style={tableCellStyle}>er/sie/es</td>
                    <td style={tableCellStyle}>war</td>
                    <td style={tableCellStyle}>hatte</td>
                    <td style={tableCellStyle}>reiste</td>
                    <td style={tableCellStyle}>feierte</td>
                  </tr>
                  <tr>
                    <td style={tableCellStyle}>wir</td>
                    <td style={tableCellStyle}>waren</td>
                    <td style={tableCellStyle}>hatten</td>
                    <td style={tableCellStyle}>reisten</td>
                    <td style={tableCellStyle}>feierten</td>
                  </tr>
                  <tr>
                    <td style={tableCellStyle}>ihr</td>
                    <td style={tableCellStyle}>wart</td>
                    <td style={tableCellStyle}>hattet</td>
                    <td style={tableCellStyle}>reistet</td>
                    <td style={tableCellStyle}>feiertet</td>
                  </tr>
                  <tr>
                    <td style={{ ...tableCellStyle, borderBottom: "none" }}>sie/Sie</td>
                    <td style={{ ...tableCellStyle, borderBottom: "none" }}>waren</td>
                    <td style={{ ...tableCellStyle, borderBottom: "none" }}>hatten</td>
                    <td style={{ ...tableCellStyle, borderBottom: "none" }}>reisten</td>
                    <td style={{ ...tableCellStyle, borderBottom: "none" }}>feierten</td>
                  </tr>
                </tbody>
              </table>
            </div>
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

          <SectionCard title="6) Extra high-frequency verbs with examples">
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Add these verbs to your active vocabulary. They appear often in travel stories and festival reports.
            </p>
            <div style={exampleStyle}>
              <strong>Strong verbs</strong>
              <ul style={listStyle}>
                <li><InlineCode>finden → fand</InlineCode>: Wir <strong>fanden</strong> das Straßenfest sehr interessant.</li>
                <li><InlineCode>nehmen → nahm</InlineCode>: Ich <strong>nahm</strong> am Umzug teil.</li>
                <li><InlineCode>trinken → trank</InlineCode>: Er <strong>trank</strong> einen heißen Tee auf dem Markt.</li>
                <li><InlineCode>essen → aß</InlineCode>: Wir <strong>aßen</strong> traditionelle Spezialitäten.</li>
                <li><InlineCode>schreiben → schrieb</InlineCode>: Sie <strong>schrieb</strong> eine Postkarte aus Wien.</li>
              </ul>
            </div>
            <div style={noteStyle}>
              <strong>Regular verbs</strong>
              <ul style={listStyle}>
                <li><InlineCode>feiern → feierte</InlineCode>: Die Stadt <strong>feierte</strong> ein großes Kulturfest.</li>
                <li><InlineCode>besuchen → besuchte</InlineCode>: Wir <strong>besuchten</strong> ein kleines Museum.</li>
                <li><InlineCode>tanzen → tanzte</InlineCode>: Die Kinder <strong>tanzten</strong> auf dem Platz.</li>
                <li><InlineCode>spielen → spielte</InlineCode>: Eine Band <strong>spielte</strong> bis Mitternacht.</li>
                <li><InlineCode>kaufen → kaufte</InlineCode>: Ich <strong>kaufte</strong> ein Souvenir für meine Familie.</li>
              </ul>
            </div>
          </SectionCard>

          <SectionCard title="7) Knowledge test (Can you use Präteritum correctly?)">
            <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 8 }}>
              <li>
                Choose the correct form:
                <br />
                Letztes Wochenende ______ wir ein Stadtfest.
                <br />
                a) besuchen &nbsp; b) besuchten &nbsp; c) besucht
              </li>
              <li>
                Fill in the blank:
                <br />
                Ich ______ (sein) sehr müde nach der Reise.
              </li>
              <li>
                Fill in the blank:
                <br />
                Viele Gäste ______ (kommen) aus dem Ausland.
              </li>
              <li>
                Rewrite in Präteritum:
                <br />
                Heute: „Wir trinken Apfelsaft.“
                <br />
                Gestern: „Wir ______ Apfelsaft.“
              </li>
              <li>
                Build one complete sentence with <InlineCode>fahren → fuhr</InlineCode> and one travel place
                (z. B. Berlin, München, Hamburg).
              </li>
            </ol>
            <div style={noteStyle}>
              Answers: <strong>1-b, 2-war, 3-kamen, 4-tranken</strong>. Sample for 5:{" "}
              <strong>Letzten Sommer fuhr ich nach Hamburg.</strong>
            </div>
            <p style={{ margin: 0 }}>Continue with your workbook for 4.10, then move to chapter 4.11.</p>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default A2Day10PraeteritumGrammarPage;
