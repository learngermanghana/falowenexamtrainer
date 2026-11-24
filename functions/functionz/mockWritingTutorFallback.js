"use strict";
const { createHash } = require("node:crypto");
const { buildVerifiedA2MockScore, buildA2MockCompletionArtifacts } = require("./a2MockCompletionSync");
const { writingAuditRecord } = require("./mockWritingAudit");
const QUEUE = "mockWritingTutorQueue";
const MOCK = "a2-mock-01";
const queueId = (uid, attemptId) => createHash("sha256").update(JSON.stringify([uid, attemptId])).digest("hex");
const conflict = message => Object.assign(new Error(message), { status: 409 });
const attemptRefFor = (db, uid, attemptId) => db.collection("a2MockExamUsers").doc(uid).collection("attempts").doc(attemptId);
const validId = value => typeof value === "string" && value.length > 0 && value.length <= 128 && !value.includes("/");
function validateAttempt(data, uid) {
  if (!data || data.uid !== uid || data.mockId !== MOCK) throw conflict("This attempt is not an eligible A2 Mock 1.");
}
async function enqueueA2Writing({ db, admin, uid, attemptId, answers, reason = "MOCK_MARKING_UNAVAILABLE", recover = false }) {
  if (!validId(uid) || !validId(attemptId)) throw conflict("Valid attempt required.");
  const id = queueId(uid, attemptId);
  const attemptRef = attemptRefFor(db, uid, attemptId);
  const ref = db.collection(QUEUE).doc(id);
  return db.runTransaction(async tx => {
    const [snap, existing] = await Promise.all([tx.get(attemptRef), tx.get(ref)]);
    const data = snap.exists ? snap.data() : null;
    validateAttempt(data, uid);
    if (data.status === "completed" || data.verifiedSections?.schreiben?.verified) return false;
    if (existing.exists) return existing.data().status === "pending";
    if (recover && (!data.state?.writingPending || data.state?.stage !== "result")) throw conflict("The saved exam must be finished with writing pending.");
    const submitted = recover ? { sms: data.state?.schreibenSms, email: data.state?.schreibenEmail } : answers;
    if (typeof submitted?.sms !== "string" || typeof submitted?.email !== "string" || (!submitted.sms.trim() && !submitted.email.trim())) throw conflict("No saved writing answers were found.");
    const now = admin.firestore.FieldValue.serverTimestamp();
    tx.set(ref, { uid, attemptId, level:"A2", mockId:MOCK, studentEmail:String(data.email || ""), status:"pending", reason,
      answers:{sms:submitted.sms.slice(0,4000), email:submitted.email.slice(0,6000)}, createdAt:now });
    tx.update(attemptRef, { writingTutorReview:{id,status:"pending"}, updatedAt:now });
    return true;
  });
}
function validateTutorGrade({ smsScore, emailScore, feedback }) {
  if (typeof smsScore !== "number" || !Number.isFinite(smsScore) || smsScore < 0 || smsScore > 10 ||
      typeof emailScore !== "number" || !Number.isFinite(emailScore) || emailScore < 0 || emailScore > 15 ||
      typeof feedback !== "string" || !feedback.trim() || feedback.length > 8000) throw Object.assign(new Error("Enter SMS /10, email /15 and tutor feedback."),{status:400});
  return { score:Number((smsScore+emailScore).toFixed(1)),maxScore:25,parts:{teil1:{score:smsScore,maxScore:10},teil2:{score:emailScore,maxScore:15}},overall_feedback_en:feedback.trim(),source:"tutor" };
}
async function publishA2TutorGrade({db,admin,id,identity,grade,findStudentProfile}) {
  if (!/^[a-f0-9]{64}$/.test(id)) throw Object.assign(new Error("Invalid review identifier."),{status:400});
  const result = validateTutorGrade(grade);
  const ref = db.collection(QUEUE).doc(id);
  const initial = await ref.get();
  if (!initial.exists) throw conflict("Review not found.");
  const row = initial.data();
  const user = {uid:row.uid,email:row.studentEmail};
  const profile = await findStudentProfile(db,user);
  return db.runTransaction(async tx => {
    const attemptRef = attemptRefFor(db,row.uid,row.attemptId);
    const userRef = db.collection("a2MockExamUsers").doc(row.uid);
    const [reviewSnap, attemptSnap, userSnap] = await Promise.all([tx.get(ref),tx.get(attemptRef),tx.get(userRef)]);
    const review = reviewSnap.data();
    if (review?.status === "published") return {alreadyPublished:true};
    if (review?.status !== "pending" || review.uid !== row.uid || review.attemptId !== row.attemptId) throw conflict("Review is no longer pending.");
    const data = attemptSnap.data();
    validateAttempt(data,row.uid);
    if (data.status === "completed" || data.verifiedSections?.schreiben?.verified) throw conflict("This attempt already has a verified writing mark.");
    if (data.state?.stage !== "result" || data.state?.completed !== true) throw conflict("The learner must finish the remaining modules before publishing.");
    const now = admin.firestore.FieldValue.serverTimestamp();
    const verifiedSections = {...data.verifiedSections,schreiben:{verified:true,score:result.score,maxScore:25,source:"tutor",gradedAt:now,reviewedByUid:identity.uid}};
    const verified = buildVerifiedA2MockScore({state:data.state,verifiedSections,mockId:MOCK});
    const artifacts = buildA2MockCompletionArtifacts({authedUser:user,studentProfile:profile,attemptId:row.attemptId,attemptNumber:data.attemptNumber,firstAttempt:data.firstAttempt,overall:verified.overall,sectionScores:verified.sectionScores,mockId:MOCK});
    tx.update(attemptRef,{verifiedSections,verifiedSectionScores:verified.sectionScores,verifiedOverall:verified.overall,objectiveVerification:verified.objective,
      sectionScores:verified.sectionScores,overall:verified.overall,status:"completed",section:"result",completedAt:now,updatedAt:now,
      state:{...data.state,schreibenSms:review.answers.sms,schreibenEmail:review.answers.email,writingPending:false,writingTutorQueued:false,schreibenResult:result,sectionScores:verified.sectionScores,overall:verified.overall,completed:true},
      writingTutorReview:{id,status:"published"},writingReview:writingAuditRecord({level:"A2",attemptId:row.attemptId,answers:review.answers,result,source:"tutor"}),
      completionSync:{ok:true,scoreDocId:artifacts.scoreDocId,notificationId:artifacts.notificationId,syncedAt:now}});
    const userData=userSnap.data()||{};
    tx.set(userRef,{lastCompletedAttemptId:row.attemptId,lastCompletedScore:verified.overall.score,lastCompletedPassed:verified.overall.passed,updatedAt:now,
      ...(userData.activeAttemptId===row.attemptId?{activeAttemptId:null}:{})},{merge:true});
    tx.set(db.collection("scores").doc(artifacts.scoreDocId),{...artifacts.scoreDocument,feedback:result.overall_feedback_en,writingMarkingSource:"tutor",updatedAt:now,createdAt:now},{merge:true});
    const notification={...artifacts.notificationDocument,updatedAt:now,createdAt:now};
    tx.set(db.collection("studentNotifications").doc(artifacts.notificationId),notification,{merge:true});
    if(artifacts.identity.studentDocId) tx.set(db.collection("students").doc(artifacts.identity.studentDocId).collection("notifications").doc(artifacts.notificationId),notification,{merge:true});
    tx.update(ref,{status:"published",reviewedByUid:identity.uid,reviewedAt:now,result});
    return {published:true,score:verified.overall.score};
  });
}
module.exports={QUEUE,MOCK,queueId,enqueueA2Writing,validateTutorGrade,publishA2TutorGrade};
