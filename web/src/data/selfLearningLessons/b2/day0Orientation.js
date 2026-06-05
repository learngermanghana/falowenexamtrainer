import { makeLesson } from "../buildSelfLearningLesson";

const b2Day0Orientation = makeLesson({
  level: "B2",
  day: 0,
  chapter: "0",
  title: "Day 0 Orientation: How to use the B2 self-learning course",
  topic: "Start here before Day 1. Learn how the B2 course is designed, how to practise with 10-minute blocks, where to write, and how to complete the Day 0 knowledge test.",
  heroImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80",
  grammarFocus: "Course orientation, 10-minute practice routine, writing workflow and honest self-marking",
  objectives: [
    "Ich verstehe, wie der B2-Selbstlernkurs aufgebaut ist: Learn, Speak, Write und Finish.",
    "Ich weiß, wie ich jeden Teil mit kurzen 10-Minuten-Übungen trainiere.",
    "Ich kann die Writing-Seite richtig nutzen: Ideen sammeln, schreiben, Mark My Letter nutzen und verbessern.",
    "Ich verstehe, dass der Day-0-Workbook die genaue Orientierung und den Knowledge Test enthält.",
  ],
  explanation: [
    "Day 0 ist deine Orientierung. Lies diese Seite zuerst, bevor du mit Day 1 beginnst. Der B2-Kurs ist kein normaler Submit-Kurs; er ist als Selbstlernkurs aufgebaut.",
    "Jede Lektion führt dich durch vier Schritte: Learn für Thema und Redemittel, Speak für mündliche Übung, Write für Schreiben und Feedback, und Finish für deine ehrliche Selbstmarkierung.",
    "Arbeite mit kleinen 10-Minuten-Blöcken: 10 Minuten Learn lesen, 10 Minuten Speaking üben, 10 Minuten Writing schreiben und verbessern. Wenn du Zeit hast, ergänze Reading oder Listening mit weiteren 10 Minuten.",
    "Die Writing-Aufgabe gehört in die Writing-Seite beziehungsweise in das Writing-Panel der Lektion. Dort nutzt du Ideas Generator, Ref / Redemittel und Mark My Letter. Die Submit-Seite ist für diesen B2-Selbstlernkurs nicht der richtige Ort.",
    "Öffne danach den Day-0-Workbook. Dort findest du die vollständige Orientierung, eine kurze B2-Grundlagen-Erklärung und den Knowledge Test, damit du sicher weißt, wie du starten sollst.",
  ],
  topicQuestions: [
    "Was bedeutet B2 im Vergleich zu B1?",
    "Wie wirst du Learn, Speak, Write und Finish an einem normalen Lerntag nutzen?",
    "Welche 10-Minuten-Übung kannst du jeden Tag realistisch schaffen?",
    "Warum sollst du deine Writing-Aufgabe in der Writing-Seite üben und nicht einfach in Submit senden?",
  ],
  grammarLesson: {
    rules: [
      "B2 bedeutet: Meinung sagen, Gründe erklären, Beispiele geben, Gegenpositionen nennen und ein klares Fazit schreiben.",
      "Nutze eine einfache Struktur: Einleitung → Argument 1 → Beispiel → Argument 2 oder Gegenargument → Fazit.",
      "Übe täglich kurz, aber aktiv: 10 Minuten sind besser als nur passiv zu lesen und nichts zu schreiben oder zu sprechen.",
      "Nutze die AI-Hilfe als Training. Kopiere nicht einfach Antworten; verbessere deine eigene Version Schritt für Schritt.",
    ],
    examples: [
      "Meiner Meinung nach ist dieses Thema wichtig, weil ...",
      "Ein konkretes Beispiel dafür ist ...",
      "Trotz dieser Vorteile gibt es auch Nachteile, zum Beispiel ...",
      "Zusammenfassend lässt sich sagen, dass ...",
    ],
    miniExercise: "Schreibe drei Stichpunkte: 1) dein B2-Ziel, 2) deine tägliche 10-Minuten-Routine, 3) eine Sache, die du beim Schreiben verbessern möchtest.",
  },
  speakingTaskType: "Orientation talk",
  speakingTopic: "Sprechen: Erkläre in 60–90 Sekunden, wie du eine B2-Lektion mit Learn, Speak, Write und Finish bearbeiten wirst.",
  speakingBuilder: {
    plan: [
      "Satz 1: Nenne, warum du Day 0 zuerst liest.",
      "Satz 2–3: Erkläre die vier Schritte Learn, Speak, Write und Finish.",
      "Satz 4–5: Beschreibe deine 10-Minuten-Routine und wie du Falowen AI nutzt.",
    ],
    starters: [
      "In Day 0 lerne ich, wie ...",
      "Zuerst nutze ich Learn, danach ...",
      "Für meine Writing-Aufgabe werde ich ...",
      "Nach dem Feedback verbessere ich ...",
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
    "Learn → Speak → Write → Finish",
    "10 Minuten aktiv üben",
    "Aufgabe verstehen → Ideen sammeln → schreiben → markieren → verbessern",
    "Feedback als Lernhilfe verstehen",
    "ehrlich selbst markieren",
  ],
  tasks: {
    speaking: "Sprich 60–90 Sekunden über deinen B2-Selbstlernprozess und deine 10-Minuten-Routine.",
    writing: "Schreibe 180–220 Wörter: Wer bin ich online – wer bin ich offline? Vergleiche beide Seiten und begründe deine Meinung.",
    reading: "Öffne den Day-0-Workbook, lies die Orientierung und beantworte den Knowledge Test.",
    listening: "Optional: Erkläre dir selbst laut die vier Schritte Learn, Speak, Write und Finish.",
  },
  readingResource: {
    title: "B2 Day 0 workbook orientation + knowledge test",
    description: "Open this workbook to read the full B2 orientation, learn the 10-minute practice routine, understand the Writing page, and complete the Day 0 knowledge test.",
    url: "/campus/course/b2-day-0-self-learning-orientation-workbook",
    tasks: [
      "Read how the B2 self-learning course is designed.",
      "Learn how to use Learn, Speak, Write and Finish.",
      "Understand the 10-minute practice routine.",
      "Complete the Day 0 knowledge test before Day 1.",
    ],
  },
  listeningResource: null,
  vocabulary: ["Orientierung", "Selbstlernkurs", "10-Minuten-Routine", "Writing-Seite", "Mark My Letter", "Redemittel", "Feedback", "Selbstmarkierung"],
});

export default b2Day0Orientation;
