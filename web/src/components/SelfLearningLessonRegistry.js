import React from "react";
import SelfLearningEditableLessonPage from "./SelfLearningEditableLessonPage";

const makeLesson = ({
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

const defaultReadingTasks = [
  "Read once for the general idea, not for every unknown word.",
  "Write the main idea in one sentence.",
  "Find 5 useful words or expressions and write your own example sentence.",
  "Write your own opinion in 3–4 sentences.",
];

const defaultListeningTasks = [
  "Listen once for the general topic.",
  "Listen again and write 3 key points.",
  "Write 2 useful expressions you heard.",
  "Summarise the audio in 4 sentences.",
];

const chooseWritingType = (title = "", topic = "") => {
  const text = `${title} ${topic}`.toLowerCase();
  if (/beruf|bewerbung|arbeit|job|praktikum|weiterbildung|termin|beschwerde|anfrage/.test(text)) return "Formal letter / E-Mail";
  if (/kultur|freizeit|reise|angebot|produkt|werbung/.test(text)) return "Review / Recommendation";
  if (/medien|politik|gesellschaft|integration|umwelt|konsum|gesundheit|bildung|technologie|zukunft|migration|wissenschaft/.test(text)) return "Opinion essay / Erörterung";
  return "Opinion essay / Erörterung";
};

const buildDefaultLesson = ({ level, day, chapter, title, topic }) => {
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

const C1_DAY_1 = makeLesson({
  level: "C1",
  day: 1,
  chapter: "1.1",
  title: "Ziele und Lernweg",
  topic: "C1-Selbstlernen verstehen und realistische Ziele setzen",
  heroImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1600&q=80",
  grammarFocus: "Strukturgeber, Begründungen und formelle Zielsetzung",
  objectives: [
    "Ich kann meinen persönlichen C1-Lernweg klar erklären.",
    "Ich kann konkrete und messbare Lernziele formulieren.",
    "Ich kann Falowen AI nutzen, um meine Antworten zu verbessern und mich selbst ehrlich zu markieren.",
  ],
  explanation: [
    "C1 bedeutet nicht nur, viele deutsche Wörter zu kennen. Auf C1 musst du Gedanken klar ordnen, Argumente begründen, Beispiele nutzen und deine Sprache bewusst verbessern.",
    "Ein guter C1-Lernweg ist realistisch. Du brauchst tägliche kleine Schritte: Thema verstehen, Ideen sammeln, sprechen oder schreiben, Feedback lesen, verbessern und danach selbst markieren.",
    "Heute geht es darum, nicht aufzugeben. Wenn dein erster AI-Score niedrig ist, ist das kein Problem. Der Score zeigt dir nur, was du als Nächstes verbessern musst.",
  ],
  topicQuestions: [
    "Warum lernst du Deutsch auf C1-Niveau?",
    "Welche Situation ist für dich im Deutschen aktuell am schwierigsten: Sprechen, Schreiben, Lesen oder Hören?",
    "Was möchtest du in 4 Wochen deutlich besser können?",
    "Wie viele Minuten kannst du realistisch jeden Tag lernen?",
  ],
  grammarLesson: {
    rules: [
      "Nutze Strukturgeber, damit deine Antwort einen klaren Lernweg zeigt: zuerst, danach, anschließend, langfristig, abschließend.",
      "Nutze Begründungen, damit dein Ziel nicht oberflächlich klingt: weil, da, deshalb, aus diesem Grund, dadurch.",
      "Formuliere Ziele messbar: nicht nur „Ich will besser sprechen“, sondern „Ich will 2 Minuten ohne lange Pausen über ein C1-Thema sprechen.“",
    ],
    examples: [
      "Zunächst möchte ich meine größte Schwäche erkennen, danach werde ich gezielt mit Falowen AI üben.",
      "Ich lerne Deutsch auf C1-Niveau, weil ich mich in komplexen Situationen präziser ausdrücken möchte.",
      "In den nächsten vier Wochen möchte ich meine Schreibstruktur verbessern, indem ich jeden zweiten Tag einen kurzen Meinungsaufsatz schreibe.",
    ],
    miniExercise: "Schreibe drei Sätze: 1) dein C1-Ziel, 2) warum es wichtig ist, 3) wie du es in den nächsten 4 Wochen trainierst.",
  },
  speakingTaskType: "Personal learning talk",
  speakingTopic: "Sprechen: Erkläre deinen C1-Lernweg. Warum lernst du C1, was ist schwierig und was willst du in 4 Wochen verbessern?",
  speakingBuilder: {
    plan: [
      "Satz 1–2: Stelle dich kurz vor und nenne dein C1-Ziel.",
      "Satz 3–5: Erkläre, warum du C1 brauchst: Arbeit, Studium, Alltag, Prüfung oder Integration.",
      "Satz 6–8: Beschreibe deine größte Schwierigkeit und wie du sie üben wirst.",
      "Schluss: Sage, was du nach 4 Wochen besser können möchtest.",
    ],
    starters: [
      "Ich lerne Deutsch auf C1-Niveau, weil ...",
      "Eine besondere Herausforderung für mich ist ...",
      "Um mich zu verbessern, werde ich ...",
      "In vier Wochen möchte ich in der Lage sein, ...",
    ],
  },
  writingTaskType: "Reflective opinion essay / Lernplan",
  writingTopic: "Schreiben: Mein C1-Lernweg. Beschreibe deinen Ausgangspunkt, deine Motivation, deine größte Schwierigkeit und deinen konkreten 4-Wochen-Plan.",
  writingBuilder: {
    structure: [
      "Einleitung: Warum C1 für dich wichtig ist.",
      "Hauptteil 1: Deine aktuelle Ausgangssituation und größte Schwierigkeit.",
      "Hauptteil 2: Dein konkreter Lernplan mit Falowen AI und Selbstmarkierung.",
      "Schluss: Dein realistisches Ziel für die nächsten 4 Wochen.",
    ],
    usefulLines: [
      "Mein Ziel besteht darin, meine Deutschkenntnisse nicht nur zu erweitern, sondern gezielt anzuwenden.",
      "Besonders wichtig ist für mich, dass ich Feedback nicht als Kritik, sondern als Lernhilfe verstehe.",
      "Durch regelmäßige Selbstreflexion kann ich besser erkennen, welche Bereiche ich wiederholen muss.",
      "Langfristig möchte ich sicherer, präziser und strukturierter kommunizieren.",
    ],
  },
  phrases: [
    "zunächst / danach / anschließend / langfristig / abschließend",
    "aus diesem Grund / dadurch / deshalb / infolgedessen",
    "Mein Ziel besteht darin, ...",
    "Ich möchte erreichen, dass ...",
    "Eine realistische Methode wäre, ...",
  ],
  tasks: {
    speaking: "Sprich 90–120 Sekunden über deinen C1-Lernweg. Nutze mindestens 4 Strukturgeber und nenne ein konkretes 4-Wochen-Ziel.",
    writing: "Schreibe 180–220 Wörter: Mein C1-Lernweg: Ausgangspunkt, Motivation und konkreter Plan.",
    reading: "Lies einen Artikel über Lernen, Bildung oder Selbstorganisation. Notiere Hauptaussage, 5 Wörter und deine Meinung.",
    listening: "Höre einen kurzen Beitrag über Lernen oder Bildung. Fasse ihn in 4 Sätzen zusammen und notiere 3 Redemittel.",
  },
  readingResource: {
    title: "Welt.de Suche: Lernen, Bildung, Selbstorganisation",
    description: "Open the search and choose one article about learning, education or self-organisation. Do not try to understand every word; focus on the main idea.",
    url: "https://www.welt.de/suche?q=Lernen%20Bildung%20Selbstorganisation",
    tasks: [
      "Write the title of the article you chose.",
      "Write the main idea in one German sentence.",
      "Copy 5 useful expressions and write your own example sentence for each.",
      "Write 4–5 sentences: What can a C1 learner learn from this article?",
    ],
  },
  listeningResource: {
    title: "DW Deutsch lernen search: Lernen und Bildung",
    description: "Choose one short DW audio/video connected to learning or education. Listen twice: first for the idea, second for details.",
    url: "https://www.dw.com/de/suche/s-100853?searchNavigationId=9097&item=Lernen%20Bildung",
    tasks: [
      "Listen once and write the topic.",
      "Listen again and write 3 key points.",
      "Write 3 useful words or phrases you heard.",
      "Record yourself summarising the audio in 60 seconds.",
    ],
  },
  vocabulary: ["Lernziel", "Lernweg", "Selbstreflexion", "Fortschritt", "Rückmeldung", "Ausgangspunkt", "Verbesserung", "realistisch"],
});

const c1Days = [
  C1_DAY_1,
  ...[
    [2, "1.2", "Kultur und Identität", "Kulturelle Prägung, Zugehörigkeit und Selbstverständnis"],
    [3, "1.3", "Medien und Informationskompetenz", "Nachrichten, Quellenkritik und digitale Verantwortung"],
    [4, "1.4", "Beziehungen und Teamarbeit", "Kommunikation, Konflikte und Zusammenarbeit"],
    [5, "1.5", "Berufliche Entwicklung", "Karriere, Weiterbildung und berufliche Ziele"],
    [6, "2.1", "Gesundheit und Lebensstil", "Balance, Prävention und gesellschaftliche Gesundheit"],
    [7, "2.2", "Reisen und Nachhaltigkeit", "Mobilität, Tourismus und Verantwortung"],
    [8, "2.3", "Wohnen und Stadtentwicklung", "Wohnraum, Infrastruktur und Lebensqualität"],
    [9, "2.4", "Konsum und Werbung", "Kaufentscheidungen, Werbung und Verantwortung"],
    [10, "2.5", "Integration und Gesellschaft", "Teilhabe, Sprache und gesellschaftlicher Zusammenhalt"],
    [11, "3.1", "Engagement und Ehrenamt", "Freiwilligenarbeit und soziale Verantwortung"],
    [12, "3.2", "Freizeit und Kultur", "Kulturelle Angebote, Erholung und gesellschaftliche Bedeutung"],
    [13, "3.3", "Mehrsprachigkeit", "Sprachenlernen, Identität und Kommunikation"],
    [14, "3.4", "Innovation und Zukunft", "Technologische Entwicklung und gesellschaftlicher Wandel"],
    [15, "3.5", "Bildung und lebenslanges Lernen", "Lernen, Weiterbildung und Chancengleichheit"],
    [16, "4.1", "Technologie im Alltag", "Digitale Werkzeuge, Abhängigkeit und praktische Nutzung"],
    [17, "4.2", "Umwelt und Verantwortung", "Nachhaltigkeit, Klima und persönliches Handeln"],
    [18, "4.3", "Gesellschaft und Zusammenhalt", "Gemeinschaft, Konflikte und Solidarität"],
    [19, "4.4", "Arbeit der Zukunft", "Digitalisierung, neue Kompetenzen und Arbeitsmodelle"],
    [20, "4.5", "Digitale Gesundheit", "Gesundheitsapps, Datenschutz und Chancen"],
    [21, "5.1", "Migration und Teilhabe", "Migrationserfahrungen, Sprache und Chancen"],
    [22, "5.2", "Politik und Mitbestimmung", "Demokratie, Verantwortung und Beteiligung"],
    [23, "5.3", "Freizeit und Work-Life-Balance", "Erholung, Grenzen und Lebensqualität"],
    [24, "5.4", "Mobilität und Infrastruktur", "Verkehr, Planung und öffentlicher Raum"],
    [25, "5.5", "Wissenschaft und Forschung", "Forschung, Fortschritt und gesellschaftlicher Nutzen"],
    [26, "6.1", "Nachhaltiger Konsum", "Kaufverhalten, Ressourcen und Verantwortung"],
    [27, "6.2", "Digitalisierung und Verwaltung", "Online-Services, Bürokratie und Zugang"],
    [28, "6.3", "Review und Transfer", "C1-Themen wiederholen und auf neue Aufgaben übertragen"],
  ].map(([day, chapter, title, topic]) => buildDefaultLesson({ level: "C1", day, chapter, title, topic })),
];

const b2Days = [
  [1, "1.1", "Persönliche Identität und Selbstverständnis", "Über sich selbst, Werte und persönliche Entwicklung sprechen"],
  [2, "1.2", "Alltag und Zeitmanagement", "Routinen, Prioritäten und Produktivität beschreiben"],
  [3, "1.3", "Arbeit und Beruf", "Berufliche Erfahrungen, Erwartungen und Zusammenarbeit"],
  [4, "1.4", "Bildung und Lernen", "Lernstrategien, Prüfungen und Weiterbildung"],
  [5, "1.5", "Gesundheit und Wohlbefinden", "Stress, Balance und gesunde Gewohnheiten"],
  [6, "2.1", "Medien und digitale Kommunikation", "Soziale Medien, Datenschutz und Online-Verhalten"],
  [7, "2.2", "Umwelt und Nachhaltigkeit", "Klimaschutz, Konsum und Alltagshandeln"],
  [8, "2.3", "Reisen und Mobilität", "Transport, Urlaub und nachhaltige Entscheidungen"],
  [9, "2.4", "Wohnen und Nachbarschaft", "Wohnformen, Mietprobleme und Zusammenleben"],
  [10, "2.5", "Konsum und Geld", "Kaufentscheidungen, Budget und Werbung"],
  [11, "3.1", "Gesellschaft und Integration", "Sprache, Teilhabe und Zusammenleben"],
  [12, "3.2", "Kultur und Freizeit", "Hobbys, kulturelle Angebote und persönliche Interessen"],
].map(([day, chapter, title, topic]) => buildDefaultLesson({ level: "B2", day, chapter, title, topic }));

export const SELF_LEARNING_LESSONS = {
  B2: b2Days,
  C1: c1Days,
};

const lessonKey = (level, day) => `${String(level || "").toUpperCase()}-${Number(day || 0)}`;

const componentRegistry = Object.fromEntries(
  Object.entries(SELF_LEARNING_LESSONS).flatMap(([level, lessons]) =>
    lessons.map((lesson) => [lessonKey(level, lesson.day), () => <SelfLearningEditableLessonPage lesson={lesson} />])
  )
);

export const getSelfLearningLessonComponent = (level, day) => componentRegistry[lessonKey(level, day)] || null;

export default getSelfLearningLessonComponent;
