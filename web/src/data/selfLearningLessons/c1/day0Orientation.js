import { makeLesson } from "../buildSelfLearningLesson";

const c1Day0Orientation = makeLesson({
  level: "C1",
  day: 0,
  chapter: "0",
  title: "Day 0 Orientation: How to use the C1 self-learning course",
  topic: "Start here before Day 1. Learn how the C1 course is designed, how to practise with 10-minute blocks, where to write, and how to complete the Day 0 knowledge test.",
  heroImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
  grammarFocus: "Course orientation, 10-minute practice routine, advanced writing workflow and honest self-marking",
  objectives: [
    "Ich verstehe, wie der C1-Selbstlernkurs aufgebaut ist: Learn, Speak, Write und Finish.",
    "Ich weiß, wie ich jeden Teil mit kurzen 10-Minuten-Übungen trainiere.",
    "Ich kann die Writing-Seite richtig nutzen: Ideen entwickeln, präzise schreiben, Mark My Letter nutzen und verbessern.",
    "Ich verstehe, dass der Day-0-Workbook die genaue Orientierung und den Knowledge Test enthält.",
  ],
  explanation: [
    "Day 0 ist deine Orientierung. Lies diese Seite zuerst, bevor du mit Day 1 beginnst. Der C1-Kurs ist kein normaler Submit-Kurs; er ist als Selbstlernkurs aufgebaut.",
    "Jede Lektion führt dich durch vier Schritte: Learn für Thema, anspruchsvolle Redemittel und Denkimpulse, Speak für mündliche Argumentation, Write für Schreiben und Feedback, und Finish für deine ehrliche Selbstmarkierung.",
    "Arbeite mit kleinen 10-Minuten-Blöcken: 10 Minuten Learn lesen und Notizen machen, 10 Minuten Speaking üben, 10 Minuten Writing schreiben und verbessern. Wenn du Zeit hast, ergänze Reading oder Listening mit weiteren 10 Minuten.",
    "Die Writing-Aufgabe gehört in die Writing-Seite beziehungsweise in das Writing-Panel der Lektion. Dort nutzt du Ideas Generator, Ref / Redemittel und Mark My Letter. Die Submit-Seite ist für diesen C1-Selbstlernkurs nicht der richtige Ort.",
    "Öffne danach den Day-0-Workbook. Dort findest du die vollständige Orientierung, eine kurze C1-Grundlagen-Erklärung und den Knowledge Test, damit du sicher weißt, wie du starten sollst.",
  ],
  topicQuestions: [
    "Was bedeutet C1 im Vergleich zu B2?",
    "Wie wirst du Learn, Speak, Write und Finish an einem normalen Lerntag nutzen?",
    "Welche 10-Minuten-Übung kannst du jeden Tag realistisch schaffen?",
    "Warum sollst du deine Writing-Aufgabe in der Writing-Seite üben und nicht einfach in Submit senden?",
  ],
  grammarLesson: {
    rules: [
      "C1 bedeutet: komplexe Themen präzise erklären, verschiedene Perspektiven abwägen und sprachlich kontrolliert argumentieren.",
      "Nutze eine klare Struktur: Einleitung → Analyse → Argumente und Gegenargumente → Beispiel oder Transfer → differenziertes Fazit.",
      "Übe täglich kurz, aber aktiv: 10 Minuten konzentrierte Arbeit sind besser als passives Lesen ohne eigene Produktion.",
      "Nutze die AI-Hilfe als Training. Kopiere nicht einfach Antworten; verbessere deine eigene Version Schritt für Schritt.",
    ],
    examples: [
      "Dieses Thema lässt sich aus verschiedenen Perspektiven betrachten.",
      "Während einerseits ... betont werden muss, darf andererseits ... nicht außer Acht gelassen werden.",
      "Ein anschauliches Beispiel hierfür ist ...",
      "Zusammenfassend lässt sich festhalten, dass ...",
    ],
    miniExercise: "Schreibe drei Stichpunkte: 1) dein C1-Ziel, 2) deine tägliche 10-Minuten-Routine, 3) eine Sache, die du beim präzisen Schreiben verbessern möchtest.",
  },
  speakingTaskType: "Orientation talk",
  speakingTopic: "Sprechen: Erkläre in 60–90 Sekunden, wie du eine C1-Lektion mit Learn, Speak, Write und Finish bearbeiten wirst.",
  speakingBuilder: {
    plan: [
      "Satz 1: Nenne, warum du Day 0 zuerst liest.",
      "Satz 2–3: Erkläre die vier Schritte Learn, Speak, Write und Finish.",
      "Satz 4–5: Beschreibe deine 10-Minuten-Routine und wie du Falowen AI nutzt.",
    ],
    starters: [
      "In Day 0 lerne ich, wie ...",
      "Zunächst nutze ich Learn, danach ...",
      "Für meine Writing-Aufgabe werde ich ...",
      "Nach dem Feedback verbessere ich ...",
    ],
  },
  writingTaskType: "Reflective opinion essay / Lernplan",
  writingTopic: "Schreiben: Mein C1-Lernweg. Beschreibe deinen Ausgangspunkt, deine Motivation, deine größte Schwierigkeit und deinen konkreten 4-Wochen-Plan.",
  writingBuilder: {
    structure: [
      "Einleitung: Warum C1 für dich wichtig ist.",
      "Hauptteil 1: Deine aktuelle Ausgangssituation und größte Schwierigkeit.",
      "Hauptteil 2: Dein konkreter Lernplan mit Falowen AI und Selbstmarkierung.",
      "Hauptteil 3: Wie du täglich mit 10-Minuten-Blöcken trainieren wirst.",
      "Schluss: Dein realistisches Ziel für die nächsten 4 Wochen.",
    ],
    usefulLines: [
      "Mein Ziel besteht darin, meine Deutschkenntnisse nicht nur zu erweitern, sondern gezielt anzuwenden.",
      "Besonders wichtig ist für mich, dass ich Feedback nicht als Kritik, sondern als Lernhilfe verstehe.",
      "Durch regelmäßige Selbstreflexion kann ich besser erkennen, welche Bereiche ich wiederholen muss.",
      "Langfristig möchte ich sicherer, präziser und strukturierter kommunizieren.",
      "Daher plane ich, täglich kurze, aber konzentrierte Übungseinheiten zu absolvieren.",
    ],
  },
  phrases: [
    "Learn → Speak → Write → Finish",
    "10 Minuten aktiv üben",
    "Aufgabe verstehen → Ideen entwickeln → präzise schreiben → markieren → verbessern",
    "Feedback als Lernhilfe verstehen",
    "ehrlich selbst markieren",
  ],
  tasks: {
    speaking: "Sprich 60–90 Sekunden über deinen C1-Selbstlernprozess und deine 10-Minuten-Routine.",
    writing: "Schreibe 180–220 Wörter: Mein C1-Lernweg: Ausgangspunkt, Motivation, Schwierigkeit und konkreter Plan.",
    reading: "Öffne den Day-0-Workbook, lies die Orientierung und beantworte den Knowledge Test.",
    listening: "Optional: Erkläre dir selbst laut die vier Schritte Learn, Speak, Write und Finish.",
  },
  readingResource: {
    title: "C1 Day 0 workbook orientation + knowledge test",
    description: "Open this workbook to read the full C1 orientation, learn the 10-minute practice routine, understand the Writing page, and complete the Day 0 knowledge test.",
    url: "/campus/course/c1-day-0-progression-workbook",
    tasks: [
      "Read how the C1 self-learning course is designed.",
      "Learn how to use Learn, Speak, Write and Finish.",
      "Understand the 10-minute practice routine.",
      "Complete the Day 0 knowledge test before Day 1.",
    ],
  },
  listeningResource: null,
  vocabulary: ["Orientierung", "Selbstlernkurs", "10-Minuten-Routine", "Writing-Seite", "Mark My Letter", "Präzision", "Feedback", "Selbstmarkierung"],
});

export default c1Day0Orientation;
