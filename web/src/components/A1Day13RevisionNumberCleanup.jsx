import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const A1_DAY13_REVISION_WORKBOOK_PATH =
  "/campus/course/a1-day-13-revision-numbers-time-and-prices-workbook";

export const REMOVED_A1_DAY13_NUMBER_PROMPTS = Object.freeze([
  "6,789",
  "7,890",
  "9,999",
]);

const HIDDEN_ATTRIBUTE = "data-a1-day13-number-prompt-hidden";
const removedPromptSet = new Set(REMOVED_A1_DAY13_NUMBER_PROMPTS);

const normalizePath = (value = "") => String(value || "").replace(/\/+$/, "") || "/";

export const hideRemovedA1Day13NumberPrompts = (root = document) => {
  if (!root?.querySelectorAll) return [];

  const hiddenCards = [];

  Array.from(root.querySelectorAll("strong")).forEach((prompt) => {
    const label = String(prompt.textContent || "").replace(/\s+/g, " ").trim();
    if (!removedPromptSet.has(label)) return;

    const card = prompt.parentElement;
    if (!card?.querySelector?.("input") || card.hasAttribute(HIDDEN_ATTRIBUTE)) return;

    card.hidden = true;
    card.setAttribute(HIDDEN_ATTRIBUTE, "true");
    hiddenCards.push(card);
  });

  return hiddenCards;
};

export const restoreRemovedA1Day13NumberPrompts = (root = document) => {
  if (!root?.querySelectorAll) return;

  Array.from(root.querySelectorAll(`[${HIDDEN_ATTRIBUTE}]`)).forEach((card) => {
    card.hidden = false;
    card.removeAttribute(HIDDEN_ATTRIBUTE);
  });
};

export default function A1Day13RevisionNumberCleanup() {
  const location = useLocation();

  useEffect(() => {
    if (normalizePath(location.pathname) !== A1_DAY13_REVISION_WORKBOOK_PATH) {
      restoreRemovedA1Day13NumberPrompts();
      return undefined;
    }

    const applyCleanup = () => hideRemovedA1Day13NumberPrompts();
    applyCleanup();

    const observer = new MutationObserver(applyCleanup);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      restoreRemovedA1Day13NumberPrompts();
    };
  }, [location.pathname]);

  return null;
}
