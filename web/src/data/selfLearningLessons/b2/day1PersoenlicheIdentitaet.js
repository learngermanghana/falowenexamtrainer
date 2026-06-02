import { buildWeltReadingSearchUrl, makeLesson } from "../buildSelfLearningLesson";

const b2Day1PersoenlicheIdentitaet = makeLesson({
  level: "B2",
  day: 1,
  chapter: "1.1",
  title: "Persönliche Identität und Selbstverständnis",
  topic: "Über sich selbst, Werte und persönliche Entwicklung sprechen",
  heroImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80",
  grammarFocus: "Adjektivdeklination, klare Begründungen und strukturierte Selbstdarstellung",
  objectives: [
    "Ich kann mich auf B2-Niveau differenzierter vorstellen.",
    "Ich kann über Werte, Erfahrungen und persönliche Entwicklung sprechen.",
    "Ich kann meine Meinung zu Online-Identität und realer Identität begründen.",
    "Ich kann Falowen AI nutzen, um Sprechen und Schreiben selbstständig zu verbessern.",
  ],
  explanation: [
    "Persönliche Identität bedeutet mehr als Name, Alter oder Herkunft. Es geht darum, wie du dich selbst siehst, welche Werte dir wichtig sind und welche Erfahrungen dich geprägt haben.",
    "Auf B2-Niveau solltest du nicht nur einfache Fakten nennen. Du solltest Gründe geben, Beispiele verwenden und Gegensätze erklären können, zum Beispiel zwischen deinem echten Leben und deinem Verhalten online.",
    "Heute baust du zuerst Wissen und Sprache auf. Danach übst du Sprechen und Schreiben mit Falowen AI und markierst deinen Fortschritt selbst.",
  ],
  topicQuestions: [
    "Welche drei Wörter beschreiben deine Persönlichkeit am besten?",
    "Welche Erfahrung hat dich besonders geprägt?",
    "Bist du online genauso wie im echten Leben? Warum oder warum nicht?",
    "Welche Werte sind dir im Leben besonders wichtig?",
  ],
  grammarLesson: {
    rules: [
      "Adjektive helfen dir, Personen, Werte und Erfahrungen genauer zu beschreiben: ein wichtiger Wert, eine prägende Erfahrung, ein ehrlicher Mensch.",
      "Nach dem unbestimmten Artikel verändert sich das Adjektiv: ein offener Mensch, eine wichtige Entscheidung, ein starkes Selbstbewusstsein.",
      "Nach dem bestimmten Artikel ist die Endung meistens -e oder -en: der offene Mensch, die wichtige Entscheidung, das starke Selbstbewusstsein.",
      "Verbinde deine Beschreibung mit Begründungen: weil, da, deshalb, aus diesem Grund, zum Beispiel.",
    ],
    examples: [
      "Ich bin ein eher ruhiger Mensch, weil ich zuerst beobachte, bevor ich reagiere.",
      "Eine prägende Erfahrung war meine erste Arbeitsstelle, denn dort habe ich Verantwortung gelernt.",
      "In sozialen Medien zeigen viele Menschen nur eine positive Seite ihres Lebens.",
      "Ein ehrliches Selbstbild ist wichtig, damit man seine Stärken und Schwächen besser erkennt.",
    ],
    miniExercise: "Schreibe fünf Adjektiv-Nomen-Verbindungen über dich: z. B. ein ruhiger Mensch, eine wichtige Erfahrung. Bilde danach mit drei davon ganze Sätze.",
  },
  speakingTaskType: "Personal description and opinion talk",
  speakingTopic: "Sprechen: Erkläre, wer du bist, welche Werte dir wichtig sind und ob deine Online-Identität deiner echten Persönlichkeit entspricht.",
  speakingBuilder: {
    plan: [
      "Einleitung: Stelle dich kurz vor und nenne 2–3 Eigenschaften.",
      "Hauptteil 1: Erkläre eine Erfahrung, die dich geprägt hat.",
      "Hauptteil 2: Vergleiche dein Verhalten online und offline.",
      "Schluss: Sage, welchen Wert du in Zukunft stärker leben möchtest.",
    ],
    starters: [
      "Ich würde mich als ... beschreiben, weil ...",
      "Eine Erfahrung, die mich geprägt hat, war ...",
      "Online wirke ich manchmal ..., aber im echten Leben ...",
      "Besonders wichtig ist mir ..., denn ...",
      "In Zukunft möchte ich ... stärker entwickeln.",
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
    "Ich würde mich als ... beschreiben.",
    "Eine prägende Erfahrung war ...",
    "Im Gegensatz dazu ...",
    "Auf der einen Seite ..., auf der anderen Seite ...",
    "Meiner Meinung nach ...",
    "Zusammenfassend lässt sich sagen, dass ...",
  ],
  tasks: {
    speaking: "Sprich 2–3 Minuten über deine persönliche Identität. Nutze mindestens 5 Adjektiv-Nomen-Verbindungen und nenne ein Beispiel aus deinem Leben.",
    writing: "Schreibe 180–220 Wörter: Wer bin ich online – wer bin ich offline? Vergleiche beide Seiten und begründe deine Meinung.",
    reading: "Lies einen Artikel über Identität, soziale Medien oder Selbstbild. Notiere Hauptaussage, 5 Wörter und deine Meinung.",
    listening: "Höre einen kurzen Beitrag über Identität, Persönlichkeit oder soziale Medien. Fasse ihn in 4 Sätzen zusammen.",
  },
  readingResource: {
    title: "WELT article search: Identität, soziale Medien, Selbstbild",
    description: "Open this stable site search and choose one article about identity, social media or self-image. Focus on the main idea and useful vocabulary.",
    url: buildWeltReadingSearchUrl("Identität soziale Medien Selbstbild"),
    tasks: [
      "Write the title of the article you chose.",
      "Write the main idea in one German sentence.",
      "Find 5 useful words or expressions connected to identity or social media.",
      "Write 4–5 sentences: Do you agree with the article? Why or why not?",
    ],
  },
  listeningResource: {
    title: "DW Deutsch lernen search: Identität und soziale Medien",
    description: "Choose one short DW audio/video connected to identity, personality or social media. Listen twice and focus on the key points.",
    url: "https://www.dw.com/de/suche/s-100853?searchNavigationId=9097&item=Identit%C3%A4t%20soziale%20Medien",
    tasks: [
      "Listen once and write the topic.",
      "Listen again and write 3 important points.",
      "Write 3 useful expressions you heard.",
      "Record yourself summarising the audio in 60 seconds.",
    ],
  },
  vocabulary: [
    "Identität",
    "Selbstbild",
    "Persönlichkeit",
    "authentisch",
    "prägend",
    "soziale Medien",
    "Werte",
    "Selbstbewusstsein",
  ],
});

export default b2Day1PersoenlicheIdentitaet;
