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

const BASE_B2_SELF_LEARNING_PLAN = [
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

const B2_PLAN_ENHANCEMENTS = {
  1: {
    learningObjectives: [
      "Set personal B2 goals and describe your learning journey.",
      "Use sequencing connectors to structure an introduction.",
    ],
    grammarFocus: {
      group: "Week 1 foundations",
      items: ["Sequencing connectors (zuerst, danach, schließlich)", "Reason and purpose clauses (weil, damit, um ... zu)"],
    },
    activities: {
      quiz: [
        "Wähle den passenden Konnektor: Ich lerne Deutsch, ___ ich in Deutschland arbeiten möchte.",
        "Formuliere einen Satz mit „damit“ über dein Lernziel.",
      ],
      discussionPrompt: "Welche Lernstrategie hat dir bisher am meisten geholfen?",
    },
  },
  2: {
    learningObjectives: [
      "Define Kultur and compare two cultural examples.",
      "Practice relative clauses to add detail.",
    ],
    grammarFocus: {
      group: "Week 1 foundations",
      items: ["Relative clauses (die Kultur, die ...)", "Comparison phrases (im Vergleich zu, genauso wie)"],
    },
    activities: {
      quiz: [
        "Ergänze: Kultur ist etwas, ___ Menschen im Alltag verbindet.",
        "Nenne zwei Vergleichsformen für Kulturen.",
      ],
      discussionPrompt: "Welche Tradition aus deinem Land würdest du gern erklären?",
    },
    reading: {
      resourceId: "b2-kultur-article",
      tasks: [
        "Markiere fünf Wörter, die kulturelle Werte beschreiben.",
        "Fasse den Text in 3–4 Sätzen zusammen.",
        "Schreibe eine eigene Meinung mit „dennoch“.",
      ],
    },
    listening: {
      resourceId: "b2-kultur-audio",
      prompt: "Höre den Beitrag zweimal und notiere Schlüsselwörter.",
      tasks: [
        "Notiere 5 Stichwörter zum Hauptthema.",
        "Erkläre, welche Idee dich überrascht hat.",
        "Formuliere eine kurze Zusammenfassung (4–5 Sätze).",
      ],
    },
  },
  3: {
    learningObjectives: [
      "Describe media habits and evaluate information sources.",
      "Ask indirect questions about credibility.",
    ],
    grammarFocus: {
      group: "Week 1 foundations",
      items: ["Indirect questions (Ich frage mich, ob ...)", "Causal connectors (denn, deshalb)"],
    },
    activities: {
      quiz: [
        "Schreibe eine indirekte Frage zu einer Nachricht.",
        "Nenne zwei Kriterien für glaubwürdige Quellen.",
      ],
      discussionPrompt: "Welche Quellen nutzt du täglich und warum?",
    },
  },
  4: {
    learningObjectives: [
      "Explain relationship values with supporting reasons.",
      "Use zu-Infinitiv clauses for recommendations.",
    ],
    grammarFocus: {
      group: "Week 1 foundations",
      items: ["weil/da clauses", "zu-Infinitiv with um/ohne"],
    },
    activities: {
      quiz: [
        "Formuliere einen Satz mit „um ... zu“ über Freundschaft.",
        "Ergänze: Vertrauen ist wichtig, ___ man ehrlich bleibt.",
      ],
      discussionPrompt: "Welche Regeln helfen, Konflikte fair zu lösen?",
    },
  },
  5: {
    learningObjectives: [
      "Describe professional goals using Konjunktiv II.",
      "Compare two work models.",
    ],
    grammarFocus: {
      group: "Week 1 foundations",
      items: ["Konjunktiv II for wishes", "Conditional clauses (wenn/falls)"],
    },
    activities: {
      quiz: [
        "Schreibe einen Wunsch im Konjunktiv II.",
        "Vergleiche Homeoffice und Büro in einem Satz.",
      ],
      discussionPrompt: "Welche Kompetenzen sind in deinem Beruf besonders wichtig?",
    },
    reading: {
      resourceId: "b2-arbeitswelt-article",
      tasks: [
        "Notiere drei Veränderungen in der Arbeitswelt.",
        "Welche Vorteile nennt der Text?",
        "Schreibe eine Empfehlung mit „sollte“.",
      ],
    },
    listening: {
      resourceId: "b2-arbeitswelt-audio",
      prompt: "Höre den Abschnitt und fasse ihn mündlich in 60 Sekunden zusammen.",
      tasks: [
        "Notiere zwei Anforderungen an moderne Berufe.",
        "Formuliere eine Frage an die Sprecherin/den Sprecher.",
      ],
    },
  },
  6: {
    learningObjectives: [
      "Give health recommendations with imperatives.",
      "Explain cause and effect for habits.",
    ],
    grammarFocus: {
      group: "Week 1 foundations",
      items: ["Imperative forms", "Deshalb/daher for consequences"],
    },
    activities: {
      quiz: [
        "Formuliere einen Imperativ-Satz zur Ernährung.",
        "Verbinde zwei Sätze mit „deshalb“.",
      ],
      discussionPrompt: "Welche Routine möchtest du diese Woche verbessern?",
    },
  },
  7: {
    title: "Week 1 review + Reisen und Mobilität",
    topic: "Reiseerfahrungen reflektieren und die Woche zusammenfassen.",
    learningObjectives: [
      "Reflect on week 1 topics and reuse key vocabulary.",
      "Identify personal strengths and gaps.",
    ],
    grammarFocus: {
      group: "Week 1 review",
      items: ["Connector recap", "Mini review of Konjunktiv II and relative clauses"],
    },
    activities: {
      quiz: [
        "Verbinde zwei Themen aus Woche 1 in einem Satz.",
        "Schreibe zwei Sätze mit Relativsätzen.",
      ],
      reflectionPrompt: "Welche Grammatikstruktur war am schwierigsten?",
      discussionPrompt: "Welche Woche-1-Themen kannst du zusammenfassen?",
    },
    weeklyReview: {
      summary: "Review week 1 topics: Kultur, Medien, Beziehungen, Arbeit, Gesundheit.",
      reflectionQuestions: [
        "Welche Struktur hast du sicher genutzt?",
        "Welche Aufgabe möchtest du wiederholen?",
        "Welche Wörter brauchst du noch einmal?",
      ],
      practicePrompt: "Nimm eine 2-Minuten-Zusammenfassung der Woche auf.",
    },
  },
  8: {
    learningObjectives: [
      "Describe housing situations and community rules.",
      "Use passive voice to mention expectations.",
    ],
    grammarFocus: {
      group: "Week 2 routines",
      items: ["Two-way prepositions", "Passive voice basics"],
    },
    activities: {
      quiz: [
        "Schreibe einen Satz im Passiv über Hausregeln.",
        "Nenne zwei Präpositionen mit Dativ/Akkusativ.",
      ],
      discussionPrompt: "Wie kann Nachbarschaft besser funktionieren?",
    },
  },
  9: {
    learningObjectives: [
      "Analyze advertising influences and consumer habits.",
      "Use comparative structures to discuss choices.",
    ],
    grammarFocus: {
      group: "Week 2 routines",
      items: ["Comparatives and superlatives", "Konjunktiv II for critique"],
    },
    activities: {
      quiz: [
        "Vergleiche zwei Marken mit einem Komparativ.",
        "Formuliere eine Kritik mit „man würde denken“.",
      ],
      discussionPrompt: "Welche Werbung wirkt auf dich besonders stark?",
    },
    reading: {
      resourceId: "b2-medien-article",
      tasks: [
        "Finde zwei Beispiele für Manipulation im Text.",
        "Formuliere eine eigene Gegenposition.",
        "Notiere drei neue Wörter.",
      ],
    },
    listening: {
      resourceId: "b2-medien-audio",
      prompt: "Höre den Beitrag und notiere die Kernaussage.",
      tasks: [
        "Welche Tipps für Faktenchecks werden genannt?",
        "Erkläre einen Tipp mit eigenen Worten.",
      ],
    },
  },
  10: {
    learningObjectives: [
      "Explain integration challenges with contrast connectors.",
      "Use nominalizations to sound formal.",
    ],
    grammarFocus: {
      group: "Week 2 routines",
      items: ["Obwohl/trotzdem for contrasts", "Nominalizations"],
    },
    activities: {
      quiz: [
        "Formuliere einen Satz mit „obwohl“.",
        "Nenne zwei Nominalisierungen zu „integrieren“.",
      ],
      discussionPrompt: "Welche Unterstützung hilft beim Ankommen?",
    },
  },
  11: {
    learningObjectives: [
      "Discuss civic engagement using passive voice.",
      "Express goals with damit/um zu.",
    ],
    grammarFocus: {
      group: "Week 2 routines",
      items: ["Passive voice for processes", "Purpose clauses"],
    },
    activities: {
      quiz: [
        "Schreibe einen Passivsatz über Wahlen.",
        "Ergänze einen Satz mit „damit“.",
      ],
      discussionPrompt: "Wie kann man sich lokal engagieren?",
    },
    reading: {
      resourceId: "b2-mobilitaet-article",
      tasks: [
        "Notiere drei Vorteile nachhaltiger Mobilität.",
        "Welche Lösung würdest du übernehmen?",
      ],
    },
    listening: {
      resourceId: "b2-umwelt-audio",
      prompt: "Höre den Beitrag und notiere Ursachen und Folgen.",
      tasks: [
        "Nenne zwei Alltagstipps aus dem Audio.",
        "Schreibe eine Empfehlung mit „sollte“.",
      ],
    },
  },
  12: {
    learningObjectives: [
      "Compare leisure activities using contrast connectors.",
      "Use sowohl ... als auch for listings.",
    ],
    grammarFocus: {
      group: "Week 2 routines",
      items: ["Während/als clauses", "sowohl ... als auch"],
    },
    activities: {
      quiz: [
        "Formuliere einen Satz mit „sowohl ... als auch“.",
        "Vergleiche zwei Hobbys mit „während“.",
      ],
      discussionPrompt: "Welche Aktivität gibt dir den besten Ausgleich?",
    },
  },
  13: {
    learningObjectives: [
      "Explain language learning strategies.",
      "Use reported speech to share advice.",
    ],
    grammarFocus: {
      group: "Week 2 routines",
      items: ["Indirect speech (er sagte, dass ...)", "Genitive prepositions (trotz, während)"],
    },
    activities: {
      quiz: [
        "Schreibe einen Satz in indirekter Rede.",
        "Nenne zwei Strategien gegen Missverständnisse.",
      ],
      discussionPrompt: "Wie gibst du Feedback in Gesprächen?",
    },
  },
  14: {
    title: "Week 2 review + Wissenschaft und Zukunft",
    topic: "Innovationen erklären und Woche 2 reflektieren.",
    learningObjectives: [
      "Summarize week 2 topics in a coherent narrative.",
      "Identify grammar progress across multiple days.",
    ],
    grammarFocus: {
      group: "Week 2 review",
      items: ["Passive voice review", "Contrast connectors (während/hingegen)"],
    },
    activities: {
      quiz: [
        "Schreibe zwei Sätze mit Passiv und Kontrast.",
        "Verbinde Wohnen und Freizeit in einem Satz.",
      ],
      reflectionPrompt: "Welche Aufgaben waren am anspruchsvollsten?",
      discussionPrompt: "Welches Thema würdest du noch einmal üben?",
    },
    weeklyReview: {
      summary: "Review week 2 topics: Wohnen, Konsum, Integration, Engagement, Freizeit, Sprache.",
      reflectionQuestions: [
        "Welche Texte oder Audios waren am hilfreichsten?",
        "Welche Grammatik hast du bewusst eingesetzt?",
        "Was möchtest du in Woche 3 verbessern?",
      ],
      practicePrompt: "Schreibe eine 5-Satz-Reflexion zur Woche.",
    },
  },
  15: {
    learningObjectives: [
      "Define Bildung and compare learning formats.",
      "Use nominalizations and purpose clauses.",
    ],
    grammarFocus: {
      group: "Week 3 expansion",
      items: ["Nominalizations (Bildung, Weiterbildung)", "Purpose clauses (damit/um ... zu)"],
    },
    activities: {
      quiz: [
        "Formuliere zwei Nominalisierungen zum Lernen.",
        "Schreibe einen Satz mit „um ... zu“.",
      ],
      discussionPrompt: "Wie organisierst du lebenslanges Lernen?",
    },
    reading: {
      resourceId: "b2-gesundheit-article",
      tasks: [
        "Markiere zwei Tipps zur Prävention.",
        "Schreibe eine kurze Empfehlung an eine Freundin/einen Freund.",
      ],
    },
    listening: {
      resourceId: "b2-gesundheit-audio",
      prompt: "Höre das Audio und halte die Hauptaussage fest.",
      tasks: [
        "Notiere drei Schlüsselwörter.",
        "Fasse das Audio in 3 Sätzen zusammen.",
      ],
    },
  },
  16: {
    learningObjectives: [
      "Describe technology impacts with cause-effect connectors.",
      "Use passive voice to explain processes.",
    ],
    grammarFocus: {
      group: "Week 3 expansion",
      items: ["Passive voice practice", "Cause-effect connectors (deshalb, dadurch)"],
    },
    activities: {
      quiz: [
        "Schreibe einen Satz im Passiv über Apps.",
        "Verbinde zwei Sätze mit „dadurch“.",
      ],
      discussionPrompt: "Welche Technologie möchtest du bewusster nutzen?",
    },
  },
  17: {
    learningObjectives: [
      "Discuss environmental actions using conditionals.",
      "Express obligations with modal verbs.",
    ],
    grammarFocus: {
      group: "Week 3 expansion",
      items: ["Conditional clauses (wenn/falls)", "Modal verbs for obligations"],
    },
    activities: {
      quiz: [
        "Formuliere einen Wenn-Satz mit einer Umweltmaßnahme.",
        "Schreibe einen Satz mit „müssen“.",
      ],
      discussionPrompt: "Welche Umweltschutzmaßnahme würdest du sofort umsetzen?",
    },
  },
  18: {
    learningObjectives: [
      "Explain society using relative clauses and noun clauses.",
      "Balance viewpoints with conjunctive adverbs.",
    ],
    grammarFocus: {
      group: "Week 3 expansion",
      items: ["Relative clauses", "Conjunctive adverbs (hingegen, außerdem)"],
    },
    activities: {
      quiz: [
        "Schreibe einen Satz mit „hingegen“.",
        "Nutze einen Relativsatz über Gemeinschaft.",
      ],
      discussionPrompt: "Wie kann sozialer Zusammenhalt gestärkt werden?",
    },
  },
  19: {
    learningObjectives: [
      "Describe work culture and future skills.",
      "Use future tense to predict trends.",
    ],
    grammarFocus: {
      group: "Week 3 expansion",
      items: ["Future tense (werden)", "Formal opinion phrases"],
    },
    activities: {
      quiz: [
        "Schreibe einen Satz im Futur über Jobs.",
        "Nutze „aus meiner Sicht“ in einem Satz.",
      ],
      discussionPrompt: "Welche Kompetenz wird in Zukunft wichtiger?",
    },
  },
  20: {
    learningObjectives: [
      "Define health broadly and compare stress sources.",
      "Use reflexive verbs in daily routines.",
    ],
    grammarFocus: {
      group: "Week 3 expansion",
      items: ["Genitive with abstract nouns", "Reflexive verbs"],
    },
    activities: {
      quiz: [
        "Schreibe einen Satz mit Genitiv zu Gesundheit.",
        "Formuliere eine Routine mit einem reflexiven Verb.",
      ],
      discussionPrompt: "Wie gehst du mit Stress um?",
    },
  },
  21: {
    title: "Week 3 review + Migration",
    topic: "Migrationsthema wiederholen und Wochenschwerpunkte verbinden.",
    learningObjectives: [
      "Review week 3 topics and connect them in a summary.",
      "Identify grammar patterns you can reuse.",
    ],
    grammarFocus: {
      group: "Week 3 review",
      items: ["Conditionals and modal verbs", "Future tense recap"],
    },
    activities: {
      quiz: [
        "Schreibe zwei Sätze: einen Konditionalsatz, einen Futursatz.",
        "Verwende ein Konjunktivadverb.",
      ],
      reflectionPrompt: "Welche Themen konntest du frei erklären?",
      discussionPrompt: "Welches Thema solltest du wiederholen?",
    },
    weeklyReview: {
      summary: "Review week 3 topics: Bildung, Technologie, Umwelt, Gesellschaft, Arbeit, Gesundheit.",
      reflectionQuestions: [
        "Welche Konnektoren nutzt du sicher?",
        "Welche Aufgaben liefen am flüssigsten?",
        "Was brauchst du für Woche 4?",
      ],
      practicePrompt: "Halte eine 2-Minuten-Audio-Reflexion fest.",
    },
  },
  22: {
    learningObjectives: [
      "Explain media literacy with contrast connectors.",
      "Use indirect speech for reporting sources.",
    ],
    grammarFocus: {
      group: "Week 4 consolidation",
      items: ["Indirect speech", "Contrast connectors (jedoch, trotzdem)"],
    },
    activities: {
      quiz: [
        "Schreibe einen Satz mit „trotzdem“.",
        "Formuliere eine indirekte Rede zu einer Quelle.",
      ],
      discussionPrompt: "Welche Faktencheck-Strategie nutzt du zuerst?",
    },
    reading: {
      resourceId: "b2-zukunft-article",
      tasks: [
        "Notiere zwei Innovationen aus dem Text.",
        "Schreibe ein Fazit mit „zusammenfassend“.",
      ],
    },
    listening: {
      resourceId: "b2-zukunft-audio",
      prompt: "Höre das Interview und fasse die Positionen zusammen.",
      tasks: [
        "Nenne zwei Chancen und ein Risiko.",
        "Formuliere eine eigene Prognose.",
      ],
    },
  },
  23: {
    learningObjectives: [
      "Describe democratic participation using Konjunktiv II.",
      "Balance pros and cons in civic topics.",
    ],
    grammarFocus: {
      group: "Week 4 consolidation",
      items: ["Konjunktiv II for proposals", "Relative pronouns"],
    },
    activities: {
      quiz: [
        "Schreibe einen Konjunktiv-II-Satz zu Politik.",
        "Bilde einen Relativsatz über Bürger.",
      ],
      discussionPrompt: "Wie könnte man junge Menschen politisch motivieren?",
    },
  },
  24: {
    learningObjectives: [
      "Describe leisure balance and habits.",
      "Use temporal clauses to structure routines.",
    ],
    grammarFocus: {
      group: "Week 4 consolidation",
      items: ["Temporal clauses (wenn, sobald)", "Frequency expressions"],
    },
    activities: {
      quiz: [
        "Schreibe einen Satz mit „sobald“.",
        "Nutze eine Häufigkeitsangabe in einem Satz.",
      ],
      discussionPrompt: "Wie schützt du deine Erholungszeit?",
    },
  },
  25: {
    learningObjectives: [
      "Compare housing options using je ... desto.",
      "Give recommendations with modal verbs.",
    ],
    grammarFocus: {
      group: "Week 4 consolidation",
      items: ["Je ... desto comparisons", "Modal verbs (sollte, könnte)"],
    },
    activities: {
      quiz: [
        "Formuliere einen Satz mit „je ... desto“.",
        "Schreibe eine Empfehlung mit „könnte“.",
      ],
      discussionPrompt: "Welche Wohnform passt zu deinem Alltag?",
    },
  },
  26: {
    learningObjectives: [
      "Explain mobility policies using passive voice.",
      "Use causal connectors to describe effects.",
    ],
    grammarFocus: {
      group: "Week 4 consolidation",
      items: ["Passive voice", "Causal connectors (deswegen, daher)"],
    },
    activities: {
      quiz: [
        "Schreibe einen Passivsatz über Infrastruktur.",
        "Verbinde zwei Sätze mit „daher“.",
      ],
      discussionPrompt: "Wie könnte deine Stadt Mobilität verbessern?",
    },
  },
  27: {
    learningObjectives: [
      "Explain research processes clearly.",
      "Use subordinate clauses to show reasons.",
    ],
    grammarFocus: {
      group: "Week 4 consolidation",
      items: ["weil/obwohl clauses", "Passive voice for research"],
    },
    activities: {
      quiz: [
        "Schreibe einen Satz mit „obwohl“.",
        "Formuliere einen Passivsatz über Forschung.",
      ],
      discussionPrompt: "Welche Wissenschaftsthemen interessieren dich besonders?",
    },
  },
  28: {
    title: "Week 4 review + Konsum",
    topic: "Konsumthema nutzen, um Woche 4 zusammenzufassen.",
    learningObjectives: [
      "Review week 4 topics and connect them with transitions.",
      "Identify vocabulary to revise before final review.",
    ],
    grammarFocus: {
      group: "Week 4 review",
      items: ["Summary phrases (insgesamt, zusammenfassend)", "Contrast connectors recap"],
    },
    activities: {
      quiz: [
        "Schreibe zwei Sätze mit Zusammenfassungen.",
        "Verbinde zwei Themen mit „einerseits/andererseits“.",
      ],
      reflectionPrompt: "Welche Aufgaben hast du noch nicht wiederholt?",
      discussionPrompt: "Welche Themen willst du im Abschluss wiederholen?",
    },
    weeklyReview: {
      summary: "Review week 4 topics: Medien, Politik, Freizeit, Wohnen, Mobilität, Wissenschaft.",
      reflectionQuestions: [
        "Welche Themen liefen besonders flüssig?",
        "Welche Grammatik brauchst du für den Abschluss?",
        "Welche Wörter fehlen noch?",
      ],
      practicePrompt: "Schreibe eine Abschlussliste mit 10 wichtigen Wörtern.",
    },
  },
  29: {
    learningObjectives: [
      "Explain digital services and their effects.",
      "Use cause-effect connectors to show outcomes.",
    ],
    grammarFocus: {
      group: "Week 4 consolidation",
      items: ["Nominal compounds", "Cause-effect connectors (dadurch, sodass)"],
    },
    activities: {
      quiz: [
        "Schreibe einen Satz mit „sodass“.",
        "Nenne zwei digitale Dienste im Kompositum.",
      ],
      discussionPrompt: "Welche digitalen Services sind unverzichtbar?",
    },
  },
  30: {
    title: "Final review + Zusammenfassung",
    topic: "Abschlussreflexion und themenübergreifende Zusammenfassung.",
    learningObjectives: [
      "Deliver a full-topic summary with structured transitions.",
      "Reflect on progress and next steps.",
    ],
    grammarFocus: {
      group: "Final synthesis",
      items: ["Summary connectors", "Balanced contrasts (einerseits/andererseits)"],
    },
    activities: {
      quiz: [
        "Formuliere ein Fazit mit „insgesamt“.",
        "Verbinde zwei Themen mit einem Kontrast.",
      ],
      reflectionPrompt: "Welche Fortschritte sind am deutlichsten?",
    },
    weeklyReview: {
      summary: "Final review: connect themes across the entire B2 plan.",
      reflectionQuestions: [
        "Welche Themen fühlst du dich bereit zu präsentieren?",
        "Welche Aufgaben nutzt du als Wiederholung?",
        "Welche Strategien nimmst du mit?",
      ],
      practicePrompt: "Erstelle eine 3-Minuten-Abschlussaufnahme mit 3 Themen.",
    },
  },
};

const B2_COMPLEX_SENTENCE_NOTE =
  "Build at least one complex sentence: main clause + subordinate clause (z. B. weil/obwohl/wenn), and place the conjugated verb at the end of the subordinate clause.";

const withComplexSentenceFocus = (entry) => {
  if (!entry?.speaking) return entry;
  const notes = Array.isArray(entry.speaking.grammarNotes) ? entry.speaking.grammarNotes : [];
  const hasComplexSentenceFocus = notes.some((note) =>
    /complex sentence|subordinate clause|nebensatz|hauptsatz/i.test(String(note))
  );

  if (hasComplexSentenceFocus) return entry;

  return {
    ...entry,
    speaking: {
      ...entry.speaking,
      grammarNotes: [...notes, B2_COMPLEX_SENTENCE_NOTE],
    },
  };
};

export const B2_SELF_LEARNING_PLAN = BASE_B2_SELF_LEARNING_PLAN.map((entry) =>
  withComplexSentenceFocus({
    ...entry,
    ...(B2_PLAN_ENHANCEMENTS[entry.day] || {}),
  })
);
