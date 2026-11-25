const test=require("node:test");
const assert=require("node:assert/strict");
const {summarizeAttempt,historicalReview,listMockHistory,getMockHistoryReview}=require("../mockAttemptHistory");
const {getPracticeObjectiveKeys}=require("../a2MockCompletionSync");
const mockId="a2-mock-01";
const base={uid:"student",mockId,attemptNumber:2,status:"completed",section:"result",completedAt:{toMillis:()=>1764000000000},verifiedOverall:{score:80,passed:true},verifiedSectionScores:{lesen:25,hoeren:25,schreiben:15,sprechen:15},completionSync:{ok:true}};
test("only a completed synchronized verified result exposes scores",()=>{
 const record=summarizeAttempt("one",base);assert.equal(record.status,"verified");assert.equal(record.score,80);
 const pending=summarizeAttempt("one",{...base,completionSync:{ok:false},overall:{score:99}});assert.equal(pending.status,"pending");assert.equal(pending.score,null);assert.deepEqual(pending.sectionScores,{});
 const draft=summarizeAttempt("one",{...base,status:"in_progress",section:"lesen"});assert.equal(draft.status,"in_progress");assert.equal(draft.score,null);
});
test("legacy /75 is not rewritten as a four-module result",()=>{
 const r=summarizeAttempt("legacy",{...base,verifiedOverall:{score:80,points:60,maxPoints:75,passed:true,assessmentVersion:"three-module-v1"},verifiedSectionScores:{lesen:20,schreiben:20,sprechen:20}});
 assert.equal(r.maxPoints,75);assert.equal(r.points,60);assert.equal(r.sectionScores.hoeren,undefined);
});
test("objective review preserves existing score and refuses contradictory answer keys",()=>{
 const keys=getPracticeObjectiveKeys(mockId);
 const data={...base,state:{lesenAnswers:keys.lesen,hoerenAnswers:keys.hoeren,schreibenResult:{overall_feedback_en:"Good work",parts:{teil1:{feedback_en:"Check grammar",corrections:[{original:"Ich gehen",corrected:"Ich gehe",explanation:"Conjugation"}]}}}}};
 const r=historicalReview(data,summarizeAttempt("id",data));
 assert.equal(r.objective.lesen.rows.length,20);assert.equal(r.objective.hoeren.rows.filter(row=>row.status==="correct").length,20);
 assert.equal(r.feedback.schreiben[0].text,"Good work");
 const changed={...data,state:{...data.state,hoerenAnswers:{}}};
 assert.equal(historicalReview(changed,summarizeAttempt("id",changed)).objective.hoeren.rows.length,0);
 assert.equal(historicalReview({...data,status:"in_progress"},summarizeAttempt("id",{...data,status:"in_progress"})),null);
});
function fakeDb(docs){
 const calls=[];
 const collection={where(...a){calls.push(["where",...a]);return this},orderBy(...a){calls.push(["orderBy",...a]);return this},startAfter(...a){calls.push(["startAfter",...a]);return this},select(...a){calls.push(["select",...a]);return this},limit(...a){calls.push(["limit",...a]);return this},async get(){return {docs}},doc(id){calls.push(["attempt",id]);return {get:async()=>docs.find(d=>d.id===id)||{id,exists:false,data:()=>undefined}}}};
 return {calls,db:{collection(name){calls.push(["collection",name]);return {doc(uid){calls.push(["uid",uid]);return {collection(name){calls.push(["nested",name]);return collection}}}}}}};
}
const snap=(id,data)=>({id,exists:true,data:()=>data});
test("bounded list queries only authenticated user's own mock and omits answer payload",async()=>{
 const docs=Array.from({length:21},(_,i)=>snap("attempt"+i,{...base,attemptNumber:i+1,state:{secret:"not returned"}}));
 const {db,calls}=fakeDb(docs);
 const result=await listMockHistory({db,uid:"student",mockId,documentId:"__name__",cursor:"prior"});
 assert.equal(result.attempts.length,20);assert.equal(result.attempts[0].attemptNumber,20);assert.equal(result.nextCursor,"attempt19");
 assert.deepEqual(calls.slice(0,6),[["collection","a2MockExamUsers"],["uid","student"],["nested","attempts"],["where","mockId","==",mockId],["orderBy","__name__"],["startAfter","prior"]]);
 assert.ok(!calls.find(c=>c[0]==="select").includes("state"));assert.ok(!("state" in result.attempts[0]));
});
test("detail rejects another uid, wrong paper, and unverified attempt",async()=>{
 const {db}=fakeDb([snap("other",{...base,uid:"other"}),snap("wrong",{...base,mockId:"a2-mock-02"}),snap("pending",{...base,completionSync:{ok:false}})]);
 for(const [id,status] of [["other",404],["wrong",404],["pending",409]])await assert.rejects(getMockHistoryReview({db,uid:"student",mockId,attemptId:id}),e=>e.status===status);
 await assert.rejects(getMockHistoryReview({db,uid:"student",mockId:"a2-mock-99",attemptId:"pending"}),e=>e.status===400);
});
