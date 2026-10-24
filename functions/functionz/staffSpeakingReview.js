"use strict";

// Read-only, request-scoped staff inspection of *previously saved* A1-B2
// Live AI examiner transcripts. No recording upload, model calls or polling.
// The microphone recording itself is not retained by Live Speak today.
const COURSE_KEYS = ["A1-5.9", "A2-8.22", "B1-7.23"];
const LEVELS = new Set(["A1", "A2", "B1", "B2"]);
const clean = value => String(value || "").trim();
const timestamp = value => {
  if (typeof value?.toDate === "function") return value.toDate().toISOString();
  if (typeof value === "string" && !Number.isNaN(Date.parse(value))) return value;
  return "";
};
const isStaff = identity => Boolean(identity && (
  identity.admin === true || identity.role === "admin" ||
  identity.role === "tutor" || identity.email === "moxflex@gmail.com"
));
const text = (value, size=4000) => clean(value).slice(0,size);
const safeCount=value=>Math.max(0,Math.min(100000,Number(value)||0));
const normalize = snap => {
  const r=snap.data() || {};
  if (!LEVELS.has(r.level) || r.source !== "exam-speaking-practice") return null;
  return {
    id:snap.id, sessionId:r.sessionId || snap.id, level:r.level,
    teil:text(r.teil || r.task?.teil,80),
    assignmentKey:text(r.task?.courseAssignmentKey,45),
    mockAttemptId:text(r.mockAttemptId,90),
    source:r.task?.courseAssignmentKey ? "course_book" : "exams_room",
    completed:r.completed === true, createdAt:timestamp(r.createdAt),
    score:Number.isFinite(Number(r.assessment?.percent)) ? Number(r.assessment.percent) : null,
    answeredQuestions:Array.isArray(r.answers) ? r.answers.length : 0,
    // Current provider cost is not recorded per student. Never infer USD from
    // a transcript, unpriced audio size or number of practice sessions.
    costUsd:null,
  };
};
const normalizeActivity = (snap, now=Date.now()) => {
  const r=snap.data() || {};
  if (!LEVELS.has(r.level) || r.source !== "exam-speaking-practice") return null;
  const expires=Date.parse(timestamp(r.expiresAt)||r.expiresAt||"");
  const open=!r.endedAt && Number.isFinite(expires) && expires>now;
  return {
    uid:text(r.uid,130),level:r.level,
    source:r.examTask?.courseAssignmentKey?"course_book":"exams_room",
    assignmentKey:text(r.examTask?.courseAssignmentKey,45),
    startedAt:timestamp(r.startedAt),
    state:open?(r.inFlight?"processing":"session_open"):"ended",
    answeredQuestions:safeCount(r.answeredTurns),
    practiceTurns:safeCount(r.turnsUsed),
    recordedBytes:safeCount(r.audioBytesUsed),
    costUsd:null,
  };
};
async function resolveStudent({ admin, findStudentByCodeOrEmail, input }) {
  const value=clean(input);
  let record=await findStudentByCodeOrEmail({
    email:value.includes("@")?value.toLowerCase():"",
    studentCode:!value.includes("@")?value:"",
    uid:!value.includes("@")?value:"",
  });
  if (!record && !value.includes("@")) {
    const db=admin.firestore();
    // Exact-name lookup only, no large collection scans. Ambiguous names
    // require a UID or email so staff never view the wrong student's work.
    const matches=new Map();
    for(const field of ["name","fullName","studentName"]){
      const snapshot=await db.collection("students").where(field,"==",value).limit(2).get();
      for(const doc of snapshot.docs||[])matches.set(doc.id,doc);
    }
    if(matches.size>1){
      const e=new Error("More than one student has this name. Search by login email or UID.");
      e.status=409;throw e;
    }
    if(matches.size===1){
      const snap=[...matches.values()][0];
      record={snap,ref:snap.ref};
    }
  }
  const row=record?.snap?.data?.() || {};
  let uid=clean(row.uid || row.authUid || row.firebaseUid || row.firebaseAuthUid || row.studentUID);
  const associatedEmail=clean(row.email || (value.includes("@") ? value.toLowerCase() : "")).toLowerCase();
  if (!uid && associatedEmail) {
    try { uid=(await admin.auth().getUserByEmail(associatedEmail)).uid; }
    catch { /* An unlinked account is not evidence of recorded practice. */ }
  }
  const docId=clean(record?.ref?.id);
  if (!uid && /^[A-Za-z0-9_-]{20,128}$/.test(docId)) uid=docId;
  if (!uid && !value.includes("@") && /^[A-Za-z0-9_-]{20,128}$/.test(value)) uid=value;
  if (!uid) {
    const e=new Error("Student UID not found. Search using the registered login email or Firebase UID.");
    e.status=404;throw e;
  }
  return {
    uid,name:text(row.name || row.fullName || row.studentName,120),
    email:text(row.email || (value.includes("@") ? value.toLowerCase() : ""),150),
  };
}
function registerStaffSpeakingReviewRoutes(app,{admin,getAuthedUser,findStudentByCodeOrEmail}){
  app.get("/internal/speaking-review",async(req,res)=>{
    res.set("Cache-Control","private, no-store, max-age=0");
    res.set("Vary","Authorization");
    const identity=await getAuthedUser(req);
    if(!identity)return res.status(401).json({ok:false,error:"Staff sign-in required."});
    if(!isStaff(identity))return res.status(403).json({ok:false,error:"Staff access required."});
    const input=clean(req.query?.student);
    const level=clean(req.query?.level).toUpperCase();
    const overview=clean(req.query?.view)==="activity";
    if((!overview&&(input.length<3||input.length>150))||!["","ALL",...LEVELS].includes(level)){
      return res.status(400).json({ok:false,error:"Select activity overview or provide an exact student email, code or UID, and optional A1–B2 level."});
    }
    try{
      if(overview){
        // One bounded snapshot when staff presses Refresh. No subscriptions,
        // background polling, microphone recordings, or model/API calls.
        const db=admin.firestore();
        const snaps=await db.collection("liveSpeakSessions").orderBy("startedAt","desc").limit(80).get();
        const activity=(snaps.docs||[]).map(snap=>normalizeActivity(snap))
          .filter(Boolean).filter(row=>!level||level==="ALL"||row.level===level)
          .slice(0,60);
        const ym=new Date().toISOString().slice(0,7);
        const usage=await db.collection("liveSpeakUsage").doc(ym).get();
        return res.json({ok:true,view:"activity",checkedAt:new Date().toISOString(),
          activity,limited:snaps.size>=80,
          usage:{month:ym,reservedAiCallUnits:safeCount(usage.data()?.turns),costUsd:null},
          note:"Activity means an examiner session is open, not confirmed live microphone use. Dollar cost per learner is not metered in the stored data. Usage counts are units, not billing totals. No audio or transcripts are returned."});
      }
      const student=await resolveStudent({admin,findStudentByCodeOrEmail,input});
      const db=admin.firestore();
      // This query occurs ONLY when staff explicitly opens a student review.
      // Bounded reads and no background subscriptions, timers, or AI costs.
      let query=db.collection("liveSpeakExamResults")
        .where("uid","==",student.uid)
        .where("source","==","exam-speaking-practice");
      if(level&&level!=="ALL")query=query.where("level","==",level);
      const snapshots=await query.orderBy("createdAt","desc").limit(30).get();
      const results=(snapshots.docs||[]).map(normalize).filter(Boolean);
      const course=await Promise.all(COURSE_KEYS
        .filter(k=>!level||level==="ALL"||k.startsWith(level+"-"))
        .map(async assignmentKey=>{
          const id=`course-speaking-mock-${student.uid}-${assignmentKey}`;
          const [attemptSnap,scoreSnap]=await Promise.all([
            db.collection("courseSpeakingMockAttempts").doc(id).get(),
            db.collection("scores").doc(id).get(),
          ]);
          const attempt=attemptSnap.data()||{};
          const saved=scoreSnap.data()||{};
          if(!attemptSnap.exists&&!scoreSnap.exists)return null;
          return {assignmentKey,attemptId:text(attempt.attemptId || saved.mockAttemptId,90),
            status:scoreSnap.exists&&saved.source==="course_speaking_mock"?"completed": "in_progress",
            score:scoreSnap.exists&&Number.isFinite(Number(saved.score))?Number(saved.score):null,
            sectionScores:saved.sectionScores || null,
            // Verified snapshots are separate from final score; do not infer a
            // complete exam merely because a student has an active attempt.
            savedPartCount:results.filter(r=>r.assignmentKey===assignmentKey&&
              r.mockAttemptId===(attempt.attemptId||saved.mockAttemptId)).length,
          };
        }));
      return res.json({ok:true,student,results,course:course.filter(Boolean),
        limited:snapshots.size>=30,checkedAt:new Date().toISOString(),
        note:"Read-only speaking result metadata. No microphone recordings, transcripts or answers are returned. USD cost is not available in existing records."});
    }catch(error){
      if(error.status)return res.status(error.status).json({ok:false,error:error.message});
      console.error("Staff speaking review lookup failed:",error?.code||error?.message);
      return res.status(503).json({ok:false,error:"Speaking review could not be loaded. Saved student work was not changed."});
    }
  });
}
module.exports={registerStaffSpeakingReviewRoutes,normalize,normalizeActivity,resolveStudent,isStaff};
