export const FULL_ESSAY_START_DAY = 21;

const normalizeLevel = (level = "") => String(level || "").trim().toUpperCase();

export const isAdvancedWritingLevel = (level) =>
  ["B2", "C1"].includes(normalizeLevel(level));

export const getAdvancedWritingPhase = (level, day) => {
  if (!isAdvancedWritingLevel(level)) return "standard";
  return Number(day) >= FULL_ESSAY_START_DAY ? "full-essay" : "guided";
};

const questionMinimums = {
  B2: [25, 30, 35, 30, 30],
  C1: [30, 40, 40, 40, 40],
};

export const getGenericGuidedWritingConfig = (level, day) => {
  const normalizedLevel = normalizeLevel(level);
  const minimums = questionMinimums[normalizedLevel] || questionMinimums.B2;

  return {
    level: normalizedLevel,
    day: Number(day),
    title: `${normalizedLevel} Day ${Number(day)} guided writing`,
    taskType: `${normalizedLevel} guided writing practice`,
    targetWords: normalizedLevel === "C1" ? 190 : 150,
    questions: [
      {
        id: "introduction",
        section: "Thema verstehen",
        question: "Wie würdest du das Thema in deinen eigenen Worten erklären?",
        help: "Führe kurz in das Thema ein. Du brauchst noch keinen vollständigen Aufsatz.",
        minimumWords: minimums[0],
      },
      {
        id: "main-point",
        section: "Hauptgedanke",
        question: "Was ist dein wichtigstes Argument oder deine zentrale Aussage?",
        help: "Erkläre einen starken Gedanken klar und passend zu deinem Niveau.",
        minimumWords: minimums[1],
      },
      {
        id: "example",
        section: "Konkretes Beispiel",
        question: "Welches konkrete Beispiel unterstützt deinen Hauptgedanken?",
        help: "Nutze eine Situation aus Gesellschaft, Schule, Arbeit, Familie oder Alltag.",
        minimumWords: minimums[2],
      },
      {
        id: "counterargument",
        section: "Andere Perspektive",
        question: "Welche Gegenposition, Grenze oder Schwierigkeit sollte man berücksichtigen?",
        help: "Zeige, dass du das Thema nicht nur von einer Seite betrachtest.",
        minimumWords: minimums[3],
      },
      {
        id: "alternative",
        section: "Ausgewogene Lösung",
        question: "Welche Alternative, Lösung oder ausgewogene Position schlägst du vor?",
        help: "Verbinde deine bisherigen Gedanken. Der Schluss wird erst ab Day 21 gezielt trainiert.",
        minimumWords: minimums[4],
      },
    ],
    checklist: [
      "Ich habe das Thema in eigenen Worten erklärt.",
      "Ich habe einen klaren Hauptgedanken entwickelt.",
      "Ich habe ein konkretes Beispiel verwendet.",
      "Ich habe eine andere Perspektive berücksichtigt.",
      "Ich habe eine ausgewogene Alternative oder Lösung formuliert.",
    ],
  };
};
