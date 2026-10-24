// Share this regression suite between Firebase Jest and dependency-free Node CI.
const test = globalThis.test || require("node:test");
const assert = require("node:assert/strict");
const {validateBackup, saveBackup, publicBackup} = require("../a2Mock2SectionBackup");
const started = Date.now() - 60_000;
const completed = Date.now() - 30_000;
const a2Writing = {submittedAt:completed, startedAt:started, sms:"Hallo Julia", email:"Sehr geehrtes Hotel"};
const b2Writing = {submittedAt:completed, schreiben:{teil1:"Mein Text",teil2:"Meine E-Mail"}, score:18};

test("only compact submitted choices and writing text are accepted", () => {
  assert.deepEqual(validateBackup("a2-mock-02","lesen",{
    submittedAt:completed, answers:{"1":"a","2":"richtig"}
  }), {submittedAt:completed, answers:{"1":"a","2":"richtig"}});
  assert.deepEqual(validateBackup("a2-mock-02","schreiben",a2Writing),a2Writing);
  assert.deepEqual(validateBackup("b2-final-mock","schreiben",b2Writing),b2Writing);
  assert.throws(()=>validateBackup("a2-mock-02","sprechen",{submittedAt:completed,audio:"..."}),/Unsupported/);
  const safe=validateBackup("b2-final-mock","schreiben",{
    submittedAt:completed, schreiben:{teil1:"x",teil2:"y"}, transcript:"private speech",
  });
  assert.ok(!JSON.stringify(safe).includes("private speech"));
  assert.throws(()=>validateBackup("a2-mock-02","lesen",{answers:{"1":"a"}}),/timestamp/);
});
const mockDb = () => {
  const store = new Map();
  const db = {
    collection: name => ({doc:id=>({path:name+"/"+id})}),
    runTransaction: async task => task({
      get: async ref=>({exists:store.has(ref.path), data:()=>store.get(ref.path)}),
      set: (ref,value)=>store.set(ref.path,value),
    }),
  };
  const admin = {firestore:{FieldValue:{serverTimestamp:()=>"now"}}};
  return {db,admin,store};
};
test("upserts one student/mock backup and never overwrites a newer attempt", async () => {
  const {db,admin,store}=mockDb();
  const data={mockId:"a2-mock-02",section:"schreiben",attemptStartedAtMs:started,data:a2Writing};
  assert.deepEqual(await saveBackup(db,admin,"studentUID","student@example.com",data),{saved:true,unchanged:false});
  assert.deepEqual(await saveBackup(db,admin,"studentUID","student@example.com",data),{saved:true,unchanged:true});
  const keys=[...store.keys()];
  assert.deepEqual(keys,["mockSectionBackups/studentUID:a2-mock-02"]);
  assert.equal(publicBackup(store.get(keys[0])).sections.schreiben.sms,"Hallo Julia");
  await assert.rejects(()=>saveBackup(db,admin,"studentUID","",{...data,attemptStartedAtMs:started-1}), {status:409});
});
test("a delayed B2 AI score updates the same document once and stores no media", async () => {
  const {db,admin,store}=mockDb();
  const req={mockId:"b2-final-mock",section:"schreiben",attemptStartedAtMs:started,
    data:{submittedAt:completed,schreiben:b2Writing.schreiben}};
  await saveBackup(db,admin,"student","",req);
  assert.deepEqual(await saveBackup(db,admin,"student","",{...req,data:b2Writing}),{saved:true,unchanged:false});
  const record=store.get("mockSectionBackups/student:b2-final-mock");
  assert.equal(record.sections.schreiben.score,18);
  assert.ok(!JSON.stringify(record).includes("audio"));
});
