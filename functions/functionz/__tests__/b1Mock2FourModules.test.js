"use strict";
const {B1_MOCK2_READING_KEY,B1_MOCK2_READING_EXPLANATIONS}=require("../b1Mock2ReadingKey");
const {QUESTIONS}=require("../b1Mock2Hoeren");
const {buildVerifiedB1MockScore}=require("../b1MockCompletionSync");
const verifiedSections={schreiben:{verified:true,score:22},sprechen:{verified:true,score:18}};
const hoerenAnswers=Object.fromEntries(QUESTIONS.map(q=>[`t${q.part}-${q.number}`,q.answer]));
test("B1 Mock 2 source has exactly 30 Lesen and Hören answer keys",()=>{
 expect(Object.keys(B1_MOCK2_READING_KEY)).toHaveLength(30);
 expect(QUESTIONS).toHaveLength(30);
 for(const [part,first,last] of [[1,1,6],[2,7,12],[3,13,19],[4,20,26],[5,27,30]]) {
   for(let n=first;n<=last;n++)expect(B1_MOCK2_READING_KEY[`t${part}-${n}`]).toBeDefined();
 }
 expect(B1_MOCK2_READING_KEY["t3-15"]).toBe("0");
 expect(B1_MOCK2_READING_KEY["t4-23"]).toBe("ja");
 expect(B1_MOCK2_READING_KEY["t5-30"]).toBe("b");
});
test("Mock 2 full result is recomputed from its own server-owned answer keys",()=>{
 const result=buildVerifiedB1MockScore({
   mockId:"b1-mock-02",state:{lesenAnswers:{...B1_MOCK2_READING_KEY},hoerenAnswers},
   verifiedSections,
 });
 expect(result.sectionScores).toEqual({lesen:25,hoeren:25,schreiben:22,sprechen:18});
 expect(result.overall).toEqual({score:90,maxScore:100,passed:true});
 const wrong=buildVerifiedB1MockScore({
   mockId:"b1-mock-02",state:{lesenAnswers:{"t1-1":"falsch"},hoerenAnswers:{}},verifiedSections
 });
 expect(wrong.sectionScores.lesen).toBe(0);
 expect(wrong.sectionScores.hoeren).toBe(0);
});
test("Mock 2 cannot publish an invented writing or speaking score",()=>{
 expect(()=>buildVerifiedB1MockScore({
   mockId:"b1-mock-02",state:{lesenAnswers:B1_MOCK2_READING_KEY,hoerenAnswers},
   verifiedSections:{schreiben:{score:25},sprechen:{verified:true,score:25}}
 })).toThrow(/Server-verified schreiben/);
});

test("November B1 Mock 2 Lesen answer keys for Aufgaben 1–12 are server-owned and exact",()=>{
 const expected=[
  "richtig","richtig","falsch","falsch","richtig","richtig",
  "b","a","c","b","a","b"
 ];
 const values=[...Array.from({length:6},(_,i)=>B1_MOCK2_READING_KEY[`t1-${i+1}`]),
  ...Array.from({length:6},(_,i)=>B1_MOCK2_READING_KEY[`t2-${i+7}`])];
 expect(values).toEqual(expected);
 expect(Object.keys(B1_MOCK2_READING_KEY)).toHaveLength(30);
 expect(Object.keys(B1_MOCK2_READING_EXPLANATIONS)).toHaveLength(12);
 expect(B1_MOCK2_READING_EXPLANATIONS["t1-6"]).toContain("Verantwortung");
 const modified={...B1_MOCK2_READING_KEY,"t1-2":"falsch","t2-8":"c"};
 const full=buildVerifiedB1MockScore({
  mockId:"b1-mock-02",state:{lesenAnswers:modified,hoerenAnswers},
  verifiedSections
 });
 expect(full.objective.lesen.correct).toBe(28);
 expect(full.sectionScores.lesen).toBeCloseTo(28/30*25,1);
});
