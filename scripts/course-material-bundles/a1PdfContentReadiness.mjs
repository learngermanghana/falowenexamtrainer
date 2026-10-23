// Separate a hydrated lesson from an authenticated React shell that still
// contains Suspense fallbacks. The PDF must never print those fallbacks.
export const isUnresolvedA1LessonLabel = (value = "") =>
  /^(?:Loading(?:\s+the\s+(?:app|lesson|workbook))?|Lädt|Wird geladen|Bitte warten)\s*(?:\.{2,3}|…)?$/i
    .test(String(value).trim().replace(/\s+/g, " "));

export const scanA1PrintText = (value = "") =>
  String(value).split(/\r?\n/).map((line) => line.trim())
    .filter(isUnresolvedA1LessonLabel);

// Run in the authenticated browser page (not the Node process).
// An exact visible leaf text node is important: a whole-page 'Loading...'
// substring would incorrectly reject lessons discussing loading or audio.
export const inspectA1PrintDocument = () => {
  const root = document.querySelector("main") || document.body;
  const visible = (element) => {
    if (!element || !element.getClientRects().length) return false;
    const style = window.getComputedStyle(element);
    return style.display !== "none" && style.visibility !== "hidden";
  };
  const labels = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const value = String(node.textContent || "").replace(/\s+/g, " ").trim();
    if (!/^(?:Loading(?:\s+the\s+(?:app|lesson|workbook))?|Lädt|Wird geladen|Bitte warten)\s*(?:\.{2,3}|…)?$/i.test(value)) {
      continue;
    }
    if (visible(node.parentElement)) labels.push(value);
  }
  const text = String(root?.innerText || "").replace(/\s+/g, " ").trim();
  return {
    unresolved: labels,
    textLength: text.length,
    sectionHeadings: [...root.querySelectorAll("h1,h2,h3")].filter(visible).length,
  };
};

export const isA1PrintContentReady = ({ unresolved = [], textLength = 0, sectionHeadings = 0 } = {}) =>
  !unresolved.length && textLength >= 160 && sectionHeadings >= 1;
