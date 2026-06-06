import { makeLesson } from "../buildSelfLearningLesson";

const c1Day0Orientation = makeLesson({
  level: "C1",
  day: 0,
  chapter: "0",
  title: "Day 0 Orientation: How to use the C1 self-learning course",
  topic: "Start here before Day 1. Learn how Falowen works, how the C1 course is designed, and what you should do every study day.",
  heroImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
  grammarFocus: "Course orientation: Falowen dashboard, Course Book, Learn/Speak/Write/Finish flow, AI practice, feedback and completion",
  objectives: [
    "Ich verstehe, wie der C1-Selbstlernkurs in Falowen aufgebaut ist.",
    "Ich weiß, wofür Learn, Speak, Write und Finish ab Day 1 benutzt werden.",
    "Ich weiß, wo ich AI practice, Mark My Letter, References, Ideas, Reading, Listening und Vocabulary finde.",
    "Ich verstehe, dass Day 0 nur Orientierung ist und keine Schreibaufgabe enthält.",
  ],
  explanation: [
    "Day 0 ist deine Orientierung. Lies diese Seite zuerst, bevor du mit Day 1 beginnst. Diese Seite ist keine Schreibaufgabe und kein Prüfungstraining.",
    "Der C1-Kurs ist als Selbstlernkurs aufgebaut. Ab Day 1 arbeitest du mit vier klaren Bereichen: Learn, Speak, Write und Finish.",
    "Learn erklärt das Thema und die Grammatik. Speak ist für mündliche Übung. Write ist für Schreibaufgaben mit Mark My Letter, References und Ideas. Finish ist für Reading, Listening, Vocabulary und Abschluss der Lektion.",
    "Du sollst nicht einfach Texte kopieren. Nutze Falowen AI als Lernhilfe: üben, Feedback lesen, verbessern und dann zur nächsten Lektion gehen.",
  ],
  topicQuestions: [
    "Was ist der Unterschied zwischen Day 0 und Day 1?",
    "Wofür benutzt du Learn, Speak, Write und Finish?",
    "Warum ist Mark My Letter eine Lernhilfe und nicht nur eine Korrektur?",
    "Was solltest du tun, wenn du mit einer Lektion fertig bist?",
  ],
  grammarLesson: {
    title: "How the C1 course is designed",
    explanation: [
      "C1 verlangt präzise Sprache, klare Argumentation und selbstständige Verbesserung. Deshalb ist jede Lektion in kleine Schritte gegliedert.",
      "Du beginnst mit Learn, damit du Thema, Grammatik und Redemittel verstehst. Danach übst du aktiv in Speak und Write. Am Ende nutzt du Finish für Reading, Listening, Vocabulary und Lesson completion.",
      "Die C1-Schreibaufgaben beginnen ab Day 1. Day 0 erklärt nur den Ablauf, damit du später nicht verloren bist.",
    ],
    rules: [
      "Day 0 ist Orientierung: lesen, verstehen und den Knowledge Test beantworten.",
      "Ab Day 1 nutzt du Learn für Thema, Ziele, Grammatik und Wissensfragen.",
      "Speak ist für mündliche Argumentation und Aussprachetraining mit Falowen AI.",
      "Write ist für Schreibaufgaben, Mark My Letter, References und Ideas Generator.",
      "Finish ist für Reading, Listening, Vocabulary und Mark lesson complete.",
      "Wenn du Fehler bekommst, verbessere deine eigene Antwort, statt eine fertige Antwort zu kopieren.",
    ],
    examples: [
      "Learn: Ich lese das Thema und verstehe die Grammatik.",
      "Speak: Ich erkläre meine Meinung laut und übe mit AI feedback.",
      "Write: Ich schreibe meinen eigenen Text, markiere ihn und verbessere ihn.",
      "Finish: Ich lese oder höre zusätzlich, sammle Wörter und markiere die Lektion als abgeschlossen.",
    ],
    miniExercise: "Notiere drei Dinge: 1) Wo findest du die Schreibkorrektur? 2) Was machst du im Finish-Bereich? 3) Warum sollst du AI feedback zur Verbesserung nutzen?",
    knowledgeTest: [
      {
        question: "Was ist Day 0 im C1-Kurs?",
        options: ["Eine Orientierung vor Day 1", "Eine normale Schreibaufgabe", "Eine Abschlussprüfung", "Ein Speaking-Test"],
        answer: "Eine Orientierung vor Day 1",
        explanation: "Day 0 erklärt, wie Falowen und der C1-Kurs funktionieren. Die eigentlichen Lektionen beginnen ab Day 1.",
      },
      {
        question: "Wofür ist der Learn-Bereich ab Day 1 gedacht?",
        options: ["Thema, Ziele, Grammatik und Verständnis", "Nur Zoom-Link", "Nur Zahlung", "Nur Zertifikat"],
        answer: "Thema, Ziele, Grammatik und Verständnis",
        explanation: "Learn ist der Start jeder Lektion. Dort verstehst du Thema, Ziele, Grammatik und wichtige Fragen.",
      },
      {
        question: "Wofür nutzt du den Write-Bereich?",
        options: ["Für Schreibaufgaben, Mark My Letter, References und Ideas", "Für Attendance Check-in", "Für Kursgebühr", "Für Zoom-Unterricht"],
        answer: "Für Schreibaufgaben, Mark My Letter, References und Ideas",
        explanation: "Im Write-Bereich übst du Schreiben und bekommst AI feedback. References und Ideas helfen dir beim Verbessern.",
      },
      {
        question: "Was solltest du tun, nachdem Falowen AI Feedback gibt?",
        options: ["Die Antwort verbessern", "Alles ignorieren", "Nur kopieren und fertig", "Die Lektion neu starten"],
        answer: "Die Antwort verbessern",
        explanation: "Feedback ist zum Lernen da. Du sollst deine eigene Antwort verbessern.",
      },
      {
        question: "Was passiert im Finish-Bereich?",
        options: ["Reading, Listening, Vocabulary und Lesson completion", "Nur Schreiben", "Nur Grammatiktest", "Nur Account-Profil"],
        answer: "Reading, Listening, Vocabulary und Lesson completion",
        explanation: "Finish hilft dir, die Lektion abzuschließen und zusätzliche Skills zu üben.",
      },
    ],
  },
  phrases: [
    "Learn → Speak → Write → Finish",
    "AI feedback lesen und verbessern",
    "Mark My Letter nutzen",
    "References und Ideas Generator verwenden",
    "Reading, Listening und Vocabulary abschließen",
    "Lesson complete markieren",
  ],
  tasks: {
    reading: "Lies die Day-0-Orientierung und beantworte den Knowledge Test.",
    listening: "Optional: Erkläre dir selbst laut, wie Learn, Speak, Write und Finish funktionieren.",
  },
  readingResource: null,
  listeningResource: null,
  vocabulary: ["Orientierung", "Selbstlernkurs", "Course Book", "Learn", "Speak", "Write", "Finish", "Mark My Letter", "References", "Ideas Generator", "Vocabulary"],
});

export default c1Day0Orientation;
