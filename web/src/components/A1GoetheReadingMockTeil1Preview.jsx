import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import "./A1GoetheReadingMockTeil1Preview.css";

export const A1_GOETHE_READING_MOCK_TEIL1 = Object.freeze({
  text1: {
    title: "Nachricht von Nina",
    body: [
      "Hallo Samira,",
      "dein Bus aus Bremen kommt am Freitag um 14.42 Uhr in Hamburg an.",
      "Ich bin ab 14.20 Uhr am Busbahnhof und warte vor dem Café Nord auf dich.",
      "Wenn du früher kommst, ruf mich bitte an. Am Vormittag bin ich noch bei der Arbeit.",
      "Liebe Grüße",
      "Nina",
    ],
  },
  text2: {
    title: "Nachricht von Mira",
    body: [
      "Lieber Jonas,",
      "am nächsten Freitag ziehe ich in meine neue Wohnung.",
      "Am Samstagabend möchte ich dort mit meinen Freunden feiern. Wir beginnen um 18 Uhr.",
      "Etwa zwölf Freunde und Kollegen kommen. Kannst du bitte Saft oder Wasser mitbringen?",
      "Wir sitzen zuerst draußen im Garten. Wenn es kalt wird, gehen wir ins Haus.",
      "Ich freue mich auf dich!",
      "Bis Samstag",
      "Mira",
    ],
  },
  example: {
    number: 0,
    statement: "Samira fährt nach Hamburg.",
    answer: "richtig",
  },
  questions: [
    { number: 1, statement: "Samiras Bus kommt nach halb drei an.", answer: "richtig", text: 1 },
    { number: 2, statement: "Nina wartet den ganzen Vormittag am Busbahnhof.", answer: "falsch", text: 1 },
    { number: 3, statement: "Mira ist schon am letzten Wochenende umgezogen.", answer: "falsch", text: 2 },
    { number: 4, statement: "Mira feiert nur mit zwei oder drei Leuten.", answer: "falsch", text: 2 },
    { number: 5, statement: "Mira und ihre Gäste sind zuerst im Garten.", answer: "richtig", text: 2 },
  ],
});

const ReadingPaper = ({ title, lines }) => (
  <figure className="a1-goethe-mock-paper">
    <figcaption className="sr-only">{title}</figcaption>
    <div className="a1-goethe-mock-paper-copy">
      {lines.map((line, index) => (
        <p
          key={`${title}-${index}`}
          className={
            index === 0 || index === lines.length - 2 || index === lines.length - 1
              ? "a1-goethe-mock-paper-line a1-goethe-mock-paper-line-spaced"
              : "a1-goethe-mock-paper-line"
          }
        >
          {line}
        </p>
      ))}
    </div>
  </figure>
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
          name={`a1-goethe-mock-${number}`}
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

const QuestionBlock = ({ question, value, onChange, example = false, children = null }) => (
  <section
    className={`a1-goethe-mock-question${example ? " a1-goethe-mock-question-example" : ""}`}
    aria-labelledby={`a1-goethe-mock-question-${question.number}`}
  >
    <h2 id={`a1-goethe-mock-question-${question.number}`} className="a1-goethe-mock-question-title">
      {example ? "Beispiel: 0 - Teil 1" : `Aufgabe ${question.number}`}
    </h2>
    <p className="a1-goethe-mock-statement">{question.statement}</p>
    {children}
    <AnswerChoices
      number={question.number}
      value={value}
      onChange={onChange}
      example={example}
    />
  </section>
);

export default function A1GoetheReadingMockTeil1Preview() {
  const [answers, setAnswers] = useState({
    0: A1_GOETHE_READING_MOCK_TEIL1.example.answer,
  });

  const setAnswer = (number, value) => {
    setAnswers((current) => ({ ...current, [number]: value }));
  };

  const text1Questions = A1_GOETHE_READING_MOCK_TEIL1.questions.filter((question) => question.text === 1);
  const text2Questions = A1_GOETHE_READING_MOCK_TEIL1.questions.filter((question) => question.text === 2);

  return (
    <main className="a1-goethe-mock-shell" data-a1-goethe-reading-mock-preview>
      <div className="a1-goethe-mock-topbar">
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <span className="a1-goethe-mock-preview-badge">Mock preview · not in Course Book</span>
      </div>

      <article className="a1-goethe-mock-exam">
        <header className="a1-goethe-mock-header">
          <p className="a1-goethe-mock-kicker">A1 · Lesen</p>
          <h1>Teil 1</h1>
          <p>Lesen Sie die beiden Texte und die Aufgaben 1 bis 5.</p>
          <p><strong>Kreuzen Sie an: Richtig oder Falsch.</strong></p>
        </header>

        <QuestionBlock
          question={A1_GOETHE_READING_MOCK_TEIL1.example}
          value={answers[0]}
          onChange={(value) => setAnswer(0, value)}
          example
        >
          <ReadingPaper
            title={A1_GOETHE_READING_MOCK_TEIL1.text1.title}
            lines={A1_GOETHE_READING_MOCK_TEIL1.text1.body}
          />
          <button type="button" className="a1-goethe-mock-text-link">
            Textinhalt der Nachricht von Nina
          </button>
        </QuestionBlock>

        {text1Questions.map((question) => (
          <QuestionBlock
            key={question.number}
            question={question}
            value={answers[question.number] || ""}
            onChange={(value) => setAnswer(question.number, value)}
          />
        ))}

        <QuestionBlock
          question={text2Questions[0]}
          value={answers[text2Questions[0].number] || ""}
          onChange={(value) => setAnswer(text2Questions[0].number, value)}
        >
          <ReadingPaper
            title={A1_GOETHE_READING_MOCK_TEIL1.text2.title}
            lines={A1_GOETHE_READING_MOCK_TEIL1.text2.body}
          />
          <button type="button" className="a1-goethe-mock-text-link">
            Textinhalt der Nachricht von Mira
          </button>
        </QuestionBlock>

        {text2Questions.slice(1).map((question) => (
          <QuestionBlock
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
