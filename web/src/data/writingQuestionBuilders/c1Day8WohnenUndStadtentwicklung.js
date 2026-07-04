const c1Day8QuestionWritingBuilder = {
  level: "C1",
  day: 8,
  title: "C1 Day 8 guided writing: Wohnen und Stadtentwicklung",
  taskType: "Formal proposal / formelle Eingabe",
  targetWords: 230,
  taskPrompt:
    "Schreiben Sie eine formelle Eingabe an eine Stadtverwaltung. Beschreiben Sie ein konkretes Wohn- oder Infrastrukturproblem, erläutern Sie die Folgen für die Bevölkerung, schlagen Sie realistische Maßnahmen vor und berücksichtigen Sie Kosten, Flächenkonflikte oder Umsetzungsprobleme.",
  languageFocus: [
    "Nominalisierungen: der Ausbau, die Verbesserung, die Entlastung, die Begrenzung, die Schaffung",
    "Präpositionalstil: aufgrund, infolge, angesichts, zur/zum, durch, trotz, hinsichtlich",
    "Formeller Ton: sachlich, höflich, lösungsorientiert und nicht emotional übertreibend",
    "Abwägung: Zwar ..., jedoch ... / Einerseits ..., andererseits ... / Trotz ... erscheint ... sinnvoll",
  ],
  questions: [
    {
      id: "opening",
      section: "Betreff, Anrede und Anlass",
      question: "An welche kommunale Stelle schreiben Sie, und welches konkrete Problem möchten Sie sachlich ansprechen?",
      help:
        "Nennen Sie einen präzisen Betreff, eine höfliche Anrede und den Anlass Ihres Schreibens. Das Problem soll sofort verständlich sein: Wohnraummangel, steigende Mieten, fehlende Grünflächen, schlechte Verkehrsanbindung oder mangelnde soziale Infrastruktur.",
      starter:
        "Betreff: Vorschlag zur Verbesserung der Wohn- und Lebenssituation im Stadtteil ...\n\nSehr geehrte Damen und Herren,\n\nich wende mich an Sie aufgrund ...",
      minimumWords: 40,
      requiredLanguage: ["aufgrund + Genitiv", "formelle Anrede", "klarer Betreff"],
    },
    {
      id: "problem",
      section: "Sachliche Problembeschreibung",
      question: "Worin besteht das Problem genau, und wodurch hat es sich verschärft?",
      help:
        "Beschreiben Sie die Situation objektiv. Vermeiden Sie nur persönliche Beschwerden und zeigen Sie die größere städtische Entwicklung dahinter.",
      starter:
        "Infolge des Mangels an bezahlbarem Wohnraum hat sich die Situation in den letzten Jahren deutlich verschärft. Besonders betroffen sind ...",
      minimumWords: 45,
      requiredLanguage: ["infolge + Genitiv", "Nominalisierung", "sachliche Beschreibung"],
    },
    {
      id: "effects",
      section: "Folgen für die Bevölkerung",
      question: "Welche konkreten Folgen hat das Problem für Bewohnerinnen und Bewohner?",
      help:
        "Erklären Sie Folgen für Mieten, Mobilität, Sicherheit, Gesundheit, Familien, ältere Menschen, Schülerinnen und Schüler oder lokale Geschäfte.",
      starter:
        "Diese Entwicklung führt nicht nur zu höheren Mietbelastungen, sondern auch zu ...",
      minimumWords: 45,
      requiredLanguage: ["nicht nur ..., sondern auch", "soziale Folgen", "präzise Beispiele"],
    },
    {
      id: "measures",
      section: "Zwei realistische Maßnahmen",
      question: "Welche zwei Maßnahmen schlagen Sie vor, und welches Ziel verfolgen diese Maßnahmen?",
      help:
        "Nennen Sie mindestens zwei umsetzbare Vorschläge. Nutzen Sie zur/zum für Ziele und durch für Mittel: zur Verbesserung, durch den Ausbau, zum Schutz, zur Entlastung.",
      starter:
        "Zur Verbesserung der Wohn- und Lebensqualität schlage ich erstens ... vor. Durch ... könnte außerdem ...",
      minimumWords: 55,
      requiredLanguage: ["zur/zum + Nominalisierung", "durch + Akkusativ", "mindestens zwei Maßnahmen"],
    },
    {
      id: "constraints",
      section: "Kosten, Konflikte und Umsetzbarkeit",
      question: "Welche Einschränkungen, Kosten oder Zielkonflikte müssen realistisch berücksichtigt werden?",
      help:
        "Eine C1-Eingabe wirkt glaubwürdiger, wenn sie nicht so tut, als wären Lösungen kostenlos oder konfliktfrei. Nennen Sie einen Einwand und entkräften Sie ihn ausgewogen.",
      starter:
        "Trotz der damit verbundenen Kosten erscheint eine schrittweise Umsetzung sinnvoll, weil ...",
      minimumWords: 45,
      requiredLanguage: ["trotz + Genitiv", "zwar ..., jedoch", "realistische Abwägung"],
    },
    {
      id: "closing",
      section: "Bitte und professioneller Abschluss",
      question: "Wie bitten Sie höflich um Prüfung, Rückmeldung oder einen nächsten Schritt?",
      help:
        "Schließen Sie verbindlich und höflich. Bitten Sie um Prüfung, Information über Zuständigkeiten oder Aufnahme des Themas in eine Sitzung.",
      starter:
        "Ich bitte Sie höflich um Prüfung der genannten Vorschläge und um eine Rückmeldung zum weiteren Vorgehen.",
      minimumWords: 35,
      requiredLanguage: ["höfliche Bitte", "Prüfung", "Rückmeldung"],
    },
  ],
  modelAnswer:
    "Betreff: Vorschlag zur Verbesserung der Wohn- und Lebenssituation im Stadtteil\n\nSehr geehrte Damen und Herren,\n\nich wende mich an Sie aufgrund der zunehmenden Belastung durch steigende Mieten und fehlende Grünflächen in unserem Stadtteil. Infolge des Mangels an bezahlbarem Wohnraum werden Familien und ältere Menschen zunehmend verdrängt. Diese Entwicklung beeinträchtigt nicht nur die soziale Durchmischung, sondern auch die Lebensqualität. Zur Verbesserung der Situation schlage ich die Schaffung zusätzlicher Sozialwohnungen sowie die Umgestaltung ungenutzter Flächen zu kleinen Parks vor. Durch den Ausbau des Nahverkehrs könnte außerdem der Autoverkehr reduziert werden. Trotz der damit verbundenen Kosten erscheint eine schrittweise Umsetzung sinnvoll. Ich bitte Sie höflich um Prüfung der Vorschläge und um eine Rückmeldung zum weiteren Vorgehen.",
  miniPractice:
    "Schreiben Sie zuerst eine kurze formelle Eingabe von 80–100 Wörtern. Verwenden Sie mindestens drei Strukturen: aufgrund/infolge, zur/zum, durch oder trotz.",
  checklist: [
    "Ich habe einen klaren Betreff und eine höfliche Anrede verwendet.",
    "Ich habe das Problem konkret, sachlich und nicht nur emotional beschrieben.",
    "Ich habe Ursachen oder Rahmenbedingungen mit aufgrund, infolge oder angesichts formuliert.",
    "Ich habe die Folgen für die Bevölkerung erläutert.",
    "Ich habe mindestens zwei realistische Maßnahmen vorgeschlagen.",
    "Ich habe Ziele und Mittel mit zur/zum und durch ausgedrückt.",
    "Ich habe Kosten, Zielkonflikte oder Umsetzungsprobleme berücksichtigt.",
    "Ich habe mindestens drei passende Nominalisierungen oder Präpositionalgruppen verwendet.",
    "Ich habe höflich um Prüfung und Rückmeldung gebeten.",
  ],
};

export default c1Day8QuestionWritingBuilder;
