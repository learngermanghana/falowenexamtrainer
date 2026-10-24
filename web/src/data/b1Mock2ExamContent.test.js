import {B1_MOCK2_READING,B1_MOCK2_WRITING_TASKS,B1_MOCK2_SPEAKING} from "./b1Mock2ExamContent";
test("B1 Mock 2 reading has all five exam parts and numbered tasks 1 to 30",()=>{
 const r=B1_MOCK2_READING;
 const questions=[...r.teil1.questions,...r.teil2.questions,...r.teil2.text2.questions,
 ...r.teil3.situations,...r.teil4.comments,...r.teil5.questions];
 expect(questions.map(q=>q.number)).toEqual(Array.from({length:30},(_,i)=>i+1));
 expect(r.teil3.ads).toHaveLength(10);
 expect(r.teil3.ads.find(a=>a[0]==="E")[1]).toContain("Fahrrad");
 expect(questions.every(q=>!Object.prototype.hasOwnProperty.call(q,"answer"))).toBe(true);
});
test("B1 Mock 2 writing and speaking use the latest teacher prompts",()=>{
 expect(B1_MOCK2_WRITING_TASKS.map(q=>q.target)).toEqual([80,80,40]);
 expect(B1_MOCK2_WRITING_TASKS[0].prompt).toContain("Julian");
 expect(B1_MOCK2_WRITING_TASKS[1].prompt).toContain("Laura");
 expect(B1_MOCK2_WRITING_TASKS[2].prompt).toContain("Frau Sommer");
 expect(B1_MOCK2_SPEAKING.teil1.situation).toContain("Frau Keller");
 expect(B1_MOCK2_SPEAKING.teil2.alternativeTopic).toContain("Gruppe");
 expect(B1_MOCK2_SPEAKING.teil3.prompt).toContain("Feedback");
});
