const { normalizeMockAttempt, normalizeBrowserProgress, listMockAttempts, verifiedFinalMockScore, enrichPublishedMockScores, isAuthorizedMockMonitor } = require("../mockAttemptMonitor");

test("mock monitor redacts student answers and preserves section timing", () => {
  const row = normalizeMockAttempt({
    id: "a", ref: { path: "a2MockExamUsers/uid123/attempts/a" },
    data: () => ({
      uid: "uid123", email: "student@example.org", mockId: "a2-mock-01",
      status: "in_progress", section: "hoeren", attemptNumber: 2,
      sectionScores: { lesen: 17, hoeren: null },
      startedAt: "2026-10-09T11:00:00Z", updatedAt: "2026-10-09T11:15:00Z",
      state: { stage: "hoeren", sectionDeadlineMs: 1791546000000,
        lesenAnswers: { hidden: "secret" }, schreibenText: "private text" },
    }),
  });
  expect(row.level).toBe("A2");
  expect(row.section).toBe("hoeren");
  expect(row.completedSections).toEqual(["lesen"]);
  expect(row.progressCount).toBe(1);
  expect(row.sectionDeadlineMs).toBe(1791546000000);
  expect(JSON.stringify(row)).not.toMatch(/private text|secret/);
});

test("unrelated nested attempts are excluded and completed scores are verified", () => {
  expect(normalizeMockAttempt({
    id: "x", ref: { path: "writingProgress/uid/attempts/x" }, data: () => ({}),
  })).toBeNull();
  const completed = normalizeMockAttempt({
    id: "b", ref: { path: "b1MockExamUsers/uid/attempts/b" },
    data: () => ({ status: "completed", sectionScores: { lesen: 0, hoeren: 10 },
      overall: { score: 99 }, verifiedOverall: { score: 80 } }),
  });
  expect(completed.overallScore).toBe(80);
  expect(completed.progressCount).toBe(2);
});

test("listMockAttempts loads recent monitored rows", async () => {
  const doc = { id: "a", ref: { path: "a1MockExamUsers/uid/attempts/a" },
    data: () => ({ status: "in_progress" }) };
  const fakeDb = { collectionGroup: () => ({
    orderBy: () => ({ limit: () => ({ get: async () => ({ docs: [doc], size: 1 }) }) }),
  }) };
  const result = await listMockAttempts(fakeDb);
  expect(result.attempts).toHaveLength(1);
  expect(result.partial).toBe(false);
});

test("A2 Mock 2 browser progress cannot expose answers or pretend to be a verified score", () => {
  const row = normalizeBrowserProgress({ data: () => ({
    uid: "student", mockId: "a2-mock-02", section: "schreiben",
    completedSections: ["lesen", "hoeren"], status: "in_progress",
    rawAnswers: { x: "private" },
  }) });
  expect(row.level).toBe("A2");
  expect(row.progressCount).toBe(2);
  expect(row.overallScore).toBeNull();
  expect(row.progressSource).toBe("browser_reported");
  expect(JSON.stringify(row)).not.toContain("private");
});


test("mock monitoring only allows privileged identity claims or owner", () => {
  expect(isAuthorizedMockMonitor({ uid: "staff", email: "staff@falowen.app" })).toBe(false);
  expect(isAuthorizedMockMonitor({ uid: "admin", email: "moxflex@gmail.com" })).toBe(true);
  expect(isAuthorizedMockMonitor({ uid: "tutor", role: "tutor" })).toBe(true);
  expect(isAuthorizedMockMonitor({ uid: "admin-claim", admin: true })).toBe(true);
  expect(isAuthorizedMockMonitor({ uid: "learner", role: "student", email: "learner@example.com" })).toBe(false);
  expect(isAuthorizedMockMonitor({ email: "staff@falowen.app" })).toBe(false);
  expect(isAuthorizedMockMonitor(null)).toBe(false);
});

test("mock monitor resolves registered student names by UID and email for existing attempts", async () => {
  const docs = [
    { id: "one", ref: { path: "a1MockExamUsers/uid-1/attempts/one" },
      data: () => ({ uid: "uid-1", email: "one@example.org", status: "in_progress" }) },
    { id: "two", ref: { path: "a2MockExamUsers/uid-2/attempts/two" },
      data: () => ({ uid: "uid-2", email: "two@example.org", status: "completed" }) },
  ];
  const directory = [
    { id: "STU-01", data: () => ({ uid: "uid-1", email: "one@example.org",
      name: "Ama Mensah", answers: { secret: "not for the monitor" } }) },
    { id: "STU-02", data: () => ({ email: "two@example.org",
      fullName: "Kojo Asare", notes: "confidential" }) },
  ];
  const db = {
    collectionGroup: () => ({ orderBy: () => ({ limit: () => ({
      get: async () => ({ docs, size: docs.length }),
    }) }) }),
    collection: path => {
      if (path === "mockProgressMonitor") return { limit: () => ({
        get: async () => ({ docs: [], size: 0 }),
      }) };
      if (path !== "students") throw new Error("Unexpected collection");
      return { where: (field, op, values) => ({
        get: async () => ({ docs: directory.filter(entry => values.includes(entry.data()[field])) }),
      }) };
    },
  };
  const result = await listMockAttempts(db);
  expect(result.attempts.map(row => row.studentName)).toEqual(["Ama Mensah", "Kojo Asare"]);
  expect(result.attempts[0].studentEmail).toBe("one@example.org");
  expect(result.attempts[1].studentEmail).toBe("two@example.org");
  expect(JSON.stringify(result)).not.toMatch(/confidential|not for the monitor/);
});

test("mock monitor resolves legacy profiles keyed by UID and preserves email fallback", async () => {
  const docs = [
    { id: "a", ref: { path: "b1MockExamUsers/legacy-uid/attempts/a" },
      data: () => ({ email: "legacy@example.org" }) },
    { id: "b", ref: { path: "a1MockExamUsers/missing-uid/attempts/b" },
      data: () => ({ email: "missing@example.org" }) },
  ];
  const db = {
    collectionGroup: () => ({ orderBy: () => ({ limit: () => ({
      get: async () => ({ docs, size: docs.length }),
    }) }) }),
    collection: path => {
      if (path === "mockProgressMonitor") return { limit: () => ({
        get: async () => ({ docs: [], size: 0 }),
      }) };
      return { where: () => ({ get: async () => ({ docs: [] }) }),
        doc: uid => ({ id: uid }) };
    },
    getAll: async (...refs) => refs.map(ref => ({
      id: ref.id, exists: ref.id === "legacy-uid",
      data: () => ({ name: "Nana Boateng" }),
    })),
  };
  const result = await listMockAttempts(db);
  expect(result.attempts.map(row => row.studentName)).toEqual(["Nana Boateng", ""]);
  expect(result.attempts[1].studentEmail).toBe("missing@example.org");
});


test.each([
  ["a1MockExamUsers", "A1"],
  ["a2MockExamUsers", "A2"],
  ["b1MockExamUsers", "B1"],
])("%s finished attempts expose four server-verified skills and their total without answers", (collection, level) => {
  const row = normalizeMockAttempt({
    id:"mock-a",ref:{path:collection+"/learner-1/attempts/mock-a"},
    data:()=>({
      uid:"learner-1",status:"completed",mockId:level.toLowerCase()+"-mock-01",
      sectionScores:{lesen:0,hoeren:0,schreiben:0,sprechen:0}, // Older browser snapshot must not overwrite verified marks.
      verifiedSectionScores:{lesen:22.5,hoeren:0,schreiben:19,sprechen:25},
      verifiedOverall:{score:66.5,maxScore:100},state:{schreibenText:"private student writing"},
      rawAnswers:{password:"do not return"},
    })
  });
  expect(row.level).toBe(level);
  expect(row.sectionScores).toEqual({lesen:22.5,hoeren:0,schreiben:19,sprechen:25});
  expect(row.overallScore).toBe(66.5);
  expect(JSON.stringify(row)).not.toMatch(/private student writing|do not return/);
});

test("unverified in-progress skill scores never look like finalized marks",()=>{
  const row=normalizeMockAttempt({
    id:"start",ref:{path:"a1MockExamUsers/learner/attempts/start"},
    data:()=>({status:"in_progress",sectionScores:{lesen:25,hoeren:0},
      overall:{score:100}})
  });
  expect(row.completedSections).toEqual(["lesen","hoeren"]);
  expect(row.sectionScores).toBeNull();
  expect(row.overallScore).toBeNull();
});

test("historical verified totals can display their saved section scores without substituting zero for missing marks",()=>{
  const completed=normalizeMockAttempt({
    id:"legacy",ref:{path:"b1MockExamUsers/learner/attempts/legacy"},
    data:()=>({status:"completed",verifiedOverall:{score:70},
      sectionScores:{lesen:0,hoeren:20,schreiben:25,sprechen:null}})
  });
  expect(completed.sectionScores).toEqual({lesen:0,hoeren:20,schreiben:25,sprechen:null});
  expect(completed.overallScore).toBe(70);
  const missing=normalizeMockAttempt({
    id:"invalid",ref:{path:"a2MockExamUsers/learner/attempts/invalid"},
    data:()=>({status:"completed",sectionScores:{lesen:25},verifiedOverall:{score:null}})
  });
  expect(missing.overallScore).toBeNull();
  expect(missing.sectionScores).toBeNull();
  const invalid=normalizeMockAttempt({
    id:"invalidscore",ref:{path:"a2MockExamUsers/learner/attempts/invalidscore"},
    data:()=>({status:"completed",verifiedOverall:{score:50},
      verifiedSectionScores:{lesen:26,hoeren:-1,schreiben:"",sprechen:"invalid"}})
  });
  expect(invalid.sectionScores).toEqual({lesen:null,hoeren:null,schreiben:null,sprechen:null});
});


test.each([
 ["a1MockExamUsers","A1","a1_final_mock"],
 ["a2MockExamUsers","A2","a2_final_mock"],
 ["b1MockExamUsers","B1","b1_final_mock"],
])("%s recovers real section marks from the archived final mock result",async(parent,level,source)=>{
 const data={status:"completed",verifiedOverall:{score:70},
   sectionScores:null,completionSync:{scoreDocId:"score-"+level}};
 const raw={id:"attempt-20",ref:{path:parent+"/uid-20/attempts/attempt-20"},data:()=>data};
 const output=normalizeMockAttempt(raw);
 const published={uid:"uid-20",mockAttemptId:"attempt-20",level,
   source,score:70,sectionScores:{lesen:20,hoeren:15,schreiben:16,sprechen:19}};
 const db={
   collection:name=>{
     if(name!=="scores")throw Error("Unexpected collection");
     return {doc:id=>({id}),where:()=>({get:async()=>({docs:[]})})};
   },
   getAll:async(...refs)=>refs.map(ref=>({exists:true,data:()=>published}))
 };
 const scored=await enrichPublishedMockScores(db,[output],[raw]);
 expect(scored[0]).toMatchObject({
   overallScore:70,sectionScores:{lesen:20,hoeren:15,schreiben:16,sprechen:19},
   scoreSource:"published_final_result"
 });
 expect(JSON.stringify(scored[0])).not.toContain("scoreDocId");
});

test("archive score joins require exact attempt ownership, published source and consistent total",()=>{
 const attempt={id:"A1:uid-2:attempt-a",level:"A1",mockId:"a1-mock-01",status:"completed",
   overallScore:75,sectionScores:{lesen:null}};
 const verified={uid:"uid-2",mockAttemptId:"attempt-a",level:"A1",mockId:"a1-mock-01",
   source:"a1_final_mock",score:75,sectionScores:{lesen:20,hoeren:20,schreiben:15,sprechen:20}};
 expect(verifiedFinalMockScore(attempt,verified)?.sections.lesen).toBe(20);
 expect(verifiedFinalMockScore(attempt,{...verified,uid:"other"})).toBeNull();
 expect(verifiedFinalMockScore(attempt,{...verified,mockAttemptId:"different"})).toBeNull();
 expect(verifiedFinalMockScore(attempt,{...verified,source:"browser_import"})).toBeNull();
 expect(verifiedFinalMockScore(attempt,{...verified,score:99})).toBeNull();
 expect(verifiedFinalMockScore({...attempt,status:"in_progress"},verified)).toBeNull();
 expect(verifiedFinalMockScore(attempt,{...verified,sectionScores:{...verified.sectionScores,sprechen:null}})).toBeNull();
});

test("historic attempts without a score pointer use a bounded indexed lookup and preserve genuine zeros",async()=>{
 const level="B1",id="historic-"+Date.now();
 const row={id:"B1:uid-legacy:"+id,status:"completed",level,mockId:"b1-mock-01",overallScore:0,
   sectionScores:{lesen:null,hoeren:null,schreiben:null,sprechen:null}};
 let queryKeys=[];
 const db={collection:name=>({
   where:(field,op,values)=>{
     expect(name).toBe("scores"); expect(field).toBe("mockAttemptId");expect(op).toBe("in");
     queryKeys=values;
     return {get:async()=>({docs:[{data:()=>({
       uid:"uid-legacy",mockAttemptId:id,level:"B1",source:"b1_final_mock",
       score:0,sectionScores:{lesen:0,hoeren:0,schreiben:0,sprechen:0}
     })}]})};
   }
 })};
 const [out]=await enrichPublishedMockScores(db,[row]);
 expect(queryKeys).toEqual([id]);
 expect(out.sectionScores).toEqual({lesen:0,hoeren:0,schreiben:0,sprechen:0});
 expect(out.overallScore).toBe(0);
});


test("completed mock progress uses verified section scores even if browser snapshot disagrees", () => {
  for (const [parent,level] of [["a1MockExamUsers","A1"],["a2MockExamUsers","A2"],["b1MockExamUsers","B1"]]) {
    const doc={id:"attempt-1",ref:{path:parent+"/uid123/attempts/attempt-1"},data:()=>({
      uid:"uid123",status:"completed",
      sectionScores:{lesen:25,hoeren:25,schreiben:25,sprechen:25},
      verifiedOverall:{score:66,maxScore:100},
      verifiedSectionScores:{lesen:18,hoeren:16,schreiben:20,sprechen:12}
    })};
    const row=normalizeMockAttempt(doc);
    expect(row.level).toBe(level);
    expect(row.sectionScores).toEqual({lesen:18,hoeren:16,schreiben:20,sprechen:12});
    expect(row.completedSections).toEqual(["lesen","hoeren","schreiben","sprechen"]);
    expect(row.scoreSource).toBe("verified_attempt");
    expect(row.overallScore).toBe(66);
  }
});

test("completed mocks with only verified section marks still show all four completed sections", () => {
  const doc={id:"attempt-2",ref:{path:"a1MockExamUsers/uid123/attempts/attempt-2"},data:()=>({
    uid:"uid123",status:"completed",verifiedOverall:{score:68,maxScore:100},
    verifiedSectionScores:{lesen:20,hoeren:18,schreiben:16,sprechen:14}
  })};
  const row=normalizeMockAttempt(doc);
  expect(row.progressCount).toBe(4);
  expect(row.sectionScores).toEqual({lesen:20,hoeren:18,schreiben:16,sprechen:14});
});

test("verified Mock 2 replaces stale browser-reported 4/4 progress",async()=>{
 const docs=[{id:"complete",ref:{path:"a2MockExamUsers/student-uid/attempts/complete"},
   data:()=>({uid:"student-uid",mockId:"a2-mock-02",status:"completed",
     verifiedOverall:{score:70},verifiedSectionScores:{lesen:20,hoeren:20,schreiben:15,sprechen:15}})}];
 const browser=[{data:()=>({uid:"student-uid",mockId:"a2-mock-02",status:"in_progress",
   completedSections:["lesen","hoeren","schreiben","sprechen"]})}];
 const db={
  collectionGroup:()=>({orderBy:()=>({limit:()=>({get:async()=>({docs,size:1})})})}),
  collection:group=>{
   if(group==="mockProgressMonitor")return {limit:()=>({get:async()=>({docs:browser,size:1})})};
   if(group==="students")return {where:()=>({get:async()=>({docs:[]})})};
   throw Error("Unexpected "+group);
  },
 };
 const result=await listMockAttempts(db);
 expect(result.attempts).toHaveLength(1);
 expect(result.attempts[0].status).toBe("completed");
 expect(result.attempts[0].overallScore).toBe(70);
});
