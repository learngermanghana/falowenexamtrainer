// B1 retail print-only cleanup, aligned with the A1/A2 book workflow.
// The live student application is never edited. Before page.pdf(), replace
// only clearly identified navigation, private state and web-only widgets.
// Restore the original nodes and form state immediately after each print.
export const B1_PRINT_CSS = `
  @page { size: A4; margin: 10mm 9mm 12mm; }
  .app-header, header.app-header--compact, .app-shell > header.app-header,
  [data-course-inline-practice], [data-live-class-response],
  [data-live-class-response-mount], [data-submission-feedback],
  [data-teacher-only], [data-admin-only], [data-pdf-exclude],
  [data-workbook-tab-navigation], [role="tablist"], nav,
  [data-course-writing-analysis-action], .book-pdf-download-action {
    display: none !important;
  }
  main, section, article, [role="tabpanel"], div[style*="overflow"] {
    min-height: 0 !important; max-height: none !important;
    overflow: visible !important; contain: none !important;
  }
  h1, h2, h3, h4 { break-after: avoid; }
  p, li { orphans: 3; widows: 3; }
  table { max-width: 100% !important; }
  /* Keep short grammar tables intact and prevent the next card from printing
     on top of the final rows at a page boundary. */
  table, thead, tbody, tr, th, td { break-inside: avoid !important; }
  section:has(> table) { break-inside: avoid-page !important; display: block !important; }
  /* Chromium can fragment a grid row but paint the following question over
     its last choices. Print reading question cards in ordinary block flow. */
  [data-reading-exam-question-grid] {
    display: block !important; grid-template-columns: none !important;
    min-height: 0 !important; overflow: visible !important;
  }
  [data-reading-exam-question-grid] > * {
    display: block !important; margin: 0 0 14px !important;
    break-inside: avoid-page !important; page-break-inside: avoid !important;
  }
  /* Live text controls have blue focus outlines but no useful paper content.
     Keep radio/checkbox circles visible for printed multiple-choice questions. */
  input:not([type="radio"]):not([type="checkbox"]), textarea { display: none !important; }
  div:has(> input:not([type="radio"]):not([type="checkbox"]):only-child) { display: none !important; }
  [style*="position: sticky"], [style*="position: fixed"] { position: static !important; }
  pre { white-space: pre-wrap !important; overflow-wrap: anywhere; }
  a { color: inherit !important; text-decoration: none !important; }
`;

export const isB1WorkbookGuideLabel = value =>
  /^Day\s*\d+\s*[·•-]\s*B1 workbook\s*[·•-]\s*how to complete this workbook$/i
    .test(String(value || "").replace(/\s+/g, " ").trim());

export const prepareB1PrintView = ({ section = "" } = {}) => {
  if (window.__b1PrintChanges) throw new Error("B1 print view already active");
  const undo = [];
  const normalize = value => String(value || "").replace(/\s+/g, " ").trim();
  // Playwright serializes this function into the browser page. Keep the
  // expression local: imported module helpers are unavailable in page.evaluate.
  const isB1WorkbookGuideLabel = value =>
    /^Day\s*\d+\s*[·•-]\s*B1 workbook\s*[·•-]\s*how to complete this workbook$/i
      .test(normalize(value));

  const swap = (node, replacement = document.createElement("span")) => {
    if (!node?.isConnected || node === document.body || node.tagName === "MAIN") return;
    node.replaceWith(replacement);
    undo.push(() => { if (replacement.isConnected) replacement.replaceWith(node); });
  };
  const root = document.body;
  // The screen grammars reuse an old "B1 Workbook" masthead. Correct
  // the print title without changing React or the authenticated workbook.
  if (section === "grammar") {
    for (const heading of [...root.querySelectorAll("h1,h2,h3")]) {
      if (!/^B1 Workbook\s*[·•-]/i.test(normalize(heading.textContent))) continue;
      const previous = heading.textContent;
      heading.textContent = previous.replace(/^B1 Workbook/, "B1 Grammar Notes");
      undo.push(() => { heading.textContent = previous; });
    }
  }

  // Strictly remove notices about online answer persistence. They are
  // positioned over live reading questions and cover printed answer choices.
  // Only an entire matching notice is removable, never its surrounding question.
  const paperOnlyNotices = [
    /^Answer directly in the workbook\..*Review\s*&\s*Submit.*before submitting\.?$/i,
    /^Click an answer option\..*saved automatically to Submit.*$/i,
    /^Your choice is saved automatically to Submit.*$/i,
    /^Choose one answer for each question$/i,
    /^Prepare a 60[–-]90 second answer for class\. Teil 1 is not submitted\.?$/i,
    /^Lösungen anzeigen$/i,
  ];
  const noticeCandidates = [...root.querySelectorAll("p,div,aside,section,small,span,button,label,strong")]
    .filter(el => el.isConnected && normalize(el.textContent).length < 350 &&
      paperOnlyNotices.some(rx => rx.test(normalize(el.textContent))));
  // Remove the entire matching notice container (including its opaque
  // background), not just the nested text that was obscuring questions.
  for (const el of noticeCandidates.filter(node =>
    !noticeCandidates.some(outer => outer !== node && outer.contains(node)))) swap(el);


  // Exclude private session and result widgets before their content can be
  // serialized. This is a static book, not a screenshot of an export account.
  const privateSelectors = [
    "[data-course-inline-practice]", "[data-live-class-response-mount]",
    "[data-live-class-response]", "[data-submission-feedback]",
    "[data-speaking-mock]", "[data-teacher-only]", "[data-admin-only]",
    "[data-course-writing-analysis-action]",
  ];
  for (const el of [...root.querySelectorAll(privateSelectors.join(","))]) {
    if (el.isConnected) swap(el);
  }

  // Remove the compact website account strip (Falowen / bell / FA), not
  // educational headings that happen to mention Falowen.
  for (const el of [...root.querySelectorAll("header,div,aside")]) {
    if (!el.isConnected || el.querySelector("input,textarea,fieldset,h1,h2,h3")) continue;
    const t = normalize(el.textContent);
    if (t.length > 85 || !/\bFalowen\b/.test(t) || !/\bFA\b/.test(t)) continue;
    if (/\b(?:Workbook|Grammar Notes|Kapitel|Lesson|Day\s*\d+)\b/i.test(t)) continue;
    const rect = el.getBoundingClientRect?.();
    if (rect && rect.height > 160) continue;
    swap(el);
  }

  // The "Lösungen anzeigen" disclosure belongs to the interactive web
  // lesson and must never enter a student print book (including its answer).
  for (const details of [...root.querySelectorAll("details")]) {
    const summary = details.querySelector(":scope > summary");
    if (/^Lösungen anzeigen$/i.test(normalize(summary?.textContent))) swap(details);
  }

  // Shared B1 workbooks render an online-only <details> accordion whose
  // summary is "Day N · B1 workbook · how to complete this workbook".
  // The closed summary survived the generic paragraph scrub in earlier proofs.
  for (const details of [...root.querySelectorAll("details")]) {
    const label = normalize(details.querySelector(":scope > summary")?.textContent);
    if (isB1WorkbookGuideLabel(label))
      swap(details);
  }

  // Audio belongs to the authenticated online Hören companion, not to a
  // printed grammar/workbook lesson. Suppress transient loading labels only;
  // never hide the task prompt or the numbered Hören questions.
  for (const node of [...root.querySelectorAll("span,p,small,div")]) {
    if (!node.isConnected || node.children.length || node.querySelector("input,textarea")) continue;
    if (/^Audio wird geladen\s*(?:…|\.{2,3})?$/i.test(normalize(node.textContent))) swap(node);
  }

  // The Course Book contains several 'next lesson' and workbook-link cards.
  // Require both labels to avoid removing a paragraph that teaches navigation.
  const cards = [...root.querySelectorAll("div,section,article,aside")].filter(el => {
    const t = normalize(el.textContent);
    if (t.length < 45 || t.length > 950) return false;
    return (/Grammar book\s*[·•-]\s*continue to workbook/i.test(t) &&
      /You do not need to search again in the Course Book/i.test(t)) ||
      (/Ready for the next lesson\?/i.test(t) &&
      /You do not need to return to the Course Book/i.test(t));
  });
  for (const el of cards.filter(node => !cards.some(inner => inner !== node && node.contains(inner)))) swap(el);

  // Unlike multiple-choice question options, these exact words belong only
  // to web actions, progress controls or navigation guidance.
  const webAction = /^(?:I prepared this part\.?|I practised this section\.?|(?:←\s*)?Previous lesson|Next lesson\s*→?|Back to workbook\s*›?|(?:←\s*)?Back to Course Book|Ready for the next lesson\?|Show model|Hide model|Check answers?|Reset answers?|Start timer|Reset timer|Open writing video on YouTube)$/i;
  const meta = [
    /^Day\s*\d+\s*[·•-]\s*B1 workbook\s*[·•-]\s*how to complete this workbook$/i,
    /^Select Grammar,\s*Teil\s*1/i,
    /^The highlighted card at the top of each section tells you exactly what to answer\.?$/i,
    /^Choose one answer for each question Click an answer option\./i,
  ];
  for (const el of [...root.querySelectorAll("a,button,label,p,span,small,div,section,h2,h3")]) {
    if (!el.isConnected) continue;
    const t = normalize(el.textContent);
    if (!t || t.length > 320 || el.querySelector("fieldset,textarea,input[type=text]")) continue;
    // Some old workbooks wrap these labels in anonymous divs, not paragraphs.
    // Match only the entire short label; never erase a card containing tasks.
    if (webAction.test(t) || meta.some(rx => rx.test(t))) swap(el);
  }

  // Never print a learner's selected answer, typed text or free-text notes.
  // The replacement is intentionally blank while keeping printed questions.
  for (const field of [...root.querySelectorAll("input,textarea,select,[contenteditable=true]")]) {
    if (!field.isConnected) continue;
    if (field.matches("input[type=checkbox]") &&
        /I prepared this part/i.test(normalize(field.closest("label")?.textContent))) {
      swap(field.closest("label")); continue;
    }
    const blank = field.tagName === "TEXTAREA" || field.matches("[contenteditable=true]")
      ? document.createElement("div") : field.cloneNode(true);
    if (field.tagName === "TEXTAREA" || field.matches("[contenteditable=true]")) {
      blank.setAttribute("data-b1-pdf-writing-space", "true");
      blank.style.cssText = "height:42px;border-bottom:1px solid #a4b4c5;margin:8px 0";
    } else if (blank.tagName === "SELECT") blank.selectedIndex = -1;
    else {
      blank.checked = false; blank.defaultChecked = false;
      blank.value = ""; blank.defaultValue = "";
      blank.removeAttribute("value"); blank.removeAttribute("checked");
    }
    swap(field, blank);
  }
  window.__b1PrintChanges = undo;
  return { replacements: undo.length };
};


/** Remove large blank link/button outlines left after the text-only web chrome
 * scrub. Never remove a radio answer, checkbox, image, or instructional text. */
export const suppressB1EmptyChromeControls = () => {
  const undo = window.__b1PrintChanges;
  if (!undo) throw new Error("B1 print state must be prepared first");
  for (const el of [...document.querySelectorAll("button,a,[role=button]")]) {
    if (!el.isConnected || (el.textContent || "").trim()) continue;
    if (el.querySelector("input,img,svg[aria-label],[role=radio],[role=checkbox]")) continue;
    const rect = el.getBoundingClientRect?.();
    if (!rect || rect.width < 180 || rect.height < 20) continue;
    const replacement = document.createElement("span");
    el.replaceWith(replacement);
    undo.push(() => { if (replacement.isConnected) replacement.replaceWith(el); });
  }
};

export const restoreB1PrintView = () => {
  for (const reverse of [...(window.__b1PrintChanges || [])].reverse()) reverse();
  delete window.__b1PrintChanges;
};

// B1 live pages include a nested website lesson shell that Chromium's print
// layout intentionally suppresses. Compare meaningful printable vocabulary
// coverage rather than requiring every website-shell character in the PDF.
export const assertB1PrintedContent = (expected, printed) => {
  const words = input => new Set((String(input || "").normalize("NFKC").toLowerCase()
    .match(/[\p{L}\p{N}]{4,}/gu) || []));
  const before = words(expected), after = words(printed);
  const minChars = before.size < 45 ? 48 : 140;
  const minTerms = before.size < 45 ? 8 : 22;
  if (String(printed).replace(/\s+/g, "").length < minChars || after.size < minTerms) {
    throw new Error("B1 PDF printed content is empty or insufficient (" +
      after.size + " distinct printed terms vs " + before.size + " expected)");
  }
  if (before.size >= 35) {
    let matched = 0;
    for (const word of before) if (after.has(word)) matched++;
    if (matched / before.size < 0.66) {
      throw new Error("B1 PDF lost a substantial share of its visible lesson content");
    }
  }
};

export const findB1PrintFaults = text => {
  const forbidden = [
    ["QR-only missing exercise", /Diese Aufgabe ist nur online verfügbar|vollständigen Aufgaben dieses Abschnitts sind noch nicht/i],
    ["live completion checkbox", /I prepared this part\.?/i],
    ["next-lesson website navigation", /Continue learning|Ready for the next lesson\?|You do not need to return to the Course Book/i],
    ["coursebook back-navigation", /Back\s+to\s+Course\s+Book/i],
    ["workbook redirect card", /Grammar book\s*[·•-]\s*continue to workbook|You do not need to search again in the Course Book/i],
    ["workbook web guidance", /Day\s*\d+\s*[·•-]\s*B1 workbook\s*[·•-]\s*how to complete this workbook/i],
    ["workbook tab instructions", /Select Grammar,\s*Teil\s*1/i],
    ["saved learner state", /Draft saved|Your saved answers|Recognised speech|Recognized speech|Your corrected sentences/i],
    ["online answer-saving overlay", /Answer directly in the workbook|Your choice is saved automatically to Submit|Click an answer option/i],
    ["answer reveal web action", /^\s*Lösungen anzeigen\s*$/mi],
    ["unhydrated lesson", /Loading grammar notes|Loading the app|Unexpected Application Error/i],
    ["unresolved audio-loading placeholder", /Audio wird geladen\s*(?:…|\.{2,3})?/i],
    ["private media token", /X-Amz-(?:Signature|Credential)|[?&](?:token|signature|access_token)=|r2\.cloudflarestorage\.com/i],
  ];
  return forbidden.filter(([,regex])=>regex.test(String(text))).map(([name])=>name);
};


/**
 * Canonical B1 companions render HTML that contains every source-owned prompt.
 * Poppler's pdftotext can read adjacent PDF columns/list items in a different
 * order to DOM innerText, so the A2 exact-string comparison falsely rejects
 * complete B1 pages. Compare token occurrences instead, while requiring that
 * nearly all printed source text survives and preserving the existing safety
 * and per-page audits.
 */
export const assertB1CanonicalPrintedContent = (expected, printed) => {
  assertB1PrintedContent(expected, printed);
  const words = input => String(input || "").normalize("NFKC").toLocaleLowerCase("de")
    .match(/[\p{L}\p{N}]+/gu) || [];
  const source = words(expected);
  const rendered = words(printed);
  const occurrences = new Map();
  for (const word of rendered) occurrences.set(word, (occurrences.get(word) || 0) + 1);
  let matched = 0;
  for (const word of source) {
    const left = occurrences.get(word) || 0;
    if (left > 0) {
      occurrences.set(word, left - 1);
      matched++;
    }
  }
  const coverage = matched / Math.max(source.length, 1);
  if (coverage < 0.92) {
    throw new Error("B1 canonical PDF lost source-controlled exercise text (" +
      Math.round(coverage * 100) + "% token coverage)");
  }
};
