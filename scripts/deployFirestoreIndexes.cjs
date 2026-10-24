// Create only missing composite indexes without touching Firestore security rules.
// Uses the existing deployment service account with datastore.indexes.create/list.
const fs=require("node:fs");
const path=require("node:path");
const PROJECT="falowen-examiner-trainer";
const ROOT="projects/"+PROJECT+"/databases/(default)";
const API="https://firestore.googleapis.com/v1/";
const src=()=>JSON.parse(fs.readFileSync(path.resolve(__dirname,"../firestore.indexes.json"),"utf8")).indexes||[];
const fields=index=>(index.fields||[]).filter(x=>x.fieldPath!=="__name__")
  .map(x=>[x.fieldPath,x.order||x.arrayConfig]);
const signature=index=>JSON.stringify([index.queryScope||"COLLECTION",fields(index)]);
const candidate=index=>({
  queryScope:index.queryScope||"COLLECTION",
  fields:(index.fields||[]).map(f=>({fieldPath:f.fieldPath,...(f.order?{order:f.order}:{arrayConfig:f.arrayConfig})})),
});
async function run(){
  if(process.env.FIREBASE_PROJECT_ID!==PROJECT)throw Error("Unexpected Firebase project");
  const {createRequire}=require("node:module");
  const {google}=createRequire(path.resolve(__dirname,"../functions/package.json"))("googleapis");
  const client=await new google.auth.GoogleAuth({scopes:["https://www.googleapis.com/auth/cloud-platform"]}).getClient();
  const all=src();
  let created=0,existing=0;
  for(const group of [...new Set(all.map(x=>x.collectionGroup))]){
    const base=API+ROOT+"/collectionGroups/"+encodeURIComponent(group)+"/indexes";
    let pageToken="",remote=[];
    do{
      const url=base+(pageToken?"?pageToken="+encodeURIComponent(pageToken):"");
      const result=await client.request({url,method:"GET"});
      remote.push(...result.data?.indexes||[]);
      pageToken=result.data?.nextPageToken||"";
    }while(pageToken);
    for(const index of all.filter(x=>x.collectionGroup===group)){
      const sig=signature(index);
      if(remote.some(item=>signature(item)===sig)){
        existing++;console.log("Firestore index already exists:",group,sig);
        continue;
      }
      const body=candidate(index);
      try{
        const res=await client.request({url:base,method:"POST",data:body});
        if(!res.data?.name)throw Error("Firestore did not acknowledge index creation");
        created++;console.log("Requested Firestore index:",group,sig);
      }catch(error){
        if([409].includes(error?.response?.status)){
          console.log("Index was created concurrently:",group,sig);existing++;
        }else throw error;
      }
    }
  }
  console.log("Index reconciliation complete:",{created,existing,
    note:"Indexes may remain BUILDING until Firestore finishes backfilling."});
}
if(require.main===module){
  run().catch(err=>{
    console.error("Firestore index reconciliation failed:",err.response?.status||err.code||"unknown",
      String(err.response?.data?.error?.message||err.message||"").slice(0,300));
    process.exitCode=1;
  });
}
module.exports={signature,fields,candidate};
