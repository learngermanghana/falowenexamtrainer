"use strict";
const { getAssignmentSummary } = require("../routes/scoresSummaryCoursePlan");
const { germanEnrollment, planA1Submission, submitA1Assignment } = require("../chatgptAssignmentSubmission");

const lesson = getAssignmentSummary("A1").lessons.find(x => x.submissionRequired && x.assignmentId);
const user = { id: "student-record", data: { program: "german", level: "A1", studentCode: "A1-TEST", name: "Test Learner" } };
const args = { assignmentId: lesson.assignmentId, answerText: "Teil 1\n1. Richtig\n2. Falsch\nTeil 2\nIch heiße Anna und ich komme aus Ghana. Ich lerne Deutsch in der Schule.", requestId: "subtest_001", confirmed: true };
const input = { student: user, uid: "uid-test", email: "student@example.test", ...args };

describe("Falowen official A1 MCP submission boundaries", () => {
  test("keeps programme identity separate from level and inactive placements", () => {
    expect(germanEnrollment({data:{program:"swahili",level:"A1"}}).enrolledInGerman).toBe(false);
    expect(germanEnrollment({data:{program:"swahili",level:"A1",coursePlacements:{german:{level:"A1"}}}}).enrolledInGerman).toBe(false);
    expect(germanEnrollment({data:{program:"swahili",level:"A1",secondaryProgram:"german",coursePlacements:{german:{level:"B1"}}}}))
      .toMatchObject({enrolledInGerman:true,germanLevel:"B1"});
    expect(germanEnrollment(user)).toMatchObject({enrolledInGerman:true,germanLevel:"A1"});
  });
  test("uses a canonical active tutor assignment, verified learner identity and exact answer", () => {
    const p=planA1Submission(input);
    expect(p).toMatchObject({ok:true,assignmentId:lesson.assignmentId,level:"A1",studentCode:"A1-TEST"});
    expect(p.lockId).toContain("uid-test__a1-test__student_example.test__a1__");
    expect(p.documentId).toMatch(/^[a-f0-9]{40}$/);
    expect(p.answerText).toBe(args.answerText);
  });
  test("refuses non-German, unconfirmed, mismatched, mock and unsupported level submissions", () => {
    expect(planA1Submission({...input,student:{id:"s",data:{level:"A1",program:"swahili"}}}).ok).toBe(false);
    expect(planA1Submission({...input,confirmed:false}).ok).toBe(false);
    expect(planA1Submission({...input,assignmentId:"A1-UNKNOWN"}).ok).toBe(false);
    expect(planA1Submission({...input,assignmentId:"a1-mock-02"}).ok).toBe(false);
    expect(planA1Submission({...input,student:{id:"s",data:{level:"C2",program:"german"}}}).ok).toBe(false);
    expect(planA1Submission({...input,requestId:"bad"}).ok).toBe(false);
    expect(planA1Submission({...input,answerText:"A short answer"}).ok).toBe(false);
  });
  test("feature flag prevents all Firestore writes when disabled", async () => {
    const old=process.env.FALOWEN_CHATGPT_OFFICIAL_SUBMIT_ENABLED;
    delete process.env.FALOWEN_CHATGPT_OFFICIAL_SUBMIT_ENABLED;
    const firestore=jest.fn();
    try {
      const r=await submitA1Assignment({admin:{firestore},student:user,uid:input.uid,email:input.email,args});
      expect(r.submitted).toBe(false);
      expect(firestore).not.toHaveBeenCalled();
    } finally {
      if (old===undefined) delete process.env.FALOWEN_CHATGPT_OFFICIAL_SUBMIT_ENABLED;
      else process.env.FALOWEN_CHATGPT_OFFICIAL_SUBMIT_ENABLED=old;
    }
  });
  test("transactionally writes the Campus submission and lock exactly once", async () => {
    const old=process.env.FALOWEN_CHATGPT_OFFICIAL_SUBMIT_ENABLED;
    process.env.FALOWEN_CHATGPT_OFFICIAL_SUBMIT_ENABLED="true";
    const store=new Map();
    const db={
      collection:name=>({doc:id=>({key:name+"/"+id})}),
      runTransaction: async fn=>{
        const changes=[];
        const tx={
          get:async ref=>({exists:store.has(ref.key),data:()=>store.get(ref.key)}),
          create:(ref,value)=>changes.push([ref.key,value]),
        };
        const result=await fn(tx);
        for(const [k,v] of changes){if(store.has(k))throw Error("duplicate create");store.set(k,v);}
        return result;
      },
    };
    const firestore=()=>db;
    firestore.FieldValue={serverTimestamp:()=>new Date("2026-11-15T00:00:00Z")};
    try {
      const params={admin:{firestore},student:user,uid:input.uid,email:input.email,args};
      const first=await submitA1Assignment(params);
      const second=await submitA1Assignment(params);
      expect(first).toMatchObject({submitted:true,alreadyProcessed:false,reviewStatus:"pending_review"});
      expect(second).toMatchObject({submitted:true,alreadyProcessed:true});
      expect(store.size).toBe(2);
      expect([...store.keys()].some(k=>k.startsWith("submissionLocks/"))).toBe(true);
      const payload=[...store.entries()].find(([k])=>k.startsWith("submissions/"))[1];
      expect(payload).toMatchObject({studentId:"uid-test",assignmentId:lesson.assignmentId,attempt:1,status:"submitted",source:"falowen_chatgpt_confirmed_student_submission"});
      const other=await submitA1Assignment({...params,args:{...args,requestId:"other_id_01"}});
      expect(other.submitted).toBe(false);
      expect(store.size).toBe(2);
    } finally {
      if (old===undefined) delete process.env.FALOWEN_CHATGPT_OFFICIAL_SUBMIT_ENABLED;
      else process.env.FALOWEN_CHATGPT_OFFICIAL_SUBMIT_ENABLED=old;
    }
  });
});
