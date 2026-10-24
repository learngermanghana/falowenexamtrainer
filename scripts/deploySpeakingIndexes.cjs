// Idempotently provision only the required speaking-review composite indexes.
// Unlike firebase deploy --only firestore:indexes, this does not delete or
// reconcile unrelated indexes already maintained through Firebase Console.
const {createRequire}=require("node:module");
const path=require("node:path");
const fs=require("node:fs");
const {google}=createRequire(path.resolve(__dirname,"../functions/package.json"))("googleapis");
const project="falowen-examiner-trainer";
const parent=`projects/${project}/databases/(default)/collectionGroups/liveSpeakExamResults`;
const BASE="https://firestore.googleapis.com/v1/";
function canonical(fields){
  return fields.map(x=>`${x.fieldPath}:${x.order||x.arrayConfig||""}`).join("|");
}
async function run(){
  if(process.env.FIREBASE_PROJECT_ID!==project)throw Error("Unexpected Firebase project");
  const definition=JSON.parse(fs.readFileSync(path.resolve(__dirname,"../firestore.indexes.json"),"utf8"));
  const needed=definition.indexes.filter(x=>x.collectionGroup==="liveSpeakExamResults" && x.queryScope==="COLLECTION");
  if(needed.length!==2)throw Error("Exactly two review indexes required");
  const auth=await new google.auth.GoogleAuth({scopes:["https://www.googleapis.com/auth/datastore","https://www.googleapis.com/auth/cloud-platform"]}).getClient();
  const url=BASE+parent+"/indexes";
  let found=[],pageToken;
  do{
    const res=await auth.request({url,params:pageToken?{pageSize:100,pageToken}:{pageSize:100}});
    found.push(...(res.data.indexes||[]));
    pageToken=res.data.nextPageToken;
  }while(pageToken);
  for(const index of needed){
    const existing=found.find(x=>x.queryScope==="COLLECTION" && canonical((x.fields||[]).filter(f=>f.fieldPath!=="__name__"))===canonical(index.fields));
    if(existing){
      console.log(`Speaking index already provisioned: ${existing.name} (${existing.state||"unknown"})`);
      continue;
    }
    try {
      const res=await auth.request({url,method:"POST",data:{queryScope:"COLLECTION",fields:index.fields}});
      console.log(`Speaking index creation requested: ${res.data.name||"operation started"}`);
    } catch(err){
      if(err.response?.status===409){console.log("Concurrent index creation already in progress");continue;}
      throw err;
    }
  }
}
if(require.main===module)run().catch(err=>{console.error("Speaking index provisioning failed:",err.response?.status||err.message);process.exitCode=1;});
module.exports={canonical,run};
