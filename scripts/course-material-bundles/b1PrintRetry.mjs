// Chromium sometimes prints a tiny final grammar fragment on a nearly
// empty sheet. Reflow the same source instead of discarding that fragment.
// These are deliberate, bounded B1-only fallbacks; A1/A2 print at their
// existing scales. The audit still has to pass on the final PDF.
export const B1_PRINT_SCALES = Object.freeze([0.95, 0.90, 0.85]);

export const shouldRetryB1PrintAudit = (faults, attempt) =>
  Number.isInteger(attempt) &&
  attempt >= 0 &&
  attempt < B1_PRINT_SCALES.length - 1 &&
  Array.isArray(faults) &&
  faults.length > 0 &&
  faults.every(fault => /^Page [1-9]\d* has no meaningful printable content$/.test(fault));

/** Reflow a tiny *last* sheet, not a meaningful short exercise. This is
 * bounded to the existing 0.95 / 0.90 / 0.85 print scales and never removes
 * exercise text. A single-page section is always allowed to be short. */
export const shouldRetryB1SparseTail = (pages, attempt) => {
  if (!Number.isInteger(attempt) || attempt < 0 ||
      attempt >= B1_PRINT_SCALES.length - 1 ||
      !Array.isArray(pages) || pages.length < 2) return false;
  const last = String(pages[pages.length - 1] || "").replace(/\s+/g, " ").trim();
  const prior = String(pages[pages.length - 2] || "").replace(/\s+/g, " ").trim();
  return last.length > 0 && last.length < 260 && prior.length > 300;
};
