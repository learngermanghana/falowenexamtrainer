const GRAMMAR_DAYS_BY_LEVEL = Object.freeze({
  A2: new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 28]),
  B1: new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21]),
});

export const hasA2B1GrammarNotes = (level, day) =>
  Boolean(GRAMMAR_DAYS_BY_LEVEL[String(level || "").toUpperCase()]?.has(Number(day)));

