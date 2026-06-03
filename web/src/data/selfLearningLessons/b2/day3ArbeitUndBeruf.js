import { makeLesson } from "../buildSelfLearningLesson";

const b2Day3ArbeitUndBeruf = makeLesson({
  level: "B2",
  day: 3,
  chapter: "1.3",
  title: "Arbeit und Beruf",
  topic: "Berufliche Erfahrungen, Erwartungen und Zusammenarbeit",
  heroImage: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80",
  grammarFocus: "Konjunktiv II für höfliche Vorschläge, berufliche Wünsche und realistische Empfehlungen",
  objectives: [
    "Ich kann über berufliche Erfahrungen und Erwartungen sprechen.",
    "Ich kann eine Herausforderung am Arbeitsplatz beschreiben und eine Lösung vorschlagen.",
    "Ich kann höfliche Vorschläge mit Konjunktiv II formulieren.",
    "Ich kann eine formelle E-Mail zu einem beruflichen Anliegen planen und verbessern.",
  ],
  explanation: [
    "Das Thema Arbeit und Beruf kommt in B2-Prüfungen häufig vor, weil man dabei Erfahrungen, Wünsche, Probleme und Lösungen beschreiben muss.",
    "Auf B2-Niveau reicht es nicht, nur zu sagen: Ich arbeite gern. Du solltest erklären können, was dir im Beruf wichtig ist, welche Herausforderungen entstehen und wie man professionell reagieren kann.",
    "Heute lernst du, höfliche Vorschläge und berufliche Erwartungen zu formulieren. Danach übst du Sprechen, nutzt die Schreibtools und markierst deinen Fortschritt selbst.",
  ],
  topicQuestions: [
    "Welche berufliche Erfahrung hast du bereits gemacht oder möchtest du machen?",
    "Was ist dir bei einer guten Arbeitsstelle besonders wichtig?",
    "Welche Probleme können in einem Team entstehen?",
    "Wie kann man berufliche Kritik höflich und professionell ausdrücken?",
  ],
  grammarLesson: {
    rules: [
      "Der Konjunktiv II macht Vorschläge höflicher: Ich würde vorschlagen, dass ...",
      "Für Empfehlungen kannst du verwenden: Man könnte ..., Es wäre sinnvoll, ..., Ich würde empfehlen, ...",
      "Bei beruflichen Anliegen klingt direkte Kritik oft zu hart. Besser ist eine höfliche Formulierung mit Begründung.",
      "Nach 'dass' steht das konjugierte Verb am Ende: Ich würde vorschlagen, dass wir die Aufgaben klarer verteilen.",
    ],
    examples: [
      "Ich würde vorschlagen, dass wir die Aufgaben im Team besser planen.",
      "Es wäre sinnvoll, regelmäßige kurze Besprechungen einzuführen.",
      "Man könnte die Kommunikation verbessern, indem alle wichtigen Informationen schriftlich festgehalten werden.",
      "Ich würde gern mehr Verantwortung übernehmen, weil ich mich beruflich weiterentwickeln möchte.",
    ],
    miniExercise: "Formuliere vier höfliche berufliche Vorschläge. Nutze: Ich würde vorschlagen ..., Es wäre sinnvoll ..., Man könnte ..., Ich würde empfehlen ...",
  },
  speakingTaskType: "Workplace problem and solution talk",
  speakingTopic: "Sprechen: Beschreibe eine berufliche Herausforderung, erkläre die Ursache und schlage eine höfliche, realistische Lösung vor.",
  speakingBuilder: {
    plan: [
      "Einleitung: Beschreibe kurz die berufliche Situation oder Herausforderung.",
      "Hauptteil 1: Erkläre, warum das Problem entsteht.",
      "Hauptteil 2: Nenne eine höfliche Lösung mit Konjunktiv II.",
      "Schluss: Sage, warum diese Lösung für das Team oder die Firma hilfreich wäre.",
    ],
    starters: [
      "Eine berufliche Herausforderung, die häufig vorkommt, ist ...",
      "Das Problem entsteht oft, weil ...",
      "Ich würde vorschlagen, dass ...",
      "Es wäre sinnvoll, wenn ...",
      "Diese Lösung wäre hilfreich, weil ...",
    ],
  },
  writingTaskType: "Formal letter / E-Mail",
  writingTopic: "Schreiben: Verfasse eine formelle E-Mail zu einem beruflichen Anliegen. Erkläre die Situation, begründe dein Anliegen und bitte höflich um eine Rückmeldung oder Lösung.",
  writingBuilder: {
    structure: [
      "Betreff: Kurzer und klarer Grund der E-Mail.",
      "Anrede: Sehr geehrte Damen und Herren / Sehr geehrte Frau ...",
      "Einleitung: Warum du schreibst.",
      "Hauptteil: Beschreibe die Situation, erkläre das Problem und begründe dein Anliegen.",
      "Vorschlag/Bitte: Formuliere höflich, was du möchtest.",
      "Schluss: Bitte um Rückmeldung und höfliche Grußformel.",
    ],
    usefulLines: [
      "Sehr geehrte Damen und Herren,",
      "ich wende mich an Sie, weil ...",
      "In letzter Zeit ist mir aufgefallen, dass ...",
      "Aus diesem Grund würde ich vorschlagen, dass ...",
      "Über eine kurze Rückmeldung würde ich mich sehr freuen.",
      "Mit freundlichen Grüßen",
    ],
  },
  phrases: [
    "Ich würde vorschlagen, dass ...",
    "Es wäre sinnvoll, wenn ...",
    "Man könnte ...",
    "Aus diesem Grund ...",
    "berufliche Erfahrung sammeln",
    "Verantwortung übernehmen",
    "im Team zusammenarbeiten",
  ],
  tasks: {
    speaking: "Sprich 2–3 Minuten über eine berufliche Herausforderung. Nutze mindestens drei höfliche Vorschläge mit Konjunktiv II.",
    writing: "Schreibe eine formelle E-Mail mit 180–220 Wörtern zu einem beruflichen Anliegen. Nutze höfliche Vorschläge und klare Begründungen.",
    reading: "Lies einen Artikel über Arbeit, Beruf, Teamarbeit oder Fachkräftemangel. Notiere Hauptaussage, 5 Wörter und deine Meinung.",
    listening: "Höre einen kurzen Beitrag über Arbeit oder Beruf. Fasse ihn in 4 Sätzen zusammen und notiere 3 berufliche Redemittel.",
  },
  readingResource: {
    title: "Welt.de Suche: Arbeit, Beruf, Teamarbeit",
    description: "Open the search and choose one article about work, career or teamwork. Focus on the main idea and professional vocabulary.",
    url: "https://www.welt.de/suche?q=Arbeit%20Beruf%20Teamarbeit",
    tasks: [
      "Write the title of the article you chose.",
      "Write the main idea in one German sentence.",
      "Find 5 useful expressions connected to work or teamwork.",
      "Write 4–5 sentences: What problem or solution from the article is important for workers?",
    ],
  },
  listeningResource: {
    title: "DW Deutsch lernen search: Arbeit und Beruf",
    description: "Choose one short DW audio/video connected to work or career. Listen twice and focus on the key points.",
    url: "https://www.dw.com/de/suche/s-100853?searchNavigationId=9097&item=Arbeit%20Beruf",
    tasks: [
      "Listen once and write the topic.",
      "Listen again and write 3 important points.",
      "Write 3 useful work-related expressions you heard.",
      "Record yourself summarising the audio in 60 seconds.",
    ],
  },
  vocabulary: [
    "Berufserfahrung",
    "Arbeitsplatz",
    "Zusammenarbeit",
    "Verantwortung",
    "Herausforderung",
    "Vorschlag",
    "Rückmeldung",
    "sich weiterentwickeln",
  ],
});

export default b2Day3ArbeitUndBeruf;
