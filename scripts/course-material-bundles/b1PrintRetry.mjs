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

// An older B1 live speaking view can print only its repeated Workbook masthead
// on the first A4 sheet, followed by the actual speaking exercise on sheet 2.
// The book already has a full WORKBOOK divider, so this header-only sheet has
// no educational content. Drop it only with exact two-line + next-page proof.
export const isB1OrphanWorkbookHeaderPage = (first = "", second = "", description = "") => {
  if (!/^B1 Day (?:[1-9]|1\d|2[0-8]) workbook-teil-1$/.test(description)) return false;
  const lines = String(first).split(/\r?\n/).map(x => x.trim()).filter(Boolean);
  return lines.length === 2 &&
    /^B1\s*·\s*Day\s+\d+\s*·\s*Kapitel\s+[\w.]+$/.test(lines[0]) &&
    /^B1 Workbook\s*·\s*\S.+$/.test(lines[1]) &&
    /Teil 1\s*·\s*Sprechen/i.test(String(second).slice(0,700)) &&
    String(second).replace(/\s+/g, " ").trim().length > 400;
};

/** A source-controlled B1 companion may overflow its repeated, generic
 * paper/audio notice onto an otherwise empty final sheet. Only this exact
 * notice, after a substantive exercise page, is safe to discard. */
export const isB1RedundantNoticeOnlyTail = (lastPage = "", previousPage = "", description = "") => {
  const normalized = String(lastPage).replace(/\s+/g, " ").trim();
  const previousLength = String(previousPage).replace(/\s+/g, " ").trim().length;
  return /^B1 Day (?:[1-9]|1\d|2[0-8]) teil-[1-4] companion$/.test(description) &&
    normalized === "Schriftliche Übungen können Sie auf Papier bearbeiten. Audio und benotete Abgabe bleiben in der Falowen-Lektion." &&
    previousLength > 300;
};
