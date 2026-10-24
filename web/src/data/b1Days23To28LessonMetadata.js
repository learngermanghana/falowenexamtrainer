const B1_DAYS23_TO28_METADATA = Object.freeze({
  23: Object.freeze({
    chapter: "7.23",
    title: "Goethe B1 Speaking Mock",
    goal: "Prüfen Sie Ihre B1-Sprechkompetenz in drei vollständigen Goethe-ähnlichen Aufgaben mit einem KI-Prüfer.",
    instruction: "Read the three-part speaking exam guide, then start the AI mock. Confirm your spoken answers as you go. Falowen saves your overall score after all three parts.",
    workbookOnly: false,
  }),
  24: Object.freeze({
    chapter: "8.24",
    title: "Konsum und Nachhaltigkeit",
    goal: "Über Konsumverhalten und Nachhaltigkeit sprechen, Vor- und Nachteile abwägen und umweltbewusste Entscheidungen begründen.",
    instruction: "Open the Grammar notes, then complete Teil 1–4, Ref and Submit. Submit Schreiben and Lesen; Teil 4 · Hören is self-check practice and is not submitted.",
    workbookOnly: false,
  }),
  25: Object.freeze({
    chapter: "8.25",
    title: "Online einkaufen – Rechte und Risiken",
    goal: "Vorteile und Risiken des Online-Shoppings erklären, Verbraucherrechte anwenden und eine begründete Meinung zu Risiken und Verbraucherrechten schreiben.",
    instruction: "Open the Grammar notes, then complete Teil 1–4, Ref and Submit. Submit Schreiben and Lesen; submit the seven-question Hören using the confirmed Day 25 recording.",
    workbookOnly: false,
  }),
  26: Object.freeze({
    chapter: "9.26",
    title: "Reiseprobleme und Lösungen",
    goal: "Auf Reiseprobleme reagieren, passende Hilfe-Anzeigen zuordnen und einen eigenen Forumsbeitrag mit Lösungsvorschlägen schreiben.",
    instruction: "Open the Grammar notes, then complete Teil 1–4, Ref and Submit. Submit Schreiben, Lesen (four matching tasks) and Hören (five true/false statements) using the course recording.",
    workbookOnly: false,
  }),
  27: Object.freeze({
    chapter: "10.27",
    title: "Umweltfreundlich im Alltag",
    goal: "Praktische Maßnahmen für einen umweltfreundlicheren Alltag erklären, Schwierigkeiten abwägen und eine B1-Meinung begründen.",
    instruction: "Open the Grammar notes, then complete Teil 1–4, Ref and Submit. Submit Schreiben and Lesen; Teil 4 · Hören is self-check practice and is not submitted.",
    workbookOnly: false,
  }),
  28: Object.freeze({
    chapter: "10.28",
    title: "Klimafreundlich leben",
    goal: "Klimafreundliche Maßnahmen in Alltag, Verkehr, Konsum und Ernährung erklären und ihre Umsetzbarkeit bewerten.",
    instruction: "Open the Grammar notes, then complete Teil 1–4, Ref and Submit. Submit Schreiben and Lesen; Teil 4 · Hören is self-check practice and is not submitted.",
    workbookOnly: false,
  }),
});

export const getB1Days23To28LessonMetadata = (day) =>
  B1_DAYS23_TO28_METADATA[Number(day)] || null;

export const B1_DAYS23_TO28_LESSON_METADATA = B1_DAYS23_TO28_METADATA;
