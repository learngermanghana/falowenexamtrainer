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

const Day10ObjectsAndColorsPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>Day 10: Objects and Colors</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Grammar — Possessive and indefinite articles, objects and colors, and adjective intensifiers
        </p>
      </div>

      <Section title="1) Common objects">
        <BulletList
          items={[
            "der Stift — pen",
            "das Buch — book",
            "die Tasche — bag",
            "der Schlüssel — key",
            "das Auto — car",
            "der Tisch — table",
            "der Stuhl — chair",
            "das Fenster — window",
          ]}
        />
      </Section>

      <Section title="2) Colors">
        <BulletList
          items={[
            "rot — red",
            "blau — blue",
            "grün — green",
            "gelb — yellow",
            "schwarz — black",
            "weiß — white",
            "braun — brown",
            "grau — gray",
          ]}
        />
      </Section>

      <Section title="3) Possessive determiners (nom.)">
        <BulletList
          items={[
            "mein/dein/sein/ihr/unser/euer/Ihr + der/das (mein Stift, dein Buch)",
            "meine/deine/seine/ihre/unsere/eure/Ihre + die (meine Tasche)",
          ]}
        />
      </Section>

      <Section title="4) Example sentences">
        <BulletList
          items={[
            "Das ist mein roter Stift.",
            "Ist das deine schwarze Tasche?",
            "Sein blaues Auto steht draußen.",
            "Wir suchen unsere weißen Schlüssel.",
            "Ihr grünes Buch liegt auf dem Tisch.",
          ]}
        />
      </Section>

      <Section title="Note on Possessive and Indefinite Articles">
        <p style={{ margin: 0 }}>
          Understanding possessive and indefinite articles in German is essential for indicating ownership and making
          general statements. Here's a guide to help you learn and use them correctly.
        </p>
      </Section>

      <Section title="Possessive articles">
        <BulletList
          items={[
            "ich (I) — mein (masculine/neuter), meine (feminine/plural) — my",
            "du (you) — dein (masculine/neuter), deine (feminine/plural) — your",
            "er/es (he/it) — sein (masculine/neuter), seine (feminine/plural) — his/its",
            "sie (she) — ihr (masculine/neuter), ihre (feminine/plural) — her",
            "wir (we) — unser (masculine/neuter), unsere (feminine/plural) — our",
            "ihr (you all) — euer (masculine/neuter), eure (feminine/plural) — your (plural)",
            "sie (they) — ihr (masculine/neuter), ihre (feminine/plural) — their",
            "Sie (you formal) — Ihr (masculine/neuter), Ihre (feminine/plural) — your (formal)",
          ]}
        />
      </Section>

      <Section title="Quick guide: Ihr">
        <BulletList
          items={[
            "Ihr/Ihre (formal, capitalized) → your (formal): Das ist Ihr Buch.",
            "ihr/ihre (lowercase) → her/their (possessive): Ihr Bruder heißt Tom.",
            "ihr (lowercase) → you all (plural informal): Wo wohnt ihr?",
          ]}
        />
      </Section>

      <Section title="Articles in the nominative case">
        <BulletList
          items={[
            "Masculine: der (definite), ein (indefinite)",
            "Feminine: die (definite), eine (indefinite)",
            "Neuter: das (definite), ein (indefinite)",
            "Plural: die (definite), — (no indefinite)",
          ]}
        />
      </Section>

      <Section title="Articles in the accusative case">
        <BulletList
          items={[
            "Masculine: den (definite), einen (indefinite)",
            "Feminine: die (definite), eine (indefinite)",
            "Neuter: das (definite), ein (indefinite)",
            "Plural: die (definite), — (no indefinite)",
          ]}
        />
      </Section>

      <Section title="Indefinite articles and possessive determiners">
        <p style={{ margin: 0 }}>
          Indefinite articles in German (ein/eine/einen) refer to unspecified nouns ("a/an" in English) and directly
          influence the forms of possessive determiners. The masculine form ein is the base form. Additional letters
          indicate changes in gender and case:
        </p>
        <BulletList
          items={[
            "Feminine nominative & accusative add “e” → eine",
            "Masculine accusative adds “en” → einen",
          ]}
        />
        <p style={{ margin: 0 }}>Use these endings to form the corresponding possessive determiners:</p>
        <BulletList
          items={[
            "Masculine/neuter nominative: mein/dein/sein/ihr/unser/euer/Ihr (same as ein)",
            "Feminine nominative & accusative: meine/deine/seine/ihre/unsere/eure/Ihre (like eine)",
            "Masculine accusative: meinen/deinen/seinen/ihren/unseren/euren/Ihren (like einen)",
          ]}
        />
        <p style={{ margin: 0 }}>Examples:</p>
        <BulletList
          items={[
            "Das ist ein Tisch → Das ist mein Tisch (my table)",
            "Das ist eine Tasche → Das ist meine Tasche (my bag)",
            "Ich suche einen Tisch → Ich suche meinen Tisch (my table)",
            "Ich nehme eine Tasche → Ich nehme meine Tasche (my bag)",
          ]}
        />
        <p style={{ margin: 0 }}>
          You don’t use indefinite articles together with possessive determiners. The indefinite article form helps
          determine the correct possessive determiner ending based on gender and case.
        </p>
      </Section>

      <Section title="Adjective intensifiers: zu, super, sehr">
        <p style={{ margin: 0 }}>
          Adjectives can be modified by words like zu, super, and sehr to change their intensity. Here’s how they
          differ:
        </p>
        <BulletList
          items={[
            "zu (too): indicates an excessive degree (negative connotation). Example: Das Auto ist zu teuer. (The car is too expensive.)",
            "super (super/very): indicates a very high degree (positive connotation). Example: Das Essen ist super lecker. (The food is super delicious.)",
            "sehr (very): indicates a high degree (neutral or positive connotation). Example: Das Buch ist sehr interessant. (The book is very interesting.)",
          ]}
        />
        <p style={{ margin: 0 }}>Comparison of zu, super, and sehr:</p>
        <BulletList
          items={[
            "Use zu when something is more than needed or wanted: Das Wetter ist zu kalt. (The weather is too cold.)",
            "Use super for enthusiastic or informal descriptions: Das Konzert war super toll. (The concert was super great.)",
            "Use sehr for general intensification: Er ist sehr klug. (He is very smart.)",
          ]}
        />
        <p style={{ margin: 0 }}>Usage tips:</p>
        <BulletList
          items={[
            "Practice using the same adjective with each modifier to see the difference: Das Haus ist zu groß / super groß / sehr groß.",
            "Adjectives usually come before the noun they describe: Ein sehr schönes Haus. (A very beautiful house.)",
          ]}
        />
        <p style={{ margin: 0 }}>
          Summary: zu means “too” and indicates an excessive degree; super means “super/very” and indicates a very high
          degree; sehr means “very” and indicates a high degree. Examples: Die Aufgabe ist zu schwer. (The task is too
          difficult.) Das Spiel war super spannend. (The game was super exciting.) Er ist sehr müde. (He is very tired.)
        </p>
      </Section>
    </div>
  );
};

export default Day10ObjectsAndColorsPage;
