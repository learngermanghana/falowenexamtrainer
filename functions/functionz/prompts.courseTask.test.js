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
console.log("A1 course-task writing prompt contract passed.");
