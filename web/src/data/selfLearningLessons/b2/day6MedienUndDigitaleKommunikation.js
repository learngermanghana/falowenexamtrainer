import { makeLesson } from "../buildSelfLearningLesson";

const b2Day6MedienUndDigitaleKommunikation = makeLesson({
  level: "B2",
  day: 6,
  chapter: "2.1",
  title: "Medien und digitale Kommunikation",
  topic: "Soziale Medien, Datenschutz und Online-Verhalten",
  heroImage: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
  grammarFocus: "Indirekte Fragen, Meinungsformeln und sachliche Diskussion über digitale Themen",
  objectives: [
    "Ich kann über soziale Medien und digitale Kommunikation sprechen.",
    "Ich kann Vorteile und Nachteile von Online-Kommunikation erklären.",
    "Ich kann indirekte Fragen formulieren und höflich nach Informationen fragen.",
    "Ich kann meine Meinung zu Datenschutz und Online-Verhalten begründen.",
  ],
  explanation: [
    "Digitale Kommunikation gehört heute zum Alltag. Menschen informieren sich online, schreiben Nachrichten, nutzen soziale Medien und teilen persönliche Daten.",
    "Auf B2-Niveau solltest du nicht nur sagen, ob soziale Medien gut oder schlecht sind. Du solltest erklären können, welche Chancen und Risiken es gibt und wie man verantwortungsvoll damit umgeht.",
    "Heute lernst du, indirekte Fragen und Meinungsformeln zu nutzen. Danach übst du Sprechen, nutzt die Schreibtools und trainierst Lesen/Hören mit aktuellen digitalen Themen.",
  ],
  topicQuestions: [
    "Welche sozialen Medien nutzt du am häufigsten und warum?",
    "Welche Vorteile hat digitale Kommunikation im Alltag?",
    "Welche Risiken gibt es beim Teilen persönlicher Daten?",
    "Wie kann man online respektvoll und sicher kommunizieren?",
  ],
  grammarLesson: {
    rules: [
      "Indirekte Fragen klingen höflicher und passen gut zu formellen Situationen: Können Sie mir sagen, ob ...?",
      "Bei indirekten Fragen steht das Verb am Ende: Ich möchte wissen, wie man persönliche Daten besser schützen kann.",
      "Bei Ja/Nein-Fragen nutzt man ob: Ich frage mich, ob soziale Medien Jugendliche stark beeinflussen.",
      "Nutze Meinungsformeln, um deine Position klar zu machen: Meiner Meinung nach ..., Ich bin der Ansicht, dass ..., Aus meiner Sicht ...",
    ],
    examples: [
      "Ich frage mich, ob soziale Medien unsere Konzentration beeinflussen.",
      "Viele Menschen wissen nicht, wie ihre Daten im Internet verwendet werden.",
      "Meiner Meinung nach sollten Nutzer vorsichtiger mit privaten Informationen umgehen.",
      "Aus meiner Sicht hat digitale Kommunikation viele Vorteile, aber auch klare Risiken.",
    ],
    miniExercise: "Schreibe vier indirekte Fragen zum Thema soziale Medien und Datenschutz. Nutze zweimal ob und zweimal ein Fragewort wie wie, warum oder welche.",
  },
  speakingTaskType: "Digital media opinion talk",
  speakingTopic: "Sprechen: Diskutiere Vor- und Nachteile sozialer Medien und erkläre, wie man sich online sicher und respektvoll verhalten kann.",
  speakingBuilder: {
    plan: [
      "Einleitung: Nenne das Thema und deine allgemeine Meinung.",
      "Hauptteil 1: Erkläre zwei Vorteile digitaler Kommunikation.",
      "Hauptteil 2: Erkläre zwei Risiken, zum Beispiel Datenschutz oder Ablenkung.",
      "Schluss: Gib eine Empfehlung für verantwortungsvolles Online-Verhalten.",
    ],
    starters: [
      "Meiner Meinung nach spielen soziale Medien heute eine große Rolle, weil ...",
      "Ein Vorteil ist, dass ...",
      "Ein Risiko besteht darin, dass ...",
      "Ich frage mich oft, ob ...",
      "Aus diesem Grund sollte man online ...",
    ],
  },
  writingTaskType: "Opinion essay / Erörterung",
  writingTopic: "Schreiben: Soziale Medien im Alltag. Erkläre Vorteile, Risiken und deine Meinung zum verantwortungsvollen Umgang mit digitalen Medien.",
  writingBuilder: {
    structure: [
      "Einleitung: Stelle das Thema soziale Medien und digitale Kommunikation vor.",
      "Hauptteil 1: Vorteile wie Information, Kontakt und Lernen.",
      "Hauptteil 2: Risiken wie Datenschutz, Ablenkung und falsche Informationen.",
      "Hauptteil 3: Empfehlungen für verantwortungsvolles Online-Verhalten.",
      "Schluss: Deine persönliche Meinung mit kurzer Begründung.",
    ],
    usefulLines: [
      "Soziale Medien sind aus dem Alltag vieler Menschen kaum noch wegzudenken.",
      "Ein wichtiger Vorteil besteht darin, dass ...",
      "Gleichzeitig sollte man beachten, dass ...",
      "Besonders problematisch ist der Umgang mit persönlichen Daten.",
      "Meiner Meinung nach sollten Nutzer bewusster entscheiden, welche Informationen sie teilen.",
    ],
  },
  phrases: [
    "Meiner Meinung nach ...",
    "Aus meiner Sicht ...",
    "Ich frage mich, ob ...",
    "persönliche Daten schützen",
    "falsche Informationen verbreiten",
    "verantwortungsvoll umgehen mit ...",
    "online kommunizieren",
  ],
  tasks: {
    speaking: "Sprich 2–3 Minuten über soziale Medien, Datenschutz und Online-Verhalten. Nutze mindestens zwei indirekte Fragen und drei Meinungsformeln.",
    writing: "Schreibe 180–220 Wörter: Soziale Medien im Alltag. Erkläre Vorteile, Risiken und deine Meinung.",
    reading: "Lies einen Artikel über soziale Medien, Datenschutz oder digitale Kommunikation. Notiere Hauptaussage, 5 Wörter und deine Meinung.",
    listening: "Höre einen kurzen Beitrag über Medien oder Datenschutz. Fasse ihn in 4 Sätzen zusammen.",
  },
  readingResource: {
    title: "Welt.de Suche: soziale Medien, Datenschutz, digitale Kommunikation",
    description: "Open the search and choose one article about social media, privacy or digital communication. Focus on advantages, risks and useful vocabulary.",
    url: "https://www.welt.de/suche?q=soziale%20Medien%20Datenschutz%20digitale%20Kommunikation",
    tasks: [
      "Write the title of the article you chose.",
      "Write the main idea in one German sentence.",
      "Find 5 useful expressions connected to social media or privacy.",
      "Write 4–5 sentences: What should people do to communicate safely online?",
    ],
  },
  listeningResource: {
    title: "DW Deutsch lernen search: soziale Medien und Datenschutz",
    description: "Choose one short DW audio/video connected to media, online behaviour or privacy. Listen twice and write the key points.",
    url: "https://www.dw.com/de/suche/s-100853?searchNavigationId=9097&item=soziale%20Medien%20Datenschutz",
    tasks: [
      "Listen once and write the topic.",
      "Listen again and write 3 important points.",
      "Write 3 useful media-related expressions you heard.",
      "Record yourself summarising the audio in 60 seconds.",
    ],
  },
  vocabulary: [
    "soziale Medien",
    "Datenschutz",
    "Privatsphäre",
    "Online-Verhalten",
    "digitale Kommunikation",
    "Ablenkung",
    "Information",
    "verantwortungsvoll",
  ],
});

export default b2Day6MedienUndDigitaleKommunikation;
