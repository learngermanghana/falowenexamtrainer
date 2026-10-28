// A2 export only. These functions run in an isolated Playwright print view;
// they must never be mounted in the student app or used for the A1 book.
export const A2_PRINT_CSS = `
  main, section, article, [role="tabpanel"], div[style*="overflow"] {
    min-height: 0 !important; max-height: none !important;
    overflow: visible !important; contain: none !important;
  }
  h1, h2, h3, h4 { break-after: avoid; }
  p, li { orphans: 3; widows: 3; }
  table { max-width: 100% !important; }
  pre { white-space: pre-wrap !important; overflow-wrap: anywhere; }
  [data-a2-pdf-redacted], [data-a2-pdf-answer-key] { display: none !important; }
  [data-a2-pdf-writing-space] { margin: 8px 0; }
  [data-a2-pdf-writing-space] div { height: 24px; border-bottom: 1px solid #94a3b8; }
`;

export const prepareA2SafePrintView = () => {
  if (window.__a2SafePrintView) throw new Error("A2 print view is already prepared");
  const changes = [];
  const normalize = value => String(value || "").replace(/\s+/g, " ").trim();
  // Source fixes may be reviewed before the website is deployed. Apply the
  // same exact Day 13 typography repair in the temporary print DOM so a safe
  // A2 proof does not require changing the production website first.
  for (const term of document.querySelectorAll("em")) {
    const next = term.nextSibling;
    if (term.textContent === "wanted to" && next?.nodeType === Node.TEXT_NODE &&
        /^do in the past\./.test(next.textContent)) {
      const previous = next.textContent;
      next.textContent = " " + previous;
      changes.push(() => { next.textContent = previous; });
    }
  }
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let textNode;
  while ((textNode = walker.nextNode())) {
    const previous = textNode.textContent;
    if (previous === "What could, had to, or wanted to happen in the past?") {
      const node = textNode;
      node.textContent = "What were you able to do, what did you have to do, and what did you want to do in the past?";
      changes.push(() => { node.textContent = previous; });
    }
  }
  const replace = (node, replacement) => {
    if (!node.isConnected) return;
    node.replaceWith(replacement);
    changes.push(() => replacement.replaceWith(node));
  };
  const writingSpace = () => {
    const block = document.createElement("div");
    block.setAttribute("data-a2-pdf-writing-space", "true");
    block.setAttribute("aria-label", "Ihre Notizen");
    for (let i = 0; i < 4; i++) block.append(document.createElement("div"));
    return block;
  };
  // Whole private widgets must go BEFORE fields: a saved answer can also be
  // rendered as a paragraph, a name, a grade, or a shared class contribution.
  const privateSelectors = [
    "[data-course-inline-practice]", "[data-live-class-response-mount]",
    "[data-live-class-response]", "[data-a1-print-private]",
    "[data-speaking-mock]", ".speaking-exam-live", "[data-submission-feedback]",
    "[data-teacher-only]", "[data-admin-only]",
  ];
  for (const node of document.querySelectorAll(privateSelectors.join(","))) {
    replace(node, node.matches('[data-course-inline-practice="writing"],[data-live-class-response-mount],[data-live-class-response]')
      ? writingSpace() : document.createElement("span"));
  }
  // Legacy class-sharing boxes have no privacy marker. Identify the complete
  // widget by its two exact headings, never by a learner's name or free text.
  for (const heading of document.querySelectorAll("strong,h2,h3")) {
    if (normalize(heading.textContent) !== "Write and share with your class") continue;
    let parent = heading.parentElement;
    while (parent && parent !== document.body && parent.tagName !== "MAIN") {
      if ([...parent.querySelectorAll("strong,h2,h3")].some(node =>
        normalize(node.textContent) === "What Your Classmates Shared")) {
        replace(parent, writingSpace());
        break;
      }
      parent = parent.parentElement;
    }
  }
  // Keep grammar examples; remove explicitly labelled answer-key disclosures.
  for (const details of document.querySelectorAll("details")) {
    const summary = details.querySelector(":scope > summary");
    if (/^(?:(?:Show|Hide)\s+)?(?:Lösungen?|Antworten|Answer key|Answers|Model answers?|Musterlösungen?|Reference Answers)\s*[:·–-]?$/i
      .test(normalize(summary?.textContent))) {
      replace(details, document.createElement("span"));
    } else {
      const wasOpen = details.open;
      details.open = true;
      changes.push(() => { details.open = wasOpen; });
    }
  }
  for (const node of document.querySelectorAll("[data-answer-key],[data-solution],[data-correct-answer]")) {
    replace(node, document.createElement("span"));
  }
  // No form state from the authenticated export account belongs in a book.
  // Replacements retain the original nodes for restoration, including values.
  for (const field of document.querySelectorAll("textarea,[contenteditable=true]")) {
    replace(field, writingSpace());
  }
  for (const field of document.querySelectorAll("input,select")) {
    const blank = field.cloneNode(true);
    if (blank.tagName === "SELECT") blank.selectedIndex = -1;
    else {
      blank.value = "";
      blank.defaultValue = "";
      blank.checked = false;
      blank.defaultChecked = false;
      blank.removeAttribute("value");
      blank.removeAttribute("checked");
    }
    blank.removeAttribute("placeholder");
    replace(field, blank);
  }
  window.__a2SafePrintView = changes;
  return { replacements: changes.length };
};

export const restoreA2SafePrintView = () => {
  for (const undo of [...(window.__a2SafePrintView || [])].reverse()) undo();
  delete window.__a2SafePrintView;
};

export const findA2PrintSafetyFaults = text => {
  const checks = [
    ["classroom contributions", /What Your Classmates Shared|Write and share with your class|Class introductions/i],
    ["saved learner work", /Draft saved|Your saved answers|Your corrected sentences|Recognised speech|Recognized speech/i],
    ["live marking feedback", /Analyse my text|Analyze my text|Your score\s*[:·]|Mark my letter|Retry feedback/i],
    ["exposed answer key", /Reference Answers|Answer key|Musterlösung(?:en)?/i],
    ["temporary or private media link", /X-Amz-(?:Signature|Credential)|[?&](?:token|signature|access_token)=|r2\.cloudflarestorage\.com/i],
    ["incomplete lesson", /Loading grammar notes|Loading the app|Unexpected Application Error|Audio wird geladen/i],
  ];
  return checks.filter(([, pattern]) => pattern.test(String(text))).map(([label]) => label);
};

export const assertA2PrintSafety = text => {
  const faults = findA2PrintSafetyFaults(text);
  if (faults.length) throw new Error("A2 PDF safety preflight failed: " + faults.join(", "));
};

export const assertA2PrintedContent = (expected, actual) => {
  // Browser/PDF line wrapping and common Unicode ligatures may differ; the
  // content itself may not disappear behind a clipped scroll container.
  const compact = value => String(value).normalize("NFKC")
    .replace(/^\s*(?:\d+[.)]|[•●])\s*/gm, "").replace(/[\s\u00ad]+/g, "");
  if (!compact(actual).includes(compact(expected))) {
    throw new Error("A2 PDF is missing or truncating source-controlled exercise content");
  }
};
