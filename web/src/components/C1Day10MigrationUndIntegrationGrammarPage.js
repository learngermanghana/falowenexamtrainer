import React, { useMemo, useState } from "react";
import { styles } from "../styles";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1529078155058-5d716f45d604?auto=format&fit=crop&w=1600&q=80";

const quizItems = [
  {
    question: "Welche Form ist eine Nominalisierung?",
    options: ["integrieren", "die Integration", "integriert", "integrierend"],
    answer: 1,
  },
  {
    question: "Welcher Konnektor eignet sich für einen Gegensatz in der Erörterung?",
    options: ["außerdem", "deshalb", "hingegen", "folglich"],
    answer: 2,
  },
  {
    question: "Welche Passivform ist korrekt?",
    options: ["Die Maßnahme wird umgesetzt.", "Die Maßnahme hat umgesetzt.", "Die Maßnahme ist umsetzen.", "Die Maßnahme setzt geworden."],
    answer: 0,
  },
];

const C1Day10MigrationUndIntegrationGrammarPage = () => {
  const [answers, setAnswers] = useState({});
  const score = useMemo(() => (
    quizItems.reduce((sum, item, index) => (answers[index] === item.answer ? sum + 1 : sum), 0)
  ), [answers]);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <section style={{ ...styles.card, marginBottom: 0, display: "grid", gap: 10 }}>
        <img
          src={HERO_IMAGE}
          alt="C1 Tag 10 Migration und Integration"
          loading="lazy"
          style={{ width: "100%", maxHeight: 240, objectFit: "cover", borderRadius: 12, border: "1px solid #e5e7eb" }}
        />
        <span style={styles.levelPill}>C1 · Tag 10</span>
        <h1 style={{ ...styles.title, margin: 0 }}>Migration und Integration — Grammatiknotizen</h1>
        <p style={{ ...styles.helperText, margin: 0 }}>
          Fokus: <strong>Nominalisierung</strong>, <strong>Konnektoren der Erörterung</strong> und <strong>Passiv</strong>.
        </p>
      </section>

      <section style={{ ...styles.card, marginBottom: 0 }}>
        <h2 style={{ marginTop: 0 }}>1) Nominalisierung</h2>
        <ul style={{ ...styles.checklist }}>
          <li>Verben/Nebenideen in Nomen verwandeln: <em>integrieren → die Integration</em>.</li>
          <li>Wirkt sachlich und akademisch im C1-Meinungsaufsatz.</li>
          <li>Beispiel: <em>Die Förderung der Teilhabe verbessert den sozialen Zusammenhalt.</em></li>
        </ul>
      </section>

      <section style={{ ...styles.card, marginBottom: 0 }}>
        <h2 style={{ marginTop: 0 }}>2) Konnektoren der Erörterung</h2>
        <ul style={{ ...styles.checklist }}>
          <li><strong>Argument hinzufügen:</strong> außerdem, darüber hinaus.</li>
          <li><strong>Gegensatz:</strong> hingegen, dennoch, allerdings.</li>
          <li><strong>Folge:</strong> folglich, deshalb, somit.</li>
        </ul>
      </section>

      <section style={{ ...styles.card, marginBottom: 0 }}>
        <h2 style={{ marginTop: 0 }}>3) Passiv</h2>
        <ul style={{ ...styles.checklist }}>
          <li>Präsens: <em>Es wird ein Sprachkurs angeboten.</em></li>
          <li>Präteritum: <em>Neue Projekte wurden gestartet.</em></li>
          <li>Nutze Passiv, wenn der Prozess wichtiger als die handelnde Person ist.</li>
        </ul>
      </section>

      <section id="knowledge-test" style={{ ...styles.card, marginBottom: 0, display: "grid", gap: 10 }}>
        <h2 style={{ margin: 0 }}>4) Knowledge test (clickable)</h2>
        {quizItems.map((item, index) => (
          <div key={item.question} style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 10 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>{index + 1}. {item.question}</div>
            <div style={{ display: "grid", gap: 6 }}>
              {item.options.map((option, optionIndex) => (
                <button
                  key={option}
                  type="button"
                  style={styles.secondaryButton}
                  onClick={() => setAnswers((prev) => ({ ...prev, [index]: optionIndex }))}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
        <p style={{ ...styles.helperText, margin: 0 }}>Aktueller Punktestand: {score}/{quizItems.length}</p>
      </section>
    </div>
  );
};

export default C1Day10MigrationUndIntegrationGrammarPage;
