import React, { useMemo, useState, useEffect } from "react";
import "./A2GoetheReadingMockPreview.css";

export const A2_READING_PRACTICE_SET_01 = Object.freeze({
  teil1: {
    title: "Teil 1",
    instruction: [
      "Sie lesen in einer Zeitung diesen Text.",
      "Markieren Sie für die Aufgaben 1 bis 5 die richtige Lösung a, b oder c.",
    ],
    article: {
      title: "Mit dem Fahrrad durch die Stadt",
      subtitle: "Lena Berger repariert Fahrräder und zeigt anderen, wie es geht.",
      paragraphs: [
        "Lena Berger arbeitet seit drei Jahren in einer kleinen Fahrradwerkstatt in Bremen. Früher war sie Verkäuferin in einem Sportgeschäft. Dort merkte sie, dass viele Kundinnen und Kunden zwar gern Fahrrad fahren, aber bei kleinen Problemen sofort eine Werkstatt suchen. Deshalb machte Lena einen Kurs für Fahrradreparaturen und wechselte später ganz in diesen Beruf.",
        "In der Werkstatt repariert sie nicht nur Fahrräder. Jeden zweiten Samstag bietet sie einen zweistündigen Kurs an. Dort lernen die Teilnehmer, wie man einen Reifen wechselt, die Kette pflegt und die Bremsen kontrolliert. Werkzeug müssen sie nicht mitbringen. Die Werkstatt stellt alles zur Verfügung.",
        "Die Kurse sind besonders bei Studierenden beliebt. Viele möchten Geld sparen und kleine Reparaturen selbst machen. Lena findet das gut. Schwierige Arbeiten sollen die Kunden aber weiterhin von Fachleuten machen lassen, sagt sie.",
        "Im Sommer fährt Lena selbst fast jeden Tag mit dem Fahrrad zur Arbeit. Im Winter nimmt sie meistens den Bus, weil es morgens oft dunkel und glatt ist. Ihr Auto benutzt sie nur selten.",
        "Für nächstes Jahr plant Lena einen neuen Kurs speziell für Familien. Eltern und Kinder sollen gemeinsam lernen, wie man ein Fahrrad vor einer längeren Tour kontrolliert.",
      ],
    },
    example: {
      number: 0,
      question: "Lena arbeitet heute ...",
      options: [
        { id: "a", label: "in einer Fahrradwerkstatt." },
        { id: "b", label: "in einem Sportgeschäft." },
        { id: "c", label: "an einer Universität." },
      ],
      answer: "a",
    },
    questions: [
      {
        number: 1,
        question: "Warum hat Lena ihren Beruf gewechselt?",
        options: [
          { id: "a", label: "Sie wollte selbst mehr Sport machen." },
          { id: "b", label: "Sie interessierte sich für Fahrradreparaturen." },
          { id: "c", label: "Das Sportgeschäft musste schließen." },
        ],
        answer: "b",
      },
      {
        number: 2,
        question: "Bei Lenas Kurs ...",
        options: [
          { id: "a", label: "bringen die Teilnehmer eigenes Werkzeug mit." },
          { id: "b", label: "lernen die Teilnehmer nur etwas über Bremsen." },
          { id: "c", label: "kann man einfache Reparaturen üben." },
        ],
        answer: "c",
      },
      {
        number: 3,
        question: "Viele Studierende besuchen den Kurs, weil ...",
        options: [
          { id: "a", label: "sie Reparaturen selbst machen und Geld sparen möchten." },
          { id: "b", label: "sie dort kostenlos ein Fahrrad bekommen." },
          { id: "c", label: "der Kurs jeden Samstag stattfindet." },
        ],
        answer: "a",
      },
      {
        number: 4,
        question: "Im Winter fährt Lena meistens ...",
        options: [
          { id: "a", label: "mit dem Auto." },
          { id: "b", label: "mit dem Bus." },
          { id: "c", label: "mit dem Fahrrad." },
        ],
        answer: "b",
      },
      {
        number: 5,
        question: "Für nächstes Jahr plant Lena ...",
        options: [
          { id: "a", label: "einen Kurs für Eltern und Kinder." },
          { id: "b", label: "eine zweite Werkstatt." },
          { id: "c", label: "eine lange Fahrradtour für Studierende." },
        ],
        answer: "a",
      },
    ],
  },
  teil2: {
    title: "Teil 2",
    instruction: [
      "Sie sind in einem Freizeit- und Bildungszentrum.",
      "Lesen Sie die Informationen und markieren Sie für die Aufgaben 6 bis 10 die richtige Lösung a, b oder c.",
    ],
    store: {
      title: "Haus am Park",
      floors: [
        ["4. Stock", "Sprachkurse, Computerraum, Lernberatung, ruhiger Leseraum, kleine Bibliothek"],
        ["3. Stock", "Musikschule, Klavierzimmer, Gitarrenraum, Chorraum, Tonstudio"],
        ["2. Stock", "Yoga, Fitness, Tanzkurse, Umkleiden, Duschen, Erste Hilfe"],
        ["1. Stock", "Kochkurse, Backkurse, großer Veranstaltungsraum, Kinderbetreuung"],
        ["EG", "Information, Anmeldung, Café, Garderobe, Fundbüro, Kopierer, barrierefreies WC"],
        ["UG", "Fahrradkeller, Schließfächer, Werkraum, Reparaturkurs, Materiallager"],
      ],
    },
    example: {
      number: 0,
      question: "Sie möchten sich für einen Deutschkurs anmelden.",
      options: [
        { id: "a", label: "4. Stock" },
        { id: "b", label: "EG" },
        { id: "c", label: "anderer Stock" },
      ],
      answer: "b",
    },
    questions: [
      {
        number: 6,
        question: "Sie möchten nach dem Sport duschen.",
        options: [
          { id: "a", label: "2. Stock" },
          { id: "b", label: "1. Stock" },
          { id: "c", label: "anderer Stock" },
        ],
        answer: "a",
      },
      {
        number: 7,
        question: "Sie haben Ihre Jacke verloren.",
        options: [
          { id: "a", label: "UG" },
          { id: "b", label: "EG" },
          { id: "c", label: "anderer Stock" },
        ],
        answer: "b",
      },
      {
        number: 8,
        question: "Sie möchten in Ruhe für eine Prüfung lesen.",
        options: [
          { id: "a", label: "4. Stock" },
          { id: "b", label: "3. Stock" },
          { id: "c", label: "anderer Stock" },
        ],
        answer: "a",
      },
      {
        number: 9,
        question: "Ihre Tochter möchte Gitarre lernen.",
        options: [
          { id: "a", label: "2. Stock" },
          { id: "b", label: "3. Stock" },
          { id: "c", label: "anderer Stock" },
        ],
        answer: "b",
      },
      {
        number: 10,
        question: "Sie möchten lernen, wie man ein Fahrrad repariert.",
        options: [
          { id: "a", label: "UG" },
          { id: "b", label: "4. Stock" },
          { id: "c", label: "anderer Stock" },
        ],
        answer: "a",
      },
    ],
  },
  teil3: {
    title: "Teil 3",
    instruction: [
      "Sie lesen eine E-Mail.",
      "Markieren Sie für die Aufgaben 11 bis 15 die richtige Lösung a, b oder c.",
    ],
    email: {
      to: "Sophie",
      subject: "Mein neues Leben in Freiburg",
      greeting: "Liebe Sophie,",
      paragraphs: [
        "seit einem Monat wohne ich jetzt in Freiburg. Die neue Arbeit gefällt mir gut, aber die ersten Tage waren ziemlich anstrengend. Ich musste viele Namen lernen und wusste am Anfang nie, wen ich bei einer Frage ansprechen sollte. Inzwischen kenne ich die Kollegen besser und fühle mich viel sicherer.",
        "Meine Wohnung liegt etwas außerhalb. Mit der Straßenbahn brauche ich ungefähr zwanzig Minuten bis zur Arbeit. Das ist für mich in Ordnung, denn die Haltestelle ist direkt vor dem Haus. Nur am Sonntag fährt die Bahn seltener. Dann nehme ich manchmal mein Fahrrad.",
        "Letzte Woche habe ich mich in einem Sportverein angemeldet. Eigentlich wollte ich wieder Tennis spielen, aber die Tennisgruppe trainiert genau an dem Abend, an dem ich länger arbeite. Deshalb mache ich jetzt mittwochs einen Schwimmkurs. Der macht mehr Spaß, als ich erwartet hatte.",
        "Am Samstag helfe ich seit Kurzem in einem Nachbarschaftscafé. Ich bekomme dafür kein Geld, aber ich lerne viele Menschen aus meinem Viertel kennen. Meistens serviere ich Getränke oder helfe beim Kuchenverkauf. Nächsten Monat organisieren wir dort einen kleinen Flohmarkt.",
        "Komm mich doch im November besuchen. An dem Wochenende vom 14. habe ich frei. Wir könnten am Samstag in die Altstadt gehen und am Sonntag, wenn das Wetter gut ist, eine kleine Wanderung machen. Du kannst natürlich bei mir schlafen.",
      ],
      closing: ["Schreib mir, ob du Zeit hast.", "Liebe Grüße", "Mara"],
    },
    questions: [
      {
        number: 11,
        question: "In den ersten Tagen bei der Arbeit ...",
        options: [
          { id: "a", label: "kannte Mara schon alle Kollegen." },
          { id: "b", label: "war für Mara vieles noch neu." },
          { id: "c", label: "wollte Mara sofort kündigen." },
        ],
        answer: "b",
      },
      {
        number: 12,
        question: "Mara fährt normalerweise ...",
        options: [
          { id: "a", label: "mit der Straßenbahn zur Arbeit." },
          { id: "b", label: "jeden Tag mit dem Fahrrad." },
          { id: "c", label: "mit dem Auto ins Zentrum." },
        ],
        answer: "a",
      },
      {
        number: 13,
        question: "Warum spielt Mara nicht Tennis?",
        options: [
          { id: "a", label: "Der Verein bietet keinen Tenniskurs an." },
          { id: "b", label: "Sie findet Tennis inzwischen langweilig." },
          { id: "c", label: "Die Trainingszeit passt nicht zu ihrer Arbeit." },
        ],
        answer: "c",
      },
      {
        number: 14,
        question: "Im Nachbarschaftscafé ...",
        options: [
          { id: "a", label: "arbeitet Mara freiwillig." },
          { id: "b", label: "bekommt Mara jeden Samstag Geld." },
          { id: "c", label: "gibt Mara Schwimmunterricht." },
        ],
        answer: "a",
      },
      {
        number: 15,
        question: "Wenn Sophie im November kommt, ...",
        options: [
          { id: "a", label: "muss sie in einem Hotel schlafen." },
          { id: "b", label: "hat Mara an einem bestimmten Wochenende frei." },
          { id: "c", label: "fahren beide sicher am Sonntag ins Schwimmbad." },
        ],
        answer: "b",
      },
    ],
  },
  teil4: {
    title: "Teil 4",
    instruction: [
      "Fünf Personen suchen passende Kurse oder Freizeitangebote.",
      "Lesen Sie die Aufgaben 16 bis 20 und die Anzeigen a bis f. Welche Anzeige passt zu welcher Person?",
      "Für eine Aufgabe gibt es keine passende Anzeige. Schreiben Sie dort den Buchstaben X.",
      "Die Anzeige aus dem Beispiel können Sie nicht mehr wählen.",
    ],
    example: {
      number: 0,
      person: "Ben möchte am Wochenende lernen, wie man gute Fotos mit dem Smartphone macht.",
      answer: "e",
    },
    people: [
      { number: 16, person: "Fatima möchte nach der Arbeit einen Deutschkurs besuchen, aber nicht am Wochenende.", answer: "c" },
      { number: 17, person: "Leon sucht einen günstigen Kochkurs und möchte vegetarische Gerichte lernen.", answer: "a" },
      { number: 18, person: "Eva möchte mit ihrem zehnjährigen Sohn regelmäßig gemeinsam Sport machen.", answer: "f" },
      { number: 19, person: "Samuel möchte sonntags in einer Gruppe wandern und neue Leute kennenlernen.", answer: "b" },
      { number: 20, person: "Nora möchte am Freitagabend einen Anfängerkurs im Malen besuchen.", answer: "X" },
    ],
    ads: [
      {
        id: "a",
        url: "www.kochen-miteinander.de",
        title: "Vegetarisch kochen",
        body: [
          "Einfache vegetarische Gerichte für Alltag und Gäste.",
          "Vier Dienstagabende von 18.30 bis 21.00 Uhr.",
          "Kursgebühr 35 Euro inklusive Lebensmittel.",
          "Keine Vorkenntnisse nötig.",
        ],
      },
      {
        id: "b",
        url: "www.sonntags-draussen.de",
        title: "Gemeinsam unterwegs",
        body: [
          "Jeden zweiten Sonntag leichte Wanderungen rund um die Stadt.",
          "Treffpunkt 10.00 Uhr am Hauptbahnhof.",
          "Auch neue Teilnehmer sind jederzeit willkommen.",
          "Teilnahme kostenlos, eigene Verpflegung mitbringen.",
        ],
      },
      {
        id: "c",
        url: "www.sprachpunkt-abend.de",
        title: "Deutsch am Abend A2",
        body: [
          "Montag und Mittwoch 19.00 bis 20.30 Uhr.",
          "Kleine Gruppen und viel Sprechen.",
          "Einstufung vor Kursbeginn.",
          "Der nächste Kurs startet am 3. November.",
        ],
      },
      {
        id: "d",
        url: "www.kreativ-samstag.de",
        title: "Malen für Anfänger",
        body: [
          "Aquarell und Zeichnen für Erwachsene ohne Vorkenntnisse.",
          "Samstags 10.00 bis 13.00 Uhr.",
          "Material kann im Kurs gekauft werden.",
        ],
      },
      {
        id: "e",
        url: "www.foto-kompakt.de",
        title: "Bessere Fotos mit dem Handy",
        body: [
          "Ein Wochenendkurs für Smartphone-Fotografie.",
          "Samstag und Sonntag jeweils 10.00 bis 14.00 Uhr.",
          "Bitte eigenes Smartphone mitbringen.",
        ],
      },
      {
        id: "f",
        url: "www.familien-sportclub.de",
        title: "Fit als Familie",
        body: [
          "Bewegung, Spiele und einfache Fitnessübungen für Eltern und Kinder von 8 bis 12 Jahren.",
          "Jeden Donnerstag 17.30 bis 18.30 Uhr.",
          "Monatsbeitrag für eine erwachsene Person und ein Kind: 24 Euro.",
        ],
      },
    ],
  },
});

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

const allAnswers = (set) => ({
  ...Object.fromEntries(set.teil1.questions.map((q) => [q.number, q.answer])),
  ...Object.fromEntries(set.teil2.questions.map((q) => [q.number, q.answer])),
  ...Object.fromEntries(set.teil3.questions.map((q) => [q.number, q.answer])),
  ...Object.fromEntries(set.teil4.people.map((q) => [q.number, q.answer])),
});

export default function A2ReadingPracticeSet() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(30 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const answerKey = useMemo(() => allAnswers(A2_READING_PRACTICE_SET_01), []);
  const answered = Object.keys(answers).length;
  const total = Object.keys(answerKey).length;
  const score = Object.entries(answerKey).filter(
    ([number, answer]) => String(answers[number] || "") === String(answer),
  ).length;

  useEffect(() => {
    if (!timerRunning || secondsLeft <= 0 || submitted) return undefined;
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [secondsLeft, submitted, timerRunning]);

  const setAnswer = (number, value) => {
    if (submitted) return;
    setAnswers((current) => ({ ...current, [number]: value }));
  };

  const reset = () => {
    setAnswers({});
    setSubmitted(false);
    setSecondsLeft(30 * 60);
    setTimerRunning(false);
  };

  const formatTime = (seconds) =>
    `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  const renderQuestions = (questions, part) =>
    questions.map((question) => (
      <section className="a2-mock-question" key={question.number}>
        <h3>Aufgabe {question.number}</h3>
        <p>{question.question}</p>
        <ChoiceList
          name={`a2-practice-${part}-${question.number}`}
          options={question.options}
          value={answers[question.number] || ""}
          onChange={(value) => setAnswer(question.number, value)}
          reveal={submitted}
          answer={question.answer}
        />
        {submitted ? (
          <small style={{ fontWeight: 700, color: answers[question.number] === question.answer ? "#166534" : "#991b1b" }}>
            {answers[question.number] === question.answer ? "Correct" : `Correct answer: ${question.answer}`}
          </small>
        ) : null}
      </section>
    ));

  return (
    <article className="a2-mock-exam" data-a2-reading-practice-set="a2-reading-practice-01">
      <header className="a2-mock-title">
        <p>A2 · Lesen · Exams Room</p>
        <h1>Practice Set 1</h1>
        <span>{answered}/{total} answered</span>
      </header>

      <section
        style={{
          margin: "0 0 18px",
          padding: 16,
          border: "1px solid #cbd5e1",
          background: "#f8fafc",
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div>
          <strong>30-minute practice timer</strong>
          <p style={{ margin: "4px 0 0", color: "#475569" }}>
            This is a separate question set from the Course Book mock.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <strong style={{ fontSize: 20 }}>{formatTime(secondsLeft)}</strong>
          <button type="button" onClick={() => setTimerRunning((current) => !current)} disabled={submitted}>
            {timerRunning ? "Pause" : secondsLeft === 30 * 60 ? "Start timer" : "Resume"}
          </button>
          <button type="button" onClick={reset}>Reset</button>
        </div>
      </section>

      <section className="a2-mock-part">
        <TeilHeading data={A2_READING_PRACTICE_SET_01.teil1} />
        <article className="a2-mock-newspaper">
          <h3>{A2_READING_PRACTICE_SET_01.teil1.article.title}</h3>
          <h4>{A2_READING_PRACTICE_SET_01.teil1.article.subtitle}</h4>
          {A2_READING_PRACTICE_SET_01.teil1.article.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </article>
        <section className="a2-mock-question a2-mock-example">
          <h3>Beispiel 0</h3>
          <p>{A2_READING_PRACTICE_SET_01.teil1.example.question}</p>
          <ChoiceList
            name="a2-practice-example-1"
            options={A2_READING_PRACTICE_SET_01.teil1.example.options}
            value={A2_READING_PRACTICE_SET_01.teil1.example.answer}
            onChange={() => {}}
            reveal
            answer={A2_READING_PRACTICE_SET_01.teil1.example.answer}
          />
        </section>
        {renderQuestions(A2_READING_PRACTICE_SET_01.teil1.questions, "t1")}
      </section>

      <section className="a2-mock-part">
        <TeilHeading data={A2_READING_PRACTICE_SET_01.teil2} />
        <article className="a2-mock-directory">
          <h3>{A2_READING_PRACTICE_SET_01.teil2.store.title}</h3>
          {A2_READING_PRACTICE_SET_01.teil2.store.floors.map(([floor, items]) => (
            <div className="a2-mock-floor" key={floor}>
              <strong>{floor}</strong>
              <p>{items}</p>
            </div>
          ))}
        </article>
        <section className="a2-mock-question a2-mock-example">
          <h3>Beispiel 0</h3>
          <p>{A2_READING_PRACTICE_SET_01.teil2.example.question}</p>
          <ChoiceList
            name="a2-practice-example-2"
            options={A2_READING_PRACTICE_SET_01.teil2.example.options}
            value={A2_READING_PRACTICE_SET_01.teil2.example.answer}
            onChange={() => {}}
            reveal
            answer={A2_READING_PRACTICE_SET_01.teil2.example.answer}
          />
        </section>
        {renderQuestions(A2_READING_PRACTICE_SET_01.teil2.questions, "t2")}
      </section>

      <section className="a2-mock-part">
        <TeilHeading data={A2_READING_PRACTICE_SET_01.teil3} />
        <article className="a2-mock-email">
          <div className="a2-mock-email-toolbar">
            <button type="button" tabIndex="-1">Senden</button>
            <span>Antworten</span>
            <span>Weiterleiten</span>
          </div>
          <div className="a2-mock-email-field"><strong>An:</strong><span>{A2_READING_PRACTICE_SET_01.teil3.email.to}</span></div>
          <div className="a2-mock-email-field"><strong>Cc:</strong><span></span></div>
          <div className="a2-mock-email-field"><strong>Betreff:</strong><span>{A2_READING_PRACTICE_SET_01.teil3.email.subject}</span></div>
          <div className="a2-mock-email-body">
            <p>{A2_READING_PRACTICE_SET_01.teil3.email.greeting}</p>
            {A2_READING_PRACTICE_SET_01.teil3.email.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {A2_READING_PRACTICE_SET_01.teil3.email.closing.map((line) => <p className="a2-mock-email-closing" key={line}>{line}</p>)}
          </div>
        </article>
        {renderQuestions(A2_READING_PRACTICE_SET_01.teil3.questions, "t3")}
      </section>

      <section className="a2-mock-part a2-mock-teil4">
        <TeilHeading data={A2_READING_PRACTICE_SET_01.teil4} />
        <div className="a2-mock-people-sheet">
          <div className="a2-mock-person-row a2-mock-example">
            <div>
              <strong>Beispiel 0</strong>
              <p>{A2_READING_PRACTICE_SET_01.teil4.example.person}</p>
            </div>
            <label>
              Anzeige:
              <select value={A2_READING_PRACTICE_SET_01.teil4.example.answer} disabled>
                <option>{A2_READING_PRACTICE_SET_01.teil4.example.answer}</option>
              </select>
            </label>
          </div>
          {A2_READING_PRACTICE_SET_01.teil4.people.map((item) => (
            <div className="a2-mock-person-row" key={item.number}>
              <div>
                <strong>Aufgabe {item.number}</strong>
                <p>{item.person}</p>
                {submitted ? (
                  <small style={{ fontWeight: 700, color: answers[item.number] === item.answer ? "#166534" : "#991b1b" }}>
                    {answers[item.number] === item.answer ? "Correct" : `Correct answer: ${item.answer}`}
                  </small>
                ) : null}
              </div>
              <label>
                Anzeige:
                <select
                  value={answers[item.number] || ""}
                  onChange={(event) => setAnswer(item.number, event.target.value)}
                  disabled={submitted}
                >
                  <option value="">—</option>
                  {["a", "b", "c", "d", "e", "f", "X"].map((option) => (
                    <option value={option} key={option}>{option}</option>
                  ))}
                </select>
              </label>
            </div>
          ))}
        </div>

        <h3 className="a2-mock-ads-title">Internet-Anzeigen</h3>
        <div className="a2-mock-ads-grid">
          {A2_READING_PRACTICE_SET_01.teil4.ads.map((ad) => (
            <article className="a2-mock-ad" key={ad.id}>
              <div className="a2-mock-ad-browser">
                <strong>{ad.id}</strong>
                <span>{ad.url}</span>
              </div>
              <div className="a2-mock-ad-body">
                <h4>{ad.title}</h4>
                {ad.body.map((line) => <p key={line}>{line}</p>)}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        style={{
          marginTop: 18,
          padding: 18,
          border: "1px solid #cbd5e1",
          background: submitted ? "#f0fdf4" : "#ffffff",
        }}
      >
        {submitted ? (
          <>
            <h2 style={{ marginTop: 0 }}>Result: {score}/{total}</h2>
            <p>{Math.round((score / total) * 100)}% correct. Review the highlighted answers above, then reset when you want a fresh attempt.</p>
            <button type="button" onClick={reset}>Practice again</button>
          </>
        ) : (
          <>
            <strong>Check your answers</strong>
            <p>{answered === total ? "All 20 questions are answered." : `Answer all 20 questions first. ${total - answered} remaining.`}</p>
            <button
              type="button"
              disabled={answered !== total}
              onClick={() => {
                setTimerRunning(false);
                setSubmitted(true);
              }}
            >
              Check answers
            </button>
          </>
        )}
      </section>
    </article>
  );
}
