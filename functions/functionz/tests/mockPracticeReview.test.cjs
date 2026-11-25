const test=require("node:test");
const assert=require("node:assert/strict");
const {scoreMockPractice}=require("../mockPracticeReview");
const {allowsTrialRequest}=require("../trialPractice");
for(const [level,count,total] of [["a1",8,15],["a2",8,20],["b1",4,30]]) {
 const keys=require("../"+level+"MockCompletionSync").getPracticeObjectiveKeys;
 for(let i=1;i<=count;i++){
  const mockId=level+"-mock-"+String(i).padStart(2,"0");
  for(const section of ["lesen","hoeren"]){
   if(mockId==="a2-mock-08"&&section==="hoeren")continue;
   test(mockId+" "+section+" practice checks all canonical answers, including blanks",()=>{
    const key=keys(mockId)[section];
    assert.equal(Object.keys(key).length,total);
    const [id,value]=Object.entries(key)[0];
    const rows=scoreMockPractice(mockId,section,{[id]:String(value).toUpperCase()});
    assert.equal(rows.length,total);
    assert.equal(rows.filter(r=>r.status==="correct").length,1);
    assert.equal(rows.filter(r=>r.status==="unanswered").length,total-1);
    assert.equal(scoreMockPractice(mockId,section,key).filter(r=>r.status==="correct").length,total);
   });
  }
 }
}
test("reject unsupported paper, absent module, empty answers and fabricated keys",()=>{
 assert.throws(()=>scoreMockPractice("a2-mock-08","hoeren",{"1":"a"}));
 assert.throws(()=>scoreMockPractice("a1-mock-99","lesen",{"1":"a"}));
 assert.throws(()=>scoreMockPractice("a2-mock-01","lesen",{}));
 assert.throws(()=>scoreMockPractice("a2-mock-01","lesen",{fake:"a"}));
 assert.throws(()=>scoreMockPractice("a2-mock-01","sprechen",{"1":"a"}));
});
test("trial practice only allows its assigned mock",async()=>{
 const exams=require("../trialExams.json");
 for(const level of ["A1","A2","B1"]){
  const assigned=exams[level].engineId;
  const req={path:"/mock/practice/review",method:"POST",body:{mockId:assigned,section:"lesen"}};
  assert.equal(await allowsTrialRequest(req,{level},null,"student"),true);
  assert.equal(await allowsTrialRequest({...req,body:{mockId:level.toLowerCase()+"-mock-99",section:"lesen"}},{level},null,"student"),false);
 }
});
