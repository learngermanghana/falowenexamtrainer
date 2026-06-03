import { makeLesson } from "../buildSelfLearningLesson";

const b2Day2AlltagUndZeitmanagement = makeLesson({
  level: "B2",
  day: 2,
  chapter: "1.2",
  title: "Alltag und Zeitmanagement",
  topic: "Routinen, Prioritäten und Produktivität beschreiben",
  heroImage: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1600&q=80",
  grammarFocus: "Temporale Konnektoren, Nebensätze und klare Reihenfolge im Tagesablauf",
  objectives: [
    "Ich kann meinen Alltag strukturiert beschreiben.",
    "Ich kann erklären, wie ich Prioritäten setze und Zeit plane.",
    "Ich kann Probleme beim Zeitmanagement nennen und Lösungen vorschlagen.",
    "Ich kann beim Sprechen und Schreiben zeitliche Verbindungen richtig verwenden.",
  ],
  explanation: [
    "Zeitmanagement bedeutet, Aufgaben bewusst zu planen, Prioritäten zu setzen und realistisch mit der eigenen Energie umzugehen.",
    "Auf B2-Niveau solltest du nicht nur sagen, was du machst. Du solltest erklären, warum du eine bestimmte Routine hast, welche Probleme entstehen und wie man sie lösen kann.",
    "Heute lernst du, deinen Alltag mit klaren Zeitangaben, Nebensätzen und Beispielen zu beschreiben. Danach übst du mit Falowen AI und markierst deinen Fortschritt selbst.",
  ],
  topicQuestions: [
    "Wie sieht ein typischer Tag bei dir aus?",
    "Was nimmt in deinem Alltag zu viel Zeit ein?",
    "Welche Aufgabe ist für dich wichtig, aber oft schwierig anzufangen?",
    "Welche Gewohnheit könnte deinen Alltag produktiver machen?",
  ],
  grammarLesson: {
    rules: [
      "Temporale Konnektoren zeigen Reihenfolge: zuerst, danach, anschließend, später, schließlich.",
      "Mit Nebensätzen kannst du genauer erklären: bevor, nachdem, während, sobald, wenn.",
      "Bei Nebensätzen steht das konjugierte Verb am Ende: Bevor ich lerne, lege ich mein Handy weg.",
      "Nutze Begründungen, um deine Planung zu erklären: weil, da, deshalb, aus diesem Grund.",
    ],
    examples: [
      "Bevor ich mit dem Lernen beginne, schreibe ich eine kurze Liste mit den wichtigsten Aufgaben.",
      "Nachdem ich meine Arbeit beendet habe, wiederhole ich neue Wörter für zwanzig Minuten.",
      "Während ich lerne, vermeide ich soziale Medien, weil sie mich leicht ablenken.",
      "Sobald ich eine Aufgabe erledigt habe, markiere ich sie als abgeschlossen.",
    ],
    miniExercise: "Schreibe fünf Sätze über deinen Alltag. Nutze dabei mindestens drei temporale Konnektoren: bevor, nachdem, während, sobald oder wenn.",
  },
  speakingTaskType: "Routine and problem-solving talk",
  speakingTopic: "Sprechen: Beschreibe deinen Alltag, erkläre deine größte Zeitmanagement-Schwierigkeit und schlage eine realistische Lösung vor.",
  speakingBuilder: {
    plan: [
      "Einleitung: Beschreibe kurz deinen typischen Tag.",
      "Hauptteil 1: Erkläre, welche Aufgaben am wichtigsten sind und warum.",
      "Hauptteil 2: Nenne ein Problem beim Zeitmanagement und ein konkretes Beispiel.",
      "Schluss: Schlage eine Lösung vor und erkläre, wie du sie umsetzen willst.",
    ],
    starters: [
      "An einem typischen Tag beginne ich damit, ...",
      "Eine wichtige Priorität für mich ist ..., weil ...",
      "Das größte Problem ist, dass ...",
      "Um dieses Problem zu lösen, könnte ich ...",
      "In Zukunft möchte ich versuchen, ...",
    ],
  },
  writingTaskType: "Opinion essay / Persönlicher Beitrag",
  writingTopic: "Schreiben: Gutes Zeitmanagement im Lernalltag. Erkläre, warum Planung wichtig ist, welche Probleme entstehen und welche Lösungen realistisch sind.",
  writingBuilder: {
    structure: [
      "Einleitung: Warum Zeitmanagement heute wichtig ist.",
      "Hauptteil 1: Beschreibe typische Probleme wie Ablenkung, Stress oder schlechte Planung.",
      "Hauptteil 2: Nenne konkrete Lösungen mit Beispielen.",
      "Schluss: Formuliere deine eigene Meinung und deinen persönlichen Plan.",
    ],
    usefulLines: [
      "In einem vollen Alltag ist gutes Zeitmanagement besonders wichtig.",
      "Ein häufiges Problem besteht darin, dass viele Menschen ihre Aufgaben unterschätzen.",
      "Eine realistische Lösung wäre, klare Prioritäten zu setzen und Pausen einzuplanen.",
      "Meiner Meinung nach funktioniert Zeitmanagement nur, wenn der Plan zum eigenen Alltag passt.",
      "Zusammenfassend lässt sich sagen, dass kleine Routinen langfristig große Wirkung haben können.",
    ],
  },
  phrases: [
    "zuerst / danach / anschließend / schließlich",
    "bevor / nachdem / während / sobald",
    "eine Priorität setzen",
    "Zeit verlieren / Zeit sparen",
    "realistisch planen",
    "Ablenkungen vermeiden",
  ],
  tasks: {
    speaking: "Sprich 2–3 Minuten über deinen Alltag und dein Zeitmanagement. Nutze mindestens 4 temporale Konnektoren und nenne eine konkrete Lösung.",
    writing: "Schreibe 180–220 Wörter: Gutes Zeitmanagement im Lernalltag. Erkläre Probleme, Lösungen und deine Meinung.",
    reading: "Lies einen Artikel über Zeitmanagement, Produktivität oder Lernroutinen. Notiere Hauptaussage, 5 Wörter und deine Meinung.",
    listening: "Höre einen kurzen Beitrag über Zeitmanagement oder produktive Gewohnheiten. Fasse ihn in 4 Sätzen zusammen.",
  },
  readingResource: {
    title: "Welt.de Suche: Zeitmanagement, Produktivität, Gewohnheiten",
    description: "Open the search and choose one article about time management, productivity or habits. Focus on the main idea and useful expressions.",
    url: "https://www.welt.de/suche?q=Zeitmanagement%20Produktivit%C3%A4t%20Gewohnheiten",
    tasks: [
      "Write the title of the article you chose.",
      "Write the main idea in one German sentence.",
      "Find 5 useful expressions connected to time, planning or productivity.",
      "Write 4–5 sentences: Which idea from the article could help your own learning routine?",
    ],
  },
  listeningResource: {
    title: "DW Deutsch lernen search: Zeitmanagement und Lernen",
    description: "Choose one short DW audio/video connected to time management, habits or learning. Listen twice and write the key points.",
    url: "https://www.dw.com/de/suche/s-100853?searchNavigationId=9097&item=Zeitmanagement%20Lernen",
    tasks: [
      "Listen once and write the topic.",
      "Listen again and write 3 important points.",
      "Write 3 useful expressions you heard.",
      "Record yourself summarising the audio in 60 seconds.",
    ],
  },
  vocabulary: [
    "Zeitmanagement",
    "Priorität",
    "Routine",
    "Ablenkung",
    "Gewohnheit",
    "Produktivität",
    "Planung",
    "Pausen einplanen",
  ],
});

export default b2Day2AlltagUndZeitmanagement;
