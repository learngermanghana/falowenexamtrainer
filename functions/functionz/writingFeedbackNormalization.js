// Preserve the assessment evidence; presentation decides how much to show first.
const text = value => String(value || "").trim();
const sanitizeWritingCorrections = (value = []) => {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  return value.map(item => ({
    wrong: text(item?.wrong || item?.original),
    correct: text(item?.correct || item?.corrected),
    category: text(item?.category),
    reason: text(item?.reason || item?.explanation),
  })).filter(item => {
    if (!item.wrong || !item.correct || item.wrong === item.correct) return false;
    const key = JSON.stringify([item.wrong, item.correct]);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};
const normalizeTaskPoints = (value = []) => (Array.isArray(value) ? value : [])
  .map(item => ({ label: text(item?.label), status: text(item?.status).toLowerCase(), evidence: text(item?.evidence), reason: text(item?.reason) }))
  .filter(item => item.label && ["met", "partial", "missing"].includes(item.status));
module.exports = { sanitizeWritingCorrections, normalizeTaskPoints };
