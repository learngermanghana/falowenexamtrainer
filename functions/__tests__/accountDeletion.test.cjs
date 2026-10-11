const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
function fixture() {
 const rows = new Map(); const events=[];
 const ref = (collection,id) => ({id,path:`${collection}/${id}`,get:async()=>snap(collection,id),set:async data=>rows.set(`${collection}/${id}`,data),update:async data=>rows.set(`${collection}/${id}`,{...rows.get(`${collection}/${id}`),...data}),delete:async()=>{events.push(`delete:${collection}/${id}`);rows.delete(`${collection}/${id}`);},listCollections:async()=>[]});
 const snap=(collection,id)=>({id,ref:ref(collection,id),exists:rows.has(`${collection}/${id}`),data:()=>rows.get(`${collection}/${id}`)});
 const query=(collection,field,op,value)=>({get:async()=>({docs:[...rows.keys()].filter(key=>key.startsWith(collection+"/") && !key.slice(collection.length+1).includes("/") && (!field || (op==="in"?value.includes(rows.get(key)[field]):rows.get(key)[field]===value))).map(key=>snap(collection,key.slice(collection.length+1)))})});
 const db={collection:name=>({doc:id=>ref(name,id),listDocuments:async()=>[...rows.keys()].filter(key=>key.startsWith(name+"/")).map(key=>ref(name,key.slice(name.length+1))),get:()=>query(name).get(),where:(field,op,value)=>query(name,field,op,value)}),runTransaction:async fn=>fn({get:r=>r.get(),set:(r,data)=>r.set(data),update:(r,data)=>r.update(data)}),recursiveDelete:async r=>r.delete()};
 class HttpsError extends Error {constructor(code,message){super(message);this.code=code;}}
 const storage={bucket:()=>({name:"bucket",file:()=>({delete:async()=>{}}),deleteFiles:async()=>{}})};
 const api={exports:{}};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,"../accountDeletion.js"),"utf8"),{exports:api.exports,require:name=>name==="firebase-admin"?{apps:[{}],firestore:()=>db,storage:()=>storage}:{onCall:(_options,handler)=>handler,HttpsError},Date,Set,Map,URL,console:{error:()=>{}}});
 return {api:api.exports,db,rows,events,storage};
}
const request=()=>({auth:{uid:"student",token:{auth_time:Math.floor(Date.now()/1000),email:"student@example.com"}},data:{confirmation:"DELETE"}});
test("requires recent authentication and explicit confirmation; blocks staff",async()=>{
 const {api}=fixture();assert.throws(()=>api._validateRequest({}),{code:"unauthenticated"});
 assert.throws(()=>api._validateRequest({...request(),auth:{uid:"student",token:{auth_time:0}}}),{code:"failed-precondition"});
 assert.throws(()=>api._validateRequest({...request(),auth:{uid:"staff",token:{auth_time:Date.now()/1000,admin:true}}}),{code:"permission-denied"});
 await assert.rejects(api.requestAccountDeletion({...request(),data:{}}),{code:"invalid-argument"});
});
test("repeated requests preserve deadline, cancellation restores access, expired requests cannot recover",async()=>{
 const {api,rows}=fixture();const first=await api.requestAccountDeletion(request());
 assert.ok(Date.parse(first.deleteAt)>Date.now()+29*86400000);
 assert.equal((await api.requestAccountDeletion(request())).deleteAt,first.deleteAt);
 assert.equal((await api.cancelAccountDeletion(request())).status,"cancelled");
 assert.equal(rows.get("accountDeletionRequests/student").status,"cancelled");
 rows.set("accountDeletionRequests/student",{status:"pending",deleteAt:"2000-01-01T00:00:00Z"});
 await assert.rejects(api.cancelAccountDeletion(request()),{code:"failed-precondition"});
});
test("purge waits for deadline and preserves financial records",async()=>{
 const {api,db,rows,events,storage}=fixture();
 rows.set("accountDeletionRequests/student",{status:"pending",deleteAt:"2099-01-01T00:00:00Z"});
 const auth={deleteUser:async()=>events.push("auth")};
 await api._purgeDueAccounts({db,auth,storage,purgeSheets:async()=>{}});assert.deepEqual(events,[]);
 rows.set("accountDeletionRequests/student",{status:"pending",deleteAt:"2000-01-01T00:00:00Z"});
 rows.set("writingSubmissions/essay",{uid:"student"});rows.set("paystackInitRequests/payment",{uid:"student"});
 await api._purgeDueAccounts({db,auth,storage,purgeSheets:async()=>{}});
 assert.ok(!rows.has("writingSubmissions/essay"));assert.ok(rows.has("paystackInitRequests/payment"));
 assert.ok(events.indexOf("auth")>events.indexOf("delete:writingSubmissions/essay"));
});
test("failed cleanup remains blocked and keeps identity for retry",async()=>{
 const {api,db,rows,storage}=fixture();
 rows.set("accountDeletionRequests/student",{status:"pending",deleteAt:"2000-01-01T00:00:00Z",identities:["code"]});
 db.recursiveDelete=async()=>{throw Error("unavailable");};rows.set("scores/result",{studentcode:"code"});
 let deleted=false;
 await api._purgeDueAccounts({db,auth:{deleteUser:async()=>{deleted=true;}},storage,purgeSheets:async()=>{}});
 assert.equal(deleted,false);assert.equal(rows.get("accountDeletionRequests/student").status,"processing");
 assert.ok(rows.get("accountDeletionRequests/student").identities.includes("code"));
});
test("request atomically removes push tokens; cancellation preserves preferences and re-enables notifications", async()=>{
 const {api,rows}=fixture();
 rows.set("students/code",{uid:"student",role:"student",messagingToken:"old",messagingTokens:[{token:"device"}],notificationPreferences:{classReminders:false}});
 await api.requestAccountDeletion(request());
 const paused=rows.get("students/code");
 assert.equal(paused.notificationsPausedForDeletion,true);
 assert.equal(paused.messagingToken,null);assert.equal(paused.messagingTokens.length,0);
 await api.cancelAccountDeletion(request());
 const restored=rows.get("students/code");
 assert.equal(restored.notificationsPausedForDeletion,false);
 assert.equal(restored.notificationPreferences.classReminders,false);
 assert.equal(restored.messagingTokens.length,0);
});
