const support = {
  16: {
    question: "Welche Chancen und Risiken bringt die Digitalisierung im Alltag?",
    branches: [
      { id: "chancen", title: "Chancen", prompt: "Wo erleichtern digitale Werkzeuge den Alltag?", keywords: ["Zeit sparen", "Online-Dienste", "Kommunikation", "Zugang"], example: "Digitale Dienste können Behördengänge oder Bankgeschäfte vereinfachen, weil viele Aufgaben online erledigt werden können.", starter: "Ein wichtiger Vorteil besteht darin, dass ..." },
      { id: "risiken", title: "Risiken", prompt: "Welche Probleme können entstehen?", keywords: ["Datenschutz", "Abhängigkeit", "Betrug", "Daten"], example: "Andererseits können persönliche Daten missbraucht werden, wenn Plattformen nicht ausreichend geschützt sind.", starter: "Andererseits sollte berücksichtigt werden, dass ..." },
      { id: "passiv", title: "Digitale Prozesse", prompt: "Wie kannst du Prozesse sachlich beschreiben?", keywords: ["gespeichert", "verarbeitet", "automatisiert", "geschützt"], example: "Viele Daten werden automatisch gespeichert und verarbeitet. Deshalb müssen sie zuverlässig geschützt werden.", starter: "Dabei werden ..." },
      { id: "loesung", title: "Lösung", prompt: "Wie kann Digitalisierung verantwortungsvoll genutzt werden?", keywords: ["Datenschutz", "Medienkompetenz", "Regeln", "Alternativen"], example: "Eine sinnvolle Lösung wäre, digitale Angebote mit klaren Datenschutzregeln und verständlichen Offline-Alternativen zu verbinden.", starter: "Eine sinnvolle Lösung wäre ..." },
    ],
    quiz: [
      { question: "Welcher Satz steht im Passiv?", options: ["Die App speichert Daten.", "Daten werden gespeichert.", "Die Nutzer speichern Daten.", "Man speichert Daten."], answer: "Daten werden gespeichert.", explanation: "werden + Partizip II bildet hier das Vorgangspassiv." },
      { question: "Welche Nominalisierung passt zu speichern?", options: ["die Speicherung", "das Speicher", "der Gespeichert", "die Speichern"], answer: "die Speicherung", explanation: "Die feste Nominalisierung lautet die Speicherung." },
      { question: "Welche Form ist richtig?", options: ["Die Daten müssen geschützt werden.", "Die Daten müssen werden geschützt.", "Die Daten geschützt müssen werden.", "Die Daten werden müssen geschützt."], answer: "Die Daten müssen geschützt werden.", explanation: "Beim Modalpassiv steht das Partizip II vor werden am Satzende." },
      { question: "Welche Formulierung ist sachlicher?", options: ["Apps machen vieles.", "Die Nutzung digitaler Dienste kann Prozesse vereinfachen.", "Digital ist cool.", "Alle nutzen Apps."], answer: "Die Nutzung digitaler Dienste kann Prozesse vereinfachen.", explanation: "Nominalisierung und präzise Wortwahl wirken sachlicher." },
    ],
  },
  17: {
    question: "Wie kann Mobilität in Städten verbessert werden, ohne die Lebensqualität zu verschlechtern?",
    branches: [
      { id: "vergleich", title: "Verkehrsmittel vergleichen", prompt: "Welche Verkehrsmittel sind in Städten sinnvoll?", keywords: ["Bahn", "Bus", "Fahrrad", "Auto"], example: "Im Vergleich zum Auto benötigt die Straßenbahn weniger Platz pro Person und verursacht in der Innenstadt weniger Stau.", starter: "Im Vergleich zu ..." },
      { id: "stadt", title: "Stadtplanung", prompt: "Welche Infrastruktur braucht eine gute Stadt?", keywords: ["Radwege", "Haltestellen", "Fußwege", "Parkplätze"], example: "Je besser Radwege und öffentlicher Nahverkehr ausgebaut sind, desto leichter können Menschen auf das Auto verzichten.", starter: "Je besser ... desto ..." },
      { id: "land", title: "Unterschiede", prompt: "Gilt dieselbe Lösung überall?", keywords: ["Innenstadt", "Vorort", "Land", "Entfernung"], example: "Während der Nahverkehr in Großstädten dicht sein kann, bleibt das Auto in ländlichen Gebieten häufig wichtiger.", starter: "Während ..." },
      { id: "loesung", title: "Ausgewogene Lösung", prompt: "Wie lassen sich verschiedene Bedürfnisse verbinden?", keywords: ["Park-and-Ride", "Taktung", "Sicherheit", "Kosten"], example: "Eine ausgewogene Lösung kombiniert günstigen Nahverkehr mit sicheren Radwegen und Park-and-Ride-Angeboten.", starter: "Eine ausgewogene Lösung wäre ..." },
    ],
    quiz: [
      { question: "Welche Form ist richtig?", options: ["im Vergleich zu dem Auto", "im Vergleich zum Auto", "im Vergleich den Auto", "im Vergleich der Auto"], answer: "im Vergleich zum Auto", explanation: "zu + dem wird zu zum." },
      { question: "Welche lokale Präposition passt? Wir fahren ___ Innenstadt.", options: ["in die", "an der", "auf den", "bei dem"], answer: "in die", explanation: "Bei einer Richtung in einen Bereich steht in + Akkusativ." },
      { question: "Welche Struktur ist korrekt?", options: ["Je besser der Nahverkehr ist, desto weniger Autos werden gebraucht.", "Je der Nahverkehr besser, desto weniger Autos.", "Desto besser, je weniger Autos.", "Je besser ist der Nahverkehr, desto Autos weniger."], answer: "Je besser der Nahverkehr ist, desto weniger Autos werden gebraucht.", explanation: "Je ... desto verbindet zwei Vergleichsentwicklungen." },
      { question: "Welcher Satz vergleicht zwei Situationen?", options: ["Während die Innenstadt gut angebunden ist, fahren auf dem Land weniger Busse.", "Die Innenstadt ist groß.", "Busse fahren.", "Autos kosten Geld."], answer: "Während die Innenstadt gut angebunden ist, fahren auf dem Land weniger Busse.", explanation: "während kann zwei unterschiedliche Situationen gegenüberstellen." },
    ],
  },
  18: {
    question: "Welche Maßnahmen zum Klimaschutz sind wirksam und realistisch?",
    branches: [
      { id: "bedingung", title: "Bedingungen", prompt: "Wann ändern Menschen ihr Verhalten?", keywords: ["wenn", "sofern", "Kosten", "Alternativen"], example: "Wenn öffentliche Verkehrsmittel zuverlässig und bezahlbar sind, nutzen mehr Menschen sie im Alltag.", starter: "Wenn ..." },
      { id: "folge", title: "Folgen", prompt: "Welche Wirkung haben Maßnahmen?", keywords: ["sodass", "dadurch", "Emissionen", "Energie"], example: "Gebäude können besser gedämmt werden, sodass langfristig weniger Energie verbraucht wird.", starter: "Dies führt dazu, dass ..." },
      { id: "verantwortung", title: "Verantwortung", prompt: "Wer sollte handeln?", keywords: ["Bürger", "Unternehmen", "Regierung", "Kommunen"], example: "Klimaschutz funktioniert besser, wenn nicht nur Einzelne, sondern auch Unternehmen und Politik Verantwortung übernehmen.", starter: "Verantwortung tragen sowohl ... als auch ..." },
      { id: "grenzen", title: "Grenzen", prompt: "Warum sind manche Lösungen schwierig?", keywords: ["Kosten", "Infrastruktur", "Akzeptanz", "Zeit"], example: "Manche Maßnahmen sind teuer. Deshalb sollte ihre Einführung schrittweise erfolgen und sozial abgefedert werden.", starter: "Allerdings sollte berücksichtigt werden, dass ..." },
    ],
    quiz: [
      { question: "Welche Konjunktion drückt eine Bedingung aus?", options: ["wenn", "obwohl", "deshalb", "während"], answer: "wenn", explanation: "wenn kann eine Bedingung einleiten." },
      { question: "Welche Struktur drückt eine Folge aus?", options: ["sodass", "sofern", "obwohl", "bevor"], answer: "sodass", explanation: "sodass leitet eine Konsequenz ein." },
      { question: "Welche Wortstellung ist richtig?", options: ["Wenn Energie gespart wird, sinken die Kosten.", "Wenn wird Energie gespart, die Kosten sinken.", "Wenn Energie wird gespart, sinken Kosten.", "Wenn Energie gespart, werden sinken Kosten."], answer: "Wenn Energie gespart wird, sinken die Kosten.", explanation: "Im Nebensatz steht das konjugierte Verb am Ende." },
      { question: "Welche Formulierung verbindet Maßnahme und Folge?", options: ["Die Stadt baut Radwege, sodass mehr Menschen sicher Rad fahren können.", "Die Stadt baut Radwege obwohl mehr Menschen.", "Die Stadt baut Radwege wenn deshalb.", "Radwege die Stadt."], answer: "Die Stadt baut Radwege, sodass mehr Menschen sicher Rad fahren können.", explanation: "sodass verbindet eine Maßnahme mit ihrer Folge." },
    ],
  },
  19: {
    question: "Warum engagieren sich Menschen freiwillig, und wie kann Ehrenamt gefördert werden?",
    branches: [
      { id: "motivation", title: "Motivation", prompt: "Warum engagieren sich Menschen?", keywords: ["helfen", "Kontakte", "Erfahrung", "Verantwortung"], example: "Viele Menschen engagieren sich, weil sie anderen helfen und gleichzeitig neue Erfahrungen sammeln möchten.", starter: "Ein wichtiger Grund besteht darin, dass ..." },
      { id: "zweck", title: "Zweck", prompt: "Was möchten Projekte erreichen?", keywords: ["um ... zu", "damit", "Unterstützung", "Zusammenhalt"], example: "Vereine organisieren Projekte, um Nachbarn zu unterstützen und den sozialen Zusammenhalt zu stärken.", starter: "Viele Initiativen arbeiten daran, um ..." },
      { id: "vorteile", title: "Vorteile", prompt: "Was bringt Ehrenamt der Gesellschaft?", keywords: ["Zusammenhalt", "Netzwerk", "Hilfe", "Teilhabe"], example: "Ehrenamt kann dazu beitragen, dass Menschen verschiedener Gruppen miteinander in Kontakt kommen.", starter: "Ehrenamt trägt dazu bei, dass ..." },
      { id: "foerderung", title: "Förderung", prompt: "Wie kann Engagement erleichtert werden?", keywords: ["Freistellung", "Information", "Anerkennung", "flexible Zeiten"], example: "Unternehmen könnten flexible Freistellungen anbieten, damit Beschäftigte leichter an sozialen Projekten teilnehmen können.", starter: "Eine mögliche Maßnahme wäre ..." },
    ],
    quiz: [
      { question: "Welche Struktur drückt einen Zweck bei gleichem Subjekt aus?", options: ["um ... zu", "obwohl", "deshalb", "während"], answer: "um ... zu", explanation: "um ... zu wird typischerweise bei gleichem Subjekt verwendet." },
      { question: "Welche Form ist richtig?", options: ["Der Verein sammelt Geld, um Familien zu unterstützen.", "Der Verein sammelt Geld, um Familien unterstützt.", "Der Verein sammelt Geld, damit Familien zu unterstützen.", "Der Verein sammelt Geld, weil unterstützen Familien."], answer: "Der Verein sammelt Geld, um Familien zu unterstützen.", explanation: "Nach um steht zu + Infinitiv." },
      { question: "Welche Konjunktion passt bei verschiedenen Subjekten?", options: ["damit", "um", "trotz", "dennoch"], answer: "damit", explanation: "damit eignet sich besonders bei unterschiedlichen Subjekten." },
      { question: "Welche Aussage nennt Grund und Nutzen?", options: ["Menschen engagieren sich, weil sie helfen möchten, und stärken dadurch den Zusammenhalt.", "Menschen engagieren.", "Ehrenamt gut.", "Vereine existieren."], answer: "Menschen engagieren sich, weil sie helfen möchten, und stärken dadurch den Zusammenhalt.", explanation: "Der Satz verbindet Motivation und gesellschaftliche Wirkung." },
    ],
  },
  20: {
    question: "Wie verändert Technologie die Arbeitswelt, und welche Kompetenzen werden künftig wichtiger?",
    branches: [
      { id: "automatisierung", title: "Automatisierung", prompt: "Welche Aufgaben können automatisiert werden?", keywords: ["Routineaufgaben", "Produktion", "Verwaltung", "KI"], example: "Wiederkehrende Aufgaben können automatisiert werden, sodass Beschäftigte mehr Zeit für komplexe Tätigkeiten haben.", starter: "In Zukunft können ... automatisiert werden." },
      { id: "risiken", title: "Risiken", prompt: "Welche Probleme können entstehen?", keywords: ["Arbeitsplätze", "Unsicherheit", "Kontrolle", "Abhängigkeit"], example: "Wenn Unternehmen zu viele Tätigkeiten automatisieren, können bestimmte Arbeitsplätze unter Druck geraten.", starter: "Ein mögliches Risiko besteht darin, dass ..." },
      { id: "kompetenzen", title: "Neue Kompetenzen", prompt: "Was müssen Beschäftigte lernen?", keywords: ["digitale Fähigkeiten", "Problemlösen", "Kommunikation", "Weiterbildung"], example: "Digitale Fähigkeiten müssen regelmäßig erweitert werden, damit Beschäftigte mit technischen Veränderungen Schritt halten können.", starter: "Künftig werden besonders ... benötigt." },
      { id: "loesung", title: "Weiterbildung", prompt: "Wie können Unternehmen reagieren?", keywords: ["Schulung", "Freistellung", "Praxis", "lebenslanges Lernen"], example: "Unternehmen sollten regelmäßige Weiterbildung anbieten, damit neue Technologien sicher und effizient eingesetzt werden können.", starter: "Eine sinnvolle Maßnahme wäre ..." },
    ],
    quiz: [
      { question: "Welche Form ist Modalpassiv?", options: ["Aufgaben können automatisiert werden.", "Aufgaben automatisieren.", "Aufgaben können automatisieren.", "Automatisiert Aufgaben werden."], answer: "Aufgaben können automatisiert werden.", explanation: "Modalverb + Partizip II + werden bildet das Modalpassiv." },
      { question: "Welche Zukunftsform ist korrekt?", options: ["Viele Berufe werden sich verändern.", "Viele Berufe werden verändern sich.", "Viele Berufe sich werden verändern.", "Viele Berufe verändert werden sich."], answer: "Viele Berufe werden sich verändern.", explanation: "werden + Infinitiv kann Zukunft ausdrücken; das Reflexivpronomen steht vor dem Infinitiv." },
      { question: "Welche Aussage ist ausgewogen?", options: ["KI ist immer gut.", "KI ist immer schlecht.", "KI kann Routineaufgaben erleichtern, gleichzeitig sind Weiterbildung und klare Regeln nötig.", "Technologie ersetzt alle Menschen."], answer: "KI kann Routineaufgaben erleichtern, gleichzeitig sind Weiterbildung und klare Regeln nötig.", explanation: "Die Aussage nennt Chance und notwendige Bedingung." },
      { question: "Welche Form ist richtig?", options: ["Neue Kompetenzen müssen erworben werden.", "Neue Kompetenzen müssen erwerben werden.", "Neue Kompetenzen werden müssen erwerben.", "Neue Kompetenzen müssen werden erworben."], answer: "Neue Kompetenzen müssen erworben werden.", explanation: "Im Modalpassiv steht Partizip II + werden am Ende." },
    ],
  },
};

export const enhanceB2Day16To20Lesson = (lesson) => {
  const extra = support[Number(lesson?.day || 0)];
  if (!extra) return lesson;
  return {
    ...lesson,
    grammarLesson: { ...(lesson.grammarLesson || {}), knowledgeTest: extra.quiz },
    speakingBuilder: { ...(lesson.speakingBuilder || {}), question: extra.question, branches: extra.branches },
  };
};

export { support as B2_DAYS_16_TO_20_SUPPORT };
