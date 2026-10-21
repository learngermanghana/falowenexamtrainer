"use strict";

// Immutable examiner results are evidence for either A2 mock.
// Reject scores that do not belong to this student, mock and attempt.
const expectedTaskId = (part, mockId) => `${mockId}-speaking-teil-${part}`;

const scoreA2ExaminerSnapshots = async ({db, uid, attemptId, sessionIds, mockId = "a2-mock-01"}) => {
  if (!["a2-mock-01", "a2-mock-02"].includes(mockId)) throw new Error("Unsupported A2 mock.");
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
        receipt?.task?.id !== expectedTaskId(String(i+1), mockId) ||
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
 * One-time, authenticated migration of Mock 2 examiner receipts created by
 * the old frontend, which sent an empty mockAttemptId. No model requests or
 * fabricated grades. Only real pre-upgrade immutable receipts can be claimed,
 * exactly once, by the owning learner's new server attempt.
 */
const bindLegacyMock2ExaminerReceipts = async ({db,admin,uid,attemptId,sessionIds}) => {
  if (!Array.isArray(sessionIds) || sessionIds.length !== 3 || sessionIds.some(id => !id) ||
      new Set(sessionIds).size !== 3) return false;
  const cutoff = Date.parse("2026-10-22T00:00:00Z");
  const attemptRef=db.collection("a2MockExamUsers").doc(uid).collection("attempts").doc(attemptId);
  await db.runTransaction(async tx => {
    const attempt=(await tx.get(attemptRef)).data();
    if (attempt?.uid !== uid || attempt?.mockId !== "a2-mock-02") {
      throw Object.assign(new Error("Mock 2 attempt ownership could not be verified."),{status:409,code:"A2_MOCK_ATTEMPT_MISMATCH"});
    }
    const started=attempt.startedAt?.toMillis?.() || 0;
    const refs=sessionIds.map(id=>db.collection("liveSpeakExamResults").doc(id));
    const snapshots=await Promise.all(refs.map(ref=>tx.get(ref)));
    for(let i=0;i<3;i++) {
      const receipt=snapshots[i].data();
      if (receipt?.mockAttemptId===attemptId) continue;
      const created=receipt?.createdAt?.toMillis?.() || 0;
      const teil=String(receipt?.teil || receipt?.task?.teil || "").match(/\d+/)?.[0];
      if (receipt?.mockAttemptId || !created || created >= cutoff ||
          (started && created >= started) || receipt?.uid !== uid ||
          receipt?.sessionId !== sessionIds[i] || receipt?.level !== "A2" ||
          receipt?.task?.id !== expectedTaskId(String(i+1),"a2-mock-02") ||
          teil !== String(i+1) || receipt?.source !== "exam-speaking-practice" ||
          receipt?.completed !== true || !Number.isFinite(Number(receipt?.assessment?.score)) ||
          !(Number(receipt?.assessment?.maxScore)>0)) {
        throw Object.assign(new Error("Earlier speaking receipt cannot be securely linked to this mock. Your work was not overwritten."),
          {status:409,code:"A2_MOCK_LEGACY_RECEIPT_NOT_VERIFIED"});
      }
      tx.update(refs[i],{mockAttemptId:attemptId,legacyMock2BoundAt:admin.firestore.FieldValue.serverTimestamp()});
    }
  });
  return true;
};

module.exports={scoreA2ExaminerSnapshots,bindLegacyMock2ExaminerReceipts};
