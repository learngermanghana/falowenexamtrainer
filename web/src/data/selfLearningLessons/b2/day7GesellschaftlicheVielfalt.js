import { buildWeltReadingSearchUrl, makeLesson } from "../buildSelfLearningLesson";

const b2Day7GesellschaftlicheVielfalt = makeLesson({
  level: "B2",
  day: 7,
  chapter: "2.2",
  title: "Gesellschaftliche Vielfalt",
  topic:
    "Gesellschaftliche Vielfalt, unterschiedliche Lebensweisen, Teilhabe, Respekt und Chancengleichheit differenziert diskutieren",
  heroImage:
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80",
  grammarFocus:
    "Relativsätze mit Präpositionen: mit denen, für die, über den, an der und von denen",
  objectives: [
    "Ich kann erklären, was gesellschaftliche Vielfalt bedeutet.",
    "Ich kann Chancen und Herausforderungen einer vielfältigen Gesellschaft differenziert beschreiben.",
    "Ich kann Relativsätze mit Präpositionen korrekt bilden.",
    "Ich kann einen strukturierten B2-Meinungsbeitrag über Vielfalt, Respekt und Teilhabe schreiben.",
  ],
  explanation: [
    "Gesellschaftliche Vielfalt bedeutet, dass Menschen mit unterschiedlichen Sprachen, Kulturen, Religionen, Familienformen, Lebenswegen, Fähigkeiten und Meinungen zusammenleben.",
    "Vielfalt kann eine Gesellschaft bereichern, weil unterschiedliche Erfahrungen neue Perspektiven, Ideen und Lösungen ermöglichen. Gleichzeitig können Vorurteile, Ausgrenzung oder ungleiche Chancen entstehen.",
    "Auf B2-Niveau solltest du nicht nur sagen, dass Vielfalt gut oder schwierig ist. Erkläre konkrete Bedingungen: Welche Gruppen sind betroffen? Welche Barrieren gibt es? Welche Maßnahmen fördern Respekt, Teilhabe und Chancengleichheit?",
    "Relativsätze mit Präpositionen helfen dir, Personen, Gruppen, Institutionen und Situationen genauer zu beschreiben: Menschen, mit denen wir zusammenarbeiten; Regeln, an die sich alle halten; Angebote, von denen viele profitieren.",
  ],
  topicQuestions: [
    "Welche Formen gesellschaftlicher Vielfalt gibt es in deinem Alltag?",
    "Welche Vorteile entstehen, wenn Menschen mit unterschiedlichen Erfahrungen zusammenarbeiten?",
    "Warum erleben manche Gruppen Ausgrenzung oder ungleiche Chancen?",
    "Was können Schulen, Arbeitgeber, Behörden und Nachbarschaften für mehr Teilhabe tun?",
  ],
  grammarLesson: {
    title: "Relativsätze mit Präpositionen",
    explanation: [
      "Ein Relativsatz beschreibt ein Nomen genauer. Steht im Relativsatz ein Verb, Adjektiv oder Ausdruck mit einer festen Präposition, steht diese Präposition direkt vor dem Relativpronomen.",
      "Das Relativpronomen richtet sich in Genus und Numerus nach dem Bezugswort. Der Kasus wird jedoch von der Präposition bestimmt: mit + Dativ, für + Akkusativ, über + Akkusativ, von + Dativ, an + Akkusativ oder Dativ je nach Bedeutung.",
      "Das konjugierte Verb steht im Relativsatz am Ende: Das sind Menschen, mit denen ich gern zusammenarbeite.",
      "Bei Personen kannst du auch mit wem in einer indirekten Frage verwenden, aber im Relativsatz brauchst du Präposition plus Relativpronomen: die Kollegin, mit der ich spreche.",
    ],
    rules: [
      "Setze die Präposition direkt vor das Relativpronomen.",
      "Bestimme zuerst das Bezugswort: der, die, das oder Plural.",
      "Bestimme danach den Kasus, den die Präposition verlangt.",
      "Dativ: mit dem / mit der / mit denen; von dem / von der / von denen.",
      "Akkusativ: für den / für die / für das / für die; über den / über die / über das / über die.",
      "Das konjugierte Verb steht am Ende des Relativsatzes.",
    ],
    examples: [
      "Menschen, mit denen wir regelmäßig sprechen, fühlen sich eher zugehörig.",
      "Eine Gesellschaft, in der Unterschiede respektiert werden, ist oft innovativer.",
      "Das ist eine Initiative, von der viele Jugendliche profitieren.",
      "Wir brauchen Regeln, an die sich alle halten können.",
      "Vorurteile sind Probleme, über die offen gesprochen werden sollte.",
      "Bildungsangebote, für die keine hohen Gebühren verlangt werden, verbessern die Chancengleichheit.",
      "Die Kollegin, mit der ich zusammenarbeite, spricht drei Sprachen.",
      "Das Projekt, an dem viele Vereine beteiligt sind, fördert Begegnungen im Stadtteil.",
    ],
    miniExercise:
      "Verbinde sechs Satzpaare zu Relativsätzen mit Präpositionen. Nutze mindestens einmal mit denen, für die, über die, an dem, in der und von denen.",
    knowledgeTest: [
      {
        question: "Welche Form ist richtig? Das sind Menschen, ___ ich täglich zusammenarbeite.",
        options: ["mit die", "mit denen", "denen mit", "mit deren"],
        answer: "mit denen",
        explanation:
          "Mit verlangt den Dativ. Das Bezugswort Menschen steht im Plural, deshalb heißt es mit denen.",
      },
      {
        question: "Welche Form ist richtig? Das ist eine Organisation, ___ viele Familien profitieren.",
        options: ["von der", "für die", "über der", "an die"],
        answer: "von der",
        explanation:
          "Profitieren von verlangt von + Dativ. Organisation ist feminin, daher von der.",
      },
      {
        question: "Wo steht das konjugierte Verb im Relativsatz?",
        options: ["An Position eins", "Direkt nach der Präposition", "Am Ende", "Vor dem Relativpronomen"],
        answer: "Am Ende",
        explanation: "Relativsätze sind Nebensätze; das konjugierte Verb steht am Ende.",
      },
      {
        question: "Welche Aussage ist korrekt?",
        options: [
          "Das Relativpronomen richtet sich nur nach der Präposition.",
          "Die Präposition steht am Satzende.",
          "Genus und Numerus kommen vom Bezugswort, der Kasus von der Präposition.",
          "Alle Präpositionen verlangen den Akkusativ.",
        ],
        answer:
          "Genus und Numerus kommen vom Bezugswort, der Kasus von der Präposition.",
        explanation:
          "So wählst du die richtige Form, zum Beispiel mit dem, mit der oder mit denen.",
      },
    ],
  },
  speakingTaskType: "B2 discussion and opinion talk",
  speakingTopic:
    "Sprechen: Erkläre, warum gesellschaftliche Vielfalt wichtig ist, welche Herausforderungen entstehen können und wie Teilhabe und Respekt gefördert werden können.",
  speakingBuilder: {
    question:
      "Wie kann eine vielfältige Gesellschaft respektvoll und gerecht zusammenleben?",
    branches: [
      {
        id: "formen",
        title: "Formen von Vielfalt",
        keywords: [
          "Sprache",
          "Kultur",
          "Religion",
          "Alter",
          "Familienformen",
          "Behinderung",
        ],
      },
      {
        id: "chancen",
        title: "Chancen",
        keywords: [
          "neue Perspektiven",
          "Kreativität",
          "Mehrsprachigkeit",
          "Innovation",
          "Lernen voneinander",
          "Zusammenhalt",
        ],
      },
      {
        id: "herausforderungen",
        title: "Herausforderungen",
        keywords: [
          "Vorurteile",
          "Diskriminierung",
          "Sprachbarrieren",
          "Ausgrenzung",
          "ungleiche Chancen",
          "Missverständnisse",
        ],
      },
      {
        id: "teilhabe",
        title: "Teilhabe und Chancengleichheit",
        keywords: [
          "Bildung",
          "Arbeit",
          "barrierefreier Zugang",
          "Mitbestimmung",
          "faire Regeln",
          "Beratung",
        ],
      },
      {
        id: "loesungen",
        title: "Lösungen",
        keywords: [
          "Begegnungsprojekte",
          "Antidiskriminierung",
          "einfache Sprache",
          "interkulturelle Teams",
          "offene Diskussion",
          "gemeinsame Aktivitäten",
        ],
      },
    ],
    plan: [
      "Einleitung: Erkläre kurz, was gesellschaftliche Vielfalt bedeutet.",
      "Chancen: Nenne zwei Vorteile und jeweils ein Beispiel.",
      "Herausforderungen: Erkläre Vorurteile, Barrieren oder ungleiche Chancen.",
      "Lösungen: Nenne konkrete Maßnahmen für Respekt und Teilhabe.",
      "Schluss: Formuliere deine eigene ausgewogene Position.",
    ],
    starters: [
      "Gesellschaftliche Vielfalt bedeutet für mich, dass ...",
      "Ein Vorteil besteht darin, dass ...",
      "Menschen, mit denen wir unterschiedliche Erfahrungen teilen, ...",
      "Eine Herausforderung, über die offen gesprochen werden muss, ist ...",
      "Angebote, von denen viele Gruppen profitieren, ...",
      "Eine Gesellschaft, in der alle teilnehmen können, ...",
      "Zusammenfassend bin ich der Meinung, dass ...",
    ],
  },
  writingTaskType: "B2 opinion essay / Meinungsbeitrag",
  writingTopic:
    "Schreiben: Gesellschaftliche Vielfalt. Verfassen Sie einen B2-Meinungsbeitrag zu diesem Thema: Wie kann gesellschaftliche Vielfalt das Zusammenleben bereichern? Bearbeiten Sie alle Punkte: Äußern Sie Ihre Meinung zur Bedeutung gesellschaftlicher Vielfalt. Nennen Sie Gründe, warum Vielfalt Chancen, aber auch Herausforderungen mit sich bringt. Nennen Sie andere Möglichkeiten oder Maßnahmen, mit denen Respekt und Teilhabe gefördert werden können. Erklären Sie die Vorteile dieser Maßnahmen für die Gesellschaft.",
  writingPromptBullets: [
    "Einleitung: Stellen Sie das Thema gesellschaftliche Vielfalt kurz vor.",
    "Meinung: Äußern Sie klar Ihre Meinung zur Bedeutung von Vielfalt.",
    "Gründe: Erklären Sie Chancen und Herausforderungen mit Beispielen.",
    "Andere Möglichkeiten / Maßnahmen: Nennen Sie konkrete Maßnahmen für Respekt, Chancengleichheit und Teilhabe.",
    "Vorteile: Erklären Sie, wie diese Maßnahmen das Zusammenleben verbessern.",
    "Schluss: Fassen Sie Ihre Position ausgewogen zusammen.",
  ],
  writingBuilder: {
    structure: [
      "Einleitung: Definieren Sie gesellschaftliche Vielfalt und nennen Sie ihre aktuelle Bedeutung.",
      "Meinung: Formulieren Sie eine klare, aber differenzierte Position.",
      "Gründe: Nennen Sie mindestens eine Chance und eine Herausforderung.",
      "Maßnahmen: Beschreiben Sie zwei realistische Möglichkeiten zur Förderung von Respekt und Teilhabe.",
      "Vorteile: Erklären Sie die positive Wirkung dieser Maßnahmen.",
      "Schluss: Formulieren Sie ein ausgewogenes Fazit.",
    ],
    usefulLines: [
      "In modernen Gesellschaften leben Menschen mit unterschiedlichen Erfahrungen und Lebensweisen zusammen.",
      "Meiner Meinung nach ist gesellschaftliche Vielfalt eine große Chance, wenn alle Menschen faire Möglichkeiten zur Teilhabe erhalten.",
      "Ein wichtiger Vorteil besteht darin, dass unterschiedliche Perspektiven neue Ideen und Lösungen ermöglichen.",
      "Gleichzeitig gibt es Vorurteile und Barrieren, über die offen gesprochen werden muss.",
      "Eine andere Möglichkeit wäre, Begegnungsprojekte zu fördern, an denen verschiedene Gruppen gemeinsam teilnehmen.",
      "Außerdem sollten Informationen so gestaltet werden, dass Menschen mit unterschiedlichen Voraussetzungen sie verstehen können.",
      "Der Vorteil solcher Maßnahmen besteht darin, dass Ausgrenzung reduziert und gegenseitiges Vertrauen gestärkt wird.",
      "Zusammenfassend lässt sich sagen, dass Vielfalt Respekt, faire Regeln und aktive Teilhabe braucht.",
    ],
  },
  phrases: [
    "Menschen, mit denen ...",
    "eine Gesellschaft, in der ...",
    "Angebote, von denen ...",
    "Regeln, an die ...",
    "Probleme, über die ...",
    "Meiner Meinung nach ...",
    "Eine andere Möglichkeit wäre, ...",
    "Der Vorteil dieser Maßnahme besteht darin, dass ...",
  ],
  tasks: {
    speaking:
      "Sprich 2–3 Minuten über gesellschaftliche Vielfalt. Nutze mindestens drei Relativsätze mit Präpositionen und nenne eine Chance, eine Herausforderung und zwei Lösungen.",
    writing:
      "Schreibe 180–220 Wörter als B2-Meinungsbeitrag über gesellschaftliche Vielfalt. Nutze mindestens drei Relativsätze mit Präpositionen.",
    reading:
      "Lies einen Artikel über Vielfalt, Diskriminierung, Chancengleichheit oder gesellschaftliche Teilhabe. Notiere die Hauptaussage, fünf Wörter und deine Meinung.",
    listening:
      "Höre einen Beitrag über gesellschaftliche Vielfalt. Fasse drei zentrale Aussagen zusammen und formuliere zwei Relativsätze mit Präpositionen.",
  },
  readingResource: {
    title: "WELT article search: Vielfalt, Teilhabe und Chancengleichheit",
    description:
      "Choose one article about diversity, participation, discrimination or equal opportunities and focus on the main argument.",
    url: buildWeltReadingSearchUrl(
      "gesellschaftliche Vielfalt Teilhabe Chancengleichheit Diskriminierung",
    ),
    tasks: [
      "Write the title and source of the article.",
      "Summarise the main idea in one German sentence.",
      "Find five useful words connected to diversity and participation.",
      "Write four sentences giving your opinion.",
      "Use one relative clause with a preposition.",
    ],
  },
  listeningResource: {
    title: "DW Deutsch lernen: Vielfalt und Zusammenleben",
    description:
      "Choose a short DW audio or video about diversity, inclusion, discrimination or living together.",
    url: "https://www.dw.com/de/suche/s-100853?searchNavigationId=9097&item=Vielfalt%20Teilhabe%20Zusammenleben",
    tasks: [
      "Listen once and identify the main topic.",
      "Listen again and write three important points.",
      "Write three useful expressions you heard.",
      "Record a 60-second summary using one relative clause with a preposition.",
    ],
  },
  vocabulary: [
    "gesellschaftliche Vielfalt",
    "die Teilhabe",
    "die Chancengleichheit",
    "die Ausgrenzung",
    "die Diskriminierung",
    "das Vorurteil",
    "die Zugehörigkeit",
    "die Barriere",
    "der Zusammenhalt",
    "die Mehrsprachigkeit",
    "respektvoll",
    "barrierefrei",
  ],
});

export default b2Day7GesellschaftlicheVielfalt;
