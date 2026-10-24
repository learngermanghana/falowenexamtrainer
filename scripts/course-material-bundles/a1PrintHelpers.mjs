// Export-only rules. Do not apply this stylesheet to the student Course Book.
const PRINTABLE_SECTION = /^(?:Teil\s*\d+\b|Section\s*\d+\b|Reading\s*\+\s*Questions\b)/i;

export const isA1PdfReadyText = (value) => {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  return text.length >= 120
    && !/^Loading the app[.…]*/i.test(text)
    && !/^Connecting to Falowen/i.test(text)
    && !/^Please wait[.…]*/i.test(text);
};

export const printableA1TabLabels = (labels = []) => {
  const seen = new Set();
  return labels.map((label) => String(label || "").replace(/\s+/g, " ").trim())
    .filter((label) => PRINTABLE_SECTION.test(label))
    .filter((label) => {
      const key = label.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

export const a1PrintCss = (kind = "workbook") => "\n  @page { size: A4; margin: 12mm 10mm 15mm; }\n  html, body, #root, main { background: #fff !important; }\n  body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }\n  main { width: 100% !important; max-width: 100% !important; }\n  /* Persistent print CSS survives asynchronous React draft-save re-renders.\n     Day 7's timestamp and completion notices carry explicit markers; never\n     remove or hide the actual exercise form or multiple-choice buttons. */\n  [data-a1-pdf-hide-ui], [data-a1-chapter3-draft-guidance] { display: none !important; }\n  nav, [role=\"navigation\"], [role=\"tablist\"], [role=\"banner\"],\n  [data-a1-unified-tutor-workbook-nav],\n  [data-a1-shared-practice-navigation],\n  [data-a1-teil-navigation],\n  [data-a1-assignment-progress], [data-a1-workbook-section-progress],\n  [data-a1-workbook-header-actions], [data-a1-section-action],\n  [data-a1-shared-workbook-overview], [data-a1-workbook-overview],\n  [data-universal-workbook-lesson-navigator],\n  [data-a1-day1-combined-guidance],\n  .book-print-stamp, .book-pdf-download-action,\n  [data-pdf-exclude], [class*=\"study-buddy\" i],\n  [class*=\"floating\" i], [class*=\"chat\" i],\n  [class*=\"video-card\" i], [class*=\"videoCard\"],\n  [aria-label*=\"Study Buddy\" i], [aria-label*=\"download\" i],\n  iframe, video, button[type=\"submit\"],\n  [data-workbook-panel=\"overview\"], [data-workbook-panel=\"assignment\"],\n  [data-workbook-panel=\"submit\"] { display: none !important; }\n\n  /* All required exercises already exist inside hidden React panels.\n     Never print only the Overview tab. */\n  [data-a1-shared-workbook] [data-workbook-panel^=\"teil-\"],\n  [data-a1-shared-workbook] [data-workbook-panel^=\"section-\"] {\n    display: block !important;\n    visibility: visible !important;\n    height: auto !important;\n    overflow: visible !important;\n  }\n  [data-a1-shared-workbook] [data-workbook-panel=\"grammar\"] {\n    display: none !important;\n  }\n  /* Exercise choices are often HTML buttons. Hiding every button caused\n     multiple-choice questions to lose their answers in the old PDF. */\n  button:not([type=\"submit\"]):not([role=\"tab\"]) {\n    color: #111827 !important;\n    background: #fff !important;\n    border: 1px solid #d1d5db !important;\n    opacity: 1 !important;\n    box-shadow: none !important;\n    text-align: left !important;\n    white-space: normal !important;\n  }\n  input[type=\"checkbox\"], input[type=\"radio\"] {\n    appearance: auto !important; -webkit-appearance: auto !important;\n    visibility: visible !important;\n  }\n  img { max-width: 100% !important; height: auto !important; }\n  a { color: inherit !important; text-decoration: none !important; }\n  [style*=\"position: sticky\"], [style*=\"position: fixed\"] { position: static !important; }\n  table, tr, pre, blockquote { break-inside: avoid; }\n  section, article { break-inside: auto; }\n" + (kind === "grammar"
  ? '\n[data-a1-shared-workbook] [data-workbook-panel^="teil-"], [data-a1-shared-workbook] [data-workbook-panel^="section-"] { display: none !important; }\n[data-a1-shared-workbook] [data-workbook-panel="grammar"] { display: block !important; visibility: visible !important; }\n'
  : "");
