import { makeLesson } from "../buildSelfLearningLesson";

const b2Day5GesundheitUndWohlbefinden = makeLesson({
  level: "B2",
  day: 5,
  chapter: "1.5",
  title: "Gesundheit und Wohlbefinden",
  topic: "Stress, Balance und gesunde Gewohnheiten",
  heroImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1600&q=80",
  grammarFocus: "Kausale Verbindungen mit weil, da, deshalb, daher und aus diesem Grund",
  objectives: [
    "Ich kann über Stress, Gesundheit und Wohlbefinden sprechen.",
    "Ich kann Ursachen und Folgen von Stress erklären.",
    "Ich kann gesunde Gewohnheiten beschreiben und begründen.",
    "Ich kann Empfehlungen für einen gesünderen Alltag formulieren.",
  ],
  explanation: [
    "Gesundheit bedeutet nicht nur, nicht krank zu sein. Es geht auch um Schlaf, Bewegung, Ernährung, mentale Balance und den Umgang mit Stress.",
    "Auf B2-Niveau solltest du Ursachen und Folgen erklären können. Du solltest auch Empfehlungen geben und begründen, warum eine bestimmte Gewohnheit hilfreich ist.",
    "Heute lernst du, kausale Verbindungen richtig zu nutzen. Danach übst du Sprechen, arbeitest mit den Schreibtools und stärkst Lesen/Hören durch externe Ressourcen.",
  ],
  topicQuestions: [
    "Was verursacht bei dir am meisten Stress?",
    "Welche Gewohnheit hilft dir, dich besser zu fühlen?",
    "Welche Rolle spielen Schlaf, Bewegung und Ernährung für dich?",
    "Was würdest du jemandem empfehlen, der sich oft überfordert fühlt?",
  ],
  grammarLesson: {
    rules: [
      "Mit weil und da erklärst du eine Ursache. Das konjugierte Verb steht am Ende: Ich schlafe früher, weil ich am nächsten Tag konzentriert sein möchte.",
      "Mit deshalb, daher und aus diesem Grund zeigst du eine Folge. Danach steht das Verb meistens auf Position 2: Ich habe viel Stress, deshalb mache ich regelmäßig Pausen.",
      "Da klingt oft etwas formeller als weil und passt gut in schriftliche Texte.",
      "Für B2-Antworten ist wichtig: Ursache + Folge + Beispiel + Empfehlung.",
    ],
    examples: [
      "Viele Menschen fühlen sich gestresst, weil sie zu viele Aufgaben gleichzeitig erledigen müssen.",
      "Da regelmäßige Bewegung den Körper stärkt, sollte man sie fest in den Alltag einplanen.",
      "Ich benutze mein Handy abends weniger, deshalb schlafe ich besser.",
      "Aus diesem Grund ist es sinnvoll, kleine Pausen während des Tages zu machen.",
    ],
    miniExercise: "Schreibe sechs Sätze zum Thema Gesundheit: zwei mit weil, zwei mit da und zwei mit deshalb oder daher.",
  },
  speakingTaskType: "Health advice and cause-effect talk",
  speakingTopic: "Sprechen: Erkläre, warum Stress entsteht, wie er sich auf die Gesundheit auswirkt und welche Gewohnheiten helfen können.",
  speakingBuilder: {
    plan: [
      "Einleitung: Beschreibe kurz, warum Gesundheit und Balance wichtig sind.",
      "Hauptteil 1: Erkläre zwei Ursachen von Stress.",
      "Hauptteil 2: Beschreibe Folgen für Körper, Konzentration oder Stimmung.",
      "Hauptteil 3: Gib zwei realistische Empfehlungen.",
      "Schluss: Sage, welche Gewohnheit du persönlich verbessern möchtest.",
    ],
    starters: [
      "Stress entsteht häufig, weil ...",
      "Eine weitere Ursache ist, dass ...",
      "Das kann dazu führen, dass ...",
      "Aus diesem Grund sollte man ...",
      "Eine gesunde Gewohnheit, die mir helfen würde, ist ...",
    ],
  },
  writingTaskType: "Opinion essay / Persönlicher Beitrag",
  writingTopic: "Schreiben: Gesunde Routinen im Alltag. Erkläre Ursachen von Stress, mögliche Folgen und realistische Lösungen.",
  writingBuilder: {
    structure: [
      "Einleitung: Warum Gesundheit und Wohlbefinden im Alltag wichtig sind.",
      "Hauptteil 1: Typische Ursachen von Stress mit Beispielen.",
      "Hauptteil 2: Folgen von Stress für Körper, Lernen oder Arbeit.",
      "Hauptteil 3: Realistische Lösungen und gesunde Gewohnheiten.",
      "Schluss: Deine Meinung und ein persönlicher Plan.",
    ],
    usefulLines: [
      "In der heutigen Gesellschaft stehen viele Menschen unter großem Druck.",
      "Ein häufiger Grund für Stress ist, dass ...",
      "Das kann langfristig dazu führen, dass ...",
      "Eine realistische Lösung wäre, ...",
      "Meiner Meinung nach beginnt Wohlbefinden mit kleinen, regelmäßigen Gewohnheiten.",
    ],
  },
  phrases: [
    "weil / da",
    "deshalb / daher",
    "aus diesem Grund",
    "Stress abbauen",
    "sich überfordert fühlen",
    "regelmäßige Bewegung",
    "auf die Gesundheit achten",
    "Pausen einplanen",
  ],
  tasks: {
    speaking: "Sprich 2–3 Minuten über Stress, Gesundheit und gesunde Gewohnheiten. Nutze mindestens vier kausale Verbindungen.",
    writing: "Schreibe 180–220 Wörter: Gesunde Routinen im Alltag. Erkläre Ursachen, Folgen und Lösungen.",
    reading: "Lies einen Artikel über Gesundheit, Stress oder Wohlbefinden. Notiere Hauptaussage, 5 Wörter und deine Meinung.",
    listening: "Höre einen kurzen Beitrag über Gesundheit oder Stress. Fasse ihn in 4 Sätzen zusammen.",
  },
  readingResource: {
    title: "Welt.de Suche: Gesundheit, Stress, Wohlbefinden",
    description: "Open the search and choose one article about health, stress or wellbeing. Focus on causes, effects and useful vocabulary.",
    url: "https://www.welt.de/suche?q=Gesundheit%20Stress%20Wohlbefinden",
    tasks: [
      "Write the title of the article you chose.",
      "Write the main idea in one German sentence.",
      "Find 5 useful expressions connected to health, stress or wellbeing.",
      "Write 4–5 sentences: Which advice from the article could help students or workers?",
    ],
  },
  listeningResource: {
    title: "DW Deutsch lernen search: Gesundheit und Stress",
    description: "Choose one short DW audio/video connected to health, stress or wellbeing. Listen twice and write the key points.",
    url: "https://www.dw.com/de/suche/s-100853?searchNavigationId=9097&item=Gesundheit%20Stress",
    tasks: [
      "Listen once and write the topic.",
      "Listen again and write 3 important points.",
      "Write 3 useful health-related expressions you heard.",
      "Record yourself summarising the audio in 60 seconds.",
    ],
  },
  vocabulary: [
    "Gesundheit",
    "Wohlbefinden",
    "Stress",
    "Belastung",
    "Erholung",
    "Gewohnheit",
    "Balance",
    "Konzentration",
  ],
});

export default b2Day5GesundheitUndWohlbefinden;
