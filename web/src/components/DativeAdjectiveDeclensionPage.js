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

const Table = ({ headers, rows }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {headers.map((header) => (
            <th
              key={header}
              style={{
                textAlign: "left",
                padding: "8px 10px",
                borderBottom: "2px solid #e6e8ef",
                background: "#f7f8fb",
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

const Callout = ({ children }) => (
  <div
    style={{
      background: "#f0f9ff",
      borderLeft: "4px solid #38bdf8",
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

const WarningCallout = ({ children }) => (
  <div
    style={{
      background: "#fff1f2",
      borderLeft: "4px solid #fb7185",
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

const ExampleCard = ({ title, items }) => (
  <div
    style={{
      border: "1px solid #e6e8ef",
      borderRadius: 12,
      padding: 12,
      background: "#fbfbfd",
      display: "grid",
      gap: 8,
    }}
  >
    <strong>{title}</strong>
    <BulletList items={items} />
  </div>
);

const DativeAdjectiveDeclensionPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>
          Day 23: Dative Verbs and Adjective Declension
        </h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Using adjective declension and the dative case in German letters (Chapter 14.2).
        </p>
        <p style={{ margin: 0, color: "#4b5563" }}>
          How to describe people and things with <strong>ein, eine, einen</strong>.
        </p>
      </div>

      <Section title="Using Adjective Declension and the Dative Case in German Letters">
        <p style={{ margin: 0 }}>
          This guide focuses on describing people and things clearly, then applying dative verbs in polite letter
          writing.
        </p>
        <Callout>
          <strong>TL;DR: Key rules</strong>
          <BulletList
            items={[
              "Check the article first; it tells you the adjective ending.",
              "Masculine accusative takes -en (einen kleinen Hund).",
              "Neuter uses -es with ein (ein kleines Auto).",
            ]}
          />
        </Callout>
      </Section>

      <Section title="Step 1: Review the Articles">
        <h3 style={{ margin: 0 }}>Nominative Case (Subject = who/what does something)</h3>
        <Table
          headers={["Gender", "Definite Article", "Indefinite Article", "Example"]}
          rows={[
            ["Masculine", "der", "ein", "der Hund, ein Hund"],
            ["Feminine", "die", "eine", "die Blume, eine Blume"],
            ["Neuter", "das", "ein", "das Auto, ein Auto"],
            ["Plural", "die", "keine", "die Bücher, keine Bücher"],
          ]}
        />
        <h3 style={{ margin: "12px 0 0" }}>Accusative Case (Object = who/what receives the action)</h3>
        <Table
          headers={["Gender", "Definite Article", "Indefinite Article", "Example"]}
          rows={[
            ["Masculine", "den", "einen", "den Hund, einen Hund"],
            ["Feminine", "die", "eine", "die Blume, eine Blume"],
            ["Neuter", "das", "ein", "das Auto, ein Auto"],
            ["Plural", "die", "keine", "die Bücher, keine Bücher"],
          ]}
        />
      </Section>

      <Section title="Step 2: How to Get the Adjective Ending">
        <Callout>
          <strong>Very simple trick:</strong> Look at the article (der/die/das/den) → that tells you the ending.
        </Callout>
        <div
          style={{
            border: "1px dashed #fdba74",
            borderRadius: 10,
            padding: "8px 12px",
            background: "#fff7ed",
            fontWeight: 600,
            color: "#9a3412",
          }}
        >
          der → -er • die → -e • das → -es • den → -en • plural (die/keine) → -en
        </div>
        <Table
          headers={["If you see", "Use this ending"]}
          rows={[
            ["der", "-er"],
            ["die", "-e"],
            ["das", "-es"],
            ["den", "-en"],
            ["plural (die/keine)", "-en"],
          ]}
        />
      </Section>

      <Section title="Step 3: Combine Article + Adjective + Noun">
        <p style={{ margin: 0 }}>
          We use simple adjectives: <strong>groß, klein, rot, blau, grün, schön, neu, alt</strong>.
        </p>
        <WarningCallout>
          <strong>Mistakes to avoid</strong>
          <BulletList
            items={[
              'Neuter uses "ein + -es": ein kleines Auto (not "ein + -e").',
              'Masculine accusative uses "einen + -en": einen kleinen Hund.',
            ]}
          />
        </WarningCallout>
        <h3 style={{ margin: "12px 0 0" }}>Nominative Case – The Subject</h3>
        <Table
          headers={["Gender", "Article", "Ending", "Example"]}
          rows={[
            ["Masculine", "ein", "-er", "ein großer Hund"],
            ["Feminine", "eine", "-e", "eine rote Blume"],
            ["Neuter", "ein", "-es", "ein kleines Auto"],
            ["Plural", "keine", "-en", "keine neuen Bücher"],
          ]}
        />
        <h3 style={{ margin: "12px 0 0" }}>Accusative Case – The Object</h3>
        <Table
          headers={["Gender", "Article", "Ending", "Example"]}
          rows={[
            ["Masculine", "einen", "-en", "einen kleinen Hund"],
            ["Feminine", "eine", "-e", "eine blaue Blume"],
            ["Neuter", "ein", "-es", "ein grünes Auto"],
            ["Plural", "keine", "-en", "keine alten Bücher"],
          ]}
        />
      </Section>

      <Section title="Example Sentences">
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <ExampleCard
            title="✅ Nominative"
            items={[
              "Ich bin ein großer Mann.",
              "Sie hat eine rote Tasche.",
              "Das ist ein neues Auto.",
              "Wir haben keine kleinen Kinder.",
            ]}
          />
          <ExampleCard
            title="✅ Accusative"
            items={[
              "Ich habe einen kleinen Hund.",
              "Er sieht eine schöne Blume.",
              "Wir kaufen ein gelbes Buch.",
              "Du liest keine langen Texte.",
            ]}
          />
        </div>
      </Section>

      <Section title="Mini Adjective Ending Test (A1)">
        <p style={{ margin: 0 }}>Complete the sentences with the correct adjective endings (use: groß, klein, rot, schön, neu).</p>
        <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
          <li>Ich habe einen ___ Hund. (klein)</li>
          <li>Das ist ein ___ Auto. (neu)</li>
          <li>Sie ist eine ___ Frau. (schön)</li>
          <li>Ich sehe eine ___ Blume. (rot)</li>
          <li>Er ist ein ___ Mann. (groß)</li>
        </ol>
        <details style={{ borderRadius: 10, border: "1px solid #e6e8ef", padding: "8px 12px" }}>
          <summary style={{ cursor: "pointer", fontWeight: 600, color: "#1f2937" }}>Check your answers</summary>
          <div style={{ marginTop: 8, background: "#f8fafc", borderRadius: 8, padding: "8px 10px" }}>
            <strong>✅ Answers</strong>
            <BulletList
              items={[
                "einen kleinen Hund",
                "ein neues Auto",
                "eine schöne Frau",
                "eine rote Blume",
                "ein großer Mann",
              ]}
            />
          </div>
        </details>
      </Section>

      <Section title="Using the Dative Case in Letters">
        <p style={{ margin: 0 }}>
          The dative case shows the indirect object (the receiver of the action). You can spot it by the article changes
          and pronoun forms.
        </p>
        <h3 style={{ margin: "12px 0 0" }}>Articles and Pronouns in the Dative Case</h3>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <div style={{ border: "1px solid #e6e8ef", borderRadius: 12, padding: 12, background: "#fbfbfd" }}>
            <strong>Definite Articles</strong>
            <BulletList items={["Masculine: dem", "Feminine: der", "Neuter: dem", "Plural: den (+n to the noun)"]} />
          </div>
          <div style={{ border: "1px solid #e6e8ef", borderRadius: 12, padding: 12, background: "#fbfbfd" }}>
            <strong>Indefinite Articles</strong>
            <BulletList items={["Masculine: einem", "Feminine: einer", "Neuter: einem", "Plural: keinen"]} />
          </div>
        </div>
        <Table
          headers={["Nominative (Subject)", "Dative (Receiver)"]}
          rows={[
            ["ich (I)", "mir (me)"],
            ["du (you - informal)", "dir (you)"],
            ["er (he)", "ihm (him)"],
            ["sie (she)", "ihr (her)"],
            ["es (it)", "ihm (it)"],
            ["wir (we)", "uns (us)"],
            ["ihr (you all)", "euch (you all)"],
            ["sie (they)", "ihnen (them)"],
            ["Sie (you - formal)", "Ihnen (you - formal)"],
          ]}
        />
      </Section>

      <Section title="A1 Focus: Dative vs Accusative Pronouns">
        <p style={{ margin: 0 }}>
          Some verbs take the accusative, while others take the dative. The pronoun you use depends on the verb.
        </p>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <Callout>
            <strong>✅ Accusative verb (haben - to have)</strong>
            <BulletList items={["Ich habe dich gern. (I like you.)", "Ich habe sie gesehen. (I saw her.)"]} />
          </Callout>
          <Callout>
            <strong>✅ Dative verb (helfen - to help)</strong>
            <BulletList items={["Ich helfe dir. (I help you.)", "Ich helfe ihr. (I help her.)"]} />
          </Callout>
        </div>
      </Section>

      <Section title="Quick Tips for A1 Learners">
        <BulletList
          items={[
            'Use "mir" for "me" and "dir" for "you" (informal) with dative verbs like helfen, gefallen, danken.',
            'Use "mich" and "dich" with accusative verbs like sehen, haben, lieben.',
            'The formal "you" (Sie → Ihnen) always uses a capital I in writing.',
            "At A2, you will learn more about ihr, ihm, and ihnen in sentences.",
          ]}
        />
      </Section>

      <Section title="Common Dative Verbs for Letter Writing">
        <BulletList
          items={[
            "helfen (to help) → Ich helfe meinem Freund.",
            "danken (to thank) → Ich danke dir für das Geschenk.",
            "gefallen (to please) → Das Buch gefällt mir.",
            "gehören (to belong to) → Das Auto gehört meinem Bruder.",
            "glauben (to believe) → Ich glaube dir.",
            "gratulieren (to congratulate) → Ich gratuliere dir zum Geburtstag.",
            "schmecken (to taste good to) → Die Suppe schmeckt mir gut.",
            "passen (to fit) → Die Schuhe passen mir nicht.",
          ]}
        />
        <Callout>
          <strong>How to use these special dative verbs</strong>
          <BulletList
            items={[
              "Das Buch gefällt mir. (Literally: The book is pleasing to me.)",
              "Das Auto gehört meinem Bruder. (Literally: The car belongs to my brother.)",
              "Die Suppe schmeckt mir gut. (Literally: The soup tastes good to me.)",
            ]}
          />
        </Callout>
      </Section>
    </div>
  );
};

export default DativeAdjectiveDeclensionPage;
