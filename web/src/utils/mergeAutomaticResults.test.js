import { mergeAutomaticResults, resultTimestamp } from "./mergeAutomaticResults";
const history = [
  {assignment_id:"A1-1.1",submissionId:"retake",score:85,date:"2026-10-17T07:00:00Z",attempt:2},
  {assignment_id:"A1-1.1",submissionId:"first",score:40,date:"2026-10-16T07:00:00Z",attempt:1},
];
test("preserves all retakes and newest-first history without automatic results",()=>{
 expect(mergeAutomaticResults(history,[])).toEqual(history);
});
test("updates only a matching submission, preserving the other attempt",()=>{
 const merged=mergeAutomaticResults(history,[{...history[0],comments:"Fresh feedback",updatedAt:{toMillis:()=>Date.parse("2026-10-17T08:00:00Z")}}]);
 expect(merged).toHaveLength(2);expect(merged[0].comments).toBe("Fresh feedback");expect(merged[1]).toEqual(history[1]);
});
test("appends a new automatic attempt without erasing earlier scores",()=>{
 const merged=mergeAutomaticResults(history,[{assignment_id:"A1-1.1",submissionId:"third",score:95,date:"2026-10-18T07:00:00Z",attempt:3}]);
 expect(merged.map(x=>x.score)).toEqual([85,40,95]);
});
test("same score on different dates remains separate attempts",()=>{
 const first={assignment_id:"A2-1.1",score:85,date:"2026-10-16T07:00:00Z"};
 const next={...first,date:"2026-10-17T07:00:00Z"};
 expect(mergeAutomaticResults([first],[next])).toEqual([first,next]);
 expect(mergeAutomaticResults([next],[{...next,comments:"Synced"}])).toHaveLength(1);
});
test("Firestore timestamps compare correctly and stale automatic feedback cannot overwrite a tutor correction",()=>{
 const original={...history[0],updatedAt:"2026-10-17T09:00:00Z",comments:"Tutor correction"};
 const old={...history[0],updatedAt:{toDate:()=>new Date("2026-10-17T08:00:00Z")},comments:"Older AI"};
 expect(mergeAutomaticResults([original],[old])[0].comments).toBe("Tutor correction");
 expect(resultTimestamp({seconds:10,nanoseconds:500000000})).toBe(10500);
 expect(resultTimestamp("not a date")).toBeNull();
});
test("a later background AI write cannot replace a tutor correction of the same submission", () => {
 const corrected={...history[0],score:92,manuallyEdited:true,updatedAt:"2026-10-17T09:00:00Z"};
 const ai={...history[0],score:49,updatedAt:"2026-10-17T10:00:00Z"};
 expect(mergeAutomaticResults([corrected],[ai])[0].score).toBe(92);
 expect(mergeAutomaticResults([ai],[corrected])[0].score).toBe(92);
});
test("the newest admin correction wins, including serialized Firestore timestamps", () => {
 const corrected={...history[0],score:92,manualScoreOverride:true,updatedAt:{_seconds:100}};
 const latest={...corrected,score:88,updatedAt:{seconds:110}};
 expect(mergeAutomaticResults([corrected],[latest])[0].score).toBe(88);
});
test("a corrected legacy row replaces the same dated attempt even when its score changed", () => {
 const old={assignment_id:"B1-7.21",date:"2026-10-21T16:00:00Z",score:49};
 const corrected={...old,score:92,scoreOverrideAuthoritative:true};
 expect(mergeAutomaticResults([old],[corrected])).toEqual([corrected]);
});
test("different submission IDs preserve retakes even when their container path matches", () => {
 const first={...history[0],submissionId:"first",submissionPath:"submissions/B1/student",score:49};
 const retake={...first,submissionId:"retake",score:92};
 expect(mergeAutomaticResults([first],[retake])).toEqual([first,retake]);
});
