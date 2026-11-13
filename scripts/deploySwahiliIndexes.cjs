// Add only the Kiswahili review collection-group index, without deleting
// or reconciling unrelated indexes managed in Firebase Console.
const {createRequire}=require("node:module");
const path=require("node:path");
const fs=require("node:fs");
const {google}=createRequire(path.resolve(__dirname,"../functions/package.json"))("googleapis");
const project="falowen-examiner-trainer";
const parent=`projects/${project}/databases/(default)/collectionGroups/swahiliLessons`;
const BASE="https://firestore.googleapis.com/v1/";
const canonical=(fields)=>fields.filter(f=>f.fieldPath!=="__name__").map(f=>`${f.fieldPath}:${f.order||f.arrayConfig||""}`).join("|");
async function run(){
  if(process.env.FIREBASE_PROJECT_ID!==project)throw Error("Unexpected Firebase project");
  const definition=JSON.parse(fs.readFileSync(path.resolve(__dirname,"../firestore.indexes.json"),"utf8"));
  const required=definition.indexes.filter(x=>x.collectionGroup==="swahiliLessons" && x.queryScope==="COLLECTION_GROUP");
  if(required.length!==1)throw Error("Exactly one Swahili review index required");
  const auth=await new google.auth.GoogleAuth({scopes:["https://www.googleapis.com/auth/datastore","https://www.googleapis.com/auth/cloud-platform"]}).getClient();
  const url=BASE+parent+"/indexes";
  let existing=[],token;
  do{
    const response=await auth.request({url,params:token?{pageSize:100,pageToken:token}:{pageSize:100}});
    existing.push(...(response.data.indexes||[]));
    token=response.data.nextPageToken;
  }while(token);
  for(const index of required){
    const match=existing.find(x=>x.queryScope==="COLLECTION_GROUP" && canonical(x.fields||[])===canonical(index.fields));
    if(match){console.log(`Swahili index exists: ${match.name} (${match.state||"unknown"})`);continue;}
    try{
      const response=await auth.request({url,method:"POST",data:{queryScope:"COLLECTION_GROUP",fields:index.fields}});
      console.log(`Swahili index creation requested: ${response.data.name||"operation started"}`);
    }catch(error){
      if(error.response?.status===409){console.log("Concurrent Swahili index creation in progress");continue;}
      throw error;
    }
  }
}
if(require.main===module)run().catch(error=>{console.error("Swahili index provisioning failed:",error.response?.status||error.message);process.exitCode=1;});
module.exports={canonical,run};
