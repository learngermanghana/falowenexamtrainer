import { makeLesson } from "../buildSelfLearningLesson";

const c1Day0Orientation = makeLesson({
  level: "C1",
  day: 0,
  chapter: "0",
  title: "Day 0 Orientation: C1 self-learning workflow",
  topic: "Understand the C1 lesson flow, move writing guidance into orientation, and prepare your first learning-plan task.",
  heroImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
  grammarFocus: "Course orientation, writing workflow and honest self-marking",
  objectives: [
    "Ich verstehe, wie die C1-Lektionen aufgebaut sind: Learn, Speak, Write und Finish.",
    "Ich kann die Schreibaufgabe zuerst planen, dann schreiben, markieren und verbessern.",
    "Ich weiß, dass lange Schreibhilfen in Day 0 stehen, damit der Writing-Tab in den Tageslektionen frei und fokussiert bleibt.",
  ],
  explanation: [
    "Day 0 ist deine Orientierung für den C1-Selbstlernkurs. Lies diese Seite zuerst, damit du weißt, wie du die Lektionen mit Falowen AI verwendest.",
    "Ab Day 1 bleibt der Writing-Tab bewusst kurz: Du siehst die konkrete Schreibaufgabe und arbeitest direkt im Schreibpanel. Die ausführlichen Hinweise zu Struktur, Redemitteln, Markierung und Ideen findest du hier in Day 0.",
    "Für C1 ist der wichtigste Lernprozess nicht nur Schreiben, sondern Verbessern: Entwurf erstellen, AI-Feedback lesen, gezielt überarbeiten und ehrlich selbst markieren.",
  ],
  topicQuestions: [
    "Was ist dein aktueller Ausgangspunkt auf dem Weg zu C1?",
    "Warum ist C1 für dich persönlich wichtig?",
    "Welche Schwierigkeit möchtest du in den nächsten vier Wochen besonders trainieren?",
    "Wie wirst du Falowen AI nutzen, ohne nur Antworten zu kopieren?",
  ],
  grammarLesson: {
    rules: [
      "Nutze Day 0, um den Schreibprozess zu verstehen: Aufgabe verstehen, Ideen sammeln, planen, schreiben, markieren, verbessern.",
      "Nutze in Day 1 und späteren Lektionen den Writing-Tab hauptsächlich als Arbeitsfläche, nicht als lange Erklärung.",
      "Speichere starke Redemittel im Ref-Bereich und verwende sie aktiv in neuen Texten.",
    ],
    examples: [
      "Zuerst lese ich die Aufgabe genau, danach erstelle ich einen kurzen Plan.",
      "Nach dem AI-Feedback verbessere ich nicht alles gleichzeitig, sondern konzentriere mich auf Struktur, Grammatik und Präzision.",
      "Ich markiere meine Leistung ehrlich, damit ich weiß, welche Bereiche ich wiederholen muss.",
    ],
    miniExercise: "Schreibe drei Stichpunkte: 1) dein C1-Ziel, 2) deine größte Schwierigkeit, 3) eine konkrete Übungsroutine mit Falowen AI.",
  },
  speakingTaskType: "Orientation talk",
  speakingTopic: "Sprechen: Erkläre in 60–90 Sekunden, wie du eine C1-Lektion mit Learn, Speak, Write und Finish bearbeiten wirst.",
  speakingBuilder: {
    plan: [
      "Satz 1: Nenne, warum du Day 0 zuerst liest.",
      "Satz 2–3: Erkläre, wie du mit dem Writing-Tab arbeitest.",
      "Satz 4–5: Beschreibe, wie du Feedback und Selbstmarkierung nutzt.",
    ],
    starters: [
      "In Day 0 lerne ich, wie ...",
      "Im Writing-Tab konzentriere ich mich auf ...",
      "Nach dem Feedback werde ich ...",
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
    "Aufgabe verstehen → Ideen sammeln → planen → schreiben → markieren → verbessern",
    "Feedback als Lernhilfe verstehen",
    "Redemittel speichern und aktiv wiederverwenden",
    "ehrlich selbst markieren",
  ],
  tasks: {
    speaking: "Sprich 60–90 Sekunden über deinen C1-Selbstlernprozess und wie du Falowen AI nutzt.",
    writing: "Schreibe 180–220 Wörter: Mein C1-Lernweg: Ausgangspunkt, Motivation und konkreter Plan.",
    reading: "Lies die Day-0-Orientierung und notiere die wichtigsten Schritte für den Writing-Tab.",
    listening: "Optional: Erkläre dir selbst laut die vier Tabs Learn, Speak, Write und Finish.",
  },
  readingResource: {
    title: "C1 Day 0 workbook orientation",
    description: "Open the full Day 0 workbook if you want the knowledge test and the detailed C1 progression guide.",
    url: "/campus/course/c1-day-0-progression-workbook",
    tasks: [
      "Read the C1 progression guide.",
      "Complete the Day 0 knowledge test.",
      "Return to this lesson and mark Day 0 complete when you understand the workflow.",
    ],
  },
  listeningResource: null,
  vocabulary: ["Orientierung", "Schreibprozess", "Selbstmarkierung", "Feedback", "Redemittel", "Lernplan", "Überarbeitung", "Fortschritt"],
});

export default c1Day0Orientation;
