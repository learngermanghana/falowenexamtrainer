import { makeLesson } from "../buildSelfLearningLesson";

const b2Day0Orientation = makeLesson({
  level: "B2",
  day: 0,
  chapter: "0",
  title: "Day 0 Orientation: How to use the B2 self-learning course",
  topic: "Start here before Day 1. Learn how Falowen works, how the B2 course is designed, and how to study with short active practice blocks.",
  heroImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80",
  grammarFocus: "Course orientation: Falowen dashboard, Course Book, Learn/Speak/Write/Finish flow, 10-minute practice, AI feedback and completion",
  objectives: [
    "Ich verstehe, wie der B2-Selbstlernkurs in Falowen aufgebaut ist.",
    "Ich weiß, wofür Learn, Speak, Write und Finish ab Day 1 benutzt werden.",
    "Ich weiß, wie ich mit kurzen 10-Minuten-Blöcken aktiv lernen kann.",
    "Ich verstehe, dass Day 0 nur Orientierung ist und keine Schreibaufgabe enthält.",
  ],
  explanation: [
    "Day 0 ist deine Orientierung. Lies diese Seite zuerst, bevor du mit Day 1 beginnst. Diese Seite ist keine Schreibaufgabe und kein Prüfungstraining.",
    "Der B2-Kurs ist als Selbstlernkurs aufgebaut. Ab Day 1 arbeitest du mit vier klaren Bereichen: Learn, Speak, Write und Finish.",
    "Learn erklärt das Thema, Ziele und Grammatik. Speak ist für mündliche Übung. Write ist für Schreibaufgaben mit Mark My Letter, References und Ideas. Finish ist für Reading, Listening, Vocabulary und Abschluss der Lektion.",
    "Arbeite kurz, aber aktiv: 10 Minuten Learn lesen, 10 Minuten Sprechen üben, 10 Minuten Schreiben verbessern und bei Bedarf 10 Minuten Reading oder Listening ergänzen.",
  ],
  topicQuestions: [
    "Was ist der Unterschied zwischen Day 0 und Day 1?",
    "Wofür benutzt du Learn, Speak, Write und Finish?",
    "Wie kannst du mit 10-Minuten-Blöcken regelmäßig üben?",
    "Warum solltest du AI feedback verbessern und nicht nur kopieren?",
  ],
  grammarLesson: {
    title: "How the B2 course is designed",
    explanation: [
      "B2 verlangt, dass du Meinungen erklärst, Gründe nennst, Beispiele gibst und deine Antworten strukturierst. Deshalb ist jede Lektion in kleine Schritte gegliedert.",
      "Du beginnst mit Learn, damit du Thema, Grammatik und Redemittel verstehst. Danach übst du aktiv in Speak und Write. Am Ende nutzt du Finish für Reading, Listening, Vocabulary und Lesson completion.",
      "Die B2-Schreibaufgaben beginnen ab Day 1. Day 0 erklärt nur den Ablauf, damit du später nicht verloren bist.",
    ],
    rules: [
      "Day 0 ist Orientierung: lesen, verstehen und den Knowledge Test beantworten.",
      "Ab Day 1 nutzt du Learn für Thema, Ziele, Grammatik und wichtige Redemittel.",
      "Speak ist für mündliche Übung und Aussprachetraining mit Falowen AI.",
      "Write ist für Schreibaufgaben, Mark My Letter, References und Ideas Generator.",
      "Finish ist für Reading, Listening, Vocabulary und Mark lesson complete.",
      "Nutze 10-Minuten-Blöcke, wenn du wenig Zeit hast. Kurz und aktiv ist besser als lang und passiv.",
    ],
    examples: [
      "Learn: Ich lese das Thema und verstehe die Grammatik.",
      "Speak: Ich spreche 60–90 Sekunden und verbessere meine Antwort.",
      "Write: Ich schreibe meinen Text, markiere ihn und verbessere ihn.",
      "Finish: Ich lese oder höre zusätzlich, sammle Wörter und markiere die Lektion als abgeschlossen.",
    ],
    miniExercise: "Notiere drei Dinge: 1) Welche 10-Minuten-Übung kannst du jeden Tag machen? 2) Wo findest du Mark My Letter? 3) Was machst du im Finish-Bereich?",
    knowledgeTest: [
      {
        question: "Was ist Day 0 im B2-Kurs?",
        options: ["Eine Orientierung vor Day 1", "Eine normale Schreibaufgabe", "Eine Abschlussprüfung", "Nur ein Zoom-Link"],
        answer: "Eine Orientierung vor Day 1",
        explanation: "Day 0 erklärt, wie Falowen und der B2-Kurs funktionieren. Die eigentlichen Lektionen beginnen ab Day 1.",
      },
      {
        question: "Wofür ist der Learn-Bereich ab Day 1 gedacht?",
        options: ["Thema, Ziele, Grammatik und Redemittel", "Nur Zahlung", "Nur Attendance", "Nur Zertifikat"],
        answer: "Thema, Ziele, Grammatik und Redemittel",
        explanation: "Learn ist der Start jeder Lektion. Dort verstehst du das Thema und die Sprache, die du brauchst.",
      },
      {
        question: "Welche kurze Routine passt zum B2-Selbstlernen?",
        options: ["10 Minuten aktiv üben", "Nur einmal pro Monat lernen", "Nur Antworten kopieren", "Nur Videos öffnen"],
        answer: "10 Minuten aktiv üben",
        explanation: "Kurze aktive Übung hilft dir, regelmäßig zu bleiben und dich Schritt für Schritt zu verbessern.",
      },
      {
        question: "Wofür nutzt du den Write-Bereich?",
        options: ["Für Schreibaufgaben, Mark My Letter, References und Ideas", "Für Zoom-Unterricht", "Für Kursgebühr", "Für Attendance QR"],
        answer: "Für Schreibaufgaben, Mark My Letter, References und Ideas",
        explanation: "Im Write-Bereich übst du Schreiben und bekommst AI feedback.",
      },
      {
        question: "Was solltest du nach AI feedback tun?",
        options: ["Die eigene Antwort verbessern", "Feedback ignorieren", "Nur kopieren", "Die Lektion abbrechen"],
        answer: "Die eigene Antwort verbessern",
        explanation: "Feedback ist zum Lernen da. Du sollst deine eigene Antwort verbessern.",
      },
    ],
  },
  phrases: [
    "Learn → Speak → Write → Finish",
    "10 Minuten aktiv üben",
    "AI feedback lesen und verbessern",
    "Mark My Letter nutzen",
    "References und Ideas Generator verwenden",
    "Lesson complete markieren",
  ],
  tasks: {
    reading: "Lies die Day-0-Orientierung und beantworte den Knowledge Test.",
    listening: "Optional: Erkläre dir selbst laut, wie Learn, Speak, Write und Finish funktionieren.",
  },
  readingResource: null,
  listeningResource: null,
  vocabulary: ["Orientierung", "Selbstlernkurs", "Course Book", "Learn", "Speak", "Write", "Finish", "10-Minuten-Routine", "Mark My Letter", "References", "Ideas Generator"],
});

export default b2Day0Orientation;
