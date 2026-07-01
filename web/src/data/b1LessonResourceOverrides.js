const B1_RESOURCE_OVERRIDES = Object.freeze({
  1: Object.freeze({
    chapter: "1.1",
    grammarBook: "/campus/course/lesson/B1/1?view=grammar",
    workbook: "/campus/course/lesson/B1/1?view=workbook",
    aiVideo: "https://youtu.be/_mmAtSzWbNo",
  }),
  2: Object.freeze({
    chapter: "1.2",
    grammarBook: "/campus/course/lesson/B1/2?view=grammar",
    workbook: "/campus/course/lesson/B1/2?view=workbook",
    aiVideo: "https://youtu.be/Skl0FjF5JBg",
  }),
  3: Object.freeze({
    chapter: "1.3",
    grammarBook: "/campus/course/lesson/B1/3?view=grammar",
    workbook: "/campus/course/lesson/B1/3?view=workbook",
    aiVideo: "https://youtu.be/n6eCMJRWTy8",
  }),
  4: Object.freeze({
    chapter: "2.4",
    grammarBook: "/campus/course/lesson/B1/4?view=grammar",
    workbook: "/campus/course/lesson/B1/4?view=workbook",
    grammarTopic:
      "Zweiteilige Konnektoren: sowohl ... als auch, nicht nur ... sondern auch, zwar ... aber, einerseits ... andererseits, entweder ... oder, weder ... noch",
    goal:
      "Wohnungsmöglichkeiten und Suchmethoden vergleichen, Vor- und Nachteile abwägen und eine strukturierte B1-Meinung formulieren.",
    instruction:
      "Lies zuerst die Grammatiknotizen zu zweiteiligen Konnektoren. Bearbeite danach alle vier Workbook-Teile. Teil 1 ist Gruppenpraxis; reiche die geforderten Antworten für Schreiben, Lesen und Hören direkt über den Submit-Bereich im Workbook ein.",
  }),
  5: Object.freeze({
    chapter: "2.5",
    grammarBook: "/campus/course/lesson/B1/5?view=grammar",
    workbook: "/campus/course/lesson/B1/5?view=workbook",
    aiVideo: "https://youtu.be/dLzAwzMFGG4",
    grammarTopic:
      "Höfliche Terminvereinbarung: Konjunktiv II mit könnte, würde und wäre sowie indirekte Fragen mit ob, wann, wo und wie",
    goal:
      "Einen Besichtigungstermin höflich vereinbaren, Informationen beim Vermieter erfragen und eine formelle B1-E-Mail schreiben.",
    instruction:
      "Lies zuerst die in-app Grammatiknotizen zur höflichen Terminvereinbarung. Bearbeite danach Teil 1 bis Teil 4 im Workbook. Nutze Ref erst zur Kontrolle und sende deine endgültigen Antworten über den Submit-Tab.",
  }),
  6: Object.freeze({
    chapter: "2.6",
    title: "Leben in der Stadt oder auf dem Land?",
    grammarBook: "/campus/course/lesson/B1/6?view=grammar",
    workbook: "/campus/course/lesson/B1/6?view=workbook",
    grammarTopic:
      "Stadt und Land vergleichen: Komparativ mit als, Gründe mit weil/da/denn, Gegensätze mit obwohl/während und Relativsätze",
    goal:
      "Stadt- und Landleben differenziert vergleichen, Vor- und Nachteile abwägen und eine klare B1-Meinung mit passenden Begründungen formulieren.",
    instruction:
      "Lies zuerst die in-app Grammatiknotizen zum Vergleichen und Begründen. Bearbeite danach alle vier Workbook-Teile. Teil 1 ist Gruppenpraxis; sende deine endgültigen Antworten für Schreiben, Lesen und Hören über den Submit-Tab.",
  }),
  7: Object.freeze({
    chapter: "3.7",
    title: "Fast Food vs. Hausmannskost",
    grammarBook: "/campus/course/lesson/B1/7?view=grammar",
    workbook: "/campus/course/lesson/B1/7?view=workbook",
    aiVideo: "https://youtu.be/y5wqJv8_GMI",
    grammarTopic:
      "Genitiv mit wegen und trotz: Gründe, Gegengründe und Eigenschaften von Ernährung präzise ausdrücken",
    goal:
      "Fast Food, Fertiggerichte und Hausmannskost vergleichen, gesundheitliche Vor- und Nachteile erklären und eine klare B1-Meinung formulieren.",
    instruction:
      "Lies zuerst die in-app Grammatiknotizen zum Genitiv mit wegen und trotz. Bearbeite danach alle vier Workbook-Teile. Teil 1 ist Gruppenpraxis; sende deine endgültigen Antworten für Schreiben, Lesen und Hören über den Submit-Tab.",
  }),
  8: Object.freeze({
    chapter: "3.8",
    title: "Alles für die Gesundheit",
    grammarBook: "/campus/course/lesson/B1/8?view=grammar",
    workbook: "/campus/course/lesson/B1/8?view=workbook",
    aiVideo: "https://youtu.be/_aFuOTSdMb8",
    grammarTopic:
      "Modalverben für Gesundheitstipps: sollte, muss, kann, darf und möchte",
    goal:
      "Über gesunde Ernährung, Bewegung, mentale Gesundheit und Gesundheitsvorsorge sprechen und klare B1-Ratschläge formulieren.",
    instruction:
      "Lies zuerst die in-app Grammatiknotizen zu Modalverben für Gesundheitstipps. Bearbeite danach alle vier Workbook-Teile. Teil 1 ist Gruppenpraxis; sende deine endgültigen Antworten für Schreiben, Lesen und Hören über den Submit-Tab.",
  }),
});

const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

export const getB1LessonResourceOverride = (day) =>
  B1_RESOURCE_OVERRIDES[Number(day)] || null;

export const applyB1LessonResourceOverride = (lesson, day = lesson?.day) => {
  if (!lesson || typeof lesson !== "object") return lesson;
  const resolvedDay = Number(day ?? lesson.day ?? lesson.assignmentDay);
  const override = getB1LessonResourceOverride(resolvedDay);
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

  const resources = [
    ...toArray(lesson.lesen_hören),
    ...toArray(lesson.schreiben_sprechen),
  ];

  resources.forEach((resource) => {
    if (!resource || typeof resource !== "object") return;
    const resourceChapter = String(resource.chapter || lesson.chapter || "").trim();
    if (resourceChapter && resourceChapter !== override.chapter) return;

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
  const dayOne = getB1LessonResourceOverride(1);
  const dayTwo = getB1LessonResourceOverride(2);
  const dayThree = getB1LessonResourceOverride(3);

  b1[1] = {
    ...(b1[1] || {}),
    videoResources: [
      {
        key: "b1-day1-traumwelten-ai-grammar-video",
        chapter: dayOne.chapter,
        title: "B1 Day 1 · Traumwelten · AI grammar video",
        description:
          "AI grammar explanation for Präsens and Perfekt in the topic Traumwelten.",
        url: dayOne.aiVideo,
      },
    ],
  };

  b1[2] = {
    ...(b1[2] || {}),
    videoResources: [
      {
        key: "b1-day2-freunde-fuers-leben-ai-grammar-video",
        chapter: dayTwo.chapter,
        title: "B1 Day 2 · Freunde fürs Leben · AI grammar video",
        description:
          "AI grammar explanation for talking about friendship and past experiences.",
        url: dayTwo.aiVideo,
      },
    ],
  };

  b1[3] = {
    ...(b1[3] || {}),
    videoResources: [
      {
        key: "b1-day3-erfolgsgeschichten-ai-grammar-video",
        chapter: dayThree.chapter,
        title: "B1 Day 3 · Erfolgsgeschichten · AI grammar video",
        description:
          "AI grammar explanation for adjective endings and describing success stories.",
        url: dayThree.aiVideo,
      },
    ],
  };

  return dictionary;
};

export const B1_LESSON_RESOURCE_OVERRIDES = B1_RESOURCE_OVERRIDES;
