const {test}=require('node:test');const assert=require('node:assert/strict');const {normalizeMockAttempt}=require('../mockAttemptMonitor');
test('A1 A2 B1 expose verified final section scores including zero',()=>{
 for(const level of ['a1','a2','b1']){
  const expected={lesen:0,hoeren:20,schreiben:12,sprechen:25};
  const row=normalizeMockAttempt({id:'x',ref:{path:level+'MockExamUsers/u/attempts/x'},data:()=>({status:'completed',verifiedSectionScores:expected,sectionScores:{lesen:25},verifiedOverall:{score:57}})});
  assert.deepEqual(row.sectionScores,expected);
 }
});
test('missing legacy scores and browser scores never become verified zeros',()=>{
 const row=normalizeMockAttempt({id:'x',ref:{path:'a1MockExamUsers/u/attempts/x'},data:()=>({status:'completed',sectionScores:{lesen:25}})});
 assert.equal(row.sectionScores.lesen,null);
});
