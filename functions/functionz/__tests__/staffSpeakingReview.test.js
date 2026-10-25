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
      if(name==="liveSpeakExamResults"){
        const clauses=[];
        const query={
          where(field,op,value){clauses.push([field,op,value]);return query;},
          orderBy(field,direction){expect([field,direction]).toEqual(["createdAt","desc"]);return query;},
          limit(n){expect(n).toBeLessThanOrEqual(30);return query;},
          async get(){
            dbReads+=1;
            expect(clauses).toContainEqual(["uid","==",UID]);
            expect(clauses).toContainEqual(["source","==","exam-speaking-practice"]);
            const level=clauses.find(c=>c[0]==="level")?.[2];
            const docs=snapshots.filter(doc=>!level||doc.data().level===level)
              .sort((a,b)=>b.data().createdAt.toDate()-a.data().createdAt.toDate());
            return {docs,size:docs.length};
          },
        };
        return query;
      }
      if(name==="liveSpeakSessions")return {
        orderBy(field,order){expect([field,order]).toEqual(["startedAt","desc"]);return {
          limit(n){expect(n).toBe(80);return {get:async()=>{dbReads++;return {docs:[{
            id:"user-1",data:()=>({uid:UID,source:"exam-speaking-practice",level:"B1",
              startedAt:{toDate:()=>new Date("2026-10-24T09:00:00Z")},
              expiresAt:"2099-01-01T00:00:00.000Z",turnsUsed:4,answeredTurns:3,
              examTask:{courseAssignmentKey:"B1-7.23"},inFlight:true})}],size:1};}};}
        };},
      };
      if(name==="students")return {where(field,op,ids){
        expect([field,op]).toEqual(["uid","in"]);
        expect(ids).toEqual([UID]);
        return {limit(n){expect(n).toBe(60);return {get:async()=>{dbReads++;return {docs:[{data:()=>({uid:UID,name:"Akua Anaaku"})}]}}}}};
      }};
      if(name==="liveSpeakUsage")return {doc(){return {get:async()=>{dbReads++;return {data:()=>({turns:12})}}}}};
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
test("Staff sees grade and activity metadata without words or recordings",async()=>{
  const h=harness();
  const r=await h.invoke();
  expect(r.statusCode).toBe(200);
  expect(r.body.results).toHaveLength(1);
  expect(r.body.results[0]).toMatchObject({
    source:"course_book",score:85,answeredQuestions:2,costUsd:null,
  });
  for(const secret of ["audioBase64","Ich schlage","Hallo, ich komme","A good discussion"]) expect(JSON.stringify(r.body)).not.toContain(secret);
  expect(h.dbReads).toBe(7);
  expect(h.aiCalls).toBe(0);
});
test("Non-staff requests cannot read student speaking activity",async()=>{
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

test("Level-specific Firestore query orders by date before limiting",async()=>{
  const h=harness({results:[frozen,{...frozen,level:"A2"},{
    ...frozen,level:"B1",createdAt:{toDate:()=>new Date("2026-10-24T10:00:00Z")},sessionId:"recent",
  }]});
  const response=await h.invoke({student:"learner@example.com",level:"B1"});
  expect(response.statusCode).toBe(200);
  expect(response.body.results.map(x=>x.sessionId)).toEqual(["recent","session-1"]);
});
test("Exact name lookup rejects different students matched through different name fields",async()=>{
  const {resolveStudent}=require("../staffSpeakingReview");
  const doc=id=>({id,ref:{id},data:()=>({uid:id,name:"Matched learner"})});
  const lookup={name:[doc("first-learner")],fullName:[doc("second-learner")],studentName:[]};
  const admin={firestore:()=>({collection:()=>({where(field){return{limit(){return{get:async()=>({docs:lookup[field]})}}}}})})};
  await expect(resolveStudent({admin,findStudentByCodeOrEmail:async()=>null,input:"Matched learner"}))
    .rejects.toMatchObject({status:409});
});
test("Matching same student under multiple name aliases is not incorrectly rejected",async()=>{
  const {resolveStudent}=require("../staffSpeakingReview");
  const doc={id:UID,ref:{id:UID},data:()=>({uid:UID,name:"Matched learner"})};
  const admin={firestore:()=>({collection:()=>({where(){return{limit(){return{get:async()=>({docs:[doc]})}}}}})})};
  const found=await resolveStudent({admin,findStudentByCodeOrEmail:async()=>null,input:"Matched learner"});
  expect(found.uid).toBe(UID);
});

test("Activity overview loads only on a staff request and shows usage without USD invention",async()=>{
  const h=harness();
  const r=await h.invoke({view:"activity",level:"B1"});
  expect(r.statusCode).toBe(200);
  expect(r.body.view).toBe("activity");
  expect(r.body.activity).toHaveLength(1);
  expect(r.body.activity[0]).toMatchObject({
    studentName:"Akua Anaaku",score:null,level:"B1",source:"course_book",state:"processing",practiceTurns:4,
    answeredQuestions:3,costUsd:null
  });
  expect(r.body.usage.reservedAiCallUnits).toBe(12);
  expect(r.body.usage.costUsd).toBeNull();
  expect(h.dbReads).toBe(3);
  expect(JSON.stringify(r.body)).not.toContain("Ich schlage");
});


test("missing marks remain unscored while an actual zero remains a score",()=>{
  const {normalizeActivity,normalize}=require("../staffSpeakingReview");
  const snap=percent=>({id:"session",data:()=>({...frozen,assessment:{percent}})});
  for(const missing of [undefined,null,""," ",false,[]]){
    expect(normalizeActivity(snap(missing)).score).toBeNull();
    expect(normalize(snap(missing)).score).toBeNull();
  }
  expect(normalizeActivity(snap(0)).score).toBe(0);
  expect(normalizeActivity(snap(85.5)).score).toBe(85.5);
});

test("activity name lookup deduplicates repeated UIDs and uses matching profiles",async()=>{
  const {nameSpeakingActivity}=require("../staffSpeakingReview");
  let reads=0;
  const db={collection:()=>({where(field,op,ids){expect(ids).toEqual([UID]);return {limit:()=>({get:async()=>{reads++;return {docs:[{data:()=>({uid:UID,fullName:"Akua Anaaku"})}]}}})}}})};
  const rows=await nameSpeakingActivity([{uid:UID,score:80},{uid:UID,score:90}],{db,admin:{}});
  expect(reads).toBe(1);expect(rows.map(r=>r.studentName)).toEqual(["Akua Anaaku","Akua Anaaku"]);
  expect(rows.map(r=>r.score)).toEqual([80,90]);
});


test("unlinked UIDs resolve names through Auth email without using another learner's profile",async()=>{
  const {nameSpeakingActivity}=require("../staffSpeakingReview");
  const db={collection:()=>({where(field,op,ids){return {limit:()=>({get:async()=>({docs:field==="email"?[{data:()=>({email:"learner@example.com",name:"Akua Anaaku"})}]:[]})})}}})};
  const admin={auth:()=>({getUsers:async ids=>{expect(ids).toEqual([{uid:UID}]);return {users:[{uid:UID,email:"learner@example.com",displayName:"Fallback name"}]}}})};
  const rows=await nameSpeakingActivity([{uid:UID,score:0}],{db,admin});
  expect(rows[0]).toMatchObject({studentName:"Akua Anaaku",score:0});
});
