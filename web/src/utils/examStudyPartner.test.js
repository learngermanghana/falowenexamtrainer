import { buildExamRevisionPrompt, safeExamPart, weakestScoredExamPart, getExamRevisionFocus } from "./examStudyPartner";
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

test("completed skill revision contains only a safe level, skill and Teil", () => {
  const prompt = buildExamRevisionPrompt({ level: "A2", section: "horen", part: "Teil 2", completed: true, uid: "private-id", score: 45, answer: "private-answer" });
  expect(prompt).toContain("Prioritise Teil 2");
  expect(prompt).not.toContain("private-");
  expect(prompt).not.toContain("45");
  expect(buildExamRevisionPrompt({ level: "A2", section: "horen", completed: false })).toBe("");
  expect(safeExamPart("Teil 2 private-id")).toBe("");
});

test("revision focus requires scored evidence and selects the validated Teil", () => {
  expect(getExamRevisionFocus({ focus: { key: "hoeren", weakPart: "Teil 2" }, latestBySection: { hoeren: {percent:45} } })).toEqual({ section:"horen", part:"Teil 2" });
  expect(getExamRevisionFocus({ focus:{key:"lesen"}, latestBySection:{} })).toBeNull();
  expect(weakestScoredExamPart([{label:"Teil 1",score:3,total:4},{label:"Teil 2",score:4,total:10}])).toBe("Teil 2");
  expect(weakestScoredExamPart([{label:"Teil 1",score:5,total:5}])).toBe("");
});

test.each(["A1","A2","B1","B2","C1","C2"])("all %s exam study and review prompts require verified access", level=>{
  const prompts=EXAM_STUDY_SKILLS.flatMap(skill=>EXAM_STUDY_MODES.map(mode=>buildExamStudyPrompt({level,section:skill.key,mode:mode.key})));
  prompts.push(buildExamRevisionPrompt({level,section:"horen",completed:true}));
  for(const prompt of prompts){
    expect(prompt.startsWith("IMPORTANT — CONNECTION FIRST")).toBe(true);
    expect(prompt).toContain("Respond in English");
    expect(prompt).toContain("Do not generate random questions");
    expect(prompt).toContain("before successful source retrieval");
    expect(prompt).not.toContain("Otherwise say so and create original practice");
  }
});
