import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import "./A1GoetheReadingMockTeil1Preview.css";
import "./A1GoetheReadingMockTeil3Preview.css";

export const A1_GOETHE_READING_MOCK_TEIL3 = Object.freeze({
  example: {
    number: 0,
    location: "An der Tür der Sprachschule",
    statement: "Zum Deutschlernen gehen Sie jetzt in die Mozartstraße 18.",
    answer: "richtig",
    notice: {
      kind: "sign",
      heading: "SPRACHHAUS",
      lines: [
        "Wir sind umgezogen.",
        "Sie finden uns jetzt in der Mozartstraße 18.",
      ],
    },
  },
  questions: [
    {
      number: 11,
      location: "In der Sprachschule",
      statement: "In der Sprachschule können Sie in der Pause etwas zu essen kaufen.",
      answer: "richtig",
      notice: {
        kind: "notice",
        heading: "PAUSE",
        lines: [
          "Von 10.00 bis 10.20 Uhr:",
          "Brötchen, Obst und Getränke",
          "an der Rezeption.",
          "Alles zusammen: 3 Euro.",
        ],
      },
    },
    {
      number: 12,
      location: "An der Stadtbibliothek",
      statement: "Am Samstagnachmittag können Sie hier Bücher ausleihen.",
      answer: "falsch",
      notice: {
        kind: "hours",
        heading: "ÖFFNUNGSZEITEN",
        lines: [
          "Montag – Freitag",
          "9.00 – 13.00 Uhr",
          "14.00 – 18.00 Uhr",
          "",
          "Samstag",
          "9.00 – 12.00 Uhr",
        ],
      },
    },
    {
      number: 13,
      location: "Im Zug",
      statement: "Während der Fahrt dürfen Sie hier telefonieren.",
      answer: "falsch",
      notice: {
        kind: "warning",
        heading: "RUHEBEREICH",
        lines: [
          "Bitte nicht telefonieren.",
          "Handys auf lautlos stellen.",
        ],
      },
    },
    {
      number: 14,
      location: "Am Eingang eines Restaurants",
      statement: "Heute Abend können Sie in diesem Restaurant tanzen.",
      answer: "richtig",
      notice: {
        kind: "event",
        heading: "HEUTE ABEND",
        lines: [
          "Italienischer Abend",
          "Pasta · Salat · Musik",
          "ab 20.30 Uhr Tanz",
        ],
      },
    },
    {
      number: 15,
      location: "An der Bushaltestelle",
      statement: "Zwischen 0 Uhr und 2 Uhr fährt hier kein Bus.",
      answer: "richtig",
      notice: {
        kind: "transport",
        heading: "NACHTBUS",
        lines: [
          "Silvesternacht",
          "Busse bis 24.00 Uhr",
          "und wieder ab 2.00 Uhr",
          "alle 30 Minuten.",
        ],
      },
    },
  ],
});

const NoticeCard = ({ notice }) => (
  <div className={`a1-goethe-mock-notice-card a1-goethe-mock-notice-${notice.kind}`}>
    <div className="a1-goethe-mock-notice-inner">
      <h3>{notice.heading}</h3>
      {notice.lines.map((line, index) =>
        line ? <p key={`${notice.heading}-${index}`}>{line}</p> : <div key={`${notice.heading}-${index}`} className="a1-goethe-mock-notice-gap" />
      )}
    </div>
  </div>
);

const AnswerChoices = ({ number, value, onChange, example = false }) => (
  <div className="a1-goethe-mock-choices" role="radiogroup" aria-label={example ? "Beispiel 0" : `Aufgabe ${number}`}>
    {[
      ["richtig", "Richtig."],
      ["falsch", "Falsch."],
    ].map(([optionValue, label]) => (
      <label key={optionValue} className="a1-goethe-mock-choice">
        <input
          type="radio"
          name={`a1-goethe-mock-teil3-${number}`}
          value={optionValue}
          checked={value === optionValue}
          onChange={() => onChange(optionValue)}
          disabled={example}
        />
        <span>{label}</span>
      </label>
    ))}
  </div>
);

const Teil3Question = ({ question, value, onChange, example = false }) => (
  <section className="a1-goethe-mock-question a1-goethe-mock-teil3-question">
    <h2 className="a1-goethe-mock-question-title">
      {example ? "Beispiel 0 - Teil 3" : `Aufgabe ${question.number}`}
    </h2>
    <p className="a1-goethe-mock-location">{question.location}</p>

    <NoticeCard notice={question.notice} />

    <p className="a1-goethe-mock-teil3-statement">{question.statement}</p>
    <AnswerChoices
      number={question.number}
      value={value}
      onChange={onChange}
      example={example}
    />
  </section>
);

export default function A1GoetheReadingMockTeil3Preview() {
  const [answers, setAnswers] = useState({
    0: A1_GOETHE_READING_MOCK_TEIL3.example.answer,
  });

  const setAnswer = (number, value) => {
    setAnswers((current) => ({ ...current, [number]: value }));
  };

  return (
    <main className="a1-goethe-mock-shell" data-a1-goethe-reading-mock-teil3-preview>
      <div className="a1-goethe-mock-topbar">
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <span className="a1-goethe-mock-preview-badge">Mock preview · not in Course Book</span>
      </div>

      <article className="a1-goethe-mock-exam">
        <header className="a1-goethe-mock-header">
          <p className="a1-goethe-mock-kicker">A1 · Lesen</p>
          <h1>Teil 3</h1>
          <p>Lesen Sie die Texte und die Aufgaben 11 bis 15.</p>
          <p><strong>Kreuzen Sie an: Richtig oder Falsch.</strong></p>
        </header>

        <Teil3Question
          question={A1_GOETHE_READING_MOCK_TEIL3.example}
          value={answers[0]}
          onChange={(value) => setAnswer(0, value)}
          example
        />

        {A1_GOETHE_READING_MOCK_TEIL3.questions.map((question) => (
          <Teil3Question
            key={question.number}
            question={question}
            value={answers[question.number] || ""}
            onChange={(value) => setAnswer(question.number, value)}
          />
        ))}
      </article>
    </main>
  );
}
