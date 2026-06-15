import { makeLesson } from "../buildSelfLearningLesson";

const c1Day9KonsumUndWerbung = makeLesson({
  level: "C1",
  day: 9,
  chapter: "2.4",
  title: "Konsum und Werbung",
  topic: "Kaufentscheidungen, Werbestrategien, digitale Beeinflussung und Verantwortung kritisch bewerten",
  heroImage: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=80",
  grammarFocus: "Argumentative Redemittel und Konjunktiv II für Empfehlungen, Kritik und differenzierte Lösungen",
  objectives: [
    "Ich kann erklären, wie Werbung Bedürfnisse, Markenbilder und Kaufentscheidungen beeinflusst.",
    "Ich kann Positionen mit anspruchsvollen argumentativen Redemitteln strukturieren und abwägen.",
    "Ich kann mit sollte, könnte, müsste und wäre Kritik sowie Empfehlungen höflich formulieren.",
    "Ich kann eine C1-Stellungnahme zu personalisierter Werbung und bewusstem Konsum verfassen.",
  ],
  explanation: [
    "Werbung informiert nicht nur über Produkte, sondern erzeugt Aufmerksamkeit, Emotionen und soziale Erwartungen. Digitale Plattformen können Werbeinhalte zusätzlich auf persönliche Daten und Verhaltensmuster abstimmen.",
    "Eine differenzierte C1-Argumentation trennt legitime Information von Manipulation und berücksichtigt die Verantwortung von Unternehmen, Plattformen, Politik und Verbraucherinnen und Verbrauchern.",
    "Die Schreibaufgabe ist eine Stellungnahme zur Frage, ob personalisierte Werbung stärker reguliert werden sollte.",
  ],
  grammarLesson: {
    title: "Argumentative Redemittel und Konjunktiv II",
    explanation: [
      "Argumentative Redemittel zeigen Funktion und Gewicht einer Aussage: Ein entscheidender Aspekt ist, dagegen spricht, daraus folgt und nicht außer Acht zu lassen ist.",
      "Der Konjunktiv II eignet sich für Empfehlungen, vorsichtige Kritik und hypothetische Folgen: Unternehmen sollten transparenter informieren; Plattformen könnten Nutzer besser schützen; strengere Regeln wären sinnvoll.",
      "Auf C1-Niveau sollten Position, Gegenargument und Lösung logisch miteinander verbunden und sprachlich abgestuft werden.",
    ],
    rules: [
      "Leite Positionen mit Formulierungen wie meines Erachtens, aus meiner Sicht oder es spricht vieles dafür ein.",
      "Nutze ein entscheidender Aspekt ist und besonders problematisch erscheint zur Gewichtung.",
      "Formuliere Gegenargumente mit dagegen ließe sich einwenden oder dem steht jedoch entgegen.",
      "Nutze sollte, könnte, müsste und wäre, um Empfehlungen und Kritik weniger direkt zu formulieren.",
      "Verbinde Folgen mit daraus ergäbe sich, dies hätte zur Folge oder dadurch ließe sich.",
      "Beende die Abwägung mit Formulierungen wie insgesamt überwiegen, unter der Voraussetzung, dass oder eine tragfähige Lösung wäre.",
    ],
    examples: [
      "Meines Erachtens sollte personalisierte Werbung deutlich transparenter gekennzeichnet werden.",
      "Ein entscheidender Aspekt ist, dass Verbraucher häufig nicht erkennen, wie stark ihre Daten zur Beeinflussung genutzt werden.",
      "Dagegen ließe sich einwenden, dass zielgerichtete Werbung auch relevante Informationen liefern könnte.",
      "Plattformen müssten verständliche Einstellungsmöglichkeiten anbieten, damit Nutzer ihre Daten kontrollieren könnten.",
      "Eine tragfähige Lösung wäre eine Kombination aus klaren Regeln, Medienbildung und verantwortungsvollen Unternehmensstandards.",
    ],
    miniExercise: "Formuliere auf C1-Niveau: 1) Werbung muss transparenter sein. Nutze sollte. 2) Plattformen schützen Nutzer nicht genug. Formuliere höfliche Kritik mit müsste. 3) Nenne ein Gegenargument mit dagegen ließe sich einwenden. 4) Schlage eine Lösung mit wäre sinnvoll vor.",
    knowledgeTest: [
      {
        question: "Welche Formulierung drückt eine höfliche Empfehlung aus?",
        options: ["Unternehmen sollten Werbung klar kennzeichnen.", "Unternehmen kennzeichnen Werbung!", "Unternehmen haben Werbung gekennzeichnet.", "Unternehmen werden Werbung kennzeichnen."],
        answer: "Unternehmen sollten Werbung klar kennzeichnen.",
        explanation: "Die Form sollten formuliert eine Empfehlung sachlich und weniger direkt.",
      },
      {
        question: "Welches Redemittel leitet ein Gegenargument ein?",
        options: ["Dagegen ließe sich einwenden, dass ...", "Daraus folgt, dass ...", "Ein entscheidender Aspekt ist ...", "Zusammenfassend ist ..."],
        answer: "Dagegen ließe sich einwenden, dass ...",
        explanation: "Die Formulierung kündigt einen Einwand gegen die vorherige Position an.",
      },
      {
        question: "Welche Formulierung beschreibt eine hypothetische Folge?",
        options: ["Dies hätte zur Folge, dass ...", "Dies hat zur Folge, dass ...", "Dies hatte zur Folge, dass ...", "Dies wird zur Folge haben, dass ..."],
        answer: "Dies hätte zur Folge, dass ...",
        explanation: "Hätte steht im Konjunktiv II und markiert eine mögliche oder hypothetische Folge.",
      },
      {
        question: "Welche Formulierung eignet sich für eine ausgewogene Lösung?",
        options: ["Eine tragfähige Lösung wäre ...", "Alle Werbung ist schlecht.", "Man muss das einfach verbieten.", "Es gibt überhaupt kein Problem."],
        answer: "Eine tragfähige Lösung wäre ...",
        explanation: "Die Formulierung leitet einen sachlichen und abgewogenen Lösungsvorschlag ein.",
      },
    ],
  },
  speakingTaskType: "C1 consumption and advertising discussion",
  speakingTopic: "Sprechen: Wie stark beeinflusst Werbung unser Konsumverhalten, und wie sollte Verantwortung zwischen Unternehmen, Plattformen, Politik und Verbrauchern verteilt werden?",
  speakingBuilder: {
    branches: [
      { id: "strategien", title: "Werbestrategien", keywords: ["Emotionen", "Rabatte", "Influencer", "Markenimage", "Knappheit"] },
      { id: "digital", title: "Personalisierte Werbung", keywords: ["Daten", "Algorithmen", "Tracking", "Zielgruppen", "Transparenz"] },
      { id: "wirkung", title: "Wirkung auf Kaufentscheidungen", keywords: ["Bedürfnisse", "Impulskäufe", "sozialer Druck", "Gewohnheiten", "Verschuldung"] },
      { id: "unternehmen", title: "Verantwortung der Unternehmen", keywords: ["Kennzeichnung", "Wahrheit", "Nachhaltigkeit", "Kinder", "Selbstkontrolle"] },
      { id: "verbraucher", title: "Verantwortung der Verbraucher", keywords: ["Medienkompetenz", "Vergleich", "Budget", "Bedarf", "bewusster Konsum"] },
      { id: "regeln", title: "Regulierung und Schutz", keywords: ["Datenschutz", "Werbeverbote", "Altersgrenzen", "Kontrolle", "Beschwerden"] },
    ],
  },
  writingTaskType: "C1 opinion essay / Stellungnahme",
  writingTopic: "Schreiben: Sollte personalisierte Werbung stärker reguliert werden? Verfassen Sie eine C1-Stellungnahme. Erklären Sie, warum personalisierte Werbung für Unternehmen und Verbraucher relevant ist. Beschreiben Sie anhand eines konkreten Beispiels, wie Daten oder Werbestrategien eine Kaufentscheidung beeinflussen können. Nennen Sie einen Einwand gegen strengere Regeln. Entwickeln Sie eine ausgewogene Lösung, die Transparenz, Datenschutz, wirtschaftliche Interessen und Medienkompetenz berücksichtigt.",
  writingBuilder: {
    structure: [
      "Einleitung und klare Grundposition",
      "Bedeutung und Wirkung personalisierter Werbung",
      "Konkretes Beispiel einer beeinflussten Kaufentscheidung",
      "Einwand gegen strengere Regulierung",
      "Ausgewogene Lösung und Schlussurteil",
    ],
    usefulLines: [
      "Meines Erachtens sollte personalisierte Werbung transparenter gestaltet werden.",
      "Ein entscheidender Aspekt ist die Nutzung persönlicher Daten zur gezielten Ansprache.",
      "Dagegen ließe sich einwenden, dass passende Werbung auch einen praktischen Nutzen haben könnte.",
      "Plattformen müssten verständliche Kontrollmöglichkeiten anbieten.",
      "Eine tragfähige Lösung wäre die Verbindung klarer Regeln mit stärkerer Medienbildung.",
    ],
  },
  tasks: {
    speaking: "Sprich 2 Minuten über den Einfluss von Werbung und verteile Verantwortung zwischen den beteiligten Akteuren.",
    writing: "Schreibe 200–240 Wörter als C1-Stellungnahme zur Regulierung personalisierter Werbung.",
    reading: "Analysiere einen Text oder eine Werbeanzeige und notiere Zielgruppe, Strategie, Wirkung und mögliche Kritik.",
    listening: "Höre einen Beitrag über Konsumtrends oder digitale Werbung und fasse Positionen, Beispiele und Empfehlungen zusammen.",
  },
  vocabulary: ["Kaufentscheidung", "Zielgruppe", "Tracking", "Impulskauf", "Kennzeichnung", "Medienkompetenz", "Verbraucherschutz"],
});

export default c1Day9KonsumUndWerbung;
