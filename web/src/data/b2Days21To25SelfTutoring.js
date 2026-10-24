const makeQuiz = (items) => items.map(([question, options, answer, explanation]) => ({ question, options, answer, explanation }));

export const B2_DAYS_21_TO_25_TUTORING = {
  21: {
    question: "Welche Chancen und Herausforderungen bringt Migration mit sich, und was hilft beim Ankommen?",
    branches: [
      { id: "sprache", title: "Sprache", prompt: "Warum ist Sprache wichtig?", keywords: ["Sprachkurs", "Behörden", "Arbeit", "Kontakte"], example: "Gute Sprachkenntnisse erleichtern den Alltag und erhöhen die Chancen auf dem Arbeitsmarkt.", starter: "Ein wichtiger Schritt beim Ankommen ist ..." },
      { id: "arbeit", title: "Arbeit und Bildung", prompt: "Welche Rolle spielen Qualifikationen?", keywords: ["Anerkennung", "Ausbildung", "Weiterbildung", "Arbeitsmarkt"], example: "Nachdem Qualifikationen anerkannt wurden, können Zugewanderte leichter eine passende Stelle finden.", starter: "Nachdem ... , ..." },
      { id: "kontakte", title: "Soziale Kontakte", prompt: "Wie entsteht Zugehörigkeit?", keywords: ["Verein", "Nachbarschaft", "Freundschaft", "Teilhabe"], example: "Kontakte helfen, weil neue Regeln und Gewohnheiten dadurch schneller verständlich werden.", starter: "Soziale Kontakte sind wichtig, weil ..." },
      { id: "loesung", title: "Unterstützung", prompt: "Welche Angebote helfen?", keywords: ["Beratung", "Information", "Sprachkurs", "Mentoring"], example: "Beratungsstellen können Orientierung geben und damit Unsicherheit reduzieren.", starter: "Eine sinnvolle Maßnahme wäre ..." },
    ],
    quiz: makeQuiz([
      ["Welche Form ist korrekt?", ["Nachdem ich angekommen bin, suche ich einen Sprachkurs.", "Nachdem bin ich angekommen, ich suche einen Sprachkurs.", "Nachdem ich bin angekommen, suche ich.", "Nachdem angekommen ich, suche ich."], "Nachdem ich angekommen bin, suche ich einen Sprachkurs.", "Im temporalen Nebensatz steht das Verb am Ende."],
      ["Welcher Konnektor nennt einen Grund?", ["weil", "obwohl", "während", "trotzdem"], "weil", "Weil leitet einen kausalen Nebensatz ein."],
      ["Welche Folge ist richtig?", ["Die Anerkennung dauert lange. Deshalb beginnt die Arbeit später.", "Die Anerkennung dauert lange, obwohl deshalb die Arbeit.", "Deshalb die Anerkennung dauert.", "Weil deshalb Arbeit später."], "Die Anerkennung dauert lange. Deshalb beginnt die Arbeit später.", "Deshalb leitet eine Folge im Hauptsatz ein."],
      ["Welche Struktur beschreibt eine zeitliche Reihenfolge?", ["nachdem", "obwohl", "damit", "dennoch"], "nachdem", "Nachdem verbindet zwei Handlungen zeitlich."],
    ]),
  },
  22: {
    question: "Warum ist Mitbestimmung wichtig, und wie können Bürgerinnen und Bürger sich beteiligen?",
    branches: [
      { id: "wahl", title: "Wahlen", prompt: "Warum sind Wahlen wichtig?", keywords: ["Stimme", "Parlament", "Verantwortung", "Legitimation"], example: "Wahlen geben Bürgerinnen und Bürgern die Möglichkeit, politische Entscheidungen indirekt mitzubestimmen.", starter: "Eine zentrale Form der Mitbestimmung ist ..." },
      { id: "alltag", title: "Beteiligung im Alltag", prompt: "Wo kann man sich außerdem beteiligen?", keywords: ["Verein", "Gemeinde", "Initiative", "Schule"], example: "Auch lokale Initiativen können Einfluss haben, wenn Menschen gemeinsam Vorschläge machen.", starter: "Neben Wahlen kann man ..." },
      { id: "meinung", title: "Meinungen", prompt: "Wie berichtet man über Positionen?", keywords: ["sagen", "erklären", "fordern", "indirekte Rede"], example: "Die Politikerin erklärt, mehr Beteiligung sei für das Vertrauen wichtig.", starter: "Die Politikerin erklärt, ..." },
      { id: "grenze", title: "Verantwortung", prompt: "Welche Grenzen gibt es?", keywords: ["Information", "Respekt", "Regeln", "Mehrheit"], example: "Mitbestimmung funktioniert besser, wenn Entscheidungen auf verlässlichen Informationen beruhen.", starter: "Mitbestimmung funktioniert besonders gut, wenn ..." },
    ],
    quiz: makeQuiz([
      ["Welche Form ist indirekte Rede?", ["Er sagt, die Wahl ist wichtig.", "Er sagt, die Wahl sei wichtig.", "Er sagt: Wahl wichtig.", "Er sagt, sei die Wahl wichtig ist."], "Er sagt, die Wahl sei wichtig.", "Sei ist Konjunktiv I von sein."],
      ["Welche Form drückt eine Meinung sachlich aus?", ["Meiner Ansicht nach ...", "Das ist einfach so!", "Alle müssen denken ...", "Keine Ahnung."], "Meiner Ansicht nach ...", "Diese Formulierung passt zu einer sachlichen B2-Position."],
      ["Welche Form ist korrekt?", ["Die Ministerin erklärt, mehr Beteiligung sei nötig.", "Die Ministerin erklärt, mehr Beteiligung ist sei nötig.", "Die Ministerin sei erklärt.", "Mehr Beteiligung erklärt Ministerin."], "Die Ministerin erklärt, mehr Beteiligung sei nötig.", "Konjunktiv I markiert die wiedergegebene Aussage."],
      ["Was bedeutet sich beteiligen an?", ["teilnehmen an", "vermeiden", "abschaffen", "bezahlen"], "teilnehmen an", "Sich beteiligen an bedeutet aktiv teilnehmen."],
    ]),
  },
  23: {
    question: "Wie kann eine gute Work-Life-Balance aussehen, und welche Lösungen sind realistisch?",
    branches: [
      { id: "stress", title: "Stress", prompt: "Was verursacht schlechte Balance?", keywords: ["Überstunden", "Erreichbarkeit", "Druck", "Burn-out"], example: "Obwohl Arbeit wichtig ist, kann dauernde Erreichbarkeit zu Stress führen.", starter: "Obwohl ... , ..." },
      { id: "flex", title: "Flexible Arbeit", prompt: "Welche Vorteile hat Flexibilität?", keywords: ["Homeoffice", "Gleitzeit", "Familie", "Pendeln"], example: "Flexible Arbeitszeiten können helfen, damit Beschäftigte Beruf und Familie besser vereinbaren können.", starter: "Flexible Arbeitszeiten können dazu beitragen, dass ..." },
      { id: "grenzen", title: "Grenzen", prompt: "Welche Regeln helfen?", keywords: ["Pausen", "Feierabend", "Urlaub", "Erreichbarkeit"], example: "Klare Regeln zur Erreichbarkeit schützen die Erholungszeit nach der Arbeit.", starter: "Unternehmen sollten ..." },
      { id: "berufe", title: "Unterschiedliche Berufe", prompt: "Ist Homeoffice immer möglich?", keywords: ["Pflege", "Produktion", "Dienstleistung", "Alternative"], example: "In der Pflege ist Homeoffice kaum möglich, daher sind kürzere Schichten oder verlässliche Dienstpläne wichtiger.", starter: "Wenn Homeoffice nicht möglich ist, ..." },
    ],
    quiz: makeQuiz([
      ["Welcher Satz ist korrekt?", ["Obwohl Homeoffice flexibel ist, kann soziale Isolation entstehen.", "Obwohl ist Homeoffice flexibel, soziale Isolation entsteht.", "Obwohl Homeoffice ist flexibel, kann entstehen Isolation.", "Homeoffice obwohl flexibel."], "Obwohl Homeoffice flexibel ist, kann soziale Isolation entstehen.", "Im obwohl-Nebensatz steht das Verb am Ende."],
      ["Welche Struktur nennt ein Ziel?", ["damit", "obwohl", "trotzdem", "während"], "damit", "Damit drückt einen Zweck oder ein Ziel aus."],
      ["Welche Form ist korrekt?", ["Unternehmen sollten Pausen ermöglichen, damit Beschäftigte sich erholen können.", "Unternehmen sollten Pausen ermöglichen, damit können Beschäftigte sich erholen.", "damit Beschäftigte können sich erholen", "damit sich erholen Beschäftigte"], "Unternehmen sollten Pausen ermöglichen, damit Beschäftigte sich erholen können.", "Im damit-Satz steht das Verb am Ende."],
      ["Was passt am besten zu Work-Life-Balance?", ["Vereinbarkeit von Arbeit und Privatleben", "nur mehr Arbeit", "keine Freizeit", "ständige Erreichbarkeit"], "Vereinbarkeit von Arbeit und Privatleben", "Work-Life-Balance beschreibt ein ausgewogenes Verhältnis."],
    ]),
  },
  24: {
    question: "Welchen Nutzen hat Forschung für die Gesellschaft, und welche Risiken sollten beachtet werden?",
    branches: [
      { id: "medizin", title: "Medizin", prompt: "Wie hilft Forschung in der Medizin?", keywords: ["Behandlung", "Impfstoff", "Diagnose", "Studie"], example: "Durch Forschung können neue Behandlungsmethoden entwickelt und Krankheiten früher erkannt werden.", starter: "Ein wichtiger Nutzen der Forschung besteht darin, dass ..." },
      { id: "technik", title: "Technologie", prompt: "Welche technischen Vorteile gibt es?", keywords: ["Innovation", "Energie", "Mobilität", "KI"], example: "Neue Technologien werden entwickelt, um Prozesse sicherer und effizienter zu machen.", starter: "Durch die Entwicklung von ..." },
      { id: "risiko", title: "Risiken", prompt: "Welche Grenzen braucht Forschung?", keywords: ["Datenschutz", "Ethik", "Missbrauch", "Transparenz"], example: "Obwohl Forschung Fortschritt bringt, müssen Datenschutz und ethische Regeln beachtet werden.", starter: "Andererseits sollte berücksichtigt werden, dass ..." },
      { id: "vertrauen", title: "Vertrauen", prompt: "Wie entsteht Vertrauen?", keywords: ["Transparenz", "Ergebnisse", "Prüfung", "Öffentlichkeit"], example: "Vertrauen steigt, wenn Methoden erklärt und Ergebnisse unabhängig überprüft werden.", starter: "Vertrauen kann gestärkt werden, indem ..." },
    ],
    quiz: makeQuiz([
      ["Welche Passivform ist korrekt?", ["Neue Medikamente werden getestet.", "Neue Medikamente testen werden.", "Neue Medikamente wird getestet.", "Werden neue Medikamente testet."], "Neue Medikamente werden getestet.", "Plural Medikamente verlangt werden + Partizip II."],
      ["Welche Nominalisierung passt zu entwickeln?", ["die Entwicklung", "das Entwickel", "der Entwickeln", "die Entwickelt"], "die Entwicklung", "Die feste Nominalisierung lautet die Entwicklung."],
      ["Welche Form ist korrekt?", ["Daten werden ausgewertet.", "Daten wird ausgewertet.", "Daten werden auswerten.", "Daten ausgewertet werden sie."], "Daten werden ausgewertet.", "Passiv: werden + Partizip II."],
      ["Welche Struktur klingt sachlich?", ["Die Untersuchung der Daten ist wichtig.", "Daten gucken ist wichtig.", "Man macht Daten.", "Daten sind halt wichtig."], "Die Untersuchung der Daten ist wichtig.", "Nominalisierung macht den Ausdruck formeller und sachlicher."],
    ]),
  },
  25: {
    question: "Wie kann man nachhaltiger konsumieren, ohne Preis und Alltag völlig außer Acht zu lassen?",
    branches: [
      { id: "produkt", title: "Produkte vergleichen", prompt: "Welche Kriterien sind wichtig?", keywords: ["Preis", "Qualität", "Herkunft", "Verpackung"], example: "Ein langlebiges Produkt kann trotz eines höheren Preises nachhaltiger sein als ein sehr billiges Produkt.", starter: "Im Vergleich zu ... ist ..." },
      { id: "regional", title: "Regionale Produkte", prompt: "Welche Vorteile haben regionale Produkte?", keywords: ["Transport", "Saison", "Landwirtschaft", "Frische"], example: "Regionale Lebensmittel haben oft kürzere Transportwege und können dadurch die Umwelt weniger belasten.", starter: "Ein Vorteil regionaler Produkte ist ..." },
      { id: "wieder", title: "Wiederverwenden", prompt: "Wie kann man Ressourcen sparen?", keywords: ["reparieren", "Secondhand", "Mehrweg", "teilen"], example: "Gebrauchte Kleidung oder reparierte Geräte sparen Ressourcen, weil nicht ständig neue Produkte hergestellt werden müssen.", starter: "Ressourcen lassen sich sparen, indem ..." },
      { id: "realistisch", title: "Realistische Lösung", prompt: "Muss nachhaltiger Konsum teuer sein?", keywords: ["Budget", "Prioritäten", "bewusst", "weniger kaufen"], example: "Nachhaltiger Konsum bedeutet nicht zwingend, teure Produkte zu kaufen; oft hilft es schon, weniger und gezielter zu konsumieren.", starter: "Eine realistische Lösung besteht darin, ..." },
    ],
    quiz: makeQuiz([
      ["Welche Form ist richtig?", ["ein nachhaltiges Produkt", "ein nachhaltiger Produkt", "ein nachhaltigen Produkt", "ein nachhaltige Produkt"], "ein nachhaltiges Produkt", "Nach ein im Nominativ Neutrum steht -es."],
      ["Welche Vergleichsform ist korrekt?", ["umweltfreundlicher", "mehr umweltfreundlich", "umweltfreundlicherer als immer", "am umweltfreundlicher"], "umweltfreundlicher", "Die reguläre Komparativform lautet umweltfreundlicher."],
      ["Welche Form ist richtig?", ["mit regionalen Produkten", "mit regionale Produkte", "mit regionaler Produkten", "mit regionalem Produkte"], "mit regionalen Produkten", "Mit verlangt Dativ; Pluraladjektiv nach Nullartikel endet auf -en."],
      ["Welche Form ist korrekt?", ["die nachhaltigere Alternative", "die nachhaltiger Alternative", "die nachhaltigeren Alternative", "die nachhaltiges Alternative"], "die nachhaltigere Alternative", "Nach bestimmtem Artikel die steht im Nominativ Femininum die schwache Endung -e."],
    ]),
  },
};

export const getB2Days21To25Tutoring = (day) => B2_DAYS_21_TO_25_TUTORING[Number(day)] || null;
