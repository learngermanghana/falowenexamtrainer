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
const normalize = (snap) => {
  const r=snap.data() || {};
  if (!LEVELS.has(r.level) || r.source !== "exam-speaking-practice") return null;
  return {
    id:snap.id, uid:r.uid, sessionId:r.sessionId || snap.id,
    level:r.level,teil:text(r.teil || r.task?.teil,80),
    assignmentKey:text(r.task?.courseAssignmentKey,45),
    mockAttemptId:text(r.mockAttemptId,90),
    taskTitle:text(r.task?.topicPrompt || r.task?.prompt || r.task?.text || r.task?.id,220),
    source:r.task?.courseAssignmentKey ? "course_book" : "exams_room",
    completed:r.completed === true,
    createdAt:timestamp(r.createdAt),
    answers:Array.isArray(r.answers) ? r.answers.slice(0,16).map(x=>text(x,1500)) : [],
    dialogue:Array.isArray(r.dialogue) ? r.dialogue.slice(-20).map(row=>({
      role:row.role === "user" ? "student" : "examiner",
      text:text(row.text,1000),
    })) : [],
    score:Number.isFinite(Number(r.assessment?.percent)) ? Number(r.assessment.percent) : null,
    feedback:text(r.feedback,2000),
    // Important: these are real confirmed student words, NOT playable voice files.
    audioAvailable:false,
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
    for(const field of ["name","fullName","studentName"]){
      const match=await db.collection("students").where(field,"==",value).limit(2).get();
      if(match.docs.length>1) {
        const e=new Error("More than one student has this name. Search by login email or UID.");
        e.status=409;throw e;
      }
      if(match.docs.length===1){record={snap:match.docs[0],ref:match.docs[0].ref};break;}
    }
  }
  const row=record?.snap?.data?.() || {};
  let uid=clean(row.uid || row.authUid || row.firebaseUid || row.firebaseAuthUid);
  if (!uid && value.includes("@")) {
    try { uid=(await admin.auth().getUserByEmail(value.toLowerCase())).uid; }
    catch { /* Missing Auth account is not evidence of completed practice. */ }
  }
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
    if(input.length<3||input.length>150||!["","ALL",...LEVELS].includes(level)){
      return res.status(400).json({ok:false,error:"Provide a student email, exact full name, student code or UID, and optional A1–B2 level."});
    }
    try{
      const student=await resolveStudent({admin,findStudentByCodeOrEmail,input});
      const db=admin.firestore();
      // This query occurs ONLY when staff explicitly opens a student review.
      // Bounded reads and no background subscriptions, timers, or AI costs.
      const snapshots=await db.collection("liveSpeakExamResults")
        .where("uid","==",student.uid).limit(60).get();
      const results=(snapshots.docs||[]).map(normalize).filter(Boolean)
        .filter(row=>!level||level==="ALL"||row.level===level)
        .sort((a,b)=>Date.parse(b.createdAt||0)-Date.parse(a.createdAt||0))
        .slice(0,30);
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
        limited:snapshots.size>=60,checkedAt:new Date().toISOString(),
        note:"Read-only confirmed Live AI examiner transcripts and scored snapshots. Original microphone recordings were not retained; this page cannot replay them. Other legacy speaking modes may use separate records."});
    }catch(error){
      if(error.status)return res.status(error.status).json({ok:false,error:error.message});
      console.error("Staff speaking review lookup failed:",error?.code||error?.message);
      return res.status(503).json({ok:false,error:"Speaking review could not be loaded. Saved student work was not changed."});
    }
  });
}
module.exports={registerStaffSpeakingReviewRoutes,normalize,resolveStudent,isStaff};
