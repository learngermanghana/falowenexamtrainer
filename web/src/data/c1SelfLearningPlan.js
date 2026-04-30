const SPRECH_OUTLINE = [
  "Begrüßung + Thema nennen",
  "Begriff kurz erklären oder definieren",
  "Zwei konkrete Beispiele nennen",
  "Vergleich oder Kontrast herstellen",
  "Eigene Meinung + Begründung geben",
  "Kurz zusammenfassen und abschließen",
];

const SPRECH_STARTERS = [
  "Meiner Ansicht nach …",
  "Ein Beispiel dafür ist …",
  "Zum einen …",
  "Zum anderen …",
  "Darüber hinaus …",
  "Zusammenfassend lässt sich sagen …",
];

const BASE_C1_SELF_LEARNING_PLAN = [
  {
    day: 1,
    title: "Willkommen + Selbstlernstart",
    topic: "Stell dich vor und erkläre, warum du Deutsch auf C1 lernst.",
    brainMap: [
      "Ich heiße ... und komme aus ...",
      "Ich lerne Deutsch, weil ...",
      "Mein Ziel ist das Goethe-C1-Zertifikat.",
      "Zuerst ..., danach ..., schließlich ...",
    ],
    speaking: {
      concept:
        "Stelle dich mit Kontext vor. Beschreibe deinen Lernweg und was C1 für deine Ziele bedeutet.",
      outline: SPRECH_OUTLINE,
      starters: SPRECH_STARTERS,
      grammarNotes: [
        "Nutze Strukturgeber für deine Einleitung (zuerst, danach, schließlich).",
        "Erkläre Motivation mit Begründungs- und Zweckangaben (weil, damit, um ... zu).",
        "Verwende Modalverben für Absichten und Fähigkeiten (möchte, will, kann).",
      ],
      grammarPurpose: "Hilft dir, dein Ziel klar zu begründen und strukturiert zu sprechen.",
      prompt:
        "Sprich 60–90 Sekunden (Goethe-C1-Stil): Stelle dich vor, nenne dein C1-Ziel und beschreibe eine Lernherausforderung.",
      askGrammarPrompt:
        "Unsicher bei Satzstellung, Konnektoren oder Modalverben? Stelle zuerst eine kurze Grammatikfrage.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-C1-Stil eine formelle E-Mail an die Kursleitung: Stell dich vor, erkläre dein C1-Ziel (weil/damit) und nenne eine Lernschwierigkeit.",
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
    title: "Kultur: Begriff erklären + Beispiele geben",
    topic: "Kultur: Bedeutung, Relevanz und Beispiele aus deinem Alltag.",
    brainMap: [
      "In Deutschland ist Kultur sehr präsent.",
      "Viele Menschen haben ihre eigene Kultur.",
      "Kultur zeigt sich in Sprache, Essen und Festen.",
      "Menschen vergleichen Kulturen und lernen voneinander.",
    ],
    speaking: {
      concept:
        "Definiere Kultur in eigenen Worten (Werte, Traditionen, Alltag). Gib 2–3 Beispiele und vergleiche Kulturen.",
      outline: SPRECH_OUTLINE,
      starters: SPRECH_STARTERS,
      grammarNotes: [
        "Nutze Komposita, um Kulturbegriffe zu benennen (Kulturerbe, Alltagskultur).",
        "Verwende Vergleichsformen (im Vergleich zu, genauso wie, anders als).",
        "Setze Relativsätze ein, um Kultur präzise zu definieren (die Kultur, die ...).",
      ],
      grammarPurpose: "Unterstützt klare Definitionen und Vergleiche in deinen Beispielen.",
      prompt:
        "Sprich 90 Sekunden (Goethe-C1-Stil): Erkläre, was Kultur bedeutet, gib zwei Beispiele und vergleiche zwei Kulturen.",
      askGrammarPrompt:
        "Wenn du Hilfe beim Definieren oder Vergleichen brauchst, frag zuerst den Grammatiktrainer.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-C1-Stil einen kurzen Meinungsaufsatz über die Bedeutung von Kultur in einer Gemeinschaft. Nutze mindestens eine Relativsatz-Definition und Vergleichsformen.",
    },
    reading: {
      title: "Lesetext (gemeinfrei): Adolf Loos, Kultur (1908)",
      text:
        "Es mag für den deutschen nicht sehr angenehm sein, zu hören, er solle seine eigene kultur aufgeben und die englische annehmen. Aber das hört der bulgare auch nicht gern und der chinese noch weniger. Mit sentimentalitäten ist dieser frage nicht heizukommen.",
      optional: true,
      tasks: [
        "Markiere drei rhetorische Mittel oder Wertungen im Text.",
        "Fasse die Argumentation in 3–4 Sätzen zusammen.",
        "Schreibe eine Gegenposition in zwei Sätzen.",
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
        "Notiere die Kernaussage in einem Satz.",
        "Hebe zwei Schlüsselbegriffe hervor, die die Position stützen.",
        "Erstelle eine 45-Sekunden-Reaktion mit Kontrast (hingegen/jedoch).",
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
    title: "Medien: Informationen kritisch prüfen",
    topic: "Mediennutzung und Informationskompetenz im Alltag.",
    brainMap: [
      "Ich informiere mich über ...",
      "Soziale Medien haben Chancen und Risiken.",
      "Fakten prüfen ist zentral.",
      "Quellen vergleichen schützt vor Fehlern.",
    ],
    speaking: {
      concept:
        "Beschreibe deine Mediennutzung, analysiere Chancen/Risiken und erkläre, wie du Informationen verifizierst.",
      outline: SPRECH_OUTLINE,
      starters: SPRECH_STARTERS,
      grammarNotes: [
        "Nutze Relativsätze zur Quellenbeschreibung (die Quelle, die ...).",
        "Verwende Konnektoren für Argumentation (dennoch, deshalb, allerdings).",
        "Setze indirekte Fragen ein (Ich frage mich, ob ...).",
      ],
      grammarPurpose: "Hilft dir, Quellen zu bewerten und Argumente sauber aufzubauen.",
      prompt:
        "Sprich 90 Sekunden (Goethe-C1-Stil): Erkläre deine Mediennutzung, nenne Chancen/Risiken und gib einen Tipp zur Quellenprüfung.",
      askGrammarPrompt:
        "Wenn du Hilfe mit Relativsätzen oder Konnektoren brauchst, frag zuerst.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-C1-Stil einen kurzen Kommentar über Informationskompetenz. Nenne zwei Risiken und zwei Strategien zur Prüfung.",
    },
    skimmingWords: [
      "Quelle",
      "glaubwürdig",
      "Verifikation",
      "Filterblase",
      "Manipulation",
      "Faktencheck",
      "verzerrt",
      "verlässlich",
    ],
  },
  {
    day: 4,
    title: "Freundschaft und Beziehungen",
    topic: "Werte, Erwartungen und Kommunikation.",
    brainMap: [
      "Vertrauen und Respekt sind zentral.",
      "Konflikte brauchen Kommunikation.",
      "Beziehungen entwickeln sich.",
      "Gemeinsame Werte verbinden.",
    ],
    speaking: {
      concept:
        "Erkläre, was Beziehungen stabil macht, und nenne Beispiele aus deinem Umfeld.",
      outline: SPRECH_OUTLINE,
      starters: SPRECH_STARTERS,
      grammarNotes: [
        "Verwende weil/da, um Gründe klar zu machen.",
        "Nutze zu-Infinitiv-Konstruktionen (um zu, ohne zu).",
        "Setze Adjektivdeklination für präzise Beschreibungen ein.",
      ],
      grammarPurpose: "Hilft dir, Beziehungswerte differenziert zu beschreiben.",
      prompt:
        "Sprich 90 Sekunden (Goethe-C1-Stil): Beschreibe eine stabile Beziehung, nenne zwei Beispiele und gib einen Ratschlag.",
      askGrammarPrompt:
        "Brauchst du Hilfe mit Begründungen oder zu-Infinitiv? Frag zuerst.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-C1-Stil eine formelle E-Mail über Teamkonflikte. Beschreibe das Problem und schlage Lösungen vor.",
    },
    skimmingWords: [
      "Vertrauen",
      "Respekt",
      "Konflikt",
      "Unterstützung",
      "verlässlich",
      "gemeinsam",
      "Ratschlag",
      "verständnisvoll",
    ],
  },
  {
    day: 5,
    title: "Arbeit und Beruf",
    topic: "Berufliche Ziele, Anforderungen und Arbeitsmodelle.",
    brainMap: [
      "Mein Berufsziel ist ...",
      "Wichtige Kompetenzen sind ...",
      "Work-Life-Balance ist relevant.",
      "Ich wünsche mir ...",
    ],
    speaking: {
      concept:
        "Beschreibe deinen Berufswunsch, zentrale Kompetenzen und Herausforderungen im Arbeitsleben.",
      outline: SPRECH_OUTLINE,
      starters: SPRECH_STARTERS,
      grammarNotes: [
        "Nutze Konjunktiv II für Wünsche (ich würde, ich könnte).",
        "Verwende Modalverben für Anforderungen (müssen, sollen).",
        "Setze wenn/falls für Bedingungen.",
      ],
      grammarPurpose: "Hilft dir, Ziele, Bedingungen und Anforderungen klar zu formulieren.",
      prompt:
        "Sprich 2 Minuten (Goethe-C1-Stil): Beschreibe deinen Berufswunsch, nenne zwei Anforderungen und vergleiche zwei Arbeitsmodelle.",
      askGrammarPrompt:
        "Wenn du Hilfe mit Konjunktiv II oder Bedingungen brauchst, frag zuerst.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-C1-Stil ein Motivationsschreiben: Stelle dich vor, nenne deine Stärken und erkläre deine Ziele.",
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
    topic: "Gesund bleiben zwischen Stress und Alltag.",
    brainMap: [
      "Bewegung und Schlaf sind zentral.",
      "Ernährung beeinflusst Leistung.",
      "Stressmanagement ist nötig.",
      "Ich empfehle ...",
    ],
    speaking: {
      concept:
        "Erkläre zentrale Gesundheitsfaktoren und gib konkrete Empfehlungen.",
      outline: SPRECH_OUTLINE,
      starters: SPRECH_STARTERS,
      grammarNotes: [
        "Nutze Imperativ oder sollen für Empfehlungen.",
        "Verwende deshalb/daher für Folgen.",
        "Setze reflexive Verben ein (sich erholen, sich bewegen).",
      ],
      grammarPurpose: "Hilft dir, Ratschläge und Folgen präzise auszudrücken.",
      prompt:
        "Sprich 90 Sekunden (Goethe-C1-Stil): Beschreibe drei Gesundheitsgewohnheiten, begründe ihre Wirkung und gib einen Tipp.",
      askGrammarPrompt:
        "Wenn du Hilfe mit Imperativ oder Reflexivverben brauchst, frag zuerst.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-C1-Stil einen kurzen Ratgebertext über gesunden Lebensstil. Gib mindestens drei Empfehlungen.",
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
    topic: "Reiseerfahrungen und nachhaltige Mobilität.",
    brainMap: [
      "Ich reise gern nach ...",
      "Öffentliche Verkehrsmittel sind ...",
      "Fliegen ist schnell, aber ...",
      "Nachhaltig reisen ist wichtig.",
    ],
    speaking: {
      concept:
        "Berichte von einer Reise, vergleiche Verkehrsmittel und nenne einen nachhaltigen Tipp.",
      outline: SPRECH_OUTLINE,
      starters: SPRECH_STARTERS,
      grammarNotes: [
        "Nutze Perfekt/Präteritum für Erfahrungen.",
        "Verwende um ... zu für Ziele.",
        "Setze Vergleichsformen ein (schneller, günstiger).",
      ],
      grammarPurpose: "Hilft dir, Erfahrungen und Vergleiche strukturiert zu erzählen.",
      prompt:
        "Sprich 2 Minuten (Goethe-C1-Stil): Berichte von einer Reise, vergleiche zwei Verkehrsmittel und gib einen Tipp fürs nachhaltige Reisen.",
      askGrammarPrompt:
        "Wenn du Hilfe mit Zeiten oder Vergleichen brauchst, frag zuerst.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-C1-Stil einen Erfahrungsbericht über eine Reise. Beschreibe Transport, Unterkunft und eine Herausforderung.",
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
    topic: "Wohnformen, Regeln und Zusammenleben.",
    brainMap: [
      "Eine Wohnung muss ...",
      "Nachbarn können unterstützen oder stören.",
      "Gemeinschaftsräume sind praktisch.",
      "Regeln schaffen Ordnung.",
    ],
    speaking: {
      concept:
        "Beschreibe deine Wohnsituation, nenne Vor- und Nachteile und gib eine Empfehlung.",
      outline: SPRECH_OUTLINE,
      starters: SPRECH_STARTERS,
      grammarNotes: [
        "Nutze Präpositionen mit Dativ/Akkusativ (in, an, neben).",
        "Verwende Relativsätze zur Beschreibung.",
        "Setze Passiv, um Regeln zu nennen (Es wird erwartet, dass ...).",
      ],
      grammarPurpose: "Hilft dir, Wohnsituation und Regeln klar zu erläutern.",
      prompt:
        "Sprich 90 Sekunden (Goethe-C1-Stil): Beschreibe deine Wohnform, nenne zwei Vorteile und einen Nachteil, gib eine Empfehlung.",
      askGrammarPrompt:
        "Wenn du Hilfe mit Präpositionen oder Passiv brauchst, frag zuerst.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-C1-Stil eine Beschwerde an die Hausverwaltung über Lärm. Begründe sachlich und schlage Lösungen vor.",
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
      "Impulse vermeiden ist sinnvoll.",
      "Preis und Qualität vergleichen.",
    ],
    speaking: {
      concept:
        "Analysiere den Einfluss von Werbung und nenne Strategien für bewussten Konsum.",
      outline: SPRECH_OUTLINE,
      starters: SPRECH_STARTERS,
      grammarNotes: [
        "Nutze Vergleichsformen (besser, günstiger).",
        "Verwende Konjunktiv II für Kritik (man würde denken).",
        "Setze Genitiv oder von-Konstruktionen ein.",
      ],
      grammarPurpose: "Hilft dir, Bewertungen und Kritik differenziert auszudrücken.",
      prompt:
        "Sprich 90 Sekunden (Goethe-C1-Stil): Erkläre den Einfluss von Werbung, nenne Vor-/Nachteile von Online-Shopping und gib einen Spartipp.",
      askGrammarPrompt:
        "Wenn du Hilfe mit Vergleichen oder Konjunktiv II brauchst, frag zuerst.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-C1-Stil einen Kommentar über nachhaltigen Konsum. Nenne zwei konkrete Maßnahmen.",
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
    topic: "Ankommen, Teilhabe und gesellschaftlicher Zusammenhalt.",
    brainMap: [
      "Integration braucht Sprache.",
      "Kulturelle Vielfalt bereichert.",
      "Herausforderungen sind ...",
      "Unterstützung erleichtert.",
    ],
    speaking: {
      concept:
        "Erkläre, was Integration bedeutet, nenne Herausforderungen und mögliche Lösungen.",
      outline: SPRECH_OUTLINE,
      starters: SPRECH_STARTERS,
      grammarNotes: [
        "Nutze obwohl/trotzdem für Kontraste.",
        "Verwende Nominalisierungen (Integration, Teilhabe).",
        "Setze Partizipien für Beschreibungen ein.",
      ],
      grammarPurpose: "Hilft dir, komplexe Themen sachlich zu strukturieren.",
      prompt:
        "Sprich 2 Minuten (Goethe-C1-Stil): Erkläre Integration, nenne zwei Herausforderungen, gib zwei Lösungen und schließe ab.",
      askGrammarPrompt:
        "Wenn du Hilfe mit Kontrasten oder Nominalisierung brauchst, frag zuerst.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-C1-Stil einen kurzen Meinungsaufsatz über Integration in Schule oder Beruf.",
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
    topic: "Mitbestimmung und Verantwortung im Alltag.",
    brainMap: [
      "Wählen ist wichtig.",
      "Engagement beginnt lokal.",
      "Information ist notwendig.",
      "Verantwortung übernehmen.",
    ],
    speaking: {
      concept:
        "Erkläre, warum Engagement wichtig ist, und nenne Beispiele für Mitbestimmung.",
      outline: SPRECH_OUTLINE,
      starters: SPRECH_STARTERS,
      grammarNotes: [
        "Nutze Passiv für Prozesse (es wird gewählt).",
        "Verwende damit/um ... zu für Ziele.",
        "Setze Konnektoren für Struktur (außerdem, dennoch).",
      ],
      grammarPurpose: "Hilft dir, gesellschaftliche Prozesse klar zu erläutern.",
      prompt:
        "Sprich 90 Sekunden (Goethe-C1-Stil): Erkläre, warum Engagement wichtig ist, nenne zwei Beispiele und gib eine Empfehlung.",
      askGrammarPrompt:
        "Wenn du Hilfe mit Passiv oder Zweckangaben brauchst, frag zuerst.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-C1-Stil eine kurze Stellungnahme über freiwilliges Engagement. Begründe deine Meinung.",
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
      outline: SPRECH_OUTLINE,
      starters: SPRECH_STARTERS,
      grammarNotes: [
        "Nutze Nebensätze mit während/als.",
        "Verwende Adjektive für Bewertungen.",
        "Setze sowohl ... als auch für Aufzählungen ein.",
      ],
      grammarPurpose: "Hilft dir, Freizeitaktivitäten strukturiert zu vergleichen.",
      prompt:
        "Sprich 90 Sekunden (Goethe-C1-Stil): Beschreibe ein Hobby, vergleiche zwei Freizeitformen und nenne einen Vorteil für die Gesundheit.",
      askGrammarPrompt:
        "Wenn du Hilfe mit Nebensätzen brauchst, frag zuerst.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-C1-Stil eine Einladung zu einer kulturellen Veranstaltung. Nenne Ort, Zeit und Programm.",
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
    topic: "Sprachenlernen und professionelle Kommunikation.",
    brainMap: [
      "Sprachen öffnen Türen.",
      "Kommunikation braucht Präzision.",
      "Missverständnisse entstehen leicht.",
      "Übung verbessert.",
    ],
    speaking: {
      concept:
        "Erkläre, warum Sprachenlernen wichtig ist, und nenne Strategien für bessere Kommunikation.",
      outline: SPRECH_OUTLINE,
      starters: SPRECH_STARTERS,
      grammarNotes: [
        "Nutze indirekte Rede (Er sagte, dass ...).",
        "Verwende Konnektoren für Struktur (dennoch, außerdem).",
        "Setze Präpositionen mit Genitiv ein (trotz, während).",
      ],
      grammarPurpose: "Hilft dir, Aussagen anderer korrekt wiederzugeben.",
      prompt:
        "Sprich 90 Sekunden (Goethe-C1-Stil): Erkläre die Bedeutung von Sprachen, nenne zwei Lernstrategien und gib einen Tipp gegen Missverständnisse.",
      askGrammarPrompt:
        "Wenn du Hilfe mit indirekter Rede brauchst, frag zuerst.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-C1-Stil einen Erfahrungsbericht über eine Kommunikationssituation im Kurs oder Beruf.",
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
      outline: SPRECH_OUTLINE,
      starters: SPRECH_STARTERS,
      grammarNotes: [
        "Nutze Futur I/II für Prognosen.",
        "Verwende wenn/falls für Szenarien.",
        "Setze zu-Infinitiv für Ziele ein.",
      ],
      grammarPurpose: "Hilft dir, Zukunftsaussagen strukturiert zu formulieren.",
      prompt:
        "Sprich 2 Minuten (Goethe-C1-Stil): Beschreibe eine Innovation, nenne Chancen/Risiken und gib eine Prognose für die Zukunft.",
      askGrammarPrompt:
        "Wenn du Hilfe mit Futur brauchst, frag zuerst.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-C1-Stil einen kurzen Meinungsaufsatz über technologische Innovationen und ihre Auswirkungen.",
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
    title: "Bildung: Definition bis Schluss",
    topic: "Bildung und lebenslanges Lernen in der modernen Gesellschaft.",
    brainMap: [
      "Bildung = Wissen + Kompetenzen.",
      "Lebenslanges Lernen = kontinuierlich weiterlernen.",
      "Vorteile: Chancen, Karriere.",
      "Nachteile/Probleme: Zeit, Kosten.",
    ],
    speaking: {
      concept:
        "Erkläre, was Bildung heute bedeutet und wie Lernen persönliche und soziale Chancen beeinflusst.",
      outline: SPRECH_OUTLINE,
      starters: SPRECH_STARTERS,
      grammarNotes: [
        "Nutze Nominalisierungen für formelle Definitionen (Bildung, Weiterbildung, Qualifikation).",
        "Verwende Zweckangaben, um Lernziele zu erklären (damit, um ... zu).",
        "Setze Konzessivsätze ein, um Vor- und Nachteile abzuwägen (obwohl, trotzdem).",
      ],
      grammarPurpose: "Hilft dir, Bildung zu definieren, Ziele zu erklären und Vor-/Nachteile zu gewichten.",
      prompt:
        "Sprich 2 Minuten (Goethe-C1-Stil): Definiere Bildung, gib zwei Beispiele, vergleiche Schule und Selbstlernen, nenne Vor-/Nachteile, gib eine Empfehlung und schließe ab.",
      askGrammarPrompt:
        "Wenn du Hilfe mit Nominalisierungen oder Zweckangaben brauchst, frag vor der Aufnahme.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-C1-Stil einen Meinungsaufsatz über lebenslanges Lernen. Verwende damit/um ... zu und ein obwohl/trotzdem, um Vor- und Nachteile abzuwägen.",
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
    title: "Technologie: Definition bis Schluss",
    topic: "Technologie im Alltag, in der Schule und im Beruf.",
    brainMap: [
      "Technologie im Alltag: Smartphone, Apps.",
      "Vorteile: schneller, effizient.",
      "Nachteile: Ablenkung, Abhängigkeit.",
      "Vergleich: früher vs. heute.",
    ],
    speaking: {
      concept:
        "Definiere Technologie umfassend und beschreibe ihre Auswirkungen auf Alltag und Kommunikation.",
      outline: SPRECH_OUTLINE,
      starters: SPRECH_STARTERS,
      grammarNotes: [
        "Nutze Passiv, um Nutzung zu beschreiben (wird genutzt, wurde entwickelt).",
        "Verknüpfe Ursache und Wirkung (deshalb, dadurch, infolgedessen).",
        "Verwende Komparative/Superlative, um früher und heute zu vergleichen.",
      ],
      grammarPurpose: "Ermöglicht dir, Prozesse zu beschreiben und Auswirkungen klar zu vergleichen.",
      prompt:
        "Sprich 2 Minuten (Goethe-C1-Stil): Definiere Technologie, gib Beispiele, vergleiche früher/heute, nenne Vor-/Nachteile, gib eine Empfehlung und schließe ab.",
      askGrammarPrompt:
        "Brauchst du Hilfe mit Passiv oder Ursache-Wirkung-Konnektoren? Frag zuerst.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-C1-Stil einen Meinungsaufsatz (Vorteile/Nachteile) über Smartphones im Unterricht. Nutze Vergleiche und Ursache-Wirkung-Konnektoren (deshalb, dadurch).",
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
    title: "Umwelt: Definition bis Schluss",
    topic: "Umweltschutz und nachhaltige Gewohnheiten.",
    brainMap: [
      "Umweltschutz: Müll trennen, Energie sparen.",
      "Individuelle Verantwortung vs. Politik.",
      "Wenn/falls ... dann ...",
      "Empfehlung: soll/muss.",
    ],
    speaking: {
      concept:
        "Beschreibe, was Umweltschutz umfasst und warum individuelles Handeln wichtig ist.",
      outline: SPRECH_OUTLINE,
      starters: SPRECH_STARTERS,
      grammarNotes: [
        "Nutze Verb-Präposition-Kombinationen (sich kümmern um, beitragen zu).",
        "Verwende Konditionalsätze für Lösungen (wenn, falls).",
        "Nutze Modalverben für Verpflichtungen (müssen, sollen).",
      ],
      grammarPurpose: "Hilft dir, Verantwortung und Maßnahmen nachvollziehbar zu formulieren.",
      prompt:
        "Sprich 2 Minuten (Goethe-C1-Stil): Definiere Umweltschutz, gib Beispiele, vergleiche Stadt/Land, nenne Vor-/Nachteile strenger Regeln, empfehle eine Maßnahme.",
      askGrammarPrompt:
        "Wenn Konditionalsätze oder Modalverben schwierig sind, frag vor der Aufnahme.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-C1-Stil einen formellen Brief an die Hausverwaltung mit einem Vorschlag zum Recycling. Nutze wenn/falls und sollen/müssen.",
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
    title: "Gesellschaft: Definition bis Schluss",
    topic: "Gesellschaft und sozialer Zusammenhalt.",
    brainMap: [
      "Gesellschaft = Menschen + Regeln + Werte.",
      "Zusammenhalt durch Projekte/Initiativen.",
      "Kontrast: Individualismus vs. Gemeinschaft.",
      "Außerdem/hingegen als Verknüpfung.",
    ],
    speaking: {
      concept:
        "Erkläre Gesellschaft als Netzwerk aus Menschen, Regeln und gemeinsamer Verantwortung.",
      outline: SPRECH_OUTLINE,
      starters: SPRECH_STARTERS,
      grammarNotes: [
        "Nutze Relativsätze, um Gruppen zu definieren (die Menschen, die ...).",
        "Verwende dass/ob-Sätze für Regeln und Werte.",
        "Setze Konjunktivadverbien für Ergänzung oder Kontrast ein (außerdem, hingegen).",
      ],
      grammarPurpose: "Unterstützt präzise Definitionen und ausgewogene Positionen.",
      prompt:
        "Sprich 2 Minuten (Goethe-C1-Stil): Definiere Gesellschaft, gib Beispiele, vergleiche Individualismus/Gemeinschaft, nenne Vor-/Nachteile sozialer Medien, empfehle eine Initiative.",
      askGrammarPrompt:
        "Frag, wenn du Hilfe mit Relativsätzen oder Konjunktivadverbien brauchst.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-C1-Stil einen Meinungsaufsatz über ein lokales Projekt für Zusammenhalt. Nutze einen Relativsatz und ein Konjunktivadverb (hingegen/jedoch).",
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
    title: "Arbeit: Definition bis Schluss",
    topic: "Arbeitskultur, Berufe und Zukunftskompetenzen.",
    brainMap: [
      "Arbeitswelt heute: flexibel, digital.",
      "Zukunft: neue Berufe, neue Kompetenzen.",
      "Vergleich: Büro vs. Homeoffice.",
      "Aus meiner Sicht ...",
    ],
    speaking: {
      concept:
        "Beschreibe, was Arbeit heute bedeutet und wie sich Erwartungen verändert haben.",
      outline: SPRECH_OUTLINE,
      starters: SPRECH_STARTERS,
      grammarNotes: [
        "Nutze Wechselpräpositionen, um Arbeitsorte zu beschreiben (in der Firma, auf der Arbeit).",
        "Verwende Futur für Trends (werden).",
        "Nutze formelle Meinungsformeln (aus meiner Sicht, meiner Meinung nach).",
      ],
      grammarPurpose: "Hilft dir, Arbeitskontexte und Zukunftsperspektiven höflich zu formulieren.",
      prompt:
        "Sprich 2 Minuten (Goethe-C1-Stil): Definiere Arbeit, gib Beispiele moderner Jobs, vergleiche Büro/Homeoffice, nenne Vor-/Nachteile flexibler Zeiten, empfehle eine Kompetenz.",
      askGrammarPrompt:
        "Wenn Präpositionen oder Futurformen verwirrend sind, frag zuerst.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-C1-Stil einen Meinungsaufsatz über Zukunftskompetenzen im Beruf. Verwende Futur und eine formelle Meinungsformel.",
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
    title: "Gesundheit: Definition bis Schluss",
    topic: "Gesundheit, Prävention und Lebensstil.",
    brainMap: [
      "Gesundheit: körperlich, mental, sozial.",
      "Gewohnheiten: Schlaf, Bewegung, Ernährung.",
      "Stressquellen: Arbeit vs. Schule.",
      "Kontrast: während/hingegen.",
    ],
    speaking: {
      concept:
        "Erkläre Gesundheit als körperliches, mentales und soziales Wohlbefinden.",
      outline: SPRECH_OUTLINE,
      starters: SPRECH_STARTERS,
      grammarNotes: [
        "Nutze den Genitiv bei abstrakten Begriffen (die Bedeutung der Gesundheit).",
        "Verwende reflexive Verben für Gewohnheiten (sich ernähren, sich bewegen).",
        "Setze Kontrastkonnektoren ein (während, hingegen).",
      ],
      grammarPurpose: "Hilft dir, Gesundheit zu definieren und Stressquellen zu vergleichen.",
      prompt:
        "Sprich 2 Minuten (Goethe-C1-Stil): Definiere Gesundheit, gib Beispiele, vergleiche Stressquellen, nenne Vor-/Nachteile von Fitness-Apps, empfehle eine Routine.",
      askGrammarPrompt:
        "Brauchst du Hilfe mit Genitiv oder reflexiven Verben? Frag vor der Aufnahme.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-C1-Stil einen Meinungsaufsatz über digitale Fitness-Apps. Nutze ein reflexives Verb und einen Kontrast (hingegen/während).",
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
    title: "Migration: Definition bis Schluss",
    topic: "Migration, Gründe und Integration.",
    brainMap: [
      "Gründe: Arbeit, Sicherheit, Familie.",
      "Druck- und Sogfaktoren erklären.",
      "Integration: Sprache, Arbeit, Schule.",
      "Zuerst/dann als Reihenfolge.",
    ],
    speaking: {
      concept:
        "Definiere Migration und beschreibe typische Push- und Pull-Faktoren.",
      outline: SPRECH_OUTLINE,
      starters: SPRECH_STARTERS,
      grammarNotes: [
        "Nutze Begründungssätze (weil, da), um Faktoren zu erklären.",
        "Verwende Passiv für Integrationsprozesse (es wird integriert).",
        "Nutze Zeitangaben für Reihenfolgen (zuerst, dann).",
      ],
      grammarPurpose: "Unterstützt klare Ursachen und nachvollziehbare Abläufe.",
      prompt:
        "Sprich 2 Minuten (Goethe-C1-Stil): Definiere Migration, nenne Gründe, vergleiche freiwillig/erzwungen, nenne Vor-/Nachteile, empfehle eine Integrationsmaßnahme.",
      askGrammarPrompt:
        "Wenn Begründungssätze oder Passivformen schwer sind, frag zuerst.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-C1-Stil einen Meinungsaufsatz über Integrationsprogramme. Verwende weil/da, eine passive Form und eine zeitliche Reihenfolge.",
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
    title: "Medien: Definition bis Schluss",
    topic: "Medienkompetenz und Informationsqualität.",
    brainMap: [
      "Medienkompetenz = kritisch prüfen.",
      "Quellen: Zeitung, Social Media.",
      "Gefahr: Fake News.",
      "Jedoch/trotzdem als Kontrast.",
    ],
    speaking: {
      concept:
        "Erkläre, was Medienkompetenz ist und warum sie wichtig für informierte Entscheidungen ist.",
      outline: SPRECH_OUTLINE,
      starters: SPRECH_STARTERS,
      grammarNotes: [
        "Nutze indirekte Rede, um Quellen zu berichten (er sagt, dass ...).",
        "Verwende Adjektivendungen für präzise Beschreibungen (zuverlässige Nachricht).",
        "Setze Kontrastkonnektoren ein (jedoch, trotzdem).",
      ],
      grammarPurpose: "Hilft dir, Quellen zu bewerten und Medien kritisch einzuordnen.",
      prompt:
        "Sprich 2 Minuten (Goethe-C1-Stil): Definiere Medienkompetenz, nenne zuverlässige Quellen, vergleiche Social Media/Zeitung, nenne Vor-/Nachteile, empfehle eine Prüfstrategie.",
      askGrammarPrompt:
        "Wenn indirekte Rede oder Adjektivendungen schwierig sind, frag zuerst.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-C1-Stil einen Meinungsaufsatz über den Umgang mit Online-Informationen. Nutze eine indirekte Rede und einen Kontrastkonnektor.",
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
    title: "Politik: Definition bis Schluss",
    topic: "Bürgerbeteiligung und demokratische Prozesse.",
    brainMap: [
      "Politik = Entscheidungen für alle.",
      "Beteiligung: wählen, mitreden.",
      "Lokal vs. national.",
      "Konjunktiv II: wäre/könnte.",
    ],
    speaking: {
      concept:
        "Definiere Politik als gemeinschaftliche Entscheidungsfindung und beschreibe Bürgerrollen.",
      outline: SPRECH_OUTLINE,
      starters: SPRECH_STARTERS,
      grammarNotes: [
        "Nutze Nomen-Verb-Verbindungen (eine Entscheidung treffen).",
        "Verwende Relativpronomen zur Präzisierung (der/die/das).",
        "Setze Konjunktiv II ein, um Vorschläge zu machen (wäre, könnte).",
      ],
      grammarPurpose: "Ermöglicht dir, Beteiligung zu erklären und diplomatisch zu argumentieren.",
      prompt:
        "Sprich 2 Minuten (Goethe-C1-Stil): Definiere Politik, nenne Beteiligungsformen, vergleiche lokal/national, nenne Vor-/Nachteile der Wahlpflicht, empfehle eine Beteiligung.",
      askGrammarPrompt:
        "Frag, wenn du Hilfe mit Konjunktiv II oder Relativpronomen brauchst.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-C1-Stil einen Meinungsaufsatz über das Wahlrecht ab 16. Verwende Konjunktiv II und einen Relativsatz.",
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
    title: "Freizeit: Definition bis Schluss",
    topic: "Freizeitgestaltung und Work-Life-Balance.",
    brainMap: [
      "Freizeit = Erholung + Hobbys.",
      "Aktiv vs. passiv.",
      "Wenn/sobald ...",
      "regelmäßig/selten.",
    ],
    speaking: {
      concept:
        "Beschreibe Freizeit als Zeit für Erholung und persönliche Interessen.",
      outline: SPRECH_OUTLINE,
      starters: SPRECH_STARTERS,
      grammarNotes: [
        "Nutze trennbare Verben (abschalten, ausruhen).",
        "Verwende Temporalsätze (wenn, sobald).",
        "Setze Häufigkeitsangaben ein (regelmäßig, selten).",
      ],
      grammarPurpose: "Hilft dir, Routinen zu erklären und Ausgleich zu begründen.",
      prompt:
        "Sprich 2 Minuten (Goethe-C1-Stil): Definiere Freizeit, gib Beispiele, vergleiche aktive/passive Hobbys, nenne Vor-/Nachteile ständiger Erreichbarkeit, empfehle eine Strategie.",
      askGrammarPrompt:
        "Wenn trennbare Verben oder Temporalsätze verwirrend sind, frag vor der Aufnahme.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-C1-Stil einen Meinungsaufsatz über Freizeit und Work-Life-Balance. Nutze ein trennbares Verb, einen Temporalsatz und eine Häufigkeitsangabe.",
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
    title: "Wohnen: Definition bis Schluss",
    topic: "Wohnen, Bezahlbarkeit und Wohnformen.",
    brainMap: [
      "Wohnen: Stadt vs. Land.",
      "Wohnformen: WG, eigene Wohnung.",
      "Je ... desto ... als Vergleich.",
      "Sollte/könnte für Empfehlungen.",
    ],
    speaking: {
      concept:
        "Erkläre Wohnbedarfe und wie Menschen entscheiden, wo sie leben.",
      outline: SPRECH_OUTLINE,
      starters: SPRECH_STARTERS,
      grammarNotes: [
        "Nutze Dativ/Akkusativ-Präpositionen (in die Stadt, auf dem Land).",
        "Verwende Vergleichsstrukturen (je ..., desto ...).",
        "Setze Modalverben für Empfehlungen ein (sollte, könnte).",
      ],
      grammarPurpose: "Hilft dir, Wohnoptionen zu vergleichen und Empfehlungen zu formulieren.",
      prompt:
        "Sprich 2 Minuten (Goethe-C1-Stil): Definiere Wohnen, gib Beispiele, vergleiche Stadt/Land, nenne Vor-/Nachteile von WGs, empfehle eine Wohnpolitik.",
      askGrammarPrompt:
        "Frag, wenn du Hilfe mit Präpositionen oder Vergleichsstrukturen brauchst.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-C1-Stil einen formellen Brief an einen Vermieter mit Fragen zu einer Wohnung. Nutze je ... desto ... und eine Empfehlung mit sollte/könnte.",
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
    title: "Mobilität: Definition bis Schluss",
    topic: "Transport, Infrastruktur und nachhaltige Wege.",
    brainMap: [
      "Mobilität: ÖPNV, Fahrrad, Auto.",
      "Nachhaltigkeit: weniger Emissionen.",
      "Passiv: es wird gebaut.",
      "Deswegen/daher als Ursache.",
    ],
    speaking: {
      concept:
        "Beschreibe Mobilität als die Fähigkeit, effizient und sicher unterwegs zu sein.",
      outline: SPRECH_OUTLINE,
      starters: SPRECH_STARTERS,
      grammarNotes: [
        "Nutze Passiv für Infrastrukturänderungen (es wird gebaut).",
        "Verwende Verkehrs-Präpositionen (mit dem Bus, per Fahrrad).",
        "Setze Kausalkonnektoren ein (deswegen, daher).",
      ],
      grammarPurpose: "Hilft dir, Optionen zu erklären und Folgen von Maßnahmen zu begründen.",
      prompt:
        "Sprich 2 Minuten (Goethe-C1-Stil): Definiere Mobilität, gib Beispiele, vergleiche Auto/ÖPNV, nenne Vor-/Nachteile von E-Scootern, empfehle eine Änderung.",
      askGrammarPrompt:
        "Wenn Passiv oder Verkehrs-Präpositionen schwierig sind, frag zuerst.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-C1-Stil einen formellen Brief an die Stadt über bessere Radwege. Verwende Passiv und einen Kausalkonnektor (daher/deswegen).",
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
    title: "Wissenschaft: Definition bis Schluss",
    topic: "Wissenschaft, Forschung und Vertrauen.",
    brainMap: [
      "Wissenschaft = Forschung + Methode.",
      "Vertrauen durch Studien/Belege.",
      "Weil/obwohl als Begründung.",
      "Passiv: es wird untersucht.",
    ],
    speaking: {
      concept:
        "Erkläre Wissenschaft als Methode, Ideen zu prüfen und Wissen zu erweitern.",
      outline: SPRECH_OUTLINE,
      starters: SPRECH_STARTERS,
      grammarNotes: [
        "Nutze Nebensätze für Gründe und Grenzen (weil, obwohl, während).",
        "Verwende Passiv für Forschungsprozesse (es wird untersucht).",
        "Setze Verknüpfungen für Vergleiche (zum einen ... zum anderen).",
      ],
      grammarPurpose: "Hilft dir, Methoden zu erklären und Forschungsfelder zu vergleichen.",
      prompt:
        "Sprich 2 Minuten (Goethe-C1-Stil): Definiere Wissenschaft, nenne Beispiele, vergleiche Grundlagenforschung/angewandte Forschung, nenne Vor-/Nachteile öffentlicher Förderung, empfehle eine Kommunikationspraxis.",
      askGrammarPrompt:
        "Frag, wenn Nebensätze oder Passivformen verwirrend sind.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-C1-Stil einen Meinungsaufsatz über die Bedeutung von Forschung. Verwende weil/obwohl und mindestens eine passive Konstruktion.",
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
    title: "Konsum: Definition bis Schluss",
    topic: "Konsumverhalten und ethische Entscheidungen.",
    brainMap: [
      "Konsum: Preise, Qualität, Nachhaltigkeit.",
      "Online vs. lokal einkaufen.",
      "Genitiv: die Qualität des Produkts.",
      "Vor allem/besonders als Betonung.",
    ],
    speaking: {
      concept:
        "Beschreibe Konsumgewohnheiten und wie Entscheidungen Menschen und Umwelt beeinflussen.",
      outline: SPRECH_OUTLINE,
      starters: SPRECH_STARTERS,
      grammarNotes: [
        "Nutze den Genitiv, um Produkteigenschaften zu beschreiben (die Qualität des Produkts).",
        "Verwende Vergleichsformen, um Einkaufsoptionen zu kontrastieren.",
        "Setze Betonungen ein (besonders, vor allem).",
      ],
      grammarPurpose: "Hilft dir, Konsumentscheidungen zu vergleichen und Schwerpunkte zu setzen.",
      prompt:
        "Sprich 2 Minuten (Goethe-C1-Stil): Definiere Konsum, gib Beispiele, vergleiche online/lokal, nenne Vor-/Nachteile von Fast Fashion, empfehle eine Veränderung.",
      askGrammarPrompt:
        "Wenn Genitiv oder Vergleiche schwierig sind, frag vor der Aufnahme.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-C1-Stil einen Meinungsaufsatz über nachhaltigen Konsum. Nutze den Genitiv und einen Vergleichssatz.",
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
    title: "Digitalisierung: Definition bis Schluss",
    topic: "Digitalisierung in Dienstleistungen und Alltag.",
    brainMap: [
      "Digitalisierung: Onlinebanking, E-Services.",
      "Vorteile: schnell, effizient.",
      "Risiken: Datenschutz, Zugang.",
      "Dadurch/sodass als Folge.",
    ],
    speaking: {
      concept:
        "Erkläre Digitalisierung als Verlagerung von Prozessen in digitale Systeme.",
      outline: SPRECH_OUTLINE,
      starters: SPRECH_STARTERS,
      grammarNotes: [
        "Nutze Nominalkomposita für digitale Dienste (Onlinebanking, Datensicherheit).",
        "Verwende Futur, um Veränderungen zu prognostizieren (werden).",
        "Setze Ursache-Wirkung-Konnektoren ein (dadurch, sodass).",
      ],
      grammarPurpose: "Hilft dir, digitale Dienste zu beschreiben und Folgen zu erklären.",
      prompt:
        "Sprich 2 Minuten (Goethe-C1-Stil): Definiere Digitalisierung, nenne Beispiele, vergleiche analog/digital, nenne Vor-/Nachteile von E-Government, empfehle eine Verbesserung.",
      askGrammarPrompt:
        "Frag, wenn Nominalkomposita oder Futurformen verwirrend sind.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-C1-Stil einen Meinungsaufsatz über digitale Dienstleistungen. Verwende Futur und einen Ursache-Wirkung-Konnektor.",
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
    title: "Zusammenfassung: Definition bis Schluss",
    topic: "Wiederholung und Verknüpfung der C1-Themen.",
    brainMap: [
      "Rückblick auf mehrere Themen.",
      "Hauptpunkt nennen + Beispiele.",
      "Einerseits/andererseits als Kontrast.",
      "Zusammenfassend als Abschluss.",
    ],
    speaking: {
      concept:
        "Verbinde Bildung, Technologie, Umwelt, Gesellschaft, Arbeit, Gesundheit und Migration in einer zusammenhängenden Darstellung.",
      outline: SPRECH_OUTLINE,
      starters: SPRECH_STARTERS,
      grammarNotes: [
        "Nutze Zusammenfassungsformulierungen (insgesamt, zusammenfassend).",
        "Setze Kontraste ein (einerseits, andererseits).",
        "Verknüpfe Themen mit klaren Satzverbindungen.",
      ],
      grammarPurpose: "Hilft dir, Themen zu verknüpfen und klar abzuschließen.",
      prompt:
        "Sprich 2–3 Minuten (Goethe-C1-Stil): Nenne ein Kernthema, gib Beispiele aus mehreren Bereichen, vergleiche zwei Felder, nenne Vor-/Nachteile, gib eine Empfehlung und fasse zusammen.",
      askGrammarPrompt:
        "Wenn du Hilfe beim Verbinden oder Zusammenfassen brauchst, frag vor der Aufnahme.",
    },
    writing: {
      prompt:
        "Schreibe im Goethe-C1-Stil einen Meinungsaufsatz über das Thema, das dir am schwersten fällt. Nutze Zusammenfassungen und einen Kontrast (einerseits/andererseits).",
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

const C1_PLAN_ENHANCEMENTS = {
  1: {
    learningObjectives: [
      "Eigene C1-Ziele formulieren und Lernweg reflektieren.",
      "Einleitung klar strukturieren und begründen.",
    ],
    grammarFocus: {
      group: "Woche 1 Grundlagen",
      items: ["Strukturgeber (zuerst, danach, schließlich)", "Begründungen und Zweck (weil, damit, um ... zu)"],
    },
    activities: {
      quiz: [
        "Ergänze: Ich lerne Deutsch, ___ ich meine Karriereziele erreichen will.",
        "Formuliere einen Zwecksatz mit „damit“.",
      ],
      discussionPrompt: "Welche Lernroutine ist für dich am wirksamsten?",
    },
  },
  2: {
    learningObjectives: [
      "Kultur differenziert definieren und vergleichen.",
      "Relativsätze für präzise Definitionen nutzen.",
    ],
    grammarFocus: {
      group: "Woche 1 Grundlagen",
      items: ["Relativsätze", "Vergleichsformen (im Vergleich zu, anders als)"],
    },
    activities: {
      quiz: [
        "Baue einen Relativsatz zur Definition von Kultur.",
        "Nenne zwei Vergleichsformeln für Kulturen.",
      ],
      discussionPrompt: "Welche kulturellen Missverständnisse kennst du aus eigener Erfahrung?",
    },
    reading: {
      resourceId: "c1-kultur-essay",
      tasks: [
        "Markiere drei zentrale Thesen des Essays.",
        "Formuliere eine Gegenposition in zwei Sätzen.",
        "Wähle zwei neue Ausdrücke und erkläre sie.",
      ],
    },
    listening: {
      resourceId: "c1-nachrichten-audio",
      prompt: "Höre die Nachrichten zweimal und notiere zentrale Fakten.",
      tasks: [
        "Notiere drei Informationen, die dir wichtig erscheinen.",
        "Welche Frage würdest du dem Autor stellen?",
      ],
    },
  },
  3: {
    learningObjectives: [
      "Mediennutzung kritisch analysieren.",
      "Indirekte Fragen in Argumentation einsetzen.",
    ],
    grammarFocus: {
      group: "Woche 1 Grundlagen",
      items: ["Indirekte Fragen", "Argumentative Konnektoren (dennoch, allerdings)"],
    },
    activities: {
      quiz: [
        "Formuliere eine indirekte Frage zu einer Nachricht.",
        "Schreibe einen Satz mit „allerdings“.",
      ],
      discussionPrompt: "Wie erkennst du manipulative Inhalte?",
    },
  },
  4: {
    learningObjectives: [
      "Beziehungen differenziert beschreiben.",
      "Empfehlungen mit zu-Infinitiv formulieren.",
    ],
    grammarFocus: {
      group: "Woche 1 Grundlagen",
      items: ["weil/da", "zu-Infinitiv (um zu, ohne zu)"],
    },
    activities: {
      quiz: [
        "Schreibe einen Satz mit „um ... zu“ zur Konfliktlösung.",
        "Ergänze einen Satz mit „da“.",
      ],
      discussionPrompt: "Welche Kommunikationsregel ist dir am wichtigsten?",
    },
  },
  5: {
    learningObjectives: [
      "Berufliche Ziele präzise darstellen.",
      "Konjunktiv II für Wünsche einsetzen.",
    ],
    grammarFocus: {
      group: "Woche 1 Grundlagen",
      items: ["Konjunktiv II", "Bedingungssätze (wenn/falls)"],
    },
    activities: {
      quiz: [
        "Formuliere einen beruflichen Wunsch im Konjunktiv II.",
        "Vergleiche zwei Arbeitsmodelle in einem Satz.",
      ],
      discussionPrompt: "Welche Zukunftskompetenz ist für dich entscheidend?",
    },
    reading: {
      resourceId: "c1-arbeitswelt-essay",
      tasks: [
        "Notiere drei zentrale Trends der Arbeitswelt.",
        "Welche Konsequenz siehst du für deine Branche?",
      ],
    },
    listening: {
      resourceId: "c1-wirtschaft-audio",
      prompt: "Höre den Beitrag und notiere zentrale Aussagen.",
      tasks: [
        "Welche Herausforderung wird genannt?",
        "Formuliere eine eigene Einschätzung.",
      ],
    },
  },
  6: {
    learningObjectives: [
      "Gesundheitsthemen mit Imperativ und Empfehlungen bearbeiten.",
      "Ursache-Wirkung-Beziehungen erklären.",
    ],
    grammarFocus: {
      group: "Woche 1 Grundlagen",
      items: ["Imperativ", "Folgekonnektoren (deshalb, daher)"],
    },
    activities: {
      quiz: [
        "Schreibe eine Empfehlung im Imperativ.",
        "Verbinde zwei Sätze mit „daher“.",
      ],
      discussionPrompt: "Welche kleine Routine verbessert dein Wohlbefinden?",
    },
  },
  7: {
    title: "Woche 1 Review + Reisen und Mobilität",
    topic: "Reiseerfahrungen einordnen und die Woche reflektieren.",
    learningObjectives: [
      "Woche 1 Themen zusammenfassen und reflektieren.",
      "Schlüsselwörter gezielt wiederholen.",
    ],
    grammarFocus: {
      group: "Woche 1 Review",
      items: ["Relativsätze und Konnektoren wiederholen", "Konjunktiv II kurz prüfen"],
    },
    activities: {
      quiz: [
        "Verbinde zwei Themen der Woche in einem Satz.",
        "Schreibe zwei Sätze mit Relativsätzen.",
      ],
      reflectionPrompt: "Welche Aufgabe fiel dir am leichtesten?",
      discussionPrompt: "Welche Themen willst du nächste Woche vertiefen?",
    },
    weeklyReview: {
      summary: "Review Woche 1: Kultur, Medien, Beziehungen, Arbeit, Gesundheit.",
      reflectionQuestions: [
        "Welche Struktur nutzt du sicher?",
        "Welche Aufgabe möchtest du wiederholen?",
        "Welche Wörter brauchst du noch einmal?",
      ],
      practicePrompt: "Nimm eine 2-Minuten-Zusammenfassung der Woche auf.",
    },
  },
  8: {
    learningObjectives: [
      "Wohnformen differenziert beschreiben.",
      "Passiv für Regeln und Erwartungen nutzen.",
    ],
    grammarFocus: {
      group: "Woche 2 Vertiefung",
      items: ["Wechselpräpositionen", "Passiv im Kontext von Regeln"],
    },
    activities: {
      quiz: [
        "Schreibe einen Passivsatz über Hausregeln.",
        "Nenne zwei Wechselpräpositionen.",
      ],
      discussionPrompt: "Welche Regeln sind in deiner Nachbarschaft wichtig?",
    },
  },
  9: {
    learningObjectives: [
      "Konsum kritisch bewerten.",
      "Vergleichsstrukturen sicher anwenden.",
    ],
    grammarFocus: {
      group: "Woche 2 Vertiefung",
      items: ["Komparativ/Superlativ", "Konjunktiv II für Kritik"],
    },
    activities: {
      quiz: [
        "Vergleiche zwei Produkte in einem Satz.",
        "Formuliere eine Kritik mit „man würde denken“.",
      ],
      discussionPrompt: "Wann kaufst du bewusst nachhaltig ein?",
    },
    reading: {
      resourceId: "c1-medien-essay",
      tasks: [
        "Markiere zwei Argumente des Autors.",
        "Formuliere eine kurze Gegenrede.",
      ],
    },
    listening: {
      resourceId: "c1-medien-audio",
      prompt: "Höre den Beitrag und notiere Kernaussagen.",
      tasks: [
        "Welche Begriffe werden besonders betont?",
        "Schreibe ein kurzes Fazit mit „insgesamt“.",
      ],
    },
  },
  10: {
    learningObjectives: [
      "Integrationsprozesse sachlich erklären.",
      "Nominalisierungen einsetzen.",
    ],
    grammarFocus: {
      group: "Woche 2 Vertiefung",
      items: ["Obwohl/trotzdem", "Nominalisierungen"],
    },
    activities: {
      quiz: [
        "Schreibe einen Satz mit „obwohl“.",
        "Bilde zwei Nominalisierungen.",
      ],
      discussionPrompt: "Welche Unterstützung erleichtert Teilhabe?",
    },
  },
  11: {
    learningObjectives: [
      "Engagement mit Zielangaben beschreiben.",
      "Passiv und Zweckangaben kombinieren.",
    ],
    grammarFocus: {
      group: "Woche 2 Vertiefung",
      items: ["Passiv für Prozesse", "Zweckangaben (damit/um ... zu)"],
    },
    activities: {
      quiz: [
        "Formuliere einen Passivsatz zur Mitbestimmung.",
        "Ergänze einen Satz mit „damit“.",
      ],
      discussionPrompt: "Wie könnte man Ehrenamt attraktiver machen?",
    },
  },
  12: {
    learningObjectives: [
      "Freizeitaktivitäten vergleichen.",
      "Nebensätze mit während/als sicher verwenden.",
    ],
    grammarFocus: {
      group: "Woche 2 Vertiefung",
      items: ["während/als", "sowohl ... als auch"],
    },
    activities: {
      quiz: [
        "Formuliere einen Satz mit „während“.",
        "Nutze „sowohl ... als auch“ in einem Satz.",
      ],
      discussionPrompt: "Welche Freizeitform passt zu deinem Alltag?",
    },
  },
  13: {
    learningObjectives: [
      "Sprachenlernen reflektieren und Strategien benennen.",
      "Indirekte Rede zur Wiedergabe nutzen.",
    ],
    grammarFocus: {
      group: "Woche 2 Vertiefung",
      items: ["Indirekte Rede", "Genitivpräpositionen (trotz, während)"],
    },
    activities: {
      quiz: [
        "Schreibe einen Satz in indirekter Rede.",
        "Nenne zwei Strategien gegen Missverständnisse.",
      ],
      discussionPrompt: "Wie nutzt du Feedback beim Lernen?",
    },
  },
  14: {
    title: "Woche 2 Review + Wissenschaft und Zukunft",
    topic: "Innovationen besprechen und Woche 2 reflektieren.",
    learningObjectives: [
      "Woche 2 Themen zusammenführen.",
      "Eigenen Fortschritt einschätzen.",
    ],
    grammarFocus: {
      group: "Woche 2 Review",
      items: ["Passiv und Kontraste wiederholen", "Vergleichsformen sichern"],
    },
    activities: {
      quiz: [
        "Schreibe zwei Sätze mit Passiv und Kontrast.",
        "Verbinde Wohnen und Freizeit in einem Satz.",
      ],
      reflectionPrompt: "Welche Aufgabe hat dir am meisten gebracht?",
      discussionPrompt: "Welches Thema würdest du wiederholen?",
    },
    weeklyReview: {
      summary: "Review Woche 2: Wohnen, Konsum, Integration, Engagement, Freizeit, Sprache.",
      reflectionQuestions: [
        "Welche Strukturen waren stabil?",
        "Welche Materialien waren hilfreich?",
        "Was nimmst du in Woche 3 mit?",
      ],
      practicePrompt: "Schreibe eine kurze Wochenreflexion (5 Sätze).",
    },
  },
  15: {
    learningObjectives: [
      "Bildung definieren und Lernformate vergleichen.",
      "Nominalisierung und Zweckangaben kombinieren.",
    ],
    grammarFocus: {
      group: "Woche 3 Ausbau",
      items: ["Nominalisierungen", "Zweckangaben (damit/um ... zu)"],
    },
    activities: {
      quiz: [
        "Formuliere zwei Nominalisierungen zum Lernen.",
        "Schreibe einen Satz mit „um ... zu“.",
      ],
      discussionPrompt: "Wie organisierst du Weiterbildung langfristig?",
    },
    reading: {
      resourceId: "c1-gesundheit-essay",
      tasks: [
        "Notiere zwei zentrale Aussagen.",
        "Welche Empfehlung kannst du ableiten?",
      ],
    },
    listening: {
      resourceId: "c1-gesundheit-audio",
      prompt: "Höre das Audio und notiere die Kernaussage.",
      tasks: [
        "Welche Daten oder Fakten werden genannt?",
        "Formuliere eine eigene Position.",
      ],
    },
  },
  16: {
    learningObjectives: [
      "Technologieauswirkungen differenziert beschreiben.",
      "Kausalverbindungen korrekt einsetzen.",
    ],
    grammarFocus: {
      group: "Woche 3 Ausbau",
      items: ["Passiv", "Kausalverbindungen (deshalb, dadurch)"],
    },
    activities: {
      quiz: [
        "Schreibe einen Passivsatz über Technologien.",
        "Verbinde zwei Sätze mit „dadurch“.",
      ],
      discussionPrompt: "Welche Technologie sollte reguliert werden?",
    },
  },
  17: {
    learningObjectives: [
      "Umweltmaßnahmen mit Konditionalsätzen erläutern.",
      "Verpflichtungen mit Modalverben ausdrücken.",
    ],
    grammarFocus: {
      group: "Woche 3 Ausbau",
      items: ["Wenn/falls", "Modalverben (müssen, sollen)"],
    },
    activities: {
      quiz: [
        "Formuliere einen Wenn-Satz zur Umwelt.",
        "Schreibe einen Satz mit „sollen“.",
      ],
      discussionPrompt: "Welche Maßnahme würdest du sofort einführen?",
    },
  },
  18: {
    learningObjectives: [
      "Gesellschaftliche Zusammenhänge strukturiert erklären.",
      "Konjunktivadverbien zur Kontrastierung nutzen.",
    ],
    grammarFocus: {
      group: "Woche 3 Ausbau",
      items: ["Relativsätze", "Konjunktivadverbien (hingegen, außerdem)"],
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
      "Arbeitskultur und Zukunftskompetenzen beschreiben.",
      "Futurformen korrekt einsetzen.",
    ],
    grammarFocus: {
      group: "Woche 3 Ausbau",
      items: ["Futurformen", "Formelle Meinungsformeln"],
    },
    activities: {
      quiz: [
        "Schreibe einen Satz im Futur über Berufe.",
        "Nutze „meines Erachtens“ in einem Satz.",
      ],
      discussionPrompt: "Welche Kompetenz wird in fünf Jahren zentral sein?",
    },
  },
  20: {
    learningObjectives: [
      "Gesundheit umfassend definieren.",
      "Reflexive Verben in Routinen verwenden.",
    ],
    grammarFocus: {
      group: "Woche 3 Ausbau",
      items: ["Genitiv bei abstrakten Nomen", "Reflexive Verben"],
    },
    activities: {
      quiz: [
        "Schreibe einen Genitivsatz über Gesundheit.",
        "Formuliere eine Routine mit reflexivem Verb.",
      ],
      discussionPrompt: "Wie gehst du mit Stress um?",
    },
  },
  21: {
    title: "Woche 3 Review + Migration",
    topic: "Migrationsthema mit Wochenfokus verbinden.",
    learningObjectives: [
      "Woche 3 Themen verknüpfen und zusammenfassen.",
      "Stärken und Schwächen erkennen.",
    ],
    grammarFocus: {
      group: "Woche 3 Review",
      items: ["Konditionalsätze und Modalverben", "Futurformen wiederholen"],
    },
    activities: {
      quiz: [
        "Schreibe zwei Sätze: einen Konditionalsatz und einen Futursatz.",
        "Nutze ein Konjunktivadverb.",
      ],
      reflectionPrompt: "Welche Themen liefen flüssig?",
      discussionPrompt: "Welche Themen brauchst du noch?",
    },
    weeklyReview: {
      summary: "Review Woche 3: Bildung, Technologie, Umwelt, Gesellschaft, Arbeit, Gesundheit.",
      reflectionQuestions: [
        "Welche Konnektoren nutzt du sicher?",
        "Welche Aufgaben waren am einfachsten?",
        "Was möchtest du in Woche 4 stärken?",
      ],
      practicePrompt: "Halte eine 2-Minuten-Audio-Reflexion fest.",
    },
  },
  22: {
    learningObjectives: [
      "Medienkompetenz mit Kontrasten erläutern.",
      "Indirekte Rede für Quellen nutzen.",
    ],
    grammarFocus: {
      group: "Woche 4 Konsolidierung",
      items: ["Indirekte Rede", "Kontrastkonnektoren (jedoch, trotzdem)"],
    },
    activities: {
      quiz: [
        "Schreibe einen Satz mit „trotzdem“.",
        "Formuliere eine indirekte Rede zu einer Quelle.",
      ],
      discussionPrompt: "Welche Kriterien nutzt du für Faktenchecks?",
    },
    reading: {
      resourceId: "c1-zukunft-essay",
      tasks: [
        "Notiere zwei zentrale Argumente.",
        "Schreibe ein Fazit mit „zusammenfassend“.",
      ],
    },
    listening: {
      resourceId: "c1-innovation-audio",
      prompt: "Höre das Interview und notiere Chancen und Risiken.",
      tasks: [
        "Welche ethische Frage wird genannt?",
        "Formuliere eine eigene Bewertung.",
      ],
    },
  },
  23: {
    learningObjectives: [
      "Politische Beteiligung differenziert darstellen.",
      "Konjunktiv II für Vorschläge nutzen.",
    ],
    grammarFocus: {
      group: "Woche 4 Konsolidierung",
      items: ["Konjunktiv II", "Relativpronomen"],
    },
    activities: {
      quiz: [
        "Formuliere einen Vorschlag im Konjunktiv II.",
        "Schreibe einen Relativsatz über Bürgerrechte.",
      ],
      discussionPrompt: "Welche Beteiligungsform ist für dich sinnvoll?",
    },
  },
  24: {
    learningObjectives: [
      "Freizeit und Work-Life-Balance erläutern.",
      "Temporalsätze sicher einsetzen.",
    ],
    grammarFocus: {
      group: "Woche 4 Konsolidierung",
      items: ["Temporalsätze (wenn, sobald)", "Häufigkeitsangaben"],
    },
    activities: {
      quiz: [
        "Schreibe einen Satz mit „sobald“.",
        "Nutze eine Häufigkeitsangabe im Satz.",
      ],
      discussionPrompt: "Wie schützt du deine Erholungszeit?",
    },
  },
  25: {
    learningObjectives: [
      "Wohnraum vergleichen und Empfehlungen geben.",
      "Je ... desto korrekt nutzen.",
    ],
    grammarFocus: {
      group: "Woche 4 Konsolidierung",
      items: ["Je ... desto", "Modalverben für Empfehlungen"],
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
      "Mobilitätspolitik erklären.",
      "Kausalverbindungen nutzen.",
    ],
    grammarFocus: {
      group: "Woche 4 Konsolidierung",
      items: ["Passiv", "Kausalkonnektoren (deswegen, daher)"],
    },
    activities: {
      quiz: [
        "Schreibe einen Passivsatz zur Infrastruktur.",
        "Verbinde zwei Sätze mit „daher“.",
      ],
      discussionPrompt: "Welche Mobilitätslösung ist für dich realistisch?",
    },
  },
  27: {
    learningObjectives: [
      "Wissenschaftsprozesse erklären.",
      "Nebensätze zur Begründung nutzen.",
    ],
    grammarFocus: {
      group: "Woche 4 Konsolidierung",
      items: ["weil/obwohl", "Passiv im Forschungsprozess"],
    },
    activities: {
      quiz: [
        "Schreibe einen Satz mit „obwohl“.",
        "Formuliere einen Passivsatz zur Forschung.",
      ],
      discussionPrompt: "Wie sollte Forschung kommuniziert werden?",
    },
  },
  28: {
    title: "Woche 4 Review + Konsum",
    topic: "Konsumthema nutzen, um Woche 4 zusammenzufassen.",
    learningObjectives: [
      "Woche 4 Themen zusammenführen.",
      "Wichtige Vokabeln priorisieren.",
    ],
    grammarFocus: {
      group: "Woche 4 Review",
      items: ["Zusammenfassungssignale", "Kontraste wiederholen"],
    },
    activities: {
      quiz: [
        "Schreibe zwei Sätze mit Zusammenfassungssignalen.",
        "Verbinde zwei Themen mit „einerseits/andererseits“.",
      ],
      reflectionPrompt: "Welche Aufgaben möchtest du wiederholen?",
      discussionPrompt: "Welche Themen fehlen dir noch?",
    },
    weeklyReview: {
      summary: "Review Woche 4: Medien, Politik, Freizeit, Wohnen, Mobilität, Wissenschaft.",
      reflectionQuestions: [
        "Welche Themen liefen stabil?",
        "Welche Grammatik musst du festigen?",
        "Welche Wörter fehlen noch?",
      ],
      practicePrompt: "Schreibe eine Abschlussliste mit 10 Schlüsselsätzen.",
    },
  },
  29: {
    learningObjectives: [
      "Digitalisierung erklären und bewerten.",
      "Folgen mit Ursache-Wirkung-Konnektoren darstellen.",
    ],
    grammarFocus: {
      group: "Woche 4 Konsolidierung",
      items: ["Nominalkomposita", "Ursache-Wirkung (dadurch, sodass)"],
    },
    activities: {
      quiz: [
        "Formuliere einen Satz mit „sodass“.",
        "Nenne zwei digitale Dienste im Kompositum.",
      ],
      discussionPrompt: "Welche digitalen Services sollten verbessert werden?",
    },
  },
  30: {
    title: "Finaler Review + Zusammenfassung",
    topic: "Abschlussreflexion und themenübergreifende Zusammenfassung.",
    learningObjectives: [
      "Abschlusssynthese über mehrere Themen erstellen.",
      "Fortschritte reflektieren und nächste Schritte definieren.",
    ],
    grammarFocus: {
      group: "Finale Synthese",
      items: ["Zusammenfassungssignale", "Kontraststrukturen"],
    },
    activities: {
      quiz: [
        "Schreibe ein Fazit mit „insgesamt“.",
        "Verbinde zwei Themen mit einem Kontrast.",
      ],
      reflectionPrompt: "Welche Fortschritte sind am deutlichsten?",
    },
    weeklyReview: {
      summary: "Finaler Review: Verknüpfe Themen aus dem gesamten C1-Plan.",
      reflectionQuestions: [
        "Welche Themen kannst du spontan erklären?",
        "Welche Aufgaben nutzt du zur Wiederholung?",
        "Welche Strategie nimmst du mit?",
      ],
      practicePrompt: "Erstelle eine 3-Minuten-Abschlussaufnahme mit 3 Themen.",
    },
  },
};

const C1_COMPLEX_SENTENCE_NOTE =
  "Formuliere mindestens einen komplexen Satz mit Einbettung (z. B. obwohl/während/sodass), inkl. korrekter Verbendstellung im Nebensatz und präziser Zeichensetzung.";

const OPINION_ESSAY_TEMPLATE = {
  type: "opinion_essay",
  formatLabel: "Goethe C1 · Diskussionsbeitrag (Meinungsaufsatz)",
  contextPrefix: "Für das Internetforum Karriere & Beruf verfassen Sie einen Diskussionsbeitrag zu diesem Thema:",
  points: [],
};

const OPINION_ESSAY_ROUTES = [
  {
    name: "Konsum und Werbung",
    matches: [/kaufverhalten|werbung|konsum|nachhaltig|ressourcen/i],
    points: [
      "Beschreiben Sie, welche Faktoren Ihr Kaufverhalten am stärksten beeinflussen.",
      "Analysieren Sie anhand eines konkreten Beispiels, wie Werbung Entscheidungen steuert.",
      "Nennen Sie Nachteile von unbewusstem Konsum für Gesellschaft oder Umwelt.",
      "Schlagen Sie Maßnahmen für einen bewussteren und verantwortungsvolleren Konsum vor.",
    ],
  },
  {
    name: "Studium und Ausbildung",
    matches: [/studium|studienfach|ausbildung|weiterbildung|hochschule/i],
    points: [
      "Erklären Sie, nach welchen Kriterien sich die Wahl des Studienfachs oder der Ausbildung richten sollte.",
      "Argumentieren Sie anhand eines konkreten Beispiels für einen Bildungsweg.",
      "Nennen Sie Gründe, die gegen ein Studium sprechen könnten.",
      "Erläutern Sie eine realistische Alternative zum Studium.",
    ],
  },
  {
    name: "Arbeit und Karriere",
    matches: [/arbeit|beruf|karriere|arbeitsmarkt|unternehmen/i],
    points: [
      "Skizzieren Sie, welche Anforderungen der heutige Arbeitsmarkt an Bewerbende stellt.",
      "Begründen Sie Ihre Position mit einem Beispiel aus einem Berufsfeld.",
      "Nennen Sie ein Gegenargument zu Ihrer Position und wägen Sie es ab.",
      "Formulieren Sie eine Empfehlung für Berufseinsteigerinnen und -einsteiger.",
    ],
  },
  {
    name: "Medien und Digitalisierung",
    matches: [/medien|digital|internet|soziale netzwerke|ki|technologie/i],
    points: [
      "Ordnen Sie Chancen und Risiken der digitalen Entwicklung für den Alltag ein.",
      "Belegen Sie Ihre Position mit einem konkreten Medien- oder Technikbeispiel.",
      "Diskutieren Sie ein Gegenargument, das häufig in der öffentlichen Debatte genannt wird.",
      "Entwickeln Sie einen Vorschlag für einen verantwortungsvollen Umgang mit digitalen Angeboten.",
    ],
  },
];

const getOpinionEssayPointsForTopic = (topic) => {
  const normalizedTopic = String(topic || "");
  const matchingRoute = OPINION_ESSAY_ROUTES.find((route) =>
    route.matches.some((pattern) => pattern.test(normalizedTopic))
  );

  if (matchingRoute) return matchingRoute.points;

  return [
    "Ordnen Sie die wichtigsten Aspekte des Themas ein und benennen Sie Ihre Position klar.",
    "Begründen Sie Ihre Position anhand eines konkreten Beispiels aus Alltag, Studium oder Beruf.",
    "Stellen Sie ein mögliches Gegenargument dar und setzen Sie sich damit differenziert auseinander.",
    "Formulieren Sie zum Schluss eine realistische Empfehlung oder einen Lösungsansatz.",
  ];
};

const FORMAL_LETTER_TEMPLATE = {
  type: "formal_letter",
  formatLabel: "Goethe C1 · Formeller Brief (Beschwerde)",
  timeHint: "Vorgeschlagene Arbeitszeit für nicht behinderte Prüfungsteilnehmende: 25 Minuten.",
  contextPrefix:
    "Während Ihres Urlaubs ist Ihre Firma in ein anderes Gebäude umgezogen. Bei Ihrer Rückkehr stellen Sie überrascht fest, dass Sie nicht mehr allein, sondern zusammen mit sechs Kolleginnen und Kollegen in einem Raum sitzen. Schreiben Sie eine Beschwerde an Ihre Vorgesetzte, Frau Grimm.",
  points: [
    "Eröffnen Sie Ihr Schreiben höflich, indem Sie Verständnis für Sachzwänge zeigen.",
    "Nennen Sie Tätigkeiten, die durch den neuen Platz erschwert werden.",
    "Beschreiben Sie Arbeitsbedingungen, die für Sie akzeptabel wären.",
    "Machen Sie einen Kompromissvorschlag.",
  ],
};

const WRITING_HEADER_IMAGES = [
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1400&q=80",
];

const withComplexSentenceFocus = (entry) => {
  if (!entry?.speaking) return entry;
  const notes = Array.isArray(entry.speaking.grammarNotes) ? entry.speaking.grammarNotes : [];
  const hasComplexSentenceFocus = notes.some((note) =>
    /complex sentence|subordinate clause|nebensatz|hauptsatz|einbettung/i.test(String(note))
  );

  if (hasComplexSentenceFocus) return entry;

  return {
    ...entry,
    speaking: {
      ...entry.speaking,
      grammarNotes: [...notes, C1_COMPLEX_SENTENCE_NOTE],
    },
  };
};

const withWeeklyReviewUnifiedTask = (entry) => {
  if (!entry?.weeklyReview) return entry;

  const reviewFocus = `Tag ${entry.day}: ${entry.title}. Thema: ${entry.topic}`;

  return {
    ...entry,
    speaking: {
      ...entry.speaking,
      concept:
        "Erstelle eine klare Wochenreflexion mit einem durchgehenden Schwerpunkt und präziser Einordnung deiner Reiseerfahrungen.",
      prompt: `Sprich 2 Minuten (Goethe-C1-Stil): ${reviewFocus} Verbinde Wochenrückblick und Reiseeinordnung in einer strukturierten Darstellung und leite konkrete Lernprioritäten ab.`,
    },
  };
};

const buildDailyWritingTask = (entry) => {
  if (entry.weeklyReview) {
    return {
      ...entry,
      writing: {
        ...entry.writing,
        type: "opinion_essay",
        formatLabel: "Goethe C1 · Diskussionsbeitrag (Meinungsaufsatz)",
        headerImage: {
          url: WRITING_HEADER_IMAGES[(entry.day - 1) % WRITING_HEADER_IMAGES.length],
          alt: `C1 Schreiben Tag ${entry.day} — Wochenreview`,
        },
        examStyleTask: {
          contextPrefix:
            "Für das Internetforum Karriere & Beruf verfassen Sie einen Diskussionsbeitrag zu diesem Thema:",
          topicLine: `${entry.topic} Welche Position vertreten Sie?`,
          timeHint: "",
          points: [
            "Ordnen Sie eine konkrete Reiseerfahrung ein und begründen Sie deren Bedeutung für Ihre Lernwoche.",
            "Reflektieren Sie die wichtigsten Fortschritte und Schwierigkeiten aus dieser Woche.",
            "Nennen Sie zwei sprachliche Schwerpunkte, die Sie gezielt wiederholen möchten.",
            "Formulieren Sie einen klaren Aktionsplan für die nächste Woche.",
          ],
        },
        prompt: `Schreibe im Goethe-C1-Stil (Goethe C1 · Diskussionsbeitrag (Meinungsaufsatz)) zum einheitlichen Review-Fokus: Tag ${entry.day} – ${entry.title} (${entry.topic}).`,
      },
    };
  }

  const useOpinionEssay = entry.day % 2 === 1;
  const isTag9Konsum = entry.day === 9;
  const isTag10MigrationIntegration = entry.day === 10;
  const template = useOpinionEssay || isTag10MigrationIntegration ? OPINION_ESSAY_TEMPLATE : FORMAL_LETTER_TEMPLATE;
  const imageUrl = WRITING_HEADER_IMAGES[(entry.day - 1) % WRITING_HEADER_IMAGES.length];

  const topicLine = useOpinionEssay || isTag10MigrationIntegration
    ? `${entry.topic} Welche Position vertreten Sie?`
    : `Thema des Tages: ${entry.topic} Beschreiben Sie das Anliegen klar und lösungsorientiert.`;

  const basePoints = useOpinionEssay || isTag10MigrationIntegration ? getOpinionEssayPointsForTopic(entry.topic) : template.points;
  const contextualizedPoints =
    (useOpinionEssay && isTag9Konsum) || isTag10MigrationIntegration
      ? basePoints
      : basePoints.map((point) => `${point} (Bezug zum Thema: ${entry.topic})`);

  const contextPrefix =
    useOpinionEssay && isTag9Konsum
      ? "Für das Internetforum „Gesellschaft & Konsum“ verfassen Sie einen Diskussionsbeitrag zu diesem Thema:"
      : isTag10MigrationIntegration
      ? "Für das Internetforum „Gesellschaft heute“ verfassen Sie einen Diskussionsbeitrag zu diesem Thema:"
      : template.contextPrefix;

  const prompt =
    useOpinionEssay && isTag9Konsum
      ? `Schreibe im Goethe-C1-Stil einen Diskussionsbeitrag zum Tagesthema:

Kaufverhalten, Werbung und bewusster Konsum

Für das Internetforum „Gesellschaft & Konsum“ verfassen Sie einen Diskussionsbeitrag zu diesem Thema:

Kaufverhalten, Werbung und bewusster Konsum – welche Position vertreten Sie?

Gehen Sie dabei auf folgende Punkte ein:

Beschreiben Sie, welche Faktoren Ihr Kaufverhalten am stärksten beeinflussen.
Analysieren Sie anhand eines konkreten Beispiels, wie Werbung Kaufentscheidungen steuert.
Nennen Sie Nachteile von unbewusstem Konsum für Gesellschaft oder Umwelt.
Schlagen Sie Maßnahmen für einen bewussteren und verantwortungsvolleren Konsum vor.`
      : isTag10MigrationIntegration
      ? `Schreibe im Goethe-C1-Stil einen Diskussionsbeitrag zum Tagesthema:

Migration und Integration

Für das Internetforum „Gesellschaft heute“ verfassen Sie einen Diskussionsbeitrag zu diesem Thema:

Ankommen, Teilhabe und gesellschaftlicher Zusammenhalt. Welche Position vertreten Sie?

Gehen Sie dabei auf folgende Punkte ein:

Ordnen Sie die wichtigsten Aspekte des Themas ein und benennen Sie Ihre Position klar.
Begründen Sie Ihre Position anhand eines konkreten Beispiels aus Alltag, Studium oder Beruf.
Stellen Sie ein mögliches Gegenargument dar und setzen Sie sich damit differenziert auseinander.
Formulieren Sie zum Schluss eine realistische Empfehlung oder einen Lösungsansatz.`
      : `Schreibe im Goethe-C1-Stil (${template.formatLabel}) zum Tagesthema: ${entry.topic}`;

  return {
    ...entry,
    writing: {
      ...entry.writing,
      type: template.type,
      formatLabel: template.formatLabel,
      headerImage: {
        url: imageUrl,
        alt: `C1 Schreiben Tag ${entry.day} — ${template.formatLabel}`,
      },
      examStyleTask: {
        contextPrefix,
        topicLine,
        timeHint: template.timeHint || "",
        points: contextualizedPoints,
      },
      prompt,
    },
  };
};

export const C1_SELF_LEARNING_PLAN = BASE_C1_SELF_LEARNING_PLAN.map((entry) =>
  buildDailyWritingTask(
    withWeeklyReviewUnifiedTask(
      withComplexSentenceFocus({
        ...entry,
        ...(C1_PLAN_ENHANCEMENTS[entry.day] || {}),
      })
    )
  )
);
