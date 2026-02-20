import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const Section = ({ title, children }) => (
  <section style={{ ...styles.card, display: "grid", gap: 10 }}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const dativeArticles = [
  "Masculine (der): der → dem",
  "Feminine (die): die → der",
  "Neuter (das): das → dem",
  "Plural (die): die → den (+n to the noun)",
];

const examples = [
  {
    preposition: "mit (with)",
    items: [
      "Ich fahre mit dem Zug. (der Zug → dem Zug)",
      "Ich fahre mit der U-Bahn. (die U-Bahn → der U-Bahn)",
      "Ich fahre mit dem Fahrrad. (das Fahrrad → dem Fahrrad)",
      "Ich fahre mit den Kindern. (die Kinder → den Kindern)",
    ],
  },
  {
    preposition: "bei (at, near, with)",
    items: [
      "Ich bin bei dem Freund. (der Freund → dem Freund)",
      "Ich bin bei der Post. (die Post → der Post)",
      "Ich bin bei dem Krankenhaus. (das Krankenhaus → dem Krankenhaus)",
      "Ich bin bei den Eltern. (die Eltern → den Eltern)",
    ],
  },
  {
    preposition: "zu (to)",
    items: [
      "Ich gehe zu dem Bäcker. (der Bäcker → dem Bäcker)",
      "Ich gehe zu der Schule. (die Schule → der Schule)",
      "Ich gehe zu dem Konzert. (das Konzert → dem Konzert)",
      "Ich gehe zu den Freunden. (die Freunde → den Freunden)",
    ],
  },
];

const practice = [
  "Ich reise mit dem Auto.",
  "Ich fahre mit dem Fahrrad.",
  "Ich bin bei der Post.",
  "Ich bin bei der Bank.",
  "Ich gehe zu der Schule.",
  "Ich gehe zu dem Park.",
  "Ich reise mit den Kindern.",
  "Ich bin bei dem Krankenhaus.",
  "Ich gehe zu dem Konzert.",
  "Ich gehe zu der Party.",
];

const DativeArticlesMitBeiZuPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>A1 Chapter 12.2: Dative Articles with mit, bei, and zu</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          There are several dative prepositions in German, but today we focus only on <strong>mit</strong>, <strong>bei</strong>,
          and <strong>zu</strong>.
        </p>
      </div>

      <Section title="Introduction">
        <p style={{ margin: 0 }}>
          In German, the prepositions <strong>mit</strong>, <strong>bei</strong>, and <strong>zu</strong> require the dative case.
          This means the definite and indefinite articles change to their dative forms.
        </p>
      </Section>

      <Section title="Dative articles">
        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
          {dativeArticles.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section title="Examples">
        {examples.map((group) => (
          <div key={group.preposition} style={{ display: "grid", gap: 6 }}>
            <strong>{group.preposition}</strong>
            <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 4 }}>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </Section>

      <Section title="Tip">
        <p style={{ margin: 0 }}>
          You can contract <strong>zu dem</strong> to <strong>zum</strong> (masculine/neuter) and <strong>zu der</strong> to
          <strong> zur</strong> (feminine).
        </p>
      </Section>

      <Section title="Practice solutions">
        <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 4 }}>
          {practice.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </Section>
    </div>
  );
};

export default DativeArticlesMitBeiZuPage;
