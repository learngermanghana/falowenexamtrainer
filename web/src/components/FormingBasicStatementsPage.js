import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

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

const IMG_GRAMMAR = "/grammar/past-tense-haben.svg";
const IMG_MAP = "/grammar/directions-german.svg";

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

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Lesson at a glance</h2>
        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
          <li>You can ask about travel experience with <strong>schon mal</strong> and <strong>noch nie</strong>.</li>
          <li>You can say where a city is with <strong>liegen</strong>.</li>
          <li>You can choose between <strong>wo</strong>, <strong>woher</strong>, and <strong>wohin</strong>.</li>
          <li>You can use key irregular verbs in short A1 statements.</li>
          <li>You can distinguish <strong>man</strong> (pronoun) and <strong>Mann</strong> (noun).</li>
        </ul>
      </section>

      <ImageBreak src={IMG_GRAMMAR} alt="Past tense haben conjugation" title="Grammar Notes" subtitle="Important A1 grammar points for day 8." />

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Grammar Focus (important information)</h2>
        <p style={{ margin: 0 }}>
          <strong>schon mal, noch nie; irregular verbs; man vs Mann.</strong>
        </p>
        <RuleCard title="Core sentence pattern" rule="Subject + Verb + Information." example="Ich war gestern krank." />
      </section>

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

        <RuleCard
          title="schon mal + noch nie"
          rule="Use war + schon mal / noch nie for life experience."
          example="Bist du schon mal in Deutschland gewesen? – Ja, ich war schon mal in Deutschland."
        >
          <div style={{ padding: 8, borderRadius: 8, background: "#eef6ff", border: "1px solid #bfdbfe" }}>
            <strong>Tip:</strong> The question is often in <strong>Perfekt</strong> (<em>Bist du ... gewesen?</em>), while short spoken answers often use <strong>war</strong>.
          </div>
        </RuleCard>
      </section>

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

        <RuleCard title="Try now (2 prompts)" rule="Answer with your own country/city." example="Warst du schon mal in Berlin?">
          <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 4 }}>
            <li>Write one <strong>Ja</strong>-answer with <em>schon mal</em>.</li>
            <li>Write one <strong>Nein</strong>-answer with <em>noch nie</em>.</li>
          </ol>
        </RuleCard>
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

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Irregular Verbs with Vowel Change</h2>

        <RuleCard title="Easy rule" rule="Many vowel changes happen in du + er/sie/es." example="fahren: du fährst, er fährt" />

        <TableScroll caption="Full conjugation (mobile-friendly view)">
          <thead>
            <tr>
              <th style={{ border: "1px solid #d1d5db", padding: 8, textAlign: "left" }}>Verb</th>
              <th style={{ border: "1px solid #d1d5db", padding: 8, textAlign: "left" }}>ich / wir / ihr / sie(Sie)</th>
              <th style={{ border: "1px solid #d1d5db", padding: 8, textAlign: "left" }}>du</th>
              <th style={{ border: "1px solid #d1d5db", padding: 8, textAlign: "left" }}>er/sie/es</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}><strong>nehmen</strong></td>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}>nehme / nehmen / nehmt / nehmen</td>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}>nimmst</td>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}>nimmt</td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}><strong>sprechen</strong></td>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}>spreche / sprechen / sprecht / sprechen</td>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}>sprichst</td>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}>spricht</td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}><strong>essen</strong></td>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}>esse / essen / esst / essen</td>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}>isst</td>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}>isst</td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}><strong>fahren</strong></td>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}>fahre / fahren / fahrt / fahren</td>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}>fährst</td>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}>fährt</td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}><strong>laufen</strong></td>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}>laufe / laufen / lauft / laufen</td>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}>läufst</td>
              <td style={{ border: "1px solid #d1d5db", padding: 8 }}>läuft</td>
            </tr>
          </tbody>
        </TableScroll>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>man vs Mann</h2>

        <div style={{ border: "1px solid #fecaca", background: "#fff1f2", borderLeft: "6px solid #ef4444", borderRadius: 10, padding: 12 }}>
          <strong>Common mistakes:</strong> <em>man</em> is a pronoun (lowercase), but <em>Mann</em> is a noun (capitalized).<br />
          Correction: <strong>Man spricht hier Deutsch.</strong> (not <strong>Mann spricht hier Deutsch.</strong>)
        </div>

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
