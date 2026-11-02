"use strict";
const {B1_MOCK2_READING_KEY,B1_MOCK2_READING_EXPLANATIONS}=require("../b1Mock2ReadingKey");
const {QUESTIONS}=require("../b1Mock2Hoeren");
const {buildVerifiedB1MockScore}=require("../b1MockCompletionSync");
const verifiedSections={schreiben:{verified:true,score:22},sprechen:{verified:true,score:18}};
const hoerenAnswers=Object.fromEntries(QUESTIONS.map(q=>[`t${q.part}-${q.number}`,q.answer]));
test("B1 Mock 2 source has exactly 30 Lesen and Hören answer keys",()=>{
 expect(Object.keys(B1_MOCK2_READING_KEY)).toHaveLength(30);
 expect(QUESTIONS).toHaveLength(30);
 for(const [part,first,last] of [[1,1,6],[2,7,12],[3,13,17],[4,18,24],[5,25,30]]) {
   for(let n=first;n<=last;n++)expect(B1_MOCK2_READING_KEY[`t${part}-${n}`]).toBeDefined();
 }
 expect(B1_MOCK2_READING_KEY["t3-17"]).toBe("x");
 expect(B1_MOCK2_READING_KEY["t4-23"]).toBe("nein");
 expect(B1_MOCK2_READING_KEY["t5-30"]).toBe("a");
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
 expect(Object.keys(B1_MOCK2_READING_EXPLANATIONS)).toHaveLength(30);
 expect(B1_MOCK2_READING_EXPLANATIONS["t1-6"]).toContain("Verantwortung");
 const modified={...B1_MOCK2_READING_KEY,"t1-2":"falsch","t2-8":"c"};
 const full=buildVerifiedB1MockScore({
  mockId:"b1-mock-02",state:{lesenAnswers:modified,hoerenAnswers},
  verifiedSections
 });
 expect(full.objective.lesen.correct).toBe(28);
 expect(full.sectionScores.lesen).toBeCloseTo(28/30*25,1);
});

test("November teacher B1 Mock 2 Lesen parts 3–5 have exact private grading keys",()=>{
 const expected={
  "t3-13":"a","t3-14":"b","t3-15":"c","t3-16":"d","t3-17":"x",
  "t4-18":"ja","t4-19":"nein","t4-20":"ja","t4-21":"nein",
  "t4-22":"ja","t4-23":"nein","t4-24":"ja",
  "t5-25":"b","t5-26":"a","t5-27":"c",
  "t5-28":"b","t5-29":"b","t5-30":"a"
 };
 for(const [key,value] of Object.entries(expected)){
  expect(B1_MOCK2_READING_KEY[key]).toBe(value);
  expect(B1_MOCK2_READING_EXPLANATIONS[key]).toEqual(expect.any(String));
 }
 expect(Object.keys(B1_MOCK2_READING_KEY)).toHaveLength(30);
 const incorrect={...B1_MOCK2_READING_KEY,"t3-17":"e","t5-27":"b"};
 const result=buildVerifiedB1MockScore({
  mockId:"b1-mock-02",state:{lesenAnswers:incorrect,hoerenAnswers},
  verifiedSections
 });
 expect(result.objective.lesen.correct).toBe(28);
 expect(result.sectionScores.lesen).toBeCloseTo(28/30*25,1);
});
