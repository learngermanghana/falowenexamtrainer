import { buildExamPlanPriorities, buildExamPlanPrompt } from "./examStudyPartner";
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

test("revision plan uses broad priorities, days and chosen study time without raw results or dates", () => {
  const priorities = buildExamPlanPriorities({latestBySection:{lesen:{percent:90},hoeren:{percent:45},schreiben:{percent:60}},weakParts:{hoeren:"Teil 2",schreiben:"private-id"}});
  const prompt = buildExamPlanPrompt({level:"A2",daysRemaining:12,minutes:60,priorities,historyAvailable:true,date:"2026-12-08",uid:"private-id"});
  expect(prompt).toContain("Listening · Hören: priority revision (Teil 2)");
  expect(prompt).toContain("Reading · Lesen: maintenance");
  expect(prompt).toContain("Speaking · Sprechen: not yet assessed");
  expect(prompt).toContain("12 days");
  expect(prompt).toContain("60 minutes");
  expect(prompt).not.toContain("private-id");
  expect(prompt).not.toContain("2026-12-08");
  expect(prompt).not.toContain("45");
});
test("handles missing and past dates, exam day, and long horizons", () => {
  expect(buildExamPlanPrompt({level:"A1",daysRemaining:-1})).toContain("7-day starter");
  expect(buildExamPlanPrompt({level:"A1",daysRemaining:null})).toContain("7-day starter");
  expect(buildExamPlanPrompt({level:"A1",daysRemaining:0})).toContain("exam is today");
  expect(buildExamPlanPrompt({level:"C1",daysRemaining:90})).toContain("weekly roadmap");
  expect(buildExamPlanPrompt({level:"B2",minutes:999})).toContain("30 minutes");
  expect(buildExamPlanPrompt({level:"B2"})).toContain("No reliable practice history");
});
