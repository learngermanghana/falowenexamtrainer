// A shared, read-only presentation of saved full-mock section marks.
// A missing module is not a zero; never manufacture a score from the overall mark.
export const MOCK_SCORE_SKILLS = Object.freeze([
  { key: "lesen", label: "Lesen" },
  { key: "hoeren", label: "Hören" },
  { key: "schreiben", label: "Schreiben" },
  { key: "sprechen", label: "Sprechen" },
]);

const finiteScore = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  const score = Number(value);
  return Number.isFinite(score) ? score : null;
};

export const isFullMockResult = (result = {}) => {
  const source = String(result.source || "").toLowerCase();
  const type = String(result.resultType || "").toLowerCase();
  return type === "final_mock" || /^(a1|a2|b1|b2|c1|c2)_final_mock$/.test(source)
    || /^(a1|a2|b1|b2|c1|c2)-final-mock/i.test(String(result.assignmentId || result.assignment_id || ""));
};

export const getSavedMockSectionRows = (result = {}) => {
  if (!isFullMockResult(result)) return [];
  const scores = result.sectionScores && !Array.isArray(result.sectionScores)
    && typeof result.sectionScores === "object" ? result.sectionScores : {};
  const breakdown = Array.isArray(result.scoreBreakdown) ? result.scoreBreakdown : [];

  return MOCK_SCORE_SKILLS.flatMap(({ key, label }) => {
    const raw = scores[key];
    const corresponding = breakdown.find((entry) =>
      String(entry?.key || entry?.partId || "").toLowerCase().replace("hören", "hoeren") === key);
    const candidate = raw && typeof raw === "object" && !Array.isArray(raw)
      ? raw.score : raw;
    const score = finiteScore(candidate ?? corresponding?.score);
    const maxScore = finiteScore(
      (raw && typeof raw === "object" ? raw.maxScore ?? raw.total : null)
      ?? corresponding?.maxScore ?? 25);
    if (score === null || maxScore === null || maxScore <= 0
      || score < 0 || score > maxScore) return [];
    return [{ key, label, score, maxScore }];
  });
};

export const formatMockSectionScore = (value) =>
  Number.isInteger(value) ? String(value) : Number(value).toFixed(1);
