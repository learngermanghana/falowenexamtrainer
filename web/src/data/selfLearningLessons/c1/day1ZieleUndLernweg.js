import { buildWeltReadingSearchUrl, makeLesson } from "../buildSelfLearningLesson";

const c1Day1ZieleUndLernweg = makeLesson({
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
    title: "WELT article search: Lernen, Bildung, Selbstorganisation",
    description: "Open this stable site search and choose one article about learning, education or self-organisation. Do not try to understand every word; focus on the main idea.",
    url: buildWeltReadingSearchUrl("Lernen Bildung Selbstorganisation"),
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

export default c1Day1ZieleUndLernweg;
