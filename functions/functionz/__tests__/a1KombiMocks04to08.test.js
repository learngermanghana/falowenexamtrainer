"use strict";
const {validateA1MockId,getA1MockSet,scoreA1KombiForm}=require("../a1MockSets");
const {buildVerifiedA1MockScore,buildA1MockCompletionArtifacts}=require("../a1MockCompletionSync");
const tasks=require("../a1KombiMarkingSets");
describe("A1 Kombiprüfung Mocks 4–8 server contracts",()=>{
  test.each([4,5,6,7,8])("Mock %s protects answers and produces /75 verified results",n=>{
    const mockId=`a1-mock-0${n}`;
    expect(validateA1MockId(mockId)).toBe(mockId);
    const set=getA1MockSet(mockId);
    expect(Object.keys(set.readingAnswerKey)).toHaveLength(15);
    const form=Object.fromEntries(tasks[mockId].form.map(item=>[item.number,item.answer.split(" / ")[0]]));
    expect(scoreA1KombiForm(mockId,form).score).toBe(10);
    const result=buildVerifiedA1MockScore({
      mockId,
      state:{mockId,assessmentVersion:"three-module-v1",lesenAnswers:set.readingAnswerKey,
        hoerenAnswers:{"t1-1":"invalid"},sectionScores:{lesen:0,hoeren:25}},
      verifiedSections:{schreiben:{verified:true,score:25},sprechen:{verified:true,score:25}},
    });
    expect(result.sectionScores).toEqual({lesen:25,schreiben:25,sprechen:25});
    expect(result.overall).toMatchObject({score:100,maxScore:100,points:75,maxPoints:75,
      assessmentVersion:"three-module-v1",sections:["lesen","schreiben","sprechen"],passed:true});
    expect(result.objective.hoeren).toBeUndefined();
    const saved=buildA1MockCompletionArtifacts({mockId,authedUser:{uid:"test-user",email:"mock@test.invalid"},
      attemptId:"attempt-one",attemptNumber:1,firstAttempt:true,overall:result.overall,sectionScores:result.sectionScores});
    expect(saved.scoreDocument.scoreBreakdown).toHaveLength(3);
    expect(saved.scoreDocument.assessmentVersion).toBe("three-module-v1");
    expect(saved.scoreDocument.maxPoints).toBe(75);
    expect(saved.scoreDocument.assignmentId).toBe(`A1-MOCK-0${n}`);
    expect(saved.scoreDocument.link).toBe(`/campus/course/a1-final-mock-${n}`);
  });
  test("cannot manufacture completion from browser-supplied scores",()=>{
    const mockId="a1-mock-04",key=getA1MockSet(mockId).readingAnswerKey;
    expect(()=>buildVerifiedA1MockScore({mockId,state:{mockId,assessmentVersion:"three-module-v1",
      lesenAnswers:key,sectionScores:{schreiben:25,sprechen:25},overall:{score:100}},
      verifiedSections:{}})).toThrow(/Server-verified schreiben/);
  });
  test("three-module completion rejects changed assessment version",()=>{
    const mockId="a1-mock-08";
    expect(()=>buildVerifiedA1MockScore({mockId,state:{mockId,assessmentVersion:"four-module-v2"},
      verifiedSections:{}})).toThrow(/Unsupported/);
  });
});
