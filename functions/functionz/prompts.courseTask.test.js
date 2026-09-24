const assert = require("node:assert/strict");
const { markPrompt } = require("./prompts");

const formalPrompt = markPrompt({
  schreibenLevel: "A1",
  studentName: "Vanessa",
  program: "german",
  submissionContext:
    "course-task:formal email to a language school using Sie Ihnen and a formal closing",
});

assert.match(
  formalPrompt,
  /Exact course task: formal email to a language school using Sie Ihnen and a formal closing\./,
);
assert.match(
  formalPrompt,
  /Do not mark a formal task as informal or an informal task as formal\./,
);

const standardPrompt = markPrompt({
  schreibenLevel: "A1",
  studentName: "Vanessa",
  program: "german",
  submissionContext: "course",
});

assert.doesNotMatch(standardPrompt, /Exact course task:/);

const c2Prompt = markPrompt({
  schreibenLevel: "C2",
  studentName: "Student",
  program: "german",
  submissionContext: "course-task:C2 Day 28 Prüfungssimulation",
});

assert.match(c2Prompt, /A1, A2, B1, B2, C1, and C2 German/);
assert.match(c2Prompt, /Advanced German marking rules for B1\/B2\/C1\/C2/);
assert.match(c2Prompt, /For C2, be stricter on nuance, precision, register control, cohesion, evidence strength and natural collocation/);
assert.match(c2Prompt, /reads closer to C1/);

console.log("A1/C2 course-task writing prompt contract passed.");
