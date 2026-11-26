import { buildExamStudyPrompt, canShowExamStudyPartner, EXAM_STUDY_SKILLS, EXAM_STUDY_MODES } from "./examStudyPartner";

describe("Exam room ChatGPT preparation", () => {
  test.each(["A1","A2","B1","B2","C1","C2"])("uses selected CEFR level %s across all skills", level => {
    EXAM_STUDY_SKILLS.forEach(skill => {
      const prompt = buildExamStudyPrompt({ level, section: skill.key });
      expect(prompt).toContain("German " + level);
      expect(prompt).toContain(skill.label);
      expect(prompt).toContain("one question at a time");
    });
  });
  test("blocks samples, mocks, restricted assessments, trials and unsupported access", () => {
    const base = { level: "A2", section: "lesen" };
    expect(canShowExamStudyPartner(base)).toBe(true);
    [{ sampleId: "sample-1" }, { section: "mocks" }, { restricted: true }, { trial: true }, { isSwahili: true }, { allowed: false }, { level: "unknown" }, { section: "file" }].forEach(patch => {
      expect(canShowExamStudyPartner({ ...base, ...patch })).toBe(false);
    });
  });
  test("never transmits private data or existing question content", () => {
    const prompt = buildExamStudyPrompt({ level: "B2", section: "writing", uid: "private-uid", score: "private-score", answer: "private-answer", task: "private-task" });
    expect(prompt).not.toContain("private-");
    expect(prompt).toContain("Do not solve current Falowen exam questions");
  });
  test("offers distinct practice, strategy and weak-area prompts", () => {
    const prompts = EXAM_STUDY_MODES.map(mode => buildExamStudyPrompt({ level: "C1", section: "speaking", mode: mode.key }));
    expect(new Set(prompts).size).toBe(3);
    expect(prompts[2]).toContain("Do not assume you know my scores");
  });
});
