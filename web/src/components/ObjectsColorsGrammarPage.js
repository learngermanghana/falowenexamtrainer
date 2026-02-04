import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const Section = ({ title, children }) => (
  <section style={{ ...styles.card, display: "grid", gap: 12 }}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const BulletList = ({ items }) => (
  <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);

const Callout = ({ children }) => (
  <div
    style={{
      background: "#f8fafc",
      borderLeft: "4px solid #0ea5e9",
      borderRadius: 10,
      padding: "10px 12px",
      fontSize: 14,
      display: "grid",
      gap: 6,
    }}
  >
    {children}
  </div>
);

const Table = ({ headers, rows }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
      <thead>
        <tr>
          {headers.map((header) => (
            <th
              key={header}
              style={{
                textAlign: "left",
                padding: "8px 10px",
                borderBottom: "1px solid #e5e7eb",
                background: "#f9fafb",
              }}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.join("-")}>
            {row.map((cell, index) => (
              <td key={`${row[0]}-${index}`} style={{ padding: "8px 10px", borderBottom: "1px solid #f1f5f9" }}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ObjectsColorsGrammarPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>Day 10: Objects and Colors</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Chapter 6 — Grammar note on possessive articles, indefinite articles, and adjective intensity.
        </p>
      </div>

      <Section title="1) Possessive Articles (Nominative)">
        <Callout>
          <strong>Reminder</strong>
          <p style={{ margin: 0 }}>
            Possessive articles change based on gender, number, and case. Students should already know definite
            (der/die/das) and indefinite articles (ein/eine/einen) before this chapter.
          </p>
        </Callout>
        <Table
          headers={["Pronoun", "Masculine/Neuter", "Feminine/Plural", "English"]}
          rows={[
            ["ich", "mein", "meine", "my"],
            ["du", "dein", "deine", "your"],
            ["er/es", "sein", "seine", "his/its"],
            ["sie (she)", "ihr", "ihre", "her"],
            ["wir", "unser", "unsere", "our"],
            ["ihr (you all)", "euer", "eure", "your (plural)"],
            ["sie (they)", "ihr", "ihre", "their"],
            ["Sie (formal)", "Ihr", "Ihre", "your (formal)"],
          ]}
        />
      </Section>

      <Section title="2) Quick guide: Ihr / ihr / Ihre">
        <BulletList
          items={[
            "Ihr/Ihre (formal, capitalized) → your (formal): Das ist Ihr Buch.",
            "ihr/ihre (lowercase) → her / their: Ihr Bruder heißt Tom.",
            "ihr (lowercase) → you all (plural informal): Wo wohnt ihr?",
          ]}
        />
      </Section>

      <Section title="3) Articles in the nominative and accusative">
        <Table
          headers={["Gender/Number", "Definite (the)", "Indefinite (a/an)"]}
          rows={[
            ["Masculine (Nom.)", "der", "ein"],
            ["Feminine (Nom.)", "die", "eine"],
            ["Neuter (Nom.)", "das", "ein"],
            ["Plural (Nom.)", "die", "–"],
            ["Masculine (Acc.)", "den", "einen"],
            ["Feminine (Acc.)", "die", "eine"],
            ["Neuter (Acc.)", "das", "ein"],
            ["Plural (Acc.)", "die", "–"],
          ]}
        />
      </Section>

      <Section title="4) Indefinite articles and possessive determiners">
        <p style={{ margin: 0 }}>
          Possessive determiners follow the pattern of indefinite articles (ein, eine, einen). The indefinite article
          form helps you remember the correct endings.
        </p>
        <BulletList
          items={[
            "Masculine/Neuter nominative: mein/dein/sein/ihr/unser/euer/Ihr (like ein)",
            "Feminine nominative & accusative: meine/deine/seine/ihre/unsere/eure/Ihre (like eine)",
            "Masculine accusative: meinen/deinen/seinen/ihren/unseren/euren/Ihren (like einen)",
          ]}
        />
        <Callout>
          <strong>Important note</strong>
          <p style={{ margin: 0 }}>
            You do not use an indefinite article together with a possessive determiner. The article form just shows how
            the endings work.
          </p>
        </Callout>
        <h3 style={{ margin: "6px 0 0" }}>Examples</h3>
        <BulletList
          items={[
            "Das ist ein Tisch → Das ist mein/dein/sein/ihr/unser/euer/Ihr Tisch.",
            "Das ist eine Tasche → Das ist meine/deine/seine/ihre/unsere/eure/Ihre Tasche.",
            "Ich suche einen Tisch → Ich suche meinen/deinen/seinen/ihren/unseren/euren/Ihren Tisch.",
            "Ich nehme eine Tasche → Ich nehme meine/deine/seine/ihre/unsere/eure/Ihre Tasche.",
          ]}
        />
      </Section>

      <Section title="5) Adjectives with zu, super, sehr">
        <BulletList
          items={[
            "zu = too (excessive, often negative): Das Auto ist zu teuer.",
            "super = very/super (enthusiastic): Das Essen ist super lecker.",
            "sehr = very (neutral): Das Buch ist sehr interessant.",
          ]}
        />
        <Callout>
          <strong>Compare the meaning</strong>
          <BulletList
            items={[
              "Das Wetter ist zu kalt. (too cold)",
              "Das Konzert war super toll. (super great)",
              "Er ist sehr klug. (very smart)",
            ]}
          />
        </Callout>
        <h3 style={{ margin: "6px 0 0" }}>Practice with groß</h3>
        <BulletList
          items={[
            "Das Haus ist zu groß.",
            "Das Haus ist super groß.",
            "Das Haus ist sehr groß.",
            "Ein sehr schönes Haus.",
          ]}
        />
      </Section>
    </div>
  );
};

export default ObjectsColorsGrammarPage;
