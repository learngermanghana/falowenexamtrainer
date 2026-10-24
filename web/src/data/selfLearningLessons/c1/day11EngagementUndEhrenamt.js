import { makeLesson } from "../buildSelfLearningLesson";

const c1Day11EngagementUndEhrenamt = makeLesson({
  level: "C1",
  day: 11,
  chapter: "3.1",
  title: "Engagement und Ehrenamt",
  topic: "Freiwilligenarbeit, gesellschaftliche Verantwortung, Motivation und nachhaltige Unterstützung beurteilen",
  heroImage: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1600&q=80",
  videoResource: {
    title: "C1 Day 11 · Engagement und Ehrenamt · AI video",
    description: "AI explanation for C1 Day 11, Chapter 3.1: volunteering, social responsibility, motivation, obstacles and sustainable support.",
    url: "https://youtu.be/F67RRmGNK1c",
  },
  grammarFocus: "Textverknüpfung mit Konnektoren: Argumente, Gegensätze, Folgen, Ziele und Schlussfolgerungen kohärent verbinden",
  objectives: [
    "Ich kann die gesellschaftliche Bedeutung ehrenamtlichen Engagements differenziert erklären.",
    "Ich kann additive, kontrastive, kausale, konsekutive, konditionale und finale Konnektoren korrekt verwenden.",
    "Ich kann die Wortstellung nach Konjunktionen, Subjunktionen und adverbialen Konnektoren unterscheiden.",
    "Ich kann einen C1-Diskussionsbeitrag mit Gegenposition und konkreten Fördermaßnahmen verfassen.",
  ],
  explanation: [
    "Ehrenamt stärkt lokale Gemeinschaften und gesellschaftliche Teilhabe. Viele Initiativen leiden jedoch unter Zeitmangel, fehlender Anerkennung, Personalknappheit und unsicherer Finanzierung.",
    "Präzise Konnektoren zeigen, ob eine Aussage ergänzt, begründet, eingeschränkt, konkretisiert oder aus einer anderen Aussage abgeleitet wird.",
    "Die Schreibaufgabe ist ein Diskussionsbeitrag darüber, warum freiwillige Tätigkeiten wichtiger werden und wie mehr Menschen nachhaltig gewonnen werden können.",
  ],
  grammarLesson: {
    title: "Textverknüpfung mit Konnektoren",
    explanation: [
      "Konnektoren verbinden Sätze und Absätze und machen logische Beziehungen sichtbar.",
      "Konjunktionen wie denn und aber verbinden Hauptsätze. Subjunktionen wie weil, obwohl und damit leiten Nebensätze mit Verbendstellung ein. Nach adverbialen Konnektoren wie außerdem, dennoch und deshalb folgt das finite Verb.",
      "Entscheidend ist nicht die Menge, sondern die passende Funktion des Konnektors.",
    ],
    rules: [
      "Addition: außerdem, darüber hinaus, zudem, nicht nur ... sondern auch.",
      "Gegensatz: allerdings, jedoch, dennoch, obwohl, zwar ... aber.",
      "Grund: weil, da, denn, aufgrund.",
      "Folge: deshalb, daher, folglich, sodass.",
      "Bedingung und Ziel: wenn, falls, sofern, damit, um ... zu.",
      "Zusammenfassung: abschließend, zusammenfassend, insgesamt.",
    ],
    examples: [
      "Viele Menschen möchten helfen; allerdings fehlen ihnen feste Zeitfenster.",
      "Ehrenamt stärkt nicht nur den Zusammenhalt, sondern vermittelt auch neue Kompetenzen.",
      "Da viele Vereine unter Personalmangel leiden, können manche Angebote nicht fortgeführt werden.",
      "Städte könnten Räume bereitstellen, sodass Initiativen langfristiger planen könnten.",
      "Vereine bieten Schnuppertage an, damit Interessierte Aufgaben kennenlernen können.",
    ],
    miniExercise: "Verbinde sinnvoll: 1) Viele möchten helfen. Sie haben wenig Zeit. Nutze allerdings. 2) Vereine brauchen Personal. Angebote fallen aus. Nutze sodass. 3) Schulen informieren. Mehr Jugendliche sollen teilnehmen. Nutze damit. 4) Ehrenamt kostet Zeit. Es stärkt die Gemeinschaft. Nutze zwar ... aber.",
    knowledgeTest: [
      { question: "Welcher Konnektor drückt einen Gegensatz aus?", options: ["allerdings", "deshalb", "außerdem", "damit"], answer: "allerdings", explanation: "Allerdings schränkt eine vorherige Aussage ein." },
      { question: "Welche Wortstellung ist korrekt?", options: ["Es fehlen Helfer; deshalb müssen Kurse ausfallen.", "Es fehlen Helfer; deshalb Kurse müssen ausfallen.", "Es fehlen Helfer; deshalb ausfallen müssen Kurse.", "Es fehlen Helfer; deshalb die Kurse ausfallen müssen."], answer: "Es fehlen Helfer; deshalb müssen Kurse ausfallen.", explanation: "Nach deshalb steht das finite Verb auf Position zwei." },
      { question: "Welche Struktur drückt ein Ziel aus?", options: ["damit mehr Menschen teilnehmen", "obwohl mehr Menschen teilnehmen", "deshalb mehr Menschen teilnehmen", "aufgrund mehr Menschen teilnehmen"], answer: "damit mehr Menschen teilnehmen", explanation: "Damit leitet einen finalen Nebensatz ein." },
      { question: "Welcher Ausdruck ergänzt einen weiteren Aspekt?", options: ["darüber hinaus", "dennoch", "folglich", "sofern"], answer: "darüber hinaus", explanation: "Darüber hinaus ist ein additiver Konnektor." },
    ],
  },
  speakingTaskType: "C1 volunteering discussion",
  speakingTopic: "Sprechen: Warum ist ehrenamtliches Engagement für eine Gesellschaft wichtig, und wie kann man mehr Menschen langfristig dazu motivieren?",
  speakingBuilder: {
    branches: [
      { id: "bedeutung", title: "Gesellschaftliche Bedeutung", keywords: ["Zusammenhalt", "Solidarität", "Teilhabe", "Demokratie", "lokale Hilfe"], prompt: "Welche konkrete gesellschaftliche Lücke kann Ehrenamt schließen, ohne staatliche Verantwortung zu ersetzen?", example: "Ehrenamt kann den sozialen Zusammenhalt stärken, weil Freiwillige niedrigschwellige Angebote schaffen. Ein konkretes Beispiel sind Lernpatenschaften für Jugendliche; dadurch erhalten Familien zusätzliche Unterstützung, ohne dass Schulen aus ihrer Verantwortung entlassen werden.", starter: "Ein wesentlicher gesellschaftlicher Beitrag des Ehrenamts besteht darin, dass ..." },
      { id: "motive", title: "Persönliche Motive", keywords: ["Verantwortung", "Sinn", "Kontakte", "Erfahrung", "Kompetenzen"], prompt: "Warum engagieren sich Menschen freiwillig, obwohl sie dafür meist nicht bezahlt werden?", example: "Viele Menschen engagieren sich, weil sie gesellschaftlich etwas bewirken und zugleich eigene Kompetenzen erweitern möchten. Wer beispielsweise einen Jugendverein unterstützt, sammelt Organisationserfahrung und baut neue soziale Kontakte auf.", starter: "Aus individueller Sicht kann ehrenamtliches Engagement attraktiv sein, weil ..." },
      { id: "bereiche", title: "Einsatzbereiche", keywords: ["Bildung", "Soziales", "Sport", "Umwelt", "Katastrophenhilfe"], prompt: "In welchem Bereich lässt sich der Nutzen freiwilliger Arbeit besonders anschaulich zeigen?", example: "Im Bildungsbereich können Freiwillige zusätzliche Lernangebote organisieren. Dadurch werden Lehrkräfte zwar nicht ersetzt, doch Schülerinnen und Schüler erhalten mehr Möglichkeiten, Lernrückstände gezielt aufzuarbeiten.", starter: "Ein anschauliches Beispiel aus dem Bereich ... zeigt, dass ..." },
      { id: "hindernisse", title: "Hindernisse", keywords: ["Zeitmangel", "Belastung", "Bürokratie", "fehlende Anerkennung", "Kosten"], prompt: "Welche Hürde hält Menschen trotz grundsätzlicher Bereitschaft vom Engagement ab?", example: "Zeitmangel ist besonders relevant, da viele Berufstätige familiäre und berufliche Verpflichtungen miteinander vereinbaren müssen. Starre Einsatzzeiten können deshalb dazu führen, dass Interessierte ihr Engagement nach kurzer Zeit wieder aufgeben.", starter: "Kritisch zu berücksichtigen ist jedoch, dass ..." },
      { id: "motivation", title: "Motivation neuer Freiwilliger", keywords: ["Schnuppertage", "flexible Aufgaben", "Information", "Vorbilder", "Jugendliche"], prompt: "Welche Maßnahme könnte neue Freiwillige gewinnen, ohne zusätzlichen Druck zu erzeugen?", example: "Flexible Aufgabenmodelle könnten den Einstieg erleichtern. Wenn Interessierte zunächst an einem Schnuppertag teilnehmen und anschließend kleine, klar begrenzte Aufgaben übernehmen, sinkt die Hemmschwelle für ein langfristiges Engagement.", starter: "Um neue Freiwillige zu gewinnen, wäre es sinnvoll, ..." },
      { id: "unterstuetzung", title: "Rahmenbedingungen", keywords: ["Räume", "Finanzierung", "Versicherung", "Fortbildung", "Anerkennung"], prompt: "Welche Unterstützung brauchen Organisationen, damit Ehrenamt dauerhaft funktioniert?", example: "Freiwillige benötigen verlässliche Rahmenbedingungen. Kommunen könnten beispielsweise Räume und Fortbildungen finanzieren, sodass Vereine ihre Angebote langfristig planen und Ehrenamtliche fachlich besser unterstützen können.", starter: "Eine nachhaltige Förderung setzt voraus, dass ..." },
    ],
    plan: [
      "Einleitung: Definiere kurz, warum Ehrenamt gesellschaftlich relevant ist.",
      "Hauptargument: Entwickle einen Nutzen mit Grund, konkretem Beispiel und Folge.",
      "Gegenperspektive: Zeige eine Grenze, zum Beispiel Zeitmangel oder die Gefahr der Verlagerung staatlicher Aufgaben.",
      "Lösung: Nenne realistische Rahmenbedingungen oder Anreize.",
      "Schluss: Formuliere eine klare, ausgewogene Position.",
    ],
    starters: ["Darüber hinaus ist zu berücksichtigen, dass ...", "Allerdings darf nicht übersehen werden, dass ...", "Eine tragfähige Lösung wäre ...", "Zusammenfassend lässt sich festhalten, dass ..."],
  },
  writingTaskType: "C1 discussion post / Diskussionsbeitrag",
  writingTopic: "Schreiben: Warum werden freiwillige Tätigkeiten für unsere Gesellschaft immer wichtiger? Verfassen Sie einen C1-Diskussionsbeitrag. Erklären Sie die gesellschaftliche Relevanz. Beschreiben Sie Vorteile für Einzelne und Gemeinschaft. Analysieren Sie Hindernisse. Berücksichtigen Sie den Einwand, staatliche Aufgaben könnten auf Freiwillige verlagert werden. Entwickeln Sie konkrete Fördervorschläge.",
  writingBuilder: {
    structure: ["Einleitung und Grundposition", "Gesellschaftliche Bedeutung und Vorteile", "Hindernisse mit Beispiel", "Einwand und staatliche Verantwortung", "Fördermaßnahmen und Schlussurteil"],
    usefulLines: ["Ehrenamt gewinnt zunehmend an Bedeutung, da ...", "Darüber hinaus profitieren auch die Engagierten selbst, indem ...", "Viele Menschen wären bereit zu helfen; allerdings ...", "Dagegen lässt sich einwenden, dass freiwillige Arbeit staatliche Leistungen nicht ersetzen dürfe.", "Eine nachhaltige Förderung wäre möglich, sofern Organisationen verlässliche Rahmenbedingungen erhalten."],
  },
  tasks: { speaking: "Sprich 2 Minuten über Bedeutung, Hindernisse und Förderung ehrenamtlichen Engagements.", writing: "Schreibe 200–240 Wörter als C1-Diskussionsbeitrag über Engagement und Ehrenamt.", reading: "Lies einen Text über freiwilliges Engagement und notiere Motive, Hindernisse, Wirkungen und Fördervorschläge.", listening: "Höre ein Interview mit Ehrenamtlichen und fasse Erfahrungen, Herausforderungen und Empfehlungen zusammen." },
  resources: { grammarBook: { title: "C1 Day 11 grammar notes", url: "/campus/course/c1-day-11-engagement-und-ehrenamt-grammar-notes" }, workbook: { title: "C1 Day 11 workbook", url: "/campus/course/c1-day-11-engagement-und-ehrenamt-workbook" } },
  vocabulary: ["Ehrenamt", "Freiwilligenarbeit", "Anerkennung", "Gemeinwohl", "Zivilgesellschaft", "Förderung", "Rahmenbedingungen"],
});

export default c1Day11EngagementUndEhrenamt;
