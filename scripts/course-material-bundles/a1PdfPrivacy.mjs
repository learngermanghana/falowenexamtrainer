// Print-only redaction. No student-facing React component is modified.
// Execute in Playwright's page.evaluate and NEVER publish a PDF containing
// classroom contributions, saved submissions or a live speaking session.
export const sanitizeA1PrintDocument = () => {
  const root = document.querySelector("main") || document.body;
  const normalize = (text) => String(text || "").replace(/\s+/g, " ").trim();
  const remove = (node) => node?.remove();

  const makeWritingSpace = (label, lines = 8) => {
    const block = document.createElement("section");
    block.setAttribute("data-a1-pdf-writing-space", "true");
    block.style.cssText = "padding:12px 14px;border:1px solid #cbd5e1;border-radius:8px;margin:12px 0;break-inside:avoid;background:#fff;color:#172b4d";
    const heading = document.createElement("h3");
    heading.textContent = label;
    heading.style.cssText = "font-size:14px;margin:0 0 6px";
    const help = document.createElement("p");
    help.textContent = "Schreiben Sie Ihre Antwort auf die Linien. / Write your answer below.";
    help.style.cssText = "font-size:11px;margin:0 0 10px;color:#475569";
    block.append(heading, help);
    for (let i = 0; i < lines; i++) {
      const rule = document.createElement("div");
      rule.setAttribute("data-a1-pdf-answer-rule", "");
      rule.style.cssText = "height:26px;border-bottom:1px solid #94a3b8";
      block.append(rule);
    }
    return block;
  };

  // These panels load personal letters and marking feedback from Firestore.
  // Replace the complete widget; do not merely hide buttons or clear textarea.
  for (const panel of [...root.querySelectorAll('[data-a1-course-book-letter-practice]')]) {
    const taskType = normalize(panel.getAttribute("data-letter-type")).toLowerCase();
    panel.replaceWith(makeWritingSpace(taskType === "formal" ? "Formeller Brief · Ihre Antwort" : "Informeller Brief · Ihre Antwort", 10));
  }

  // Tutor draft widgets can display locally cached submissions and marks.
  // The public workbook keeps the original question choices and prompts.
  for (const panel of [...root.querySelectorAll('[data-a1-tutor-draft-capture]')]) remove(panel);

  // Recording/checkpoint panels contain saved scores, private recordings,
  // personalised transcripts and live session controls, not printable prompts.
  for (const panel of [...root.querySelectorAll(
    '[data-a1-tutor-speaking-checkpoint], [data-live-speak-entry], [data-a1-speaking-practice="embedded"]'
  )]) {
    panel.replaceWith(makeWritingSpace("Sprechen · Partnerübung: Notieren Sie Stichwörter", 3));
  }

  for (const sensitive of [...root.querySelectorAll(
    '[data-a1-live-contributions], [data-a1-live-discussion-controls]'
  )]) remove(sensitive);

  // Day 13 shows actual class posts (authors, dates and submitted sentences).
  // Keep the static numbered exercise ABOVE this block; remove the entire
  // contribution list, not just the title or author's name.
  for (const heading of [...root.querySelectorAll("h1,h2,h3,h4")]) {
    const text = normalize(heading.textContent);
    if (/^Class contributions$/i.test(text)) {
      const wrapper = heading.parentElement;
      if (wrapper && wrapper !== root && wrapper !== document.body) remove(wrapper);
      else remove(heading);
    }
  }

  // Never embed another student's discussion or reply thread.
  for (const discussion of [...root.querySelectorAll(
    '[data-class-discussion], [data-discussion-thread], [data-course-inline-discussion]'
  )]) remove(discussion);

  // No saved answer (or class badge) should be baked into the static file.
  for (const field of root.querySelectorAll("textarea, input:not([type=checkbox]):not([type=radio]), [contenteditable=true]")) {
    if (field.matches("[contenteditable=true]")) field.textContent = "";
    else {
      field.value = "";
      field.removeAttribute("value");
      if (field.tagName === "TEXTAREA") field.textContent = "";
    }
  }

  for (const node of [...root.querySelectorAll("button,span,p,small,a")]) {
    if (node.children.length) continue;
    const value = normalize(node.textContent);
    if (/^Save to class discussion$|^Class:\s*.+|^Draft (?:saved|saves|will save)|^Assignment draft|^Writing saved$|^\d+ of \d+ answered$|^Your score$|^Score:\s*\d+\/\d+$|^Check completed speaking Teils$|^Loading speaking practice$|^Please wait while Falowen checks your speaking access|^Start recording$|^Karte ziehen$|^Show model$|^Clear practice draft$|^Back to lesson$|^Back to workbook$/i.test(value)) {
      remove(node);
    }
  }

  // Remove in-app framing without erasing teaching sections.
  for (const element of root.querySelectorAll("[data-a1-workbook-media], [data-a1-workbook-video-header], [data-a1-speaking-ai-video]")) {
    remove(element);
  }
};

export const findA1PrintPrivacyLeaks = (text = "") => {
  const patterns = [
    ["class contributions", /Class contributions/i],
    ["class discussion save", /Save to class discussion/i],
    ["saved speaking session", /Loading speaking practice|Check completed speaking Teils|speaking access and saved session/i],
    ["student draft or submission", /Assignment draft\s*[·•-]\s*Not submitted|Draft saved on this device|Use the Mark My Letter box above|saved into this assignment draft/i],
    ["interactive marking widget", /Mark My (?:Formal|Informal|Weather) Letter|Clear practice draft/i],
  ];
  return patterns.filter(([, regex]) => regex.test(text)).map(([description]) => description);
};
