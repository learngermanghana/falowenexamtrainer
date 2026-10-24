// Low-cost placement monitoring: reuses existing Vercel + Sheets service account.
// Data is encrypted before writing to the hidden PlacementAttempts tab of the existing Students workbook.
const crypto = require("node:crypto");
const { sendPlacementResultEmail } = require("./placement-result-email");

const SHEET_TAB = "PlacementAttempts";
const ANSWERS = [0,1,1,1,1,1,1,1,0,0,1,1,0,0,2,1,0,2,0,0,0,1,0,1,0,1,0,0,1,1];
const ADMIN_EMAILS = new Set(String(process.env.FALOWEN_ADMIN_EMAILS || "moxflex@gmail.com")
  .split(",").map(x=>x.trim().toLowerCase()).filter(Boolean));
const ALLOWED_ORIGINS = new Set(["https://www.falowen.app","https://falowen.app","https://admin.falowen.app"]);
const cache = { token: "", expires: 0 };
const ipCounts = new Map();
const MAX_BODY = 9000;

function credentials() {
  const encoded = String(process.env.GOOGLE_SERVICE_ACCOUNT_JSON_B64 || "");
  if (!encoded) throw Object.assign(new Error("Existing Sheets service account is not configured"), {status:503});
  try {
    const data = JSON.parse(Buffer.from(encoded, "base64").toString("utf8"));
    if (!data.client_email || !data.private_key) throw Error("incomplete credentials");
    return data;
  } catch (_) {
    throw Object.assign(new Error("Existing Sheets service account is invalid"), {status:503});
  }
}
function sheetId() {
  const id=String(process.env.STUDENTS_SHEET_ID||"").trim();
  if(!id || !/^[\w-]{20,}$/.test(id)) throw Object.assign(new Error("Existing student spreadsheet is unavailable"),{status:503});
  return id;
}
function jwtToken(creds) {
  const now=Math.floor(Date.now()/1000);
  const b64=(x)=>Buffer.from(JSON.stringify(x)).toString("base64url");
  const value=b64({alg:"RS256",typ:"JWT"})+"."+b64({iss:creds.client_email,scope:"https://www.googleapis.com/auth/spreadsheets",aud:"https://oauth2.googleapis.com/token",iat:now,exp:now+3500});
  return value+"."+crypto.sign("RSA-SHA256",Buffer.from(value),creds.private_key).toString("base64url");
}
async function googleToken() {
  if(cache.token && Date.now()<cache.expires) return cache.token;
  const response=await fetch("https://oauth2.googleapis.com/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({grant_type:"urn:ietf:params:oauth:grant-type:jwt-bearer",assertion:jwtToken(credentials())})});
  const data=await response.json().catch(()=>({}));
  if(!response.ok || !data.access_token) throw Object.assign(new Error("Could not authorize existing Sheets service account"),{status:503});
  cache.token=data.access_token;cache.expires=Date.now()+Math.max(60,(Number(data.expires_in)||3600)-180)*1000;
  return cache.token;
}
async function sheetApi(path,{method="GET",body}={}) {
  const response=await fetch("https://sheets.googleapis.com/v4/spreadsheets/"+sheetId()+path,{
    method,headers:{Authorization:"Bearer "+await googleToken(),"Content-Type":"application/json"},
    ...(body?{body:JSON.stringify(body)}:{})
  });
  const data=await response.json().catch(()=>({}));
  if(!response.ok) {
    // Never leak sheet data, IDs, OAuth details or service-account material.
    throw Object.assign(new Error(response.status===404?"PlacementAttempts sheet has not been provisioned":"Could not access private placement records"),{status:503});
  }
  return data;
}
function seal(value) {
  // Existing service-account key already has secret entropy; no extra paid secrets manager.
  // Keep the original service-account key to read historical records after a key rotation.
  const key=crypto.createHash("sha256").update("falowen-placement-record-v1\n"+credentials().private_key).digest();
  const iv=crypto.randomBytes(12),cipher=crypto.createCipheriv("aes-256-gcm",key,iv);
  const encrypted=Buffer.concat([cipher.update(JSON.stringify(value),"utf8"),cipher.final()]);
  return "v1."+iv.toString("base64url")+"."+cipher.getAuthTag().toString("base64url")+"."+encrypted.toString("base64url");
}
function unseal(value) {
  const pieces=String(value||"").split(".");
  if(pieces[0]!=="v1"||pieces.length!==4) throw Error("Unknown encrypted record");
  const key=crypto.createHash("sha256").update("falowen-placement-record-v1\n"+credentials().private_key).digest();
  const dec=crypto.createDecipheriv("aes-256-gcm",key,Buffer.from(pieces[1],"base64url"));
  dec.setAuthTag(Buffer.from(pieces[2],"base64url"));
  return JSON.parse(Buffer.concat([dec.update(Buffer.from(pieces[3],"base64url")),dec.final()]).toString("utf8"));
}
function grade(indices) {
  if(!Array.isArray(indices)||indices.length!==30||indices.some(v=>v!==null&&(!Number.isInteger(v)||v<0||v>3))) {
    throw Object.assign(new Error("Expected one choice or null for each of the 30 questions"),{status:400});
  }
  const a1=ANSWERS.slice(0,10).filter((a,i)=>indices[i]===a).length;
  const a2=ANSWERS.slice(10,20).filter((a,i)=>indices[i+10]===a).length;
  const b1=ANSWERS.slice(20,30).filter((a,i)=>indices[i+20]===a).length;
  return {a1,a2,b1,total:a1+a2+b1,answered:indices.filter(v=>v!==null).length,level:a1<7||a2<7?"A1":b1>=7?"B1":"A2"};
}
function validId(value){return /^pt_[a-zA-Z0-9-]{12,90}$/.test(String(value||""));}
function validEmail(value){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value||"").trim());}
function normaliseContact(body) {
  const name=String(body.name||"").trim().slice(0,120);
  const email=String(body.email||"").trim().toLowerCase().slice(0,180);
  const phone=String(body.phone||"").trim().slice(0,35);
  if(name.length<2 || (!validEmail(email) && !/^\+?[0-9 ()-]{9,25}$/.test(phone)) || body.consent!==true)
    throw Object.assign(new Error("Provide your name, email or phone, and contact consent"),{status:400});
  return {name,email,phone};
}
function staffToken(req){return String(req.headers.authorization||"").match(/^Bearer\s+(\S+)$/i)?.[1]||"";}
async function verifyStaff(req) {
  const token=staffToken(req),apiKey=String(process.env.FIREBASE_API_KEY||process.env.REACT_APP_FIREBASE_API_KEY||"");
  if(!token) throw Object.assign(new Error("Staff authentication required"),{status:401});
  if(!apiKey) throw Object.assign(new Error("Firebase verification unavailable"),{status:503});
  const response=await fetch("https://identitytoolkit.googleapis.com/v1/accounts:lookup?key="+encodeURIComponent(apiKey),
    {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({idToken:token})});
  const data=await response.json().catch(()=>({}));
  const user=data.users?.[0],email=String(user?.email||"").toLowerCase();
  if(!response.ok||!user?.localId) throw Object.assign(new Error("Invalid staff session"),{status:401});
  if(!ADMIN_EMAILS.has(email)) throw Object.assign(new Error("Admin access required"),{status:403});
  return email;
}
function rateLimit(req) {
  // Best-effort per-instance throttle; not security-grade global rate limiting.
  const ip=String(req.headers["x-forwarded-for"]||req.socket?.remoteAddress||"unknown").split(",")[0].trim().slice(0,80);
  const now=Date.now(),state=ipCounts.get(ip)||{count:0,window:now};
  if(now-state.window>10*60*1000){state.window=now;state.count=0;}
  state.count++;ipCounts.set(ip,state);
  if(ipCounts.size>1500)ipCounts.clear();
  if(state.count>90)throw Object.assign(new Error("Too many attempts; please try later"),{status:429});
}
async function readRecords() {
  // Query a bounded range; this is fetched only on staff request, never polled by the server.
  const data=await sheetApi("/values/"+encodeURIComponent("'"+SHEET_TAB+"'!A2:D5000"));
  const rows=(data.values||[]).slice(-1200);
  const byId=new Map();
  for(const row of rows) {
    try {
      const event=unseal(row[2]);if(!validId(event.id)||!["start","complete","contact","email_sent"].includes(event.type))continue;
      const previous=byId.get(event.id)||{id:event.id,status:"started",startedAt:null,completedAt:null,contactedAt:null};
      if(event.type==="start"){previous.startedAt=event.at;previous.status=previous.completedAt?"completed":"in_progress";}
      if(event.type==="complete"){previous.completedAt=event.at;previous.status="completed";previous.score=event.score||null;previous.source=event.source||"placement-test";}
      if(event.type==="contact"){previous.contactedAt=event.at;previous.name=event.contact.name;previous.email=event.contact.email;previous.phone=event.contact.phone;previous.consent=true;previous.leadId=event.id;}
      if(event.type==="email_sent"){previous.emailSentAt=event.at;}
      byId.set(event.id,previous);
    }catch(_){}
  }
  const now=Date.now();
  return Array.from(byId.values()).map(r=>({...r,
    status:r.completedAt?"completed":r.startedAt&&now-Date.parse(r.startedAt)>=20*60000?"expired": "in_progress",
  })).sort((a,b)=>String(b.completedAt||b.startedAt||"").localeCompare(String(a.completedAt||a.startedAt||""))).slice(0,300);
}
async function appendEvent(event) {
  const row=[event.id,event.at,seal(event),"1"];
  await sheetApi("/values/"+encodeURIComponent("'"+SHEET_TAB+"'!A:D")+":append?valueInputOption=RAW&insertDataOption=INSERT_ROWS",
    {method:"POST",body:{values:[row]}});
}
function cors(req,res){
  const origin=String(req.headers.origin||"");
  if(ALLOWED_ORIGINS.has(origin)||/^https:\/\/falowenexamtrainer-[a-z0-9-]+\.vercel\.app$/i.test(origin)){
    res.setHeader("Access-Control-Allow-Origin",origin);
    res.setHeader("Access-Control-Allow-Headers","Authorization, Content-Type");
    res.setHeader("Access-Control-Allow-Methods","GET, POST, OPTIONS");
  }
  res.setHeader("Vary","Origin");
  res.setHeader("Cache-Control","no-store");
  return origin;
}
async function parseBody(req) {
  if(req.body!==undefined){const obj=typeof req.body==="string"?JSON.parse(req.body):req.body;return obj||{};}
  let s="";
  for await(const ch of req){s+=ch;if(s.length>MAX_BODY)throw Object.assign(new Error("Payload too large"),{status:413});}
  return s?JSON.parse(s):{};
}
async function handler(req,res){
  const origin=cors(req,res);
  if(req.method==="OPTIONS")return res.status(204).end();
  try{
    if(req.method==="GET"){
      await verifyStaff(req);
      return res.status(200).json({ok:true,attempts:await readRecords(),checkedAt:new Date().toISOString(),source:"private_encrypted_google_sheet"});
    }
    if(req.method!=="POST")return res.status(405).json({ok:false,error:"Method not allowed"});
    if(!origin || (!ALLOWED_ORIGINS.has(origin)&&!/^https:\/\/falowenexamtrainer-[a-z0-9-]+\.vercel\.app$/i.test(origin)))
      throw Object.assign(new Error("Untrusted request origin"),{status:403});
    rateLimit(req);
    const body=await parseBody(req);
    if(body.website)throw Object.assign(new Error("Request rejected"),{status:400}); // honeypot
    if(!validId(body.id)||!["start","complete","contact"].includes(body.action))
      throw Object.assign(new Error("Invalid placement attempt"),{status:400});
    const event={id:body.id,type:body.action,at:new Date().toISOString()};
    if(body.action==="complete"){
      event.score=grade(body.answers);
      event.source="placement-test";
    }
    if(body.action==="contact"){
      event.contact=normaliseContact(body);
      // Never email a guessed attempt ID or ungraded result. A score must
      // exist on the server, not just in the learner's browser.
      const record=(await readRecords()).find(x=>x.id===body.id);
      if(!record?.completedAt||!record.score)
        throw Object.assign(new Error("Your result is still saving. Please wait a moment and try again."),{status:409});
      if(record.emailSentAt) {
        if(record.email && event.contact.email!==record.email)
          throw Object.assign(new Error("Your result was already emailed. Contact Falowen to change the address."),{status:409});
        return res.status(200).json({ok:true,id:event.id,emailStatus:"already_sent"});
      }
      await appendEvent(event);
      if(!event.contact.email) return res.status(200).json({ok:true,id:event.id,emailStatus:"no_email"});
      const sent=await sendPlacementResultEmail({id:event.id,contact:event.contact,score:record.score});
      if(sent.status==="sent"){
        // The Apps Script also uses a per-attempt delivery key, so retries
        // cannot result in another email when a Sheet append briefly fails.
        try{await appendEvent({id:event.id,type:"email_sent",at:new Date().toISOString()});}
        catch(error){console.error("placement_mail_receipt_error",String(error?.message||"unknown"));}
      }
      return res.status(200).json({ok:true,id:event.id,emailStatus:sent.status});
    }
    await appendEvent(event);
    return res.status(200).json({ok:true,id:event.id,...(event.score?{score:event.score}:{})});
  }catch(error){
    if(error?.name==="SyntaxError")return res.status(400).json({ok:false,error:"Invalid JSON"});
    const status=Number(error?.status)||500;
    if(status>=500)console.error("placement_attempts_error",String(error?.message||"unknown"));
    return res.status(status).json({ok:false,error:status>=500?"Placement record service temporarily unavailable":String(error.message)});
  }
}
module.exports=handler;
module.exports.grade=grade;
module.exports.validId=validId;
module.exports.normaliseContact=normaliseContact;
module.exports.seal=seal;
module.exports.unseal=unseal;
