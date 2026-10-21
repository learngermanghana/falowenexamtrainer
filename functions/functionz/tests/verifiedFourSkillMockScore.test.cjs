"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {scoreObjectiveAnswers,buildVerifiedFourSkillScore}=require("../verifiedFourSkillMockScore");
const a1=require("../a1MockCompletionSync");
const a2=require("../a2MockCompletionSync");
const b1=require("../b1MockCompletionSync");

const verified={schreiben:{verified:true,score:16},sprechen:{verified:true,score:18}};
const fixture=(keys,level)=>({
  level,state:{lesenAnswers:{...keys.lesen},hoerenAnswers:{...keys.hoeren}},
  verifiedSections:verified,answerKeys:keys
});
test("score computation is server-owned, four sections /25 and result /100",()=>{
 const keys={lesen:{"1":"a","2":"b"},hoeren:{"1":"c","2":"falsch"}};
 const result=buildVerifiedFourSkillScore(fixture(keys,"A2"));
 assert.deepEqual(result.sectionScores,{lesen:25,hoeren:25,schreiben:16,sprechen:18});
 assert.deepEqual(result.overall,{score:84,maxScore:100,passed:true});
 const wrong=buildVerifiedFourSkillScore({...fixture(keys,"A2"),
   state:{lesenAnswers:{"1":"a","2":"wrong"},hoerenAnswers:{"1":"c","2":"falsch"},clientOverallScore:100}});
 assert.equal(wrong.overall.score,71.5);
 assert.equal(scoreObjectiveAnswers({"1":"A"},{"1":"a"}).score,25);
});
test("unverified or missing writing and speaking never generates completed grade",()=>{
 const keys={lesen:{"1":"a"},hoeren:{"1":"b"}};
 assert.throws(()=>buildVerifiedFourSkillScore({
  ...fixture(keys,"A2"),verifiedSections:{sprechen:verified.sprechen}
 }), e=>e.code==="A2_MOCK_SECTION_NOT_VERIFIED"&&e.section==="schreiben");
 assert.throws(()=>buildVerifiedFourSkillScore({
  ...fixture(keys,"A2"),verifiedSections:{...verified,sprechen:{verified:false,score:25}}
 }), e=>e.code==="A2_MOCK_SECTION_NOT_VERIFIED");
});
test("unconfigured B2, C1 and C2 scoring cannot silently inherit the A2 policy",()=>{
 const keys={lesen:{"1":"a"},hoeren:{"1":"b"}};
 for(const level of ["B2","C1","C2"]){
   assert.throws(()=>buildVerifiedFourSkillScore(fixture(keys,level)),/Level-specific scoring policy/);
 }
});
test("A1, A2 and B1 existing exam graders use identical canonical calculations",()=>{
 const suites=[
   ["A1",a1.READING_ANSWER_KEY,a1.LISTENING_ANSWER_KEY,
     x=>a1.buildVerifiedA1MockScore({...x,mockId:"a1-mock-01"})],
   ["A2",a2.READING_ANSWER_KEY,a2.LISTENING_ANSWER_KEY,
     x=>a2.buildVerifiedA2MockScore({...x,mockId:"a2-mock-01"})],
   ["B1",b1.READING_ANSWER_KEY,b1.LISTENING_ANSWER_KEY,
     x=>b1.buildVerifiedB1MockScore(x)],
 ];
 for(const [level,lesen,hoeren,grade] of suites){
   const keys={lesen,hoeren},input=fixture(keys,level);
   assert.deepEqual(grade(input),buildVerifiedFourSkillScore(input));
 }
 const mock2=fixture({lesen:a2.MOCK_2_READING_ANSWER_KEY,hoeren:a2.MOCK_2_LISTENING_ANSWER_KEY},"A2");
 assert.deepEqual(a2.buildVerifiedA2MockScore({...mock2,mockId:"a2-mock-02"}),buildVerifiedFourSkillScore(mock2));
});
