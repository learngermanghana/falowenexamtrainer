import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const HIDDEN_ATTRIBUTE = "data-falowen-locked-submission-hidden";
const PREVIOUS_DISPLAY_ATTRIBUTE = "data-falowen-locked-submission-display";

const normalizeText = (value = "") =>
  String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const findElementByExactText = (selectors, acceptedTexts) => {
  const normalizedTargets = new Set(acceptedTexts.map(normalizeText));
  return (
    Array.from(document.querySelectorAll(selectors)).find((element) =>
      normalizedTargets.has(normalizeText(element.textContent))
    ) || null
  );
};

const findLockedSubmissionCard = () => {
  const heading = findElementByExactText("h1, h2, h3, h4", [
    "Submit Assignment",
    "Aufgabe einreichen",
  ]);
  if (!heading) return null;

  let current = heading.parentElement;
  while (current && current !== document.body) {
    const text = normalizeText(current.textContent);
    const hasSubmissionForm = Boolean(current.querySelector("form"));
    const hasLockedControl =
      text.includes("submission locked") ||
      text.includes("this assignment is locked") ||
      text.includes("already submitted") ||
      text.includes("einreichung gesperrt") ||
      text.includes("bereits eingereicht");

    if (hasSubmissionForm && hasLockedControl) return current;
    current = current.parentElement;
  }

  return null;
};

const isResubmissionUnlocked = () => {
  const unlockedLabel = findElementByExactText("strong, h1, h2, h3, h4, span", [
    "Resubmission unlocked",
    "Wiedereinreichung freigeschaltet",
  ]);
  if (!unlockedLabel) return false;

  return Array.from(document.querySelectorAll("button")).some((button) => {
    const text = normalizeText(button.textContent);
    return text === "submit resubmission" || text === "wiedereinreichung senden";
  });
};

const restoreHiddenSubmissionCards = () => {
  Array.from(document.querySelectorAll(`[${HIDDEN_ATTRIBUTE}]`)).forEach((card) => {
    card.style.display = card.getAttribute(PREVIOUS_DISPLAY_ATTRIBUTE) || "";
    card.removeAttribute(HIDDEN_ATTRIBUTE);
    card.removeAttribute(PREVIOUS_DISPLAY_ATTRIBUTE);
    card.removeAttribute("aria-hidden");
  });
};

const compactLockedSubmissionCard = () => {
  if (typeof document === "undefined") return;

  if (!isResubmissionUnlocked()) {
    restoreHiddenSubmissionCards();
    return;
  }

  const card = findLockedSubmissionCard();
  if (!card) return;

  if (!card.hasAttribute(HIDDEN_ATTRIBUTE)) {
    card.setAttribute(PREVIOUS_DISPLAY_ATTRIBUTE, card.style.display || "");
    card.setAttribute(HIDDEN_ATTRIBUTE, "true");
    card.setAttribute("aria-hidden", "true");
  }
  card.style.display = "none";
};

export const __TESTING__ = {
  compactLockedSubmissionCard,
  findLockedSubmissionCard,
  isResubmissionUnlocked,
  normalizeText,
  restoreHiddenSubmissionCards,
};

const LockedSubmissionCardCompactor = () => {
  const location = useLocation();

  useEffect(() => {
    if (!String(location.pathname || "").includes("/campus")) {
      restoreHiddenSubmissionCards();
      return undefined;
    }

    let timeoutId = null;
    const scheduleUpdate = () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(compactLockedSubmissionCard, 100);
    };

    scheduleUpdate();
    const observer = new MutationObserver(scheduleUpdate);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      observer.disconnect();
      restoreHiddenSubmissionCards();
    };
  }, [location.pathname, location.search]);

  return null;
};

export default LockedSubmissionCardCompactor;
