import { buildWeltReadingSearchUrl, makeLesson } from "../buildSelfLearningLesson";

const c1Day0Orientation = makeLesson({
  level: "C1",
  day: 0,
  chapter: "0",
  title: "Day 0 Orientation: How to use the C1 self-learning course",
  topic: "Start here before Day 1. Learn how the C1 course is designed, then practise with a real Goethe-style C1 opinion essay task.",
  heroImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
  grammarFocus: "Course orientation, C1 opinion essay structure, precise argumentation and honest self-marking",
  objectives: [
    "Ich verstehe, wie der C1-Selbstlernkurs aufgebaut ist: Learn, Speak, Write und Finish.",
    "Ich kann eine C1-Stellungnahme nach Goethe-Struktur planen.",
    "Ich kann erklären, argumentieren, Gegenargumente nennen und eine Alternative erläutern.",
    "Ich kann die Writing-Seite richtig nutzen: Ideen entwickeln, präzise schreiben, Mark My Letter nutzen und verbessern.",
  ],
  explanation: [
    "Day 0 ist deine Orientierung. Lies diese Seite zuerst, bevor du mit Day 1 beginnst. Der C1-Kurs ist als Selbstlernkurs aufgebaut: Du lernst, übst, markierst und verbesserst dich aktiv.",
    "Jede Lektion führt dich durch vier Schritte: Learn für Thema, anspruchsvolle Redemittel und Denkimpulse, Speak für mündliche Argumentation, Write für Schreiben und Feedback, und Finish für Lesen, Hören, Wortschatz und Abschluss.",
    "Für C1 reicht ein persönlicher Lernplan nicht. Deshalb übst du hier mit einer echten C1-Aufgabenform: erklären, anhand eines Beispiels argumentieren, Gegenargumente nennen und eine Alternative erläutern.",
    "Die Writing-Aufgabe gehört in die Writing-Seite beziehungsweise in das Writing-Panel der Lektion. Dort nutzt du Ideas Generator, Ref / Redemittel und Mark My Letter. Kopiere keine fertigen Texte; verbessere deine eigene Version Schritt für Schritt.",
  ],
  topicQuestions: [
    "Welche Rolle spielen digitale Lernplattformen heute im Sprachunterricht?",
    "Wann helfen digitale Tools wirklich beim Lernen und wann nicht?",
    "Welche Nachteile entstehen, wenn Lernende nur digital und ohne persönliche Betreuung lernen?",
    "Welche gute Alternative verbindet digitales Lernen mit Lehrerfeedback?",
  ],
  grammarLesson: {
    rules: [
      "C1 bedeutet: komplexe Themen präzise erklären, verschiedene Perspektiven abwägen und sprachlich kontrolliert argumentieren.",
      "Nutze eine klare Goethe-Struktur: Einleitung → Erklärung → Beispielargument → Gegenargumente → Alternative → Fazit.",
      "Jeder Aufgabenpunkt muss sichtbar beantwortet werden. Schreibe nicht nur allgemein über das Thema.",
      "Nutze die AI-Hilfe als Training. Kopiere nicht einfach Antworten; verbessere deine eigene Version Schritt für Schritt.",
    ],
    examples: [
      "Dieses Thema lässt sich aus verschiedenen Perspektiven betrachten.",
      "Ein anschauliches Beispiel hierfür ist, dass Lernende mit digitalen Plattformen gezielt Aussprache, Schreiben oder Wortschatz trainieren können.",
      "Gegen eine zu starke Nutzung spricht jedoch, dass persönliche Korrektur und echte Kommunikation dadurch vernachlässigt werden können.",
      "Eine sinnvolle Alternative wäre ein hybrides Modell, bei dem digitale Übungen durch regelmäßiges Lehrerfeedback ergänzt werden.",
    ],
    miniExercise: "Schreibe vier Stichpunkte zum Essay: 1) Erklärung, 2) konkretes Beispiel, 3) Gegenargument, 4) Alternative.",
  },
  speakingTaskType: "C1 argumentation talk",
  speakingTopic: "Sprechen: Erkläre in 2 Minuten, ob digitale Lernplattformen den klassischen Sprachunterricht ersetzen oder nur ergänzen sollten.",
  speakingBuilder: {
    plan: [
      "Einleitung: Nenne das Thema und deine Grundposition.",
      "Argument: Erkläre einen Vorteil digitaler Lernplattformen mit Beispiel.",
      "Gegenargument: Nenne ein Problem bei zu viel digitalem Lernen.",
      "Alternative: Erkläre ein hybrides Modell aus Plattform, Lehrerfeedback und eigener Übung.",
    ],
    starters: [
      "In der heutigen Bildungslandschaft spielen digitale Lernplattformen eine immer wichtigere Rolle.",
      "Ein überzeugendes Beispiel dafür ist ...",
      "Gegen eine ausschließliche Nutzung spricht jedoch ...",
      "Aus meiner Sicht wäre ein hybrides Modell sinnvoller, weil ...",
    ],
  },
  writingTaskType: "Goethe C1 opinion essay / Stellungnahme",
  writingTopic: "Schreiben: Digitale Lernplattformen im Sprachunterricht. Verfassen Sie eine Stellungnahme und bearbeiten Sie alle Punkte: Erklären Sie, warum digitale Lernplattformen heute wichtig sind. Argumentieren Sie anhand eines konkreten Beispiels. Nennen Sie Gründe, die gegen eine zu starke Nutzung sprechen. Erläutern Sie eine Alternative, die digitales Lernen mit persönlicher Betreuung verbindet.",
  writingBuilder: {
    structure: [
      "Einleitung: Stellen Sie das Thema digitale Lernplattformen im Sprachunterricht vor und zeigen Sie die Aktualität.",
      "Erklären Sie: Warum spielen digitale Lernplattformen heute eine wichtige Rolle beim Sprachenlernen?",
      "Argumentieren Sie anhand eines Beispiels: Zeigen Sie konkret, wie Lernende selbstständiger üben können.",
      "Nennen Sie Gründe dagegen: Welche Probleme entstehen bei einer zu starken Nutzung digitaler Plattformen?",
      "Erläutern Sie eine Alternative: Beschreiben Sie ein hybrides Modell aus digitalen Übungen, persönlicher Betreuung und Lehrerfeedback.",
      "Schluss: Formulieren Sie ein differenziertes Fazit mit Ihrer eigenen Position.",
    ],
    usefulLines: [
      "In der heutigen Bildungslandschaft gewinnen digitale Lernplattformen zunehmend an Bedeutung.",
      "Ein wesentlicher Vorteil besteht darin, dass Lernende zeit- und ortsunabhängig üben können.",
      "Dies lässt sich beispielsweise daran erkennen, dass ...",
      "Gegen eine zu starke Nutzung spricht jedoch, dass ...",
      "Eine sinnvolle Alternative wäre ein hybrides Lernmodell, bei dem ...",
      "Zusammenfassend lässt sich festhalten, dass digitale Plattformen den Unterricht nicht ersetzen, sondern gezielt ergänzen sollten.",
    ],
  },
  phrases: [
    "Dieses Thema lässt sich aus verschiedenen Perspektiven betrachten.",
    "Dafür spricht insbesondere, dass ...",
    "Ein anschauliches Beispiel hierfür ist ...",
    "Demgegenüber muss berücksichtigt werden, dass ...",
    "Eine mögliche Alternative bestünde darin, ...",
    "Zusammenfassend lässt sich festhalten, dass ...",
  ],
  tasks: {
    speaking: "Sprich 2 Minuten über digitale Lernplattformen im Sprachunterricht. Nenne einen Vorteil, ein Gegenargument und eine Alternative.",
    writing: "Schreibe 180–220 Wörter als Goethe-C1-Stellungnahme über digitale Lernplattformen im Sprachunterricht und beantworte alle vier Aufgabenpunkte.",
    reading: "Lies einen Artikel über digitales Lernen, KI oder Sprachunterricht. Notiere Hauptaussage, 5 Wörter und deine Meinung.",
    listening: "Höre einen Beitrag über digitales Lernen oder Bildungstechnologie. Fasse ihn in 4–5 Sätzen zusammen.",
  },
  readingResource: {
    title: "WELT article search: Digitale Lernplattformen und Sprachunterricht",
    description: "Open this stable site search and choose one article about digital learning, AI, education or language learning. Focus on the main argument and useful C1 vocabulary.",
    url: buildWeltReadingSearchUrl("digitale Lernplattformen Sprachunterricht KI Bildung"),
    tasks: [
      "Write the title of the article you chose.",
      "Write the main argument in one German sentence.",
      "Find 5 useful C1 words or expressions connected to digital learning.",
      "Write 4–5 sentences: Do you agree with the article? Why or why not?",
    ],
  },
  listeningResource: {
    title: "DW Deutsch lernen search: digitales Lernen und Bildung",
    description: "Choose one short DW audio/video connected to digital learning, AI or education. Listen twice and focus on the key points.",
    url: "https://www.dw.com/de/suche/s-100853?searchNavigationId=9097&item=digitales%20Lernen%20Bildung%20KI",
    tasks: [
      "Listen once and write the topic.",
      "Listen again and write 3 important points.",
      "Write 3 useful expressions you heard.",
      "Record yourself summarising the audio in 60–90 seconds.",
    ],
  },
  vocabulary: ["digitale Lernplattformen", "Sprachunterricht", "Selbstständigkeit", "Lehrerfeedback", "hybrides Lernen", "Präsenzunterricht", "Bildungstechnologie", "Gegenargument"],
});

export default c1Day0Orientation;
