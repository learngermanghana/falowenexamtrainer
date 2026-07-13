export const A2_GOETHE_LISTENING_ONLY_PATHS = new Set([
  "/campus/course/a2-day-21-ein-wochenende-planen-workbook",
  "/campus/course/a2-day-22-die-woche-planung-workbook",
  "/campus/course/a2-day-23-wie-kommst-du-zur-schule-oder-zur-arbeit-workbook",
  "/campus/course/a2-day-24-einen-urlaub-planen-workbook",
  "/campus/course/a2-day-26-gefuehle-in-verschiedenen-situationen-workbook",
  "/campus/course/a2-day-27-digitale-kommunikation-workbook",
  "/campus/course/a2-day-28-ueber-die-zukunft-sprechen-workbook",
]);

export const A2_LEGACY_SUBMISSION_CLEANUP_PATHS = new Set([
  "/campus/course/a2-day-22-die-woche-planung-workbook",
  "/campus/course/a2-day-23-wie-kommst-du-zur-schule-oder-zur-arbeit-workbook",
  "/campus/course/a2-day-24-einen-urlaub-planen-workbook",
  "/campus/course/a2-day-25-tagesablauf-workbook",
  "/campus/course/a2-day-26-gefuehle-in-verschiedenen-situationen-workbook",
]);

const normalizePath = (value = "") => String(value || "").replace(/\/+$/, "") || "/";
const normalizeText = (value = "") =>
  String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const findByText = (root, selector, phrase) => {
  const normalizedPhrase = normalizeText(phrase);
  return (
    Array.from(root?.querySelectorAll?.(selector) || []).find((element) =>
      normalizeText(element.textContent).includes(normalizedPhrase),
    ) || null
  );
};

const findListeningPanel = (root) => {
  const heading = Array.from(root?.querySelectorAll?.("h1, h2, h3") || []).find((element) => {
    const text = normalizeText(element.textContent);
    return /teil\s*4\b/.test(text) && /(horen|hoeren|listening)/.test(text);
  });

  if (!heading) return { heading: null, panel: null };
  return {
    heading,
    panel: heading.closest("section") || heading.parentElement,
  };
};

const removeDirectChildContaining = (container, phrase) => {
  const normalizedPhrase = normalizeText(phrase);
  const child = Array.from(container?.children || []).find((element) =>
    normalizeText(element.textContent).includes(normalizedPhrase),
  );
  if (!child) return false;
  child.remove();
  return true;
};

const ensureListeningNote = (root, heading, text) => {
  if (!heading?.parentElement) return false;
  let note = heading.parentElement.querySelector('[data-a2-goethe-listening-note="true"]');
  if (!note) {
    note = root.createElement("p");
    note.setAttribute("data-a2-goethe-listening-note", "true");
    note.style.margin = "0";
    note.style.lineHeight = "1.7";
    note.style.fontWeight = "700";
    note.style.color = "#1e3a8a";
    note.style.background = "#eff6ff";
    note.style.border = "1px solid #bfdbfe";
    note.style.borderRadius = "10px";
    note.style.padding = "10px 12px";
    heading.insertAdjacentElement("afterend", note);
  }
  if (note.textContent === text) return false;
  note.textContent = text;
  return true;
};

const cleanSharedGuidance = (main) => {
  const guidance = findByText(
    main,
    "p",
    "Teil 2 Schreiben Teil 3 Lesen and Teil 4 Hören complete the tasks and send only your final answers",
  );
  if (!guidance) return false;
  guidance.textContent =
    "Teil 2 · Schreiben and Teil 3 · Lesen: complete the tasks and send only your final answers through the Submit tab. Teil 4 · Hören is Goethe self-check practice in the video and is not submitted.";
  return true;
};

const cleanSubmitPanelForGoethe = (main) => {
  const submitHeading = Array.from(main?.querySelectorAll?.("h1, h2, h3") || []).find(
    (element) => normalizeText(element.textContent) === "submit workbook",
  );
  const submitPanel = submitHeading?.closest("section") || submitHeading?.parentElement;
  if (!submitPanel) return false;

  let changed = false;
  const submitCopy = findByText(submitPanel, "p", "reading listening answer letters");
  if (submitCopy) {
    submitCopy.textContent =
      "Submit your final writing text and reading answer letters. Teil 4 · Hören is checked inside the Goethe video and is not submitted.";
    changed = true;
  }

  Array.from(submitPanel.querySelectorAll('[role="note"]')).forEach((note) => {
    if (!normalizeText(note.textContent).includes("reminder practise here then submit only your final answers")) return;
    note.remove();
    changed = true;
  });

  return changed;
};

const removeGenericSubmissionReminders = (main) => {
  let changed = false;
  Array.from(main?.querySelectorAll?.('[role="note"]') || []).forEach((note) => {
    const text = normalizeText(note.textContent);
    if (!text.includes("reminder practise here then submit only your final answers through the submit tab")) return;
    note.remove();
    changed = true;
  });
  return changed;
};

const removeLegacyFinalSubmissionCards = (main) => {
  let changed = false;
  Array.from(main?.querySelectorAll?.("h2, h3") || []).forEach((heading) => {
    if (normalizeText(heading.textContent) !== "final submission") return;
    const panel = heading.closest("section") || heading.parentElement;
    if (!panel || panel.hasAttribute?.("data-a2-standard-legacy-panel")) return;
    panel.remove();
    changed = true;
  });
  return changed;
};

const cleanLegacySubmissionNoise = (main) => {
  let changed = false;
  changed = removeGenericSubmissionReminders(main) || changed;
  changed = removeLegacyFinalSubmissionCards(main) || changed;
  return changed;
};

const cleanDay25ReadingLabels = (main) => {
  let changed = false;
  const nav = main?.querySelector?.('[data-a2-standard-legacy-nav-root] [data-workbook-tab-navigation]');
  const teil4Button = Array.from(nav?.querySelectorAll?.("button") || []).find((button) => {
    const text = normalizeText(button.textContent);
    return /teil\s*4\b/.test(text) && /horen|hoeren/.test(text);
  });
  const description = teil4Button?.querySelectorAll?.("span")?.[1] || null;
  if (description && description.textContent !== "Lesen") {
    description.textContent = "Lesen";
    changed = true;
  }

  const guidance = findByText(
    main,
    "p",
    "Teil 2 Schreiben Teil 3 Lesen and Teil 4 Hören complete the tasks and send only your final answers",
  );
  if (guidance) {
    guidance.textContent =
      "Teil 2 · Schreiben, Teil 3 · Lesen and Teil 4 · Lesen: complete the tasks and submit your final answers through the Submit tab. This workbook has no Hören assignment.";
    changed = true;
  }

  return changed;
};

const removeOldGoetheListeningCopy = (panel) => {
  const oldPhrases = [
    "this is a goethe standard horen test",
    "please be aware that this is a goethe standard horverstehen test",
    "the only parts that will be officially evaluated",
    "this process will require significant motivation",
    "this process requires motivation and self discipline",
    "submit any required listening work",
    "you must mark your own horen results",
    "goethe standard listening practice check your own answers with the video",
    "teil 4 is for self check listening practice",
  ];

  let changed = false;
  Array.from(panel?.querySelectorAll?.("p") || []).forEach((paragraph) => {
    if (paragraph.hasAttribute("data-a2-goethe-listening-note")) return;
    const text = normalizeText(paragraph.textContent);
    if (!oldPhrases.some((phrase) => text.includes(phrase))) return;
    paragraph.remove();
    changed = true;
  });
  changed = removeGenericSubmissionReminders(panel) || changed;
  return changed;
};

const cleanLegacyGoetheDay = (root, main) => {
  let changed = false;
  const { heading, panel } = findListeningPanel(main);
  if (heading && panel) {
    if (heading.textContent !== "Teil 4 · Hören · Goethe Self-Check") {
      heading.textContent = "Teil 4 · Hören · Goethe Self-Check";
      changed = true;
    }
    changed =
      ensureListeningNote(
        root,
        heading,
        "Watch the Goethe past-paper video and check your answers there. Teil 4 is self-check practice and is not submitted. The school evaluates only Teil 2 · Schreiben and Teil 3 · Lesen for this workbook.",
      ) || changed;
    changed = removeOldGoetheListeningCopy(panel) || changed;
  }

  changed = cleanSharedGuidance(main) || changed;
  changed = cleanSubmitPanelForGoethe(main) || changed;
  return changed;
};

const cleanDay27 = (root, main) => {
  let changed = false;
  const { heading, panel } = findListeningPanel(main);

  const headerCopy = findByText(
    main,
    "p",
    "Teil 1 is group practice submit Teil 2 Teil 3 and Teil 4",
  );
  if (headerCopy) {
    headerCopy.textContent =
      "Select Teil 1–4, Ref or Submit. Teil 1 is group practice; submit only Teil 2 and Teil 3.";
    changed = true;
  }

  if (heading && panel) {
    if (heading.textContent !== "Teil 4 · Hören · Goethe Self-Check") {
      heading.textContent = "Teil 4 · Hören · Goethe Self-Check";
      changed = true;
    }
    changed =
      ensureListeningNote(
        root,
        heading,
        "The Goethe past-paper questions and answers are inside the YouTube video. Watch the video and check your answers there; there are no separate workbook questions to submit.",
      ) || changed;
    changed = removeDirectChildContaining(panel, "beantworten Sie alle vier Fragen") || changed;
    changed = removeDirectChildContaining(panel, "Was hat Miriam gestern verloren") || changed;

    Array.from(panel.children || []).forEach((element) => {
      if (element.getAttribute?.("role") === "note") {
        element.remove();
        changed = true;
      }
    });
  }

  const submitHeading = findByText(main, "h1, h2, h3", "Submit Workbook Day 27");
  const submitPanel = submitHeading?.closest("section") || submitHeading?.parentElement;
  if (submitPanel) {
    const submitTitle = findByText(submitPanel, "h2, h3, h4, strong", "Submit Teil 2 Teil 3 and Teil 4");
    if (submitTitle) {
      submitTitle.textContent = "Submit Teil 2 and Teil 3.";
      changed = true;
    }
    const listeningItem = findByText(submitPanel, "li", "Teil 4 Hören");
    if (listeningItem) {
      listeningItem.remove();
      changed = true;
    }
  }

  return cleanSharedGuidance(main) || changed;
};

const cleanDay28 = (root, main) => {
  let changed = false;
  const { heading, panel } = findListeningPanel(main);

  if (heading && panel) {
    if (heading.textContent !== "Teil 4 · Hören · Goethe Self-Check") {
      heading.textContent = "Teil 4 · Hören · Goethe Self-Check";
      changed = true;
    }
    changed =
      ensureListeningNote(
        root,
        heading,
        "The Goethe past-paper questions and answers are contained in the YouTube video. Watch the video and check your answers there; no separate Hören questions are provided in this workbook.",
      ) || changed;

    const questionHeading = findByText(panel, "h2, h3, h4", "Fragen zum Hören");
    if (questionHeading) {
      let sibling = questionHeading.nextElementSibling;
      while (sibling && sibling.tagName === "DIV") {
        const next = sibling.nextElementSibling;
        sibling.remove();
        sibling = next;
      }
      questionHeading.remove();
      changed = true;
    }
  }

  const submitHeading = findByText(main, "h1, h2, h3", "Submit Workbook");
  const submitPanel = submitHeading?.closest("section") || submitHeading?.parentElement;
  const submitCopy = submitPanel
    ? findByText(submitPanel, "p", "reading listening answer letters")
    : null;
  if (submitCopy) {
    submitCopy.textContent =
      "Submit your required answers for A2 Day 28 here. Include your final writing text and your reading answer letters. Teil 4 · Hören is checked inside the Goethe video and is not submitted.";
    changed = true;
  }

  return cleanSharedGuidance(main) || changed;
};

export const cleanA2WorkbookPresentation = (
  root = document,
  pathname = typeof window !== "undefined" ? window.location.pathname : "",
) => {
  const normalizedPath = normalizePath(pathname);
  const isGoetheSelfCheck = A2_GOETHE_LISTENING_ONLY_PATHS.has(normalizedPath);
  const needsLegacySubmissionCleanup = A2_LEGACY_SUBMISSION_CLEANUP_PATHS.has(normalizedPath);
  if (!isGoetheSelfCheck && !needsLegacySubmissionCleanup) return false;

  const main = root.querySelector?.("main.layout-main") || root.querySelector?.("main") || root.body;
  if (!main) return false;

  let changed = false;
  if (needsLegacySubmissionCleanup) {
    changed = cleanLegacySubmissionNoise(main) || changed;
  }

  if (normalizedPath.includes("a2-day-25-")) {
    changed = cleanDay25ReadingLabels(main) || changed;
    return changed;
  }

  if (!isGoetheSelfCheck) return changed;
  if (normalizedPath.includes("a2-day-27-")) return cleanDay27(root, main) || changed;
  if (normalizedPath.includes("a2-day-28-")) return cleanDay28(root, main) || changed;
  return cleanLegacyGoetheDay(root, main) || changed;
};

export const cleanA2GoetheListeningOnlyWorkbook = (
  root = document,
  pathname = typeof window !== "undefined" ? window.location.pathname : "",
) => {
  const normalizedPath = normalizePath(pathname);
  if (!A2_GOETHE_LISTENING_ONLY_PATHS.has(normalizedPath)) return false;
  return cleanA2WorkbookPresentation(root, normalizedPath);
};

export const __TESTING__ = {
  normalizePath,
  normalizeText,
  findListeningPanel,
  removeDirectChildContaining,
  removeGenericSubmissionReminders,
  removeLegacyFinalSubmissionCards,
  cleanDay25ReadingLabels,
};
