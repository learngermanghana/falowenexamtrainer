const scaffold = (prompt, example, starter) => ({ prompt, example, starter });

const C1_DAY11_TO15_SPEAKING_SCAFFOLDS = {
  12: {
    teilhabe: scaffold(
      "Wer profitiert von öffentlichen Kulturangeboten, und welche Gruppen könnten trotz des Angebots ausgeschlossen bleiben?",
      "Günstige Kulturangebote können soziale Teilhabe fördern, weil auch Menschen mit geringerem Einkommen Zugang erhalten. Ein konkretes Beispiel sind kostenlose Stadtteilkonzerte; dadurch entstehen Begegnungsmöglichkeiten, die nicht vom persönlichen Budget abhängen.",
      "Im Hinblick auf gesellschaftliche Teilhabe ist besonders relevant, dass ...",
    ),
    lebensqualitaet: scaffold(
      "Wie wirken Kultur- und Freizeitangebote konkret auf die Lebensqualität einer Stadtbevölkerung?",
      "Kulturelle Angebote können insofern zur Lebensqualität beitragen, als sie Erholung, soziale Kontakte und neue Perspektiven ermöglichen. Regelmäßige Veranstaltungen in öffentlichen Räumen können beispielsweise Nachbarschaften beleben und das Zugehörigkeitsgefühl stärken.",
      "Kultur ist insofern für die Lebensqualität bedeutsam, als ...",
    ),
    identitaet: scaffold(
      "Wie können Kulturangebote lokale Identität stärken, ohne gesellschaftliche Vielfalt auszublenden?",
      "Mehrsprachige Festivals können traditionelle und neue kulturelle Ausdrucksformen verbinden. Dadurch fühlen sich unterschiedliche Bevölkerungsgruppen sichtbarer, während zugleich ein gemeinsamer öffentlicher Raum entsteht.",
      "Für Identität und Zugehörigkeit spielt eine wichtige Rolle, dass ...",
    ),
    wirtschaft: scaffold(
      "Welche wirtschaftlichen Vorteile entstehen durch Kulturförderung, und welche Kosten oder Verteilungskonflikte müssen berücksichtigt werden?",
      "Einerseits können Festivals Tourismus und lokale Gastronomie fördern, andererseits verursachen Großveranstaltungen erhebliche öffentliche Kosten. Entscheidend ist daher, ob der langfristige Nutzen auch kleinere Einrichtungen und die lokale Bevölkerung erreicht.",
      "Einerseits spricht wirtschaftlich dafür, dass ..., andererseits ...",
    ),
    formate: scaffold(
      "Welche Angebotsform erreicht welche Zielgruppe, und worin unterscheiden sich digitale und persönliche Kulturangebote?",
      "Digitale Angebote sind häufig leichter erreichbar, während Live-Veranstaltungen direkte Begegnung ermöglichen. Ein hybrides Modell kann daher besonders wirksam sein, weil es Reichweite und persönlichen Austausch miteinander verbindet.",
      "Im Vergleich zu ... bietet ... den Vorteil, dass ...",
    ),
    foerderung: scaffold(
      "Welche Förderform erzeugt langfristig mehr gesellschaftliche Wirkung: dauerhafte lokale Förderung oder einzelne Großevents?",
      "Je verlässlicher lokale Einrichtungen finanziert werden, desto kontinuierlicher können sie Angebote planen. Eine mehrjährige Förderung kann deshalb nachhaltiger wirken als einmalige Großveranstaltungen, deren Effekt nach kurzer Zeit wieder endet.",
      "Je verlässlicher die Förderung gestaltet wird, desto ...",
    ),
  },
  13: {
    bildung: scaffold(
      "Wie kann Mehrsprachigkeit Bildungschancen verbessern, und welche Voraussetzung muss dafür erfüllt sein?",
      "Mehrsprachige Kompetenzen können den Zugang zu Lerninhalten erleichtern, sofern Sprachförderung fachlich gut begleitet wird. Ein konkretes Beispiel ist bilingualer Unterricht, bei dem Fachwissen und Sprachkompetenz parallel entwickelt werden.",
      "Ein wesentlicher Vorteil für Bildungschancen besteht darin, dass ...",
    ),
    identitaet: scaffold(
      "Welche Bedeutung hat die Herkunftssprache für Identität und Zugehörigkeit?",
      "Die Anerkennung der Herkunftssprache kann das Selbstbild stärken, weil Lernende ihre sprachliche Biografie nicht als Defizit erleben. Dadurch kann Mehrfachzugehörigkeit als Ressource statt als Widerspruch wahrgenommen werden.",
      "Im Hinblick auf Identität ist zu berücksichtigen, dass ...",
    ),
    beruf: scaffold(
      "In welchen beruflichen Situationen entsteht ein konkreter Vorteil durch Mehrsprachigkeit?",
      "In internationalen Teams können mehrsprachige Beschäftigte Kundenkontakte erleichtern und kulturelle Missverständnisse reduzieren. Dies kann Unternehmen helfen, neue Märkte zu erschließen und zugleich die interne Zusammenarbeit zu verbessern.",
      "Auf dem Arbeitsmarkt zeigt sich der Nutzen insbesondere dann, wenn ...",
    ),
    gesellschaft: scaffold(
      "Wie kann Mehrsprachigkeit gesellschaftliche Teilhabe fördern, ohne eine gemeinsame Verständigungssprache zu ersetzen?",
      "Mehrsprachige Informationen bei Behörden oder im Gesundheitswesen können den Zugang zu wichtigen Dienstleistungen verbessern. Gleichzeitig bleibt eine gemeinsame Verkehrssprache notwendig, damit öffentliche Kommunikation für alle nachvollziehbar bleibt.",
      "Gesellschaftliche Teilhabe kann dadurch verbessert werden, dass ...",
    ),
    herausforderungen: scaffold(
      "Welche reale Grenze hat mehrsprachige Förderung in Schulen?",
      "Zusätzliche Sprachprogramme benötigen qualifizierte Lehrkräfte und geeignetes Material. Fehlen diese Ressourcen, kann eine gut gemeinte Förderung zu Qualitätsunterschieden führen und bestehende Bildungsungleichheiten sogar verstärken.",
      "Kritiker weisen zu Recht darauf hin, dass ...",
    ),
    modelle: scaffold(
      "Welches Fördermodell verbindet Mehrsprachigkeit mit realistischen schulischen Ressourcen?",
      "Sprachtandems und gezielte Herkunftssprachenangebote können bestehende Strukturen ergänzen, ohne jeden Fachunterricht mehrsprachig organisieren zu müssen. Dadurch lässt sich Förderung schrittweise und bedarfsgerecht ausbauen.",
      "Eine praktikable Fördermöglichkeit bestünde darin, ...",
    ),
  },
  14: {
    felder: scaffold(
      "Welche zwei Innovationsfelder werden den Alltag wahrscheinlich besonders stark verändern, und warum?",
      "Künstliche Intelligenz und personalisierte Medizin dürften besonders prägend sein, weil sie sowohl Arbeitsprozesse als auch Gesundheitsentscheidungen verändern können. Ihre Wirkung wird jedoch davon abhängen, wie zuverlässig und zugänglich die Systeme entwickelt werden.",
      "Aller Wahrscheinlichkeit nach wird besonders ... an Bedeutung gewinnen, weil ...",
    ),
    alltag: scaffold(
      "Welche konkrete Veränderung könnte Automatisierung im Arbeitsalltag auslösen?",
      "Routineaufgaben werden voraussichtlich stärker automatisiert, sodass Beschäftigte mehr Zeit für komplexe Tätigkeiten gewinnen könnten. Gleichzeitig müssen neue Kompetenzen erworben werden, damit der Produktivitätsgewinn nicht zu Ausgrenzung führt.",
      "Im Arbeitsalltag wird sich vermutlich zeigen, dass ...",
    ),
    chancen: scaffold(
      "Welche gesellschaftliche Chance ist besonders überzeugend und wie lässt sie sich konkret belegen?",
      "Digitale Diagnosesysteme könnten Krankheiten früher erkennen und medizinisches Personal entlasten. Dadurch ließe sich die Versorgung verbessern, sofern die Systeme zuverlässig geprüft und für unterschiedliche Bevölkerungsgruppen zugänglich sind.",
      "Eine wesentliche Chance besteht darin, dass ...",
    ),
    risiken: scaffold(
      "Welches Risiko könnte den Nutzen neuer Technologien begrenzen?",
      "Eine zunehmende Abhängigkeit von automatisierten Systemen kann problematisch werden, wenn Entscheidungen nicht mehr nachvollziehbar sind. Dies könnte insbesondere bei Personal- oder Kreditentscheidungen bestehende Benachteiligungen verstärken.",
      "Nicht auszuschließen ist jedoch, dass ...",
    ),
    rahmen: scaffold(
      "Welche Rahmenbedingung muss erfüllt sein, damit Innovation gesellschaftlich nützt?",
      "Innovation sollte mit Transparenz, Datenschutz und Weiterbildung verbunden werden. Wenn Unternehmen neue Systeme einführen, ohne Beschäftigte zu qualifizieren oder Entscheidungen erklärbar zu machen, kann technologischer Fortschritt Vertrauen verlieren.",
      "Voraussetzung für einen gesellschaftlichen Nutzen ist, dass ...",
    ),
    prognose: scaffold(
      "Formuliere eine abgestufte Prognose: Was wird wahrscheinlich passieren, und was bleibt unsicher?",
      "Bis 2035 werden viele Unternehmen einen Teil ihrer Routineprozesse automatisiert haben. Ob dadurch insgesamt mehr Arbeitsplätze entstehen oder verschwinden, lässt sich jedoch nur schwer vorhersagen, da dies von Weiterbildung, Investitionen und Regulierung abhängt.",
      "Bis zum Jahr ... werden ... voraussichtlich ... haben; allerdings ...",
    ),
  },
  15: {
    individuum: scaffold(
      "Welche Verantwortung können Lernende realistisch selbst übernehmen?",
      "Lernende können eigene Kompetenzlücken erkennen, Lernziele setzen und regelmäßig Zeit für Weiterbildung einplanen. Diese Eigeninitiative stößt jedoch an Grenzen, wenn Kurse zu teuer sind oder sich nicht mit Betreuungspflichten vereinbaren lassen.",
      "Auf individueller Ebene liegt Verantwortung insbesondere darin, ...",
    ),
    unternehmen: scaffold(
      "Warum sollten Unternehmen Weiterbildung unterstützen, obwohl sie Kosten verursacht?",
      "Unternehmen profitieren von aktuellen Kompetenzen, weil Beschäftigte neue Technologien effizienter einsetzen können. Eine teilweise Finanzierung oder Freistellung kann daher sowohl die Produktivität als auch die Bindung qualifizierter Mitarbeitender stärken.",
      "Für eine stärkere Beteiligung der Unternehmen spricht, dass ...",
    ),
    staat: scaffold(
      "Welche Aufgabe sollte der Staat übernehmen, ohne alle Weiterbildungskosten vollständig zu tragen?",
      "Der Staat kann Förderprogramme und Qualitätsstandards schaffen, damit Weiterbildung nicht allein vom Einkommen abhängt. Eine vollständige Finanzierung jedes Kurses wäre jedoch weder notwendig noch finanziell nachhaltig.",
      "Eine zentrale staatliche Aufgabe besteht darin, ...",
    ),
    zugang: scaffold(
      "Welche konkrete Zugangshürde gefährdet Chancengleichheit besonders?",
      "Menschen mit geringem Einkommen können Weiterbildung trotz hoher Motivation nicht immer finanzieren. Dies kann dazu führen, dass gerade diejenigen mit dem größten Qualifizierungsbedarf weniger Möglichkeiten zum beruflichen Aufstieg erhalten.",
      "Besonders problematisch im Hinblick auf Chancengleichheit ist, dass ...",
    ),
    lernformen: scaffold(
      "Welche Lernform eignet sich für Berufstätige mit wenig Zeit und warum?",
      "Berufsbegleitende Online-Module bieten zeitliche Flexibilität, während Präsenzphasen einen direkten Austausch ermöglichen. Ein hybrides Modell kann deshalb für viele Beschäftigte realistischer sein als ein ausschließliches Vollzeitprogramm.",
      "Für Berufstätige erscheint besonders sinnvoll, ...",
    ),
    wirkung: scaffold(
      "Welche Wirkung kann Weiterbildung haben und wo liegt eine Grenze?",
      "Weiterbildung kann die Beschäftigungsfähigkeit stärken und berufliche Mobilität erleichtern. Sie darf jedoch nicht zur dauerhaften Zusatzbelastung werden; ohne Lernzeit und Anerkennung im Betrieb kann sie Überforderung statt Entwicklung verursachen.",
      "Weiterbildung kann wesentlich dazu beitragen, ...; gleichzeitig muss berücksichtigt werden, dass ...",
    ),
  },
};

export const enrichC1SpeakingBranches = (lesson, branches = []) => {
  const dayScaffolds = C1_DAY11_TO15_SPEAKING_SCAFFOLDS[Number(lesson?.day || 0)] || {};
  return branches.map((branch) => ({ ...branch, ...(dayScaffolds[branch.id] || {}) }));
};

export default C1_DAY11_TO15_SPEAKING_SCAFFOLDS;
