import React, { useMemo, useState } from "react";
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

const woAnswers = [
  "Ich bin in der Apotheke.",
  "Ich bin in der Buchhandlung.",
  "Ich bin im Kino.",
  "Ich bin im Museum.",
  "Ich bin in der Schule.",
  "Ich bin im Theater.",
  "Ich bin im Supermarkt.",
  "Ich bin im Zirkus.",
];

const wohinAnswers = [
  "Ich gehe in die Apotheke.",
  "Ich gehe in die Buchhandlung.",
  "Ich gehe ins Kino.",
  "Ich gehe ins Museum.",
  "Ich gehe in die Schule.",
  "Ich gehe ins Theater.",
  "Ich gehe in den Supermarkt.",
  "Ich gehe in den Zirkus.",
];

const gameQuestions = [
  {
    sentence: "Ich gehe in ___ Schule.",
    correct: "die",
    hint: "Movement to a destination: accusative.",
  },
  {
    sentence: "Ich bin in ___ Schule.",
    correct: "der",
    hint: "Static location: dative.",
  },
  {
    sentence: "Das Buch liegt auf ___ Tisch.",
    correct: "dem",
    hint: "No movement: dative.",
  },
  {
    sentence: "Er legt das Buch auf ___ Tisch.",
    correct: "den",
    hint: "Change of location: accusative.",
  },
];

const articleOptions = ["den", "die", "das", "dem", "der"];

const TwoCasePrepositionsPage = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});

  const score = useMemo(
    () =>
      gameQuestions.reduce((total, question, index) => {
        if (answers[index] === question.correct) {
          return total + 1;
        }
        return total;
      }, 0),
    [answers]
  );

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>Day 18: Two-Case Prepositions (Wechselpräpositionen)</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          In German, prepositions belong to their own “families” just like verbs. The preposition you choose can change
          the case of the noun that follows.
        </p>
      </div>

      <Section title="1) What are Wechselpräpositionen?">
        <p style={{ margin: 0 }}>
          Wechselpräpositionen can take either the accusative or the dative case. Use accusative when there is movement
          to a new location (Wohin?), and dative for a static position (Wo?).
        </p>
        <BulletList
          items={[
            "an (on, at)",
            "auf (on, onto)",
            "hinter (behind)",
            "in (in, into)",
            "neben (next to)",
            "über (over, above)",
            "unter (under, below)",
            "vor (in front of)",
            "zwischen (between)",
          ]}
        />
      </Section>

      <Section title="2) Accusative vs Dative (quick rule)">
        <BulletList
          items={[
            "Accusative (den, die, das, die): movement or change of location.",
            "Dative (dem, der, dem, den): no movement, static location.",
            "Example: Ich gehe in die Schule. (accusative)",
            "Example: Ich bin in der Schule. (dative)",
          ]}
        />
      </Section>

      <Section title='3) Assignment: Answer "Wo bist du?"'>
        <p style={{ margin: 0 }}>Use static location + dative case.</p>
        <BulletList items={woAnswers} />
        <p style={{ margin: 0 }}>
          Short note: <strong>im = in dem</strong>.
        </p>
      </Section>

      <Section title='4) Assignment: Answer "Wohin gehst du?"'>
        <p style={{ margin: 0 }}>Use destination + accusative case.</p>
        <BulletList items={wohinAnswers} />
        <p style={{ margin: 0 }}>
          Short note: <strong>ins = in das</strong> and <strong>am = an dem</strong>.
        </p>
      </Section>

      <Section title="5) Simple game: Place the article correctly">
        <p style={{ margin: 0 }}>Choose the best article for each sentence.</p>
        <div style={{ display: "grid", gap: 12 }}>
          {gameQuestions.map((question, index) => {
            const selected = answers[index];
            const isCorrect = selected && selected === question.correct;
            const isWrong = selected && selected !== question.correct;
            return (
              <div
                key={question.sentence}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  padding: 12,
                  display: "grid",
                  gap: 8,
                }}
              >
                <strong>{question.sentence}</strong>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {articleOptions.map((option) => (
                    <button
                      key={`${question.sentence}-${option}`}
                      onClick={() => setAnswers((prev) => ({ ...prev, [index]: option }))}
                      style={{
                        ...styles.secondaryButton,
                        minWidth: 70,
                        background: selected === option ? "#dbeafe" : styles.secondaryButton.background,
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {isCorrect && <span style={{ color: "#166534" }}>Correct ✅ {question.hint}</span>}
                {isWrong && <span style={{ color: "#b91c1c" }}>Try again. Hint: {question.hint}</span>}
              </div>
            );
          })}
        </div>
        <p style={{ margin: 0 }}>
          Score: {score}/{gameQuestions.length}
        </p>
      </Section>
    </div>
  );
};

export default TwoCasePrepositionsPage;
