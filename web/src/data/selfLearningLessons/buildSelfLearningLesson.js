export const defaultReadingTasks = [
  "Read once for the general idea, not for every unknown word.",
  "Write the main idea in one sentence.",
  "Find 5 useful words or expressions and write your own example sentence.",
  "Write your own opinion in 3–4 sentences.",
];

export const defaultListeningTasks = [
  "Listen once for the general topic.",
  "Listen again and write 3 key points.",
  "Write 2 useful expressions you heard.",
  "Summarise the audio in 4 sentences.",
];

export const makeLesson = ({
  level,
  day,
  chapter,
  title,
  topic,
  heroImage,
  grammarFocus,
  objectives,
  explanation,
  topicQuestions,
  grammarLesson,
  speakingTaskType,
  speakingTopic,
  speakingBuilder,
  writingTaskType,
  writingTopic,
  writingBuilder,
  phrases,
  tasks,
  readingResource,
  listeningResource,
  vocabulary,
}) => ({
  level,
  day,
  chapter,
  title,
  topic,
  heroImage,
  grammarFocus,
  objectives,
  explanation,
  topicQuestions,
  grammarLesson,
  speakingTaskType,
  speakingTopic,
  speakingBuilder,
  writingTaskType,
  writingTopic,
  writingBuilder,
  phrases,
  tasks,
  readingResource,
  listeningResource,
  vocabulary,
});

export const chooseWritingType = (title = "", topic = "") => {
  const text = `${title} ${topic}`.toLowerCase();
  if (/beruf|bewerbung|arbeit|job|praktikum|weiterbildung|termin|beschwerde|anfrage/.test(text)) return "Formal letter / E-Mail";
  if (/kultur|freizeit|reise|angebot|produkt|werbung/.test(text)) return "Review / Recommendation";
  if (/medien|politik|gesellschaft|integration|umwelt|konsum|gesundheit|bildung|technologie|zukunft|migration|wissenschaft/.test(text)) return "Opinion essay / Erörterung";
  return "Opinion essay / Erörterung";
};

export const buildDefaultLesson = ({ level, day, chapter, title, topic }) => {
  const writingTaskType = chooseWritingType(title, topic);
  const formalTask = writingTaskType === "Formal letter / E-Mail";
  const reviewTask = writingTaskType === "Review / Recommendation";

  return makeLesson({
    level,
    day,
    chapter,
    title,
    topic,
    heroImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
    grammarFocus: level === "C1"
      ? "Präzise Argumentation, Redemittel und Transfer auf C1-Niveau"
      : "Klare Struktur, Beispiele und passende Konnektoren auf B2-Niveau",
    objectives: [
      "Ich kann das Thema klar erklären.",
      "Ich kann Gründe und Beispiele nennen.",
      "Ich kann mit Falowen AI üben und meine Antwort verbessern.",
    ],
    explanation: [
      `Dieses ${level}-Thema hilft dir, deine Gedanken strukturiert und mit passenden Beispielen auszudrücken.`,
      "Arbeite zuerst durch die Ideen. Danach übst du Sprechen und Schreiben mit Falowen AI, liest oder hörst einen passenden externen Beitrag und markierst dich selbst.",
    ],
    topicQuestions: [
      `Was weißt du schon über das Thema „${title}“?`,
      "Welche Beispiele aus Alltag, Arbeit, Schule oder Gesellschaft passen dazu?",
      "Welche eigene Meinung kannst du begründen?",
    ],
    grammarLesson: {
      rules: [
        "Beginne mit einer klaren Hauptaussage.",
        "Verbinde deine Ideen mit Begründung, Beispiel und Schlussfolgerung.",
        "Nutze Konnektoren, damit deine Antwort nicht wie einzelne Sätze klingt.",
      ],
      examples: [
        "Ein wichtiger Grund dafür ist, dass ...",
        "Das zeigt sich zum Beispiel daran, dass ...",
        "Zusammenfassend lässt sich sagen, dass ...",
      ],
      miniExercise: `Formuliere drei Sätze zum Thema „${title}“: eine Meinung, eine Begründung und ein Beispiel.`,
    },
    speakingTaskType: "Guided opinion talk",
    speakingTopic: `Sprechen: Erkläre deine Meinung zum Thema „${title}“ und nenne mindestens zwei Beispiele.`,
    speakingBuilder: {
      plan: [
        "Einleitung: Nenne das Thema und deine Grundposition.",
        "Hauptteil: Erkläre 2 Gründe mit Beispielen.",
        "Schluss: Sage, was du persönlich daraus lernst oder empfiehlst.",
      ],
      starters: [
        "Meiner Meinung nach ...",
        "Ein Beispiel dafür ist ...",
        "Besonders wichtig finde ich ...",
      ],
    },
    writingTaskType,
    writingTopic: formalTask
      ? `Schreiben: Verfasse eine formelle E-Mail zum Thema „${title}“. Erkläre dein Anliegen, begründe es und bitte um eine passende Rückmeldung.`
      : reviewTask
        ? `Schreiben: Verfasse eine Bewertung oder Empfehlung zum Thema „${title}“. Beschreibe, bewerte und begründe deine Meinung.`
        : `Schreiben: Verfasse eine Erörterung zum Thema „${title}“. Stelle deine Meinung dar, begründe sie und nenne Beispiele.`,
    writingBuilder: {
      structure: formalTask
        ? [
            "Betreff und höfliche Anrede.",
            "Einleitung: Warum du schreibst.",
            "Hauptteil: Anliegen, Begründung und wichtige Details.",
            "Schluss: Bitte um Rückmeldung und höfliche Grußformel.",
          ]
        : reviewTask
          ? [
              "Einleitung: Was wird bewertet oder empfohlen?",
              "Hauptteil: Beschreibung, positive und kritische Punkte.",
              "Schluss: Empfehlung mit klarer Begründung.",
            ]
          : [
              "Einleitung: Thema vorstellen und Position zeigen.",
              "Hauptteil 1: Erstes Argument mit Beispiel.",
              "Hauptteil 2: Zweites Argument oder Gegenargument.",
              "Schluss: Fazit und kurzer Ausblick.",
            ],
      usefulLines: formalTask
        ? [
            "Sehr geehrte Damen und Herren, ...",
            "Ich wende mich an Sie, weil ...",
            "Aus diesem Grund möchte ich Sie bitten, ...",
            "Über eine Rückmeldung würde ich mich sehr freuen.",
          ]
        : [
            "In der heutigen Gesellschaft spielt ... eine wichtige Rolle.",
            "Dafür spricht vor allem, dass ...",
            "Trotzdem sollte man auch berücksichtigen, dass ...",
            "Aus diesen Gründen bin ich der Ansicht, dass ...",
          ],
    },
    phrases: [
      "Meiner Meinung nach ...",
      "Ein wichtiger Grund dafür ist ...",
      "Zum Beispiel ...",
      "Zusammenfassend lässt sich sagen, dass ...",
    ],
    tasks: {
      speaking: `Sprich 2 Minuten über: ${topic}.`,
      writing: formalTask
        ? `Schreibe eine formelle E-Mail mit 180–220 Wörtern über: ${title}.`
        : `Schreibe 180–220 Wörter über: ${title}.`,
      reading: `Lies einen passenden Text zum Thema ${title} und notiere die wichtigsten Punkte.`,
      listening: `Höre einen Beitrag zum Thema ${title} und fasse ihn zusammen.`,
    },
    readingResource: {
      title: `Welt.de Suche: ${title}`,
      description: "Open Welt.de search and choose one current article connected to today’s topic.",
      url: `https://www.welt.de/suche?q=${encodeURIComponent(title)}`,
      tasks: defaultReadingTasks,
    },
    listeningResource: {
      title: `DW Deutsch lernen / Top-Thema search: ${title}`,
      description: "Choose a short German audio/video connected to today’s topic. DW is usually easier than newspaper audio for B2/C1 practice.",
      url: `https://www.dw.com/de/suche/s-100853?searchNavigationId=9097&item=${encodeURIComponent(title)}`,
      tasks: defaultListeningTasks,
    },
    vocabulary: title.split(/\s+|und|\/|-/).filter((word) => word.length > 3).slice(0, 8),
  });
};
