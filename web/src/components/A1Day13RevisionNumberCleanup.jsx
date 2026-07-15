import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const A1_DAY13_REVISION_WORKBOOK_PATH =
  "/campus/course/a1-day-13-revision-numbers-time-and-prices-workbook";

export const REMOVED_A1_DAY13_NUMBER_PROMPTS = Object.freeze([
  "6,789",
  "7,890",
  "9,999",
]);

export const A1_DAY13_TYPED_ANSWER_SECTIONS = Object.freeze({
  "Practice: Numbers from 1 to 10,000": {
    compact: true,
    answers: {
      "56": { model: "sechsundfünfzig" },
      "248": { model: "zweihundertachtundvierzig" },
      "1,234": { model: "eintausendzweihundertvierunddreißig" },
      "3,452": { model: "dreitausendvierhundertzweiundfünfzig" },
      "4,560": { model: "viertausendfünfhundertsechzig" },
      "5,678": { model: "fünftausendsechshundertachtundsiebzig" },
    },
  },
  "Time Practice": {
    answers: {
      "2:15": {
        model: "Es ist Viertel nach zwei.",
        accepted: ["Es ist Viertel nach zwei.", "Viertel nach zwei."],
      },
      "5:45": {
        model: "Es ist Viertel vor sechs.",
        accepted: ["Es ist Viertel vor sechs.", "Viertel vor sechs."],
      },
      "7:30": {
        model: "Es ist halb acht.",
        accepted: ["Es ist halb acht.", "Halb acht."],
      },
      "10:10": {
        model: "Es ist zehn nach zehn.",
        accepted: ["Es ist zehn nach zehn.", "Zehn nach zehn."],
      },
      "8:20": {
        model: "Es ist zwanzig nach acht.",
        accepted: ["Es ist zwanzig nach acht.", "Zwanzig nach acht."],
      },
    },
  },
  "Price Question and Answer Practice": {
    answers: {
      "Wie viel kostet das Buch?": {
        model: "Es kostet zehn Euro.",
        accepted: [
          "Es kostet zehn Euro.",
          "Es kostet 10 Euro.",
          "Das Buch kostet zehn Euro.",
          "Das Buch kostet 10 Euro.",
        ],
      },
      "Wie viel kostet der Apfel?": {
        model: "Er kostet zwei Euro.",
        accepted: [
          "Er kostet zwei Euro.",
          "Er kostet 2 Euro.",
          "Der Apfel kostet zwei Euro.",
          "Der Apfel kostet 2 Euro.",
        ],
      },
      "Wie viel kostet die Banane?": {
        model: "Sie kostet einen Euro.",
        accepted: [
          "Sie kostet einen Euro.",
          "Sie kostet 1 Euro.",
          "Die Banane kostet einen Euro.",
          "Die Banane kostet 1 Euro.",
        ],
      },
      "Wie viel kostet die Zeitung?": {
        model: "Sie kostet zwei Euro fünfzig.",
        accepted: [
          "Sie kostet zwei Euro fünfzig.",
          "Sie kostet 2,50 Euro.",
          "Sie kostet zwei Euro und fünfzig Cent.",
          "Die Zeitung kostet zwei Euro fünfzig.",
          "Die Zeitung kostet 2,50 Euro.",
          "Die Zeitung kostet zwei Euro und fünfzig Cent.",
        ],
      },
      "Wie viel kostet die Tasse?": {
        model: "Sie kostet drei Euro.",
        accepted: [
          "Sie kostet drei Euro.",
          "Sie kostet 3 Euro.",
          "Die Tasse kostet drei Euro.",
          "Die Tasse kostet 3 Euro.",
        ],
      },
    },
  },
});

const HIDDEN_ATTRIBUTE = "data-a1-day13-number-prompt-hidden";
const ANSWER_CHECK_ATTRIBUTE = "data-a1-day13-answer-check";
const ANSWER_INPUT_ATTRIBUTE = "data-a1-day13-answer-input";
const removedPromptSet = new Set(REMOVED_A1_DAY13_NUMBER_PROMPTS);
const answerInputState = new WeakMap();

const normalizePath = (value = "") => String(value || "").replace(/\/+$/, "") || "/";
const normalizeLabel = (value = "") => String(value || "").replace(/\s+/g, " ").trim();

export const normalizeA1Day13Answer = (value = "", { compact = false } = {}) => {
  const normalized = String(value || "")
    .normalize("NFC")
    .toLocaleLowerCase("de-DE")
    .replace(/[„“”"']/g, "")
    .replace(/[.!?;:]+/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return compact ? normalized.replace(/[\s-]+/g, "") : normalized;
};

const setFeedback = (feedback, input, result, text) => {
  feedback.hidden = false;
  feedback.dataset.result = result;
  feedback.textContent = text;

  if (result === "correct") {
    feedback.style.color = "#166534";
    input.style.borderColor = "#16a34a";
    input.style.background = "#f0fdf4";
    return;
  }

  if (result === "incorrect") {
    feedback.style.color = "#b91c1c";
    input.style.borderColor = "#dc2626";
    input.style.background = "#fef2f2";
    return;
  }

  feedback.style.color = "#92400e";
};

const clearFeedback = (input) => {
  const state = answerInputState.get(input);
  if (!state) return;

  state.feedback.hidden = true;
  state.feedback.textContent = "";
  delete state.feedback.dataset.result;
  input.style.borderColor = state.originalBorderColor;
  input.style.background = state.originalBackground;
};

export const hideRemovedA1Day13NumberPrompts = (root = document) => {
  if (!root?.querySelectorAll) return [];

  const hiddenCards = [];

  Array.from(root.querySelectorAll("strong")).forEach((prompt) => {
    const label = normalizeLabel(prompt.textContent);
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

export const addA1Day13AnswerChecks = (root = document) => {
  if (!root?.querySelectorAll) return [];

  const addedControls = [];

  Array.from(root.querySelectorAll("h2")).forEach((heading) => {
    const sectionTitle = normalizeLabel(heading.textContent);
    const sectionConfig = A1_DAY13_TYPED_ANSWER_SECTIONS[sectionTitle];
    if (!sectionConfig) return;

    const sectionRoot = heading.closest("section");
    if (!sectionRoot) return;

    Array.from(sectionRoot.querySelectorAll("input")).forEach((input) => {
      if (input.hasAttribute(ANSWER_INPUT_ATTRIBUTE)) return;

      const card = input.parentElement;
      const prompt = normalizeLabel(card?.querySelector?.("strong")?.textContent);
      const answerConfig = sectionConfig.answers[prompt];
      if (!card || !answerConfig) return;

      const controls = document.createElement("div");
      controls.setAttribute(ANSWER_CHECK_ATTRIBUTE, "true");
      Object.assign(controls.style, {
        display: "grid",
        gap: "8px",
      });

      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "Check answer";
      Object.assign(button.style, {
        background: "#111827",
        border: "1px solid #111827",
        borderRadius: "10px",
        color: "#ffffff",
        cursor: "pointer",
        justifySelf: "start",
        padding: "9px 13px",
      });

      const feedback = document.createElement("div");
      feedback.hidden = true;
      feedback.setAttribute("aria-live", "polite");
      Object.assign(feedback.style, {
        fontSize: "14px",
        fontWeight: "600",
        lineHeight: "1.45",
      });

      controls.append(button, feedback);
      card.appendChild(controls);

      const state = {
        controls,
        feedback,
        originalBackground: input.style.background || "",
        originalBorderColor: input.style.borderColor || "",
      };

      const handleInput = () => clearFeedback(input);
      const handleCheck = () => {
        const learnerAnswer = normalizeA1Day13Answer(input.value, sectionConfig);
        if (!learnerAnswer) {
          setFeedback(feedback, input, "empty", "Type an answer first.");
          return;
        }

        const acceptedAnswers = answerConfig.accepted || [answerConfig.model];
        const isCorrect = acceptedAnswers.some(
          (acceptedAnswer) => normalizeA1Day13Answer(acceptedAnswer, sectionConfig) === learnerAnswer,
        );

        setFeedback(
          feedback,
          input,
          isCorrect ? "correct" : "incorrect",
          isCorrect ? "✅ Correct!" : `❌ Not quite. Correct answer: ${answerConfig.model}`,
        );
      };

      state.handleInput = handleInput;
      state.handleCheck = handleCheck;
      answerInputState.set(input, state);
      input.setAttribute(ANSWER_INPUT_ATTRIBUTE, "true");
      input.addEventListener("input", handleInput);
      button.addEventListener("click", handleCheck);
      addedControls.push(controls);
    });
  });

  return addedControls;
};

export const removeA1Day13AnswerChecks = (root = document) => {
  if (!root?.querySelectorAll) return;

  Array.from(root.querySelectorAll(`input[${ANSWER_INPUT_ATTRIBUTE}]`)).forEach((input) => {
    const state = answerInputState.get(input);
    if (state) {
      input.removeEventListener("input", state.handleInput);
      state.controls?.querySelector("button")?.removeEventListener("click", state.handleCheck);
      input.style.borderColor = state.originalBorderColor;
      input.style.background = state.originalBackground;
      state.controls?.remove();
      answerInputState.delete(input);
    }
    input.removeAttribute(ANSWER_INPUT_ATTRIBUTE);
  });
};

export default function A1Day13RevisionNumberCleanup() {
  const location = useLocation();

  useEffect(() => {
    if (normalizePath(location.pathname) !== A1_DAY13_REVISION_WORKBOOK_PATH) {
      restoreRemovedA1Day13NumberPrompts();
      removeA1Day13AnswerChecks();
      return undefined;
    }

    const applyEnhancements = () => {
      hideRemovedA1Day13NumberPrompts();
      addA1Day13AnswerChecks();
    };
    applyEnhancements();

    const observer = new MutationObserver(applyEnhancements);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      restoreRemovedA1Day13NumberPrompts();
      removeA1Day13AnswerChecks();
    };
  }, [location.pathname]);

  return null;
}
