import { makeLesson } from "../buildSelfLearningLesson";

const c1Day12FreizeitUndKultur = makeLesson({
  level: "C1",
  day: 12,
  chapter: "3.2",
  title: "Freizeit und Kultur",
  topic: "Kulturelle Angebote, soziale Teilhabe, Lebensqualität und kommunale Kulturförderung differenziert bewerten",
  heroImage: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80",
  grammarFocus: "Erweiterte Vergleichs- und Bewertungsstrukturen: im Hinblick auf, insofern ... als, einerseits ... andererseits und je ... desto",
  objectives: [
    "Ich kann kulturelle Angebote im Hinblick auf Teilhabe, Lebensqualität und Zugänglichkeit differenziert bewerten.",
    "Ich kann mit insofern ... als erklären, in welcher Hinsicht Kultur gesellschaftlich relevant ist.",
    "Ich kann mit einerseits ... andererseits Vorteile und Herausforderungen ausgewogen gegenüberstellen.",
    "Ich kann Entwicklungen und Zusammenhänge mit je ... desto beziehungsweise je ... umso ausdrücken.",
    "Ich kann einen argumentativen C1-Text über öffentliche Investitionen in Kultur verfassen.",
  ],
  explanation: [
    "Freizeit- und Kulturangebote beeinflussen soziale Teilhabe, Lebensqualität, Identität, Stadtimage und lokale Wirtschaft. Ihr Nutzen hängt jedoch stark von Preis, Erreichbarkeit, Zielgruppe und langfristiger Förderung ab.",
    "Auf C1-Niveau solltest du kulturelle Angebote nicht nur als gut oder schlecht bezeichnen. Du musst erklären, in welcher Hinsicht ein Angebot relevant ist, unterschiedliche Seiten gegeneinander abwägen und Bedingungen für seine Wirkung formulieren.",
    "Die Schreibaufgabe ist ein argumentativer Text zur Frage, ob Städte stärker in öffentliche Kulturangebote investieren sollten.",
  ],
  grammarLesson: {
    title: "Erweiterte Vergleichs- und Bewertungsstrukturen bei Freizeit und Kultur",
    explanation: [
      "Mit im Hinblick auf + Akkusativ grenzt du das Bewertungskriterium klar ein. Beispiel: Im Hinblick auf gesellschaftliche Teilhabe sind günstige Kulturangebote besonders wichtig.",
      "Mit insofern ... als erklärst du präzise, in welcher Hinsicht eine Aussage gilt. Beispiel: Kultur ist insofern relevant, als sie Begegnung und Perspektivwechsel ermöglicht.",
      "Mit einerseits ... andererseits stellst du zwei berechtigte Seiten eines Arguments ausgewogen gegenüber.",
      "Je ... desto beziehungsweise je ... umso beschreibt zwei Entwicklungen, die miteinander zusammenhängen.",
    ],
    rules: [
      "im Hinblick auf + Akkusativ nennt das Kriterium einer Bewertung: im Hinblick auf soziale Teilhabe, im Hinblick auf die Finanzierung.",
      "insofern ... als bedeutet: in dieser Hinsicht / unter diesem Gesichtspunkt. Der als-Satz erklärt die Einschränkung oder Begründung genauer.",
      "einerseits ... andererseits verbindet zwei Seiten einer Abwägung und eignet sich besonders für differenzierte C1-Argumentation.",
      "Im je-Satz steht das Verb am Ende; im desto- oder umso-Satz steht das finite Verb auf Position zwei.",
      "Verbinde die Strukturen mit konkreten Kriterien wie Zugang, Preis, Vielfalt, gesellschaftliche Wirkung, Finanzierung oder Nachhaltigkeit.",
    ],
    examples: [
      "Im Hinblick auf gesellschaftliche Teilhabe sind günstige Kulturangebote besonders wichtig.",
      "Kultur ist insofern relevant, als sie Begegnung, Bildung und Perspektivwechsel ermöglicht.",
      "Einerseits fördern Festivals Gemeinschaft und Sichtbarkeit, andererseits können sie hohe Kosten, Lärm und kurzfristige Belastungen verursachen.",
      "Je leichter kulturelle Angebote zugänglich sind, desto stärker profitieren unterschiedliche Bevölkerungsgruppen.",
      "Im Hinblick auf eine langfristige Wirkung erscheint eine verlässliche Förderung lokaler Einrichtungen sinnvoller als die Konzentration auf einzelne Großveranstaltungen.",
    ],
    miniExercise: "Formuliere vier C1-Sätze: 1) Bewerte günstige Kulturangebote im Hinblick auf soziale Teilhabe. 2) Erkläre mit insofern ... als, warum Kultur für eine Stadt relevant ist. 3) Stelle mit einerseits ... andererseits einen Vorteil und eine Herausforderung von Festivals gegenüber. 4) Verbinde Zugänglichkeit und Teilnahme mit je ... desto.",
    knowledgeTest: [
      {
        question: "Welche Formulierung grenzt ein Bewertungskriterium korrekt ein?",
        options: ["Im Hinblick auf gesellschaftliche Teilhabe sind günstige Kulturangebote besonders wichtig.", "Im Hinblick gesellschaftliche Teilhabe sind günstige Kulturangebote besonders wichtig.", "Im Hinblick zu gesellschaftlicher Teilhabe sind günstige Kulturangebote besonders wichtig.", "Im Hinblick von gesellschaftlicher Teilhabe sind günstige Kulturangebote besonders wichtig."],
        answer: "Im Hinblick auf gesellschaftliche Teilhabe sind günstige Kulturangebote besonders wichtig.",
        explanation: "Die feste Struktur lautet im Hinblick auf + Akkusativ.",
      },
      {
        question: "Welche Formulierung mit insofern ... als ist korrekt?",
        options: ["Kultur ist insofern relevant, als sie Begegnung ermöglicht.", "Kultur ist insofern relevant, weil als sie Begegnung ermöglicht.", "Kultur ist insofern relevant, als ermöglicht sie Begegnung.", "Kultur ist insofern als relevant, sie Begegnung ermöglicht."],
        answer: "Kultur ist insofern relevant, als sie Begegnung ermöglicht.",
        explanation: "Insofern wird im Hauptsatz verwendet; der folgende als-Satz präzisiert, in welcher Hinsicht die Aussage gilt.",
      },
      {
        question: "Welche Struktur eignet sich am besten für eine ausgewogene Gegenüberstellung?",
        options: ["einerseits ... andererseits", "sodass ... deshalb", "weder ... weil", "nachdem ... bevor"],
        answer: "einerseits ... andererseits",
        explanation: "Einerseits ... andererseits stellt zwei relevante Seiten eines Arguments gegenüber.",
      },
      {
        question: "Welcher Je-desto-Satz ist korrekt?",
        options: ["Je zugänglicher Kulturangebote sind, desto mehr Menschen können teilnehmen.", "Je zugänglicher sind Kulturangebote, desto können mehr Menschen teilnehmen.", "Je Kulturangebote zugänglicher sind, desto mehr Menschen teilnehmen können.", "Je zugänglicher Kulturangebote sind, desto mehr können teilnehmen Menschen."],
        answer: "Je zugänglicher Kulturangebote sind, desto mehr Menschen können teilnehmen.",
        explanation: "Im je-Satz steht das Verb am Ende; im desto-Satz folgt das finite Verb auf Position zwei.",
      },
    ],
  },
  speakingTaskType: "C1 culture and participation discussion",
  speakingTopic: "Sprechen: Welche Bedeutung haben Freizeit- und Kulturangebote für soziale Teilhabe, Lebensqualität und Identität in modernen Städten?",
  speakingBuilder: {
    branches: [
      { id: "teilhabe", title: "Soziale Teilhabe", keywords: ["Zugang", "Preise", "Barrierefreiheit", "Zielgruppen", "Begegnung"], prompt: "Bewerte Kulturangebote im Hinblick auf Zugang und soziale Teilhabe. Wer kann teilnehmen und wer wird möglicherweise ausgeschlossen?" },
      { id: "lebensqualitaet", title: "Lebensqualität", keywords: ["Erholung", "Inspiration", "Gemeinschaft", "Gesundheit", "öffentlicher Raum"], prompt: "Insofern Kultur zur Lebensqualität beiträgt: Welche konkreten Wirkungen sind für Bewohnerinnen und Bewohner wichtig?" },
      { id: "identitaet", title: "Identität und Vielfalt", keywords: ["lokale Kultur", "Tradition", "Mehrsprachigkeit", "Repräsentation", "Zugehörigkeit"], prompt: "Welche Rolle spielen vielfältige Kulturangebote für Identität, Repräsentation und Zugehörigkeit?" },
      { id: "wirtschaft", title: "Wirtschaft und Stadtimage", keywords: ["Tourismus", "Arbeitsplätze", "Standortfaktor", "Gastronomie", "Attraktivität"], prompt: "Stelle einerseits wirtschaftliche Vorteile und andererseits mögliche soziale oder finanzielle Nachteile gegenüber." },
      { id: "formate", title: "Formate und Wirkung", keywords: ["Live-Veranstaltungen", "digitale Angebote", "Museen", "Festivals", "Bürgerprojekte"], prompt: "Vergleiche mindestens zwei Angebotsformen: Welche erreicht welche Zielgruppe und unter welchen Bedingungen?" },
      { id: "foerderung", title: "Förderung und Prioritäten", keywords: ["öffentliche Mittel", "Bildung", "Dauerförderung", "Großevents", "Evaluation"], prompt: "Je verlässlicher die Förderung ist, desto ...? Erkläre, welche Förderform langfristig die stärkste Wirkung haben könnte." },
    ],
    starters: [
      "Im Hinblick auf gesellschaftliche Teilhabe ...",
      "Kultur ist insofern relevant, als ...",
      "Einerseits spricht dafür, dass ..., andererseits ...",
      "Je zugänglicher ein Angebot ist, desto ...",
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
