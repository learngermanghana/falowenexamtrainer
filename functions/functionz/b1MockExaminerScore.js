"use strict";

// Shared A2-style verification: grade B1 mock Sprechen from immutable
// LiveSpeak examiner receipts, never from browser-provided marks or transcripts.
const PART_MAX = Object.freeze([9,10,6]);
const rejected = (message,code="B1_MOCK_EXAMINER_RESULT_NOT_VERIFIED",status=409) =>
  Object.assign(new Error(message),{code,status});

async function scoreB1ExaminerSnapshots({
  db,uid,attemptId,sessionIds,mockId="b1-mock-02"
}={}) {
  if (!["b1-mock-01","b1-mock-02"].includes(mockId)) throw rejected("Unsupported B1 mock.","B1_MOCK_ID_INVALID",400);
  if (!uid || !String(attemptId || "").trim()) throw rejected("B1 mock attempt identity is required.","B1_MOCK_ATTEMPT_ID_REQUIRED",400);
  if (!Array.isArray(sessionIds) || sessionIds.length!==3 ||
      sessionIds.some(id=>id!==null && (typeof id!=="string" || id.length<8 || id.length>100))) {
    throw rejected("Supply exactly three examiner session IDs or null for unanswered parts.","B1_MOCK_EXAMINER_SESSIONS_INVALID",400);
  }
  const nonempty=sessionIds.filter(Boolean);
  if(new Set(nonempty).size!==nonempty.length) throw rejected("The same examiner session cannot count twice.","B1_MOCK_EXAMINER_SESSION_DUPLICATE",400);
  const attemptSnap=await db.collection("b1MockExamUsers").doc(uid).collection("attempts").doc(attemptId).get();
  const attempt=attemptSnap.data() || {};
  if(!attemptSnap.exists || attempt.mockId!==mockId || attempt.uid!==uid) {
    throw rejected("B1 speaking attempt does not belong to this student and mock.","B1_MOCK_ATTEMPT_MISMATCH",403);
  }
  const receipts=await Promise.all(sessionIds.map(id=>
    id ? db.collection("liveSpeakExamResults").doc(id).get() : Promise.resolve(null)));
  const parts={},scores=[];
  for(let i=0;i<3;i++){
    const key=`teil${i+1}`,id=sessionIds[i],weight=PART_MAX[i];
    if(!id){
      parts[key]={score:0,maxScore:weight,feedback_en:"No confirmed examiner response before the deadline."};
      scores.push(0);continue;
    }
    const receipt=receipts[i]?.data();
    const raw=Number(receipt?.assessment?.score),max=Number(receipt?.assessment?.maxScore);
    const teil=String(receipt?.teil || receipt?.task?.teil || "").match(/\d+/)?.[0];
    const prompt=String(receipt?.task?.prompt || "");
    // Mock 02 must assess its actual teacher-supplied tasks, not generic B1
    // practice with a spoofed mock ID. Topic A and B are both valid in Teil 2.
    const promptMatches=mockId!=="b1-mock-02" || (
      i===0 ? prompt.includes("Frau Keller") && prompt.includes("Firmenjubiläum") :
      i===1 ? /Bio-Produkte|Verreisen: Lieber alleine/.test(prompt) :
      /Feedback/.test(prompt) && /Präsentation/.test(prompt)
    );
    if(!receipts[i]?.exists || receipt?.uid!==uid || receipt?.sessionId!==id ||
       receipt?.mockAttemptId!==attemptId ||
       receipt?.task?.id!==`${mockId}-speaking-teil-${i+1}` ||
       receipt?.level!=="B1" || teil!==String(i+1) ||
       receipt?.source!=="exam-speaking-practice" || receipt?.completed!==true ||
       !promptMatches || !Number.isFinite(raw) || raw<0 ||
       !Number.isFinite(max) || max<=0 || raw>max) {
      throw rejected(`Teil ${i+1} has no valid saved AI examiner assessment for this B1 mock attempt.`);
    }
    const score=Number((raw/max*weight).toFixed(2));
    scores.push(score);
    parts[key]={score,maxScore:weight,feedback_en:String(receipt.feedback || receipt.assessment.summary || "").slice(0,1800)};
  }
  const score=Number(scores.reduce((n,v)=>n+v,0).toFixed(1));
  return {
    score,maxScore:25,passed:score>=15,parts,
    overall_feedback_en:"AI examiner practice assessment verified from three saved German speaking parts. Not an official Goethe examination grade.",
    assessmentIdentity:`${mockId}-examiner-verified`,
  };
}
module.exports={scoreB1ExaminerSnapshots,PART_MAX};
