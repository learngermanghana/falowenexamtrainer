import { makeLesson } from "../buildSelfLearningLesson";

const c1Day14InnovationUndZukunft = makeLesson({
  level: "C1",
  day: 14,
  chapter: "3.4",
  title: "Innovation und Zukunft",
  topic: "Technologische Entwicklung, gesellschaftlichen Wandel sowie Chancen und Risiken neuer Technologien differenziert bewerten",
  heroImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
  grammarFocus: "Futurformen und Prognosesprache: zukünftige Entwicklungen präzise, abgestuft und bedingt formulieren",
  objectives: [
    "Ich kann Futur I und Futur II sicher bilden und funktional unterscheiden.",
    "Ich kann Prognosen nach Wahrscheinlichkeit, Unsicherheit und zeitlichem Abschluss abstufen.",
    "Ich kann Chancen, Risiken und Bedingungen technologischer Entwicklungen differenziert darstellen.",
    "Ich kann einen C1-Meinungsessay zur staatlichen Förderung von Zukunftstechnologien verfassen.",
  ],
  explanation: [
    "Innovationen verändern Arbeit, Bildung, Gesundheit, Mobilität und gesellschaftliche Teilhabe. Zukunftsaussagen wirken jedoch nur überzeugend, wenn sie nicht pauschal, sondern sprachlich abgestuft formuliert werden.",
    "Futur I beschreibt zukünftige Entwicklungen oder begründete Vermutungen. Futur II zeigt, dass eine Handlung bis zu einem zukünftigen Zeitpunkt abgeschlossen sein wird, und kann außerdem Vermutungen über bereits abgeschlossene Vorgänge ausdrücken.",
    "Die Schreibaufgabe ist eine sachliche Erörterung darüber, ob der Staat Zukunftstechnologien stärker fördern sollte, obwohl ihre Risiken noch nicht vollständig abschätzbar sind.",
  ],
  grammarLesson: {
    title: "Futurformen und Prognosesprache",
    explanation: [
      "Futur I wird mit werden + Infinitiv gebildet: In zehn Jahren wird künstliche Intelligenz viele Routineaufgaben übernehmen.",
      "Futur II wird mit werden + Partizip II + haben oder sein gebildet: Bis 2040 wird sich der Energiemarkt grundlegend verändert haben.",
      "Prognosemarker wie vermutlich, voraussichtlich, aller Wahrscheinlichkeit nach, es ist anzunehmen, dass und es ist nicht auszuschließen, dass zeigen, wie sicher eine Aussage gemeint ist.",
    ],
    rules: [
      "Verwende Futur I für zukünftige Entwicklungen, Absichten und begründete Vermutungen.",
      "Verwende Futur II, wenn etwas bis zu einem zukünftigen Zeitpunkt abgeschlossen sein wird.",
      "Stufe Prognosen mit passenden Markern ab: sicher, wahrscheinlich, möglich oder spekulativ.",
      "Formuliere Bedingungen mit wenn, falls, sofern oder vorausgesetzt, dass.",
      "Vermeide absolute Aussagen wie Technologie wird alle Probleme lösen; formuliere stattdessen Grenzen und Voraussetzungen.",
      "Verbinde Prognose und Bewertung: Es ist anzunehmen, dass ..., allerdings hängt dies davon ab, ob ...",
    ],
    examples: [
      "In den kommenden Jahren wird künstliche Intelligenz zahlreiche Routineaufgaben automatisieren.",
      "Bis 2035 werden viele Unternehmen ihre Produktionsprozesse vollständig digitalisiert haben.",
      "Aller Wahrscheinlichkeit nach wird personalisierte Medizin an Bedeutung gewinnen.",
      "Falls die digitale Infrastruktur ausgebaut wird, könnten auch ländliche Regionen stärker profitieren.",
      "Es ist nicht auszuschließen, dass neue Technologien bestehende soziale Ungleichheiten verschärfen werden.",
    ],
    miniExercise: "Formuliere differenzierte Prognosen: 1) KI verändert viele Berufe. 2) Bis 2040 ist der Energiemarkt vollständig umgebaut. 3) Neue Technologien lösen soziale Probleme. 4) Der Staat investiert mehr, Innovationen verbreiten sich schneller.",
    knowledgeTest: [
      {
        question: "Welche Form ist korrektes Futur II?",
        options: [
          "Bis 2035 werden viele Unternehmen ihre Prozesse digitalisiert haben.",
          "Bis 2035 werden viele Unternehmen ihre Prozesse digitalisieren haben.",
          "Bis 2035 haben viele Unternehmen ihre Prozesse werden digitalisiert.",
          "Bis 2035 werden viele Unternehmen ihre Prozesse digitalisiert werden haben.",
        ],
        answer: "Bis 2035 werden viele Unternehmen ihre Prozesse digitalisiert haben.",
        explanation: "Futur II besteht aus werden + Partizip II + haben oder sein.",
      },
      {
        question: "Welche Formulierung ist eine vorsichtige C1-Prognose?",
        options: [
          "Aller Wahrscheinlichkeit nach wird KI bestimmte Tätigkeiten automatisieren.",
          "KI ersetzt ganz sicher sofort alle Arbeitsplätze.",
          "KI macht vielleicht irgendwie alles anders.",
          "KI hat morgen alle Berufe ersetzt haben.",
        ],
        answer: "Aller Wahrscheinlichkeit nach wird KI bestimmte Tätigkeiten automatisieren.",
        explanation: "Der Prognosemarker stuft die Aussage nachvollziehbar und formell ab.",
      },
      {
        question: "Welche Aussage formuliert eine Bedingung präzise?",
        options: [
          "Sofern Datenschutzstandards eingehalten werden, kann die Technologie gesellschaftlichen Nutzen schaffen.",
          "Datenschutz ist egal, Technologie ist immer gut.",
          "Technologie schafft Nutzen und sofern.",
          "Wenn Technologie, dann alles besser sicher.",
        ],
        answer: "Sofern Datenschutzstandards eingehalten werden, kann die Technologie gesellschaftlichen Nutzen schaffen.",
        explanation: "Sofern leitet eine klare Bedingung ein und verhindert eine pauschale Aussage.",
      },
      {
        question: "Wann verwendet man Futur II?",
        options: [
          "Wenn eine Handlung bis zu einem zukünftigen Zeitpunkt abgeschlossen sein wird.",
          "Nur für spontane Befehle.",
          "Nur für allgemeine Fakten ohne Zeitbezug.",
          "Wenn man ausschließlich über die Gegenwart spricht.",
        ],
        answer: "Wenn eine Handlung bis zu einem zukünftigen Zeitpunkt abgeschlossen sein wird.",
        explanation: "Futur II legt den Fokus auf den zukünftigen Abschluss einer Handlung oder Entwicklung.",
      },
    ],
  },
  speakingTaskType: "C1 future innovation presentation",
  speakingTopic: "Sprechen: Welche Innovationen werden unseren Alltag in den nächsten zehn Jahren am stärksten prägen?",
  speakingBuilder: {
    branches: [
      { id: "felder", title: "Innovationsfelder", keywords: ["künstliche Intelligenz", "Robotik", "Medizin", "Energie", "Mobilität"] },
      { id: "alltag", title: "Alltag und Arbeitswelt", keywords: ["Automatisierung", "Zeitersparnis", "neue Berufe", "Kompetenzen", "Zugang"] },
      { id: "chancen", title: "Chancen", keywords: ["Produktivität", "Gesundheit", "Nachhaltigkeit", "Sicherheit", "Teilhabe"] },
      { id: "risiken", title: "Risiken", keywords: ["Datenschutz", "Abhängigkeit", "Arbeitsplatzverlust", "Ungleichheit", "Missbrauch"] },
      { id: "rahmen", title: "Rahmenbedingungen", keywords: ["Regulierung", "Forschung", "Bildung", "Infrastruktur", "Transparenz"] },
      { id: "prognose", title: "Zukunftsszenario", keywords: ["Futur I", "Futur II", "Wahrscheinlichkeit", "Bedingungen", "Grenzen"] },
    ],
  },
  writingTaskType: "C1 opinion essay / Erörterung",
  writingTopic: "Schreiben: Soll der Staat Zukunftstechnologien stärker fördern – auch wenn Risiken noch nicht vollständig abschätzbar sind? Verfassen Sie für ein überregionales Online-Magazin einen C1-Meinungsessay mit 220–280 Wörtern. Erläutern Sie zwei Gründe für staatliche Förderung. Berücksichtigen Sie mindestens ein relevantes Gegenargument mit Risikoaspekt. Formulieren Sie eine eigene Prognose für die nächsten zehn Jahre. Entwickeln Sie eine begründete Schlussposition mit einer konkreten Empfehlung.",
  writingBuilder: {
    structure: [
      "Einleitung, Relevanz und klare These",
      "Zwei Gründe für staatliche Förderung",
      "Gegenargument und Risikoabwägung",
      "Eigene Prognose für die nächsten zehn Jahre",
      "Konkrete Empfehlung und Schlussposition",
    ],
    usefulLines: [
      "Die Förderung von Zukunftstechnologien gilt als Voraussetzung für wirtschaftliche und gesellschaftliche Wettbewerbsfähigkeit; zugleich bleiben erhebliche Risiken bestehen.",
      "Ein wesentliches Argument für staatliche Investitionen besteht darin, dass ...",
      "Darüber hinaus könnte eine gezielte Förderung dazu beitragen, ...",
      "Kritiker wenden jedoch zu Recht ein, dass die langfristigen Folgen bislang nur teilweise abschätzbar sind.",
      "Aller Wahrscheinlichkeit nach wird sich in den kommenden zehn Jahren ...",
      "Meines Erachtens sollte der Staat fördern, sofern Transparenz, Kontrolle und gesellschaftlicher Nutzen gewährleistet sind.",
    ],
  },
  tasks: {
    speaking: "Halte einen 3- bis 4-minütigen Kurzvortrag über zwei oder drei Innovationen, ihre Chancen und Risiken sowie mindestens zwei differenzierte Prognosen.",
    writing: "Schreibe 220–280 Wörter als C1-Meinungsessay über die staatliche Förderung von Zukunftstechnologien.",
    reading: "Lies einen Kommentar zur Technologieförderung und markiere Fakten, Prognosen, Bedingungen, Einschränkungen und Wertungen.",
    listening: "Höre ein Interview mit einer Zukunftsforscherin und notiere drei Prognosen sowie den jeweiligen Grad ihrer Sicherheit.",
  },
  resources: {
    grammarBook: {
      title: "C1 Day 14 grammar notes",
      url: "/campus/course/c1-day-14-innovation-und-zukunft-grammar-notes",
    },
    workbook: {
      title: "C1 Day 14 workbook",
      url: "/campus/course/c1-day-14-innovation-und-zukunft-workbook",
    },
  },
  vocabulary: ["Innovation", "Zukunftstechnologie", "Prognose", "Futur I", "Futur II", "Regulierung", "Folgenabschätzung", "Förderung"],
});

export default c1Day14InnovationUndZukunft;
