const SPEAKING_OUTLINE = [
  "Begrüßung + Thema nennen",
  "Begriff kurz erklären oder definieren",
  "Zwei konkrete Beispiele nennen",
  "Vergleich oder Kontrast herstellen",
  "Eigene Meinung + Begründung geben",
  "Kurz zusammenfassen und abschließen",
];

const SPEAKING_STARTERS = [
  "Meiner Meinung nach …",
  "Ein Beispiel dafür ist …",
  "Zum einen …",
  "Zum anderen …",
  "Außerdem …",
  "Zusammenfassend …",
];

export const B2_SELF_LEARNING_PLAN = [
  {
    day: 1,
    title: "Welcome + Self-learning kickoff",
    topic: "Introduce yourself and explain why you are learning German at B2.",
    brainMap: [
      "Ich heiße ... und komme aus ...",
      "Ich lerne Deutsch, weil ...",
      "Mein Ziel ist das Goethe-B2-Zertifikat.",
      "Zuerst ..., danach ..., schließlich ...",
    ],
    speaking: {
      concept:
        "Introduce yourself with context. Share who you are, your learning history, and what B2 means for your goals.",
      outline: SPEAKING_OUTLINE,
      starters: SPEAKING_STARTERS,
      grammarNotes: [
        "Use sequencing connectors to structure your introduction (zuerst, danach, schließlich).",
        "Use reason/goal clauses to explain your motivation (weil, damit, um ... zu).",
        "Use modal verbs to state intentions and abilities (möchte, will, kann).",
      ],
      grammarPurpose: "Helps you organize your intro and justify your B2 goals clearly.",
      prompt:
        "Sprich 60–90 Sekunden (Goethe-B2-Stil): Stelle dich vor, nenne dein Ziel für B2 und beschreibe eine Lernherausforderung.",
      askGrammarPrompt:
        "Unsicher bei Satzstellung, Konnektoren oder Modalverben? Stelle zuerst eine kurze Grammatikfrage.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-B2-Stil einen formellen Brief/E-Mail an die Kursleitung: Stell dich vor, erkläre dein B2-Ziel (weil/damit) und nenne eine Lernschwierigkeit.",
    },
    skimmingWords: [
      "außerdem",
      "dennoch",
      "sowohl … als auch",
      "während",
      "inzwischen",
      "darüber hinaus",
      "zum Beispiel",
      "abschließend",
    ],
  },
  {
    day: 2,
    title: "Kultur: explain the concept + give examples",
    topic: "Kultur: what it means, why it matters, and examples from your experience.",
    brainMap: [
      "In Deutschland ist Kultur sehr bekannt.",
      "Viele Menschen haben ihre eigene Kultur.",
      "Kultur zeigt sich in Sprache, Essen und Festen.",
      "Menschen vergleichen Kulturen und lernen voneinander.",
    ],
    speaking: {
      concept:
        "Define Kultur in your own words (values, traditions, daily habits). Give 2–3 concrete examples and compare cultures.",
      outline: SPEAKING_OUTLINE,
      starters: SPEAKING_STARTERS,
      grammarNotes: [
        "Use compound nouns to label cultural concepts (Kulturerbe, Alltagskultur).",
        "Use comparison phrases to contrast cultures (im Vergleich zu, genauso wie, anders als).",
        "Use relative clauses to define Kultur precisely (die Kultur, die ...).",
      ],
      grammarPurpose: "Supports clear definitions and comparisons in your cultural examples.",
      prompt:
        "Sprich 90 Sekunden (Goethe-B2-Stil): Erkläre, was Kultur bedeutet, gib zwei Beispiele und vergleiche zwei Kulturen.",
      askGrammarPrompt:
        "Wenn du Hilfe beim Definieren oder Vergleichen brauchst, frag zuerst den Grammar-Coach.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-B2-Stil einen kurzen Meinungsaufsatz über die Bedeutung von Kultur in einer Gemeinschaft. Nutze mindestens eine Relativsatz-Definition und Vergleichsformen.",
    },
    reading: {
      title: "Lesetext (gemeinfrei): Adolf Loos, Kultur (1908)",
      text:
        "Es mag für den deutschen nicht sehr angenehm sein, zu hören, er solle seine eigene kultur aufgeben und die englische annehmen. Aber das hört der bulgare auch nicht gern und der chinese noch weniger. Mit sentimentalitäten ist dieser frage nicht heizukommen.",
      optional: true,
      tasks: [
        "Markiere drei Wörter, die die Haltung des Autors zeigen.",
        "Fasse den Inhalt in 2–3 Sätzen zusammen.",
        "Schreibe einen Satz mit „denn“ oder „trotzdem“, der den Text kommentiert.",
      ],
      source:
        "Adolf Loos (1908), „Kultur“. Gemeinfrei. Quelle: de.wikisource.org/wiki/Kultur_(Loos).",
    },
    listening: {
      title: "Hörverstehen (eigene Aufnahme)",
      prompt:
        "Lies den Lesetext laut, nimm dich auf und höre die Aufnahme zweimal an.",
      optional: true,
      tasks: [
        "Notiere 3 Schlüsselwörter, die du beim Hören erkennst.",
        "Beantworte: Was ist die Hauptaussage des Autors?",
        "Sprich 30 Sekunden: Stimme ich zu? Warum/warum nicht?",
      ],
      source:
        "Eigene Aufnahme eines gemeinfreien Textes (Adolf Loos, 1908).",
    },
    skimmingWords: [
      "Kulturerbe",
      "Bräuche",
      "Vielfalt",
      "Gemeinschaft",
      "Prägung",
      "im Vergleich zu",
      "genauso wie",
      "anders als",
    ],
  },
  {
    day: 3,
    title: "Medien: Informationen bewerten",
    topic: "Mediennutzung und Informationsquellen im Alltag.",
    brainMap: [
      "Ich informiere mich über ...",
      "Soziale Medien haben Vorteile und Risiken.",
      "Fakten prüfen ist wichtig.",
      "Man sollte Quellen vergleichen.",
    ],
    speaking: {
      concept:
        "Beschreibe deine Mediennutzung, nenne Chancen und Risiken und erkläre, wie du Informationen überprüfst.",
      outline: SPEAKING_OUTLINE,
      starters: SPEAKING_STARTERS,
      grammarNotes: [
        "Nutze Relativsätze, um Quellen zu beschreiben (die Seite, die ...).",
        "Verwende Konnektoren für Begründungen (denn, deshalb, trotzdem).",
        "Setze indirekte Fragen ein (Ich frage mich, ob ...).",
      ],
      grammarPurpose: "Hilft dir, Quellen zu erläutern und deine Meinung zu begründen.",
      prompt:
        "Sprich 90 Sekunden (Goethe-B2-Stil): Erkläre, wie du Informationen findest, nenne Vorteile/Nachteile sozialer Medien und gib einen Tipp zur Quellenprüfung.",
      askGrammarPrompt:
        "Wenn du Hilfe mit Relativsätzen oder Konnektoren brauchst, frag zuerst.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-B2-Stil einen kurzen Meinungsaufsatz über Informationsquellen. Nenne zwei Vorteile, zwei Risiken und eine Empfehlung.",
    },
    skimmingWords: [
      "Quelle",
      "Nachricht",
      "glaubwürdig",
      "Faktencheck",
      "verifizieren",
      "Filterblase",
      "manipulieren",
      "verlässlich",
    ],
  },
  {
    day: 4,
    title: "Freundschaft und Beziehungen",
    topic: "Was macht gute Beziehungen aus?",
    brainMap: [
      "Vertrauen und Respekt sind wichtig.",
      "Kommunikation löst Konflikte.",
      "Freundschaften verändern sich.",
      "Gemeinsame Interessen verbinden.",
    ],
    speaking: {
      concept:
        "Erkläre, was eine gute Freundschaft ausmacht, und nenne Beispiele aus deinem Alltag.",
      outline: SPEAKING_OUTLINE,
      starters: SPEAKING_STARTERS,
      grammarNotes: [
        "Nutze weil/da, um Gründe zu nennen (weil, da).",
        "Verwende zu-Infinitiv-Konstruktionen (um zu, ohne zu).",
        "Setze Adjektivdeklination für Beschreibungen ein.",
      ],
      grammarPurpose: "Hilft dir, Beziehungen zu beschreiben und Gründe klar zu benennen.",
      prompt:
        "Sprich 90 Sekunden (Goethe-B2-Stil): Beschreibe eine gute Freundschaft, nenne zwei Beispiele und gib einen Ratschlag.",
      askGrammarPrompt:
        "Brauchst du Hilfe bei Begründungen oder zu-Infinitiv? Frag zuerst.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-B2-Stil eine E-Mail an einen Freund: Erkläre, was dir in Freundschaften wichtig ist und schlage eine gemeinsame Aktivität vor.",
    },
    skimmingWords: [
      "Vertrauen",
      "Respekt",
      "Konflikt",
      "Unterstützung",
      "ehrlich",
      "gemeinsam",
      "Ratschlag",
      "verständnisvoll",
    ],
  },
  {
    day: 5,
    title: "Arbeit und Beruf",
    topic: "Berufliche Ziele, Chancen und Herausforderungen.",
    brainMap: [
      "Mein Berufsziel ist ...",
      "Wichtige Fähigkeiten sind ...",
      "Work-Life-Balance ist wichtig.",
      "Ich wünsche mir ...",
    ],
    speaking: {
      concept:
        "Beschreibe deinen Berufswunsch, wichtige Fähigkeiten und Herausforderungen im Arbeitsleben.",
      outline: SPEAKING_OUTLINE,
      starters: SPEAKING_STARTERS,
      grammarNotes: [
        "Nutze Konjunktiv II für Wünsche (ich würde, ich könnte).",
        "Verwende Modalverben für Anforderungen (müssen, sollen).",
        "Nutze wenn/falls für Bedingungen.",
      ],
      grammarPurpose: "Hilft dir, Ziele und Bedingungen im Berufsleben klar zu formulieren.",
      prompt:
        "Sprich 2 Minuten (Goethe-B2-Stil): Beschreibe deinen Berufswunsch, nenne zwei Anforderungen und vergleiche zwei Arbeitsmodelle.",
      askGrammarPrompt:
        "Wenn du Hilfe mit Konjunktiv II oder Bedingungen brauchst, frag zuerst.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-B2-Stil einen formellen Brief an ein Unternehmen: Stelle dich vor, nenne deine Stärken und erkläre, warum du dort arbeiten möchtest.",
    },
    skimmingWords: [
      "Bewerbung",
      "Qualifikation",
      "Erfahrung",
      "Arbeitsmodell",
      "Flexibilität",
      "Herausforderung",
      "Karriere",
      "Ziel",
    ],
  },
  {
    day: 6,
    title: "Gesundheit und Lebensstil",
    topic: "Gesund bleiben im Alltag.",
    brainMap: [
      "Sport und Bewegung helfen.",
      "Gesunde Ernährung ist wichtig.",
      "Stress vermeiden ist nötig.",
      "Ich empfehle ...",
    ],
    speaking: {
      concept:
        "Erkläre, wie man gesund bleibt, und gib konkrete Empfehlungen.",
      outline: SPEAKING_OUTLINE,
      starters: SPEAKING_STARTERS,
      grammarNotes: [
        "Nutze Imperativ für Ratschläge (Iss, Schlaf, Beweg dich).",
        "Verwende deshalb/daher für Folgen.",
        "Setze reflexive Verben ein (sich erholen, sich bewegen).",
      ],
      grammarPurpose: "Hilft dir, Empfehlungen und Auswirkungen klar auszudrücken.",
      prompt:
        "Sprich 90 Sekunden (Goethe-B2-Stil): Beschreibe drei Gesundheitsgewohnheiten, erkläre warum sie wichtig sind und gib einen Tipp.",
      askGrammarPrompt:
        "Wenn du Hilfe mit Imperativ oder Reflexivverben brauchst, frag zuerst.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-B2-Stil einen kurzen Ratgeber-Text über gesunden Lebensstil. Gib mindestens drei konkrete Tipps.",
    },
    skimmingWords: [
      "Bewegung",
      "Ernährung",
      "Stress",
      "Routine",
      "ausgewogen",
      "Schlaf",
      "Gesundheit",
      "Gewohnheit",
    ],
  },
  {
    day: 7,
    title: "Reisen und Mobilität",
    topic: "Reiseerfahrungen und Transportmittel vergleichen.",
    brainMap: [
      "Ich reise gern nach ...",
      "Öffentliche Verkehrsmittel sind ...",
      "Fliegen ist schnell, aber ...",
      "Umweltfreundlich reisen ist wichtig.",
    ],
    speaking: {
      concept:
        "Erzähle von einer Reise, vergleiche Verkehrsmittel und nenne einen nachhaltigen Tipp.",
      outline: SPEAKING_OUTLINE,
      starters: SPEAKING_STARTERS,
      grammarNotes: [
        "Nutze Perfekt/Präteritum für Erfahrungen.",
        "Verwende um ... zu für Ziele.",
        "Setze Vergleichsformen ein (schneller, günstiger).",
      ],
      grammarPurpose: "Hilft dir, Erfahrungen und Vergleiche strukturiert zu erzählen.",
      prompt:
        "Sprich 2 Minuten (Goethe-B2-Stil): Berichte von einer Reise, vergleiche zwei Verkehrsmittel und gib einen Tipp fürs nachhaltige Reisen.",
      askGrammarPrompt:
        "Wenn du Hilfe mit Zeiten oder Vergleichen brauchst, frag zuerst.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-B2-Stil einen kurzen Bericht über eine Reise. Beschreibe Transport, Unterkunft und eine Herausforderung.",
    },
    skimmingWords: [
      "Reiseerlebnis",
      "Verkehrsmittel",
      "nachhaltig",
      "umweltfreundlich",
      "Preis-Leistung",
      "Anreise",
      "Unterkunft",
      "Erfahrung",
    ],
  },
  {
    day: 8,
    title: "Wohnen und Nachbarschaft",
    topic: "Wohnformen und Zusammenleben.",
    brainMap: [
      "Eine Wohnung muss ...",
      "Nachbarn können helfen oder stören.",
      "Gemeinschaftsräume sind praktisch.",
      "Regeln sind wichtig.",
    ],
    speaking: {
      concept:
        "Beschreibe deine Wohnsituation, nenne Vor- und Nachteile und gib eine Empfehlung.",
      outline: SPEAKING_OUTLINE,
      starters: SPEAKING_STARTERS,
      grammarNotes: [
        "Nutze Präpositionen mit Dativ/Akkusativ (in, an, neben).",
        "Verwende Relativsätze zur Beschreibung.",
        "Setze Passiv, um Regeln zu nennen (Es wird erwartet, dass ...).",
      ],
      grammarPurpose: "Hilft dir, Wohnsituation und Regeln klar zu beschreiben.",
      prompt:
        "Sprich 90 Sekunden (Goethe-B2-Stil): Beschreibe deine Wohnform, nenne zwei Vorteile und einen Nachteil, gib eine Empfehlung.",
      askGrammarPrompt:
        "Wenn du Hilfe mit Präpositionen oder Passiv brauchst, frag zuerst.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-B2-Stil eine Beschwerde-E-Mail an die Hausverwaltung über Lärm. Nenne das Problem und schlage eine Lösung vor.",
    },
    skimmingWords: [
      "Miete",
      "Nachbarschaft",
      "Hausordnung",
      "Lärm",
      "gemeinschaftlich",
      "ruhig",
      "Regel",
      "Beschwerde",
    ],
  },
  {
    day: 9,
    title: "Konsum und Werbung",
    topic: "Kaufverhalten, Werbung und bewusster Konsum.",
    brainMap: [
      "Werbung beeinflusst Entscheidungen.",
      "Online-Shopping ist bequem.",
      "Impulse vermeiden ist wichtig.",
      "Preis und Qualität vergleichen.",
    ],
    speaking: {
      concept:
        "Erkläre, wie Werbung dich beeinflusst, und nenne Strategien für bewussten Konsum.",
      outline: SPEAKING_OUTLINE,
      starters: SPEAKING_STARTERS,
      grammarNotes: [
        "Nutze Vergleichsformen (besser, günstiger).",
        "Verwende Konjunktiv II für Kritik (man würde denken).",
        "Setze Genitiv oder von-Konstruktionen ein.",
      ],
      grammarPurpose: "Hilft dir, Bewertungen und Kritik differenziert auszudrücken.",
      prompt:
        "Sprich 90 Sekunden (Goethe-B2-Stil): Erkläre den Einfluss von Werbung, nenne Vor-/Nachteile von Online-Shopping und gib einen Spartipp.",
      askGrammarPrompt:
        "Wenn du Hilfe mit Vergleichen oder Konjunktiv II brauchst, frag zuerst.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-B2-Stil einen kurzen Kommentar über nachhaltigen Konsum. Nenne zwei konkrete Maßnahmen.",
    },
    skimmingWords: [
      "Konsum",
      "Werbung",
      "Nachhaltigkeit",
      "Impuls",
      "Preisvergleich",
      "Kaufverhalten",
      "Rückgabe",
      "Qualität",
    ],
  },
  {
    day: 10,
    title: "Migration und Integration",
    topic: "Ankommen, Teilhabe und Herausforderungen.",
    brainMap: [
      "Integration braucht Sprache.",
      "Kulturelle Vielfalt bereichert.",
      "Herausforderungen sind ...",
      "Unterstützung hilft.",
    ],
    speaking: {
      concept:
        "Erkläre, was Integration bedeutet, nenne Herausforderungen und mögliche Lösungen.",
      outline: SPEAKING_OUTLINE,
      starters: SPEAKING_STARTERS,
      grammarNotes: [
        "Nutze obwohl/trotzdem für Kontraste.",
        "Verwende Nominalisierungen (Integration, Teilhabe).",
        "Setze Partizipien für Beschreibungen ein.",
      ],
      grammarPurpose: "Hilft dir, komplexe Themen sachlich zu strukturieren.",
      prompt:
        "Sprich 2 Minuten (Goethe-B2-Stil): Erkläre Integration, nenne zwei Herausforderungen, gib zwei Lösungen und schließe ab.",
      askGrammarPrompt:
        "Wenn du Hilfe mit Kontrasten oder Nominalisierung brauchst, frag zuerst.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-B2-Stil einen kurzen Meinungsaufsatz über Integration in der Schule oder am Arbeitsplatz.",
    },
    skimmingWords: [
      "Integration",
      "Teilhabe",
      "Sprache",
      "Unterstützung",
      "Vielfalt",
      "Herausforderung",
      "Ankommen",
      "Chancengleichheit",
    ],
  },
  {
    day: 11,
    title: "Politik und Engagement",
    topic: "Mitbestimmung und Verantwortung in der Gesellschaft.",
    brainMap: [
      "Wählen ist wichtig.",
      "Engagement beginnt im Alltag.",
      "Information ist notwendig.",
      "Verantwortung tragen.",
    ],
    speaking: {
      concept:
        "Erkläre, warum Engagement wichtig ist, und nenne Beispiele für Mitbestimmung.",
      outline: SPEAKING_OUTLINE,
      starters: SPEAKING_STARTERS,
      grammarNotes: [
        "Nutze Passiv für Prozesse (es wird gewählt).",
        "Verwende damit/um ... zu für Ziele.",
        "Setze Konnektoren für Struktur (außerdem, dennoch).",
      ],
      grammarPurpose: "Hilft dir, gesellschaftliche Prozesse klar zu erläutern.",
      prompt:
        "Sprich 90 Sekunden (Goethe-B2-Stil): Erkläre, warum Engagement wichtig ist, nenne zwei Beispiele und gib eine Empfehlung.",
      askGrammarPrompt:
        "Wenn du Hilfe mit Passiv oder Zweckangaben brauchst, frag zuerst.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-B2-Stil eine kurze Stellungnahme über freiwilliges Engagement. Begründe deine Meinung.",
    },
    skimmingWords: [
      "Engagement",
      "Mitbestimmung",
      "Verantwortung",
      "Wahl",
      "Beteiligung",
      "Gemeinschaft",
      "Demokratie",
      "ehrenamtlich",
    ],
  },
  {
    day: 12,
    title: "Freizeit und Kultur",
    topic: "Hobbys, Veranstaltungen und Ausgleich.",
    brainMap: [
      "In meiner Freizeit mache ich ...",
      "Kulturveranstaltungen sind ...",
      "Ausgleich ist wichtig.",
      "Man lernt neue Leute kennen.",
    ],
    speaking: {
      concept:
        "Beschreibe deine Hobbys, erkläre ihren Nutzen und vergleiche zwei Freizeitformen.",
      outline: SPEAKING_OUTLINE,
      starters: SPEAKING_STARTERS,
      grammarNotes: [
        "Nutze Nebensätze mit während/als.",
        "Verwende Adjektive für Bewertungen.",
        "Setze sowohl ... als auch für Aufzählungen ein.",
      ],
      grammarPurpose: "Hilft dir, Freizeitaktivitäten strukturiert zu vergleichen.",
      prompt:
        "Sprich 90 Sekunden (Goethe-B2-Stil): Beschreibe ein Hobby, vergleiche zwei Freizeitformen und nenne einen Vorteil für die Gesundheit.",
      askGrammarPrompt:
        "Wenn du Hilfe mit Nebensätzen brauchst, frag zuerst.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-B2-Stil eine Einladung zu einer kulturellen Veranstaltung. Nenne Ort, Zeit und Programm.",
    },
    skimmingWords: [
      "Freizeit",
      "Hobby",
      "Kulturveranstaltung",
      "Ausgleich",
      "entspannen",
      "aktiv",
      "Programm",
      "teilnehmen",
    ],
  },
  {
    day: 13,
    title: "Sprache und Kommunikation",
    topic: "Sprachenlernen und Kommunikation im Beruf.",
    brainMap: [
      "Sprachen öffnen Türen.",
      "Kommunikation braucht Klarheit.",
      "Missverständnisse passieren.",
      "Übung verbessert.",
    ],
    speaking: {
      concept:
        "Erkläre, warum Sprachenlernen wichtig ist, und nenne Strategien für bessere Kommunikation.",
      outline: SPEAKING_OUTLINE,
      starters: SPEAKING_STARTERS,
      grammarNotes: [
        "Nutze indirekte Rede (Er sagte, dass ...).",
        "Verwende Konnektoren für Struktur (dennoch, außerdem).",
        "Setze Präpositionen mit Genitiv ein (trotz, während).",
      ],
      grammarPurpose: "Hilft dir, Aussagen anderer korrekt wiederzugeben.",
      prompt:
        "Sprich 90 Sekunden (Goethe-B2-Stil): Erkläre die Bedeutung von Sprachen, nenne zwei Lernstrategien und gib einen Tipp für Missverständnisse.",
      askGrammarPrompt:
        "Wenn du Hilfe mit indirekter Rede brauchst, frag zuerst.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-B2-Stil einen kurzen Erfahrungsbericht über eine Kommunikationssituation im Kurs oder Beruf.",
    },
    skimmingWords: [
      "Kommunikation",
      "Missverständnis",
      "Ausdruck",
      "Formulierung",
      "Feedback",
      "klar",
      "Tonfall",
      "Strategie",
    ],
  },
  {
    day: 14,
    title: "Wissenschaft und Zukunft",
    topic: "Innovationen und ihre Auswirkungen auf den Alltag.",
    brainMap: [
      "Forschung bringt Fortschritt.",
      "Neue Technologien verändern Berufe.",
      "Chancen und Risiken abwägen.",
      "Zukunft planen.",
    ],
    speaking: {
      concept:
        "Beschreibe eine Innovation, erkläre Chancen und Risiken und gib eine Prognose.",
      outline: SPEAKING_OUTLINE,
      starters: SPEAKING_STARTERS,
      grammarNotes: [
        "Nutze Futur I/II für Prognosen.",
        "Verwende wenn/falls für Szenarien.",
        "Setze zu-Infinitiv für Ziele ein.",
      ],
      grammarPurpose: "Hilft dir, Zukunftsaussagen strukturiert zu formulieren.",
      prompt:
        "Sprich 2 Minuten (Goethe-B2-Stil): Beschreibe eine Innovation, nenne Chancen/Risiken und gib eine Prognose für die Zukunft.",
      askGrammarPrompt:
        "Wenn du Hilfe mit Futur brauchst, frag zuerst.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-B2-Stil einen kurzen Meinungsaufsatz über technologische Innovationen und ihre Auswirkungen.",
    },
    skimmingWords: [
      "Innovation",
      "Forschung",
      "Fortschritt",
      "Risiko",
      "Prognose",
      "Zukunft",
      "entwickeln",
      "Auswirkung",
    ],
  },
  {
    day: 15,
    title: "Bildung: definition to conclusion",
    topic: "Bildung and lifelong learning in modern society.",
    brainMap: [
      "Bildung = Wissen + Kompetenzen.",
      "Lebenslanges Lernen = immer weiterlernen.",
      "Vorteile: Chancen, Karriere.",
      "Nachteile/Probleme: Zeit, Kosten.",
    ],
    speaking: {
      concept:
        "Explain what Bildung means today and how learning shapes personal and social opportunities.",
      outline: SPEAKING_OUTLINE,
      starters: SPEAKING_STARTERS,
      grammarNotes: [
        "Use nominalizations to sound formal when defining Bildung (Bildung, Weiterbildung, Qualifikation).",
        "Use purpose clauses to explain learning goals (damit, um ... zu).",
        "Use concession to balance pros/cons (obwohl, trotzdem).",
      ],
      grammarPurpose: "Helps you define Bildung, explain goals, and weigh pros/cons.",
      prompt:
        "Sprich 2 Minuten (Goethe-B2-Stil): Definiere Bildung, gib zwei Beispiele, vergleiche Schule und Selbstlernen, nenne Vor-/Nachteile, gib eine Empfehlung und schließe ab.",
      askGrammarPrompt:
        "Wenn du Hilfe mit Nominalisierungen oder Zweckangaben brauchst, frag vor der Aufnahme.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-B2-Stil einen Meinungsaufsatz über lebenslanges Lernen. Verwende damit/um ... zu und ein obwohl/trotzdem, um Vor- und Nachteile abzuwägen.",
    },
    skimmingWords: [
      "Weiterbildung",
      "Lebenslanges Lernen",
      "Chancengleichheit",
      "Qualifikation",
      "Förderung",
      "Zugang",
      "Fortbildung",
      "abschließend",
    ],
  },
  {
    day: 16,
    title: "Technologie: definition to conclusion",
    topic: "Technologie in Alltag, Schule, und Beruf.",
    brainMap: [
      "Technologie im Alltag: Smartphone, Apps.",
      "Vorteile: schneller, effizient.",
      "Nachteile: Ablenkung, Abhängigkeit.",
      "Vergleich: früher vs. heute.",
    ],
    speaking: {
      concept:
        "Define technology broadly and describe its impact on daily routines and communication.",
      outline: SPEAKING_OUTLINE,
      starters: SPEAKING_STARTERS,
      grammarNotes: [
        "Use passive voice to describe how tech is used (wird genutzt, wurde entwickelt).",
        "Use cause-effect connectors to link tech and consequences (deshalb, dadurch, infolgedessen).",
        "Use comparatives/superlatives to compare life before/after smartphones.",
      ],
      grammarPurpose: "Lets you describe tech processes and compare impacts clearly.",
      prompt:
        "Sprich 2 Minuten (Goethe-B2-Stil): Definiere Technologie, gib Beispiele, vergleiche früher/heute, nenne Vor-/Nachteile, gib eine Empfehlung und schließe ab.",
      askGrammarPrompt:
        "Brauchst du Hilfe mit Passiv oder Ursache-Wirkung-Konnektoren? Frag zuerst.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-B2-Stil einen Meinungsaufsatz (Vorteile/Nachteile) über Smartphones im Unterricht. Nutze Vergleiche und Ursache-Wirkung-Konnektoren (deshalb, dadurch).",
    },
    skimmingWords: [
      "digital",
      "Innovation",
      "Datenschutz",
      "effizient",
      "Fortschritt",
      "Abhängigkeit",
      "vernetzt",
      "sicher",
    ],
  },
  {
    day: 17,
    title: "Umwelt: definition to conclusion",
    topic: "Umweltschutz and sustainable habits.",
    brainMap: [
      "Umweltschutz: Müll trennen, Energie sparen.",
      "Individuelle Verantwortung vs. Politik.",
      "Wenn/falls ... dann ...",
      "Empfehlung: soll/muss.",
    ],
    speaking: {
      concept:
        "Describe what environmental protection includes and why individual actions matter.",
      outline: SPEAKING_OUTLINE,
      starters: SPEAKING_STARTERS,
      grammarNotes: [
        "Use verb-preposition pairs to name actions (sich kümmern um, beitragen zu).",
        "Use conditionals to propose scenarios and solutions (wenn, falls).",
        "Use modal verbs to express obligation in recommendations (müssen, sollen).",
      ],
      grammarPurpose: "Helps you propose actions and responsibilities for sustainability.",
      prompt:
        "Sprich 2 Minuten (Goethe-B2-Stil): Definiere Umweltschutz, gib Beispiele, vergleiche Stadt/Land, nenne Vor-/Nachteile strenger Regeln, empfehle eine Maßnahme.",
      askGrammarPrompt:
        "Wenn Konditionalsätze oder Modalverben schwierig sind, frag vor der Aufnahme.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-B2-Stil einen formellen Brief an die Hausverwaltung mit einem Vorschlag zum Recycling. Nutze wenn/falls und sollen/müssen.",
    },
    skimmingWords: [
      "nachhaltig",
      "Klimawandel",
      "Ressourcen",
      "Energieverbrauch",
      "Mülltrennung",
      "CO2",
      "Verzicht",
      "Maßnahme",
    ],
  },
  {
    day: 18,
    title: "Gesellschaft: definition to conclusion",
    topic: "Gesellschaft and social cohesion.",
    brainMap: [
      "Gesellschaft = Menschen + Regeln + Werte.",
      "Zusammenhalt durch Projekte/Initiativen.",
      "Kontrast: Individualismus vs. Gemeinschaft.",
      "Außerdem/hingegen als Verknüpfung.",
    ],
    speaking: {
      concept:
        "Explain society as a network of people, rules, and shared responsibilities.",
      outline: SPEAKING_OUTLINE,
      starters: SPEAKING_STARTERS,
      grammarNotes: [
        "Use relative clauses to define social groups (die Menschen, die ...).",
        "Use noun clauses to explain social rules and beliefs (dass, ob).",
        "Use conjunctive adverbs to add or contrast ideas (außerdem, hingegen).",
      ],
      grammarPurpose: "Supports precise definitions and balanced viewpoints about society.",
      prompt:
        "Sprich 2 Minuten (Goethe-B2-Stil): Definiere Gesellschaft, gib Beispiele, vergleiche Individualismus/Gemeinschaft, nenne Vor-/Nachteile sozialer Medien, empfehle eine Initiative.",
      askGrammarPrompt:
        "Frag, wenn du Hilfe mit Relativsätzen oder Konjunktivadverbien brauchst.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-B2-Stil einen Meinungsaufsatz über ein lokales Projekt für Zusammenhalt. Nutze einen Relativsatz und ein Konjunktivadverb (hingegen/jedoch).",
    },
    skimmingWords: [
      "Zusammenhalt",
      "Miteinander",
      "Regeln",
      "Solidarität",
      "Konflikt",
      "Engagement",
      "Teilnahme",
      "Herausforderung",
    ],
  },
  {
    day: 19,
    title: "Arbeit: definition to conclusion",
    topic: "Work culture, jobs, and future skills.",
    brainMap: [
      "Arbeitswelt heute: flexibel, digital.",
      "Zukunft: neue Berufe, neue Kompetenzen.",
      "Vergleich: Büro vs. Homeoffice.",
      "Aus meiner Sicht ...",
    ],
    speaking: {
      concept:
        "Describe what Arbeit means today and how expectations have changed.",
      outline: SPEAKING_OUTLINE,
      starters: SPEAKING_STARTERS,
      grammarNotes: [
        "Use two-way prepositions to place work settings accurately (in der Firma, auf der Arbeit).",
        "Use future tense to predict job trends (werden).",
        "Use formal opinion phrases to present your view (aus meiner Sicht, meiner Meinung nach).",
      ],
      grammarPurpose: "Helps you describe work contexts and future expectations politely.",
      prompt:
        "Sprich 2 Minuten (Goethe-B2-Stil): Definiere Arbeit, gib Beispiele moderner Jobs, vergleiche Büro/Homeoffice, nenne Vor-/Nachteile flexibler Zeiten, empfehle eine Kompetenz.",
      askGrammarPrompt:
        "Wenn Präpositionen oder Futurformen verwirrend sind, frag zuerst.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-B2-Stil einen Meinungsaufsatz über Zukunftskompetenzen im Beruf. Verwende Futur und eine formelle Meinungsformel.",
    },
    skimmingWords: [
      "Arbeitsplatz",
      "Flexibilität",
      "Karriere",
      "Arbeitszeit",
      "Homeoffice",
      "Teamarbeit",
      "Kompetenz",
      "Zukunft",
    ],
  },
  {
    day: 20,
    title: "Gesundheit: definition to conclusion",
    topic: "Health, prevention, and lifestyle choices.",
    brainMap: [
      "Gesundheit: körperlich, mental, sozial.",
      "Gewohnheiten: Schlaf, Bewegung, Ernährung.",
      "Stressquellen: Arbeit vs. Schule.",
      "Kontrast: während/hingegen.",
    ],
    speaking: {
      concept:
        "Explain health as physical, mental, and social well-being.",
      outline: SPEAKING_OUTLINE,
      starters: SPEAKING_STARTERS,
      grammarNotes: [
        "Use genitive with abstract nouns to define health (die Bedeutung der Gesundheit).",
        "Use reflexive verbs to describe daily habits (sich ernähren, sich bewegen).",
        "Use contrast connectors to compare stress sources (während, hingegen).",
      ],
      grammarPurpose: "Helps you define health and compare habits and stressors.",
      prompt:
        "Sprich 2 Minuten (Goethe-B2-Stil): Definiere Gesundheit, gib Beispiele, vergleiche Stressquellen, nenne Vor-/Nachteile von Fitness-Apps, empfehle eine Routine.",
      askGrammarPrompt:
        "Brauchst du Hilfe mit Genitiv oder reflexiven Verben? Frag vor der Aufnahme.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-B2-Stil einen Meinungsaufsatz über digitale Fitness-Apps. Nutze ein reflexives Verb und einen Kontrast (hingegen/während).",
    },
    skimmingWords: [
      "Wohlbefinden",
      "Prävention",
      "Bewegung",
      "Ernährung",
      "Stress",
      "ausgewogen",
      "Routine",
      "Entspannung",
    ],
  },
  {
    day: 21,
    title: "Migration: definition to conclusion",
    topic: "Migration, reasons, and integration.",
    brainMap: [
      "Gründe: Arbeit, Sicherheit, Familie.",
      "Push/Pull-Faktoren erklären.",
      "Integration: Sprache, Arbeit, Schule.",
      "Zuerst/dann als Reihenfolge.",
    ],
    speaking: {
      concept:
        "Define migration and describe common push and pull factors.",
      outline: SPEAKING_OUTLINE,
      starters: SPEAKING_STARTERS,
      grammarNotes: [
        "Use reason clauses to explain migration factors (weil, da).",
        "Use passive voice to describe integration processes (es wird integriert).",
        "Use time/place order to structure the sequence (zuerst, dann).",
      ],
      grammarPurpose: "Supports clear explanations of causes and integration steps.",
      prompt:
        "Sprich 2 Minuten (Goethe-B2-Stil): Definiere Migration, nenne Gründe, vergleiche freiwillig/erzwungen, nenne Vor-/Nachteile, empfehle eine Integrationsmaßnahme.",
      askGrammarPrompt:
        "Wenn Begründungssätze oder Passivformen schwer sind, frag zuerst.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-B2-Stil einen Meinungsaufsatz über Integrationsprogramme. Verwende weil/da, eine passive Form und eine zeitliche Reihenfolge.",
    },
    skimmingWords: [
      "Zuwanderung",
      "Flucht",
      "Integration",
      "Vielfalt",
      "Herkunft",
      "Chancen",
      "Herausforderung",
      "Teilhabe",
    ],
  },
  {
    day: 22,
    title: "Medien: definition to conclusion",
    topic: "Media literacy and information quality.",
    brainMap: [
      "Medienkompetenz = kritisch prüfen.",
      "Quellen: Zeitung, Social Media.",
      "Gefahr: Fake News.",
      "Jedoch/trotzdem als Kontrast.",
    ],
    speaking: {
      concept:
        "Explain what media literacy is and why it matters for informed decisions.",
      outline: SPEAKING_OUTLINE,
      starters: SPEAKING_STARTERS,
      grammarNotes: [
        "Use indirect speech to report sources (er sagt, dass ...).",
        "Use adjective endings to describe sources precisely (zuverlässige Nachricht).",
        "Use contrastive connectors to weigh pros/cons (jedoch, trotzdem).",
      ],
      grammarPurpose: "Helps you report sources and evaluate media critically.",
      prompt:
        "Sprich 2 Minuten (Goethe-B2-Stil): Definiere Medienkompetenz, nenne zuverlässige Quellen, vergleiche Social Media/Zeitung, nenne Vor-/Nachteile, empfehle eine Prüfstrategie.",
      askGrammarPrompt:
        "Wenn indirekte Rede oder Adjektivendungen schwierig sind, frag zuerst.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-B2-Stil einen Meinungsaufsatz über den Umgang mit Online-Informationen. Nutze eine indirekte Rede und einen Kontrastkonnektor.",
    },
    skimmingWords: [
      "Glaubwürdigkeit",
      "Quelle",
      "Fake News",
      "Nachrichten",
      "Bericht",
      "prüfen",
      "objektiv",
      "schnell",
    ],
  },
  {
    day: 23,
    title: "Politik: definition to conclusion",
    topic: "Civic participation and democratic processes.",
    brainMap: [
      "Politik = Entscheidungen für alle.",
      "Beteiligung: wählen, mitreden.",
      "Lokal vs. national.",
      "Konjunktiv II: wäre/könnte.",
    ],
    speaking: {
      concept:
        "Define politics as decision-making in a community and describe citizen roles.",
      outline: SPEAKING_OUTLINE,
      starters: SPEAKING_STARTERS,
      grammarNotes: [
        "Use noun-verb phrases to describe participation (eine Entscheidung treffen).",
        "Use relative pronouns to specify actors and rules (der/die/das).",
        "Use Konjunktiv II to propose hypothetical solutions (wäre, könnte).",
      ],
      grammarPurpose: "Lets you explain participation and propose policies diplomatically.",
      prompt:
        "Sprich 2 Minuten (Goethe-B2-Stil): Definiere Politik, nenne Beteiligungsformen, vergleiche lokal/national, nenne Vor-/Nachteile der Wahlpflicht, empfehle eine Beteiligung.",
      askGrammarPrompt:
        "Frag, wenn du Hilfe mit Konjunktiv II oder Relativpronomen brauchst.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-B2-Stil einen Meinungsaufsatz über das Wahlrecht ab 16. Verwende Konjunktiv II und einen Relativsatz.",
    },
    skimmingWords: [
      "Beteiligung",
      "Wahl",
      "Entscheidung",
      "Demokratie",
      "Verantwortung",
      "Bürger",
      "Abstimmung",
      "Interesse",
    ],
  },
  {
    day: 24,
    title: "Freizeit: definition to conclusion",
    topic: "Leisure activities and work-life balance.",
    brainMap: [
      "Freizeit = Erholung + Hobbys.",
      "Aktiv vs. passiv.",
      "Wenn/sobald ...",
      "regelmäßig/selten.",
    ],
    speaking: {
      concept:
        "Describe leisure as time for recovery and personal interests.",
      outline: SPEAKING_OUTLINE,
      starters: SPEAKING_STARTERS,
      grammarNotes: [
        "Use separable verbs to describe leisure actions (abschalten, ausruhen).",
        "Use temporal clauses to sequence routines (wenn, sobald).",
        "Use frequency expressions to describe habits (regelmäßig, selten).",
      ],
      grammarPurpose: "Helps you explain leisure routines and balance strategies.",
      prompt:
        "Sprich 2 Minuten (Goethe-B2-Stil): Definiere Freizeit, gib Beispiele, vergleiche aktive/passive Hobbys, nenne Vor-/Nachteile ständiger Erreichbarkeit, empfehle eine Strategie.",
      askGrammarPrompt:
        "Wenn trennbare Verben oder Temporalsätze verwirrend sind, frag vor der Aufnahme.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-B2-Stil einen Meinungsaufsatz über Freizeit und Work-Life-Balance. Nutze ein trennbares Verb, einen Temporalsatz und eine Häufigkeitsangabe.",
    },
    skimmingWords: [
      "Ausgleich",
      "Hobby",
      "abschalten",
      "Zeitmanagement",
      "Erholung",
      "Bewegung",
      "entspannen",
      "regelmäßig",
    ],
  },
  {
    day: 25,
    title: "Wohnen: definition to conclusion",
    topic: "Housing, affordability, and living styles.",
    brainMap: [
      "Wohnen: Stadt vs. Land.",
      "Wohnformen: WG, eigene Wohnung.",
      "Je ... desto ... als Vergleich.",
      "Sollte/könnte für Empfehlungen.",
    ],
    speaking: {
      concept:
        "Explain housing needs and how people choose where to live.",
      outline: SPEAKING_OUTLINE,
      starters: SPEAKING_STARTERS,
      grammarNotes: [
        "Use dative/accusative prepositions to describe location choices (in die Stadt, auf dem Land).",
        "Use comparative structures to weigh options (je ..., desto ...).",
        "Use modal verbs to give housing advice (sollte, könnte).",
      ],
      grammarPurpose: "Supports clear comparisons and recommendations about housing.",
      prompt:
        "Sprich 2 Minuten (Goethe-B2-Stil): Definiere Wohnen, gib Beispiele, vergleiche Stadt/Land, nenne Vor-/Nachteile von WGs, empfehle eine Wohnpolitik.",
      askGrammarPrompt:
        "Frag, wenn du Hilfe mit Präpositionen oder Vergleichsstrukturen brauchst.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-B2-Stil einen formellen Brief an einen Vermieter mit Fragen zu einer Wohnung. Nutze je ... desto ... und eine Empfehlung mit sollte/könnte.",
    },
    skimmingWords: [
      "Miete",
      "Wohnraum",
      "bezahlbar",
      "Wohnungssuche",
      "Nachbarschaft",
      "Infrastruktur",
      "Pendeln",
      "Stadtzentrum",
    ],
  },
  {
    day: 26,
    title: "Mobilität: definition to conclusion",
    topic: "Transport, infrastructure, and sustainable travel.",
    brainMap: [
      "Mobilität: ÖPNV, Fahrrad, Auto.",
      "Nachhaltigkeit: weniger Emissionen.",
      "Passiv: es wird gebaut.",
      "Deswegen/daher als Ursache.",
    ],
    speaking: {
      concept:
        "Describe mobility as the ability to move efficiently and safely.",
      outline: SPEAKING_OUTLINE,
      starters: SPEAKING_STARTERS,
      grammarNotes: [
        "Use passive voice to describe infrastructure changes (es wird gebaut).",
        "Use transport prepositions to name travel modes (mit dem Bus, per Fahrrad).",
        "Use causal connectors to explain effects of policies (deswegen, daher).",
      ],
      grammarPurpose: "Helps you explain transport options and policy effects.",
      prompt:
        "Sprich 2 Minuten (Goethe-B2-Stil): Definiere Mobilität, gib Beispiele, vergleiche Auto/ÖPNV, nenne Vor-/Nachteile von E-Scootern, empfehle eine Änderung.",
      askGrammarPrompt:
        "Wenn Passiv oder Verkehrs-Präpositionen schwierig sind, frag zuerst.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-B2-Stil einen formellen Brief an die Stadt über bessere Radwege. Verwende Passiv und einen Kausalkonnektor (daher/deswegen).",
    },
    skimmingWords: [
      "Verkehr",
      "ÖPNV",
      "Stau",
      "Fahrgemeinschaft",
      "Emissionen",
      "Infrastruktur",
      "sicher",
      "ausbauen",
    ],
  },
  {
    day: 27,
    title: "Wissenschaft: definition to conclusion",
    topic: "Science, research, and trust.",
    brainMap: [
      "Wissenschaft = Forschung + Methode.",
      "Vertrauen durch Studien/Belege.",
      "Weil/obwohl als Begründung.",
      "Passiv: es wird untersucht.",
    ],
    speaking: {
      concept:
        "Explain science as a method for testing ideas and expanding knowledge.",
      outline: SPEAKING_OUTLINE,
      starters: SPEAKING_STARTERS,
      grammarNotes: [
        "Use subordinate clauses to explain reasons and limits (weil, obwohl, während).",
        "Use passive voice to describe research processes (es wird untersucht).",
        "Use linking phrases to compare research types (zum einen ... zum anderen).",
      ],
      grammarPurpose: "Helps you explain research methods and compare fields.",
      prompt:
        "Sprich 2 Minuten (Goethe-B2-Stil): Definiere Wissenschaft, nenne Beispiele, vergleiche Grundlagenforschung/angewandte Forschung, nenne Vor-/Nachteile öffentlicher Förderung, empfehle eine Kommunikationspraxis.",
      askGrammarPrompt:
        "Frag, wenn Nebensätze oder Passivformen verwirrend sind.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-B2-Stil einen Meinungsaufsatz über die Bedeutung von Forschung. Verwende weil/obwohl und mindestens eine passive Konstruktion.",
    },
    skimmingWords: [
      "Forschung",
      "Erkenntnis",
      "Studie",
      "Methode",
      "Daten",
      "Beweis",
      "publizieren",
      "prüfen",
    ],
  },
  {
    day: 28,
    title: "Konsum: definition to conclusion",
    topic: "Consumer habits and ethical choices.",
    brainMap: [
      "Konsum: Preise, Qualität, Nachhaltigkeit.",
      "Online vs. lokal einkaufen.",
      "Genitiv: die Qualität des Produkts.",
      "Vor allem/besonders als Betonung.",
    ],
    speaking: {
      concept:
        "Describe consumption patterns and how choices affect people and planet.",
      outline: SPEAKING_OUTLINE,
      starters: SPEAKING_STARTERS,
      grammarNotes: [
        "Use genitive to describe product qualities (die Qualität des Produkts).",
        "Use comparatives to contrast shopping options (als, als ob).",
        "Use emphasis adverbs to stress priorities (besonders, vor allem).",
      ],
      grammarPurpose: "Lets you compare consumption choices and highlight impacts.",
      prompt:
        "Sprich 2 Minuten (Goethe-B2-Stil): Definiere Konsum, gib Beispiele, vergleiche online/lokal, nenne Vor-/Nachteile von Fast Fashion, empfehle eine Veränderung.",
      askGrammarPrompt:
        "Wenn Genitiv oder Vergleiche schwierig sind, frag vor der Aufnahme.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-B2-Stil einen Meinungsaufsatz über nachhaltigen Konsum. Nutze den Genitiv und einen Vergleichssatz.",
    },
    skimmingWords: [
      "Verbrauch",
      "Qualität",
      "Preis",
      "nachhaltig",
      "bewusst",
      "Rabatt",
      "Lieferung",
      "Auswahl",
    ],
  },
  {
    day: 29,
    title: "Digitalisierung: definition to conclusion",
    topic: "Digitalization in services and daily life.",
    brainMap: [
      "Digitalisierung: Onlinebanking, E-Services.",
      "Vorteile: schnell, effizient.",
      "Risiken: Datenschutz, Zugang.",
      "Dadurch/sodass als Folge.",
    ],
    speaking: {
      concept:
        "Explain digitalization as shifting processes to digital tools and systems.",
      outline: SPEAKING_OUTLINE,
      starters: SPEAKING_STARTERS,
      grammarNotes: [
        "Use noun compounds to name digital services (Onlinebanking, Datensicherheit).",
        "Use future tense to predict changes (werden).",
        "Use cause-effect connectors to explain outcomes (dadurch, sodass).",
      ],
      grammarPurpose: "Helps you describe digital services and predict impacts.",
      prompt:
        "Sprich 2 Minuten (Goethe-B2-Stil): Definiere Digitalisierung, nenne Beispiele, vergleiche analog/digital, nenne Vor-/Nachteile von E-Government, empfehle eine Verbesserung.",
      askGrammarPrompt:
        "Frag, wenn Nominalkomposita oder Futurformen verwirrend sind.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-B2-Stil einen Meinungsaufsatz über digitale Dienstleistungen. Verwende Futur und einen Ursache-Wirkung-Konnektor.",
    },
    skimmingWords: [
      "Online",
      "Datensicherheit",
      "Benutzerfreundlich",
      "Automatisierung",
      "Zugang",
      "Service",
      "Effizienz",
      "Risiko",
    ],
  },
  {
    day: 30,
    title: "Zusammenfassung: definition to conclusion",
    topic: "Review and connect B2 themes in one coherent talk.",
    brainMap: [
      "Rückblick auf mehrere Themen.",
      "Hauptpunkt nennen + Beispiele.",
      "Einerseits/andererseits als Kontrast.",
      "Zusammenfassend als Abschluss.",
    ],
    speaking: {
      concept:
        "Connect education, technology, environment, society, work, health, and migration into one narrative.",
      outline: SPEAKING_OUTLINE,
      starters: SPEAKING_STARTERS,
      grammarNotes: [
        "Use summary phrases to close your talk (insgesamt, zusammenfassend).",
        "Use concession/contrast to balance topics (einerseits, andererseits).",
        "Use clear clause linking to connect themes smoothly.",
      ],
      grammarPurpose: "Helps you tie themes together and end with a strong summary.",
      prompt:
        "Sprich 2–3 Minuten (Goethe-B2-Stil): Nenne ein Kernthema, gib Beispiele aus mehreren Bereichen, vergleiche zwei Felder, nenne Vor-/Nachteile, gib eine Empfehlung und fasse zusammen.",
      askGrammarPrompt:
        "Wenn du Hilfe beim Verbinden von Ideen oder Zusammenfassen brauchst, frag vor der Aufnahme.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-B2-Stil einen Meinungsaufsatz über das Thema, das dir am schwersten fällt. Nutze Zusammenfassungen und einen Kontrast (einerseits/andererseits).",
    },
    skimmingWords: [
      "insgesamt",
      "zusammenfassend",
      "Hauptpunkt",
      "Schwerpunkt",
      "Verbindung",
      "ausgewogen",
      "Folge",
      "Empfehlung",
    ],
  },
];
