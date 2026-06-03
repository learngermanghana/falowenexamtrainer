import { makeLesson } from "../buildSelfLearningLesson";

const b2Day10KonsumUndGeld = makeLesson({
  level: "B2",
  day: 10,
  chapter: "2.5",
  title: "Konsum und Geld",
  topic: "Kaufentscheidungen, Budgetplanung und Werbung",
  heroImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80",
  grammarFocus: "Konzessive Verbindungen mit obwohl, trotzdem und dennoch",
  objectives: [
    "Ich kann über Konsum, Budgetplanung und Kaufentscheidungen sprechen.",
    "Ich kann erklären, wie Werbung Kaufentscheidungen beeinflusst.",
    "Ich kann Vorteile und Nachteile von Einkaufstrends abwägen.",
    "Ich kann Gegensätze mit obwohl, trotzdem und dennoch ausdrücken.",
  ],
  explanation: [
    "Konsum bedeutet, Waren oder Dienstleistungen zu kaufen und zu nutzen. Dazu gehören alltägliche Entscheidungen über Essen, Kleidung, Technik, Freizeit und digitale Angebote.",
    "Auf B2-Niveau solltest du erklären können, warum Menschen kaufen, welche Rolle Werbung spielt und wie man bewusster plant.",
    "Heute lernst du, Gegensätze klar auszudrücken. Danach übst du Sprechen, nutzt die Schreibtools und trainierst Lesen und Hören.",
  ],
  topicQuestions: [
    "Wofür gibst du im Alltag am meisten Geld aus?",
    "Beeinflusst Werbung deine Entscheidungen? Warum oder warum nicht?",
    "Welche Vorteile und Nachteile hat Online-Shopping?",
    "Wie kann man bewusster planen, bevor man etwas kauft?",
  ],
  grammarLesson: {
    rules: [
      "Mit obwohl formulierst du einen Nebensatz. Das konjugierte Verb steht am Ende: Obwohl ich sparen möchte, kaufe ich manchmal spontan ein.",
      "Trotzdem und dennoch stehen im Hauptsatz und zeigen einen Gegensatz: Ich möchte sparen. Trotzdem kaufe ich manchmal spontan ein.",
      "Konzessive Verbindungen helfen dir, differenziert zu argumentieren.",
      "Eine gute B2-Struktur ist: Vorteil, Gegenseite, Beispiel und persönliche Meinung.",
    ],
    examples: [
      "Obwohl Online-Shopping praktisch ist, kann man leicht den Überblick verlieren.",
      "Viele Menschen wissen, dass Werbung sie beeinflusst. Trotzdem kaufen sie manchmal Produkte, die sie nicht geplant hatten.",
      "Obwohl manche Produkte teuer sind, entscheiden sich Kunden dafür, weil sie Qualität erwarten.",
      "Ich plane mein Budget. Dennoch gebe ich manchmal mehr aus als geplant.",
    ],
    miniExercise: "Schreibe sechs Sätze zum Thema Konsum: drei mit obwohl und drei mit trotzdem oder dennoch.",
  },
  speakingTaskType: "Consumer behaviour opinion talk",
  speakingTopic: "Sprechen: Erkläre, wie Werbung und Online-Shopping Kaufentscheidungen beeinflussen, und gib Tipps für bewussten Konsum.",
  speakingBuilder: {
    plan: [
      "Einleitung: Nenne das Thema Konsum und Budgetplanung im Alltag.",
      "Hauptteil 1: Erkläre, warum Menschen bestimmte Produkte kaufen.",
      "Hauptteil 2: Beschreibe den Einfluss von Werbung oder sozialen Medien.",
      "Hauptteil 3: Nenne Vorteile und Risiken von Online-Shopping.",
      "Schluss: Gib zwei Tipps für bewusste Entscheidungen.",
    ],
    starters: [
      "Viele Menschen kaufen Produkte, weil ...",
      "Werbung beeinflusst uns, obwohl ...",
      "Ein Vorteil von Online-Shopping ist ..., trotzdem ...",
      "Um bewusster zu entscheiden, sollte man ...",
      "Meiner Meinung nach ist es wichtig, ...",
    ],
  },
  writingTaskType: "Opinion essay / Erörterung",
  writingTopic: "Schreiben: Konsum im Alltag. Erkläre, wie Werbung, Online-Shopping und Budgetplanung Kaufentscheidungen beeinflussen.",
  writingBuilder: {
    structure: [
      "Einleitung: Stelle das Thema Konsum und Budgetplanung vor.",
      "Hauptteil 1: Erkläre, wie Werbung Kaufentscheidungen beeinflusst.",
      "Hauptteil 2: Beschreibe Vorteile und Nachteile von Online-Shopping.",
      "Hauptteil 3: Erkläre, warum Planung vor dem Kauf wichtig ist.",
      "Schluss: Deine Meinung und ein persönlicher Tipp.",
    ],
    usefulLines: [
      "Konsum spielt im Alltag vieler Menschen eine große Rolle.",
      "Ein Grund dafür ist, dass Werbung oft emotionale Wünsche anspricht.",
      "Obwohl Online-Shopping bequem ist, kann es zu spontanen Käufen führen.",
      "Eine gute Budgetplanung hilft dabei, den Überblick zu behalten.",
      "Meiner Meinung nach sollte man vor dem Kauf überlegen, ob man ein Produkt wirklich braucht.",
    ],
  },
  phrases: [
    "obwohl / trotzdem / dennoch",
    "eine Kaufentscheidung treffen",
    "vom Preis beeinflusst werden",
    "ein Budget planen",
    "Geld ausgeben / sparen",
    "Online-Shopping",
    "bewusst konsumieren",
  ],
  tasks: {
    speaking: "Sprich 2–3 Minuten über Konsum, Werbung und Budgetplanung. Nutze mindestens vier konzessive Verbindungen.",
    writing: "Schreibe 180–220 Wörter: Konsum im Alltag. Erkläre Werbung, Online-Shopping, Budgetplanung und deine Meinung.",
    reading: "Lies einen Artikel über Konsum, Geld, Werbung oder Online-Shopping. Notiere Hauptaussage, 5 Wörter und deine Meinung.",
    listening: "Höre einen kurzen Beitrag über Konsum oder Budgetplanung. Fasse ihn in 4 Sätzen zusammen.",
  },
  readingResource: {
    title: "Welt.de Suche: Konsum, Geld, Werbung, Online-Shopping",
    description: "Open the search and choose one article about consumption, money, advertising or online shopping. Focus on influence and decision-making vocabulary.",
    url: "https://www.welt.de/suche?q=Konsum%20Geld%20Werbung%20Online-Shopping",
    tasks: [
      "Write the title of the article you chose.",
      "Write the main idea in one German sentence.",
      "Find 5 useful expressions connected to consumption or budget planning.",
      "Write 4–5 sentences: What advice would you give to consumers?",
    ],
  },
  listeningResource: {
    title: "DW Deutsch lernen search: Konsum und Geld",
    description: "Choose one short DW audio/video connected to consumption, shopping or budget planning. Listen twice and write the key points.",
    url: "https://www.dw.com/de/suche/s-100853?searchNavigationId=9097&item=Konsum%20Geld",
    tasks: [
      "Listen once and write the topic.",
      "Listen again and write 3 important points.",
      "Write 3 useful consumption-related expressions you heard.",
      "Record yourself summarising the audio in 60 seconds.",
    ],
  },
  vocabulary: [
    "Konsum",
    "Werbung",
    "Budget",
    "Kaufentscheidung",
    "Online-Shopping",
    "Ausgaben",
    "Sparen",
    "bewusst",
  ],
});

export default b2Day10KonsumUndGeld;
