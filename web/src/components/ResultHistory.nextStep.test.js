import { getNextStep } from "./ResultHistory";

describe("evidence-specific result next steps", () => {
  it("directs learners to missed questions when objective answers were incorrect", () => {
    expect(getNextStep({ wrongAnswers: [{ question: "2", expected: "B" }] })).toMatch(/missed questions/i);
  });
  it("directs learners to actual correction points when present", () => {
    expect(getNextStep({ corrections: ["Use verb-final order after weil"] })).toMatch(/corrections/i);
  });
  it("uses available marking feedback without inventing an error", () => {
    expect(getNextStep({ improvementSummary: "Improve the greeting" })).toMatch(/marking feedback/i);
  });
  it("does not assume corrections exist on unstructured legacy rows", () => {
    expect(getNextStep({})).toMatch(/lesson requirements/i);
  });
});
