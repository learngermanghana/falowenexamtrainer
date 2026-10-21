"use strict";

// Immutable examiner results are the grading evidence for the three-part A2
// Mock 1 conversation. Never accept scores or transcripts from the browser.
const expectedTaskId = (part,mockId="a2-mock-01") => `${mockId}-speaking-teil-${part}`;

const scoreA2ExaminerSnapshots = async ({db, uid, attemptId, sessionIds, mockId="a2-mock-01"}) => {
  const {isRegisteredA2Mock}=require("./a2MockRegistry");
  if (!isRegisteredA2Mock(mockId)) throw Object.assign(new Error("Unknown A2 mock."),{status:400});
  if (!String(attemptId || "").trim()) {
    throw Object.assign(new Error("The A2 mock attempt ID is required."), {status:400,code:"A2_MOCK_ATTEMPT_ID_REQUIRED"});
  }
  if (!Array.isArray(sessionIds) || sessionIds.length !== 3 ||
      sessionIds.some(id => id !== null && (typeof id !== "string" || id.length > 100))) {
    throw Object.assign(new Error("Supply exactly three speaking session IDs, or null for an unanswered part."), {status:400,code:"A2_MOCK_EXAMINER_SESSIONS_INVALID"});
  }
  const nonempty = sessionIds.filter(Boolean);
  if (new Set(nonempty).size !== nonempty.length) {
    throw Object.assign(new Error("A speaking session cannot count for multiple parts."), {status:400,code:"A2_MOCK_EXAMINER_SESSION_DUPLICATE"});
  }
  const receipts = await Promise.all(sessionIds.map(id =>
    id ? db.collection("liveSpeakExamResults").doc(id).get() : Promise.resolve(null),
  ));
  const parts = {};
  const scores = [];
  for (let i=0;i<3;i++) {
    const key = `teil${i+1}`;
    const receipt=receipts[i]?.data();
    if (!sessionIds[i]) {
      parts[key] = {score:0,maxScore:25/3,feedback_en:"No confirmed response before the speaking deadline."};
      scores.push(0);
      continue;
    }
    const raw=Number(receipt?.assessment?.score);
    const max=Number(receipt?.assessment?.maxScore);
    const teil=String(receipt?.teil || receipt?.task?.teil || "").match(/\d+/)?.[0];
    if (receipt?.uid !== uid || receipt?.sessionId !== sessionIds[i] ||
        receipt?.mockAttemptId !== attemptId ||
        receipt?.task?.id !== expectedTaskId(String(i+1),mockId) ||
        receipt?.level !== "A2" || teil !== String(i+1) ||
        receipt?.source !== "exam-speaking-practice" || receipt?.completed !== true ||
        !Number.isFinite(raw) || raw<0 || !Number.isFinite(max) || max<=0 || raw>max) {
      throw Object.assign(new Error(`Teil ${i+1} has no verified examiner result for this A2 mock attempt.`),
        {status:409,code:"A2_MOCK_EXAMINER_RESULT_NOT_VERIFIED"});
    }
    const scaled=Number((raw/max*25/3).toFixed(3));
    scores.push(scaled);
    parts[key]={score:scaled,maxScore:25/3,feedback_en:String(receipt.feedback || receipt.assessment.summary || "").slice(0,1800)};
  }
  const score=Number(scores.reduce((sum,value)=>sum+value,0).toFixed(2));
  return {
    score,maxScore:25,passed:score>=15,parts,
    overall_feedback_en:"Falowen AI examiner result: three verified speaking parts. This is practice marking, not an official Goethe grade.",
    assessmentIdentity:`${mockId}-examiner-verified`,
  };
};


/**
 * One-time migration for Mock 2 examiner sessions created before the server
 * attempt binding was introduced. Receipts are server-owned, must belong to
 * the authenticated user and exact Mock 2 task, and are atomically claimed.
 * Never trust browser-supplied scores. A claimed session cannot be reused.
 */
async function claimLegacyA2Mock2ExaminerSessions({db,uid,attemptId,sessionIds}) {
  if (!attemptId || !uid || !Array.isArray(sessionIds) || sessionIds.length !== 3 ||
      sessionIds.some(id=>typeof id!=="string" || !id || id.length>100) ||
      new Set(sessionIds).size !== 3) {
    throw Object.assign(new Error("Three saved examiner sessions are required for secure recovery."),
      {status:400,code:"A2_MOCK_LEGACY_RECEIPTS_INVALID"});
  }
  if (!db || typeof db.runTransaction!=="function") {
    throw Object.assign(new Error("Secure speaking recovery is unavailable."),
      {status:503,code:"A2_MOCK_RECOVERY_UNAVAILABLE"});
  }
  const attemptRef=db.collection("a2MockExamUsers").doc(uid).collection("attempts").doc(attemptId);
  const refs=sessionIds.map(id=>db.collection("liveSpeakExamResults").doc(id));
  await db.runTransaction(async tx=>{
    const [attemptSnap,...receipts]=await Promise.all([
      tx.get(attemptRef),...refs.map(ref=>tx.get(ref)),
    ]);
    const attempt=attemptSnap.data() || {};
    if (!attemptSnap.exists || attempt.mockId!=="a2-mock-02" || attempt.uid!==uid) {
      throw Object.assign(new Error("Mock 2 attempt identity was not verified."),
        {status:409,code:"A2_MOCK_ATTEMPT_MISMATCH"});
    }
    receipts.forEach((snap,index)=>{
      const record=snap.data()||{};
      const score=Number(record.assessment?.score),max=Number(record.assessment?.maxScore);
      const bound=String(record.mockAttemptId||"");
      const taskId=expectedTaskId(String(index+1),"a2-mock-02");
      if (!snap.exists || record.uid!==uid || record.sessionId!==sessionIds[index] ||
          record.task?.id!==taskId || record.level!=="A2" ||
          String(record.teil || record.task?.teil || "").match(/\d+/)?.[0]!==String(index+1) ||
          record.source!=="exam-speaking-practice" || record.completed!==true ||
          (bound && bound!==attemptId) || !Number.isFinite(score) ||
          !Number.isFinite(max) || max<=0 || score<0 || score>max) {
        throw Object.assign(new Error("A saved speaking part cannot be securely recovered."),
          {status:409,code:"A2_MOCK_EXAMINER_RESULT_NOT_VERIFIED"});
      }
    });
    receipts.forEach((snap,index)=>{
      if (!snap.data()?.mockAttemptId) tx.update(refs[index],{
        mockAttemptId:attemptId, legacyMock2ReceiptClaimed:true,
      });
    });
  });
}
module.exports={scoreA2ExaminerSnapshots,claimLegacyA2Mock2ExaminerSessions};

