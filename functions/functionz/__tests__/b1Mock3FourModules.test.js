"use strict";
const {QUESTIONS}=require("../b1Mock3Hoeren");
const {B1_MOCK3_READING_KEY,B1_MOCK3_HOEREN_KEY}=require("../b1Mock3AnswerKeys");
const {B1_MOCK2_READING_KEY}=require("../b1Mock2ReadingKey");
const {buildVerifiedB1MockScore,buildB1MockCompletionArtifacts}=require("../b1MockCompletionSync");
const verifiedSections={schreiben:{verified:true,score:21},sprechen:{verified:true,score:19}};
test("B1 Mock 3 has distinct 30-item objective keys for its own content",()=>{
  expect(Object.keys(B1_MOCK3_READING_KEY)).toHaveLength(30);
  expect(Object.keys(B1_MOCK3_HOEREN_KEY)).toHaveLength(30);
  expect(QUESTIONS).toHaveLength(30);
  for(const q of QUESTIONS) expect(B1_MOCK3_HOEREN_KEY[`t${q.part}-${q.number}`]).toBe(q.answer);
  expect(B1_MOCK3_READING_KEY["t3-14"]).toBe("0");
  expect(B1_MOCK3_READING_KEY["t4-21"]).toBe("nein");
  expect(B1_MOCK3_READING_KEY).not.toEqual(B1_MOCK2_READING_KEY);
});
test("Mock 3 combines four server-verified modules out of 100",()=>{
  const result=buildVerifiedB1MockScore({mockId:"b1-mock-03",
    state:{lesenAnswers:{...B1_MOCK3_READING_KEY},hoerenAnswers:{...B1_MOCK3_HOEREN_KEY}},verifiedSections});
  expect(result.sectionScores).toEqual({lesen:25,hoeren:25,schreiben:21,sprechen:19});
  expect(result.overall).toEqual({score:90,maxScore:100,passed:true});
});
test("Mock 3 rejects client-only grades and grades objective answers from the own keys",()=>{
  expect(()=>buildVerifiedB1MockScore({mockId:"b1-mock-03",
    state:{lesenAnswers:B1_MOCK3_READING_KEY,hoerenAnswers:B1_MOCK3_HOEREN_KEY,
      sectionScores:{schreiben:25,sprechen:25},overall:{score:100}},verifiedSections:{}}
  )).toThrow(/Server-verified schreiben/);
  const wrong=buildVerifiedB1MockScore({mockId:"b1-mock-03",
    state:{lesenAnswers:{...B1_MOCK2_READING_KEY},hoerenAnswers:{}},verifiedSections});
  expect(wrong.sectionScores.lesen).toBeLessThan(25);
  expect(wrong.sectionScores.hoeren).toBe(0);
});
test("Mock 3 results have unique assignment identity, URL and namespace",()=>{
  const a=buildB1MockCompletionArtifacts({authedUser:{uid:"sample",email:"student@example.com"},
    attemptId:"attempt3",attemptNumber:1,firstAttempt:true,
    overall:{score:90,passed:true},sectionScores:{lesen:25,hoeren:25,schreiben:21,sprechen:19},mockId:"b1-mock-03"});
  expect(a.scoreDocument.assignmentId).toBe("B1-MOCK-03-ATTEMPT-1");
  expect(a.scoreDocument.link).toBe("/campus/course/b1-mock-3");
  expect(a.scoreDocument.source).toBe("b1_mock_03");
  expect(a.scoreDocId).toContain("b1-mock-03");
  expect(a.notificationDocument.title).toBe("Your B1 Mock 3 result is ready");
});
