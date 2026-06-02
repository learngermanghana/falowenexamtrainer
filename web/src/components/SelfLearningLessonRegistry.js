import React from "react";
import SelfLearningEditableLessonPage from "./SelfLearningEditableLessonPage";

const makeLesson = ({ level, day, chapter, title, topic, grammarFocus, objectives, explanation, phrases, tasks, vocabulary }) => ({
  level,
  day,
  chapter,
  title,
  topic,
  grammarFocus,
  objectives,
  explanation,
  phrases,
  tasks,
  vocabulary,
});

const c1Base = [
  [1, "1.1", "Ziele und Lernweg", "C1-Selbstlernen verstehen und realistische Ziele setzen", "Strukturgeber, Begründungen und formelle Zielsetzung", ["Ich kann meinen C1-Lernweg erklären.", "Ich kann konkrete Lernziele formulieren.", "Ich kann AI-Feedback für Selbstkorrektur nutzen."], ["C1 bedeutet nicht nur mehr Wörter. Auf C1 musst du Gedanken klar ordnen, Argumente begründen und deine Sprache bewusst verbessern.", "In diesem Kurs arbeitest du ohne Tutor-Upload. Du lernst zuerst, übst mit Falowen AI, liest Feedback und markierst dich selbst ehrlich."], ["Mein Ziel besteht darin, ...", "Für mich ist besonders wichtig, dass ...", "In den nächsten Wochen möchte ich ... verbessern."], ["Sprich 90–120 Sekunden über deine C1-Ziele und deinen Lernplan.", "Schreibe 180–220 Wörter: Mein C1-Lernweg: Ausgangspunkt, Motivation und konkreter Plan.", "Lies einen Text über Lernstrategien und notiere fünf Strategien.", "Höre einen Beitrag über selbstständiges Lernen und fasse ihn zusammen."], ["Lernziel", "Lernweg", "Selbstreflexion", "Fortschritt", "Feedback", "realistisch"]],
  [2, "1.2", "Kultur und Identität", "Kulturelle Prägung, Zugehörigkeit und Selbstverständnis", "Relativsätze und präzise Nominalgruppen", ["Ich kann kulturelle Einflüsse differenziert beschreiben.", "Ich kann Identität mit Beispielen erklären.", "Ich kann persönliche und gesellschaftliche Perspektiven verbinden."], ["Identität entsteht durch Herkunft, Sprache, Erfahrungen, Werte und soziale Umgebung.", "Auf C1 solltest du nicht nur erzählen, sondern Zusammenhänge erklären und Beispiele sinnvoll einordnen."], ["Ein Aspekt, der meine Identität geprägt hat, ist ...", "Dabei spielt ... eine zentrale Rolle.", "Aus meiner Sicht zeigt sich das besonders daran, dass ..."], ["Sprich über Kultur und persönliche Identität.", "Schreibe einen Meinungsaufsatz über kulturelle Identität in einer globalisierten Welt.", "Lies einen Text über Kulturwandel und markiere Hauptthese und Gegenargument.", "Höre ein Interview über Zugehörigkeit und fasse die Position zusammen."], ["Identität", "Zugehörigkeit", "Werte", "Herkunft", "Perspektive", "Prägung"]],
  [3, "1.3", "Medien und Informationskompetenz", "Nachrichten, Quellenkritik und digitale Verantwortung", "Indirekte Rede und Quellenwiedergabe", ["Ich kann Informationen kritisch bewerten.", "Ich kann Quellen und Meinungen unterscheiden.", "Ich kann Medienargumente strukturiert wiedergeben."], ["Informationskompetenz bedeutet, Inhalte nicht sofort zu glauben, sondern Quelle, Absicht und Belege zu prüfen.", "C1-Antworten brauchen klare Distanz: Wer behauptet was, mit welcher Begründung und mit welcher Wirkung?"], ["Die Autorin weist darauf hin, dass ...", "Kritisch zu betrachten ist, ob ...", "Daraus lässt sich schließen, dass ..."], ["Sprich über den Einfluss sozialer Medien auf Meinungsbildung.", "Schreibe eine Erörterung über digitale Nachrichtenquellen.", "Lies einen Kommentar und unterscheide Fakten, Meinung und unbelegte Behauptungen.", "Höre einen Medienbeitrag und notiere Argumente."], ["Quelle", "Glaubwürdigkeit", "Debatte", "Desinformation", "Meinung", "Fakten"]],
  [4, "1.4", "Beziehungen und Teamarbeit", "Kommunikation, Konflikte und Zusammenarbeit", "Kontrastformen und diplomatische Formulierungen", ["Ich kann Teamarbeit analysieren.", "Ich kann Konflikte sachlich beschreiben.", "Ich kann Lösungsvorschläge diplomatisch formulieren."], ["Gute Teamarbeit hängt von klarer Kommunikation, Vertrauen und Rollenverständnis ab.", "Auf C1 solltest du Probleme benennen, ohne zu direkt oder emotional zu wirken."], ["Einerseits ..., andererseits ...", "Ein möglicher Kompromiss wäre, ...", "Es wäre sinnvoll, wenn ..."], ["Sprich über erfolgreiche Teamarbeit.", "Schreibe einen formellen Beitrag über Konfliktlösung.", "Lies einen Text über Zusammenarbeit und notiere Ursache, Folge und Lösung.", "Höre ein Gespräch und notiere Problem, Reaktion und Kompromiss."], ["Zusammenarbeit", "Konflikt", "Kommunikation", "Kompromiss", "Vertrauen", "Rolle"]],
  [5, "1.5", "Berufliche Entwicklung", "Karriere, Weiterbildung und berufliche Ziele", "Finalsätze und Nominalisierungen", ["Ich kann berufliche Ziele begründen.", "Ich kann Weiterbildung sachlich darstellen.", "Ich kann formelle Ziele und Pläne formulieren."], ["Berufliche Entwicklung verlangt klare Ziele und realistische Schritte.", "C1-Sprache klingt stärker, wenn du Verben in nominale Strukturen umwandeln kannst."], ["Zur Verbesserung meiner Chancen ...", "Damit ich langfristig ..., möchte ich ...", "Die Weiterbildung ermöglicht mir, ..."], ["Sprich über berufliche Ziele und nächste Schritte.", "Schreibe einen formellen Brief zur Weiterbildung.", "Lies einen Karriereartikel und notiere Argumente.", "Höre einen Karrierebeitrag und fasse Empfehlungen zusammen."], ["Weiterbildung", "Karriere", "Kompetenz", "Entwicklung", "Bewerbung", "Ziel"]],
  [6, "2.1", "Gesundheit und Lebensstil", "Balance, Prävention und gesellschaftliche Gesundheit", "Kausale und konsekutive Verbindungen", ["Ich kann Ursache und Folge im Gesundheitsthema erklären.", "Ich kann Empfehlungen begründen.", "Ich kann persönliche und gesellschaftliche Ebene verbinden."], ["Gesundheit ist nicht nur ein privates Thema. Arbeit, Umgebung, Stress und Gewohnheiten beeinflussen das Wohlbefinden.", "Auf C1 solltest du Ursachen, Folgen und Lösungen klar verbinden."], ["Dies führt dazu, dass ...", "Eine mögliche Ursache dafür ist ...", "Langfristig könnte das bewirken, dass ..."], ["Sprich über Stress und Gesundheit.", "Schreibe einen Meinungsaufsatz über gesunde Routinen.", "Lies einen Gesundheitstext und markiere Ursache-Folge-Verbindungen.", "Höre einen Expertenbeitrag und notiere Empfehlungen."], ["Prävention", "Belastung", "Routine", "Wohlbefinden", "Stress", "Ausgleich"]],
  [7, "2.2", "Reisen und Nachhaltigkeit", "Mobilität, Tourismus und Verantwortung", "Vergleichsformen und abwägende Argumentation", ["Ich kann Reiseformen vergleichen.", "Ich kann Nachhaltigkeit differenziert bewerten.", "Ich kann Vor- und Nachteile abwägen."], ["Nachhaltiges Reisen bedeutet, Kosten, Komfort, Umwelt und Verantwortung gegeneinander abzuwägen.", "C1-Antworten zeigen beide Seiten und kommen trotzdem zu einer klaren Position."], ["Im Vergleich zu ...", "Während ..., bietet ...", "Trotz dieser Vorteile sollte man bedenken, dass ..."], ["Sprich über nachhaltige Reiseformen.", "Schreibe eine Erörterung über Tourismusregeln.", "Lies einen Text über Massentourismus und notiere Pro/Contra.", "Höre einen Beitrag über nachhaltiges Reisen."], ["Nachhaltigkeit", "Tourismus", "Mobilität", "Emissionen", "Verantwortung", "Reiseziel"]],
  [8, "2.3", "Wohnen und Stadtentwicklung", "Wohnraum, Infrastruktur und Lebensqualität", "Passiv und formelle Sachbeschreibung", ["Ich kann Wohnprobleme sachlich beschreiben.", "Ich kann Maßnahmen und Folgen erklären.", "Ich kann formelle Vorschläge formulieren."], ["Stadtentwicklung betrifft Wohnraum, Verkehr, Grünflächen und soziale Teilhabe.", "Das Passiv hilft dir, sachlich über Maßnahmen zu sprechen, ohne immer die handelnde Person zu nennen."], ["Es wird vorgeschlagen, dass ...", "In vielen Städten wird ... diskutiert.", "Die Lebensqualität könnte verbessert werden, indem ..."], ["Sprich über Wohnprobleme in Städten.", "Schreibe einen formellen Vorschlag zur Wohnsituation.", "Lies einen Stadtentwicklungstext und arbeite Problem/Ursache/Lösung heraus.", "Höre einen Bericht über Mieten und Infrastruktur."], ["Wohnraum", "Miete", "Infrastruktur", "Stadt", "Lebensqualität", "Planung"]],
  [9, "2.4", "Konsum und Werbung", "Kaufentscheidungen, Werbung und Verantwortung", "Konjunktiv II für Empfehlungen und Kritik", ["Ich kann Konsumverhalten analysieren.", "Ich kann Werbung kritisch bewerten.", "Ich kann Empfehlungen diplomatisch formulieren."], ["Werbung beeinflusst nicht nur Kaufentscheidungen, sondern auch Werte und Bedürfnisse.", "Mit Konjunktiv II kannst du Kritik und Vorschläge höflicher und präziser formulieren."], ["Man sollte stärker darauf achten, ...", "Es wäre sinnvoll, wenn ...", "Unternehmen könnten ..."], ["Sprich über Werbung und Konsumverhalten.", "Schreibe einen Meinungsaufsatz über bewussten Konsum.", "Lies einen Text über Werbesprache.", "Höre ein Interview über Konsumtrends."], ["Konsum", "Werbung", "Bedürfnis", "Trend", "Marke", "Entscheidung"]],
  [10, "2.5", "Integration und Gesellschaft", "Teilhabe, Sprache und gesellschaftlicher Zusammenhalt", "Genitiv, Nominalstil und präzise Argumentation", ["Ich kann Integration differenziert erklären.", "Ich kann die Rolle von Sprache diskutieren.", "Ich kann gesellschaftliche Beispiele nutzen."], ["Integration bedeutet nicht nur Anpassung, sondern auch Teilhabe, Rechte, Chancen und gegenseitiges Verständnis.", "Auf C1 solltest du abstrakte Begriffe klar definieren und mit Beispielen verbinden."], ["Die Bedeutung der Sprache zeigt sich darin, dass ...", "Die Förderung der Teilhabe ...", "Aus gesellschaftlicher Sicht ..."], ["Sprich über Sprache und Integration.", "Schreibe eine Erörterung über gesellschaftliche Teilhabe.", "Lies einen Integrationstext und markiere zentrale Begriffe.", "Höre ein Gespräch über Zusammenhalt."], ["Integration", "Teilhabe", "Sprache", "Zusammenhalt", "Vielfalt", "Chancen"]],
];

const extraC1 = [
  [11, "3.1", "Engagement und Ehrenamt", "Freiwilligenarbeit und soziale Verantwortung"],
  [12, "3.2", "Freizeit und Kultur", "Kulturelle Angebote, Erholung und gesellschaftliche Bedeutung"],
  [13, "3.3", "Mehrsprachigkeit", "Sprachenlernen, Identität und Kommunikation"],
  [14, "3.4", "Innovation und Zukunft", "Technologische Entwicklung und gesellschaftlicher Wandel"],
  [15, "3.5", "Bildung und lebenslanges Lernen", "Lernen, Weiterbildung und Chancengleichheit"],
  [16, "4.1", "Technologie im Alltag", "Digitale Werkzeuge, Abhängigkeit und praktische Nutzung"],
  [17, "4.2", "Umwelt und Verantwortung", "Nachhaltigkeit, Klima und persönliches Handeln"],
  [18, "4.3", "Gesellschaft und Zusammenhalt", "Gemeinschaft, Konflikte und Solidarität"],
  [19, "4.4", "Arbeit der Zukunft", "Digitalisierung, neue Kompetenzen und Arbeitsmodelle"],
  [20, "4.5", "Digitale Gesundheit", "Gesundheitsapps, Datenschutz und Chancen"],
  [21, "5.1", "Migration und Teilhabe", "Migrationserfahrungen, Sprache und Chancen"],
  [22, "5.2", "Politik und Mitbestimmung", "Demokratie, Verantwortung und Beteiligung"],
  [23, "5.3", "Freizeit und Work-Life-Balance", "Erholung, Grenzen und Lebensqualität"],
  [24, "5.4", "Mobilität und Infrastruktur", "Verkehr, Planung und öffentlicher Raum"],
  [25, "5.5", "Wissenschaft und Forschung", "Forschung, Fortschritt und gesellschaftlicher Nutzen"],
  [26, "6.1", "Nachhaltiger Konsum", "Kaufverhalten, Ressourcen und Verantwortung"],
  [27, "6.2", "Digitalisierung und Verwaltung", "Online-Services, Bürokratie und Zugang"],
  [28, "6.3", "Review und Transfer", "C1-Themen wiederholen und auf neue Aufgaben übertragen"],
];

const completeC1 = [
  ...c1Base,
  ...extraC1.map(([day, chapter, title, topic]) => [
    day,
    chapter,
    title,
    topic,
    "Präzise Argumentation, Redemittel und Transfer auf C1-Niveau",
    ["Ich kann das Thema strukturiert erklären.", "Ich kann eine eigene Position begründen.", "Ich kann Feedback nutzen und meine Antwort verbessern."],
    [`Dieses Thema hilft dir, C1-Antworten mit mehr Tiefe und Struktur zu entwickeln.`, `Arbeite zuerst mit Beispielen, danach mit Falowen AI und verbessere deine Antwort anhand des Feedbacks.`],
    ["Ein zentraler Punkt ist ...", "Dabei sollte man berücksichtigen, dass ...", "Aus meiner Perspektive lässt sich sagen, dass ..."],
    [`Sprich 2 Minuten über: ${topic}.`, `Schreibe 180–220 Wörter über: ${title}.`, `Lies einen passenden Text zum Thema ${title} und notiere Hauptargumente.`, `Höre einen Beitrag zum Thema ${title} und fasse die Kernaussagen zusammen.`],
    title.split(/\s+|und|\/|-/).filter((word) => word.length > 3).slice(0, 6),
  ]),
];

const b2Base = [
  [1, "1.1", "Persönliche Identität und Selbstverständnis", "Über sich selbst, Werte und persönliche Entwicklung sprechen", "Adjektivdeklination und klare Satzverbindungen", ["Ich kann mich differenziert vorstellen.", "Ich kann Beispiele für mein Selbstverständnis geben.", "Ich kann AI-Feedback zur Verbesserung nutzen."], ["B2 bedeutet, dass du nicht nur einfache Informationen gibst. Du erklärst Gründe, Beispiele und Entwicklungen klarer.", "Bei diesem Thema geht es darum, wer du bist, wie du dich siehst und welche Erfahrungen dich geprägt haben."], ["Ich würde mich als ... beschreiben.", "Eine wichtige Erfahrung für mich war ...", "Heute sehe ich das anders, weil ..."], ["Sprich 2–3 Minuten über deine Identität und prägende Erfahrungen.", "Schreibe 180–220 Wörter: Wer bin ich online – wer bin ich offline?", "Lies einen kurzen Text über digitale Identität und markiere Adjektiv-Nomen-Verbindungen.", "Höre ein Interview über Selbstbild und Fremdbild."], ["Identität", "Selbstbild", "Erfahrung", "authentisch", "soziale Medien", "Entwicklung"]],
  [2, "1.2", "Alltag und Zeitmanagement", "Routinen, Prioritäten und Produktivität beschreiben"],
  [3, "1.3", "Arbeit und Beruf", "Berufliche Erfahrungen, Erwartungen und Zusammenarbeit"],
  [4, "1.4", "Bildung und Lernen", "Lernstrategien, Prüfungen und Weiterbildung"],
  [5, "1.5", "Gesundheit und Wohlbefinden", "Stress, Balance und gesunde Gewohnheiten"],
  [6, "2.1", "Medien und digitale Kommunikation", "Soziale Medien, Datenschutz und Online-Verhalten"],
  [7, "2.2", "Umwelt und Nachhaltigkeit", "Klimaschutz, Konsum und Alltagshandeln"],
  [8, "2.3", "Reisen und Mobilität", "Transport, Urlaub und nachhaltige Entscheidungen"],
  [9, "2.4", "Wohnen und Nachbarschaft", "Wohnformen, Mietprobleme und Zusammenleben"],
  [10, "2.5", "Konsum und Geld", "Kaufentscheidungen, Budget und Werbung"],
  [11, "3.1", "Gesellschaft und Integration", "Sprache, Teilhabe und Zusammenleben"],
  [12, "3.2", "Kultur und Freizeit", "Hobbys, kulturelle Angebote und persönliche Interessen"],
];

const normalizeRows = (level, rows) => rows.map((row) => {
  const [day, chapter, title, topic, grammarFocus, objectives, explanation, phrases, tasks, vocabulary] = row;
  return makeLesson({
    level,
    day,
    chapter,
    title,
    topic,
    grammarFocus: grammarFocus || "B2-Strategie: klare Struktur, Beispiele und passende Konnektoren",
    objectives: objectives || ["Ich kann das Thema klar erklären.", "Ich kann Gründe und Beispiele nennen.", "Ich kann AI-Feedback nutzen und verbessern."],
    explanation: explanation || [`Dieses ${level}-Thema hilft dir, deine Gedanken klarer zu ordnen und mit Beispielen zu sprechen.`, "Arbeite zuerst langsam durch die Ideen. Danach übst du mit Falowen AI und markierst dich selbst."],
    phrases: phrases || ["Meiner Meinung nach ...", "Ein wichtiger Grund dafür ist ...", "Zum Beispiel ...", "Zusammenfassend lässt sich sagen, dass ..."],
    tasks: {
      speaking: tasks?.[0] || `Sprich 2 Minuten über: ${topic}.`,
      writing: tasks?.[1] || `Schreibe 180–220 Wörter über: ${title}.`,
      reading: tasks?.[2] || `Lies einen passenden Text zum Thema ${title} und notiere die wichtigsten Punkte.`,
      listening: tasks?.[3] || `Höre einen Beitrag zum Thema ${title} und fasse ihn zusammen.`,
    },
    vocabulary: vocabulary || title.split(/\s+|und|\/|-/).filter((word) => word.length > 3).slice(0, 6),
  });
});

export const SELF_LEARNING_LESSONS = {
  B2: normalizeRows("B2", b2Base),
  C1: normalizeRows("C1", completeC1),
};

const lessonKey = (level, day) => `${String(level || "").toUpperCase()}-${Number(day || 0)}`;

const componentRegistry = Object.fromEntries(
  Object.entries(SELF_LEARNING_LESSONS).flatMap(([level, lessons]) =>
    lessons.map((lesson) => [lessonKey(level, lesson.day), () => <SelfLearningEditableLessonPage lesson={lesson} />])
  )
);

export const getSelfLearningLessonComponent = (level, day) => componentRegistry[lessonKey(level, day)] || null;

export default getSelfLearningLessonComponent;
