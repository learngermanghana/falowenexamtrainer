import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getReadingPracticeStudentKey,
  getReadingReadinessLabel,
  getWeakestReadingSection,
  saveReadingPracticeAttempt,
} from "../services/readingPracticeHistory";
import { useAuth } from "../context/AuthContext";
import "./A1GoetheReadingMockTeil1Preview.css";
import "./A1GoetheReadingMockTeil2Preview.css";
import "./A1GoetheReadingMockTeil3Preview.css";
import "./A1ReadingPracticeSamples.css";

const SAMPLE_DURATION_SECONDS = 25 * 60;

const browserOption = (id, url, title, subtitle, lines) => ({
  id,
  url,
  title,
  subtitle,
  lines,
});

const noticeQuestion = (number, location, statement, answer, kind, heading, lines) => ({
  number,
  location,
  statement,
  answer,
  notice: { kind, heading, lines },
});

export const A1_READING_PRACTICE_SAMPLES = Object.freeze([
  {
    id: "a1-reading-sample-01",
    label: "Lesen Sample 1",
    parts: {
      teil1: {
        title: "Teil 1",
        instruction: "Lesen Sie die beiden Texte und die Aufgaben 1 bis 5.",
        strong: "Kreuzen Sie an: Richtig oder Falsch.",
        texts: [
          {
            id: 1,
            title: "Nachricht von Lara",
            body: [
              "Hallo Ben,",
              "ich komme am Freitag nicht wie geplant um 16 Uhr, sondern erst um 18.10 Uhr in Hannover an.",
              "Mein Zug hat eine andere Abfahrtszeit. Kannst du mich bitte am Hauptbahnhof abholen?",
              "Am Samstag möchte ich mit dir den Flohmarkt besuchen.",
              "Liebe Grüße",
              "Lara",
            ],
          },
          {
            id: 2,
            title: "Nachricht von Tobias",
            body: [
              "Liebe Jana,",
              "danke für die Einladung zu deiner Gartenparty am Sonntag.",
              "Ich komme gern und bringe einen Salat mit. Meine Schwester kann leider nicht kommen, weil sie arbeiten muss.",
              "Ich bin gegen 15 Uhr bei dir. Wenn es regnet, können wir ja drinnen feiern.",
              "Bis Sonntag!",
              "Tobias",
            ],
          },
        ],
        questions: [
          { number: 1, statement: "Lara kommt am Freitag um 16 Uhr an.", answer: "falsch", text: 1 },
          { number: 2, statement: "Ben soll Lara am Bahnhof abholen.", answer: "richtig", text: 1 },
          { number: 3, statement: "Tobias kommt nicht zur Gartenparty.", answer: "falsch", text: 2 },
          { number: 4, statement: "Tobias bringt etwas zu essen mit.", answer: "richtig", text: 2 },
          { number: 5, statement: "Bei Regen wollen sie draußen bleiben.", answer: "falsch", text: 2 },
        ],
      },
      teil2: {
        title: "Teil 2",
        instruction: "Lesen Sie die Situationen und die Anzeigen.",
        strong: "Welche Anzeige passt? Kreuzen Sie an: a oder b.",
        questions: [
          {
            number: 6,
            statement: "Sie möchten am Samstagvormittag schwimmen gehen.",
            answer: "a",
            options: [
              browserOption("a", "www.stadtbad-mitte.de", "Stadtbad Mitte", "Samstag geöffnet", ["Sa 8.00–14.00 Uhr", "Schwimmen für alle Altersgruppen."]),
              browserOption("b", "www.abendbad.de", "Abendbad", "Nur am Abend", ["Samstag 17.00–22.00 Uhr", "Frühschwimmen gibt es nur montags."]),
            ],
          },
          {
            number: 7,
            statement: "Sie suchen einen Deutschkurs am Abend.",
            answer: "b",
            options: [
              browserOption("a", "www.deutsch-vormittag.de", "Deutsch lernen", "Kurse am Vormittag", ["Montag bis Freitag 9.00–12.00 Uhr.", "A1 bis B2."]),
              browserOption("b", "www.sprachzentrum-abend.de", "Abendkurse Deutsch", "Nach der Arbeit lernen", ["Dienstag und Donnerstag 18.30–20.30 Uhr.", "A1, A2 und B1."]),
            ],
          },
          {
            number: 8,
            statement: "Sie möchten heute noch Blumen liefern lassen.",
            answer: "a",
            options: [
              browserOption("a", "www.blumen-blitz.de", "Blumen-Blitz", "Lieferung am selben Tag", ["Bestellung bis 14 Uhr.", "Lieferung heute in der ganzen Stadt."]),
              browserOption("b", "www.gartenfreude.de", "Gartenfreude", "Pflanzen für Balkon und Garten", ["Abholung im Geschäft.", "Keine Lieferung."]),
            ],
          },
          {
            number: 9,
            statement: "Sie brauchen eine günstige Unterkunft mit Frühstück.",
            answer: "b",
            options: [
              browserOption("a", "www.city-apartment.de", "City Apartment", "Ferienwohnung im Zentrum", ["Küche und Balkon.", "Frühstück nicht inklusive."]),
              browserOption("b", "www.pension-sonne.de", "Pension Sonne", "Zimmer ab 39 Euro", ["Frühstück inklusive.", "Nähe Hauptbahnhof."]),
            ],
          },
          {
            number: 10,
            statement: "Sie möchten am Sonntag ein Fahrrad mieten.",
            answer: "a",
            options: [
              browserOption("a", "www.rad-am-park.de", "Rad am Park", "Fahrradverleih", ["Täglich 9.00–19.00 Uhr.", "Cityräder und E-Bikes."]),
              browserOption("b", "www.radwerkstatt.de", "Radwerkstatt", "Reparatur und Verkauf", ["Montag bis Samstag.", "Sonntag geschlossen."]),
            ],
          },
        ],
      },
      teil3: {
        title: "Teil 3",
        instruction: "Lesen Sie die Texte und die Aufgaben 11 bis 15.",
        strong: "Kreuzen Sie an: Richtig oder Falsch.",
        questions: [
          noticeQuestion(11, "An der Bibliothek", "Am Montag können Sie bis 20 Uhr Bücher ausleihen.", "richtig", "hours", "ÖFFNUNGSZEITEN", ["Montag 10–20 Uhr", "Dienstag–Freitag 10–18 Uhr", "Samstag 10–13 Uhr"]),
          noticeQuestion(12, "Im Café", "Sie dürfen hier mit Karte bezahlen.", "falsch", "warning", "NUR BARZAHLUNG", ["Kartenzahlung ist heute leider nicht möglich."]),
          noticeQuestion(13, "An der Bushaltestelle", "Der Bus 24 hält heute nicht am Rathaus.", "richtig", "transport", "LINIE 24", ["Wegen Bauarbeiten:", "Haltestelle Rathaus entfällt heute.", "Bitte Marktstraße benutzen."]),
          noticeQuestion(14, "Im Fitnessstudio", "Am Sonntag öffnet das Studio um 10 Uhr.", "falsch", "hours", "TRAININGSZEITEN", ["Mo–Fr 6–22 Uhr", "Sa 8–18 Uhr", "So 9–16 Uhr"]),
          noticeQuestion(15, "An einer Wohnungstür", "Pakete sollen bei Frau Klein abgegeben werden.", "richtig", "sign", "PAKETE", ["Wenn niemand da ist,", "bitte bei Frau Klein, Wohnung 4, klingeln."]),
        ],
      },
    },
  },
  {
    id: "a1-reading-sample-02",
    label: "Lesen Sample 2",
    parts: {
      teil1: {
        title: "Teil 1",
        instruction: "Lesen Sie die beiden Texte und die Aufgaben 1 bis 5.",
        strong: "Kreuzen Sie an: Richtig oder Falsch.",
        texts: [
          {
            id: 1,
            title: "Nachricht von Paula",
            body: [
              "Hallo Amir,",
              "unser Treffen morgen muss später sein. Ich arbeite bis 17 Uhr und brauche danach noch etwa 30 Minuten.",
              "Treffen wir uns um 18 Uhr vor dem Kino? Der Film beginnt um 18.45 Uhr.",
              "Die Karten habe ich schon gekauft.",
              "Bis morgen",
              "Paula",
            ],
          },
          {
            id: 2,
            title: "Nachricht von Daniel",
            body: [
              "Liebe Sofia,",
              "ich bin seit Montag in München und bleibe noch bis Freitag.",
              "Mein Hotel liegt direkt neben dem Deutschen Museum. Vormittags habe ich einen Kurs, aber am Nachmittag bin ich frei.",
              "Am Donnerstag möchte ich in den Englischen Garten gehen. Hast du Zeit?",
              "Viele Grüße",
              "Daniel",
            ],
          },
        ],
        questions: [
          { number: 1, statement: "Paula arbeitet morgen bis 17 Uhr.", answer: "richtig", text: 1 },
          { number: 2, statement: "Paula muss noch Kinokarten kaufen.", answer: "falsch", text: 1 },
          { number: 3, statement: "Daniel ist nur einen Tag in München.", answer: "falsch", text: 2 },
          { number: 4, statement: "Daniel hat am Nachmittag Zeit.", answer: "richtig", text: 2 },
          { number: 5, statement: "Daniel möchte am Donnerstag Sofia treffen.", answer: "richtig", text: 2 },
        ],
      },
      teil2: {
        title: "Teil 2",
        instruction: "Lesen Sie die Situationen und die Anzeigen.",
        strong: "Welche Anzeige passt? Kreuzen Sie an: a oder b.",
        questions: [
          {
            number: 6,
            statement: "Sie möchten am Sonntagmorgen Brot kaufen.",
            answer: "b",
            options: [
              browserOption("a", "www.backhaus-west.de", "Backhaus West", "Frisch aus dem Ofen", ["Mo–Sa 6.30–18.00 Uhr.", "Sonntag geschlossen."]),
              browserOption("b", "www.sonntagsbaecker.de", "Sonntagsbäcker", "Auch sonntags geöffnet", ["Sonntag 7.00–12.00 Uhr.", "Brot, Brötchen und Kuchen."]),
            ],
          },
          {
            number: 7,
            statement: "Sie suchen einen gebrauchten Laptop unter 300 Euro.",
            answer: "a",
            options: [
              browserOption("a", "www.pc-gebraucht.de", "Laptop gebraucht", "Ab 220 Euro", ["Geprüfte Geräte mit Garantie.", "Mehrere Modelle unter 300 Euro."]),
              browserOption("b", "www.neue-notebooks.de", "Neue Notebooks", "Aktuelle Modelle", ["Preise ab 649 Euro.", "Kostenlose Lieferung."]),
            ],
          },
          {
            number: 8,
            statement: "Sie möchten mit Ihrem Hund in einem Hotel übernachten.",
            answer: "b",
            options: [
              browserOption("a", "www.hotel-parkblick.de", "Hotel Parkblick", "Ruhige Zimmer", ["Haustiere sind nicht erlaubt.", "Frühstück inklusive."]),
              browserOption("b", "www.hotel-tierfreund.de", "Hotel Tierfreund", "Willkommen mit Hund", ["Hunde erlaubt.", "10 Euro pro Nacht für Haustiere."]),
            ],
          },
          {
            number: 9,
            statement: "Sie möchten heute Abend italienisch essen.",
            answer: "a",
            options: [
              browserOption("a", "www.trattoria-roma.de", "Trattoria Roma", "Pasta und Pizza", ["Täglich 17.00–23.00 Uhr.", "Reservierung möglich."]),
              browserOption("b", "www.mittag-italia.de", "Italia Lunch", "Mittagsmenü", ["Mo–Fr 11.30–14.30 Uhr.", "Abends geschlossen."]),
            ],
          },
          {
            number: 10,
            statement: "Sie möchten mit dem Zug fahren und Ihr Fahrrad mitnehmen.",
            answer: "b",
            options: [
              browserOption("a", "www.bus-schnell.de", "Fernbus günstig", "Viele Städte", ["Fahrräder können nicht mitgenommen werden.", "Tickets online."]),
              browserOption("b", "www.bahn-mobil.de", "Bahn & Rad", "Fahrrad im Zug", ["Fahrradkarte online buchen.", "Reservierung für Fernzüge möglich."]),
            ],
          },
        ],
      },
      teil3: {
        title: "Teil 3",
        instruction: "Lesen Sie die Texte und die Aufgaben 11 bis 15.",
        strong: "Kreuzen Sie an: Richtig oder Falsch.",
        questions: [
          noticeQuestion(11, "Im Supermarkt", "Heute schließt der Supermarkt schon um 18 Uhr.", "richtig", "warning", "HEUTE FRÜHER GESCHLOSSEN", ["Wegen Inventur", "schließen wir heute um 18.00 Uhr."]),
          noticeQuestion(12, "Am Aufzug", "Der Aufzug funktioniert wieder.", "falsch", "sign", "AUFZUG DEFEKT", ["Bitte benutzen Sie die Treppe.", "Reparatur am Dienstag."]),
          noticeQuestion(13, "Im Parkhaus", "In der ersten Stunde müssen Sie nichts bezahlen.", "richtig", "notice", "PARKEN", ["1. Stunde kostenlos", "danach 1,50 € pro Stunde"]),
          noticeQuestion(14, "An der Arztpraxis", "Am Mittwoch ist die Praxis am Nachmittag geöffnet.", "falsch", "hours", "SPRECHZEITEN", ["Mo, Di, Do 8–12 und 15–18 Uhr", "Mi, Fr 8–12 Uhr"]),
          noticeQuestion(15, "Im Restaurant", "Kinder essen am Dienstag günstiger.", "richtig", "event", "FAMILIENTAG", ["Jeden Dienstag:", "Kindergerichte nur 4 Euro."]),
        ],
      },
    },
  },
  {
    id: "a1-reading-sample-03",
    label: "Lesen Sample 3",
    parts: {
      teil1: {
        title: "Teil 1",
        instruction: "Lesen Sie die beiden Texte und die Aufgaben 1 bis 5.",
        strong: "Kreuzen Sie an: Richtig oder Falsch.",
        texts: [
          {
            id: 1,
            title: "Nachricht von Nele",
            body: [
              "Hallo Marco,",
              "ich habe deinen Schlüssel gestern bei Frau Berger im Büro abgegeben.",
              "Sie ist heute bis 17 Uhr dort. Morgen arbeitet sie nur am Vormittag.",
              "Bitte hol den Schlüssel bald ab, denn am Freitag ist das Büro geschlossen.",
              "Viele Grüße",
              "Nele",
            ],
          },
          {
            id: 2,
            title: "Nachricht von Karim",
            body: [
              "Liebe Elena,",
              "am Samstag machen wir einen Ausflug an den See.",
              "Wir fahren um 9 Uhr mit dem Bus vom Bahnhof ab und sind gegen 10 Uhr dort.",
              "Bitte nimm etwas zu trinken mit. Essen kaufen wir später in einem kleinen Restaurant am See.",
              "Am Abend sind wir ungefähr um 19 Uhr zurück.",
              "Viele Grüße",
              "Karim",
            ],
          },
        ],
        questions: [
          { number: 1, statement: "Nele hat Marcos Schlüssel noch bei sich.", answer: "falsch", text: 1 },
          { number: 2, statement: "Frau Berger ist heute bis 17 Uhr im Büro.", answer: "richtig", text: 1 },
          { number: 3, statement: "Karim und Elena fahren mit dem Zug zum See.", answer: "falsch", text: 2 },
          { number: 4, statement: "Elena soll etwas zu trinken mitbringen.", answer: "richtig", text: 2 },
          { number: 5, statement: "Die Gruppe bleibt über Nacht am See.", answer: "falsch", text: 2 },
        ],
      },
      teil2: {
        title: "Teil 2",
        instruction: "Lesen Sie die Situationen und die Anzeigen.",
        strong: "Welche Anzeige passt? Kreuzen Sie an: a oder b.",
        questions: [
          {
            number: 6,
            statement: "Sie möchten am Abend einen Termin beim Friseur.",
            answer: "b",
            options: [
              browserOption("a", "www.friseur-morgen.de", "Salon Morgen", "Früh geöffnet", ["Mo–Fr 7.00–15.00 Uhr.", "Samstag 8.00–13.00 Uhr."]),
              browserOption("b", "www.cityhair.de", "City Hair", "Auch nach der Arbeit", ["Dienstag–Freitag bis 20.00 Uhr.", "Termine online buchen."]),
            ],
          },
          {
            number: 7,
            statement: "Sie möchten Möbel kostenlos abholen lassen.",
            answer: "a",
            options: [
              browserOption("a", "www.sozial-moebel.de", "Möbelspende", "Wir holen ab", ["Gut erhaltene Möbel kostenlos abholen lassen.", "Termin telefonisch vereinbaren."]),
              browserOption("b", "www.moebelmarkt24.de", "Möbelmarkt 24", "Neue Möbel", ["Lieferung ab 49 Euro.", "Keine Abholung alter Möbel."]),
            ],
          },
          {
            number: 8,
            statement: "Sie suchen einen Kochkurs für Anfänger.",
            answer: "b",
            options: [
              browserOption("a", "www.profi-kueche.de", "Profi-Küche", "Für Fortgeschrittene", ["Techniken für erfahrene Hobbyköche.", "Vorkenntnisse nötig."]),
              browserOption("b", "www.kochen-start.de", "Kochen leicht gemacht", "Anfängerkurs", ["Keine Vorkenntnisse nötig.", "Mittwoch 18.00 Uhr."]),
            ],
          },
          {
            number: 9,
            statement: "Sie möchten am Wochenende ein Auto mieten.",
            answer: "a",
            options: [
              browserOption("a", "www.auto-flex.de", "Auto Flex", "Wochenend-Angebot", ["Freitag bis Montag ab 79 Euro.", "Online reservieren."]),
              browserOption("b", "www.auto-werktag.de", "Auto Werktag", "Geschäftskunden", ["Vermietung nur Montag bis Freitag.", "Wochenende geschlossen."]),
            ],
          },
          {
            number: 10,
            statement: "Sie suchen einen kostenlosen Stadtplan.",
            answer: "b",
            options: [
              browserOption("a", "www.city-shop.de", "Souvenirs der Stadt", "Karten und Bücher", ["Stadtpläne ab 8 Euro.", "Online bestellen."]),
              browserOption("b", "www.tourist-info.de", "Tourist-Information", "Informationen für Gäste", ["Kostenloser Stadtplan am Schalter.", "Täglich geöffnet."]),
            ],
          },
        ],
      },
      teil3: {
        title: "Teil 3",
        instruction: "Lesen Sie die Texte und die Aufgaben 11 bis 15.",
        strong: "Kreuzen Sie an: Richtig oder Falsch.",
        questions: [
          noticeQuestion(11, "Am Bahnhof", "Der Zug nach Köln fährt heute von Gleis 7.", "richtig", "transport", "GLEISÄNDERUNG", ["ICE 615 nach Köln", "heute Abfahrt von Gleis 7."]),
          noticeQuestion(12, "Im Museum", "Kinder unter sechs Jahren brauchen eine Eintrittskarte.", "falsch", "notice", "EINTRITT", ["Erwachsene 12 €", "Kinder 6–15 Jahre 5 €", "Kinder unter 6 frei"]),
          noticeQuestion(13, "Am See", "Hier dürfen Sie schwimmen.", "falsch", "warning", "BADEVERBOT", ["Schwimmen ist wegen starker Strömung verboten."]),
          noticeQuestion(14, "In der Schule", "Der Elternabend beginnt um 18.30 Uhr.", "richtig", "event", "ELTERNABEND", ["Donnerstag, 18.30 Uhr", "Raum 204"]),
          noticeQuestion(15, "An der Apotheke", "Die Apotheke ist am Samstag bis 16 Uhr geöffnet.", "falsch", "hours", "ÖFFNUNGSZEITEN", ["Mo–Fr 8–19 Uhr", "Sa 9–13 Uhr", "So geschlossen"]),
        ],
      },
    },
  },
]);

const formatTime = (seconds) => {
  const safe = Math.max(0, Number(seconds) || 0);
  return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
};

const ReadingPaper = ({ title, lines }) => (
  <figure className="a1-goethe-mock-paper">
    <figcaption className="sr-only">{title}</figcaption>
    <div className="a1-goethe-mock-paper-copy">
      {lines.map((line, index) => (
        <p key={`${title}-${index}`} className="a1-goethe-mock-paper-line">{line}</p>
      ))}
    </div>
  </figure>
);

const NoticeCard = ({ notice }) => (
  <div className={`a1-goethe-mock-notice-card a1-goethe-mock-notice-${notice.kind}`}>
    <div className="a1-goethe-mock-notice-inner">
      <h3>{notice.heading}</h3>
      {notice.lines.map((line, index) =>
        line ? <p key={`${notice.heading}-${index}`}>{line}</p> : <div key={index} className="a1-goethe-mock-notice-gap" />
      )}
    </div>
  </div>
);

const BrowserPanel = ({ option }) => (
  <article className="a1-goethe-mock-browser-panel">
    <div className="a1-goethe-mock-browser-greenbar"><strong>Internet</strong><span>◧</span></div>
    <div className="a1-goethe-mock-browser-toolbar">
      <span className="a1-goethe-mock-browser-icon">⌂</span>
      <span className="a1-goethe-mock-browser-url">{option.url}</span>
    </div>
    <div className="a1-goethe-mock-browser-page">
      <div className="a1-goethe-mock-browser-visual"><span>{option.id}</span></div>
      <div className="a1-goethe-mock-browser-copy">
        <h3>{option.title}</h3>
        <strong>{option.subtitle}</strong>
        {option.lines.map((line) => <p key={line}>{line}</p>)}
      </div>
    </div>
  </article>
);

const BinaryChoices = ({ name, value, onChange, disabled }) => (
  <div className="a1-goethe-mock-choices" role="radiogroup">
    {[
      ["richtig", "Richtig."],
      ["falsch", "Falsch."],
    ].map(([option, label]) => (
      <label key={option} className="a1-goethe-mock-choice">
        <input type="radio" name={name} checked={value === option} onChange={() => onChange(option)} disabled={disabled} />
        <span>{label}</span>
      </label>
    ))}
  </div>
);

const LetterChoices = ({ name, value, onChange, disabled }) => (
  <div className="a1-goethe-mock-teil2-answer-row" role="radiogroup">
    {["a", "b"].map((option) => (
      <label key={option} className="a1-goethe-mock-choice a1-goethe-mock-letter-choice">
        <input type="radio" name={name} checked={value === option} onChange={() => onChange(option)} disabled={disabled} />
        <span>{option}</span>
      </label>
    ))}
  </div>
);

export default function A1ReadingPracticeSamples() {
  const navigate = useNavigate();
  const { studentProfile, user } = useAuth();
  const studentKey = getReadingPracticeStudentKey({ studentProfile, user });
  const [sampleId, setSampleId] = useState(A1_READING_PRACTICE_SAMPLES[0].id);
  const [partKey, setPartKey] = useState("teil1");
  const [answersBySample, setAnswersBySample] = useState({});
  const [submittedBySample, setSubmittedBySample] = useState({});
  const [savedAttemptBySample, setSavedAttemptBySample] = useState({});
  const [remainingBySample, setRemainingBySample] = useState({});
  const [timerRunning, setTimerRunning] = useState(false);
  const restoredRef = useRef(false);

  const sample = useMemo(
    () => A1_READING_PRACTICE_SAMPLES.find((item) => item.id === sampleId) || A1_READING_PRACTICE_SAMPLES[0],
    [sampleId],
  );
  const answers = answersBySample[sample.id] || {};
  const submitted = Boolean(submittedBySample[sample.id]);
  const remainingSeconds = remainingBySample[sample.id] ?? SAMPLE_DURATION_SECONDS;

  const allQuestions = useMemo(
    () => [
      ...sample.parts.teil1.questions.map((question) => ({ ...question, part: "Teil 1" })),
      ...sample.parts.teil2.questions.map((question) => ({ ...question, part: "Teil 2" })),
      ...sample.parts.teil3.questions.map((question) => ({ ...question, part: "Teil 3" })),
    ],
    [sample],
  );
  const answeredCount = allQuestions.filter((question) => answers[question.number]).length;
  const allAnswered = answeredCount === 15;
  const score = allQuestions.filter((question) => answers[question.number] === question.answer).length;
  const percent = Math.round((score / 15) * 100);
  const sectionScores = ["teil1", "teil2", "teil3"].map((key, index) => {
    const questions = sample.parts[key].questions;
    return {
      label: `Teil ${index + 1}`,
      score: questions.filter((question) => answers[question.number] === question.answer).length,
      total: 5,
    };
  });
  const weakestSection = getWeakestReadingSection(sectionScores);
  const storageKey = `falowen:exams:lesen:a1:three-samples:${studentKey || "guest"}`;

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = JSON.parse(window.localStorage.getItem(storageKey) || "null");
      if (!saved || typeof saved !== "object") return;
      if (saved.answersBySample) setAnswersBySample(saved.answersBySample);
      if (saved.remainingBySample) setRemainingBySample(saved.remainingBySample);
      if (saved.sampleId && A1_READING_PRACTICE_SAMPLES.some((item) => item.id === saved.sampleId)) setSampleId(saved.sampleId);
      if (["teil1", "teil2", "teil3"].includes(saved.partKey)) setPartKey(saved.partKey);
    } catch {
      // Ignore malformed local practice data.
    } finally {
      restoredRef.current = true;
    }
  }, [storageKey]);

  useEffect(() => {
    if (!restoredRef.current || typeof window === "undefined") return;
    window.localStorage.setItem(storageKey, JSON.stringify({
      sampleId,
      partKey,
      answersBySample,
      remainingBySample,
      updatedAt: new Date().toISOString(),
    }));
  }, [answersBySample, partKey, remainingBySample, sampleId, storageKey]);

  useEffect(() => {
    if (!timerRunning || submitted) return;
    if (remainingSeconds <= 0) {
      setTimerRunning(false);
      return;
    }
    const id = window.setInterval(() => {
      setRemainingBySample((current) => ({
        ...current,
        [sample.id]: Math.max(0, (current[sample.id] ?? SAMPLE_DURATION_SECONDS) - 1),
      }));
    }, 1000);
    return () => window.clearInterval(id);
  }, [remainingSeconds, sample.id, submitted, timerRunning]);

  useEffect(() => {
    setTimerRunning(false);
    setPartKey("teil1");
  }, [sampleId]);

  const answer = (number, value) => {
    if (submitted) return;
    setAnswersBySample((current) => ({
      ...current,
      [sample.id]: {
        ...(current[sample.id] || {}),
        [number]: value,
      },
    }));
  };

  const submit = () => {
    if (!allAnswered || submitted) return;
    setTimerRunning(false);
    const attempt = saveReadingPracticeAttempt({
      level: "A1",
      setId: sample.id,
      score,
      total: 15,
      elapsedSeconds: SAMPLE_DURATION_SECONDS - remainingSeconds,
      sectionScores,
      studentKey,
    });
    setSavedAttemptBySample((current) => ({ ...current, [sample.id]: attempt }));
    setSubmittedBySample((current) => ({ ...current, [sample.id]: true }));
  };

  const resetSample = () => {
    setTimerRunning(false);
    setAnswersBySample((current) => ({ ...current, [sample.id]: {} }));
    setSubmittedBySample((current) => ({ ...current, [sample.id]: false }));
    setSavedAttemptBySample((current) => ({ ...current, [sample.id]: null }));
    setRemainingBySample((current) => ({ ...current, [sample.id]: SAMPLE_DURATION_SECONDS }));
    setPartKey("teil1");
  };

  const selectedPart = sample.parts[partKey];

  const renderFeedback = (question) => {
    if (!submitted) return null;
    const correct = answers[question.number] === question.answer;
    return (
      <p className={`a1-reading-practice-feedback ${correct ? "is-correct" : "is-wrong"}`}>
        {correct ? "Correct." : `Correct answer: ${question.answer === "richtig" ? "Richtig" : question.answer === "falsch" ? "Falsch" : question.answer}.`}
      </p>
    );
  };

  return (
    <main className="a1-goethe-mock-shell a1-reading-practice-shell" data-a1-reading-practice-samples>
      <div className="a1-goethe-mock-topbar a1-reading-practice-topbar">
        <div>
          <strong>A1 Lesen · Exams Room</strong>
          <span>Three complete Goethe-style practice samples · 15 questions each</span>
        </div>
        <button type="button" className="a1-reading-practice-back" onClick={() => navigate("/exams/overview")}>Back to Exams Room</button>
      </div>

      <div className="a1-reading-sample-selector" aria-label="A1 Lesen sample selector">
        {A1_READING_PRACTICE_SAMPLES.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={item.id === sample.id ? "is-active" : ""}
            onClick={() => setSampleId(item.id)}
          >
            Lesen Sample {index + 1}
            <small>15 questions · Teil 1–3</small>
          </button>
        ))}
      </div>

      <article className="a1-goethe-mock-exam">
        <header className="a1-goethe-mock-header a1-reading-practice-header">
          <div>
            <p className="a1-goethe-mock-kicker">A1 · Lesen · {sample.label}</p>
            <h1>{selectedPart.title}</h1>
            <p>{selectedPart.instruction}</p>
            <p><strong>{selectedPart.strong}</strong></p>
          </div>
          <div className="a1-reading-practice-timer">
            <span>25-minute sample</span>
            <strong>{formatTime(remainingSeconds)}</strong>
            <button type="button" onClick={() => setTimerRunning((value) => !value)} disabled={submitted}>
              {timerRunning ? "Pause" : remainingSeconds === SAMPLE_DURATION_SECONDS ? "Start timer" : "Resume"}
            </button>
          </div>
        </header>

        <nav className="a1-reading-part-selector" aria-label="A1 Lesen part selector">
          {["teil1", "teil2", "teil3"].map((key, index) => {
            const questions = sample.parts[key].questions;
            const answered = questions.filter((question) => answers[question.number]).length;
            return (
              <button key={key} type="button" className={partKey === key ? "is-active" : ""} onClick={() => setPartKey(key)}>
                Teil {index + 1}
                <small>{answered}/5 answered</small>
              </button>
            );
          })}
        </nav>

        {partKey === "teil1" ? (
          <div>
            {selectedPart.texts.map((textItem) => {
              const questions = selectedPart.questions.filter((question) => question.text === textItem.id);
              return (
                <section key={textItem.id} className="a1-reading-practice-text-group">
                  <ReadingPaper title={textItem.title} lines={textItem.body} />
                  {questions.map((question) => (
                    <section key={question.number} className="a1-goethe-mock-question">
                      <h2 className="a1-goethe-mock-question-title">Aufgabe {question.number}</h2>
                      <p className="a1-goethe-mock-statement">{question.statement}</p>
                      <BinaryChoices
                        name={`${sample.id}-q-${question.number}`}
                        value={answers[question.number] || ""}
                        onChange={(value) => answer(question.number, value)}
                        disabled={submitted}
                      />
                      {renderFeedback(question)}
                    </section>
                  ))}
                </section>
              );
            })}
          </div>
        ) : null}

        {partKey === "teil2" ? (
          <div>
            {selectedPart.questions.map((question) => (
              <section key={question.number} className="a1-goethe-mock-question">
                <h2 className="a1-goethe-mock-question-title">Aufgabe {question.number}</h2>
                <p className="a1-goethe-mock-statement">{question.statement}</p>
                <div className="a1-goethe-mock-website-grid">
                  {question.options.map((option) => <BrowserPanel key={option.id} option={option} />)}
                </div>
                <LetterChoices
                  name={`${sample.id}-q-${question.number}`}
                  value={answers[question.number] || ""}
                  onChange={(value) => answer(question.number, value)}
                  disabled={submitted}
                />
                {renderFeedback(question)}
              </section>
            ))}
          </div>
        ) : null}

        {partKey === "teil3" ? (
          <div>
            {selectedPart.questions.map((question) => (
              <section key={question.number} className="a1-goethe-mock-question a1-goethe-mock-teil3-question">
                <h2 className="a1-goethe-mock-question-title">Aufgabe {question.number}</h2>
                <p className="a1-goethe-mock-location">{question.location}</p>
                <NoticeCard notice={question.notice} />
                <p className="a1-goethe-mock-teil3-statement">{question.statement}</p>
                <BinaryChoices
                  name={`${sample.id}-q-${question.number}`}
                  value={answers[question.number] || ""}
                  onChange={(value) => answer(question.number, value)}
                  disabled={submitted}
                />
                {renderFeedback(question)}
              </section>
            ))}
          </div>
        ) : null}

        <footer className="a1-reading-practice-footer">
          <div>
            <strong>{answeredCount}/15 answered</strong>
            <span>Complete all three Teile before checking your answers.</span>
          </div>
          {!submitted ? (
            <button type="button" disabled={!allAnswered} onClick={submit}>Check answers</button>
          ) : (
            <div className="a1-reading-practice-result">
              <strong>Result: {score}/15 · {percent}% · {getReadingReadinessLabel(percent)}</strong>
              <span>
                {weakestSection ? `Practise next: ${weakestSection.label}.` : ""}
                {savedAttemptBySample[sample.id] ? ` Saved as attempt ${savedAttemptBySample[sample.id].attemptNumber}.` : ""}
              </span>
              <div>
                {sectionScores.map((section) => <span key={section.label}>{section.label}: {section.score}/5</span>)}
              </div>
              <button type="button" onClick={resetSample}>Try this sample again</button>
            </div>
          )}
        </footer>
      </article>
    </main>
  );
}
