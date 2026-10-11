// Runs only in the authenticated deployment job; uses an isolated disposable
// Auth user. Never prints credentials, tokens, Firebase documents or responses.
const {createRequire}=require("node:module");
const path=require("node:path");
const requireFunctions=createRequire(path.resolve(__dirname,"../functions/package.json"));
const admin=requireFunctions("firebase-admin");
const assert=require("node:assert/strict");
const crypto=require("node:crypto");
const PROJECT="falowen-examiner-trainer";
const ORIGIN="https://www.falowen.app";
const uid=`e2e-account-delete-${crypto.randomUUID()}`;
const email=`${uid}@example.invalid`;
const studentDocId=`code-${uid}`;
const password=crypto.randomBytes(32).toString("base64url");
if(process.env.FIREBASE_PROJECT_ID!==PROJECT) throw Error("Unexpected Firebase project");
admin.initializeApp({projectId:PROJECT});
const db=admin.firestore();
async function signIn(key){
 const response=await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${key}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password,returnSecureToken:true})});
 assert.equal(response.status,200,"Disposable account password sign-in must work");
 return (await response.json()).idToken;
}
async function callable(name,token,data){
 const response=await fetch(`https://europe-west1-${PROJECT}.cloudfunctions.net/${name}`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},body:JSON.stringify({data})});
 assert.equal(response.status,200,`${name} must succeed`);
 const body=await response.json();assert.ok(!body.error,`${name} must have no callable error`);return body.result || body.data;
}
async function readWithToken(token,collection,id){
 return fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/${collection}/${id}`,{headers:{Authorization:`Bearer ${token}`}});
}
async function run(){
 const configText=await (await fetch(`${ORIGIN}/__falowen-firebase-config.js`)).text();
 const json=configText.match(/=\s*(\{[\s\S]*\});/);assert.ok(json,"Production Firebase configuration must be available");
 const config=JSON.parse(json[1]);assert.equal(config.projectId,PROJECT);
 await admin.auth().createUser({uid,email,password,emailVerified:true});
 await admin.auth().setCustomUserClaims(uid,{systemDeletionTest:true});
 await db.collection("students").doc(studentDocId).set({uid,email,role:"student",status:"active",level:"A1",systemDeletionTest:true,messagingToken:"disposable-non-fcm-token",messagingTokens:[{token:"disposable-non-fcm-token"}],notificationPreferences:{classReminders:false},contractEnd:"2099-01-01T00:00:00.000Z"});
 await db.collection("writingProgress").doc(uid).set({uid,score:19,maxScore:25});
 let token=await signIn(config.apiKey);
 assert.equal((await readWithToken(token,"writingProgress",uid)).status,200,"Learning data is accessible before deletion");
 const first=await callable("requestAccountDeletion",token,{confirmation:"DELETE"});
 assert.equal(first.status,"pending");
 const remaining=Date.parse(first.deleteAt)-Date.now();assert.ok(remaining>29.9*86400000 && remaining<=30*86400000,"Deadline is 30 days away");
 const student=(await db.collection("students").doc(studentDocId).get()).data();
 assert.equal(student.notificationsPausedForDeletion,true);assert.equal(student.messagingToken,null);assert.equal(student.messagingTokens.length,0);
 assert.equal((await readWithToken(token,"writingProgress",uid)).status,403,"Pending deletion blocks learning data");
 assert.equal((await readWithToken(token,"students",uid)).status,404,"Recovery can check a missing UID profile before finding its student-code profile");
 assert.equal((await readWithToken(token,"students",studentDocId)).status,200,"The student-code profile remains readable for recovery");
 const directWrite=await fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/accountDeletionRequests/${uid}`,{method:"PATCH",headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},body:JSON.stringify({fields:{status:{stringValue:"cancelled"}}})});
 assert.equal(directWrite.status,403,"Students cannot bypass the cancellation endpoint");
 const again=await callable("requestAccountDeletion",token,{confirmation:"DELETE"});assert.equal(again.deleteAt,first.deleteAt,"Repeated requests preserve deadline");
 token=await signIn(config.apiKey);
 const cancelled=await callable("cancelAccountDeletion",token,{});assert.equal(cancelled.status,"cancelled");
 assert.equal((await readWithToken(token,"writingProgress",uid)).status,200,"Signing back in and cancelling restores learning data");
 const restored=(await db.collection("students").doc(studentDocId).get()).data();assert.equal(restored.notificationsPausedForDeletion,false);assert.equal(restored.notificationPreferences.classReminders,false);
 console.log("PASS live account deletion: password sign-in, 30-day deadline, token removal, access blocking, direct-write denial, idempotency, re-sign-in and cancellation");
}
run().catch(()=>{console.error("Live account deletion verification failed; inspect the assertion and deployment status.");process.exitCode=1;}).finally(async()=>{
 // If cancellation failed, recover the disposable fixture administratively
 // before cleanup. No production student's UID is accepted by this script.
 assert.ok(uid.startsWith("e2e-account-delete-"));
 await db.collection("accountDeletionRequests").doc(uid).delete();
 await db.recursiveDelete(db.collection("writingProgress").doc(uid));
 await db.recursiveDelete(db.collection("students").doc(studentDocId));
 await admin.auth().deleteUser(uid).catch(error=>{if(error.code!=="auth/user-not-found") throw error;});
 console.log("Disposable verification account removed");
});
