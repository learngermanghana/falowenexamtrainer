import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import "./A1GoetheReadingMockTeil1Preview.css";
import "./A1GoetheListeningMockPreview.css";

export const A1_GOETHE_LISTENING_MOCK = Object.freeze({
  teil2: {
    title: "Teil 2",
    instruction: "Sie hören vier kurze Ansagen. Sie hören jeden Text einmal.",
    responseInstruction: "Kreuzen Sie an: Richtig oder Falsch.",
    plays: 1,
    audioObjectKey: "a1/mock-hoeren/mock-01/teil-2.mp3",
    questions: [
      {
        number: 7,
        context: "Bahnhof · Verspätung nach Hamburg",
        statement: "Der Zug nach Hamburg fährt um 10.15 Uhr ab.",
        answer: "falsch",
      },
      {
        number: 8,
        context: "Bahnhof · Zugausfall nach Nürnberg",
        statement: "Der nächste Zug nach Nürnberg fährt um 11.10 Uhr.",
        answer: "richtig",
      },
      {
        number: 9,
        context: "Bahnhof · Fahrkartenschalter",
        statement: "Die Fahrgäste können ihre Fahrkarte heute am Schalter kaufen.",
        answer: "falsch",
      },
      {
        number: 10,
        context: "Bahnhof · Koffer ohne Besitzer",
        statement: "Der Besitzer des Koffers soll zum Informationsschalter gehen.",
        answer: "richtig",
      },
    ],
  },
  teil3: {
    title: "Teil 3",
    instruction: "Sie hören fünf kurze Texte. Sie hören jeden Text zweimal.",
    responseInstruction: "Kreuzen Sie die richtige Lösung A, B oder C an.",
    plays: 2,
    audioObjectKey: "a1/mock-hoeren/mock-01/teil-3.mp3",
    questions: [
      {
        number: 11,
        context: "Anrufbeantworter · Paul an Anna",
        question: "Wann treffen sich Anna und Paul?",
        answer: "B",
        options: [
          { id: "A", label: "Um 17 Uhr", short: "17:00 Uhr" },
          { id: "B", label: "Um 18 Uhr", short: "18:00 Uhr" },
          { id: "C", label: "Um 19 Uhr", short: "19:00 Uhr" },
        ],
      },
      {
        number: 12,
        context: "Durchsage im Kaufhaus",
        question: "Was kostet heute die Hälfte?",
        answer: "A",
        options: [
          { id: "A", label: "Obst und Gemüse", short: "Obst + Gemüse" },
          { id: "B", label: "Brot und Kuchen", short: "Brot + Kuchen" },
          { id: "C", label: "Schuhe und Taschen", short: "Schuhe + Taschen" },
        ],
      },
      {
        number: 13,
        context: "Ansage einer Arztpraxis",
        question: "Ab wann ist die Praxis wieder geöffnet?",
        answer: "B",
        options: [
          { id: "A", label: "Ab Freitag", short: "Freitag" },
          { id: "B", label: "Ab Montag", short: "Montag" },
          { id: "C", label: "Ab Dienstag", short: "Dienstag" },
        ],
      },
      {
        number: 14,
        context: "Ansage am Bahnhof",
        question: "Von welchem Gleis fährt der Zug nach Dresden?",
        answer: "B",
        options: [
          { id: "A", label: "Von Gleis 4", short: "Gleis 4" },
          { id: "B", label: "Von Gleis 9", short: "Gleis 9" },
          { id: "C", label: "Von Gleis 7", short: "Gleis 7" },
        ],
      },
      {
        number: 15,
        context: "Durchsage im Schwimmbad",
        question: "Wann müssen die Gäste das Becken verlassen?",
        answer: "A",
        options: [
          { id: "A", label: "Um 18:30 Uhr", short: "18:30 Uhr" },
          { id: "B", label: "Um 19:00 Uhr", short: "19:00 Uhr" },
          { id: "C", label: "Um 19:30 Uhr", short: "19:30 Uhr" },
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
