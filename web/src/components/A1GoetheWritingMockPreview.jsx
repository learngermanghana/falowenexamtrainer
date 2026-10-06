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
    instruction: "Schreiben Sie ungefähr 30 Wörter.",
    reminder:
      "Schreiben Sie eine passende Anrede, alle drei Inhaltspunkte, einen Gruß und Ihren Namen. Anrede, Gruß und Name sind Pflicht, aber keine zusätzlichen Inhaltspunkte.",
    samples: [
      {
        id: "hotel-berliner-hof",
        title: "1. Hotel accommodation",
        register: "Formal",
        situation: "Sie möchten im Sommer nach Berlin reisen und brauchen ein Hotelzimmer. Schreiben Sie eine E-Mail an das Hotel „Berliner Hof“.",
        points: [
          "Ankunftsdatum und Dauer: Wann kommen Sie an? Wie lange bleiben Sie?",
          "Zimmerwunsch: Einzelzimmer oder Doppelzimmer mit Frühstück?",
          "Preis: Fragen Sie nach dem Preis.",
        ],
        placeholder: "Sehr geehrte Damen und Herren, ...",
      },
      {
        id: "birthday-michael",
        title: "2. Birthday invitation",
        register: "Informal",
        situation: "Ihr Freund Michael feiert am Samstag Geburtstag und hat Sie eingeladen. Schreiben Sie eine E-Mail an Michael.",
        points: [
          "Zusage: Sagen Sie, dass Sie gerne zur Party kommen.",
          "Geschenk: Fragen Sie, was Michael sich wünscht oder was Sie mitbringen sollen.",
          "Uhrzeit: Fragen Sie, wann die Party beginnt.",
        ],
        placeholder: "Lieber Michael, ...",
      },
      {
        id: "sick-frau-mueller",
        title: "3. Absence from class",
        register: "Formal",
        situation: "Sie sind krank und können am Donnerstag nicht zum Deutschkurs kommen. Schreiben Sie an Ihre Lehrerin, Frau Müller.",
        points: [
          "Grund: Sagen Sie, dass Sie krank sind.",
          "Entschuldigung: Sagen Sie, dass Sie am Donnerstag fehlen.",
          "Hausaufgaben: Fragen Sie nach den Hausaufgaben.",
        ],
        placeholder: "Sehr geehrte Frau Müller, ...",
      },
      {
        id: "sprachschule-aktiv",
        title: "4. Language school inquiry",
        register: "Formal",
        situation: "Sie möchten einen Deutschkurs bei der Sprachschule „Aktiv“ machen. Schreiben Sie eine E-Mail an die Sprachschule.",
        points: [
          "Kursstart: Fragen Sie, wann der nächste A1-Kurs beginnt.",
          "Kurszeiten: Fragen Sie, ob es Abendkurse gibt.",
          "Kosten: Fragen Sie, wie viel der Kurs kostet.",
        ],
        placeholder: "Sehr geehrte Damen und Herren, ...",
      },
      {
        id: "meeting-sarah",
        title: "5. Meeting with Sarah",
        register: "Informal",
        situation: "Sie möchten sich am Wochenende mit Ihrer Freundin Sarah in der Stadt treffen. Schreiben Sie an Sarah.",
        points: [
          "Vorschlag: Schlagen Sie ein Treffen am Samstag vor.",
          "Aktivität: Schlagen Sie Kaffee trinken oder Kino vor.",
          "Treffpunkt und Uhrzeit: Fragen oder sagen Sie, wo und wann Sie sich treffen.",
        ],
        placeholder: "Liebe Sarah, ...",
      },
      {
        id: "tourist-office-hamburg",
        title: "6. Tourist office",
        register: "Formal",
        situation: "Sie planen eine Reise nach Hamburg. Schreiben Sie an die Touristeninformation Hamburg.",
        points: [
          "Stadtplan: Bitten Sie um einen Stadtplan.",
          "Informationen: Fragen Sie nach Ausflugstipps oder einer Hafenrundfahrt.",
          "Zuschicken: Bitten Sie darum, Prospekte per Post oder E-Mail zu senden.",
        ],
        placeholder: "Sehr geehrte Damen und Herren, ...",
      },
      {
        id: "fahrrad-herr-weber",
        title: "7. Used bicycle",
        register: "Semi-formal",
        situation: "Sie haben im Internet ein gebrauchtes Fahrrad gesehen und möchten es kaufen. Schreiben Sie an den Verkäufer, Herrn Weber.",
        points: [
          "Interesse: Sagen Sie, dass Sie das Fahrrad kaufen möchten.",
          "Zustand: Fragen Sie nach dem Alter oder Zustand des Fahrrads.",
          "Termin: Fragen Sie nach einem Termin für eine Probefahrt.",
        ],
        placeholder: "Sehr geehrter Herr Weber, ...",
      },
      {
        id: "fit-und-aktiv",
        title: "8. Sports club",
        register: "Formal",
        situation: "Sie möchten im Sportverein „Fit & Aktiv“ Mitglied werden. Schreiben Sie eine E-Mail.",
        points: [
          "Probetraining: Fragen Sie nach einem kostenlosen Probetraining.",
          "Öffnungszeiten: Fragen Sie nach den Öffnungszeiten am Wochenende.",
          "Mitgliedsbeitrag: Fragen Sie, wie viel die Mitgliedschaft pro Monat kostet.",
        ],
        placeholder: "Sehr geehrte Damen und Herren, ...",
      },
      {
        id: "thanks-lisa",
        title: "9. Thank-you to Lisa",
        register: "Informal",
        situation: "Ihre Bekannte Lisa hat Sie für das Wochenende zu sich nach München eingeladen. Schreiben Sie an Lisa.",
        points: [
          "Dank: Bedanken Sie sich für die Einladung.",
          "Ankunftszeit: Sagen Sie, wann Sie am Bahnhof ankommen.",
          "Verkehrsmittel: Sagen Sie, wie Sie reisen, zum Beispiel mit dem Zug.",
        ],
        placeholder: "Liebe Lisa, ...",
      },
      {
        id: "landlord-heating",
        title: "10. Heating problem",
        register: "Formal",
        situation: "Die Heizung in Ihrer Wohnung ist kaputt. Schreiben Sie eine E-Mail an Ihren Vermieter, Herrn Schneider.",
        points: [
          "Problem: Sagen Sie, dass die Heizung nicht funktioniert und die Wohnung kalt ist.",
          "Termin: Sagen Sie, wann Sie für den Handwerker zu Hause sind.",
          "Rückruf: Bitten Sie um eine schnelle Reparatur oder einen Anruf.",
        ],
        placeholder: "Sehr geehrter Herr Schneider, ...",
      },
    ],
    checklist: {
      formalSalutation: "Sehr geehrte Frau [Nachname], / Sehr geehrter Herr [Nachname], / Sehr geehrte Damen und Herren,",
      informalSalutation: "Liebe [Name], / Lieber [Name], / Hallo [Name],",
      body: "Beantworten Sie alle drei Inhaltspunkte klar.",
      formalClosing: "Mit freundlichen Grüßen + Vorname und Nachname",
      informalClosing: "Viele Grüße / Liebe Grüße + Vorname",
    },
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
  const [activeSampleId, setActiveSampleId] = useState(A1_GOETHE_WRITING_MOCK.teil2.samples[0].id);
  const [lettersBySample, setLettersBySample] = useState({});

  const setField = (number, value) => {
    setFormValues((current) => ({ ...current, [number]: value }));
  };

  const activeSample =
    A1_GOETHE_WRITING_MOCK.teil2.samples.find((sample) => sample.id === activeSampleId) ||
    A1_GOETHE_WRITING_MOCK.teil2.samples[0];
  const letter = lettersBySample[activeSample.id] || "";
  const setLetter = (value) => {
    setLettersBySample((current) => ({ ...current, [activeSample.id]: value }));
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
            <p>Wählen Sie eine Aufgabe. Jede Aufgabe hat genau drei Inhaltspunkte.</p>
            <p><strong>{A1_GOETHE_WRITING_MOCK.teil2.instruction}</strong></p>
          </header>

          <div className="a1-schreiben-letter-task">
            <div className="a1-schreiben-sample-picker" aria-label="A1 Schreiben samples">
              {A1_GOETHE_WRITING_MOCK.teil2.samples.map((sample) => (
                <button
                  type="button"
                  key={sample.id}
                  className={sample.id === activeSample.id ? "is-active" : ""}
                  onClick={() => setActiveSampleId(sample.id)}
                >
                  {sample.title}
                </button>
              ))}
            </div>

            <div className="a1-schreiben-active-sample">
              <div className="a1-schreiben-active-sample-heading">
                <h3>{activeSample.title}</h3>
                <span>{activeSample.register}</span>
              </div>
              <p>{activeSample.situation}</p>
            </div>

            <div className="a1-schreiben-three-points">
              {activeSample.points.map((point, index) => (
                <div className="a1-schreiben-point" key={point}>
                  <span>{index + 1}</span>
                  <p>{point}</p>
                </div>
              ))}
            </div>

            <p className="a1-schreiben-reminder">{A1_GOETHE_WRITING_MOCK.teil2.reminder}</p>

            <div className="a1-schreiben-checklist">
              <strong>Checklist for full marks</strong>
              <ul>
                <li><b>Formal:</b> {A1_GOETHE_WRITING_MOCK.teil2.checklist.formalSalutation}</li>
                <li><b>Informal:</b> {A1_GOETHE_WRITING_MOCK.teil2.checklist.informalSalutation}</li>
                <li><b>Body:</b> {A1_GOETHE_WRITING_MOCK.teil2.checklist.body}</li>
                <li><b>Formal closing:</b> {A1_GOETHE_WRITING_MOCK.teil2.checklist.formalClosing}</li>
                <li><b>Informal closing:</b> {A1_GOETHE_WRITING_MOCK.teil2.checklist.informalClosing}</li>
              </ul>
            </div>

            <label className="a1-schreiben-textarea-label" htmlFor="a1-schreiben-letter">
              Ihre E-Mail
            </label>
            <textarea
              id="a1-schreiben-letter"
              value={letter}
              onChange={(event) => setLetter(event.target.value)}
              rows={11}
              placeholder={activeSample.placeholder}
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
