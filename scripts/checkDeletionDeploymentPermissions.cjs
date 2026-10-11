const {createRequire}=require("node:module");
const path=require("node:path");
const {google}=createRequire(path.resolve(__dirname,"../functions/package.json"))("googleapis");
const project="falowen-examiner-trainer";
const required=["firebaserules.rulesets.create","firebaserules.releases.update"];
(async()=>{
 if(process.env.FIREBASE_PROJECT_ID!==project)throw Error("Unexpected project");
 const auth=await new google.auth.GoogleAuth({scopes:["https://www.googleapis.com/auth/cloud-platform"]}).getClient();
 const response=await auth.request({url:`https://cloudresourcemanager.googleapis.com/v1/projects/${project}:testIamPermissions`,method:"POST",data:{permissions:required}});
 const granted=new Set(response.data.permissions||[]);
 const missing=required.filter(permission=>!granted.has(permission));
 if(missing.length) throw Error(`Deployment blocked: missing ${missing.join(", ")}. Grant Firebase Rules Admin to the deployment service account before enabling account deletion.`);
 console.log("Firebase rules deployment permissions verified");
})().catch(error=>{console.error(error.message);process.exitCode=1;});
