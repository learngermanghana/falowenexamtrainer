import { makeLesson } from "../buildSelfLearningLesson";

const c1Day10IntegrationUndGesellschaft = makeLesson({
  level: "C1",
  day: 10,
  chapter: "2.5",
  title: "Integration und Gesellschaft",
  topic: "Teilhabe, Sprache, Chancengleichheit und gesellschaftlichen Zusammenhalt differenziert beurteilen",
  heroImage: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1600&q=80",
  grammarFocus: "Konjunktiv I in Bericht und Kommentar: fremde Aussagen neutral wiedergeben und einordnen",
  objectives: [
    "Ich kann unterschiedliche Positionen zu Integration und gesellschaftlicher Teilhabe sachlich wiedergeben.",
    "Ich kann Konjunktiv I in indirekter Rede bilden und angemessen verwenden.",
    "Ich kann zwischen neutralem Bericht und eigenem Kommentar unterscheiden.",
    "Ich kann einen C1-Diskussionsbeitrag mit Quellenbezug, Einwand und konkreten Maßnahmen verfassen.",
  ],
  explanation: [
    "Integration betrifft Sprache, Bildung, Arbeit, politische und soziale Teilhabe sowie das Gefühl gesellschaftlicher Zugehörigkeit.",
    "In einer differenzierten Debatte müssen unterschiedliche Stimmen korrekt wiedergegeben werden. Der Konjunktiv I markiert, dass eine Aussage von einer Person, Institution oder Quelle stammt.",
    "Die Schreibaufgabe ist ein Diskussionsbeitrag darüber, wie gesellschaftlicher Zusammenhalt langfristig gestärkt werden kann.",
  ],
  grammarLesson: {
    title: "Konjunktiv I in Bericht und Kommentar",
    explanation: [
      "Der Konjunktiv I wird vor allem für indirekte Rede verwendet. Er ermöglicht es, fremde Aussagen wiederzugeben, ohne sie als eigene Tatsachenbehauptung zu übernehmen.",
      "Typische Einleitungen sind: Die Autorin erklärt, der Verband betont, laut der Studie, im Bericht heißt es und Experten weisen darauf hin.",
      "Wenn Konjunktiv I und Indikativ gleich aussehen, wird häufig Konjunktiv II als Ersatzform verwendet, um die indirekte Rede eindeutig zu markieren.",
    ],
    rules: [
      "Bilde Konjunktiv I aus dem Verbstamm mit den Endungen -e, -est, -e, -en, -et, -en.",
      "Besonders häufig sind sei, habe, werde, könne, müsse und gebe.",
      "Nach einem einleitenden Berichtsverb folgt meist ein Komma, aber kein dass: Die Expertin sagt, Sprache sei entscheidend.",
      "Nutze Quellenmarker wie laut, zufolge, nach Angaben von oder wie X betont.",
      "Wechsle zur Ersatzform im Konjunktiv II, wenn die Konjunktiv-I-Form nicht vom Indikativ unterscheidbar ist.",
      "Trenne fremde Position und eigenen Kommentar sprachlich klar voneinander.",
    ],
    examples: [
      "Die Ministerin erklärt, Integration erfordere langfristige Bildungsstrategien.",
      "Ein Verband berichtet, viele Jugendliche fänden nur schwer Ausbildungsplätze.",
      "Laut einer Studie gebe es weiterhin strukturelle Hindernisse beim Zugang zum Arbeitsmarkt.",
      "Experten betonen, gesellschaftliche Teilhabe gelinge nur bei fairen Chancen.",
      "Kommentatoren meinen, Medien sollten differenzierter über Integration berichten.",
    ],
    miniExercise: "Forme in indirekte Rede um: 1) Die Expertin sagt: Sprache ist wichtig. 2) Der Verband erklärt: Viele Menschen haben keinen gleichen Zugang. 3) Die Studie zeigt: Es gibt strukturelle Hindernisse. 4) Die Initiative fordert: Die Politik muss mehr Begegnungsräume schaffen.",
    knowledgeTest: [
      {
        question: "Welche Formulierung steht korrekt im Konjunktiv I?",
        options: ["Der Experte sagt, Sprache sei entscheidend.", "Der Experte sagt, Sprache ist entscheidend.", "Der Experte sagt, Sprache wäre entscheidend gewesen.", "Der Experte sagt: Sprache sei entscheidend?"],
        answer: "Der Experte sagt, Sprache sei entscheidend.",
        explanation: "Sei ist die Konjunktiv-I-Form von sein und markiert indirekte Rede.",
      },
      {
        question: "Welcher Ausdruck markiert eine Quelle?",
        options: ["Laut der Studie", "Trotz der Studie", "Wegen der Studie", "Damit die Studie"],
        answer: "Laut der Studie",
        explanation: "Laut der Studie kennzeichnet, auf welche Quelle sich die Aussage stützt.",
      },
      {
        question: "Warum wird manchmal Konjunktiv II als Ersatzform verwendet?",
        options: ["Weil Konjunktiv I und Indikativ gleich aussehen können.", "Weil Konjunktiv I nur in Fragen erlaubt ist.", "Weil Konjunktiv II immer höflicher klingt.", "Weil Berichte keine Präsensformen enthalten dürfen."],
        answer: "Weil Konjunktiv I und Indikativ gleich aussehen können.",
        explanation: "Die Ersatzform verhindert Mehrdeutigkeit in der indirekten Rede.",
      },
      {
        question: "Welche Formulierung gibt eine fremde Position wieder?",
        options: ["Der Verband betont, Teilhabe müsse gefördert werden.", "Ich bin sicher, dass Teilhabe gefördert werden muss.", "Fördert endlich die Teilhabe!", "Teilhabe ist ohne Zweifel perfekt."],
        answer: "Der Verband betont, Teilhabe müsse gefördert werden.",
        explanation: "Die Quelle wird genannt und ihre Position durch indirekte Rede wiedergegeben.",
      },
    ],
  },
  speakingTaskType: "C1 integration and society discussion",
  speakingTopic: "Sprechen: Was braucht eine Gesellschaft, damit Integration wirklich gelingt und gesellschaftlicher Zusammenhalt langfristig gestärkt wird?",
  speakingBuilder: {
    branches: [
      { id: "sprache", title: "Sprache und Kommunikation", keywords: ["Sprachkurse", "Mehrsprachigkeit", "Alltag", "Verständigung", "Zugang"] },
      { id: "bildung", title: "Bildung und Arbeit", keywords: ["Schule", "Ausbildung", "Anerkennung", "Arbeitsmarkt", "Chancengleichheit"] },
      { id: "teilhabe", title: "Gesellschaftliche Teilhabe", keywords: ["Vereine", "Politik", "Kultur", "Begegnung", "Mitbestimmung"] },
      { id: "hindernisse", title: "Hindernisse", keywords: ["Diskriminierung", "Vorurteile", "Bürokratie", "Armut", "fehlende Informationen"] },
      { id: "zugehoerigkeit", title: "Identität und Zugehörigkeit", keywords: ["Akzeptanz", "Vielfalt", "Heimat", "Respekt", "gemeinsame Werte"] },
      { id: "verantwortung", title: "Verantwortung und Maßnahmen", keywords: ["Staat", "Institutionen", "Medien", "Zivilgesellschaft", "Eigeninitiative"] },
    ],
  },
  writingTaskType: "C1 discussion post / Diskussionsbeitrag",
  writingTopic: "Schreiben: Wie kann gesellschaftlicher Zusammenhalt langfristig gestärkt werden? Verfassen Sie einen C1-Diskussionsbeitrag. Erklären Sie, warum Integration für moderne Gesellschaften wichtig ist. Geben Sie mindestens eine fremde Position oder Aussage mit Konjunktiv I wieder. Beschreiben Sie zentrale Hindernisse für Teilhabe. Nennen Sie einen Einwand oder eine abweichende Perspektive. Entwickeln Sie konkrete Maßnahmen, die Sprache, Bildung, Arbeit, Akzeptanz und gesellschaftliche Beteiligung berücksichtigen.",
  writingBuilder: {
    structure: [
      "Einleitung und eigene Grundposition",
      "Wiedergabe einer fremden Position mit Konjunktiv I",
      "Hindernisse und konkretes gesellschaftliches Beispiel",
      "Einwand oder alternative Perspektive",
      "Maßnahmen und differenziertes Schlussurteil",
    ],
    usefulLines: [
      "Integration ist für moderne Gesellschaften von zentraler Bedeutung, weil ...",
      "Eine aktuelle Studie betont, gesellschaftliche Teilhabe gelinge nur unter der Voraussetzung, dass ...",
      "Ein wesentliches Hindernis besteht darin, dass ...",
      "Dagegen wird häufig eingewandt, Integration könne nicht allein Aufgabe des Staates sein.",
      "Langfristig wäre eine Verbindung aus fairen Zugängen, Begegnungsmöglichkeiten und gegenseitiger Verantwortung erforderlich.",
    ],
  },
  tasks: {
    speaking: "Sprich 2 Minuten über Bedingungen erfolgreicher Integration und berücksichtige Hindernisse, Verantwortung und konkrete Maßnahmen.",
    writing: "Schreibe 200–240 Wörter als C1-Diskussionsbeitrag über Integration und gesellschaftlichen Zusammenhalt.",
    reading: "Lies einen Text über Integration und notiere Hauptaussage, Quellenpositionen, Hindernisse und vorgeschlagene Maßnahmen.",
    listening: "Höre ein Gespräch über Integration und notiere die Positionen der Beteiligten in indirekter Rede.",
  },
  resources: {
    grammarBook: {
      title: "C1 Day 10 grammar notes",
      url: "/campus/course/c1-day-10-integration-und-gesellschaft-grammar-notes",
    },
    workbook: {
      title: "C1 Day 10 workbook",
      url: "/campus/course/c1-day-10-integration-und-gesellschaft-workbook",
    },
  },
  vocabulary: ["Teilhabe", "Chancengleichheit", "Zugehörigkeit", "Diskriminierung", "Zusammenhalt", "indirekte Rede", "Quellenbezug"],
});

export default c1Day10IntegrationUndGesellschaft;
