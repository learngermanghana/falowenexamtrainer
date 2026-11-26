const { HttpsError }=require("firebase-functions/v2/https");
const fail=message=>{throw new HttpsError("invalid-argument",message);};
function validateFamilyRetry(text,input){
 const sections={},order=[];let current="";
 for(const line of String(text||"").replace(/\r\n/g,"\n").split("\n")){
  const heading=line.match(/^\s*(?:teil|part)\s*([1-3])(?:\s*[:.;|·•–-].*)?\s*$/i);
  if(heading){current=heading[1];if(Object.prototype.hasOwnProperty.call(sections,current))fail("Keep exactly one heading for each Teil.");order.push(current);sections[current]="";continue;}
  if(!current){if(line.trim())fail("Keep the three TEIL headings.");continue;}
  sections[current]+=(sections[current]?"\n":"")+line;
 }
 if(order.join(",")!=="1,2,3"||order.some(k=>!sections[k].trim()))fail("Complete all three Teile before resubmitting.");
 const transcript=String(input?.transcript||"").trim(),audioUrl=String(input?.audioUrl||"").trim();
 if(!transcript||transcript!==sections["2"].trim()||!/^https:\/\//i.test(audioUrl)||audioUrl.length>2048)fail("Save a family recording that matches Teil 2 before resubmitting.");
 return {sectionKey:"teil-2",transcript,audioUrl,savedAt:String(input?.savedAt||"").slice(0,40)};
}
async function verifyFamilyRecordingOwnership(admin,uid,audioUrl){
 let url,match,bucket,object;
 try{url=new URL(audioUrl);match=url.pathname.match(/^\/v0\/b\/([^/]+)\/o\/([^/]+)$/);if(!match)throw Error();bucket=decodeURIComponent(match[1]);object=decodeURIComponent(match[2]);}catch{fail("Invalid recording link.");}
 const options=admin.app().options||{},project=options.projectId||process.env.GCLOUD_PROJECT||process.env.GOOGLE_CLOUD_PROJECT;
 const allowed=[options.storageBucket,...(project?[project+".appspot.com",project+".firebasestorage.app"]:[])].filter(Boolean);
 if(url.protocol!=="https:"||url.hostname!=="firebasestorage.googleapis.com"||url.port||!allowed.includes(bucket)||!/^speech-trainer\/speaking\/[A-Za-z0-9._-]+\.webm$/.test(object)||!url.searchParams.get("token")||url.searchParams.get("alt")!=="media")fail("Invalid saved recording link.");
 const [metadata]=await admin.storage().bucket(bucket).file(object).getMetadata().catch(()=>{throw new HttpsError("failed-precondition","Your recording could not be verified. Save it again before submitting.");});
 if(metadata?.metadata?.uid!==uid||!String(metadata.contentType||"").startsWith("audio/")||!String(metadata.metadata?.firebaseStorageDownloadTokens||"").split(",").includes(url.searchParams.get("token")))throw new HttpsError("permission-denied","This recording does not belong to your account or is unavailable.");
}
module.exports={validateFamilyRetry,verifyFamilyRecordingOwnership};
