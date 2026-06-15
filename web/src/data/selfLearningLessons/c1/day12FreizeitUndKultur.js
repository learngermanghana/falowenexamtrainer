import { makeLesson } from "../buildSelfLearningLesson";

const c1Day12FreizeitUndKultur = makeLesson({
  level: "C1",
  day: 12,
  chapter: "3.2",
  title: "Freizeit und Kultur",
  topic: "Kulturelle Angebote, soziale Teilhabe, Lebensqualität und kommunale Kulturförderung differenziert bewerten",
  heroImage: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80",
  grammarFocus: "Erweiterte Vergleichsformen: Nuancen, Intensität, Gleichheit, Entwicklung und Vergleichsrahmen präzise ausdrücken",
  objectives: [
    "Ich kann Freizeit- und Kulturangebote anhand klarer Kriterien differenziert vergleichen.",
    "Ich kann Komparative mit Verstärkern wie deutlich, wesentlich, erheblich und weitaus verwenden.",
    "Ich kann Gleichheit, Ungleichheit und Entwicklungen mit so ... wie, nicht so ... wie und je ... desto ausdrücken.",
    "Ich kann einen argumentativen C1-Text über öffentliche Investitionen in Kultur verfassen.",
  ],
  explanation: [
    "Freizeit- und Kulturangebote beeinflussen soziale Teilhabe, Lebensqualität, Identität, Stadtimage und lokale Wirtschaft. Ihr Nutzen hängt jedoch stark von Preis, Erreichbarkeit, Zielgruppe und langfristiger Förderung ab.",
    "Erweiterte Vergleichsformen ermöglichen es, Angebote nicht nur als besser oder schlechter zu bezeichnen, sondern Unterschiede in Wirkung, Zugänglichkeit und Nachhaltigkeit präzise zu gewichten.",
    "Die Schreibaufgabe ist ein argumentativer Text zur Frage, ob Städte stärker in öffentliche Kulturangebote investieren sollten.",
  ],
  grammarLesson: {
    title: "Erweiterte Vergleichsformen",
    explanation: [
      "Auf C1-Niveau werden Vergleiche durch Verstärker, präzise Vergleichsrahmen und abgestufte Bewertungen erweitert.",
      "Mit deutlich, wesentlich, erheblich und weitaus kann die Stärke eines Unterschieds ausgedrückt werden. Vergleichsrahmen wie im Vergleich zu, gegenüber und verglichen mit machen die Grundlage des Vergleichs klar.",
      "Je ... desto oder je ... umso beschreibt eine parallele Entwicklung: Je zugänglicher Kulturangebote sind, desto größer ist ihre gesellschaftliche Wirkung.",
    ],
    rules: [
      "Nutze als nach dem Komparativ: zugänglicher als, vielfältiger als.",
      "Nutze so ... wie für Gleichheit und nicht so ... wie für Ungleichheit.",
      "Verstärke Komparative mit deutlich, weitaus, erheblich oder wesentlich.",
      "Formuliere Vergleichsrahmen mit im Vergleich zu, gegenüber oder verglichen mit.",
      "Im je-Satz steht das Verb am Ende; im desto- oder umso-Satz steht das finite Verb auf Position zwei.",
      "Vermeide Doppelkomparative wie mehr interessanter oder stärker besser.",
    ],
    examples: [
      "Im Vergleich zu rein kommerziellen Veranstaltungen sind öffentliche Kulturangebote häufig deutlich zugänglicher.",
      "Digitale Formate sind oft nicht so verbindlich wie gemeinsame Live-Erlebnisse.",
      "Je vielfältiger das kulturelle Angebot einer Stadt ist, desto attraktiver wirkt sie auf unterschiedliche Bevölkerungsgruppen.",
      "Gegenüber einmaligen Großveranstaltungen können dauerhaft geförderte Kulturprojekte wesentlich nachhaltiger wirken.",
      "Das neue Programm zählt zu den innovativsten und sozial ausgewogensten Kulturangeboten der Region.",
    ],
    miniExercise: "Formuliere präziser: 1) Das öffentliche Angebot ist besser als das private. Nutze deutlich und einen Vergleichsrahmen. 2) Digitale Kultur ist nicht gleich verbindlich wie Live-Kultur. Nutze nicht so ... wie. 3) Kultur wird zugänglicher; mehr Menschen nehmen teil. Nutze je ... desto. 4) Das Projekt ist sehr innovativ. Nutze einen Superlativ.",
    knowledgeTest: [
      {
        question: "Welche Formulierung ist stilistisch und grammatisch korrekt?",
        options: ["Das Angebot ist deutlich vielfältiger als früher.", "Das Angebot ist mehr vielfältiger als früher.", "Das Angebot ist deutlich vielfältiger wie früher.", "Das Angebot ist am vielfältiger als früher."],
        answer: "Das Angebot ist deutlich vielfältiger als früher.",
        explanation: "Deutlich verstärkt den Komparativ, und nach dem Komparativ steht als.",
      },
      {
        question: "Welcher Satz drückt Gleichheit korrekt aus?",
        options: ["Das Stadtfest ist so beliebt wie das Musikfestival.", "Das Stadtfest ist so beliebt als das Musikfestival.", "Das Stadtfest ist mehr beliebt wie das Musikfestival.", "Das Stadtfest ist am beliebtesten wie das Musikfestival."],
        answer: "Das Stadtfest ist so beliebt wie das Musikfestival.",
        explanation: "So ... wie drückt Gleichheit aus.",
      },
      {
        question: "Welcher Je-desto-Satz ist korrekt?",
        options: ["Je mehr Menschen teilnehmen, desto sichtbarer wird Kultur.", "Je mehr Menschen teilnehmen, desto Kultur sichtbarer wird.", "Je teilnehmen mehr Menschen, desto wird Kultur sichtbarer.", "Je mehr Menschen teilnehmen, desto sichtbarer Kultur wird."],
        answer: "Je mehr Menschen teilnehmen, desto sichtbarer wird Kultur.",
        explanation: "Im je-Satz steht das Verb am Ende; im desto-Satz folgt das finite Verb auf Position zwei.",
      },
      {
        question: "Welche Formulierung macht die Vergleichsbasis klar?",
        options: ["Im Vergleich zu kommerziellen Angeboten ...", "Das Angebot ist irgendwie besser.", "Es ist mehr gut.", "Es ist am besser."],
        answer: "Im Vergleich zu kommerziellen Angeboten ...",
        explanation: "Der Ausdruck benennt eindeutig, womit verglichen wird.",
      },
    ],
  },
  speakingTaskType: "C1 culture and participation discussion",
  speakingTopic: "Sprechen: Welche Bedeutung haben Freizeit- und Kulturangebote für soziale Teilhabe, Lebensqualität und Identität in modernen Städten?",
  speakingBuilder: {
    branches: [
      { id: "teilhabe", title: "Soziale Teilhabe", keywords: ["Zugang", "Preise", "Barrierefreiheit", "Zielgruppen", "Begegnung"] },
      { id: "lebensqualitaet", title: "Lebensqualität", keywords: ["Erholung", "Inspiration", "Gemeinschaft", "Gesundheit", "öffentlicher Raum"] },
      { id: "identitaet", title: "Identität und Vielfalt", keywords: ["lokale Kultur", "Tradition", "Mehrsprachigkeit", "Repräsentation", "Zugehörigkeit"] },
      { id: "wirtschaft", title: "Wirtschaft und Stadtimage", keywords: ["Tourismus", "Arbeitsplätze", "Standortfaktor", "Gastronomie", "Attraktivität"] },
      { id: "formate", title: "Formate und Wirkung", keywords: ["Live-Veranstaltungen", "digitale Angebote", "Museen", "Festivals", "Bürgerprojekte"] },
      { id: "foerderung", title: "Förderung und Prioritäten", keywords: ["öffentliche Mittel", "Bildung", "Dauerförderung", "Großevents", "Evaluation"] },
    ],
  },
  writingTaskType: "C1 argumentative text / Erörterung",
  writingTopic: "Schreiben: Freizeit und Kultur als Standortfaktor – sollten Städte stärker in öffentliche Kulturangebote investieren? Verfassen Sie einen argumentativen Text. Stellen Sie die gesellschaftliche Relevanz von Kultur- und Freizeitangeboten dar. Analysieren Sie mindestens zwei Vorteile und zwei Herausforderungen. Vergleichen Sie unterschiedliche Angebotsformen oder Fördermodelle. Verwenden Sie ein konkretes Beispiel aus dem urbanen Alltag oder Ihrer Erfahrung. Enden Sie mit einer klaren, begründeten Schlussposition.",
  writingBuilder: {
    structure: [
      "Einleitung und klare Position",
      "Gesellschaftliche Relevanz und erster Vorteil",
      "Weiterer Vorteil mit Vergleich",
      "Herausforderungen und Gegenperspektive",
      "Fördermodell, Beispiel und Schlussurteil",
    ],
    usefulLines: [
      "Öffentliche Kulturangebote sind für Städte wesentlich bedeutender, als ihr rein wirtschaftlicher Nutzen vermuten lässt.",
      "Im Vergleich zu exklusiven Formaten erreichen niedrigschwellige Angebote deutlich breitere Bevölkerungsgruppen.",
      "Je verlässlicher kulturelle Einrichtungen gefördert werden, desto nachhaltiger können sie Teilhabe ermöglichen.",
      "Demgegenüber sind hohe Kosten und konkurrierende kommunale Aufgaben nicht zu unterschätzen.",
      "Insgesamt erscheint eine langfristige, sozial ausgewogene Kulturförderung überzeugender als die Konzentration auf einzelne Großveranstaltungen.",
    ],
  },
  tasks: {
    speaking: "Sprich 2 Minuten über die Bedeutung von Kulturangeboten und vergleiche mindestens zwei Formen oder Förderansätze.",
    writing: "Schreibe 220–280 Wörter als argumentativen C1-Text über kommunale Investitionen in Kultur.",
    reading: "Lies einen Kulturtext und notiere Hauptaussage, Zielgruppe, Argumente, Vergleichsperspektiven und fehlende Aspekte.",
    listening: "Höre einen Kulturbeitrag und notiere Kernaussage, Beispiele, Bewertungen und Haltung der sprechenden Person.",
  },
  resources: {
    grammarBook: {
      title: "C1 Day 12 grammar notes",
      url: "/campus/course/c1-day-12-freizeit-und-kultur-grammar-notes",
    },
    workbook: {
      title: "C1 Day 12 workbook",
      url: "/campus/course/c1-day-12-freizeit-und-kultur-workbook",
    },
  },
  vocabulary: ["Kulturförderung", "Standortfaktor", "Teilhabe", "niedrigschwellig", "Kulturangebot", "Stadtimage", "Vergleichsrahmen"],
});

export default c1Day12FreizeitUndKultur;
