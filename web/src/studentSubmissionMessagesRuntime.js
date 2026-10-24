const HISTORICAL_RESUBMISSION_ID = "falowen-historical-resubmission";

const normalize = (value = "") =>
  String(value || "")
    .replace(/\s+/g, " ")
    .trim();

const wordCount = (value = "") =>
  normalize(value)
    .split(/\s+/)
    .filter(Boolean).length;

const friendlySubmissionMessage = (rawMessage = "") => {
  const raw = normalize(rawMessage);
  const message = raw.toLowerCase();
  if (!message) return "";

  if (message.includes("corrected text has already been submitted") || message.includes("already been submitted")) {
    return "Your corrected answer is the same as one you already submitted. Make the needed corrections, add the missing answers, and submit the improved version.";
  }
  if (message.includes("too similar") || message.includes("not enough changes") || message.includes("changed characters") || message.includes("new words")) {
    return "Your corrected answer is still too similar to your previous submission. Correct the wrong answers and add the missing work before resubmitting.";
  }
  if (message.includes("improvement") && (message.includes("short") || message.includes("explain") || message.includes("required"))) {
    return "Please explain what you improved in at least 8 words. For example: ‘I corrected questions 3 and 4 and completed the missing answers.’";
  }
  if (message.includes("corrected text is too short") || message.includes("complete corrected task") || message.includes("submission is too short")) {
    return "Your corrected answer is too short. Submit the complete corrected task, including the answers you missed or got wrong.";
  }
  if (message.includes("resubmission_cooldown") || message.includes("wait before submitting again") || message.includes("resource-exhausted") && message.includes("wait")) {
    return "Please wait a few minutes before submitting this assignment again.";
  }
  if (message.includes("used all resubmissions") || message.includes("all resubmissions")) {
    return "You have already used all available resubmission attempts for this assignment. Please contact your teacher if you need help.";
  }
  if (message.includes("already passed")) {
    return "This assignment has already been passed, so you do not need to resubmit it.";
  }
  if (message.includes("displayed score is no longer") || message.includes("reviewed score could not be verified")) {
    return "Your result has changed since this page was opened. Refresh the page, check the latest score, and try again.";
  }
  if (message.includes("student code could not be verified")) {
    return "We could not confirm your student account. Refresh the page and sign in again. If it still does not work, contact your teacher.";
  }
  if (message.includes("unauthenticated") || message.includes("sign in before") || message.includes("permission-denied")) {
    return "Your session may have expired. Refresh the page, sign in again, and then submit your work.";
  }
  if (message.includes("network") || message.includes("offline") || message.includes("failed to fetch")) {
    return "We could not connect right now. Check your internet connection and try again.";
  }
  if (
    message === "internal" ||
    message.endsWith("] internal") ||
    message.includes("functions/internal") ||
    message.includes("firebaseerror") ||
    message.includes("https callable")
  ) {
    return "We could not submit your work. Check that every required field is complete, then try again. If it still does not work, contact your teacher.";
  }

  return raw;
};

const setHistoricalMessage = (section, text) => {
  const status = section?.querySelector('[role="status"]');
  if (!status) return;
  status.textContent = text;
  status.style.color = "#b91c1c";
};

const findConfirmationCheckbox = (root = document) => {
  const labels = Array.from(root.querySelectorAll("label"));
  const label = labels.find((candidate) =>
    /i checked that this is the correct assignment/i.test(candidate.textContent || ""),
  );
  return label?.querySelector('input[type="checkbox"]') || null;
};

const validateHistoricalResubmission = (event) => {
  const button = event.target?.closest?.(`#${HISTORICAL_RESUBMISSION_ID} button`);
  if (!button || !/submit corrected work/i.test(button.textContent || "")) return;

  const section = button.closest(`#${HISTORICAL_RESUBMISSION_ID}`);
  if (!section) return;

  const textareas = section.querySelectorAll("textarea");
  const correctedText = normalize(textareas[0]?.value || "");
  const improvementSummary = normalize(textareas[1]?.value || "");
  const confirmation = findConfirmationCheckbox(document);

  let validationMessage = "";
  if (confirmation && !confirmation.checked) {
    validationMessage = "Tick ‘I checked that this is the correct assignment’ before submitting your corrected work.";
  } else if (!correctedText) {
    validationMessage = "Enter your complete corrected answer before submitting.";
  } else if (correctedText.length < 80) {
    validationMessage = "Your corrected answer is too short. Submit the complete corrected task, including the answers you missed or got wrong.";
  } else if (!improvementSummary) {
    validationMessage = "Tell us what you improved before submitting your corrected work.";
  } else if (improvementSummary.length < 25 || wordCount(improvementSummary) < 8) {
    validationMessage = "Please explain what you improved in at least 8 words. For example: ‘I corrected questions 3 and 4 and completed the missing answers.’";
  }

  if (!validationMessage) return;
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  setHistoricalMessage(section, validationMessage);
};

const shouldSanitize = (node) => {
  if (!(node instanceof HTMLElement)) return false;
  if (node.closest?.(`#${HISTORICAL_RESUBMISSION_ID}`)) return true;
  if (node.getAttribute("role") === "alert" || node.getAttribute("role") === "status") {
    const nearby = normalize(node.parentElement?.textContent || "").toLowerCase();
    return /submit|submission|resubmit|resubmission|assignment|corrected work/.test(nearby);
  }
  return false;
};

const sanitizeNode = (node) => {
  if (!shouldSanitize(node)) return;
  const raw = normalize(node.textContent || "");
  const friendly = friendlySubmissionMessage(raw);
  if (friendly && friendly !== raw) node.textContent = friendly;
};

const sanitizeSubmissionMessages = (root = document) => {
  const candidates = [
    ...Array.from(root.querySelectorAll?.(`#${HISTORICAL_RESUBMISSION_ID} [role="status"]`) || []),
    ...Array.from(root.querySelectorAll?.('[role="alert"], [role="status"]') || []),
  ];
  [...new Set(candidates)].forEach(sanitizeNode);
};

export { friendlySubmissionMessage, validateHistoricalResubmission, sanitizeSubmissionMessages };

if (process.env.NODE_ENV !== "test" && typeof document !== "undefined") {
  document.addEventListener("click", validateHistoricalResubmission, true);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.target instanceof HTMLElement) sanitizeNode(mutation.target);
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        sanitizeNode(node);
        sanitizeSubmissionMessages(node);
      });
    });
  });

  observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  [100, 400, 1000].forEach((delay) => window.setTimeout(() => sanitizeSubmissionMessages(document), delay));
}
