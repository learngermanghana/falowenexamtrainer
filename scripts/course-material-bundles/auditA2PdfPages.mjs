import { scanPdfPageContent } from "./pdfPageAudit.mjs";
import { measureA2PdfPageInk } from "./pruneA2BlankSectionPages.mjs";

// Text extraction alone does not see legitimate diagrams and ruled writing
// sheets. Visual ink must be substantial, in the body (not the footer), and
// tested with a real grayscale raster before a page is exempted.
export const auditA2PdfPages = (text, expectedCount, pdfPath, {
  countInk = measureA2PdfPageInk,
} = {}) => {
  const base = scanPdfPageContent(text, expectedCount);
  const retainedGraphics = [];
  const faults = base.faults.filter(fault => {
    const match = /^Page (\d+) has no meaningful printable content$/.exec(fault);
    if (!match) return true;
    const page = Number(match[1]);
    const bodyInk = countInk(pdfPath, page);
    if (bodyInk >= 150) {
      retainedGraphics.push(page);
      return false;
    }
    return true;
  });
  return { count: base.count, faults, retainedGraphics };
};
