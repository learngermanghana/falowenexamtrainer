const route = (day, view) => `/campus/course/lesson/B1/${day}?view=${view}`;
const doneWorkbook = (day) => `${route(day, "workbook")}&radio=done`;

const B1_RESOURCE_OVERRIDES = Object.freeze({
  1: Object.freeze({ chapter: "1.1", grammarBook: route(1, "grammar"), workbook: route(1, "workbook"), aiVideo: "https://youtu.be/_mmAtSzWbNo" }),
  2: Object.freeze({ chapter: "1.2", grammarBook: route(2, "grammar"), workbook: route(2, "workbook"), aiVideo: "https://youtu.be/Skl0FjF5JBg" }),
  3: Object.freeze({ chapter: "1.3", grammarBook: route(3, "grammar"), workbook: route(3, "workbook"), aiVideo: "https://youtu.be/n6eCMJRWTy8" }),
  4: Object.freeze({
    chapter: "2.4",
    grammarBook: route(4, "grammar"),
    workbook: route(4, "workbook"),
    grammarTopic: "Zweiteilige Konnektoren: sowohl ... als auch, nicht nur ... sondern auch, zwar ... aber, einerseits ... andererseits, entweder ... oder, weder ... noch",
    goal: "Wohnungsmöglichkeiten und Suchmethoden vergleichen, Vor- und Nachteile abwägen und eine strukturierte B1-Meinung formulieren.",
    instruction: "Lies zuerst die Grammatiknotizen zu zweiteiligen Konnektoren. Bearbeite danach alle vier Workbook-Teile und sende die geforderten Antworten über den Submit-Bereich.",
  }),
  5: Object.freeze({
    chapter: "2.5",
    grammarBook: route(5, "grammar"),
    workbook: route(5, "workbook"),
    aiVideo: "https://youtu.be/dLzAwzMFGG4",
    grammarTopic: "Höfliche Terminvereinbarung: Konjunktiv II und indirekte Fragen",
    goal: "Einen Besichtigungstermin höflich vereinbaren und eine formelle B1-E-Mail schreiben.",
    instruction: "Lies zuerst die in-app Grammatiknotizen. Bearbeite danach Teil 1 bis Teil 4 und sende deine endgültigen Antworten über den Submit-Tab.",
  }),
  6: Object.freeze({
    chapter: "2.6",
    title: "Leben in der Stadt oder auf dem Land?",
    grammarBook: route(6, "grammar"),
    workbook: route(6, "workbook"),
    grammarTopic: "Stadt und Land vergleichen: Komparativ, Gründe, Gegensätze und Relativsätze",
    goal: "Stadt- und Landleben vergleichen und eine klare B1-Meinung formulieren.",
    instruction: "Lies zuerst die Grammatiknotizen. Bearbeite danach alle vier Workbook-Teile und sende deine Antworten über den Submit-Tab.",
  }),
  7: Object.freeze({
    chapter: "3.7",
    title: "Fast Food vs. Hausmannskost",
    grammarBook: route(7, "grammar"),
    workbook: route(7, "workbook"),
    aiVideo: "https://youtu.be/xky4ziUJIis",
    grammarTopic: "Genitiv mit wegen und trotz",
    goal: "Fast Food und Hausmannskost vergleichen und eine klare B1-Meinung formulieren.",
    instruction: "Lies zuerst die Grammatiknotizen. Bearbeite danach alle vier Workbook-Teile und sende deine Antworten über den Submit-Tab.",
  }),
  8: Object.freeze({
    chapter: "3.8",
    title: "Alles für die Gesundheit",
    grammarBook: route(8, "grammar"),
    workbook: route(8, "workbook"),
    aiVideo: "https://youtu.be/_aFuOTSdMb8",
    grammarTopic: "Modalverben für Gesundheitstipps",
    goal: "Über Gesundheit sprechen und klare B1-Ratschläge formulieren.",
    instruction: "Lies zuerst die Grammatiknotizen. Bearbeite danach alle vier Workbook-Teile und sende deine Antworten über den Submit-Tab.",
  }),
  9: Object.freeze({
    chapter: "3.9",
    title: "Work-Life-Balance im modernen Arbeitsumfeld",
    grammarBook: route(9, "grammar"),
    workbook: route(9, "workbook"),
    grammarTopic: "Ziele, Methoden, Alternativen und Gegensätze",
    goal: "Über Arbeitsdruck, flexible Arbeitsmodelle und persönliche Grenzen sprechen.",
    instruction: "Lies zuerst die Grammatiknotizen. Bearbeite Teil 1 bis Teil 4; Teil 4 ist Selbstkontrolle. Sende nur Schreiben und Lesen.",
  }),
  10: Object.freeze({
    chapter: "4.10",
    title: "Digitale Auszeit und Selbstfürsorge",
    grammarBook: route(10, "grammar"),
    workbook: route(10, "workbook"),
    grammarTopic: "Vergleiche und Wirkungen mit Komparativ, Superlativ und je ... desto",
    goal: "Über digitale Gewohnheiten und Digital-Detox-Strategien sprechen.",
    instruction: "Lies zuerst die Grammatiknotizen. Bearbeite Teil 1 bis Teil 4; Teil 4 ist Selbstkontrolle. Sende nur Schreiben und Lesen.",
  }),
  12: Object.freeze({
    chapter: "4.12",
    title: "Abenteuer in der Natur",
    grammarBook: route(12, "grammar"),
    workbook: doneWorkbook(12),
    grammarTopic: "Natur-Abenteuer erzählen: Zeitangaben, Perfekt/Präteritum, Nebensätze und beschreibende Adjektive",
    goal: "Ein beeindruckendes Natur-Abenteuer strukturiert erzählen, Herausforderungen beschreiben und Erfahrungen bewerten.",
    instruction: "Lies zuerst die in-app Grammatiknotizen. Bearbeite danach Teil 1 bis Teil 4 im Workbook. Reiche Schreiben, Lesen und Hören über den Submit-Tab ein.",
  }),
  13: Object.freeze({
    chapter: "4.13",
    title: "Eigene Filmkritik schreiben",
    grammarBook: route(13, "grammar"),
    workbook: doneWorkbook(13),
    grammarTopic: "Filmkritik schreiben: Passiv, Bewertungsadjektive, Nebensätze und Empfehlungen mit Konjunktiv II",
    goal: "Einen Film strukturiert beschreiben, bewerten und eine klare Empfehlung formulieren.",
    instruction: "Lies zuerst die in-app Grammatiknotizen. Bearbeite danach Teil 1 bis Teil 4 im Workbook. Reiche Schreiben, Lesen und Hören über den Submit-Tab ein.",
  }),
  14: Object.freeze({
    chapter: "5.14",
    title: "Traditionelles vs. digitales Lernen",
    grammarBook: route(14, "grammar"),
    workbook: doneWorkbook(14),
    grammarTopic: "Lernmethoden vergleichen: während, hingegen, einerseits ... andererseits, Nebensätze und formelle Absage",
    goal: "Traditionelles und digitales Lernen vergleichen, Vor- und Nachteile abwägen und eine kurze formelle E-Mail schreiben.",
    instruction: "Lies zuerst die in-app Grammatiknotizen. Bearbeite danach Teil 1 bis Teil 4 im Workbook. Reiche Schreiben, Lesen und Hören über den Submit-Tab ein.",
  }),
  16: Object.freeze({
    chapter: "5.16",
    title: "Prüfungsangst und Stressbewältigung",
    grammarBook: route(16, "grammar"),
    workbook: doneWorkbook(16),
    grammarTopic: "Prüfungsangst erklären: weil, dass, wenn, damit, Infinitiv mit zu, Modalverben und Ratschläge",
    goal: "Ursachen und Symptome von Prüfungsangst beschreiben, Strategien zur Stressbewältigung erklären und eine B1-Meinung schreiben.",
    instruction: "Lies zuerst die in-app Grammatiknotizen. Bearbeite danach Teil 1 bis Teil 4 im Workbook. Reiche Schreiben, Lesen und Hören über den Submit-Tab ein.",
  }),
  19: Object.freeze({
    chapter: "6.19",
    title: "Das Vorstellungsgespräch",
    grammarBook: route(19, "grammar"),
    workbook: route(19, "workbook"),
    aiVideo: "https://youtu.be/ha-uyeX2aVw?si=21xSaYQZVyH2ha2q",
    grammarTopic: "Höflich und professionell sprechen: Konjunktiv II, Sie-Form und Begründungen",
    goal: "Sich im Vorstellungsgespräch vorstellen und eine klare B1-Meinung formulieren.",
    instruction: "Lies zuerst die Grammatiknotizen und bearbeite danach alle vier Workbook-Teile.",
  }),
  20: Object.freeze({
    chapter: "6.20",
    title: "Wie wird man …?",
    grammarBook: "",
    workbook: doneWorkbook(20),
    grammarTopic: "Ausbildung und Qualifikationen: Bildungswege, Berufserfahrung, Chancen und Herausforderungen",
    goal: "Über Ausbildung, Qualifikationen und Karrierewege strukturiert sprechen.",
    instruction: "Open the in-app workbook and complete Teil 1, Teil 2, Teil 3, Teil 4, Ref and Submit. Submit only Schreiben and Lesen.",
  }),
  21: Object.freeze({
    chapter: "7.21",
    title: "Lebensformen heute",
    grammarBook: route(21, "grammar"),
    workbook: "/campus/course/lesson/B1/21?view=workbook&radio=done",
    grammarTopic: "Vor- und Nachteile abwägen: weil, obwohl, während und zweiteilige Konnektoren",
    goal: "Familie, Wohngemeinschaft, Singleleben und neue Lebensformen vergleichen.",
    instruction: "Open the in-app workbook and complete Teil 1, Teil 2, Teil 3, Teil 4, Ref and Submit. Submit Schreiben, Lesen and Hören.",
  }),
  22: Object.freeze({ chapter: "7.22", workbook: doneWorkbook(22) }),
  23: Object.freeze({ chapter: "7.23", workbook: route(23, "workbook") }),
  24: Object.freeze({ chapter: "8.24", workbook: route(24, "workbook") }),
  25: Object.freeze({ chapter: "8.25", workbook: route(25, "workbook") }),
  26: Object.freeze({ chapter: "9.26", workbook: route(26, "workbook") }),
  27: Object.freeze({ chapter: "10.27", workbook: route(27, "workbook") }),
  28: Object.freeze({ chapter: "10.28", workbook: route(28, "workbook") }),
});

const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

export const getB1LessonResourceOverride = (day) => B1_RESOURCE_OVERRIDES[Number(day)] || null;

export const applyB1LessonResourceOverride = (lesson, day = lesson?.day) => {
  if (!lesson || typeof lesson !== "object") return lesson;
  const override = getB1LessonResourceOverride(Number(day ?? lesson.day ?? lesson.assignmentDay));
  if (!override) return lesson;

  lesson.grammarbook_link = override.grammarBook;
  lesson.grammar_link = override.grammarBook;
  lesson.grammarPage = override.grammarBook;
  lesson.workbook_link = override.workbook;
  lesson.workbookRoute = override.workbook;
  if (override.title) lesson.topic = override.title;
  if (override.grammarTopic) lesson.grammar_topic = override.grammarTopic;
  if (override.goal) lesson.goal = override.goal;
  if (override.instruction) lesson.instruction = override.instruction;
  if (override.aiVideo) {
    lesson.ai_grammar_video = override.aiVideo;
    lesson.aiGrammarVideo = override.aiVideo;
  }

  [...toArray(lesson.lesen_hören), ...toArray(lesson.schreiben_sprechen)].forEach((resource) => {
    if (!resource || typeof resource !== "object") return;
    const chapter = String(resource.chapter || lesson.chapter || "").trim();
    if (chapter && chapter !== override.chapter) return;
    resource.grammarbook_link = override.grammarBook;
    resource.grammar_link = override.grammarBook;
    resource.grammarPage = override.grammarBook;
    resource.workbook_link = override.workbook;
    resource.workbookRoute = override.workbook;
    if (override.aiVideo) {
      resource.ai_grammar_video = override.aiVideo;
      resource.aiGrammarVideo = override.aiVideo;
    }
  });
  return lesson;
};

export const applyB1LessonVideoOverrides = (dictionary = {}) => {
  const b1 = dictionary.B1 || (dictionary.B1 = {});
  [1, 2, 3].forEach((day) => {
    const item = getB1LessonResourceOverride(day);
    b1[day] = {
      ...(b1[day] || {}),
      videoResources: [{
        key: `b1-day${day}-ai-grammar-video`,
        chapter: item.chapter,
        title: `B1 Day ${day} · AI grammar video`,
        description: "AI grammar explanation for this B1 lesson.",
        url: item.aiVideo,
      }],
    };
  });
  return dictionary;
};

export const B1_LESSON_RESOURCE_OVERRIDES = B1_RESOURCE_OVERRIDES;
