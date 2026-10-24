"use strict";

// Read-only on-demand speaking ACTIVITY and usage monitoring.
// No learner speech/audio, transcribed words, conversations or feedback leave
// this endpoint. No polling, AI API requests, or new Firestore writes.
const COURSE_KEYS = ["A1-5.9", "A2-8.22", "B1-7.23"];
const LEVELS = new Set(["A1","A2","B1","B2"]);
const MAX_RESULTS = 30;
const MAX_RECENT = 40;
const clean = v => String(v || "").trim();
const stamp = v => typeof v?.toDate === "function" ? v.toDate().toISOString()
  : typeof v === "string" && !Number.isNaN(Date.parse(v)) ? v : "";
const isStaff = who => Boolean(who && (who.admin === true || who.staff === true ||
  ["admin","staff","tutor"].includes(who.role) || who.email === "moxflex@gmail.com"));
const isActive = r => !r.endedAt && Boolean(r.expiresAt) &&
  Date.parse(r.expiresAt) > Date.now();
const levelFilter = raw => clean(raw).toUpperCase();
const statusRow = snap => {
  const r=snap.data()||{};
  if(!LEVELS.has(r.level) || r.source !== "exam-speaking-practice") return null;
  return {
    id:snap.id,level:r.level,teil:clean(r.teil || r.task?.teil).slice(0,60),
    assignmentKey:clean(r.task?.courseAssignmentKey).slice(0,45),
    source:r.task?.courseAssignmentKey ? "course_book" : "exams_room",
    completed:r.completed === true,createdAt:stamp(r.createdAt),
    // Counts / statuses only. The document can contain actual words, but
    // they must never be returned to Admin activity monitoring.
    answeredCount:Array.isArray(r.answers)?r.answers.length:0,
    scoreRecorded:Boolean(r.assessment),
  };
};
const sessionRow = snap => {
  const r=snap.data()||{};
  if(!LEVELS.has(r.level) || !r.uid) return null;
  return {
    uid:r.uid,level:r.level,source:r.examTask?.courseAssignmentKey ? "course_book"
      : r.source === "exam-speaking-practice" ? "exams_room" : "other_practice",
    assignmentKey:clean(r.examTask?.courseAssignmentKey).slice(0,45),
    startedAt:stamp(r.startedAt),ended:!isActive(r),
    turnsUsed:Math.max(0,Number(r.turnsUsed)||0),
    answeredTurns:Math.max(0,Number(r.answeredTurns)||0),
    status:isActive(r)?"active":"ended_or_expired",
  };
};
async function resolveStudent({admin,findStudentByCodeOrEmail,input}) {
  const value=clean(input);
  const email=value.includes("@")?value.toLowerCase():"";
  let record=await findStudentByCodeOrEmail({
    email,studentCode:email?"":value,uid:email?"":value,
  });
  if(!record && !email) {
    const db=admin.firestore();
    const matches=new Map();
    // All three supported name fields must be inspected BEFORE selecting a
    // student. A match in 'name' and a different match in 'fullName' is 409.
    for(const field of ["name","fullName","studentName"]){
      const snap=await db.collection("students").where(field,"==",value).limit(2).get();
      for(const doc of snap.docs) matches.set(doc.id,{snap:doc,ref:doc.ref});
    }
    if(matches.size>1){
      const e=new Error("More than one student has this name. Search by login email or UID.");
      e.status=409;throw e;
    }
    record=matches.values().next().value||null;
  }
  const row=record?.snap?.data?.()||{};
  let uid=clean(row.uid||row.authUid||row.firebaseUid||row.firebaseAuthUid||row.studentUID);
  const associatedEmail=clean(row.email||email).toLowerCase();
  if(!uid && associatedEmail)try{uid=(await admin.auth().getUserByEmail(associatedEmail)).uid;}catch{}
  const docId=clean(record?.ref?.id);
  if(!uid && /^[A-Za-z0-9_-]{20,128}$/.test(docId))uid=docId;
  if(!uid && !email && /^[A-Za-z0-9_-]{20,128}$/.test(value))uid=value;
  if(!uid){const e=new Error("Student UID not found. Search by registered login email or Firebase UID.");e.status=404;throw e;}
  return {uid,name:clean(row.name||row.fullName||row.studentName).slice(0,120),
    email:clean(row.email||email).slice(0,150)};
}
async function readRecent(db,level){
  // The sort happens at Firestore BEFORE the limit. No text/audio returned.
  let query=db.collection("liveSpeakSessions");
  if(LEVELS.has(level))query=query.where("level","==",level);
  const snap=await query.orderBy("startedAt","desc").limit(MAX_RECENT).get();
  const rows=(snap.docs||[]).map(sessionRow).filter(Boolean);
  const uids=[...new Set(rows.map(x=>x.uid))];
  const users=new Map();
  // A few bounded batched reads instead of fetching each student separately.
  for(let i=0;i<uids.length;i+=10){
    const group=uids.slice(i,i+10);
    const profiles=await db.collection("students").where("uid","in",group).limit(group.length).get();
    for(const p of profiles.docs) {
      const r=p.data()||{};
      users.set(r.uid,{name:clean(r.name||r.fullName||r.studentName).slice(0,100),
        email:clean(r.email).slice(0,150)});
    }
  }
  return {rows:rows.map(r=>({...r,student:users.get(r.uid)||{name:"Student",email:""}})),
    limited:snap.size>=MAX_RECENT};
}
function registerStaffSpeakingReviewRoutes(app,{admin,getAuthedUser,findStudentByCodeOrEmail}){
  const authorized=async(req,res)=>{
    const who=await getAuthedUser(req);
    if(!who){res.status(401).json({ok:false,error:"Staff sign-in required."});return false;}
    if(!isStaff(who)){res.status(403).json({ok:false,error:"Staff access required."});return false;}
    return true;
  };
  const noCache=res=>{res.set("Cache-Control","private, no-store, max-age=0");res.set("Vary","Authorization");};
  app.get("/internal/speaking-activity",async(req,res)=>{
    noCache(res);
    if(!(await authorized(req,res)))return;
    const level=levelFilter(req.query?.level);
    if(!["","ALL",...LEVELS].includes(level))return res.status(400).json({ok:false,error:"Choose A1–B2 or all levels."});
    try{
      const db=admin.firestore();
      const [{rows,limited},globalUsage]=await Promise.all([
        readRecent(db,level),
        db.collection("liveSpeakUsage").doc(new Date().toISOString().slice(0,7)).get(),
      ]);
      return res.json({ok:true,rows,limited,checkedAt:new Date().toISOString(),
        month:new Date().toISOString().slice(0,7),
        globalReservedAiUnits:Math.max(0,Number(globalUsage.data()?.turns)||0),
        exactStudentCostAvailable:false,
        note:"Recent practice only; no background updates. Counts are speaking turns and global reserved AI units, not verified currency costs."});
    }catch(error){
      console.error("Speaking activity unavailable:",error?.code||error?.message);
      return res.status(503).json({ok:false,error:"Unable to read recent speaking activity. No student work was changed."});
    }
  });
  app.get("/internal/speaking-review",async(req,res)=>{
    noCache(res);
    if(!(await authorized(req,res)))return;
    const input=clean(req.query?.student), level=levelFilter(req.query?.level);
    if(input.length<3||input.length>150||!["","ALL",...LEVELS].includes(level))
      return res.status(400).json({ok:false,error:"Provide a student and optional A1–B2 level."});
    try{
      const student=await resolveStudent({admin,findStudentByCodeOrEmail,input});
      const db=admin.firestore();
      // Level predicate + chronological order are applied before limit.
      // Composite indexes must be deployed with the API.
      let query=db.collection("liveSpeakExamResults").where("uid","==",student.uid);
      if(LEVELS.has(level))query=query.where("level","==",level);
      const snapshots=await query.orderBy("createdAt","desc").limit(MAX_RESULTS).get();
      const results=(snapshots.docs||[]).map(statusRow).filter(Boolean);
      const course=await Promise.all(COURSE_KEYS
        .filter(k=>!LEVELS.has(level)||k.startsWith(level+"-"))
        .map(async assignmentKey=>{
          const id=`course-speaking-mock-${student.uid}-${assignmentKey}`;
          const [attemptSnap,scoreSnap]=await Promise.all([
            db.collection("courseSpeakingMockAttempts").doc(id).get(),
            db.collection("scores").doc(id).get(),
          ]);
          if(!attemptSnap.exists&&!scoreSnap.exists)return null;
          const attempt=attemptSnap.data()||{},score=scoreSnap.data()||{};
          return {assignmentKey,status:scoreSnap.exists&&score.source==="course_speaking_mock"
            ?"completed":"in_progress", savedPartCount:results.filter(x=>x.assignmentKey===assignmentKey).length,
            finalScoreRecorded:scoreSnap.exists};
        }));
      const sessions=await Promise.all(["",...COURSE_KEYS].filter(k=>!LEVELS.has(level)||!k||k.startsWith(level+"-"))
        .map(async key=>{
          const id=key ? `${student.uid}__course__${key}` : student.uid;
          const snap=await db.collection("liveSpeakSessions").doc(id).get();
          return snap.exists?sessionRow(snap):null;
        }));
      return res.json({ok:true,student,results,course:course.filter(Boolean),
        sessions:sessions.filter(Boolean),limited:snapshots.size>=MAX_RESULTS,
        exactStudentCostAvailable:false,checkedAt:new Date().toISOString(),
        note:"Activity and usage only. No audio, transcripts, dialogues, or monetary per-student costs are stored or returned by this review."});
    }catch(error){
      if(error.status)return res.status(error.status).json({ok:false,error:error.message});
      console.error("Speaking review lookup failed:",error?.code||error?.message);
      return res.status(503).json({ok:false,error:"Speaking usage review could not be loaded. Saved student work was not changed."});
    }
  });
}
module.exports={registerStaffSpeakingReviewRoutes,resolveStudent,statusRow,sessionRow,readRecent,isStaff};
