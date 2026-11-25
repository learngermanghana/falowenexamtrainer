import { SWAHILI_ASSIGNMENTS, SWAHILI_CURRICULUM, summarizeSwahiliLevel, reviewDocumentId, isSubmitted } from "./curriculumRegistry";
test("registry preserves publication boundaries and existing IDs", () => {
  expect(SWAHILI_ASSIGNMENTS.filter(x=>x.level==="A1")).toHaveLength(20);
  expect(SWAHILI_ASSIGNMENTS.filter(x=>x.level==="A2")).toHaveLength(0);
  expect(SWAHILI_ASSIGNMENTS.filter(x=>x.level==="B1").map(x=>x.day)).toEqual([26,27,28]);
  expect(new Set(SWAHILI_ASSIGNMENTS.map(x=>x.id)).size).toBe(23);
  expect(reviewDocumentId("learner", SWAHILI_CURRICULUM.A1[0])).toBe("learner");
  expect(reviewDocumentId("learner", SWAHILI_ASSIGNMENTS.find(x=>x.level==="B1"))).toBe("learner_b1-day-26");
});
test("progress prioritizes revisions, separates levels, and does not count unpublished lessons", () => {
  const records=[{lessonDoc:"day-1",submitted:true,review:{score:100,status:"reviewed"}},{lessonDoc:"b1-day-27",submitted:true,review:{score:50,status:"needs_revision"}}];
  const b1=summarizeSwahiliLevel("B1",records);
  expect(b1.next.day).toBe(27);
  expect(b1.completed).toBe(1);
  expect(b1.percent).toBe(33);
  expect(b1.average).toBe(50);
  expect(summarizeSwahiliLevel("A2",records).next).toBeNull();
  expect(summarizeSwahiliLevel("A2",records).percent).toBeNull();
  expect(summarizeSwahiliLevel("A1",null).percent).toBeNull();
  expect(isSubmitted({status:"draft"})).toBe(false);
  expect(isSubmitted({submittedAt:{seconds:1}})).toBe(true);
});
