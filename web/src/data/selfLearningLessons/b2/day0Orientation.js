import { makeLesson } from "../buildSelfLearningLesson";

const b2Day0Orientation = makeLesson({
  level: "B2",
  day: 0,
  chapter: "0",
  title: "Day 0 Orientation: B2 self-learning workflow",
  topic: "Understand the B2 lesson flow, move writing guidance into orientation, and prepare your first identity-writing task.",
  heroImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80",
  grammarFocus: "Course orientation, writing workflow and honest self-marking",
  objectives: [
    "Ich verstehe, wie die B2-Lektionen aufgebaut sind: Learn, Speak, Write und Finish.",
    "Ich kann die Schreibaufgabe zuerst planen, dann schreiben, markieren und verbessern.",
    "Ich weiß, dass lange Schreibhilfen in Day 0 stehen, damit der Writing-Tab in den Tageslektionen frei und fokussiert bleibt.",
  ],
  explanation: [
    "Day 0 ist deine Orientierung für den B2-Selbstlernkurs. Lies diese Seite zuerst, damit du weißt, wie du die Lektionen mit Falowen AI verwendest.",
    "Ab Day 1 bleibt der Writing-Tab bewusst kurz: Du siehst die konkrete Schreibaufgabe und arbeitest direkt im Schreibpanel. Die ausführlichen Hinweise zu Struktur, Redemitteln, Markierung und Ideen findest du hier in Day 0.",
    "Für B2 ist der wichtigste Lernprozess nicht nur Schreiben, sondern Verbessern: Entwurf erstellen, AI-Feedback lesen, gezielt überarbeiten und ehrlich selbst markieren.",
  ],
  topicQuestions: [
    "Was ist dein aktueller Ausgangspunkt auf dem Weg zu B2?",
    "Welche B2-Schreibaufgaben fallen dir leicht oder schwer?",
    "Wie willst du Ideen sammeln, bevor du im Writing-Tab schreibst?",
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
      "Nach dem AI-Feedback verbessere ich nicht alles gleichzeitig, sondern konzentriere mich auf Struktur, Grammatik und Klarheit.",
      "Ich markiere meine Leistung ehrlich, damit ich weiß, welche Bereiche ich wiederholen muss.",
    ],
    miniExercise: "Schreibe drei Stichpunkte: 1) dein B2-Ziel, 2) deine größte Schwierigkeit, 3) eine konkrete Übungsroutine mit Falowen AI.",
  },
  speakingTaskType: "Orientation talk",
  speakingTopic: "Sprechen: Erkläre in 60–90 Sekunden, wie du eine B2-Lektion mit Learn, Speak, Write und Finish bearbeiten wirst.",
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
  writingTaskType: "Reflective opinion essay / Persönlicher Beitrag",
  writingTopic: "Schreiben: Wer bin ich online – wer bin ich offline? Beschreibe Unterschiede, nenne Beispiele und erkläre deine Meinung.",
  writingBuilder: {
    structure: [
      "Einleitung: Stelle das Thema Online-Identität und echte Identität vor.",
      "Hauptteil 1: Beschreibe, wie du dich im echten Leben siehst.",
      "Hauptteil 2: Erkläre, ob du online anders wirkst und warum.",
      "Hauptteil 3: Nenne ein Beispiel aus Alltag, Schule, Arbeit oder sozialen Medien.",
      "Schluss: Formuliere deine Meinung: Sollte man online authentisch sein?",
    ],
    usefulLines: [
      "In der heutigen Zeit spielt die Online-Identität eine immer größere Rolle.",
      "Im echten Leben würde ich mich eher als ... beschreiben.",
      "In sozialen Medien zeigen Menschen oft nur eine bestimmte Seite von sich.",
      "Meiner Meinung nach sollte man online nicht perfekt wirken wollen, sondern authentisch bleiben.",
      "Zusammenfassend lässt sich sagen, dass Identität aus vielen Erfahrungen und Entscheidungen besteht.",
    ],
  },
  phrases: [
    "Aufgabe verstehen → Ideen sammeln → planen → schreiben → markieren → verbessern",
    "Feedback als Lernhilfe verstehen",
    "Redemittel speichern und aktiv wiederverwenden",
    "ehrlich selbst markieren",
  ],
  tasks: {
    speaking: "Sprich 60–90 Sekunden über deinen B2-Selbstlernprozess und wie du Falowen AI nutzt.",
    writing: "Schreibe 180–220 Wörter: Wer bin ich online – wer bin ich offline? Vergleiche beide Seiten und begründe deine Meinung.",
    reading: "Lies die Day-0-Orientierung und notiere die wichtigsten Schritte für den Writing-Tab.",
    listening: "Optional: Erkläre dir selbst laut die vier Tabs Learn, Speak, Write und Finish.",
  },
  readingResource: {
    title: "B2 Day 0 workbook orientation",
    description: "Open the full Day 0 workbook if you want the knowledge test and the detailed B2 progression guide.",
    url: "/campus/course/b2-day-0-self-learning-orientation-workbook",
    tasks: [
      "Read the B2 progression guide.",
      "Complete the Day 0 knowledge test.",
      "Return to this lesson and mark Day 0 complete when you understand the workflow.",
    ],
  },
  listeningResource: null,
  vocabulary: ["Orientierung", "Schreibprozess", "Selbstmarkierung", "Feedback", "Redemittel", "Identität", "Überarbeitung", "Fortschritt"],
});

export default b2Day0Orientation;
