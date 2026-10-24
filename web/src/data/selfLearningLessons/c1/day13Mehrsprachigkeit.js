import { makeLesson } from "../buildSelfLearningLesson";

const c1Day13Mehrsprachigkeit = makeLesson({
  level: "C1",
  day: 13,
  chapter: "3.3",
  title: "Mehrsprachigkeit",
  topic: "Mehrsprachige Kompetenzen in Bildung, Arbeitswelt und öffentlichem Leben differenziert bewerten",
  heroImage: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1600&q=80",
  grammarFocus: "Indirekte Rede und Distanzierung: Quellen präzise wiedergeben, zeitlich einordnen und kritisch bewerten",
  objectives: [
    "Ich kann Positionen aus Studien, Politik und Medien neutral in indirekter Rede wiedergeben.",
    "Ich kann Konjunktiv I und geeignete Ersatzformen zur Distanzierung verwenden.",
    "Ich kann mit Quellenmarkern zwischen Fakt, Behauptung, Interpretation und eigener Bewertung unterscheiden.",
    "Ich kann einen C1-Meinungsessay über die Rolle von Mehrsprachigkeit in Schule, Beruf und Gesellschaft verfassen.",
  ],
  explanation: [
    "Mehrsprachigkeit kann Bildungswege, berufliche Chancen, kulturelle Teilhabe und persönliche Identität prägen. Gleichzeitig entstehen Fragen nach Ressourcen, Unterrichtsqualität, Anerkennung und sozialer Ungleichheit.",
    "In dieser Debatte werden häufig Aussagen aus Studien, Institutionen und Politik zitiert. Indirekte Rede ermöglicht es, solche Positionen wiederzugeben, ohne sie automatisch als eigene Überzeugung zu übernehmen.",
    "Die Schreibaufgabe ist ein sachlicher Meinungsessay über die Frage, welche Rolle Mehrsprachigkeit in Schule, Arbeitsmarkt und öffentlichem Leben spielen sollte.",
  ],
  grammarLesson: {
    title: "Indirekte Rede und Distanzierung",
    explanation: [
      "Der Konjunktiv I kennzeichnet berichtete Rede und schafft sprachliche Distanz: Die Studie behauptet, Mehrsprachigkeit fördere die kognitive Flexibilität.",
      "Wenn Konjunktiv I und Indikativ gleich aussehen, kann Konjunktiv II als Ersatzform verwendet werden. Distanzmarker wie laut, zufolge, nach Angaben von und es wird berichtet zeigen zusätzlich die Quelle.",
      "Zeitangaben werden an die Berichtssituation angepasst: heute wird an diesem Tag, gestern wird am Vortag und morgen wird am folgenden Tag.",
    ],
    rules: [
      "Nutze Konjunktiv I, um fremde Aussagen neutral wiederzugeben: sei, habe, werde, könne, müsse, fördere.",
      "Verwende Konjunktiv II als Ersatzform, wenn Konjunktiv I nicht eindeutig vom Indikativ zu unterscheiden ist.",
      "Nenne die Quelle mit laut, zufolge, nach Angaben von, dem Bericht zufolge oder wie X betont.",
      "Passe Zeit- und Ortsangaben an die neue Berichtsperspektive an: gestern → am Vortag, morgen → am folgenden Tag.",
      "Kennzeichne Unsicherheit mit Formulierungen wie angeblich, offenbar, vermutlich oder lasse sich nur teilweise nachweisen.",
      "Trenne die fremde Position klar von deiner eigenen Bewertung: Die Studie kommt zu dem Schluss ... Meines Erachtens ...",
    ],
    examples: [
      "Die Expertin betont, frühe Sprachförderung erleichtere langfristig den Bildungszugang.",
      "Dem Ministerium zufolge sei Mehrsprachigkeit ein wichtiger Standortvorteil.",
      "Die Lehrerin erklärte, ihre Klasse habe am Vortag intensiv über Sprachbiografien diskutiert.",
      "In der Debatte wird eingewandt, zusätzliche Sprachprogramme wären ohne mehr Personal kaum umsetzbar.",
      "Laut dem Bericht lasse sich der behauptete Effekt bislang nur teilweise nachweisen.",
    ],
    miniExercise: "Forme in indirekte Rede um: 1) Die Studie sagt: Mehrsprachigkeit verbessert die Berufschancen. 2) Die Lehrerin erklärt: Wir haben gestern lange diskutiert. 3) Der Verband meint: Die Schulen brauchen morgen mehr Personal. 4) Die Autorin sagt: Der Effekt ist nicht vollständig belegt.",
    knowledgeTest: [
      {
        question: "Welche Formulierung zeigt korrekte indirekte Rede mit Distanzierung?",
        options: ["Die Studie behauptet, Mehrsprachigkeit sei immer ein Vorteil.", "Die Studie behauptet, Mehrsprachigkeit ist immer ein Vorteil.", "Die Studie behauptet, Mehrsprachigkeit war immer ein Vorteil.", "Die Studie behauptet: Mehrsprachigkeit wäre immer ein Vorteil, weil ich finde."],
        answer: "Die Studie behauptet, Mehrsprachigkeit sei immer ein Vorteil.",
        explanation: "Sei steht im Konjunktiv I und markiert eine fremde Aussage.",
      },
      {
        question: "Welche Formulierung nennt die Quelle und signalisiert Distanz?",
        options: ["Dem Bericht zufolge lasse sich der Effekt nur teilweise nachweisen.", "Der Effekt stimmt sicher.", "Ich glaube, der Bericht hat recht.", "Der Bericht ist richtig, also stimmt alles."],
        answer: "Dem Bericht zufolge lasse sich der Effekt nur teilweise nachweisen.",
        explanation: "Die Quelle wird genannt und die Aussage vorsichtig eingeordnet.",
      },
      {
        question: "Welche Zeitangabe passt in berichteter Rede?",
        options: ["Die Lehrerin erklärte, die Klasse habe am Vortag diskutiert.", "Die Lehrerin erklärte, die Klasse habe gestern diskutiert.", "Die Lehrerin erklärte, die Klasse diskutiere morgen gestern.", "Die Lehrerin erklärte, die Klasse hätte diskutiert hat."],
        answer: "Die Lehrerin erklärte, die Klasse habe am Vortag diskutiert.",
        explanation: "Gestern wird aus der späteren Berichtsperspektive zu am Vortag.",
      },
      {
        question: "Welche Formulierung trennt Quelle und eigene Bewertung klar?",
        options: ["Die Studie behauptet, das Modell sei wirksam. Meines Erachtens fehlen jedoch Langzeitdaten.", "Die Studie sagt es, deshalb ist es meine Meinung.", "Das Modell ist laut mir sicher richtig.", "Die Studie und ich behauptet dieselbe Meinung."],
        answer: "Die Studie behauptet, das Modell sei wirksam. Meines Erachtens fehlen jedoch Langzeitdaten.",
        explanation: "Die fremde Aussage und die eigene Bewertung werden sprachlich getrennt.",
      },
    ],
  },
  speakingTaskType: "C1 multilingual education discussion",
  speakingTopic: "Sprechen: Sollten Schulen mehrsprachige Kompetenzen systematisch fördern?",
  speakingBuilder: {
    branches: [
      { id: "bildung", title: "Bildungschancen", keywords: ["Sprachförderung", "Lernerfolg", "Fachunterricht", "Übergänge", "Chancengleichheit"] },
      { id: "identitaet", title: "Identität und Zugehörigkeit", keywords: ["Herkunftssprache", "Selbstbild", "Familie", "Anerkennung", "kulturelle Vielfalt"] },
      { id: "beruf", title: "Arbeitswelt", keywords: ["internationale Teams", "Kundenkontakt", "Mobilität", "Standortvorteil", "Karriere"] },
      { id: "gesellschaft", title: "Gesellschaftliche Teilhabe", keywords: ["Behörden", "Gesundheit", "Medien", "politische Beteiligung", "öffentlicher Raum"] },
      { id: "herausforderungen", title: "Herausforderungen", keywords: ["Lehrkräfte", "Materialien", "Unterrichtsqualität", "Ressourcen", "soziale Ungleichheit"] },
      { id: "modelle", title: "Fördermodelle", keywords: ["bilingualer Unterricht", "Herkunftssprachen", "Sprachtandems", "Diagnostik", "Fortbildung"] },
    ],
  },
  writingTaskType: "C1 opinion essay / Erörterung",
  writingTopic: "Schreiben: Welche Rolle sollte Mehrsprachigkeit in Schule, Arbeitsmarkt und öffentlichem Leben spielen? Verfassen Sie einen C1-Meinungsessay für ein Online-Magazin. Erklären Sie zwei zentrale Vorteile anhand eines Beispiels. Analysieren Sie mindestens eine reale Herausforderung, etwa Ressourcen, Unterrichtsqualität oder soziale Ungleichheit. Geben Sie eine fremde Position kritisch-distanzierend in indirekter Rede wieder. Entwickeln Sie eine begründete Schlussposition mit einem konkreten Vorschlag.",
  writingBuilder: {
    structure: [
      "Einleitung, Kontext und These",
      "Erster Vorteil mit Beispiel",
      "Zweiter Vorteil für Beruf oder Gesellschaft",
      "Herausforderung und fremde Position in indirekter Rede",
      "Eigene Bewertung, Vorschlag und Schluss",
    ],
    usefulLines: [
      "Mehrsprachigkeit wird häufig als Bildungs- und Standortvorteil bezeichnet; ihre Wirkung hängt jedoch von den Rahmenbedingungen ab.",
      "Ein zentraler Vorteil besteht darin, dass ...",
      "Darüber hinaus kann Mehrsprachigkeit im Arbeitsleben ...",
      "Kritiker wenden ein, zusätzliche Programme seien ohne ausreichend qualifiziertes Personal kaum umsetzbar.",
      "Meines Erachtens sollte Mehrsprachigkeit systematisch gefördert werden, sofern ...",
    ],
  },
  tasks: {
    speaking: "Sprich 2 Minuten über mehrsprachige Bildung und berücksichtige Chancen, Herausforderungen, ein Gegenargument und eine klare Schlussposition.",
    writing: "Schreibe 220–280 Wörter als C1-Meinungsessay über Mehrsprachigkeit in Bildung, Beruf und Gesellschaft.",
    reading: "Lies einen Debattenartikel und markiere These, Gegenposition, Belege, Distanzmarker und Schlussfolgerung.",
    listening: "Höre ein Interview zur Sprachpolitik und notiere die Kernaussagen in indirekter Rede.",
  },
  resources: {
    grammarBook: {
      title: "C1 Day 13 grammar notes",
      url: "/campus/course/c1-day-13-mehrsprachigkeit-grammar-notes",
    },
    workbook: {
      title: "C1 Day 13 workbook",
      url: "/campus/course/c1-day-13-mehrsprachigkeit-workbook",
    },
  },
  vocabulary: ["Mehrsprachigkeit", "Herkunftssprache", "Sprachförderung", "Distanzmarker", "Sprachpolitik", "Standortvorteil", "Chancengleichheit"],
});

export default c1Day13Mehrsprachigkeit;
