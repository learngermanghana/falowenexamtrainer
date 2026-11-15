"use strict";

// Reviewable, answer-free snapshot generated from the real A1 Campus draft
// profiles and legacy Chapter 3 guard. Unknown profiles fail closed.
const RULES = require("../data/chatgptA1SubmissionRules.generated.json");

const normalizedKey = key => String(key || "").trim().toUpperCase();
const TIMED_A1_ASSIGNMENTS = new Set(RULES.timedAssignmentIds || []);

function isA1TimedAssignment(assignmentId, day) {
  return TIMED_A1_ASSIGNMENTS.has(normalizedKey(assignmentId)) ||
    (Number.isInteger(Number(day)) && Number(day) >= RULES.timedStartDay);
}

function parseA1SubmissionSections(text = "") {
  const sections = new Map();
  let currentSection = "";
  String(text || "").split(/\r?\n/).forEach(rawLine => {
    let line = rawLine.trim();
    if (!line) return;
    const heading = line.match(/^(?:teil|part)\s*(\d+)\b/i);
    if (heading) {
      currentSection = `teil-${Number(heading[1])}`;
      if (!sections.has(currentSection)) sections.set(currentSection, []);
      line = line.slice(heading[0].length).replace(/^\s*[·:—-]?\s*/, "").trim();
      if (!line) return;
    }
    if (!currentSection) return;
    if (!sections.has(currentSection)) sections.set(currentSection, []);
    sections.get(currentSection).push(line);
  });
  return sections;
}

function validateA1ChatgptSubmissionCompleteness({ assignmentId = "", answerText = "" } = {}) {
  const key = normalizedKey(assignmentId);
  const requirements = RULES.supportedTextAssignments?.[key];
  if (!requirements || !Object.keys(requirements).length) {
    return {
      ok: false,
      error: "This assignment requires Campus Review & Submit (for example, a speaking, recording, or unsupported workbook task). ChatGPT cannot create a permanent submission lock for it.",
    };
  }
  const sections = parseA1SubmissionSections(answerText);
  const missing = [];
  for (const [part, rule] of Object.entries(requirements)) {
    const lines = sections.get(part) || [];
    if (rule.kind === "text") {
      if (!lines.join("\n").trim()) missing.push(part.replace("teil-", "Teil ") + " writing/response");
    } else if (rule.kind === "numbered") {
      const numbered = new Set();
      for (const line of lines) {
        const match = line.match(/^\s*(\d{1,2})\s*(?:[\).:\-]\s*|\s+)(\S.*)$/);
        if (match && String(match[2] || "").trim()) numbered.add(Number(match[1]));
      }
      const absent = rule.numbers.filter(number => !numbered.has(number));
      if (absent.length) missing.push(part.replace("teil-", "Teil ") + " answers " + absent.join(", "));
    } else {
      return { ok: false, error: "Unrecognized A1 submission section rule. Complete this workbook in Campus." };
    }
  }
  if (missing.length) {
    return {
      ok: false,
      error: "Your workbook is incomplete. Finish " + missing.join("; ") +
        " before official submission. Nothing has been submitted or locked. Continue in Campus if needed.",
    };
  }
  return { ok: true };
}

module.exports = {
  isA1TimedAssignment,
  validateA1ChatgptSubmissionCompleteness,
  parseA1SubmissionSections,
};
