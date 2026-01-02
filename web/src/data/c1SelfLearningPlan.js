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

export const C1_SELF_LEARNING_PLAN = [
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
