"use strict";
const {TOPICS,PARTNER_PRESENTATION,PLAN_POINTS,speakingTasks,verifyReceipt,gradeParts}=require("./b1Mock3Speaking");

// Private B1 Mock 3 Sprechen practice. Never publish a mock-wide /100 grade.
module.exports=function registerB1Mock3SpeakingRoutes(app,{admin,requireAccess}){
  const released=()=>process.env.B1_MOCK3_SPEAKING_RELEASED==="true";
  const deny=(res)=>res.status(404).json({error:"B1 Mock 3 Sprechen is not published yet."});
  const fail=(res,err,message)=>res.status(err?.status||503).json({error:err?.message||message});
  const person=(db,uid)=>db.collection("b1Mock3SpeakingUsers").doc(uid);
  const attemptRef=(db,uid,id)=>person(db,uid).collection("attempts").doc(id);
  const noCache=res=>res.set("Cache-Control","private, no-store");

  app.get("/b1-mock-03/sprechen/config",async(req,res)=>{
    if(!released())return deny(res);
    try {
      const access=await requireAccess(req,res);
      if(!access)return;
      noCache(res);
      res.json({mockId:"b1-mock-03",level:"B1",practiceOnly:true,topics:TOPICS,
        planPoints:PLAN_POINTS,partnerPresentation:PARTNER_PRESENTATION});
    } catch(err){return fail(res,err,"Could not load the B1 speaking tasks.") }
  });

  app.post("/b1-mock-03/sprechen/start",async(req,res)=>{
    if(!released())return deny(res);
    try {
      const access=await requireAccess(req,res);
      if(!access)return;
      const choice=String(req.body?.topicChoice||"a");
      if(!Object.prototype.hasOwnProperty.call(TOPICS,choice))
        return res.status(400).json({error:"Choose a valid presentation topic."});
      const uid=access.authedUser.uid;
      const userRef=person(access.db,uid);
      let attempt;
      await access.db.runTransaction(async tx=>{
        const parent=await tx.get(userRef);
        const activeId=String(parent.data()?.activeAttemptId||"");
        const oldRef=activeId?attemptRef(access.db,uid,activeId):null;
        const oldSnap=oldRef?await tx.get(oldRef):null;
        const old=oldSnap?.data()||{};
        if(oldSnap?.exists&&old.uid===uid&&old.mockId==="b1-mock-03"&&old.status==="in_progress"){
          if(old.topicChoice!==choice&&Object.keys(old.parts||{}).length)
            throw Object.assign(new Error("This saved attempt already uses a different presentation topic."),{status:409});
          if(old.topicChoice!==choice)tx.update(oldRef,{topicChoice:choice,
            updatedAt:admin.firestore.FieldValue.serverTimestamp()});
          attempt={...old,attemptId:activeId,topicChoice:choice};
          return;
        }
        const fresh=userRef.collection("attempts").doc();
        const data={uid,mockId:"b1-mock-03",status:"in_progress",topicChoice:choice,
          parts:{},practiceOnly:true,deadlineMs:Date.now()+15*60*1000,
          createdAt:admin.firestore.FieldValue.serverTimestamp(),
          updatedAt:admin.firestore.FieldValue.serverTimestamp()};
        tx.set(fresh,data);
        tx.set(userRef,{uid,activeAttemptId:fresh.id,
          updatedAt:admin.firestore.FieldValue.serverTimestamp()},{merge:true});
        attempt={...data,attemptId:fresh.id};
      });
      noCache(res);
      return res.json({attemptId:attempt.attemptId,topicChoice:attempt.topicChoice,
        deadlineMs:attempt.deadlineMs,parts:attempt.parts||{},
        tasks:speakingTasks(attempt.topicChoice),practiceOnly:true});
    } catch(err){return fail(res,err,"Could not create or resume the B1 Mock 3 speaking attempt.") }
  });

  app.post("/b1-mock-03/sprechen/part",async(req,res)=>{
    if(!released())return deny(res);
    try {
      const access=await requireAccess(req,res);
      if(!access)return;
      const uid=access.authedUser.uid;
      const attemptId=String(req.body?.attemptId||"").trim().slice(0,120);
      const teil=String(req.body?.teil||"").trim();
      const sessionId=String(req.body?.sessionId||"").trim().slice(0,120);
      if(!attemptId||!/^[123]$/.test(teil)||sessionId.length<8)
        return res.status(400).json({error:"Valid attempt, Teil and AI examiner session ID are required."});
      const ref=attemptRef(access.db,uid,attemptId);
      const receiptRef=access.db.collection("liveSpeakExamResults").doc(sessionId);
      await access.db.runTransaction(async tx=>{
        const [attemptSnap,receiptSnap]=await Promise.all([tx.get(ref),tx.get(receiptRef)]);
        const attempt=attemptSnap.data()||{};
        if(!attemptSnap.exists||attempt.uid!==uid||attempt.mockId!=="b1-mock-03"||
           attempt.status!=="in_progress")
          throw Object.assign(new Error("This speaking attempt is not active."),{status:403});
        const previous=attempt.parts?.[teil];
        if(previous?.sessionId&&previous.sessionId!==sessionId)
          throw Object.assign(new Error("Another saved examiner session already belongs to this Teil."),{status:409});
        const verified=verifyReceipt(receiptSnap.data(),{
          uid,attemptId,teil,choice:attempt.topicChoice,sessionId});
        // Nested Firestore merge keeps completed Teils 1 and 2 intact.
        tx.set(ref,{parts:{[teil]:verified},
          updatedAt:admin.firestore.FieldValue.serverTimestamp()},{merge:true});
      });
      noCache(res);
      return res.json({saved:true,teil,sessionId});
    } catch(err){return fail(res,err,"Could not save this examiner part; retry without recording again.") }
  });

  app.post("/b1-mock-03/sprechen/score",async(req,res)=>{
    if(!released())return deny(res);
    try {
      const access=await requireAccess(req,res);
      if(!access)return;
      const uid=access.authedUser.uid;
      const attemptId=String(req.body?.attemptId||"").trim().slice(0,120);
      const ids=req.body?.sessionIds;
      if(!attemptId||!Array.isArray(ids)||ids.length!==3||
        ids.some(id=>id!==null&&(typeof id!=="string"||id.length<8||id.length>120)))
        return res.status(400).json({error:"Three examiner session IDs or explicit null values are required."});
      if(new Set(ids.filter(Boolean)).size!==ids.filter(Boolean).length)
        return res.status(400).json({error:"A speaking session cannot be counted twice."});
      const ref=attemptRef(access.db,uid,attemptId);
      let result;
      await access.db.runTransaction(async tx=>{
        const snap=await tx.get(ref);
        const attempt=snap.data()||{};
        if(!snap.exists||attempt.uid!==uid||attempt.mockId!=="b1-mock-03")
          throw Object.assign(new Error("B1 Mock 3 speaking attempt ownership could not be verified."),{status:403});
        if(attempt.status==="completed"){result=attempt.result;return}
        if(attempt.status!=="in_progress")
          throw Object.assign(new Error("This speaking attempt is closed."),{status:409});
        const snaps=await Promise.all(ids.map(id=>id
          ?tx.get(access.db.collection("liveSpeakExamResults").doc(id)):Promise.resolve(null)));
        const verified=ids.map((id,i)=>id?verifyReceipt(snaps[i]?.data(),{
          uid,attemptId,teil:String(i+1),choice:attempt.topicChoice,sessionId:id}):null);
        result=gradeParts(verified,{expired:Date.now()>=Number(attempt.deadlineMs)});
        tx.set(ref,{status:"completed",result,sessionIds:ids,
          updatedAt:admin.firestore.FieldValue.serverTimestamp()},{merge:true});
      });
      noCache(res);
      return res.json({saved:true,verified:true,result});
    } catch(err){return fail(res,err,"The B1 speaking result was not verified; your recordings remain saved.") }
  });
};
