const { registerStaffSpeakingReviewRoutes, normalize } = require("../staffSpeakingReview");

const UID="student-uid-1234567890";
const frozen={
  uid:UID,sessionId:"session-1",level:"B1",teil:"Teil 1",
  source:"exam-speaking-practice",completed:true,
  task:{courseAssignmentKey:"B1-7.23",prompt:"Plan a celebration"},
  answers:["Ich schlage Samstag vor.","Wir treffen uns um zehn Uhr."],
  dialogue:[{role:"user",text:"Hallo, ich komme."},{role:"assistant",text:"Danke."}],
  assessment:{percent:85},feedback:"A good discussion",
  createdAt:{toDate:()=>new Date("2026-10-24T09:00:00Z")},
};
function harness({identity={role:"tutor"},results=[frozen]}={}){
  let getRecord=0,dbReads=0,aiCalls=0,params={},handler;
  const snapshots=results.map((row,i)=>({id:"session-"+(i+1),data:()=>row}));
  const db={
    collection(name){
      if(name==="liveSpeakExamResults")return {where(field,op,value){
        expect([field,op,value]).toEqual(["uid","==",UID]);
        return {limit(n){expect(n).toBeLessThanOrEqual(60);return{get:async()=>{
          dbReads+=1;return{docs:snapshots,size:snapshots.length};}};}};
      }};
      if(name==="courseSpeakingMockAttempts"||name==="scores")return{
        doc(){return {get:async()=>{dbReads+=1;return {exists:false,data:()=>undefined}}};},
      };
      throw new Error("Unexpected collection "+name);
    },
  };
  const admin={firestore:()=>db};
  registerStaffSpeakingReviewRoutes({get(path,fn){expect(path).toBe("/internal/speaking-review");handler=fn;}},{
    admin,getAuthedUser:async()=>identity,
    findStudentByCodeOrEmail:async()=>({snap:{data:()=>({uid:UID,name:"Learner",email:"learner@example.com"})}}),
  });
  const invoke=async(query={student:"learner@example.com"})=>{
    const req={query};let statusCode=200;
    const res={
      set:()=>res,status(code){statusCode=code;return res;},
      json(body){return {statusCode,body};},
    };
    return handler(req,res);
  };
  return {invoke,get dbReads(){return dbReads},get aiCalls(){return aiCalls}};
}
test("No Firestore read occurs before staff explicitly invokes review",()=>{
  const h=harness();expect(h.dbReads).toBe(0);
});
test("Staff sees actual confirmed answers with grading but no invented playable audio",async()=>{
  const h=harness();
  const r=await h.invoke();
  expect(r.statusCode).toBe(200);
  expect(r.body.results).toHaveLength(1);
  expect(r.body.results[0]).toMatchObject({
    source:"course_book",answers:frozen.answers,score:85,audioAvailable:false,
  });
  expect(JSON.stringify(r.body)).not.toContain("audioBase64");
  expect(h.dbReads).toBe(7);
  expect(h.aiCalls).toBe(0);
});
test("Non-staff requests cannot read student voice transcripts",async()=>{
  const h=harness({identity:{uid:"random-learner"}});
  const r=await h.invoke();expect(r.statusCode).toBe(403);expect(h.dbReads).toBe(0);
});
test("Rejects invalid search and unsupported levels without reading student data",async()=>{
  const h=harness();
  expect((await h.invoke({student:"a",level:"A1"})).statusCode).toBe(400);
  expect((await h.invoke({student:"learner@example.com",level:"C2"})).statusCode).toBe(400);
  expect(h.dbReads).toBe(0);
});
test("Level filter and legacy snapshots stay safely bounded",async()=>{
  const h=harness({results:[frozen,{...frozen,level:"C2"},{
    ...frozen,level:"A1",task:{prompt:"Introduce yourself"},assessment:null,
  }]});
  const r=await h.invoke({student:"learner@example.com",level:"B1"});
  expect(r.body.results).toHaveLength(1);
  expect(r.body.results[0].level).toBe("B1");
});
