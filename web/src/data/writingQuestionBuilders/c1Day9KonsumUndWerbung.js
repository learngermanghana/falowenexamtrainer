const c1Day9QuestionWritingBuilder = {
  level: "C1",
  day: 9,
  title: "C1 Day 9 guided writing: Konsum und Werbung",
  taskType: "C1 opinion essay / Stellungnahme",
  targetWords: 230,
  taskPrompt:
    "Verfassen Sie eine C1-Stellungnahme zur Frage, ob personalisierte Werbung stärker reguliert werden sollte. Erklären Sie Nutzen und Risiken, analysieren Sie ein konkretes Beispiel, berücksichtigen Sie einen Einwand und entwickeln Sie eine ausgewogene Lösung.",
  languageFocus: [
    "Gegensätze: während, wohingegen, dagegen, demgegenüber",
    "Einschränkungen: obwohl, obgleich, wenngleich, auch wenn",
    "Abwägung: zwar ..., jedoch / einerseits ..., andererseits",
    "Höfliche Empfehlungen: sollte, müsste, könnte, wäre sinnvoll",
    "Kritische Analyse: beeinflussen, erzeugen, verstärken, ausnutzen, transparent kennzeichnen",
  ],
  questions: [
    {
      id: "position",
      section: "Einleitung und differenzierte Position",
      question: "Sollte personalisierte Werbung stärker reguliert werden?",
      help:
        "Führen Sie in die Debatte ein. Zeigen Sie, dass personalisierte Werbung sowohl wirtschaftlichen Nutzen als auch Risiken für Datenschutz, Autonomie und Konsumverhalten hat.",
      starter:
        "Meines Erachtens sollte personalisierte Werbung nicht pauschal verboten, aber deutlich transparenter reguliert werden, weil ...",
      minimumWords: 40,
      requiredLanguage: ["meines Erachtens", "nicht pauschal ..., aber", "klare Ausgangsposition"],
    },
    {
      id: "relevance",
      section: "Bedeutung und Wirkung personalisierter Werbung",
      question: "Warum ist personalisierte Werbung für Unternehmen und Verbraucher relevant?",
      help:
        "Erklären Sie Nutzen und Risiken. Unternehmen erreichen passende Zielgruppen; Verbraucher erhalten relevante Angebote, können aber auch unbewusst gelenkt werden.",
      starter:
        "Während Unternehmen durch personalisierte Werbung ihre Zielgruppen gezielter erreichen, können Verbraucher ...",
      minimumWords: 45,
      requiredLanguage: ["während", "Zielgruppen", "Nutzen und Risiko"],
    },
    {
      id: "example",
      section: "Konkretes Beispiel einer beeinflussten Kaufentscheidung",
      question: "Wie können Daten, Algorithmen oder Werbestrategien eine Kaufentscheidung beeinflussen?",
      help:
        "Nutzen Sie ein realistisches Beispiel: Influencer, Rabatt-Timer, Tracking, wiederholte Anzeigen, soziale Vergleiche, personalisierte Produktempfehlungen oder künstliche Knappheit.",
      starter:
        "Ein anschauliches Beispiel wäre eine Nutzerin, die nach Sportschuhen sucht und anschließend ...",
      minimumWords: 50,
      requiredLanguage: ["konkretes Beispiel", "beeinflussen", "dadurch / infolgedessen"],
    },
    {
      id: "counterargument",
      section: "Einwand gegen strengere Regulierung",
      question: "Welcher Einwand spricht gegen strengere Regeln?",
      help:
        "Berücksichtigen Sie wirtschaftliche Interessen, kostenlose digitale Angebote, relevante Produktempfehlungen oder die schwierige praktische Umsetzung von Regeln.",
      starter:
        "Dagegen ließe sich einwenden, dass strengere Regeln zwar den Verbraucherschutz stärken, jedoch ...",
      minimumWords: 45,
      requiredLanguage: ["dagegen ließe sich einwenden", "zwar ..., jedoch", "wirtschaftliche Interessen"],
    },
    {
      id: "solution",
      section: "Ausgewogene Lösung und Schlussurteil",
      question: "Welche Lösung verbindet Transparenz, Datenschutz, wirtschaftliche Interessen und Medienkompetenz?",
      help:
        "Formulieren Sie keine extreme Lösung. C1 verlangt eine tragfähige Kombination aus klarer Kennzeichnung, einfacher Kontrolle, Schutz vulnerabler Gruppen und Medienbildung.",
      starter:
        "Eine tragfähige Lösung wäre eine Kombination aus klarer Kennzeichnung, verständlichen Datenschutzeinstellungen und ...",
      minimumWords: 50,
      requiredLanguage: ["eine tragfähige Lösung wäre", "sollte/müsste/könnte", "Schlussurteil"],
    },
  ],
  modelAnswer:
    "Meines Erachtens sollte personalisierte Werbung nicht pauschal verboten, aber deutlich transparenter reguliert werden. Während Unternehmen dadurch passende Zielgruppen erreichen und Verbraucher relevante Angebote erhalten können, besteht zugleich die Gefahr einer kaum bemerkten Beeinflussung. Ein anschauliches Beispiel ist eine Nutzerin, die nach Sportschuhen sucht und anschließend durch Rabatt-Timer, Influencer-Beiträge und wiederholte Anzeigen zu einem Impulskauf gedrängt wird. Dagegen ließe sich einwenden, dass strengere Regeln zwar den Verbraucherschutz stärken, jedoch kostenlose digitale Angebote und kleine Unternehmen belasten könnten. Eine tragfähige Lösung wäre daher eine klare Kennzeichnung personalisierter Werbung, einfache Datenschutzeinstellungen und mehr Medienbildung. Besonders Kinder und Jugendliche müssten zusätzlich geschützt werden.",
  miniPractice:
    "Schreiben Sie zuerst einen 80–100-Wörter-Absatz. Verwenden Sie mindestens drei Strukturen: während/wohingegen, obwohl/obgleich, zwar ... jedoch, sollte/müsste/könnte.",
  checklist: [
    "Ich habe eine klare, aber differenzierte Grundposition formuliert.",
    "Ich habe Nutzen und Risiken personalisierter Werbung erklärt.",
    "Ich habe mindestens einen Gegensatz mit während, wohingegen, dagegen oder demgegenüber formuliert.",
    "Ich habe mindestens eine Einschränkung mit obwohl, obgleich, wenngleich oder auch wenn verwendet.",
    "Ich habe ein konkretes Beispiel für eine beeinflusste Kaufentscheidung verwendet.",
    "Ich habe einen relevanten Einwand gegen strengere Regulierung berücksichtigt.",
    "Ich habe eine ausgewogene Lösung mit sollte, müsste, könnte oder wäre sinnvoll formuliert.",
    "Ich habe ein klares Schlussurteil geschrieben.",
  ],
};

export default c1Day9QuestionWritingBuilder;
