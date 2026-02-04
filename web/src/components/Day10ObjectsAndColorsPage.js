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

const Callout = ({ title, children }) => (
  <div
    style={{
      background: "#f8fafc",
      borderLeft: "4px solid #6366f1",
      borderRadius: 10,
      padding: "10px 12px",
      fontSize: 14,
      display: "grid",
      gap: 6,
    }}
  >
    {title ? <strong>{title}</strong> : null}
    {children}
  </div>
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
        <p style={{ ...styles.subtitle, margin: 0 }}>Grammar — Possessive determiners with objects and colors</p>
      </div>

      <Section title="1) Possessive determiners (mein, dein, sein, ihr, unser, euer, Ihr)">
        <p style={{ margin: 0 }}>
          Possessive determiners agree with the noun they describe. Use the noun’s gender and case to pick the ending.
        </p>
        <BulletList
          items={[
            "mein + masculine → mein Hund",
            "mein + feminine → meine Tasche",
            "mein + neuter → mein Buch",
            "mein + plural → meine Bücher",
          ]}
        />
        <Callout title="Tip">
          <p style={{ margin: 0 }}>
            In the accusative case, masculine nouns change: mein Hund → meinen Hund, dein Vater → deinen Vater.
          </p>
        </Callout>
      </Section>

      <Section title="2) Colors in German">
        <BulletList
          items={[
            "rot — red",
            "blau — blue",
            "gelb — yellow",
            "grün — green",
            "schwarz — black",
            "weiß — white",
            "grau — gray",
            "braun — brown",
            "orange — orange",
            "rosa — pink",
            "lila — purple",
          ]}
        />
        <Callout title="Usage">
          <p style={{ margin: 0 }}>
            Colors can be used as adjectives: Das Auto ist rot. / Der rote Stift ist hier.
          </p>
        </Callout>
      </Section>

      <Section title="3) Everyday objects (Alltagsgegenstände)">
        <BulletList
          items={[
            "der Tisch — table",
            "der Stuhl — chair",
            "die Lampe — lamp",
            "das Buch — book",
            "das Handy — phone",
            "der Computer — computer",
            "die Tasche — bag",
            "der Schlüssel — key",
            "die Flasche — bottle",
            "das Glas — glass",
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
    </div>
  );
};

export default Day10ObjectsAndColorsPage;
