export const C1_READING = Object.freeze({
  teil1: {
    id: "teil1",
    title: "Teil 1",
    time: "10 Minuten",
    intro:
      "Sie lesen in einer Zeitschrift einen Artikel über ein Unternehmen in der Tourismusbranche. Wählen Sie für jede Lücke (1–6) die richtige Lösung a, b, c oder d.",
    articleTitle: "Ein Pionier des nachhaltigen Reisens",
    segments: [
      {
        before:
          "Das Reiseunternehmen GreenVoyage hat sich in den vergangenen Jahren zu einem der erfolgreichsten Akteure im sanften Tourismus entwickelt. Als der Gründer Thomas Lindner vor über einem Jahrzehnt sein Konzept vorstellte, stieß er in der Branche noch auf erhebliche",
        gap: 1,
        after:
          ". Viele Branchenkenner bezweifelten, dass Urlaubssuchende bereit wären, für umweltfreundliche Unterkünfte und klimaneutrale Anreisen höhere Preise zu zahlen.",
      },
      {
        before:
          "Doch die Entwicklung gab ihm recht: Die Nachfrage nach nachhaltigen Reiseangeboten ist in den letzten Jahren",
        gap: 2,
        after:
          "gestiegen. GreenVoyage setzt dabei konsequent auf transparente Standards. Sämtliche Partnerhotels werden vor Ort eingehend daraufhin überprüft,",
      },
      {
        before: "",
        gap: 3,
        after:
          "sie regionale Wirtschaftskreisläufe unterstützen und erneuerbare Energien nutzen.",
      },
      {
        before:
          "Darüber hinaus legt das Unternehmen großen Wert darauf, die einheimische Bevölkerung aktiv in das Tourismuskonzept einzubinden. Anstatt auf isolierte All-inclusive-Resorts zu setzen, kooperiert Lindner mit lokalen Familienbetrieben. Dieser Ansatz trägt nicht nur zur lokalen Wertschöpfung bei, sondern",
        gap: 4,
        after:
          "den Reisenden auch authentische Einblicke in die jeweilige Kultur.",
      },
      {
        before:
          "Aufgrund des anhaltenden Erfolgs plant GreenVoyage nun, sein Angebot auf weitere Kontinente auszuweiten. Um diesem Wachstum gerecht zu werden, sucht das Unternehmen derzeit nach Investoren, die bereit sind, das Konzept langfristig zu begleiten.",
        gap: 5,
        after:
          "steigen jedoch auch die Anforderungen an die Qualitätssicherung. Damit der gute Ruf der Marke nicht gefährdet wird, darf das rasche Wachstum keinesfalls",
      },
      {
        before: "",
        gap: 6,
        after:
          "der ökologischen Grundsätze erfolgen.",
      },
    ],
    questions: [
      {
        number: 1,
        options: [
          { id: "a", label: "Vorbehalte" },
          { id: "b", label: "Vorfahren" },
          { id: "c", label: "Vorkommnisse" },
          { id: "d", label: "Vorsätze" },
        ],
        answer: "a",
      },
      {
        number: 2,
        options: [
          { id: "a", label: "geringfügig" },
          { id: "b", label: "sprunghaft" },
          { id: "c", label: "zögerlich" },
          { id: "d", label: "beiläufig" },
        ],
        answer: "b",
      },
      {
        number: 3,
        options: [
          { id: "a", label: "inwieweit" },
          { id: "b", label: "weshalb" },
          { id: "c", label: "wohingegen" },
          { id: "d", label: "wiefern" },
        ],
        answer: "a",
      },
      {
        number: 4,
        options: [
          { id: "a", label: "erlischt" },
          { id: "b", label: "entzieht" },
          { id: "c", label: "ermöglicht" },
          { id: "d", label: "erfordert" },
        ],
        answer: "c",
      },
      {
        number: 5,
        options: [
          { id: "a", label: "Demnach" },
          { id: "b", label: "Gleichwohl" },
          { id: "c", label: "Stattdessen" },
          { id: "d", label: "Hierzu" },
        ],
        answer: "b",
      },
      {
        number: 6,
        options: [
          { id: "a", label: "im Hinblick" },
          { id: "b", label: "zu Lasten" },
          { id: "c", label: "in Anbetracht" },
          { id: "d", label: "im Einklang" },
        ],
        answer: "b",
      },
    ],
  },
});

export const C1_FINAL_MOCK_STORAGE_KEY = "falowen-c1-final-mock-v1";
