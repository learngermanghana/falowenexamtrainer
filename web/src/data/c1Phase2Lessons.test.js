import { C1_PHASE2_LESSONS, getC1Phase2Lesson } from "./c1Phase2Lessons";
test("C1 1–20 academic practice is complete and scoped", () => {
 expect(C1_PHASE2_LESSONS.map(x=>x.day)).toEqual([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]); expect(getC1Phase2Lesson(21)).toBeNull();
 for(const lesson of C1_PHASE2_LESSONS){expect(lesson.vocabulary).toHaveLength(20); expect(new Set(lesson.vocabulary.map(x=>x[0])).size).toBe(20); expect(lesson.grammarChecks).toHaveLength(3); if(lesson.questions){expect(lesson.text).toBeTruthy(); for(const [,choices,correct,reason] of lesson.questions){expect(choices[correct]).toBeTruthy(); expect(reason).toBeTruthy();}}else{expect(lesson.prompts).toHaveLength(4); expect(lesson.model).toBeTruthy();}}
});
