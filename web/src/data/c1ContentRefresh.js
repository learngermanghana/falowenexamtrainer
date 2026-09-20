export const C1_CANONICAL_TITLES = Object.freeze([
  "Ziele und Lernweg",
  "Kultur und Identität",
  "Medien und Informationskompetenz",
  "Beziehungen und Teamarbeit",
  "Berufliche Entwicklung",
  "Gesundheit und Lebensstil",
  "Reisen und Nachhaltigkeit",
  "Wohnen und Stadtentwicklung",
  "Konsum und Werbung",
  "Integration und Gesellschaft",
  "Engagement und Ehrenamt",
  "Freizeit und Kultur",
  "Mehrsprachigkeit",
  "Innovation und Zukunft",
  "Bildung und lebenslanges Lernen",
  "Technologie im Alltag",
  "Umweltverantwortung",
  "Gesellschaftlicher Zusammenhalt",
  "Arbeitswelt und Automatisierung",
  "Digitale Gesundheit",
  "Gesellschaftliche Teilhabe und Integration",
  "Demokratie und Mitbestimmung",
  "Work-Life-Balance",
  "Verkehr und Infrastruktur",
  "Wissenschaft und Forschungsethik",
  "Nachhaltiger Konsum",
  "Digitale Verwaltung",
  "Demografischer Wandel",
]);

export const C1_CANONICAL_GRAMMAR_TITLES = Object.freeze([
  "Relativsätze mit Präpositionen",
  "Partizip I und Partizip II als Adjektiv",
  "Konjunktiv I für indirekte Rede",
  "Erweiterte Partizipialattribute",
  "Konditionale und finale Strukturen",
  "Kausale, konsekutive und konzessive Strukturen",
  "Erweiterte Vergleichsformen und abwägende Argumentation",
  "Nominalisierung und Präpositionalstil bei Wohnen und Stadtentwicklung",
  "Konzessive und adversative Strukturen bei Konsum und Werbung",
  "Passiv, Modalpassiv und differenzierte Bewertung bei Integration und Gesellschaft",
  "Finale, kausale und konditionale Strukturen bei Engagement und Ehrenamt",
  "Erweiterte Vergleichs- und Bewertungsstrukturen bei Freizeit und Kultur",
  "Nominalstil und Relativsätze bei Mehrsprachigkeit",
  "Zukunftsformen, Modalpassiv und Hypothesen bei Innovation und Zukunft",
  "Konzessive und kausale Strukturen bei Bildung und lebenslangem Lernen",
  "Passiv, Zustandspassiv und Einschränkungen bei Technologie im Alltag",
  "Argumentationsstruktur und Nominalstil bei Umwelt und Verantwortung",
  "Adversative und konzessive Strukturen bei Gesellschaft und Zusammenhalt",
  "Futur, Modalverben und Einschränkungen bei Arbeit der Zukunft",
  "Digitale Gesundheit klar erklären: Passiv und Nominalisierung",
  "Temporale und kausale Strukturen bei Migration und Teilhabe",
  "Indirekte Rede und argumentative Distanz bei Politik und Mitbestimmung",
  "Konzessive und finale Strukturen bei Freizeit und Work-Life-Balance",
  "Vergleiche, Passiv und Nominalstil bei Mobilität und Infrastruktur",
  "Wissenschaftlich argumentieren: Quellenbezug, Konjunktiv I und vorsichtige Bewertung",
  "Adjektivdeklination, Partizipialattribute und Abwägung bei nachhaltigem Konsum",
  "Formelle Sprache, Passiv und Nominalstil bei Digitalisierung und Verwaltung",
  "Ursache, Folge und Abwägung beim demografischen Wandel",
]);

export const getC1CanonicalTitle = (day) => C1_CANONICAL_TITLES[Number(day) - 1] || null;
export const getC1CanonicalGrammarTitle = (day) => C1_CANONICAL_GRAMMAR_TITLES[Number(day) - 1] || null;

const DAY_PROFILES = {
  1: {
    aim: "realistische Lernziele in messbare Etappen übersetzen und den Lernweg flexibel steuern",
    question: "Wie sollte ein anspruchsvolles C1-Lernziel geplant werden, damit Fortschritt messbar bleibt, ohne dass der Lernplan zu starr wird?",
    angles: ["messbare Lernziele und Prioritäten", "Zeitbudget und regelmäßige Routinen", "Feedback und Fehleranalyse", "Flexibilität bei Rückschlägen"],
    points: ["Erklären Sie, welche Kriterien ein realistisches Lernziel erfüllen sollte.", "Zeigen Sie an einem konkreten Beispiel, wie Fortschritt überprüft werden kann.", "Gehen Sie auf ein Problem zu starrer oder unrealistischer Lernpläne ein.", "Entwickeln Sie einen flexiblen Lösungsweg für Lernende mit wenig Zeit."],
    mistake: "Relativsätze nicht künstlich verlängern; Präposition und Kasus müssen zum Verb oder Ausdruck passen.",
  },
  2: {
    aim: "kulturelle Identität als mehrschichtigen Prozess beschreiben statt Menschen auf Herkunft zu reduzieren",
    question: "Inwiefern entsteht kulturelle Identität aus Sprache, Erfahrungen und sozialen Beziehungen, und wo liegen die Grenzen fester kultureller Zuordnungen?",
    angles: ["Sprache und Mehrfachzugehörigkeit", "Familie, Werte und Traditionen", "Migration und neue Lebensräume", "Medien, Rollenbilder und persönliche Erfahrungen"],
    points: ["Erläutern Sie, welche Faktoren kulturelle Identität prägen können.", "Zeigen Sie an einem Beispiel, warum Menschen mehrere Zugehörigkeiten gleichzeitig haben können.", "Gehen Sie auf Probleme starrer kultureller Zuschreibungen ein.", "Erklären Sie, wie Begegnung und Mehrsprachigkeit Perspektiven erweitern können."],
    mistake: "Partizipialattribute brauchen wie Adjektive die passende Endung; vermeide außerdem überladene Nominalgruppen.",
  },
  3: {
    aim: "Quellen, Behauptungen und Belege voneinander unterscheiden und fremde Aussagen sprachlich distanziert wiedergeben",
    question: "Welche Verantwortung tragen Medien, Plattformen und Nutzende dafür, dass Informationen zuverlässig geprüft und eingeordnet werden?",
    angles: ["Quellenkritik und überprüfbare Belege", "Desinformation und algorithmische Reichweite", "Verantwortung von Plattformen und Nutzenden", "Medienbildung und Meinungsfreiheit"],
    points: ["Erklären Sie, woran sich eine verlässliche Quelle erkennen lässt.", "Analysieren Sie an einem Beispiel, wie irreführende Inhalte Reichweite gewinnen können.", "Gehen Sie auf Grenzen oder Risiken strenger Informationskontrolle ein.", "Entwickeln Sie einen Ansatz, der Quellenprüfung, Medienbildung und Meinungsfreiheit verbindet."],
    mistake: "Konjunktiv I dient der distanzierten Wiedergabe; er macht eine berichtete Aussage nicht automatisch wahr.",
  },
  4: {
    aim: "Zusammenarbeit differenziert bewerten und Konflikte als Zusammenspiel von Rollen, Erwartungen und Kommunikation analysieren",
    question: "Was macht Teamarbeit langfristig erfolgreich, und wie sollten Teams mit Konflikten oder ungleicher Verantwortung umgehen?",
    angles: ["Vertrauen und Verlässlichkeit", "Rollen, Verantwortung und Erwartungen", "Konfliktlösung und Feedback", "Entscheidungen und faire Beteiligung"],
    points: ["Erläutern Sie zentrale Voraussetzungen guter Teamarbeit.", "Analysieren Sie an einem Beispiel, wie ein Konflikt im Team entstehen kann.", "Gehen Sie auf Grenzen von Harmonie oder Konsens ein.", "Schlagen Sie einen konstruktiven Umgang mit Verantwortung und Feedback vor."],
    mistake: "Gegensätze nicht nur mit aber aneinanderreihen; auf C1 sollten Beziehungen zwischen Argumenten präzise markiert werden.",
  },
  5: {
    aim: "berufliche Entwicklung zwischen Eigeninitiative, Weiterbildung und strukturellen Chancen sachlich abwägen",
    question: "Welche Verantwortung tragen Beschäftigte und Arbeitgeber für berufliche Weiterentwicklung in einer sich wandelnden Arbeitswelt?",
    angles: ["Weiterbildung und neue Kompetenzen", "Berufserfahrung und Spezialisierung", "Chancengleichheit beim Zugang zu Fortbildung", "Rolle von Unternehmen und Eigeninitiative"],
    points: ["Erklären Sie, warum kontinuierliche Weiterbildung an Bedeutung gewinnt.", "Argumentieren Sie anhand eines konkreten beruflichen Beispiels.", "Gehen Sie auf Hindernisse wie Zeit, Kosten oder ungleichen Zugang ein.", "Entwickeln Sie eine faire Aufteilung der Verantwortung zwischen Beschäftigten und Arbeitgebern."],
    mistake: "Nominalstil soll verdichten, nicht verschleiern; zu viele Nominalisierungen hintereinander machen Aussagen schwer lesbar.",
  },
  6: {
    aim: "Gesundheitsentscheidungen als Zusammenspiel von Alltag, Prävention, Arbeitsbedingungen und individueller Verantwortung bewerten",
    question: "Wie kann ein gesunder Lebensstil gefördert werden, ohne Gesundheit ausschließlich zur privaten Verantwortung des Einzelnen zu machen?",
    angles: ["Bewegung, Ernährung und Schlaf", "Stress und psychische Gesundheit", "Arbeitsbedingungen und Prävention", "Eigenverantwortung und gesellschaftliche Rahmenbedingungen"],
    points: ["Erläutern Sie wichtige Faktoren eines gesunden Lebensstils.", "Zeigen Sie an einem Beispiel, wie Alltag oder Arbeit Gesundheit beeinflussen können.", "Gehen Sie auf Grenzen reiner Eigenverantwortung ein.", "Schlagen Sie eine ausgewogene Verbindung von Prävention und unterstützenden Rahmenbedingungen vor."],
    mistake: "Ursache und Folge klar unterscheiden; nicht jeden Zusammenhang vorschnell als eindeutige Ursache formulieren.",
  },
  7: {
    aim: "Reiseentscheidungen nach Umweltwirkung, Zugänglichkeit, Zeit und regionalem Nutzen differenziert beurteilen",
    question: "Wie lässt sich Reisen nachhaltiger gestalten, ohne Mobilität und Teilhabe unnötig einzuschränken?",
    angles: ["Verkehrsmittel und Emissionen", "Reisedauer und Reisehäufigkeit", "lokale Wirtschaft und Overtourism", "Preis, Zeit und soziale Zugänglichkeit"],
    points: ["Erklären Sie, welche Faktoren die Nachhaltigkeit einer Reise beeinflussen.", "Bewerten Sie an einem Beispiel verschiedene Verkehrsmittel oder Reiseformen.", "Gehen Sie auf praktische oder soziale Grenzen nachhaltiger Optionen ein.", "Entwickeln Sie einen realistischen Kompromiss zwischen Mobilität und Umweltverantwortung."],
    mistake: "Konzessive Strukturen müssen einen echten Gegensatz ausdrücken; obwohl und trotzdem nicht redundant im selben Satz verwenden.",
  },
  8: {
    aim: "Wohnraumpolitik, Stadtentwicklung und Lebensqualität aus mehreren Perspektiven analysieren",
    question: "Wie können Städte bezahlbaren Wohnraum schaffen und sich zugleich sozial, ökologisch und wirtschaftlich weiterentwickeln?",
    angles: ["bezahlbarer Wohnraum und steigende Mieten", "Verdichtung und öffentlicher Raum", "Verkehr, Grünflächen und Infrastruktur", "Interessen von Mietenden, Eigentümern und Kommunen"],
    points: ["Erläutern Sie zentrale Ursachen von Wohnraummangel oder steigenden Mieten.", "Analysieren Sie an einem Beispiel einen Zielkonflikt der Stadtentwicklung.", "Gehen Sie auf mögliche Nachteile einzelner Maßnahmen ein.", "Schlagen Sie einen ausgewogenen Ansatz für Wohnraum und Lebensqualität vor."],
    mistake: "Bei Relativsätzen mit Präposition muss die Präposition vor dem Relativpronomen stehen und den richtigen Kasus verlangen.",
  },
  9: {
    aim: "Werbewirkung, Konsumentscheidungen und Verbraucherautonomie kritisch untersuchen",
    question: "Wie stark darf Werbung Kaufentscheidungen beeinflussen, und welche Verantwortung tragen Unternehmen, Plattformen und Verbraucher?",
    angles: ["personalisierte Werbung und Daten", "emotionale Ansprache und Kaufimpulse", "Transparenz und Verbraucherschutz", "bewusster Konsum und Eigenverantwortung"],
    points: ["Erklären Sie, wie Werbung Kaufentscheidungen beeinflussen kann.", "Analysieren Sie an einem Beispiel Chancen oder Risiken personalisierter Werbung.", "Gehen Sie auf Grenzen von Verboten oder strenger Regulierung ein.", "Entwickeln Sie einen Ansatz aus Transparenz, Schutzregeln und Medienkompetenz."],
    mistake: "Passiv und unpersönliche Formen dürfen Verantwortung nicht unnötig verschleiern; nenne Akteure, wenn sie für das Argument wichtig sind.",
  },
  10: {
    aim: "Integration als wechselseitigen Prozess zwischen Teilhabe, Sprache, Institutionen und Eigeninitiative diskutieren",
    question: "Welche Bedingungen fördern gesellschaftliche Teilhabe, und wie lässt sich Verantwortung zwischen Zugewanderten, Institutionen und Gesellschaft verteilen?",
    angles: ["Sprache und Zugang zu Bildung", "Arbeitsmarkt und Anerkennung von Qualifikationen", "Begegnung, Zugehörigkeit und Diskriminierung", "Eigeninitiative und institutionelle Unterstützung"],
    points: ["Erläutern Sie wichtige Voraussetzungen gesellschaftlicher Teilhabe.", "Zeigen Sie an einem konkreten Beispiel, wie eine Hürde entstehen oder abgebaut werden kann.", "Gehen Sie auf einseitige Erwartungen an Integration kritisch ein.", "Schlagen Sie einen Ansatz vor, der Eigeninitiative und faire Strukturen verbindet."],
    mistake: "Bedingungen mit sofern, falls oder vorausgesetzt, dass müssen logisch zu der Aussage passen und dürfen nicht nur dekorativ eingesetzt werden.",
  },
  11: {
    aim: "freiwilliges Engagement nach gesellschaftlichem Nutzen, Motivation, Belastung und institutioneller Unterstützung bewerten",
    question: "Welche Rolle sollte freiwilliges Engagement in einer Gesellschaft spielen, und wo endet die Verantwortung von Ehrenamtlichen?",
    angles: ["gesellschaftlicher Nutzen und Zusammenhalt", "Motivation und persönliche Entwicklung", "Zeitaufwand und Überlastung", "Grenze zwischen Ehrenamt und staatlicher Verantwortung"],
    points: ["Erklären Sie, welchen Beitrag Ehrenamt leisten kann.", "Argumentieren Sie anhand eines konkreten Beispiels für freiwilliges Engagement.", "Gehen Sie auf Risiken von Überlastung oder der Verlagerung öffentlicher Aufgaben ein.", "Schlagen Sie vor, wie freiwilliges Engagement sinnvoll unterstützt werden kann."],
    mistake: "Infinitivkonstruktionen mit um, ohne oder statt brauchen in der Regel dasselbe Subjekt wie der Hauptsatz.",
  },
  12: {
    aim: "kulturelle Teilhabe, Freizeitangebote und gesellschaftlichen Zugang differenziert bewerten",
    question: "Welche Bedeutung haben Kultur- und Freizeitangebote für Lebensqualität und gesellschaftliche Teilhabe?",
    angles: ["Kultur als Begegnungsraum", "Kosten und Zugänglichkeit", "digitale und analoge Kulturangebote", "öffentliche Förderung und Eigenfinanzierung"],
    points: ["Erläutern Sie, welchen Beitrag Kultur und Freizeit zur Lebensqualität leisten können.", "Analysieren Sie an einem Beispiel unterschiedliche Formen kultureller Teilhabe.", "Gehen Sie auf Zugangsbarrieren wie Kosten, Ort oder Zeit ein.", "Entwickeln Sie einen ausgewogenen Vorschlag für öffentliche und private Kulturangebote."],
    mistake: "Partizipialattribute sollten präzise sein; zu lange Attribute erschweren das Verstehen und können besser als Relativsatz formuliert werden.",
  },
  13: {
    aim: "Mehrsprachigkeit als individuelle und gesellschaftliche Ressource analysieren, ohne Lernaufwand oder Bildungsbedingungen auszublenden",
    question: "Welche Chancen bietet Mehrsprachigkeit, und unter welchen Bedingungen kann sie in Bildung und Gesellschaft tatsächlich genutzt werden?",
    angles: ["Spracherwerb und Lernstrategien", "Identität und Zugehörigkeit", "Schule und mehrsprachige Bildung", "Arbeitswelt und internationale Kommunikation"],
    points: ["Erläutern Sie wichtige Vorteile von Mehrsprachigkeit.", "Zeigen Sie an einem Beispiel, wie vorhandene Sprachen beim Lernen helfen können.", "Gehen Sie auf Herausforderungen in Schule oder Alltag ein.", "Schlagen Sie Bedingungen vor, unter denen Mehrsprachigkeit besser gefördert werden kann."],
    mistake: "Beim Vergleich von Positionen klar markieren, wessen Aussage wiedergegeben wird und wo die eigene Bewertung beginnt.",
  },
  14: {
    aim: "Innovation nach Nutzen, Risiken, Verteilungseffekten und langfristigen Folgen beurteilen",
    question: "Wie sollte eine Gesellschaft mit Innovationen umgehen, deren Nutzen groß sein kann, deren langfristige Folgen aber noch unsicher sind?",
    angles: ["technischer und gesellschaftlicher Nutzen", "Risiken und unbeabsichtigte Folgen", "Zugang und Verteilung von Vorteilen", "Regulierung, Forschung und Vorsorge"],
    points: ["Erläutern Sie, warum Innovation für gesellschaftliche Entwicklung wichtig sein kann.", "Bewerten Sie an einem Beispiel Nutzen und mögliche Risiken.", "Gehen Sie auf das Problem unsicherer Langzeitfolgen ein.", "Entwickeln Sie einen Ansatz, der Innovation ermöglicht und zugleich Verantwortung sichert."],
    mistake: "Vorsichtige Bewertungen nicht mit vagen Aussagen verwechseln; Begriffe wie dürfte, könnte oder erscheint brauchen einen klaren sachlichen Bezug.",
  },
  15: {
    aim: "lebenslanges Lernen nach Zugang, Motivation, beruflichem Nutzen und gesellschaftlicher Verantwortung abwägen",
    question: "Wie kann lebenslanges Lernen gefördert werden, ohne Weiterbildung nur zur privaten Aufgabe einzelner Beschäftigter zu machen?",
    angles: ["beruflicher Wandel und neue Kompetenzen", "Zeit, Kosten und Zugang", "Motivation und selbstgesteuertes Lernen", "Rolle von Arbeitgebern und öffentlicher Förderung"],
    points: ["Erklären Sie, warum Weiterbildung über die Erstausbildung hinaus wichtig ist.", "Zeigen Sie an einem Beispiel den Nutzen gezielter Weiterbildung.", "Gehen Sie auf Hindernisse wie Zeit, Finanzierung oder ungleichen Zugang ein.", "Schlagen Sie eine faire Verteilung der Weiterbildungsverantwortung vor."],
    mistake: "Nominalisierungen nur dort einsetzen, wo sie Präzision schaffen; unnötiger Nominalstil macht Argumente schwerfällig.",
  },
  16: {
    aim: "digitale Alltagsdienste nach Nutzen, Datenschutz, Abhängigkeit und digitaler Teilhabe bewerten",
    question: "Wie viel Digitalisierung erleichtert den Alltag tatsächlich, und welche analogen Alternativen sollten erhalten bleiben?",
    angles: ["Bequemlichkeit und Zeitersparnis", "Datenschutz und Datensicherheit", "digitale Kompetenzen und Zugang", "Abhängigkeit von Geräten und Diensten"],
    points: ["Erläutern Sie konkrete Vorteile digitaler Alltagsdienste.", "Analysieren Sie an einem Beispiel ein Datenschutz- oder Abhängigkeitsrisiko.", "Gehen Sie auf Menschen mit eingeschränktem digitalen Zugang ein.", "Schlagen Sie einen ausgewogenen Mix aus digitalen und analogen Angeboten vor."],
    mistake: "Im Passiv auf die Zeitform achten und Modalpassiv korrekt mit Partizip II + werden bilden.",
  },
  17: {
    aim: "individuelle und institutionelle Umweltverantwortung miteinander verknüpfen",
    question: "Wie lässt sich Umweltverantwortung fair zwischen Privatpersonen, Unternehmen und öffentlichen Institutionen verteilen?",
    angles: ["Konsum und persönliches Verhalten", "Unternehmensverantwortung und Produktion", "Infrastruktur und politische Rahmenbedingungen", "Wirksamkeit, Kosten und soziale Fairness"],
    points: ["Erläutern Sie, welchen Beitrag individuelles Verhalten leisten kann.", "Zeigen Sie an einem Beispiel, warum strukturelle Maßnahmen ebenfalls notwendig sein können.", "Gehen Sie auf Kosten oder soziale Verteilungsfragen ein.", "Entwickeln Sie eine ausgewogene Verteilung von Verantwortung."],
    mistake: "Ursache, Folge und Bewertung nicht vermischen; Nominalisierungen müssen syntaktisch sauber in den Satz eingebunden werden.",
  },
  18: {
    aim: "gesellschaftlichen Zusammenhalt über Vertrauen, Teilhabe, Konflikt und Solidarität analysieren",
    question: "Welche Bedingungen stärken gesellschaftlichen Zusammenhalt, wenn Interessen, Lebenslagen und Wertvorstellungen auseinandergehen?",
    angles: ["Vertrauen und faire Institutionen", "soziale Ungleichheit und Ausgrenzung", "Begegnung, Dialog und gemeinsame Räume", "Solidarität und individuelle Freiheit"],
    points: ["Erklären Sie zentrale Voraussetzungen gesellschaftlichen Zusammenhalts.", "Analysieren Sie an einem Beispiel eine Ursache sozialer Spaltung.", "Gehen Sie auf Grenzen rein symbolischer Maßnahmen ein.", "Entwickeln Sie eine konkrete Maßnahme, die Teilhabe und Vertrauen stärken kann."],
    mistake: "Konzessive und adversative Konnektoren nach ihrer Funktion unterscheiden; während ist nicht automatisch zeitlich.",
  },
  19: {
    aim: "Veränderungen der Arbeitswelt vorsichtig prognostizieren und Chancen sowie Anpassungsbedarf differenziert darstellen",
    question: "Wie sollten Beschäftigte, Unternehmen und Bildungssysteme auf Automatisierung und neue Arbeitsmodelle reagieren?",
    angles: ["Automatisierung und veränderte Tätigkeiten", "Weiterbildung und digitale Kompetenzen", "flexible Arbeit und Belastungsgrenzen", "soziale Absicherung bei beruflichem Wandel"],
    points: ["Erläutern Sie, wie Digitalisierung berufliche Tätigkeiten verändern kann.", "Bewerten Sie an einem Beispiel Chancen und Risiken eines neuen Arbeitsmodells.", "Gehen Sie auf Weiterbildungs- oder Übergangsprobleme ein.", "Schlagen Sie Maßnahmen für einen sozial tragfähigen Wandel vor."],
    mistake: "Prognosen nicht als Gewissheiten formulieren; Modalität und Einschränkungen müssen den Grad der Sicherheit zeigen.",
  },
  20: {
    aim: "digitale Gesundheitsangebote nach Zugang, medizinischer Qualität, Datenschutz und Verantwortung beurteilen",
    question: "Unter welchen Bedingungen können digitale Gesundheitsangebote die medizinische Versorgung sinnvoll ergänzen?",
    angles: ["Zugang und Erreichbarkeit", "Datenschutz und sensible Gesundheitsdaten", "Qualität digitaler Beratung", "Rolle von Ärztinnen, Ärzten und automatisierten Systemen"],
    points: ["Erläutern Sie konkrete Vorteile digitaler Gesundheitsangebote.", "Analysieren Sie ein Risiko für Datenschutz oder medizinische Qualität.", "Gehen Sie auf Grenzen vollständig digitaler Versorgung ein.", "Formulieren Sie Bedingungen für einen sinnvollen ergänzenden Einsatz."],
    mistake: "Passiv für Prozesse nutzen, aber den verantwortlichen Akteur nennen, wenn Verantwortlichkeit für das Argument entscheidend ist.",
  },
  21: {
    aim: "Migration und Teilhabe über Zugang, Sprache, Anerkennung und institutionelle Bedingungen differenziert diskutieren",
    question: "Welche Faktoren entscheiden darüber, ob Zugewanderte langfristig an Bildung, Arbeit und gesellschaftlichem Leben teilhaben können?",
    angles: ["Sprachkenntnisse und Orientierung", "Bildung, Arbeit und Anerkennung von Qualifikationen", "Diskriminierung und institutionelle Hürden", "Eigeninitiative und Unterstützungsangebote"],
    points: ["Erläutern Sie wichtige Voraussetzungen gesellschaftlicher Teilhabe.", "Zeigen Sie an einem Beispiel eine konkrete Zugangsbarriere.", "Gehen Sie auf die Grenzen einseitiger Verantwortungszuschreibungen ein.", "Schlagen Sie einen Ansatz vor, der Eigeninitiative und institutionelle Unterstützung verbindet."],
    mistake: "Voraussetzungen präzise formulieren; sofern und vorausgesetzt, dass setzen eine echte Bedingung voraus.",
  },
  22: {
    aim: "Formen demokratischer Mitbestimmung sachlich vergleichen und fremde Positionen sprachlich distanziert wiedergeben",
    question: "Welche Möglichkeiten gesellschaftlicher Mitbestimmung fördern Beteiligung, und welche Grenzen haben einzelne Beteiligungsformen?",
    angles: ["Wahlen und repräsentative Beteiligung", "Bürgerinitiativen und lokale Verfahren", "politische Bildung und Zugang zu Information", "Beteiligung, Verantwortung und Entscheidungsfreiheit"],
    points: ["Erläutern Sie unterschiedliche Formen gesellschaftlicher Mitbestimmung.", "Analysieren Sie an einem Beispiel einen möglichen Nutzen direkter Beteiligung.", "Gehen Sie auf Grenzen oder Zielkonflikte einzelner Beteiligungsformen ein.", "Schlagen Sie vor, wie Beteiligung informiert und zugänglich gestaltet werden kann."],
    mistake: "Berichtete politische Positionen klar als fremde Aussagen markieren; sprachliche Distanz ersetzt keine Quellenprüfung.",
  },
  23: {
    aim: "Erholung, Arbeitszeit, Erreichbarkeit und betriebliche Verantwortung als zusammenhängende Faktoren der Work-Life-Balance bewerten",
    question: "Welche Rahmenbedingungen helfen Beschäftigten, Beruf und Privatleben langfristig gesund miteinander zu vereinbaren?",
    angles: ["Arbeitszeit und Erholungsphasen", "ständige Erreichbarkeit und digitale Grenzen", "Homeoffice und flexible Modelle", "betriebliche Verantwortung und individuelle Gewohnheiten"],
    points: ["Erläutern Sie Faktoren, die eine gesunde Work-Life-Balance beeinflussen.", "Bewerten Sie an einem Beispiel Chancen und Risiken flexibler Arbeit.", "Gehen Sie auf Grenzen rein individueller Selbstorganisation ein.", "Schlagen Sie konkrete Regeln für Erreichbarkeit und Erholung vor."],
    mistake: "Zweck- und Folgebeziehungen nicht verwechseln; damit beschreibt ein Ziel, sodass eine Folge.",
  },
  24: {
    aim: "Mobilität nach Erreichbarkeit, Umweltwirkung, Kosten und öffentlichem Nutzen beurteilen",
    question: "Wie sollte Verkehrsinfrastruktur geplant werden, damit Mobilität zuverlässig, bezahlbar und möglichst umweltverträglich bleibt?",
    angles: ["öffentlicher Verkehr und Erreichbarkeit", "Straßen, Rad- und Fußverkehr", "Finanzierung und soziale Zugänglichkeit", "Stadt-Land-Unterschiede und langfristige Planung"],
    points: ["Erläutern Sie, welche Ziele gute Verkehrsinfrastruktur erfüllen sollte.", "Vergleichen Sie an einem Beispiel zwei unterschiedliche Mobilitätslösungen.", "Gehen Sie auf Kosten oder regionale Unterschiede ein.", "Entwickeln Sie einen ausgewogenen Vorschlag für zuverlässige und nachhaltige Mobilität."],
    mistake: "Im Nominalstil auf korrekte Genitiv- und Präpositionalergänzungen achten; nicht mehrere abstrakte Nomen ohne klare Beziehung stapeln.",
  },
  25: {
    aim: "wissenschaftliche Aussagen nach Evidenz, Unsicherheit, Ethik und gesellschaftlichem Nutzen differenziert bewerten",
    question: "Wie lassen sich Forschungsfreiheit, wissenschaftlicher Fortschritt und ethische Verantwortung miteinander vereinbaren?",
    angles: ["Forschungsfreiheit und Erkenntnisgewinn", "Evidenz, Unsicherheit und Reproduzierbarkeit", "ethische Grenzen und mögliche Risiken", "gesellschaftlicher Nutzen und transparente Kontrolle"],
    points: ["Erläutern Sie die Bedeutung von Forschungsfreiheit für wissenschaftlichen Fortschritt.", "Bewerten Sie an einem Beispiel, wann ethische Grenzen notwendig sein können.", "Gehen Sie auf mögliche Folgen zu strenger Einschränkungen ein.", "Entwickeln Sie einen ausgewogenen Umgang mit Freiheit, Kontrolle und Verantwortung."],
    mistake: "Wissenschaftliche Befunde vorsichtig formulieren; deuten darauf hin ist nicht gleichbedeutend mit beweisen.",
  },
  26: {
    aim: "nachhaltigen Konsum nach Wirkung, Preis, Verfügbarkeit und Produzentenverantwortung beurteilen",
    question: "Wie kann nachhaltiger Konsum gefördert werden, ohne Verantwortung ausschließlich auf einzelne Verbraucher zu verlagern?",
    angles: ["Produktlebensdauer und Reparierbarkeit", "Preis und soziale Zugänglichkeit", "Transparenz von Lieferketten", "Verantwortung von Herstellern, Handel und Konsumenten"],
    points: ["Erläutern Sie konkrete Merkmale nachhaltigen Konsums.", "Analysieren Sie an einem Beispiel, wie Kaufentscheidungen durch Preis oder Information beeinflusst werden.", "Gehen Sie auf Grenzen individueller Konsumentscheidungen ein.", "Schlagen Sie Maßnahmen vor, die Verbraucher- und Produzentenverantwortung verbinden."],
    mistake: "Bedingungen und Einwände sprachlich sauber trennen; ein ausgewogenes Argument braucht nicht automatisch zwei gleich starke Seiten.",
  },
  27: {
    aim: "digitale Verwaltung nach Effizienz, Datenschutz, Barrierefreiheit und analogem Zugang bewerten",
    question: "Wie kann Verwaltung digitaler werden, ohne Menschen mit geringem digitalem Zugang oder besonderen Unterstützungsbedarfen auszuschließen?",
    angles: ["Online-Anträge und Zeitersparnis", "Datenschutz und sichere Identifikation", "Barrierefreiheit und digitale Kompetenzen", "analoge Alternativen und persönliche Beratung"],
    points: ["Erläutern Sie konkrete Vorteile digitaler Verwaltungsangebote.", "Analysieren Sie an einem Beispiel ein Zugangs- oder Datenschutzproblem.", "Gehen Sie auf Grenzen einer vollständig digitalen Verwaltung ein.", "Schlagen Sie einen barrierearmen Mix aus digitalen und persönlichen Angeboten vor."],
    mistake: "Formeller Nominalstil braucht klare Verben und Verantwortlichkeiten; amtliche Sprache sollte präzise, nicht unnötig kompliziert sein.",
  },
  28: {
    aim: "demografische Entwicklungen als langfristige Ursache-Folge-Ketten erklären und Maßnahmen generationengerecht abwägen",
    question: "Wie kann eine alternde Gesellschaft Renten, Pflege und Fachkräftebedarf langfristig finanzieren, ohne Belastungen einseitig auf eine Generation zu verlagern?",
    angles: ["Lebenserwartung und Altersstruktur", "Rentenfinanzierung und Erwerbsbevölkerung", "Pflegebedarf und Fachkräftemangel", "Zuwanderung, Familienförderung und längere Erwerbstätigkeit"],
    points: ["Erläutern Sie zentrale Ursachen und Folgen des demografischen Wandels.", "Bewerten Sie an einem Beispiel eine mögliche Reformmaßnahme.", "Gehen Sie auf Belastungen oder Zielkonflikte zwischen Generationen ein.", "Entwickeln Sie einen Maßnahmenmix, der Finanzierung und soziale Fairness verbindet."],
    mistake: "Langfristige Zusammenhänge nicht monokausal erklären; Ursache, Wechselwirkung und Folge sprachlich klar unterscheiden.",
  },
};

const makeSpeakingBranches = (lesson, profile) => profile.angles.map((angle, index) => ({
  id: `c1-${lesson.day}-angle-${index + 1}`,
  title: angle,
  keywords: String(angle).split(/\s+und\s+|,\s*/).filter(Boolean),
  prompt: `Welche Rolle spielt „${angle}“ bei der Frage: ${profile.question}`,
  example: `Ein starker C1-Punkt zu „${angle}“ nennt eine klare Aussage, begründet sie, konkretisiert sie mit einem Beispiel und erklärt anschließend eine Folge oder Einschränkung.`,
  starter: index === 0 ? "Zunächst ist zu berücksichtigen, dass ..." : index === 1 ? "Ein anschauliches Beispiel hierfür ist ..." : index === 2 ? "Kritisch einzuwenden ist allerdings, dass ..." : "Ein ausgewogener Lösungsweg bestünde darin, ...",
}));

const makeWritingContent = (lesson, profile) => {
  const formal = /formal|brief|e-mail/i.test(String(lesson.writingTaskType || ""));
  const taskType = lesson.writingTaskType || (formal ? "Formal letter / E-Mail" : "C1 opinion essay / Stellungnahme");
  if (formal) {
    return {
      taskType,
      topic: `Schreiben: ${lesson.title}. Verfassen Sie eine formelle Nachricht auf C1-Niveau zum Thema „${lesson.title}“. Ausgangsfrage: ${profile.question} Bearbeiten Sie die folgenden Punkte sachlich und vollständig.`,
      structure: ["Betreff und höfliche Anrede", profile.points[0], profile.points[1], profile.points[2], profile.points[3], "Formulieren Sie einen konkreten, realistischen Vorschlag und bitten Sie höflich um Rückmeldung."],
      usefulLines: ["Sehr geehrte Damen und Herren,", "ich wende mich an Sie, weil ...", "Besonders relevant ist in diesem Zusammenhang, dass ...", "Kritisch ist für mich jedoch, dass ...", "Als praktikable Lösung schlage ich vor, dass ...", "Für eine kurze Rückmeldung wäre ich Ihnen sehr dankbar."],
    };
  }
  return {
    taskType,
    topic: `Schreiben: ${lesson.title}. Verfassen Sie eine C1-Stellungnahme mit etwa 220–280 Wörtern. ${profile.question} Bearbeiten Sie alle vier Inhaltspunkte und entwickeln Sie Ihre Position mit Begründungen, Beispiel, Einwand und Lösungsansatz.`,
    structure: ["Einleitung: Führen Sie präzise in die Fragestellung ein.", ...profile.points, "Schluss: Formulieren Sie ein differenziertes Fazit, das Ihre Abwägung sichtbar macht."],
    usefulLines: ["Die Fragestellung lässt sich nur dann angemessen beurteilen, wenn mehrere Perspektiven berücksichtigt werden.", "Von besonderer Bedeutung ist dabei, dass ...", "Ein anschauliches Beispiel hierfür ist ...", "Dem lässt sich allerdings entgegenhalten, dass ...", "Unter der Voraussetzung, dass ..., erscheint ... sinnvoll.", "Zusammenfassend lässt sich festhalten, dass ..."],
  };
};

export const alignC1LessonContent = (lesson) => {
  if (String(lesson?.level || "").toUpperCase() !== "C1") return lesson;
  const day = Number(lesson?.day || 0);
  const profile = DAY_PROFILES[day];
  if (!profile) return lesson;
  const canonicalTitle = getC1CanonicalTitle(day) || lesson.title;
  const canonicalGrammarTitle = getC1CanonicalGrammarTitle(day) || lesson.grammar_topic || lesson.grammarFocus || "";
  const canonicalLesson = { ...lesson, title: canonicalTitle, lessonTitle: canonicalTitle, topic: profile.question };

  const originalGrammar = lesson.grammarLesson || {};
  const writing = makeWritingContent(canonicalLesson, profile);
  const originalWritingBuilder = lesson.writingBuilder || {};
  const originalExamples = Array.isArray(originalGrammar.examples) ? originalGrammar.examples : [];
  const originalRules = Array.isArray(originalGrammar.rules) ? originalGrammar.rules : [];
  const originalExplanations = Array.isArray(originalGrammar.explanation) ? originalGrammar.explanation : [];

  return {
    ...canonicalLesson,
    grammar_topic: canonicalGrammarTitle,
    grammarFocus: canonicalGrammarTitle,
    explanation: [
      `In diesem Kapitel arbeitest du nicht nur am Wortschatz zu „${canonicalTitle}“, sondern an der Fähigkeit, ${profile.aim}.`,
      "Auf C1-Niveau soll deine Antwort nicht bei einer persönlichen Meinung stehen bleiben. Trenne Behauptung, Begründung, Beispiel, Gegenargument und Schlussfolgerung deutlich voneinander.",
      `Übertrage die Grammatik des Tages konsequent auf das Thema. So wird aus einer isolierten Regel ein sprachliches Werkzeug für eine präzise C1-Argumentation.`,
    ],
    objectives: [
      profile.points[0],
      profile.points[1],
      profile.points[2],
      profile.points[3],
    ].map((item) => item.replace(/^Erläutern Sie|^Zeigen Sie|^Analysieren Sie|^Bewerten Sie|^Gehen Sie|^Entwickeln Sie|^Schlagen Sie|^Formulieren Sie/, "Ich kann")),
    topicQuestions: [profile.question, ...profile.angles.map((angle) => `Welche Rolle spielt ${angle} bei diesem Thema?`)],
    grammarLesson: {
      ...originalGrammar,
      explanation: [
        ...originalExplanations.slice(0, 3),
        `C1-Transfer: Nutze diese Struktur nicht als Selbstzweck. Setze sie beim Thema „${canonicalTitle}“ ein, um Aussagen genauer zu begründen, einzuschränken oder miteinander zu verknüpfen.`,
      ],
      rules: [
        ...originalRules.slice(0, 5),
        `Typischer Fehler: ${profile.mistake}`,
      ],
      examples: originalExamples.slice(0, 6),
      miniExercise: `Formuliere zum Thema „${canonicalTitle}“ vier zusammenhängende C1-Sätze: eine klare Aussage, eine Begründung, ein konkretes Beispiel und einen Einwand. Verwende dabei die Grammatik dieses Kapitels mindestens zweimal korrekt.`,
    },
    speakingTopic: `Sprechen: ${profile.question}`,
    speakingBuilder: {
      ...(lesson.speakingBuilder || {}),
      question: profile.question,
      branches: makeSpeakingBranches(canonicalLesson, profile),
      plan: [
        "Einleitung: Formuliere die Fragestellung mit eigenen Worten und nenne deine Grundposition.",
        "Hauptargument: Begründe einen zentralen Punkt präzise.",
        "Beispiel: Konkretisiere das Argument mit einer realistischen Situation oder Folge.",
        "Gegenposition: Nenne einen ernst zu nehmenden Einwand oder eine Einschränkung.",
        "Abwägung: Zeige, unter welchen Bedingungen dein Vorschlag sinnvoll wäre.",
        "Schluss: Fasse deine Position knapp zusammen, ohne die Einleitung zu wiederholen.",
      ],
      starters: ["Zunächst ist festzuhalten, dass ...", "Ausschlaggebend ist dabei, dass ...", "Ein konkretes Beispiel hierfür ist ...", "Dem lässt sich allerdings entgegenhalten, dass ...", "Unter der Voraussetzung, dass ..., wäre ...", "Insgesamt spricht daher vieles dafür, ..."],
    },
    writingTaskType: writing.taskType,
    writingTopic: writing.topic,
    writingPromptBullets: profile.points,
    writingBuilder: {
      ...originalWritingBuilder,
      structure: writing.structure,
      usefulLines: writing.usefulLines,
    },
    phrases: [
      ...(Array.isArray(lesson.phrases) ? lesson.phrases.slice(0, 5) : []),
      "eine Position differenziert begründen",
      "einen Einwand berücksichtigen",
      "eine Voraussetzung klar formulieren",
      "eine konkrete Folge ableiten",
    ],
    tasks: {
      ...(lesson.tasks || {}),
      speaking: `Sprich strukturiert über folgende Frage: ${profile.question} Nutze mindestens zwei Argumente, ein konkretes Beispiel und einen Einwand.`,
      writing: writing.topic,
    },
    c1ContentRefresh: {
      title: canonicalTitle,
      grammarTitle: canonicalGrammarTitle,
      aim: profile.aim,
      question: profile.question,
      speakingBranches: makeSpeakingBranches(canonicalLesson, profile),
      writingPoints: profile.points,
    },
  };
};

export const getC1ContentProfile = (day) => DAY_PROFILES[Number(day)] || null;

export default alignC1LessonContent;
