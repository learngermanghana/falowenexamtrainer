const {resolveSwahiliAccess,readSwahiliAccess}=require("../swahiliAccess");
const {normalizeWorkbook,registerSwahiliSubmissionRoute}=require("../swahiliSubmission");
const now=Date.parse("2026-11-24T12:00:00Z");
const dual={uid:"u",program:"german",level:"B1",paymentStatus:"paid",secondaryProgram:"swahili",coursePlacements:{swahili:{level:"A1",accessType:"complimentary",contractEnd:new Date(now+1000).toISOString()}}};
test("complimentary Swahili expires independently of paid German",()=>{
 expect(resolveSwahiliAccess(dual,"A1",now)).toEqual({allowed:true,expiresAtMs:now+1000});
 expect(resolveSwahiliAccess(dual,"A1",now+1000)).toEqual({allowed:false});
 expect(resolveSwahiliAccess(dual,"B1",now).allowed).toBe(false);
 expect(resolveSwahiliAccess({...dual,secondaryProgram:""}, "A1",now).allowed).toBe(false);
 expect(resolveSwahiliAccess(dual,"A1",now,{examOnly:true}).allowed).toBe(false);
});
test("preserves approved Hamburg and unmanaged legacy placements; denies pending and invalid grants",()=>{
 expect(resolveSwahiliAccess({program:"swahili",level:"A1",institutionVerification:"approved"},"A1",now).allowed).toBe(true);
 expect(resolveSwahiliAccess({program:"swahili",level:"A1",institutionVerification:"pending"},"A1",now).allowed).toBe(false);
 expect(resolveSwahiliAccess({...dual,coursePlacements:{swahili:{level:"A1"}}},"A1",now).allowed).toBe(true);
 expect(resolveSwahiliAccess({...dual,coursePlacements:{swahili:{level:"A1",accessType:"complimentary"}}},"A1",now).allowed).toBe(false);
});
function fixture(profile,duplicate=false,deletion={}) {
 const writes=[];
 const snap=data=>({data:()=>data});
 const doc=path=>({path,get:async()=>snap(path.startsWith("accountDeletionRequests/")?deletion:{}),collection:name=>({doc:id=>doc(path+"/"+name+"/"+id)})});
 const db={collection:name=>({doc:id=>doc(name+"/"+id),where:()=>({limit:()=>({get:async()=>({size:duplicate?2:1,docs:[snap(profile)]})})})}),runTransaction:fn=>fn({get:ref=>ref.get(),set:(ref,data)=>writes.push({path:ref.path,data})})};
 return {db,writes};
}
const work={level:"A1",day:1,title:"Somo la 1",writing:{response:"Jina langu ni Amina."},readingAnswers:{q1:"A"},listeningAnswers:{},studentId:"other",score:100};
test("canonical submission ignores requested identity and score",()=>{
 const result=normalizeWorkbook(work);
 expect(result.id).toBe("day-1");
 expect(result.data).not.toHaveProperty("studentId");
 expect(result.data).not.toHaveProperty("score");
 expect(normalizeWorkbook({...work,day:99})).toBeNull();
});
test("lookup rejects ambiguous or deleted accounts",async()=>{
 expect((await readSwahiliAccess(fixture(dual,true).db,"u","A1",null,now)).allowed).toBe(false);
 expect((await readSwahiliAccess(fixture(dual,false,{status:"pending"}).db,"u","A1",null,now)).allowed).toBe(false);
});
test("server refuses expired grant and binds successful writes to authenticated UID",async()=>{
 for(const active of [false,true]){
  const {db,writes}=fixture({...dual,coursePlacements:{swahili:{level:"A1",accessType:"complimentary",contractEnd:new Date(Date.now()+(active?60000:-60000)).toISOString()}}});
  let handler;
  const firestore=Object.assign(()=>db,{FieldValue:{serverTimestamp:()=>"server"}});
  registerSwahiliSubmissionRoute({post:(_,fn)=>{handler=fn;}},{admin:{firestore},getAuthedUser:async()=>({uid:"u",email:"student@example.org"})});
  const res={set:jest.fn(),status:jest.fn().mockReturnThis(),json:jest.fn()};
  await handler({body:work},res);
  if(active){
   expect(writes[0].path).toBe("users/u/swahiliLessons/day-1");
   expect(writes[0].data).toMatchObject({studentId:"u",submittedAt:"server"});
   expect(writes[0].data).not.toHaveProperty("score");
  }else{
   expect(res.status).toHaveBeenCalledWith(403);
   expect(writes).toHaveLength(0);
  }
 }
});
