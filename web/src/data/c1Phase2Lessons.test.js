import { C1_PHASE2_LESSONS, getC1Phase2Lesson } from "./c1Phase2Lessons";
test("C1 1–28 academic practice is complete and scoped", () => {
 expect(C1_PHASE2_LESSONS.map(x=>x.day)).toEqual(Array.from({length:28},(_,i)=>i+1)); expect(getC1Phase2Lesson(29)).toBeNull();
 for(const lesson of C1_PHASE2_LESSONS){expect(lesson.vocabulary).toHaveLength(20); expect(new Set(lesson.vocabulary.map(x=>x[0])).size).toBe(20); expect(lesson.grammarChecks).toHaveLength(3); if(lesson.questions){expect(lesson.text).toBeTruthy(); for(const [,choices,correct,reason] of lesson.questions){expect(choices[correct]).toBeTruthy(); expect(reason).toBeTruthy();}}else{expect(lesson.prompts).toHaveLength(4); expect(lesson.model).toBeTruthy();}}
});

import { C1_ACADEMIC_DAYS } from "./c1AcademicCurriculum";
test("all academic practice tasks match the canonical focus and cover all four skills equally",()=>{for (const item of C1_ACADEMIC_DAYS){const practice=getC1Phase2Lesson(item.day);expect([practice.title,practice.skill,practice.part]).toEqual([item.topic,item.skill,item.part]);}for(const skill of ["Lesen","Hören","Schreiben","Sprechen"]){expect(C1_PHASE2_LESSONS.filter(x=>x.skill===skill)).toHaveLength(7);}});
