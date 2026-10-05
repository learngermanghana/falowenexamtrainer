import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getReadingPracticeStudentKey,
  getReadingReadinessLabel,
  getWeakestReadingSection,
  saveReadingPracticeAttempt,
} from "../services/readingPracticeHistory";
import { A2_READING_PRACTICE_SET_01 } from "./A2ReadingPracticeSet";
import "./A2GoetheReadingMockPreview.css";
import "./A2ReadingPracticeSamples.css";

const SAMPLE_DURATION_SECONDS = 30 * 60;

const choice = (id, label) => ({ id, label });
const ad = (id, url, title, body) => ({ id, url, title, body });

const A2_READING_PRACTICE_SET_02 = Object.freeze({
  teil1: {
    title: "Teil 1",
    instruction: [
      "Sie lesen in einer Zeitung diesen Text.",
      "Markieren Sie für die Aufgaben 1 bis 5 die richtige Lösung a, b oder c.",
    ],
    article: {
      title: "Ein kleines Café mit großer Idee",
      subtitle: "Jonas Weber verbindet Kaffee, Bücher und Nachbarschaft.",
      paragraphs: [
        "Vor zwei Jahren hat Jonas Weber in Mainz ein kleines Café eröffnet. Vorher arbeitete er in einer großen Buchhandlung. Dort merkte er, dass viele Kunden gern länger blieben, wenn sie in Ruhe lesen oder mit anderen über Bücher sprechen konnten. Deshalb entstand die Idee für ein Café mit einer kleinen offenen Bibliothek.",
        "Im Café können Gäste Bücher lesen und kostenlos ausleihen. Wer ein Buch mit nach Hause nimmt, bringt es innerhalb von drei Wochen zurück oder stellt ein anderes Buch ins Regal. Besonders beliebt sind Romane, Reiseführer und Kinderbücher.",
        "Einmal im Monat organisiert Jonas einen Abend, an dem Besucher ihr Lieblingsbuch vorstellen. Diese Treffen kosten nichts. Man muss sich aber vorher anmelden, weil im Café nur etwa dreißig Personen Platz haben.",
        "Jonas arbeitet meistens am Vormittag selbst im Café. Nachmittags helfen zwei Mitarbeiterinnen. Am Wochenende ist besonders viel los, deshalb kommt dann zusätzlich ein Student dazu.",
        "Im nächsten Frühjahr möchte Jonas auch kleine Deutsch-Lesekurse für Menschen anbieten, die noch nicht lange in Deutschland leben. Eine Sprachlehrerin aus der Nachbarschaft hat ihm dabei ihre Hilfe angeboten.",
      ],
    },
    example: {
      number: 0,
      question: "Jonas hatte die Idee für sein Café ...",
      options: [
        choice("a", "während seiner Arbeit in einer Buchhandlung."),
        choice("b", "auf einer Reise durch Deutschland."),
        choice("c", "durch einen Kochkurs."),
      ],
      answer: "a",
    },
    questions: [
      { number: 1, question: "Im Café können Gäste Bücher ...", options: [choice("a","nur kaufen."),choice("b","lesen und ausleihen."),choice("c","nur am Wochenende lesen.")], answer: "b" },
      { number: 2, question: "Wer ein Buch ausleiht, ...", options: [choice("a","muss dafür bezahlen."),choice("b","darf es nur einen Tag behalten."),choice("c","bringt es zurück oder ersetzt es durch ein anderes.")], answer: "c" },
      { number: 3, question: "Für den Bücherabend ...", options: [choice("a","muss man sich anmelden."),choice("b","zahlt jeder zehn Euro."),choice("c","gibt es Platz für mehr als hundert Personen.")], answer: "a" },
      { number: 4, question: "Am Wochenende ...", options: [choice("a","ist das Café geschlossen."),choice("b","arbeitet zusätzlich ein Student mit."),choice("c","arbeitet Jonas immer allein.")], answer: "b" },
      { number: 5, question: "Im nächsten Frühjahr plant Jonas ...", options: [choice("a","eine zweite Buchhandlung."),choice("b","Deutsch-Lesekurse."),choice("c","nur noch Kinderbücher anzubieten.")], answer: "b" },
    ],
  },
  teil2: {
    title: "Teil 2",
    instruction: [
      "Sie sind in einem Gesundheitszentrum.",
      "Lesen Sie die Informationen und markieren Sie für die Aufgaben 6 bis 10 die richtige Lösung a, b oder c.",
    ],
    store: {
      title: "Gesundheitszentrum am Markt",
      floors: [
        ["4. Stock", "Zahnarzt, Kieferorthopädie, Prophylaxe, Wartebereich"],
        ["3. Stock", "Hausarzt, Allgemeinmedizin, Impfberatung, Blutabnahme"],
        ["2. Stock", "Physiotherapie, Massage, Rückenschule, Reha-Sport"],
        ["1. Stock", "Kinderarzt, Hebamme, Familienberatung, Stillberatung"],
        ["EG", "Information, Anmeldung, Apotheke, Café, barrierefreies WC"],
        ["UG", "Labor, Röntgen, Ultraschall, Umkleiden, Technik"],
      ],
    },
    example: {
      number: 0,
      question: "Sie möchten einen Termin beim Hausarzt.",
      options: [choice("a","3. Stock"),choice("b","EG"),choice("c","anderer Stock")],
      answer: "a",
    },
    questions: [
      { number: 6, question: "Sie brauchen ein Medikament und möchten es direkt kaufen.", options: [choice("a","EG"),choice("b","2. Stock"),choice("c","anderer Stock")], answer: "a" },
      { number: 7, question: "Ihr Kind hat hohes Fieber.", options: [choice("a","1. Stock"),choice("b","4. Stock"),choice("c","anderer Stock")], answer: "a" },
      { number: 8, question: "Sie haben Rückenschmerzen und brauchen Übungen.", options: [choice("a","2. Stock"),choice("b","3. Stock"),choice("c","anderer Stock")], answer: "a" },
      { number: 9, question: "Sie möchten Ihre Zähne kontrollieren lassen.", options: [choice("a","UG"),choice("b","4. Stock"),choice("c","anderer Stock")], answer: "b" },
      { number: 10, question: "Der Arzt möchte ein Röntgenbild von Ihrem Arm.", options: [choice("a","UG"),choice("b","1. Stock"),choice("c","anderer Stock")], answer: "a" },
    ],
  },
  teil3: {
    title: "Teil 3",
    instruction: [
      "Sie lesen eine E-Mail.",
      "Markieren Sie für die Aufgaben 11 bis 15 die richtige Lösung a, b oder c.",
    ],
    email: {
      to: "Mila",
      subject: "Mein Praktikum in Hamburg",
      greeting: "Liebe Mila,",
      paragraphs: [
        "seit drei Wochen mache ich mein Praktikum in einem kleinen Hotel in Hamburg. In der ersten Woche war ich an der Rezeption und musste viele neue Programme lernen. Inzwischen klappt das gut und ich darf auch Gäste selbst einchecken.",
        "Ich wohne bei meiner Tante etwas außerhalb der Stadt. Morgens fahre ich mit der S-Bahn ungefähr 25 Minuten bis zum Hotel. Wenn ich Spätschicht habe, bringt mich manchmal ein Kollege mit dem Auto nach Hause.",
        "An zwei Tagen pro Woche helfe ich jetzt im Frühstücksraum. Das gefällt mir, weil ich dort mehr mit den Gästen sprechen kann. Dafür muss ich allerdings schon um sechs Uhr anfangen.",
        "Letzten Samstag war ich mit zwei Kolleginnen im Hafen. Wir wollten eigentlich eine Bootsfahrt machen, aber wegen des starken Windes fuhr kein Schiff. Stattdessen waren wir in einem Museum und später in einem kleinen Fischrestaurant.",
        "Im November habe ich drei Tage frei. Wenn du möchtest, kannst du mich dann besuchen. Meine Tante hat ein Gästezimmer und freut sich schon, dich kennenzulernen.",
      ],
      closing: ["Melde dich bald!", "Liebe Grüße", "Nora"],
    },
    questions: [
      { number: 11, question: "In der ersten Praktikumswoche ...", options: [choice("a","arbeitete Nora schon allein."),choice("b","musste Nora neue Programme lernen."),choice("c","arbeitete Nora nur im Frühstücksraum.")], answer: "b" },
      { number: 12, question: "Nora fährt normalerweise ...", options: [choice("a","mit der S-Bahn zur Arbeit."),choice("b","mit dem Fahrrad."),choice("c","mit ihrer Tante im Auto.")], answer: "a" },
      { number: 13, question: "Im Frühstücksraum gefällt Nora besonders, dass ...", options: [choice("a","sie später anfangen kann."),choice("b","sie dort mehr mit Gästen spricht."),choice("c","sie dort keine Kollegen trifft.")], answer: "b" },
      { number: 14, question: "Am letzten Samstag ...", options: [choice("a","machten Nora und ihre Kolleginnen eine Bootsfahrt."),choice("b","blieben sie den ganzen Tag zu Hause."),choice("c","änderten sie wegen des Wetters ihren Plan.")], answer: "c" },
      { number: 15, question: "Wenn Mila im November kommt, ...", options: [choice("a","kann sie bei Noras Tante schlafen."),choice("b","muss sie ein Hotel buchen."),choice("c","arbeitet Nora jeden Tag.")], answer: "a" },
    ],
  },
  teil4: {
    title: "Teil 4",
    instruction: [
      "Fünf Personen suchen passende Angebote.",
      "Lesen Sie die Aufgaben 16 bis 20 und die Anzeigen a bis f. Welche Anzeige passt zu welcher Person?",
      "Für eine Aufgabe gibt es keine passende Anzeige. Schreiben Sie dort den Buchstaben X.",
    ],
    example: { number: 0, person: "Tim sucht einen Fotokurs am Wochenende.", answer: "e" },
    people: [
      { number: 16, person: "Rita möchte dienstags nach der Arbeit Yoga machen.", answer: "b" },
      { number: 17, person: "Omar sucht am Samstag einen Computerkurs für Anfänger.", answer: "f" },
      { number: 18, person: "Lea möchte mit ihrem sechsjährigen Sohn am Sonntag etwas Kreatives machen.", answer: "a" },
      { number: 19, person: "Ben möchte am Mittwochabend günstig tanzen lernen.", answer: "c" },
      { number: 20, person: "Sara sucht freitags einen Kochkurs für vegane Gerichte.", answer: "X" },
    ],
    ads: [
      ad("a","www.kreativ-familie.de","Kreativ am Sonntag",["Basteln und Malen für Eltern mit Kindern von 5 bis 9 Jahren.","Sonntag 14.00–16.00 Uhr.","Material inklusive."]),
      ad("b","www.yoga-feierabend.de","Yoga nach der Arbeit",["Dienstag und Donnerstag 18.30 Uhr.","Für Anfänger geeignet.","Erste Stunde kostenlos."]),
      ad("c","www.tanz-mittwoch.de","Tanzen für Einsteiger",["Mittwoch 19.00–20.30 Uhr.","Monatsbeitrag 24 Euro.","Keine Vorkenntnisse nötig."]),
      ad("d","www.kochen-donnerstag.de","Vegane Küche",["Donnerstag 18.00–21.00 Uhr.","Vier Termine im Monat.","Lebensmittel inklusive."]),
      ad("e","www.fotowoche.de","Fotografie kompakt",["Samstag und Sonntag 10.00–14.00 Uhr.","Kamera oder Smartphone mitbringen."]),
      ad("f","www.pc-start.de","Computer-Grundkurs",["Samstag 9.30–13.00 Uhr.","E-Mail, Internet und Textverarbeitung.","Für Anfänger."]),
    ],
  },
});

const A2_READING_PRACTICE_SET_03 = Object.freeze({
  teil1: {
    title: "Teil 1",
    instruction: [
      "Sie lesen in einer Zeitung diesen Text.",
      "Markieren Sie für die Aufgaben 1 bis 5 die richtige Lösung a, b oder c.",
    ],
    article: {
      title: "Arbeiten im Gemeinschaftsgarten",
      subtitle: "Miriam Koch teilt Gemüse, Wissen und Zeit mit ihren Nachbarn.",
      paragraphs: [
        "Miriam Koch wohnt seit fünf Jahren in einem großen Wohnviertel in Dortmund. Hinter mehreren Häusern gab es lange eine ungenutzte Fläche. Vor zwei Jahren gründete Miriam dort zusammen mit Nachbarn einen Gemeinschaftsgarten.",
        "Heute wachsen dort Tomaten, Kräuter, Salat und Beeren. Jeder, der regelmäßig mithilft, darf etwas ernten. Geld müssen die Mitglieder nur für größere Anschaffungen sammeln, zum Beispiel für Werkzeug oder neue Holzkisten.",
        "Samstags treffen sich die meisten Mitglieder am Vormittag. Dann wird gemeinsam gearbeitet und danach oft zusammen gegessen. Wer keine Erfahrung mit Gartenarbeit hat, bekommt Hilfe von älteren Mitgliedern.",
        "Miriam findet besonders wichtig, dass auch Kinder mitmachen. Deshalb gibt es ein kleines Beet nur für Familien. Dort können Kinder selbst pflanzen und beobachten, wie Gemüse wächst.",
        "Für den nächsten Sommer plant die Gruppe einen offenen Gartentag. Besucher sollen den Garten kennenlernen, kleine Pflanzen mitnehmen und an kurzen Workshops teilnehmen können.",
      ],
    },
    example: {
      number: 0,
      question: "Der Gemeinschaftsgarten entstand ...",
      options: [choice("a","auf einer vorher ungenutzten Fläche."),choice("b","in Miriams Wohnung."),choice("c","auf dem Gelände einer Schule.")],
      answer: "a",
    },
    questions: [
      { number: 1, question: "Wer regelmäßig mithilft, ...", options: [choice("a","darf Gemüse ernten."),choice("b","bekommt jeden Monat Geld."),choice("c","muss eigenes Werkzeug mitbringen.")], answer: "a" },
      { number: 2, question: "Geld sammeln die Mitglieder ...", options: [choice("a","für jede Ernte."),choice("b","für größere Anschaffungen."),choice("c","für ein Restaurant.")], answer: "b" },
      { number: 3, question: "Am Samstag ...", options: [choice("a","arbeitet jeder allein."),choice("b","treffen sich viele Mitglieder gemeinsam."),choice("c","ist der Garten geschlossen.")], answer: "b" },
      { number: 4, question: "Für Kinder gibt es ...", options: [choice("a","ein eigenes kleines Beet."),choice("b","nur einen Spielplatz."),choice("c","keine besonderen Angebote.")], answer: "a" },
      { number: 5, question: "Im nächsten Sommer soll ...", options: [choice("a","der Garten verkauft werden."),choice("b","ein offener Gartentag stattfinden."),choice("c","nur noch Gemüse für Restaurants angebaut werden.")], answer: "b" },
    ],
  },
  teil2: {
    title: "Teil 2",
    instruction: [
      "Sie sind in einem Kulturhaus.",
      "Lesen Sie die Informationen und markieren Sie für die Aufgaben 6 bis 10 die richtige Lösung a, b oder c.",
    ],
    store: {
      title: "Kulturhaus West",
      floors: [
        ["4. Stock", "Ateliers, Malen, Zeichnen, Fotolabor, Ausstellungsraum"],
        ["3. Stock", "Sprachkurse, Lernraum, Bibliothek, Computerplätze"],
        ["2. Stock", "Theatersaal, Proberaum, Kostümverleih, Tanzstudio"],
        ["1. Stock", "Musikschule, Klavier, Gitarre, Schlagzeug, Chor"],
        ["EG", "Information, Anmeldung, Café, Tickets, Garderobe, WC"],
        ["UG", "Werkstatt, Keramik, Holzarbeiten, Lager, Fahrradstellplätze"],
      ],
    },
    example: {
      number: 0,
      question: "Sie möchten Karten für ein Theaterstück kaufen.",
      options: [choice("a","EG"),choice("b","2. Stock"),choice("c","anderer Stock")],
      answer: "a",
    },
    questions: [
      { number: 6, question: "Sie möchten einen Deutschkurs besuchen.", options: [choice("a","3. Stock"),choice("b","1. Stock"),choice("c","anderer Stock")], answer: "a" },
      { number: 7, question: "Sie wollen lernen, wie man Gitarre spielt.", options: [choice("a","4. Stock"),choice("b","1. Stock"),choice("c","anderer Stock")], answer: "b" },
      { number: 8, question: "Sie möchten ein Bild malen.", options: [choice("a","4. Stock"),choice("b","UG"),choice("c","anderer Stock")], answer: "a" },
      { number: 9, question: "Sie brauchen ein Kostüm für eine Aufführung.", options: [choice("a","2. Stock"),choice("b","EG"),choice("c","anderer Stock")], answer: "a" },
      { number: 10, question: "Sie möchten mit Ton arbeiten.", options: [choice("a","UG"),choice("b","3. Stock"),choice("c","anderer Stock")], answer: "a" },
    ],
  },
  teil3: {
    title: "Teil 3",
    instruction: [
      "Sie lesen eine E-Mail.",
      "Markieren Sie für die Aufgaben 11 bis 15 die richtige Lösung a, b oder c.",
    ],
    email: {
      to: "Felix",
      subject: "Mein Umzug nach Leipzig",
      greeting: "Hallo Felix,",
      paragraphs: [
        "nun wohne ich seit zwei Monaten in Leipzig. Die Wohnung ist kleiner als meine alte, aber sie liegt viel näher an meiner Arbeit. Deshalb brauche ich morgens nur noch zehn Minuten mit dem Fahrrad.",
        "In der ersten Woche kannte ich hier fast niemanden. Eine Kollegin hat mich dann zu einem Spieleabend eingeladen. Dort habe ich einige Leute kennengelernt, mit denen ich mich inzwischen regelmäßig treffe.",
        "Am Wochenende besuche ich oft einen Markt in meiner Straße. Dort kaufe ich Gemüse, Brot und Käse. Die Preise sind etwas höher als im Supermarkt, aber die Produkte kommen meistens aus der Region.",
        "Seit Kurzem besuche ich außerdem einen Fotokurs. Eigentlich wollte ich einen Kurs am Mittwoch wählen, aber da arbeite ich oft länger. Deshalb gehe ich jetzt montags. Wir fotografieren viel draußen und besprechen danach gemeinsam die Bilder.",
        "Im Dezember möchte ich meine Eltern besuchen. Vorher würde ich mich freuen, wenn du einmal nach Leipzig kommst. Du kannst bei mir schlafen, auch wenn das Sofa nicht besonders groß ist.",
      ],
      closing: ["Wie geht es dir?", "Viele Grüße", "Anna"],
    },
    questions: [
      { number: 11, question: "Annas neue Wohnung ...", options: [choice("a","ist größer als die alte."),choice("b","liegt näher an ihrer Arbeit."),choice("c","ist weit außerhalb der Stadt.")], answer: "b" },
      { number: 12, question: "Neue Leute lernte Anna ...", options: [choice("a","bei einem Spieleabend kennen."),choice("b","nur im Fotokurs kennen."),choice("c","im Supermarkt kennen.")], answer: "a" },
      { number: 13, question: "Auf dem Markt ...", options: [choice("a","sind alle Produkte billiger."),choice("b","kauft Anna hauptsächlich Kleidung."),choice("c","findet Anna oft regionale Lebensmittel.")], answer: "c" },
      { number: 14, question: "Anna besucht den Fotokurs montags, weil ...", options: [choice("a","der Kurs am Mittwoch ausgebucht ist."),choice("b","sie mittwochs oft länger arbeitet."),choice("c","sie montags frei hat.")], answer: "b" },
      { number: 15, question: "Wenn Felix kommt, ...", options: [choice("a","kann er bei Anna übernachten."),choice("b","muss er bei ihren Eltern schlafen."),choice("c","ist Anna sicher nicht in Leipzig.")], answer: "a" },
    ],
  },
  teil4: {
    title: "Teil 4",
    instruction: [
      "Fünf Personen suchen passende Angebote.",
      "Lesen Sie die Aufgaben 16 bis 20 und die Anzeigen a bis f. Welche Anzeige passt zu welcher Person?",
      "Für eine Aufgabe gibt es keine passende Anzeige. Schreiben Sie dort den Buchstaben X.",
    ],
    example: { number: 0, person: "Jonas sucht einen Kurs für Smartphone-Fotografie.", answer: "c" },
    people: [
      { number: 16, person: "Mehmet möchte samstags einen Deutsch-Konversationskurs besuchen.", answer: "f" },
      { number: 17, person: "Clara sucht einen günstigen Fahrrad-Reparaturkurs.", answer: "a" },
      { number: 18, person: "Nina möchte sonntags mit anderen Menschen joggen.", answer: "d" },
      { number: 19, person: "Tom sucht einen Kochkurs für asiatische Gerichte am Dienstagabend.", answer: "b" },
      { number: 20, person: "Eva möchte freitagabends einen Töpferkurs besuchen.", answer: "X" },
    ],
    ads: [
      ad("a","www.rad-selbst.de","Fahrrad selbst reparieren",["Samstag 10.00–13.00 Uhr.","Werkzeug wird gestellt.","Kursgebühr 18 Euro."]),
      ad("b","www.asia-kochen.de","Asiatisch kochen",["Dienstag 18.30–21.00 Uhr.","Vier Termine.","Zutaten inklusive."]),
      ad("c","www.handyfoto.de","Fotografieren mit dem Smartphone",["Mittwoch 18.00–20.00 Uhr.","Tipps zu Licht, Bildaufbau und Bearbeitung."]),
      ad("d","www.sonntagslauf.de","Gemeinsam laufen",["Jeden Sonntag 9.30 Uhr im Stadtpark.","Für Anfänger und Fortgeschrittene.","Kostenlos."]),
      ad("e","www.keramik-samstag.de","Keramikwerkstatt",["Samstag 14.00–17.00 Uhr.","Töpfern und Glasieren.","Material 12 Euro."]),
      ad("f","www.deutsch-samstag.de","Deutsch sprechen A2",["Samstag 11.00–12.30 Uhr.","Kleine Gruppe.","Fokus auf Konversation."]),
    ],
  },
});

export const A2_READING_PRACTICE_SAMPLES = Object.freeze([
  { id: "a2-reading-practice-01", label: "Lesen Sample 1", ...A2_READING_PRACTICE_SET_01 },
  { id: "a2-reading-practice-02", label: "Lesen Sample 2", ...A2_READING_PRACTICE_SET_02 },
  { id: "a2-reading-practice-03", label: "Lesen Sample 3", ...A2_READING_PRACTICE_SET_03 },
]);

const ChoiceList = ({ name, options, value, onChange, reveal = false, answer = "" }) => (
  <div className="a2-mock-choice-list">
    {options.map((option) => {
      const correct = reveal && option.id === answer;
      const incorrect = reveal && value === option.id && option.id !== answer;
      return (
        <label
          className="a2-mock-choice"
          key={option.id}
          style={
            correct
              ? { borderColor: "#16a34a", background: "#ecfdf3" }
              : incorrect
                ? { borderColor: "#dc2626", background: "#fef2f2" }
                : undefined
          }
        >
          <input
            type="radio"
            name={name}
            checked={value === option.id}
            onChange={() => onChange(option.id)}
            disabled={reveal}
          />
          <strong>{option.id}</strong>
          <span>{option.label}</span>
        </label>
      );
    })}
  </div>
);

const TeilHeading = ({ data }) => (
  <header className="a2-mock-part-heading">
    <h2>{data.title}</h2>
    {data.instruction.map((line) => <p key={line}>{line}</p>)}
  </header>
);

const allItems = (sample) => [
  ...sample.teil1.questions,
  ...sample.teil2.questions,
  ...sample.teil3.questions,
  ...sample.teil4.people,
];

const formatTime = (seconds) =>
  `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

export default function A2ReadingPracticeSamples() {
  const navigate = useNavigate();
  const { studentProfile, user } = useAuth();
  const studentKey = getReadingPracticeStudentKey({ studentProfile, user });
  const [sampleId, setSampleId] = useState(A2_READING_PRACTICE_SAMPLES[0].id);
  const [partKey, setPartKey] = useState("teil1");
  const [answersBySample, setAnswersBySample] = useState({});
  const [submittedBySample, setSubmittedBySample] = useState({});
  const [savedAttemptBySample, setSavedAttemptBySample] = useState({});
  const [remainingBySample, setRemainingBySample] = useState({});
  const [timerRunning, setTimerRunning] = useState(false);
  const [hydratedStorageKey, setHydratedStorageKey] = useState("");

  const sample = useMemo(
    () => A2_READING_PRACTICE_SAMPLES.find((item) => item.id === sampleId) || A2_READING_PRACTICE_SAMPLES[0],
    [sampleId],
  );
  const answers = answersBySample[sample.id] || {};
  const submitted = Boolean(submittedBySample[sample.id]);
  const remainingSeconds = remainingBySample[sample.id] ?? SAMPLE_DURATION_SECONDS;
  const items = useMemo(() => allItems(sample), [sample]);
  const answered = items.filter((item) => answers[item.number]).length;
  const score = items.filter((item) => String(answers[item.number] || "") === String(item.answer)).length;
  const percent = Math.round((score / 20) * 100);
  const sectionScores = [
    { label: "Teil 1", items: sample.teil1.questions },
    { label: "Teil 2", items: sample.teil2.questions },
    { label: "Teil 3", items: sample.teil3.questions },
    { label: "Teil 4", items: sample.teil4.people },
  ].map(({ label, items: sectionItems }) => ({
    label,
    score: sectionItems.filter((item) => String(answers[item.number] || "") === String(item.answer)).length,
    total: 5,
  }));
  const weakestSection = getWeakestReadingSection(sectionScores);
  const storageKey = `falowen:exams:lesen:a2:three-samples:${studentKey || "guest"}`;

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = JSON.parse(window.localStorage.getItem(storageKey) || "null");
      if (!saved || typeof saved !== "object") return;
      if (saved.answersBySample) setAnswersBySample(saved.answersBySample);
      if (saved.submittedBySample) setSubmittedBySample(saved.submittedBySample);
      if (saved.remainingBySample) setRemainingBySample(saved.remainingBySample);
      if (saved.sampleId && A2_READING_PRACTICE_SAMPLES.some((item) => item.id === saved.sampleId)) setSampleId(saved.sampleId);
      if (["teil1", "teil2", "teil3", "teil4"].includes(saved.partKey)) setPartKey(saved.partKey);
    } catch {
      // Ignore malformed saved practice state.
    } finally {
      setHydratedStorageKey(storageKey);
    }
  }, [storageKey]);

  useEffect(() => {
    if (hydratedStorageKey !== storageKey || typeof window === "undefined") return;
    window.localStorage.setItem(storageKey, JSON.stringify({
      sampleId,
      partKey,
      answersBySample,
      submittedBySample,
      remainingBySample,
      updatedAt: new Date().toISOString(),
    }));
  }, [
    answersBySample,
    partKey,
    remainingBySample,
    sampleId,
    hydratedStorageKey,
    submittedBySample,
    storageKey,
  ]);

  useEffect(() => {
    if (!timerRunning || submitted) return undefined;
    if (remainingSeconds <= 0) {
      setTimerRunning(false);
      return undefined;
    }
    const timer = window.setInterval(() => {
      setRemainingBySample((current) => ({
        ...current,
        [sample.id]: Math.max(0, (current[sample.id] ?? SAMPLE_DURATION_SECONDS) - 1),
      }));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [remainingSeconds, sample.id, submitted, timerRunning]);

  const selectSample = (nextSampleId) => {
    if (nextSampleId === sample.id) return;
    setTimerRunning(false);
    setSampleId(nextSampleId);
    setPartKey("teil1");
  };

  const setAnswer = (number, value) => {
    if (submitted) return;
    setAnswersBySample((current) => ({
      ...current,
      [sample.id]: {
        ...(current[sample.id] || {}),
        [number]: value,
      },
    }));
  };

  const submitAttempt = () => {
    if (answered !== 20 || submitted) return;
    setTimerRunning(false);
    const attempt = saveReadingPracticeAttempt({
      level: "A2",
      setId: sample.id,
      score,
      total: 20,
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

  const renderQuestions = (questions, part) =>
    questions.map((question) => (
      <section className="a2-mock-question" key={question.number}>
        <h3>Aufgabe {question.number}</h3>
        <p>{question.question}</p>
        <ChoiceList
          name={`${sample.id}-${part}-${question.number}`}
          options={question.options}
          value={answers[question.number] || ""}
          onChange={(value) => setAnswer(question.number, value)}
          reveal={submitted}
          answer={question.answer}
        />
        {submitted ? (
          <small className={answers[question.number] === question.answer ? "a2-reading-correct" : "a2-reading-wrong"}>
            {answers[question.number] === question.answer ? "Correct" : `Correct answer: ${question.answer}`}
          </small>
        ) : null}
      </section>
    ));

  return (
    <main className="a2-mock-shell a2-reading-practice-shell" data-a2-reading-practice-samples>
      <div className="a2-mock-topbar a2-reading-practice-topbar">
        <div>
          <strong>A2 Lesen · Exams Room</strong>
          <span>Three complete practice samples · 20 questions each</span>
        </div>
        <button type="button" onClick={() => navigate("/exams/overview")}>Back to Exams Room</button>
      </div>

      <div className="a2-reading-sample-selector" aria-label="A2 Lesen sample selector">
        {A2_READING_PRACTICE_SAMPLES.map((item, index) => (
          <button key={item.id} type="button" className={item.id === sample.id ? "is-active" : ""} onClick={() => selectSample(item.id)}>
            Lesen Sample {index + 1}
            <small>20 questions · Teil 1–4</small>
          </button>
        ))}
      </div>

      <article className="a2-mock-exam">
        <header className="a2-mock-title a2-reading-practice-title">
          <div>
            <p>A2 · Lesen · {sample.label}</p>
            <h1>{sample[partKey].title}</h1>
            <span>{answered}/20 answered</span>
          </div>
          <div className="a2-reading-practice-timer">
            <span>30-minute sample</span>
            <strong>{formatTime(remainingSeconds)}</strong>
            <button type="button" disabled={submitted} onClick={() => setTimerRunning((current) => !current)}>
              {timerRunning ? "Pause" : remainingSeconds === SAMPLE_DURATION_SECONDS ? "Start timer" : "Resume"}
            </button>
          </div>
        </header>

        <nav className="a2-reading-part-selector" aria-label="A2 Lesen part selector">
          {["teil1", "teil2", "teil3", "teil4"].map((key, index) => {
            const partItems = key === "teil4" ? sample[key].people : sample[key].questions;
            const partAnswered = partItems.filter((item) => answers[item.number]).length;
            return (
              <button key={key} type="button" className={partKey === key ? "is-active" : ""} onClick={() => setPartKey(key)}>
                Teil {index + 1}
                <small>{partAnswered}/5 answered</small>
              </button>
            );
          })}
        </nav>

        <section className="a2-mock-part">
          <TeilHeading data={sample[partKey]} />

          {partKey === "teil1" ? (
            <>
              <article className="a2-mock-newspaper">
                <h3>{sample.teil1.article.title}</h3>
                <h4>{sample.teil1.article.subtitle}</h4>
                {sample.teil1.article.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </article>
              <section className="a2-mock-question a2-mock-example">
                <h3>Beispiel 0</h3>
                <p>{sample.teil1.example.question}</p>
                <ChoiceList name={`${sample.id}-example-1`} options={sample.teil1.example.options} value={sample.teil1.example.answer} onChange={() => {}} reveal answer={sample.teil1.example.answer} />
              </section>
              {renderQuestions(sample.teil1.questions, "t1")}
            </>
          ) : null}

          {partKey === "teil2" ? (
            <>
              <article className="a2-mock-directory">
                <h3>{sample.teil2.store.title}</h3>
                {sample.teil2.store.floors.map(([floor, contents]) => (
                  <div className="a2-mock-floor" key={floor}>
                    <strong>{floor}</strong>
                    <p>{contents}</p>
                  </div>
                ))}
              </article>
              <section className="a2-mock-question a2-mock-example">
                <h3>Beispiel 0</h3>
                <p>{sample.teil2.example.question}</p>
                <ChoiceList name={`${sample.id}-example-2`} options={sample.teil2.example.options} value={sample.teil2.example.answer} onChange={() => {}} reveal answer={sample.teil2.example.answer} />
              </section>
              {renderQuestions(sample.teil2.questions, "t2")}
            </>
          ) : null}

          {partKey === "teil3" ? (
            <>
              <article className="a2-mock-email">
                <div className="a2-mock-email-toolbar">
                  <button type="button" tabIndex="-1">Senden</button><span>Antworten</span><span>Weiterleiten</span>
                </div>
                <div className="a2-mock-email-field"><strong>An:</strong><span>{sample.teil3.email.to}</span></div>
                <div className="a2-mock-email-field"><strong>Cc:</strong><span></span></div>
                <div className="a2-mock-email-field"><strong>Betreff:</strong><span>{sample.teil3.email.subject}</span></div>
                <div className="a2-mock-email-body">
                  <p>{sample.teil3.email.greeting}</p>
                  {sample.teil3.email.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {sample.teil3.email.closing.map((line) => <p className="a2-mock-email-closing" key={line}>{line}</p>)}
                </div>
              </article>
              {renderQuestions(sample.teil3.questions, "t3")}
            </>
          ) : null}

          {partKey === "teil4" ? (
            <>
              <div className="a2-mock-people-sheet">
                <div className="a2-mock-person-row a2-mock-example">
                  <div><strong>Beispiel 0</strong><p>{sample.teil4.example.person}</p></div>
                  <label>Anzeige:<select value={sample.teil4.example.answer} disabled><option>{sample.teil4.example.answer}</option></select></label>
                </div>
                {sample.teil4.people.map((item) => (
                  <div className="a2-mock-person-row" key={item.number}>
                    <div>
                      <strong>Aufgabe {item.number}</strong>
                      <p>{item.person}</p>
                      {submitted ? <small className={answers[item.number] === item.answer ? "a2-reading-correct" : "a2-reading-wrong"}>{answers[item.number] === item.answer ? "Correct" : `Correct answer: ${item.answer}`}</small> : null}
                    </div>
                    <label>
                      Anzeige:
                      <select value={answers[item.number] || ""} onChange={(event) => setAnswer(item.number, event.target.value)} disabled={submitted}>
                        <option value="">—</option>
                        {["a", "b", "c", "d", "e", "f", "X"].map((option) => <option value={option} key={option}>{option}</option>)}
                      </select>
                    </label>
                  </div>
                ))}
              </div>
              <h3 className="a2-mock-ads-title">Internet-Anzeigen</h3>
              <div className="a2-mock-ads-grid">
                {sample.teil4.ads.map((item) => (
                  <article className="a2-mock-ad" key={item.id}>
                    <div className="a2-mock-ad-browser"><strong>{item.id}</strong><span>{item.url}</span></div>
                    <div className="a2-mock-ad-body"><h4>{item.title}</h4>{item.body.map((line) => <p key={line}>{line}</p>)}</div>
                  </article>
                ))}
              </div>
            </>
          ) : null}
        </section>

        <footer className="a2-reading-practice-footer">
          {!submitted ? (
            <>
              <div><strong>{answered}/20 answered</strong><span>Complete all four Teile before checking your answers.</span></div>
              <button type="button" disabled={answered !== 20} onClick={submitAttempt}>Check answers</button>
            </>
          ) : (
            <div className="a2-reading-practice-result">
              <strong>Result: {score}/20 · {percent}% · {getReadingReadinessLabel(percent)}</strong>
              <span>{weakestSection ? `Practise next: ${weakestSection.label}.` : ""} {savedAttemptBySample[sample.id] ? `Saved as attempt ${savedAttemptBySample[sample.id].attemptNumber}.` : ""}</span>
              <div>{sectionScores.map((section) => <span key={section.label}>{section.label}: {section.score}/5</span>)}</div>
              <button type="button" onClick={resetSample}>Try this sample again</button>
            </div>
          )}
        </footer>
      </article>
    </main>
  );
}
