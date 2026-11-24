"use strict";
const {readSwahiliAccess} = require("./swahiliAccess");

function normalizeWorkbook(input = {}) {
  const level = String(input.level || "").toUpperCase() === "BEGINNER" ? "A1" : String(input.level || "").toUpperCase();
  const day = Number(input.day);
  if (!(level === "A1" && Number.isInteger(day) && day >= 1 && day <= 20) && !(level === "B1" && [26, 27, 28].includes(day))) return null;
  const id = level === "B1" ? "b1-day-" + day : "day-" + day;
  const answers = value => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    const entries = Object.entries(value);
    if (entries.length > 80 || entries.some(([k,v]) => !/^[\w -]{1,80}$/.test(k) || ["__proto__","constructor","prototype"].includes(k) || typeof v !== "string" || v.length > 12000)) return null;
    return Object.fromEntries(entries);
  };
  const writing = answers(input.writing), readingAnswers = answers(input.readingAnswers), listeningAnswers = answers(input.listeningAnswers || {});
  if (!writing || !Object.values(writing).some(v=>v.trim()) || !readingAnswers || !listeningAnswers ||
      typeof input.title !== "string" || input.title.length > 250) return null;
  if (level === "B1" && day === 26 && (!writing.essay?.trim() || ["read-purpose","read-delays","read-documents","read-label","read-message"].some(key => !readingAnswers[key]?.trim()) || ["listen-delay","listen-repair","listen-alternative","listen-advice","listen-next"].some(key => !listeningAnswers[key]?.trim()))) return null;
  if (level === "B1" && day === 27 && (!writing.essay?.trim() || ["read-importance","read-challenges","read-waste","read-energy","read-connector"].some(key => !readingAnswers[key]?.trim()) || ["listen-plastic","listen-baskets","listen-ready","listen-bottles","listen-change"].some(key => !listeningAnswers[key]?.trim()))) return null;
  return {id, level, day, data:{program:"swahili", level: level === "A1" && day === 1 ? "beginner" : level, day,
    lessonId:"swahili-"+id, title:input.title, status:"submitted", writing, readingAnswers, listeningAnswers,
    listeningTeacherLed:false, ...(level === "A1" && day === 4 && input.readingVersion === 2 ? {readingVersion:2}: {})}};
}

function registerSwahiliSubmissionRoute(app,{admin,getAuthedUser}) {
  app.post("/swahili/workbook/submit",async(req,res)=>{
    res.set("Cache-Control","private, no-store");
    try {
      const identity=await getAuthedUser(req);
      if(!identity) return res.status(401).json({error:"Sign in again."});
      const work=normalizeWorkbook(req.body);
      if(!work) return res.status(400).json({error:"Invalid workbook submission."});
      const db=admin.firestore();
      const result=await db.runTransaction(async tx=>{
        const access=await readSwahiliAccess(db,identity.uid,work.level,tx);
        if(!access.allowed || identity.examOnly === true) return false;
        const profile=access.profile;
        const ref=db.collection("users").doc(identity.uid).collection("swahiliLessons").doc(work.id);
        tx.set(ref,{...work.data,studentId:identity.uid,userId:identity.uid,
          studentName:String(profile.name || profile.fullName || "").slice(0,150),
          studentEmail:String(identity.email || "").slice(0,254),
          submittedAt:admin.firestore.FieldValue.serverTimestamp()});
        return true;
      });
      if(!result) return res.status(403).json({error:"Active Kiswahili course access is required to submit."});
      return res.json({ok:true});
    } catch(error) {
      console.error("Swahili submission failed",error?.code || error?.name);
      return res.status(503).json({error:"Could not save your workbook. Please retry."});
    }
  });
}
module.exports={normalizeWorkbook,registerSwahiliSubmissionRoute};
