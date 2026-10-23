// pdftotext separates pages with form-feed characters. PDF navigation/footer
// is intentionally excluded when deciding whether a page has real content.
export const extractPdfPages = (extractedText) => {
  const pages = String(extractedText || "").split("\f");
  if (pages.length && !pages.at(-1).trim()) pages.pop();
  return pages;
};

export const scanPdfPageContent = (extractedText, expectedCount) => {
  const pages = extractPdfPages(extractedText);
  if (pages.length !== expectedCount) {
    return { count: pages.length, faults: ["Expected " + expectedCount + " PDF pages; extracted " + pages.length] };
  }
  const faults = [];
  pages.forEach((rawPage, index) => {
    const normalized = rawPage.replace(/\s+/g, " ").trim();
    if (/\bLoading the app(?:\b|[.…])/i.test(normalized)) {
      faults.push("Page " + (index + 1) + " contains a React loading screen");
    }
    // React Suspense and protected-audio placeholders have printable headers
    // around them, so a page-length check alone cannot catch these failures.
    if (/^\s*Loading\s*(?:…|\.{2,3})\s*$/mi.test(rawPage)) {
      faults.push("Page " + (index + 1) + " contains an unresolved lesson Loading placeholder");
    }
    if (/Audio wird geladen\s*(?:…|\.{2,3})?/i.test(rawPage)) {
      faults.push("Page " + (index + 1) + " contains an unresolved audio-loading placeholder");
    }
    if (/Unexpected Application Error|404 Not Found|Page not found|Loading failed/i.test(normalized)) {
      faults.push("Page " + (index + 1) + " contains an application error");
    }
    const withoutFooter = normalized
      .replace(/Falowen Learning Hub\s+\d+\s*\/\s*\d+/gi, "")
      .trim();
    if (withoutFooter.length < 12) {
      faults.push("Page " + (index + 1) + " has no meaningful printable content");
    }
  });
  return { count: pages.length, faults };
};
