const {germanSubmissionAccess,assignmentAllowed,verifyGermanSubmissionAccess}=require("../germanSubmissionAccess");
const now=Date.parse("2026-11-24T12:00:00Z");
const day=86400000;
const start=new Date(now-day).toISOString();
const trial={program:"german",level:"A2",paymentStatus:"pending",trialStatus:"active",trialStartedAt:start,trialEndsAt:new Date(now+6*day).toISOString()};
test.each([["A1","A1-0.1"],["A2","A2-1.1"],["B1","B1-1.1"],["B2","B2-1.1"],["C1","C1-1.1"]])("active %s trial only permits canonical Day 1", (level,key)=>{
 const access=germanSubmissionAccess({...trial,level},now,start);
 expect(access).toMatchObject({mode:"trial",level,day1Keys:[key],endsAtMs:now+6*day});
 expect(assignmentAllowed(access,level,key)).toBe(true);
 expect(assignmentAllowed(access,level,level+"-2")).toBe(false);
 expect(assignmentAllowed(access,"C2",key)).toBe(false);
});
test("expired, unverified, missing and exam-only enrollments do not authorize submissions",()=>{
 for(const profile of [null,{...trial,trialEndsAt:new Date(now).toISOString()},{...trial,accountType:"exam_only"},{level:"A2"},{...trial,trialStatus:"expired"}]) {
  expect(germanSubmissionAccess(profile,now,start)).toBeNull();
 }
 expect(germanSubmissionAccess(trial,now,new Date(now-8*day).toISOString())).toBeNull();
});
test("paid and valid complimentary access respect contract and separate language placement",()=>{
 const paid={level:"B1",paymentStatus:"paid",contractEnd:new Date(now+day).toISOString()};
 expect(germanSubmissionAccess(paid,now)).toMatchObject({mode:"full",levels:["A1","A2","B1"]});
 expect(germanSubmissionAccess({...paid,contractEnd:new Date(now).toISOString()},now)).toBeNull();
 expect(germanSubmissionAccess({program:"swahili",secondaryProgram:"german",coursePlacements:{german:paid}},now)).toMatchObject({mode:"full",level:"B1"});
 expect(germanSubmissionAccess({program:"swahili",level:"A1",paymentStatus:"paid"},now)).toBeNull();
});
test("duplicate UID, partner restriction and account deletion fail closed",async()=>{
 const uid="student";
 const makeDb=(size, docs={})=>({collection:name=>({where:()=>({limit:()=>({get:async()=>({size,docs:[{id:"record",data:()=>({...trial,uid})}]})})}),doc:()=>({get:async()=>({exists:Boolean(docs[name]),data:()=>docs[name]})})})});
 const auth={getUser:async()=>({metadata:{creationTime:start}})};
 expect(await verifyGermanSubmissionAccess(makeDb(2),auth,{uid},now)).toBeNull();
 expect(await verifyGermanSubmissionAccess(makeDb(1,{organisationPartnerMembers:{courseAccessAllowed:false}}),auth,{uid},now)).toBeNull();
 expect(await verifyGermanSubmissionAccess(makeDb(1,{accountDeletionRequests:{status:"pending"}}),auth,{uid},now)).toBeNull();
 expect(await verifyGermanSubmissionAccess(makeDb(1),auth,{uid},now)).toMatchObject({mode:"trial",profileId:"record"});
});
