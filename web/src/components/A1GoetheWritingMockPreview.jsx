import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import "./A1GoetheReadingMockTeil1Preview.css";
import "./A1GoetheWritingMockPreview.css";

export const A1_GOETHE_WRITING_MOCK = Object.freeze({
  teil1: {
    title: "Teil 1",
    scenario: [
      "Ihre Freundin Linda Mensah macht mit ihrem Mann und ihrer Tochter (10 Jahre alt) Urlaub in Freiburg.",
      "Sie wohnen im Hotel Adler, Gartenstraße 12, 79098 Freiburg.",
      "Im Reisebüro bucht sie für Samstag, den 24. Oktober, eine Busfahrt in den Schwarzwald.",
      "Frau Mensah hat keine Kreditkarte.",
    ],
    instruction:
      "Helfen Sie Ihrer Freundin und schreiben Sie die fünf fehlenden Informationen in das Formular.",
    formRows: [
      { kind: "prefilled", label: "Familienname, Vorname", value: "Mensah, Linda", example: true },
      { kind: "input", number: 1, label: "Anzahl der Personen", answer: "3" },
      { kind: "input", number: 2, label: "Davon Kinder", answer: "1" },
      { kind: "prefilled", label: "Alter des Kindes", value: "10 Jahre" },
      { kind: "prefilled", label: "Urlaubsadresse", value: "Hotel Adler" },
      { kind: "input", number: 3, label: "Straße, Hausnummer", answer: "Gartenstraße 12" },
      { kind: "prefilled", label: "PLZ", value: "79098" },
      { kind: "prefilled", label: "Urlaubsort", value: "Freiburg" },
      { kind: "prefilled", label: "Ausflug", value: "Busfahrt" },
      {
        kind: "choice",
        number: 4,
        label: "Zahlungsweise",
        options: [
          { value: "bar", label: "Bar" },
          { value: "kreditkarte", label: "Kreditkarte" },
        ],
        answer: "bar",
      },
      { kind: "prefilled", label: "Ziel", value: "Schwarzwald" },
      { kind: "input", number: 5, label: "Reisetermin", answer: "Samstag, 24. Oktober" },
    ],
  },
  teil2: {
    title: "Teil 2",
    situation:
      "Sie möchten sich bei der Kochschule GenussZeit für einen Kochkurs anmelden. Schreiben Sie eine E-Mail an die Kochschule.",
    instruction: "Schreiben Sie ungefähr 30 Wörter.",
    points: [
      "Melden Sie sich für den Kochkurs „Italienische Küche“ an.",
      "Fragen Sie, wann der nächste Kurs beginnt.",
      "Fragen Sie nach dem Preis.",
    ],
    reminder:
      "Schreiben Sie eine passende Anrede, einen Gruß und Ihren Namen. Diese gehören zur E-Mail, sind aber keine zusätzlichen Inhaltspunkte.",
  },
});

const Teil1Form = ({ values, onChange }) => (
  <div className="a1-schreiben-form-paper">
    <div className="a1-schreiben-form-header">
      <div>
        <strong>REISEBÜRO</strong>
        <span>Stadttour & Ausflug</span>
      </div>
      <div className="a1-schreiben-form-title">ANMELDUNG</div>
    </div>

    <div className="a1-schreiben-form-body">
      {A1_GOETHE_WRITING_MOCK.teil1.formRows.map((field) => {
        if (field.kind === "prefilled") {
          return (
            <div
              className={field.example ? "a1-schreiben-form-row a1-schreiben-form-example" : "a1-schreiben-form-row"}
              key={field.label}
            >
              <span className="a1-schreiben-form-label">{field.label}</span>
              <span className="a1-schreiben-form-prefilled">
                {field.value}
                {field.example ? <small>Beispiel (0)</small> : null}
              </span>
            </div>
          );
        }

        if (field.kind === "choice") {
          return (
            <fieldset className="a1-schreiben-form-row a1-schreiben-form-choice-row" key={field.number}>
              <legend className="a1-schreiben-form-label">{field.label}</legend>
              <span className="a1-schreiben-form-number">{field.number}</span>
              <div className="a1-schreiben-form-choice-list">
                {field.options.map((option) => (
                  <label key={option.value}>
                    <input
                      type="radio"
                      name={`a1-schreiben-form-${field.number}`}
                      value={option.value}
                      checked={(values[field.number] || "") === option.value}
                      onChange={(event) => onChange(field.number, event.target.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          );
        }

        return (
          <label className="a1-schreiben-form-row" key={field.number}>
            <span className="a1-schreiben-form-label">{field.label}</span>
            <span className="a1-schreiben-form-number">{field.number}</span>
            <input
              type="text"
              value={values[field.number] || ""}
              onChange={(event) => onChange(field.number, event.target.value)}
              aria-label={`Aufgabe ${field.number}: ${field.label}`}
              autoComplete="off"
            />
          </label>
        );
      })}

      <div className="a1-schreiben-form-note">
        Schreiben Sie nur die fünf fehlenden Angaben. Bei der Zahlungsweise kreuzen Sie eine Möglichkeit an.
      </div>
    </div>
  </div>
);

export default function A1GoetheWritingMockPreview() {
  const [formValues, setFormValues] = useState({});
  const [letter, setLetter] = useState("");

  const setField = (number, value) => {
    setFormValues((current) => ({ ...current, [number]: value }));
  };

  const wordCount = letter.trim() ? letter.trim().split(/\s+/).length : 0;

  return (
    <main className="a1-goethe-mock-shell" data-a1-goethe-writing-mock-preview>
      <div className="a1-goethe-mock-topbar">
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <span className="a1-goethe-mock-preview-badge">A1 Schreiben practice</span>
      </div>

      <article className="a1-goethe-mock-exam a1-schreiben-mock-exam">
        <header className="a1-goethe-mock-header">
          <p className="a1-goethe-mock-kicker">A1 · Schreiben</p>
          <h1>Mockprüfung</h1>
          <p>Bearbeitungszeit: ungefähr 20 Minuten.</p>
        </header>

        <section className="a1-schreiben-part">
          <header className="a1-schreiben-part-header">
            <h2>{A1_GOETHE_WRITING_MOCK.teil1.title}</h2>
            {A1_GOETHE_WRITING_MOCK.teil1.scenario.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <p><strong>{A1_GOETHE_WRITING_MOCK.teil1.instruction}</strong></p>
          </header>

          <Teil1Form values={formValues} onChange={setField} />
        </section>

        <section className="a1-schreiben-part">
          <header className="a1-schreiben-part-header">
            <h2>{A1_GOETHE_WRITING_MOCK.teil2.title}</h2>
            <p>{A1_GOETHE_WRITING_MOCK.teil2.situation}</p>
            <p><strong>{A1_GOETHE_WRITING_MOCK.teil2.instruction}</strong></p>
          </header>

          <div className="a1-schreiben-letter-task">
            <div className="a1-schreiben-three-points">
              {A1_GOETHE_WRITING_MOCK.teil2.points.map((point, index) => (
                <div className="a1-schreiben-point" key={point}>
                  <span>{index + 1}</span>
                  <p>{point}</p>
                </div>
              ))}
            </div>

            <p className="a1-schreiben-reminder">{A1_GOETHE_WRITING_MOCK.teil2.reminder}</p>

            <label className="a1-schreiben-textarea-label" htmlFor="a1-schreiben-letter">
              Ihre E-Mail
            </label>
            <textarea
              id="a1-schreiben-letter"
              value={letter}
              onChange={(event) => setLetter(event.target.value)}
              rows={11}
              placeholder="Sehr geehrte Damen und Herren, ..."
            />

            <div className="a1-schreiben-word-count">
              Wörter: <strong>{wordCount}</strong> · Ziel: ungefähr 30
            </div>
          </div>
        </section>
      </article>
    </main>
  );
}
