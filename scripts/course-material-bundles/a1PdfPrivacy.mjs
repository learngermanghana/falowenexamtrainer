// Print-only redaction. No student-facing React component is modified.
// Execute in Playwright's page.evaluate and NEVER publish a PDF containing
// classroom contributions, saved submissions or a live speaking session.
export const sanitizeA1PrintDocument = () => {
  // Day 19 wraps a nested <main data-speaking-mock> in a <div> lesson.
  // Choose the whole lesson before isolating and redacting the private mock.
  const root = document.querySelector("[data-a1-speaking-confidence-lab]")
    || document.querySelector("main") || document.body;
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

  // A1 Day 6 mounts its Firestore-backed GroupDiscussionWritingBox through a
  // portal. Older deployed builds have this stable mount attribute but NOT the
  // newer data-a1-print-private attribute. Replace the entire portal target
  // with a neutral writing task before inspecting other private subtrees.
  // This preserves the surrounding family vocabulary, templates and quizzes.
  const day6MountSelector = '[data-a1-day6-family-writing-box="true"]';
  const day6Mounts = document.querySelectorAll?.(day6MountSelector)
    ?? root.querySelectorAll(day6MountSelector);
  for (const mount of [...day6Mounts]) {
    mount.replaceWith(makeWritingSpace("Meine Familie · Schreiben Sie 6–8 Sätze.", 9));
  }

  // Legacy A1 workbooks can also mount ClassWorkbookShareBox independently
  // of Day 6's discussion portal. Its live Firestore cards contain classmates'
  // names and answers, so redact the *whole* box (including the shared list),
  // not only the textarea or save button. The stable workbook-share field ID
  // works on deployed builds that have no print-private marker yet.
  for (const field of [...root.querySelectorAll('textarea[id^="workbook-share-"]')]) {
    let container = field.parentElement;
    for (let depth = 0; depth < 5 && container && container !== root; depth += 1) {
      const titles = [...container.querySelectorAll("strong")]
        .map((node) => normalize(node.textContent));
      if (titles.includes("Write and share with your class")
        && titles.includes("What Your Classmates Shared")) {
        container.replaceWith(makeWritingSpace("Schreiben · Schreiben Sie 6–8 Sätze.", 9));
        break;
      }
      container = container.parentElement;
    }
  }

  // Real Firestore biographies and class answers occur in multiple A1 days,
  // not only Day 13. Redact whole marked subtrees before resetting form fields:
  // otherwise author names / posted sentences can survive DOM text extraction.
  for (const privateNode of [...root.querySelectorAll("[data-a1-print-private]")]) {
    const role = normalize(privateNode.getAttribute("data-a1-print-private"));
    if (role === "biography-editor") {
      privateNode.replaceWith(makeWritingSpace("Meine Vorstellung · Schreiben Sie 4–6 Sätze über sich.", 6));
    } else if (role === "scrambled-class-contribution") {
      privateNode.replaceWith(makeWritingSpace("Satzbau · Schreiben Sie Ihre korrigierten Sätze.", 11));
    } else if (role === "family-group-discussion") {
      privateNode.replaceWith(makeWritingSpace("Meine Familie · Schreiben Sie 6–8 Sätze.", 9));
    } else if (role === "biography-online-explanation") {
      privateNode.textContent = "Schreiben Sie Ihre Vorstellung auf die Linien unten.";
      privateNode.removeAttribute("data-a1-print-private");
    } else {
      // Includes class introductions and anonymous-looking live result
      // bars. These may contain actual learner answers and identities.
      remove(privateNode);
    }
  }
  // The full PDF workflow renders the deployed Falowen website, which can
  // lag behind a just-merged GitHub change. Older lesson builds do not yet
  // contain data-a1-print-private attributes. Recognize ONLY the exact legacy
  // Firestore widgets by their field labels and structure; retain static
  // exercise prompts elsewhere in the workbook.
  for (const input of [...root.querySelectorAll('textarea[aria-label="Meine Vorstellung"]')]) {
    const form = input.closest?.("form");
    if (form && !form.closest?.("[data-a1-print-private]")) {
      form.replaceWith(makeWritingSpace("Meine Vorstellung · Schreiben Sie 4–6 Sätze über sich.", 6));
    }
  }

  for (const title of [...root.querySelectorAll("strong")]) {
    const label = normalize(title.textContent);
    // Only this widget owns a <section> containing student introduction
    // cards. Never remove the enclosing Course Book lesson or its models.
    if (/^(?:Class introductions|.{1,100}\s+introductions)$/i.test(label)) {
      const section = title.closest?.("section");
      if (section && section !== root &&
        (section.querySelector?.("article") ||
          /(?:No introductions from this class yet|Loading class member introductions|Class introductions)/i.test(normalize(section.textContent)) ||
          section.querySelector?.("span"))) {
        remove(section);
      }
    }

    if (label === "Your corrected sentences") {
      const form = title.closest?.("form");
      const wrapper = form?.parentElement;
      const text = normalize(wrapper?.textContent);
      if (wrapper && wrapper !== root && wrapper.querySelector?.("textarea") &&
          /Post to group discussion|Update my answers|Post your own answers to unlock the answer key|No answers posted in this class yet/i.test(text)) {
        wrapper.replaceWith(makeWritingSpace("Satzbau · Schreiben Sie Ihre korrigierten Sätze.", 11));
      }
    }

    if (label === "Write your paragraph here") {
      const section = title.closest?.("section");
      if (section && section !== root && section.querySelector?.("textarea") &&
          /This saves to Group Discussion only/i.test(normalize(section.textContent))) {
        section.replaceWith(makeWritingSpace("Meine Familie · Schreiben Sie 6–8 Sätze.", 9));
      }
    }
  }

  for (const note of [...root.querySelectorAll("span,p")]) {
    if (note.children.length) continue;
    if (/classmates['’] introductions appear here too/i.test(normalize(note.textContent))) {
      note.textContent = "Schreiben Sie Ihre Vorstellung auf die Linien unten.";
    }
  }

  // The Day 3 live response questions are static outside these portal
  // mounts. Remove only the Firestore-backed response widgets.
  for (const node of [...root.querySelectorAll(
    "[data-live-class-response-mount], [data-live-class-response], [data-a1-day3-class-biography] [data-a1-print-private]"
  )]) remove(node);

  // Day 19's CourseSpeakingMockAssignment uses a separate [data-speaking-mock]
  // root and can show recovered scores, transcripts, feedback and session IDs.
  // Replace the entire mock (including its nested live session), never just
  // individual result labels. Preserve independent, non-personal A1 prompts.
  const speakingMock = root.matches?.("[data-speaking-mock]")
    ? root : root.querySelector("[data-speaking-mock]");
  if (speakingMock) {
    speakingMock.replaceChildren();
    speakingMock.setAttribute("data-a1-pdf-speaking-prompt", "true");
    const heading = document.createElement("h1");
    heading.textContent = "Goethe A1 · Sprechen üben";
    const introduction = document.createElement("p");
    introduction.textContent = "Partnerübung: Arbeiten Sie zu zweit. Stellen Sie Fragen, antworten Sie in ganzen Sätzen und üben Sie höfliche Bitten. Diese Druckversion zeigt keine persönlichen Prüfungsergebnisse oder gespeicherten Sitzungen.";
    speakingMock.append(heading, introduction);
    const prompts = [
      ["Teil 1 · Sich vorstellen", "Sagen Sie Ihren Namen, Ihr Alter, Ihren Wohnort, Ihren Beruf und Ihre Sprachen. Buchstabieren Sie Ihren Familiennamen und nennen Sie eine Telefonnummer."],
      ["Teil 2 · Fragen und Antworten", "Stellen Sie Fragen zu alltäglichen Themen wie Familie, Freizeit, Einkaufen oder Arbeit. Ihr Partner antwortet. Danach tauschen Sie die Rollen."],
      ["Teil 3 · Bitten und Reagieren", "Bitten Sie Ihren Partner höflich um einen Gegenstand oder um Hilfe. Antworten Sie auf die Bitte mit einem ganzen Satz."],
    ];
    for (const [title, instruction] of prompts) {
      const section = document.createElement("section");
      section.style.cssText = "margin:14px 0;break-inside:avoid";
      const h2 = document.createElement("h2"); h2.textContent = title;
      const p = document.createElement("p"); p.textContent = instruction;
      section.append(h2, p, makeWritingSpace("Stichwörter / Notizen", 3));
      speakingMock.append(section);
    }
    return;
  }

  // These panels load personal letters and marking feedback from Firestore.
  // Replace the complete widget; do not merely hide buttons or clear textarea.
  for (const panel of [...root.querySelectorAll('[data-a1-course-book-letter-practice]')]) {
    const taskType = normalize(panel.getAttribute("data-letter-type")).toLowerCase();
    panel.replaceWith(makeWritingSpace(taskType === "formal" ? "Formeller Brief · Ihre Antwort" : "Informeller Brief · Ihre Antwort", 10));
  }

  // The live Day 7 family recorder may contain a learner's spoken transcript,
  // signed audio link and personalised feedback. Print a neutral practice area.
  for (const panel of [...root.querySelectorAll('[data-a1-family-recorder]')]) {
    panel.replaceWith(makeWritingSpace("Sprechen · Meine Familie: Stichwörter", 4));
  }

  // Preserve printable response space for the real exercise. A1-0.2 Teil 2
  // gets all five short-answer controls here; A1-1.1 Teil 2 gets its writing
  // textarea here. Removing this whole panel would produce unanswerable pages.
  // Reconstruct ONLY neutral labels, static option texts, and empty lines.
  for (const panel of [...root.querySelectorAll('[data-a1-tutor-draft-capture]')]) {
    const sectionKey = normalize(panel.getAttribute("data-a1-tutor-draft-capture"));
    const label = /^teil-\d+$/i.test(sectionKey)
      ? "Teil " + sectionKey.replace(/^teil-/i, "") : "Antworten";
    const shortInputs = [...panel.querySelectorAll('input[type="text"],input:not([type])')];
    const textareas = [...panel.querySelectorAll("textarea")];
    const fallbackChoices = [...panel.querySelectorAll("fieldset")];

    // A progress-only wrapper has no answer controls to preserve.
    if (!shortInputs.length && !textareas.length && !fallbackChoices.length) {
      remove(panel);
      continue;
    }

    const printable = document.createElement("section");
    printable.setAttribute("data-a1-pdf-draft-answer-space", sectionKey);
    // The five Hören answers in A1-0.2 were orphaned across a page boundary:
    // questions 1–4 on page 27 and question 5 alone on page 28. Keep modest
    // short-answer groups together, with compact ruled lines; preserve larger
    // mixed/ten-question groups' ability to span multiple pages.
    const keepShortAnswersTogether = shortInputs.length > 0 && shortInputs.length <= 7
      && !textareas.length && !fallbackChoices.length;
    printable.style.cssText = "display:grid;gap:6px;margin:8px 0;padding:8px;border:1px solid #cbd5e1;border-radius:8px;background:#fff;color:#172b4d"
      + (keepShortAnswersTogether
        ? ";break-inside:avoid-page;page-break-inside:avoid;-webkit-column-break-inside:avoid"
        : "");
    const heading = document.createElement("h3");
    heading.textContent = label + " · Antworten";
    printable.append(heading);

    for (const [index, input] of shortInputs.entries()) {
      const sourceNumber = normalize(input.closest?.("label")?.querySelector("span")?.textContent);
      const questionLabel = /^Question\s+\d+$/i.test(sourceNumber)
        ? sourceNumber : "Question " + (index + 1);
      const row = document.createElement("div");
      row.style.cssText = "break-inside:avoid;page-break-inside:avoid;display:grid;gap:2px;margin:0";
      const prompt = document.createElement("strong");
      prompt.textContent = questionLabel;
      const rule = document.createElement("div");
      rule.setAttribute("data-a1-pdf-answer-rule", "");
      rule.style.cssText = "height:19px;border-bottom:1px solid #94a3b8";
      row.append(prompt, rule);
      printable.append(row);
    }

    for (const fieldset of fallbackChoices) {
      const legendText = normalize(fieldset.querySelector("legend")?.textContent);
      const headingText = /^Question\s+\d+$/i.test(legendText) ? legendText : "Choose one answer";
      const row = document.createElement("div");
      row.style.cssText = "break-inside:avoid";
      const title = document.createElement("strong");
      title.textContent = headingText;
      const choices = document.createElement("p");
      const optionTexts = [...fieldset.querySelectorAll('input[type="radio"]')]
        .map((input) => normalize(input.getAttribute("value") || input.value))
        .filter((value) => value.length > 0 && value.length <= 24);
      choices.textContent = optionTexts.length
        ? optionTexts.map((value) => "□ " + value).join("    ") : "□ A    □ B    □ C";
      row.append(title, choices);
      printable.append(row);
    }

    if (textareas.length) printable.append(makeWritingSpace(label + " · Schreiben", 8));
    panel.replaceWith(printable);
  }

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

  // Native select elements are printed by Chromium with the last controlled
  // selected option unless reset explicitly. Clear both DOM state and markup.
  for (const select of root.querySelectorAll("select")) {
    for (const option of select.options) {
      option.selected = false;
      option.defaultSelected = false;
      option.removeAttribute("selected");
    }
    select.selectedIndex = -1;
    select.value = "";
  }
  // Some workbook choices are styled spans instead of form controls.
  for (const choice of root.querySelectorAll('[data-a1-clickable-answer], [role="radio"]')) {
    choice.setAttribute("aria-checked", "false");
    choice.style?.setProperty("background", "#fff", "important");
    choice.style?.setProperty("border-color", "#cbd5e1", "important");
    choice.style?.setProperty("color", "#0f172a", "important");
  }

  for (const control of root.querySelectorAll("input[type=checkbox],input[type=radio]")) {
    control.checked = false;
    control.removeAttribute("checked");
  }
  for (const prompt of root.querySelectorAll(".a1-day20-write-here__prompt span")) {
    prompt.textContent = "Write your answer on the lines below.";
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
    ["classmate biographies", /(?:Class introductions|class member introductions|introductions\s+\d+|This updates the same biography shown on the Class Members page|classmates' introductions appear here too)/i],
    ["class-shared writing", /(?:What Your Classmates Shared|No classmates have shared an answer|Save and Share with Class|Only students in .{1,80} see this list|Post to group discussion|Class answers|No answers posted in this class yet)/i],
    ["live class results", /(?:Class response\s*[·•-]\s*not graded|View classmates|class responses?|Saved to Group Discussion)/i],

    ["class discussion save", /Save to class discussion/i],
    ["saved speaking session", /Loading speaking practice|Check completed speaking Teils|speaking access and saved session|Saved speaking work|Your Teil scores|Session:\s*\S+|Download saved work for tutor review|Your result is saved/i],
    ["student draft or submission", /Assignment draft\s*[·•-]\s*Not submitted|Draft saved on this device|Use the Mark My Letter box above|saved into this assignment draft/i],
    ["interactive marking widget", /Mark My (?:Formal|Informal|Weather) Letter|Clear practice draft/i],
  ];
  return patterns.filter(([, regex]) => regex.test(text)).map(([description]) => description);
};
