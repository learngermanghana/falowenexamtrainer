const days = Object.freeze(Array.from({ length: 28 }, (_, index) => index + 1));

const A2_FOUNDATION_DAYS = new Set([1, 2]);
const A2_STRONG_DAYS = new Set([3, 4, 5, 7, 11, 12, 15, 16, 21, 22, 24, 26]);
const A2_UPGRADE_DAYS = new Set([6, 8, 9, 10, 13, 14, 17, 18, 19, 20, 23, 25, 27, 28]);

const B1_STRONG_DAYS = new Set([7, 10, 13, 20, 24]);
const B1_LEGACY_REVIEW_DAYS = new Set([1, 2, 3, 4, 5, 6, 8, 11, 19, 22]);
const B1_UPGRADE_DAYS = new Set([9, 12, 14, 15, 16, 17, 18, 21, 23, 25, 26, 27, 28]);

const a2Phase = (day) => {
  if (day <= 7) return "foundation";
  if (day <= 14) return "developing";
  if (day <= 21) return "independent";
  return "exam-ready";
};

const b1Phase = (day) => {
  if (day <= 9) return "foundation";
  if (day <= 18) return "developing";
  return "exam-ready";
};

const A2_PROMPTS = Object.freeze({
  foundation: [
    {
      title: "Evidence check",
      text: "Choose one answer and point to the exact sentence or detail that proves it. Then name one wrong option and say why it does not fit.",
    },
  ],
  developing: [
    {
      title: "Use two clues",
      text: "Choose one question and support the correct answer with two details from the text, not only one matching word.",
    },
    {
      title: "Reject the best distractor",
      text: "Choose the most believable wrong option and explain which detail in the text rules it out.",
    },
  ],
  independent: [
    {
      title: "Combine information",
      text: "Choose one question whose answer depends on more than one detail. Explain how the details work together.",
    },
    {
      title: "Change one condition",
      text: "Change one time, price, place or condition in the text. Which answer would change, and why?",
    },
    {
      title: "Say it differently",
      text: "Paraphrase one important sentence in simpler German without changing its meaning.",
    },
  ],
  "exam-ready": [
    {
      title: "Two-clue justification",
      text: "Justify one answer with two separate details. At least one clue should come from a different sentence or part of the text.",
    },
    {
      title: "Inference",
      text: "What can you understand from the text even though it is not written in exactly the same words? Give one short inference and the evidence for it.",
    },
    {
      title: "Distractor test",
      text: "Choose the strongest wrong option. Explain why it sounds possible at first and what finally makes it wrong.",
    },
  ],
});

const B1_PROMPTS = Object.freeze({
  foundation: [
    {
      title: "Evidence, not keywords",
      text: "Choose two answers and justify them with evidence from the text. Do not use a repeated keyword as your only reason.",
    },
    {
      title: "Paraphrase",
      text: "Choose one important sentence and express the same meaning in different German words.",
    },
  ],
  developing: [
    {
      title: "Cross-text evidence",
      text: "Choose one answer that needs information from more than one sentence or paragraph. Show both pieces of evidence.",
    },
    {
      title: "Inference",
      text: "Write one conclusion that is supported by the text but is not copied directly from it.",
    },
    {
      title: "Eliminate a distractor",
      text: "Choose the most convincing wrong option and explain precisely why the text rules it out.",
    },
  ],
  "exam-ready": [
    {
      title: "Main idea vs. detail",
      text: "State the main message of the text in one sentence, then identify one detail that supports it but is not the main idea.",
    },
    {
      title: "Two-source justification",
      text: "For one answer, combine evidence from two different parts of the text before you decide.",
    },
    {
      title: "Paraphrase the evidence",
      text: "Explain the evidence for one answer in your own German instead of repeating the sentence from the text.",
    },
    {
      title: "Best distractor",
      text: "Identify the wrong option that is closest to the text. Explain the small detail that makes it wrong.",
    },
  ],
});

const buildA2Audit = (day) => {
  let status = "upgrade";
  if (A2_FOUNDATION_DAYS.has(day)) status = "foundation";
  if (A2_STRONG_DAYS.has(day)) status = "strong";
  if (A2_UPGRADE_DAYS.has(day)) status = "upgrade";
  return Object.freeze({
    level: "A2",
    day,
    status,
    phase: a2Phase(day),
    needsDepthCheck: status === "upgrade",
    prompts: A2_PROMPTS[a2Phase(day)],
  });
};

const buildB1Audit = (day) => {
  let status = "upgrade";
  if (B1_STRONG_DAYS.has(day)) status = "strong";
  if (B1_LEGACY_REVIEW_DAYS.has(day)) status = "legacy-review";
  if (B1_UPGRADE_DAYS.has(day)) status = "upgrade";
  return Object.freeze({
    level: "B1",
    day,
    status,
    phase: b1Phase(day),
    needsDepthCheck: status !== "strong",
    prompts: B1_PROMPTS[b1Phase(day)],
  });
};

export const A2_READING_QUALITY_AUDIT = Object.freeze(
  Object.fromEntries(days.map((day) => [day, buildA2Audit(day)])),
);

export const B1_READING_QUALITY_AUDIT = Object.freeze(
  Object.fromEntries(days.map((day) => [day, buildB1Audit(day)])),
);

export const getReadingQualityAudit = (level, day) => {
  const normalizedLevel = String(level || "").toUpperCase();
  const normalizedDay = Number(day);
  if (normalizedLevel === "A2") return A2_READING_QUALITY_AUDIT[normalizedDay] || null;
  if (normalizedLevel === "B1") return B1_READING_QUALITY_AUDIT[normalizedDay] || null;
  return null;
};

export const READING_QUALITY_AUDIT_VERSION = "2026-09-30";
