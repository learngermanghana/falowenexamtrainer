import { makeLesson } from "../buildSelfLearningLesson";

const b2Day12KulturUndFreizeit = makeLesson({
  level: "B2",
  day: 12,
  chapter: "3.2",
  title: "Kultur und Freizeit",
  topic: "Hobbys, kulturelle Angebote und persönliche Interessen",
  heroImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=80",
  grammarFocus: "Adjektive, Präpositionen und Bewertungen für kulturelle Erfahrungen",
  objectives: [
    "Ich kann über Freizeit, Hobbys und kulturelle Angebote sprechen.",
    "Ich kann eine kulturelle Veranstaltung oder ein Hobby beschreiben und bewerten.",
    "Ich kann passende Präpositionen mit Interessen und Aktivitäten nutzen.",
    "Ich kann eine Empfehlung begründen und auf Vor- und Nachteile eingehen.",
  ],
  explanation: [
    "Kultur und Freizeit sind wichtige Alltagsthemen. Dazu gehören Musik, Filme, Theater, Sport, Lesen, Reisen, Feste und persönliche Hobbys.",
    "Auf B2-Niveau solltest du nicht nur sagen, was du gerne machst. Du solltest erklären können, warum dir eine Aktivität wichtig ist, welche Wirkung sie hat und ob du sie anderen empfehlen würdest.",
    "Heute lernst du, Freizeitaktivitäten und kulturelle Erfahrungen genauer zu beschreiben. Danach übst du Sprechen, nutzt die Schreibtools und trainierst Lesen/Hören.",
  ],
  topicQuestions: [
    "Welche Freizeitaktivität ist für dich besonders wichtig? Warum?",
    "Welche kulturelle Veranstaltung hast du zuletzt besucht oder würdest du gern besuchen?",
    "Sollten Menschen mehr Zeit für Kultur und Hobbys einplanen? Warum?",
    "Welche Rolle spielen Musik, Filme oder Sport in deinem Alltag?",
  ],
  grammarLesson: {
    rules: [
      "Viele Verben und Adjektive brauchen feste Präpositionen: sich interessieren für, teilnehmen an, begeistert sein von, sich freuen auf.",
      "Mit Bewertungen kannst du Erfahrungen genauer beschreiben: beeindruckend, abwechslungsreich, entspannend, sinnvoll, enttäuschend.",
      "Nach Präpositionen steht oft ein bestimmter Kasus: Ich interessiere mich für Musik. Ich nehme an einem Kurs teil.",
      "Für Empfehlungen nutzt du: Ich würde ... empfehlen, weil ..., Besonders positiv fand ich ..., Kritisch sehe ich ...",
    ],
    examples: [
      "Ich interessiere mich besonders für Musik, weil sie mir hilft, mich zu entspannen.",
      "Viele Jugendliche nehmen an Sportkursen teil, um neue Kontakte zu knüpfen.",
      "Ich war von der Veranstaltung beeindruckt, obwohl sie relativ kurz war.",
      "Ich würde den Kurs empfehlen, weil er abwechslungsreich und praktisch ist.",
    ],
    miniExercise: "Schreibe sechs Sätze über deine Freizeit. Nutze: sich interessieren für, teilnehmen an, begeistert sein von, sich freuen auf, empfehlen und kritisch sehen.",
  },
  speakingTaskType: "Culture and hobby recommendation talk",
  speakingTopic: "Sprechen: Beschreibe ein Hobby oder eine kulturelle Aktivität, erkläre ihre Bedeutung für dich und empfehle sie einer anderen Person.",
  speakingBuilder: {
    plan: [
      "Einleitung: Nenne die Freizeitaktivität oder kulturelle Erfahrung.",
      "Hauptteil 1: Beschreibe, was man dabei macht und warum es interessant ist.",
      "Hauptteil 2: Erkläre, welche Vorteile diese Aktivität hat.",
      "Hauptteil 3: Nenne auch einen möglichen Nachteil oder eine Schwierigkeit.",
      "Schluss: Gib eine Empfehlung und begründe sie.",
    ],
    starters: [
      "Eine Freizeitaktivität, die mir wichtig ist, ist ...",
      "Ich interessiere mich dafür, weil ...",
      "Besonders positiv finde ich, dass ...",
      "Ein möglicher Nachteil ist jedoch ...",
      "Ich würde diese Aktivität empfehlen, weil ...",
    ],
  },
  writingTaskType: "Review / Recommendation",
  writingTopic: "Schreiben: Bewerte eine kulturelle Veranstaltung, einen Kurs oder ein Hobby. Beschreibe die Erfahrung, nenne positive und kritische Punkte und gib eine Empfehlung.",
  writingBuilder: {
    structure: [
      "Einleitung: Was bewertest du und wann/wo hast du es erlebt?",
      "Hauptteil 1: Beschreibe die Aktivität oder Veranstaltung.",
      "Hauptteil 2: Nenne positive Punkte mit Beispielen.",
      "Hauptteil 3: Nenne einen kritischen Punkt oder Verbesserungsvorschlag.",
      "Schluss: Empfehlung mit klarer Begründung.",
    ],
    usefulLines: [
      "Vor Kurzem habe ich ... besucht/ausprobiert.",
      "Besonders gut gefallen hat mir, dass ...",
      "Die Atmosphäre war ..., und das Angebot war ...",
      "Kritisch sehe ich jedoch, dass ...",
      "Insgesamt würde ich ... empfehlen, weil ...",
    ],
  },
  phrases: [
    "sich interessieren für ...",
    "teilnehmen an ...",
    "begeistert sein von ...",
    "sich freuen auf ...",
    "abwechslungsreich",
    "entspannend",
    "eine Empfehlung aussprechen",
    "kritisch sehen",
  ],
  tasks: {
    speaking: "Sprich 2–3 Minuten über ein Hobby oder eine kulturelle Aktivität. Nutze mindestens sechs Bewertungswörter oder Präpositionsverben.",
    writing: "Schreibe 180–220 Wörter: Bewerte eine kulturelle Veranstaltung, einen Kurs oder ein Hobby und gib eine Empfehlung.",
    reading: "Lies einen Artikel über Kultur, Freizeit oder Veranstaltungen. Notiere Hauptaussage, 5 Wörter und deine Meinung.",
    listening: "Höre einen kurzen Beitrag über Kultur oder Freizeit. Fasse ihn in 4 Sätzen zusammen.",
  },
  readingResource: {
    title: "Welt.de Suche: Kultur, Freizeit, Veranstaltungen",
    description: "Open the search and choose one article about culture, leisure or events. Focus on descriptions, opinions and useful expressions.",
    url: "https://www.welt.de/suche?q=Kultur%20Freizeit%20Veranstaltungen",
    tasks: [
      "Write the title of the article you chose.",
      "Write the main idea in one German sentence.",
      "Find 5 useful expressions connected to culture or leisure.",
      "Write 4–5 sentences: Would you recommend this activity or event? Why?",
    ],
  },
  listeningResource: {
    title: "DW Deutsch lernen search: Kultur und Freizeit",
    description: "Choose one short DW audio/video connected to culture, hobbies or leisure. Listen twice and write the key points.",
    url: "https://www.dw.com/de/suche/s-100853?searchNavigationId=9097&item=Kultur%20Freizeit",
    tasks: [
      "Listen once and write the topic.",
      "Listen again and write 3 important points.",
      "Write 3 useful culture-related expressions you heard.",
      "Record yourself summarising the audio in 60 seconds.",
    ],
  },
  vocabulary: [
    "Kultur",
    "Freizeit",
    "Hobby",
    "Veranstaltung",
    "Empfehlung",
    "Bewertung",
    "abwechslungsreich",
    "entspannend",
  ],
});

export default b2Day12KulturUndFreizeit;
