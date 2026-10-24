// Browser-only print cleanup. Removes controls, never questions or answer
// choices. Caller runs this AFTER lesson hydration and privacy redaction.
export const cleanA1PrintChrome = () => {
  const root = document.querySelector("[data-a1-speaking-confidence-lab]")
    || document.querySelector("main") || document.body;
  const normalize = (value) => String(value || "").replace(/\s+/g, " ").trim();
  const remove = (node) => node?.remove();

  // Root selection can differ between embedded components and the Course Book
  // shell. Remove explicit export-excluded UI everywhere in the document,
  // including status notices outside the first <main>. Persistent CSS in
  // a1PrintHelpers.mjs covers components React re-renders after this pass.
  const markedSelector = '[data-a1-pdf-hide-ui], [data-a1-chapter3-draft-guidance]';
  const marked = document.querySelectorAll?.(markedSelector) ?? root.querySelectorAll(markedSelector);
  for (const element of [...marked]) remove(element);

  // On deployed course pages the website strip is often an anonymous header
  // or div. Its "Falowen / bell / FA" content is at the very top of the
  // document, not inside an educational header. Look for a small, visible
  // top-of-page container, not an exact descendant whose text may contain a
  // logo initial or be rendered as several nested spans.
  const topBarSelector = "header,nav,aside,section,div";
  const topBarCandidates = document.querySelectorAll?.(topBarSelector)
    ?? root.querySelectorAll(topBarSelector);
  for (const candidate of [...topBarCandidates]) {
    if (candidate === root || candidate === document.body) continue;
    const rect = candidate.getBoundingClientRect?.();
    if (!rect || rect.height < 15 || rect.height > 115
      || rect.top > 155 || rect.bottom < 0) continue;
    const label = normalize(candidate.innerText || candidate.textContent);
    if (label.length > 115 || !/\bFalowen\b/i.test(label) || !/\bFA\b/.test(label)) continue;
    if (/\b(?:Workbook|Grammar Notes|Kapitel|Assignment|Knowledge test|Day\s*\d+)\b/i.test(label)) continue;
    if (candidate.querySelector?.("h1,h2,h3,input,textarea,fieldset")) continue;
    // Preserve UI elsewhere in the app; this hides only the exported document.
    candidate.setAttribute?.("data-a1-pdf-hide-ui", "website-masthead");
    candidate.style?.setProperty("display", "none", "important");
  }

  // Old lesson implementations do not all expose a stable hook yet.
  // Use exact control labels, never hide buttons wholesale (some are MCQs).
  const actionText = /^(?:Show model|Hide model|Show answer|Hide answer|Show answers|Hide answers|Reveal answer|Show solution|Check answer|Check answers|Reset|Reset answers|Check knowledge test|Reset test|Check my sentences|Try again|Record family answer|Stop recording|Save recording|Review & Submit Assignment|Open Review & Submit|Check completed speaking Teils|Back|←\s*Back)$/i;
  for (const element of [...root.querySelectorAll("button,a")]) {
    if (actionText.test(normalize(element.textContent))) remove(element);
  }

  // Online completion tracking is not a question or an answer choice.
  for (const label of [...root.querySelectorAll("label,button")]) {
    if (/^I practised this section\.?$/i.test(normalize(label.textContent))) {
      remove(label);
    }
  }

  // Older variants of Day 7 render the notice as a paragraph containing a
  // nested <strong>Not submitted</strong>. The previous leaf-only cleanup
  // ignored those paragraphs, so their timestamps leaked into the PDF.
  for (const notice of [...root.querySelectorAll("p[role='status'],p[aria-live]")]) {
    const copy = normalize(notice.textContent);
    if (/^Saved to your assignment draft(?:\s*[·•-]\s*\d{1,2}:\d{2}\s*[AP]M)?\.\s*Not submitted for marking yet\.?$/i.test(copy)
      && !notice.querySelector("input,textarea,fieldset,select")) remove(notice);
  }

  // Live progress badges and save messages are not exercises. Keep their
  // containing question lists and neutral inputs untouched.
  const transient = [
    /^Saved to your assignment draft\b/i,
    /^Not submitted for marking yet\.?$/i,
    /^\d+ of \d+ blanks completed$/i,
    /^\d+ of \d+ answered$/i,
    /^\d+ of \d+ questions answered$/i,
    /^\d+ of \d+ sentences written$/i,
    /^Finish the workbook before submitting$/i,
    /^Your answers are saved as a draft\./i,
    /^Complete every required answer above to unlock Review & Submit/i,
  ];
  for (const node of [...root.querySelectorAll("p,span,small,strong,[role=status]")]) {
    if (node.children.length) continue;
    if (transient.some((pattern) => pattern.test(normalize(node.textContent)))) remove(node);
  }

  // The score panel is separate from its knowledge-check questions. Only
  // remove the small score box when the instruction proves its identity.
  for (const candidate of [...root.querySelectorAll("div,section,aside")]) {
    const text = normalize(candidate.textContent);
    if (text.length > 160 || !/Your score/i.test(text)
      || !/Answer all questions to see your full score/i.test(text)) continue;
    if (candidate.querySelector("input,textarea,fieldset")) continue;
    remove(candidate);
  }

  // Website navigation copy is not a grammar example. Require both parts of
  // the dedicated Course Book callout before removing its enclosing card.
  for (const node of [...root.querySelectorAll("div,section,aside")]) {
    const text = normalize(node.textContent);
    if (text.length > 450 || text.length < 40) continue;
    if (/Grammar book · continue to workbook/i.test(text)
      && /You do not need to search again in the Course Book/i.test(text)
      && !node.querySelector("input,textarea,fieldset")) remove(node);
  }

  if (root.matches?.("[data-a1-speaking-confidence-lab]")) {
    for (const paragraph of root.querySelectorAll("p")) {
      if (normalize(paragraph.textContent).includes("Say your question aloud before you reveal the model.")) {
        paragraph.textContent = "Use the theme and keyword to form your question. Speak first; compare your answer with the model in your online lesson.";
      }
      if (normalize(paragraph.textContent) === "Look at the keyword, speak first, then reveal the model.") {
        paragraph.textContent = "Look at the keyword and make a polite request. Compare your answer with the model in your online lesson.";
      }
    }
    // Compact this print-only layout without hiding speaking cards or prompts.
    root.style?.setProperty("gap", "10px", "important");
  }
};

// Inspect extracted PDF text, rather than a screenshot or editor's guess.
// These patterns are absent from legitimate A1 question/answer content.
export const findA1PrintChromeLeaks = (text = "") => {
  const t = String(text);
  const issues = [
    ["saved draft timestamp", /Saved to your assignment draft(?:\s*[·•-]\s*\d{1,2}:\d{2}\s*[AP]M)?/i],
    ["draft-only submission status", /Your answers are saved as a draft|NOT been submitted for marking|Complete every required answer above to unlock Review/i],
    ["online completion progress", /^\s*\d+\s+of\s+\d+\s+(?:blanks completed|sentences written|questions answered)\s*$/mi],
    ["unprintable model buttons", /^\s*(?:Show model|Hide model)\s*$/mi],
    ["knowledge-test action buttons", /^\s*(?:Check knowledge test|Reset test|Show answers?|Hide answers?|Reveal answer|Show solution|Check answers?|Reset(?: answers)?)\s*$/mi],
    ["live recording controls", /^\s*(?:Record family answer|Save recording|Stop recording)\s*$/mi],
  ];
  return issues.filter(([, rx]) => rx.test(t)).map(([label]) => label);
};
