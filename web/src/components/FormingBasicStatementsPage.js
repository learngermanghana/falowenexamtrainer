import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

/** =========================
 *  Small UI blocks (notes-first)
 *  ========================= */
const sectionStyle = { ...styles.card, display: "grid", gap: 10 };

const chipStyle = {
  display: "inline-block",
  padding: "4px 8px",
  borderRadius: 999,
  background: "#eef2ff",
  border: "1px solid #c7d2fe",
  fontSize: 13,
  fontWeight: 700,
};

const ImageBreak = ({ src, alt, title, subtitle }) => (
  <div style={{ ...styles.card, padding: 0, overflow: "hidden" }}>
    <img
      src={src}
      alt={alt}
      loading="lazy"
      style={{
        width: "100%",
        height: "clamp(160px, 22vw, 220px)",
        objectFit: "cover",
        display: "block",
      }}
    />
    {(title || subtitle) && (
      <div style={{ padding: 12, display: "grid", gap: 4 }}>
        {title && <div style={{ fontWeight: 900 }}>{title}</div>}
        {subtitle && <div style={{ opacity: 0.85 }}>{subtitle}</div>}
      </div>
    )}
  </div>
);

const RuleCard = ({ title, rule, example, children }) => (
  <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, background: "#f8fafc" }}>
    <div style={{ fontWeight: 900, marginBottom: 8 }}>{title}</div>
    <div style={{ display: "grid", gap: 6 }}>
      <div>
        <strong>Rule:</strong> {rule}
      </div>
      <div>
        <strong>Example:</strong> <em>{example}</em>
      </div>
      {children ? <div style={{ marginTop: 6 }}>{children}</div> : null}
    </div>
  </div>
);

const TableScroll = ({ caption, children }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 520 }}>
      <caption style={{ textAlign: "left", paddingBottom: 8, fontWeight: 800 }}>{caption}</caption>
      {children}
    </table>
  </div>
);

/** =========================
 *  Free-to-use images
 *  ========================= */
const IMG_GRAMMAR = "/grammar/past-tense-haben.svg";
const IMG_TRAVEL = "/grammar/past-tense-sein.svg";
const IMG_MAP = "/grammar/directions-german.svg";
const IMG_SIMON = "/falo.png";

/** =========================
 *  Content
 *  ========================= */
const FormingBasicStatementsPage = () => {
  const navigate = useNavigate();


  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>Forming Basic Statements in German (A1)</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Day 8 Grammar: Countries and Languages (Chapter 4)</p>
      </header>

      <ImageBreak src={IMG_GRAMMAR} alt="Past tense haben conjugation" title="Grammar Notes" subtitle="Important A1 grammar points for day 8." />

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Grammar Focus (important information)</h2>
        <p style={{ margin: 0 }}>
          <strong>schon mal, noch nie; irregular verbs; man vs Mann.</strong>
        </p>
        <RuleCard title="Core sentence pattern" rule="Subject + Verb + Information." example="Ich war gestern krank." />
      </section>

      <ImageBreak src={IMG_TRAVEL} alt="Past tense sein conjugation" title="1) Präteritum for sein & haben" subtitle="Past tense forms to memorize first." />

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Past Tense for haben and sein (Präteritum)</h2>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          <span style={chipStyle}>Präsens</span>
          <span style={chipStyle}>Perfekt</span>
          <span style={chipStyle}>Präteritum</span>
          <span style={chipStyle}>Futur</span>
        </div>

        <RuleCard
          title="Must memorize"
          rule="sein/haben in Präteritum are very common in speaking."
          example="Ich war in Berlin. / Ich hatte keinen Stadtplan."
        >
          <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
            <li>
              <strong>haben:</strong> ich hatte, du hattest, er/sie/es hatte, wir hatten, ihr hattet, sie/Sie hatten
            </li>
            <li>
              <strong>sein:</strong> ich war, du warst, er/sie/es war, wir waren, ihr wart, sie/Sie waren
            </li>
          </ul>
        </RuleCard>

        <RuleCard title="schon mal + noch nie" rule="Use war + schon mal / noch nie for life experience." example="Bist du schon mal in Deutschland gewesen? – Ja, ich war schon mal in Deutschland." />
      </section>

      <ImageBreak src={IMG_TRAVEL} alt="Experience" title="2) schon mal / noch nie" subtitle="Talk about experiences." />

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>schon mal and noch nie</h2>

        <RuleCard
          title="Meaning"
          rule="schon mal = at least once before | noch nie = never until now"
          example="Warst du schon mal in Accra? – Ja, ich war schon mal in Accra."
        />

        <TableScroll caption="Copy patterns (A1)">
          <tbody>
            <tr>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}>Warst du schon mal in ...?</td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}>Ja, ich war schon mal in ... .</td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}>Nein, ich war noch nie in ... .</td>
            </tr>
          </tbody>
        </TableScroll>

        <TableScroll caption="Exam phrases with meaning (German + English)">
          <tbody>
            <tr>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}><strong>Warst du schon mal in Deutschland?</strong></td>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}>Have you ever been to Germany?</td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}><strong>Ja, ich war schon mal in Deutschland.</strong></td>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}>Yes, I have been to Germany before.</td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}><strong>Nein, ich war noch nie in Deutschland.</strong></td>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}>No, I have never been to Germany.</td>
            </tr>
          </tbody>
        </TableScroll>
      </section>

      <ImageBreak src={IMG_MAP} alt="Map" title="3) liegen (city location)" subtitle="Where is the city located?" />

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Location Statements with liegen</h2>

        <RuleCard title="liegen" rule="liegen = to be located (a city)." example="Berlin liegt im Osten von Deutschland." />

        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
          <li>Berlin liegt im Osten von Deutschland.</li>
          <li>Köln liegt im Westen von Deutschland.</li>
          <li>München liegt im Süden von Deutschland.</li>
          <li>Hamburg liegt im Norden von Deutschland.</li>
        </ul>

        <TableScroll caption="Location exam phrases with translation">
          <tbody>
            <tr>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}><strong>Wo liegt Berlin?</strong></td>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}>Where is Berlin located?</td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}><strong>Berlin liegt im Osten von Deutschland.</strong></td>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}>Berlin is in the east of Germany.</td>
            </tr>
          </tbody>
        </TableScroll>
      </section>

      <ImageBreak src={IMG_MAP} alt="Directions" title="4) wo / woher / wohin" subtitle="3 question words." />

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>wo, woher, wohin</h2>

        <RuleCard title="3 questions" rule="wo = location | woher = origin | wohin = direction" example="Wohin fährst du? – Ich fahre nach Berlin." />

        <TableScroll caption="Useful patterns">
          <tbody>
            <tr>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}><strong>Wo</strong> bist du? – Ich bin in der Schule.</td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}><strong>Wohin</strong> fährst du? – Ich fahre nach Berlin.</td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}><strong>Wohin</strong> fliegst du? – Ich fliege nach Deutschland.</td>
            </tr>
          </tbody>
        </TableScroll>

        <TableScroll caption="Exam question phrases with translation">
          <tbody>
            <tr>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}><strong>Wo wohnst du?</strong></td>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}>Where do you live?</td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}><strong>Woher kommst du?</strong></td>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}>Where are you from?</td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}><strong>Wohin gehst du heute?</strong></td>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}>Where are you going today?</td>
            </tr>
          </tbody>
        </TableScroll>

        <RuleCard
          title="nach vs in (A1)"
          rule="nach for no-article countries/cities. in + article for exceptions."
          example="nach Ghana / nach Berlin — but in die Schweiz, in die USA"
        />
      </section>

      <ImageBreak src={IMG_GRAMMAR} alt="Grammar" title="5) Irregular verbs with vowel change" subtitle="Conjugation focus for du and er/sie/es." />

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Irregular Verbs with Vowel Change</h2>

        <RuleCard title="Easy rule" rule="Many vowel changes happen in du + er/sie/es." example="fahren: du fährst, er fährt" />

        <TableScroll caption="Full conjugation (only du and er/sie/es change)">
          <tbody>
            <tr>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}>
                <strong>nehmen</strong>: ich nehme, <strong>du nimmst</strong>, <strong>er/sie/es nimmt</strong>, wir nehmen, ihr nehmt, sie/Sie nehmen
              </td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}>
                <strong>sprechen</strong>: ich spreche, <strong>du sprichst</strong>, <strong>er/sie/es spricht</strong>, wir sprechen, ihr sprecht, sie/Sie sprechen
              </td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}>
                <strong>essen</strong>: ich esse, <strong>du isst</strong>, <strong>er/sie/es isst</strong>, wir essen, ihr esst, sie/Sie essen
              </td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}>
                <strong>fahren</strong>: ich fahre, <strong>du fährst</strong>, <strong>er/sie/es fährt</strong>, wir fahren, ihr fahrt, sie/Sie fahren
              </td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}>
                <strong>laufen</strong>: ich laufe, <strong>du läufst</strong>, <strong>er/sie/es läuft</strong>, wir laufen, ihr lauft, sie/Sie laufen
              </td>
            </tr>
          </tbody>
        </TableScroll>
      </section>

      <ImageBreak src={IMG_SIMON} alt="Simon speaking German" title="6) man vs Mann" subtitle="One small word, big meaning." />

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>man vs Mann</h2>

        <RuleCard title="Difference" rule="man = people in general | Mann = a man (noun)" example="Man kann hier gut essen. / Der Mann ist Lehrer." />

        <TableScroll caption="A1 exam phrases with translation">
          <tbody>
            <tr>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}><strong>Man spricht hier Deutsch.</strong></td>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}>People speak German here.</td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}><strong>Der Mann heißt Simon.</strong></td>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}>The man's name is Simon.</td>
            </tr>
          </tbody>
        </TableScroll>

        <TableScroll caption="Conjugation with man (using essen)">
          <tbody>
            <tr><td style={{ border: "1px solid #d1d5db", padding: 8 }}>ich esse</td></tr>
            <tr><td style={{ border: "1px solid #d1d5db", padding: 8 }}>du isst</td></tr>
            <tr><td style={{ border: "1px solid #d1d5db", padding: 8 }}>er/sie/es/man isst</td></tr>
            <tr><td style={{ border: "1px solid #d1d5db", padding: 8 }}>wir essen</td></tr>
            <tr><td style={{ border: "1px solid #d1d5db", padding: 8 }}>ihr esst</td></tr>
            <tr><td style={{ border: "1px solid #d1d5db", padding: 8 }}>sie/Sie essen</td></tr>
          </tbody>
        </TableScroll>
      </section>

    </main>
  );
};

export default memo(FormingBasicStatementsPage);
