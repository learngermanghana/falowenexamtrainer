import { extractPdfPages } from "./pdfPageAudit.mjs";

// Match an actual printed divider, not a contents row or text on two different pages.
export const hasPdfSectionDivider = (pdfText, level, day, section) => {
  if (!["A1", "A2", "B1"].includes(level) || !Number.isInteger(day) ||
      !["grammar", "workbook"].includes(section)) return false;
  const label = section.toUpperCase();
  const marker = new RegExp(
    level + String.raw`\s*[·•]?\s*Day\s+` + day + String.raw`\b[\s\S]{0,500}\b` + label + String.raw`\b`,
    "i",
  );
  return extractPdfPages(pdfText).some(page => marker.test(page));
};
