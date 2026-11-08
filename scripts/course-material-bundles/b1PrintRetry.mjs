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
