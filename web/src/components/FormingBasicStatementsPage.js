import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const Section = ({ title, children }) => (
  <div style={{ ...styles.card, display: "grid", gap: 12 }}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </div>
);

const BulletList = ({ items }) => (
  <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);

const Callout = ({ children, tone = "info" }) => {
  const palette =
    tone === "warning"
      ? { background: "#fff8f2", border: "#f08a24" }
      : { background: "#f4f6ff", border: "#5666f4" };

  return (
    <div
      style={{
        background: palette.background,
        borderLeft: `4px solid ${palette.border}`,
        borderRadius: 10,
        padding: "10px 12px",
        fontSize: 14,
        display: "grid",
        gap: 4,
      }}
    >
      {children}
    </div>
  );
};

const Table = ({ headers, rows }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {headers.map((header) => (
            <th
              key={header}
              style={{ textAlign: "left", padding: "8px 10px", borderBottom: "2px solid #e6e8ef", background: "#f7f8fb" }}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={`${row[0]}-${index}`}>
            {row.map((cell) => (
              <td key={cell} style={{ padding: "8px 10px", borderBottom: "1px solid #e6e8ef" }}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const FormingBasicStatementsPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>Forming Basic Statements in German (A1 Level)</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Day 8 Grammar: Countries and Languages (Chapter 4)</p>
      </div>

      <Section title="Assignment Focus">
        <p style={{ margin: 0 }}>
          <strong>schon mal, noch nie; irregular verbs; man vs Mann.</strong>
        </p>
      </Section>

      <Section title="Key Takeaways">
        <BulletList
          items={[
            "Use haben and sein in Präsens and Präteritum to talk about what you have/had and where you are/were.",
            "Use schon mal for positive past experience and noch nie for no experience until now.",
            "Use wo for location, woher for origin, and wohin for destination.",
            "Some verbs change vowels in du and er/sie/es forms: nimmst/nimmt, sprichst/spricht, isst.",
            "man is an indefinite pronoun; Mann is a noun meaning adult male person.",
          ]}
        />
      </Section>

      <Section title="haben and sein (Präsens + Präteritum)">
        <p style={{ margin: 0 }}>Main tenses (names only): Präsens, Perfekt, Präteritum, Plusquamperfekt, Futur I, Futur II.</p>
        <p style={{ margin: 0 }}>Today we focus on Präsens and Präteritum for <em>haben</em> and <em>sein</em>.</p>

        <h3 style={{ margin: 0 }}>haben (to have)</h3>
        <Table
          headers={["Pronoun", "Präsens", "Präteritum"]}
          rows={[
            ["ich", "habe", "hatte"],
            ["du", "hast", "hattest"],
            ["er/sie/es", "hat", "hatte"],
            ["wir", "haben", "hatten"],
            ["ihr", "habt", "hattet"],
            ["sie/Sie", "haben", "hatten"],
          ]}
        />

        <h3 style={{ margin: 0 }}>sein (to be)</h3>
        <Table
          headers={["Pronoun", "Präsens", "Präteritum"]}
          rows={[
            ["ich", "bin", "war"],
            ["du", "bist", "warst"],
            ["er/sie/es", "ist", "war"],
            ["wir", "sind", "waren"],
            ["ihr", "seid", "wart"],
            ["sie/Sie", "sind", "waren"],
          ]}
        />

        <BulletList
          items={[
            "Ich habe einen Stadtplan. / Ich hatte einen Stadtplan.",
            "Ich bin in Berlin. / Ich war in Berlin.",
            "Gestern hatte ich keinen Stadtplan.",
          ]}
        />
      </Section>

      <Section title="schon mal and noch nie">
        <BulletList
          items={[
            "schon mal = ever before / at least once before (positive experience).",
            "noch nie = never until now (negative experience).",
            "They usually stand in the middle of the sentence after the verb.",
          ]}
        />
        <p style={{ margin: 0 }}><strong>Perfekt:</strong> Bist du schon mal ... gewesen? / Ich bin noch nie ... gewesen.</p>
        <p style={{ margin: 0 }}><strong>Präteritum:</strong> Warst du schon mal ...? / Ich war noch nie in Deutschland.</p>
      </Section>

      <Section title="Countries and Languages (Mini Table)">
        <Table
          headers={["Country", "Language", "Example sentence"]}
          rows={[
            ["Deutschland", "Deutsch", "Ich spreche Deutsch."],
            ["Ghana", "Englisch", "In Ghana spricht man Englisch."],
            ["Türkei", "Türkisch", "Sie spricht Türkisch."],
            ["Spanien", "Spanisch", "Wir lernen Spanisch."],
            ["Frankreich", "Französisch", "Er spricht Französisch."],
          ]}
        />
      </Section>

      <Section title="Location Statements with liegen">
        <p style={{ margin: 0 }}>Use <em>liegen</em> to describe location:</p>
        <BulletList
          items={[
            "Berlin liegt im Osten von Deutschland.",
            "Köln liegt im Westen von Deutschland.",
            "München liegt im Süden von Deutschland.",
            "Hamburg liegt im Norden von Deutschland.",
          ]}
        />
      </Section>

      <Section title="wo, woher, wohin">
        <BulletList
          items={[
            "wo = where (location): Wo bist du? → Ich bin in der Schule.",
            "woher = where from (origin): Woher kommst du? → Ich komme aus Ghana.",
            "wohin = where to (direction): Wohin fliegst du? → Ich fliege nach Deutschland.",
          ]}
        />
        <Callout>
          Use <em>nach</em> for most cities/countries without article, but <em>in</em> + article for places like <em>die USA</em>.
        </Callout>
      </Section>

      <Section title="Irregular Verbs with Vowel Change">
        <p style={{ margin: 0 }}>In du and er/sie/es forms, these verbs change vowel in Präsens:</p>
        <Table
          headers={["Verb", "ich", "du", "er/sie/es", "wir/ihr/sie"]}
          rows={[
            ["nehmen", "nehme", "nimmst", "nimmt", "nehmen / nehmt / nehmen"],
            ["sprechen", "spreche", "sprichst", "spricht", "sprechen / sprecht / sprechen"],
            ["essen", "esse", "isst", "isst", "essen / esst / essen"],
          ]}
        />
      </Section>

      <Section title="man vs Mann">
        <BulletList
          items={[
            "man (pronoun) = one / people in general. Example: Man kann hier gut essen.",
            "Mann (noun) = adult male person. Example: Der Mann ist Lehrer.",
            "With verbs: Er/Sie/Es/man isst.",
          ]}
        />
      </Section>

      <Section title="Common Mistakes">
        <Callout tone="warning">
          <strong>Watch out for these:</strong>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li>❌ nach die USA → ✅ in die USA</li>
            <li>❌ Ich war noch nie in Berlin? (statement with question mark) → ✅ Ich war noch nie in Berlin.</li>
            <li>❌ Der man ist nett. → ✅ Der Mann ist nett. / ✅ Man ist hier freundlich.</li>
          </ul>
        </Callout>
      </Section>

      <Section title="Practice (with Answer Key)">
        <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
          <li>Gestern ____ ich keinen Stadtplan. (habe / hatte)</li>
          <li>Ich ____ in Accra. (bin / war) [Präsens]</li>
          <li>Warst du ____ in Berlin? (schon mal / noch nie)</li>
          <li>Nein, ich war ____ in Berlin. (schon mal / noch nie)</li>
          <li>____ kommst du? — Ich komme aus Ghana. (wo / woher / wohin)</li>
          <li>____ fährst du morgen? — Nach Berlin. (wo / woher / wohin)</li>
          <li>Du ____ sehr gut Deutsch. (sprichst / sprechst)</li>
          <li>Er ____ einen Apfel. (esst / isst)</li>
          <li>____ kann hier gut lernen. (Man / Mann)</li>
          <li>Der ____ ist mein Lehrer. (Man / Mann)</li>
        </ol>

        <Callout>
          <strong>Answer key:</strong> 1) hatte, 2) bin, 3) schon mal, 4) noch nie, 5) woher, 6) wohin, 7) sprichst, 8)
          isst, 9) Man, 10) Mann.
        </Callout>
      </Section>
    </div>
  );
};

export default FormingBasicStatementsPage;
