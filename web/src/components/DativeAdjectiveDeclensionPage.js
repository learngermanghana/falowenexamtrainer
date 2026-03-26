import React, { useState } from "react";
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
  const [showAnswers, setShowAnswers] = useState(false);
  const headerImageUrl =
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1800&q=80";

  const practiceItems = [
    {
      prompt: "Ich danke ___ Lehrer.",
      options: ["den", "dem", "der"],
      answer: "dem",
      reason: "danken is a dative verb, so der Lehrer → dem Lehrer.",
    },
    {
      prompt: "Wir sehen ___ Mann.",
      options: ["dem", "den", "der"],
      answer: "den",
      reason: "sehen is an accusative verb, so der Mann → den Mann.",
    },
    {
      prompt: "Sie schreibt ___ Freundin.",
      options: ["eine", "einer", "einen"],
      answer: "einer",
      reason: "schreiben (to someone) takes dative here: eine Freundin → einer Freundin.",
    },
    {
      prompt: "Er hat ___ Hund.",
      options: ["einen", "einem", "eine"],
      answer: "einen",
      reason: "haben takes accusative: ein Hund → einen Hund.",
    },
    {
      prompt: "Ich helfe ___. (du)",
      options: ["dich", "dir", "du"],
      answer: "dir",
      reason: "helfen is a dative verb, so du → dir.",
    },
    {
      prompt: "Wir kaufen ___ Stuhl.",
      options: ["ein", "einen", "einem"],
      answer: "einen",
      reason: "kaufen takes accusative: ein Stuhl → einen Stuhl.",
    },
    {
      prompt: "Er gratuliert ___ Frau.",
      options: ["die", "der", "den"],
      answer: "der",
      reason: "gratulieren takes dative: die Frau → der Frau.",
    },
    {
      prompt: "Sie brauchen ___ Termin.",
      options: ["einen", "einem", "ein"],
      answer: "einen",
      reason: "brauchen is accusative here: ein Termin → einen Termin.",
    },
    {
      prompt: "Ich sende ___ die Adresse. (Sie, formal)",
      options: ["Sie", "Ihnen", "ihnen"],
      answer: "Ihnen",
      reason: "formal receiver pronoun with a dative verb is Ihnen.",
    },
    {
      prompt: "Wir lieben ___ Stadt.",
      options: ["die", "der", "den"],
      answer: "die",
      reason: "lieben takes accusative, and feminine article stays die in accusative.",
    },
  ];

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <img
          src={headerImageUrl}
          alt="Students studying German grammar together"
          loading="lazy"
          style={{ width: "100%", height: 220, objectFit: "cover", borderRadius: 12 }}
        />
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>Day 23: Dative and Accusative Verbs</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Chapter 14.2: Learn how verbs decide whether the next noun/pronoun is accusative or dative.
        </p>
        <p style={{ margin: 0, color: "#4b5563" }}>
          You already know accusative verbs. In this note, we introduce common dative verbs for A1.
        </p>
      </div>

      <Section title="Grammar Note: Dative and Accusative Verbs">
        <p style={{ margin: 0 }}>
          In German, the verb controls the case of the object. The verb tells you whether the next noun or pronoun
          must be accusative or dative.
        </p>
        <Callout>
          <strong>Quick rule</strong>
          <BulletList
            items={[
              "Accusative = direct object (what/who is directly affected).",
              "Dative = receiving object (to/for whom something happens).",
              "So after a dative verb, use a dative noun or dative pronoun.",
            ]}
          />
        </Callout>
      </Section>

      <Section title="Step 1: Accusative Verbs (Review)">
        <p style={{ margin: 0 }}>You already have an idea about accusative verbs. Common ones are:</p>
        <BulletList items={["haben", "sehen", "kaufen", "lieben", "brauchen"]} />
        <Table
          headers={["Verb", "Example", "Meaning"]}
          rows={[
            ["haben", "Ich habe einen Hund.", "I have a dog."],
            ["sehen", "Ich sehe den Lehrer.", "I see the teacher."],
            ["kaufen", "Wir kaufen einen Kaffee.", "We buy a coffee."],
          ]}
        />
      </Section>

      <Section title="Step 2: Dative Verbs (New)">
        <p style={{ margin: 0 }}>These verbs often change the next noun/pronoun to dative:</p>
        <BulletList
          items={[
            "schreiben (to write to)",
            "gratulieren (to congratulate)",
            "danken (to thank)",
            "senden (to send to)",
            "helfen (to help)",
          ]}
        />
        <WarningCallout>
          <strong>Important:</strong> If you use a dative verb, the receiving noun should be in dative form.
        </WarningCallout>
      </Section>

      <Section title="Step 3: Dative Articles (Definite and Indefinite)">
        <h3 style={{ margin: 0 }}>Definite Articles</h3>
        <Table
          headers={["Gender", "Nominative", "Dative", "Example"]}
          rows={[
            ["Masculine", "der", "dem", "Ich schreibe dem Mann."],
            ["Feminine", "die", "der", "Ich danke der Frau."],
            ["Neuter", "das", "dem", "Er sendet dem Kind eine Karte."],
            ["Plural", "die", "den (+n noun)", "Wir gratulieren den Freunden."],
          ]}
        />
        <h3 style={{ margin: "12px 0 0" }}>Indefinite Articles</h3>
        <Table
          headers={["Gender", "Nominative", "Dative", "Example"]}
          rows={[
            ["Masculine", "ein", "einem", "Ich schreibe einem Kollegen."],
            ["Feminine", "eine", "einer", "Ich sende einer Freundin eine Mail."],
            ["Neuter", "ein", "einem", "Sie dankt einem Kind."],
            ["Plural", "keine", "keinen (+n noun)", "Wir helfen keinen Nachbarn heute."],
          ]}
        />
      </Section>


      <Section title="Step 3.5: Adjective Declension (Indefinite Articles: Nominative + Accusative)">
        <p style={{ margin: 0 }}>
          For now, focus only on <strong>indefinite articles</strong> with adjective endings in nominative and accusative.
        </p>
        <Callout>
          <strong>Very simple trick</strong>
          <BulletList
            items={[
              "ein (masculine nominative) → adjective ending -er: ein großer Hund",
              "eine (feminine nominative/accusative) → adjective ending -e: eine rote Blume",
              "ein (neuter nominative/accusative) → adjective ending -es: ein neues Auto",
              "einen (masculine accusative) → adjective ending -en: einen kleinen Hund",
              "keine (plural nominative/accusative) → adjective ending -en: keine alten Bücher",
            ]}
          />
        </Callout>
        <h3 style={{ margin: "12px 0 0" }}>Nominative (subject)</h3>
        <Table
          headers={["Gender", "Article", "Ending", "Example"]}
          rows={[
            ["Masculine", "ein", "-er", "ein großer Hund"],
            ["Feminine", "eine", "-e", "eine rote Blume"],
            ["Neuter", "ein", "-es", "ein kleines Auto"],
            ["Plural", "keine", "-en", "keine neuen Bücher"],
          ]}
        />
        <h3 style={{ margin: "12px 0 0" }}>Accusative (object)</h3>
        <Table
          headers={["Gender", "Article", "Ending", "Example"]}
          rows={[
            ["Masculine", "einen", "-en", "einen kleinen Hund"],
            ["Feminine", "eine", "-e", "eine schöne Blume"],
            ["Neuter", "ein", "-es", "ein grünes Auto"],
            ["Plural", "keine", "-en", "keine alten Bücher"],
          ]}
        />
        <h3 style={{ margin: "12px 0 0" }}>Mini adjective ending test (A1)</h3>
        <BulletList
          items={[
            "Ich habe einen kleinen Hund.",
            "Das ist ein neues Auto.",
            "Sie ist eine schöne Frau.",
            "Ich sehe eine rote Blume.",
            "Er ist ein großer Mann.",
          ]}
        />
      </Section>
      <Section title="Step 4: Dative Pronouns (Receiver Pronouns)">
        <p style={{ margin: 0 }}>
          In dative sentences, receiver pronouns are common. You will often see <strong>dir</strong> and
          <strong> ihnen</strong>.
        </p>
        <Table
          headers={["Subject", "Dative Pronoun", "Example"]}
          rows={[
            ["ich", "mir", "Er sendet mir die Datei."],
            ["du", "dir", "Ich schreibe dir morgen."],
            ["er", "ihm", "Wir danken ihm."],
            ["sie (she)", "ihr", "Ich gratuliere ihr."],
            ["sie (they)", "ihnen", "Wir senden ihnen die Unterlagen."],
            ["Sie (formal)", "Ihnen", "Ich schreibe Ihnen heute."],
          ]}
        />
        <Callout>At A2, we will learn more dative pronouns and two-object sentence patterns.</Callout>
      </Section>

      <Section title="Step 5: Compare Both Verb Types">
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <ExampleCard
            title="✅ Accusative Verb"
            items={["Ich sehe den Mann.", "Sie kauft einen Stift.", "Wir haben eine Frage."]}
          />
          <ExampleCard
            title="✅ Dative Verb"
            items={[
              "Ich schreibe dem Lehrer.",
              "Wir gratulieren dir.",
              "Sie danken ihnen.",
              "Er sendet einer Kollegin eine Nachricht.",
            ]}
          />
        </div>
      </Section>

      <Section title="Step 6: Practice Book (Self-practice, no assignment)">
        <p style={{ margin: 0 }}>
          After reading the notes, try these 10 quick practice items in-app. This is <strong>not</strong> an assignment.
        </p>
        <button
          type="button"
          onClick={() => setShowAnswers((prev) => !prev)}
          style={{ ...styles.secondaryButton, width: "fit-content" }}
        >
          {showAnswers ? "Hide answers" : "Show answers"}
        </button>
        <div style={{ display: "grid", gap: 10 }}>
          {practiceItems.map((item, index) => (
            <div
              key={item.prompt}
              style={{ border: "1px solid #e6e8ef", borderRadius: 10, padding: 12, display: "grid", gap: 8 }}
            >
              <strong>
                {index + 1}. {item.prompt}
              </strong>
              <div style={{ color: "#4b5563", fontSize: 14 }}>Options: {item.options.join(" / ")}</div>
              {showAnswers ? (
                <>
                  <div style={{ fontSize: 14 }}>
                    <strong>Answer:</strong> {item.answer}
                  </div>
                  <div style={{ color: "#4b5563", fontSize: 14 }}>
                    <strong>Why:</strong> {item.reason}
                  </div>
                </>
              ) : (
                <div style={{ color: "#6b7280", fontSize: 14 }}>Answer is hidden. Try it first 👀</div>
              )}
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default DativeAdjectiveDeclensionPage;
