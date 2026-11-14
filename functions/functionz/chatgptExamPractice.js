"use strict";
// Answer-safe exam preparation: explicit allowlist of published source sets.
// The server registry includes private keys and rubrics. Export only the
// student-facing writing/speaking fields below, never the source object.
const registry = require("../data/assessmentTasks.json");
const RELEASED = new Set(["a1-mock-02", "a1-mock-03", "a2-mock-02"]);
const text = (x, max = 1200) => typeof x === "string" ? x.slice(0, max) : "";
const list = (x, max = 10) => Array.isArray(x)
  ? x.filter(v => typeof v === "string").slice(0, max).map(v => text(v, 250))
  : [];
const safeTask = (task) => {
  if (!task || Array.isArray(task) || typeof task !== "object") return null;
  const out = {};
  for (const field of ["title", "topic", "situation", "instruction", "prompt", "keyword", "theme",
                       "context", "recipient", "subject", "register", "followUp"]) {
    if (typeof task[field] === "string") out[field] = text(task[field]);
  }
  for (const field of ["points", "card", "followups"]) {
    if (Array.isArray(task[field])) out[field] = list(task[field]);
  }
  if (Number.isInteger(task.wordTarget)) out.wordTarget = task.wordTarget;
  if (Number.isInteger(task.minWords)) out.minWords = task.minWords;
  if (Number.isInteger(task.maxWords)) out.maxWords = task.maxWords;
  return Object.keys(out).length ? out : null;
};
function getExamPractice(level, mockId, skill, part) {
  if (typeof mockId !== "string" || !RELEASED.has(mockId)) {
    return { available: false, message: "This mock is not in the approved ChatGPT practice export." };
  }
  const source = registry.mockSets?.[mockId];
  if (!source || source.level !== level) {
    return { available: false, message: "This exam is unavailable for your enrolled course." };
  }
  if (!["writing", "speaking"].includes(skill)) {
    return { available: false, message: "Lesen and Hören require a separately reviewed learner-safe question export. Use the Exams Room for timed exams and audio." };
  }
  const section = source[skill];
  const key = part === undefined ? undefined : String(part);
  let task = null;
  if (Array.isArray(section)) {
    task = section.find(entry => entry.id === key) || (!key ? section[0] : null);
  } else if (section && typeof section === "object") {
    if (skill === "writing") {
      task = key && section[key] && typeof section[key] === "object"
        ? section[key] : section.teil1 || section;
      // A1 writing includes nested private form solutions: never return them.
    } else {
      task = key && section[key] && typeof section[key] === "object"
        ? section[key] : section.teil2 || section.teil3 || section;
    }
  }
  const prompt = safeTask(task);
  return prompt ? {
    available: true, level, mockId, skill,
    part: key || (task?.id || (skill === "writing" ? "teil1" : "teil2")),
    task: prompt,
    practiceOnly: true,
    officialResult: false,
    examRoomUrl: "https://www.falowen.app/exams",
    instructions: "Show one original learner-facing prompt at a time, await the student's response, then give helpful conversational feedback. Do not claim to know a hidden marking key. Never post an official exam answer or score.",
  } : { available: false, message: "This section is not available for ChatGPT practice." };
}
module.exports = { getExamPractice, safeTask };
