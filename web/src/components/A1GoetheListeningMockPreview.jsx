import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import "./A1GoetheReadingMockTeil1Preview.css";
import "./A1GoetheListeningMockPreview.css";

export const A1_GOETHE_LISTENING_MOCK = Object.freeze({
  teil2: {
    title: "Teil 2",
    instruction: "Sie hören kurze Ansagen. Sie hören jeden Text einmal.",
    responseInstruction: "Kreuzen Sie an: Richtig oder Falsch.",
    plays: 1,
    questions: [
      {
        number: 2,
        context: "Gleisansage am Hauptbahnhof Frankfurt",
        statement: "Der ICE nach Hamburg fährt heute 20 Minuten später ab.",
      },
      {
        number: 3,
        context: "Durchsage kurz vor Ladenschluss",
        statement: "Die Kunden müssen jetzt zur Kasse gehen.",
      },
      {
        number: 4,
        context: "Flughafen Berlin Brandenburg · Gate B12",
        statement: "Passagiere nach Wien können jetzt an Bord gehen.",
      },
    ],
  },
  teil3: {
    title: "Teil 3",
    instruction: "Sie hören fünf kurze Texte. Sie hören jeden Text zweimal.",
    responseInstruction: "Kreuzen Sie die richtige Lösung A, B oder C an.",
    plays: 2,
    questions: [
      {
        number: 1,
        context: "Telefonnachricht der Zahnarztpraxis",
        question: "An welchem Tag kann Herr Schmidt in die Praxis kommen?",
        options: [
          { id: "A", label: "Am Dienstag", short: "Dienstag" },
          { id: "B", label: "Am Donnerstag", short: "Donnerstag" },
          { id: "C", label: "Am Freitag", short: "Freitag" },
        ],
      },
      {
        number: 2,
        context: "Lieferung einer neuen Waschmaschine",
        question: "Wann kommt der Techniker zur Wohnung?",
        options: [
          { id: "A", label: "Am Vormittag zwischen 8 und 12 Uhr", short: "08:00 – 12:00 Uhr" },
          { id: "B", label: "Am Nachmittag zwischen 14 und 17 Uhr", short: "14:00 – 17:00 Uhr" },
          { id: "C", label: "Am Abend nach 18 Uhr", short: "nach 18:00 Uhr" },
        ],
      },
      {
        number: 3,
        context: "Sprachnachricht von Freundin Julia",
        question: "Wohin soll David zum Abendessen kommen?",
        options: [
          { id: "A", label: "Zu Julia nach Hause", short: "Bei Julia" },
          { id: "B", label: "In die Pizzeria Bella Italia", short: "Pizzeria" },
          { id: "C", label: "Ins Café am Park", short: "Café am Park" },
        ],
      },
      {
        number: 4,
        context: "Auskunft im Stadthotel Dresden",
        question: "Bis wann gibt es am Sonntagmorgen Frühstück?",
        options: [
          { id: "A", label: "Bis 09:30 Uhr", short: "09:30 Uhr" },
          { id: "B", label: "Bis 10:00 Uhr", short: "10:00 Uhr" },
          { id: "C", label: "Bis 11:00 Uhr", short: "11:00 Uhr" },
        ],
      },
      {
        number: 5,
        context: "Ansage an der Volkshochschule Berlin",
        question: "In welchem Raum findet der A1-Deutschkurs heute statt?",
        options: [
          { id: "A", label: "Im Raum 102", short: "Raum 102" },
          { id: "B", label: "Im Raum 204", short: "Raum 204" },
          { id: "C", label: "Im Raum 310", short: "Raum 310" },
        ],
      },
    ],
  },
});

const AudioPlaceholder = ({ plays, context }) => (
  <div className="a1-hoeren-mock-audio" aria-label={`Audio placeholder: ${context}`}>
    <div className="a1-hoeren-mock-play" aria-hidden="true">▶</div>
    <div>
      <strong>MP3 / Audio</strong>
      <p>Audio wird später hinzugefügt.</p>
    </div>
    <span className="a1-hoeren-mock-play-count">{plays}× hören</span>
  </div>
);

const TrueFalseChoices = ({ name, value, onChange }) => (
  <div className="a1-hoeren-mock-true-false" role="radiogroup" aria-label="Richtig oder Falsch">
    {[
      ["richtig", "Richtig"],
      ["falsch", "Falsch"],
    ].map(([id, label]) => (
      <label key={id} className="a1-hoeren-mock-binary-choice">
        <input type="radio" name={name} checked={value === id} onChange={() => onChange(id)} />
        <span className="a1-hoeren-mock-choice-letter">{id === "richtig" ? "a" : "b"}</span>
        <span>
          <strong>{label}</strong>
        </span>
      </label>
    ))}
  </div>
);

const MultipleChoice = ({ name, options, value, onChange }) => (
  <div className="a1-hoeren-mock-multiple-choice" role="radiogroup">
    {options.map((option) => (
      <label key={option.id} className="a1-hoeren-mock-option">
        <input type="radio" name={name} checked={value === option.id} onChange={() => onChange(option.id)} />
        <span className="a1-hoeren-mock-option-letter">{option.id}</span>
        <span className="a1-hoeren-mock-option-copy">
          <strong>{option.label}</strong>
          <small>{option.short}</small>
        </span>
      </label>
    ))}
  </div>
);

export default function A1GoetheListeningMockPreview() {
  const [answers, setAnswers] = useState({});
  const setAnswer = (key, value) => setAnswers((current) => ({ ...current, [key]: value }));

  return (
    <main className="a1-goethe-mock-shell" data-a1-goethe-listening-mock-preview>
      <div className="a1-goethe-mock-topbar">
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <span className="a1-goethe-mock-preview-badge">Hören mock · audio pending · not in Course Book</span>
      </div>

      <article className="a1-goethe-mock-exam a1-hoeren-mock-exam">
        <header className="a1-goethe-mock-header">
          <p className="a1-goethe-mock-kicker">A1 · Hören</p>
          <h1>Mockprüfung</h1>
          <p>Bearbeiten Sie die Aufgaben wie in der Prüfung. Die Audiodateien werden später ergänzt.</p>
        </header>

        <section className="a1-hoeren-mock-part">
          <header className="a1-hoeren-mock-part-header">
            <h2>{A1_GOETHE_LISTENING_MOCK.teil2.title}</h2>
            <p>{A1_GOETHE_LISTENING_MOCK.teil2.instruction}</p>
            <p><strong>{A1_GOETHE_LISTENING_MOCK.teil2.responseInstruction}</strong></p>
          </header>

          {A1_GOETHE_LISTENING_MOCK.teil2.questions.map((question) => {
            const key = `teil2-${question.number}`;
            return (
              <section className="a1-hoeren-mock-question" key={key}>
                <p className="a1-hoeren-mock-number">Aufgabe {question.number}</p>
                <p className="a1-hoeren-mock-context">{question.context}</p>
                <h3>{question.statement}</h3>
                <AudioPlaceholder plays={1} context={question.context} />
                <p className="a1-hoeren-mock-prompt">Wählen Sie: Richtig oder Falsch</p>
                <TrueFalseChoices
                  name={key}
                  value={answers[key] || ""}
                  onChange={(value) => setAnswer(key, value)}
                />
              </section>
            );
          })}
        </section>

        <section className="a1-hoeren-mock-part">
          <header className="a1-hoeren-mock-part-header">
            <h2>{A1_GOETHE_LISTENING_MOCK.teil3.title}</h2>
            <p>{A1_GOETHE_LISTENING_MOCK.teil3.instruction}</p>
            <p><strong>{A1_GOETHE_LISTENING_MOCK.teil3.responseInstruction}</strong></p>
          </header>

          {A1_GOETHE_LISTENING_MOCK.teil3.questions.map((question) => {
            const key = `teil3-${question.number}`;
            return (
              <section className="a1-hoeren-mock-question" key={key}>
                <p className="a1-hoeren-mock-number">Aufgabe {question.number}</p>
                <p className="a1-hoeren-mock-context">{question.context}</p>
                <AudioPlaceholder plays={2} context={question.context} />
                <h3>{question.question}</h3>
                <p className="a1-hoeren-mock-prompt">Wählen Sie: A, B oder C</p>
                <MultipleChoice
                  name={key}
                  options={question.options}
                  value={answers[key] || ""}
                  onChange={(value) => setAnswer(key, value)}
                />
              </section>
            );
          })}
        </section>
      </article>
    </main>
  );
}
