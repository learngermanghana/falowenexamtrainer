// Browser-only print cleanup. Removes controls, never questions or answer
// choices. Caller runs this AFTER lesson hydration and privacy redaction.
export const cleanA1PrintChrome = () => {
  const root = document.querySelector("[data-a1-speaking-confidence-lab]")
    || document.querySelector("main") || document.body;
  const normalize = (value) => String(value || "").replace(/\s+/g, " ").trim();
  const remove = (node) => node?.remove();

  // Explicit markers identify non-educational controls without guessing from
  // their style, position, or nearby real exercise content.
  for (const element of [...root.querySelectorAll(
    '[data-a1-pdf-hide-ui], [data-a1-chapter3-draft-guidance]'
  )]) remove(element);

  // Old lesson implementations do not all expose a stable hook yet.
  // Use exact control labels, never hide buttons wholesale (some are MCQs).
  const actionText = /^(?:Show model|Hide model|Check knowledge test|Reset test|Check my sentences|Try again|Record family answer|Stop recording|Save recording|Review & Submit Assignment|Open Review & Submit|Check completed speaking Teils)$/i;
  for (const element of [...root.querySelectorAll("button,a")]) {
    if (actionText.test(normalize(element.textContent))) remove(element);
  }

  // Live progress badges and save messages are not exercises. Keep their
  // containing question lists and neutral inputs untouched.
  const transient = [
    /^Saved to your assignment draft\b/i,
    /^Not submitted for marking yet\.?$/i,
    /^\d+ of \d+ blanks completed$/i,
    /^\d+ of \d+ answered$/i,
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
    ["online completion progress", /^\s*\d+\s+of\s+\d+\s+(?:blanks completed|sentences written)\s*$/mi],
    ["unprintable model buttons", /^\s*(?:Show model|Hide model)\s*$/mi],
    ["knowledge-test action buttons", /^\s*(?:Check knowledge test|Reset test)\s*$/mi],
    ["live recording controls", /^\s*(?:Record family answer|Save recording|Stop recording)\s*$/mi],
  ];
  return issues.filter(([, rx]) => rx.test(t)).map(([label]) => label);
};
