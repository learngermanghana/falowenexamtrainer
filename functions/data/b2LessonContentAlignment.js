const B2_LESSON_CONTENT_ALIGNMENT = Object.freeze({
  8: Object.freeze({
    day: 8,
    chapter: "2.3",
    title: "Reisen und Mobilität",
    goal: "Verkehrsmittel vergleichen und Vor- und Nachteile von Reisen und Mobilität abwägen.",
    grammar_topic: "Vergleiche und Abwägung (im Vergleich zu, während, wohingegen, je ... desto)",
  }),
  9: Object.freeze({
    day: 9,
    chapter: "2.4",
    title: "Wohnen und Nachbarschaft",
    goal: "Wohnprobleme, Nachbarschaft und höfliche Lösungen sachlich beschreiben.",
    grammar_topic: "Höfliche Beschwerden und indirekte Fragen (ob, W-Fragen, könnten, würden)",
  }),
  10: Object.freeze({
    day: 10,
    chapter: "2.5",
    title: "Konsum und Geld",
    goal: "Kaufentscheidungen, Budget, Werbung und bewussten Konsum ausgewogen diskutieren.",
    grammar_topic: "Zweiteilige Konnektoren (einerseits ... andererseits, sowohl ... als auch, weder ... noch)",
  }),
  11: Object.freeze({
    day: 11,
    chapter: "3.1",
    title: "Gesellschaft und Integration",
    goal: "Möglichkeiten für Integration, Teilhabe und gesellschaftliches Zusammenleben vorschlagen.",
    grammar_topic: "Konjunktiv II für Vorschläge (sollte, könnte, wäre, wenn-Sätze)",
  }),
  12: Object.freeze({
    day: 12,
    chapter: "3.2",
    title: "Kultur und Freizeit",
    goal: "Freizeitaktivitäten und kulturelle Erlebnisse zeitlich strukturiert beschreiben.",
    grammar_topic: "Temporale Nebensätze (wenn, als, während, bevor, nachdem)",
  }),
});

const getB2LessonContentAlignment = (day) =>
  B2_LESSON_CONTENT_ALIGNMENT[Number(day)] || null;

const alignB2CurriculumEntry = (entry = {}) => {
  const level = String(entry.level || "").trim().toUpperCase();
  if (level !== "B2") return entry;

  const patch = getB2LessonContentAlignment(entry.day ?? entry.assignmentDay);
  if (!patch) return entry;

  return {
    ...entry,
    ...patch,
    topic: patch.title,
    lessonTitle: patch.title,
    assignmentTitle: patch.title,
  };
};

const alignB2CurriculumEntries = (entries = []) =>
  entries.map((entry) => alignB2CurriculumEntry(entry));

module.exports = {
  B2_LESSON_CONTENT_ALIGNMENT,
  getB2LessonContentAlignment,
  alignB2CurriculumEntry,
  alignB2CurriculumEntries,
};
