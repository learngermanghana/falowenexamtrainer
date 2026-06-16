import { makeLesson } from "../buildSelfLearningLesson";

const c1Day15BildungUndLebenslangesLernen = makeLesson({
  level: "C1",
  day: 15,
  chapter: "3.5",
  title: "Bildung und lebenslanges Lernen",
  topic: "Weiterbildung, Chancengleichheit und die gemeinsame Verantwortung von Staat, Unternehmen und Lernenden differenziert bewerten",
  heroImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80",
  grammarFocus: "Argumentative Satzmuster, Nominalisierung und formelle Textlogik: Gründe, Einwände, Bedingungen und Schlussfolgerungen präzise verbinden",
  objectives: [
    "Ich kann komplexe Bildungsfragen mit klaren argumentativen Satzmustern strukturieren.",
    "Ich kann verbale Aussagen in einen präzisen Nominalstil umformen.",
    "Ich kann Begründung, Gegenargument, Bedingung und Schlussfolgerung logisch miteinander verknüpfen.",
    "Ich kann eine formelle C1-Stellungnahme zur Finanzierung beruflicher Weiterbildung verfassen.",
  ],
  explanation: [
    "Technologischer Wandel, neue Berufsbilder und gesellschaftliche Veränderungen machen lebenslanges Lernen für viele Menschen unverzichtbar. Gleichzeitig sind Zeit, Kosten, Zugang und Anerkennung von Weiterbildungen sehr ungleich verteilt.",
    "Auf C1-Niveau genügt es nicht, lediglich Vor- und Nachteile aufzuzählen. Eine überzeugende Argumentation zeigt, warum ein Aspekt relevant ist, welche Einwände bestehen, unter welchen Bedingungen eine Maßnahme sinnvoll wäre und welche Konsequenz sich daraus ergibt.",
    "Die Schreibaufgabe ist eine formelle Stellungnahme zu der Frage, ob berufliche Weiterbildung stärker öffentlich finanziert werden sollte.",
  ],
  grammarLesson: {
    title: "Argumentative Satzmuster, Nominalisierung und formelle Textlogik",
    explanation: [
      "Argumentative Satzmuster geben einem formellen Text eine nachvollziehbare Logik: Ein wesentlicher Grund liegt darin, dass ... Dem lässt sich entgegenhalten, dass ... Voraussetzung dafür ist, dass ... Daraus ergibt sich, dass ...",
      "Nominalisierungen verdichten Informationen und wirken sachlich: Menschen müssen sich regelmäßig weiterbilden. → Die Notwendigkeit regelmäßiger Weiterbildung nimmt zu.",
      "Ein guter C1-Text verbindet Nominalstil und Verbalstil. Zu viele Nominalisierungen machen den Text schwer lesbar; gezielt eingesetzt erhöhen sie Präzision und formelle Wirkung.",
    ],
    rules: [
      "Leite zentrale Argumente mit Mustern wie dafür spricht, dass; ein wesentlicher Grund liegt darin, dass; entscheidend ist, dass ein.",
      "Formuliere Einwände mit dem lässt sich entgegenhalten, dass; dagegen ist einzuwenden, dass; zu berücksichtigen ist jedoch, dass.",
      "Verknüpfe Bedingungen und Voraussetzungen mit Voraussetzung dafür ist, dass; unter der Bedingung, dass; sofern.",
      "Markiere Folgen und Schlussfolgerungen mit daraus ergibt sich, dass; dies hat zur Folge, dass; folglich; somit.",
      "Nominalisiere zentrale Prozesse gezielt: fördern → die Förderung, anerkennen → die Anerkennung, teilnehmen → die Teilnahme, finanzieren → die Finanzierung.",
      "Nutze Präpositionalgruppen für formelle Textlogik: angesichts des Wandels, im Hinblick auf Chancengleichheit, unter Berücksichtigung der Kosten.",
    ],
    examples: [
      "Ein wesentlicher Grund für öffentliche Förderung liegt darin, dass Weiterbildung gesellschaftlichen und wirtschaftlichen Nutzen schafft.",
      "Angesichts des technologischen Wandels gewinnt die regelmäßige Aktualisierung beruflicher Kompetenzen an Bedeutung.",
      "Dem lässt sich entgegenhalten, dass eine vollständige staatliche Finanzierung erhebliche Kosten verursachen würde.",
      "Voraussetzung für eine gerechte Förderung ist, dass auch Menschen mit geringem Einkommen und Betreuungspflichten Zugang erhalten.",
      "Aus der Anerkennung zertifizierter Weiterbildungen könnte sich eine höhere berufliche Mobilität ergeben.",
    ],
    miniExercise: "Formuliere sachlich und logisch um: 1) Viele Menschen können Kurse nicht bezahlen. 2) Unternehmen sollen Mitarbeitende fördern. 3) Der Staat finanziert Programme, aber ihre Qualität muss kontrolliert werden. 4) Weiterbildung verbessert Chancen; deshalb sollte sie leichter zugänglich sein.",
    knowledgeTest: [
      {
        question: "Welche Formulierung leitet ein zentrales Argument auf C1-Niveau ein?",
        options: [
          "Ein wesentlicher Grund liegt darin, dass Weiterbildung berufliche Anpassung ermöglicht.",
          "Weiterbildung ist halt gut.",
          "Ich sage Weiterbildung, weil ja.",
          "Der Grund liegt Weiterbildung ermöglicht.",
        ],
        answer: "Ein wesentlicher Grund liegt darin, dass Weiterbildung berufliche Anpassung ermöglicht.",
        explanation: "Das Satzmuster verbindet Behauptung und Begründung klar und formell.",
      },
      {
        question: "Welche Formulierung enthält eine passende Nominalisierung?",
        options: [
          "Die Anerkennung beruflicher Qualifikationen erleichtert den Arbeitsplatzwechsel.",
          "Man anerkennt berufliche Qualifikationen erleichtert.",
          "Berufliche Qualifikationen anerkennen die Arbeitsplatzwechsel.",
          "Die anerkennen von Qualifikationen ist erleichtern.",
        ],
        answer: "Die Anerkennung beruflicher Qualifikationen erleichtert den Arbeitsplatzwechsel.",
        explanation: "Anerkennung ist die korrekte Nominalisierung von anerkennen.",
      },
      {
        question: "Welche Formulierung führt einen Einwand sachlich ein?",
        options: [
          "Dem lässt sich entgegenhalten, dass eine umfassende Förderung hohe öffentliche Ausgaben verursachen könnte.",
          "Das ist falsch und fertig.",
          "Aber nein, Förderung kostet.",
          "Entgegenhalten Förderung hohe Kosten weil.",
        ],
        answer: "Dem lässt sich entgegenhalten, dass eine umfassende Förderung hohe öffentliche Ausgaben verursachen könnte.",
        explanation: "Die Wendung kennzeichnet ein Gegenargument diplomatisch und präzise.",
      },
      {
        question: "Welche Formulierung verbindet Bedingung und Empfehlung logisch?",
        options: [
          "Öffentliche Förderung ist sinnvoll, sofern Qualität, Zugang und Anerkennung gewährleistet sind.",
          "Öffentliche Förderung ist immer sinnvoll ohne Bedingungen.",
          "Sofern Qualität und Förderung ist sinnvoll sind.",
          "Förderung sinnvoll, Qualität vielleicht.",
        ],
        answer: "Öffentliche Förderung ist sinnvoll, sofern Qualität, Zugang und Anerkennung gewährleistet sind.",
        explanation: "Sofern formuliert eine klare Voraussetzung für die Empfehlung.",
      },
    ],
  },
  speakingTaskType: "C1 lifelong learning discussion",
  speakingTopic: "Sprechen: Wer trägt die Verantwortung dafür, dass Menschen sich lebenslang weiterbilden können?",
  speakingBuilder: {
    branches: [
      { id: "individuum", title: "Verantwortung der Lernenden", keywords: ["Motivation", "Eigeninitiative", "Zeitplanung", "Lernziele", "Selbstreflexion"] },
      { id: "unternehmen", title: "Verantwortung der Unternehmen", keywords: ["Freistellung", "Finanzierung", "Personalentwicklung", "Anerkennung", "betrieblicher Bedarf"] },
      { id: "staat", title: "Verantwortung des Staates", keywords: ["Förderprogramme", "Bildungsurlaub", "Beratung", "Qualitätsstandards", "öffentliche Finanzierung"] },
      { id: "zugang", title: "Chancengleichheit", keywords: ["Einkommen", "Betreuungspflichten", "Region", "Behinderung", "digitale Ausstattung"] },
      { id: "lernformen", title: "Lernformen", keywords: ["Präsenzkurse", "Online-Lernen", "Mikroqualifikationen", "berufsbegleitend", "Lernberatung"] },
      { id: "wirkung", title: "Nutzen und Grenzen", keywords: ["Beschäftigungsfähigkeit", "Innovation", "Teilhabe", "Überforderung", "Qualität"] },
    ],
  },
  writingTaskType: "C1 formal position paper / Stellungnahme",
  writingTopic: "Schreiben: Sollte berufliche Weiterbildung stärker öffentlich finanziert werden? Verfassen Sie für einen Bildungsausschuss eine formelle C1-Stellungnahme mit 220–280 Wörtern. Erläutern Sie zwei Gründe für eine stärkere öffentliche Förderung. Berücksichtigen Sie mindestens ein Gegenargument zu Kosten oder Eigenverantwortung. Analysieren Sie eine konkrete Zugangshürde. Entwickeln Sie ein ausgewogenes Finanzierungsmodell und formulieren Sie eine begründete Schlussposition.",
  writingBuilder: {
    structure: [
      "Einleitung, Problem und klare Position",
      "Zwei Gründe für öffentliche Förderung",
      "Gegenargument und kritische Abwägung",
      "Konkrete Zugangshürde und Folgen",
      "Finanzierungsmodell, Empfehlung und Schluss",
    ],
    usefulLines: [
      "Angesichts des technologischen und wirtschaftlichen Wandels gewinnt berufliche Weiterbildung erheblich an Bedeutung.",
      "Ein wesentlicher Grund für eine stärkere öffentliche Förderung liegt darin, dass ...",
      "Darüber hinaus spricht für eine staatliche Beteiligung, dass ...",
      "Dem lässt sich entgegenhalten, dass Beschäftigte und Unternehmen ebenfalls Verantwortung übernehmen müssen.",
      "Besonders problematisch ist der eingeschränkte Zugang für ...",
      "Meines Erachtens wäre ein gemeinsames Finanzierungsmodell sinnvoll, sofern ...",
    ],
  },
  tasks: {
    speaking: "Sprich 3 Minuten über die Verantwortung für lebenslanges Lernen und berücksichtige Lernende, Unternehmen, Staat, Zugangshürden und eine klare Schlussposition.",
    writing: "Schreibe 220–280 Wörter als formelle C1-Stellungnahme zur öffentlichen Finanzierung beruflicher Weiterbildung.",
    reading: "Lies einen bildungspolitischen Kommentar und markiere These, argumentative Satzmuster, Nominalisierungen, Einwände und Schlussfolgerung.",
    listening: "Höre einen Beitrag über Weiterbildung und notiere Empfehlungen, Zugangshürden, Verantwortlichkeiten und Begründungen.",
  },
  resources: {
    grammarBook: {
      title: "C1 Day 15 grammar notes",
      url: "/campus/course/c1-day-15-bildung-und-lebenslanges-lernen-grammar-notes",
    },
    workbook: {
      title: "C1 Day 15 workbook",
      url: "/campus/course/c1-day-15-bildung-und-lebenslanges-lernen-workbook",
    },
  },
  vocabulary: ["lebenslanges Lernen", "Weiterbildung", "Chancengleichheit", "Bildungszugang", "Finanzierungsmodell", "Anerkennung", "Eigenverantwortung", "Beschäftigungsfähigkeit"],
});

export default c1Day15BildungUndLebenslangesLernen;
