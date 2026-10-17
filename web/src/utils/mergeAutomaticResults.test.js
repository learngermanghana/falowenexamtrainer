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
