"use strict";
const {germanCorrection,swahiliCorrection,applyReview,dueReview,recommendations}=require("../chatgptSavedRevision");
const {getAssignmentSummary}=require("../routes/scoresSummaryCoursePlan");
const DAY=86400000,now=Date.parse("2026-11-25T12:00:00Z");
const entry={term:"Guten Tag",meaning:"Good day",day:1,outcome:"remembered"};
describe("saved revision",()=>{
  test("remembered, difficult and missed words receive bounded review intervals",()=>{
    const first=applyReview({},[entry],"request-1",now);
    expect(dueReview(first,now,10).dueCount).toBe(0);
    expect(dueReview(first,now+DAY,10).items[0].term).toBe(entry.term);
    const next=applyReview(first,[entry],"request-2",now+DAY);
    expect(dueReview(next,now+2*DAY,10).dueCount).toBe(0);
    expect(dueReview(next,now+4*DAY,10).dueCount).toBe(1);
    const missed=applyReview(next,[{...entry,outcome:"again"}],"request-3",now+4*DAY);
    expect(dueReview(missed,now+4*DAY,10).items[0].outcome).toBe("again");
    expect(dueReview(missed,now+185*DAY,10).total).toBe(0);
  });
  test("retry does not alter progress and changed payload is rejected",()=>{
    const prior=applyReview({},[entry],"request-1",now);
    expect(applyReview(prior,[entry],"request-1",now+DAY)).toEqual({duplicate:true});
    expect(applyReview(prior,[{...entry,outcome:"hard"}],"request-1",now+DAY).error).toBeTruthy();
  });
  test("history has a bounded active list",()=>{
    let state={};
    for(let batch=0;batch<11;batch++)state=applyReview(state,Array.from({length:10},(_,i)=>({...entry,term:"word"+(batch*10+i)})),"request-"+batch,now+batch);
    expect(Object.keys(state.items)).toHaveLength(100);
  });
  test("only explicit recorded German course marks, no missing grades or unlabelled dual programme rows",()=>{
    const id=getAssignmentSummary("A2").lessons.find(l=>l.submissionRequired&&l.assignmentId).assignmentId;
    const row={level:"A2",assignmentId:id,score:50,scoreRecorded:true,comments:"Practise verbs",program:"german"};
    expect(germanCorrection([row], "A2",id.toUpperCase(),true)[0].feedback).toBe("Practise verbs");
    expect(germanCorrection([{...row,scoreRecorded:false},{...row,program:"swahili"},{...row,level:"B1"},{...row,program:""}],"A2","",true)).toEqual([]);
  });
  test("Kiswahili review must belong to learner and current submission",()=>{
    const work={status:"submitted",submittedAt:{seconds:5,nanoseconds:1}};
    const review={studentId:"own",submissionVersion:"5:1",feedback:"Good",score:80};
    expect(swahiliCorrection(work,review,"own")).toEqual({feedback:"Good",score:80});
    expect(swahiliCorrection(work,{...review,submissionVersion:"4:1"},"own")).toBeNull();
    expect(swahiliCorrection(work,review,"other")).toBeNull();
  });
  test("exam priorities use recorded module scores only and exact time budget",()=>{
    const result=recommendations({sectionScores:{lesen:21,hoeren:8,schreiben:15}},45);
    expect(result.plan[0].skill).toBe("Hören");
    expect(result.plan.reduce((n,p)=>n+p.minutes,0)).toBe(45);
    expect(result.priorities.map(p=>p.skill)).not.toContain("Sprechen");
    expect(recommendations(null,30).priorities).toEqual([]);
  });
});
