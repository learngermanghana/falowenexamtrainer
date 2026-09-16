import { B2_LESSON_CONTENT_ALIGNMENT } from "./b2LessonContentAlignment";

const B2_GRAMMAR_MODELS = Object.freeze({
  1: [
    "Haushalte können Abfall reduzieren, indem sie Produkte mit wenig Verpackung kaufen.",
    "Viele Städte fördern Mehrwegsysteme, damit weniger Einwegmüll entsteht.",
    "Immer mehr Menschen trennen ihren Müll konsequent, wodurch mehr Wertstoffe recycelt werden können.",
  ],
  2: [
    "Verpackungen werden gesammelt, sortiert und anschließend recycelt.",
    "Die Wiederverwendung von Rohstoffen reduziert den Bedarf an neuen Ressourcen.",
    "Produkte, die leicht repariert werden können, bleiben länger im Wirtschaftskreislauf.",
  ],
  3: [
    "Je genauer Haushalte ihre Einkäufe planen, desto weniger Lebensmittel werden weggeworfen.",
    "Obwohl viele Produkte noch essbar sind, landen sie wegen kleiner Mängel im Müll.",
    "Man kann Verschwendung vermeiden, indem man nur die Mengen kauft, die man wirklich benötigt.",
  ],
  4: [
    "Man kann einkaufen, ohne jedes Produkt in eine Plastiktüte zu packen.",
    "Mehrwegverpackungen sparen nicht nur Müll, sondern auch langfristig Rohstoffe.",
    "Verbraucher können Verpackungsmüll reduzieren, indem sie Nachfüllsysteme nutzen.",
  ],
  5: [
    "Während das Auto flexibel ist, verursacht der öffentliche Verkehr pro Person oft weniger Emissionen.",
    "Je zuverlässiger Busse und Bahnen fahren, desto eher verzichten Menschen auf das eigene Auto.",
    "Städte können den Verkehr entlasten, indem sie Busspuren und sichere Radwege ausbauen.",
  ],
  6: [
    "Erneuerbare Energien müssen schneller ausgebaut werden, damit fossile Brennstoffe ersetzt werden können.",
    "Die Verringerung des Stromverbrauchs entlastet sowohl Haushalte als auch die Umwelt.",
    "Obwohl Solaranlagen zunächst teuer sein können, sinken die Energiekosten langfristig.",
  ],
  7: [
    "Wohnhäuser, in denen Energie effizient genutzt wird, verursachen geringere Betriebskosten.",
    "Städte könnten mehr Grünflächen schaffen, damit sich dicht bebaute Viertel im Sommer weniger aufheizen.",
    "Obwohl nachhaltige Sanierungen teuer sind, können sie langfristig Energie und Kosten sparen.",
  ],
  8: [
    "Stipendien werden angeboten, damit auch einkommensschwächere Studierende Zugang zu Bildung erhalten.",
    "Bildungschancen lassen sich verbessern, indem Schulen gezielte Förderprogramme anbieten.",
    "Die Förderung benachteiligter Lernender ist eine zentrale Voraussetzung für mehr Chancengleichheit.",
  ],
  9: [
    "Schülerinnen und Schüler sollten individuell unterstützt werden, wenn sie Lernschwierigkeiten haben.",
    "Sofern Schulen genügend Personal erhalten, können sie stärker auf unterschiedliche Bedürfnisse eingehen.",
    "Obwohl Leistungsbewertungen notwendig sind, dürfen sie nicht der einzige Maßstab für Lernerfolg sein.",
  ],
  10: [
    "Kindergärten, in denen Kinder spielerisch gefördert werden, unterstützen ihre sprachliche und soziale Entwicklung.",
    "Kommunen bauen Betreuungsplätze aus, damit Eltern Familie und Beruf besser vereinbaren können.",
    "Je früher Kinder gezielt gefördert werden, desto leichter können spätere Lernprobleme erkannt werden.",
  ],
  11: [
    "Während digitale Plattformen flexibles Lernen ermöglichen, bietet Präsenzunterricht direkten sozialen Austausch.",
    "Digitale Medien unterstützen den Unterricht, indem sie Übungen individuell anpassen.",
    "Schulen könnten Technik wirksamer einsetzen, wenn Lehrkräfte ausreichend geschult würden.",
  ],
  12: [
    "Studiengebühren können zwar zusätzliche Mittel schaffen, sie erschweren jedoch manchen Menschen den Zugang zur Hochschule.",
    "Je stärker Weiterbildung gefördert wird, desto besser können Beschäftigte auf technologische Veränderungen reagieren.",
    "Eine stärkere öffentliche Finanzierung könnte den Zugang zu Hochschulen verbessern.",
  ],
  13: [
    "Neue Medikamente werden vor ihrer Zulassung in mehreren Studien untersucht.",
    "Die Auswertung großer Datenmengen ermöglicht genauere wissenschaftliche Erkenntnisse.",
    "Laut aktuellen Forschungsergebnissen beeinflusst regelmäßige Bewegung zahlreiche Gesundheitsfaktoren.",
  ],
  14: [
    "Forschende weisen darauf hin, dass Ergebnisse überprüft werden müssen, bevor weitreichende Schlüsse gezogen werden.",
    "Informationen werden in sozialen Medien häufig geteilt, ohne dass ihre Quelle kontrolliert wird.",
    "Eine Aussage kann zwar überzeugend klingen, sie ist jedoch nicht automatisch wissenschaftlich belegt.",
  ],
  15: [
    "Menschen, für die die Miete einen großen Teil des Einkommens ausmacht, sind besonders vom Wohnraummangel betroffen.",
    "Städte könnten mehr bezahlbaren Wohnraum fördern, anstatt ausschließlich teure Neubauten zu genehmigen.",
    "Trotz steigender Baukosten bleibt die Nachfrage nach günstigen Wohnungen hoch.",
  ],
  16: [
    "Während Großstädte viele Arbeitsplätze bieten, ist Wohnraum dort häufig besonders teuer.",
    "Je besser ländliche Regionen an den öffentlichen Verkehr angebunden sind, desto attraktiver werden sie für Familien.",
    "Obwohl das Leben auf dem Land ruhiger sein kann, fehlen dort manchmal wichtige Dienstleistungen.",
  ],
  17: [
    "Unternehmen können flexible Arbeitszeiten anbieten, damit Eltern Beruf und Familie besser vereinbaren können.",
    "Während manche Familien Betreuung innerhalb der Familie organisieren, sind andere auf Kitas angewiesen.",
    "Eltern sollten berufstätig sein können, ohne dauerhaft auf verlässliche Betreuung verzichten zu müssen.",
  ],
  18: [
    "Je stärker Unternehmen in Weiterbildung investieren, desto besser können sie auf Fachkräftemangel reagieren.",
    "Beschäftigte werden weiterqualifiziert, damit neue technische Aufgaben übernommen werden können.",
    "Die Anerkennung ausländischer Qualifikationen kann zur Verringerung des Fachkräftemangels beitragen.",
  ],
  19: [
    "Beschäftigte sollten klare Grenzen setzen, um nach Feierabend wirklich abschalten zu können.",
    "Obwohl Homeoffice mehr Flexibilität bietet, kann ständige Erreichbarkeit die Erholung erschweren.",
    "Je klarer Arbeitszeiten geregelt sind, desto leichter lässt sich eine gesunde Work-Life-Balance aufrechterhalten.",
  ],
  20: [
    "Plattformen, auf denen persönliche Daten veröffentlicht werden, beeinflussen zunehmend das öffentliche Selbstbild.",
    "Während manche Nutzer fast alles teilen, schützen andere ihre Privatsphäre sehr bewusst.",
    "Beiträge können dauerhaft gespeichert werden, wodurch unbedachte Veröffentlichungen langfristige Folgen haben können.",
  ],
  21: [
    "KI-Systeme werden zunehmend für Recherche, Übersetzung und individuelles Lernen eingesetzt.",
    "Studierende können KI sinnvoll nutzen, indem sie Ergebnisse kritisch prüfen und Quellen vergleichen.",
    "Universitäten könnten klare Regeln festlegen, sofern gleichzeitig transparent erklärt wird, welche Nutzung erlaubt ist.",
  ],
  22: [
    "Routineaufgaben werden zunehmend automatisiert, während komplexe Entscheidungen weiterhin menschliches Urteil erfordern.",
    "Je stärker Unternehmen KI einsetzen, desto wichtiger werden Weiterbildung und neue digitale Kompetenzen.",
    "Sofern Beschäftigte rechtzeitig qualifiziert werden, kann technischer Wandel neue Chancen schaffen.",
  ],
  23: [
    "Persönliche Daten werden ausgewertet, um Werbung möglichst genau an Nutzer anzupassen.",
    "Algorithmen, über deren Funktionsweise Nutzer wenig wissen, beeinflussen häufig die angezeigten Inhalte.",
    "Personalisierte Werbung kann relevant sein, wodurch sie jedoch zugleich stärkere Datenschutzfragen aufwirft.",
  ],
  24: [
    "Gesundheitsdaten müssen besonders sorgfältig geschützt werden.",
    "Telemedizin kann Versorgung verbessern, indem Patientinnen und Patienten schneller ärztlichen Rat erhalten.",
    "Sofern digitale Systeme verantwortungsvoll eingesetzt werden, können sie Arbeitsbelastung verringern und Abläufe effizienter machen.",
  ],
  25: [
    "Während Massentourismus vielen Regionen Einkommen bringt, kann er Natur und Infrastruktur stark belasten.",
    "Reisende können lokale Wirtschaft unterstützen, indem sie regionale Angebote nutzen.",
    "Obwohl nachhaltiges Reisen manchmal teurer ist, entscheiden sich immer mehr Menschen bewusst dafür.",
  ],
  26: [
    "Obwohl Integration Zeit benötigt, kann frühe Sprachförderung den Einstieg in Bildung und Arbeit erleichtern.",
    "Während manche Zugewanderte schnell Beschäftigung finden, kämpfen andere mit der Anerkennung ihrer Abschlüsse.",
    "Beratungsstellen, an die sich neu Zugewanderte wenden können, unterstützen bei vielen praktischen Fragen.",
  ],
  27: [
    "Gleichstellung verbessert nicht nur individuelle Chancen, sondern kann auch den gesellschaftlichen Zusammenhalt stärken.",
    "Obwohl rechtliche Regeln wichtig sind, verschwinden Vorurteile nicht automatisch.",
    "Institutionen können Diskriminierung reduzieren, indem sie transparente Verfahren und wirksame Beschwerdewege schaffen.",
  ],
  28: [
    "Obwohl technischer Fortschritt viele Chancen bietet, müssen soziale und ökologische Folgen berücksichtigt werden.",
    "Eine tragfähige Lösung entsteht, indem unterschiedliche Interessen verglichen und konkrete Maßnahmen begründet werden.",
    "Zusammenfassend bin ich der Auffassung, dass Bildung, Nachhaltigkeit und verantwortungsvoller Technologieeinsatz eng miteinander verbunden sind.",
  ],
});

const STOP_WORDS = new Set(["und", "oder", "mit", "ohne", "von", "für", "der", "die", "das", "den", "dem", "des", "ein", "eine", "einer", "einen", "im", "in", "am", "an", "zu", "zur", "zum", "bei", "sowie", "durch"]);

const topicKeywords = (alignment) =>
  [...new Set(String(alignment?.lessonTopic || alignment?.title || "")
    .replace(/[–—,.:;!?()]/g, " ")
    .split(/\s+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 4 && !STOP_WORDS.has(item.toLowerCase())))]
    .slice(0, 6);

const grammarRulesFor = (focus = "") => {
  const lower = String(focus).toLowerCase();
  const rules = [];
  const add = (rule) => { if (!rules.includes(rule)) rules.push(rule); };

  if (lower.includes("indem") || lower.includes("dadurch")) add("Mit indem / dadurch, dass erklärst du eine Methode. Im Nebensatz steht das konjugierte Verb am Ende.");
  if (lower.includes("um ... zu") || lower.includes("damit")) add("um ... zu nutzt du meist bei gleichem Subjekt; damit erlaubt ein eigenes Subjekt. Im damit-Satz steht das Verb am Ende.");
  if (lower.includes("wodurch") || lower.includes("sodass")) add("wodurch und sodass zeigen eine Folge. Achte im Nebensatz auf die Verbendstellung.");
  if (lower.includes("passiv")) add("Passiv: werden + Partizip II. Modalpassiv: Modalverb + Partizip II + werden am Satzende.");
  if (lower.includes("nominalisierung")) add("Bei der Nominalisierung wird ein Vorgang als Nomen formuliert: fördern → die Förderung, auswerten → die Auswertung.");
  if (lower.includes("relativ")) add("Im Relativsatz richtet sich der Kasus des Relativpronomens nach seiner Funktion oder Präposition; das konjugierte Verb steht am Ende.");
  if (lower.includes("je ... desto")) add("je ... desto verbindet zwei Entwicklungen: Je + Komparativ + Nebensatz, desto + Komparativ + Hauptsatz.");
  if (lower.includes("obwohl") || lower.includes("obgleich")) add("obwohl / obgleich räumt einen Gegensatz ein; das konjugierte Verb steht im Nebensatz am Ende.");
  if (lower.includes("trotz")) add("trotz steht vor einem Nomen und drückt Einräumung aus; obwohl verbindet dagegen einen ganzen Nebensatz.");
  if (lower.includes("ohne ... zu") || lower.includes("statt ... zu") || lower.includes("anstatt")) add("ohne ... zu / (an)statt ... zu verbinden Handlungen mit demselben Subjekt; der Infinitiv mit zu steht am Ende.");
  if (lower.includes("nicht nur") || lower.includes("sowohl")) add("Zweiteilige Konnektoren verbinden parallele Informationen: nicht nur ... sondern auch / sowohl ... als auch.");
  if (lower.includes("während") || lower.includes("wohingegen")) add("während / wohingegen eignen sich für direkte Gegenüberstellungen; im Nebensatz steht das Verb am Ende.");
  if (lower.includes("konjunktiv ii")) add("Konjunktiv II mit könnte, würde, wäre und sollte macht Vorschläge, Möglichkeiten und hypothetische Aussagen differenzierter.");
  if (lower.includes("falls") || lower.includes("sofern")) add("falls / sofern formulieren Bedingungen; das konjugierte Verb steht im Nebensatz am Ende.");
  if (lower.includes("zwar")) add("zwar ... jedoch verbindet Einräumung und Gegenargument und eignet sich besonders für ausgewogene B2-Argumente.");
  if (lower.includes("laut") || lower.includes("zufolge") || lower.includes("angaben")) add("Kennzeichne fremde Informationen klar mit laut ..., ... zufolge oder nach Angaben von ... .");
  if (lower.includes("indirekte rede")) add("Trenne fremde Aussagen von deiner eigenen Position, z. B. mit dass-Sätzen, Quellenangaben oder – wenn passend – Konjunktiv I.");
  if (lower.includes("aufgrund")) add("aufgrund nennt eine Ursache, trotz eine Einräumung; beide stehen in formeller Sprache häufig mit Genitiv.");
  if (lower.includes("review") || lower.includes("verknüpfungen")) add("Wähle die Struktur nach Funktion: Ursache, Folge, Gegensatz, Einräumung, Ziel, Methode oder Bedingung – nicht nach Schwierigkeit.");

  return rules.length ? rules : ["Nutze die angegebene B2-Struktur gezielt und kontrolliere besonders Verbposition, Kasus und Satzverknüpfung."];
};

const buildKnowledgeTest = (alignment, models, rules) => {
  const focus = alignment.grammar_topic;
  return [
    {
      question: `Welche Grammatik steht bei „${alignment.title}“ im Mittelpunkt?`,
      options: [focus, "Nur Präsens ohne Satzverknüpfung", "Nur Wortschatz ohne Grammatik", "Ausschließlich Imperativ"],
      answer: focus,
      explanation: "Diese Strukturen sind der verbindliche Grammatikfokus dieser B2-Lektion.",
    },
    {
      question: "Welcher Satz ist ein passendes Modell für die heutige Grammatik?",
      options: [models[0], "Ich finde das Thema gut. Das ist alles.", "Das Thema wichtig ist und ich Meinung.", "Weil das Thema ist aktuell, ich finde gut."],
      answer: models[0],
      explanation: "Der Modellsatz verbindet das Tagesthema mit einer korrekten B2-Struktur.",
    },
    {
      question: "Was macht eine starke B2-Antwort aus?",
      options: ["Position + Begründung + konkretes Beispiel + passende Verknüpfung", "Viele schwierige Wörter ohne Zusammenhang", "Nur Ja oder Nein", "Nur eine Definition des Themas"],
      answer: "Position + Begründung + konkretes Beispiel + passende Verknüpfung",
      explanation: "B2 verlangt entwickelte, logisch verbundene Aussagen statt isolierter Sätze.",
    },
    {
      question: "Welche Kontrollstrategie ist sinnvoll?",
      options: [rules[0], "Jeden Satz möglichst lang machen", "Konnektoren zufällig wechseln", "Verbposition nicht prüfen"],
      answer: rules[0],
      explanation: "Die Grammatik soll eine kommunikative Funktion erfüllen und zugleich formal korrekt sein.",
    },
  ];
};

const buildSpeaking = (alignment, models) => {
  const title = alignment.title;
  const keywords = topicKeywords(alignment);
  const shared = keywords.length ? keywords : ["Situation", "Folgen", "Maßnahmen", "Verantwortung"];
  const question = `Welche Chancen, Probleme und Lösungen gibt es beim Thema „${title}“? Begründe deine Position mit konkreten Beispielen.`;
  const branches = [
    {
      id: "bedeutung",
      title: "Bedeutung und Ausgangslage",
      prompt: `Warum ist „${title}“ heute relevant?`,
      keywords: [...shared.slice(0, 4), "Relevanz"],
      example: models[0],
      starter: "Bei der Beurteilung dieses Themas sollte man berücksichtigen, dass ...",
    },
    {
      id: "ursachen",
      title: "Ursachen und Bedingungen",
      prompt: `Welche Ursachen oder Rahmenbedingungen prägen „${title}“?`,
      keywords: ["Ursachen", "Rahmenbedingungen", ...shared.slice(0, 3)],
      example: `Ein wichtiger Einflussfaktor besteht darin, dass sich die Rahmenbedingungen je nach Alltag, Einkommen, Infrastruktur und Zugang unterscheiden.`,
      starter: "Ein wesentlicher Grund dafür ist, dass ...",
    },
    {
      id: "chancen-probleme",
      title: "Chancen und Probleme",
      prompt: `Welche Vorteile entstehen, und welche Schwierigkeiten müssen berücksichtigt werden?`,
      keywords: ["Vorteile", "Nachteile", "Folgen", ...shared.slice(1, 3)],
      example: models[1],
      starter: "Einerseits ... , andererseits ...",
    },
    {
      id: "vergleich",
      title: "Perspektiven vergleichen",
      prompt: `Wie unterscheiden sich verschiedene Gruppen, Regionen oder Länder bei „${title}“?`,
      keywords: ["Deutschland", "Heimatland", "Unterschiede", "Perspektiven", "Vergleich"],
      example: "Die konkrete Situation hängt von Infrastruktur, finanziellen Möglichkeiten und gesellschaftlichen Rahmenbedingungen ab; deshalb sollte man einzelne Maßnahmen statt ganzer Länder pauschal vergleichen.",
      starter: "Während ... , zeigt sich im Vergleich dazu ...",
    },
    {
      id: "loesung",
      title: "Maßnahmen und Lösungen",
      prompt: `Welche konkrete Maßnahme wäre bei „${title}“ realistisch und warum?`,
      keywords: ["Maßnahme", "Umsetzung", "Verantwortung", "Zugang", ...shared.slice(0, 2)],
      example: models[2],
      starter: "Eine realistische Maßnahme wäre, ... , weil ...",
    },
    {
      id: "position",
      title: "Eigene Position",
      prompt: `Welche Position vertrittst du persönlich zu „${title}“?`,
      keywords: ["Meinung", "Begründung", "Beispiel", "Gegenargument", "Fazit"],
      example: `Zusammenfassend bin ich der Auffassung, dass bei „${title}“ konkrete Wirkung, Umsetzbarkeit und mögliche Nebenfolgen gemeinsam betrachtet werden sollten.`,
      starter: "Zusammenfassend bin ich der Auffassung, dass ...",
    },
  ];

  return {
    question,
    branches,
    plan: [
      "Position: Nenne deine Grundposition in einem klaren Satz.",
      "Begründung: Erkläre mindestens zwei Gründe.",
      "Beispiel: Gib ein konkretes Beispiel aus Alltag, Bildung, Beruf oder Gesellschaft.",
      "Abwägung: Nenne einen Gegenpunkt oder vergleiche zwei Perspektiven.",
      "Lösung: Schlage eine realistische Maßnahme vor.",
      "Fazit: Fasse deine Position präzise zusammen.",
    ],
    starters: [
      "Bei der Beurteilung dieses Themas sollte man berücksichtigen, dass ...",
      "Einerseits ... , andererseits ...",
      "Ein konkretes Beispiel dafür ist ...",
      "Im Vergleich dazu ...",
      "Eine realistische Maßnahme wäre, ...",
      "Zusammenfassend bin ich der Auffassung, dass ...",
    ],
  };
};

export const getB2ExamDomainTeaching = (day) => {
  const dayNumber = Number(day || 0);
  const alignment = B2_LESSON_CONTENT_ALIGNMENT[dayNumber];
  const models = B2_GRAMMAR_MODELS[dayNumber] || [];
  if (!alignment || !models.length) return null;

  const rules = grammarRulesFor(alignment.grammar_topic);
  const speaking = buildSpeaking(alignment, models);
  return {
    alignment,
    models,
    rules,
    grammarLesson: {
      title: `B2-Grammatik: ${alignment.grammar_topic}`,
      explanation: [
        `Die Grammatik dieser Lektion ist direkt mit dem Thema „${alignment.title}“ verbunden. Du sollst die Strukturen nicht isoliert auswendig lernen, sondern damit Gründe, Folgen, Vergleiche, Bedingungen oder Lösungen ausdrücken.`,
        `Achte beim Sprechen und Schreiben besonders auf die Funktion der Verbindung und auf die Verbposition. Ein korrekter B2-Satz ist klar, logisch und durch ein konkretes Beispiel gestützt.`,
        `Nutze die Modellbeispiele als Muster und formuliere danach eigene Aussagen zum Thema „${alignment.title}“.",
      ],
      rules,
      examples: models,
      miniExercise: `Formuliere fünf eigene Sätze zu „${alignment.title}“. Nutze mindestens drei der heutigen Strukturen und entwickle mindestens einen Satz zu Position → Grund → Beispiel.`,
      knowledgeTest: buildKnowledgeTest(alignment, models, rules),
    },
    speaking,
  };
};

export const enhanceB2ExamDomainLesson = (lesson = {}, explicitAlignment = null) => {
  const day = Number(explicitAlignment?.day || lesson?.day || 0);
  const teaching = getB2ExamDomainTeaching(day);
  if (!teaching) return lesson;

  const alignment = explicitAlignment || teaching.alignment;
  const speaking = teaching.speaking;
  return {
    ...lesson,
    level: "B2",
    day,
    chapter: alignment.chapter,
    title: alignment.title,
    topic: alignment.lessonTopic,
    objectives: [alignment.goal, `Nutze ${alignment.grammar_topic} sicher in zusammenhängenden B2-Antworten.`, "Entwickle eine Position mit Begründung, Beispiel, Abwägung und Lösung."],
    grammarFocus: alignment.grammar_topic,
    grammarLesson: { ...(lesson.grammarLesson || {}), ...teaching.grammarLesson },
    topicQuestions: speaking.branches.map((branch) => branch.prompt),
    speakingTaskType: "B2 argumentation / guided discussion",
    speakingTopic: `Sprechen: ${speaking.question}`,
    speakingBuilder: { ...(lesson.speakingBuilder || {}), ...speaking, style: "exam-domain" },
    phrases: [...new Set([...(lesson.phrases || []), ...speaking.starters])],
    vocabulary: [...new Set([...(lesson.vocabulary || []), ...topicKeywords(alignment), "Begründung", "Beispiel", "Gegenargument", "Maßnahme", "Fazit"])],
  };
};

export { B2_GRAMMAR_MODELS };
