// Firebase's ruleset creation API validates syntax and semantics before release.
// This uses the deployment identity's existing create/update permissions and
// never requires or grants a broader IAM role.
const {createRequire}=require("node:module");
const fs=require("node:fs");
const path=require("node:path");
const {google}=createRequire(path.resolve(__dirname,"../functions/package.json"))("googleapis");
const project="falowen-examiner-trainer";
(async()=>{
 if(process.env.FIREBASE_PROJECT_ID!==project) throw Error("Unexpected Firebase project");
 const content=fs.readFileSync(path.resolve(__dirname,"../firestore.rules"),"utf8");
 const auth=await new google.auth.GoogleAuth({scopes:["https://www.googleapis.com/auth/cloud-platform"]}).getClient();
 const created=await auth.request({url:`https://firebaserules.googleapis.com/v1/projects/${project}/rulesets`,method:"POST",data:{source:{files:[{name:"firestore.rules",content}]}}});
 const name=created.data.name;
 if(!name?.startsWith(`projects/${project}/rulesets/`))throw Error("Firebase did not return a validated ruleset");
 const release=`projects/${project}/releases/cloud.firestore`;
 const result=await auth.request({url:`https://firebaserules.googleapis.com/v1/${release}`,method:"PATCH",data:{release:{name:release,rulesetName:name},updateMask:"rulesetName"}});
 if(result.data.rulesetName!==name)throw Error("Firebase did not confirm the released ruleset");
 console.log(`Validated Firestore rules released: ${name}`);
})().catch(error=>{console.error(`Firestore rules release failed: ${error.code || error.response?.status || "unknown"} ${error.message}`);process.exitCode=1;});
