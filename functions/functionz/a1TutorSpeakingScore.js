"use strict";

const cards = require("../../shared/a1GoetheTeil3PictureCards.json");
const CRITERIA = Object.freeze({
  request: 4,
  politeness: 2,
  intelligibility: 2,
  completeness: 2,
});
const getA1TutorRequestCard = id => cards.find(card => card.id === String(id || "").trim().toLowerCase()) || null;

function tutorRequestPrompt(card) {
  if (!card) throw new Error("A valid Goethe A1 picture card is required.");
  return [
    "You assess ONE Goethe A1 speaking Teil 3 polite request from a learner's German transcript.",
    "You must evaluate the learner's actual words, not their ability to read a long instruction.",
    "Picture card: " + card.label,
    "Situation: " + card.context,
    "An acceptable example (do not require exact words): " + card.modelAnswer,
    "Accept any natural, comprehensible polite request appropriate for the selected picture, including imperatives with bitte.",
    "Score task fit and request meaning 0–4, politeness (bitte / Sie or equivalent) 0–2,",
    "intelligibility of transcribed speech 0–2, and completeness of the spoken expression 0–2.",
    "You only have a speech-to-text transcript, not audio prosody. Do NOT claim to judge pronunciation or accent.",
    "Allow beginner-level grammar errors if the request remains understandable. Missing or irrelevant requests must score low.",
    "Respond ONLY with JSON and no markdown. Required shape:",
    '{"criteria":{"request":0,"politeness":0,"intelligibility":0,"completeness":0},"feedback":"One short actionable English sentence about this spoken answer.","correction":"One short natural corrected German request."}',
    "Scores must be numbers within each criterion's maximum. Do not invent words missing from the transcript.",
  ].join("\n");
}

function parseA1TutorRequestScore(raw, card) {
  const original = typeof raw === "string" ? raw.trim() : "";
  const stripped = original.replace(/^\`\`\`(?:json)?\s*/i, "").replace(/\s*\`\`\`$/, "");
  const from = stripped.indexOf("{"), to = stripped.lastIndexOf("}");
  if (from < 0 || to <= from) throw new Error("Speaking scorer returned no structured rubric.");
  let data;
  try { data = JSON.parse(stripped.slice(from, to + 1)); }
  catch { throw new Error("Speaking scorer returned invalid rubric JSON."); }
  const rubric = {};
  for (const [key, maximum] of Object.entries(CRITERIA)) {
    const number = Number(data?.criteria?.[key]);
    if (data?.criteria?.[key] === null || data?.criteria?.[key] === undefined ||
      !Number.isFinite(number) || number < 0 || number > maximum) {
      throw new Error("Speaking scorer returned an invalid " + key + " score.");
    }
    rubric[key] = Math.round(number * 10) / 10;
  }
  const feedback = String(data?.feedback || "").trim().slice(0, 650);
  const correction = String(data?.correction || "").trim().slice(0, 250);
  if (!feedback) throw new Error("Speaking scorer omitted feedback.");
  return {
    cardId: card.id,
    cardLabel: card.label,
    score: Math.round(Object.values(rubric).reduce((n, x) => n + x, 0) * 10) / 10,
    maxScore: 10,
    rubric, feedback,
    correction: correction || card.modelAnswer,
    rubricLabels: {
      request: "Passende Bitte", politeness: "Höflichkeit",
      intelligibility: "Verständlichkeit im Transkript", completeness: "Vollständiger Satz",
    },
  };
}

module.exports = { getA1TutorRequestCard, tutorRequestPrompt, parseA1TutorRequestScore, CRITERIA };
