import {
  C1_OPINION_WRITING_TIPS,
  getC1OpinionWritingTip,
  normalizeC1OpinionWritingTipId,
} from "./c1OpinionWritingTips";

describe("C1 opinion writing tips", () => {
  test("normalizes related guided-question IDs", () => {
    expect(normalizeC1OpinionWritingTipId("role")).toBe("explanation");
    expect(normalizeC1OpinionWritingTipId("counterargument")).toBe("objection");
  });

  test("returns tips only for C1 opinion writing", () => {
    expect(getC1OpinionWritingTip({
      id: "role",
      level: "C1",
      taskType: "C1 opinion essay / Stellungnahme",
    })).toBe(C1_OPINION_WRITING_TIPS.explanation);

    expect(getC1OpinionWritingTip({
      id: "introduction",
      level: "C1",
      taskType: "Formal letter / E-Mail",
    })).toBeUndefined();
  });
});
