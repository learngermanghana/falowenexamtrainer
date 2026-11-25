const test = require("node:test");
const assert = require("node:assert/strict");
const { buildListeningReview } = require("../mockListeningReview");
const { getA2ListeningReview, buildVerifiedA2MockScore } = require("../a2MockCompletionSync");
const { getB1ListeningReview, buildVerifiedB1MockScore } = require("../b1MockCompletionSync");
const receipts = {schreiben:{verified:true,score:15},sprechen:{verified:true,score:15}};
test("review sorts original numbers, distinguishes wrong and unanswered, ignores extraneous answers",()=>{
  const rows=buildListeningReview({"t1-2":" B ","t1-1":"x",fake:"a"},{"t1-2":"b","t1-1":"a","t2-3":"ja"});
  assert.deepEqual(rows.map(r=>[r.number,r.part,r.status]),[[1,1,"incorrect"],[2,1,"correct"],[3,2,"unanswered"]]);
  assert.equal(rows[2].submitted,null);
});
for (const [level,ids,review,score,total] of [
  ["A2",["01","02","03","04","05","06","07"],getA2ListeningReview,buildVerifiedA2MockScore,20],
  ["B1",["01","02","03","04"],getB1ListeningReview,buildVerifiedB1MockScore,30],
]) {
  for(const id of ids) test(`${level} mock ${id} review matches server scoring and is withheld until completion`,()=>{
    const mockId=`${level.toLowerCase()}-mock-${id}`;
    const state={mockId,assessmentVersion:"four-module-v2",lesenAnswers:{},hoerenAnswers:{}};
    const attempt={mockId,status:"in_progress",state,verifiedSectionScores:{hoeren:0}};
    assert.deepEqual(review(attempt),[]);
    const completed={...attempt,status:"completed"};
    const initial=review(completed);
    assert.equal(initial.length,total);
    const row=initial[0];
    const key=level==="A2"&&id!=="01"?String(row.number):`t${row.part}-${row.number}`;
    state.hoerenAnswers[key]=row.expected;
    const rows=review(completed);
    assert.equal(rows.filter(r=>r.status==="correct").length,1);
    assert.equal(score({state,verifiedSections:receipts,mockId}).objective.hoeren.correct,1);
  });
}
test("legacy A2 /75 does not invent a Hören result",()=>{
  assert.deepEqual(getA2ListeningReview({mockId:"a2-mock-08",status:"completed",verifiedSectionScores:{lesen:12},state:{hoerenAnswers:{}}}),[]);
});
