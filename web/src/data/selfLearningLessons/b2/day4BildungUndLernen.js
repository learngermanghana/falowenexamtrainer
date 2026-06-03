import { makeLesson } from "../buildSelfLearningLesson";

const b2Day4BildungUndLernen = makeLesson({
  level: "B2",
  day: 4,
  chapter: "1.4",
  title: "Bildung und Lernen",
  topic: "Lernstrategien, Prüfungen und Weiterbildung",
  heroImage: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80",
  grammarFocus: "Finalsätze mit damit / um ... zu und klare Zielbegründungen",
  objectives: [
    "Ich kann über meine Lernstrategien sprechen.",
    "Ich kann erklären, warum Weiterbildung wichtig ist.",
    "Ich kann Ziele mit damit und um ... zu formulieren.",
    "Ich kann einen Beitrag über Online-Lernen und Präsenzunterricht strukturieren.",
  ],
  explanation: [
    "Bildung bedeutet nicht nur Schule oder Prüfung. Es geht auch um Weiterbildung, Selbstlernen, digitale Lernangebote und persönliche Entwicklung.",
    "Auf B2-Niveau solltest du erklären können, welche Lernstrategie für dich funktioniert und warum. Du solltest auch Vor- und Nachteile verschiedener Lernformen vergleichen können.",
    "Heute lernst du, Lernziele klar zu formulieren. Danach übst du Sprechen, nutzt die Schreibtools und arbeitest mit Lesen/Hören für mehr Wortschatz.",
  ],
  topicQuestions: [
    "Welche Lernmethode hilft dir am meisten?",
    "Was ist für dich schwieriger: alleine lernen oder im Unterricht lernen?",
    "Warum ist Weiterbildung im Berufsleben wichtig?",
    "Welche Rolle spielt Technologie beim Lernen?",
  ],
  grammarLesson: {
    rules: [
      "Mit um ... zu formulierst du ein Ziel, wenn das Subjekt gleich bleibt: Ich lerne täglich, um meine Grammatik zu verbessern.",
      "Mit damit formulierst du ein Ziel, wenn es ein anderes Subjekt gibt: Der Lehrer erklärt langsam, damit die Schüler alles verstehen.",
      "Nach damit steht das konjugierte Verb am Ende: Ich mache Notizen, damit ich den Text später wiederholen kann.",
      "Ziele klingen stärker, wenn du sie mit einer Begründung verbindest: Ich wiederhole regelmäßig, um sicherer zu werden.",
    ],
    examples: [
      "Ich nutze Karteikarten, um neue Wörter schneller zu behalten.",
      "Ich höre deutsche Podcasts, um mein Hörverstehen zu verbessern.",
      "Die Schule bietet Online-Materialien an, damit die Lernenden auch zu Hause üben können.",
      "Ich plane feste Lernzeiten, damit ich nicht alles kurz vor der Prüfung wiederholen muss.",
    ],
    miniExercise: "Schreibe sechs Sätze über dein Lernen: drei mit um ... zu und drei mit damit.",
  },
  speakingTaskType: "Learning strategy comparison talk",
  speakingTopic: "Sprechen: Erkläre deine beste Lernstrategie, vergleiche Online-Lernen und Präsenzunterricht und sage, wie du dich auf Prüfungen vorbereitest.",
  speakingBuilder: {
    plan: [
      "Einleitung: Nenne deine aktuelle Lernsituation.",
      "Hauptteil 1: Beschreibe deine beste Lernstrategie und warum sie funktioniert.",
      "Hauptteil 2: Vergleiche Online-Lernen und Präsenzunterricht mit Vor- und Nachteilen.",
      "Schluss: Erkläre, was du in Zukunft verbessern möchtest.",
    ],
    starters: [
      "Eine Lernstrategie, die für mich gut funktioniert, ist ...",
      "Ich nutze diese Methode, um ...",
      "Online-Lernen hat den Vorteil, dass ...",
      "Präsenzunterricht ist hilfreich, weil ...",
      "Damit ich mich besser vorbereiten kann, ...",
    ],
  },
  writingTaskType: "Opinion essay / Erörterung",
  writingTopic: "Schreiben: Online-Lernen oder Präsenzunterricht? Erkläre Vor- und Nachteile, nenne Beispiele und formuliere deine Meinung.",
  writingBuilder: {
    structure: [
      "Einleitung: Stelle das Thema Lernen und Unterrichtsformen vor.",
      "Hauptteil 1: Vorteile des Online-Lernens mit Beispiel.",
      "Hauptteil 2: Vorteile des Präsenzunterrichts mit Beispiel.",
      "Hauptteil 3: Mögliche Probleme oder Bedingungen für erfolgreiches Lernen.",
      "Schluss: Deine persönliche Meinung und Empfehlung.",
    ],
    usefulLines: [
      "In den letzten Jahren hat Online-Lernen stark an Bedeutung gewonnen.",
      "Ein Vorteil des Online-Lernens besteht darin, dass ...",
      "Beim Präsenzunterricht ist besonders wichtig, dass ...",
      "Trotzdem sollte man nicht vergessen, dass ...",
      "Meiner Meinung nach hängt die beste Lernform von der Person und dem Ziel ab.",
    ],
  },
  phrases: [
    "um ... zu",
    "damit",
    "eine Lernstrategie anwenden",
    "sich auf eine Prüfung vorbereiten",
    "Wissen vertiefen",
    "Fortschritte machen",
    "selbstständig lernen",
  ],
  tasks: {
    speaking: "Sprich 2–3 Minuten über deine Lernstrategie und vergleiche Online-Lernen mit Präsenzunterricht. Nutze mindestens zwei Sätze mit um ... zu oder damit.",
    writing: "Schreibe 180–220 Wörter: Online-Lernen oder Präsenzunterricht? Erkläre Vor- und Nachteile und deine Meinung.",
    reading: "Lies einen Artikel über Bildung, Lernen oder Weiterbildung. Notiere Hauptaussage, 5 Wörter und deine Meinung.",
    listening: "Höre einen kurzen Beitrag über Lernen oder Weiterbildung. Fasse ihn in 4 Sätzen zusammen.",
  },
  readingResource: {
    title: "Welt.de Suche: Bildung, Lernen, Weiterbildung",
    description: "Open the search and choose one article about education, learning or further training. Focus on the main idea and useful expressions.",
    url: "https://www.welt.de/suche?q=Bildung%20Lernen%20Weiterbildung",
    tasks: [
      "Write the title of the article you chose.",
      "Write the main idea in one German sentence.",
      "Find 5 useful expressions connected to learning or education.",
      "Write 4–5 sentences: Which idea from the article could help learners?",
    ],
  },
  listeningResource: {
    title: "DW Deutsch lernen search: Bildung und Lernen",
    description: "Choose one short DW audio/video connected to education or learning. Listen twice and focus on the key points.",
    url: "https://www.dw.com/de/suche/s-100853?searchNavigationId=9097&item=Bildung%20Lernen",
    tasks: [
      "Listen once and write the topic.",
      "Listen again and write 3 important points.",
      "Write 3 useful learning-related expressions you heard.",
      "Record yourself summarising the audio in 60 seconds.",
    ],
  },
  vocabulary: [
    "Bildung",
    "Weiterbildung",
    "Lernstrategie",
    "Prüfungsvorbereitung",
    "Online-Lernen",
    "Präsenzunterricht",
    "Fortschritt",
    "selbstständig",
  ],
});

export default b2Day4BildungUndLernen;
