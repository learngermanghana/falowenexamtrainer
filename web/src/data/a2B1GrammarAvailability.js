const GRAMMAR_DAYS_BY_LEVEL = Object.freeze({
  A2: new Set(Array.from({ length: 28 }, (_, index) => index + 1)),
  B1: new Set(Array.from({ length: 28 }, (_, index) => index + 1)),
});

export const hasA2B1GrammarNotes = (level, day) =>
  Boolean(GRAMMAR_DAYS_BY_LEVEL[String(level || "").toUpperCase()]?.has(Number(day)));

export const A2_B1_GRAMMAR_DAYS_BY_LEVEL = GRAMMAR_DAYS_BY_LEVEL;
