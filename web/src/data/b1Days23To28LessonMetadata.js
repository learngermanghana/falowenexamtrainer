const B1_DAYS23_TO28_METADATA = Object.freeze({
  23: Object.freeze({
    chapter: "7.23",
    title: "Erstes Date – Typische Situationen",
    goal: "Über typische Situationen beim ersten Date sprechen, Verhalten und Höflichkeit bewerten und eine klare B1-Meinung formulieren.",
    instruction: "Open the in-app workbook and complete the available Teil 1–4, Ref and Submit sections. Submit the required writing and reading answers.",
    workbookOnly: true,
  }),
  24: Object.freeze({
    chapter: "8.24",
    title: "Konsum und Nachhaltigkeit",
    goal: "Über Konsumverhalten und Nachhaltigkeit sprechen, Vor- und Nachteile abwägen und umweltbewusste Entscheidungen begründen.",
    instruction: "Open the in-app workbook and complete Teil 1–4, Ref and Submit. Submit the required assignment answers through the Submit tab.",
    workbookOnly: true,
  }),
  25: Object.freeze({
    chapter: "8.25",
    title: "Online einkaufen – Rechte und Risiken",
    goal: "Vorteile und Risiken des Online-Shoppings erklären, Verbraucherrechte anwenden und formell auf Probleme reagieren.",
    instruction: "Open the in-app workbook and complete Teil 1–4, Ref and Submit. Submit the required writing and reading answers through the Submit tab.",
    workbookOnly: true,
  }),
  26: Object.freeze({
    chapter: "9.26",
    title: "Reiseprobleme und Lösungen",
    goal: "Typische Reiseprobleme beschreiben, passende Lösungen vorschlagen und Beschwerden oder Reaktionen klar formulieren.",
    instruction: "Open the in-app workbook and complete Teil 1–4, Ref and Submit. Submit the required assignment answers through the Submit tab.",
    workbookOnly: true,
  }),
  27: Object.freeze({
    chapter: "10.27",
    title: "Umweltfreundlich im Alltag",
    goal: "Praktische Maßnahmen für einen umweltfreundlicheren Alltag erklären, Schwierigkeiten abwägen und eine B1-Meinung begründen.",
    instruction: "Open the in-app workbook and complete Teil 1–4, Ref and Submit. Submit the required assignment answers through the Submit tab.",
    workbookOnly: true,
  }),
  28: Object.freeze({
    chapter: "10.28",
    title: "Klimafreundlich leben",
    goal: "Klimafreundliche Maßnahmen in Alltag, Verkehr, Konsum und Ernährung erklären und ihre Umsetzbarkeit bewerten.",
    instruction: "Open the in-app workbook and complete Teil 1–4, Ref and Submit. Submit the required assignment answers through the Submit tab.",
    workbookOnly: true,
  }),
});

export const getB1Days23To28LessonMetadata = (day) =>
  B1_DAYS23_TO28_METADATA[Number(day)] || null;

export const B1_DAYS23_TO28_LESSON_METADATA = B1_DAYS23_TO28_METADATA;
