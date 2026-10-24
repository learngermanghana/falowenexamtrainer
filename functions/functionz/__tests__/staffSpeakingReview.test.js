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
