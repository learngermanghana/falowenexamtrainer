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

test("B1 Mock 2 Lesen Teil 1 and 2 use the November teacher source without browser answers",()=>{
 const r=B1_MOCK2_READING;
 expect(r.teil1.time).toBe("10 Minuten");
 expect(r.teil1.heading).toBe("Gemeinsam leben – Integration in unserer Gesellschaft");
 expect(r.teil1.paragraphs.join(" ")).toContain("Integration eine gemeinsame Aufgabe");
 expect(r.teil1.questions.map(q=>q.number)).toEqual([1,2,3,4,5,6]);
 expect(r.teil1.questions[0].question).toContain("Sprachkenntnisse");
 expect(r.teil1.questions[5].question).toContain("sowohl der Staat");
 expect(r.teil1.accommodationNote).toContain("spezifischem Bedarf");
 expect(r.teil2.intro).toContain("Aufgaben 7 bis 12");
 expect(r.teil2.heading).toContain("SprachPaten");
 expect(r.teil2.questions.map(q=>q.number)).toEqual([7,8,9]);
 expect(r.teil2.text2.heading).toBe("Begegnungsstätten in Wohnvierteln");
 expect(r.teil2.text2.questions.map(q=>q.number)).toEqual([10,11,12]);
 expect([...r.teil2.questions,...r.teil2.text2.questions].every(q=>
   q.options.map(([id])=>id).join("")==="abc")).toBe(true);
 expect(JSON.stringify([r.teil1,r.teil2])).not.toMatch(/"answer"|"solution"|"correct"/i);
});
