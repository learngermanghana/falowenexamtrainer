import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import "./A1GoetheReadingMockTeil1Preview.css";
import "./A1GoetheReadingMockTeil2Preview.css";

export const A1_GOETHE_READING_MOCK_TEIL2 = Object.freeze({
  example: {
    number: 0,
    statement: "Sie möchten wissen: Wie ist das Wetter morgen in Deutschland?",
    answer: "b",
    options: [
      {
        id: "a",
        url: "www.freizeit-heute.de",
        title: "Freizeit heute",
        subtitle: "Veranstaltungen und Tipps",
        lines: [
          "Konzerte, Feste und Ausflüge in vielen deutschen Städten.",
          "Hier finden Sie Ideen für das Wochenende.",
        ],
      },
      {
        id: "b",
        url: "www.wetterblick.de",
        title: "Wetter Deutschland",
        subtitle: "Heute und morgen",
        lines: [
          "Morgen Regen im Norden, Sonne im Süden.",
          "Temperaturen zwischen 12 und 18 Grad.",
        ],
      },
    ],
  },
  questions: [
    {
      number: 6,
      statement: "Sie möchten am Wochenende mit dem Schiff auf der Mosel fahren.",
      answer: "a",
      options: [
        {
          id: "a",
          url: "www.mosel-schiff.de",
          title: "Schifffahrten auf der Mosel",
          subtitle: "Trier – Bernkastel",
          lines: [
            "Rundfahrten Samstag und Sonntag ab 10 Uhr.",
            "Fahrplan, Preise und Tickets online.",
          ],
        },
        {
          id: "b",
          url: "www.mosel-aktiv.de",
          title: "Aktivurlaub an der Mosel",
          subtitle: "Radfahren und Wandern",
          lines: [
            "Touren für Familien und Gruppen.",
            "Hotels und Ferienwohnungen finden.",
          ],
        },
      ],
    },
    {
      number: 7,
      statement: "Sie möchten im Sommer einen Deutschkurs in Berlin besuchen.",
      answer: "a",
      options: [
        {
          id: "a",
          url: "www.deutsch-campus.de",
          title: "Deutsch lernen in Berlin",
          subtitle: "Sprachkurse A1 bis C1",
          lines: [
            "Neue Kurse starten jeden Montag.",
            "Unterkunft für Kursteilnehmer möglich.",
          ],
        },
        {
          id: "b",
          url: "www.berlin-freizeit.de",
          title: "Berlin erleben",
          subtitle: "Freizeit in der Hauptstadt",
          lines: [
            "Museen, Konzerte und Stadtführungen.",
            "Veranstaltungen für jeden Tag.",
          ],
        },
      ],
    },
    {
      number: 8,
      statement: "Sie möchten eine Zugfahrkarte im Internet kaufen.",
      answer: "b",
      options: [
        {
          id: "a",
          url: "www.reiseplaner24.de",
          title: "Reisen vergleichen",
          subtitle: "Bahn und Bus",
          lines: [
            "Fahrzeiten und Verbindungen suchen.",
            "Auf dieser Seite können Sie keine Fahrkarten kaufen.",
          ],
        },
        {
          id: "b",
          url: "www.zugticket-online.de",
          title: "Bahntickets online",
          subtitle: "Suchen, buchen, fahren",
          lines: [
            "Zugverbindungen suchen und Fahrkarten kaufen.",
            "Ticket aufs Handy laden oder ausdrucken.",
          ],
        },
      ],
    },
    {
      number: 9,
      statement: "Sie möchten Informationen über den Chiemsee.",
      answer: "a",
      options: [
        {
          id: "a",
          url: "www.chiemsee-info.de",
          title: "Urlaub am Chiemsee",
          subtitle: "Informationen für Gäste",
          lines: [
            "Orte, Inseln, Schifffahrt und Sehenswürdigkeiten.",
            "Prospekte und Tourist-Information.",
          ],
        },
        {
          id: "b",
          url: "www.hotel-seeblick.de",
          title: "Hotel Seeblick",
          subtitle: "Zimmer am See",
          lines: [
            "Zimmer mit Frühstück ab 89 Euro.",
            "Jetzt direkt ein Zimmer reservieren.",
          ],
        },
      ],
    },
    {
      number: 10,
      statement: "Sie sind in Kassel und möchten mit dem Zug vor 13 Uhr in München sein.",
      answer: "b",
      timetable: true,
      options: [
        {
          id: "a",
          url: "www.reiseauskunft-bahn.de",
          rows: [
            ["ab", "München Hbf", "22.5.", "08.14", "3:39", "0", "ICE"],
            ["an", "Kassel-Wilhelmshöhe", "22.5.", "11.53", "", "", ""],
          ],
        },
        {
          id: "b",
          url: "www.reiseauskunft-bahn.de",
          rows: [
            ["ab", "Kassel-Wilhelmshöhe", "22.5.", "08.23", "4:24", "1", "ICE, RE"],
            ["an", "München Hbf", "22.5.", "12.47", "", "", ""],
          ],
        },
      ],
    },
  ],
});

const ChoiceButtons = ({ number, value, onChange, example = false }) => (
  <div className="a1-goethe-mock-teil2-answer-row" role="radiogroup" aria-label={example ? "Beispiel 0" : `Aufgabe ${number}`}>
    {["a", "b"].map((option) => (
      <label key={option} className="a1-goethe-mock-choice a1-goethe-mock-letter-choice">
        <input
          type="radio"
          name={`a1-goethe-mock-teil2-${number}`}
          value={option}
          checked={value === option}
          onChange={() => onChange(option)}
          disabled={example}
        />
        <span>{option}</span>
      </label>
    ))}
  </div>
);

const BrowserPanel = ({ option }) => (
  <article className="a1-goethe-mock-browser-panel" aria-label={`Alternative ${option.id}: ${option.url}`}>
    <div className="a1-goethe-mock-browser-greenbar">
      <strong>Internet</strong>
      <span aria-hidden="true">◧</span>
    </div>
    <div className="a1-goethe-mock-browser-toolbar">
      <span className="a1-goethe-mock-browser-icon" aria-hidden="true">⌂</span>
      <span className="a1-goethe-mock-browser-url">{option.url}</span>
    </div>
    <div className="a1-goethe-mock-browser-page">
      <div className="a1-goethe-mock-browser-visual" aria-hidden="true">
        <span>{option.id}</span>
      </div>
      <div className="a1-goethe-mock-browser-copy">
        <h3>{option.title}</h3>
        <strong>{option.subtitle}</strong>
        {option.lines.map((line) => <p key={line}>{line}</p>)}
      </div>
    </div>
  </article>
);

const WebsiteChoice = ({ options }) => (
  <div className="a1-goethe-mock-website-grid">
    {options.map((option) => <BrowserPanel key={option.id} option={option} />)}
  </div>
);

const Timetable = ({ option }) => (
  <article className="a1-goethe-mock-timetable-card" aria-label={`Alternative ${option.id}: ${option.url}`}>
    <div className="a1-goethe-mock-timetable-heading">
      <strong>{option.id}</strong>
      <span>{option.url}</span>
    </div>
    <div className="a1-goethe-mock-table-scroll">
      <table className="a1-goethe-mock-timetable">
        <thead>
          <tr>
            <th></th>
            <th>Bahnhof</th>
            <th>Datum</th>
            <th>Zeit</th>
            <th>Dauer</th>
            <th>Umsteigen</th>
            <th>Angebot</th>
          </tr>
        </thead>
        <tbody>
          {option.rows.map((row, index) => (
            <tr key={`${option.id}-${index}`}>
              {row.map((cell, cellIndex) => (
                <td key={`${option.id}-${index}-${cellIndex}`}>{cell || "\u00a0"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </article>
);

const Teil2Question = ({ question, value, onChange, example = false }) => (
  <section className="a1-goethe-mock-question" aria-labelledby={`a1-goethe-mock-teil2-question-${question.number}`}>
    <h2 id={`a1-goethe-mock-teil2-question-${question.number}`} className="a1-goethe-mock-question-title">
      {example ? "Beispiel: 0 - Teil 2" : `Aufgabe ${question.number}`}
    </h2>
    <p className="a1-goethe-mock-statement">{question.statement}</p>

    {question.timetable ? (
      <div className="a1-goethe-mock-timetable-stack">
        {question.options.map((option) => <Timetable key={option.id} option={option} />)}
      </div>
    ) : (
      <WebsiteChoice options={question.options} />
    )}

    <ChoiceButtons
      number={question.number}
      value={value}
      onChange={onChange}
      example={example}
    />
  </section>
);

export default function A1GoetheReadingMockTeil2Preview() {
  const [answers, setAnswers] = useState({
    0: A1_GOETHE_READING_MOCK_TEIL2.example.answer,
  });

  const setAnswer = (number, value) => {
    setAnswers((current) => ({ ...current, [number]: value }));
  };

  return (
    <main className="a1-goethe-mock-shell" data-a1-goethe-reading-mock-teil2-preview>
      <div className="a1-goethe-mock-topbar">
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <span className="a1-goethe-mock-preview-badge">Mock preview · not in Course Book</span>
      </div>

      <article className="a1-goethe-mock-exam">
        <header className="a1-goethe-mock-header">
          <p className="a1-goethe-mock-kicker">A1 · Lesen</p>
          <h1>Teil 2</h1>
          <p>Lesen Sie die Situationen und die Anzeigen.</p>
          <p><strong>Welche Anzeige passt? Kreuzen Sie an: a oder b.</strong></p>
        </header>

        <Teil2Question
          question={A1_GOETHE_READING_MOCK_TEIL2.example}
          value={answers[0]}
          onChange={(value) => setAnswer(0, value)}
          example
        />

        {A1_GOETHE_READING_MOCK_TEIL2.questions.map((question) => (
          <Teil2Question
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
