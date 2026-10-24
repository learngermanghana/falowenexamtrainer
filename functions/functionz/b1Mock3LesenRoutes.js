"use strict";
const {publicB1Mock3Lesen,markB1Mock3Lesen}=require("./b1Mock3Lesen");
module.exports=function registerB1Mock3LesenRoutes(app,{admin,requireAccess}){
 const released=()=>process.env.B1_MOCK3_LESEN_RELEASED==="true";
 const deny=res=>res.status(404).json({error:"B1 Mock 3 Lesen is not published yet."});
 const noCache=res=>res.set("Cache-Control","private, no-store");
 const userRef=(db,uid)=>db.collection("b1Mock3LesenUsers").doc(uid);
 app.get("/b1-mock-03/lesen/questions",async(req,res)=>{
  if(!released())return deny(res);
  try{
   const access=await requireAccess(req,res);if(!access)return;
   noCache(res);return res.json(publicB1Mock3Lesen());
  }catch(e){return res.status(503).json({error:"Could not load B1 Mock 3 reading."})}
 });
 app.post("/b1-mock-03/lesen/start",async(req,res)=>{
  if(!released())return deny(res);
  try{
   const access=await requireAccess(req,res);if(!access)return;
   const uid=access.authedUser.uid,root=userRef(access.db,uid);
   let attempt;
   await access.db.runTransaction(async tx=>{
    const us=await tx.get(root);
    const activeId=String(us.data()?.activeAttemptId||"");
    const old=activeId?root.collection("attempts").doc(activeId):null;
    const snap=old?await tx.get(old):null;
    if(snap?.exists&&snap.data()?.uid===uid&&snap.data()?.status==="in_progress"){
     attempt={...snap.data(),attemptId:activeId};return;
    }
    const doc=root.collection("attempts").doc();
    const data={uid,mockId:"b1-mock-03",status:"in_progress",practiceOnly:true,
      deadlineMs:Date.now()+65*60*1000,startedAt:admin.firestore.FieldValue.serverTimestamp()};
    tx.set(doc,data);tx.set(root,{uid,activeAttemptId:doc.id},{merge:true});
    attempt={...data,attemptId:doc.id};
   });
   noCache(res);return res.json({attemptId:attempt.attemptId,deadlineMs:attempt.deadlineMs,practiceOnly:true});
  }catch(e){return res.status(503).json({error:"Could not start B1 Mock 3 Lesen."})}
 });
 app.post("/b1-mock-03/lesen/score",async(req,res)=>{
  if(!released())return deny(res);
  try{
   const access=await requireAccess(req,res);if(!access)return;
   const uid=access.authedUser.uid,attemptId=String(req.body?.attemptId||"").trim().slice(0,120);
   const answers=req.body?.answers;
   if(!attemptId)return res.status(400).json({error:"Start your reading exam before submitting."});
   const ref=userRef(access.db,uid).collection("attempts").doc(attemptId);
   let result;
   await access.db.runTransaction(async tx=>{
    const snap=await tx.get(ref),attempt=snap.data()||{};
    if(!snap.exists||attempt.uid!==uid||attempt.mockId!=="b1-mock-03")
     throw Object.assign(new Error("Your B1 Mock 3 Lesen attempt is invalid."),{status:403});
    if(attempt.status==="completed"){result=attempt.result;return}
    if(attempt.status!=="in_progress")throw Object.assign(new Error("This reading attempt is closed."),{status:409});
    result=markB1Mock3Lesen(answers,{allowPartial:Date.now()>=Number(attempt.deadlineMs)});
    tx.set(ref,{status:"completed",answers,result,verifiedBy:"server-answer-key",
      completedAt:admin.firestore.FieldValue.serverTimestamp()},{merge:true});
   });
   noCache(res);return res.json({result,saved:true,verified:true,practiceOnly:true});
  }catch(err){
   const status=err?.status||(/Invalid|Unexpected|Answer all/.test(err?.message||"")?400:503);
   return res.status(status).json({error:err?.message||"Unable to score and save B1 Mock 3 Lesen."});
  }
 });
};
