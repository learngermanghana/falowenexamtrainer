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
  h1, h2, h3, h4 { break-after: avoid; overflow-wrap: anywhere; white-space: normal !important; }
  p, li { orphans: 3; widows: 3; }
  table { max-width: 100% !important; }
  pre { white-space: pre-wrap !important; overflow-wrap: anywhere; }
  a { color: inherit !important; text-decoration: none !important; }
`;

export const isB1WorkbookGuideLabel = value =>
  /^Day\s*\d+\s*[·•-]\s*B1 workbook\s*[·•-]\s*how to complete this workbook$/i
    .test(String(value || "").replace(/\s+/g, " ").trim());

export const prepareB1PrintView = ({ section = "", lessonUrl = "", audioQrDataUrl = "", day = 0 } = {}) => {
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

  // Shared B1 workbooks render an online-only <details> accordion whose
  // summary is "Day N · B1 workbook · how to complete this workbook".
  // The closed summary survived the generic paragraph scrub in earlier proofs.
  for (const details of [...root.querySelectorAll("details")]) {
    const label = normalize(details.querySelector(":scope > summary")?.textContent);
    if (isB1WorkbookGuideLabel(label))
      swap(details);
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
  const webAction = /^(?:←|I prepared this part\.?|I practised this section\.?|(?:←\s*)?Previous lesson|Next lesson\s*→?|Back to workbook\s*›?|Ready for the next lesson\?|Show model|Hide model|Check answers?|Reset answers?|Start timer|Reset timer|Open writing video on YouTube)$/i;
  const meta = [
    /^Day\s*\d+\s*[·•-]\s*B1 workbook\s*[·•-]\s*how to complete this workbook$/i,
    /^Select Grammar,\s*Teil\s*1/i,
    /^The highlighted card at the top of each section tells you exactly what to answer\.?$/i,
    /^Choose one answer for each question\.?$/i,
    /^Click an answer option\.\s*Your choice is saved automatically/i,
    /^Your choice is saved automatically to Submit\b/i,
    /^Planning notes \(optional\)$/i,
    /^Write your German text$/i,
    /^Turn your points into one complete German text\./i,
    /^The starter text is already inside the writing box\./i,
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
  // Replace the dynamic audio player's loading state only in the PDF.
  // The real recording stays protected and is played in the Falowen lesson.
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let textNode;
  while ((textNode = walker.nextNode())) {
    const before = textNode.textContent || "";
    let after = before
      .replace(/Audio wird geladen\s*(?:…|\.{2,3})?/gi, "Audio online in der Falowen-Lektion")
      .replace(/Falowen bereitet die geschützte Aufnahme für die Wiedergabe vor\./gi, "");
    if (Number(day) === 20) {
      after = after.replace(/B1 Workbook\s*·\s*Wie wird man\s*…\?/g,
        "B1 Workbook · Wie wird man Reiseleiter/in?");
    }
    if (after !== before) {
      const originalNode = textNode;
      originalNode.textContent = after;
      undo.push(() => { originalNode.textContent = before; });
    }
  }

  // The live listening tab needs the same authenticated audio QR as A2.
  // Keep the QR with the exercise instead of relying on the web player UI.
  if (section === "workbook-teil-4" && lessonUrl && audioQrDataUrl) {
    const panel = document.createElement("aside");
    panel.setAttribute("data-b1-pdf-audio-companion", "true");
    panel.style.cssText = "display:flex;align-items:center;gap:12px;padding:10px;" +
      "border:1px solid #bfd3eb;background:#eff6ff;break-inside:avoid;margin:6px 0 12px";
    const qr = document.createElement("img");
    qr.src = audioQrDataUrl; qr.width = 82; qr.height = 82;
    qr.alt = "B1 Hören audio lesson QR";
    const note = document.createElement("div");
    const heading = document.createElement("strong");
    heading.textContent = "Hören: Audio im Falowen Course Book";
    const link = document.createElement("p");
    link.style.cssText = "margin:4px 0;overflow-wrap:anywhere;font-size:10pt";
    link.textContent = "QR-Code scannen, anmelden und Audio online anhören: " + lessonUrl;
    note.append(heading, link);
    panel.append(qr, note);
    const lessonHeading = [...root.querySelectorAll("h2,h3")].find(el =>
      /^Teil\\s*4\\b/i.test(normalize(el.textContent)) && el.isConnected);
    const target = lessonHeading?.closest("section") || document.querySelector("main") || root;
    target.insertBefore(panel, target.firstChild);
    undo.push(() => panel.remove());
  }

  window.__b1PrintChanges = undo;
  return { replacements: undo.length };
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
    ["workbook redirect card", /Grammar book\s*[·•-]\s*continue to workbook|You do not need to search again in the Course Book/i],
    ["workbook web guidance", /Day\s*\d+\s*[·•-]\s*B1 workbook\s*[·•-]\s*how to complete this workbook/i],
    ["workbook tab instructions", /Select Grammar,\s*Teil\s*1/i],
    ["saved learner state", /Draft saved|Your saved answers|Recognised speech|Recognized speech|Your corrected sentences/i],
    ["unhydrated lesson", /Loading grammar notes|Loading the app|Unexpected Application Error/i],
    ["private media token", /X-Amz-(?:Signature|Credential)|[?&](?:token|signature|access_token)=|r2\.cloudflarestorage\.com/i],
  ];
  return forbidden.filter(([,regex])=>regex.test(String(text))).map(([name])=>name);
};
