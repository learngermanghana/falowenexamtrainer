import { makeLesson } from "../buildSelfLearningLesson";

const b2Day8ReisenUndMobilitaet = makeLesson({
  level: "B2",
  day: 8,
  chapter: "2.3",
  title: "Reisen und Mobilität",
  topic: "Transport, Urlaub und nachhaltige Entscheidungen",
  heroImage: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
  grammarFocus: "Vergleichsformen und abwägende Argumentation mit Vor- und Nachteilen",
  objectives: [
    "Ich kann über Reisen, Verkehrsmittel und Mobilität sprechen.",
    "Ich kann verschiedene Verkehrsmittel vergleichen und bewerten.",
    "Ich kann Vor- und Nachteile einer Reiseform strukturiert darstellen.",
    "Ich kann nachhaltige Entscheidungen beim Reisen begründen.",
  ],
  explanation: [
    "Mobilität bedeutet, wie Menschen sich im Alltag oder auf Reisen fortbewegen. Dazu gehören Auto, Bus, Bahn, Fahrrad, Flugzeug und neue digitale Mobilitätsangebote.",
    "Auf B2-Niveau solltest du nicht nur sagen, welches Verkehrsmittel du bevorzugst. Du solltest erklären können, welche Vorteile und Nachteile es gibt und welche Lösung in einer bestimmten Situation sinnvoll ist.",
    "Heute lernst du, Vergleiche klar zu formulieren und deine Meinung abgewogen darzustellen. Danach übst du Sprechen, nutzt die Schreibtools und trainierst Lesen/Hören.",
  ],
  topicQuestions: [
    "Welches Verkehrsmittel nutzt du am häufigsten und warum?",
    "Was ist wichtiger beim Reisen: Preis, Komfort, Zeit oder Umwelt?",
    "Wann ist Fliegen sinnvoll und wann sollte man darauf verzichten?",
    "Wie könnte Mobilität in Städten verbessert werden?",
  ],
  grammarLesson: {
    rules: [
      "Mit Komparativ vergleichst du zwei Dinge: schneller, günstiger, bequemer, umweltfreundlicher.",
      "Mit Superlativ beschreibst du den höchsten Grad: am schnellsten, am günstigsten, am bequemsten.",
      "Für abwägende Argumentation nutzt du: einerseits ..., andererseits ..., im Vergleich zu ..., während ...",
      "Nach während steht ein Nebensatz mit Verb am Ende: Während das Auto flexibel ist, ist die Bahn oft umweltfreundlicher.",
    ],
    examples: [
      "Die Bahn ist oft umweltfreundlicher als das Auto, aber nicht immer schneller.",
      "Fliegen ist am schnellsten, verursacht aber häufig mehr CO₂.",
      "Einerseits ist das Auto bequem, andererseits kann es in der Stadt teuer und stressig sein.",
      "Während öffentliche Verkehrsmittel günstiger sein können, bietet das Auto mehr Flexibilität.",
    ],
    miniExercise: "Schreibe sechs Vergleichssätze über Verkehrsmittel. Nutze mindestens drei Komparative und zwei Strukturen mit einerseits/andererseits oder während.",
  },
  speakingTaskType: "Travel comparison and recommendation talk",
  speakingTopic: "Sprechen: Vergleiche zwei Verkehrsmittel, erkläre Vor- und Nachteile und empfehle eine nachhaltige Lösung für eine Reise oder den Alltag.",
  speakingBuilder: {
    plan: [
      "Einleitung: Nenne die Situation, zum Beispiel Alltag, Reise oder Stadtverkehr.",
      "Hauptteil 1: Vergleiche zwei Verkehrsmittel nach Preis, Zeit, Komfort und Umwelt.",
      "Hauptteil 2: Erkläre Vor- und Nachteile mit Beispielen.",
      "Schluss: Gib eine Empfehlung und begründe sie.",
    ],
    starters: [
      "Wenn man ... vergleicht, fällt auf, dass ...",
      "Einerseits ist ... praktisch, andererseits ...",
      "Im Vergleich zu ... ist ...",
      "Aus Umweltgründen wäre es sinnvoll, ...",
      "Ich würde empfehlen, ..., weil ...",
    ],
  },
  writingTaskType: "Opinion essay / Erörterung",
  writingTopic: "Schreiben: Nachhaltig reisen. Vergleiche verschiedene Verkehrsmittel, erkläre Vor- und Nachteile und formuliere deine Meinung.",
  writingBuilder: {
    structure: [
      "Einleitung: Stelle das Thema Reisen und nachhaltige Mobilität vor.",
      "Hauptteil 1: Vorteile und Nachteile eines Verkehrsmittels.",
      "Hauptteil 2: Vergleich mit einer anderen Reiseform.",
      "Hauptteil 3: Umweltaspekt und realistische Entscheidungen.",
      "Schluss: Deine persönliche Empfehlung.",
    ],
    usefulLines: [
      "Reisen gehört für viele Menschen zum Alltag und zur Freizeit.",
      "Ein großer Vorteil von ... besteht darin, dass ...",
      "Im Vergleich dazu ist ... zwar ..., aber ...",
      "Aus ökologischer Sicht sollte man berücksichtigen, dass ...",
      "Meiner Meinung nach sollte man je nach Situation bewusst entscheiden, welches Verkehrsmittel sinnvoll ist.",
    ],
  },
  phrases: [
    "im Vergleich zu ...",
    "einerseits / andererseits",
    "während ...",
    "umweltfreundlicher als ...",
    "bequemer / günstiger / schneller",
    "eine nachhaltige Entscheidung treffen",
    "öffentliche Verkehrsmittel nutzen",
  ],
  tasks: {
    speaking: "Sprich 2–3 Minuten über Reisen und Mobilität. Vergleiche mindestens zwei Verkehrsmittel und nutze vier Vergleichsformen.",
    writing: "Schreibe 180–220 Wörter: Nachhaltig reisen. Erkläre Vor- und Nachteile verschiedener Verkehrsmittel und deine Meinung.",
    reading: "Lies einen Artikel über Reisen, Verkehr oder nachhaltige Mobilität. Notiere Hauptaussage, 5 Wörter und deine Meinung.",
    listening: "Höre einen kurzen Beitrag über Reisen oder Mobilität. Fasse ihn in 4 Sätzen zusammen.",
  },
  readingResource: {
    title: "Welt.de Suche: Reisen, Mobilität, Verkehr",
    description: "Open the search and choose one article about travel, traffic or sustainable mobility. Focus on comparisons and useful vocabulary.",
    url: "https://www.welt.de/suche?q=Reisen%20Mobilit%C3%A4t%20Verkehr",
    tasks: [
      "Write the title of the article you chose.",
      "Write the main idea in one German sentence.",
      "Find 5 useful expressions connected to travel or mobility.",
      "Write 4–5 sentences: Which travel choice would you recommend and why?",
    ],
  },
  listeningResource: {
    title: "DW Deutsch lernen search: Reisen und Mobilität",
    description: "Choose one short DW audio/video connected to travel, traffic or mobility. Listen twice and write the key points.",
    url: "https://www.dw.com/de/suche/s-100853?searchNavigationId=9097&item=Reisen%20Mobilit%C3%A4t",
    tasks: [
      "Listen once and write the topic.",
      "Listen again and write 3 important points.",
      "Write 3 useful travel-related expressions you heard.",
      "Record yourself summarising the audio in 60 seconds.",
    ],
  },
  vocabulary: [
    "Mobilität",
    "Verkehrsmittel",
    "öffentlicher Verkehr",
    "Nachhaltigkeit",
    "Reisekosten",
    "Komfort",
    "Flexibilität",
    "umweltfreundlich",
  ],
});

export default b2Day8ReisenUndMobilitaet;
