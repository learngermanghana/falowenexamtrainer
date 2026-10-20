const { validateBackup, saveBackup, publicBackup } = require("../a2Mock2SectionBackup");

const started = Date.now() - 60_000;
const completed = Date.now() - 30_000;
const a2Writing = {submittedAt:completed, startedAt:started, sms:"Hallo Julia", email:"Sehr geehrtes Hotel"};
const b2Writing = {submittedAt:completed, schreiben:{teil1:"Mein Text",teil2:"Meine E-Mail"}, score:18};

test("backs up only submitted answer choices and writing text", () => {
  expect(validateBackup("a2-mock-02","lesen",{submittedAt:completed,answers:{"1":"a","2":"richtig"}}))
    .toEqual({submittedAt:completed,answers:{"1":"a","2":"richtig"}});
  expect(validateBackup("a2-mock-02","schreiben",a2Writing))
    .toMatchObject(a2Writing);
  expect(validateBackup("b2-final-mock","schreiben",b2Writing)).toMatchObject(b2Writing);
  expect(() => validateBackup("a2-mock-02","sprechen",{submittedAt:completed,audio:"..."})).toThrow("Unsupported");
  expect(() => validateBackup("b2-final-mock","schreiben",{submittedAt:completed,schreiben:{teil1:"x",teil2:"y"}, transcript:"secret"}))
    .not.toThrow();
  const safe = validateBackup("b2-final-mock","schreiben",{submittedAt:completed,schreiben:{teil1:"x",teil2:"y"}, transcript:"secret"});
  expect(JSON.stringify(safe)).not.toContain("secret");
  expect(() => validateBackup("a2-mock-02","lesen",{answers:{"1":"a"}})).toThrow("timestamp");
});

test("server writes at most one current student/mock document and rejects older attempts", async () => {
  const store = new Map();
  const db = {
    collection: collection => ({
      doc: id => ({id, path:collection+"/"+id})
    }),
    runTransaction: async task => task({
      get: async ref => ({exists:store.has(ref.path),data:()=>store.get(ref.path)}),
      set: (ref, value) => store.set(ref.path,value),
    }),
  };
  const admin = {firestore:{FieldValue:{serverTimestamp:()=>"now"}}};
  const req = {mockId:"a2-mock-02", section:"schreiben",attemptStartedAtMs:started,data:a2Writing};
  expect(await saveBackup(db,admin,"studentUID","student@example.com",req)).toEqual({saved:true,unchanged:false});
  expect(await saveBackup(db,admin,"studentUID","student@example.com",req)).toEqual({saved:true,unchanged:true});
  const keys = [...store.keys()];
  expect(keys).toEqual(["mockSectionBackups/studentUID:a2-mock-02"]);
  expect(publicBackup(store.get(keys[0])).sections.schreiben.sms).toBe("Hallo Julia");
  await expect(saveBackup(db,admin,"studentUID","student@example.com",
    {...req,attemptStartedAtMs:started-1})).rejects.toMatchObject({status:409});
});

test("later AI writing score can be attached without a second audio or full-feedback document", async () => {
  const store = new Map();
  const db={collection:c=>({doc:id=>({path:c+"/"+id})}),runTransaction:fn=>fn({
    get:async ref=>({exists:store.has(ref.path),data:()=>store.get(ref.path)}),
    set:(ref,value)=>store.set(ref.path,value),
  })};
  const admin={firestore:{FieldValue:{serverTimestamp:()=>0}}};
  const req={mockId:"b2-final-mock",section:"schreiben",attemptStartedAtMs:started,
    data:{...b2Writing,score:undefined}};
  await saveBackup(db,admin,"student","",req);
  const fresh=await saveBackup(db,admin,"student","",{...req,data:b2Writing});
  expect(fresh).toEqual({saved:true,unchanged:false});
  const record=store.get("mockSectionBackups/student:b2-final-mock");
  expect(record.sections.schreiben.score).toBe(18);
  expect(JSON.stringify(record)).not.toContain("audio");
});
