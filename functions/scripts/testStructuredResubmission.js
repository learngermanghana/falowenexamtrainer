const assert = require("node:assert/strict");
const { _testing } = require("../resubmission.js");

const basePayload = {
  assignmentId: "A2-6.15",
  canonicalAssignmentKey: "A2-6.15",
  assignmentTitle: "A2 Day 15",
  level: "A2",
  day: 15,
  submissionText: "TEIL 2\nHallo Anna.\n\nTEIL 3\n1. B\n2. A\n\nTEIL 4\n1. A\n2. B",
  improvementSummary: "I corrected the wrong answer in Teil 3 after reviewing the lesson.",
  previousScore: 50,
  submissionStructureVersion: 1,
  structuredSections: {
    teil2: "Hallo Anna.",
    teil3: "1. B\n2. A",
    teil4: "1. A\n2. B",
  },
  submissionSectionOrder: ["teil2", "teil3", "teil4"],
  requiredSubmissionParts: ["teil2", "teil3", "teil4"],
  previousStructuredSections: {
    teil2: "Hallo Anna.",
    teil3: "1. B\n2. C",
    teil4: "1. A\n2. B",
  },
};

const validated = _testing.validatePayload(basePayload);
assert.ok(validated.structured, "structured payload should be retained");
assert.deepEqual(validated.structured.changedSubmissionParts, ["teil3"]);
assert.equal(validated.structured.structuredSections.teil3, "1. B\n2. A");

assert.throws(
  () => _testing.validatePayload({
    ...basePayload,
    submissionText: "TEIL 2\nHallo Anna.\n\nTEIL 3\n1. B\n2. C\n\nTEIL 4\n1. A\n2. B",
    structuredSections: basePayload.previousStructuredSections,
  }),
  /unchanged/i,
);

assert.throws(
  () => _testing.validatePayload({
    ...basePayload,
    structuredSections: { ...basePayload.structuredSections, teil4: "" },
  }),
  /required Teil/i,
);

const legacy = _testing.validatePayload({
  ...basePayload,
  submissionText: "This is a legacy corrected response that is intentionally longer than eighty characters so the older validation rule remains unchanged.",
  structuredSections: null,
  submissionSectionOrder: null,
  requiredSubmissionParts: null,
  previousStructuredSections: null,
});
assert.equal(legacy.structured, null);

console.log("Structured resubmission server contract passed.");
