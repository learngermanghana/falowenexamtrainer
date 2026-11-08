import { extractPdfPages } from "./pdfPageAudit.mjs";

// Require both the chapter heading and a standalone printed section label
// on the same PDF page; "Falowen Grammar Notes & Workbook" is not a divider.
export const hasPdfSectionDivider = (pdfText, level, day, section) => {
  if (!["A1", "A2", "B1"].includes(level) || !Number.isInteger(day) ||
      !["grammar", "workbook"].includes(section)) return false;
  const chapter = new RegExp(level + String.raw`\s*[·•]?\s*Day\s+` + day + String.raw`\b`, "i");
  const label = new RegExp(String.raw`^\s*` + section.toUpperCase() + String.raw`\s*$`, "m");
  return extractPdfPages(pdfText).some(page => chapter.test(page) && label.test(page));
};
