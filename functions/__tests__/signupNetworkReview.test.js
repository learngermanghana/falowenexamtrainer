"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {reviewSignupNetwork,observedSignupIp}=require("../functionz/signupNetworkReview");
function fakeDb(){
 const rows=new Map();
 return {rows, collection(name){return {doc(id){return name+"/"+id;}};},
   async runTransaction(work){return work({get:async ref=>({exists:rows.has(ref),data:()=>rows.get(ref)}),
     set:(ref,data,opts)=>rows.set(ref,opts?.merge?{...rows.get(ref),...data}:data)});}
 };
}
const salt="a".repeat(64), now=Date.UTC(2026,10,25);
const a={email:"one@example.com",phone:"0241234567"}, b={email:"two@example.com",phone:"0551234567"};
const check=(db,application,overrides={})=>reviewSignupNetwork({db,application,program:"german",browserId:"device-aaaaaaaaaaaaaa",ip:"203.0.113.2",studentCode:"S123",salt,now,...overrides});
test("IP-only flag permits signup, browser match holds, same applicant retries",async()=>{
 const db=fakeDb();
 assert.equal((await check(db,a)).hold,false);
 assert.equal((await check(db,a)).hold,false);
 assert.equal((await check(db,b,{browserId:"device-bbbbbbbbbbbbbb"})).hold,false);
 assert.equal((await check(db,b)).hold,true);
 assert.equal((await check(db,b,{browserId:"device-cccccccccccccc",ip:"203.0.113.3"})).hold,true);
 const entry=[...db.rows.entries()].find(([k,v])=>k.startsWith("signupRegistrationReviews/")&&v.email===b.email);
 assert.equal(entry[1].status,"pending");
 assert.equal(entry[1].browserMatch,true);
 assert.equal(entry[1].ipMatch,true);
 db.rows.set(entry[0],{...entry[1],status:"approved"});
 assert.equal((await check(db,b)).hold,false);
 assert.doesNotMatch(JSON.stringify([...db.rows]),/203\.0\.113\.2|device-aaaaaaaaaaaaaa/);
});
test("different languages are independent and IP-only never blocks",async()=>{
 const db=fakeDb();await check(db,a);
 assert.equal((await check(db,b,{program:"swahili"})).hold,false);
 assert.equal((await check(db,b,{browserId:"device-bbbbbbbbbbbbbb"})).hold,false);
 assert.ok([...db.rows.values()].some(r=>r.status==="ip_flag"));
});
test("only last ingress address is considered, never x-real-ip",()=>{
 assert.equal(observedSignupIp({headers:{"x-forwarded-for":"192.0.2.99, 203.0.113.2","x-real-ip":"192.0.2.1"}}),"203.0.113.2");
 assert.equal(observedSignupIp({headers:{"x-real-ip":"192.0.2.1"}}),"");
});
