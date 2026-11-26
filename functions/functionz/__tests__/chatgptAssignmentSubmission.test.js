"use strict";
const { getAssignmentSummary } = require("../routes/scoresSummaryCoursePlan");
const { germanEnrollment, planA1Submission, submitA1Assignment } = require("../chatgptAssignmentSubmission");

const rules = require("../../data/chatgptA1SubmissionRules.generated.json");
const { isA1TimedAssignment, validateA1ChatgptSubmissionCompleteness } = require("../chatgptA1SubmissionSafety");

const completeAnswerFor = (assignmentId) => Object.entries(rules.supportedTextAssignments[assignmentId])
  .map(([part, rule]) => {
    const title = "Teil " + part.split("-")[1];
    return [title, ...(rule.kind === "numbered"
      ? rule.numbers.map(number => number + ". Antwort für diese Aufgabe")
      : ["Ich lerne Deutsch jeden Tag. Mein Name ist Anna und ich komme aus Ghana. Meine Familie hilft mir beim Lernen."])].join("\n");
  }).join("\n\n");
const lesson = getAssignmentSummary("A1").lessons.find(x =>
  x.submissionRequired && rules.supportedTextAssignments[x.assignmentId] &&
  !isA1TimedAssignment(x.assignmentId, Number(x.dayNumber)));
if (!lesson) throw Error("No current text-only A1 tutor assignment matches the safety snapshot.");
const user = { id: "student-record", data: { program: "german", level: "A1", studentCode: "A1-TEST", name: "Test Learner" } };
const args = { assignmentId: lesson.assignmentId, answerText: completeAnswerFor(lesson.assignmentId), requestId: "subtest_001", confirmed: true };
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
  test("rejects every canonical timed A1 checkpoint, including A1-5.9 and A1-9", () => {
    expect(rules.timedStartDay).toBe(16);
    for (const assignmentId of rules.timedAssignmentIds) {
      expect(isA1TimedAssignment(assignmentId, 1)).toBe(true);
      const attempted = planA1Submission({ ...input, assignmentId });
      expect(attempted.ok).toBe(false);
    }
    expect(isA1TimedAssignment(lesson.assignmentId, 16)).toBe(true);
    expect(isA1TimedAssignment(lesson.assignmentId, Number(lesson.dayNumber))).toBe(false);
  });
  test("requires every numbered section and writing response before any permanent lock", () => {
    expect(validateA1ChatgptSubmissionCompleteness({
      assignmentId: "A1-0.2", answerText: "Teil 1\n1. Richtig\n2. Falsch\nTeil 2\n1. Wort",
    })).toMatchObject({ ok: false, error: expect.stringMatching(/Teil 1 answers 3/) });
    expect(validateA1ChatgptSubmissionCompleteness({
      assignmentId: "A1-3",
      answerText: "Teil 1\n1. Anna\n2. Ben\n3. Carla\n4. David\nTeil 2\nMeine Familie ist sehr nett.",
    })).toMatchObject({ ok: false, error: expect.stringMatching(/Teil 3 answers 1/) });
    expect(validateA1ChatgptSubmissionCompleteness({
      assignmentId: "A1-3", answerText: completeAnswerFor("A1-3"),
    })).toMatchObject({ ok: true });
    expect(validateA1ChatgptSubmissionCompleteness({
      assignmentId: "A1-0.2", answerText: completeAnswerFor("A1-0.2"),
    })).toMatchObject({ ok: true });
    expect(validateA1ChatgptSubmissionCompleteness({
      assignmentId: "A1-2", answerText: completeAnswerFor("A1-3"),
    })).toMatchObject({ ok: false, error: expect.stringMatching(/Campus Review/) });
  });
  test("incomplete work never calls Firestore even when the write pilot is enabled", async () => {
    const previous = process.env.FALOWEN_CHATGPT_OFFICIAL_SUBMIT_ENABLED;
    process.env.FALOWEN_CHATGPT_OFFICIAL_SUBMIT_ENABLED = "true";
    const firestore = jest.fn();
    try {
      const r = await submitA1Assignment({
        admin: { firestore }, student: user, uid: input.uid, email: input.email,
        args: { ...args, answerText: "Teil 1\n1. Richtig\n2. Falsch\nTeil 2\nIch heiße Anna. Meine Familie ist groß." },
      });
      expect(r.submitted).toBe(false);
      expect(r.error).toMatch(/incomplete|Campus Review/);
      expect(firestore).not.toHaveBeenCalled();
    } finally {
      if (previous === undefined) delete process.env.FALOWEN_CHATGPT_OFFICIAL_SUBMIT_ENABLED;
      else process.env.FALOWEN_CHATGPT_OFFICIAL_SUBMIT_ENABLED = previous;
    }
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


describe("Expanded workbook safety", () => {
  const { germanRule, validateGermanText, planSwahili, submitExpandedWorkbook } = require("../chatgptWorkbookSubmission");
  const rules = require("../../data/chatgptLessonContent.generated.json").officialWorkbookRules;
  test("only current non-timed German assignments can be selected", () => {
    for (const level of ["A2","B1"]) {
      const student = {id:"s",data:{program:"german",level}};
      const entries = Object.entries(rules.german).filter(([id,r])=>r.level===level && r.day < (level==="B1"?18:21));
      expect(entries.length).toBeGreaterThan(0);
      const match = entries.find(([id])=>germanRule(student,{assignmentId:id},rules));
      expect(match).toBeDefined();
      const rule = germanRule(student,{assignmentId:match[0]},rules);
      expect(validateGermanText("Teil 2\n",rule)).toBe(false);
      const response = rule.requiredParts.map(n=>"Teil "+n+"\nMeine eigene Antwort besteht aus mehreren vollständigen Sätzen. Ich lerne und schreibe heute. Danach lese ich noch einen kurzen Text und übe mit meiner Freundin.").join("\n");
      expect(validateGermanText(response,rule)).toBe(true);
      expect(germanRule(student,{assignmentId:level==="A2"?"A2-8.21":"B1-6.18"},rules)).toBeNull();
      expect(germanRule({id:"s",data:{program:"swahili",level}}, {assignmentId:match[0]},rules)).toBeNull();
    }
  });
  test("Kiswahili requires every exact question ID and a listening confirmation", () => {
    const rule = rules.swahili["12"];
    const answers = list => Object.fromEntries(list.map(q=>[q.id,q.choices[0] || "Jibu langu"]));
    const args = {day:12,writing:"Jibu langu kuhusu tarehe.",readingAnswers:answers(rule.reading),listeningAnswers:answers(rule.listening),listeningConfirmed:true};
    expect(planSwahili(args,rules)?.data).toMatchObject({contentVersion:3,program:"swahili",writing:{response:args.writing}});
    expect(planSwahili({...args,listeningConfirmed:false},rules)).toBeNull();
    expect(planSwahili({...args,readingAnswers:{}},rules)).toBeNull();
    expect(planSwahili({...args,day:1},rules)).toBeNull();
  });
  test("without confirmation or rollout flag, no database access occurs", async () => {
    const prior=process.env.FALOWEN_CHATGPT_EXPANDED_SUBMIT_ENABLED;
    delete process.env.FALOWEN_CHATGPT_EXPANDED_SUBMIT_ENABLED;
    const firestore=jest.fn();
    try {
      const base={admin:{firestore},student:user,uid:"uid",email:"student@example.test",rules};
      expect((await submitExpandedWorkbook({...base,args:{program:"german",confirmed:true,requestId:"request_123"}})).submitted).toBe(false);
      expect((await submitExpandedWorkbook({...base,args:{program:"swahili",confirmed:false,requestId:"request_123"}})).submitted).toBe(false);
      expect(firestore).not.toHaveBeenCalled();
    } finally {
      if(prior===undefined) delete process.env.FALOWEN_CHATGPT_EXPANDED_SUBMIT_ENABLED;
      else process.env.FALOWEN_CHATGPT_EXPANDED_SUBMIT_ENABLED=prior;
    }
  });
});
