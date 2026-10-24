const LANGUAGE_DEFAULTS = {
  en: {
    fallback: (title) => ({
      note: `Focus on how ${title.toLowerCase()} helps you make exam answers clearer and more precise.`,
      exampleLabel: "Try:",
      example: "Build one short sentence, then expand it with a reason, contrast, or example.",
    }),
  },
  de: {
    fallback: (title) => ({
      note: `Achte darauf, wie ${title.toLowerCase()} deine Prüfungsantworten klarer und präziser macht.`,
      exampleLabel: "Probe:",
      example: "Formuliere zuerst einen kurzen Satz und erweitere ihn dann mit Begründung, Kontrast oder Beispiel.",
    }),
  },
};

const EN_PATTERNS = [
  {
    test: /sequencing|strukturgeber/i,
    note: "Use these words to guide the listener through a clear beginning, middle, and end.",
    example: "Zuerst beschreibe ich die Situation, danach nenne ich ein Beispiel und schließlich ziehe ich ein Fazit.",
  },
  {
    test: /reason and purpose|begründungen und zweck|purpose clauses|zweckangaben|damit|um \.\.\. zu|zu-infinitiv/i,
    note: "Show why you do something and what goal you want to achieve; this makes your argument sound intentional.",
    example: "Ich lerne jeden Tag, damit ich in der Prüfung sicher argumentieren kann.",
  },
  {
    test: /relative clauses|relativsätze|relative pronouns|relativpronomen/i,
    note: "Add extra detail to a noun without starting a completely new sentence.",
    example: "Das Buch, das wir im Kurs gelesen haben, erklärt das Thema sehr klar.",
  },
  {
    test: /comparison phrases|vergleichsformen|comparatives|superlatives|je \.\.\. desto|sowohl \.\.\. als auch/i,
    note: "Compare ideas precisely so your speaking and writing sound more analytical.",
    example: "Im Vergleich zu Onlinekursen ist Präsenzunterricht oft direkter, aber nicht immer flexibler.",
  },
  {
    test: /indirect questions|indirekte fragen/i,
    note: "Use indirect questions to sound more natural, polite, and academically structured.",
    example: "Ich frage mich, ob soziale Medien wirklich zu besserer Information führen.",
  },
  {
    test: /indirect speech|indirekte rede/i,
    note: "Report what other people said without quoting them directly; this is especially useful for summaries and source-based tasks.",
    example: "Die Autorin erklärt, dass viele junge Menschen Nachrichten online lesen.",
  },
  {
    test: /passive/i,
    note: "Use the passive when the action matters more than the person doing it.",
    example: "Im Unterricht wird heute über nachhaltige Mobilität diskutiert.",
  },
  {
    test: /konjunktiv ii|wishes|proposals|critique/i,
    note: "Use Konjunktiv II to sound diplomatic when giving suggestions, criticism, or hypothetical ideas.",
    example: "Man könnte dieses Problem lösen, wenn mehr Geld investiert würde.",
  },
  {
    test: /modal verbs|modalverben/i,
    note: "Modal verbs help you express advice, obligation, possibility, and polite recommendations.",
    example: "Die Stadt sollte mehr Radwege bauen, damit Pendler sicherer fahren können.",
  },
  {
    test: /future tense|futur/i,
    note: "Use future forms for predictions, plans, and consequences that may happen later.",
    example: "In Zukunft werden viele Berufe digitaler und flexibler sein.",
  },
  {
    test: /causal|kausal|reason|weil\/da|deshalb|daher|dadurch|sodass|folge/i,
    note: "Link cause and effect clearly so your reasoning sounds logical and easy to follow.",
    example: "Viele Menschen arbeiten im Homeoffice, deshalb verändert sich der Alltag in den Städten.",
  },
  {
    test: /contrast|kontrast|obwohl\/trotzdem|während\/hingegen|balanced contrasts|einerseits\/andererseits/i,
    note: "Show two sides of an argument and signal clearly when you are changing direction.",
    example: "Einerseits spart Technologie Zeit, andererseits kann sie auch Stress verursachen.",
  },
  {
    test: /conjunctive adverbs|konjunktivadverbien/i,
    note: "These linking words connect whole ideas and make your paragraphs sound more advanced.",
    example: "Der Plan ist teuer; dennoch könnte er langfristig sinnvoll sein.",
  },
  {
    test: /genitive|genitiv/i,
    note: "Use the genitive to express formal relationships, possession, and more academic noun phrases.",
    example: "Die Folgen des digitalen Wandels sind im Alltag deutlich spürbar.",
  },
  {
    test: /temporal|häufigkeitsangaben|frequency expressions|während\/als|wenn\/falls/i,
    note: "Place events on a timeline and show how often something happens so your answer feels better organised.",
    example: "Wenn ich morgens lerne, kann ich mich besser konzentrieren als am Abend.",
  },
  {
    test: /conditional|bedingungssätze|conditionals/i,
    note: "Use conditional forms to explain when something is possible, useful, or necessary.",
    example: "Falls die Preise weiter steigen, werden mehr Menschen öffentliche Verkehrsmittel nutzen.",
  },
  {
    test: /nominalizations|nominalisierungen/i,
    note: "Turn verbs or adjectives into nouns to create a more formal, academic register.",
    example: "Die Weiterbildung spielt für die berufliche Entwicklung eine wichtige Rolle.",
  },
  {
    test: /nominal compounds|nominalkomposita/i,
    note: "German compound nouns help you express complex ideas efficiently in one precise term.",
    example: "Medienkompetenz und Zeitmanagement sind im Berufsalltag zentral.",
  },
  {
    test: /reflexive verbs|reflexive verben/i,
    note: "Reflexive verbs are common in everyday and abstract topics, so practise the reflexive pronoun with the correct case.",
    example: "Ich interessiere mich besonders für nachhaltige Stadtentwicklung.",
  },
  {
    test: /two-way prepositions|wechselpräpositionen/i,
    note: "Choose accusative for direction and dative for location so spatial descriptions stay accurate.",
    example: "Ich gehe in die Bibliothek, aber ich lerne in der Bibliothek.",
  },
  {
    test: /imperative/i,
    note: "Imperatives are useful for advice, instructions, and recommendations in speaking tasks.",
    example: "Planen Sie genug Zeit ein und überprüfen Sie am Ende Ihre Argumente.",
  },
  {
    test: /summary|zusammenfassung|connector recap|review|wiederholen|recap|mini review/i,
    note: "Use this as a consolidation point: review the form, then produce one clean model sentence from memory.",
    example: "Zusammenfassend lässt sich sagen, dass klare Strukturen die Antwort deutlich verbessern.",
  },
  {
    test: /formal opinion phrases|formelle meinungsformeln/i,
    note: "These phrases help you present opinions in a balanced, formal way instead of sounding too direct.",
    example: "Meines Erachtens sollte die Schule digitale Medien gezielter einsetzen.",
  },
];

const DE_PATTERNS = [
  {
    test: /sequencing|strukturgeber/i,
    note: "Nutze diese Wörter, um Einleitung, Hauptteil und Schluss klar zu ordnen.",
    example: "Zuerst beschreibe ich die Situation, danach nenne ich ein Beispiel und schließlich ziehe ich ein Fazit.",
  },
  {
    test: /reason and purpose|begründungen und zweck|purpose clauses|zweckangaben|damit|um \.\.\. zu|zu-infinitiv/i,
    note: "Damit zeigst du Grund und Ziel deiner Aussage; so wirkt deine Argumentation bewusster und präziser.",
    example: "Ich lerne jeden Tag, damit ich in der Prüfung sicher argumentieren kann.",
  },
  {
    test: /relative clauses|relativsätze|relative pronouns|relativpronomen/i,
    note: "Relativsätze ergänzen ein Nomen genauer, ohne dass du einen ganz neuen Satz anfangen musst.",
    example: "Das Buch, das wir im Kurs gelesen haben, erklärt das Thema sehr klar.",
  },
  {
    test: /comparison phrases|vergleichsformen|comparatives|superlatives|je \.\.\. desto|sowohl \.\.\. als auch/i,
    note: "Vergleiche helfen dir, Unterschiede und Gemeinsamkeiten präzise und analytisch zu formulieren.",
    example: "Im Vergleich zu Onlinekursen ist Präsenzunterricht oft direkter, aber nicht immer flexibler.",
  },
  {
    test: /indirect questions|indirekte fragen/i,
    note: "Indirekte Fragen klingen höflicher, natürlicher und strukturierter.",
    example: "Ich frage mich, ob soziale Medien wirklich zu besserer Information führen.",
  },
  {
    test: /indirect speech|indirekte rede/i,
    note: "Damit gibst du Aussagen anderer wieder, ohne direkt zu zitieren; das ist wichtig für Zusammenfassungen und Quellenarbeit.",
    example: "Die Autorin erklärt, dass viele junge Menschen Nachrichten online lesen.",
  },
  {
    test: /passiv/i,
    note: "Nutze das Passiv, wenn die Handlung wichtiger ist als die handelnde Person.",
    example: "Im Unterricht wird heute über nachhaltige Mobilität diskutiert.",
  },
  {
    test: /konjunktiv ii|wishes|proposals|critique/i,
    note: "Mit Konjunktiv II formulierst du Vorschläge, Kritik oder hypothetische Ideen diplomatischer.",
    example: "Man könnte dieses Problem lösen, wenn mehr Geld investiert würde.",
  },
  {
    test: /modal verbs|modalverben/i,
    note: "Modalverben zeigen Empfehlung, Pflicht, Möglichkeit oder Vorsicht sehr klar.",
    example: "Die Stadt sollte mehr Radwege bauen, damit Pendler sicherer fahren können.",
  },
  {
    test: /future tense|futur|futurformen/i,
    note: "Futurformen helfen dir bei Prognosen, Plänen und erwarteten Folgen.",
    example: "In Zukunft werden viele Berufe digitaler und flexibler sein.",
  },
  {
    test: /causal|kausal|reason|weil\/da|deshalb|daher|dadurch|sodass|folge/i,
    note: "So verbindest du Ursache und Folge logisch und gut nachvollziehbar.",
    example: "Viele Menschen arbeiten im Homeoffice, deshalb verändert sich der Alltag in den Städten.",
  },
  {
    test: /contrast|kontrast|obwohl\/trotzdem|während\/hingegen|balanced contrasts|einerseits\/andererseits/i,
    note: "Kontrastformen zeigen zwei Seiten eines Arguments und machen deine Position ausgewogener.",
    example: "Einerseits spart Technologie Zeit, andererseits kann sie auch Stress verursachen.",
  },
  {
    test: /conjunctive adverbs|konjunktivadverbien/i,
    note: "Diese Verbindungswörter verknüpfen ganze Aussagen und lassen Absätze fortgeschrittener wirken.",
    example: "Der Plan ist teuer; dennoch könnte er langfristig sinnvoll sein.",
  },
  {
    test: /genitive|genitiv/i,
    note: "Der Genitiv wirkt formell und hilft bei präzisen Beziehungen zwischen Nomen.",
    example: "Die Folgen des digitalen Wandels sind im Alltag deutlich spürbar.",
  },
  {
    test: /temporal|häufigkeitsangaben|frequency expressions|während\/als|wenn\/falls/i,
    note: "Damit ordnest du Ereignisse zeitlich und zeigst, wann oder wie oft etwas passiert.",
    example: "Wenn ich morgens lerne, kann ich mich besser konzentrieren als am Abend.",
  },
  {
    test: /conditional|bedingungssätze|conditionals/i,
    note: "Bedingungssätze zeigen, unter welcher Voraussetzung etwas möglich oder sinnvoll ist.",
    example: "Falls die Preise weiter steigen, werden mehr Menschen öffentliche Verkehrsmittel nutzen.",
  },
  {
    test: /nominalizations|nominalisierungen/i,
    note: "Nominalisierungen machen deinen Stil sachlicher und akademischer.",
    example: "Die Weiterbildung spielt für die berufliche Entwicklung eine wichtige Rolle.",
  },
  {
    test: /nominal compounds|nominalkomposita/i,
    note: "Komposita bündeln komplexe Inhalte in einem präzisen Begriff.",
    example: "Medienkompetenz und Zeitmanagement sind im Berufsalltag zentral.",
  },
  {
    test: /reflexive verbs|reflexive verben/i,
    note: "Achte auf das richtige Reflexivpronomen und den passenden Kasus.",
    example: "Ich interessiere mich besonders für nachhaltige Stadtentwicklung.",
  },
  {
    test: /two-way prepositions|wechselpräpositionen/i,
    note: "Wähle Akkusativ bei Richtung und Dativ bei Ort, damit Beschreibungen korrekt bleiben.",
    example: "Ich gehe in die Bibliothek, aber ich lerne in der Bibliothek.",
  },
  {
    test: /imperativ/i,
    note: "Der Imperativ ist nützlich für Ratschläge, Anweisungen und Empfehlungen.",
    example: "Planen Sie genug Zeit ein und überprüfen Sie am Ende Ihre Argumente.",
  },
  {
    test: /summary|zusammenfassung|connector recap|review|wiederholen|recap|mini review/i,
    note: "Nutze diesen Punkt zur Wiederholung: Form prüfen und dann einen sauberen Modellsatz aus dem Kopf bilden.",
    example: "Zusammenfassend lässt sich sagen, dass klare Strukturen die Antwort deutlich verbessern.",
  },
  {
    test: /formal opinion phrases|formelle meinungsformeln/i,
    note: "Diese Formeln helfen dir, Meinungen sachlich und formell statt zu direkt auszudrücken.",
    example: "Meines Erachtens sollte die Schule digitale Medien gezielter einsetzen.",
  },
];

const resolveDescriptor = (title, locale) => {
  const normalizedLocale = locale === "de" ? "de" : "en";
  const patterns = normalizedLocale === "de" ? DE_PATTERNS : EN_PATTERNS;
  const matched = patterns.find((entry) => entry.test.test(title));
  if (matched) {
    return {
      note: matched.note,
      exampleLabel: normalizedLocale === "de" ? "Beispiel:" : "Example:",
      example: matched.example,
    };
  }
  return LANGUAGE_DEFAULTS[normalizedLocale].fallback(title);
};

export const describeGrammarFocusItem = (item, locale = "en") => {
  if (typeof item === "object" && item !== null) {
    const title = String(item.title || item.label || "Grammar point");
    const base = resolveDescriptor(title, locale);
    return {
      title,
      note: item.note || base.note,
      exampleLabel: item.exampleLabel || base.exampleLabel,
      example: item.example || base.example,
    };
  }

  const title = String(item || "Grammar point");
  return {
    title,
    ...resolveDescriptor(title, locale),
  };
};
