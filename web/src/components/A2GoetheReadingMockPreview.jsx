import React, { useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import "./A2GoetheReadingMockPreview.css";

export const A2_GOETHE_READING_MOCK = Object.freeze({
  teil1: {
    title: "Teil 1",
    instruction: [
      "Sie lesen in einer Zeitung diesen Text.",
      "Markieren Sie für die Aufgaben 1 bis 5 die richtige Lösung a, b oder c.",
    ],
    article: {
      title: "Ein neuer Treffpunkt im Viertel: Das Stadtteilcafé „Miteinander“",
      subtitle: "",
      paragraphs: [
        "Seit letzter Woche gibt es in der Goethestraße ein neues Stadtteilcafé. Es heißt „Miteinander“ und hat von Dienstag bis Sonntag geöffnet. Nur am Montag ist Ruhetag. Das Café ist mehr als ein normaler Gastronomiebetrieb: Hier können sich Nachbarn treffen, gemeinsam Deutsch sprechen oder Bücher austauschen.",
        "Die Idee zu dem Projekt hatte Sabine Meyer. Sie wohnt seit 20 Jahren im Viertel. „Viele ältere Menschen sind oft allein und Jugendliche suchen nach der Schule einen ruhigen Ort für die Hausaufgaben. Bei uns sind alle willkommen“, erklärt Frau Meyer. Im Café arbeiten vier fest angestellte Mitarbeiter und sechs ehrenamtliche Helferinnen und Helfer.",
        "Besonders beliebt ist das Frühstück am Wochenende. Von 9:00 bis 12:00 Uhr gibt es frische Brötchen, Käse, Obst und selbst gemachte Marmelade. Das Frühstück kostet 5 Euro pro Person. Kinder unter 6 Jahren essen kostenlos.",
        "Ab nächstem Monat bietet das Café auch Abendkurse an. Jeden Mittwoch von 18:00 bis 20:00 Uhr gibt es einen internationalen Kochkurs. Eine Anmeldung ist nicht nötig – man kann einfach vorbeikommen.",
      ],
    },
    questions: [
      {
        number: 1,
        question: "Das Stadtteilcafé „Miteinander“ ...",
        options: [
          { id: "a", label: "hat an allen Tagen der Woche geöffnet." },
          { id: "b", label: "ist montags geschlossen." },
          { id: "c", label: "hat nur am Wochenende geöffnet." },
        ],
        answer: "b",
      },
      {
        number: 2,
        question: "Sabine Meyer ...",
        options: [
          { id: "a", label: "wohnt erst seit wenigen Monaten im Viertel." },
          { id: "b", label: "hat das Café zusammen mit Jugendlichen gegründet." },
          { id: "c", label: "hatte die Idee für das Café." },
        ],
        answer: "c",
      },
      {
        number: 3,
        question: "Im Café arbeiten ...",
        options: [
          { id: "a", label: "nur ehrenamtliche Personen." },
          { id: "b", label: "insgesamt zehn Personen." },
          { id: "c", label: "vier ehrenamtliche Helfer." },
        ],
        answer: "b",
      },
      {
        number: 4,
        question: "Das Wochenende-Frühstück ...",
        options: [
          { id: "a", label: "kostet für kleine Kinder nichts." },
          { id: "b", label: "dauert von 9:00 bis 10:00 Uhr." },
          { id: "c", label: "kostet für Kinder ab 6 Jahren 10 Euro." },
        ],
        answer: "a",
      },
      {
        number: 5,
        question: "Wer am Kochkurs am Mittwoch teilnehmen möchte, ...",
        options: [
          { id: "a", label: "muss vorher anrufen und reservieren." },
          { id: "b", label: "kann ohne vorherige Anmeldung kommen." },
          { id: "c", label: "muss einen Platz im Internet buchen." },
        ],
        answer: "b",
      },
    ],
  },
  teil2: {
    title: "Teil 2",
    instruction: [
      "Sie lesen die Informationstafel in einem Kaufhaus.",
      "Lesen Sie die Aufgaben 6 bis 10 und den Text.",
      "In welchen Stock gehen Sie? Markieren Sie die richtige Lösung a, b oder c.",
    ],
    store: {
      title: "Kaufhaus „ALEX“ – Wegweiser",
      floors: [
        ["4. Obergeschoss (4. OG)", "Restaurant & Café, Kundenservice, Fundbüro, Toiletten, Wickelraum"],
        ["3. Obergeschoss (3. OG)", "Elektronik, Smartphones, Fotozubehör, Computer & Videospiele"],
        ["2. Obergeschoss (2. OG)", "Damenmode, Kindermode, Spielwaren, Babyausstattung, Kinderbücher"],
        ["1. Obergeschoss (1. OG)", "Herrenmode, Sportbekleidung & Sportschuhe, Koffer und Reisetaschen"],
        ["Erdgeschoss (EG)", "Kosmetik, Parfum, Uhren, Schmuck, Schreibwaren, Information"],
        ["Untergeschoss (UG)", "Supermarkt (Lebensmittel & Bäckerei)"],
      ],
    },
    questions: [
      {
        number: 6,
        question: "Sie möchten eine neue Jeans für Ihren 8-jährigen Sohn kaufen.",
        options: [
          { id: "a", label: "2. OG" },
          { id: "b", label: "1. OG" },
          { id: "c", label: "Anderer Stock" },
        ],
        answer: "a",
      },
      {
        number: 7,
        question: "Sie suchen eine neue Kamera für Ihren Urlaub.",
        options: [
          { id: "a", label: "Erdgeschoss" },
          { id: "b", label: "3. OG" },
          { id: "c", label: "Anderer Stock" },
        ],
        answer: "b",
      },
      {
        number: 8,
        question: "Sie haben Ihre Jacke im Kaufhaus vergessen und suchen das Fundbüro.",
        options: [
          { id: "a", label: "4. OG" },
          { id: "b", label: "2. OG" },
          { id: "c", label: "3. OG" },
        ],
        answer: "a",
      },
      {
        number: 9,
        question: "Sie suchen frisches Brot und Käse für das Abendessen.",
        options: [
          { id: "a", label: "Untergeschoss" },
          { id: "b", label: "4. OG" },
          { id: "c", label: "Anderer Stock" },
        ],
        answer: "a",
      },
      {
        number: 10,
        question: "Sie möchten eine neue Sehhilfe kaufen und einen Sehtest machen (Optiker).",
        options: [
          { id: "a", label: "Erdgeschoss" },
          { id: "b", label: "3. OG" },
          { id: "c", label: "Anderer Stock" },
        ],
        answer: "c",
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
      to: "Sarah",
      subject: "Meine neue Wohnung / Einladung zur Party",
      greeting: "Liebe Sarah,",
      paragraphs: [
        "wie geht es dir? Entschuldige, dass ich mich erst jetzt melde, aber die letzten Wochen waren wirklich stressig.",
        "Ich bin endlich in meine neue Wohnung eingezogen! Sie liegt im zweiten Stock und ist sehr hell. Das Beste ist der Balkon: Von dort kann man direkt auf einen kleinen Park schauen. Die Wohnung ist nicht sehr groß, hat aber zwei schöne Zimmer und eine moderne Küche. Die Miete ist auch ganz okay, nur der Umzug war sehr anstrengend, weil es im Haus keinen Aufzug gibt. Zum Glück haben mir meine Brüder beim Tragen der Möbel geholfen.",
        "Am nächsten Samstag, den 15. Oktober, möchte ich eine kleine Einweihungsparty feiern. Die Feier beginnt um 18:00 Uhr. Wenn das Wetter gut ist, können wir auf dem Balkon grillen. Bring bitte keine Geschenke mit, aber vielleicht könntest du einen Salat oder einen Kuchen machen? Getränke habe ich schon gekauft.",
        "Sag mir bitte bis Donnerstag Bescheid, ob du kommen kannst. Du kannst gerne auch deinen Freund Thomas mitbringen!",
        "Ich freue mich schon sehr auf dich!",
      ],
      closing: ["Liebe Grüße", "Julia"],
    },
    questions: [
      {
        number: 11,
        question: "Warum antwortet Julia erst jetzt?",
        options: [
          { id: "a", label: "Sie war im Urlaub." },
          { id: "b", label: "Sie hatte viel Stress." },
          { id: "c", label: "Sie war krank." },
        ],
        answer: "b",
      },
      {
        number: 12,
        question: "Was gefällt Julia an der neuen Wohnung besonders gut?",
        options: [
          { id: "a", label: "Der Aufzug im Haus." },
          { id: "b", label: "Der Balkon mit Blick auf den Park." },
          { id: "c", label: "Das große Wohnzimmer." },
        ],
        answer: "b",
      },
      {
        number: 13,
        question: "Wer hat Julia beim Umzug geholfen?",
        options: [
          { id: "a", label: "Ihre Brüder." },
          { id: "b", label: "Ihre Freundin Sarah." },
          { id: "c", label: "Ihr Freund Thomas." },
        ],
        answer: "a",
      },
      {
        number: 14,
        question: "Was soll Sarah zur Party mitbringen?",
        options: [
          { id: "a", label: "Getränke." },
          { id: "b", label: "Ein Geschenk." },
          { id: "c", label: "Etwas zu essen." },
        ],
        answer: "c",
      },
      {
        number: 15,
        question: "Sarah soll Julia bis Donnerstag sagen, ...",
        options: [
          { id: "a", label: "wann Thomas Zeit hat." },
          { id: "b", label: "ob sie zur Party kommt." },
          { id: "c", label: "was sie grillen möchten." },
        ],
        answer: "b",
      },
    ],
  },
  teil4: {
    title: "Teil 4",
    instruction: [
      "Sechs Personen suchen im Internet nach passenden Lokalen oder Angeboten.",
      "Lesen Sie die Aufgaben 16 bis 20 und die Anzeigen a bis f. Welche Anzeige passt zu welcher Person?",
      "Schreiben Sie die richtige Lösung in den Antwortbogen.",
      "Für eine Aufgabe gibt es keine passende Anzeige. Schreiben Sie dort den Buchstaben X.",
      "Die Anzeige aus dem Beispiel können Sie nicht mehr wählen.",
    ],
    example: {
      number: 0,
      person: "Jonas möchte am Sonntag mit Freunden ausgiebig frühstücken gehen.",
      answer: "d",
    },
    people: [
      { number: 16, person: "Aylin heiratet im Sommer und sucht ein Lokal für etwa 120 Gäste.", answer: "f" },
      { number: 17, person: "Martin möchte mit zwei Geschäftspartnern zentral essen und dabei in Ruhe über die Arbeit sprechen.", answer: "c" },
      { number: 18, person: "Claudia feiert zu Hause Geburtstag und möchte ihren Gästen besonders guten Wein anbieten.", answer: "X" },
      { number: 19, person: "Paul erwartet am Abend mehrere Freunde bei sich zu Hause. Er möchte Essen anbieten, aber nicht selbst kochen.", answer: "b" },
      { number: 20, person: "Jana möchte mit ihrer achtjährigen Tochter Geburtstag feiern und dabei Kuchen essen gehen.", answer: "a" },
    ],
    ads: [
      {
        id: "a",
        url: "www.cafe-sonnengarten.de",
        title: "Café Sonnengarten",
        body: [
          "Hausgemachte Torten, Kuchen und verschiedene Eissorten.",
          "Für Familien gibt es eine große Terrasse und eine kleine Spielecke für Kinder.",
          "Alle Speisen können Sie auch mitnehmen.",
          "Dienstag bis Sonntag von 13.00 bis 19.00 Uhr geöffnet.",
          "Gartenweg 12 · Tel. 0711 482615",
        ],
      },
      {
        id: "b",
        url: "www.festservice-koenig.de",
        title: "Feiern ohne Stress",
        body: [
          "Sie feiern zu Hause oder in einem gemieteten Raum?",
          "Wir liefern warme und kalte Speisen für Geburtstage, Hochzeiten und andere private Feiern.",
          "Auf Wunsch bringen wir auch Tische, Stühle und Geschirr mit.",
          "Servicepersonal kann ebenfalls gebucht werden.",
        ],
      },
      {
        id: "c",
        url: "www.restaurant-stadthof.de",
        title: "Restaurant Stadthof",
        body: [
          "Internationale und regionale Küche sowie ausgewählte Weine.",
          "Mittagsmenü ab 16 Euro.",
          "Unser Restaurant liegt nur fünf Minuten vom Hauptbahnhof entfernt.",
          "Für kleine Gruppen und geschäftliche Gespräche haben wir einen ruhigen separaten Raum.",
          "Reservierung unter 040 627845.",
        ],
      },
      {
        id: "d",
        url: "www.cafe-uferblick.de",
        title: "Frühstück am Wasser",
        body: [
          "Direkt am Fluss und mitten in der Stadt.",
          "Samstag und Sonntag großes Frühstücksbuffet von 9.00 bis 13.00 Uhr.",
          "Freitagabend ab 20.00 Uhr Live-Musik.",
          "Täglich geöffnet.",
          "Tischreservierung: 089 4567321",
        ],
      },
      {
        id: "e",
        url: "www.kinderwelt-regenbogen.de",
        title: "Spielen und feiern bei jedem Wetter",
        body: [
          "Über 2.000 Quadratmeter zum Klettern, Spielen und Toben.",
          "Wir organisieren Kindergeburtstage mit Spielen, Musik, Getränken und kleinen Snacks.",
          "Täglich von 10.00 bis 20.00 Uhr geöffnet.",
          "Auch während der Schulferien.",
        ],
      },
      {
        id: "f",
        url: "www.landgasthof-seeblick.de",
        title: "Feiern am See",
        body: [
          "Regionale Küche, große Terrasse und Blick auf den See.",
          "Sie planen eine Hochzeit, ein Familienfest oder eine Firmenfeier?",
          "Unsere Veranstaltungsräume bieten Platz für bis zu 180 Personen.",
          "Nur 25 Minuten vom Stadtzentrum entfernt.",
          "Sprechen Sie mit uns über Ihr Fest.",
        ],
      },
    ],
  },
});

const ChoiceList = ({ name, options, value, onChange, disabled = false }) => (
  <div className="a2-mock-choice-list">
    {options.map((option) => (
      <label className="a2-mock-choice" key={option.id}>
        <input
          type="radio"
          name={name}
          checked={value === option.id}
          onChange={() => onChange(option.id)}
          disabled={disabled}
        />
        <strong>{option.id}</strong>
        <span>{option.label}</span>
      </label>
    ))}
  </div>
);

const TeilHeading = ({ data }) => (
  <header className="a2-mock-part-heading">
    <h2>{data.title}</h2>
    {data.instruction.map((line) => <p key={line}>{line}</p>)}
  </header>
);

export default function A2GoetheReadingMockPreview() {
  const [answers, setAnswers] = useState({});

  const answered = useMemo(
    () => Object.keys(answers).filter((key) => /^q\d+$/.test(key)).length,
    [answers],
  );

  const setAnswer = (number, value) =>
    setAnswers((current) => ({ ...current, [`q${number}`]: value }));

  return (
    <main className="a2-mock-shell" data-a2-reading-mock-preview>
      <div className="a2-mock-topbar">
        <AppBackButton label="Back to A2 Mock Preview" fallbackPath="/campus/course/a2-mock-practice-preview" />
        <span>A2 Lesen mock · preview only</span>
      </div>

      <article className="a2-mock-exam">
        <header className="a2-mock-title">
          <p>A2 · Lesen</p>
          <h1>Mockprüfung</h1>
          <span>{answered}/20 answered</span>
        </header>

        <section className="a2-mock-part">
          <TeilHeading data={A2_GOETHE_READING_MOCK.teil1} />
          <article className="a2-mock-newspaper">
            <h3>{A2_GOETHE_READING_MOCK.teil1.article.title}</h3>
            <h4>{A2_GOETHE_READING_MOCK.teil1.article.subtitle}</h4>
            {A2_GOETHE_READING_MOCK.teil1.article.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </article>

          {A2_GOETHE_READING_MOCK.teil1.example ? (
            <section className="a2-mock-question a2-mock-example">
              <h3>Beispiel 0</h3>
              <p>{A2_GOETHE_READING_MOCK.teil1.example.question}</p>
              <ChoiceList
                name="a2-t1-example"
                options={A2_GOETHE_READING_MOCK.teil1.example.options}
                value={A2_GOETHE_READING_MOCK.teil1.example.answer}
                onChange={() => {}}
                disabled
              />
            </section>
          ) : null}

          {A2_GOETHE_READING_MOCK.teil1.questions.map((question) => (
            <section className="a2-mock-question" key={question.number}>
              <h3>Aufgabe {question.number}</h3>
              <p>{question.question}</p>
              <ChoiceList
                name={`a2-t1-${question.number}`}
                options={question.options}
                value={answers[`q${question.number}`] || ""}
                onChange={(value) => setAnswer(question.number, value)}
              />
            </section>
          ))}
        </section>

        <section className="a2-mock-part">
          <TeilHeading data={A2_GOETHE_READING_MOCK.teil2} />
          <article className="a2-mock-directory">
            <h3>{A2_GOETHE_READING_MOCK.teil2.store.title}</h3>
            {A2_GOETHE_READING_MOCK.teil2.store.floors.map(([floor, items]) => (
              <div className="a2-mock-floor" key={floor}>
                <strong>{floor}</strong>
                <p>{items}</p>
              </div>
            ))}
          </article>

          {A2_GOETHE_READING_MOCK.teil2.example ? (
            <section className="a2-mock-question a2-mock-example">
              <h3>Beispiel 0</h3>
              <p>{A2_GOETHE_READING_MOCK.teil2.example.question}</p>
              <ChoiceList
                name="a2-t2-example"
                options={A2_GOETHE_READING_MOCK.teil2.example.options}
                value={A2_GOETHE_READING_MOCK.teil2.example.answer}
                onChange={() => {}}
                disabled
              />
            </section>
          ) : null}

          {A2_GOETHE_READING_MOCK.teil2.questions.map((question) => (
            <section className="a2-mock-question" key={question.number}>
              <h3>Aufgabe {question.number}</h3>
              <p>{question.question}</p>
              <ChoiceList
                name={`a2-t2-${question.number}`}
                options={question.options}
                value={answers[`q${question.number}`] || ""}
                onChange={(value) => setAnswer(question.number, value)}
              />
            </section>
          ))}
        </section>

        <section className="a2-mock-part">
          <TeilHeading data={A2_GOETHE_READING_MOCK.teil3} />
          <article className="a2-mock-email">
            <div className="a2-mock-email-toolbar">
              <button type="button" tabIndex="-1">Senden</button>
              <span>Antworten</span>
              <span>Weiterleiten</span>
            </div>
            <div className="a2-mock-email-field"><strong>An:</strong><span>{A2_GOETHE_READING_MOCK.teil3.email.to}</span></div>
            <div className="a2-mock-email-field"><strong>Cc:</strong><span></span></div>
            <div className="a2-mock-email-field"><strong>Betreff:</strong><span>{A2_GOETHE_READING_MOCK.teil3.email.subject}</span></div>
            <div className="a2-mock-email-body">
              <p>{A2_GOETHE_READING_MOCK.teil3.email.greeting}</p>
              {A2_GOETHE_READING_MOCK.teil3.email.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {A2_GOETHE_READING_MOCK.teil3.email.closing.map((line) => <p className="a2-mock-email-closing" key={line}>{line}</p>)}
            </div>
          </article>

          {A2_GOETHE_READING_MOCK.teil3.questions.map((question) => (
            <section className="a2-mock-question" key={question.number}>
              <h3>Aufgabe {question.number}</h3>
              <p>{question.question}</p>
              <ChoiceList
                name={`a2-t3-${question.number}`}
                options={question.options}
                value={answers[`q${question.number}`] || ""}
                onChange={(value) => setAnswer(question.number, value)}
              />
            </section>
          ))}
        </section>

        <section className="a2-mock-part a2-mock-teil4">
          <TeilHeading data={A2_GOETHE_READING_MOCK.teil4} />

          <div className="a2-mock-people-sheet">
            <div className="a2-mock-person-row a2-mock-example">
              <div>
                <strong>Beispiel 0</strong>
                <p>{A2_GOETHE_READING_MOCK.teil4.example.person}</p>
              </div>
              <label>
                Anzeige:
                <select value={A2_GOETHE_READING_MOCK.teil4.example.answer} disabled>
                  <option>{A2_GOETHE_READING_MOCK.teil4.example.answer}</option>
                </select>
              </label>
            </div>

            {A2_GOETHE_READING_MOCK.teil4.people.map((item) => (
              <div className="a2-mock-person-row" key={item.number}>
                <div>
                  <strong>Aufgabe {item.number}</strong>
                  <p>{item.person}</p>
                </div>
                <label>
                  Anzeige:
                  <select
                    value={answers[`q${item.number}`] || ""}
                    onChange={(event) => setAnswer(item.number, event.target.value)}
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
            {A2_GOETHE_READING_MOCK.teil4.ads.map((ad) => (
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
      </article>
    </main>
  );
}
