import {
  A2_READING_QUALITY_AUDIT,
  B1_READING_QUALITY_AUDIT,
  getReadingQualityAudit,
} from "./a2B1ReadingQualityAudit";

describe("A2/B1 reading quality audit", () => {
  test("covers every A2 and B1 day", () => {
    expect(Object.keys(A2_READING_QUALITY_AUDIT)).toHaveLength(28);
    expect(Object.keys(B1_READING_QUALITY_AUDIT)).toHaveLength(28);
    for (let day = 1; day <= 28; day += 1) {
      expect(getReadingQualityAudit("A2", day)).toBeTruthy();
      expect(getReadingQualityAudit("B1", day)).toBeTruthy();
    }
  });

  test("keeps already stronger matching lessons out of the extra challenge", () => {
    expect(getReadingQualityAudit("A2", 5).needsDepthCheck).toBe(false);
    expect(getReadingQualityAudit("A2", 15).needsDepthCheck).toBe(false);
    expect(getReadingQualityAudit("B1", 7).needsDepthCheck).toBe(false);
  });

  test("raises the depth requirement toward the end of each level", () => {
    expect(getReadingQualityAudit("A2", 28).phase).toBe("exam-ready");
    expect(getReadingQualityAudit("B1", 28).phase).toBe("exam-ready");
    expect(getReadingQualityAudit("A2", 28).prompts.some((item) => /Inference/i.test(item.title))).toBe(true);
    expect(getReadingQualityAudit("B1", 28).prompts.some((item) => /Main idea/i.test(item.title))).toBe(true);
  });
});
