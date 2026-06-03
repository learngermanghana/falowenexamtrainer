import { makeLesson } from "../buildSelfLearningLesson";

const b2Day7UmweltUndNachhaltigkeit = makeLesson({
  level: "B2",
  day: 7,
  chapter: "2.2",
  title: "Umwelt und Nachhaltigkeit",
  topic: "Klimaschutz, Konsum und Alltagshandeln",
  heroImage: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=1600&q=80",
  grammarFocus: "Passiv und sachliche Beschreibung von Umweltproblemen und Lösungen",
  objectives: [
    "Ich kann Umweltprobleme und nachhaltige Lösungen beschreiben.",
    "Ich kann erklären, welche Rolle Konsum und Alltagshandeln für die Umwelt spielen.",
    "Ich kann Passivformen nutzen, um sachlich über Maßnahmen zu sprechen.",
    "Ich kann meine Meinung zu Klimaschutz und Verantwortung begründen.",
  ],
  explanation: [
    "Nachhaltigkeit bedeutet, so zu leben und zu wirtschaften, dass Ressourcen nicht unnötig verschwendet werden und zukünftige Generationen gute Lebensbedingungen haben.",
    "Auf B2-Niveau solltest du Umweltprobleme nicht nur nennen, sondern Ursachen, Folgen und mögliche Lösungen erklären können. Dabei hilft eine sachliche Sprache.",
    "Heute übst du das Passiv, weil es bei Umwelt- und Gesellschaftsthemen sehr nützlich ist. Danach trainierst du Sprechen, Schreiben, Lesen und Hören mit Falowen AI und externen Ressourcen.",
  ],
  topicQuestions: [
    "Welche Umweltprobleme bemerkst du in deinem Alltag?",
    "Was kann jede Person tun, um nachhaltiger zu leben?",
    "Sollte Klimaschutz eher Aufgabe der Regierung oder der Bürger sein? Warum?",
    "Welche Konsumgewohnheit könnte man leicht ändern?",
  ],
  grammarLesson: {
    rules: [
      "Das Passiv wird genutzt, wenn die Handlung wichtiger ist als die Person, die handelt: Plastik wird oft falsch entsorgt.",
      "Passiv Präsens: werden + Partizip II: Viele Produkte werden nur kurz benutzt.",
      "Passiv mit Modalverben: müssen/können/sollten + Partizip II + werden: Mehr öffentliche Verkehrsmittel sollten genutzt werden.",
      "Bei sachlichen Themen klingt das Passiv oft neutraler und professioneller als direkte Schuldzuweisungen.",
    ],
    examples: [
      "In vielen Städten wird zu viel Müll produziert.",
      "Alte Geräte werden oft weggeworfen, obwohl sie repariert werden könnten.",
      "Mehr Fahrradwege sollten gebaut werden, damit Menschen klimafreundlicher unterwegs sind.",
      "Verpackungen müssen reduziert werden, um Ressourcen zu sparen.",
    ],
    miniExercise: "Schreibe sechs Passivsätze zum Thema Umwelt. Nutze drei Sätze im Passiv Präsens und drei Sätze mit Modalverben.",
  },
  speakingTaskType: "Environmental problem and solution talk",
  speakingTopic: "Sprechen: Beschreibe ein Umweltproblem, erkläre Ursachen und Folgen und schlage zwei realistische Lösungen vor.",
  speakingBuilder: {
    plan: [
      "Einleitung: Nenne ein Umweltproblem und warum es wichtig ist.",
      "Hauptteil 1: Erkläre Ursachen mit Beispielen aus Alltag oder Konsum.",
      "Hauptteil 2: Beschreibe Folgen für Menschen, Natur oder Städte.",
      "Hauptteil 3: Schlage zwei Lösungen vor und begründe sie.",
      "Schluss: Sage, welche Verantwortung du persönlich übernehmen könntest.",
    ],
    starters: [
      "Ein wichtiges Umweltproblem ist ...",
      "Dieses Problem entsteht, weil ...",
      "Dadurch wird/werden ...",
      "Eine mögliche Lösung wäre, dass ...",
      "Meiner Meinung nach sollte ... stärker gefördert werden.",
    ],
  },
  writingTaskType: "Opinion essay / Erörterung",
  writingTopic: "Schreiben: Nachhaltig leben im Alltag. Erkläre Umweltprobleme, mögliche Lösungen und deine Meinung zur persönlichen Verantwortung.",
  writingBuilder: {
    structure: [
      "Einleitung: Stelle das Thema Umwelt und Nachhaltigkeit vor.",
      "Hauptteil 1: Beschreibe ein oder zwei Umweltprobleme mit Ursachen.",
      "Hauptteil 2: Erkläre mögliche Lösungen durch Bürger, Firmen oder Politik.",
      "Hauptteil 3: Bewerte, was im Alltag realistisch ist.",
      "Schluss: Deine persönliche Meinung und ein konkreter Vorschlag.",
    ],
    usefulLines: [
      "Das Thema Nachhaltigkeit spielt heute eine immer wichtigere Rolle.",
      "Ein großes Problem besteht darin, dass ...",
      "Viele Ressourcen werden verschwendet, obwohl ...",
      "Eine sinnvolle Maßnahme wäre, ...",
      "Meiner Meinung nach kann jeder Mensch einen kleinen Beitrag leisten, indem ...",
    ],
  },
  phrases: [
    "nachhaltig leben",
    "Ressourcen sparen",
    "Müll vermeiden",
    "umweltfreundliche Verkehrsmittel nutzen",
    "es wird ... produziert",
    "es sollte ... reduziert werden",
    "einen Beitrag leisten",
  ],
  tasks: {
    speaking: "Sprich 2–3 Minuten über ein Umweltproblem und mögliche Lösungen. Nutze mindestens vier Passivformen.",
    writing: "Schreibe 180–220 Wörter: Nachhaltig leben im Alltag. Erkläre Probleme, Lösungen und deine Meinung.",
    reading: "Lies einen Artikel über Klimaschutz, Nachhaltigkeit oder Konsum. Notiere Hauptaussage, 5 Wörter und deine Meinung.",
    listening: "Höre einen kurzen Beitrag über Umwelt oder Nachhaltigkeit. Fasse ihn in 4 Sätzen zusammen.",
  },
  readingResource: {
    title: "Welt.de Suche: Klimaschutz, Nachhaltigkeit, Konsum",
    description: "Open the search and choose one article about climate protection, sustainability or consumption. Focus on causes, measures and useful vocabulary.",
    url: "https://www.welt.de/suche?q=Klimaschutz%20Nachhaltigkeit%20Konsum",
    tasks: [
      "Write the title of the article you chose.",
      "Write the main idea in one German sentence.",
      "Find 5 useful expressions connected to environment or sustainability.",
      "Write 4–5 sentences: Which solution from the article is realistic in your daily life?",
    ],
  },
  listeningResource: {
    title: "DW Deutsch lernen search: Umwelt und Nachhaltigkeit",
    description: "Choose one short DW audio/video connected to environment, climate or sustainability. Listen twice and write the key points.",
    url: "https://www.dw.com/de/suche/s-100853?searchNavigationId=9097&item=Umwelt%20Nachhaltigkeit",
    tasks: [
      "Listen once and write the topic.",
      "Listen again and write 3 important points.",
      "Write 3 useful environment-related expressions you heard.",
      "Record yourself summarising the audio in 60 seconds.",
    ],
  },
  vocabulary: [
    "Nachhaltigkeit",
    "Klimaschutz",
    "Ressourcen",
    "Umweltverschmutzung",
    "Verpackung",
    "Mülltrennung",
    "Verantwortung",
    "umweltfreundlich",
  ],
});

export default b2Day7UmweltUndNachhaltigkeit;
