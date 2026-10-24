"use strict";
const fs=require("fs"),path=require("path");
const {
  READING_ANSWER_KEY,LISTENING_ANSWER_KEY,
  READING_ANSWER_KEY_02,LISTENING_ANSWER_KEY_02,
  buildVerifiedB1MockScore,assignmentIdForAttempt,buildB1MockCompletionArtifacts,
}=require("../b1MockCompletionSync");
const {QUESTIONS}=require("../b1Mock2Hoeren");

test("B1 Mock 2 has complete, independent server-only Lesen and Hören keys",()=>{
  expect(Object.keys(READING_ANSWER_KEY_02)).toHaveLength(30);
  expect(Object.keys(LISTENING_ANSWER_KEY_02)).toHaveLength(30);
  expect(READING_ANSWER_KEY_02).toMatchObject({
    "t1-1":"richtig","t1-6":"richtig","t2-7":"b","t2-8":"c",
    "t3-13":"c","t3-15":"0","t3-19":"h","t4-20":"nein",
    "t4-23":"ja","t5-30":"b",
  });
  expect(LISTENING_ANSWER_KEY_02).toEqual(
    Object.fromEntries(QUESTIONS.map(q=>[`t${q.part}-${q.number}`,q.answer]))
  );
  expect(READING_ANSWER_KEY_02).not.toEqual(READING_ANSWER_KEY);
  expect(LISTENING_ANSWER_KEY_02).not.toEqual(LISTENING_ANSWER_KEY);
});

test("only server-verified writing and speaking complete Mock 2",()=>{
  const state={lesenAnswers:{...READING_ANSWER_KEY_02},hoerenAnswers:{...LISTENING_ANSWER_KEY_02}};
  const verifiedSections={schreiben:{verified:true,score:21},sprechen:{verified:true,score:23}};
  expect(buildVerifiedB1MockScore({state,verifiedSections,mockId:"b1-mock-02"})).toMatchObject({
    overall:{score:94,maxScore:100,passed:true},
    sectionScores:{lesen:25,hoeren:25,schreiben:21,sprechen:23}
  });
  expect(()=>buildVerifiedB1MockScore({state,verifiedSections:{schreiben:{verified:true,score:21}},mockId:"b1-mock-02"}))
    .toThrow(/server-verified sprechen/i);
  expect(buildVerifiedB1MockScore({state,verifiedSections,mockId:"b1-mock-01"}).objective.lesen.correct).toBeLessThan(30);
});

test("Mock 2 scores and student notifications do not overwrite Mock 1",()=>{
  const base={authedUser:{uid:"uid-b1",email:"b1@example.com"},studentProfile:{
    snap:{id:"student-b1"},data:{name:"A Student",studentCode:"student-b1",email:"b1@example.com"}},
    attemptId:"mock-2-attempt",attemptNumber:1,firstAttempt:true,
    overall:{score:94,maxScore:100,passed:true},
    sectionScores:{lesen:25,hoeren:25,schreiben:21,sprechen:23},
    now:new Date("2026-10-23T12:00:00Z")};
  const mock1=buildB1MockCompletionArtifacts(base);
  const mock2=buildB1MockCompletionArtifacts({...base,mockId:"b1-mock-02"});
  expect(assignmentIdForAttempt({mockId:"b1-mock-02",attemptNumber:1})).toBe("B1-MOCK-02");
  expect(mock2.scoreDocument).toMatchObject({
    assignment:"B1 Mock 2",assignmentId:"B1-MOCK-02",
    link:"/campus/course/b1-mock-2",source:"b1_mock_02"
  });
  expect(mock2.scoreDocId).not.toBe(mock1.scoreDocId);
  expect(mock2.notificationId).not.toBe(mock1.notificationId);
});

test("Mock 2 student content has no exposed reading answers and both presentation choices",()=>{
  const data=fs.readFileSync(path.resolve(__dirname,"../../../web/src/data/b1Mock2Data.js"),"utf8");
  const page=fs.readFileSync(path.resolve(__dirname,"../../../web/src/components/B1Mock2ExamPage.jsx"),"utf8");
  const server=fs.readFileSync(path.resolve(__dirname,"../app.js"),"utf8");
  expect(data).not.toMatch(/"answer"\s*:/);
  expect(data).toMatch(/Sollte man im Alltag mehr Bio-Produkte kaufen/);
  expect(data).toMatch(/Verreisen: Lieber alleine oder in einer Gruppe/);
  expect(data).toMatch(/Frau Sommer/);
  expect(page).toMatch(/b1-mock-02\/lesen\/score/);
  expect(page).toMatch(/B1Mock2Hoeren/);
  expect(server).toContain('app.post("/b1-mock-02/lesen/score"');
  expect(server).toMatch(/b1WritingMockId/);
  expect(server).toMatch(/b1SpeakingMockId/);
});
